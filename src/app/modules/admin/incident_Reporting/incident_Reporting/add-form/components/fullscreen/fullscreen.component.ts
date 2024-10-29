import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { AddFormComponent } from '../../add-form.component';


@Component({
    selector: 'fullscreen',
    templateUrl: './fullscreen.component.html',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, FuseHighlightComponent],
})
export class FullscreenComponent {
    /**
     * Constructor
     */
    constructor(private _fuseComponentsComponent: AddFormComponent) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._fuseComponentsComponent.matDrawer.toggle();
    }
}
