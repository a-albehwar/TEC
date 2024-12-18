import { SPHttpClient } from '@microsoft/sp-http';

export interface IMediaProps {
  description: string;
  weburl:string;
  pagecultureId:string;
  spHttpClient:SPHttpClient;
  siteurl: string;
  pageSize:number;
}
