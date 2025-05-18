import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../_services/request.service';
import { EmployeeService } from '../_services/employee.service';

@Component({
    selector: 'app-request-add-edit',
    templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit {
    id: number | null = null;
    request: any = {
        type: 'Equipment',
        employeeId: '',  // Use this for employee binding
        items: [],
        status: 'Pending',
    };
    employees: any[] = [];
    errorMessage: string = '';

    constructor(
        private requestService: RequestService,
        private employeeService: EmployeeService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        // Load employees list first
        this.employeeService.getAll().subscribe((employees) => {
            this.employees = employees;

            if (this.id) {
                this.loadRequest();
            } else {
                this.addItem();
            }
        });
    }

    loadRequest(): void {
        this.requestService.getById(this.id!).subscribe({
            next: (data) => {
                this.request = data;

                // Make sure items array exists so template doesn't break
                if (!this.request.items || this.request.items.length === 0) {
                    this.addItem();
                }
            },
            error: (err) => (this.errorMessage = err.message),
        });
    }

    addItem(): void {
        this.request.items.push({ name: '', quantity: 1 });
    }

    removeItem(index: number): void {
        this.request.items.splice(index, 1);
    }

    save(): void {
        const payload = { ...this.request };

        // If creating a new request, prevent sending employeeId if you want to handle it differently
        if (!this.id) {
            delete payload.employeeId;
        }

        const request$ = this.id
            ? this.requestService.update(this.id, payload)
            : this.requestService.create(payload);

        request$.subscribe({
            next: () => this.router.navigate(['/requests']),
            error: (err) => (this.errorMessage = err.message),
        });
    }

    cancel(): void {
        this.router.navigate(['/requests']);
    }
}
