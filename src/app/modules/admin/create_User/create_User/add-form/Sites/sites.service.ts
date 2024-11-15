import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import {
    BehaviorSubject,
    Observable,
    filter,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SitesService {

    constructor(private _httpClient: HttpClient) {}
    private readonly getSitesURL = `${environment.apiUrl}CommonFilters/GetAllSites`

    getSites() {
        return this._httpClient.get<any>(this.getSitesURL).pipe(
            tap()
        );
    }

}
