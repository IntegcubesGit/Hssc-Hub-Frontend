import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppRole, Pagination } from './roles-setting.types';
import { NumericDictionary } from 'lodash';

@Injectable({ providedIn: 'root' })
export class ListSettingService {
    constructor(private _httpClient: HttpClient) {}

    private readonly getUserRolesURL = `${environment.apiUrl}Roles/getRoles`;
    private readonly getMenuUrl = `${environment.apiUrl}Roles/GetMenu`
    private readonly saveRoles = `${environment.apiUrl}Roles/SaveRole`
    private readonly getDataById = `${environment.apiUrl}Roles/getMenuById`
    private readonly updateRoleAndMenu = `${environment.apiUrl}Roles/updateRole`
    private readonly deleteRole = `${environment.apiUrl}Roles/deleteRole`;
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject<Pagination | null>(null);
    private _roles: BehaviorSubject<AppRole[] | null> = new BehaviorSubject<
        AppRole[] | null
    >(null);


    getRoles(
        page: number = 0,
        size: number = 25,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: Pagination; roles: AppRole[] }> {
        return this._httpClient
            .get<{
                pagination: Pagination;
                roles: AppRole[];
            }>(this.getUserRolesURL, {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._roles.next(response.roles);
                })
            );
    }

    getMenu(){
        return this._httpClient.get<any>(this.getMenuUrl).pipe(tap());
    }

    get pagination$(): Observable<Pagination | null> {
        return this._pagination.asObservable();
    }

    get roles$(): Observable<AppRole[] | null> {
        return this._roles.asObservable();
    }

    saveRolesData(roleData, checkedNodes): Observable<any>{
        const data = { roleData, menuIds: checkedNodes };
        return this._httpClient.post(`${this.saveRoles}`, data);
    }

    getMenuRoleById(roleId: number){
        return this._httpClient.get<any>(`${this.getDataById}?userId=${roleId}`).pipe(tap());
    }

    updateMenusInfo(roleid, roleData, checkedNodes): Observable<any> {
        const data = { roleid, roleData, menuIds: checkedNodes };
        return this._httpClient.put(`${this.updateRoleAndMenu}`, data);
    }

    deleteRoleById(roleId: string): Observable<any> {
        return this._httpClient
            .delete<any>(`${this.deleteRole}?roleId=${roleId}`)
            .pipe(
                tap(() => {
                    const updatedRoles = this._roles.value.filter(
                        (role) => role.id !== Number(roleId)
                    );
                    this._roles.next(updatedRoles);

                    // Update the pagination count
                const currentPagination = this._pagination.value;
                if (currentPagination) {
                    const updatedPagination = {
                        ...currentPagination,
                        length: currentPagination.length - 1, // Decrement total count
                    };
                    this._pagination.next(updatedPagination);
                }
                })
            );

    }


}

