import { Component } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ListSettingService } from '../roles-setting.sevice';
import { MenuDTO } from '../roles-setting.types';

@Component({
    selector: 'app-user-roles',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatButtonModule,
    ],
    templateUrl: './create.component.html',
})
export class CreateComponent {
    rolesForm: UntypedFormGroup;
    userId: string | null = null;
    menus: MenuDTO[] = [];
    selectAll: boolean = false;
    selectSingle: any[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _service: ListSettingService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id');
        this.rolesForm = this._formBuilder.group({
            roleName: ['', Validators.required],
        });

        if (this.userId === '-1') {
            this.rolesForm.reset();
        }

        this.getUserMenus();

        // const savedData = this._service.getFormData();
        // if (savedData) {
        //     this.accountForm.patchValue(savedData);
        // }

        // if (this.userId !== '-1') {
        //     this.loadUserData(this.userId);
        // }
    }

    getUserMenus() {
        this._service.getMenu().subscribe({
            next: (res) => {
                console.log('these are user menus', res);
                this.menus = res;
                console.log('assigned menus', this.menus);
            },
            error: (err) => {
                console.log('an error occured while fetching menus', err);
            },
        });
    }

    onCheckboxChange(event: MatCheckboxChange, menuId: string): void {
        const isChecked = event.checked;
        if (isChecked) {
            if (!this.selectSingle.includes(menuId)) {
                this.selectSingle.push(menuId);
            }
        } else {
            this.selectSingle = this.selectSingle.filter((id) => id !== menuId);
        }
        this.selectAll = this.selectSingle.length === this.menus.length;
    }

    toggleAllSites(): void {
        if (this.selectAll) {
            this.selectSingle = this.menus.map((menu) => menu.menuId);
        } else {
            this.selectSingle = [];
        }
    }

    onSubmit(): void {
        // if (this.rolesForm.valid) {
        //     this._service.setFormData(this.accountForm.value);
        // } else {
        //     alert('Form is invalid');
        // }
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param menu
     */
    trackByFn(index: number, menu: any): any {
        return menu.id || index;
    }
}
