import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../_services/request.service';
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';

@Component({
    selector: 'app-request-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
    requests: any[] = [];
    errorMessage: string = '';
    isLoading: boolean = false;
    viewMode: 'table' | 'card' = 'table';  // <-- View mode state

    constructor(
        private requestService: RequestService,
        private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
        public alertService: AlertService
    ) { }

    ngOnInit(): void {
        // Load saved view mode
        const savedView = localStorage.getItem('requestViewMode');
        if (savedView === 'card' || savedView === 'table') {
            this.viewMode = savedView;
        }

        this.loadRequests();
    }

    setViewMode(mode: 'table' | 'card'): void {
        this.viewMode = mode;
        localStorage.setItem('requestViewMode', mode);
    }

    loadRequests(): void {
        this.isLoading = true;
        this.alertService.clear();

        const account = this.account();
        if (!account) {
            this.errorMessage = 'User not logged in.';
            this.alertService.error(this.errorMessage);
            this.isLoading = false;
            return;
        }

        const request$ = account.role === 'Admin'
            ? this.requestService.getAll()
            : this.requestService.getByEmployee(parseInt(account.id, 10));

        request$.subscribe({
            next: (data) => {
                this.requests = data;
                this.isLoading = false;
                this.errorMessage = '';
            },
            error: (err) => {
                this.errorMessage = err.message;
                this.isLoading = false;
                const message = account.role === 'Admin'
                    ? 'Failed to load requests'
                    : 'Failed to load your requests';
                this.alertService.error(`${message}: ${err.message}`);
            }
        });
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
                error: (err) => this.alertService.error('Delete failed: ' + err.message)
            });
        }
    }

    account() {
        return this.accountService.accountValue;
    }
}
