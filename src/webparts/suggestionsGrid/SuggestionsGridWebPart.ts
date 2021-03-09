import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SuggestionsGridWebPartStrings';
import SuggestionsGrid from './components/SuggestionsGrid';
import { ISuggestionsGridProps } from './components/ISuggestionsGridProps';

export interface ISuggestionsGridWebPartProps {
  description: string;
}

export default class SuggestionsGridWebPart extends BaseClientSideWebPart<ISuggestionsGridWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISuggestionsGridProps> = React.createElement(
      SuggestionsGrid,
      {
        description: this.properties.description,
        weburl:this.context.pageContext.web.absoluteUrl,
        pagecultureId:this.context.pageContext.cultureInfo.currentUICultureName,
        spHttpClient: this.context.spHttpClient,
        siteurl: this.context.pageContext.site.absoluteUrl,
        pageSize:2,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

 /*  protected get dataVersion(): Version {
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
