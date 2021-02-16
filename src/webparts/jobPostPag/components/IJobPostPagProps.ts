
import { SPHttpClient } from '@microsoft/sp-http';

export interface IJobPostPagProps {
  description: string;
  siteurl: string;
  //title: string;
  spHttpClient: SPHttpClient;
  pageSize: number;
}
