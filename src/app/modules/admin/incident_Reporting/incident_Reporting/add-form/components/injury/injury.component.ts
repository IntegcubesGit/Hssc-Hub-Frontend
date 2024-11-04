import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseAlertComponent, FuseAlertService } from '@fuse/components/alert';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { AddFormComponent } from '../../add-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddformComponent } from './dialog/add-form.component';
import { cloneDeep } from 'lodash';
import { Incident_ReportingService } from '../../../incident_Reporting.service';

type NewType = MatTableDataSource<any>;

@Component({
    selector: 'app-injury',
    templateUrl: './injury.component.html',
    styles: [''],
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        FuseHighlightComponent,
        FuseAlertComponent,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDividerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatButtonModule,
        MatDatepickerModule,
        MatTableModule,
        DatePipe,
        CurrencyPipe
    ],
})
export class InjuryComponent implements OnInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort!: MatSort;

    data: any;
    injuries:any[]=[];

    recentTransactionsTableColumns: string[] = [
       
        'injCatId',
        'courseOfEvent',
        'injTypeId',
        'bodyPart',
        'personName',
        'personGender',
        'personAge',
        'personNationality',
        'personDesignation',
        'employmentCategory',
        'personCompany'
    ];
    caseId: string | null = null;
    constructor(
        private _fuseAlertService: FuseAlertService,
        private _fuseComponentsComponent: AddFormComponent,
        private route: ActivatedRoute, private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog,
        private _service: Incident_ReportingService,

    ) {



    }

    ngOnInit(): void {

        this.caseId = this.route.parent?.snapshot.paramMap.get('id');
        this.getAllInjuries(this.caseId);
      }


      getAllInjuries(id: string): void {
        this._service.getAllinjury(id).subscribe({
            next: (response) => {
                this.injuries = response;
           
            },
            error: (error) => {
                console.error('Error fetching injury data:', error);
            }
        });
    }


      openComposeDialog(id): void {
       
            const dialogRef = this.dialog.open(AddformComponent, {

           data : {
                id: cloneDeep(id),
                caseId: this.caseId
            }

        });

        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log('Compose dialog was closed!');
        // });
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss the alert via the service
     *
     * @param name
     */
    dismiss(name: string): void {
        // Dismiss
        this._fuseAlertService.dismiss(name);
    }

    /**
     * Show the alert via the service
     *
     * @param name
     */
    show(name: string): void {
        // Show
        this._fuseAlertService.show(name);
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._fuseComponentsComponent.matDrawer.toggle();
    }

    showAlert(id: string | null): void {
        this.snackBar.open(`Current ID: ${id}`, 'Close', {
          duration: 3000, // Alert will close after 3 seconds
        });
      }
    ngOnDestroy(): void {
        // Unsubscribe to avoid memory leaks

      }
}
