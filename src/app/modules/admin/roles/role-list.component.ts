import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from 'app/core/roles/role.service';
import { RoleCreateDialogComponent } from '../roles/role-create/role-create-dialog.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
})
export class RoleListComponent implements OnInit {
  roles: any[] = [];
  displayedColumns: string[] = ['name', 'actions'];

  constructor(private roleService: RoleService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error loading roles', err),
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

    openEditDialog(role: any): void {
    const dialogRef = this.dialog.open(RoleCreateDialogComponent, {
      data: { role }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.loadRoles();
      }
    });
  }


  deleteRole(id: string): void {
    this.roleService.deleteRole(id).subscribe({
      next: (res) => {
        console.log(res.message); // ✅ "Role deleted successfully"
        this.loadRoles();
      },
      error: (err) => {
        console.error('Error deleting role', err);
      }
    });
  } 
}
