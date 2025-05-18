import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../_services/request.service';
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';  // <-- Import AlertService

@Component({
    selector: 'app-request-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    requests: any[] = [];
    errorMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private requestService: RequestService,
        private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
        public alertService: AlertService  // <-- Inject AlertService
    ) { }

    ngOnInit(): void {
        this.loadRequests();
    }

    loadRequests(): void {
        this.isLoading = true;
        this.alertService.clear();  // Clear previous alerts

        const account = this.account();

        if (!account) {
            this.errorMessage = 'User not logged in.';
            this.alertService.error(this.errorMessage);
            this.isLoading = false;
            return;
        }

        if (account.role === 'Admin') {
            this.requestService.getAll().subscribe({
                next: (data) => {
                    this.requests = data;
                    this.isLoading = false;
                    this.errorMessage = '';
                },
                error: (err) => {
                    this.errorMessage = err.message;
                    this.isLoading = false;
                    this.alertService.error('Failed to load requests: ' + err.message);
                }
            });
        } else {
            this.requestService.getByEmployee(parseInt(account.id, 10))
                .subscribe({
                    next: (data) => {
                        this.requests = data;
                        this.isLoading = false;
                        this.errorMessage = '';
                    },
                    error: (err) => {
                        this.errorMessage = err.message;
                        this.isLoading = false;
                        this.alertService.error('Failed to load your requests: ' + err.message);
                    }
                });
        }
    }

    add(): void {
        this.router.navigate(['add'], { relativeTo: this.route });
    }

    edit(id: number): void {
        this.router.navigate(['edit', id], { relativeTo: this.route });
    }

    delete(id: number): void {
        if (confirm('Are you sure you want to delete this request?')) {
            this.requestService.delete(id).subscribe({
                next: () => {
                    this.alertService.success('Request deleted successfully');
                    this.loadRequests();
                },
                error: (err) => this.alertService.error('Delete failed: ' + err.message),
            });
        }
    }

    account() {
        return this.accountService.accountValue;
    }
}
