import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  isEdit = false;
  userId: string | null = null;
  roles: string[] = [];
  loading = false;

  userForm = this.fb.group({
    fullName: ['', Validators.required],
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required], // only for create
    role: ['', Validators.required],

    // Business fields
    companyName: [''],
    taxId: [''],
    contactPhone: [''],
    address: [''],
    cityId: [null],
    stateId: [null]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.userId;

    this.userService.getRoles().subscribe((roles) => (this.roles = roles));

    if (this.isEdit && this.userId) {
      this.loading = true;
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.userForm.patchValue(user);
        this.loading = false;
      });
    }
  }

  submit(): void {
    if (this.userForm.invalid) return;

    const data = this.userForm.value;

    if (this.isEdit && this.userId) {
      this.userService.updateUser(this.userId, data).subscribe({
        next: () => this.router.navigate(['/admin/users']),
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.userService.createUser(data).subscribe({
        next: () => this.router.navigate(['/admin/users']),
        error: (err) => console.error('Create failed', err)
      });
    }
  }
}
