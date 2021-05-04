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
declare var lang: any;
let MobileNumersArray: any[] = [];
let msgdesc:string;
export default class PushSmsWebPart extends BaseClientSideWebPart<IPushSmsWebPartProps> {

  private Listname: string = "EmployeeSuggestions";
  private listItemId: number = 0;
  private language:string;
  
  public render(): void {
    this.domElement.innerHTML = `
    <br/>
    <!-- <div class="col-lg-4  mb-2">
      <label id="lbl_Language" class="form-label"></label>
    </div>
    <div class="col-lg-4 mb-2 vleft">
      <input type="radio" id="rb_arabic" name="language" class="form-control" value="A">
      <label for="arabic" id="lbl_rb_Arabic" class="form-label"></label><br>
      <input type="radio" id="rb_english" name="language" class="form-control" value="L">
      <label for="english"  id="lbl_rb_English" class="form-label"></label><br>
      <label id="lbl_Langerr" class="form-label" style="color:red"></label>
    </div> -->
    <div class="col-lg-4  mb-2">    
      <label id="lblTitle" class="form-label">Mobile Number </label>
      <input type="text" id="idTitle" class="form-input" name="Title"><br>
      <i id="italic_Multimob" class="form-label"></i>
      <label id="lbl_MobNumerr" class="form-label" style="color:red"></label>
    </div> 
    <!-- <div class="col-lg-4  mb-2">    
      <label id="lblSubject" class="form-label"></label>
      <input type="text" id="idSubject" class="form-input" name="Subject"><br>
      <label id="lbl_subjecterr" class="form-label" style="color:red"></label>
    </div>  -->  
    <div class="col-lg-4  mb-2">    
      <label id="lblSuggestion" class="form-label"> Message </label>
      <textarea style="height:auto !important" rows="5" cols="5" id="idSuggestion" class="form-input" name="Suggesstion"> 
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
    $('textarea').each(function(){
      $(this).val($(this).val().trim());
      }
    );
  }
  
  private clear(): void {
    document.getElementById('idTitle')["value"] = "";
    document.getElementById('idSuggestion')["value"] = "";
    //document.getElementById('idSubject')["value"] = "";
  }

  private Localization(): void {
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
    lang=lcid==13313?"ar":"en";
    $('#btnSubmit').text(arrLang[lang]['PushSms']['Send']);
    $('#idTitle').attr("placeholder", arrLang[lang]['PushSms']['EnterMobileNumber']);
    //$('#idSubject').attr("placeholder", arrLang[lang]['PushSms']['SubjectError']);
    $("#idSuggestion").attr("placeholder", "Type Message here"); 
   // $('#idSuggestion').attr('placeholder','Type Message here');
    $('#lblTitle').text(arrLang[lang]['PushSms']['MobileNumber']);
    $('#lblSuggestion').text(arrLang[lang]['PushSms']['Message']);
    $('#italic_Multimob').html("<b>Note :</b>Enter mutliple numbers separated by comma(,) & Mobile number format must be 96590065645");
   // $('#lblSubject').text(arrLang[lang]['PushSms']['Subject']);

   // $('#lbl_Language').text(arrLang[lang]['PushSms']['Lang']);
   // $('#lbl_rb_Arabic').text(arrLang[lang]['PushSms']['Arabic']);
   // $('#lbl_rb_English').text(arrLang[lang]['PushSms']['English']);
    
  }

  private setButtonsEventHandlers(): void {
    const webPart: PushSmsWebPart = this;
    
    this.domElement.querySelector('#btnSubmit').addEventListener('click', (e) => { 
      e.preventDefault();
      webPart.send();
     });    
     
  }


  private ValidateKuwaitNumber(mob:string) 
  {
  if (/^(965[569]\d{7})$/.test(mob))
    {
      return (true)
    }
    else{
      return (false)
    }
  }

  private validateForm(){
    var isvalid=true;
    var mobiledata=document.getElementById('idTitle')["value"];
    msgdesc=document.getElementById('idSuggestion')["value"].trim();
   
    if(msgdesc==""){
      $("#lbl_Msgerr").text(arrLang[lang]['PushSms']['MessageError']);
      isvalid=false;
    }
    else{
      $("#lbl_Msgerr").text("");
    }

    if(mobiledata==""){
      $("#lbl_MobNumerr").text(arrLang[lang]['PushSms']['MobileError']);
      isvalid=false;
    }
    else{
      MobileNumersArray = mobiledata.split(",");
       var matchmob=true;
     for(var i=0; i<MobileNumersArray.length;i++){
        var mn=MobileNumersArray[i];
        if(matchmob==true){
          if(this.ValidateKuwaitNumber(mn)==false)
          {
            matchmob=false;
          }
        }
      } 
      if(matchmob==true){
        $("#lbl_MobNumerr").text("");
      }
      else{
        $("#lbl_MobNumerr").text("Mobile number format must be 96590065645");
        isvalid=false;
      }
    }
    return isvalid;
  }

  private send(): void {
    if(this.validateForm()==true){

      const httpClientOptions: IHttpClientOptions = {
        headers: new Headers(),
        method: "GET",
        mode: "cors",
        
      };

      for(var i=0; i<MobileNumersArray.length;i++){
              var mn=MobileNumersArray[i];

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
              
              getJSON('https://apitecq8.azurewebsites.net/api/pushsms/Tourent/tour@321/infoText/'+msgdesc+'/'+mn+'/L',  function(err, data) {
                  //https://apitecq8.azurewebsites.net/api
                  if (err != null) {
                      console.log(err);
                  } else {
                    console.log(data);
                      if(data.startsWith("00"))
                      {
                        alert(arrLang[lang]['PushSms']['SuccessMessage']);
                      }
                      else{
                      alert(data);
                      }
                  }
              });
      }
    }
    else{
      alert("Sorry,Please check your form where some data is not in a valid format.");
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
