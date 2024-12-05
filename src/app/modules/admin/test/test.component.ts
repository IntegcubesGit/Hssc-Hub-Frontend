import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { environment } from "environment/environment";
import { Menu, Role } from "./test.types";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'test-component',
    templateUrl: './test.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatCheckboxModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule
    ],
})
export class TestComponent implements OnInit {

    menuData: Menu[] = [];

    roleForm: FormGroup;
    allMenusChecked = false;
    someMenusChecked = false;
    private readonly getMenuUrl = `${environment.apiUrl}Menu/GetMenu`

    constructor(private fb: FormBuilder, private http: HttpClient) { }

    ngOnInit() {
        this.fetchMenus();
    }
    fetchMenus() {
        this.http.get<Menu[]>(this.getMenuUrl).subscribe({
            next: (menus: Menu[]) => {
                this.menuData = menus;
                this.initializeForm(); // Initialize form after menus are loaded
            },
            error: (error) => {
                console.error('Error fetching menus:', error);
                // Optionally, show an error message to the user
            }
        });
    }

    initializeForm() {
        const formControls = {
            roleName: [''],
            allMenus: [false]
        };

        this.traverseMenus(this.menuData, formControls);

        this.roleForm = this.fb.group(formControls);
    }

    traverseMenus(menus: Menu[], formControls: any) {
        menus.forEach(menu => {
            formControls[`menu_${menu.menuId}`] = [false];

            if (menu.children && menu.children.length) {
                this.traverseMenus(menu.children, formControls);
            }
        });
    }

    onAllMenusToggle() {
        this.setMenuCheckedState(this.menuData, this.allMenusChecked);
        this.updateFormState();
    }

    setMenuCheckedState(menus: Menu[], checked: boolean) {
        menus.forEach(menu => {
            menu.checked = checked;

            if (menu.children && menu.children.length) {
                this.setMenuCheckedState(menu.children, checked);
            }
        });
    }

    onParentMenuToggle(parentMenu: Menu) {
        this.setMenuCheckedState([parentMenu], parentMenu.checked);
        this.updateFormState();
    }

    onChildMenuToggle(parentMenu: Menu, childMenu: Menu) {
        this.updateParentCheckState(parentMenu);

        // Check if the parent menu is a group and if its child is checked
        if (childMenu.checked && parentMenu.type === 'group' && !parentMenu.checked) {
            parentMenu.checked = true; // Check the parent menu if a child is selected
        }

        this.updateFormState();
    }


    updateParentCheckState(parentMenu: Menu) {
        if (parentMenu.children) {
            const allChildrenChecked = parentMenu.children.every(child => child.checked);
            const someChildrenChecked = parentMenu.children.some(child => child.checked);

            parentMenu.checked = allChildrenChecked;
            parentMenu.indeterminate = someChildrenChecked && !allChildrenChecked;
        }
    }

    isParentIndeterminate(parentMenu: Menu): boolean {
        if (!parentMenu.children) return false;

        const allChecked = parentMenu.children.every(child => child.checked);
        const someChecked = parentMenu.children.some(child => child.checked);

        return someChecked && !allChecked;
    }

    updateFormState() {
        // Update global checkbox state
        this.allMenusChecked = this.isAllMenusChecked(this.menuData);
        this.someMenusChecked = this.isSomeMenusChecked(this.menuData);
    }

    isAllMenusChecked(menus: Menu[]): boolean {
        return menus.every(menu =>
            menu.checked ||
            (menu.children && this.isAllMenusChecked(menu.children))
        );
    }

    isSomeMenusChecked(menus: Menu[]): boolean {
        return menus.some(menu =>
            menu.checked ||
            (menu.children && this.isSomeMenusChecked(menu.children))
        );
    }

    onSubmit() {
        if (this.roleForm.valid) {
            const selectedMenuIds = this.getSelectedMenuIds();

            const newRole: Role = {
                roleId: 0,
                roleName: this.roleForm.get('roleName').value,
                menus: selectedMenuIds
            };

            console.log('Created Role:', newRole);
        }
    }

    getSelectedMenuIds(): number[] {
        const selectedIds: number[] = [];
        this.collectSelectedMenuIds(this.menuData, selectedIds);
        return selectedIds;
    }

    collectSelectedMenuIds(menus: Menu[], selectedIds: number[]) {
        menus.forEach(menu => {
            // If the menu is checked, add its ID to the selected list
            if (menu.checked) {
                selectedIds.push(menu.menuId);
            }

            // If the menu has children, recurse into them and collect selected IDs
            if (menu.children && menu.children.length) {
                // If any child is selected, ensure the parent is also added
                if (menu.children.some(child => child.checked)) {
                    if (!selectedIds.includes(menu.menuId)) {
                        selectedIds.push(menu.menuId);  // Add parent ID if any child is selected
                    }
                }

                // Recurse into children
                this.collectSelectedMenuIds(menu.children, selectedIds);
            }
        });
    }

}