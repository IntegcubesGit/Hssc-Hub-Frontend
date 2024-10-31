import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environment/environment';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private _httpClient: HttpClient
  ) { }
  private readonly getCasesURL = `${environment.apiUrl}GeneralFilters/getAllCaseCategories`
  
  getBrands(): Observable<InventoryBrand[]> {
    return this._httpClient
        .get<InventoryBrand[]>('api/apps/ecommerce/inventory/brands')
        .pipe(
            tap((brands) => {
                this._brands.next(brands);
            })
        );
}

}

