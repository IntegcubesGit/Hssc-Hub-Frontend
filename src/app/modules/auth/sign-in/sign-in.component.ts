import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { catchError, from, map, Observable } from 'rxjs';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
   
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _userService :UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [
                '',
                [Validators.required],
            ],
            password: ['', Validators.required],
            rememberMe: [false],
            timeZone: [this.getTimeZone()],
            ipAddress: [''],
            browser: [this.getBrowserInfo()],
            language: [navigator.language],
            location: [this.getLocation()],
            deviceType: [this.getDeviceType()],
            os: [this.getOperatingSystem()],
            userAgent: [navigator.userAgent],  
        });

          this.getLocation().subscribe({
            next: (loc) => {
              this.signInForm.patchValue({ location: loc }); 
            },
            error: (err) => {
              console.error(err); 
            },
          });
    }


    private getLocation(): Observable<string> {
        return new Observable<string>((observer) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const location = `${position.coords.latitude}, ${position.coords.longitude}`;
                observer.next(location);
                observer.complete();
              },
              (error) => {
                observer.error('Location not available: ' + error.message);
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              }
            );
          } else {
            observer.error('Geolocation is not supported by this browser.');
          }
        }).pipe(
          catchError((err) => {
            return from(['Error retrieving location: ' + err]);
          })
        );
      }


    private getTimeZone(): string {
        return Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    private getOperatingSystem(): string {
        const userAgent = navigator.userAgent;
        if (/Win/i.test(userAgent)) {
          return 'Windows';
        } else if (/Mac/i.test(userAgent)) {
          return 'MacOS';
        } else if (/Linux/i.test(userAgent)) {
          return 'Linux';
        } else if (/Android/i.test(userAgent)) {
          return 'Android';
        } else if (/iOS/i.test(userAgent)) {
          return 'iOS';
        }
        return 'Unknown OS';
      }


      private getDeviceType(): string {
        const userAgent = navigator.userAgent;
        if (/Mobi|Android/i.test(userAgent)) {
          return 'Mobile';
        } else if (/Tablet|iPad/i.test(userAgent)) {
          return 'Tablet';
        }
        return 'Desktop';
      }

     


      private getBrowserInfo(): string {
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
    
        if (userAgent.indexOf('Firefox') > -1) {
          browserName = 'Mozilla Firefox';
        } else if (userAgent.indexOf('Chrome') > -1) {
          browserName = 'Google Chrome';
        } else if (userAgent.indexOf('Safari') > -1) {
          browserName = 'Apple Safari';
        } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
          browserName = 'Microsoft Internet Explorer';
        }
    
        return browserName;
      }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */

    signIn(): void {
        if (this.signInForm.invalid) {
            return;
        }
        this.signInForm.disable();
        this.showAlert = false;
    
        // Sign in
        this._authService.signIn(this.signInForm.value).subscribe(
            (response) => {
                if(response.isSucceeded==1){
                // Store the access token in local storage
                const accessToken = response.accessToken;
                localStorage.setItem('accessToken', accessToken); // Store in local storage
              
     
                this._userService.user = response.user;
                this._authService._authenticated = true;
      
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                this._router.navigateByUrl(redirectURL);
                }else{
                    this.signInForm.enable();
                 
                    this.alert = {
                        type: 'error',
                        message: response.message || 'Something Went Wrong Please Try again',
                    };
        
              
                    this.showAlert = true;
                }


            },
            (error) => {
             
                this.signInForm.enable();
           
                this.alert = {
                    type: 'error',
                    message: error.error?.message || 'Something Went Wrong Please Try again', 
                };
    
                // Show the alert
                this.showAlert = true;
            }
        );
    }
    



}
