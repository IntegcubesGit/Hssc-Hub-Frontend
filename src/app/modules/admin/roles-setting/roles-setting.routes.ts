import { Routes } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { CreateComponent } from "./create/create.component";

export default [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
    },
    {
        path: 'list',
        component: ListComponent,
    },
    {
        path: 'create/:id',
        component: CreateComponent,
    },
] as Routes;
