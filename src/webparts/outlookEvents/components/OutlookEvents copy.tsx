// import * as React from 'react';
// import styles from './OutlookEvents.module.scss';
// import { IOutlookEventsProps } from './IOutlookEventsProps';
// import { escape } from '@microsoft/sp-lodash-subset';
// import { IOutlookEventsState } from './IOutlookEventsState';
// import { IEvent, IEventColl } from './IEvent';
// import CalendarService from './CalendarService';
// import { List } from 'office-ui-fabric-react/lib/List';
// import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
// import * as moment from 'moment';
// //require('../../../JS/calendar.js');
// export default class OutlookEvents extends React.Component<IOutlookEventsProps, IOutlookEventsState> {

//   constructor(props: IOutlookEventsProps) {
//     super(props);
//     this.state = {
//       outlookEvents: [],
//       myEvents: [],
//       publicHolidayEvents: [],
//       globalEvents: []
//     };
//   }

//   public componentDidMount(): void {
//     this._getEvents();


//   }

//   public render(): React.ReactElement<IOutlookEventsProps> {
//     //const { events = [] } = this.state;
//     return (

//       <><div className={styles.outlookEvents}>
//         <h1>My Events:</h1>
//         <ListView
//           items={this.state.outlookEvents}
//           compact={true}
//           selectionMode={SelectionMode.none} />
//       </div>
//         <div className="row m-0">
//           <div className=" events-sec" id="dvEventSectionWP">
//             <div className="events hs">
//               <div className="row m-0">
//                 <div className="col-lg-6" id="dvHomeCalendarTop">
//                   <div className="event-cont ">
//                     <h1 className="d-flex">
//                       <label id="spnHomePageSecEventsHeading">Calendar</label>
//                       <button className="red-btn-effect shadow-sm popup-btn ml-auto textPopup">
//                         <span id="spnHomePageSecViewAllEvents">All Events</span>
//                       </button>
//                     </h1>

//                   </div>
//                   <div id="dvHomeCalendar"></div>
//                   <div className="row">
//                     <div className="col-12 cal-legends">
//                       <p className="ph"><span></span> <label id="pDotPublicH">Public Holiday</label></p>
//                       <p className="uc"><span></span> <label id="pDotUpcomingE">Upcoming Event</label></p>
//                       <p className="gc"><span></span> <label id="pDotUpcomingE">Global Event</label></p>
//                     </div>
//                   </div>
//                 </div>
//                 {/* <div className="col-lg-6" id="dvHomeUpcomingEventsTop" style="display:none;">
//                   <h4 className="themered" id="hUpcomingEventsTitle">UPComing Events</h4>
//                   <div id="dvHomeUpcomingEvents" className="w-100">
//                   </div>
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         </div></>
//     );
//   }

//   public _getEvents = (): void => {
//   //  CalendarService.getOutlookEvents().then(resOutlook => {
//       CalendarService.getMyEvents(new Date()).then(resMyEvents => {
//         CalendarService.getPublicHolidays(new Date()).then(resPublicHolidays => {
//           CalendarService.getGlobalEvents(new Date()).then(resGlobalEvents => {
//             this.setState({
//               // outlookEvents: resOutlook,
//               myEvents: resMyEvents,
//               publicHolidayEvents: resPublicHolidays,
//               globalEvents: resGlobalEvents
//             }, () => this.setEventsCalendar());

//           });
//         });
//       });
//   //  });
//   }
//   public setEventsCalendar() {
//     try {
//       var events = this.state.outlookEvents.map((item) => ({
//         'Date': new Date(moment(item.start).year(), moment(item.start).month(), moment(item.start).date()),
//         'Title': item.subject,
//         //'Link':this.detailsPageURL+item.Id
//       }));
//       var events = this.state.myEvents.map((item) => ({
//         'Date': new Date(moment(item.start).year(), moment(item.start).month(), moment(item.start).date()),
//         'Title': item.subject,
//         //'Link':this.detailsPageURL+item.Id
//       }));
//       var publicHoliday = this.state.publicHolidayEvents.map((item) => ({
//         'Date': new Date(moment(item.start).year(), moment(item.start).month(), moment(item.start).date()),
//         'Title': item.subject,
//         //'Link':this.detailsPageURL+item.Id
//       }));
//       var globalEvents = this.state.globalEvents.map((item) => ({
//         'Date': new Date(moment(item.start).year(), moment(item.start).month(), moment(item.start).date()),
//         'Title': item.subject,
//         //'Link':this.detailsPageURL+item.Id
//       }));
//       var settings = {

//       };

//       var element = document.getElementById('dvHomeCalendar');
//       window["MyCaleandar"](element, events, settings, publicHoliday, globalEvents);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

