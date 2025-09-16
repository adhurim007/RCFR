import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'app/core/roles/role.service';

@Component({
  selector: 'app-role-create-dialog',
  templateUrl: './role-create-dialog.component.html'
})
export class RoleCreateDialogComponent {
  roleForm = this.fb.group({
    name: ['', Validators.required]
  });

  isEdit = false;
  roleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private dialogRef: MatDialogRef<RoleCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.role) {
      this.isEdit = true;
      this.roleId = data.role.id;
      this.roleForm.patchValue({ name: data.role.name });
    }
  }

  submit(): void {
    if (this.roleForm.invalid) return;

    const name = this.roleForm.value.name!;

    if (this.isEdit && this.roleId) {
      this.roleService.updateRole(this.roleId, name).subscribe({
        next: (res) => this.dialogRef.close('updated'),
        error: (err) => console.error('Failed to update role', err)
      });
    }else {
          // Create new role
          this.roleService.createRole(name).subscribe({
            next: () => this.dialogRef.close('created'),
            error: (err) => console.error('Failed to create role', err)
          });
        }
      }
    }
