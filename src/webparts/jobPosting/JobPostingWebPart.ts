import { Version } from '@microsoft/sp-core-library';
import * as moment from 'moment';

//import {pages}  from './pages';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from './JobPostingWebPart.module.scss';
import * as strings from 'JobPostingWebPartStrings';
import {IJobPostingsList}  from './../../Interfaces/IJobPosting';

//import PnPTelemetry from "@pnp/telemetry-js";

//import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";





/*const telemetry = PnPTelemetry.getInstance();
telemetry.optOut();
*/
export interface IJobPostingWebPartProps {
  description: string;
}

declare var arrLang: any;
declare var lang: any;
//guideclare var totalRequests: any;

var pagination_options = {
  num_edge_entries: 2,
  num_display_entries: 8,
  //callback: pageselectCallback,
  items_per_page:10
};

var Listname = "JobPosting";

export default class JobPostingWebPart extends BaseClientSideWebPart<IJobPostingWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
    <div class="filter-area">
      <div class="row">        
        <div class="col-lg-4  mb-2">
      
            <label class="form-label" id="lblEmployeeName"> Job Title </label>
            <input type="text" id='idSearchProject' class="form-input" placeholder="Job Title">
          
        </div>
        <div class="col-lg-4">
          <button id="idBtnSearch" type="button" class="red-btn red-btn-effect shadow-sm  mt-4"  ><span>search</span></button>
        </div>
      </div>
    </div>

    <div style="width:95%" id="divContainer">
    <div id="Pagination"></div>
    </div> 
        
    `;
    this.setButtonsEventHandlers();
    this.getListData();
  }

  /*private _getPage(page: number){
    console.log('Page:', page);
  }*/
  private setButtonsEventHandlers(): void {
    const webPart: JobPostingWebPart = this;
    this.domElement
      .querySelector("#idBtnSearch")
      .addEventListener("click", () => {
        webPart.getListData();
      });
  }

  private getListData() {
    let html: string = "";
    html += "";
    var jobTitle = "";
    var URL = "";
    var Day=(new Date()).getDate();
    var Month=(new Date()).getMonth()+1;
    var FullYear=(new Date()).getFullYear();
    var ExpiryDateCon="&$filter=ExpireDate ge datetime'"+FullYear+"-"+Month+"-"+Day+"T00:00:00'";
    var ExpiryDateonly="ExpireDate ge datetime'"+FullYear+"-"+Month+"-"+Day+"T00:00:00'";
    if (document.getElementById("idSearchProject")["value"] != "") {
      jobTitle = document.getElementById("idSearchProject")["value"];
      URL =`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items?$filter=startswith(Title,%27`+jobTitle+`%27)and(`+ExpiryDateonly+`) `;
    } else {
      URL = `${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items?$Orderby=ExpireDate%20desc`+ExpiryDateCon;
    }
    this.context.spHttpClient
      .get(URL, SPHttpClient.configurations.v1)
      .then((response) => {
        return response.json().then((items: any): void => {
          
          //console.log("items.value: ", items.value);
          let listItems: IJobPostingsList[] = items.value;
          //console.log("list items: ", totalRequests);

          listItems.forEach((item: IJobPostingsList) => {
           
            var momentObj = moment(item.ExpireDate);
            var formatExpDate=momentObj.format('DD-MM-YYYY');
            html += `   
                   <div style='width:40%;float:left' class="blocks">
                     <div style='width:100%;float:left;font-weight:bold'>${item.Title}</div>  
                     <div style='width:45%;float:left'>${formatExpDate}</div>
                    
                     <div style='width:100%;float:left;padding-top:10px'>${item.JobDescription}</div>
                   </div>
                   <br/> 
                   <br/>               
                     `;
          });
          html += "";
          const listContainer: Element = this.domElement.querySelector(
            "#divContainer"
          );
          listContainer.innerHTML = html;
            //Pagination
            var num_entries = $('#divContainer div.blocks').length;	 	  
            // Create pagination element
            if(num_entries>1)
            {
               //let user=new pages();
               //user.sayHello("Ramana");
            }
            /*$("#Pagination").pagination(num_entries, pagination_options);
            {
              //myfunction();
              
            }*/
            
        });
      });
  }

  private Localization(): void {
    var lcid = this.context.pageContext.legacyPageContext["currentCultureLCID"];
    var language = lcid == 1025 ? "ar" : "en";
    $("#idBtnSearch").text(arrLang[language]["EmployeeDirectory"]["Search"]);
    $("#idSearchName").attr(
      "placeholder",
      arrLang[language]["EmployeeDirectory"]["EmployeeeName"]
    );
    $("#lblDepartment").text(
      arrLang[language]["EmployeeDirectory"]["Department"]
    );
    $("#lblEmployeeName").text(
      arrLang[language]["EmployeeDirectory"]["EmployeeeName"]
    );
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
