$(document).ready(function(){
   
    $("#ln-seletor").click(function(){
      var pageurl=window.location.href; 
      if(pageurl.toLocaleLowerCase().indexOf('/portalpas/ar/')>-1)
      {
          pageurl=pageurl.toLocaleLowerCase().replace('/portalpas/ar/','/portalpas/en/');
          
          window.location.replace($("#ln-seletor").attr("href", pageurl));
      }
      else{ 
          pageurl=pageurl.toLocaleLowerCase().replace('/portalpas/en/','/portalpas/ar/');
          window.location.replace($("#ln-seletor").attr("href", pageurl));
      }
    });
  
    // $("#ln-seletor").text(arrLang[lang]['Language']);
  });
  const Pages = {
      //End User
       NewsDetails: "/Pages/NewsDetails.aspx",
       AnnouncementsDetails: "/Pages/AnnouncementsDetails.aspx",
       EventsDetails: "/Pages/EventsDetails.aspx",
       Profile: "/Pages/Profile.aspx",
     
  }
  function LoadResourceJS() {
      currentUICluture = STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name);
      SP.SOD.executeFunc('sp.js', 'SP.ClientContext', getResourceVal);
  }
  
  function getResourceVal() {
      var url = '/_layouts/15/ScriptResx.ashx?culture=' + currentUICluture + '&name=MPWCERTAPPROVALResources';
      $.getScript(url, function () {
          $("span[dyn-Res]").each(function () {
              var reskey = this.attributes["dyn-res"].value;
              $(this).html(Res[reskey.charAt(0).toLowerCase() + reskey.slice(1)]);
          });
      });
      //   // $(".UpdateLoader").hide();
  }
  
  function getUrlVars() {
      var vars = [],
          hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0].toLowerCase()] = hash[1];
      }
      return vars;
  }
  
  
  function GetItemsFromTable1(endpointUrl, Query, callback) {
      
      var retval = '';    
      var datatoload = {
          'query': {
              '__metadata': {
                  'type': 'SP.CamlQuery'
              },
              'ViewXml': Query
          }
      };
  
      $.ajax({        
          type: "POST",
          headers: {
              "accept": "application/json;odata=verbose",
              "content-type": "application/json;odata=verbose",
              "X-RequestDigest": $("#__REQUESTDIGEST").val()
          },
          data: JSON.stringify(datatoload),
          url: endpointUrl,
          async: false,
          success: function(data) {            
                         callback(data);
          },
          error: function(data) {
              alert(data);
              failure(data); // Do something with the error
          }
      });
  }
  function GetItemsFromTable(siteUrl, callback) {
      $.ajax({
          url: siteUrl,
          type: "GET",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          crossDomain: true,
          async: false,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          success: function (data) {
              callback(data);
          },
          error: function (error) {
              ShowNotification("error", JSON.stringify(error));
              console.log("Error" + JSON.stringify(error));
              logException( JSON.stringify(error), "GetItemsFromTable",siteUrl);
          }
      });
  }
  
  function AddrowstoTable(siteUrl, jsonObject, callback) {
      $.ajax({
          url: siteUrl,
          type: "POST",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          async: false,
          crossDomain: true,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          data: JSON.stringify(jsonObject),
          processData: true,
          success: function (data, status, jqXHR) {
              callback(data);
          },
          error: function (xhr) {
              ShowNotification("error", xhr.responseText);
              console.log("Error" + xhr.responseText);
              logException(xhr.responseText+" "+JSON.stringify(jsonObject), "AddrowstoTable",siteUrl);
          }
  
      });
  }
  
  function UpdateDatatoTable(siteUrl, jsonObject, callback) {
      $.ajax({
          url: siteUrl,
          type: "PUT",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          async: false,
          crossDomain: true,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          data: JSON.stringify(jsonObject),
          processData: true,
          success: function (data, status, jqXHR) {
              callback(data);
          },
          error: function (xhr) {
              ShowNotification("error", xhr.responseText);
              console.log("Error" + xhr.responseText);
              logException(xhr.responseText+" "+JSON.stringify(jsonObject), "UpdateDatatoTable",siteUrl);
          }
  
      });
  }
  
  
  // Display error messages. 
  function onError(error) {
      ShowNotification("error", error.responseText);
      logException(error.responseText, "onError","");
  }
  
  function deleteItemFromSharepointList(itemID, callback) {
      $.ajax({
          url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('Company%20Registration%20Documents')/items(" + itemID + ")",
          type: "POST",
          async: false,
          contentType: "application/json;odata=verbose",
          headers: {
              "Accept": "application/json;odata=verbose",
              "X-RequestDigest": $("#__REQUESTDIGEST").val(),
              "IF-MATCH": "*",
              "X-HTTP-Method": "DELETE",
          },
          success: function (data) {
              callback(data)
          },
          error: function (data) {
              //  alert("failed");
              logException(data.responseTex, "deleteItemFromSharepointList","Common");
  
          }
      });
  }
  
  
  function encrypt(msg) {
      var salt = CryptoJS.lib.WordArray.random(128 / 8);
  
      var key = CryptoJS.PBKDF2(password, salt, {
          keySize: keySize / 32,
          iterations: iterations
      });
  
      var iv = CryptoJS.lib.WordArray.random(128 / 8);
  
      var encrypted = CryptoJS.AES.encrypt(msg, key, {
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
  
      });
  
      // salt, iv will be hex 32 in length
      // append them to the ciphertext for use  in decryption
      var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
      return transitmessage;
  }
  
  function decrypt(transitmessage) {
      var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
      var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
      var encrypted = transitmessage.substring(64);
  
      var key = CryptoJS.PBKDF2(password, salt, {
          keySize: keySize / 32,
          iterations: iterations
      });
  
      var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
  
      })
      return decrypted;
  }
  
  function updateOdataTable(siteUrl, jsonObject, callback) {
      $.ajax({
          url: siteUrl,
          type: "PATCH",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          async: false,
          crossDomain: true,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Prefer': 'return-content'
          },
          data: JSON.stringify(jsonObject),
          processData: true,
          success: function (data, status, jqXHR) {
              callback(data);
          },
          error: function (xhr) {
              ShowNotification("error", xhr.responseText);
              console.log("Error" + xhr.responseText);
              logException(xhr.responseText+" "+JSON.stringify(jsonObject), "updateOdataTable",siteUrl);
          }
  
      });
  
  }
  
  
  function GetCurrentUser(callback) {
      var requestUri = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/getuserbyid(" + _spPageContextInfo.userId + ")";
  
      var requestHeaders = { "accept": "application/json;odata=verbose" };
  
      return $.ajax({
          url: requestUri,
          contentType: "application/json;odata=verbose",
          headers: requestHeaders,
          success: function (data) {
              callback(data.d.Title)
          },
          error: function (data) {
              logException(data.responseText, "GetCurrentUser","");
          }
      });
  }
  
  function getRequestHistory(reqID, callback) {
      var requestUri = commonSiteURl + "/api/RequestHistories?$select=Request1/ID,Request1/ReqNo,LK_Status/ID,LK_Status/StatusArabic,LK_Status/StatusEnglish,Actionby,ActionDate,Comments&$expand=Request1,LK_Status&$filter=Request eq " + parseInt(reqID);
      $.ajax({
          url: requestUri,
          type: "GET",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          crossDomain: true,
          async: false,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          success: function (data) {
              callback(data.value);
          },
          error: function (data) {
              logException(data.responseText, "getRequestHistory","");
          }
      });
  }
  
  function logException(exceptiomsg, methodName, pageName) {
      var jsonObject = {};
      
      jsonObject = {
          '__metadata': { 'type': 'SP.Data.ExceptionLogsListItem' },
          'Exception': exceptiomsg,
          'MethodName': methodName,
          'PageName': pageName
      };
  
      $.ajax({
          url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('ExceptionLogs')/Items",
          type: "POST",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          async: true,
          crossDomain: true,
          headers: {
               "accept": "application/json;odata=verbose",
              "content-type": "application/json;odata=verbose",
              "X-RequestDigest": $("#__REQUESTDIGEST").val()
          },
          data: JSON.stringify(jsonObject),
          processData: true,
          success: function (data, status, jqXHR) {
              console.log("log Updated");
          },
          error: function (xhr) {
              console.log("Error" + xhr.responseText);
             
          }
  
      });
  }
  function getPamrDateFormat(edate1) {
  
      var edate = new Date(edate1);
      var day = edate.getDate().toString();
  
      if (day.length == 1) {
          day = '0' + day;
      }
  
      var Month = (edate.getMonth() + 1).toString();
  
      if (Month.length == 1) {
          Month = '0' + Month;
      }
  
      var Year = edate.getFullYear();
      return day + '/' + Month + '/' + Year;
  }