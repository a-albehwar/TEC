import { MSGraphClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp, Web, IWeb } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IEvent, IEventColl } from "./IEvent";
import * as moment from "moment";

export class CalendarService {
    public context: WebPartContext;

    public setup(context: WebPartContext): void {
        this.context = context;
    }

    public getOutlookEvents(): Promise<IEvent[]> {
        return new Promise<IEvent[]>((resolve, reject) => {
            try {
                // Prepare the output array    
                var events: Array<IEvent> = new Array<IEvent>();

                this.context.msGraphClientFactory
                    .getClient()
                    .then((client: MSGraphClient) => {
                        client
                            .api("/me/events")
                            .select('subject,organizer,start,end')
                            .get((error: any, eventColl: IEventColl, rawResponse: any) => {
                                // Map the response to the output array    
                                eventColl.value.map((item: any) => {
                                    events.push({
                                        subject: item.subject,
                                        start: item.start.dateTime,
                                        end: item.end.dateTime,
                                        eventType: "OutlookEvents"
                                    });
                                });
                                resolve(events);
                            });
                    });
            } catch (error) {
                console.error(error);
            }
        });
    }
    public getMyEvents(currentmonth): Promise<IEvent[]> {
        return new Promise<IEvent[]>((resolve, reject) => {
            try {
                // Prepare the output array    
                var events: Array<IEvent> = new Array<IEvent>();

                var myObj = [];
                var FullYear = currentmonth.getFullYear();
                var Month = currentmonth.getMonth() + 1;
                var firstDay = new Date(FullYear, Month, 1).getDate();
                var lastDay = new Date(FullYear, Month + 1, 0).getDate() - 1;

                var _startDate = FullYear + "-" + Month + "-" + firstDay + "T00:00:00";
                var _endDate = FullYear + "-" + Month + "-" + lastDay + "T23:59:58";
                //  filter += "&$orderby=StartDate desc&$Top=100";

                let web = Web(this.context.pageContext.site.absoluteUrl);
                web.lists.getByTitle("CalendarEvents").items
                    .select('ID,Title,TitleAr,EventDate,Description,Description,DescriptionAr,EventLocation,EventTime,Modified,IsActive')
                    .filter(`IsActive eq 1 and EventDate ge datetime'${_startDate}' and EventDate le datetime'${_endDate}'`)
                    .orderBy('EventDate', false)
                    .top(100)
                    .get()
                    .then((eventColl) => {
                        // Map the response to the output array    
                        eventColl.map((item: any) => {
                            events.push({
                                subject: item.Title,
                                start: item.StartDate,
                                end: item.EndDate,
                                eventType: "MyEvents"
                            });
                        });
                        resolve(events);
                    });

            } catch (error) {
                console.error(error);
            }
        });
    }
    public getPublicHolidays(currentmonth): Promise<IEvent[]> {
        return new Promise<IEvent[]>((resolve, reject) => {
            try {
                // Prepare the output array    
                var events: Array<IEvent> = new Array<IEvent>();

                var myObj = [];
                var FullYear = currentmonth.getFullYear();
                var Month = currentmonth.getMonth() + 1;
                var firstDay = new Date(FullYear, Month, 1).getDate();
                if (Month == 2) {
                    var lastDay = new Date(FullYear, Month, 0).getDate();
                }
                else {
                    var lastDay = new Date(FullYear, Month + 1, 0).getDate() - 1;
                }

                var _startDate = FullYear + "-" + Month + "-" + firstDay + "T00:00:00";
                var _endDate = FullYear + "-" + Month + "-" + lastDay + "T23:59:58";
                //  filter += "&$orderby=StartDate desc&$Top=100";

                let web = Web(this.context.pageContext.site.absoluteUrl);
                web.lists.getByTitle("PublicHolidays").items
                    .select('ID,Title,TitleAr,StartDate,EndDate')
                    .filter(`StartDate ge datetime'${_startDate}' and EndDate le datetime'${_endDate}'`)
                    .orderBy('StartDate', false)
                    .top(100)
                    .get()
                    .then((eventColl) => {
                        if (eventColl.length > 0) {
                            var holidayList = [];
                            for (var i = 0; i < eventColl.length; i++) {
                                var ID = eventColl[i].Id;
                                var Title = eventColl[i].Title;
                                var StartDate = eventColl[i].StartDate;
                                var EndDate = eventColl[i].EndDate;

                                var viewUrl = "javascript:;";
                                // if (_spPageContextInfo.currentCultureLCID.toString() != "1033") {
                                //     Title = eventColl[i].TitleAr;
                                // }
                                var holiday = this.getAllDatesBetweentwoDates(StartDate, EndDate, Title);
                                holidayList.push(...holiday);

                            }
                            // for (i = 0; i < holidayList.length; i++) {
                            //     myObj.push({
                            //         title: holidayList[i].title,
                            //         publicHoliday: holidayList[i].publicHoliday,
                            //         date: new Date(holidayList[i].publicHoliday).getDate(),
                            //         month: new Date(holidayList[i].publicHoliday).getMonth(),
                            //         year: new Date(holidayList[i].publicHoliday).getFullYear()
                            //     });
                            // }
                            holidayList.map((item: any) => {
                                events.push({
                                    subject: item.title,
                                    start: item.publicHoliday,
                                    end: '',
                                    eventType: "PublicHolidays"
                                });
                            });
                        }
                        // Map the response to the output array    

                        resolve(events);
                    });

            } catch (error) {
                console.error(error);
            }
        });
    }
    public getGlobalEvents(currentmonth): Promise<IEvent[]> {
        return new Promise<IEvent[]>((resolve, reject) => {
            try {
                // Prepare the output array    
                var events: Array<IEvent> = new Array<IEvent>();

                var myObj = [];
                var FullYear = currentmonth.getFullYear();
                var Month = currentmonth.getMonth() + 1;
                var firstDay = new Date(FullYear, Month, 1).getDate();
                if (Month == 2) {
                    var lastDay = new Date(FullYear, Month, 0).getDate();
                }
                else {
                    var lastDay = new Date(FullYear, Month + 1, 0).getDate() - 1;
                }

                var _startDate = FullYear + "-" + Month + "-" + firstDay + "T00:00:00";
                var _endDate = FullYear + "-" + Month + "-" + lastDay + "T23:59:58";
                //  filter += "&$orderby=StartDate desc&$Top=100";

                let web = Web(this.context.pageContext.site.absoluteUrl);
                web.lists.getByTitle("GlobalEvents").items
                    .select('ID,Title,TitleAr,StartDate,EndDate')
                    .filter(`StartDate ge datetime'${_startDate}' and EndDate le datetime'${_endDate}'`)
                    .orderBy('StartDate', false)
                    .top(100)
                    .get()
                    .then((eventColl) => {
                        // Map the response to the output array    
                        if (eventColl.length > 0) {
                            var holidayList = [];
                            for (var i = 0; i < eventColl.length; i++) {
                                var ID = eventColl[i].Id;
                                var Title = eventColl[i].Title;
                                var StartDate = eventColl[i].StartDate;
                                var EndDate = eventColl[i].EndDate;

                                var viewUrl = "javascript:;";
                                // if (_spPageContextInfo.currentCultureLCID.toString() != "1033") {
                                //     Title = eventColl[i].TitleAr;
                                // }
                                var holiday = this.getAllDatesBetweentwoDates(StartDate, EndDate, Title);
                                holidayList.push(...holiday);

                            }
                            holidayList.map((item: any) => {
                                events.push({
                                    subject: item.title,
                                    start: item.publicHoliday,
                                    end: '',
                                    eventType: "GlobalEvents"
                                });
                            });
                        }

                        resolve(events);
                    });

            } catch (error) {
                console.error(error);
            }
        });
    }

    getAllDatesBetweentwoDates(startDate, _stopDate, title) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(_stopDate);
        while (currentDate <= stopDate) {
            dateArray.push({ publicHoliday: moment(currentDate).format('YYYY-MM-DD'), title: title });
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    };
}

const calendarService = new CalendarService();
export default calendarService;  