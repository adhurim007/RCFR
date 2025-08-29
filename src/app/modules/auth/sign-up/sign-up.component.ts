import { NgIf, NgForOf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { LocationService } from 'app/core/locations/location.service'; 
@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgForOf, 
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,   // ✅ Add this
    MatOptionModule    // ✅ Add this
  ],
})

export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
    signUpForm: UntypedFormGroup;
    showAlert = false;

    states: any[] = [];
    cities: any[] = [];

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _locationService: LocationService   // ✅ use this, not AuthService
    ) {}

    ngOnInit(): void {
        this.signUpForm = this._formBuilder.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            companyName: ['', Validators.required],
            contactPhone: [''],
            stateId: ['', Validators.required],
            cityId: ['', Validators.required],
            agreements: ['', Validators.requiredTrue],
        });

        // ✅ Load states on init
        this._locationService.getStates().subscribe(states => {
            this.states = states;
        });
    }

    onStateChange(stateId: number): void {
        this._locationService.getCities(stateId).subscribe(cities => {
            this.cities = cities;
            this.signUpForm.get('cityId')?.reset();
        });
    }

        signUp(): void {
        if (this.signUpForm.invalid) return;

        console.log("Submitting form", this.signUpForm.value);  // 👈 add this

        this._authService.signUpBusiness(this.signUpForm.value).subscribe({
            next: () => this._router.navigateByUrl('/confirmation-required'),
            error: (err) => {
            console.error('Register error:', err);  // 👈 log backend errors
            this.signUpForm.enable();
            this.signUpNgForm.resetForm();
            this.alert = { type: 'error', message: 'Something went wrong, please try again.' };
            this.showAlert = true;
            }
        });
        }


}

