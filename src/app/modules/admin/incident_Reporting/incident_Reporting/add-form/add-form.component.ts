import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Incident_ReportingListComponent } from '../list/incident_Reporting.component';
import { filter, Subject, takeUntil } from 'rxjs';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseNavigationItem, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseScrollResetDirective } from '@fuse/directives/scroll-reset';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

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
  styleUrl: './add-form.component.scss'
})



export class AddFormComponent implements OnInit, AfterViewInit, OnDestroy  {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  drawerOpened: boolean;
  menuData: FuseNavigationItem[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(private _fuseMediaWatcherService: FuseMediaWatcherService,private route: ActivatedRoute) {
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
                      link: '/case/incident_Reporting/Info/cm/general_information',
                  },
                  {
                      id: 'fuse-components.components.card',
                      title: 'Consequences',
                      type: 'basic',
                      link: '/case/incident_Reporting/Info/c/card',
                  },
                  {
                      id: 'fuse-components.components.drawer',
                      title: 'Injury',
                      type: 'basic',
                      link: '/case/incident_Reporting/case_Info/components/drawer',
                  },
                  {
                      id: 'fuse-components.components.fullscreen',
                      title: 'Invoved Person',
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
                      id: 'fuse-components.components.navigation',
                      title: 'Attachements',
                      type: 'basic',
                      link: '/case/incident_Reporting/case_Info//navigation',
                  },
                  {
                    id: 'fuse-components.components.navigation',
                    title: 'Comments',
                    type: 'basic',
                    link: '/case/incident_Reporting/case_Info//navigation',
                },
                {
                  id: 'fuse-components.components.navigation',
                  title: 'Signatures',
                  type: 'basic',
                  link: '/case/incident_Reporting/case_Info//navigation',
              },
              {
                id: 'fuse-components.components.navigation',
                title: 'Connected Case',
                type: 'basic',
                link: '/case/incident_Reporting/case_Info//navigation',
            },
                
                  
              ],
          }
      ];
  }
ngOnInit(): void {

        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('md')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
            });
           
              this.route.params.subscribe(params => {
                console.log('AddFormComponent ID:', params['id']);  // Check if ID is captured here
              });
         

}



    /**
     * After view init
     */
    ngAfterViewInit(): void {
   
  }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
  
       // Unsubscribe from all subscriptions
       this._unsubscribeAll.next(null);
       this._unsubscribeAll.complete();


  }
}
