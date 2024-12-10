import { Component, Inject } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from 'app/modules/common.service';
import { ObservationService } from '../../../../observations.service';
import { MatDatepickerModule } from '@angular/material/datepicker';



@Component({
    selector: 'actions-compose-2',
    templateUrl: './add-form.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule

    ],
})
export class AddformComponent 
{
    composeForm: UntypedFormGroup;
    actionStatuses: any[] = [];
    actionTypes: any[] = [];
    departments: any[] = [];
    buttonText = 'Save';

    constructor(
        public matDialogRef: MatDialogRef<AddformComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _commonService: CommonService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _service: ObservationService) {

    }

    ngOnInit(): void {

        this.composeForm = this._formBuilder.group({
            caseActionId: [-1, Validators.required],
            caseId: [this._data.caseId, Validators.required],
            actionStatus: ['', Validators.required],
            actionTypeId: ['', Validators.required],
            responsibleDeptId: ['', Validators.required],
            deadline: ['', Validators.required],
            completedOn: ['', Validators.required],
            description: [''],
            actionTaken: ['', Validators.required],
            actionPriority: ['', Validators.required],
            responsibleUser: ['', Validators.required],
        });

        if (this._data.id !== -1) {
            this.loadCaseData(this._data.id);
            this.buttonText = 'Update';
        } else {

            this.buttonText = 'Save';
        }

        this._commonService.loadCaseActionStatuses().subscribe(
            (statuses) => {
                this.actionStatuses = statuses;
            }
        );
        this._commonService.loadCaseActionTypes().subscribe(
            (types) => {
                this.actionTypes = types;
            }
        );
        this._commonService.departments$.subscribe(
            (depts) => {
                this.departments = depts;
            }
        );

    }

    loadCaseData(id: number) {
        this._service.getCaseActionById(id).subscribe({
            next: (caseData) => {

                setTimeout(() => {
                    this.composeForm.patchValue(caseData);
                });
            }
        });
    }

    onSubmit(): void {

        if (this.composeForm.valid) {
            this.composeForm.value.caseActionId === -1 ? this.saveData() : this.updateData();
        }
    }

    saveData() {
        const caseData = this.composeForm.value;
        this._service.saveCaseAction(caseData).subscribe({
            next: (response) => {
                this.matDialogRef.close(true);
            }
        });
    }

    updateData(): void {
        this._service.saveCaseAction(this.composeForm.value).subscribe({
            next: (response) => {
                this.matDialogRef.close(true);
            }
        });
    }

    Close(): void {
        this.matDialogRef.close();
    }
}