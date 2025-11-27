import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarModel } from 'app/models/car-model.model';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CarModelsService {

    private apiUrl = environment.apiUrl + '/api/carmodels';

    constructor(private http: HttpClient) {}

    getAll(): Observable<CarModel[]> {
        return this.http.get<CarModel[]>(this.apiUrl);
    }

    getById(id: number): Observable<CarModel> {
        return this.http.get<CarModel>(`${this.apiUrl}/${id}`);
    }

    create(model: Partial<CarModel>): Observable<number> {
        return this.http.post<number>(this.apiUrl, model);
    }

    update(model: CarModel): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${model.id}`, model);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
