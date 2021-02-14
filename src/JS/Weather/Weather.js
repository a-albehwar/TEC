var geocoder = new google.maps.Geocoder();;

function initialize() {
    geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
}
//Get the latitude and the longitude;
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    GetMyCurrentLocationWeather(lat, lng)
}

function errorFunction() {
    //alert("Geocoder failed");
    console.log("Geocoder failed");
}

function codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results)
            if (results[1]) {
                //formatted address
                alert(results[0].formatted_address)
                //find country name
                for (var i = 0; i < results[0].address_components.length; i++) {
                    for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                        //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                        if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                            //this is the object you are looking for
                            city = results[0].address_components[i];
                            break;
                        }
                    }
                }
                //city data
                alert(city.short_name + " " + city.long_name)


            } else {
                alert("No results found");
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });
}

/********************************************************************************************************/
$(function () {
    initialize();
});

function GetMyCurrentLocationWeather(lat, lng) {
    var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
    var method = 'GET';
    var app_id = 'AT6fISKY';
    var consumer_key = 'dj0yJmk9azAzUnpnc0hGbEZvJmQ9WVdrOVFWUTJaa2xUUzFrbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTRk';
    var consumer_secret = 'aa330e25d28123189a6ae3317d3abc35627cd501';
    var concat = '&';
    var query = { 'lat': lat, 'lon': lng, 'format': 'json', 'u':'c' };
    var oauth = {
        'oauth_consumer_key': consumer_key,
        'oauth_nonce': Math.random().toString(36).substring(2),
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
        'oauth_version': '1.0'
    };

    var merged = {};
    $.extend(merged, query, oauth);
    // Note the sorting here is required
    var merged_arr = Object.keys(merged).sort().map(function (k) {
        return [k + '=' + encodeURIComponent(merged[k])];
    });
    var signature_base_str = method
        + concat + encodeURIComponent(url)
        + concat + encodeURIComponent(merged_arr.join(concat));

    var composite_key = encodeURIComponent(consumer_secret) + concat;
    var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
    var signature = hash.toString(CryptoJS.enc.Base64);

    oauth['oauth_signature'] = signature;
    var auth_header = 'OAuth ' + Object.keys(oauth).map(function (k) {
        return [k + '="' + oauth[k] + '"'];
    }).join(',');

    $.ajax({
        url: url + '?' + $.param(query),
        headers: {
            'Authorization': auth_header,
            'X-Yahoo-App-Id': app_id
        },
        method: 'GET',
        success: function (data) {
            var weatherHTMLMin = '<h3>' + data.forecasts[0].low + '<sup>o</sup> C</h3><p>'+arrLang[lang]['Minimum']+'</p>';
            var weatherHTMLMax = '<h3>' + data.forecasts[0].high + '<sup>o</sup> C</h3><p>'+arrLang[lang]['Maximum']+'</p>';
            $('#dvMinTemperature').html(weatherHTMLMin);
            $('#dvMaxTemperature').html(weatherHTMLMax);
        }
    });
}