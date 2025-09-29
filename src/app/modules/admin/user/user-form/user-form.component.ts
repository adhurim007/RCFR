import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { LocationService } from 'app/core/locations/location.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  roles: any[] = [];
  states: any[] = [];   // ✅ declare states
  cities: any[] = [];   // ✅ declare cities

  isBusinessAdmin = false;
  isEdit = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private locationService: LocationService,  // ✅ inject LocationService
    private router: Router
  ) {}

  ngOnInit(): void {
    // Build form
  this.userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],   // ✅ changed (was phone)
    role: ['', Validators.required],

    // Business fields
    businessName: [''],   // ✅ changed (was companyName)
    contactPhone: [''],
    address: [''],
    stateId: [null],
    cityId: [null],

    // Only for create
    password: [''],
    confirmPassword: ['']
  });


    // Load roles
    this.userService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });

    // Load states
    this.locationService.getStates().subscribe((states) => {
      this.states = states;
    });

    // If edit mode
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEdit = true;
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.userForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.roles && user.roles.length ? user.roles[0] : '',

          businessName: user.businessName || '',
          contactPhone: user.contactPhone || '',
          address: user.address || '',
          stateId: user.stateId || null,
          cityId: user.cityId || null
        });

        if (user.stateId) {
          this.loadCities(user.stateId);
        }
      });
    }

    // Watch role changes
    this.userForm.get('role')?.valueChanges.subscribe((val) => {
      this.isBusinessAdmin = val === 'BusinessAdmin';
    });

    // Watch state changes
    this.userForm.get('stateId')?.valueChanges.subscribe((stateId) => {
      if (stateId) {
        this.loadCities(stateId);
      } else {
        this.cities = [];
        this.userForm.get('cityId')?.reset();
      }
    });
  }

  // ✅ Load cities when state changes
  loadCities(stateId: number): void {
    this.locationService.getCities(stateId).subscribe((cities) => {
      this.cities = cities;
    });
  }

  submit(): void {
    if (this.userForm.invalid) return;

    const payload = { ...this.userForm.value };

    if (payload.password !== payload.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.isBusinessAdmin) {
      payload.companyName = null;
      payload.contactPhone = null;
      payload.address = null;
      payload.stateId = null;
      payload.cityId = null;
    }

    if (this.isEdit && this.userId) {
      this.userService.updateUser(this.userId, payload).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    } else {
      this.userService.createUser(payload).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    }
  }
}
