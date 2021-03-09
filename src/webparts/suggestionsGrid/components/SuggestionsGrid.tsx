import * as React from 'react';
import styles from './SuggestionsGrid.module.scss';
import { ISuggestionsGridProps } from './ISuggestionsGridProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import * as moment from 'moment';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface ISuggestionsGridStates{    
  SuggestionBoxList :any[],
  currentPage:number,
  totalPages:number,
  pageSize:number,
  itemCount:number,
}

declare var arrLang: any;
declare var lang: any;
declare var surl: any;

export default class SuggestionsGrid extends React.Component<ISuggestionsGridProps, ISuggestionsGridStates> {

  private _getPage(page: number){
    //console.log('Page:', page);
    this.setState({
      currentPage: page,
      //totalPages: Math.ceil(this.state.itemCount/this.state.pageSize)
    });
    this._onPageUpdate(page);
  }

  constructor(props: ISuggestionsGridProps){    
    super(props);    
    this.state ={    
      SuggestionBoxList : [],
      currentPage:1,
      totalPages:0,
      pageSize:10, // change no of items for page as your requirement
      itemCount:0,
    }    
    this.getListItemsCount(`${this.props.siteurl}/_api/web/lists/GetByTitle('SuggestionsBox')/ItemCount`);
    const queryParam = this.buildQueryParams(props);
    this.readItems(`${this.props.siteurl}/_api/web/lists/GetByTitle('SuggestionsBox')/items${queryParam}`);
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

  private _onPageUpdate(pageNumber: number) {
    //this.readItems()
    this.setState({
      currentPage: pageNumber,
    });
    const p_ID = (pageNumber - 1)*this.state.pageSize;
    
   //?$select=ID,WorkType,ApplyLink,ExpireDate,Title,LK_Departments/ID,LK_Departments/Title&$expand=LK_Departments
    const queryParam = `%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$top=${this.state.pageSize}`;
    var url = `${this.props.siteurl}/_api/web/lists/GetByTitle('SuggestionsBox')/items?`+ queryParam+``;
    this.readItems(url);    //&$select=ID,Title,Title_Ar,Description,Description_Ar,Suggestion_StatusTitle/Suggestion_Status&$expand=Suggestion_Status
  }
  

  private buildQueryParams(props: ISuggestionsGridProps): string{
    const p_ID = (this.state.currentPage - 1)*this.state.pageSize;
    const queryParam = `?%24skiptoken=Paged%3dTRUE%26p_ID=${p_ID}&$top=${this.state.pageSize}`;
    
    return queryParam;
  }

  private readItems(url: string) {
    this.setState({
      SuggestionBoxList: [],
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
      
      this.setState({
        SuggestionBoxList: response.value,
        //currentPage:1,
      });    
    }, (error: any): void => {
      this.setState({
        SuggestionBoxList: [],
        //status: 'Loading all items failed with error: ' + error
      });
    });
  }

  public render(): React.ReactElement<ISuggestionsGridProps> {
    var weburl=this.props.weburl;
    var langcode=this.props.pagecultureId;
    lang=langcode=="en-US"?"en":"ar";
    //surl=this.props.siteurl;
    var siteurl=this.props.siteurl;
    
    //alert(siteurl);
    var viewimgurl=siteurl+"/Style%20Library/TEC/images/view.svg";
    return (
      
      <div className={"container-fluid"}>
            <div className={"row"}>
              <div className={"col-lg-4  mb-2"}>
                <label className="form-label" id="lblEmployeeName">{arrLang[lang]['KB']['Title']}</label>
                <input type="text" id='idSearchName' className="form-input" placeholder={arrLang[lang]['KB']['Title']}/>
              </div>
              <div className={"col-lg-4"}>
                <button id="idBtnSearch" type="button" className={"red-btn shadow-sm  mt-4"} onClick={() => this.getSearchData(siteurl)} > <span>{arrLang[lang]['EmployeeDirectory']['Search']}</span></button>
              </div>
            </div>
            <div className={"row"}>
               <div className={"col-12"}>
                     <table className={"table table-bordered table-hover footable"}>
                        <thead>
                           <tr>
                             <th data-breakpoints="xs">{arrLang[lang]['SuggestionBox']['Title']}</th>
                              <th data-breakpoints="xs">{arrLang[lang]['SuggestionBox']['Description']}</th>
                              
                              <th data-breakpoints="xs">{arrLang[lang]['SuggestionBox']['CreatedDate']}</th>
                              <th data-breakpoints="xs">{arrLang[lang]['SuggestionBox']['View']}</th>      
                           </tr>
                        </thead>
                        <tbody>
                        {this.state.SuggestionBoxList.map(function(item,key){
                          
                            //&$select=ID,Title,Title_Ar,Description,Description_Ar,Suggestion_StatusTitle/Suggestion_Status&$expand=Suggestion_Status
                          var momentObj = moment(item.CreatedDate);
                          var formatCreatedDate=momentObj.format('DD-MM-YYYY');
                          var Sugtitle=langcode=="en-US"?item.Title:item.Title_Ar;
                          var SugDescstr = langcode=="en-US"?item.Description:item.Description_Ar;
                          var SugStatus = langcode=="en-US"?item.Suggestion_StatusTitle:item.Suggestion_StatusTitle;
                          //var KBsplitDesc = KBDescstr.substring(0, 100);
                          var viewurl=weburl+"/Pages/TecPages/EmployeeSuggestions/ViewSuggestion.aspx?vsid="+item.ID;
                          var SugAttachmenturl="";//item.Image.Url;
                           return (
                            <tr>
                                <td>{Sugtitle}</td>
                                <td>{SugDescstr}</td>
                               
                                <td>{formatCreatedDate}</td>
                                <td>
                                <a href={viewurl}><img src={viewimgurl} className={"img-fluid"}/></a>
                                </td>
                            </tr>
                        );
                      })} 
                        </tbody>
                     </table>
                     <div id="div_pagination" className={"pager pagination col-12 justify-content-center"}>
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
                       <div id="div_norecords" className={"justify-content-center"} style={{display: "none"}}>{arrLang[lang]['KB']['Norecords']}</div>
                </div>
            </div>
        </div>  
    );
  }

  private getSearchData(surl) {
    var searchKeyword=$("#idSearchName").val();
   
    if (searchKeyword!=''){
      if(lang=="en"){
          var searchurl=`${surl}/_api/web/lists/GetByTitle('SuggestionsBox')/items?$filter=substringof('${searchKeyword}',Title)`;
      }
      else{
        var searchurl=`${surl}/_api/web/lists/GetByTitle('SuggestionsBox')/items?$filter=substringof('${searchKeyword}',Title_Ar)`;
      }
       console.log(searchurl);
    
        this.setState({
          SuggestionBoxList: [],
          //totalcounts:Math.round(this.state.itemCount%this.state.pageSize),
          //status: 'Loading all items...'
        });
        
        this.props.spHttpClient.get(searchurl,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        }).then((response: SPHttpClientResponse): Promise<{value: any[]}> =>{
        return response.json();
        }).then((response: {value: any[]}): void => {     
          $('#div_pagination').hide();
          $('#div_norecords').hide();
          if(response.value.length>0)
          {
            this.setState({
              SuggestionBoxList: response.value,
              itemCount: 0,
              totalPages: 0,
            }); 
          }   
          else{
            /*this.state.KBList.push({Title:"No Records found",CreatedDate:"00-00-00",viewimgurl:"#",viewurl:"#"});
            this.setState({
              itemCount: 0,
              totalPages: 0,
            }); */
            $('#div_norecords').show();
          }
        }, (error: any): void => {
          this.setState({
            SuggestionBoxList: [],
            //status: 'Loading all items failed with error: ' + error
          });
        });  
    }
     else{
        $('#div_pagination').show();
        $('#div_norecords').hide();
        this.getListItemsCount(`${this.props.siteurl}/_api/web/lists/GetByTitle('SuggestionsBox')/ItemCount`);
        const queryParam = this.buildQueryParams(this.props);
        var url = `${this.props.siteurl}/_api/web/lists/GetByTitle('SuggestionsBox')/items?`+ queryParam;
        this.readItems(url);  
          
     }
     
  }

}
