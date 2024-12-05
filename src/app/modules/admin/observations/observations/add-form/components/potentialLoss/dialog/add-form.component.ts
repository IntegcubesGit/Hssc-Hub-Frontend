import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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
import { Incident_ReportingService } from '../../../../observations.service';

@Component({
    selector: 'involved-compose',
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
    ],
})
export class AddformComponent implements OnInit {
    composeForm: UntypedFormGroup;
    action:string="Saved";
    buttonText = 'Save'; 

    constructor(
        public matDialogRef: MatDialogRef<AddformComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _commonService: CommonService,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _service: Incident_ReportingService,
      
    ) {

    }

    ngOnInit(): void {
        this.composeForm = this._formBuilder.group({
            casePotentialLossId: [-1, Validators.required],
            caseId:[String(this._data.caseId), Validators.required],
            comments: ['', Validators.required],
            severity: ['', Validators.required],
            lossAmount: ['', Validators.required],
        });
      
        if (this._data.id !== -1) {
           this.loadCaseData(this._data.id);
              this.buttonText = 'Update';
        } else {
            
          this.buttonText = 'Save';
        }
    }

    loadCaseData(id: string) {
        this._service.getPotentialLossById(id).subscribe({
            next: (caseData) => {
                debugger
                setTimeout(() => {

                    this.composeForm.patchValue(caseData);
                });
            }
        });
    }

    onSubmit(): void {
        if (this.composeForm.valid) {
             this.saveData();
        }
    }

    saveData() {
        const caseData = this.composeForm.value;
        this._service.savePotentialLoss(caseData).subscribe({
            next: (response) => {
                this.matDialogRef.close(true);
            }
        });
    }


    Close(): void {
        this.matDialogRef.close();
    }


}
