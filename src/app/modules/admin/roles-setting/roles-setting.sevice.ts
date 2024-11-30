import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppRole, Pagination } from './roles-setting.types';

@Injectable({ providedIn: 'root' })
export class ListSettingService {
    constructor(private _httpClient: HttpClient) {}

    private readonly getUserRolesURL = `${environment.apiUrl}User/GetUserRoles`;
    private readonly getMenuUrl = `${environment.apiUrl}Menu/GetMenu`
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject<Pagination | null>(null);
    private _roles: BehaviorSubject<AppRole[] | null> = new BehaviorSubject<
        AppRole[] | null
    >(null);

    getRoles() {
        return this._httpClient.get<any>(this.getUserRolesURL).pipe(tap());
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
}
