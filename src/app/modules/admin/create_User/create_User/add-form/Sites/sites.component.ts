import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/layout/common/alert/alert.service';
import { Observable, tap } from 'rxjs';
import { UserListService } from '../../user-list.service';
import { SiteCreation } from './Sites.class';
import { SitesService } from './sites.service';
import { UserRoles } from './sites.types';

@Component({
    selector: 'app-sites',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatButtonModule,
        MatChipsModule,
        MatAutocompleteModule,
        CommonModule,
    ],
    templateUrl: './sites.component.html',
    styles: [``],
})
export class SitesComponent implements OnInit {
    userId: string | null = null;
    roles = new FormControl<UserRoles[]>([]);
    roleIds = new FormControl<Number[]>([]);
    rolesList: UserRoles[] = [];
    sites: SiteCreation[] = [];
    selectAll: boolean = false;
    selectSingle: any[] = [];
    formData: any;
    rolesAndSites: any = {
        sites: [] as number[],
        roles: [] as number[],
    };

    constructor(
        private _siteService: SitesService,
        private _cdr: ChangeDetectorRef,
        private _service: UserListService,
        private _route: ActivatedRoute,
        private _alertService: AlertService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this.userId = this._route.snapshot.parent?.paramMap.get('id');
        this.GetUserRoles();
        this.GetSitesInfo().subscribe({
            next: () => {
                if (this.userId !== '-1') {
                    this.AssignSitesAndRoles();
                }
            },
            error: (err) => {
                console.error('Error fetching sites:', err);
            },
        });

        this._service.formData$.subscribe((data) => {
            this.formData = data;
        });
    }

    AssignSitesAndRoles() {
        this._service.getUserById$.subscribe({
            next: (data) => {
                if (data) {
                    const RoleList = this.rolesList.filter((role) =>
                        data?.roles?.includes(role.id)
                    );
                    this.roles.setValue(RoleList);
                    this.roleIds.setValue(data.roles);

                    if (data.sites && Array.isArray(data.sites)) {
                        this.selectSingle = data.sites;
                        this.selectAll =
                            this.selectSingle.length === this.sites.length;
                    } else {
                        console.error(
                            'Sites data is invalid or empty from API.'
                        );
                    }
                } else {
                    console.error('User data is null or undefined.');
                }
            },
            error: (err) => {
                console.error('Error fetching user data:', err);
            },
        });
    }

    GetUserRoles() {
        this._siteService.getRoles().subscribe((res) => {
            this.rolesList = res;
        });
    }

    onRoleSelect(event: MatSelectChange): void {
        const selectedRoles = event.value as UserRoles[];
        this.roles.setValue(selectedRoles);
        this.roleIds.setValue(selectedRoles.map((role) => role.id));
    }

    remove(role: UserRoles) {
        const roles = this.roles.value ?? [];
        this.removeFirst(roles, role);
        this.roles.setValue(roles);
        this.roleIds.setValue(roles.map((role) => role.id));
    }

    private removeFirst<T>(array: T[], toRemove: T): void {
        const index = array.indexOf(toRemove);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    ////////////////////////----sites start here----\\\\\\\\\\\\\\\\\\\\\\

    GetSitesInfo(): Observable<any> {
        return this._siteService.getSites().pipe(
            tap((res) => {
                this.sites = res;
                this.selectSingle = [];
                this.selectAll = false;
                this._cdr.detectChanges();
            })
        );
    }

    onCheckboxChange(event: MatCheckboxChange, siteId: string): void {
        const isChecked = event.checked;
        if (isChecked) {
            if (!this.selectSingle.includes(siteId)) {
                this.selectSingle.push(siteId);
            }
        } else {
            this.selectSingle = this.selectSingle.filter((id) => id !== siteId);
        }
        this.selectAll = this.selectSingle.length === this.sites.length;
    }

    toggleAllSites(): void {
        if (this.selectAll) {
            this.selectSingle = this.sites.map((site) => site.siteId);
        } else {
            this.selectSingle = [];
        }
    }

    saveUserSiteInfo() {
        const payload = {
            registerUserRequest: {
                ...this.formData,
                UserId: this.userId,
            },
            sites: this.selectSingle,
            roles: this.roleIds.value,
        };
        if (this.roleIds.value.length >= 1) {
            if (this.selectSingle.length >= 1) {
                if (this.userId == '-1') {
                    this._siteService.saveUserInfo(payload).subscribe({
                        next: (res) => {
                            if (res.isSucceeded) {
                                this._alertService.triggerAlert(
                                    'success',
                                    'Success',
                                    'User Added Successfully.'
                                );
                                this._router.navigate(['user/users-list']);
                            } else {
                                this._alertService.triggerAlert(
                                    'info',
                                    'Duplicate',
                                    res.message
                                );
                            }
                        },
                        error: (err) => {
                            this._alertService.triggerAlert(
                                'error',
                                'Error',
                                'An Error Occured, Please try later.'
                            );
                        },
                    });
                } else {
                    this._siteService.updateUserInfo(payload).subscribe({
                        next: (res) => {
                            if (res.isSucceeded) {
                                this._alertService.triggerAlert(
                                    'success',
                                    'Success',
                                    'User Updated Successfully.'
                                );
                                this._router.navigate(['user/users-list']);
                            } else {
                                this._alertService.triggerAlert(
                                    'info',
                                    'Duplicate',
                                    res.message
                                );
                            }
                        },
                    });
                }
            } else {
                this._alertService.triggerAlert(
                    'info',
                    'No Sites Selected',
                    'Please select at least one site to proceed.'
                );
            }
        } else {
            this._alertService.triggerAlert(
                'info',
                'No Roles Selected',
                'Please select at least one role to proceed.'
            );
        }
    }

    navigateUserBack(): void {
        this._router.navigate([`user/user-info/${this.userId}/general-info`]);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param site
     */
    trackByFn(index: number, site: any): any {
        return site.id || index;
    }
}
