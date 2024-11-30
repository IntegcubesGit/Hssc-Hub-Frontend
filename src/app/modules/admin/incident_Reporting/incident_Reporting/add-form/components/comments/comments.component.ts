import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
import { FuseCardComponent } from '@fuse/components/card';
import { MatMenuModule } from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import { AlertService } from 'app/layout/common/alert/alert.service';

@Component({
    selector: 'comments',
    templateUrl: './comments.component.html',
    styles: [''],
    providers: [DatePipe],
    standalone: true,
    imports: [
        FuseCardComponent,
        MatIconModule,
        MatButtonModule,
        FuseHighlightComponent,
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
    buttonText='Post a Comment';
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
        private datePipe: DatePipe,
        private _fuseComponentsComponent: AddFormComponent,
        private _formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute, 
        private router: Router,
        private _service: Incident_ReportingService,
        private alertService: AlertService) 
    {



    }

    ngOnInit(): void 
    {
        this.caseId = this.route.parent?.snapshot.paramMap.get('id');
        this.composeForm = this._formBuilder.group(
        {
            caseCommentId: [-1, Validators.required],
            caseId: [this.caseId, Validators.required],
            comment: ['', Validators.required]
        });
        this.getAllCaseComments();
    }


    getAllCaseComments(): void {
        this._service.getAllCaseComments(this.caseId).subscribe({
            next: (response) => {
                this.comments = response.map(comment => ({
                    ...comment,
                    createdOn: this.datePipe.transform(comment.createdOn, 'MM/dd/yyyy, h:mm a'),
                    modifiedOn: this.datePipe.transform(comment.modifiedOn, 'MM/dd/yyyy, h:mm a')
                }));
            },
            error: (error) => {
                this.alertService.triggerAlert('error', 'Error', 'Failed to fetch case comments.');
            }
        });
    }
    deleteComment(caseCommentId:number)
    {
        
    }

    editComment(caseCommentId:number)
    {
        this._service.getCaseCommentById(caseCommentId).subscribe({
            next: (response) => 
            {
                setTimeout(() => {
                    this.composeForm.patchValue(response);
                });
                this.buttonText='Update Comment'
            },
            error: (error) => {
                this.alertService.triggerAlert('error', 'Error', 'Failed to edit case comment.');
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
                    this.buttonText='Post a Comment';
             
    
                    Object.keys(this.composeForm.controls).forEach((controlName) => 
                        {
                        const control = this.composeForm.get(controlName);
                        if (control) {
                            control.markAsPristine();  
                            control.markAsUntouched(); 
                        }
                    });
                    this.alertService.triggerAlert('success', 'Success', 'Case Comment Posted Successfully');
                },
                error: (error) => {
                    this.alertService.triggerAlert('error', 'Error', 'Failed to add case comment.');
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