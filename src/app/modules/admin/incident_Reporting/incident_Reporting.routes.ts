import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Incident_ReportingComponent } from './incident_Reporting/incident_Reporting.component';
import { Incident_ReportingListComponent } from './incident_Reporting/list/incident_Reporting.component';
import { Incident_ReportingService } from './incident_Reporting/incident_Reporting.service';



export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'incident_Reporting',
    },
    {
        path: 'incident_Reporting',
        component: Incident_ReportingComponent,
        children: [
            {
                path: '',
                component: Incident_ReportingListComponent,
                resolve: {
                    brands: () => inject(Incident_ReportingService).getBrands(),
                    categories: () => inject(Incident_ReportingService).getCategories(),
                    products: () => inject(Incident_ReportingService).getProducts(),
                    tags: () => inject(Incident_ReportingService).getTags(),
                    vendors: () => inject(Incident_ReportingService).getVendors(),
                },
            },
        ],
    },
] as Routes;
