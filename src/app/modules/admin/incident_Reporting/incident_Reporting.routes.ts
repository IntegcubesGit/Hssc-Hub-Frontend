import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { Incident_ReportingListComponent } from './incident_Reporting/list/incident_Reporting.component';
import { Incident_ReportingService } from './incident_Reporting/incident_Reporting.service';
import { AddFormComponent } from './incident_Reporting/add-form/add-form.component';
import { GeneralInformationComponent } from './incident_Reporting/add-form/components/general_information/general_information.component';
import { InjuryComponent } from './incident_Reporting/add-form/components/injury/injury.component';
import { CommonService } from 'app/modules/common.service';
import { InvolvedPersonComponent } from './incident_Reporting/add-form/components/involvedPerson/involvedPerson.component';
import { PotentialLossComponent } from './incident_Reporting/add-form/components/potentialLoss/potentialLoss.component';
import { RootCausesComponent } from './incident_Reporting/add-form/components/rootCauses/rootCauses.component';
import { ActionComponent } from './incident_Reporting/add-form/components/caseActions/action.component';
import { CommentsComponent } from './incident_Reporting/add-form/components/comments/comments.component';
import { AttachmentsComponent } from './incident_Reporting/add-form/components/attachments/attachments.component';
import { SignatureComponent } from './incident_Reporting/add-form/components/signature/signature.component';


export default [
  {
    path: '',
    redirectTo: 'incident_Reporting',
    pathMatch: 'full',
  },
  {
    path: 'incident_Reporting',
    component: Incident_ReportingListComponent,
    resolve: {
      products: () => inject(Incident_ReportingService).getProducts(),
    },
  },
  {
    path: 'information/:id',
    component: AddFormComponent,
    resolve: {
      Statuses: () => inject(CommonService).loadAllCaseStatuses(),
      Categories: () => inject(CommonService).loadCaseCategories(),
      RiskCategories: () => inject(CommonService).loadRiskCategories(),
      Departments: () => inject(CommonService).loadDepartments(),
      Cases: () => inject(CommonService).loadCasesIdsAndTitles(),
      BusinessUnits:()=>inject(CommonService).loadBusinessUnits(),
      Sites:()=>inject(CommonService).loadCaseSites()
    },
    children:
      [
        {
          path: '',
          redirectTo: 'general-information',
          pathMatch: 'full',
        },
        { path: 'general-information', component: GeneralInformationComponent },
        { path: 'injury', component: InjuryComponent },
        { path: 'involvedPerson', component: InvolvedPersonComponent },
        { path: 'potentialLoss', component: PotentialLossComponent },
        { path: 'rootCauses', component: RootCausesComponent },
        { path: 'caseActions', component: ActionComponent },
        { path: 'comments', component: CommentsComponent },
        { path: 'attachments', component: AttachmentsComponent },
        { path: 'signatures', component: SignatureComponent },

      ],
  },
] as Routes;
