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
import { UserService } from '../../user.service';
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
    roles = new FormControl<UserRoles[]>([]);
    roleIds = new FormControl<Number[]>([]);
    rolesList: UserRoles[] = [];
    sites: SiteCreation[] = [];
    selectAll: boolean = false;
    selectSingle: any[] = [];
    formData: any;
    rolesAndSites: any = {
        sites: [] as number[], // Array of site IDs
        roles: [] as number[], // Array of role IDs
    };

    constructor(
        private _siteService: SitesService,
        private cdr: ChangeDetectorRef,
        private _service: UserService
    ) {}

    ngOnInit(): void {
        this.GetSitesInfo();
        this.GetUserRoles();
        this._service.formData$.subscribe((data) => {
            this.formData = data;
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
    GetSitesInfo() {
        this._siteService.getSites().subscribe((res) => {
            this.sites = res;
            this.selectSingle = [];
            this.selectAll = false;
            this.cdr.detectChanges();
        });
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
            registerUserRequest: this.formData,
            sites: this.selectSingle,
            roles: this.roleIds.value,
        };

        this._siteService.saveUserInfo(payload).subscribe({
            next: (res) => {
                console.log('Response from API:', res);
            },
            error: (err) => {
                console.error('Error saving user site info:', err);
            },
        });
    }

    navigateUserBack(): void {
        this._service.pannelvalue('generalInfo');
    }

    trackBySiteId(index: number, site: SiteCreation): number {
        return site.siteId;
    }
}
