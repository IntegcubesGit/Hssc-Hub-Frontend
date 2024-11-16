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
import { UserService } from '../../user.service';

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
        private _service: UserService,
        private route: ActivatedRoute
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id');

        // Create the form
        this.accountForm = this._formBuilder.group(
            {
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                username: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                currentPassword: [''],
                newPassword: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
                phone: [''],
            },
            { validators: this.validatePassword }
        );
        const savedData = this._service.getFormData();
        if (savedData) {
            this.accountForm.patchValue(savedData);
        }
    }

    validatePassword: ValidatorFn = (
        group: AbstractControl
    ): ValidationErrors | null => {
        const newPassword = group.get('newPassword')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        return newPassword && confirmPassword && newPassword !== confirmPassword
            ? { passwordMismatch: true }
            : null;
    };

    onSubmit(): void {
        if (this.accountForm.valid) {
            alert('Form Submitted');
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
}
