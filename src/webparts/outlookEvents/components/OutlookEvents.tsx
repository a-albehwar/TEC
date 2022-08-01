import * as React from 'react';
import styles from './OutlookEvents.module.scss';
import { IOutlookEventsProps } from './IOutlookEventsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IOutlookEventsState } from './IOutlookEventsState';
import { IEvent, IEventColl } from './IEvent';
import CalendarService from './CalendarService';
import { List } from 'office-ui-fabric-react/lib/List';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import * as moment from 'moment';
import { DisplayMode } from '@microsoft/sp-core-library';
//require('../../../JS/calendar.js');
export default class OutlookEvents extends React.Component<IOutlookEventsProps, IOutlookEventsState> {

  constructor(props: IOutlookEventsProps) {
    super(props);
    this.state = {
      outlookEvents: []
    };
  }

  public componentDidMount(): void {
    localStorage.setItem("myOutlook", "null");
    this._getEvents();
  }

  public render(): React.ReactElement<IOutlookEventsProps> {
    //const { events = [] } = this.state;
    return (

      <div className={styles.outlookEvents} style={{ display: 'none' }}>
        <h1>My Events:</h1>
        <ListView
          items={this.state.outlookEvents}
          compact={true}
          selectionMode={SelectionMode.none} />
      </div>

    );
    // return null;
  }

  public _getEvents = (): void => {
    CalendarService.getOutlookEvents().then(resOutlook => {
      debugger;
      resOutlook.map((item) => ({
        'Date': new Date(moment(item.start).year(), moment(item.start).month(), moment(item.start).date()),
        'Title': item.subject,
        //'Link':this.detailsPageURL+item.Id
      }));
      console.log("myOutlook: " + JSON.stringify(resOutlook));
      localStorage.setItem("myOutlook", JSON.stringify(resOutlook));
      this.setState({
        outlookEvents: resOutlook
      });
      location.reload();
    });
  }
  public setEventsCalendar() {
    try {
      const myOutlook = this.state.outlookEvents.map((item) => ({
        'Date': new Date(moment(item.start).year(), moment(item.start).month(), moment(item.start).date()),
        'Title': item.subject,
        //'Link':this.detailsPageURL+item.Id
      }));
      console.log("myOutlook: " + JSON.stringify(myOutlook));
      localStorage.setItem("myOutlook", JSON.stringify(this.state.outlookEvents));
    } catch (error) {
      console.log(error);
    }
  }
}

