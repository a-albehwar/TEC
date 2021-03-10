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
  Description_Ar:string;
  CreatedDate:string;
  PublishedSource:string;
  Status:{
    Title:string
  }; 
  Author:{
    Title:string
  };
}




export default class ViewSuggestionWebPart extends BaseClientSideWebPart<IViewSuggestionWebPartProps> {
  items: any;
  
  
  private Listname: string = "SuggestionsBox";
  private LogsListname: string = "SuggestionsBoxWorkflowLogs";

  
  
  

  private _checkUserInGroup(strGroup)
  {

    let InGroup:boolean = false;
    
 
    //const queryUrl = `${this.context.pageContext.site.absoluteUrl}/_api/web/currentuser/groups`;
    this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/currentuser/groups`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            let listItems: ISPList[] = items["value"];
            listItems.forEach((item: ISPList) => {
              if(item.Title==strGroup)
              {
                isinnovateteamMember=true;
                
              }
            });
          });
         
        });   
      
  }
  
  private _externalJsUrl: string = "https://tecq8.sharepoint.com/sites/IntranetDev/Style%20Library/TEC/JS/CustomJs.js";

  // adding customjs file before render
  public onInit(): Promise<void> {
    console.log(`ViewSuggestionWebPart.onInit(): Entered.`);
    
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
    this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${this.LogsListname}')/items?$select=ID,Created,Title,Status/Title,SuggestionID/Title,Author/Title&$expand=SuggestionID,Author,Status&$filter=Title eq '${vsid}'&$orderby=ID%20desc`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            let listItems: ISPList[] = items["value"];
            listItems.forEach((item: ISPList) => {
            var logmomentObj = moment(item.CreatedDate);
            var logformatpubDate=logmomentObj.format('DD-MM-YYYY');
            var logstatus=item.Status.Title;
            var logAuthor=item.Author.Title;
            historybody += `
            <tr>
                <td>`+logstatus+`</td>
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
    
                                                                                                      //?$select=*,ID,Suggestion_Status/ID,Suggestion_Status/Title&$expand=Suggestion_Status&$filter=ID eq 6
    this.context.spHttpClient.get(`${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('${this.Listname}')/items?$select=*,ID,Suggestion_Status/ID,Suggestion_Status/Title&$expand=Suggestion_Status&$filter=ID%20eq%20${vsid}`, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json()
          .then((items: any): void => {
            
            var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
            lang=lcid==13313?"ar":"en";
            //listItems.forEach((item: ISPList) => {
              //if (item.ID === parseInt(vsid)) {
                var momentObj = moment(items.CreatedDate);
                var formatpubDate=momentObj.format('DD-MM-YYYY');
               var mediatitle=lang=="en"?items.value[0].Title: items.value[0].Title_Ar;
               var mediadesc=lang=="en"?items.value[0].Description: items.value[0].Description_Ar;
               var sugStatus=items.value[0].Suggestion_Status.Title;
               
               statusid=items.Suggestion_StatusId;
               if(statusid==9 || statusid==5){
                  $( "#tab2" ).empty();
                  InnovateTabhtml += `
                          <div class="col-lg-4  mb-2">   
                          <label id="lbl_Status_Header" class="form-label">Status</label>
                          </div>  
                          <div class="col-lg-4 mb-2 vleft">
                            <input type="radio" id="rb_arabic" name="language" class="form-control" value="8">
                            <label for="arabic" id="lbl_rb_Arabic" class="form-label">Standby</label><br>
                            <input type="radio" id="rb_english" name="language" class="form-control" value="5">
                            <label for="english"  id="lbl_rb_English" class="form-label">Inprogress</label><br>
                            <input type="radio" id="rb_eng" name="language" class="form-control" value="7">
                            <label for="english"  id="lbl_rb_English" class="form-label">Completed</label><br>
                            <label id="lbl_Langerr" class="form-label" style="color:red"></label>
                          </div>
                          <div class="col-lg-4  mb-2">   
                            <label id="lbl_Innovation_Second_Header" class="form-label"> Comments </label>
                            <textarea style="height:auto !important" rows="5" cols="5" id="Innovate_Second_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                          </div>
                          <div class="col-lg-4  mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Submit"> <span>Submit</span></button>
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
                          <div class="col-lg-4  mb-2">   
                            <label id="lbl_Innovation_Second_Header" class="form-label"> Comments </label>
                            <textarea style="height:auto !important" rows="5" cols="5" id="Innovate_Second_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                          </div>
                          <div class="col-lg-4  mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Review_Close" onClick="this.InnovationTeamClosed(); return false;"> <span>Close</span></button>
                          </div>
                  `;
                  InnovateTabhtml += '</div></div>';
                  const InnovateTabContainer: Element = this.domElement.querySelector('#tab2');
                  InnovateTabContainer.innerHTML = InnovateTabhtml;
                  document.getElementById('btn_Review_Close').addEventListener('click',(e)=>{ e.preventDefault();this.InnovationTeamClosed()});    
                }
              html += `
                <div class="col-lg-4  mb-2">   
                  <label id="lbl_Title_Header" class="form-label">Title</label>
                  <label id="lbl_Title" class="form-label"> : `+mediatitle+` </label>
                </div>  
                <div class="col-lg-4  mb-2">   
                  <label id="lbl_Suggestion_Header" class="form-label"> Suggestion </label>
                  <label id="lbl_Suggestion" class="form-label"> : `+mediadesc+`</label>
                </div>
                <div class="col-lg-4  mb-2">   
                  <label id="lbl_Status_Header" class="form-label"> Status </label>
                  <label id="lbl_Status" class="form-label"> : `+sugStatus+` </label>
                </div>
                 <div class="col-lg-4  mb-2">   
                  <label id="lbl_CreatedDate_Header" class="form-label"> Created Date </label>
                  <label id="lbl_CreatedDate" class="form-label"> : `+formatpubDate+`</label>
                </div>
                <div class="col-lg-4  mb-2">   
                  <label id="lbl_Attach_Header" class="form-label"> Attachments</label>
                  <a href="#">Attached Files</a>
                </div>
              `;
               
            
              //}
            //});
            html += '</div></div>';
            
            const listContainer: Element = this.domElement.querySelector('#tab1');
            listContainer.innerHTML = html;

            //const InnovateTabContainer: Element = this.domElement.querySelector('#tab2');
            //InnovateTabContainer.innerHTML = InnovateTabhtml;

            //const DeptContainer: Element = this.domElement.querySelector('#tab3');
            //DeptContainer.innerHTML = DepartmentTabhtml;

            
          });
      });
  }

  public render(): void {
    this.domElement.innerHTML = `
    <section class="inner-page-cont">
           
         <div class="Inner-page-title">
             <h2 class="page-heading">TABS</h2>
         </div>
         <div class="container-fluid mt-5" id="Suggestion_Tabs">
                <ul class="tabs">
                  <li class="active" rel="tab1">Suggestion Details</li>
                  <li rel="tab2">Innovation Review</li>
                  <li rel="tab3">Department Review</li>
                  <li rel="tab4">Department Head</li>
                </ul>
                <div class="tab_container">
                  <h3 class="d_active tab_drawer_heading" rel="tab1">`+arrLang[lang]['SuggestionBox']['Details']+`</h3>
                  <div id="tab1" class="tab_content">
                  
                    
                  </div>
                  
                  <h3 class="tab_drawer_heading" rel="tab2">`+arrLang[lang]['SuggestionBox']['InnovationTeam']+`</h3>
                  <div id="tab2" class="tab_content">
                      <div class="row gray-box">
                        <div class="col-md-12">
                          <div class="col-lg-4  mb-2">   
                          <label id="lbl_Title_Header" class="form-label">Department</label>
                          <select name="department" id="sel_Dept" class="form-control" ></select>
                          </div>  
                          <div class="col-lg-4  mb-2">   
                            <label id="lbl_Suggestion_Header" class="form-label"> Comments </label>
                            <textarea style="height:auto !important" rows="5" cols="5" id="Innovate_First_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                          </div>
                          <div class="col-lg-4  mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Assign_Dept"> <span>Assign Department</span></button>
                          <button class="red-btn shadow-sm  mt-4" id="btn_Close"> <span>Close</span></button>
                          </div>
                        </div>
                      </div>  
                  </div>
                  
                  <h3 class="tab_drawer_heading" rel="tab3">`+arrLang[lang]['SuggestionBox']['Department']+`</h3>
                  <div id="tab3" class="tab_content">
                    <div class="row gray-box">
                      <div class="col-md-12">
                        <div class="col-lg-4  mb-2">   
                          <label id="lbl_Attach_Header" class="form-label">Attachment</label>
                          <input type="file" multiple="true" className="form-control" id="file"/>
                        </div>  
                        <div class="col-lg-4  mb-2">   
                          <label id="lbl_Comments_Header" class="form-label"> Comments </label>
                          <textarea style="height:auto !important" rows="5" cols="5" id="txt_Department_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                        </div>
                        <div class="col-lg-4  mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Approve"> <span>Require Approval</span></button>
                          <button class="red-btn shadow-sm  mt-4" id="btn_Reject"> <span>Reject</span></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 class="tab_drawer_heading" rel="tab4">`+arrLang[lang]['SuggestionBox']['Department']+`</h3>
                  <div id="tab4" class="tab_content">
                    <div class="row gray-box">
                      <div class="col-md-12">
                        <div class="col-lg-4  mb-2">   
                          <label id="lbl_Exist_Attach_Header" class="form-label">Existing Attachment</label>
                          <a href="#">Attachment Links</a>
                        </div>
                        <div class="col-lg-4  mb-2">   
                          <label id="lbl_Dept_Head_Comments_Header" class="form-label"> Comments </label>
                          <textarea style="height:auto !important" rows="5" cols="5" id="txt_Department_Head_Comments" class="form-control" name="InnovateTeamCommnents"></textarea>
                        </div>
                        <dv class="col-lg-4  mb-2">   
                          <button class="red-btn shadow-sm  mt-4" id="btn_Dept_Head_Approve"> <span>Aprpove</span></button>
                          <button class="red-btn shadow-sm  mt-4" id="btn_Dept_Head_Reject"> <span>Reject</span></button>
                        </div>
                      </div>
                    </div>  
                  </div>
                </div> 
            </div>
         </section>
         <h2 style="margin-left: 20px;">History</h2>
         <div class="container-fluid">
            
                          <table class="table table-bordered table-hover footable">
                            <thead>
                                <tr>
                                  <th data-breakpoints="xs">Status</th>
                                  <th data-breakpoints="xs">Action Date</th>
                                  <th data-breakpoints="xs">Approved By</th>
                                </tr>
                            </thead>
                            <tbody id="tbl_tb_history">
                            </tbody>
                          </table>
                   
           </div>
    `;

      //this.Localization();
      this._checkUserInGroup("InnovationTeam");
      this.getMediaByID();
      this.LoadDepartments();
      this.setButtonsEventHandlers();
      this.getLogsByID();
      if (isinnovateteamMember==false){
        $('#tab2').hide();
        $('#Suggestion_Tabs ul > li:eq(1)').hide();
        console.log(isinnovateteamMember);
       }
       else{
        $('#Suggestion_Tabs ul > li:eq(1)').show();
        $('#tab2').show();
        console.log(isinnovateteamMember);
       }
  
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

  private updateLogs(itemid,stsid) {
    sp.site.rootWeb.lists.getByTitle("SuggestionsBoxWorkflowLogs").items.add({
      Title:  itemid,
      SuggestionIDId: itemid,
      StatusId:stsid,
    }).then(r=>{
      console.log("added data to history list");
    }).catch(function(err) {  
      console.log(err);  
    });
  }

  private Localization(): void {
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
     lang=lcid==13313?"ar":"en";
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
      this.updateLogs(vsid,6);
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
      this.updateLogs(vsid,stsid);
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
      this.updateLogs(vsid,2);
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
      this.updateLogs(vsid,3);
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
      this.updateLogs(vsid,4);
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
      this.updateLogs(vsid,9);
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
      this.updateLogs(vsid,10);
      alert("Suggestion Rejected Successfully");
      window.location.href="https://tecq8.sharepoint.com/sites/IntranetDev/EN/Pages/TecPages/EmployeeSuggestions/AllSuggestions.aspx";

    }).catch(function(err) {  
      console.log(err);  
    });
  }

  private addFile(event) {
    //let resultFile = document.getElementById('file');
    let resultFile = event.target.files;
    console.log(resultFile);
    let fileInfos = [];
    for (var i = 0; i < resultFile.length; i++) {
      var fileName = resultFile[i].name;
      console.log(fileName);
      var file = resultFile[i];
      var reader = new FileReader();
      reader.onload = (function(file) {
         return function(e) {
              //Push the converted file into array
               fileInfos.push({
                  "name": file.name,
                  "content": e.target.result
                  });
                }
         })(file);
      reader.readAsArrayBuffer(file);
    }
   // this.setState({fileInfos});
    console.log(fileInfos)
  }

  private ClosingInnovationTeam(){
    sp.site.rootWeb.lists.getByTitle(this.Listname).items.getById(vsid).update({
      AssignedDepartmentId: $("#sel_Dept").val(),
      Innovation_Team_Review: $("#Innovate_First_Comments").val(),
      Suggestion_StatusId: 6,
    }).then(r=>{
      this.updateLogs(vsid,6);
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
