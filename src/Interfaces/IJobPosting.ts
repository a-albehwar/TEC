export interface IJobPostingsList {
    Title: string;
    Title_Ar: string;
    JobDescription: string;
    JobDescription_Ar:string;
    ExpireDate: Date;
    WorkType: string;
    WorkType_Ar: string;
    RequiredSkills: string;
    RequiredSkills_Ar:string;
    Requirements: string;
    Requirements_Ar:string;
    Roles: string;
    ApplyLink: {
      Description: string,
      Url: string
    }
    Location: string;
    Location_Ar:string;
    Salary: number;
    Gender: string;
    Gender_Ar:String;
    Qualification:string;
    Qualification_Ar:string;
    Experience:string;
    Experience_Ar:string;
    Department:{
      Tilte:string;
    }
  }