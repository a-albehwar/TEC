import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NewEmployeeWebPartStrings';
import NewEmployee from './components/NewEmployee';
import { INewEmployeeProps } from './components/INewEmployeeProps';

export interface INewEmployeeWebPartProps {
  description: string;
  siteurl: string;
 
}

export default class NewEmployeeWebPart extends BaseClientSideWebPart<INewEmployeeWebPartProps> {

  /*public render(): void {
    const element: React.ReactElement<INewEmployeeProps> = React.createElement(
      NewEmployee,
      {
        description: this.properties.description,
      }
    );

    ReactDom.render(element, this.domElement);
  }
  */
  public render(): void {
    const element: React.ReactElement<INewEmployeeProps> = React.createElement(
      NewEmployee,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.site.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        pageSize: 2,
        weburl:this.context.pageContext.web.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

 /* protected get dataVersion(): Version {
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
