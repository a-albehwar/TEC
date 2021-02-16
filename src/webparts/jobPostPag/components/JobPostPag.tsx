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
import { Item } from '@pnp/sp/items';
 


export interface IJobPostPagState{    
        items?: any[];
        currentPage?: number;
        activePage?:number;
        itemCount?: number;
        status?: string;
        pageSize:number;
} 

export default class JobPostPag extends React.Component<IJobPostPagProps,IJobPostPagState> {
  private _getPage(page: number){
    console.log('Page:', page);
    this.setState({currentPage: page});
    this._onPageUpdate(page);
  }
 public constructor(props: IJobPostPagProps,state: IJobPostPagState){    
    super(props);    
    this.state ={    
      items:[],
      currentPage:1,
      pageSize:2
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
   
    const queryParam = `%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$top=${this.props.pageSize}`;
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

  //getListItemsCount(`${this.props.siteUrl}/_api/web/lists/GetByTitle('JobPosting')/ItemCount`);
  
 
  /*public getJobDetails = () =>{    
    sp.site.rootWeb.lists.getByTitle("JobPosting").items.getAll().    
    then((results : any[])=>{    
        console.log(results.length);
        this.setState({    
          employeeList:results    
        });    
      
    });    
  } 
  */

 /* public componentDidMount(){    
   // this.getJobDetails();    
   var reactHandler = this;    
   jquery.ajax({    
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('JobPosting')/items`,    
        type: "GET",    
        headers:{'Accept': 'application/json; odata=verbose;'},    
        success: function(resultData) {             
          reactHandler.setState({    
            items: resultData.d.results 
          });    
        },    
        error : function(jqXHR, textStatus, errorThrown) { 
          console.log('Error Occurred !');    
        }    
    });    
  }  
*/


  public render(): React.ReactElement<IJobPostPagProps> {
    return (
      
      <div className={ styles.jobPostPag }>
        <div className={ styles.container }>
          <div><h1></h1></div>
          <div><h1></h1></div>
          <div className={ styles.row }>
            <div>
            {this.state.items.map(function(item,key){ 
              var momentObj = moment(item.ExpireDate);
              var formatExpDate=momentObj.format('DD-MM-YYYY');
              var joburl="/Pages/TecPages/Tec 2.0/JobDetails.aspx?jobid="+item.ID;
              console.log(joburl);
              return (<div key={key}> 
                <div ><a href={joburl}>
                          <span className={ styles.label }>{item.Title}</span>
                      </a>
                </div> 
                <div>{item.WorkType}</div> 
                <div>{item.DepartmentId}</div> 
                <div>{formatExpDate}</div> 
                <div><a href={item.ApplyLink.Url}>
                          <span className={ styles.label }>Apply</span>
                      </a>
                </div>
              </div>
              ); 
            })} 
            <Pagination
            //totalItems={ this.state.itemCount }
            //itemsCountPerPage={ this.state.pageSize } 
            //onPageUpdate={ this._onPageUpdate } 
            currentPage={ this.state.currentPage }

            totalPages={2} 
            onChange={(page) => this._getPage(page)}
            limiter={3} // Optional - default value 3
            hideFirstPageJump={false} // Optional
            hideLastPageJump={false} // Optional
            limiterIcon={"Emoji12"} // Optional
            />
            </div>
          </div>
        </div>
      </div>
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
        itemCount: response.value
      });
    });
  }

  private buildQueryParams(props: IJobPostPagProps): string{
    const p_ID = (this.state.currentPage - 1)*this.state.pageSize;
    const queryParam = `?%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$top=${this.state.pageSize}`;
    
    return queryParam;
  }

  private readItems(url: string) {
    this.setState({
      items: [],
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
