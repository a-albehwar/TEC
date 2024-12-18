import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'CompaignPopupWebPartStrings';
import CompaignPopup from './components/CompaignPopup';
import { ICompaignPopupProps } from './components/ICompaignPopupProps';
import { sp } from '@pnp/sp';

export interface ICompaignPopupWebPartProps {
  description: string;
}

export default class CompaignPopupWebPart extends BaseClientSideWebPart<ICompaignPopupWebPartProps> {
  protected onInit(): Promise<void> {
    //<summary> On Init Method to intialize the pnp sp js object</summary>
        sp.setup({
        spfxContext: this.context
        });
        
        return super.onInit();
  }
  public render(): void {
   // debugger;
    const element: React.ReactElement<ICompaignPopupProps> = React.createElement(
      
      CompaignPopup,
      {
       // description: this.properties.description
       listName: "Campaign_ItemsList",
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.site.absoluteUrl,
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
