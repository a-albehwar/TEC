import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SuggestionBoxWebPart.module.scss';
import * as strings from 'SuggestionBoxWebPartStrings';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface ISuggestionBoxWebPartProps {
  description: string;
}
interface IListItem {
  Title?: string;
  Id: number;
  Description: string;
}
declare var arrLang: any;
declare var lang: any;

export default class SuggestionBoxWebPart extends BaseClientSideWebPart<ISuggestionBoxWebPartProps> {
   
  private Listname: string = "SuggestionsBox";
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
    `;
    
    this.setButtonsEventHandlers();
  }

  /* protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  */

 private setButtonsEventHandlers(): void {
  const webPart: SuggestionBoxWebPart = this;
    // this.domElement.querySelector('button.find-Button').addEventListener('click', () => { webPart.find(); });
    this.domElement.querySelector('#btnSubmit').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.save();
     });

  }


  private save(): void {
    const body: string = JSON.stringify({
      'Title': document.getElementById('idTitle')["value"],
      'Description': document.getElementById('idSuggestion')["value"],    
    });
 
    this.context.spHttpClient.post(`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'X-HTTP-Method': 'POST',
          'Content-type': 'application/json;odata=verbose',
        },
        body: body
      }).then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      })
      .then((item: IListItem): void => {
        
        console.log(`Item '${item.Title}' (ID: ${item.Id}) successfully created`);
      },  (error: any): void => {
        alert(`${error}`);
      });
  }

 
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
