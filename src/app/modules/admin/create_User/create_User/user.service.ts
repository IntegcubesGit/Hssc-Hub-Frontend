import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  tap,
} from 'rxjs';
import { Pagination, User } from './user.type';
import { environment } from '../../../../../environment/environment';



@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly getUsersURL = `${environment.apiUrl}User/getAllUsers`
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject<Pagination | null>(null);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject<User[] | null>([]);
  constructor(private _httpClient: HttpClient) { }
  get pagination$(): Observable<Pagination | null> {
    return this._pagination.asObservable();
  }
  get user$(): Observable<User[] | null> {
    return this._users.asObservable();
  }


  getUsers( page: number = 0, size: number = 5,sort: string = 'name',order: 'asc' | 'desc' | '' = 'asc',search: string = ''): Observable<{ pagination: Pagination; users: User[];}> {
    return this._httpClient.get<{

      pagination: Pagination; users: User[];
    }>(this.getUsersURL, {
      params: { page: '' + page, size: '' + size, sort, order, search, },
    })
      .pipe(
        tap((response) => {
          this._pagination.next(response.pagination);
          this._users.next(response.users);
        })
      );
  }

}
