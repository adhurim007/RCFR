import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuService } from 'app/services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
})
export class MenuFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  claims: any[] = [];

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private router: Router,

    @Optional() private dialogRef: MatDialogRef<MenuFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { id?: number } | null
  ) {}

  // ---------------------------------------------------
  // INIT
  // ---------------------------------------------------
  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],                     // <-- duhet patjetër për Edit
      parentId: [null],
      title: ['', Validators.required],
      subtitle: [''],
      type: ['', Validators.required],
      icon: [''],
      link: [''],
      hasSubMenu: [false],
      active: [true],
      claim: ['', Validators.required],
      sortNumber: [0, Validators.required]
    });

    // Load claims
    this.menuService.getAllClaims().subscribe({
      next: (c) => (this.claims = c),
      error: (err) => console.error('Error loading claims', err),
    });

    // Load menu for edit
    if (this.data?.id) {
      this.isEdit = true;
      this.loadMenu(this.data.id);
    }
  }

  // ---------------------------------------------------
  // LOAD MENU FOR EDIT
  // ---------------------------------------------------
  private loadMenu(id: number): void {
    this.menuService.getMenuById(id).subscribe({
      next: (menu) => {
        this.form.patchValue(menu);      // <-- vendos të dhënat në form
      },
      error: (err) => console.error('Error loading menu', err),
    });
  }

  // ---------------------------------------------------
  // SAVE
  // ---------------------------------------------------
  save(): void {
    if (this.form.invalid) return;

    const payload = this.form.value;

    if (this.isEdit) {
      this.menuService.updateMenu(payload.id, payload).subscribe({
        next: () => this.finish(true),
        error: (err) => console.error('Update error', err)
      });
    } else {
      this.menuService.createMenu(payload).subscribe({
        next: () => this.finish(true),
        error: (err) => console.error('Create error', err)
      });
    }
  }

  // ---------------------------------------------------
  // CANCEL
  // ---------------------------------------------------
  cancel(): void {
    this.finish(false);
  }

  // ---------------------------------------------------
  // CLOSE MODAL OR NAVIGATE
  // ---------------------------------------------------
  private finish(success: boolean): void {
    if (this.dialogRef) {
      this.dialogRef.close(success);
    } else {
      this.router.navigate(['/admin/menus']);
    }
  }

  // ---------------------------------------------------
  // CLOSE BUTTON WHEN CLICKED (X or Anulo)
  // ---------------------------------------------------
  close(): void {
    this.finish(false);
  }
}
