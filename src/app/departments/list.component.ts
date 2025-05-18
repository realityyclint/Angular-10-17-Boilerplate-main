import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../_services/department.service';
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';

@Component({
    selector: 'app-department-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    departments: any[] = [];
    isLoading = false;
    account: any;
    viewMode: 'table' | 'card' = 'table';

    // Modal control properties
    showModal = false;
    selectedDepartment: any = null;

    constructor(
        private departmentService: DepartmentService,
        private accountService: AccountService,
        public alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.account = this.accountService.accountValue;
        const savedMode = localStorage.getItem('departmentViewMode') as 'table' | 'card';
        this.viewMode = savedMode ?? 'table';
        this.loadDepartments();
    }

    setViewMode(mode: 'table' | 'card') {
        this.viewMode = mode;
        localStorage.setItem('departmentViewMode', mode);
    }

    loadDepartments(): void {
        this.isLoading = true;
        this.departmentService.getAll().subscribe({
            next: (data) => {
                this.departments = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this.alertService.error('Failed to load departments: ' + err.message);
            }
        });
    }

    // Open the modal to add a new department
    add(): void {
        this.selectedDepartment = { name: '', description: '', employeeCount: 0 };
        this.showModal = true;
    }

    // Open the modal to edit an existing department
    edit(id: number): void {
        this.departmentService.getById(id).subscribe({
            next: (dept) => {
                this.selectedDepartment = { ...dept }; // clone to avoid direct mutation
                this.showModal = true;
            },
            error: (err) => {
                this.alertService.error('Failed to load department: ' + err.message);
            }
        });
    }

    // Confirm and delete a department
    delete(id: number): void {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.delete(id).subscribe({
                next: () => {
                    this.alertService.success('Department deleted successfully');
                    this.loadDepartments();
                },
                error: (err) => {
                    this.alertService.error('Delete failed: ' + err.message);
                }
            });
        }
    }

    // Modal cancel event handler
    onCancel(): void {
        this.showModal = false;
        this.selectedDepartment = null;
    }

    // Modal save event handler (create or update)
    onSave(department: any): void {
        if (department.id) {
            this.departmentService.update(department.id, department).subscribe({
                next: () => {
                    this.alertService.success('Department updated successfully');
                    this.showModal = false;
                    this.loadDepartments();
                },
                error: (err) => {
                    this.alertService.error('Update failed: ' + err.message);
                }
            });
        } else {
            this.departmentService.create(department).subscribe({
                next: () => {
                    this.alertService.success('Department created successfully');
                    this.showModal = false;
                    this.loadDepartments();
                },
                error: (err) => {
                    this.alertService.error('Creation failed: ' + err.message);
                }
            });
        }
    }
}
