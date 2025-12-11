import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'app/services/reservations.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {

  reservations: any[] = [];
  loading = false;

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;

    this.reservationService.getByBusiness().subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: () => {
        this.reservations = [];
        this.loading = false;
      }
    });
  }

  createReservation(): void {
    this.router.navigate(['/business/reservations/create']);
  }

  editReservation(id: number): void {
    this.router.navigate(['/business/reservations/edit', id]);
  }

  deleteReservation(id: number): void {
    if (!confirm('A je i sigurt që dëshiron ta fshish këtë rezervim?')) return;

    this.reservationService.delete(id).subscribe(() => {
      this.loadReservations();
    });
  }
}
