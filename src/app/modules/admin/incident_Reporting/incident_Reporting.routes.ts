import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { Incident_ReportingListComponent } from './incident_Reporting/list/incident_Reporting.component';
import { Incident_ReportingService } from './incident_Reporting/incident_Reporting.service';
import { AddFormComponent } from './incident_Reporting/add-form/add-form.component';
import { GeneralInformationComponent } from './incident_Reporting/add-form/components/general_information/general_information.component';
import { InjuryComponent } from './incident_Reporting/add-form/components/injury/injury.component';


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
        
      },
      children: [
        {
          path: '',
          redirectTo: 'general-information',
          pathMatch: 'full',
        },
            { path: 'general-information', component: GeneralInformationComponent },
            { path: 'injury', component: InjuryComponent },
       
      ],
    },
  ] as Routes;
  