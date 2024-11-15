import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent, FuseAlertService } from '@fuse/components/alert';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { AddFormComponent } from '../../add-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Incident_ReportingService } from '../../../observations.service';
import { AlertService } from 'app/core/alert/alert.service';
import { Case } from '../../../observations.types';
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
  connectedCases: Case[] = [];
  departments: Department[] = [];
  businessUnits: BusinessUnit[] = [];
  caseStatuses: CaseStatus[] = [];
  action: string = "Saved";
  buttonText = 'Save';
  constructor(
    private _fuseAlertService: FuseAlertService,
    private _fuseComponentsComponent: AddFormComponent,
    private route: ActivatedRoute, private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private _commonService: CommonService,
    private _service: Incident_ReportingService,
    private _alertService: AlertService
  ) {

    this.createForm();

  }


  createForm() {
    this.caseForm = this.fb.group({
      caseId: [-1, Validators.required],
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
      comments: [''],
      connectedCaseId:['']
    });
  }

  ngOnInit(): void {
    this._commonService.riskCategories$.subscribe(data => this.riskCategories = data);
    this._commonService.caseCategories$.subscribe(data => this.caseCategories = data);
    this._commonService.departments$.subscribe(data => this.departments = data);
    this._commonService.businessUnits$.subscribe(data => this.businessUnits = data);
    this._commonService.caseStatuses$.subscribe(data => this.caseStatuses = data);
    this._commonService.cases$.subscribe(data => this.connectedCases = data);

    this.route.parent?.params.subscribe(params => {
      this.id = params['id'];
      if (this.id !== null && this.id !== '-1') {
        this.loadCaseData(this.id);
        this.buttonText = 'Update';
      }
      else {
        this.buttonText = 'Save';
      }
    });

  }

  loadCaseData(id: string) {
    this._service.getCaseById(id).subscribe({
      next: (caseData) => {
        this.caseForm.patchValue(caseData);
      }
    });
  }

  saveData() {

    if (this.caseForm.valid) {
      const caseData = this.caseForm.value;
      this._service.saveCase(caseData).subscribe({
        next: (response) => {
          const caseId = BigInt(response.caseId);
          this.router.navigate(['/case/information/', caseId, 'general-information']);
          this._alertService.showSuccess("Case General Information Saved Successfully");
        }
      });
    }
  }

  updateData(): void {
    if (this.caseForm.valid) {
      this._service.updateCase(this.caseForm.value).subscribe(response => {
        this._alertService.showSuccess("Case General Information updated Successfully");
      });
    }
  }

  onSubmit(): void {

    if (this.id === '-1') {
      this.saveData();
    } else {
      this.updateData();
    }
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle the drawer
   */
  toggleDrawer(): void {
    // Toggle the drawer
    this._fuseComponentsComponent.matDrawer.toggle();
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  onCancel() {
    this.router.navigate(['/case/incident_Reporting']);
  }

  ngOnDestroy(): void {


  }
}
