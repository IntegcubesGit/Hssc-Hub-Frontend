export interface User {
    Id: number;
    FirstName: string;
    LastName: string;
    UserName: string;
    Email: string;
    CreatedBy: number;
    Password: string;
}
export interface Pagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
