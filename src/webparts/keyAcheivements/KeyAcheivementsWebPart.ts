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
    <section class="inner-page-cont">
      <div class="Inner-page-title">
        <h2 class="page-heading">Key Achievements</h2>
      </div>  
      <div class="News-details-cont">
        <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="timeline">
                  <ul id="divContainer">
                  </ul>
                </div>
              <div>
            </div> 
        </div>
      </div>
    </section>  
    `;
    // this.Localization();
    //this.setButtonsEventHandlers();
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

    // if (document.getElementById("idSearchProject")["value"] != "") {
    //   Project = document.getElementById("idSearchProject")["value"];
    //   URL =
    //     `${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items?$filter=startswith(Title,` +
    //     Project +
    //     `)`;
    // } else {
    //   URL = `${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items`;
    // }
    URL = `${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items?$orderby=Year desc`;
    this.context.spHttpClient
      .get(URL, SPHttpClient.configurations.v1)
      .then((response) => {
        return response.json().then((items: any): void => {
          console.log("items.value: ", items.value);
          let listItems: IKeyAcievementsList[] = items.value;
          console.log("list items: ", listItems);

          listItems.forEach((item: IKeyAcievementsList) => {
            var lcid = this.context.pageContext.legacyPageContext["currentCultureLCID"];
            if(lcid==13313)
            {
              html += `                     
                   
              <li>
                <div class="content">
                   <h4>${item.TitleAR}</h4>
                         <p> ${item.ProjectDescriptionAR}</p>                                                
                </div>
                 <div class="time">
                   <h4>${item.Year}</h4>
                 </div>
             </li>
                `;
            }
            else
            {
              html += `                     
                   
              <li>
                <div class="content">
                   <h4>${item.Title}</h4>
                         <p> ${item.ProjectDescription}</p>                                                
                </div>
                 <div class="time">
                   <h4>${item.Year}</h4>
                 </div>
             </li>
                `;        
            }
            
          });
          html += `<div style="clear:both;"></div>`;
          const listContainer: Element = this.domElement.querySelector(
            "#divContainer"
          );
          listContainer.innerHTML = html;
        });
      });
  }

  private Localization(): void {
    var lcid = this.context.pageContext.legacyPageContext["currentCultureLCID"];
    var language = lcid == 13313 ? "ar" : "en";
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
