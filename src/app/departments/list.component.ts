import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../_services/department.service';
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';  // <-- Import AlertService

@Component({
    selector: 'app-department-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    departments: any[] = [];
    isLoading = false;
    account: any; // Define the account property
    viewMode: 'table' | 'card';
    zooming = false;

    constructor(
        private departmentService: DepartmentService,
        private accountService: AccountService,
        private router: Router,
        public alertService: AlertService   // <-- Inject AlertService as public
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

    zoomAndNavigate(button: HTMLElement) {
        this.zooming = true;

        // Make sure button stays in fixed position
        const rect = button.getBoundingClientRect();
        button.style.position = 'fixed';
        button.style.top = `${rect.top + rect.height / 2}px`;
        button.style.left = `${rect.left + rect.width / 2}px`;
        button.style.transform = 'translate(-50%, -50%) scale(1)';

        // Wait for animation to complete (0.5s in CSS)
        setTimeout(() => {
            // Reset styles if needed (optional)
            button.style.position = '';
            button.style.top = '';
            button.style.left = '';
            button.style.transform = '';

            // Navigate or show the add department page here
            this.router.navigate(['/departments/add']); // Or whatever your route is
        }, 500);
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

    add(): void {
        this.router.navigate(['/departments/add']);
    }

    edit(id: number): void {
        this.router.navigate(['/departments/edit', id]);
    }

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
}
