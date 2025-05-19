import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WorkflowService {
    private baseUrl = 'https://node-js-mysql-boilerplate-api-jup5.onrender.com/accounts/workflows';

    constructor(private http: HttpClient) { }

    // Fetch workflows for a specific employee
    getByEmployeeId(employeeId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/employee/${employeeId}`);
    }

    // Update the status of a workflow
    updateStatus(id: number, statusData: { status: string }): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}/status`, statusData);
    }
}
