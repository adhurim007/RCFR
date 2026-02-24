import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CarPricingRule } from 'app/models/car-pricing-rule.model';
import { CarPricingRuleService } from 'app/services/car-pricing-rule.service';
import { PricingRuleModalComponent } from './pricing-rule-modal.component';

@Component({
  selector: 'app-car-pricing-rules',
  templateUrl: './car-pricing-rules.component.html',
  styleUrls: ['./car-pricing-rules.component.scss'],
  standalone: false,
})
export class CarPricingRulesComponent implements OnInit {

  carId!: number;
  rules: CarPricingRule[] = [];
  isLoading = false;

  selectedRule: CarPricingRule | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private service: CarPricingRuleService
  ) {}

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.isLoading = true;

    this.service.getAll().subscribe({
      next: res => {
        this.rules = res ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.rules = [];
        this.isLoading = false;
      }
    });
  }

  backToCars(): void {
    this.router.navigate(['/business/cars']);
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(PricingRuleModalComponent, {
      width: '600px',
      data: { carId: this.carId }
    });

    dialogRef.afterClosed().subscribe(changed => {
      if (changed) this.loadRules();
    });
  }

  openEditModal(rule?: CarPricingRule | null): void {
    if (!rule?.id) return;

    this.service.getById(rule.id).subscribe(fullRule => {
      this.dialog.open(PricingRuleModalComponent, {
        width: '520px',
        data: { rule: fullRule }
      })
      .afterClosed()
      .subscribe(result => {
        if (result) this.loadRules();
      });
    });
  }

  deleteRule(rule?: CarPricingRule | null): void {
    if (!rule?.id) return;
    if (!confirm('Delete this pricing rule?')) return;

    this.service.delete(rule.id).subscribe(() => {
      this.loadRules();
    });
  }

  displayDate(value?: string | null): string {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
  }
}