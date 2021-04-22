import * as React from 'react';
import styles from './JobPostPag.module.scss';
import { IJobPostPagProps } from './IJobPostPagProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import { sp } from "@pnp/sp";  
import * as moment from 'moment';

//require("bootstrap/less/bootstrap.less");
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";

import * as jquery from 'jquery';
import { Item, Items } from '@pnp/sp/items';
 
declare var arrLang: any;
declare var lang: any;

export interface IJobPostPagState{    
        items?: any[];
        currentPage?: number;
        activePage?:number;
        itemCount?: number;
        status?: string;
        pageSize:number;
        totalcounts:number;
        totalPages:number;
} 

export default class JobPostPag extends React.Component<IJobPostPagProps,IJobPostPagState> {
  private _getPage(page: number){
    //console.log('Page:', page);
    this.setState({
      currentPage: page,
      totalcounts:Math.round(this.state.itemCount%this.state.pageSize)
    });
    this._onPageUpdate(page);
  }
 public constructor(props: IJobPostPagProps,state: IJobPostPagState){    
    super(props);    
    this.state ={    
      items:[],
      currentPage:1,
      pageSize:10,
      totalcounts:2,
      totalPages:0,
    };  
    //this._onPageUpdate = this._onPageUpdate.bind(this);
    this.getListItemsCount(`${this.props.siteurl}/_api/web/lists/GetByTitle('JobPosting')/ItemCount`);
    const queryParam = this.buildQueryParams(props);
   
    this.readItems(`${this.props.siteurl}/_api/web/lists/GetByTitle('JobPosting')/items${queryParam}`);
  } 

  private _onPageUpdate(pageNumber: number) {
    //this.readItems()
    this.setState({
      currentPage: pageNumber,
    });
    const p_ID = (pageNumber - 1)*this.props.pageSize;
    
   //?$select=ID,WorkType,ApplyLink,ExpireDate,Title,LK_Departments/ID,LK_Departments/Title&$expand=LK_Departments
    const queryParam = `%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$select=Title_Ar,Location_Ar,WorkType_Ar,ID,WorkType,Location,ApplyLink,ExpireDate,Title,Department/ID,Department/Title&$expand=Department&$top=${this.props.pageSize}`;
    var url = `${this.props.siteurl}/_api/web/lists/GetByTitle('JobPosting')/items?`+ queryParam;
    this.readItems(url);    
  }

  public componentWillReceiveProps(nextProps: IJobPostPagProps): void{   
    
    this.setState({

      pageSize: nextProps.pageSize
    });
    this.getListItemsCount(`${this.props.siteurl}/_api/web/lists/GetByTitle('JobPosting')/ItemCount`);
      //const selectColumns = nextProps.selectedColumns === null || nextProps.selectedColumns===undefined || nextProps.selectedColumns.length === 0? "" : '?$select='+nextProps.selectedColumns.join();
    const queryParam = this.buildQueryParams(nextProps);
    this.readItems(`${this.props.siteurl}/_api/web/lists/GetByTitle('JobPosting')/items${queryParam}`);
  }

  public render(): React.ReactElement<IJobPostPagProps> {
    var weburl=this.props.weburl;
    var siteurl=this.props.siteurl;
    var langcode=this.props.pagecultureId;
    lang=langcode=="en-US"?"en":"ar";
    
    return (
      
      <section className="inner-page-cont">
           
         <div className="Inner-page-title">
            <h2 className="page-heading">Gird Page</h2>
            
         </div>

         <div className="col-md-8 mx-auto col-12 jobpost">
            <div className="row">
              <div className="col-12 my-4">
               <h2 id="h2_curOpp">{arrLang[lang]['Jobs']['CurrOppur']}</h2>
			        </div>
              <div id="job_item_row" className="w-100">
            {this.state.items.map(function(item,key){ 
              var momentObj = moment(item.ExpireDate);
              var formatExpDate=momentObj.format('DD-MM-YYYY');
              var joburl=weburl+"/Pages/TecPages/Jobs/JobDetails.aspx?jobid="+item.ID;
              var imgurl=siteurl+"/Style%20Library/TEC/images/man.svg";
              var applnk=item.ApplyLink.Url;

              var jobtitle=langcode=="en-US"?item.Title:item.Title_Ar;
              var worktype=langcode=="en-US"?item.WorkType:item.WorkType_Ar;
              var loc=langcode=="en-US"?item.Location:item.Location_Ar;
              return (
                <div className="job-item ">
                    <div>
                      
                    </div>
                    <div className="company-logo">
                        <img src={imgurl} alt="logo"></img>
                    </div>
                    <div className="media-body align-self-center">
                      <h4><a href={joburl}>{jobtitle}</a></h4>
                      <div className="job-ad-item">
                        <ul>
                            <li><i className="fas fa-map-marker-alt"></i>{loc}</li>
                            <li><i className="far fa-clock"></i>{worktype}</li>
                            <li><i className="fas fa-briefcase"></i>  {item.Department.Title}</li>
                            <li><i className="fas fa-hourglass-end"></i> {arrLang[lang]['Jobs']['EndDate']}: {formatExpDate}</li>
                        </ul>
                      </div>
                     {/*  <div className="div-right">
                        <a href={applnk} className="apply-button">{arrLang[lang]['Jobs']['ApplyNow']}</a>
                      </div> */}
                    </div>
                  </div>
              ); 
            })} 
            <Pagination
            //totalItems={ this.state.itemCount }
            //itemsCountPerPage={ this.state.pageSize } 
            //onPageUpdate={ this._onPageUpdate } 
            currentPage={ this.state.currentPage }

            totalPages={this.state.totalPages}  
            onChange={(page) => this._getPage(page)}
            limiter={3} // Optional - default value 3
            hideFirstPageJump={false} // Optional
            hideLastPageJump={false} // Optional
            limiterIcon={"Emoji12"} // Optional
            />
            </div>
            </div>
         </div>
          
         </section>
    );
  }
  private getListItemsCount(url: string) {
    this.props.spHttpClient.get(url,SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'odata-version':''
      }
    }).then((response: SPHttpClientResponse): Promise<{value: number}> =>{
      return response.json();
    }).then((response: {value: number}): void => {
      this.setState({
        itemCount: response.value,
        totalPages: Math.ceil(response.value/this.state.pageSize)
      });
    });
  }

  private buildQueryParams(props: IJobPostPagProps): string{
    const p_ID = (this.state.currentPage - 1)*this.state.pageSize;
    const queryParam = `?%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$select=Title_Ar,Location_Ar,WorkType_Ar,ID,WorkType,Location,ApplyLink,ExpireDate,Title,Department/ID,Department/Title&$expand=Department&$top=${this.state.pageSize}`;
    
    return queryParam;
  }

  private readItems(url: string) {
    this.setState({
      items: [],
      totalcounts:Math.round(this.state.itemCount%this.state.pageSize),
      status: 'Loading all items...'
    });
    
    this.props.spHttpClient.get(url,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'odata-version': ''
      }
    }).then((response: SPHttpClientResponse): Promise<{value: any[]}> =>{
    return response.json();
    }).then((response: {value: any[]}): void => {     
      //this.props.Status(`${response.d.__next}`);
      //this.props.siteUrl = response['odata.nextLink'];
      this.setState({
        items: response.value,
   
        //columns: _buildColumns(response.value),
        status: `Showing items ${(this.state.currentPage - 1)*this.state.pageSize +1} - ${(this.state.currentPage -1) * this.state.pageSize + response.value.length} of ${this.state.itemCount}`
        
      });    
    }, (error: any): void => {
      this.setState({
        items: [],
        status: 'Loading all items failed with error: ' + error
      });
    });
    
  }
}
