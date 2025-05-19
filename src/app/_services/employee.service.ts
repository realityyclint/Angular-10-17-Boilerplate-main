import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    private baseUrl = 'https://node-js-mysql-boilerplate-api-jup5.onrender.com/accounts/employees';

    constructor(private http: HttpClient) { }

    // 🔐 Create reusable headers with token
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found!');
        }
        return new HttpHeaders({
            Authorization: `Bearer ${token || ''}`,
        });
    }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl, {
            headers: this.getAuthHeaders(),
            withCredentials: true, // Add this if cookies/session are needed
        });
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`, {
            headers: this.getAuthHeaders(),
            withCredentials: true, // Add this if cookies/session are needed
        });
    }

    create(employee: any): Observable<any> {
        return this.http.post<any>(this.baseUrl, employee, {
            headers: this.getAuthHeaders(),
            withCredentials: true, // Add this if cookies/session are needed
        });
    }

    update(id: number, employee: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, employee, {
            headers: this.getAuthHeaders(),
            withCredentials: true, // Add this if cookies/session are needed
        });
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`, {
            headers: this.getAuthHeaders(),
            withCredentials: true, // Add this if cookies/session are needed
        });
    }

    transfer(id: number, departmentId: number): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}/${id}/transfer`,
            { departmentId },
            {
                headers: this.getAuthHeaders(),
                withCredentials: true, // Add this if cookies/session are needed
            }
        );
    }
}
