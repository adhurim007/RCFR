import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuService } from 'app/services/menu.service';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
})
export class MenuFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  claims: string[] = [];

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    @Optional() private dialogRef: MatDialogRef<MenuFormComponent>, // ✅ Optional
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any            // ✅ Optional
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      type: ['', Validators.required],
      icon: [''],
      link: [''],
      hasSubMenu: [false],
      active: [true],
      claim: ['', Validators.required],
      sortNumber: [0, Validators.required],
    });

    if (this.data) {
      this.isEdit = true;
      this.form.patchValue(this.data);
    }

    this.menuService.getAllClaims().subscribe({
      next: (claims) => (this.claims = claims),
      error: (err) => console.error('Error loading claims', err),
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.value;

    if (this.isEdit) {
      this.menuService.updateMenu(this.data?.id, payload).subscribe(() => {
        this.closeDialog(true);
      });
    } else {
      this.menuService.createMenu(payload).subscribe(() => {
        this.closeDialog(true);
      });
    }
  }

  cancel(): void {
    this.closeDialog(false);
  }

  private closeDialog(success: boolean): void {
    // ✅ Safe close for both dialog and routed usage
    if (this.dialogRef) {
      this.dialogRef.close(success);
    }
  }
}
