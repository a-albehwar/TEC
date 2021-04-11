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
 
export default class EmpSuggestionBox extends React.Component<IEmpSuggestionBoxProps, any> {
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
    
    this.props.context.spHttpClient.get(`${this.props.siteurl}/_api/search/query?querytext=%27(WorkEmail:`+encodeURIComponent(searchPreferredmail)+`)%27&selectproperties=%27AccountName,Department,JobTitle,WorkEmail%27&sourceid=%27B09A7990-05EA-4AF9-81EF-EDFAB16C4E31%27&sortlist=%27firstname:ascending%27`,SPHttpClient.configurations.v1)
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
          <div className={"col-md-10 mx-auto col-12"}>
              <div className={"row user-info"}>
                  <h3 className={"mb-4 col-12"}>NEW SUGGESTION REQUEST</h3>
                  <div className={"col-md-12 col-12 mb-4"}>
                      <p id="lbl_Sug_Type">{arrLang[lang]['SuggestionBox']['SugType']}<span  style={errormsgStyle}>*</span></p>
                      <div className="vleft">
                          <input type="radio" id="rb_money" name="suggestionType" className={"form-control"} value="Save Money" onChange={this.handleradioClick}></input>
                          <label  id="lbl_money" className={"form-label"}>{arrLang[lang]['SuggestionBox']['SaveMoney']}</label>
                          <input type="radio" id="rb_security" name="suggestionType" className={"form-control"} value="Improve Safety" onChange={this.handleradioClick}></input>
                          <label   id="lbl_security" className={"form-label"}>{arrLang[lang]['SuggestionBox']['ImproveSecurity']}</label><br></br>
                          <input type="radio" id="rb_efficency" name="suggestionType" className={"form-control"} value="Improve Efficiency" onChange={this.handleradioClick}></input>
                          <label id="lbl_Efficency" className={"form-label"}>{arrLang[lang]['SuggestionBox']['ImporveEfficiency']}</label>
                          <input type="radio" id="rb_other" name="suggestionType" className={"form-control"} value="Other" onChange={this.handleradioClick}></input>
                          <label id="lbl_Other" className={"form-label"}>{arrLang[lang]['SuggestionBox']['Other']}</label><br></br>              
                      </div>
                      <label id="lbl_SugTypeerr" className={"form-label"}  style={errormsgStyle}></label>
                  </div>
                  <div id='div_other' className={"col-lg-4  mb-2"} style={displayStyle}>
                    <p id="lbl_Other">{arrLang[lang]['SuggestionBox']['Other']}<span  style={errormsgStyle}>*</span></p>                 
                    <input type="text" id="txt_other" className={"form-control"} name="other" placeholder={arrLang[lang]['SuggestionBox']['Other']}/>
                  </div>
                  <div className="col-md-12 col-12 mb-4">
                      <p>{arrLang[lang]['SuggestionBox']['Title']}<span  style={errormsgStyle}>*</span></p>
                      <textarea id="idTitle"  style={textareaStyle} cols={115} rows={10}  name="Suggesstiontitle" placeholder={arrLang[lang]['SuggestionBox']['Title']}></textarea>
                      <label id="lbl_subjecterr" className={"form-label"}  style={errormsgStyle}></label>
                  </div>
                  <div className={"col-md-12 col-12 mb-4"}>
                      <p>{arrLang[lang]['SuggestionBox']['Description']} <span  style={errormsgStyle}>*</span></p>
                      <textarea id="idSuggestion" style={textareaStyle} cols={115} rows={10}  name="Suggesstion" placeholder={arrLang[lang]['SuggestionBox']['TypeMessagehere']}></textarea>
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
          </div>
          <div className="container-fluid mt-5">
          <div className="col-md-10 mx-auto col-12">
              <div className="row">
                <div className=" col-12 btnright">
                      <button className="red-btn shadow-sm  ml-4"  id="btnSubmit"   onClick={this.upload.bind(this)}>{arrLang[lang]['SuggestionBox']['Submit']}</button>
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

  private _validateSubject(value: string): string {
    if (value.length <= 0) {
      return arrLang[lang]['SuggestionBox']['SugTitleError'];
    }
    else {
      return " ";
    }
  }

  private _validateDescription(value: string): string {
    if (value.length <= 0) {
      return arrLang[lang]['SuggestionBox']['SugDescError'];
    }
    else {
      return " ";
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

  private upload(event) {
    var sug_title=$("#idTitle").val();
    var sug_Desc=$("#idSuggestion").val();
    var sug_Type= $('input[name="suggestionType"]:checked').val();
    //alert(sug_Type);
    $("#lbl_subjecterr").empty();
    document.getElementById('lbl_subjecterr').append(this._validateSubject( sug_title));
    $("#lbl_suggestionerr").empty();
    document.getElementById('lbl_suggestionerr').append(this._validateDescription(sug_Desc));
    $("#lbl_SugTypeerr").empty();

    if(sug_Type==null || sug_Type=="" || sug_Type==undefined)
    {
      document.getElementById('lbl_SugTypeerr').append(arrLang[lang]['SuggestionBox']['SugTypeError']);
    }
    else if(sug_Type=="Other"){
      if($("#txt_other").val()==""){
        document.getElementById('lbl_SugTypeerr').append(arrLang[lang]['SuggestionBox']['SugTypeError']);
      }
      else{
      sug_Type=$("#txt_other").val();
      }
    }
    
    if(sug_title !="" && sug_Desc !="" && sug_Type!=""){

      let {fileInfos}=this.state;
       if(lang=="en"){
            sp.site.rootWeb.lists.getByTitle(Listname).items.add({
              Title:  sug_title,
              Description:sug_Desc,
              Suggestion_StatusId: 1,
              Suggestion_Type:sug_Type,
              User_JobTitle:this.userJobTilte,
              User_Department:this.userDepartment,
            }).then(r=>{
              // if(fileInfos!=null){
              // r.item.attachmentFiles.addMultiple(fileInfos);
             
              // }
              //this.updateLogs(r.data.Id,r.data.AuthorId);
              alert( arrLang[lang]['SuggestionBox']['SuccessMsg']);
              window.location.href=this.props.weburl;
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
              User_JobTitle:this.userJobTilte,
              User_Department:this.userDepartment,
            }).then(r=>{
              // if(fileInfos!=null){
              // r.item.attachmentFiles.addMultiple(fileInfos);
              // }
             // this.updateLogs(r.data.Id,r.data.AuthorId);
             alert( arrLang[lang]['SuggestionBox']['SuccessMsg']);
             window.location.href=this.props.weburl;
            }).catch(function(err) {  
              console.log(err);  
          });
       }
    }
    else{
      //alert(arrLang[lang]['SuggestionBox']['FillMandatoryFields']);
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
