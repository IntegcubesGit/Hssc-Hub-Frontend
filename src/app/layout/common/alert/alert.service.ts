import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertComponent } from './alert.component';  // Adjust path as necessary

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<{
    type: string;
    title: string;
    message: string;
  }>({ type: 'primary', title: '', message: '' });

  alert$ = this.alertSubject.asObservable();
  
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  triggerAlert(type: string, title: string, message: string) {
    this.alertSubject.next({ type, title, message });
    this.createAlertComponent(type, title, message);
  }

  private createAlertComponent(type: string, title: string, message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const alertComponentRef = alertComponentFactory.create(this.injector);

    alertComponentRef.instance.alertType = type;
    alertComponentRef.instance.alertTitle = title;
    alertComponentRef.instance.alertMessage = message;

    this.appRef.attachView(alertComponentRef.hostView);

    const domElem = (alertComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    setTimeout(() => {
      this.appRef.detachView(alertComponentRef.hostView);
      alertComponentRef.destroy();
    }, 3000);
  }

  hideAlert() {
    this.alertSubject.next({ type: '', title: '', message: '' });
  }
}

/*
Usage:
1) import : import { AlertService } from 'app/layout/common/alert/alert.service';
2) Add to constructor : private alertService: AlertService
3) Calls: 
Success: this.alertService.triggerAlert('success', 'Success', 'This is a success alert');
Error: this.alertService.triggerAlert('error', 'Error', 'This is an error alert');
Info: this.alertService.triggerAlert('info', 'Info', 'This is an info alert');
Warning: this.alertService.triggerAlert('warning', 'Warning', 'This is a warning alert');
*/