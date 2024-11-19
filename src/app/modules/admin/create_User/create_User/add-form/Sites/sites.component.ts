import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    computed,
    inject,
    model,
    signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
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
})
export class SitesComponent implements OnInit {
    sites: SiteCreation[] = [];
    selectAll: boolean = false;
    selectSingle: any[] = [];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    readonly currentRole = model('');
    readonly roles = signal([]);
    readonly allRoles = signal<UserRoles[]>([]);
    readonly filteredRoles = computed(() => {
        const currentRole = this.currentRole().toLowerCase();
        const roles = this.allRoles();
        return roles.length > 0
            ? currentRole
                ? roles.filter((r) =>
                      r.name.toLowerCase().includes(currentRole)
                  )
                : roles
            : [];
    });

    readonly announcer = inject(LiveAnnouncer);

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

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.roles.update((r) => [...r, value]);
        }
        this.currentRole.set('');
    }

    // remove(role: string): void {
    //     this.roles.update((r) => {
    //         const index = r.indexOf(role);
    //         if (index < 0) {
    //             return r;
    //         }
    //         r.splice(index, 1);
    //         this.announcer.announce(`Removed ${r}`);
    //         return [...r];
    //     });
    // }

    remove(role: string): void {
        this.roles.update((r) => {
            const updatedRoles = r.filter((item) => item !== role); // Create a new array without the removed role
            this.announcer.announce(`Removed ${role}`); // Announce the removed role
            return updatedRoles; // Update the signal with the new array
        });
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.roles.update((r) => [...r, event.option.viewValue]);
        this.currentRole.set('');
        event.option.deselect();
    }

    onInputFocus(): void {
        if (this.allRoles.length > 0 && this.currentRole() === '') {
            this.currentRole.set('');
        }
    }

    GetUserRoles() {
        this._site.getRoles().subscribe((res) => {
            this.allRoles.set(res);
            this.currentRole.set('');
            console.log('Roles fetched from backend:', res);
        });
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
