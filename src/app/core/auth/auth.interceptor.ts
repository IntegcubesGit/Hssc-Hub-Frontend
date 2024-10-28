import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable, catchError, tap, throwError } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    let newReq = req.clone();
        newReq = req.clone({
            headers: req.headers.set(
                'Authorization',
                'Bearer ' + authService.accessToken
            ),
        });
    // Response
    return next(newReq).pipe(
        tap((event) => {
            if (event instanceof HttpResponse && event.status === 401) {
        
                authService.signOut();
                location.reload();
            }
        }),
        
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
           
                authService.signOut();

                location.reload();
            }

            return throwError(error);
        })
    );
};
