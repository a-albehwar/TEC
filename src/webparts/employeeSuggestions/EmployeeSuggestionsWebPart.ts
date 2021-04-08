import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./EmployeeSuggestionsWebPart.module.scss";
import * as strings from "EmployeeSuggestionsWebPartStrings";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IList } from "@pnp/sp/lists";
import {ISPList} from "./../../Interfaces/IEmployeeSugesstions"
// import "./../../JS/"
// import pnp from "sp-pnp-js";
// import { default as pnp, ItemAddResult } from "sp-pnp-js";
// import { spODataEntityArray, Comment, CommentData, Web, ItemAddResult, sp} from "@pnp/sp";
// import { sp } from "@pnp/sp/presets/all";
export interface IEmployeeSuggestionsWebPartProps {
  description: string;
}
declare var arrLang: any;
//declare var lang: any;
// export interface ISPList {
//   Title: string;
//   Suggestion: string;
// }

export default class EmployeeSuggestionsWebPart extends BaseClientSideWebPart<IEmployeeSuggestionsWebPartProps>  {


  private Listname: string = "EmployeeSuggestions";
  private listItemId: number = 0;
  public render(): void {
    this.domElement.innerHTML = `
        <br/>
    <div class="col-lg-4  mb-2">    
      <label id="lblTitle" class="form-label">Title </label>
      <input type="text" id="idTitle" class="form-input" name="Title" placeholder="Suggestion Title">
    </div>   
    <div class="col-lg-4  mb-2">    
      <label id="lblSuggestion" class="form-label"> Suggestion </label>
      <textarea style="height:auto !important" rows="5" cols="5" id="idSuggestion" class="form-input" name="Suggesstion" 
      placeholder="Suggestion"></textarea>
    </div>  
    <div class="col-lg-4">
      <button class="red-btn red-btn-effect shadow-sm  mt-4" id="btnSubmit"> <span>Submit</span></button>
    </div>
  
      <br/>
        <!--<div id="tblRegistrationDetails"></div>-->
     
     `;
    this.Localization();
    this.setButtonsEventHandlers();
    //this.getListData();
  }
 
  private Localization(): void {
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
    var lang=lcid==13313?"ar":"en";
    $('#btnSubmit').text(arrLang[lang]['EmployeeSuggestions']['Submit']);
    $('#idTitle').attr("placeholder", arrLang[lang]['EmployeeSuggestions']['Title']);
    $('#idSuggestion').attr("placeholder", arrLang[lang]['EmployeeSuggestions']['Suggestion']);
    $('#lblTitle').text(arrLang[lang]['EmployeeSuggestions']['lblTitle']);
	  $('#lblSuggestion').text(arrLang[lang]['EmployeeSuggestions']['Suggestion']);
  }
  private setButtonsEventHandlers(): void {
    const webPart: EmployeeSuggestionsWebPart = this;
    // this.domElement.querySelector('button.find-Button').addEventListener('click', () => { webPart.find(); });
    this.domElement.querySelector('#btnSubmit').addEventListener('click', () => { webPart.save(); });    
  }
 
  private find(): void {
    let emailId = prompt("Enter the Email ID");
    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items?$select=*&$filter=Title eq '${emailId}'`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((item: any): void => {
            document.getElementById('idTitle')["value"] = item.value[0].Title;
            document.getElementById('idSuggestion')["value"] = item.value[0].Address;
            this.listItemId = item.value[0].Id;
          });
      });
  }
 
  private getListData() {
    let html: string = '<table border=1 width=100% style="border-collapse: collapse;">';
    html += '<th>Suggestion Title</th><th>Suggestion</th>';
    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            console.log('items.value: ', items.value);
            let listItems: ISPList[] = items.value;
            console.log('list items: ', listItems);
 
            listItems.forEach((item: ISPList) => {
              html += `   
                 <tr>                              
                   <td>${item.Title}</td>
                   <td>${item.Suggestion}</td>                    
                 </tr>
                  `;
            });
            html += '</table>';
            const listContainer: Element = this.domElement.querySelector('#tblRegistrationDetails');
            listContainer.innerHTML = html;
          });
      });
  }
 
  private save(): void {
    const body: string = JSON.stringify({
      'Title': document.getElementById('idTitle')["value"],
      'Suggestion': document.getElementById('idSuggestion')["value"],    
    });
 
    this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'X-HTTP-Method': 'POST'
        },
        body: body
      }).then((response: SPHttpClientResponse): void => {
        this.getListData();
        this.clear();
        alert('Suggestion has been successfully Saved ');
      }, (error: any): void => {
        alert(`${error}`);
      });
  }
 
  private update(): void {
    const body: string = JSON.stringify({
      'Title': document.getElementById('idTitle')["value"],
      'Address': document.getElementById('idSuggestion')["value"],
    });
 
    this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items(${this.listItemId})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'IF-MATCH': '*',
          'X-HTTP-Method': 'PATCH'
        },
        body: body
      }).then((response: SPHttpClientResponse): void => {
        this.getListData();
        this.clear();
        alert(`Item successfully updated`);
      }, (error: any): void => {
        alert(`${error}`);
      });
  }
 
  private delete(): void {
    if (!window.confirm('Are you sure you want to delete the latest item?')) {
      return;
    }
 
    this.context.spHttpClient.post(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items(${this.listItemId})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'IF-MATCH': '*',
          'X-HTTP-Method': 'DELETE'
        }
      }).then((response: SPHttpClientResponse): void => {
        alert(`Item successfully Deleted`);
        this.getListData();
        this.clear();
      }, (error: any): void => {
        alert(`${error}`);
      });
  }
 
  private clear(): void {
    document.getElementById('idTitle')["value"] = "";
    document.getElementById('idSuggestion')["value"] = "";
  }
 
  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
