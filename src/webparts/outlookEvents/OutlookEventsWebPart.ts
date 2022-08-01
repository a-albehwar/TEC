import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'OutlookEventsWebPartStrings';
import OutlookEvents from './components/OutlookEvents';
import { IOutlookEventsProps } from './components/IOutlookEventsProps';
import calendarService, { CalendarService } from './components/CalendarService';
import { sp } from '@pnp/sp';
export interface IOutlookEventsWebPartProps {
  description: string;
}

export default class OutlookEventsWebPart extends BaseClientSideWebPart<IOutlookEventsWebPartProps> {
  protected onInit(): Promise<void> {  
    sp.setup({
      spfxContext: this.context
      });
      
    return super.onInit().then(() => {  
      calendarService.setup(this.context);  
    });  
  }  
  public render(): void {
    const element: React.ReactElement<IOutlookEventsProps> = React.createElement(
      OutlookEvents,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
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
