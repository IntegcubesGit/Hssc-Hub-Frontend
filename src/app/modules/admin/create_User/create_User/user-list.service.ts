import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../../environment/environment';
import { Pagination, User } from './user.type';

@Injectable({ providedIn: 'root' })
export class UserListService {
    private readonly getUsersURL = `${environment.apiUrl}User/getAllUsers`;
    private readonly getUserWithId = `${environment.apiUrl}User/getUserById`;
    private readonly deleteUser = `${environment.apiUrl}LogInSignUp/DeleteUser`;
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject<Pagination | null>(null);

    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject<
        User[] | null
    >([]);

    private _selectedPanel: BehaviorSubject<string> =
        new BehaviorSubject<string>('generalInfo');

    private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private _formData = new BehaviorSubject<any>(null);

    constructor(private _httpClient: HttpClient) {}

    formData$ = this._formData.asObservable();

    // setFormData(data: any): void {
    //     this._formData.next(data);
    // }
    setFormData(data: any): void {
        const currentData = this._formData.value; // Get the current state of form data
        if (typeof currentData === 'object' && currentData !== null) {
            this._formData.next({ ...currentData, ...data }); // Merge new data into the existing object
        } else {
            this._formData.next(data); // If currentData is not an object, replace it
        }
    }

    getFormData(): any {
        return this._formData.value;
    }
    get pagination$(): Observable<Pagination | null> {
        return this._pagination.asObservable();
    }

    get user$(): Observable<User[] | null> {
        return this._users.asObservable();
    }

    get selectedPanel$(): Observable<string> {
        return this._selectedPanel.asObservable();
    }

    pannelvalue(panelName: string) {
        this._selectedPanel.next(panelName);
    }

    getUsers(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: Pagination; users: User[] }> {
        return this._httpClient
            .get<{
                pagination: Pagination;
                users: User[];
            }>(this.getUsersURL, {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._users.next(response.users);
                })
            );
    }

    getUserById(id: string): Observable<any> {
        return this._httpClient
            .get<any>(`${this.getUserWithId}?userId=${id}`)
            .pipe(
                tap((user) => {
                    this.userSubject.next(user);
                })
            );
    }

    get getUserById$(): Observable<any> {
        return this.userSubject.asObservable();
    }

    deleteUserById(userId: string): Observable<any> {
        return this._httpClient
            .delete<any>(`${this.deleteUser}?userId=${userId}`)
            .pipe(
                tap(() => {
                    const updatedUsers = this._users.value.filter(
                        (user) => user.id !== Number(userId)
                    );
                    this._users.next(updatedUsers);
                })
            );
    }
}
