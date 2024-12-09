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
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { Incident_ReportingService } from '../../../incident_Reporting.service';
import { AlertService } from 'app/core/alert/alert.service';
import { AddformComponent } from './dialog/add-form.component';
import { StickyMenuToggleComponent } from 'app/core/sticky-menu-toggle/sticky-menu-toggle.component';


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
        StickyMenuToggleComponent,
      
       
    ],
})
export class InjuryComponent implements OnInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort!: MatSort;

    data: any;
    injuries:any[]=[];

    recentTransactionsTableColumns: string[] = [
        'srNo',
        'injCatId',
        'courseOfEvent',
        'injTypeId',
        'bodyPart',
        'personName',
        'personGender',
        'personNationality',
        'personDesignation',
        
    ];
    caseId: string | null = null;
    constructor(
      
        private _fuseComponentsComponent: AddFormComponent,
        private route: ActivatedRoute, private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog,
        private _service: Incident_ReportingService,
        private _alertService:AlertService

    ) {



    }

    ngOnInit(): void {

        this._fuseComponentsComponent.matDrawer.toggle(true);
        this.getAllInjuries();
      }


      getAllInjuries(): void {
        this.caseId = this.route.parent?.snapshot.paramMap.get('id');
        this._service.getAllinjury(this.caseId).subscribe({
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

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.getAllInjuries();
                this._alertService.showSuccess("Case Injury Information Saved Successfully");
            }
           
        });
    }

    onCancel() {
        this.router.navigate(['/case/incident_Reporting']);
      }


    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        
    }

 
    ngOnDestroy(): void {
        // Unsubscribe to avoid memory leaks

      }
}
