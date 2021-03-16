import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ViewSuggestionWebPart.module.scss';
import * as strings from 'ViewSuggestionWebPartStrings';
import {  SPHttpClient ,SPHttpClientResponse } from '@microsoft/sp-http'; 
import * as moment from 'moment';
import { sp } from "@pnp/sp/presets/all";

import { Web, IWeb } from "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { SiteGroups } from '@pnp/sp/site-groups';
import * as $ from 'jquery';


 
export interface IViewSuggestionWebPartProps {
  description: string;
}


declare var arrLang: any;
declare var lang: any;
const url : any = new URL(window.location.href);
const vsid= url.searchParams.get("vsid");
var statusid;
var CurrentUsergroups =[];
var isinnovateteamMember;
export interface ISPLists 
{
  value: ISPList[];
}
let groups =  sp.web.currentUser.groups();
console.log(groups);
export interface ISPList 
{
  Title: string;
  Title_Ar:string;
  PublishedDate:Date;
  ID:number;
  Description:string;
  Comments:string;
  Description_Ar:string;
  Created:string;
  PublishedSource:string;
  Status:{
    Title:string
  }; 
  Author:{
    Title:string
  };
  User_JobTitle:string;
  User_Department:string;
}




export default class ViewSuggestionWebPart extends BaseClientSideWebPart<IViewSuggestionWebPartProps> {
  items: any;
  
  
  private Listname: string = "SuggestionsBox";
  private LogsListname: string = "SuggestionsBoxWorkflowLogs";

  private UploadFiles(itemid:string) {
    let input = <HTMLInputElement>document.getElementById("deptfile");
    let file = input.files[0];
   // var files = document.getElementById('deptfile');
   
    if (file!=undefined || file!=null){

    //assuming that the name of document library is Documents, change as per your requirement, 
    //this will add the file in root folder of the document library, if you have a folder named test, replace it as "/Documents/test"
    sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/IntranetDev/SuggestionBoxDocuments").files.add(file.name, file, true).then((result) => {
        console.log(file.name + " upload successfully!");
          result.file.listItemAllFields.get().then((listItemAllFields) => {
             // get the item id of the file and then update the columns(properties)
            sp.site.rootWeb.lists.getByTitle("SuggestionBoxDocuments").items.getById(listItemAllFields.Id).update({
                        //Title: 'My New Title',
                        Suggestion_IDId:itemid,
            }).then(r=>{
                        console.log(file.name + " properties updated successfully!");
            });           
        }); 
    });
    }
  }
  

  private async _checkUserInGroup(strGroup:string)
  {

    let InGroup:boolean = false;
    
 
    //const queryUrl = `${this.context.pageContext.site.absoluteUrl}/_api/web/currentuser/groups`;
    this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/currentuser/groups`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            let listItems: ISPList[] = items["value"];
            for(var i=0;i<listItems.length;i++)
            {
              if(listItems[i].Title !="SharingLinks.9b857bbf-2ae3-4a28-b7fe-599c89b01da6.OrganizationView.71abe19a-67c7-492a-949a-ba7901eef508"){
                if(listItems[i].Title==strGroup)
                {
                  InGroup=true;  
                  
                }
                break;
              }
            }
          });
        
        });   
        return InGroup;
  }
  
  private _externalJsUrl: string = "https://tecq8.sharepoint.com/sites/IntranetDev/Style%20Library/TEC/JS/CustomJs.js";

  // adding customjs file before render
  public onInit(): Promise<void> {
    //console.log(`ViewSuggestionWebPart.onInit(): Entered.`);
    
    let scriptTag: HTMLScriptElement = document.createElement("script");
    scriptTag.src = this._externalJsUrl;
    scriptTag.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(scriptTag);

    return Promise.resolve<void>();
  }
  private getLogsByID(){
    let historybody: string = '';

    $( "#tbl_tb_history" ).empty();                                                                                     //?$select=*,ID,Suggestion_Status/ID,Suggestion_Status/Title&$expand=Suggestion_Status&$filter=ID eq 6
                                    //https://tecq8.sharepoint.com/sites/IntranetDev/_api/web/lists/getbytitle('SuggestionsBoxWorkflowLogs')/items?$select=ID,Created,Title,Status/Title,SuggestionID/Title&$expand=SuggestionID,Status&$orderby=ID%20desc
    this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${this.LogsListname}')/items?$select=ID,Comments,Created,Title,Status/Title,SuggestionID/Title,Author/Title&$expand=SuggestionID,Author,Status&$filter=Title eq '${vsid}'&$orderby=ID%20desc`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            let listItems: ISPList[] = items["value"];
            listItems.forEach((item: ISPList) => {
            var logmomentObj = moment(item.Created);
            var logformatpubDate=logmomentObj.format('DD-MM-YYYY');
            var logstatus=item.Status.Title;
            var logAuthor=item.Author.Title;
            var logComments=item.Comments!=undefined?item.Comments:"";
            historybody += `
            <tr>
                <td>`+logstatus+`</td>
                <td>`+logComments+`</td>
                <td>`+logformatpubDate+`</td>
                <td>`+logAuthor+`</td>
            </tr>`;
          });
          const HistoryBodyContainer: Element = this.domElement.querySelector('#tbl_tb_history');
          HistoryBodyContainer.innerHTML = historybody;
         });  
        });
  }
  private getMediaByID() {
    let html: string = '<div class="row gray-box"><div class="col-md-12">';
    let InnovateTabhtml: string = '<div class="row gray-box"><div class="col-md-12">';
    let DepartmentTabhtml: string = '<div class="row gray-box"><div class="col-md-12">';
    let anchorhtml: string ='';
    
                                                                                                      //?$select=*,ID,Suggestion_Status/ID,Suggestion_Status/Title&$expand=Suggestion_Status&$filter=ID eq 6
    this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items?$select=*,ID,Suggestion_Status/ID,Attachments,AttachmentFiles,Suggestion_Status/Title,Author/Title&$expand=Suggestion_Status,AttachmentFiles,Author&$filter=ID%20eq%20${vsid}`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            
            var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
            lang=lcid==13313?"ar":"en";
            //listItems.forEach((item: ISPList) => {
              //if (item.ID === parseInt(vsid)) {
                var momentObj = moment(items.value[0].Created);
                var formatpubDate=momentObj.format('DD-MM-YYYY');
               var mediatitle=lang=="en"?items.value[0].Title: items.value[0].Title_Ar;
               var mediadesc=lang=="en"?items.value[0].Description: items.value[0].Description_Ar;
               var sugStatus=items.value[0].Suggestion_Status.Title;
               var sugCreatedBy=items.value[0].Author.Title;
               var sugUserJobTitle=items.value[0].User_JobTitle;
               var sugUserDept=items.value[0].User_Department;
               var sugType=items.value[0].Suggestion_Type;
               if(items.value[0].AttachmentFiles.length>0){
                for(var i=0;i<items.value[0].AttachmentFiles.length;i++){
                  var anchorfileURL=this.context.pageContext.site.absoluteUrl+"/Lists/SuggestionsBox/Attachments/"+vsid+"/"+items.value[0].AttachmentFiles[i].FileNameAsPath.DecodedUrl+"?web=1";
                  //console.log(anchorfileURL);
                  anchorhtml+='<a href="'+anchorfileURL+'">'+items.value[0].AttachmentFiles[i].FileName+'</a><br>';
                
                }
               }
               statusid=items.Suggestion_StatusId;
               if(statusid==9 || statusid==5){
                  $( "#tab2" ).empty();
                  InnovateTabhtml += `
                          <div class="col-lg-12  mb-2">   
                          <label id="lbl_Status_Header" class="form-label">`+arrLang[lang]['SuggestionBox']['Status']+`</label>
                          </div>  
                          <div class="col-lg-12 mb-2 vleft">
                            <input type="radio" id="rb_arabic" name="language" class="form-control" value="8">
                            <label for="arabic" id="lbl_rb_Arabic" class="form-label">`+arrLang[lang]['SuggestionBox']['StandBy']+`</label><br>
                            <input type="radio" id="rb_english" name="language" class="form-control" value="5">
                            <label for="english"  id="lbl_rb_English" class="form-label">`+arrLang[lang]['SuggestionBox']['InProgress']+`</label><br>
                            <input type="radio" id="rb_eng" name="language" class="form-control" value="7">
                            <label for="english"  id="lbl_rb_English" class="form-label">`+arrLang[lang]['SuggestionBox']['Completed']+`</label><br>
                            <label id="lbl_Langerr" class="form-label" style="color:red"></label>
                          </div>
                          <div class="col-lg-12 mb-2">   
                            <label id="lbl_Innovation_Second_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['Comments']+` </label>
                            <textarea style="height:auto !important" rows="5" cols="5" id="Innovate_Second_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                          </div>
                          <div class="col-lg-4  mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Submit"> <span>`+arrLang[lang]['SuggestionBox']['Submit']+`</span></button>
                          </div>
                  `;
                  InnovateTabhtml += '</div></div>';
                  const InnovateTabContainer: Element = this.domElement.querySelector('#tab2');
                  InnovateTabContainer.innerHTML = InnovateTabhtml;
                  document.getElementById('btn_Submit').addEventListener('click',(e)=>{ e.preventDefault();this.InnovationTeamSubmited($("input[name=language]:checked").val())});    
               }
               else if(statusid==4 || statusid==10){
                  $( "#tab2" ).empty();
                  InnovateTabhtml += `
                          <div class="col-lg-12  mb-2">   
                            <label id="lbl_Innovation_Second_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['Comments']+` </label>
                            <textarea style="height:auto !important" rows="5" cols="5" id="Innovate_Second_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                          </div>
                          <div class="col-lg-4  mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Review_Close" onClick="this.InnovationTeamClosed(); return false;"> <span>`+arrLang[lang]['SuggestionBox']['Close']+`</span></button>
                          </div>
                  `;
                  InnovateTabhtml += '</div></div>';
                  const InnovateTabContainer: Element = this.domElement.querySelector('#tab2');
                  InnovateTabContainer.innerHTML = InnovateTabhtml;
                  document.getElementById('btn_Review_Close').addEventListener('click',(e)=>{ e.preventDefault();this.InnovationTeamClosed()});    
                }
              html += `
              <div class="col-lg-12 mb-2">   
              <label id="lbl_Title_Header" class="form-label">`+arrLang[lang]['SuggestionBox']['SugType']+`</label>
              <label id="lbl_Title" class="form-label"> : `+sugType+` </label>
              </div> 
                <div class="col-lg-12 mb-2">   
                  <label id="lbl_Title_Header" class="form-label">`+arrLang[lang]['SuggestionBox']['Title']+`</label>
                  <label id="lbl_Title" class="form-label"> : `+mediatitle+` </label>
                </div>  
                <div class="col-lg-12 mb-2">   
                  <label id="lbl_Suggestion_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['Description']+` </label>
                  <label id="lbl_Suggestion" class="form-label"> : `+mediadesc+`</label>
                </div>
                <div class="col-lg-12 mb-2">   
                  <label id="lbl_Status_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['Status']+` </label>
                  <label id="lbl_Status" class="form-label"> : `+sugStatus+` </label>
                </div>
                 <div class="col-lg-12 mb-2">   
                  <label id="lbl_CreatedDate_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['CreatedDate']+` </label>
                  <label id="lbl_CreatedDate" class="form-label"> : `+formatpubDate+`</label>
                </div>
                <div class="col-lg-12 mb-2">   
                  <label id="lbl_CreatedDate_Header" class="form-label">`+arrLang[lang]['SuggestionBox']['CreatedBy']+` </label>
                  <label id="lbl_CreatedDate" class="form-label"> : `+sugCreatedBy+`</label>
                </div>
                <div class="col-lg-12 mb-2">   
                  <label id="lbl_CreatedDate_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['JobTitle']+`</label>
                  <label id="lbl_CreatedDate" class="form-label"> : `+sugUserJobTitle+`</label>
                </div>
                <div class="col-lg-12 mb-2">   
                <label id="lbl_CreatedDate_Header" class="form-label">`+arrLang[lang]['SuggestionBox']['Department']+` </label>
                <label id="lbl_CreatedDate" class="form-label"> : `+sugUserDept+`</label>
              </div>

                <div class="col-lg-12 mb-2">   
                  <label id="lbl_Attach_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['Attachment']+`</label>
                  <div id="anchorcontainer"> `+anchorhtml+`</div
                </div>
              `;
              
            html += '</div></div>';
            
            const listContainer: Element = this.domElement.querySelector('#tab1');
            listContainer.innerHTML = html;
            return statusid;
          });
         
      });
  }

  public render(): void {
    var lcid= this.context.pageContext.legacyPageContext['currentCultureLCID'];  
    lang=lcid==13313?"ar":"en";
    this.domElement.innerHTML = `
    <section class="inner-page-cont">
           
         <div class="Inner-page-title">
             <h2 class="page-heading">TABS</h2>
         </div>
         <div class="container-fluid mt-5" id="Suggestion_Tabs">
                <ul class="tabs">
                  <li class="active" rel="tab1">`+arrLang[lang]['SuggestionBox']['SuggestionDetails']+`</li>
                  <li rel="tab2">`+arrLang[lang]['SuggestionBox']['InnovationReview']+`</li>
                  <li rel="tab3">`+arrLang[lang]['SuggestionBox']['DepartmentReview']+`</li>
                  <li rel="tab4">`+arrLang[lang]['SuggestionBox']['DepartmentHead']+`</li>
                </ul>
                <div class="tab_container">
                  <h3 class="d_active tab_drawer_heading" rel="tab1">`+arrLang[lang]['SuggestionBox']['Details']+`</h3>
                  <div id="tab1" class="tab_content">
                  
                    
                  </div>
                  
                  <h3 class="tab_drawer_heading" rel="tab2">`+arrLang[lang]['SuggestionBox']['InnovationTeam']+`</h3>
                  <div id="tab2" class="tab_content">
                      <div class="row gray-box">
                        <div class="col-md-12">
                          <div class="col-lg-4 mb-2">   
                          <label id="lbl_Title_Header" class="form-label">`+arrLang[lang]['SuggestionBox']['Department']+`</label>
                          <select name="department" id="sel_Dept" class="form-control" ></select>
                          </div>  
                          <div class="col-lg-12 mb-2">   
                            <label id="lbl_Suggestion_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['Comments']+` </label>
                            <textarea style="height:auto !important" rows="5" cols="5" id="Innovate_First_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                          </div>
                          <div class="col-lg-4 mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Assign_Dept"> <span>`+arrLang[lang]['SuggestionBox']['AssignDepartments']+`</span></button>
                          <button class="red-btn shadow-sm  mt-4" id="btn_Close"> <span>`+arrLang[lang]['SuggestionBox']['Close']+`</span></button>
                          </div>
                        </div>
                      </div>  
                  </div>
                  
                  <h3 class="tab_drawer_heading" rel="tab3">`+arrLang[lang]['SuggestionBox']['Department']+`</h3>
                  <div id="tab3" class="tab_content">
                    <div class="row gray-box">
                      <div class="col-md-12">
                        <div class="col-lg-12 mb-2">   
                          <label id="lbl_Attach_Header" class="form-label">`+arrLang[lang]['SuggestionBox']['Attachment']+`</label>
                          <input type="file" className="form-control" id="deptfile"  />
                        </div>  
                        <div class="col-lg-12 mb-2" style="display:none">   
                          <label id="lbl_Exist_Attach_Header" class="form-label">`+arrLang[lang]['SuggestionBox']['ExistingAttachment']+`</label>
                          <a href="#">Attachment Links</a>
                        </div>
                        <div class="col-lg-12 mb-2">   
                          <label id="lbl_Comments_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['Comments']+` </label>
                          <textarea style="height:auto !important" rows="5" cols="5" id="txt_Department_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                        </div>
                        <div class="col-lg-4 mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Approve"> <span>`+arrLang[lang]['SuggestionBox']['RequrieApproval']+`</span></button>
                          <button class="red-btn shadow-sm  mt-4" id="btn_Reject"> <span>`+arrLang[lang]['SuggestionBox']['Reject']+`</span></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 class="tab_drawer_heading" rel="tab4">`+arrLang[lang]['SuggestionBox']['Department']+`</h3>
                  <div id="tab4" class="tab_content">
                    <div class="row gray-box">
                      <div class="col-md-12">
                        <div class="col-lg-12 mb-2">   
                          <label id="lbl_Dept_Head_Comments_Header" class="form-label"> `+arrLang[lang]['SuggestionBox']['Comments']+` </label>
                          <textarea style="height:auto !important" rows="5" cols="5" id="txt_Department_Head_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                        </div>
                        <dv class="col-lg-4  mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Dept_Head_Approve"> <span>`+arrLang[lang]['SuggestionBox']['Approve']+`</span></button>
                          <button class="red-btn shadow-sm  mt-4" id="btn_Dept_Head_Reject"> <span>`+arrLang[lang]['SuggestionBox']['Reject']+`</span></button>
                        </div>
                      </div>
                    </div>  
                  </div>
                </div> 
            </div>
         </section>
         <h2 style="margin-left: 20px;"> `+arrLang[lang]['SuggestionBox']['History']+`</h2>
         <div class="container-fluid">
            
                          <table class="table table-bordered table-hover footable">
                            <thead>
                                <tr>
                                  <th data-breakpoints="xs"> `+arrLang[lang]['SuggestionBox']['Status']+`</th>
                                  <th data-breakpoints="xs"> `+arrLang[lang]['SuggestionBox']['Comments']+`</th>
                                  <th data-breakpoints="xs"> `+arrLang[lang]['SuggestionBox']['ActionDate']+`</th>
                                  <th data-breakpoints="xs"> `+arrLang[lang]['SuggestionBox']['ApprovedBy']+`</th>
                                </tr>
                            </thead>
                            <tbody id="tbl_tb_history">
                            </tbody>
                          </table>
                   
           </div>
    `;

      
      //this._checkUserInGroup("InnovationTeam");
      //this._getListCustomerData("InnovationTeam");
      
      this.DisableControlsBasedPermission();
      this.getMediaByID();
      this.LoadDepartments();
      this.setButtonsEventHandlers();
      this.getLogsByID();
     
      
       
  }

  private async DisableControlsBasedPermission()
  {
   const isexists=await this._getListCustomerData("InnovationTeam");
   //alert(isexists);
    for(var i=0;i<CurrentUsergroups.length;i++)
    {
      if ( CurrentUsergroups[i].Title!="InnovationTeam"){
        $('#tab2').hide();
        $('#Suggestion_Tabs ul > li:eq(1)').hide();
        }
      
    }
  }
  public componentDidMount()
  {
    //this._getListCustomerData("InnovationTeam");
  }
    private  async _getListCustomerData(strGroup:string)
    {    
      this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/currentuser/groups`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.clone().json()
          .then((items: any): void => {
            
            let listItems: ISPList[] = items["value"];
            Array.prototype.push.apply(CurrentUsergroups, listItems)
           
           /* for(var i=0;i<listItems.length;i++)
            { CurrentUsergroups.push(listItems[i].Title);

              if(listItems[i].Title !="SharingLinks.9b857bbf-2ae3-4a28-b7fe-599c89b01da6.OrganizationView.71abe19a-67c7-492a-949a-ba7901eef508"){
                if(listItems[i].Title==strGroup)
                {
                  isinnovateteamMember=true;  
                  
                }
                break;
              }
            }*/
            console.log(CurrentUsergroups);
          });
         
        });   
    return CurrentUsergroups;
  }

  private setButtonsEventHandlers(): void {
    const webPart: ViewSuggestionWebPart = this;
    
    this.domElement.querySelector('#btn_Assign_Dept').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.UpdateInnovationReview();
     }); 
     
     this.domElement.querySelector('#btn_Close').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.ClosingInnovationTeam();
     });

     this.domElement.querySelector('#btn_Approve').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.DepartmentApprove();
     });

     this.domElement.querySelector('#btn_Reject').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.DepartmentReject();
     });

     this.domElement.querySelector('#btn_Dept_Head_Approve').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.DepartmentHeadApprove();
     });

     this.domElement.querySelector('#btn_Dept_Head_Reject').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.DepartmentHeadReject();
     });
     //btn_Review_Close
     if(statusid==9 ){
      this.domElement.querySelector('#btn_Submit').addEventListener('click', (e) => { 
        e.preventDefault();
        webPart.InnovationTeamSubmited($("input[name=language]:checked").val());
       });
     }
     else if(statusid==4 || statusid==10){
       this.domElement.querySelector('#btn_Review_Close').addEventListener('click', (e) => { 
        e.preventDefault();
        webPart.InnovationTeamClosed();
       });
     }
     /*
     

     
     */
  }

  private updateLogs(itemid,stsid,stsComments) {
    sp.site.rootWeb.lists.getByTitle("SuggestionsBoxWorkflowLogs").items.add({
      Title:  itemid,
      SuggestionIDId: itemid,
      StatusId:stsid,
      Comments:stsComments,
    }).then(r=>{
      console.log("added data to history list");
    }).catch(function(err) {  
      console.log(err);  
    });
  }

  
  private LoadDepartments():void{
    sp.site.rootWeb.lists.getByTitle("LK_Departments").items.select("Title","ID").get()
    .then(function (data) {
      console.log(data);
      for (var k in data) {
        //alert(data[k].Title);
        $("#sel_Dept").append("<option value=\"" +data[k].ID + "\">" +data[k].Title + "</option>");
      }
      
    });
  }
  
  private InnovationTeamClosed(){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      Innovation_Team_Review: $("#Innovate_Second_Comments").val(),
      Suggestion_StatusId: 6,
    }).then(r=>{
      this.updateLogs(vsid,6,$("#Innovate_Second_Comments").val());
      alert("Suggestion Updated Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";
    }).catch(function(err) {  
      console.log(err);  
   });
    
  }

  private InnovationTeamSubmited(stsid){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      Innovation_Team_Review: $("#Innovate_Second_Comments").val(),
      Suggestion_StatusId: stsid,
    }).then(r=>{
      this.updateLogs(vsid,stsid,$("#Innovate_Second_Comments").val());
      alert("Suggestion Updated Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";
    }).catch(function(err) {  
      console.log(err);  
   });
  }

  private UpdateInnovationReview(){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      AssignedDepartmentId: $("#sel_Dept").val(),
      Innovation_Team_Review: $("#Innovate_First_Comments").val(),
      Suggestion_StatusId: 2,
    }).then(r=>{
      this.updateLogs(vsid,2,$("#Innovate_First_Comments").val());
      alert("Suggestion Updated Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";
    }).catch(function(err) {  
      console.log(err);  
   });
  }

  private DepartmentApprove(){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      Assigned_Dept_Comments: $("#txt_Department_Comments").val(),
      Suggestion_StatusId: 3,
    }).then(r=>{
      this.updateLogs(vsid,3,$("#txt_Department_Comments").val());
      this.UploadFiles(vsid);
      alert("Suggestion Approved Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";
    }).catch(function(err) {  
      console.log(err);  
    });
  }

  private DepartmentReject(){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      Assigned_Dept_Comments: $("#txt_Department_Comments").val(),
      Suggestion_StatusId:4,
    }).then(r=>{
      this.updateLogs(vsid,4,$("#txt_Department_Comments").val());
      alert("Suggestion Rejected Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";

    }).catch(function(err) {  
      console.log(err);  
    });
  }

  private DepartmentHeadApprove(){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      Dept_Head_Comments: $("#txt_Department_Head_Comments").val(),
      Suggestion_StatusId: 9,
    }).then(r=>{
      this.updateLogs(vsid,9,$("#txt_Department_Head_Comments").val());
      alert("Suggestion Approved Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";

    }).catch(function(err) {  
      console.log(err);  
    });
  }

  private DepartmentHeadReject(){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      Dept_Head_Comments: $("#txt_Department_Head_Comments").val(),
      Suggestion_StatusId: 10,
    }).then(r=>{
      this.updateLogs(vsid,10, $("#txt_Department_Head_Comments").val());
      alert("Suggestion Rejected Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";

    }).catch(function(err) {  
      console.log(err);  
    });
  }

  private ClosingInnovationTeam(){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      AssignedDepartmentId: $("#sel_Dept").val(),
      Innovation_Team_Review: $("#Innovate_First_Comments").val(),
      Suggestion_StatusId: 6,
    }).then(r=>{
      this.updateLogs(vsid,6,$("#Innovate_First_Comments").val());
      alert("Suggestion Closed Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";

    }).catch(function(err) {  
      console.log(err);  
    });
  }
  /*
  private getIsCurrentUserInGroup(userId,groupName)
  {
      var isMember = false;
           var url = this.siteurl + "/_api/web/sitegroups/getByName('"+ groupName +"')/Users?$filter=Id eq "+ userId ;
            this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/sitegroups/getByName('"+ groupName +"')/Users?$filter=Id eq "+ userId +')`, SPHttpClient.configurations.v1)
            .then(function (result) {
                
              
            
            });

            return isMember;
            
   }
  */

  /*
  protected get dataVersion(): Version {
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
