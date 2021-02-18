import * as React from 'react';
import styles from './Media.module.scss';
import { IMediaProps } from './IMediaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import * as moment from 'moment';
   
//Import from @pnp/sp    
import { sp } from "@pnp/sp";    
import "@pnp/sp/webs";    
import "@pnp/sp/lists/web";    
import "@pnp/sp/items/list"; 



import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { SPComponentLoader } from '@microsoft/sp-loader';

const paginationOptions = {    
        sizePerPage: 2,    
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true    
};
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
    employeeList :any[]   
  }
   

export default class Media extends React.Component<IMediaProps, IMediaStates> {
  private _getPage(page: number){
    //console.log('Page:', page);
    this.setState({
      //currentPage: page,
      //totalcounts:Math.round(this.state.itemCount%this.state.pageSize)
    });
    //this._onPageUpdate(page);
  }
  constructor(props: IMediaProps){    
    super(props);    
    this.state ={    
      employeeList : []    
    }    
  }  
  public getEmployeeDetails = () =>{    
    sp.site.rootWeb.lists.getByTitle("Media").items.getAll().    
    then((results : any[])=>{    
        console.log(results.length);
        this.setState({    
          employeeList:results    
        });    
      
    });    
  } 

  public componentDidMount(){    
    this.getEmployeeDetails();    
  }  

  public OpenMediaDetails() {
    alert("Hi");
    window.location.href = "http://google.com";
  };
  
  public render(): React.ReactElement<IMediaProps> {
    var weburl=this.props.weburl;
    
    return (
      
      <section className={"innerpagecont"}>
        <div className={"Inner-page-title mb-4"}>
                <h2 className={"page-heading"}> Media </h2>
        </div>
        <div className={"container-fluid"}>
        {this.state.employeeList.map(function(item,key){ 
          var momentObj = moment(item.PublishedDate);
          var formatExpDate=momentObj.format('DD-MM-YYYY');
          var Descstr = item.Description;
          var splitDesc = Descstr.substring(0, 200);
          var mediaurl=weburl+"/Pages/TecPages/Jobs/MediaDetails.aspx?mediaid="+item.ID;
           return (
            <div className={"row gray-box"} >
                <div className={"col-md-12"}>
                    <h4>{item.Title}</h4>
                    <p className={"detaildate"}>{formatExpDate} | <span className="detailsource">{item.PublishedSource}</span></p>
                    <p className={"mt-2"} id={"mediaDesc"+item.ID}><div dangerouslySetInnerHTML={{__html: splitDesc}} /></p>
                    <button className={"red-btn-effect shadow-sm popup-btn ml-auto float-right"} id={item.ID} onClick={e => this.OpenMediaDetails(this)}><a href={mediaurl}><span>Read More...</span></a></button>
                </div>
            </div>
            ); 
          })} 
          <div className={"pager pagination"}>
          <Pagination
            //totalItems={ this.state.itemCount }
            //itemsCountPerPage={ this.state.pageSize } 
            //onPageUpdate={ this._onPageUpdate } 
            currentPage={1}

            totalPages={2} 
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
  }

  
}
