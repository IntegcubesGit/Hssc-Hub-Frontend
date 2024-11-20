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

  // Trigger the alert and create the dynamic component
  triggerAlert(type: string, title: string, message: string) {
    this.alertSubject.next({ type, title, message });
    this.createAlertComponent(type, title, message);
  }

  // Create and append alert component dynamically
  private createAlertComponent(type: string, title: string, message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const alertComponentRef = alertComponentFactory.create(this.injector);

    alertComponentRef.instance.alertType = type;
    alertComponentRef.instance.alertTitle = title;
    alertComponentRef.instance.alertMessage = message;

    // Attach component to app's view
    this.appRef.attachView(alertComponentRef.hostView);

    // Get the DOM element and append it to the body
    const domElem = (alertComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
      this.appRef.detachView(alertComponentRef.hostView);
      alertComponentRef.destroy();
    }, 3000);
  }

  hideAlert() {
    this.alertSubject.next({ type: '', title: '', message: '' });
  }
}
