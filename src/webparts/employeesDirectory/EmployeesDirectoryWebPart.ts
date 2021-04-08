// import 'jquery';
// import 'jqueryui';
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./EmployeesDirectoryWebPart.module.scss";
import * as strings from "EmployeesDirectoryWebPartStrings";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { IEmpDirectory } from "./../../Interfaces/IEmployeeDirectory";
//import * as feature from "./module"; // static import
export interface IEmployeesDirectoryWebPartProps {
  description: string;
}
declare var arrLang: any;
//declare var lang: any;

// interface ArrayConstructor {
//   from(arrayLike: any, mapFn?, thisArg?): Array<any>;
// }
export default class EmployeesDirectoryWebPart extends BaseClientSideWebPart<IEmployeesDirectoryWebPartProps> {
  //#region First Option Jquery
  //  public render(): void {
  //   require('./../../JS//common.js');
  //   require('./../../JS/pagination.js');
  //   require('./../../JS//empdir.js');

  //   this.domElement.innerHTML = `

  //   <div class="filter-area">
  //       <div class="row">
  //        <div class="col-lg-4  mb-2">
  //          <label class="d-inline-block w-100 form-label">Select Department </label>
  //           <select class="form-input" id="departmentsDDL">
  //              <option> -- Select Department --</option>
  //              <option>Department Name </option>
  //              <option>Department Name </option>
  //              <option> Department Name</option>
  //              <option> Department Name </option>
  //              <option> Department Name </option>
  //           </select>

  //        </div>
  //        <div class="col-lg-4  mb-2">

  //              <label class="form-label"> Employee Name </label>
  //               <input id="searchBoxName" type="text" class="form-input" placeholder="Employee Name">

  //        </div>
  //        <div class="col-lg-4">
  //          <button id="btnSearch" href="javascript:void(0);" class="red-btn red-btn-effect shadow-sm  mt-4"> <span>search</span></button>
  //            </div>
  //        </div>
  //   </div>

  //   <div class="filter-result">
  //       <div class="row">
  //             <div class="col-lg-4">
  //                 <div class="emplyee-card card" >
  //                     <div id="lblEmpDir">
  //                     </div>
  //                 </div>
  //             </div>

  //                         <div class="row my-5">
  //                         <div class="col-12 text-center">
  //                           <div id="Pagination" class="pagination"></div>
  //                         </div>
  //                       </div>

  //           <div class="row mt-5">
  //                         <div class="col-12 d-flex justify-content-center">
  //                             <ul class="pager">
  //                                 <li class="page-number prev"><a href="#">previous</a></li>
  //                                 <li class="page-number active"><a href="#">1</a></li>
  //                                 <li class="page-number"><a href="#">2</a></li>
  //                                 <li class="page-number"><a href="#">3</a></li>
  //                                 <li class="page-number"><a href="#">4</a></li>
  //                                 <li class="page-number next"><a href="#">next</a></li>
  //                             </ul>
  //                         </div>
  //           </div>
  //       </div>
  //   </div>

  //    `;

  // }
  //#endregion First Option Jquery
  items: any;

  public render(): void {
    this.domElement.innerHTML = `
    <div class="filter-area">
    <div class="row">
     <div class="col-lg-4  mb-2">
       <label class="d-inline-block w-100 form-label" id="lblDepartment">Select Department </label>
        <select class="form-input" id="ddlRegistrationDetails"> 
         
        </select>

 
     </div>
     <div class="col-lg-4  mb-2">
 
           <label class="form-label" id="lblEmployeeName"> Employee Name </label>
            <input type="text" id='idSearchName' class="form-input" placeholder="Employee Name">
      
     </div>
     <div class="col-lg-4">
       <button id="idBtnSearch" type="button" class="red-btn red-btn-effect shadow-sm  mt-4"  > <span>search</span></button>
         </div>
     </div>
  </div>


  <div class="filter-result">
        <div class="row" id="tblRegistrationDetails">       

        </div>
 </div>
       

    `;
    this.Localization();
    this.setButtonsEventHandlers();
    this.bindDepartment();
    this.getSearchData();
  }
  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }
  private Localization(): void {
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
    var lang=lcid==13313?"ar":"en";
    $('#idBtnSearch').text(arrLang[lang]['EmployeeDirectory']['Search']);
    $('#idSearchName').attr("placeholder", arrLang[lang]['EmployeeDirectory']['EmployeeeName']);
    $('#lblDepartment').text(arrLang[lang]['EmployeeDirectory']['Department']);
	  $('#lblEmployeeName').text(arrLang[lang]['EmployeeDirectory']['EmployeeeName']);
  }
  private setButtonsEventHandlers(): void {
    debugger;
    const webPart: EmployeesDirectoryWebPart = this;
    //this.domElement.querySelector('#idSearchName').addEventListener('keypress', () => { webPart.getSearchData(); });
    this.domElement.querySelector('#idBtnSearch').addEventListener('click', () => { webPart.getSearchData(); });
  }
  private getSearchData() {
    let html: string = "";
    let searchPreferredName:string="*";
    let searchKeywordDepartment:string="*";
    debugger;
    if (document.getElementById('idSearchName')["value"]!='')
      searchPreferredName=document.getElementById('idSearchName')["value"];

    if (($("#ddlRegistrationDetails").val() != null && $("#ddlRegistrationDetails").val() != undefined)
        && $("#ddlRegistrationDetails").prop("selectedIndex") != 0)
      searchKeywordDepartment = $("#ddlRegistrationDetails").val();

    this.context.spHttpClient
      .get(
        `${this.context.pageContext.web.absoluteUrl}/_api/search/query?querytext='((WorkEmail:*tecq8.onmicrosoft.com)+AND+(PreferredName:`+encodeURIComponent(searchPreferredName)+`)+AND+(Department:`+encodeURIComponent(searchKeywordDepartment)+`))'&selectproperties='AccountName,Department,JobTitle,Path,PictureURL,PreferredName,FirstName,WorkEmail,WorkPhone,SPS-PhoneticDisplayName,OfficeNumber'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'&sortlist='firstname:ascending'&rowLimit=1000`,
        SPHttpClient.configurations.v1
      )
      .then((response) => {
        return response.json().then((items: any): void => {
          //console.log('items.value: ', items.value);
          debugger;
          let listItems =
            items["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"];
                   

          items=listItems;  
          console.log("list items: ", listItems);

          html += this.bindTable(listItems);

          const container: Element = this.domElement.querySelector(
            "#tblRegistrationDetails"
          );
          container.innerHTML = html;
        });
      });
  }
  private bindDepartment(){
    let ddlHTML = "";
    var DeptArray = [];
    var DeptUniqueArray = [];
    var userDepartment="";

    this.context.spHttpClient
      .get(
        `${this.context.pageContext.web.absoluteUrl}/_api/search/query?querytext='((WorkEmail:*tecq8.onmicrosoft.com)+AND+(PreferredName:*)+AND+(Department:*))'&selectproperties='AccountName,Department,JobTitle,Path,PictureURL,PreferredName,FirstName,WorkEmail,WorkPhone,SPS-PhoneticDisplayName,OfficeNumber'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'&sortlist='firstname:ascending'&rowLimit=1000`,
        SPHttpClient.configurations.v1
      )
      .then((response) => {
        return response.json().then((items: any): void => {
          //console.log('items.value: ', items.value);
          debugger;
          let listItems = items["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"];

          console.log("list items: ", listItems);
          
          listItems.forEach((item) => {
            var itemResult = item["Cells"];
            itemResult.forEach((itemCell) => {
              if (itemCell["Key"] == "Department") {
                if (itemCell["Value"] != null) userDepartment = itemCell["Value"];
                console.log(userDepartment);
              }
            });
            DeptArray.push(userDepartment);
          });

          DeptUniqueArray = this.getUnique(DeptArray);
          DeptUniqueArray.sort();
          ddlHTML +='<option> -- Select Department --</option>';
          for (var i = 0; i < DeptUniqueArray.length; i++) {
            ddlHTML +=
              '<option value="' +
              DeptUniqueArray[i] +
              '">' +
              DeptUniqueArray[i] +
              "</option>";
            //totalDeptsCount += 1;
          }
          $("#ddlRegistrationDetails").empty().append(ddlHTML);  

        });
      });    

    

  }
  private bindTable(tableResult) {
    let reqHTML = "";
    // let ddlHTML = "";
    // var DeptArray = [];
    // var DeptUniqueArray = [];
    tableResult.forEach((item) => {
      var itemResult = item["Cells"];
      var userLoginName = "",
        userDisplayName = "",
        userArabicDisplayName = "",
        userDepartment = "",
        userJobTitle = "",
        userEmail = "",
        userPhone = "",
        userPictureUrl = "",
        userSiteUrl = "",
        userOffice = "";

      itemResult.forEach((itemCell) => {
        if (itemCell["Key"] == "AccountName") {
          if (itemCell["Value"] != null) userLoginName = itemCell["Value"];
        }
        //
        if (itemCell["Key"] == "PreferredName") {
          if (itemCell["Value"] != null) userDisplayName = itemCell["Value"];
        }
        //
        if (itemCell["Key"] == "SPS-PhoneticDisplayName") {
          if (itemCell["Value"] != null)
            userArabicDisplayName = itemCell["Value"];
        }
        //
        else if (itemCell["Key"] == "Department") {
          if (itemCell["Value"] != null) userDepartment = itemCell["Value"];
          console.log(userDepartment);
        }
        //
        else if (itemCell["Key"] == "JobTitle") {
          if (itemCell["Value"] != null) userJobTitle = itemCell["Value"];
        }
        //
        else if (itemCell["Key"] == "WorkEmail") {
          if (itemCell["Value"] != null) userEmail = itemCell["Value"];
        }
        //
        else if (itemCell["Key"] == "WorkPhone") {
          if (itemCell["Value"] != null) userPhone = itemCell["Value"];
        }
        //
        else if (itemCell["Key"] == "PictureURL") {
          if (itemCell["Value"] != null)
            //userPictureUrl = itemCell["Value"];
            userPictureUrl =
              "/_vti_bin/DelveApi.ashx/people/profileimage?userId=" +
              userLoginName.substring(userLoginName.lastIndexOf("|") + 1) +
              "&size=L";
          else
            userPictureUrl =
              "https://tecq8.sharepoint.com/sites/IntranetDev/Style%20Library/TEC/images/user.jpg";
          //userPictureUrl = _spPageContextInfo.siteAbsoluteUrl + "/SiteAssets/PAS-Intranet/PASIntranet/HomePage/Outlook/UserDummyImage.jpg";
        }
        //
        else if (itemCell["Key"] == "Path") {
          if (itemCell["Value"] != null) userSiteUrl = itemCell["Value"];
        }
        //
        else if (itemCell["Key"] == "OfficeNumber") {
          if (itemCell["Value"] != null) userOffice = itemCell["Value"];
        }
      });
      //

      //ddlHTML +=`<option>`+userDepartment+`</option>`;
      // DeptArray.push(userDepartment);
      reqHTML +=
        `
            <div class="col-lg-4">
              <div class="emplyee-card card ">
                      <div class="img-cont "><img src=` +
        userPictureUrl +
        ` /> </div>
                          <div class="card-body">
                              <h3>` +
        userDisplayName +
        `</h3>
                              <ul class="d-flex list-item flex-50 list-item-blue">
                                  <li> <i class="far fa-id-card"></i> <span>` +
        userJobTitle +
        ` </span></li>
                                  <li> <i class="fas fa-phone-alt"></i> <span>` +
        userPhone +
        ` </span></li>
                                  <li> <i class="fab fa-black-tie"></i><span>` +
        userDepartment +
        ` </span></li>
                              </ul>
                          </div>                      
              </div>
            </div>
            `;
    });
    // const container: Element = this.domElement.querySelector('#ddlRegistrationDetails');
    // container.innerHTML = ddlHTML;
    // DeptUniqueArray = this.getUnique(DeptArray);
    // DeptUniqueArray.sort();

    // for (var i = 0; i < DeptUniqueArray.length; i++) {
    //   ddlHTML +=
    //     '<option value="' +
    //     DeptUniqueArray[i] +
    //     '">' +
    //     DeptUniqueArray[i] +
    //     "</option>";
    //   //totalDeptsCount += 1;
    // }
    // $("#ddlRegistrationDetails").empty().append(ddlHTML);
   
    return reqHTML;
  }

  private getUnique(array) {
    var uniqueArray = [];
    // Loop through array values
    for (var value of array) {
      if (uniqueArray.indexOf(value) === -1) {
        uniqueArray.push(value);
      }
    }
    return uniqueArray;
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
