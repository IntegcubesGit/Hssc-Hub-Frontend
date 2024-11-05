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
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { Incident_ReportingService } from '../../../incident_Reporting.service';
import { AlertService } from 'app/core/alert/alert.service';
import { AddformComponent } from './dialog/add-form.component';


@Component({
    selector: 'app-potentialLoss',
    templateUrl: './potentialLoss.component.html',
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
    ],
})
export class PotentialLossComponent implements OnInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort!: MatSort;

    data: any;
    list:any[]=[];

    recentTransactionsTableColumns: string[] = [
        
        'potentialLossId',
        'comments',
        'severity',
        'lossAmount',
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

       
        this.getAll();
      }


      getAll(): void {
        this.caseId = this.route.parent?.snapshot.paramMap.get('id');
        this._service.getAllPotentialLoss(this.caseId).subscribe({
            next: (response) => {
                debugger
                this.list = response;
           
            },
            error: (error) => {
                console.error('Error fetching getAll data:', error);
            }
        });
    }


      openComposeDialog(id): void {
        debugger
            const dialogRef = this.dialog.open(AddformComponent, {
           data : {
                id: cloneDeep(id),
                caseId: this.caseId
            }

        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.getAll();
                this._alertService.showSuccess("Case Potential Loss Saved Successfully");
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
        this._fuseComponentsComponent.matDrawer.toggle();
    }

 
    ngOnDestroy(): void {
        // Unsubscribe to avoid memory leaks

      }
}
