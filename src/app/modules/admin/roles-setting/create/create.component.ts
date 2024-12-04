import { Component } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/layout/common/alert/alert.service';
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
        private route: ActivatedRoute,
        private _alertService: AlertService
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
    }

    getUserMenus() {
        this._service.getMenu().subscribe({
            next: (res) => {
                this.menus = res;
            },
            error: (err) => {
                console.log('an error occured while fetching menus', err);
            },
        });
    }

    onCheckboxChange(event: MatCheckboxChange, menuId: number): void {
        const isChecked = event.checked;
        const selectedMenu =
            this.menus.find((menu) => menu.menuId === menuId) ||
            this.menus
                .flatMap((menu) => menu.children || [])
                .find((child) => child.menuId === menuId);

        if (isChecked) {
            if (!this.selectSingle.includes(menuId)) {
                this.selectSingle.push(menuId);
            }

            if (selectedMenu?.children?.length) {
                selectedMenu.children.forEach((child) => {
                    if (!this.selectSingle.includes(child.menuId)) {
                        this.selectSingle.push(child.menuId);
                    }
                });
            }
            this.updateParentState(menuId);
        } else {
            this.selectSingle = this.selectSingle.filter((id) => id !== menuId);

            if (selectedMenu?.children?.length) {
                this.selectSingle = this.selectSingle.filter(
                    (id) =>
                        !selectedMenu.children.some(
                            (child) => child.menuId === id
                        )
                );
            }

            this.updateParentState(menuId);
        }

        this.selectAll =
            this.selectSingle.length ===
            this.menus.reduce(
                (acc, menu) => acc + 1 + (menu.children?.length || 0),
                0
            );
    }

    toggleAllMenus(): void {
        if (this.selectAll) {
            this.selectSingle = this.menus.flatMap((menu) => [
                menu.menuId,
                ...(menu.children?.map((child) => child.menuId) || []),
            ]);
        } else {
            this.selectSingle = [];
        }
    }

    private updateParentState(childId: number): void {
        const parentMenu = this.menus.find((menu) =>
            menu.children?.some((child) => child.menuId === childId)
        );

        if (parentMenu) {
            const allChildrenSelected = parentMenu.children!.every((child) =>
                this.selectSingle.includes(child.menuId)
            );

            if (allChildrenSelected) {
                if (!this.selectSingle.includes(parentMenu.menuId)) {
                    this.selectSingle.push(parentMenu.menuId);
                }
            } else {
                this.selectSingle = this.selectSingle.filter(
                    (id) => id !== parentMenu.menuId
                );
            }
        }
    }

    saveMenuInfo(): void {
        const roleData = this.rolesForm.value.roleName;
        this._service.saveRolesData(roleData, this.selectSingle).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this._alertService.triggerAlert(
                        'success',
                        'Success',
                        res.message
                    );
                    this._router.navigate(['roles/list']);
                } else {
                    this._alertService.triggerAlert(
                        'warn',
                        'Duplication',
                        res.message
                    );
                }
            },
            error: (err) => {
                console.log('error occured', err);
            },
        });
    }

    navigateUserBack(): void {
        this._router.navigate(['roles/list']);
    }

    onSubmit(): void {
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
