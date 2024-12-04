export interface AppRole {
    id: number;
    name: string;
    NormalizedName: string;
    ConcurrencyStamp: string;
    tenantId: number;
    isDeleted: number;
    deletedBy?: number | null;
    deletedOn?: Date | null;
    createdOn: Date;
    createdBy: string;
    modifiedOn?: Date | null;
    modifiedBy?: number | null;
    timezone: string;
}

export interface Pagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface MenuDTO {
    menuId: number;
    id: string;
    title: string;
    subtitle: string;
    type: string;
    icon: string;
    link: string;
    children: MenuDTO[];
}

