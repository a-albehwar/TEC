import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';  
export interface ICompaignPopupProps {
  //description: string;
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
  context: WebPartContext;  
}