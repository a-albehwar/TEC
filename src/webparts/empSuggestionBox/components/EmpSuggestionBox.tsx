import * as React from 'react';
import styles from './EmpSuggestionBox.module.scss';
import { IEmpSuggestionBoxProps } from './IEmpSuggestionBoxProps';

import { sp} from "@pnp/sp/presets/all";

declare var arrLang: any;
declare var lang:string;
const errormsgStyle = {
  color: 'red',
};

export default class EmpSuggestionBox extends React.Component<IEmpSuggestionBoxProps, any> {
  private language:string;
 
  public constructor(props) {
    super(props);
    this.state = {     
      fileInfos: null,
    };
  }

  public render(): React.ReactElement<IEmpSuggestionBoxProps> {
    var weburl=this.props.weburl;
    var langcode=this.props.pagecultureId;
    lang=langcode=="en-US"?"en":"ar";
    return (
      
        <div>
            <div className={"col-lg-4  mb-2"}>  
               <label id="lblTitle" className={"form-label"}> {arrLang[lang]['SuggestionBox']['Title']} <span style={errormsgStyle}>*</span></label>
               <input type="text" id="idTitle" className={"form-control"} name="Title" placeholder={arrLang[lang]['SuggestionBox']['Title']} />
               <label id="lbl_subjecterr" className={"form-label"}  style={errormsgStyle}></label>
            </div>
            <div className={"col-lg-4  mb-2"}>
                <label id="lblSuggestion" className={"form-label"}> {arrLang[lang]['SuggestionBox']['Description']} <span  style={errormsgStyle}>*</span></label>
                <textarea id="idSuggestion" className={"form-control"} name="Suggesstion" placeholder={arrLang[lang]['SuggestionBox']['TypeMessagehere']}></textarea>
                <label id="lbl_suggestionerr" className={"form-label"} style={errormsgStyle}></label>
            </div>
            <div className={"col-lg-4  mb-2"}>
                <label id="lblattach" className={"form-label"}>{arrLang[lang]['SuggestionBox']['Attachment']}<span  style={errormsgStyle}>*</span></label>
                <input type="file" multiple={true} className={"form-control"} id="file" onChange={this.addFile.bind(this)} />
                <label id="lbl_attachmenterr" className={"form-label"}  style={errormsgStyle}></label>
            </div>
            <div className="col-lg-4">
              
              <button className={"red-btn shadow-sm  mr-3"} id="btnSubmit"   onClick={this.upload.bind(this)}>{arrLang[lang]['SuggestionBox']['Submit']}</button>
              <button className={"red-btn shadow-sm  mr-3"} id="btnCancel"  onClick={(e) => {
                          e.preventDefault();
                          window.location.href=weburl;
                          }}>{arrLang[lang]['SuggestionBox']['Cancel']}</button>
            </div> 
        </div>
      
    );
    
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
    this.setState({fileInfos});
    console.log(fileInfos)
  }

  private upload(event) {
    var sug_title=$("#idTitle").val();
    var sug_Desc=$("#idSuggestion").val();
    
    
    $("#lbl_subjecterr").empty();
    document.getElementById('lbl_subjecterr').append(this._validateSubject( sug_title));
    $("#lbl_suggestionerr").empty();
    document.getElementById('lbl_suggestionerr').append(this._validateDescription(sug_Desc));
    $("#lbl_attachmenterr").empty();
    if(this.state.fileInfos==null || this.state.fileInfos==undefined )
    {
      document.getElementById('lbl_attachmenterr').append(arrLang[lang]['SuggestionBox']['AttachError']);
    }
    
    if(sug_title !="" && sug_Desc !="" && this.state.fileInfos!=null && this.state.fileInfos!=undefined ){

      let {fileInfos}=this.state;
       if(lang=="en"){
            sp.site.rootWeb.lists.getByTitle("SuggestionsBox").items.add({
              Title:  sug_title,
              Description:sug_Desc,
              Suggestion_StatusId: 1,
            }).then(r=>{
              r.item.attachmentFiles.addMultiple(fileInfos);
              this.updateLogs(r.data.Id);
              alert( arrLang[lang]['SuggestionBox']['SuccessMsg']);
              window.location.href=this.props.weburl;
            }).catch(function(err) {  
              console.log(err);  
          });
       }
       else if(lang=="ar")
       {
            sp.site.rootWeb.lists.getByTitle("SuggestionsBox").items.add({
              Title_Ar: sug_title,
              Title:  sug_title,
              Description_Ar:sug_Desc,
              Suggestion_StatusId: 1,
            }).then(r=>{
              r.item.attachmentFiles.addMultiple(fileInfos);
              this.updateLogs(r.data.Id);
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
  private updateLogs(item) {
      sp.site.rootWeb.lists.getByTitle("SuggestionsBoxWorkflowLogs").items.add({
        Title:  item,
        SuggestionIDId: 1,
        StatusId:1,
      }).then(r=>{
        console.log("added data to history list");
      }).catch(function(err) {  
        console.log(err);  
    });
  }

}
