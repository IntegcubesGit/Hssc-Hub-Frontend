import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    BehaviorSubject,
    Observable,
    tap,
} from 'rxjs';
import { Pagination, Case} from './incident_Reporting.types';
import { environment } from 'environment/environment';


@Injectable({ providedIn: 'root' })
export class Incident_ReportingService {
 
  private readonly getCasesURL = `${environment.apiUrl}Cases/IncidentReporting_GetAllCases`
  
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    private _cases: BehaviorSubject<Case[] | null> =
        new BehaviorSubject(null);
 

    constructor(private _httpClient: HttpClient) {}

    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    get cases$(): Observable<Case[]> {
        return this._cases.asObservable();
    }



    // getBrands(): Observable<InventoryBrand[]> {
    //     return this._httpClient
    //         .get<InventoryBrand[]>('api/apps/ecommerce/inventory/brands')
    //         .pipe(
    //             tap((brands) => {
    //                 this._brands.next(brands);
    //             })
    //         );
    // }






    /**
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getProducts(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: Pagination;
        cases: Case[];
    }> {
        return this._httpClient.get<{
                pagination: Pagination;  cases: Case[]; }>(this.getCasesURL, {
                params: { page: '' + page, size: '' + size,sort, order,search, },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._cases.next(response.cases);
                })
            );
    }

}
