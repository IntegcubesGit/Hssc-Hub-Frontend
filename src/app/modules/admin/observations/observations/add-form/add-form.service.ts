import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AddFormService {
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}
    // getBrands(): Observable<any[]> {
      
    //     return this._httpClient
    //         .get<any[]>('api/apps/ecommerce/inventory/brands')
    //         .pipe(
    //             tap((brands) => {
    //                 this._brands.next(brands);
    //             })
    //         );
    // }


}
