import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'dashboard',
    standalone   : true,
    templateUrl  : './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    imports      : [ CommonModule, MatIcon, MatMenuModule],
})
export class dashboardComponent implements OnInit, OnDestroy 
{   
    loading: boolean = true;
    user: User | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(private _userService: UserService,  private _changeDetectorRef: ChangeDetectorRef)
    { }

    ngOnInit(): void {
        this._userService.get().pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((user: any) => {
            this.loading=true;
            this.user = user;
            this.loading = false; 
            this._changeDetectorRef.markForCheck();
        }, () => {
            this.loading = false; 
        });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
