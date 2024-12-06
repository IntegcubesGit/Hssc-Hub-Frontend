import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { observationsListComponent } from './observations/list/observation_list.component';
import { Incident_ReportingService } from './observations/observations.service';
import { AddFormComponent } from './observations/add-form/add-form.component';
import { GeneralInformationComponent } from './observations/add-form/components/general_information/general_information.component';
import { CommonService } from '../../../../app/modules/common.service';
import { PotentialLossComponent } from './observations/add-form/components/potentialLoss/potentialLoss.component';
import { ActionComponent } from './observations/add-form/components/caseActions/action.component';
import { CommentsComponent } from './observations/add-form/components/comments/comments.component';
import { AttachmentsComponent } from './observations/add-form/components/attachments/attachments.component';
import { SignatureComponent } from './observations/add-form/components/signature/signature.component';


export default [
  {
    path: '',
    redirectTo: 'observations',
    pathMatch: 'full',
  },
  {
    path: 'observations',
    component: observationsListComponent,
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
          redirectTo: 'general_information_observation',
          pathMatch: 'full',
        },
        { path: 'general_information_observation', component: GeneralInformationComponent },
        { path: 'potentialLoss', component: PotentialLossComponent },
        { path: 'caseActions', component: ActionComponent },
        { path: 'comments', component: CommentsComponent },
        { path: 'attachments', component: AttachmentsComponent },
        { path: 'signatures', component: SignatureComponent },

      ],
  },
] as Routes;
