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

  selectedReservation: any = null; // ✅ KJO MUNGONTE

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
 

  loadingContract = false;

  openContract(id: number): void {
    this.loadingContract = true;

    this.reservationService.getContractReport(id).subscribe({
      next: (res) => {
        if (res?.url) {
          window.open(res.url, '_blank');
        } else {
          console.error('Contract URL not found in response', res);
        }

        this.loadingContract = false;
      },
      error: (err) => {
        console.error('Failed to generate/open contract', err);
        this.loadingContract = false;
      }
    });
  }

  loadingInvoice = false;

openInvoice(id: number): void {
  this.loadingInvoice = true;

  this.reservationService.getInvoiceReport(id).subscribe({
    next: (res) => {
      const blob = res.body;

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        console.error('Invoice PDF not found in response');
      }

      this.loadingInvoice = false;
    },
    error: (err) => {
      console.error('Failed to generate/open invoice', err);
      this.loadingInvoice = false;
    }
  });
}
 
  deleteReservation(id: number): void {
    if (!confirm('A je i sigurt që dëshiron ta fshish këtë rezervim?')) return;

    this.reservationService.delete(id).subscribe(() => {
      this.loadReservations();
    });
  }
}


