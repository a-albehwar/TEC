import * as React from 'react';
import styles from './EmpSuggestionBox.module.scss';
import { IEmpSuggestionBoxProps } from './IEmpSuggestionBoxProps';

import { sp } from "@pnp/sp/presets/all";

import {  SPHttpClient ,SPHttpClientResponse } from '@microsoft/sp-http';



import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import { Conversation } from 'sp-pnp-js/lib/graph/conversations';
declare var arrLang: any;
declare var lang:string;

const errormsgStyle = {
  color: 'red',
};
const displayStyle = {
  display: 'none',
};

const sectiontop={
  marginTop: '-60px',
}
var Listname:string="Suggestions Box";
var LogsListName:string="WorkflowLogs";
const textareaStyle= {
  height: '140px',
  background: '#fff',
  border: 'solid 1px #d1d1d1 !important',
  fontSize: '16px',
}
export interface IListItem {  
  Title?: string;  
  Id: number;  
}  
var emp_name,emp_jobtitle,emp_dept,sug_title,sug_Desc,sug_Type;
export default class EmpSuggestionBox extends React.Component<IEmpSuggestionBoxProps, any> {
  private EmpDirectoryListName:string="EmployeeDirectory";
  private language:string;
  private userDepartment:string;
  private userJobTilte:string;
  private DocLibraryName:string="SuggestionBoxDocuments";
  public constructor(props) {
    super(props);
    this.state = {     
      fileInfos: null,
    };
    var searchPreferredmail=this.props.email;

    //var searchPreferredmail="j.joshua@tec.com.kw"; // for testing done
    this.getDataFromEmpDirectoryList(searchPreferredmail);
    
    
    /* this.props.context.spHttpClient.get(`${this.props.siteurl}/_api/search/query?querytext=%27(WorkEmail:`+encodeURIComponent(searchPreferredmail)+`)%27&selectproperties=%27AccountName,Department,JobTitle,WorkEmail%27&sourceid=%27B09A7990-05EA-4AF9-81EF-EDFAB16C4E31%27&sortlist=%27firstname:ascending%27`,SPHttpClient.configurations.v1)
    .then((response) => {
      return response.json().then((items: any): void => {
        //console.log('items.value: ', items.value);
        
        let listItems =
          items["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"];
          listItems.forEach((item) => {
            var itemResult = item["Cells"];
            itemResult.forEach((itemCell) => {
              if (itemCell["Key"] == "Department") {
                this.userDepartment=itemCell["Value"] != null? itemCell["Value"]:"";
                console.log(this.userDepartment);
              }
              else if (itemCell["Key"] == "JobTitle") {
                this.userJobTilte=itemCell["Value"] != null? itemCell["Value"]:"";
                console.log(this.userJobTilte);
              }
            });
          });
      });
    }); */
  }

  private getDataFromEmpDirectoryList(mail){
    sp.site.rootWeb.lists.getByTitle(this.EmpDirectoryListName).items.filter("EmpEmail eq '"+mail+"'").getAll()
    .then(r=>{
      console.log(r);
      if(r.length>0){
        if(r[0].Title!=null){
        $("#txtEmpName").val(r[0].Title).attr('readonly','true');
        }
        if(r[0].EmpDesignation!=null){
          $("#txtjobtitle").val(r[0].EmpDesignation).attr('readonly','true');
        }
        if(r[0].EmpDepartment!=null){
          $("#txtDept").val(r[0].EmpDepartment).attr('readonly','true');
        }
      }
    }).catch(function(err) {  
      console.log(err);  
    });
  }
 
  public render(): React.ReactElement<IEmpSuggestionBoxProps> {
    var weburl=this.props.weburl;
    var langcode=this.props.pagecultureId;
    lang=langcode=="en-US"?"en":"ar";
    return (
      <div>
      <section className={"inner-page-cont"} style={sectiontop}>

      <div className={"container-fluid mt-5"}>
          
              <div className={"row user-info col-md-10 mx-auto col-12 pl-0 pr-0 m-0"}>
                  <h3 className={"mb-4 col-12"}>Employee Details</h3>
                  <div className="col-md-4 col-12 mb-4">
                        <p>Name<span  style={errormsgStyle}>*</span></p>
                        <input type="text" id="txtEmpName" className="form-input" name="txtEmpName" onBlur={() => this.validateTextBox('txtEmpName','Name is mandatory')}/>
                        <label id="lbl_emp_name" className="form-label" style={errormsgStyle}></label>
                  </div>
                  <div className="col-md-4 col-12 mb-4">
                        <p>Job Title<span  style={errormsgStyle}>*</span></p>
                        <input type="text" id="txtjobtitle" className="form-input" name="txtjobtitle" onBlur={() => this.validateTextBox('txtjobtitle','Job Title is mandatory')}/>
                        <label id="lbl_emp_jobtitle" className="form-label" style={errormsgStyle}></label>
                  </div>
                  <div className="col-md-4 col-12 mb-4">
                        <p>Department<span  style={errormsgStyle}>*</span></p>
                        <input type="text" id="txtDept" className="form-input" name="txtDept" onBlur={() => this.validateTextBox('txtDept','Department is mandatory')}/>
                        <label id="lbl_emp_dept" className="form-label" style={errormsgStyle}></label>
                  </div>
                     
                  <h3 className={"mb-4 col-12"}>Suggestion Details</h3>
                  <div className={"col-md-12 col-12 mb-4"}>
                      <p id="lbl_Sug_Type">{arrLang[lang]['SuggestionBox']['SugType']}<span  style={errormsgStyle}>*</span></p>
                      <div className="vleft">
                          <input type="radio" id="rb_money" name="suggestionType" className={"form-control"} value="Save Money" onChange={this.handleradioClick} onBlur={this.checkboxval}></input>
                          <label  id="lbl_money" className={"form-label"}>{arrLang[lang]['SuggestionBox']['SaveMoney']}</label>
                          <input type="radio" id="rb_security" name="suggestionType" className={"form-control"} value="Improve Safety" onChange={this.handleradioClick} onBlur={this.checkboxval}></input>
                          <label   id="lbl_security" className={"form-label"}>{arrLang[lang]['SuggestionBox']['ImproveSecurity']}</label><br></br>
                          <input type="radio" id="rb_efficency" name="suggestionType" className={"form-control"} value="Improve Efficiency" onChange={this.handleradioClick} onBlur={this.checkboxval}></input>
                          <label id="lbl_Efficency" className={"form-label"}>{arrLang[lang]['SuggestionBox']['ImporveEfficiency']}</label>
                          <input type="radio" id="rb_other" name="suggestionType" className={"form-control"} value="Other" onChange={this.handleradioClick} onBlur={this.checkboxval}></input>
                          <label id="lbl_Other" className={"form-label"}>Other</label><br></br>              
                      </div>
                      <label id="lbl_SugTypeerr" className={"form-label"}  style={errormsgStyle}></label>
                  </div>
                  <div id='div_other' className={"col-lg-4  mb-2"} style={displayStyle}>
                    <p id="lbl_Other">{arrLang[lang]['SuggestionBox']['Other']}<span  style={errormsgStyle}>*</span></p>                 
                    <input type="text" id="txt_other" className={"form-input"} name="other" placeholder={"Other, please specify"}/>
                  </div>
                  <div className="col-md-12 col-12 mb-4">
                      <p>{arrLang[lang]['SuggestionBox']['Title']}<span  style={errormsgStyle}>*</span></p>
                      <textarea id="idTitle"   className="form-input" style={textareaStyle} cols={115} rows={10}  name="Suggesstiontitle" placeholder={arrLang[lang]['SuggestionBox']['Title']}  onBlur={() => this.validateTextBox('idTitle',arrLang[lang]['SuggestionBox']['Title'])}></textarea>
                      <label id="lbl_subjecterr" className={"form-label"}  style={errormsgStyle}></label>
                  </div>
                  <div className={"col-md-12 col-12 mb-4"}>
                      <p>{arrLang[lang]['SuggestionBox']['Description']} <span  style={errormsgStyle}>*</span></p>
                      <textarea id="idSuggestion"  className="form-input" style={textareaStyle} cols={115} rows={10}  name="Suggesstion" placeholder={arrLang[lang]['SuggestionBox']['TypeMessagehere']}  onBlur={() => this.validateTextBox('idSuggestion',arrLang[lang]['SuggestionBox']['Description'])}></textarea>
                      <label id="lbl_suggestionerr" className={"form-label"} style={errormsgStyle}></label>
                  </div>
                  
                  {/* <div className={"col-md-4 col-12 mb-4"}>
                      <p>{arrLang[lang]['SuggestionBox']['Attachment']}</p>
                      <div className="input-group">
                        <input type="text" name="filename" className={"form-control"} placeholder={"No file selected"} id="file_input"/>
                        <span className={"input-group-btn"}>
                            <div className={"btn file-btn custom-file-uploader"}>
                            <input type="file" className={"form-control"} id="file" onChange={this.addFile.bind(this)} />
                                Select a file
                            </div>
                        </span>
                      </div>
                      
                  </div> */}
                </div>
            
          </div>
          <div className="container-fluid mt-5">
          <div className="col-md-10 mx-auto col-12">
              <div className="row">
                <div className=" col-12 btnright">
                      <button className="red-btn shadow-sm  ml-4"  id="btnSubmit"   onClick={this.CreateSuggestion.bind(this)}>{arrLang[lang]['SuggestionBox']['Submit']}</button>
                      <button className="red-btn shadow-sm  ml-4"  id="btnCancel"  onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href=weburl;
                                    }}>{arrLang[lang]['SuggestionBox']['Cancel']}</button>
                  </div>
              </div>
          </div>
        </div>
      </section>
    </div>
      
    );
    
  }
  
  private handleradioClick(myRadio)
  {
    var selectedValue = myRadio.target.value;
        if(selectedValue=="Other")
        {
        document.getElementById("div_other").style.display = 'block';
        //Show textbox
        }
        else
        {
        document.getElementById("div_other").style.display = 'none';
        //Hide textbox.
        }
  }

  private validateTextBox(e,errmsg){
    //const inputElement = e.target as HTMLInputElement;
     var inputval=$('#'+e).val();
     var inputspan=$('#'+e).next("label");
     if(inputval=="")
     {
       inputspan.text(errmsg);
   
     }
     else
     {
       inputspan.text("");
     }
   }
  private checkboxval(){
    var sel_val=$('input[name="suggestionType"]:checked').val();
    if(sel_val==null || sel_val=="" || sel_val==undefined)
    {
      $("#lbl_SugTypeerr").text("");
      document.getElementById('lbl_SugTypeerr').append(arrLang[lang]['SuggestionBox']['SugTypeError']);
    }
    else{
      $("#lbl_SugTypeerr").text("");
    }
  }

  private addFile(event) {
    //let resultFile = document.getElementById('file');
    let resultFile = event.target.files;
    console.log(resultFile);
    let fileInfos = [];
    if(resultFile.length){
    for (var i = 0; i < resultFile.length; i++) {
      var fileName = resultFile[i].name;
      $("#file_input").val(fileName);
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
    }
    else{
      $("#file_input").val("No file Selected");
    }
    this.setState({fileInfos});
    console.log(fileInfos)
  }
  private validateForm(){
    var isvalidform=true;
     emp_name=$("#txtEmpName").val();
     emp_jobtitle=$("#txtjobtitle").val();
     emp_dept=$("#txtDept").val();

     sug_title=$("#idTitle").val();
     sug_Desc=$("#idSuggestion").val();
     sug_Type= $('input[name="suggestionType"]:checked').val();

     if(emp_name=="" || emp_name==undefined)
     {
       $("#lbl_emp_name").text("Name is mandatory");
         isvalidform = false;
     }
     else
     {
       $("#lbl_emp_name").text("");
     }

     if(emp_jobtitle=="")
     {
       $("#lbl_emp_jobtitle").text("Job Title is mandatory");
         isvalidform = false;
     }
     else
     {
       $("#lbl_emp_jobtitle").text("");
     }

     if(emp_dept=="")
     {
       $("#lbl_emp_dept").text("Department is mandatory");
         isvalidform = false;
     }
     else
     {
       $("#lbl_emp_dept").text("");
     }
     if(sug_title=="")
     {
       $("#lbl_subjecterr").text(arrLang[lang]['SuggestionBox']['Title']);
         isvalidform = false;
     }
     else
     {
       $("#lbl_subjecterr").text("");
     }
     if(sug_Desc=="")
     {
       $("#lbl_suggestionerr").text(arrLang[lang]['SuggestionBox']['Description']);
         isvalidform = false;
     }
     else
     {
       $("#lbl_suggestionerr").text("");
     }

     if(sug_Type==null || sug_Type=="" || sug_Type==undefined)
    {
      $("#lbl_SugTypeerr").text("");
      document.getElementById('lbl_SugTypeerr').append(arrLang[lang]['SuggestionBox']['SugTypeError']);
      isvalidform = false;
    }
    else if(sug_Type=="Other"){
      if($("#txt_other").val()==""){
        $("#lbl_SugTypeerr").text("");
        document.getElementById('lbl_SugTypeerr').append(arrLang[lang]['SuggestionBox']['SugTypeError']);
        isvalidform = false;
      }
      else{
      sug_Type=$("#txt_other").val();
      $("#lbl_SugTypeerr").text("");
      }
    }
    else{
      $("#lbl_SugTypeerr").text("");
    }
    
      return isvalidform;
  }
  private CreateSuggestion(event) {
   
    if(this.validateForm()==true){

      let {fileInfos}=this.state;
       if(lang=="en"){
            sp.site.rootWeb.lists.getByTitle(Listname).items.add({
              Title:  sug_title,
              Description:sug_Desc,
              Suggestion_StatusId: 1,
              Suggestion_Type:sug_Type,
              User_JobTitle:emp_jobtitle,
              User_Department:emp_dept,
              User_Name:emp_name
            }).then(r=>{
              // if(fileInfos!=null){
              // r.item.attachmentFiles.addMultiple(fileInfos);
             
              // }
              //this.updateLogs(r.data.Id,r.data.AuthorId);
              alert("Thank you. The request was submitted successfully.");
              window.location.href=this.props.siteurl+"/Pages/TecPages/SearchSB.aspx";
            }).catch(function(err) {  
              console.log(err);  
          });
       }
       else if(lang=="ar")
       {
            sp.site.rootWeb.lists.getByTitle(Listname).items.add({
              //Title_Ar: sug_title,
              Title:  sug_title,
              Description:sug_Desc,
              //Description_Ar:sug_Desc,
              Suggestion_StatusId: 1,
              Suggestion_Type:sug_Type,
              User_JobTitle:emp_jobtitle,
              User_Department:emp_dept,
              User_Name:emp_name
            }).then(r=>{
              // if(fileInfos!=null){
              // r.item.attachmentFiles.addMultiple(fileInfos);
              // }
             // this.updateLogs(r.data.Id,r.data.AuthorId);
             alert( "Thank you. The request was submitted successfully.");
             window.location.href=this.props.siteurl+"/Pages/TecPages/SearchSB.aspx";
            }).catch(function(err) {  
              console.log(err);  
          });
       }
    }
    else{
      alert("Validation errors found.");
      event.preventDefault();
      return false;
    }  
    event.preventDefault();
    return false;
  }
  private  updateLogs(ITEMID,AuthorID) {
   sp.site.rootWeb.lists.getByTitle(LogsListName).items.add({
      Title: "SuggestionsBox",
      Status: "Suggestion Initiated",
      StatusID:1,
      ItemID:ITEMID,
      AssignedTo:"Innovation Team",
      InitiatedById:AuthorID
    }).then(iar => {
      alert( arrLang[lang]['SuggestionBox']['SuccessMsg']);
      window.location.href=this.props.weburl;
      //console.log(iar);
      //this.CheckAndCreateFolder(ITEMID);
    }).catch((error:any) => {
      console.log("Error: ", error);
    });
    // add an item to the list
    
  }
  private CheckAndCreateFolder(newid:string)
  {   
    var folderUrl=this.DocLibraryName+"/"+ newid;
    sp.site.rootWeb.getFolderByServerRelativeUrl(folderUrl).select('Exists').get().then(data => {
      console.log(data.Exists);
      if(data.Exists)
      {
        console.log("Folder already exists.");
      }
      else{
        sp.site.rootWeb.folders.add(folderUrl).then(data => {
          console.log("Created Folder successfully.");
          alert( arrLang[lang]['SuggestionBox']['SuccessMsg']);
          window.location.href=this.props.weburl;
        }).catch(err => {
          console.log("Error while creating folder");
        });
      }
     
    }).catch(err => {
        console.log("Error While fetching Folder");
        
    });
  
 
  }
 
  
}
