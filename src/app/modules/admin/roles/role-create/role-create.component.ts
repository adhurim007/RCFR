import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleService } from 'app/core/roles/role.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html'
})
export class RoleCreateComponent {
  roleForm = this.fb.group({
    name: ['', Validators.required]
  });

  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private roleService: RoleService) {}

  submit(): void {
    if (this.roleForm.invalid) return;

    const name = this.roleForm.value.name!;
    this.roleService.createRole(name).subscribe({
      next: () => {
        this.successMessage = 'Role created successfully';
        this.errorMessage = '';
        this.roleForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to create role';
        this.successMessage = '';
      }
    });
  }
}
