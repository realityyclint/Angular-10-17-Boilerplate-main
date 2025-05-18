import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../_services/request.service';
import { AccountService } from '../_services/account.service';

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
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loadRequests();
    }

    loadRequests(): void {
        this.isLoading = true;

        const account = this.account();

        if (!account) {
            this.errorMessage = 'User not logged in.';
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
                    }
                });
        }
    }



    add(): void {
        this.router.navigate(['add'], { relativeTo: this.route }); // ✅ relative navigation
    }

    edit(id: number): void {
        this.router.navigate(['edit', id], { relativeTo: this.route }); // ✅ relative navigation
    }

    delete(id: number): void {
        if (confirm('Are you sure you want to delete this request?')) {
            this.requestService.delete(id).subscribe({
                next: () => this.loadRequests(),
                error: (err) => (this.errorMessage = err.message),
            });
        }
    }

    account() {
        return this.accountService.accountValue;
    }
}
