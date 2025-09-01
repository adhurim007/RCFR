import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
})
export class MenuFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      route: ['', Validators.required],
      icon: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      // later: load menu by id from API
      this.form.patchValue({
        title: 'Cars',
        route: '/cars',
        icon: 'heroicons_outline:truck',
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    if (this.isEdit) {
      console.log('Update menu:', this.form.value);
    } else {
      console.log('Create menu:', this.form.value);
    }
    this.router.navigate(['/admin/menus']);
  }
}
