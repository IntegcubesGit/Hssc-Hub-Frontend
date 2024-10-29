import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseAlertComponent, FuseAlertService } from '@fuse/components/alert';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { AddFormComponent } from '../../add-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
    selector: 'app-injury',
    templateUrl: './injury.component.html',
    styles: [
        `
            fuse-alert {
                margin: 16px 0;
            }
        `,
    ],
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        FuseHighlightComponent,
        FuseAlertComponent,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDividerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatButtonModule,
        MatDatepickerModule,
    ],
})
export class InjuryComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     */
    id: string | null = null;
    constructor(
        private _fuseAlertService: FuseAlertService,
        private _fuseComponentsComponent: AddFormComponent,
        private route: ActivatedRoute, private snackBar: MatSnackBar,
        private router: Router
    ) {
        debugger
      


    }

    ngOnInit(): void {
 
        this.id = this.route.parent?.snapshot.paramMap.get('id'); 
        console.log('ID from parent route in CardComponent (using snapshot):', this.id);
        this.route.parent?.paramMap.subscribe((paramMap: ParamMap) => {
            this.id = paramMap.get('id');  
            console.log('11111ID from parent route:', this.id);  
          });

        // this.route.parent?.paramMap.pipe(map((p) => p['id'])).subscribe((id) => {
        //     console.log('IaaaaD:', id);  
        //   });
        // this.route.parent?.paramMap.subscribe(paramMap => {
        //     this.id = paramMap.get('id');
        //     console.log('ID from parent route in CardComponent:', this.id); 
        //   });
        // this.route.paramMap.subscribe((paramMap: ParamMap) => {
        //     this.id = paramMap.get('id');  
        //     console.log(this.id);         
        //     this.showAlert(this.id);       
        // });
     
 

      }


      saveData() {
        // Perform the save operation here
        // After saving, navigate to the desired route
        this.router.navigate(['/case/incident_Reporting/Info', 222, 'sub', 'general_information']);
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss the alert via the service
     *
     * @param name
     */
    dismiss(name: string): void {
        // Dismiss
        this._fuseAlertService.dismiss(name);
    }

    /**
     * Show the alert via the service
     *
     * @param name
     */
    show(name: string): void {
        // Show
        this._fuseAlertService.show(name);
    }

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._fuseComponentsComponent.matDrawer.toggle();
    }

    showAlert(id: string | null): void {
        this.snackBar.open(`Current ID: ${id}`, 'Close', {
          duration: 3000, // Alert will close after 3 seconds
        });
      }
    ngOnDestroy(): void {
        // Unsubscribe to avoid memory leaks
       
      }
}
