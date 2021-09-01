import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';

//import styles from './PressReleaseDetailsWebPart.module.scss';
import * as strings from 'PressReleaseDetailsWebPartStrings';
import {  SPHttpClient ,SPHttpClientResponse } from '@microsoft/sp-http';   

export interface IPressReleaseDetailsWebPartProps {
  description: string;
}
declare var arrLang: any;
declare var lang: any;
const url : any = new URL(window.location.href);
const mediaid= url.searchParams.get("prid");

export interface ISPLists 
{
  value: ISPList[];
}

export interface ISPList 
{
  Title: string;
  Title_Ar:string;
  PublishedDate:Date;
  ID:number;
  Description:string;
  Description_Ar:string;
  PublishedSource_Ar:string;
  PublishedSource:string;
  PageContentAr:string;
  PageContentEn:string;
}

export default class PressReleaseDetailsWebPart extends BaseClientSideWebPart<IPressReleaseDetailsWebPartProps> {
  items: any;
  
  private Listname: string = "PressReleases";
  

  private getMediaByID() {
    let html: string = '<div class="row gray-box"><div class="col-md-12">';
    
    this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            console.log('items.value: ', items.value);
            let listItems: ISPList[] = items.value;
            console.log('list items: ', listItems);
 
            listItems.forEach((item: ISPList) => {
              if (item.ID === parseInt(mediaid)) {
                var momentObj = moment(item.PublishedDate);
                var formatpubDate=momentObj.format('DD-MM-YYYY');
               var mediatitle=lang=="en"?item.Title: item.Title_Ar;
               var mediadesc=lang=="en"?item.PageContentEn: item.PageContentAr;
               var mediaPubSrc=lang=="en"?item.PublishedSource: item.PublishedSource_Ar;
              html += `<h4>${mediatitle}</h4>
              <p class="detaildate"> ${formatpubDate}| <span class="detailsource">${mediaPubSrc}</span></p>
              <p class="mt-2">${mediadesc }</p>
              `;

              }
            });
            html += '</div></div>';
            const listContainer: Element = this.domElement.querySelector('#mediaContainer');
            listContainer.innerHTML = html;
          });
      });
  }
  public render(): void {
    this.domElement.innerHTML = `
    <section class="innerpagecont">
        <div class="Inner-page-title mb-4">
                <h2 class="page-heading"> Media </h2>
        </div>
        <div class="container-fluid" id="mediaContainer">
        </div>
    </section>  
    `;
    this.Localization();
    this.getMediaByID();
  }
  private Localization(): void {
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
     lang=lcid==13313?"ar":"en";
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
