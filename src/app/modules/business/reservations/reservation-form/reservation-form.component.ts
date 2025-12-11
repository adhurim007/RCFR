// src/app/modules/business/reservations/reservation-form/reservation-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'app/services/reservations.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html'
})
export class ReservationFormComponent implements OnInit {

  form!: FormGroup;

  // dropdown data
  cars: any[] = [];
  locations: any[] = [];
  extras: any[] = [];

  // edit / create
  isEdit = false;
  reservationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ReservationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.buildForm();

    // edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    this.reservationId = idParam ? Number(idParam) : null;
    this.isEdit = !!this.reservationId;

    // load base data (të gjitha kanë biznes-filter brenda service)
    this.loadExtras();
    this.loadCars();
    this.loadLocations();

    if (this.isEdit && this.reservationId) {
      this.loadReservation(this.reservationId);
    }

    this.listenChanges();
  }

  // ================= FORM =================
  buildForm(): void {
    this.form = this.fb.group({
      // klienti
      personalNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      email: [''],

      // rezervimi
      carId: [null, Validators.required],
      pickupLocationId: [null, Validators.required],
      dropoffLocationId: [null, Validators.required],
      pickupDate: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      discount: [0],

      // totals (readonly)
      totalDays: [{ value: 0, disabled: true }],
      carTotal: [{ value: 0, disabled: true }],
      extrasTotal: [{ value: 0, disabled: true }],
      totalWithoutDiscount: [{ value: 0, disabled: true }],
      totalPrice: [{ value: 0, disabled: true }],

      notes: [''],

      // extras
      extraServices: this.fb.array([])
    });
  }

  // ================= GETTERS =================
  get extraServices(): FormArray {
    return this.form.get('extraServices') as FormArray;
  }

  // ================= LOAD DATA =================
  loadCars(): void {
    this.service.getCars().subscribe(res => {
      this.cars = res;
    });
  }

  loadLocations(): void {
    this.service.getLocations().subscribe(res => {
      this.locations = res;
    });
  }

  loadExtras(): void {
    this.service.getExtraServices().subscribe(res => {
      this.extras = res;

      res.forEach((x: any) => {
        this.extraServices.push(
          this.fb.group({
            id: [x.id],
            name: [x.name],
            pricePerDay: [x.price],
            selected: [false],
            quantity: [{ value: 1, disabled: true }]
          })
        );
      });
    });
  }

  loadReservation(id: number): void {
    this.service.getById(id).subscribe(res => {
      this.form.patchValue({
        personalNumber: res.personalNumber,
        firstName: res.firstName,
        lastName: res.lastName,
        phoneNumber: res.phoneNumber,
        address: res.address,
        email: res.email,
        carId: res.carId,
        pickupLocationId: res.pickupLocationId,
        dropoffLocationId: res.dropoffLocationId,
        pickupDate: res.pickupDate,
        dropoffDate: res.dropoffDate,
        discount: res.discount,
        notes: res.notes
      });

      if (res.extraServices?.length) {
        res.extraServices.forEach((e: any) => {
          const fg: any = this.extraServices.controls.find(
            c => c.get('id')?.value === e.extraServiceId
          );
          if (fg) {
            fg.get('selected')?.setValue(true, { emitEvent: false });
            fg.get('quantity')?.enable({ emitEvent: false });
            fg.get('quantity')?.setValue(e.quantity, { emitEvent: false });
          }
        });
      }

      this.updateTotals();
    });
  }

  // ================= CLIENT SEARCH =================
  searchCustomer(): void {
    const personalNumber = this.form.get('personalNumber')?.value;
    if (!personalNumber) return;

    this.service.searchCustomer(personalNumber).subscribe(customer => {
      if (!customer) return;

      const parts = (customer.fullName || '').split(' ');
      this.form.patchValue({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        phoneNumber: customer.phoneNumber,
        address: customer.address
      });
    });
  }

  // ================= EXTRAS =================
  onExtraToggle(index: number): void {
    const fg = this.extraServices.at(index) as any;
    const selected = fg.get('selected')?.value;
    const qty = fg.get('quantity');

    if (!qty) return;

    if (selected) {
      qty.enable({ emitEvent: false });
    } else {
      qty.disable({ emitEvent: false });
      qty.setValue(1, { emitEvent: false });
    }

    this.updateTotals();
  }

  // ================= ACTIONS =================
  cancel(): void {
    this.router.navigate(['/business/reservations']);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    const extraServices = this.extraServices.controls
      .filter(fg => fg.get('selected')?.value)
      .map(fg => ({
        extraServiceId: fg.get('id')?.value,
        quantity: fg.get('quantity')?.value
      }));

    const payload = {
      ...v,
      extraServices
    };

    if (this.isEdit && this.reservationId) {
      this.service.update(this.reservationId, payload).subscribe(() =>
        this.router.navigate(['/business/reservations'])
      );
    } else {
      this.service.create(payload).subscribe(() =>
        this.router.navigate(['/business/reservations'])
      );
    }
  }

  // ================= CALC =================
  listenChanges(): void {
    this.form.valueChanges.subscribe(() => this.updateTotals());
    this.extraServices.valueChanges.subscribe(() => this.updateTotals());
  }

  private updateTotals(): void {
    const pickup = this.form.get('pickupDate')?.value;
    const dropoff = this.form.get('dropoffDate')?.value;
    const carId = this.form.get('carId')?.value;
    const discount = Number(this.form.get('discount')?.value || 0);

    let days = 0;
    if (pickup && dropoff) {
      days = Math.max(
        Math.ceil(
          (new Date(dropoff).getTime() - new Date(pickup).getTime()) /
          (1000 * 60 * 60 * 24)
        ),
        1
      );
    }

    const car = this.cars.find(c => c.id === carId);
    const dailyPrice = Number(car?.dailyPrice || 0);
    const carTotal = days * dailyPrice;

    const extrasTotal = this.extraServices.controls.reduce((sum, fg: any) => {
      if (!fg.get('selected')?.value) return sum;
      return sum + (fg.get('quantity').value * fg.get('pricePerDay').value * days);
    }, 0);

    this.form.patchValue({
      totalDays: days,
      carTotal,
      extrasTotal,
      totalWithoutDiscount: carTotal + extrasTotal,
      totalPrice: Math.max(carTotal + extrasTotal - discount, 0)
    }, { emitEvent: false });
  }
}
