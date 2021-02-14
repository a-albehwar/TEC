import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PushSmsWebPart.module.scss';
import * as strings from 'PushSmsWebPartStrings';

//import { SPHttpClient, SPHttpClientResponse,HttpClientResponse,HttpClient,IHttpClientOptions } from '@microsoft/sp-http';

import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface IPushSmsWebPartProps {
  description: string;
}

declare var arrLang: any;

export default class PushSmsWebPart extends BaseClientSideWebPart<IPushSmsWebPartProps> {

  private Listname: string = "EmployeeSuggestions";
  private listItemId: number = 0;
  
  
  public render(): void {
    this.domElement.innerHTML = `
    <br/>
    <div class="col-lg-4  mb-2">    
      <label id="lblTitle" class="form-label">Mobile Number </label>
      <input type="text" id="idTitle" class="form-input" name="Title" placeholder="Enter Mobile Number">
    </div>   
    <div class="col-lg-4  mb-2">    
      <label id="lblSuggestion" class="form-label"> Message </label>
      <textarea style="height:auto !important" rows="5" cols="5" id="idSuggestion" class="form-input" name="Suggesstion" 
      placeholder="Type Message here"></textarea>
    </div>  
    <div class="col-lg-4">
      <button class="red-btn red-btn-effect shadow-sm  mt-4" id="btnSubmit"> <span>Submit</span></button>
    </div>
    <br/>
    <!--<div id="tblRegistrationDetails"></div>-->  
    `;
    this.Localization();
    this.setButtonsEventHandlers();
  }
  
  private clear(): void {
    document.getElementById('idTitle')["value"] = "";
    document.getElementById('idSuggestion')["value"] = "";
  }

  private Localization(): void {
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
    var language=lcid==1025?"ar":"en";
    /*$('#btnSubmit').text(arrLang[language]['EmployeeSuggestions']['Submit']);
    $('#idTitle').attr("placeholder", arrLang[language]['EmployeeSuggestions']['Title']);
    $('#idSuggestion').attr("placeholder", arrLang[language]['EmployeeSuggestions']['Suggestion']);
    $('#lblTitle').text(arrLang[language]['EmployeeSuggestions']['lblTitle']);
    $('#lblSuggestion').text(arrLang[language]['EmployeeSuggestions']['Suggestion']);
    */
  }

  private setButtonsEventHandlers(): void {
    const webPart: PushSmsWebPart = this;
    // this.domElement.querySelector('button.find-Button').addEventListener('click', () => { webPart.find(); });
    this.domElement.querySelector('#btnSubmit').addEventListener('click', () => { 
      webPart.send();
     });    
  }

  /*private  num= document.getElementById('idTitle')["value"];
  private msg=document.getElementById('idSuggestion')["value"];
  */
  private send(): void {



    const body: string = JSON.stringify({
      'Title': document.getElementById('idTitle')["value"],
      'Suggestion': document.getElementById('idSuggestion')["value"],    
    });
    
   /* const httpClientOptions: IHttpClientOptions = {
      headers: new Headers(),
      method: "GET",
      mode: "cors"
    };
*/
  this.context.spHttpClient
  .get("http://62.215.226.164/fccsms.aspx?UID=Tourent&p=tour@321&S=InfoText&G=96565058449&M=Testmsg&L=L", SPHttpClient.configurations.v1)
  //.get("http://62.215.226.164/fccsms.aspx?UID=Tourent&p=tour@321&S=InfoText&G=96565058449&M=Testmsg&L=L", SPHttpClient.configurations.v1,httpClientOptions)
  .then((data: any): void => {
    //return response.json().then((items: any): void => {
      console.log(data);
    }, (error: any): void => {
      alert(error);
    });
 
  /*.then((res: HttpClientResponse): Promise<any> =>  {       
    return res.json();
  })
  .then((data: any): void => {
    console.log(data);
    // process your data here
  }, (err: any): void => {
    // handle error here
    console.log(err);
  });

    //http://62.215.226.164/fccsms.aspx?UID=Tourent&p=tour@321&S=InfoText&G=919700917427&M=Testmsg&L=L

    //this.context.spHttpClient.post(`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items`,
    /*this.context.spHttpClient.post(`http://62.215.226.164/fccsms.aspx?UID=Tourent&p=tour@321&S=InfoText&G=('${this.num}')&M=('${this.msg}')&L=L`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'X-HTTP-Method': 'POST'
        },
        body: body
      }).then((response: SPHttpClientResponse): void => {
        //this.getListData();
        this.clear();
        alert('message sent successfully &  Saved ');
      }, (error: any): void => {
        alert(`${error}`);
      });
    */
 
  }

  
  /*protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
