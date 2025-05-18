import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../_services/employee.service';
import { DepartmentService } from '../_services/department.service';
import { UserService } from '../_services/user.service';
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';

@Component({
    selector: 'app-employee-modal',
    templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnChanges {
    @Input() showModal: boolean = false;
    @Input() selectedEmployee: any = null;
    @Output() cancelEvent = new EventEmitter<void>();
    @Output() saveEvent = new EventEmitter<void>();

    employee: any = {
        employeeId: '',
        accountId: '',
        userId: '',
        position: '',
        departmentId: '',
        hireDate: '',
        status: 'Active',
    };
    isNew: boolean = true;

    users: any[] = [];
    departments: any[] = [];
    accounts: any[] = [];
    loading = false;

    constructor(
        private employeeService: EmployeeService,
        private userService: UserService,
        private departmentService: DepartmentService,
        private accountService: AccountService,
        public alertService: AlertService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedEmployee']) {
            this.isNew = !this.selectedEmployee;
            this.employee = this.selectedEmployee
                ? { ...this.selectedEmployee, hireDate: this.formatDate(this.selectedEmployee.hireDate) }
                : {
                    employeeId: '',
                    accountId: '',
                    userId: '',
                    position: '',
                    departmentId: '',
                    hireDate: '',
                    status: 'Active',
                };

            this.loadDropdowns();
        }
    }

    private loadDropdowns(): void {
        this.userService.getAll().subscribe(users => this.users = users);
        this.departmentService.getAll().subscribe(depts => this.departments = depts);
        this.accountService.getAll().subscribe(accs => {
            this.employeeService.getAll().subscribe(emps => {
                const usedAccountIds = emps.map(e => e.accountId);
                this.accounts = this.isNew
                    ? accs.filter(acc => !usedAccountIds.includes(acc.id))
                    : accs;
            });
        });
    }

    save(): void {
        this.alertService.clear();
        this.loading = true;

        const request = this.isNew
            ? this.employeeService.create(this.employee)
            : this.employeeService.update(this.employee.id, this.employee);

        request.subscribe({
            next: () => {
                const msg = this.isNew ? 'Employee created successfully' : 'Employee updated successfully';
                this.alertService.success(msg);
                this.saveEvent.emit();
                this.loading = false;
            },
            error: (err) => {
                this.alertService.error(err.message);
                this.loading = false;
            }
        });
    }

    cancel(): void {
        this.alertService.clear();
        this.cancelEvent.emit();
    }

    getAccountEmail(accountId: number): string {
        const account = this.accounts.find(acc => acc.id === accountId);
        return account ? account.email : '';
    }

    private formatDate(date: string): string {
        return date ? new Date(date).toISOString().split('T')[0] : '';
    }
}
