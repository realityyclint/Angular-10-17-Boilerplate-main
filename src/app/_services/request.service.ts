import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Request } from '../_models/request'; // Update path if needed

const baseUrl = `${environment.apiUrl}/accounts/requests`;

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(private http: HttpClient) { }

    // 🔍 Get all requests (for Admin)
    getAll(): Observable<Request[]> {
        return this.http.get<Request[]>(baseUrl);
    }

    // 🔍 Get request by ID
    getById(id: number | string): Observable<Request> {
        return this.http.get<Request>(`${baseUrl}/${id}`);
    }

    // 🔍 Get requests by employee (for User)
    getByEmployee(accountId: number): Observable<Request[]> {
        return this.http.get<Request[]>(`${baseUrl}/employee/${accountId}`);
    }

    // ➕ Create a new request
    create(request: Request): Observable<Request> {
        return this.http.post<Request>(baseUrl, request);
    }

    // ✏️ Update existing request
    update(id: number | string, request: Request): Observable<Request> {
        return this.http.put<Request>(`${baseUrl}/${id}`, request);
    }

    // ❌ Delete a request
    delete(id: number | string): Observable<any> {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}
