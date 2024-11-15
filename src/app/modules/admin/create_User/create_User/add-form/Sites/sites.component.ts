import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SiteCreation } from './Sites.class';
import { SitesService } from './sites.service';

@Component({
    selector: 'app-sites',
    standalone: true,
    changeDetection:ChangeDetectionStrategy.OnPush,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatCheckboxModule,
    ],
    templateUrl: './sites.component.html',
    styleUrl: './sites.component.scss',
})
export class SitesComponent implements OnInit {
    sites: SiteCreation[] = [];
    selectAll: boolean = false;
    selectSingle: boolean = false;
    form: FormGroup;

    constructor(
        private _siteService: SitesService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.form = this.fb.group({
            selectAll: [false],
            siteCheckboxes: this.fb.array([]),
        });
    }

    ngOnInit(): void {

        this.GetSitesInfo();

    }

    GetSitesInfo() {
        this._siteService.getSites().subscribe((res) => {
            this.sites = res;
            this.cdr.detectChanges();
        });
    }




    updateSelectAll(value): void {
        //set loop on site  this.sites.sinh=value; 

    }

    updateSelect(checked: boolean): void {

    }

    trackBySiteId(index: number, site: SiteCreation): number {
        return site.SiteId;
    }
}
