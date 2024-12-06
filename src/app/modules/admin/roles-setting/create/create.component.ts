import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
    MatTreeFlatDataSource,
    MatTreeFlattener,
    MatTreeModule,
} from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/layout/common/alert/alert.service';
import { ListSettingService } from '../roles-setting.sevice';
import { FlatNode, MenuDTO } from '../roles-setting.types';

@Component({
    selector: 'app-user-roles',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatButtonModule,
        MatTreeModule,
    ],
    templateUrl: './create.component.html',
})
export class CreateComponent {
    rolesForm: UntypedFormGroup;
    roleId: string | null = null;
    menus: MenuDTO[] = [];
    TREE_DATA: MenuDTO[] = [];
    selectAll: boolean = false;
    selectSingle: any[] = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _service: ListSettingService,
        private route: ActivatedRoute,
        private _alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.roleId = this.route.snapshot.paramMap.get('id');
        this.rolesForm = this._formBuilder.group({
            roleName: ['', Validators.required],
        });

        if (this.roleId === '-1') {
            this.rolesForm.reset();
        }

        this.getUserMenus();
        this.assignMenusAndRole();
        this.updateSelectAllState();
    }

    expandAll() {
        this.treeControl?.dataNodes?.forEach((node) => {
            this.treeControl.expand(node);
        });
    }

    private _transformer = (node: MenuDTO, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.title,
            level: level,
            parentId: node.parentId,
            checked: false,
            id: node.menuId,
        };
    };

    treeControl = new FlatTreeControl<FlatNode>(
        (node) => node.level,
        (node) => node.expandable
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children
    );

    dataSource = new MatTreeFlatDataSource(
        this.treeControl,
        this.treeFlattener
    );

    hasChild = (_: number, node: FlatNode) => node.expandable;

    findByParentId(parentId: number): boolean {
        const children = this.treeControl?.dataNodes?.filter(
            (node) => node.parentId === parentId
        );
        return children.length > 0 && children?.every((child) => child.checked);
    }

    onNodeCheckboxChange(node: FlatNode, event: MatCheckboxChange): void {
        node.checked = event.checked;
        if (event.checked) {
            this.setParentTruthy(node.parentId);
            this.setDecendantsTruthy(node.id);
        }
        if (!event.checked) {
            this.setParentFalsy(node.parentId);
            this.setDecendantsFalsy(node.id);
        }
        this.updateSelectAllState();
    }

    setParentTruthy(parentId: number) {
        const children = this.treeControl?.dataNodes?.filter(
            (n) => n.parentId === parentId
        );

        const allChildrenChecked = children?.every(
            (child) => child.checked === true
        );

        if (allChildrenChecked) {
            const parentNode = this.treeControl?.dataNodes?.find(
                (n) => n.id === parentId
            );
            if (parentNode) {
                parentNode.checked = true;
                this.setParentTruthy(parentNode.parentId);
            }
        }
    }

    setParentFalsy(parentId: number) {
        const children = this.treeControl?.dataNodes?.filter(
            (n) => n.parentId === parentId
        );

        const anyChildUnchecked = children?.some(
            (child) => child.checked === false
        );

        if (anyChildUnchecked) {
            const parentNode = this.treeControl?.dataNodes?.find(
                (n) => n.id === parentId
            );
            if (parentNode) {
                parentNode.checked = false;
                this.setParentFalsy(parentNode.parentId);
            }
        }
    }

    setDecendantsTruthy(parentId: number) {
        const parentNode = this.treeControl?.dataNodes?.find(
            (n) => n.id === parentId
        );
        if (parentNode.checked === true) {
            const children = this.treeControl?.dataNodes?.filter(
                (n) => n.parentId === parentId
            );
            children.forEach((child) => {
                child.checked = true;
                this.setDecendantsTruthy(child.id);
            });
        }
    }

    setDecendantsFalsy(parentId: number) {
        const parentNode = this.treeControl?.dataNodes?.find(
            (n) => n.id === parentId
        );
        if (parentNode.checked === false) {
            const children = this.treeControl?.dataNodes?.filter(
                (n) => n.parentId === parentId
            );
            children.forEach((child) => {
                child.checked = false;
                this.setDecendantsFalsy(child.id);
            });
        }
    }

    toggleSelectAll() {
        debugger
        if (this.selectAll) {
            this.treeControl?.dataNodes?.forEach((node) => (node.checked = true));
        } else if (!this.selectAll) {
            this.treeControl?.dataNodes?.forEach(
                (node) => (node.checked = false)
            );
        }
    }

    updateSelectAllState(): void {
        const allNodesChecked = this.treeControl?.dataNodes?.every(
            (node) => node.checked

        );
        const anyNodeChecked = this.treeControl?.dataNodes?.some(
            (node) => node.checked
        );

        if (allNodesChecked) {
            this.selectAll = true;
        } else if (!anyNodeChecked) {
            this.selectAll = false;
        } else {
            this.selectAll = false;
        }
    }

    getUserMenus() {
        this._service.getMenu().subscribe({
            next: (res) => {
                this.menus = res;
                this.TREE_DATA = res;
                this.dataSource.data = this.TREE_DATA;
                this.expandAll();
            },
            error: (err) => {
                console.log('an error occured while fetching menus', err);
            },
        });
    }

    saveMenuInfo(): void {
        const roleData = this.rolesForm.value.roleName;
        const checkedNodes = this.treeControl?.dataNodes?.filter( (node) => node.checked).map( (node) => node.id)
        if(this.roleId === '-1'){
            this._service.saveRolesData(roleData.toString(), checkedNodes).subscribe({
                next: (res) => {
                    if (res.isSucceeded) {
                        this._alertService.triggerAlert(
                            'success',
                            'Success',
                            res.message
                        );
                        this._router.navigate(['roles/list']);
                    } else {
                        this._alertService.triggerAlert(
                            'warn',
                            'Duplication',
                            res.message
                        );
                    }
                },
                error: (err) => {
                    console.log('error occured while saving records', err);
                },
            });
        }else{
            this._service.updateMenusInfo(this.roleId, roleData, checkedNodes).subscribe({
                next: (res) => {
                    if (res.isSucceeded) {
                        this._alertService.triggerAlert(
                            'success',
                            'Success',
                            res.message
                        );
                        this._router.navigate(['roles/list']);
                    } else {
                        this._alertService.triggerAlert(
                            'warn',
                            'Duplication',
                            res.message
                        );
                    }
                },
                error: (err) => {
                    console.log("error occured while updating records", err);
                }
            })

        }

    }

    assignMenusAndRole() {
        this._service.getMenuRoleById(Number(this.roleId)).subscribe({
            next: (res) => {
                if (res) {
                    if (res.roleName) {
                        this.rolesForm.patchValue({
                            roleName: res.roleName[0] || '',
                        });
                    }
                    if (res.menus && Array.isArray(res.menus)) {
                        const menuIds = new Set(res.menus.map((item) => item.menuId));

                        // Track whether all nodes are checked
                        let allChecked = true;

                        this.treeControl?.dataNodes?.forEach((node) => {
                            if (menuIds.has(node.id)) {
                                node.checked = true;
                            } else {
                                node.checked = false;
                                allChecked = false; // If any node is unchecked, set allChecked to false
                            }
                        });

                        // Set selectAll based on allChecked
                        this.selectAll = allChecked;
                    }
                }
            },
            error: (err) => {
                console.error(
                    'error occurred while fetching menus from API',
                    err
                );
            },
        });
    }


    navigateUserBack(): void {
        this._router.navigate(['roles/list']);
    }

    onSubmit(): void {}

}
