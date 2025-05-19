import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentService {
    private baseUrl = 'https://node-js-mysql-boilerplate-api-jup5.onrender.com/accounts/departments'; // Updated to match the new API endpoint

    constructor(private http: HttpClient) { }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl);
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }

    create(department: any): Observable<any> {
        return this.http.post<any>(this.baseUrl, department);
    }

    update(id: number, department: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, department);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`);
    }
}