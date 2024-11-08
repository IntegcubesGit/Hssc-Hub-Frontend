import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { AddFormComponent } from '../../add-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { DatePipe, JsonPipe } from '@angular/common';
import { Incident_ReportingService } from '../../../incident_Reporting.service';
import { AlertService } from 'app/core/alert/alert.service';
import { FuseCardComponent } from '@fuse/components/card';
import { MatMenuModule } from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'comments',
    templateUrl: './comments.component.html',
    styles: [''],
    standalone: true,
    imports: [
        FuseCardComponent,
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
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        JsonPipe,
        MatCardModule

    ],
})
export class CommentsComponent implements OnInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort!: MatSort;
    data: any;
    comments: any[] = [];
    buttonText='Add Comment';
    composeForm: UntypedFormGroup;

    recentTransactionsTableColumns: string[] = [

        'ActionTaken',
        'ActionType',
        'ActionStatus',
        'Deadline',
        'CompletedOn'


    ];
    caseId: string | null = null;
    constructor(

        private _fuseComponentsComponent: AddFormComponent,
        private _formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute, 
        private router: Router,
        private _service: Incident_ReportingService,
        private _alertService: AlertService) 
    {



    }

    ngOnInit(): void 
    {
        this.caseId = this.route.parent?.snapshot.paramMap.get('id');
        this.composeForm = this._formBuilder.group(
        {
            caseCommentId: [-1, Validators.required],
            caseId: [this.caseId, Validators.required],
            Comment: ['', Validators.required]
        });
        this.getAllCaseComments();
    }


    getAllCaseComments(): void 
    {
        this._service.getAllCaseComments(this.caseId).subscribe({
            next: (response) => {
                this.comments = response;
            },
            error: (error) => {
                console.error('Error fetching case comments data:', error);
            }
        });
    }

    onCancel() 
    {
        this.router.navigate(['/case/incident_Reporting']);
    }

    AddComment()
    {
        if (this.composeForm.valid) 
        {
            this._service.saveCaseComment(this.composeForm.value).subscribe({
                next: (response) => 
                {
                    this.getAllCaseComments();
                    this.composeForm.reset({
                        caseId: this.caseId, 
                        caseCommentId: -1   
                    });
    
                    Object.keys(this.composeForm.controls).forEach((controlName) => 
                        {
                        const control = this.composeForm.get(controlName);
                        if (control) {
                            control.markAsPristine();  
                            control.markAsUntouched(); 
                        }
                    });
                },
                error: (error) => {
                    console.error('Error fetching case comments data:', error);
                }
            });
            
        }
    }
    
    toggleDrawer(): void 
    {
        this._fuseComponentsComponent.matDrawer.toggle();
    }
    ngOnDestroy(): void 
    {


    }
    loadCaseComment()
    {
        
    }
    getAvatar(userId: number): string 
    {
        const avatars = {
            1: 'female-01',
            2: 'male-01'
        };
        return avatars[userId] || 'default-avatar';  // Default avatar if no match
    }
    
}