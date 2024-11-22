import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { UserListService } from '../../user-list.service';

@Component({
    selector: 'settings-generalInfo',
    templateUrl: './General-Info.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class SettingsGeneralInfoComponent implements OnInit {
    accountForm: UntypedFormGroup;
    userId: string | null = null;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _service: UserListService,
        private route: ActivatedRoute
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        debugger;
        this.userId = this.route.snapshot.paramMap.get('id');
        // Create the form
        this.accountForm = this._formBuilder.group(
            {
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                userName: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: [
                    '',
                    [Validators.required, Validators.minLength(6)],
                ],
                phone: [''],
            },
            { validators: this.validatePassword }
        );

        if (this.userId === '-1') {
            this.accountForm.reset();
        }
        const savedData = this._service.getFormData();
        if (savedData) {
            this.accountForm.patchValue(savedData);
        }

        if (this.userId !== '-1') {
            this.loadUserData(this.userId);
        }
    }

    validatePassword: ValidatorFn = (
        group: AbstractControl
    ): ValidationErrors | null => {
        const Password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        return Password && confirmPassword && Password !== confirmPassword
            ? { passwordMismatch: true }
            : null;
    };

    onSubmit(): void {
        if (this.accountForm.valid) {
            this._service.setFormData(this.accountForm.value);
        } else {
            alert('Form is invalid');
        }
    }

    navigateUserNext(): void {
        this._service.setFormData(this.accountForm.value);
        this._service.pannelvalue('sites');
    }

    navigateUserBack(): void {
        //this._router.navigate(['/user/user-info', id]);
        this._router.navigate(['user/users-list']);
    }

    loadUserData(id: string) {
        this._service.getUserById(id).subscribe({
            next: (userData) => {
                this.accountForm.patchValue(userData.user);
            },
        });
    }
}
