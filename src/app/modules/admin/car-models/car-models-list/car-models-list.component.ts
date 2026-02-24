import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarModelsService } from 'app/services/car-models.service';
import { CarModelModalComponent } from '../car-model-modal/car-model-modal.component';
import { CarModel } from 'app/models/car-model.model';

@Component({
  selector: 'app-car-models-list',
  templateUrl: './car-models-list.component.html',
  standalone: false,
})
export class CarModelsListComponent implements OnInit {

  models: CarModel[] = [];
  loading = true;

  selectedModel: CarModel | null = null;

  constructor(
    private service: CarModelsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.service.getAll().subscribe({
      next: (res) => {
        this.models = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.models = [];
        this.loading = false;
      }
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(CarModelModalComponent, {
      width: '450px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  openEdit(model?: CarModel | null): void {
    if (!model) return;

    const dialogRef = this.dialog.open(CarModelModalComponent, {
      width: '450px',
      data: { isEdit: true, model }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  delete(id?: number): void {
    if (!id) return;
    if (!confirm("A jeni i sigurt?")) return;

    this.service.delete(id).subscribe(() => this.load());
  }
}