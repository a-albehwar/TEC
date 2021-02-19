import * as React from 'react';
import styles from './Media.module.scss';
import { IMediaProps } from './IMediaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import * as moment from 'moment';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
//Import from @pnp/sp    
import { sp } from "@pnp/sp";    
import "@pnp/sp/webs";    
import "@pnp/sp/lists/web";    
import "@pnp/sp/items/list"; 
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";



import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { SPComponentLoader } from '@microsoft/sp-loader';
import { applyFactoryExtensions } from '@pnp/odata/invokable-extensions';


/*
const empTablecolumns = [     
  {    
      dataField: "Title",    
      text: "Media Title",    
      headerStyle : {backgroundColor: '#81c784'} 
      //sort : true
      
  },    
  {    
      dataField: "Description",    
      text: "Media Description"    
  },      
  {    
      dataField: "Created",    
      text: "Created Date"    
  }

];  
*/
  
  export interface IMediaStates{    
    employeeList :any[],
    currentPage:number,
    totalPages:number,
    pageSize:number,
    itemCount:number,
  }
  declare var arrLang: any;
  declare var lang: any;
  declare var NoOfPaginations: any;
export default class Media extends React.Component<IMediaProps, IMediaStates> {
  private _getPage(page: number){
    //console.log('Page:', page);
    this.setState({
      currentPage: page,
      //totalPages: Math.ceil(this.state.itemCount/this.state.pageSize)
    });
    this._onPageUpdate(page);
  }
  constructor(props: IMediaProps){    
    super(props);    
    this.state ={    
      employeeList : [],
      currentPage:1,
      totalPages:0,
      pageSize:2, // change no of items for page as your requirement
      itemCount:0,
    }    
    this.getListItemsCount(`${this.props.siteurl}/_api/web/lists/GetByTitle('Media')/ItemCount`);
    const queryParam = this.buildQueryParams(props);
    this.readItems(`${this.props.siteurl}/_api/web/lists/GetByTitle('Media')/items${queryParam}`);
  }  

  private _onPageUpdate(pageNumber: number) {
    //this.readItems()
    this.setState({
      currentPage: pageNumber,
    });
    const p_ID = (pageNumber - 1)*this.state.pageSize;
    
   //?$select=ID,WorkType,ApplyLink,ExpireDate,Title,LK_Departments/ID,LK_Departments/Title&$expand=LK_Departments
    const queryParam = `%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$top=${this.state.pageSize}&$orderby=Created desc`;
    var url = `${this.props.siteurl}/_api/web/lists/GetByTitle('Media')/items?`+ queryParam;
    this.readItems(url);    
  }

  public getMediaInfo = () =>{    
    sp.site.rootWeb.lists.getByTitle("Media").items.orderBy("ID",true).getAll().    
    then((results : any[])=>{    
        console.log(results.length);
        
        this.setState({    
          itemCount:results.length,
          employeeList:results,
          totalPages:Math.ceil(results.length/this.state.pageSize),
        });    
        //this.state.totalPages= Math.ceil(this.state.itemCount/this.state.pageSize)
    });    
  } 

  /*  public componentDidMount(){    
   // this.getMediaInfo();    
  } */
  
  
  public componentWillReceiveProps(nextProps: IMediaProps): void{   
    
    this.setState({

      pageSize: nextProps.pageSize
    });
    this.getListItemsCount(`${this.props.siteurl}/_api/web/lists/GetByTitle('Media')/ItemCount`);
      //const selectColumns = nextProps.selectedColumns === null || nextProps.selectedColumns===undefined || nextProps.selectedColumns.length === 0? "" : '?$select='+nextProps.selectedColumns.join();
    const queryParam = this.buildQueryParams(nextProps);
    this.readItems(`${this.props.siteurl}/_api/web/lists/GetByTitle('Media')/items${queryParam}`);
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
    console.log(this.state.itemCount+"---"+this.state.totalPages);
  }
  private buildQueryParams(props: IMediaProps): string{
    const p_ID = (this.state.currentPage - 1)*this.state.pageSize;
    const queryParam = `?%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$top=${this.state.pageSize}&$orderby=Created desc`;
    
    return queryParam;
  }
  
  private readItems(url: string) {
    this.setState({
      employeeList: [],
      //totalcounts:Math.round(this.state.itemCount%this.state.pageSize),
      //status: 'Loading all items...'
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
        employeeList: response.value,
   
        //columns: _buildColumns(response.value),
        //status: `Showing items ${(this.state.currentPage - 1)*this.state.pageSize +1} - ${(this.state.currentPage -1) * this.state.pageSize + response.value.length} of ${this.state.itemCount}`
        
      });    
    }, (error: any): void => {
      this.setState({
        employeeList: [],
        //status: 'Loading all items failed with error: ' + error
      });
    });
  }
  public render(): React.ReactElement<IMediaProps> {
    const sayHello = (e) => {
      console.log("haa");
      e.preventDefault();
      //window.location.href=redirectPageUrl;
      //return false;
      //window.open(redirectPageUrl, '_self');
     
    };
    var weburl=this.props.weburl;
    var langcode=this.props.pagecultureId;
    lang=langcode=="en-US"?"en":"ar";
    var readitemtext=arrLang[lang]['Common']['ReadMore'];
    return (
      
      <section className={"innerpagecont"}>
        <div className={"Inner-page-title mb-4"}>
                <h2 className={"page-heading"}> Media </h2>
        </div>
        <div className={"container-fluid"}>
        {this.state.employeeList.map(function(item,key){ 
          var momentObj = moment(item.PublishedDate);
          var formatExpDate=momentObj.format('DD-MM-YYYY');
          var mediattitle=langcode=="en-US"?item.Title:item.Title_Ar;
          var Descstr = langcode=="en-US"?item.Description:item.Description_Ar;
          var splitDesc = Descstr.substring(0, 200);
          var mediapubSource=langcode=="en-US"?item.PublishedSource:item.PublishedSource_Ar;
          var mediaurl=weburl+"/Pages/TecPages/Media/MediaDetails.aspx?mediaid="+item.ID;
           return (
            <div className={"row gray-box"} >
                <div className={"col-md-12"}>
                    <h4>{mediattitle}</h4>
                    <p className={"detaildate"}>{formatExpDate} | <span className="detailsource">{mediapubSource}</span></p>
                    <p className={"mt-2"} id={"mediaDesc"+item.ID}><div dangerouslySetInnerHTML={{__html: splitDesc}} /></p>
                    <button className={"red-btn-effect shadow-sm popup-btn ml-auto float-right"} id={item.ID} onClick={(e) => {
                          e.preventDefault();
                          window.location.href=mediaurl;
                          }}>
                    <span>{readitemtext}</span></button>
                </div>
            </div>
            ); 
            //<button className={"red-btn-effect shadow-sm popup-btn ml-auto float-right"} id={item.ID} ><a href={mediaurl} target={"_target"}><span>{readitemtext}</span></a></button>
          })} 
          <div className={"pager pagination col-12 d-flex justify-content-center"}>
          <Pagination
            //totalItems={ this.state.itemCount }
            //itemsCountPerPage={ this.state.pageSize } 
            //onPageUpdate={ this._onPageUpdate } 
            currentPage={this.state.currentPage}

            totalPages={this.state.totalPages} 
            onChange={(page) => this._getPage(page)}
            limiter={3} // Optional - default value 3
            hideFirstPageJump={false} // Optional
            hideLastPageJump={false} // Optional
            limiterIcon={"Emoji12"} // Optional
            />
         </div>
        </div>
      </section>
      
    );
    //this.Localization();
    
  }
  private Localization(): void {
    
    var lcid=this.context.pageContext.legacyPageContext['currentCultureLCID'];  
    var language=lcid==13313?"ar":"en";
    
  }
  
}
