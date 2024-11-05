import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    BehaviorSubject,
    catchError,
    map,
    Observable,
    of,
    tap,
} from 'rxjs';
import { Pagination, Case} from './incident_Reporting.types';
import { environment } from 'environment/environment';



@Injectable({ providedIn: 'root' })
export class Incident_ReportingService {
 
private readonly getCasesURL = `${environment.apiUrl}Cases/IncidentReporting_GetAllCases`
private readonly saveCasesURL = `${environment.apiUrl}Cases/IncidentReporting_CreateAnIncidentReportCase`;
private readonly  getByIdCaseURL = `${environment.apiUrl}Cases/IncidentReporting_GetIncidentCaseById/`;
private readonly  updateCasesURL = `${environment.apiUrl}Cases/IncidentReporting_UpdateIncidentReportCase`;

//injurry
private readonly saveCaseInjuryURL = `${environment.apiUrl}Cases/IncidentReporting_CreateIncidentReportCaseInjury`;
private readonly CaseInjuryByIdURL = `${environment.apiUrl}Cases/IncidentReporting_GetIncidentReportCaseInjuryById/`;
private readonly getAllCaseInjuryURL = `${environment.apiUrl}Cases/IncidentReporting_GetAllIncidentReportCaseInjuries/`;
private readonly  updateCasesInjuryURL = `${environment.apiUrl}Cases/IncidentReporting_UpdateIncidentReportCaseInjury`;


//Involved Persons
private readonly saveCaseInvolvedPersonsURL = `${environment.apiUrl}Cases/IncidentReporting_AddInvolvedPerson`;
private readonly CaseInvolvedPersonsByIdURL = `${environment.apiUrl}Cases/IncidentReporting_GetInvolvedPersonById/`;
private readonly getAllCaseInvolvedPersonsURL = `${environment.apiUrl}Cases/IncidentReporting_GetInvolvedPersons/`;
private readonly updateCasesCaseInvolvedPersonURL = `${environment.apiUrl}Cases/IncidentReporting_UpdateInvolvedPerson`;

//Involved Persons
private readonly GetPotentialLoss=  `${environment.apiUrl}Cases/IncidentReporting_GetAllPotentialLosses/`;
private readonly GetPotentialLossByIdURL = `${environment.apiUrl}Cases/IncidentReporting_GetPotentialLossById/`;
private readonly getSavePotentialLoss = `${environment.apiUrl}Cases/IncidentReporting_CreateOrUpdatePotentialLoss/`;


//Involved Persons
private readonly GetAllRootCausesURL=  `${environment.apiUrl}Cases/IncidentReporting_GetAllRootCauses/`;
private readonly SaveRootCausesURL = `${environment.apiUrl}Cases/IncidentReporting_CreateOrUpdateRootCause/`;
 private readonly getRootCausesById = `${environment.apiUrl}Cases/IncidentReporting_GetRootCauseById/`;








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

   

    saveCase(caseData: Case): Observable<any> {
        return this._httpClient.post(`${this.saveCasesURL}`, caseData);
      }

      updateCase(caseData: any): Observable<any> {

        return this._httpClient.put(`${this.updateCasesURL}`, caseData);
      }
      


      getCaseById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${this.getByIdCaseURL}${id}`);
      }


      //injury calls

      getAllinjury(id): Observable<any> {
        return this._httpClient.get<any>(`${this.getAllCaseInjuryURL}${id}`);
    }


      getCaseInjuryById(id: string): Observable<any> {
        return this._httpClient.get<any>(`${this.CaseInjuryByIdURL}${id}`);
      }


      saveinjury(caseData: Case): Observable<any> {
        return this._httpClient.post(`${this.saveCaseInjuryURL}`, caseData);
      }

      updateinjury(caseData: any): Observable<any> {

        return this._httpClient.put(`${this.updateCasesInjuryURL}`, caseData);
      }



 //involved persns calls

 getAllinvolvedpersns(id): Observable<any> {
    return this._httpClient.get<any>(`${this.getAllCaseInvolvedPersonsURL}${id}`);
}


  getCaseinvolvedpersnsById(id: string): Observable<any> {
    return this._httpClient.get<any>(`${this.CaseInvolvedPersonsByIdURL}${id}`);
  }


  saveinvolvedpersns(caseData: Case): Observable<any> {
    return this._httpClient.post(`${this.saveCaseInvolvedPersonsURL}`, caseData);
  }

  updateinvolvedpersns(caseData: any): Observable<any> {
    return this._httpClient.put(`${this.updateCasesCaseInvolvedPersonURL}`, caseData);
  }



 //involved persns calls

 getAllPotentialLoss(id): Observable<any> {
    return this._httpClient.get<any>(`${this.GetPotentialLoss}${id}`);
}


getPotentialLossById(id: string): Observable<any> {
    return this._httpClient.get<any>(`${this.GetPotentialLossByIdURL}${id}`);
  }


  savePotentialLoss(caseData: Case): Observable<any> {
    return this._httpClient.post(`${this.getSavePotentialLoss}`, caseData);
  }
  


 //involved persns calls

 getAllRootCausesURL(id): Observable<any> {
    return this._httpClient.get<any>(`${this.GetAllRootCausesURL}${id}`);
}


saveRootCauses(caseData: Case): Observable<any> {
    return this._httpClient.post(`${this.SaveRootCausesURL}`, caseData);
  }
  
  getRootCausesDataById(id): Observable<any> {
    return this._httpClient.get<any>(`${this.getRootCausesById}${id}`);
}
  
}
