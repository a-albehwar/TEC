import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MediaWebPartStrings';
import Media from './components/Media';
import { IMediaProps } from './components/IMediaProps';

export interface IMediaWebPartProps {
  description: string;
}

export default class MediaWebPart extends BaseClientSideWebPart<IMediaWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMediaProps> = React.createElement(
      Media,
      {
        description: this.properties.description,
        weburl:this.context.pageContext.web.absoluteUrl,
        pagecultureId:this.context.pageContext.cultureInfo.currentUICultureName,
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
