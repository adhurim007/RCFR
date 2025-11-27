import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CarPricingRule } from 'app/models/car-pricing-rule.model';
import { CarPricingRuleService } from 'app/services/car-pricing-rule.service';
import { PricingRuleModalComponent } from './pricing-rule-modal.component';

@Component({
  selector: 'app-car-pricing-rules',
  templateUrl: './car-pricing-rules.component.html',
  styleUrls: ['./car-pricing-rules.component.scss']
})
export class CarPricingRulesComponent implements OnInit {

  carId!: number;
  rules: CarPricingRule[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = [
    'ruleType',
    'pricePerDay',
    'fromDate',
    'toDate',
    'daysOfWeek',
    'description',
    'actions'
  ];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private service: CarPricingRuleService
  ) {}

  ngOnInit(): void {
      this.loadRules();
  }

loadRules() {
    this.service.getAll().subscribe(res => {
        this.rules = res;
        this.dataSource = new MatTableDataSource(res);
    });
}

  backToCars(): void {
    this.router.navigate(['/admin/cars']);
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(PricingRuleModalComponent, {
      width: '600px',
      data: {
        carId: this.carId
      }
    });

    dialogRef.afterClosed().subscribe(changed => {
      if (changed) {
        this.loadRules();
      }
    });
  }

    openEditModal(row: any) {

    this.service.getById(row.id).subscribe(rule => {

        this.dialog.open(PricingRuleModalComponent, {
          width: '520px',
          data: { rule }
        })
        .afterClosed().subscribe(result => {
          if (result) this.loadRules();
        });

    });

  }

  deleteRule(rule: CarPricingRule): void {
    if (!confirm('Delete this pricing rule?')) {
      return;
    }

    this.service.delete(rule.id).subscribe(() => {
      this.loadRules();
    });
  }

  displayDate(value?: string | null): string {
    if (!value) {
      return '-';
    }
    return new Date(value).toLocaleDateString();
  }
}
