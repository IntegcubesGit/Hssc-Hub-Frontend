import {
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    NgClass,
    NgTemplateOutlet,
} from '@angular/common';
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
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';
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
import { MatDrawer } from '@angular/material/sidenav';

import {
    Observable,
    Subject,
    debounceTime,
    map,
    merge,
    switchMap,
    takeUntil,
} from 'rxjs';
import { User, Pagination } from '../user.type';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';


@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 100px 40px;

                @screen sm {
                    grid-template-columns: 48px auto 100px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 100px auto  96px 96px 100px  72px;;
                }

                @screen lg {
                    grid-template-columns: 48px 100px auto 400px 100px 96px 96px  96px 72px;;
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
    ],
})
export class UserListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    isLoading: boolean = false;
    pagination: Pagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    users$: Observable<User[] | null>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,

        private _Service: UserService,

        private _router: Router,
    ) {}

    ngOnInit(): void {

        // Get the pagination
        this._Service.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination | null) => {
                if(pagination){
                    // Update the pagination
                    this.pagination = pagination;

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
            });

        this.users$ = this._Service.user$;
        this._Service.user$.subscribe(users => {
        });


        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {

                    this.isLoading = true;
                    return this._Service.getUsers(
                        0,
                        10,
                        'name',
                        'asc',
                        query
                    );
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

        this._router.navigate(['/user/user-info', id]);
    }

    deleteUser(): void {

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete User',
            message:
                'Are you sure you want to remove this user? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the product object
                // const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                // this._inventoryService
                //     .deleteProduct('56756756567567')
                //     .subscribe(() => {

                //     });
            }
        });
    }




    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, user: User): any {
        return user.Id;
    }
}
