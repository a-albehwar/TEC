import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './KbDetailsWebPart.module.scss';
import * as strings from 'KbDetailsWebPartStrings';

import * as moment from 'moment';

import {  SPHttpClient ,SPHttpClientResponse } from '@microsoft/sp-http';  

export interface IKbDetailsWebPartProps {
  description: string;
}
declare var arrLang: any;
declare var lang: any;
const url : any = new URL(window.location.href);
const kbid= url.searchParams.get("kbid");

export interface ISPLists 
{
  value: ISPList[];
}
export interface ISPList 
{
  Title: string;
  Title_Ar:string;
  ID:number;
  Description:string;
  Description_Ar:string;
  Image: {
    Description: string,
    Url: string
  }
  CreatedDate:Date;
}

export default class KbDetailsWebPart extends BaseClientSideWebPart<IKbDetailsWebPartProps> {

  items: any;

  private Listname: string = "KnowledgeBase";

  private getMediaByID() {
    let html: string = '<div class="container-fluid mt-5"><div class="row">';
    
    this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            console.log('items.value: ', items.value);
            let listItems: ISPList[] = items.value;
            console.log('list items: ', listItems);
 
            listItems.forEach((item: ISPList) => {
              if (item.ID === parseInt(kbid)) {
                var momentObj = moment(item.CreatedDate);
                var formatkbDate=momentObj.format('DD-MM-YYYY');
               var kbtitle=lang=="en"?item.Title: item.Title_Ar;
               var kbdesc=lang=="en"?item.Description: item.Description_Ar;
               var imgurl=item.Image.Url;
              html += `
              <div class="col-md-6 col-12 mediaimg">
                   <img src="${imgurl}" class="img-fluid">
              </div>
              <div class="col-md-6 col-12">
                    <div class="mediadetail">
                            <h2>${kbtitle}</h2>
                            <p class="detaildate">${formatkbDate}</p>
                        </div>
                    <p class="mediadetaildis">
                    ${kbdesc} 
                    </p>   
              </div>
              `;
              }
            });
            html += ' </div></div>';
            const listContainer: Element = this.domElement.querySelector('#kbdetailsContainer');
            listContainer.innerHTML = html;
          });
      });
  }

  public render(): void {
    this.domElement.innerHTML = `
    <section class="inner-page-cont" id="kbdetailsContainer">
    </section>`;

      this.Localization();
      this.getMediaByID();
  }

  private Localization(): void {
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
     lang=lcid==13313?"ar":"en";
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
