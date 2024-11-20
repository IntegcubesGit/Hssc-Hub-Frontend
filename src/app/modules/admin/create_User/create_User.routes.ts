import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AddUserComponent } from './create_User/add-form/add-user.component';
import { UserListComponent } from './create_User/user-list/user-list.component';
import { UserService } from './create_User/user.service';

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
            products: () => inject(UserService).getUsers(),
        },
    },
    {
        path: 'user-info/:id',
        component: AddUserComponent,
    },
] as Routes;
