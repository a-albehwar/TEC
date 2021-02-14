import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./EmployeeSuggestionsWebPart.module.scss";
import * as strings from "EmployeeSuggestionsWebPartStrings";
// import pnp from "sp-pnp-js";
// import { default as pnp, ItemAddResult } from "sp-pnp-js";
// import { spODataEntityArray, Comment, CommentData, Web, ItemAddResult, sp} from "@pnp/sp";
import { sp } from "@pnp/sp/presets/all";
export interface IEmployeeSuggestionsWebPartProps {
  description: string;
}

export interface ISPList {
  Title: string;
  Suggestion: string;
}
export default class EmployeeSuggestionsWebPart extends BaseClientSideWebPart<IEmployeeSuggestionsWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `    

     <div class="parentContainer" style="background-color: white">    

    <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">    

       <div class="ms-Grid-col ms-u-lg   

   ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">   
               
       </div>    

    </div>    

    <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">    

       <div style="background-color:Black;color:white;text-align: center;font-weight: bold;font-size:   

   x;">Employee Details</div>    

    </div>    

    <div style="background-color: white" >    

       <form >    

          <br>    

          <div data-role="header">    

             <h3>Add item to SharePoint List</h3>    

          </div>    

           <div data-role="main" class="ui-content">    

             <div >    
                               
               <input id="Title"  placeholder="EmpName"/>    

               <input id="Suggestion"  placeholder="EmpDepartment"/>    

               <button id="AddItemToSPList"  type="submit" >Add</button>    

               <button id="UpdateItemInSPList" type="submit" >Update</button>    

               <button id="DeleteItemFromSPList"  type="submit" >Delete</button>  

             </div>    

           </div>    

       </form>    

    </div>    

    <br>    

    <div style="background-color: white" id="DivGetItems" />    

      

    </div>   

    `;

    this.getSPItems();

    this.AddEventListeners();
  }

  private _renderList(items: ISPList[]): void {
    let html: string =
      '<table class="TFtable" border=1 width=style="bordercollapse: collapse;">';

    html += `<th></th><th>ID</th><th>Name</th><th>Department</th>`;

    if (items.length > 0) {
      items.forEach((item: ISPList) => {
        html += `    
  
            <tr>                 
            <td>${item.Title}</td>    
            <td>${item.Suggestion}</td>    
           </tr>    
  
           `;
      });
    } else {
      html += "No records...";
    }

    html += `</table>`;

    const listContainer: Element = this.domElement.querySelector(
      "#DivGetItems"
    );

    listContainer.innerHTML = html;
  }

  private AddEventListeners(): void {
    document
      .getElementById("AddItemToSPList")
      .addEventListener("click", () => this.AddSPListItem());

    document
      .getElementById("UpdateItemInSPList")
      .addEventListener("click", () => this.UpdateSPListItem());

    document
      .getElementById("DeleteItemFromSPList")
      .addEventListener("click", () => this.DeleteSPListItem());
  }

  //#region Add Items
  public AddSPListItem() {
    sp.web.lists.getByTitle("EmployeeSuggestions").items.add({
      Title: document.getElementById("Title")["value"],
      Suggestion: document.getElementById("Suggestion")["value"],
    });
  //   .then((iar: ItemAddResult) => {
  //     console.log(iar);
  // }).catch((error:any) => {
  //     console.log("Error: ", error);
  // });

    alert(
      "Your Suggestion : " +
        document.getElementById("Title")["value"] +
        " has been sent successfully !"
    );
  }
  //#endregion

  //#region update,delete items

  public UpdateSPListItem() {
    var empID = this.domElement.querySelector('input[name = "empID"]:checked')[
      "value"
    ];

    sp.web.lists
      .getByTitle("Employee")
      .items.getById(empID)
      .update({
        EmpName: document.getElementById("EmpName")["value"],

        EmpDepartment: document.getElementById("EmpDepartment")["value"],
      });

    alert("Record with Employee ID : " + empID + " Updated !");
  }

  public DeleteSPListItem() {
    var empID = this.domElement.querySelector('input[name = "empID"]:checked')[
      "value"
    ];

    sp.web.lists.getByTitle("Employee").items.getById(empID).delete();

    alert("Record with Employee ID : " + empID + " Deleted !");
  }

  //#endregion

  //#region Get Items
  private _getSPItems(): Promise<ISPList[]> {
    return sp.web.lists
      .getByTitle("EmployeeSuggestions")
      .items.get()
      .then((response) => {
        return response;
      });
  }

  private getSPItems(): void {
    this._getSPItems().then((response) => {
      this._renderList(response);
    });
  }
  //#endregion

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

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
