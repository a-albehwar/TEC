import { SPHttpClient } from '@microsoft/sp-http';

export interface IKnowledgeBaseProps {
  description: string;
  weburl:string;
  pagecultureId:string;
  spHttpClient:SPHttpClient;
  siteurl: string;
  pageSize:number;
}
