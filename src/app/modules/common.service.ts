import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environment/environment';
import { ActionStatus, ActionType, BusinessUnit, CaseCategory, CaseStatus, Department, InjuryCategory, InjuryType, RiskCategory } from './common.model';
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
  private _cases$ = new BehaviorSubject<any[]>([]);
  private _sites$ = new BehaviorSubject<any[]>([]);


  private readonly apiUrl = environment.apiUrl;

  get cases$(): Observable<any[]> {
    return this._cases$.asObservable();
  }

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
  get caseSites$(): Observable<BusinessUnit[]> {
    return this._sites$.asObservable();
  }


  // Observable for Case Statuses
  get caseStatuses$(): Observable<CaseStatus[]> {
    return this._caseStatuses$.asObservable();
  }

  // Observable for Departments
  get departments$(): Observable<Department[]> {
    return this._departments$.asObservable();
  }

  loadCasesIdsAndTitles(): void {
    this._httpClient.get<any[]>(`${this.apiUrl}CommonFilters/getAllIncidentCasesIdsAndTitles/`)
      .subscribe(cases => this._cases$.next(cases));
  }

  // Method to fetch Case Categories and update the BehaviorSubject
  loadCaseCategories(): void {
    this._httpClient.get<CaseCategory[]>(`${this.apiUrl}CommonFilters/getAllCaseCategories`)
      .subscribe(categories => this._caseCategories$.next(categories));
  }

  // Method to fetch Risk Categories and update the BehaviorSubject
  loadRiskCategories(): void {
    this._httpClient.get<RiskCategory[]>(`${this.apiUrl}CommonFilters/getAllRiskCategories`)
      .subscribe(categories => this._riskCategories$.next(categories));
  }

  // Method to fetch Injury Types and update the BehaviorSubject
  loadInjuryTypes(): void {
    this._httpClient.get<InjuryType[]>(`${this.apiUrl}CommonFilters/getAllInjuryTypes`)
      .subscribe(types => this._injuryTypes$.next(types));
  }



  // Method to fetch Case Statuses and update the BehaviorSubject
  loadAllCaseStatuses(): void {
    this._httpClient.get<CaseStatus[]>(`${this.apiUrl}CommonFilters/getAllCaseStatuses`)
      .subscribe(statuses => this._caseStatuses$.next(statuses));
  }

  // Method to fetch Departments and update the BehaviorSubject
  loadDepartments(): void {
    this._httpClient.get<Department[]>(`${this.apiUrl}CommonFilters/getAllDepartments`)
      .subscribe(departments => this._departments$.next(departments));
  }


  // Method to fetch and return injury categories as an Observable
  loadInjuryCategory(): Observable<InjuryCategory[]> {
    return this._httpClient.get<InjuryCategory[]>(`${this.apiUrl}CommonFilters/getAllInjuryCategories`);
  }

  // Method to fetch and return injury types as an Observable
  loadInjuryType(): Observable<InjuryType[]> {
    return this._httpClient.get<InjuryType[]>(`${this.apiUrl}CommonFilters/getAllInjuryTypes`);
  }



  loadCaseActionStatuses(): Observable<ActionStatus[]> {
    return this._httpClient.get<ActionStatus[]>(`${this.apiUrl}CommonFilters/getAllActionStatuses`);
  }
  loadCaseActionTypes(): Observable<ActionType[]> {
    return this._httpClient.get<ActionType[]>(`${this.apiUrl}CommonFilters/getAllActionTypes`);
  }

  loadCaseSites(): void {
    this._httpClient.get<any[]>(`${this.apiUrl}CommonFilters/getAllSites`)
      .subscribe(sites => this._sites$.next(sites));
  }

  loadBusinessUnits(): void {
    this._httpClient.get<BusinessUnit[]>(`${this.apiUrl}CommonFilters/getAllBusinessUnits`)
      .subscribe(units => this._businessUnits$.next(units));
  }


}

