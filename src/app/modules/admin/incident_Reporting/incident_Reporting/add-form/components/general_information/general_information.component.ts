import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseAlertComponent, FuseAlertService } from '@fuse/components/alert';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { AddFormComponent } from '../../add-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BusinessUnit, CaseCategory, CaseStatus, Department, RiskCategory } from 'app/modules/common.model';
import { CommonService } from 'app/modules/common.service';
import { Incident_ReportingService } from '../../../incident_Reporting.service';
@Component({
    selector: 'general_information',
    templateUrl: './general_information.component.html',
    styles: [
        `
            fuse-alert {
                margin: 16px 0;
            }
        `,
    ],
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        FuseHighlightComponent,
        FuseAlertComponent,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDividerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatButtonModule,
        MatDatepickerModule,
        ReactiveFormsModule
    ],
})
export class GeneralInformationComponent implements OnInit, OnDestroy {

    id: string | null = null;
    caseForm: FormGroup;
    caseCategories: CaseCategory[] = [];
    riskCategories: RiskCategory[] = [];
    departments: Department[] = [];
    businessUnits:BusinessUnit[] = [];
    caseStatuses:CaseStatus[]=[];
    constructor(
        private _fuseAlertService: FuseAlertService,
        private _fuseComponentsComponent: AddFormComponent,
        private route: ActivatedRoute, private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private router: Router,
        private _commonService:CommonService,
        private _service:Incident_ReportingService
    ) {
    
              
        this.route.params.subscribe(params => {
            console.log('Current route params:', params);
            this.id = params['id'];
          });


        this.createForm();

    }

 
    createForm() {
        this.caseForm = this.fb.group({
          caseTitle: ['', Validators.required],
          description: ['', Validators.required],
          caseDate: ['', Validators.required],
          departmentId: ['', Validators.required],
          dueDate: [''],
          riskCategoryId: ['', Validators.required],
          categoryId: ['', Validators.required],
          statusId: ['', Validators.required],
          technologyType: [''],
          workPlace: [''],
          isAuthorityNotified: [false],
          totalLoss: ['', Validators.required],
          immediateActionTaken: [''],
          comments: ['']
        });
    }
        
    ngOnInit(): void {
        this.fetchRiskCategories();
        this.fetchCaseCategories();
        this.fetchDepartments();
        this.fetchBusinessUnits();
        this.getAllCaseStatuses();
      }

      saveData() {
        if (this.caseForm.valid) {
          const caseData = this.caseForm.value;
          this._service.saveCase(caseData).subscribe({
            next: (response) => {
              console.log('Case saved successfully', response);
              this.router.navigate(['/case/information/', 22, 'general-information']);
            }
          });
        }
      }
      
      fetchRiskCategories(): void {
        this._commonService.getRiskCategories().pipe(
        ).subscribe(
          (data: RiskCategory[]) => {
            this.riskCategories = data;
          }
        );
      }

      fetchCaseCategories(): void {
        this._commonService.getCaseCategories().pipe(
        ).subscribe(
          (data: CaseCategory[]) => {
            debugger
            this.caseCategories = data;
          }
        );
      }

      fetchDepartments(): void {
        this._commonService.getDepartments().pipe(
        ).subscribe(
          (data: Department[]) => {
            this.departments = data;
          }
        );
      }


      fetchBusinessUnits(): void {
        this._commonService.getBusinessUnits().pipe(
      
        ).subscribe(
          (data: BusinessUnit[]) => {
            this.businessUnits = data;
          },
    
        );
      }

      getAllCaseStatuses(): void {
        this._commonService.getAllCaseStatuses().pipe(
      
        ).subscribe(
          (data: CaseStatus[]) => {
            this.caseStatuses = data;
          },
    
        );
      }
      



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss the alert via the service
     *
     * @param name
     */
    dismiss(name: string): void {
        // Dismiss
        this._fuseAlertService.dismiss(name);
    }

    /**
     * Show the alert via the service
     *
     * @param name
     */
    show(name: string): void {
        // Show
        this._fuseAlertService.show(name);
    }

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._fuseComponentsComponent.matDrawer.toggle();
    }

    showAlert(id: string | null): void {
        this.snackBar.open(`Current ID: ${id}`, 'Close', {
          duration: 3000, // Alert will close after 3 seconds
        });
      }

      onCancel() {
        this.router.navigate(['/case/incident_Reporting']);
      }

    ngOnDestroy(): void {
        // Unsubscribe to avoid memory leaks
       
      }
}
