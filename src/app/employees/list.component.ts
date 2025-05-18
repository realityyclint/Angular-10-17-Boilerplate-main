import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../_services/employee.service';
import { AccountService } from '../_services/account.service';
import { DepartmentService } from '../_services/department.service';
import { AlertService } from '../_services/alert.service';  // <-- Import AlertService

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
    viewMode: 'table' | 'card' = 'table';  // <-- View mode state

    constructor(
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private router: Router,
        private accountService: AccountService,
        public alertService: AlertService  // <-- Inject AlertService
    ) { }

    ngOnInit(): void {
        // Load saved view mode
        const savedView = localStorage.getItem('employeeViewMode');
        if (savedView === 'card' || savedView === 'table') {
            this.viewMode = savedView;
        }

        this.loadEmployees();
        this.departmentService.getAll().subscribe({
            next: (depts) => this.departments = depts,
            error: (err) => this.alertService.error('Failed to load departments: ' + err.message)
        });
    }

    setViewMode(mode: 'table' | 'card'): void {
        this.viewMode = mode;
        localStorage.setItem('employeeViewMode', mode);  // Save to localStorage
    }

    loadEmployees(): void {
        this.isLoading = true;
        this.employeeService.getAll().subscribe({
            next: (data) => {
                this.employees = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this.alertService.error('Failed to load employees: ' + err.message);
            }
        });
    }

    onCancel(): void {
        this.showModal = false;          // Close the modal
        this.selectedEmployee = null;    // Clear any selected employee
    }

    onSave(): void {
        this.showModal = false;          // Close the modal
        this.selectedEmployee = null;    // Clear selection
        this.loadEmployees();            // Refresh employee list after save
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
            this.employeeService.delete(id).subscribe({
                next: () => {
                    this.alertService.success('Employee deleted successfully');
                    this.loadEmployees();
                },
                error: (err) => this.alertService.error('Delete failed: ' + err.message)
            });
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
        this.employeeService.transfer(event.accountId, event.departmentId).subscribe({
            next: () => {
                this.alertService.success('Employee transferred successfully');
                this.showModal = false;
                this.selectedEmployee = null;
                this.loadEmployees();
            },
            error: (err) => this.alertService.error('Transfer failed: ' + err.message)
        });
    }

    viewRequests(accountId: number): void {
        this.router.navigate(['/employees', accountId, 'requests']);
    }

    viewWorkflows(id: number): void {
        this.router.navigate(['/employees', id, 'workflows']);
    }
}
