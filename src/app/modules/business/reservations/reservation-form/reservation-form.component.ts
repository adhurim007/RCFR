import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'app/services/reservations.service';
import { CarService } from 'app/services/car.service';
import { UserService } from 'app/core/user/user.service';
import { forkJoin } from 'rxjs';


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
  customers: any[] = [];
  locations: any[] = [];
  extraServicesSource: any[] = []; // master list

  carPricingRules: any[] = [];
  selectedCarDailyPrice = 0;



  get extraServices(): FormArray {
    return this.form.get('extraServices') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private carService: CarService,
    private route: ActivatedRoute,
    private router: Router,
    private userService : UserService
  ) {}

   ngOnInit(): void {

      const currentUser = this.userService.getCurrent(); 
      if (!currentUser) {
          console.error("User not found in UserService AND localStorage!");
          return;
      }

      const userId = currentUser.id;
      if (!userId) {
          console.error("UserId not found!");
          return;
      }

      this.buildForm();
      this.loadLookups();
 
      if (!this.isEdit) {
          this.registerRecalc();
      }
  }
 
  buildForm(): void {
    this.form = this.fb.group({
      id: [0],
      carId: ['', Validators.required],
      customerId: ['', Validators.required],
      pickupLocationId: ['', Validators.required],
      dropoffLocationId: ['', Validators.required],
      pickupDate: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      notes: [''],
      discount: [0],

      // read-only calculated fields
      totalDays: [{ value: 0, disabled: true }],
      carTotal: [{ value: 0, disabled: true }],
      extrasTotal: [{ value: 0, disabled: true }],
      totalWithoutDiscount: [{ value: 0, disabled: true }],
      totalPrice: [{ value: 0, disabled: true }],

      extraServices: this.fb.array([])
    });
  }

  loadLookups(): void {

    const currentUser = this.userService.getCurrent();

    if (!currentUser) {
        console.error("User not found!");
        return;
    }

    this.userService.getBusinessId(currentUser.id).subscribe({
        next: (res) => {
            const businessId = res.businessId;

            if (!businessId) {
                console.error("User has no business assigned!");
                return;
            }
 
            this.carService.getByBusiness(businessId).subscribe({
                next: cars => {
                    this.cars = cars;

                    // Nëse ka vetëm 1 veturë → cakto automatikisht
                    if (cars.length === 1) {
                        this.form.get('carId')?.setValue(cars[0].id);
                    }
                },
                error: err => console.error("Error loading cars:", err)
            });
 
            this.reservationService.getLocations(businessId).subscribe({
                next: locations => {
                    this.locations = locations;
                },
                error: err => console.error("Error loading locations:", err)
            });
 
            this.reservationService.getCustomers().subscribe({
                next: customers => {
                    this.customers = customers;
                },
                error: err => console.error("Error loading customers:", err)
            });
 
            this.reservationService.getExtraServices().subscribe({
                next: extras => {
                    this.extraServicesSource = extras;
                    this.buildExtraServicesArray();
                },
                error: err => console.error("Error loading extra services:", err)
            });
        },
        error: (err) => {
            console.error("Error fetching BusinessId:", err);
        }
    });
}
  

  buildExtraServicesArray(): void {
    this.extraServices.clear();
    this.extraServicesSource.forEach(es => {
      this.extraServices.push(this.fb.group({
        extraServiceId: [es.id],
        name: [es.name],
        pricePerDay: [es.pricePerDay],
        selected: [false],
        quantity: [1, [Validators.min(1)]]
      }));
    });
  }

  loadReservation(id: number): void {
    this.reservationService.getById(id).subscribe(reservation => {

      // mbush bazën
      this.form.patchValue({
        id: reservation.id,
        carId: reservation.carId,
        customerId: reservation.customerId,
        pickupLocationId: reservation.pickupLocationId,
        dropoffLocationId: reservation.dropoffLocationId,
        pickupDate: reservation.pickupDate,
        dropoffDate: reservation.dropoffDate,
        notes: reservation.notes,
        discount: reservation.discount || 0
      });

      // load car to get daily price + rules
      this.onCarChanged(reservation.carId);

      // extra services
      if (this.extraServicesSource.length === 0) {
        // nëse nuk janë loaded ende, i presim deri sa të vinë dhe pastaj i shënojmë
        this.reservationService.getExtraServices().subscribe(x => {
          this.extraServicesSource = x;
          this.buildExtraServicesArray();
          this.applyExistingExtraServices(reservation.extraServices || []);
        });
      } else {
        this.applyExistingExtraServices(reservation.extraServices || []);
      }
    });
  }

  applyExistingExtraServices(existing: any[]): void {
    const map = new Map<number, any>();
    existing.forEach(e => map.set(e.extraServiceId, e));

    this.extraServices.controls.forEach(ctrl => {
      const esId = ctrl.get('extraServiceId')!.value;
      if (map.has(esId)) {
        const item = map.get(esId);
        ctrl.patchValue({
          selected: true,
          quantity: item.quantity
        }, { emitEvent: false });
      }
    });

    this.recalculateTotals();
  }

  // event kur ndryshon vetura
  onCarChanged(carId: number): void {
    if (!carId) {
      this.selectedCarDailyPrice = 0;
      this.carPricingRules = [];
      this.recalculateTotals();
      return;
    }

    this.carService.getById(carId).subscribe(car => {
      this.selectedCarDailyPrice = car.dailyPrice || 0;
      // mund të ruash edhe info tjera nëse të duhen
      this.recalculateTotals();
    });

    // load pricing rules for car
    // this.reservationService.getCarPricingRules(carId)
    //   .subscribe(rules => {
    //     this.carPricingRules = rules || [];
    //     this.recalculateTotals();
    //   });
  }

  registerRecalc(): void {
    // re-calc when relevant fields change
    this.form.get('carId')!.valueChanges.subscribe(carId => {
      this.onCarChanged(carId);
    });

    this.form.get('pickupDate')!.valueChanges.subscribe(() => this.recalculateTotals());
    this.form.get('dropoffDate')!.valueChanges.subscribe(() => this.recalculateTotals());
    this.form.get('discount')!.valueChanges.subscribe(() => this.recalculateTotals());

    this.extraServices.valueChanges.subscribe(() => this.recalculateTotals());
  }

  recalculateTotals(): void {
    const pickup = this.form.get('pickupDate')!.value ? new Date(this.form.get('pickupDate')!.value) : null;
    const dropoff = this.form.get('dropoffDate')!.value ? new Date(this.form.get('dropoffDate')!.value) : null;

    if (!pickup || !dropoff || !this.selectedCarDailyPrice || pickup >= dropoff) {
      this.form.patchValue({
        totalDays: 0,
        carTotal: 0,
        extrasTotal: 0,
        totalWithoutDiscount: 0,
        totalPrice: 0
      }, { emitEvent: false });
      return;
    }

    const totalDays = Math.floor((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    if (totalDays <= 0) {
      this.form.patchValue({
        totalDays: 0,
        carTotal: 0,
        extrasTotal: 0,
        totalWithoutDiscount: 0,
        totalPrice: 0
      }, { emitEvent: false });
      return;
    }

    // 1) car total based on pricing rules
    let carTotal = 0;

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(pickup);
      currentDate.setDate(currentDate.getDate() + i);

      let dayPrice = this.selectedCarDailyPrice;

      const rule = this.carPricingRules.find(r => {
        const from = new Date(r.fromDate);
        const to = new Date(r.toDate);
        return currentDate >= from && currentDate <= to;
      });

      if (rule) {
        if (rule.ruleType === 'Discount') {
          dayPrice -= rule.pricePerDay;
        } else if (rule.ruleType === 'Increase') {
          dayPrice += rule.pricePerDay;
        }
      }

      carTotal += dayPrice;
    }

    // 2) extra services total
    let extrasTotal = 0;
    this.extraServices.controls.forEach(ctrl => {
      const selected = ctrl.get('selected')!.value;
      const qty = Number(ctrl.get('quantity')!.value || 0);
      const pricePerDay = Number(ctrl.get('pricePerDay')!.value || 0);

      if (selected && qty > 0 && pricePerDay > 0) {
        extrasTotal += pricePerDay * qty * totalDays;
      }
    });

    const totalWithoutDiscount = carTotal + extrasTotal;
    const discount = Number(this.form.get('discount')!.value || 0);
    let totalPrice = totalWithoutDiscount - discount;
    if (totalPrice < 0) totalPrice = 0;

    this.form.patchValue({
      totalDays,
      carTotal,
      extrasTotal,
      totalWithoutDiscount,
      totalPrice
    }, { emitEvent: false });
  }

  save(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const payload: any = {
      carId: raw.carId,
      customerId: raw.customerId,
      pickupLocationId: raw.pickupLocationId,
      dropoffLocationId: raw.dropoffLocationId,
      pickupDate: raw.pickupDate,
      dropoffDate: raw.dropoffDate,
      notes: raw.notes,
      discount: raw.discount,
      extraServices: this.extraServices.controls
        .filter(c => c.get('selected')!.value)
        .map(c => ({
          extraServiceId: c.get('extraServiceId')!.value,
          quantity: c.get('quantity')!.value
        }))
    };

    if (this.isEdit) {
      this.reservationService.update(this.reservationId, payload).subscribe(() => {
        this.router.navigate(['/admin/reservations']);
      });
    } else {
      this.reservationService.create(payload).subscribe(() => {
        this.router.navigate(['/admin/reservations']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/reservations']);
  }
}
