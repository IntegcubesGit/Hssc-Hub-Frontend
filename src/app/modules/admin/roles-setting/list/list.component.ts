import { CommonModule, DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import {
    Observable,
    Subject,
    debounceTime,
    map,
    switchMap,
    takeUntil,
} from 'rxjs';
import { ListSettingService } from '../roles-setting.sevice';
import { AppRole, Pagination } from '../roles-setting.types';
import { AlertService } from 'app/layout/common/alert/alert.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-user-roles',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        CommonModule,
        DatePipe,
        MatPaginatorModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 100px 40px;

                @screen sm {
                    grid-template-columns: 48px auto 100px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 100px 100px auto 96px 100px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 200px 200px auto 150px 150px 150px 150px 72px;
                }
            }
        `,
    ],
})
export class ListComponent implements OnInit {
    roles$: Observable<AppRole[] | null>;
    userRoles: AppRole[] = [];
    isLoading: boolean = false;
    //pagination: Pagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pagination: Pagination = {
        length: 0,
        size: 25,
        page: 0,
        lastPage: 0,
        startIndex: 0,
        endIndex: 0,
    };

    constructor(
        private _router: Router,
        private _service: ListSettingService,
        private _cdr: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _alertService: AlertService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit(): void {
        this._service.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination | null) => {
                if (pagination) {
                    this.pagination = pagination;
                    this._cdr.markForCheck();
                }
            });

        this.roles$ = this._service.roles$;

        this._service.roles$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((roles) => {
                this.userRoles = roles;
                this._cdr.detectChanges();
            });

        // Initial roles fetch
        this._service.getRoles().subscribe();

        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    return this._service.getRoles(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    create(id: string): void {
        this._router.navigate(['roles/create', id]);
    }

    edit(id: string): void {
        if (!id) {
            console.error('User ID is missing');
            return;
        }
        this._router.navigate(['roles/create', id]);
    }

    openComposeDialog(roleId: string): void {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Confirm Role Deletion',
            message: 'Are you sure you want to delete this role?',
            icon: {
                show: true,
                name: 'heroicons_outline:trash',
                color: 'error',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Yes, Delete',
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
                this.reviewRole(roleId);
            }
            else {
                console.log('Deletion Canceled');
            }
        });
    }
    reviewRole(id: string) {
        this._service.deleteRoleById(id).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this._alertService.triggerAlert(
                        'success',
                        'Success',
                        'Role Deleted Successfully.'
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
     * @param role
     */
    trackByFn(index: number, role: any): any {
        return role.id || index;
    }
}
