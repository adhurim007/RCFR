import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarBrand } from 'app/models/car-brand.model';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CarBrandsService {

    private apiUrl = environment.apiUrl + '/api/carbrands';

    constructor(private http: HttpClient) {}

    getAll(): Observable<CarBrand[]> {
        return this.http.get<CarBrand[]>(this.apiUrl);
    }

    getById(id: number): Observable<CarBrand> {
        return this.http.get<CarBrand>(`${this.apiUrl}/${id}`);
    }

    create(model: Partial<CarBrand>): Observable<number> {
        return this.http.post<number>(this.apiUrl, model);
    }

    update(model: CarBrand): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${model.id}`, model);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
