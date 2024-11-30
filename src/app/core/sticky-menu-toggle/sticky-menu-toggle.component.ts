import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddFormComponent } from 'app/modules/admin/incident_Reporting/incident_Reporting/add-form/add-form.component';

@Component({
  selector: 'app-sticky-menu-toggle',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './sticky-menu-toggle.component.html',
})
export class StickyMenuToggleComponent {
  constructor(public _fuseComponentsComponent: AddFormComponent,) {}
  toggleDrawer(): void {
    this._fuseComponentsComponent.matDrawer.toggle();
  }
}
