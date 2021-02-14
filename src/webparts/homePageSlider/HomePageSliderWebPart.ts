import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HomePageSliderWebPart.module.scss';
import * as strings from 'HomePageSliderWebPartStrings';
import {ISPList} from "./../../Interfaces/IHomePageSlider"
export interface IHomePageSliderWebPartProps {
  description: string;
}

export default class HomePageSliderWebPart extends BaseClientSideWebPart<IHomePageSliderWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.homePageSlider }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;

      
  }

  // private GetSlides(): void {
  //   let html: string = '<table border=1 width=100% style="border-collapse: collapse;">';
  //   html += '<th>Full Name</th><th>Address</th><th>Email ID</th><th>Phone Number</th>';
  //   this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items`, SPHttpClient.configurations.v1)
  //     .then(response => {
  //       return response.json()
  //         .then((items: any): void => {
  //           console.log('items.value: ', items.value);
  //           let listItems: ISPList[] = items.value;
  //           console.log('list items: ', listItems);
 
  //           listItems.forEach((item: ISPList) => {
  //             html += `   
  //                <tr>                              
  //                  <td>${item.Title}</td>
  //                  <td>${item}</td>                    
  //                </tr>
  //                 `;
  //           });
  //           html += '</table>';
  //           const listContainer: Element = this.domElement.querySelector('#tblRegistrationDetails');
  //           listContainer.innerHTML = html;
  //         });
  //     });
  // }

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
