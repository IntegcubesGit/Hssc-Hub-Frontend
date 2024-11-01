import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseNavigationItem, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseScrollResetDirective } from '@fuse/directives/scroll-reset';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-add-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatSidenavModule,
    FuseVerticalNavigationComponent,
    FuseScrollResetDirective,
    RouterOutlet,
  ],
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  drawerOpened: boolean;
  menuData: FuseNavigationItem[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private router = inject(Router);

  constructor(
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to media query change
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
       
        if (matchingAliases.includes('md')) {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        } else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }
      });

    // Subscribe to route parameters
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('AddFormComponent ID:', id); 
      this.initializeMenuData(id); 
    });
  }

  initializeMenuData(id: number): void {
    this.menuData = [
      {
        id: 'fuse-components.components',
        title: 'Incident Reporting',
        type: 'group',
        children: [
          {
            id: 'fuse-components.components.general_information',
            title: 'General Information',
            type: 'basic',
            link: `/case/information/${id}/general-information`,
          },
          {
            id: 'fuse-components.components.drawer',
            title: 'Injury',
            type: 'basic',
            link: `/case/information/${id}/injury`,
          },
          {
            id: 'fuse-components.components.fullscreen',
            title: 'Involved Person',
            type: 'basic',
            link: '/case/incident_Reporting/case_Info/components/fullscreen',
          },
          {
            id: 'fuse-components.components.highlight',
            title: 'Potential Loss',
            type: 'basic',
            link: '/case/incident_Reporting/case_Info/components/highlight',
          },
          {
            id: 'fuse-components.components.loading-bar',
            title: 'Immediate Cause',
            type: 'basic',
            link: '/case/incident_Reporting/case_Info/components/loading-bar',
          },
          {
            id: 'fuse-components.components.masonry',
            title: 'Actions',
            type: 'basic',
            link: '/case/incident_Reporting/case_Info/components/masonry',
          },
          {
            id: 'fuse-components.components.attachments',
            title: 'Attachments',
            type: 'basic',
            link: '/case/incident_Reporting/case_Info/components/navigation',
          },
          {
            id: 'fuse-components.components.comments',
            title: 'Comments',
            type: 'basic',
            link: '/case/incident_Reporting/case_Info/components/comments',
          },
          {
            id: 'fuse-components.components.signatures',
            title: 'Signatures',
            type: 'basic',
            link: '/case/incident_Reporting/case_Info/components/signatures',
          },
          {
            id: 'fuse-components.components.connected_case',
            title: 'Connected Case',
            type: 'basic',
            link: '/case/incident_Reporting/case_Info/components/connected_case',
          },
        ],
      }
    ];
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
