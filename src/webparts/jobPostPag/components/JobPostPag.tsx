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
 


export interface IJobPostPagState{    
        items?: any[];
        currentPage?: number;
        activePage?:number;
        itemCount?: number;
        status?: string;
        pageSize:number;
        totalcounts:number;
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
      pageSize:2,
      totalcounts:2
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
    const queryParam = `%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$select=ID,WorkType,ApplyLink,ExpireDate,Title,Department/ID,Department/Title&$expand=Department&$top=${this.props.pageSize}`;
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
    var weburl=this.props.weburl;
    
    return (
      
      <div>
        <div >
          <div><h1>We are Hiring</h1></div>
          <div><h4>Current opportunities</h4></div>
          <div >
            <div>
            {this.state.items.map(function(item,key){ 
              var momentObj = moment(item.ExpireDate);
              var formatExpDate=momentObj.format('DD-MM-YYYY');
             
              var joburl=weburl+"/Pages/TecPages/Jobs/JobDetails.aspx?jobid="+item.ID;
              //console.log(joburl);
              return (<div key={key} className={styles.row}> 
                <div ><a href={joburl}>
                          <u><span className={ styles.label }>{item.Title}</span></u>
                      </a>
                </div> 
                <div>Work Type - {item.WorkType}</div> 
                <div>Department - {item.Department.Title}</div> 
                <div>End Date - {formatExpDate}</div> 
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
<<<<<<< HEAD
            hideFirstPageJump={false} // Optional
            hideLastPageJump={false} // Optional
            limiterIcon={"Emoji12"} // Optional
=======
             // Optional GIT git 2 git 3 git 4 test
>>>>>>> master
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
    const queryParam = `?%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$select=ID,WorkType,ApplyLink,ExpireDate,Title,Department/ID,Department/Title&$expand=Department&$top=${this.state.pageSize}`;
    
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
