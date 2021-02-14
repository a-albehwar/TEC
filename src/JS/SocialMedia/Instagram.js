$(function () {
    GetMediaID();
});
var htmlSocialMediaIG = '';
function GetMediaID() {
    var settings = {
        "url": "https://graph.instagram.com/me?fields=id,username,media&access_token=IGQVJVRnNjdV9PTUFMOUl2SW55OUJhVE84VFFxREhhOWM2VFhVbUE2cjhZARFB5ODZADSGFwUV9WeXI0UnotX0dDOTNTRDdjcHUwUHkyV3hrOG5oM1M3amJ3QlBiQ1F6SGZAOa3NBZAXhINzN5ZAmw4ckJ5ZAAZDZD",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        for (var i = 0; i < 3; i++) {
            GetMediaURL(response.media.data[i].id);
        }
        $("#dvHomeSocialMediaIG").html(htmlSocialMediaIG);
    });
}
function GetMediaURL(id) {
    var settings = {
        "url": "https://graph.instagram.com/" + id + "?fields=id,media_type,media_url,username,timestamp&access_token=IGQVJVRnNjdV9PTUFMOUl2SW55OUJhVE84VFFxREhhOWM2VFhVbUE2cjhZARFB5ODZADSGFwUV9WeXI0UnotX0dDOTNTRDdjcHUwUHkyV3hrOG5oM1M3amJ3QlBiQ1F6SGZAOa3NBZAXhINzN5ZAmw4ckJ5ZAAZDZD",
        "method": "GET",
        "timeout": 0,
        "async": false,
    };
    $.ajax(settings).done(function (response) {
        htmlSocialMediaIG = htmlSocialMediaIG + '<div class="col-md-4">' +
            '<img src="' + response.media_url + '" class="img-fluid" style="max-height: 288px;" />' +
            '</div>';
    });
}

function SocialMediaTabbing(strThis, divID) {
    $(".btnHomeSocialMedia").removeClass("active");
    $(".clsHomeSocialMedia").hide();
    var button = $(strThis);
    var divTab = $("#" + divID);
    button.addClass("active");
    divTab.show();
}