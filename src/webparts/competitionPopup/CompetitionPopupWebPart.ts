import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'CompetitionPopupWebPartStrings';
import CompetitionPopup from './components/CompetitionPopup';
import { ICompetitionPopupProps } from './components/ICompetitionPopupProps';
import { sp } from '@pnp/sp';

export interface ICompetitionPopupWebPartProps {
  description: string;
}

export default class CompetitionPopupWebPart extends BaseClientSideWebPart<ICompetitionPopupWebPartProps> {
  protected onInit(): Promise<void> {
    //<summary> On Init Method to intialize the pnp sp js object</summary>
        sp.setup({
        spfxContext: this.context
        });
        
        return super.onInit();
  }
  public render(): void {
    const element: React.ReactElement<ICompetitionPopupProps> = React.createElement(
      CompetitionPopup,
      {
        description: this.properties.description,
        pagecultureId:this.context.pageContext.cultureInfo.currentUICultureName,
        objContext : this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

 /*  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }  */

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
