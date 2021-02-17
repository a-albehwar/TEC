import * as React from 'react';
import styles from './JobPostPag.module.scss';
import { IJobPostPagProps } from './IJobPostPagProps';
import { escape } from '@microsoft/sp-lodash-subset';





//require("bootstrap/less/bootstrap.less");
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";



export default class JobPostPag extends React.Component<IJobPostPagProps, {}> {
  private _getPage(page: number){
    console.log('Page:', page);
  }
  public render(): React.ReactElement<IJobPostPagProps> {
    return (
      <div className={ styles.jobPostPag }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
              <Pagination
            currentPage={1}
            totalPages={3} 
            onChange={(page) => this._getPage(page)}
            limiter={3} // Optional - default value 3
            hideFirstPageJump // Optional
            hideLastPageJump // Optional
            limiterIcon={"Emoji12"} // Optional
            />
            </div>

            
          </div>
        </div>
      </div>
    );
  }
  
}
