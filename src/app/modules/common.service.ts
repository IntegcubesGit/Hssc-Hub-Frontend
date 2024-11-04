import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environment/environment';
import { BusinessUnit, CaseCategory, CaseStatus, Department, InjuryCategory, InjuryType, RiskCategory } from './common.model';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  // Private subjects for each entity
  private _caseCategories$ = new BehaviorSubject<CaseCategory[]>([]);
  private _riskCategories$ = new BehaviorSubject<RiskCategory[]>([]);
  private _injuryTypes$ = new BehaviorSubject<InjuryType[]>([]);
  private _businessUnits$ = new BehaviorSubject<BusinessUnit[]>([]);
  private _caseStatuses$ = new BehaviorSubject<CaseStatus[]>([]);
  private _departments$ = new BehaviorSubject<Department[]>([]);


  private readonly apiUrl = environment.apiUrl;




   // Observable for Case Categories
   get caseCategories$(): Observable<CaseCategory[]> {
    return this._caseCategories$.asObservable();
  }

  // Observable for Risk Categories
  get riskCategories$(): Observable<RiskCategory[]> {
    return this._riskCategories$.asObservable();
  }

  // Observable for Injury Types
  get injuryTypes$(): Observable<InjuryType[]> {
    return this._injuryTypes$.asObservable();
  }

  // Observable for Business Units
  get businessUnits$(): Observable<BusinessUnit[]> {
    return this._businessUnits$.asObservable();
  }

  // Observable for Case Statuses
  get caseStatuses$(): Observable<CaseStatus[]> {
    return this._caseStatuses$.asObservable();
  }

  // Observable for Departments
  get departments$(): Observable<Department[]> {
    return this._departments$.asObservable();
  }

 

  // Method to fetch Case Categories and update the BehaviorSubject
  loadCaseCategories(): void {
    this._httpClient.get<CaseCategory[]>(`${this.apiUrl}GeneralFilters/getAllCaseCategories`)
      .subscribe(categories => this._caseCategories$.next(categories));
  }

  // Method to fetch Risk Categories and update the BehaviorSubject
  loadRiskCategories(): void {
    this._httpClient.get<RiskCategory[]>(`${this.apiUrl}GeneralFilters/getAllRiskCategories`)
      .subscribe(categories => this._riskCategories$.next(categories));
  }

  // Method to fetch Injury Types and update the BehaviorSubject
  loadInjuryTypes(): void {
    this._httpClient.get<InjuryType[]>(`${this.apiUrl}GeneralFilters/getAllInjuryTypes`)
      .subscribe(types => this._injuryTypes$.next(types));
  }

  // Method to fetch Business Units and update the BehaviorSubject
  loadBusinessUnits(): void {
    this._httpClient.get<BusinessUnit[]>(`${this.apiUrl}GeneralFilters/getAllBusinessUnits`)
      .subscribe(units => this._businessUnits$.next(units));
  }

  // Method to fetch Case Statuses and update the BehaviorSubject
  loadAllCaseStatuses(): void {
    this._httpClient.get<CaseStatus[]>(`${this.apiUrl}GeneralFilters/getAllCaseStatuses`)
      .subscribe(statuses => this._caseStatuses$.next(statuses));
  }

  // Method to fetch Departments and update the BehaviorSubject
  loadDepartments(): void {
    this._httpClient.get<Department[]>(`${this.apiUrl}GeneralFilters/getAllDepartments`)
      .subscribe(departments => this._departments$.next(departments));
  }
  

     // Method to fetch and return injury categories as an Observable
     loadInjuryCategory(): Observable<InjuryCategory[]> {
      return this._httpClient.get<InjuryCategory[]>(`${this.apiUrl}GeneralFilters/getAllInjuryCategories`);
  }

  // Method to fetch and return injury types as an Observable
  loadInjuryType(): Observable<InjuryType[]> {
      return this._httpClient.get<InjuryType[]>(`${this.apiUrl}GeneralFilters/getAllInjuryTypes`);
  }



}

