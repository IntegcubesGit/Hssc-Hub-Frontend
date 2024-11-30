import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ListSettingService } from '../roles-setting.sevice';
import { AppRole } from '../roles-setting.types';

@Component({
    selector: 'app-user-roles',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        CommonModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 100px 40px;

                @screen sm {
                    grid-template-columns: 48px auto 100px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 100px 100px auto 96px 100px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 200px 200px auto 150px 150px 150px 150px 72px;
                }
            }
        `,
    ],
})
export class ListComponent implements OnInit {
    roles$: Observable<AppRole[] | null>;
    userRoles: AppRole[] = [];

    constructor(
        private _router: Router,
        private _service: ListSettingService,
        private _cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.GetUserRoles();
    }

    GetUserRoles() {
        this._service.getRoles().subscribe((res) => {
            debugger;
            this.userRoles = res;
            this._cdr.detectChanges();
        });
    }


    create(id: string): void {
        this._router.navigate(['roles/create', id]);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param role
     */
    trackByFn(index: number, role: any): any {
        return role.id || index;
    }
}
