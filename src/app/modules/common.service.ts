import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environment/environment';
import { BusinessUnit, CaseCategory, CaseStatus, Department, InjuryType, RiskCategory } from './common.model';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  private readonly apiUrl = environment.apiUrl;

  // Method to get Case Categories
  getCaseCategories(): Observable<CaseCategory[]> {
    return this._httpClient.get<CaseCategory[]>(`${this.apiUrl}GeneralFilters/getAllCaseCategories`);
  }

  // Method to get Risk Categories
  getRiskCategories(): Observable<RiskCategory[]> {
    return this._httpClient.get<RiskCategory[]>(`${this.apiUrl}GeneralFilters/getAllRiskCategories`);
  }
  // Method to get Injury Types
  getInjuryTypes(): Observable<InjuryType[]> {
    return this._httpClient.get<InjuryType[]>(`${this.apiUrl}GeneralFilters/getAllInjuryTypes`);
  }

    // Method to get Business Units
  getBusinessUnits(): Observable<BusinessUnit[]> {
    return this._httpClient.get<BusinessUnit[]>(`${this.apiUrl}GeneralFilters/getAllBusinessUnits`);
  }

    // Method to get  Case Statuses
    getAllCaseStatuses(): Observable<CaseStatus[]> {
      return this._httpClient.get<CaseStatus[]>(`${this.apiUrl}GeneralFilters/getAllCaseStatuses`);
    }

    getDepartments(): Observable<Department[]> {
      return this._httpClient.get<Department[]>(`${this.apiUrl}GeneralFilters/getAllDepartments`);
    }

  

}

