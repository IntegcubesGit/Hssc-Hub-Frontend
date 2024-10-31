export interface Case {
    caseId: number;        
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

export interface InventoryCategory {
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand {
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag {
    id?: string;
    title?: string;
}

export interface InventoryVendor {
    id: string;
    name: string;
    slug: string;
}
