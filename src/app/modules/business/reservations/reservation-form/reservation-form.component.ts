import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ReservationService } from 'app/services/reservations.service';
import { CarService } from 'app/services/car.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  reservationId!: number;

  cars: any[] = [];
  locations: any[] = [];
  extraServicesSource: any[] = [];

  selectedCarDailyPrice = 0;

  get extraServices(): FormArray {
    return this.form.get('extraServices') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private carService: CarService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // --------------------------------------------------------------------
  // INIT
  // --------------------------------------------------------------------
  ngOnInit(): void {
    this.buildForm();

    this.reservationId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = this.reservationId > 0;

    const currentUser = this.userService.getCurrent();
    if (!currentUser) return;

    this.userService.getBusinessId(currentUser.id).subscribe({
      next: (res: any) => {
        const businessId = res.businessId;

        if (this.isEdit) {
          this.loadLookupsAndReservation(businessId, this.reservationId);
        } else {
          this.loadLookupsForCreate(businessId);
          this.registerRecalc();
        }
      }
    });
  }

  // --------------------------------------------------------------------
  // BUILD FORM
  // --------------------------------------------------------------------
  buildForm(): void {
    this.form = this.fb.group({
      id: [0],
      carId: ['', Validators.required],
      personalNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      pickupLocationId: ['', Validators.required],
      dropoffLocationId: ['', Validators.required],
      pickupDate: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      notes: [''],
      discount: [0],

      totalDays: [{ value: 0, disabled: true }],
      carTotal: [{ value: 0, disabled: true }],
      extrasTotal: [{ value: 0, disabled: true }],
      totalWithoutDiscount: [{ value: 0, disabled: true }],
      totalPrice: [{ value: 0, disabled: true }],

      extraServices: this.fb.array([])
    });
  }

  // --------------------------------------------------------------------
  // LOOKUPS FOR CREATE
  // --------------------------------------------------------------------
  loadLookupsForCreate(businessId: number): void {
    forkJoin({
      cars: this.carService.getByBusiness(businessId),
      locations: this.reservationService.getLocations(businessId),
      extras: this.reservationService.getExtraServices()
    }).subscribe(result => {
      this.cars = result.cars;
      this.locations = result.locations;
      this.extraServicesSource = result.extras;

      this.buildExtraServicesArray();
    });
  }

  // --------------------------------------------------------------------
  // LOOKUPS + RESERVATION for EDIT
  // --------------------------------------------------------------------
  loadLookupsAndReservation(businessId: number, reservationId: number): void {
    forkJoin({
      cars: this.carService.getByBusiness(businessId),
      locations: this.reservationService.getLocations(businessId),
      extras: this.reservationService.getExtraServices(),
      reservation: this.reservationService.getById(reservationId)
    }).subscribe(({ cars, locations, extras, reservation }) => {

      this.cars = cars;
      this.locations = locations;
      this.extraServicesSource = extras;

      this.buildExtraServicesArray();

      if (!reservation) return;

      this.form.patchValue({
        id: reservation.id,
        carId: reservation.carId,
        personalNumber: reservation.personalNumber,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        phoneNumber: reservation.phoneNumber,
        address: reservation.address,
        pickupLocationId: reservation.pickupLocationId,
        dropoffLocationId: reservation.dropoffLocationId,
        pickupDate: reservation.pickupDate,
        dropoffDate: reservation.dropoffDate,
        discount: reservation.discount,
        notes: reservation.notes
      });

      this.selectedCarDailyPrice = reservation.carDailyPrice ?? 0;

      this.applyExistingExtraServices(reservation.extraServices ?? []);

      this.recalculateTotals();

      this.registerRecalc();
    });
  }

  // --------------------------------------------------------------------
  // EXTRA SERVICES
  // --------------------------------------------------------------------
  buildExtraServicesArray(): void {
    this.extraServices.clear();

    this.extraServicesSource.forEach(es => {
      this.extraServices.push(this.fb.group({
        extraServiceId: [es.id],
        name: [es.name],
        pricePerDay: [es.pricePerDay],
        selected: [false],
        quantity: [1, Validators.min(1)]
      }));
    });
  }

  applyExistingExtraServices(existing: any[]): void {
    const existingMap = new Map(existing.map(x => [x.extraServiceId, x]));

    this.extraServices.controls.forEach(ctrl => {
      const id = ctrl.get('extraServiceId')!.value;

      if (existingMap.has(id)) {
        ctrl.patchValue({
          selected: true,
          quantity: existingMap.get(id).quantity
        });
      }
    });
  }

  // --------------------------------------------------------------------
  // CUSTOMER SEARCH
  // --------------------------------------------------------------------
  searchCustomer(): void {
    const p = this.form.get('personalNumber')?.value;

    if (!p) return;

    this.reservationService.searchCustomer(p).subscribe(c => {
      if (!c) return;

      const parts = (c.fullName || '').split(' ');

      this.form.patchValue({
        firstName: parts[0],
        lastName: parts[1],
        phoneNumber: c.phoneNumber,
        address: c.address
      });
    });
  }

  // --------------------------------------------------------------------
  // RECALC TOTALS
  // --------------------------------------------------------------------
  registerRecalc(): void {
    this.form.valueChanges.subscribe(() => this.recalculateTotals());
  }

 recalculateTotals(): void {
    const pickup = this.form.get('pickupDate')?.value;
    const dropoff = this.form.get('dropoffDate')?.value;
    const discount = Number(this.form.get('discount')?.value) || 0;
    const carId = this.form.get('carId')?.value;

    // =========================
    // 1) Calculate total days
    // =========================
    let totalDays = 0;

    if (pickup && dropoff) {
        const start = new Date(pickup);
        const end = new Date(dropoff);
        const diff = end.getTime() - start.getTime();

        totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (totalDays < 1) totalDays = 1;

        this.form.get('totalDays')?.setValue(totalDays, { emitEvent: false });
    }

    // ===========================================
    // 2) Calculate car daily price from car list
    // ===========================================
    let carDailyPrice = 0;

    if (carId && this.cars.length > 0) {
        const car = this.cars.find(x => x.id === carId);
        carDailyPrice = car?.dailyPrice ?? 0;
        this.selectedCarDailyPrice = carDailyPrice;
    }

    const carTotal = totalDays * carDailyPrice;
    this.form.get('carTotal')?.setValue(carTotal, { emitEvent: false });

    // ==============================
    // 3) Calculate extra services
    // ==============================
    let extrasTotal = 0;

    this.extraServices.controls.forEach(ctrl => {
        const selected = ctrl.get('selected')?.value;
        if (!selected) return;

        const qty = Number(ctrl.get('quantity')?.value) || 1;
        const price = Number(ctrl.get('pricePerDay')?.value) || 0;

        extrasTotal += qty * price * totalDays;
    });

    this.form.get('extrasTotal')?.setValue(extrasTotal, { emitEvent: false });

    // =======================================
    // 4) Total without discount
    // =======================================
    const totalWithoutDiscount = carTotal + extrasTotal;
    this.form.get('totalWithoutDiscount')?.setValue(totalWithoutDiscount, { emitEvent: false });

    // =======================================
    // 5) Final total = without discount - discount
    // =======================================
    const totalPrice = totalWithoutDiscount - discount;
    this.form.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
}


  // --------------------------------------------------------------------
  // SAVE
  // --------------------------------------------------------------------
   save(): void {
    const payload = this.form.getRawValue();

    // Mos dërgo ReservationStatusId fare gjatë update
    delete payload.reservationStatusId;

    if (this.isEdit) {
      this.reservationService.update(this.reservationId, payload).subscribe(() =>
        this.router.navigate(['/business/reservations'])
      );
    } else {
      this.reservationService.create(payload).subscribe(() =>
        this.router.navigate(['/business/reservations'])
      );
    }
}

  cancel(): void {
    this.router.navigate(['/business/reservations']);
  }
}
