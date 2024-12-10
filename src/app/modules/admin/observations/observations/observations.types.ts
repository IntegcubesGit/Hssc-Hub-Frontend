// export interface Case {
//     caseId: string;        
//     caseIdLong: number;     
//     caseNumber: string;      
//     workPlace: string;       
//     caseDate: Date;         
//     dueDate: Date;           
//     department: string;      
//     case: string;  
//     caseCategory: string; 
//     timezone:String;
//     description:String;
//     CreatedOn:Date,
//     CreatedBy:String,
//     connectedCaseId:string,
//     title:string
//   }

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

