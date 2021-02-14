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
// import pnp from "sp-pnp-js";
// import { default as pnp, ItemAddResult } from "sp-pnp-js";
// import { spODataEntityArray, Comment, CommentData, Web, ItemAddResult, sp} from "@pnp/sp";
// import { sp } from "@pnp/sp/presets/all";
export interface IEmployeeSuggestionsWebPartProps {
  description: string;
}

export interface ISPList {
  Title: string;
  Suggestion: string;
}
export default class EmployeeSuggestionsWebPart extends BaseClientSideWebPart<IEmployeeSuggestionsWebPartProps> {
  private Listname: string = "EmployeeSuggestions";
  private listItemId: number = 0;
  public render(): void {
    this.domElement.innerHTML = `
      <div>       
        <table>  
          <tr>  
            <td>Full Name</td>            
            <td><input type="text" id="idTitle" name="fullName" placeholder="Full Name.."></td>
          </tr>          
          <tr>            
            <td>Address</td>            
            <td><input type="text" id="idSuggestion" name="address" placeholder="Address.."></td>
          </tr>          
        </table>    
        <table>          
          <tr>            
             <td><button class="${styles.button} find-Button">Find</button></td>          
             <td><button class="${styles.button} create-Button">Create</button></td>            
             <td><button class="${styles.button} update-Button">Update</button></td>            
             <td><button class="${styles.button} delete-Button">Delete</button></td>            
             <td><button class="${styles.button} clear-Button">Clear</button></td>
          </tr>
        </table>        
        <div id="tblRegistrationDetails"></div>
      </div>
     `;
    this.setButtonsEventHandlers();
    this.getListData();
  }
 
  private setButtonsEventHandlers(): void {
    const webPart: EmployeeSuggestionsWebPart = this;
    this.domElement.querySelector('button.find-Button').addEventListener('click', () => { webPart.find(); });
    this.domElement.querySelector('button.create-Button').addEventListener('click', () => { webPart.save(); });
    this.domElement.querySelector('button.update-Button').addEventListener('click', () => { webPart.update(); });
    this.domElement.querySelector('button.delete-Button').addEventListener('click', () => { webPart.delete(); });
    this.domElement.querySelector('button.clear-Button').addEventListener('click', () => { webPart.clear(); });
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
    html += '<th>Full Name</th><th>Address</th><th>Email ID</th><th>Phone Number</th>';
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
        alert('Item has been successfully Saved ');
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
