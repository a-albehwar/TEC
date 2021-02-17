import * as React from 'react';
import styles from './Media.module.scss';
import { IMediaProps } from './IMediaProps';
import { escape } from '@microsoft/sp-lodash-subset';


//Import related to react-bootstrap-table-next    
import BootstrapTable from 'react-bootstrap-table-next'; 
   
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

  
  export interface IMediaStates{    
    employeeList :any[]   
  }
   

export default class Media extends React.Component<IMediaProps, IMediaStates> {

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

  public render(): React.ReactElement<IMediaProps> {
    let cssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";    
    SPComponentLoader.loadCss(cssURL); 
    return (
      <div className={ styles.media }>    
        <div className={ styles.container }>    
          <div className={ styles.row }>    
            <div className={ styles.column }>    
              <span className={ styles.title }>TEC Media</span>       
            </div>    
          </div>      
          <BootstrapTable keyField='id' data={this.state.employeeList} columns={ empTablecolumns } headerClasses="header-class"  pagination={paginationFactory(paginationOptions)}/>    
        </div>     
      </div> 
      
    );
  }

  
}
