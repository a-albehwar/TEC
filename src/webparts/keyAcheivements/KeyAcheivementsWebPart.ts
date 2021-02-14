import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./KeyAcheivementsWebPart.module.scss";
import * as strings from "KeyAcheivementsWebPartStrings";
// import MockHttpClient from './MockHttpClient';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import { IKeyAcievementsList } from "./../../Interfaces/IKeyAchievements";

export interface IKeyAcheivementsWebPartProps {
  description: string;
}

declare var arrLang: any;
declare var lang: any;
var Listname = "KeyAchievements";
export default class KeyAcheivementsWebPart extends BaseClientSideWebPart<IKeyAcheivementsWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `
    
    <div class="filter-area">
      <div class="row">        
        <div class="col-lg-4  mb-2">
      
            <label class="form-label" id="lblEmployeeName"> Project </label>
            <input type="text" id='idSearchProject' class="form-input" placeholder="Project">
          
        </div>
        <div class="col-lg-4">
          <button id="idBtnSearch" type="button" class="red-btn red-btn-effect shadow-sm  mt-4"  > <span>search</span></button>
        </div>
      </div>
    </div>

    <div style="width:95%" id="divContainer"></div>
    `;
    // this.Localization();
    this.setButtonsEventHandlers();
    this.getListData();
  }

  private setButtonsEventHandlers(): void {
    const webPart: KeyAcheivementsWebPart = this;
    this.domElement
      .querySelector("#idBtnSearch")
      .addEventListener("click", () => {
        webPart.getListData();
      });
  }

  private getListData() {
    let html: string = "";
    html += "";
    var Project = "";
    var URL = "";

    if (document.getElementById("idSearchProject")["value"] != "") {
      Project = document.getElementById("idSearchProject")["value"];
      URL =
        `${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items?$filter=startswith(Title,` +
        Project +
        `)`;
    } else {
      URL = `${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items`;
    }
    this.context.spHttpClient
      .get(URL, SPHttpClient.configurations.v1)
      .then((response) => {
        return response.json().then((items: any): void => {
          console.log("items.value: ", items.value);
          let listItems: IKeyAcievementsList[] = items.value;
          console.log("list items: ", listItems);

          listItems.forEach((item: IKeyAcievementsList) => {
            html += `   
                   <div style='width:40%;float:left'>
                     <div style='width:100%;float:left;font-weight:bold'>${item.Title}</div>  
                     <div style='width:45%;float:left'>${item.Status}</div>
                    
                     <div style='width:100%;float:left;padding-top:10px'>${item.ProjectDescription}</div>
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
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
