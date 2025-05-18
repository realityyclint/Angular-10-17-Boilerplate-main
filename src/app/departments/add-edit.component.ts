import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DepartmentService } from '../_services/department.service';
import { AlertService } from '../_services/alert.service';

@Component({
    selector: 'app-department-modal',
    templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnChanges {
    @Input() showModal: boolean = false;
    @Input() selectedDepartment: any = null;
    @Output() cancelEvent = new EventEmitter<void>();
    @Output() saveEvent = new EventEmitter<void>();

    department: any = { name: '', description: '' };
    isNew: boolean = true;

    constructor(
        private departmentService: DepartmentService,
        public alertService: AlertService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedDepartment']) {
            if (this.selectedDepartment) {
                this.isNew = false;
                this.department = { ...this.selectedDepartment };
            } else {
                this.isNew = true;
                this.department = { name: '', description: '' };
            }
        }
    }

    save(): void {
        this.alertService.clear();

        if (!this.department.name.trim()) {
            this.alertService.error('Name is required');
            return;
        }

        if (this.isNew) {
            this.departmentService.create(this.department).subscribe({
                next: () => {
                    this.alertService.success('Department created successfully');
                    this.saveEvent.emit();
                },
                error: (err) => this.alertService.error('Creation failed: ' + err.message),
            });
        } else {
            this.departmentService.update(this.department.id, this.department).subscribe({
                next: () => {
                    this.alertService.success('Department updated successfully');
                    this.saveEvent.emit();
                },
                error: (err) => this.alertService.error('Update failed: ' + err.message),
            });
        }
    }

    cancel(): void {
        this.alertService.clear();
        this.cancelEvent.emit();
    }
}
