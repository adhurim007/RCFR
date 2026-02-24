import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from 'app/core/roles/role.service';
import { RoleCreateDialogComponent } from '../roles/role-create/role-create-dialog.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  standalone: false,
})
export class RoleListComponent implements OnInit {

  roles: any[] = [];
  loading = false;

  selectedRole: any | null = null;

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;

    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading roles', err);
        this.roles = [];
        this.loading = false;
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(RoleCreateDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'created') {
        this.loadRoles();
      }
    });
  }

  openEditDialog(role?: any): void {
    if (!role) return;

    const dialogRef = this.dialog.open(RoleCreateDialogComponent, {
      data: { role }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.loadRoles();
      }
    });
  }

  deleteRole(id?: string): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this role?')) return;

    this.roleService.deleteRole(id).subscribe({
      next: () => this.loadRoles(),
      error: (err) => console.error('Error deleting role', err)
    });
  }
}