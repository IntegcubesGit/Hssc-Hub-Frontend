import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Incident_ReportingComponent } from './incident_Reporting/incident_Reporting.component';
import { Incident_ReportingListComponent } from './incident_Reporting/list/incident_Reporting.component';
import { Incident_ReportingService } from './incident_Reporting/incident_Reporting.service';
import { AddFormComponent } from './incident_Reporting/add-form/add-form.component';
import { CardComponent } from './incident_Reporting/add-form/components/card/card.component';
import { DrawerComponent } from './incident_Reporting/add-form/components/drawer/drawer.component';
import { FullscreenComponent } from './incident_Reporting/add-form/components/fullscreen/fullscreen.component';
import { HighlightComponent } from './incident_Reporting/add-form/components/highlight/highlight.component';
import { LoadingBarComponent } from './incident_Reporting/add-form/components/loading-bar/loading-bar.component';
import { MasonryComponent } from './incident_Reporting/add-form/components/masonry/masonry.component';
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
      component: Incident_ReportingComponent,
      children: [
        {
          path: '',
          component: Incident_ReportingListComponent,
          resolve: {
            products: () => inject(Incident_ReportingService).getProducts(),
          },
        },
        {
          path: 'Info/:id',
          component: AddFormComponent,
          children: [
            {
              path: '',
              redirectTo: 'sub/general_information',  
              pathMatch: 'full',
            },
            {
              path: 'sub',
              children: [
                {
                  path: '',
                  redirectTo: 'general_information', 
                  pathMatch: 'full',
                },
                { path: 'general_information', component: GeneralInformationComponent },
                { path: 'injury', component: InjuryComponent },
                { path: 'drawer', component: DrawerComponent },
                { path: 'fullscreen', component: FullscreenComponent },
                { path: 'highlight', component: HighlightComponent },
                { path: 'loading-bar', component: LoadingBarComponent },
                { path: 'masonry', component: MasonryComponent },
              ],
            },
          ],
        },
      ],
    },
  ] as Routes;
  