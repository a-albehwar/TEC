export interface IEvent {  
    subject: string;  
    start?: string;  
    end?: string;  
    eventType:string;
}  
  
export interface IEventColl{  
    value: IEvent[];  
}  

