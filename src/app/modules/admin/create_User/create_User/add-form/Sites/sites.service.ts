import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SitesService {
    constructor(private _httpClient: HttpClient) {}
    private readonly getSitesURL = `${environment.apiUrl}User/GetAllSites`;
    private readonly getUserRolesURL = `${environment.apiUrl}User/GetUserRoles`;
    private readonly saveUserData = `${environment.apiUrl}LogInSignUp/RegisterUser`;
    private readonly updateUserData = `${environment.apiUrl}LogInSignUp/UpdateUser`;

    getSites() {
        return this._httpClient.get<any>(this.getSitesURL).pipe(tap());
    }

    getRoles(){
        return this._httpClient.get<any>(this.getUserRolesURL).pipe(tap());
    }

    saveUserInfo(payload: any): Observable<any> {
        return this._httpClient.post(`${this.saveUserData}`, payload);
    }

    updateUserInfo(payload: any): Observable<any> {
        return this._httpClient.put(`${this.updateUserData}`, payload);
    }


}
