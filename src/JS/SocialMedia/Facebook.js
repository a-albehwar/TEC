$(function () {
    GetFacebookAccessToken();
});
var htmlSocialMediaFB = '';
function GetFacebookAccessToken() {
    var tempAccessToken = "EAABp44YEd8UBADZCmUE4nqxVCsz5e1hZAtf6ChgUl2ZBx3aWwWCAcWp1ARV42iQGbZCYkrAi5UCqbwU5sJdsXksGeKg2TqKPYUBTUi8roUomRGak4CtMYWjvlUQuxZBkvs4NT4BvioUWcAkMZChtRG4p4oDd7ZAf7WAw6WTojNqX5jvFJuHGig60ocbGFJ6esLUxIEQ7LbtJpE0Xw2ArpaBmZC3xLyFbdAfAhDrPMkLyAxHocEaL183avpZAUfwZBu6zwZD";
    var url = "https://graph.facebook.com/oauth/access_token?client_id=116425926932421&client_secret=97b201dcdb15a95ad95a91ba6c8f06e4&grant_type=client_credentials&grant_type=fb_exchange_token&fb_exchange_token=" + tempAccessToken;
    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        //console.log(response);
        GetFacebookPagePicture(response.access_token);
    });
}
function GetFacebookPagePicture(accessToken) {
    var url = "https://graph.facebook.com/734484216601883/posts?fields=full_picture&limit=1&access_token=" + accessToken;
    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        //console.log(response);
        var profilePic = response.data[0].full_picture;
        GetFacebookPageData(accessToken, profilePic);
    });
}
function GetFacebookPageData(accessToken, profilePic) {
    var url = "https://graph.facebook.com/734484216601883/?fields=name,id,feed.limit(4)&access_token=" + accessToken;
    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        for (var i = 0; i < response.feed.data.length; i++) {
            if (response.feed.data[i].message !== undefined) {
				var myDate= new Date(response.feed.data[i].created_time);
                var dateFormate = myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear();
                var FBmsg = response.feed.data[i].message;
                var limitedMSG = FBmsg.length > 200 ? FBmsg.substring(1, 200) + "..." : FBmsg;
                htmlSocialMediaFB = htmlSocialMediaFB + '<div class="col-md-4">' +
                    '<img src="' + profilePic + '" class="img-fluid" style="max-height: 288px;" />' +
                    '<div class="row my-2 text-center">' +
                    '<div class="col-md-6"><b>' + response.name + '</b></div>' +
                    '<div class="col-md-6">' + dateFormate + '</div>' +
                    '</div>' +
                    '<p>' + limitedMSG + '</p>' +
                    '</div>';
            }
        }
        $("#dvHomeSocialMediaFB").html(htmlSocialMediaFB);
        //console.log(response);
    });
}