export interface CaseCategory {
    caseCategoryId: number;  
    code: string;           
    title: string;           
}

export interface RiskCategory {
    riskCategoryId: number;  
    code: string;        
    title: string;         
}



export interface InjuryType {
    injuryTypeId: number;  
    code: string;          
    title: string;       
}

export interface BusinessUnit {
    businessUnitId: number; 
    code: string;
    title: string;
}

export interface CaseStatus {
    caseStatusId: number; 
    code: string;
    title: string;
  
}


export interface Department {
    tenantId: number; 
    departmentId: number; 
    code: string;
    title: string;
    isDeleted: number;
}

export interface InjuryCategory {
    injuryCategoryId: number;
    code: string;
    title: string;
}


export interface InjuryType {
    injuryTypeId: number;
    code: string;
    title: string;
}

export interface ActionType {
    actionTypeId: number;
    code: string;
    title: string;
  }
  
  export interface ActionStatus {
    actionStatusId: number;
    code: string;
    title: string;
    order: number;
  }