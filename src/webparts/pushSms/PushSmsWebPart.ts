import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PushSmsWebPart.module.scss';
import * as strings from 'PushSmsWebPartStrings';
import * as $ from 'jquery';
//import { SPHttpClient, SPHttpClientResponse,HttpClientResponse,HttpClient,IHttpClientOptions } from '@microsoft/sp-http';

import { SPHttpClient, SPHttpClientResponse,IHttpClientOptions } from "@microsoft/sp-http";
import { HttpRequestError } from '@pnp/odata';

export interface IPushSmsWebPartProps {
  description: string;
}

declare var arrLang: any;

export default class PushSmsWebPart extends BaseClientSideWebPart<IPushSmsWebPartProps> {

  private Listname: string = "EmployeeSuggestions";
  private listItemId: number = 0;
  private language:string;
  
  public render(): void {
    this.domElement.innerHTML = `
    <br/>
    <div class="col-lg-4  mb-2">
      <label id="lbl_Language" class="form-label"></label>
    </div>
    <div class="col-lg-4 mb-2 vleft">
      <input type="radio" id="rb_arabic" name="language" class="form-control" value="A">
      <label for="arabic" id="lbl_rb_Arabic" class="form-label"></label><br>
      <input type="radio" id="rb_english" name="language" class="form-control" value="L">
      <label for="english"  id="lbl_rb_English" class="form-label"></label><br>
      <label id="lbl_Langerr" class="form-label" style="color:red"></label>
    </div>
    <div class="col-lg-4  mb-2">    
      <label id="lblTitle" class="form-label">Mobile Number </label>
      <input type="text" id="idTitle" class="form-control" name="Title"><br>
      <i id="italic_Multimob" class="form-label"></i>
      <label id="lbl_MobNumerr" class="form-label" style="color:red"></label>
    </div> 
    <div class="col-lg-4  mb-2">    
      <label id="lblSubject" class="form-label"></label>
      <input type="text" id="idSubject" class="form-control" name="Subject"><br>
      <label id="lbl_subjecterr" class="form-label" style="color:red"></label>
    </div>   
    <div class="col-lg-4  mb-2">    
      <label id="lblSuggestion" class="form-label"> Message </label>
      <textarea style="height:auto !important" rows="5" cols="5" id="idSuggestion" class="form-control" name="Suggesstion"> 
      </textarea><br>
      <label id="lbl_Msgerr" class="form-label" style="color:red"></label>
    </div>  
    <div class="col-lg-4">
      <button class="red-btn shadow-sm  mt-4" id="btnSubmit"></button>
    </div>
    <br>
    <label id="lblDisplayMsg" class="form-label"></label> 
    `;
    this.Localization();
    this.setButtonsEventHandlers();
  }
  
  private clear(): void {
    document.getElementById('idTitle')["value"] = "";
    document.getElementById('idSuggestion')["value"] = "";
    document.getElementById('idSubject')["value"] = "";
  }

  private Localization(): void {
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
    this.language=lcid==13313?"ar":"en";
    $('#btnSubmit').text(arrLang[this.language]['PushSms']['Send']);
    $('#idTitle').attr("placeholder", arrLang[this.language]['PushSms']['EnterMobileNumber']);
    $('#idSubject').attr("placeholder", arrLang[this.language]['PushSms']['SubjectError']);
    //$('#idSuggestion').attr("placeholder", arrLang[this.language]['PushSms']['TypeMessagehere']);
    $('#lblTitle').text(arrLang[this.language]['PushSms']['MobileNumber']);
    $('#lblSuggestion').text(arrLang[this.language]['PushSms']['Message']);
    $('#italic_Multimob').html(arrLang[this.language]['PushSms']['MultiNumNote']);
    $('#lblSubject').text(arrLang[this.language]['PushSms']['Subject']);

    $('#lbl_Language').text(arrLang[this.language]['PushSms']['Lang']);
    $('#lbl_rb_Arabic').text(arrLang[this.language]['PushSms']['Arabic']);
    $('#lbl_rb_English').text(arrLang[this.language]['PushSms']['English']);
    
  }

  private setButtonsEventHandlers(): void {
    const webPart: PushSmsWebPart = this;
    
    this.domElement.querySelector('#btnSubmit').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.send();
     });    
     
  }

  private _validateDescription(value: string): string {
    if (value.length <= 0) {
      return arrLang[this.language]['PushSms']['MessageError'];
    }
    else {
      return " ";
    }
  }
  private _validateMobileNumber(value: string): string {
    if (value.length <= 0) {
      return arrLang[this.language]['PushSms']['MobileError'];
    }
    else {
      return " ";
    }
  }
  private _validateSubject(value: string): string {
    if (value.length <= 0) {
      return arrLang[this.language]['PushSms']['SubjectError'];
    }
    else {
      return " ";
    }
  }

  private send(): void {


    
    const body: string = JSON.stringify({
      'Title': document.getElementById('idTitle')["value"],
      'Suggestion': document.getElementById('idSuggestion')["value"],    
    });
    $("#lbl_MobNumerr").empty();
    document.getElementById('lbl_MobNumerr').append(this._validateMobileNumber( document.getElementById('idTitle')["value"]));
    $("#lbl_Msgerr").empty();
    document.getElementById('lbl_Msgerr').append(this._validateDescription( document.getElementById('idSuggestion')["value"]));
    $("#lbl_subjecterr").empty();
    document.getElementById('lbl_subjecterr').append(this._validateSubject( document.getElementById('idSubject')["value"]));
    $("#lbl_Langerr").empty();
    var isChecked = jQuery("input[name=language]:checked").val();
    if(isChecked!="L" && isChecked!="A"){
      document.getElementById('lbl_Langerr').append(arrLang[this.language]['PushSms']['LangErr']);
    }
    const httpClientOptions: IHttpClientOptions = {
      headers: new Headers(),
      method: "GET",
      mode: "cors",
      
    };
   var msgsubject=(document.getElementById('idSubject')["value"]).trim();
   var msgdesc=(document.getElementById('idSuggestion')["value"]).trim();
   var mobilenum=document.getElementById('idTitle')["value"];
  
   
   
    /*
     //var url="https://apitec.azurewebsites.net/api/pushsms/Tourent/tour@321/"+msgsubject+"/"+msgdesc+"/"+mobilenum+"/"+selectedMsgLangVal;
     var url="https://apitec.azurewebsites.net/api/pushsms/Tourent/tour@321/InfoText/"+msgdesc+"/"+mobilenum+"/"+selectedMsgLangVal;
     this.context.spHttpClient
     .get(url, SPHttpClient.configurations.v1,httpClientOptions)
      //.get("http://62.215.226.164/fccsms.aspx?UID=Tourent&p=tour@321&S=InfoText&G=96565058449&M=Testmsg&L=L", SPHttpClient.configurations.v1,httpClientOptions)
    .then((data: any): void => {
    //return response.json().then((items: any): void => {
      if(data.status==200 && data.statusText=="OK")
      {
      $("#lblDisplayMsg").empty();
      document.getElementById('lblDisplayMsg').append(arrLang[this.language]['PushSms']['SuccessMessage']);
      this.clear();
      }
      else{
        $("#lblDisplayMsg").empty();
     // document.getElementById('lblDisplayMsg').append(data.status);
      }
    }, (error: any): void => {
      $("#lblDisplayMsg").empty();
      document.getElementById('lblDisplayMsg').append(error);
    });
 
    */
   if(msgsubject!=null && msgdesc!=null && mobilenum!=null && isChecked!=null){
     
      var getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        
        xhr.onload = function() {
        
            var status = xhr.status;
            
            if (status == 200) {
                callback(null, xhr.response);
            } else {
                callback(status);
            }
        };
        
        xhr.send();
    };
    
    getJSON('https://apitec.azurewebsites.net/api/pushsms/Tourent/tour@321/'+msgsubject+'/'+msgdesc+'/'+mobilenum+'/'+isChecked,  function(err, data) {
        
        if (err != null) {
            console.log(err);
            //alert(err);
        } else {
           console.log(data);
            if(data.startsWith("00"))
            {
              alert(arrLang[this.language]['PushSms']['SuccessMessage']);
            }
            else{
            alert(data);
            }
        }
    });
  }
  else{
    alert("Please fill mandatory fields");
  }

  }

  
  /*protected get dataVersion(): Version {
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
