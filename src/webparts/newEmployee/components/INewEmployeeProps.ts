import { SPHttpClient } from '@microsoft/sp-http';

export interface INewEmployeeProps {
    description:string;
    siteurl: string;
    //title: string;
    spHttpClient: SPHttpClient;
    pageSize: number;
    weburl:string;
    pagecultureId:string;
}
