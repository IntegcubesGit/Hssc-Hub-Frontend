

export interface Observation {
    caseId: string;        
    caseIdLong: number;     
    caseNumber: string;  
    caseDate: Date;         
    dueDate: Date;           
    caseStatusId: number;
    caseStatus: string;
    department: string;
    title: string;
    description: string;
    timezone: string;
    caseCategory: string;
    createdOn: Date;
    createdBy: string;
}
export interface Pagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

