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
const url : any = new URL(window.location.href);

const jobid= url.searchParams.get("jobid");

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
   
    <div class="row mt-5 col-md-10 col-12 mx-auto" id="divContainer">
           
    </div>


    `;
   
    this.getListData();
    this.Localization();
  }

  /*private _getPage(page: number){
    console.log('Page:', page);
  }*/
  private setButtonsEventHandlers(): void {
    const webPart: JobPostingWebPart = this;
    this.domElement
      .querySelector("#btn_applyLink")
      .addEventListener("click", () => {
   
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
    /*if (document.getElementById("idSearchProject")["value"] != "") {
      jobTitle = document.getElementById("idSearchProject")["value"];
      URL =`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items?$filter=startswith(Title,%27`+jobTitle+`%27)and(`+ExpiryDateonly+`) `;
    } else {
      URL = `${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items?$Orderby=ExpireDate%20desc`+ExpiryDateCon;
    }*/
    URL =`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${Listname}')/items?$select=Title_Ar,WorkType_Ar,JobDescription_Ar,Requirements_Ar,RequiredSkills_Ar,Gender_Ar,Qualification_Ar,Location_Ar,Experience_Ar,ID,Title,JobDescription,ExpireDate,WorkType,Roles,Requirements,RequiredSkills,ApplyLink,Salary,Location,Gender,Qualification,Experience,Department/ID,Department/Title&$expand=Department&$filter=ID eq `+jobid;
    this.context.spHttpClient
      .get(URL, SPHttpClient.configurations.v1)
      .then((response) => {
        return response.json().then((items: any): void => {
          
          //console.log("items.value: ", items.value);
          let listItems: IJobPostingsList[] = items.value;
          //console.log("list items: ", totalRequests);

          listItems.forEach((item: IJobPostingsList) => {
           
            var momentObj = moment(item.ExpireDate);
            
            var dl=$(item.Department);
            //var al=$(item.ApplyLink[0].Url);
            //console.log(al)
            var formatExpDate=momentObj.format('DD-MM-YYYY');
            
            var jobtit = lang=="en"?item.Title:item.Title_Ar;
            var jobdesc = lang=="en"?item.JobDescription:item.JobDescription_Ar;
            var jobwt = lang=="en"?item.WorkType:item.WorkType_Ar;
            var jobsal = item.Salary;
            var jobgender = lang=="en"?item.Gender:item.Gender_Ar;
            var jobQua = lang=="en"?item.Qualification:item.Qualification_Ar;
            var jobExp = lang=="en"?item.Experience:item.Experience_Ar;
            var jobLoc = lang=="en"?item.Location:item.Location_Ar;
            var jobReq = lang=="en"?item.Requirements:item.Requirements_Ar;
            var jobSkills = lang=="en"?item.RequiredSkills:item.RequiredSkills_Ar;
            //var jobtit = lang=="en"?item.Title:item.Title_Ar;


           html += `  <div class="col-lg-8 col-md-12 discription-l">
                            <!-- Main item start -->
                            <div class="main-item">
                                <div class="company-logo">
                                    <img src="${this.context.pageContext.site.absoluteUrl}/Style%20Library/TEC/images/man.svg" alt="business">
                                </div>
                                <div class="description">
                                    <h5 class="title"><a href="#">${jobtit}</a></h5>
                                    <div class="candidate-listing-footer">
                                        <ul>
                                            <li><i class="fas fa-map-marker-alt"></i>${jobLoc}</li>
                                            <li><i class="far fa-clock"></i>${jobwt}</li>
                                            <li><i class="fas fa-briefcase"></i>${dl[0]["Title"]}</li>
                                            <li><i class="fas fa-hourglass-end"></i> <span id="spn_ed">${arrLang[lang]["Jobs"]["EndDate"]}</span>: ${formatExpDate}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <hr class="hr-boder">
                            <!-- job description start -->
                            <div class="job-description education-experience amenities">
                                 <h3 id="h3_jd">${arrLang[lang]["Jobs"]["JD"]}</h3>
                                <div>${jobdesc}</div>
                            </div>
                            <!-- Education + experience start-->
                            <div class="education-experience amenities">
                                <h3 id="h3_req">${arrLang[lang]["Jobs"]["Requirements"]}</h3>
                                <div>
                                    ${jobReq}
                                </div>
                            </div>
                            <!-- Responsibilities start-->
                            <div class="responsibilities amenities ">
                                <h3 "h3_skills">${arrLang[lang]["Jobs"]["NecessarySkills"]}</h3>
                                <div>
                                    ${jobSkills} 
                                </div>
                            </div>
                            
                            <div class="clearfix"></div>
                            
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <div class="sidebar-right-2">
                                <!-- Search box start -->
                                <div class="widget search-box">
                                    
                                        <div class="form-group mb-0">
                                            <button class="search-button button-theme" ><a href="${item.ApplyLink.Url}"  id="a_applyLiink">${arrLang[lang]["Jobs"]["ApplyNow"]}</a></button>
                                        </div>
                                    
                                </div>
                                <!-- Job overview start -->
                                <div class="job-overview widget">
                                    <h3 class="sidebar-title" id="h3_jobOver">${arrLang[lang]["Jobs"]["JobOverview"]}</h3>
                                    <div class="s-border"></div>
                                    <div class="m-border"></div>
                                    <ul>
                                        <li><i class="far fa-money-bill-alt"></i><h5 id="h5_sal">${arrLang[lang]["Jobs"]["Sal"]}</h5><span> ${jobsal}</span></li>
                                        <li><i class="fas fa-map-pin"></i><h5  id="h5_loc">${arrLang[lang]["Jobs"]["Location"]}</h5><span>${jobLoc}</span></li>
                                        <li><i class="fas fa-venus-double"></i><h5  id="h5_gen">${arrLang[lang]["Jobs"]["Gender"]}</h5><span>${jobgender}</span></li>
                                        <li><i class="fas fa-briefcase"></i><h5  id="h5_wt">${arrLang[lang]["Jobs"]["JobType"]}</h5><span>${jobwt}</span></li>
                                        <li><i class="fas fa-graduation-cap"></i><h5  id="h5_qua">${arrLang[lang]["Jobs"]["Qualification"]}</h5><span>${jobQua}</span></li>
                                        <li><i class="fas fa-clipboard-list"></i><h5 id="h5_exp">${arrLang[lang]["Jobs"]["Exp"]}</h5><span >${jobExp}</span></li>
                                    </ul>
                                </div>
                                <div class="clearfix"></div>
                                
                            </div>
                        </div>
                        
                        <div class="col-lg-4 col-12 mx-auto">
                    </div>

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
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
    lang=lcid==13313?"ar":"en";
    
    /*$("#spn_ed").text(arrLang[lang]["Jobs"]["EndDate"]);
    $("#h3_jd").html(arrLang[lang]["Jobs"]["JD"]);
    $("#h3_req").html(arrLang[lang]["Jobs"]["Requirements"]);
    $("#h3_jd").html(arrLang[lang]["Jobs"]["NecessarySkills"]);
    $("#a_applyLiink").text(arrLang[lang]["Jobs"]["ApplyNow"]);
    $("#h5_sal").html(arrLang[lang]["Jobs"]["Sal"]);
    $("#h5_loc").html(arrLang[lang]["Jobs"]["Location"]);
    $("#h5_gen").html(arrLang[lang]["Jobs"]["Gender"]);
    $("#h5_wt").html(arrLang[lang]["Jobs"]["JobType"]);
    $("#h5_qua").html(arrLang[lang]["Jobs"]["Qualification"]);
    $("#h5_exp").html(arrLang[lang]["Jobs"]["Exp"]);//
    $("#h3_jobOver").html(arrLang[lang]["Jobs"]["JobOverview"]);
    */
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
