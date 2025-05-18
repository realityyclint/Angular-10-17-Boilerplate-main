import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../_services/department.service';
import { AccountService } from '../_services/account.service';

@Component({
    selector: 'app-department-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    departments: any[] = [];
    errorMessage: string = '';
    account: any; // Define the account property
    isLoading = false;

    constructor(
        private departmentService: DepartmentService,
        private accountService: AccountService, // Inject AccountService
        private router: Router
    ) { }

    ngOnInit(): void {
        this.account = this.accountService.accountValue; // Ensure this is correctly set
        console.log(this.account); // Debugging: Check the account object
        this.loadDepartments();
    }

    loadDepartments(): void {
        this.isLoading = true; // start loading
        this.departmentService.getAll().subscribe({
            next: (data) => {
                this.departments = data;
                this.isLoading = false; // stop loading on success
            },
            error: (err) => {
                this.errorMessage = err.message;
                this.isLoading = false; // stop loading on error too
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
                next: () => this.loadDepartments(),
                error: (err) => (this.errorMessage = err.message),
            });
        }
    }
}