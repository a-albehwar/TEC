import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEmpSuggestionBoxProps {
  description: string;
  context:WebPartContext;
  siteurl: string;
  weburl:string;
  pagecultureId:string;
  loginName:string;
}
