import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmpSuggestionBoxWebPartStrings';
import EmpSuggestionBox from './components/EmpSuggestionBox';
import { IEmpSuggestionBoxProps } from './components/IEmpSuggestionBoxProps';
import { sp } from "@pnp/sp";  
export interface IEmpSuggestionBoxWebPartProps {
  description: string;
}

export default class EmpSuggestionBoxWebPart extends BaseClientSideWebPart<IEmpSuggestionBoxWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEmpSuggestionBoxProps> = React.createElement(
      EmpSuggestionBox,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.site.absoluteUrl,
        weburl:this.context.pageContext.web.absoluteUrl,
        pagecultureId:this.context.pageContext.cultureInfo.currentUICultureName,
        loginName:this.context.pageContext.user.displayName,
        context:this.context,
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
  
  public onInit(): Promise<void> {  
    return super.onInit().then(_ => {    
      sp.setup({  
        sp: {
          headers: {
            "Accept": "application/json; odata=nometadata"
          }
        } 
      });  
    });  
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
