import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './TwitterWebPart.module.scss';
import * as strings from 'TwitterWebPartStrings';
import * as $ from 'jquery';
import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';
export interface ITwitterWebPartProps {
  description: string;
}

export default class TwitterWebPart extends BaseClientSideWebPart<ITwitterWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.twitter }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
              <div id ="tweet-div">
              </div>  
            </div>
          </div>
        </div>
      </div>`;
      this.getTECTweets();
  }

  /*protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  */
  private getTECTweets() {
     var settings = {
          "url": "https://api.twitter.com/1.1/statuses/user_timeline.json?count=4&screen_name=@Sena67765532",
          "method": "GET",
          "timeout": 0,
          "crossDomain": true,
          "headers": {
              // "Access-Control-Allow-Origin": "*",
              //"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
              "Accept":"*/*",
              //"Accept-Encoding":"gzip, deflate, br",
              //"Connection":"keep-alive",
              "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAAMOyMwEAAAAAvnuY%2BY3n22MX5u02IK5c7njUg34%3DpaMeqMKwkUBRDOkVTm09kwkonYOwaBHbwo0Yf1yRuZKlNn5dPM",
              "mode":"cors",
              "Access-Control-Allow-Origin":"https://tecq8.sharepoint.com",
              "Allowed_origins" : "true",
              'paths' : 'api/*',
              'allowed_methods' : '*',
              'allowed_origins' : '*',
              'allowed_headers' :'*',
              'supports_credentials' : "false",
              "Cookie": "personalization_id=\"v1_a87sRPUgw2vHOkyr35CBCg==\"; guest_id=v1%3A159984304381860650"
          },
      };
  
      $.ajax(settings).done(function (response) {
          console.log(response);
          $("#tweet-div").append(response + "<br>");
      });

    //   const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?count=4&screen_name=@Sena67765532`;

    //   const httpClientOptions: IHttpClientOptions = {
    //           headers: new Headers(),
    //           method: "GET",
    //           mode: "cors",
              
    //   };
    //   const requestHeaders: Headers = new Headers();
    //   requestHeaders.append('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAAMOyMwEAAAAAvnuY%2BY3n22MX5u02IK5c7njUg34%3DpaMeqMKwkUBRDOkVTm09kwkonYOwaBHbwo0Yf1yRuZKlNn5dPM');  
    //   requestHeaders.append(
    //       "Content-type",
    //       "application/x-www-form-urlencoded"
    //   );

    //   this.context.httpClient.get(url, HttpClient.configurations.v1, httpClientOptions)
    // .then(response => {
    //     console.log(response);
    //     //return response.json();
    // });
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
