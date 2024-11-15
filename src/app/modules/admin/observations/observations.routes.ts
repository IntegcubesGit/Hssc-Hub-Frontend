import { inject } from '@angular/core';
import { Routes } from '@angular/router';


import { Incident_ReportingService } from './observations/observations.service';
import { AddFormComponent } from './observations/add-form/add-form.component';
import { GeneralInformationComponent } from './observations/add-form/components/general_information/general_information.component';
import { InjuryComponent } from './observations/add-form/components/injury/injury.component';
import { CommonService } from 'app/modules/common.service';
import { InvolvedPersonComponent } from './observations/add-form/components/involvedPerson/involvedPerson.component';
import { PotentialLossComponent } from './observations/add-form/components/potentialLoss/potentialLoss.component';
import { RootCausesComponent } from './observations/add-form/components/rootCauses/rootCauses.component';
import { ActionComponent } from './observations/add-form/components/caseActions/action.component';
import { CommentsComponent } from './observations/add-form/components/comments/comments.component';
import { AttachmentsComponent } from './observations/add-form/components/attachments/attachments.component';
import { SignatureComponent } from './observations/add-form/components/signature/signature.component';
import { Incident_ReportingListComponent } from './observations/list/observations.component';


export default [
  {
    path: '',
    redirectTo: 'observation-reporting',
    pathMatch: 'full',
  },
  {
    path: 'observation-reporting',
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
      Cases: () => inject(CommonService).loadCasesIdsAndTitles()
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
