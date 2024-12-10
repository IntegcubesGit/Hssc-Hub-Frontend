import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  tap,
} from 'rxjs';
import { Pagination, Observation } from './observations.types';
import { environment } from '../../../../../environment/environment';



@Injectable({ providedIn: 'root' })
export class ObservationService {

  private readonly getObservationsURL = `${environment.apiUrl}Observations/GetAllObservations`
  private readonly saveCasesURL = `${environment.apiUrl}Observations/CreateOrUpdateObservation`;
  private readonly getByIdCaseURL = `${environment.apiUrl}Observations/GetObservationById/`;
  private readonly updateCasesURL = `${environment.apiUrl}Observations/CreateOrUpdateObservation`;

  //Potential Loss
  private readonly GetPotentialLoss = `${environment.apiUrl}Observations/Observations_GetAllPotentialLosses/`;
  private readonly GetPotentialLossByIdURL = `${environment.apiUrl}Observations/Observations_GetPotentialLossById/`;
  private readonly getSavePotentialLoss = `${environment.apiUrl}Observations/Observations_CreateOrUpdatePotentialLoss/`;

  // Case Actions
  private readonly getAllCaseActionsURL = `${environment.apiUrl}Observations/Observations_GetAllCaseActions/`;
  private readonly getCaseActionByIdURL = `${environment.apiUrl}Observations/Observations_GetCaseActionById/`;
  private readonly saveOrUpdateCaseActionByIdURL = `${environment.apiUrl}Observations/Observations_CreateOrUpdateCaseAction/`;

  // Case Comments
  private readonly getAllCaseCommentsURL = `${environment.apiUrl}Observations/Observations_GetAllCaseComments/`;
  private readonly getCaseCommentByIdURL = `${environment.apiUrl}Observations/Observations_GetCaseCommentById/`;
  private readonly saveOrUpdateCaseComment = `${environment.apiUrl}Observations/Observations_CreateOrUpdateCaseComment/`;
  // Case Attachments
  private readonly getAllCaseAttachmentsURL = `${environment.apiUrl}File/GetAllCaseFiles/`;
  private readonly uploadCaseAttachmentsURL = `${environment.apiUrl}File/uploadCaseFile/`;
  private readonly downloadCaseAttachmentsURL = `${environment.apiUrl}File/downloadCaseFile/`;
  private readonly deleteCaseAttachmentsURL = `${environment.apiUrl}File/deleteCaseFile/`;

  // Case Signatures
  private readonly getCaseSignaturesListURL = `${environment.apiUrl}Observations/Observations_GetAllCaseSignatures/`;
  private readonly reviewCaseURL = `${environment.apiUrl}Observations/Observations_ReviewIncidentCase/`;


  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject<Pagination | null>(null);
  // private _cases: BehaviorSubject<Case[] | null> = new BehaviorSubject<Case[] | null>(null);
  private _cases: BehaviorSubject<Observation[] | null> = new BehaviorSubject<Observation[] | null>(null);

  constructor(private _httpClient: HttpClient) { }

  get pagination$(): Observable<Pagination | null> {
    return this._pagination.asObservable();
  }

  get cases$(): Observable<Observation[] | null> {
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
    size: number = 25,
    sort: string = 'case',
    order: 'asc' | 'desc' | '' = 'asc',
    search: string = ''
  ): Observable<{
    pagination: Pagination;
    observations: Observation[];
  }> {
    return this._httpClient.get<{
      pagination: Pagination; observations: Observation[];
    }>(this.getObservationsURL, {
      params: { page: '' + page, size: '' + size, sort, order, search, },
    })
      .pipe(
        tap((response) => {
          this._pagination.next(response.pagination);
          this._cases.next(response.observations);
        })
      );
  }

  saveCase(caseData: Observation): Observable<any> {
    return this._httpClient.post(`${this.saveCasesURL}`, caseData);
  }

  updateCase(caseData: any): Observable<any> {

    return this._httpClient.post(`${this.updateCasesURL}`, caseData);
  }

  getCaseById(id: string): Observable<any> {
    return this._httpClient.get<any>(`${this.getByIdCaseURL}${id}`);
  }


  // Case Actions calls
  getAllCaseActions(id): Observable<any> {
    return this._httpClient.get<any>(`${this.getAllCaseActionsURL}${id}`);
  }

  getCaseActionById(id: number): Observable<any> {
    return this._httpClient.get<any>(`${this.getCaseActionByIdURL}${id}`);
  }

  saveCaseAction(caseActionData: any): Observable<any> {
    return this._httpClient.post(`${this.saveOrUpdateCaseActionByIdURL}`, caseActionData);
  }



  // Potential Loss calls

  getAllPotentialLoss(id): Observable<any> {
    return this._httpClient.get<any>(`${this.GetPotentialLoss}${id}`);
  }


  getPotentialLossById(id: string): Observable<any> {
    return this._httpClient.get<any>(`${this.GetPotentialLossByIdURL}${id}`);
  }


  savePotentialLoss(caseData: Observation): Observable<any> {
    return this._httpClient.post(`${this.getSavePotentialLoss}`, caseData);
  }


  //case comments
  getAllCaseComments(caseId): Observable<any> {
    return this._httpClient.get<any>(`${this.getAllCaseCommentsURL}${caseId}`);
  }
  getCaseCommentById(id): Observable<any> {
    return this._httpClient.get<any>(`${this.getCaseCommentByIdURL}${id}`);
  }
  saveCaseComment(caseComment: any): Observable<any> {
    return this._httpClient.post<any>(`${this.saveOrUpdateCaseComment}`, caseComment);
  }

  getAllCaseAttachments(caseId: string): Observable<any> {
    return this._httpClient.get<any>(`${this.getAllCaseAttachmentsURL}${caseId}`);
  }
  uploadCaseAttachment(folderName: string, caseId: string, remarks: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('caseId', caseId);
    formData.append('remarks', remarks);
    formData.append('folderName', folderName);

    return this._httpClient.post<any>(
      `${this.uploadCaseAttachmentsURL}`, formData
    );
  }

  downloadCaseAttachment(folderName: string, fileName: string): Observable<Blob> {
    return this._httpClient.get<Blob>(`${this.downloadCaseAttachmentsURL}${folderName}/${fileName}`, {
      responseType: 'blob' as 'json'
    });
  }

  deleteCaseAttachment(folderName: string, caseId: string, fileName: string): Observable<any> {
    return this._httpClient.delete<any>(`${this.deleteCaseAttachmentsURL}${caseId}/${fileName}`);
  }

  getAllCaseSignatures(caseId: string): Observable<any> {
    return this._httpClient.get<any>(`${this.getCaseSignaturesListURL}${caseId}`);
  }
  reviewCase(caseId: string): Observable<any> {
    return this._httpClient.get<any>(`${this.reviewCaseURL}${caseId}`);
  }

}
