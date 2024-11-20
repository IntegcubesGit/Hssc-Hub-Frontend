import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    ],
    templateUrl: './sites.component.html',
    styles: [`
        `],
})
export class SitesComponent implements OnInit {
    roles = new FormControl<UserRoles[]>([]);
    roleIds = new FormControl<Number[]>([]);
    rolesList: UserRoles[] = [];
    sites: SiteCreation[] = [];
    selectAll: boolean = false;
    selectSingle: any[] = [];
    


    constructor(
        private _siteService: SitesService,
        private cdr: ChangeDetectorRef,
        private _service: UserService,
        private _site: SitesService
    ) {}

    ngOnInit(): void {
        this.GetSitesInfo();
        this.GetUserRoles();
    }

    GetUserRoles() {
        this._site.getRoles().subscribe((res) => {
            this.rolesList = res;
        });
    }

    remove(role: UserRoles) {
        const roles = this.roles.value ?? [];
        this.removeFirst(roles, role);
        this.roles.setValue(roles);
        this.roleIds.setValue(roles.map(role => role.id));
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

    saveUserSiteInfo() {}

    navigateUserBack(): void {
        this._service.pannelvalue('generalInfo');
    }

    trackBySiteId(index: number, site: SiteCreation): number {
        return site.siteId;
    }
}
