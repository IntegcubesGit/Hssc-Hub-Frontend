import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import {
    FuseNavigationItem,
    FuseVerticalNavigationComponent,
} from '../../../../../../@fuse/components/navigation';

@Component({
    selector: 'add-user',
    templateUrl: './add-user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        FuseVerticalNavigationComponent,
        RouterModule,
    ],
})
export class AddUserComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'generalInfo';
    userId: string | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    menuData: FuseNavigationItem[] = [];

    constructor(private _route: ActivatedRoute) {}

    ngOnInit(): void {
        this._route.params.subscribe((params) => {
            const id = params['id'];
            this.initializeMenuData(id);
        });
    }

    initializeMenuData(id: number): void {
        this.menuData = [
            {
                id: 'fuse-components.components',
                mainTitle: 'User Configuration',
                mainSubtitle: 'User Configuration Overview',
                mainIcon: 'heroicons_outline:user',
                isSubmenu: true,
                type: 'group',
                children: [
                    {
                        id: 'generalInfo',
                        icon: 'heroicons_outline:user-circle',
                        title: 'General Information',
                        type: 'basic',
                        link: `/user/user-info/${id}/general-info`,
                    },
                    {
                        id: 'sites',
                        icon: 'heroicons_outline:credit-card',
                        title: 'Roles and Sites Access',
                        type: 'basic',
                        link: `/user/user-info/${id}/sites-info`,
                    },
                ],
            },
        ];
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
