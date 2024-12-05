import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { AddFormComponent } from '../../add-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { Incident_ReportingService } from '../../../observations.service';
import { AlertService } from 'app/core/alert/alert.service';
import { AddformComponent } from './dialog/add-form.component';
import { StickyMenuToggleComponent } from "../../../../../../../core/sticky-menu-toggle/sticky-menu-toggle.component";


@Component({
    selector: 'action',
    templateUrl: './action.component.html',
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
    StickyMenuToggleComponent
],
})
export class ActionComponent implements OnInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort!: MatSort;

    data: any;
    actions: any[] = [];

    recentTransactionsTableColumns: string[] = [
        'No',
        'ActionTaken',
        'ActionType',
        'ActionStatus',
        'Deadline',
        'CompletedOn'


    ];
    caseId: string | null = null;
    constructor(

        private _fuseComponentsComponent: AddFormComponent,
        private route: ActivatedRoute, private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog,
        private _service: Incident_ReportingService,
        private _alertService: AlertService

    ) {



    }

    ngOnInit(): void {


        this.getAllCaseActions();
    }


    getAllCaseActions(): void {
        this.caseId = this.route.parent?.snapshot.paramMap.get('id');
        this._service.getAllCaseActions(this.caseId).subscribe({
            next: (response) => {
                this.actions = response;
            },
            error: (error) => {
                console.error('Error fetching injury data:', error);
            }
        });
    }


    openComposeDialog(id): void {
        const dialogRef = this.dialog.open(AddformComponent, {
            data: {
                id: cloneDeep(id),
                caseId: this.caseId
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.getAllCaseActions();
                this._alertService.showSuccess("Case Action Information Saved Successfully");
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