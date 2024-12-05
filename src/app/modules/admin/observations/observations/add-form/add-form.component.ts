import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseNavigationItem, FuseVerticalNavigationComponent } from '../../../../../../@fuse/components/navigation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { FuseScrollResetDirective } from '../../../../../../@fuse/directives/scroll-reset';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'add-observation-form',
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
      this.initializeMenuData(id);
    });
  }

  initializeMenuData(id: number): void {
    this.menuData = [
      {
        id: 'fuse-components.components',
        mainTitle: 'Observations',
        mainSubtitle: 'Case Observations Overview',
        mainIcon: 'heroicons_outline:exclamation-triangle',
        isSubmenu: true,
        type: 'group',
        children: [
          {
            id: 'fuse-components.components.general_information',
            title: 'General Information',
            type: 'basic',
            link: `/observations/information/${id}/general_information_observation`,
            icon: 'mat_outline:info',
          },
          {
            id: 'fuse-components.components.highlight',
            title: 'Potential Loss',
            type: 'basic',
            link: `/observations/information/${id}/potentialLoss`,
            icon: 'mat_outline:health_and_safety',
            disabled: id == -1
          },
          {
            id: 'Immediate-Cause.components.Case-Actions',
            title: 'Actions',
            type: 'basic',
            link: `/observations/information/${id}/caseActions`,
            icon: 'mat_outline:medical_services',
            disabled: id == -1
          },
          {
            id: 'Immediate-Cause.components.attachments',
            title: 'Attachments',
            type: 'basic',
            link: `/observations/information/${id}/attachments`,
            icon: 'mat_outline:cloud_upload',
          },
          {
            id: 'Immediate-Cause.components.comments',
            title: 'Comments',
            type: 'basic',
            link: `/observations/information/${id}/comments`,
            icon: 'mat_outline:comment',
          },
          {
            id: 'Immediate-Cause.components.signatures',
            title: 'Signatures',
            type: 'basic',
            link: `/observations/information/${id}/signatures`,
            icon: 'mat_outline:gesture',
          }
        ],
      },
    ];
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
