export interface Case {
    caseId: BigInt;        
    caseIdLong: number;     
    caseNumber: string;      
    workPlace: string;       
    caseDate: Date;         
    dueDate: Date;           
    department: string;      
    case: string;  
    caseCategory: string; 
    timezone:String;
    description:String;
    CreatedOn:Date,
    CreatedBy:String
  }
export interface Pagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

