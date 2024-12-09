import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';

import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AlertService } from 'app/layout/common/alert/alert.service';
import {
    Observable,
    Subject,
    debounceTime,
    map,
    merge,
    switchMap,
    takeUntil,
} from 'rxjs';
import { UserListService } from '../user-list.service';
import { Pagination, User } from '../user.type';
import { matTabsAnimations } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
    display: grid;
    grid-template-columns: 20px 120px 120px 40px; /* Default */
    gap: 8px;

    @screen sm {
        grid-template-columns: 48px 100px 100px 100px 72px;
    }

    @screen md {
        grid-template-columns: 48px 100px 100px 150px auto 100px 250px 250px 72px;
    }

    @screen lg {
        grid-template-columns: 48px 150px 150px 150px 150px 150px 200px auto 72px;
    }

    @screen xl {
        grid-template-columns: 48px 150px 150px 200px 200px 200px 300px auto 72px;
    }
}

        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        MatProgressBarModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSortModule,
        MatPaginatorModule,
        NgClass,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRippleModule,
        AsyncPipe,
        MatMenuModule,
        DatePipe,
        MatTooltip
    ],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    isLoading: boolean = false;
    pagination: Pagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    users$: Observable<User[] | null>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    users: User[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _Service: UserListService,
        private _router: Router,
        private _alertService: AlertService
    ) { }

    ngOnInit(): void {
        this._Service.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination | null) => {
                if (pagination) {
                    this.pagination = pagination;
                    this._changeDetectorRef.markForCheck();
                }
            });

        this.users$ = this._Service.user$;
        this._Service.user$.subscribe((users) => {
            this.users = users;
        });

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._Service.getUsers(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;
                });

            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.isLoading = true;
                        return this._Service.getUsers(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    create(id: string): void {
        if (!id) {
            console.error('User ID is missing');
            return;
        }
        this._router.navigate(['/user/user-info', id]);
    }

    edit(id: string): void {
        if (!id) {
            console.error('User ID is missing');
            return;
        }
        this._router.navigate(['/user/user-info', id]);
    }

    openComposeDialog(userId: string): void {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Confirm User Inactivation',
            message: 'Are you sure you want to inactivate this user?',
            icon: {
                show: true,
                name: 'heroicons_outline:check-circle',
                color: 'error',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Yes, Inactivate',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'No, Cancel',
                },
            },
            dismissible: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.reviewUser(userId);
            }
            else {
                console.log('Inactivation canceled');
            }
        });
    }
    reviewUser(id: string) {
        this._Service.deleteUserById(id).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this._alertService.triggerAlert(
                        'success',
                        'Success',
                        'User Inactivated Successfully.'
                    );
                }
            },
            error: (err) => {
                this._alertService.triggerAlert(
                    'error',
                    'Error',
                    'An Error Occured, Please try later.'
                );
            },
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, user: User): any {
        return user.id;
    }
}
