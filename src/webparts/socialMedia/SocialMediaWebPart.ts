import 'jquery';
import 'jqueryui';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SocialMediaWebPart.module.scss';
import * as strings from 'SocialMediaWebPartStrings';

export interface ISocialMediaWebPartProps {
  description: string;
}

export default class SocialMediaWebPart extends BaseClientSideWebPart<ISocialMediaWebPartProps> {

  public render(): void {
    require('./../../JS/SocialMedia/Facebook.js');
    this.domElement.innerHTML = `
      <div id='dvHomeSocialMediaFB'> </div>
    `;
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
