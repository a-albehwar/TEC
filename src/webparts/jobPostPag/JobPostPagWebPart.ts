import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'JobPostPagWebPartStrings';
import JobPostPag from './components/JobPostPag';
import { IJobPostPagProps } from './components/IJobPostPagProps';

export interface IJobPostPagWebPartProps {
  description: string;
  siteurl: string;
}

export default class JobPostPagWebPart extends BaseClientSideWebPart<IJobPostPagWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IJobPostPagProps> = React.createElement(
      JobPostPag,
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
