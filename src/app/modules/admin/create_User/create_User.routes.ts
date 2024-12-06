import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AddUserComponent } from './create_User/add-form/add-user.component';
import { UserListComponent } from './create_User/user-list/user-list.component';
import { UserListService } from './create_User/user-list.service';
import { SettingsGeneralInfoComponent } from './create_User/add-form/General-Information/General-Info.component';
import { SitesComponent } from './create_User/add-form/Sites/sites.component';

export default [
    {
        path: '',
        redirectTo: 'users-list',
        pathMatch: 'full',
    },
    {
        path: 'users-list',
        component: UserListComponent,
        resolve: {
            products: () => inject(UserListService).getUsers(),
        },
    },
    {
        path: 'user-info/:id',
        component: AddUserComponent,
        children: [ // Define child routes for AddUserComponent
            {
                path: '',
                redirectTo: 'general-info', // Default child route
                pathMatch: 'full',
            },
            {
                path: 'general-info',
                component: SettingsGeneralInfoComponent, // General Info Component
            },
            {
                path: 'sites-info',
                component: SitesComponent, // Sites Component
            },
        ],
    },
] as Routes;
