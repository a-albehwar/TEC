$(window).on('load', function () {
    setTimeout(function () {
        $("#dvmodalAjaxLoader").hide();
    }, 500);
});
const properties = {
    "webPartTitle": "Employee Profiles",
    "webServerRelativeUrl": "",
    "BranchesListName": "Branches",
    "DepartmentsListName": "Departments",
    "itemsLimit": "200",
    "itemsLimitPerPage": 10,
    "orderBy": "PreferredName asc",
    "showArabicDirection": true,
    "voteButtonCaption": "Search",
    "restrictedDomains": "tecq8.onmicrosoft.com",
    "fullContentTimeout": 2500,
    "loadingText": "Just a moment, we are loading the contents..."
}
var totalRequests = '';
var searchRequests = '';
var commonSiteURl = 'https://tecq8.sharepoint.com/sites/intranetdev/';//this.context.pageContext.web.absoluteUrl;//_spPageContextInfo.siteAbsoluteUrl;
var lang = "en";
var IsArabic=false;
var totalDeptsCount = 0;
$(document).ready(function () {
    $("#btnSearch").on("click", function() {
        searchClick();
    });
    // localization();

	//$("#dvmodalAjaxLoader").show();
	
    //loadDepartment();
    _getListData();
	//$("#dvmodalAjaxLoader").hide();
	

});

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
            //ShowNotification("error", JSON.stringify(error));
            console.log("Error" + JSON.stringify(error));
            logException( JSON.stringify(error), "GetItemsFromTable",siteUrl);
        }
    });
}

function localization() {

    lang = IsArabic ? "ar" : "en";

    $('#pageTitle').text(arrLang[lang]['EmployeeDirectory']);

    $('#pageNav1').text(arrLang[lang]['Home']);
    $('#pageNav2').text(arrLang[lang]['EmployeeDirectory']);


    //	$('#lblKeyword').text(arrLang[lang]['Keyword']);
    $('#btnSearch').text(arrLang[lang]['Search']);
	$('#searchBoxName').attr("placeholder", arrLang[lang]['EmployeeeName']+"/"+arrLang[lang]['Search']);
}
function searchClick() {
    try {
       $("#dvmodalAjaxLoader").fadeIn(300);　
       // $(document).ajaxStart(function () {
            // $(".dvmodalAjaxLoader").show();
        // });
        // $(document).ajaxComplete(function () {
            // $(".dvmodalAjaxLoader").hide();
        // });
	   _getListData();
		
		$("#dvmodalAjaxLoader").fadeOut(300);　

    } catch (error) {
        logException(error.message, "searchClick", "News");
    }
}
function _getListData() {
    $('.pagination').addClass("hiddenCellForce");
    var requestUrl = "";
    var siteUrl = 'https://tecq8.sharepoint.com/sites/intranetdev/';//_spPageContextInfo.siteAbsoluteUrl;
    //

    if (properties.webServerRelativeUrl != null) {
        if (properties.webServerRelativeUrl != "")
            siteUrl = escape(properties.webServerRelativeUrl);
    }
    debugger;
    var queryText = "", searchKeywordName = "", searchKeywordDepartment = "", searchKeywordJobTitle = "", searchKeywordEmail = "", searchKeywordPhone = "", searchKeywordBranch = "";
    var selectFields = "AccountName,Department,JobTitle,Path,PictureURL,PreferredName,FirstName,WorkEmail,WorkPhone,SPS-PhoneticDisplayName,OfficeNumber";

    if ($("#searchBoxName").val() != null && $("#searchBoxName").val() != undefined)
        searchKeywordName = $("#searchBoxName").val();
    //
    if (totalDeptsCount > 0) {
        if ($("#departmentsDDL").val() != null && $("#departmentsDDL").val() != undefined)
            searchKeywordDepartment = $("#departmentsDDL").val();
    }
    else {
        if ($("#searchBoxDepartment").val() != null && $("#searchBoxDepartment").val() != undefined)
            searchKeywordDepartment = $("#searchBoxDepartment").val();
    }
    //
    if ($("#searchBoxJobTitle").val() != null && $("#searchBoxJobTitle").val() != undefined)
        searchKeywordJobTitle = $("#searchBoxJobTitle").val();
    if ($("#searchBoxEmail").val() != null && $("#searchBoxEmail").val() != undefined)
        searchKeywordEmail = $("#searchBoxEmail").val();
    if ($("#searchBoxPhone").val() != null && $("#searchBoxPhone").val() != undefined)
        searchKeywordPhone = $("#searchBoxPhone").val();
    if ($("#branchesDDL").val() != null && $("#branchesDDL").val() != undefined)
        searchKeywordBranch = $("#branchesDDL").val();

    //
    var isFirstFilter = true;
    if (searchKeywordName != "") {
        if (isFirstFilter) {
            queryText = `(PreferredName:*` + searchKeywordName + `*)`;
        }
        else {
            queryText += `+AND+(PreferredName:*` + searchKeywordName + `*)`;
        }
        isFirstFilter = false;
    }
    //
    if (searchKeywordDepartment != "") {
        if (isFirstFilter) {
            if (searchKeywordDepartment != "All" || totalDeptsCount == 0) {
                queryText += `(Department:*` + encodeURIComponent(searchKeywordDepartment) + `*)`;
            }
            else {
                //queryText = `(Department:*-*)`;
                //Citral
                queryText += `(Department:a*+OR+Department:b*+OR+Department:c*+OR+Department:d*+OR+Department:e*+OR+Department:f*+OR+Department:g*+OR+Department:h*+OR+Department:i*+OR+Department:j*+OR+Department:k*+OR+Department:l*+OR+Department:m*+OR+Department:n*+OR+Department:o*+OR+Department:p*+OR+Department:q*+OR+Department:r*+OR+Department:s*+OR+Department:t*+OR+Department:u*+OR+Department:v*+OR+Department:w*+OR+Department:x*+OR+Department:y*+OR+Department:z*)`;

            }
        }
        else {
            if (searchKeywordDepartment != "All" || totalDeptsCount == 0) {
                queryText += `+AND+(Department:*` + encodeURIComponent(searchKeywordDepartment) + `*)`;
            }
            else {
                //Citral
                queryText += `+AND+(Department:a*+OR+Department:b*+OR+Department:c*+OR+Department:d*+OR+Department:e*+OR+Department:f*+OR+Department:g*+OR+Department:h*+OR+Department:i*+OR+Department:j*+OR+Department:k*+OR+Department:l*+OR+Department:m*+OR+Department:n*+OR+Department:o*+OR+Department:p*+OR+Department:q*+OR+Department:r*+OR+Department:s*+OR+Department:t*+OR+Department:u*+OR+Department:v*+OR+Department:w*+OR+Department:x*+OR+Department:y*+OR+Department:z*)`;

            }
        }
        isFirstFilter = false;
    }
    //
    if (searchKeywordJobTitle != "") {
        if (isFirstFilter) {
            queryText = `(JobTitle:*` + searchKeywordJobTitle + `*)`;
        }
        else {
            queryText += `+AND+(JobTitle:*` + searchKeywordJobTitle + `*)`;
        }
        isFirstFilter = false;
    }
    //
    if (searchKeywordEmail != "") {
        if (isFirstFilter) {
            queryText = `(WorkEmail:*` + searchKeywordEmail + `*)`;
        }
        else {
            queryText += `+AND+(WorkEmail:*` + searchKeywordEmail + `*)`;
        }
        isFirstFilter = false;
    }
    //
    if (searchKeywordPhone != "") {
        if (isFirstFilter) {
            queryText = `(WorkPhone:*` + searchKeywordPhone + `*)`;
        }
        else {
            queryText += `+AND+(WorkPhone:*` + searchKeywordPhone + `*)`;
        }
        isFirstFilter = false;
    }
    //
    if (searchKeywordBranch != "") {
        var branchesFilterList = searchKeywordBranch.split(';');
        var branchFilterQuery = "(";
        var branchIndex = 0;
        branchesFilterList.forEach((brancDomain) => {
            branchFilterQuery += `(WorkEmail:*` + brancDomain + `)`;
            branchIndex += 1;
            if (branchesFilterList.length > branchIndex) {
                branchFilterQuery += "+OR+";
            }
        });
        branchFilterQuery += ")";
        if (isFirstFilter) {
            queryText = branchFilterQuery;
        }
        else {
            queryText += "+AND+" + branchFilterQuery;
        }
        isFirstFilter = false;
    }
    //
    var restrictedDomainsQuery = "";
    if (properties.restrictedDomains != null) {
        if (properties.restrictedDomains != "") {
            restrictedDomainsQuery += "+AND+(";
            var domainNames = properties.restrictedDomains.split(';');
            var index = 0;
            domainNames.forEach((domainName) => {
                restrictedDomainsQuery += `(WorkEmail:*${domainName})`;
                index += 1;
                if (index < domainNames.length)
                    restrictedDomainsQuery += `+OR+`;
            });
            restrictedDomainsQuery += ")";
        }
    }
    //
    if (queryText == "") {
        queryText = restrictedDomainsQuery.substr(5);

    }
    else {
        queryText += restrictedDomainsQuery;
    }

    //
    if (queryText.startsWith("+AND+")) {
        queryText = queryText.substr(5);
    }
    //
    requestUrl = siteUrl + `/_api/search/query?querytext='` + queryText + `'&selectproperties='` + selectFields + `'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'&sortlist='firstname:ascending'&rowLimit=` + properties.itemsLimit;
    console.log(requestUrl);
    try {

        GetItemsFromTable(requestUrl, function (result) {
            //var data = Requests.value;
            var reqHTML = '';
            var istableEmpty = false;

            if (result["PrimaryQueryResult"] != null) {
                if (result["PrimaryQueryResult"]["RelevantResults"] != null) {
                    var rowCount = result["PrimaryQueryResult"]["RelevantResults"]["RowCount"];
                    var totalRows = result["PrimaryQueryResult"]["RelevantResults"]["TotalRows"];

                    var tableResult = result["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"];
                    //console.log(rowCount);
                    //console.log(totalRows);
                    console.log(tableResult);
                    $("#searchResultsCount").html(totalRows);

                    var employeeCards = "";
                    if (totalRows > 0) {
                        totalRequests = tableResult;
                        searchRequests = tableResult;
                        reqHTML = bindTable(tableResult, reqHTML);

                    }
                    else {
                        totalRequests = tableResult;
                        searchRequests = tableResult;
                        // reqHTML += '<div class="row m-0 mb-4 shadow-box emp-block"><div class="col-md-12"><h5>' + arrLang[lang]['NoDataFound'] + '</h5></div></div>'
                        reqHTML += '<div class="row m-0 mb-4 shadow-box emp-block"><div class="col-md-12"><h5></h5></div></div>'

                    }
                    $("#lblEmpDir").append(reqHTML);

                    var num_entries = $('#lblEmpDir div.emp-block').length;
                    // Create pagination element
                    $("#Pagination").pagination(num_entries, pagination_options);

                   
                }

            }
        });
    } catch (error) {
        logException(error.message, "loadRequest", "NewsPage");
    }
}

function bindTable(tableResult, reqHTML) {

    tableResult.forEach((item) => {
        var itemResult = item["Cells"];
        var userLoginName = "", userDisplayName = "", userArabicDisplayName = "", userDepartment = "", userJobTitle = "", userEmail = "", userPhone = "", userPictureUrl = "", userSiteUrl = "", userOffice = "";
        itemResult.forEach((itemCell) => {
            if (itemCell["Key"] == "AccountName") {
                if (itemCell["Value"] != null)
                    userLoginName = itemCell["Value"];
            }
            //
            if (itemCell["Key"] == "PreferredName") {
                if (itemCell["Value"] != null)
                    userDisplayName = itemCell["Value"];
            }
            //
            if (itemCell["Key"] == "SPS-PhoneticDisplayName") {
                if (itemCell["Value"] != null)
                    userArabicDisplayName = itemCell["Value"];
            }
            //
            else if (itemCell["Key"] == "Department") {
                if (itemCell["Value"] != null)
                    userDepartment = itemCell["Value"];
					console.log(userDepartment);
            }
            //
            else if (itemCell["Key"] == "JobTitle") {
                if (itemCell["Value"] != null)
                    userJobTitle = itemCell["Value"];
            }
            //
            else if (itemCell["Key"] == "WorkEmail") {
                if (itemCell["Value"] != null)
                    userEmail = itemCell["Value"];
            }
            //
            else if (itemCell["Key"] == "WorkPhone") {
                if (itemCell["Value"] != null)
                    userPhone = itemCell["Value"];
            }
            //
            else if (itemCell["Key"] == "PictureURL") {
                if (itemCell["Value"] != null)
                    //userPictureUrl = itemCell["Value"];
                    userPictureUrl = "/_vti_bin/DelveApi.ashx/people/profileimage?userId=" + userLoginName.substring(userLoginName.lastIndexOf('|') + 1) + "&size=L";
                else
                    userPictureUrl='';//'https://tecq8.sharepoint.com/sites/intranetdev/SiteAssets/PAS-Intranet/PASIntranet/HomePage/Outlook/UserDummyImage.jpg';
                    //userPictureUrl = _spPageContextInfo.siteAbsoluteUrl + "/SiteAssets/PAS-Intranet/PASIntranet/HomePage/Outlook/UserDummyImage.jpg";
            }
            //
            else if (itemCell["Key"] == "Path") {
                if (itemCell["Value"] != null)
                    userSiteUrl = itemCell["Value"];
            }
            //
            else if (itemCell["Key"] == "OfficeNumber") {
                if (itemCell["Value"] != null)
                    userOffice = itemCell["Value"];
            }
        });
        //
        if (properties.showArabicDirection != null) {
            if (properties.showArabicDirection == true) {
                if (userArabicDisplayName != "")
                    userDisplayName = userArabicDisplayName;
            }
        }
        //PAS
        reqHTML += 
            `<div class="img-cont ">
                <img src=`+ userPictureUrl +` /> </div>
                <div class="card-body">
                    <h3>`+userDisplayName+`</h3>
                    <ul class="d-flex list-item flex-50 list-item-blue">
                        <li> <i class="far fa-id-card"></i> <span>`+ userJobTitle +` </span></li>
                        <li> <i class="fas fa-phone-alt"></i> <span>` + userPhone + ` </span></li>
                        <li> <i class="fab fa-black-tie"></i><span>`+ userDepartment +` </span></li>
                    </ul>
                </div>
            <div>`;
    });

    return reqHTML;
}

var pagination_options = {
    num_edge_entries: 2,
    num_display_entries: 8,
    callback: pageselectCallback,
    items_per_page: 20
}

function pageselectCallback(page_index, jq) {
    var items_per_page = pagination_options.items_per_page;
    var offset = page_index * items_per_page;

    var filteredData = searchRequests;

    var reqHTML = '';
    $("#lblEmpDir").empty();
    var tableEmpty = false;
    if (filteredData.length > 0) {

        reqHTML = bindTable(filteredData, reqHTML);
        $('#lblEmpDir').empty().append(reqHTML);
        reqHTML = $('#lblEmpDir div.emp-block').slice(offset, offset + items_per_page).clone();

    }
    else {
        tableEmpty = true;
        reqHTML += '<div class="row m-0 mb-4 shadow-box emp-block"><div class="col-md-12"><h5>No Data Found !</h5></div></div>'
    }

    $("#lblEmpDir").empty().append(reqHTML);
    return false;
}

function loadDepartment() {
       
    getDepartments(500, 0);
}

function getDepartments(rowLimit, startRow, allResults) {

    totalDeptsCount = 0;
    var allResults = allResults || [];

    var url = commonSiteURl + "/_api/search/query?querytext='(Department:a*+OR+Department:b*+OR+Department:c*+OR+Department:d*+OR+Department:e*+OR+Department:f*+OR+Department:g*+OR+Department:h*+OR+Department:i*+OR+Department:j*+OR+Department:k*+OR+Department:l*+OR+Department:m*+OR+Department:n*+OR+Department:o*+OR+Department:p*+OR+Department:q*+OR+Department:r*+OR+Department:s*+OR+Department:t*+OR+Department:u*+OR+Department:v*+OR+Department:w*+OR+Department:x*+OR+Department:y*+OR+Department:z*)+AND+((WorkEmail:*tecq8.onmicrosoft.com))'&selectproperties='Department'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'&rowLimit=" + rowLimit + "&startrow=" + startRow;

    GetItemsFromTable(url, function (departments) {
        if (departments["PrimaryQueryResult"] != null) {
            if (departments["PrimaryQueryResult"]["RelevantResults"] != null) {
                var rowdeptCount = departments["PrimaryQueryResult"]["RelevantResults"]["RowCount"];
                var totaldeptRows = departments["PrimaryQueryResult"]["RelevantResults"]["TotalRows"];

                allResults = allResults.concat(departments["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"]);

                if (totaldeptRows > startRow + rowdeptCount) {
                    return getDepartments(rowLimit, startRow + rowdeptCount, allResults);
                }
                //return allResults;
                var dept = IsArabic?"<option value='All'>-- حدد القسم  --</option>":"<option value='All'>-- Select Department --</option>";
                if (allResults.length > 0) {
                    var arr = [];
                    allResults.forEach((item) => {
                        var itemResult = item["Cells"];
                        var userDepartment = "";
                        itemResult.forEach((itemCell) => {

                            if (itemCell["Key"] == "Department") {
                                if (itemCell["Value"] != null)
                                    userDepartment = itemCell["Value"];
                                arr.push(userDepartment);

                            }
                        });
                    });
                    var uniqueNames = getUnique(arr);
                    uniqueNames.sort();
                    for (i = 0; i < uniqueNames.length; i++) {

                        dept += '<option value="' + uniqueNames[i] + '">' + uniqueNames[i] + '</option>';
                        totalDeptsCount += 1;
                    }
                    $("#departmentsDDL").empty().append(dept);
                }
            }
        }
    });
}

function getUnique(array) {
    var uniqueArray = [];
    // Loop through array values
    for (var value of array) {
        if (uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value);
        }
    }
    return uniqueArray;
}
