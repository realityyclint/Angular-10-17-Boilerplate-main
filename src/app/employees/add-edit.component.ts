import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../_services/employee.service';
import { DepartmentService } from '../_services/department.service';
import { UserService } from '../_services/user.service';
import { AccountService } from '../_services/account.service';
import { AlertService } from '../_services/alert.service'; // ✅ Import AlertService

@Component({
    selector: 'app-employee-add-edit',
    templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit {
    id: number | null = null;
    employee: any = {
        employeeId: '',
        accountId: '',
        userId: '',
        position: '',
        departmentId: '',
        hireDate: '',
        status: 'Active',
    };
    users: any[] = [];
    departments: any[] = [];
    accounts: any[] = [];
    loading = false;

    constructor(
        private employeeService: EmployeeService,
        private userService: UserService,
        private departmentService: DepartmentService,
        private accountService: AccountService,
        public alertService: AlertService, // ✅ Inject AlertService
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

        this.userService.getAll().subscribe(users => this.users = users);
        this.departmentService.getAll().subscribe(depts => this.departments = depts);
        this.accountService.getAll().subscribe(accs => {
            this.employeeService.getAll().subscribe(emps => {
                const usedAccountIds = emps.map(e => e.accountId);

                // If adding (not editing), exclude already used accountIds
                if (!this.id) {
                    this.accounts = accs.filter(acc => !usedAccountIds.includes(acc.id));
                } else {
                    // If editing, include the current accountId too
                    this.accounts = accs;
                }
            });
        });

        if (this.id) {
            this.employeeService.getById(this.id).subscribe({
                next: (data) => {
                    if (data.hireDate) {
                        const hireDate = new Date(data.hireDate);
                        data.hireDate = hireDate.toISOString().split('T')[0];
                    }
                    this.employee = data;
                },
                error: (err) => this.alertService.error(err.message) // ✅ Show error alert
            });
        }
    }

    save(): void {
        this.alertService.clear(); // ✅ Clear alerts before save
        this.loading = true;

        const payload = { ...this.employee };
        if (!this.id) delete payload.hireDate;

        const request = this.id
            ? this.employeeService.update(this.id, this.employee)
            : this.employeeService.create(this.employee);

        request.subscribe({
            next: () => {
                const msg = this.id ? 'Employee updated successfully' : 'Employee created successfully';
                this.alertService.success(msg, { keepAfterRouteChange: true }); // ✅ Show success alert
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: (err) => {
                this.alertService.error(err.message); // ✅ Show error alert
                this.loading = false;
            }
        });
    }

    getAccountEmail(accountId: number): string {
        const account = this.accounts.find(acc => acc.id === accountId);
        return account ? account.email : '';
    }


    cancel(): void {
        this.router.navigate(['/employees']);
    }
}
