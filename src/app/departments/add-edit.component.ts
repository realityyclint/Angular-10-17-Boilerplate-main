import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../_services/department.service';
import { AlertService } from '../_services/alert.service'; // Adjust the path if needed

@Component({
    selector: 'app-department-add-edit',
    templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit {
    id: number | null = null;
    department: any = { name: '', description: '' };

    constructor(
        private departmentService: DepartmentService,
        private route: ActivatedRoute,
        private router: Router,
        public alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        if (this.id) {
            this.departmentService.getById(this.id).subscribe({
                next: (data) => (this.department = data),
                error: (err) => this.alertService.error('Failed to load department: ' + err.message),
            });
        }
    }

    save(): void {
        this.alertService.clear(); // Clear previous alerts

        if (this.id) {
            this.departmentService.update(this.id, this.department).subscribe({
                next: () => {
                    this.alertService.success('Department updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/departments']);
                },
                error: (err) => this.alertService.error('Update failed: ' + err.message),
            });
        } else {
            this.departmentService.create(this.department).subscribe({
                next: () => {
                    this.alertService.success('Department created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/departments']);
                },
                error: (err) => this.alertService.error('Creation failed: ' + err.message),
            });
        }
    }

    cancel(): void {
        this.router.navigate(['/departments']);
    }
}
