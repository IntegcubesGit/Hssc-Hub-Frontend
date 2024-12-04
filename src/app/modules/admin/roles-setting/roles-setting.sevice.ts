import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppRole, Pagination } from './roles-setting.types';

@Injectable({ providedIn: 'root' })
export class ListSettingService {
    constructor(private _httpClient: HttpClient) {}

    private readonly getUserRolesURL = `${environment.apiUrl}Roles/getRoles`;
    private readonly getMenuUrl = `${environment.apiUrl}Roles/GetMenu`
    private readonly saveRoles = `${environment.apiUrl}Roles/SaveRole`
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject<Pagination | null>(null);
    private _roles: BehaviorSubject<AppRole[] | null> = new BehaviorSubject<
        AppRole[] | null
    >(null);

    // getRoles() {
    //     return this._httpClient.get<any>(this.getUserRolesURL).pipe(tap());
    // }

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

    saveRolesData(roleData,  selectedNodes): Observable<any>{
        const menuIds = selectedNodes
        .filter(node => node.checked) // Only include checked nodes
        .map(node => node.id);
        const data = { roleData, menuIds };
        return this._httpClient.post(`${this.saveRoles}`, data);
    }


}

