import {
    AsyncPipe,
    DatePipe,
    NgClass,
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
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
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

import {
    Observable,
    Subject,
    debounceTime,
    map,
    merge,
    switchMap,
    takeUntil,
} from 'rxjs';
import { Case, Pagination } from '../observations.types';
import { Incident_ReportingService } from '../observations.service';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
    selector: 'observation-list',
    templateUrl: './observation_list.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 100px 40px;

                @screen sm {
                    grid-template-columns: 48px auto 100px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 100px 100px auto 96px 100px  72px;;
                }

                @screen lg {
                    grid-template-columns: 48px 200px 200px auto 150px 150px 150px  150px 72px;;
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
        DatePipe,
        MatMenuModule,
        MatTooltipModule
    ],
})
export class observationsListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    isLoading: boolean = false;
    pagination: Pagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    cases$: Observable<Case[] | null>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,

        private _Service: Incident_ReportingService,

        private _router: Router,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        // Get the pagination
        this._Service.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination | null) => {
                if (pagination) {
                    // Update the pagination
                    this.pagination = pagination;

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
            });



        this.cases$ = this._Service.cases$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.isLoading = true;
                    if (this._paginator) 
                    {
                        this._paginator.pageIndex = 0;
                    }
                    return this._Service.getProducts(
                        0,
                        25,
                        'case',
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

    
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) 
        {
            
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
                        // Call the service with the current page, page size, sort, and search parameters
                        return this._Service.getProducts(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active || 'case', // Default sorting field if none selected
                            this._sort.direction || 'asc',      // Default sorting order if none selected
                            this.searchInputControl.value
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
        this._router.navigate(['/observations/information', id]);
    }



    deleteSelectedProduct(): void {

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message:
                'Are you sure you want to remove this product? This action cannot be undone!',
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
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openComposeDialog(caseId:string): void {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Confirm Case Review',
            message: 'Are you sure you want to approve the case review?',
            icon: {
                show: true,
                name: 'heroicons_outline:check-circle',
                color: 'success'
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Yes, Approve',
                    color: 'primary'
                },
                cancel: {
                    show: true,
                    label: 'No, Cancel'
                }
            },
            dismissible: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) 
            {
                this.reviewCase(caseId);
            } 
            else 
            {
                console.log(' canceled');
            }
        });
    };
    reviewCase(caseId: string) {
        this._Service.reviewCase(caseId).subscribe({
            next: (response) => {
            },
            error: (error) => {
                console.error('Error approving the review', error);
            }
        });
    }
}
