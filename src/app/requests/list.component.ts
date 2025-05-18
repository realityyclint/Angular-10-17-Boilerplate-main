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
        this.isLoading = true; // start loading
        this.requestService.getAll().subscribe({
            next: (data) => {
                this.requests = data;
                this.isLoading = false; // done loading
                this.errorMessage = '';
            },
            error: (err) => {
                this.errorMessage = err.message;
                this.isLoading = false; // done loading even on error
            }
        });
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
