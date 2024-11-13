import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSort } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseAlertComponent } from "@fuse/components/alert";
import { FuseHighlightComponent } from "@fuse/components/highlight";
import { AddFormComponent } from "../../add-form.component";
import { Incident_ReportingService } from "../../../incident_Reporting.service";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-signature',
    templateUrl: './signature.component.html',
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
        DatePipe
    ],
})
export class SignatureComponent implements OnInit, OnDestroy {

    caseId: string = null;

    list: any[] = [];

    constructor(private router: Router,
        private route: ActivatedRoute,
        private _fuseComponentsComponent: AddFormComponent,
        private service: Incident_ReportingService
    ) {


    }

    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort!: MatSort;


    recentTransactionsTableColumns: string[] = [
        'caseSignatureNumber',
        'signatureType',
        'signedBy',
        'signDate',

    ];

    openComposeDialog(id): void {

    };

    onCancel() {
        this.router.navigate(['/case/incident_Reporting']);
    }
    toggleDrawer(): void {

        this._fuseComponentsComponent.matDrawer.toggle();
    }

    ngOnInit(): void {
        this.caseId = this.route.parent?.snapshot.paramMap.get('id');
        this.loadSignatures(this.caseId);
    }
    ngOnDestroy(): void 
    {

    }

    loadSignatures(caseId: string) {
        this.service.getAllCaseSignatures(this.caseId).subscribe({
            next: (response) => {
                this.list = response;

            },
            error: (error) => {
                console.error('Error fetching case signatures data:', error);
            }
        });
    }
}
