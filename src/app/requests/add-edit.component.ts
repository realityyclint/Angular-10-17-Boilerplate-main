import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../_services/request.service';
import { EmployeeService } from '../_services/employee.service';
import { AlertService } from '../_services/alert.service';

@Component({
    selector: 'app-request-add-edit',
    templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit {
    id: number | null = null;
    request: any = {
        type: 'Equipment',
        employeeId: '',
        items: [],
        status: 'Pending',
    };
    employees: any[] = [];

    constructor(
        private requestService: RequestService,
        private employeeService: EmployeeService,
        private route: ActivatedRoute,
        private router: Router,
        public alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        this.employeeService.getAll().subscribe({
            next: (employees) => {
                this.employees = employees;
                if (this.id) {
                    this.loadRequest();
                } else {
                    this.addItem();
                }
            },
            error: (err) => {
                this.alertService.error('Failed to load employees: ' + err.message);
            }
        });
    }

    loadRequest(): void {
        this.requestService.getById(this.id!).subscribe({
            next: (data: any) => {
                this.request = {
                    type: data.type || 'Equipment',
                    employeeId: data.employeeId || '',
                    status: data.status || 'Pending',
                    items: Array.isArray(data.RequestItems) && data.RequestItems.length > 0
                        ? data.RequestItems.map((item: any) => ({
                            name: item.name || '',
                            quantity: item.quantity || 1
                        }))
                        : [{ name: '', quantity: 1 }],
                };
            },
            error: (err) => {
                this.alertService.error('Failed to load request: ' + err.message);
            },
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
        if (!this.id) {
            delete payload.employeeId;
        }

        const request$ = this.id
            ? this.requestService.update(this.id, payload)
            : this.requestService.create(payload);

        request$.subscribe({
            next: () => {
                this.alertService.success(`Request ${this.id ? 'updated' : 'created'} successfully!`);
                this.router.navigate(['/requests']);
            },
            error: (err) => {
                this.alertService.error('Failed to save request: ' + err.message);
            },
        });
    }

    cancel(): void {
        this.router.navigate(['/requests']);
    }
}
