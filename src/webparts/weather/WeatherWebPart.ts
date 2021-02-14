import 'jquery';
import 'jqueryui';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './WeatherWebPart.module.scss';
import * as strings from 'WeatherWebPartStrings';

export interface IWeatherWebPartProps {
  description: string;
}

export default class WeatherWebPart extends BaseClientSideWebPart<IWeatherWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons-wind.min.css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.css" />
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script> 
 
    <div class="row" style="width:200px;" onload="initialize()">
    <div class="col-sm-4 col-xs-4" style="background: #41bb41;height: 45px;text-align: center;">
        <span id="wxIcon1"></span>
    </div>
    <div class="col-sm-8 col-xs-8" style="height: 45px;text-align: center;">
        <span id="wxTemp1" style="font-size: 11px;font-weight:700;"></span>
    </div>
    </div>

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>

    <script type="text/javascript">
        $(function () {

            var loc1 = 'Kuwait, Kuwait'; // Singapore
            var u = 'c';
            var query1 = "SELECT * FROM weather.forecast WHERE woeid in (select woeid from geo.places(1) where text='" + loc1 + "') AND u='" + u + "'";
            var cacheBuster = Math.floor((new Date().getTime()) / 3600 / 1000);

            var url1 = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query1) + '&format=json&_nocache=' + cacheBuster;

            window['wxCallback1'] = function (data) {
                var info = data.query.results.channel;
                $('#wxIcon1').append('<i class="' + WeatherIcon(info.item.condition.code) + '" aria-hidden="true"></i>');
                $('#wxTemp1').html(info.item.forecast[0].low + '&deg;' + (u.toUpperCase()) + ' MINIMUM <br> ' + info.item.forecast[0].high + '&deg;' + (u.toUpperCase()) + ' MAXIMUM');
                //$('#wxHum1').html(info.atmosphere.humidity + '<font style="FONT-WEIGHT:normal; FONT-SIZE:12px">%</font>');
                // $('#wxIcon2').append('<img src="http://l.yimg.com/a/i/us/we/52/' + info.code + '.gif" width="34" height="34" title="' + info.text + '" />');
            };
            $.ajax({
                url: url1,
                dataType: 'jsonp',
                cache: true,
                jsonpCallback: 'wxCallback1'
            });

        });

        function WeatherIcon(d) {
            let icon = "";

            switch (Math.floor(d)) {
                case 0: icon = 'wi wi-tornado'; break;
                case 1: case 3: case 4: icon = 'wi wi-thunderstorm'; break;
                case 2: icon = 'wi wi-hurricane'; break;
                case 5: icon = 'wi wi-rain-mix'; break;
                case 6: case 7: icon = 'wi wi-sleet'; break;
                case 8: case 9: icon = 'wi wi-raindrops'; break;
                case 10: icon = 'wi wi-sprinkle'; break;
                case 11: case 12: icon = 'wi wi-showers'; break;
                case 13: case 14: icon = 'wi wi-snowflake-cold'; break;
                case 15: case 16: icon = 'wi wi-snow-wind'; break;
                case 17: icon = 'wi wi-hail'; break;
                case 18: icon = 'wi wi-sleet'; break;
                case 19: icon = 'wi wi-dust'; break;
                case 20: icon = 'wi wi-fog'; break;
                case 21: icon = 'wi wi-day-haze'; break;
                case 22: icon = 'wi wi-smog'; break;
                case 23: icon = 'wi wi-strong-wind'; break;
                case 24: icon = 'wi wi-windy'; break;
                case 25: icon = 'wi wi-thermometer-exterior'; break;
                case 26: case 27: case 28: case 29: case 30: icon = 'wi wi-cloudy'; break;
                case 31: case 33: icon = 'wi wi-night-clear'; break;
                case 32: case 34: icon = 'wi wi-day-sunny'; break;
                case 35: icon = 'wi wi-hail'; break;
                case 36: icon = 'wi wi-hot'; break;
                case 37: case 38: case 39: icon = 'wi wi-thunderstorm'; break;
                case 40: icon = 'wi wi-showers'; break;
                case 41: case 42: case 43: icon = 'wi wi-snow'; break;
                case 44: icon = 'wi wi-cloudy'; break;

                default: icon = 'wi wi-na';
            }
            return icon;
        }

       

    </script>
    `;
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

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
