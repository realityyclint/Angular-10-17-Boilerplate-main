import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService } from '../_services/workflow.service';
import { AccountService } from '../_services/account.service';

@Component({
    selector: 'app-workflow-list',
    templateUrl: './list.component.html',
})
export class WorkflowListComponent implements OnInit {
    employeeId: number = 0;
    workflows: any[] = [];
    isLoading = false;

    constructor(
        private workflowService: WorkflowService,
        private accountService: AccountService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('employeeId');
        this.employeeId = id ? +id : 0;
        this.loadWorkflows();
    }

    loadWorkflows(): void {
        this.isLoading = true;
        this.workflowService.getByEmployeeId(this.employeeId).subscribe({
            next: (data) => {
                this.workflows = data;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading workflows', error);
                this.isLoading = false;
            }
        });
    }

    account() {
        return this.accountService.accountValue;
    }

    updateStatus(workflow: any): void {
        const updatedStatus = { status: workflow.status };
        this.workflowService.updateStatus(workflow.id, updatedStatus).subscribe({
            next: (data) => {
                console.log('Status updated successfully', data);
            },
            error: (error) => {
                console.error('Error updating status', error);
            }
        });
    }
}
