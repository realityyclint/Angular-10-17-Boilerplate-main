import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../_services/employee.service';
import { AccountService } from '../_services/account.service';
import { DepartmentService } from '../_services/department.service';

@Component({
    selector: 'app-employee-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    employees: any[] = [];
    departments: any[] = [];

    showModal: boolean = false;
    selectedEmployee: any = null;
    isLoading: boolean = false;

    constructor(
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private router: Router,
        private accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.loadEmployees();
        this.departmentService.getAll().subscribe(depts => this.departments = depts);
    }

    loadEmployees(): void {
        this.isLoading = true; // start loading
        this.employeeService.getAll().subscribe({
            next: (data) => {
                this.employees = data;
                this.isLoading = false; // finished loading
            },
            error: (err) => {
                this.isLoading = false; // finished loading even on error
                // optionally handle error here
            }
        });
    }

    account() {
        return this.accountService.accountValue;
    }

    add(): void {
        this.router.navigate(['/employees/add']);
    }

    edit(id: number): void {
        this.router.navigate(['/employees/edit', id]);
    }

    delete(id: number): void {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employeeService.delete(id).subscribe(() => this.loadEmployees());
        }
    }

    transfer(employee: any): void {
        this.selectedEmployee = employee;
        this.showModal = true;
    }

    onCancelTransfer(): void {
        this.showModal = false;
        this.selectedEmployee = null;
    }

    onTransferConfirmed(event: { accountId: number, departmentId: number }): void {
        this.employeeService.transfer(event.accountId, event.departmentId).subscribe(() => {
            this.showModal = false;
            this.selectedEmployee = null;
            this.loadEmployees(); // refresh list after transfer
        });
    }

    viewRequests(accountId: number): void {
        this.router.navigate(['/employees', accountId, 'requests']);
    }

    viewWorkflows(id: number): void {
        this.router.navigate(['/employees', id, 'workflows']);
    }
}
