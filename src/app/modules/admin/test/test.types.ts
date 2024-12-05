export interface Menu {
  menuId: number;
  id: string;
  title: string;
  subtitle: string;
  type: string;
  icon: string;
  link: string | null;
  children: Menu[];
  checked?: boolean;
  indeterminate?: boolean;
}

export interface Role {
  roleId: number;
  roleName: string;
  menus: number[]; 
}
