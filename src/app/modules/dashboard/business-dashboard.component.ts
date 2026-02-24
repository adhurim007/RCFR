import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardSummaryDto } from 'app/services/dashboard.service';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  standalone: false,

})
export class BusinessDashboardComponent implements OnInit {

  data: DashboardSummaryDto | null = null;
  loading = false;

  rangeLabel = '';

  // Apex chart configs
  reservationsLine: any;
  incomeBar: any;
  statusDonut: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.initCharts();
    this.load();
  }

  load(): void {
    this.loading = true;

    this.dashboardService.getBusinessDashboard().subscribe({
      next: (res) => {
        this.data = res;

        const labels = res.reservationsPerMonth.map(x => x.label);
        const reservationValues = res.reservationsPerMonth.map(x => Number(x.value));
        const incomeValues = res.incomePerMonth.map(x => Number(x.value));

        this.rangeLabel = labels.length ? `${labels[0]} - ${labels[labels.length - 1]}` : '';

        // update line
        this.reservationsLine = {
          ...this.reservationsLine,
          xaxis: { categories: labels },
          series: [{ name: 'Rezervime', data: reservationValues }]
        };

        // update bar
        this.incomeBar = {
          ...this.incomeBar,
          xaxis: { categories: labels },
          series: [{ name: 'Të ardhura (€)', data: incomeValues }]
        };

        // Donut status (për moment: e bëjmë nga cards: pending + remainder)
        // Nëse don saktë: ktheje nga API status breakdown.
        const pending = res.cards.pendingReservations ?? 0;
        const total = res.cards.totalReservations ?? 0;
        const other = Math.max(total - pending, 0);

        this.statusDonut = {
          ...this.statusDonut,
          series: [pending, other],
          labels: ['Pending', 'Tjera']
        };

        this.loading = false;
      },
      error: () => {
        this.data = null;
        this.loading = false;
      }
    });
  }

  private initCharts(): void {

    this.reservationsLine = {
      chart: { type: 'line', height: 320, toolbar: { show: false } },
      stroke: { width: 3, curve: 'smooth' },
      dataLabels: { enabled: false },
      tooltip: { shared: true, intersect: false },
      xaxis: { categories: [] },
      series: [{ name: 'Rezervime', data: [] }]
    };

    this.incomeBar = {
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
      dataLabels: { enabled: false },
      tooltip: { shared: true, intersect: false },
      xaxis: { categories: [] },
      series: [{ name: 'Të ardhura (€)', data: [] }]
    };

    this.statusDonut = {
      chart: { type: 'donut', height: 320 },
      legend: { position: 'bottom' },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: (val: number) => `${val}` } },
      labels: ['Pending', 'Tjera'],
      series: [0, 0]
    };
  }
}
