import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-date-time-dialog',
  template: `
    <h2 mat-dialog-title>Zgjidh datën dhe orën</h2>

    <mat-dialog-content class="space-y-6">

      <!-- DATE -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Data</mat-label>
        <input
          matInput
          [matDatepicker]="picker"
          [(ngModel)]="date"
        >
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <!-- TIME -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Ora</mat-label>
        <input
          matInput
          type="time"
          [(ngModel)]="time"
        >
      </mat-form-field>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Anulo</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="!date || !time"
        (click)="confirm()"
      >
        OK
      </button>
    </mat-dialog-actions>
  `
})
export class DateTimeDialogComponent {

  /** Selected date */
  date: Date | null = null;

  /** Selected time (HH:mm) */
  time = '10:00';

  constructor(
    private dialogRef: MatDialogRef<DateTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Date | null
  ) {
    // Edit mode → preload existing DateTime
    if (data) {
      const d = new Date(data);
      this.date = d;
      this.time = this.formatTime(d);
    }
  }

  // ================= ACTIONS =================

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (!this.date || !this.time) {
      return;
    }

    const [hours, minutes] = this.time.split(':').map(Number);

    const result = new Date(this.date);
    result.setHours(hours, minutes, 0, 0);

    this.dialogRef.close(result);
  }

  // ================= HELPERS =================

  private formatTime(date: Date): string {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
}
