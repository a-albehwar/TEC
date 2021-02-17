import * as React from 'react';
import styles from './NewEmployee.module.scss';
import { INewEmployeeProps } from './INewEmployeeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";


import { sp } from "@pnp/sp";  
import * as moment from 'moment';

//require("bootstrap/less/bootstrap.less");
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";

import * as jquery from 'jquery';
import { Item, Items } from '@pnp/sp/items';

export interface INewEmployeeState{    
  items?: any[];
  currentPage?: number;
  activePage?:number;
  itemCount?: number;
  status?: string;
  pageSize:number;
  totalcounts:number;
} 



export default class NewEmployee extends React.Component<INewEmployeeProps, INewEmployeeState> {
  private _getPage(page: number){
    //console.log('Page:', page);
    this.setState({
      currentPage: page,
      totalcounts:Math.round(this.state.itemCount%this.state.pageSize)
    });
    this._onPageUpdate(page);
  }
  public constructor(props: INewEmployeeProps,state: INewEmployeeState){    
    super(props);    
    this.state ={    
      items:[],
      currentPage:1,
      pageSize:2,
      totalcounts:2
    };
    this.getListItemsCount(`${this.props.siteurl}/_api/web/lists/GetByTitle('NewEmployees')/ItemCount`);
    const queryParam = this.buildQueryParams(props);
   
    this.readItems(`${this.props.siteurl}/_api/web/lists/GetByTitle('NewEmployees')/items${queryParam}`);
  }

  private _onPageUpdate(pageNumber: number) {
    //this.readItems()
    this.setState({
      currentPage: pageNumber,
    });
    const p_ID = (pageNumber - 1)*this.props.pageSize;
    
   //?$select=ID,WorkType,ApplyLink,ExpireDate,Title,LK_Departments/ID,LK_Departments/Title&$expand=LK_Departments
    const queryParam = `%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$select=ID,Title,Phone,EmpImage,Mail,AboutEmp,Created&$top=${this.state.pageSize}`;
    var url = `${this.props.siteurl}/_api/web/lists/GetByTitle('NewEmployees')/items?`+ queryParam;
    this.readItems(url);    
  }

  public componentWillReceiveProps(nextProps: INewEmployeeProps): void{   
    
    this.setState({

      pageSize: nextProps.pageSize
    });
    this.getListItemsCount(`${this.props.siteurl}/_api/web/lists/GetByTitle('NewEmployees')/ItemCount`);
      //const selectColumns = nextProps.selectedColumns === null || nextProps.selectedColumns===undefined || nextProps.selectedColumns.length === 0? "" : '?$select='+nextProps.selectedColumns.join();
    const queryParam = this.buildQueryParams(nextProps);
    this.readItems(`${this.props.siteurl}/_api/web/lists/GetByTitle('NewEmployees')/items${queryParam}`);

    //https://tecq8.sharepoint.com/sites/IntranetDev/_api/web/lists/GetByTitle('NewEmployees')/items?%24skiptoken=Paged%3dTRUE%26p_ID=0&$top=2&$select=ID,Title,,Phone,EmpImage,Mail,AboutEmp,Created
  }


  public render(): React.ReactElement<INewEmployeeProps> {
    var weburl=this.props.weburl;
   
    return (
      
      <div>
        <div >
          <div><h1>New Employees</h1></div>
          <div >
            <div>
            {this.state.items.map(function(item,key){ 
              //var imageurl={item.EmpImage.Url};
              return (<div key={key} className={styles.row} > 
               
                <div>Touristic Enterprises Co. welcomes - {item.Title}</div> 
                <div dangerouslySetInnerHTML={{__html: item.AboutEmp}} />;
                <div>Welcome to the {item.Title}</div> 
                <div>
                  <div> {item.Title}</div>
                  <div> {item.Phone}</div>
                  <div> {item.Mail}</div>
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

  /*public render(): React.ReactElement<INewEmployeeProps> {
    return (
      <div className={ styles.newEmployee }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
    
  }*/
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
  private buildQueryParams(props: INewEmployeeProps): string{
    const p_ID = (this.state.currentPage - 1)*this.state.pageSize;
    const queryParam = `?%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$select=ID,Title,Phone,EmpImage,Mail,AboutEmp,Created&$top=${this.state.pageSize}`;
    
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
