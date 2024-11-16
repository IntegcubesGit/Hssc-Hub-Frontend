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
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SiteCreation } from './Sites.class';
import { SitesService } from './sites.service';
import { MatButtonModule } from '@angular/material/button';

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
        MatButtonModule,
    ],
    templateUrl: './sites.component.html',
    styleUrl: './sites.component.scss',
})
export class SitesComponent implements OnInit {
    sites: SiteCreation[] = [];
    selectAll: boolean = false;
    selectSingle: any[] = [];

    constructor(
        private _siteService: SitesService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.GetSitesInfo();
    }

    GetSitesInfo() {
        this._siteService.getSites().subscribe((res) => {
            this.sites = res;
            this.selectSingle = [];
            this.selectAll = false;
            this.cdr.detectChanges();
        });
    }

    onCheckboxChange(event: MatCheckboxChange, siteId: string): void{
        const isChecked = event.checked;
        if(isChecked){
            if(!this.selectSingle.includes(siteId)){
                this.selectSingle.push(siteId);
            }
        }else{
            this.selectSingle =  this.selectSingle.filter(id => id !== siteId)
        }
        this.selectAll = this.selectSingle.length === this.sites.length;

    }

    toggleAllSites(): void {
        debugger
        // console.log('Checkbox clicked:', event);
        // const checkbox = event.target as HTMLInputElement;
        // const isChecked = checkbox.checked;
        // this.selectAll = isChecked;
       // this.selectAll = event.checked;
        if (this.selectAll) {
            this.selectSingle = this.sites.map((site) => site.siteId);
        } else {
            this.selectSingle = [];
        }
        //this.cdr.detectChanges();
    }

    saveUserSiteInfo(){

    }

    trackBySiteId(index: number, site: SiteCreation): number {
        return site.siteId;
    }
}
