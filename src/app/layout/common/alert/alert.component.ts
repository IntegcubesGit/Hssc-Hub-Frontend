import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { AlertService } from './alert.service';
import { Subscription } from 'rxjs';
import { FuseAlertComponent } from "../../../../@fuse/components/alert/alert.component";
import { FuseAlertService } from '@fuse/components/alert';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [FuseAlertComponent],
  templateUrl: './alert.component.html',
})
export class AlertComponent implements OnInit, OnDestroy {
  alertType: string = 'primary';
  alertTitle: string = '';
  alertMessage: string = '';
  private alertSubscription: Subscription;
  private _fuseAlertService = inject(FuseAlertService);

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertSubscription = this.alertService.alert$.subscribe(alert => {
      this.alertType = alert.type;
      this.alertTitle = alert.title;
      this.alertMessage = alert.message;
    });
  }

  ngOnDestroy() {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }
  show(name: string): void {
    this._fuseAlertService.show(name);
  }
}

