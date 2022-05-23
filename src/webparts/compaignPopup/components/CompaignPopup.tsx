import * as React from 'react';
import styles from './CompaignPopup.module.scss';
import { ICompaignPopupProps } from './ICompaignPopupProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ICompaignPopupState } from './ICompaignPopupState';
import Modal from 'react-modal';
import { sp, Web, IWeb } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { AttachmentFile, AttachmentFiles } from 'sp-pnp-js/lib/sharepoint/attachmentfiles';
import { PnPClientStorageWrapper } from '@pnp/common';
import { TextField } from 'office-ui-fabric-react';
import { forEach } from 'lodash';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export default class CompaignPopup extends React.Component<ICompaignPopupProps, ICompaignPopupState> {
  private webApi;
  private video_ref: React.RefObject<HTMLVideoElement>;
  isPlay: boolean = true;
  constructor(
    props: ICompaignPopupProps,
  ) {
    super(props);

    // this.webApi = new WebApiService(this.props.spHttpClient)

    this.state = {

      items: [],
      modalIsOpen: false,
      campaignQuestion: false,
      Question: '',
      Answer: '',
      CampaignId: null,
      Points: 0,
      AdditionalPoints: 0,
      RightAnswer: false,
      WrongAnswer: false,
      isImage: true,
      yammerModalIsOpen: false,
      yammerVideo: ''
    };
    this.video_ref = React.createRef();


  }
  public async componentDidMount() {

    await this.getCompaignData();
    // let vidplay = this.video_ref.current;
    // let source = document.createElement('source');
    // source.setAttribute('src', newValue);
    // vidplay.appendChild(source);
    //vidplay.load();
    // vidplay.play();
  }
  public async getCompaignData() {
    this.setState({ modalIsOpen: false });
    if (await this.checkCompaignEnd()) {
      if (await this.checkCompaignAnswered())
        this.setState({ modalIsOpen: false });
      else {
        this.setState({ campaignQuestion: true });
        this.setState({ modalIsOpen: true });
      }
      return;
    }
    else if (await this.checkCompaignAkData()) {
      this.setState({ modalIsOpen: false });
      return;
    }
    let web = Web(this.props.siteUrl);
    var today = new Date();
    today.setDate(today.getDate() - 1);
    var Startdate = today.toISOString().substring(0, 10) + "T00:00:00.000Z";
    var Enddate = today.toISOString().substring(0, 10) + "T23:59:59.000Z";
    const listItems: any[] = await web.lists.getByTitle(this.props.listName).items
      .select('*', 'AttachmentFiles', 'PublishDate')
      .expand('AttachmentFiles')
      .filter(`PublishDate le datetime'${Enddate}' and PublishDate ge datetime'${Startdate}'`)
      .top(1)
      .get();

    console.log(listItems);
    if (listItems.length > 0) {
      this.setState({ items: listItems })
      this.setState({ modalIsOpen: true });
      if (listItems[0].Types == "Image")
        this.setState({ isImage: true })
      else
        this.setState({ isImage: false })
    }
  }
  public async getAnswerFromCompaignQns() {
    let web = Web(this.props.siteUrl);
    const listItems: any[] = await web.lists.getByTitle(this.props.listName).items
      .select('*')
      .filter(`LK_CampaignId eq '${this.state.CampaignId}'`)
      .get();

    console.log(listItems);
    let strAns = '';
    if (listItems.length > 0) {

      listItems.forEach((li) => {
        strAns += li.Answer;
      });
      console.log(strAns);

    }
    return await strAns;
  }
  public async checkCompaignAkData() {
    var isCheck = false;
    let web = Web(this.props.siteUrl);
    var today = new Date();
    // today.setDate(today.getDate()-1);
    var Startdate = today.toISOString().substring(0, 10) + "T00:00:00.000Z";
    var Enddate = today.toISOString().substring(0, 10) + "T23:59:59.000Z";
    const listItems: any[] = await web.lists.getByTitle("Campaign_AcknowledgeList").items
      .select('*')
      .filter(`EmployeeId eq '${this.props.context.pageContext.legacyPageContext["userId"]}' 
      and Acknowledged eq 1 and Created le datetime'${Enddate}' and Created ge datetime'${Startdate}'`)
      .get();

    console.log(listItems);
    if (listItems.length > 0) {
      // this.setState({ modalIsOpen: false })
      isCheck = true;
    }
    return await isCheck;
  }
  public async checkCompaignEnd1() {
    var isCheck = false;
    let web = Web(this.props.siteUrl);
    var today = new Date();
    today.setDate(today.getDate() - 1);
    var Startdate = today.toISOString().substring(0, 10) + "T00:00:00.000Z";
    var Enddate = today.toISOString().substring(0, 10) + "T23:59:59.000Z";
    const listItems: any[] = await web.lists.getByTitle("LK_MarketingCampaign").items
      .select('*')
      .filter(`EndDate le datetime'${Enddate}' and EndDate ge datetime'${Startdate}'`)
      .get();

    console.log(listItems);
    if (listItems.length > 0) {
      this.setState({ CampaignId: listItems[0].ID })
      isCheck = true;
    }
    return await isCheck;
  }
  public async checkCompaignEnd() {
    var isCheck = false;
    let web = Web(this.props.siteUrl);
    var today = new Date();
    today.setDate(today.getDate() - 1);
    var Startdate = today.toISOString().substring(0, 10) + "T00:00:00.000Z";
    var Enddate = today.toISOString().substring(0, 10) + "T23:59:59.000Z";
    const listItems: any[] = await web.lists.getByTitle("LK_MarketingCampaign").items
      .select('*', 'AttachmentFiles')
      .expand('AttachmentFiles')
      .filter(`EndDate le datetime'${Enddate}' and EndDate ge datetime'${Startdate}'`)
      .get();

    console.log(listItems);
    if (listItems.length > 0) {
      this.setState({
        CampaignId: listItems[0].ID,
        Question: listItems[0].Question,
        yammerVideo: listItems[0].AttachmentFiles[0].ServerRelativeUrl
      });
      isCheck = true;
    }
    return await isCheck;
  }
  public async checkCompaignAnswered() {
    var isCheck = false;
    let web = Web(this.props.siteUrl);

    const listItems: any[] = await web.lists.getByTitle("Campaign_ResultList").items
      .select('*')
      .filter(`EmployeeId eq '${this.props.context.pageContext.legacyPageContext["userId"]}' 
      and LK_CampaignId eq '${this.state.CampaignId}'`)
      .get();

    console.log(listItems);
    if (listItems.length > 0) {
      isCheck = true;
    }
    return await isCheck;
  }
  onModalClose = (e) => {
    try {
      // e.preventDefault();
      this.setState({
        modalIsOpen: false
      });
      if (this.state.RightAnswer) {

        //this.setState({ yammerModalIsOpen: true });
        this.setState({
          ...this.state,
          modalIsOpen: false,
          yammerModalIsOpen: true
        });
        //  let html = this.getYammerHTML(true);
        // this.setState({ yammerHTML: html })
      }
    } catch (error) {
      console.log(error);
    }
  }
  onModalCloseYammer = (e) => {
    try {
      // e.preventDefault();
      this.setState({
        yammerModalIsOpen: false
      });

    } catch (error) {
      console.log(error);
    }
  }
  entryCount = 0;
  entryLimit = 3;
  handleFormSubmit = async event => {
    // event.preventDefault();
    let currectAns = await this.getAnswerFromCompaignQns();


    if (this.entryCount < this.entryLimit) {
      if (currectAns.toLocaleLowerCase() != this.state.Answer.toLocaleLowerCase()) {
        alert("Wrong Answer");
        this.entryCount++;
        this.setState({ Answer: "" });
        // this.setState({ WrongAnswer: true });
      } else {
        // alert("Right Answer");
        this.entryCount = 0;
        this.setState({ RightAnswer: true });
        this.AddCompaignAnswer();
      }
    } else {
      alert("Out of entries");
      this.setState({ WrongAnswer: true });
      this.AddCompaignAnswer();
    }


  }
  handleFormAcknowledge = event => {
    event.preventDefault();
    this.AddCompaignAcknowledge();
    this.onModalClose(event);
  }
  private async AddCompaignAcknowledge() {
    debugger;
    let web = Web(this.props.siteUrl);
    await web.lists.getByTitle("Campaign_AcknowledgeList").items.add({
      LK_Campaign_ItemsListId: this.state.items[0].ID,
      LK_CampaignId: this.state.items[0].LK_CampaignId,
      Acknowledged: true,
      Answer: this.state.items[0].Answer,
      AdditionalPoints: await this.checkVideoCurrentTime() ? this.state.items[0].AdditionalPoints : 0,
      Points: this.state.items[0].Points,
      EmployeeId: this.props.context.pageContext.legacyPageContext["userId"]

    }).then(i => {
      console.log(i);
    });

    alert("Acknowledge Successfully");
  }
  private async AddCompaignAnswer() {
    await this.getPoints();
    let web = Web(this.props.siteUrl);

    await web.lists.getByTitle("Campaign_ResultList").items.add({
      LK_CampaignId: this.state.CampaignId,
      Answer: this.state.Answer,
      Points: this.state.Points, // get from Campaign_AcknowledgeList
      AdditionalPoints: this.state.AdditionalPoints, // get from Campaign_AcknowledgeList
      EmployeeId: this.props.context.pageContext.legacyPageContext["userId"]

    }).then(async i => {
      console.log(i);
      this.setState({ campaignQuestion: false });
    });

    // alert("Acknowledge Successfully");
  }
  private async AddCompaignAnswer_old() {
    await this.getPoints();
    let web = Web(this.props.siteUrl);

    await web.lists.getByTitle("Campaign_ResultList").items.add({
      LK_CampaignId: this.state.CampaignId,
      Answer: this.state.Answer,
      Points: this.state.Points, // get from Campaign_AcknowledgeList
      AdditionalPoints: this.state.AdditionalPoints, // get from Campaign_AcknowledgeList
      EmployeeId: this.props.context.pageContext.legacyPageContext["userId"]

    }).then(async i => {
      console.log(i);
      let currectAns = await this.getAnswerFromCompaignQns();

      if (currectAns.toLocaleLowerCase() == this.state.Answer.toLocaleLowerCase()) {
        // alert("RightAnswer");
        this.setState({ RightAnswer: true });
      }
      else {
        //alert("WrongAnswer");
        this.setState({ WrongAnswer: true });
      }
      this.setState({ campaignQuestion: false });
    });

    // alert("Acknowledge Successfully");
  }
  handleChange = (evt: any) => {
    const value = evt.target.value;
    this.setState({ ...this.state, [evt.target.name]: value });
  }
  renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {

      return <div className={styles.timer}>
        <button type="button" className="close m0" onClick={(e) => this.onModalClose(e)}>
          <span aria-hidden="true">&times;</span>
        </button></div>;
    }

    return (
      <div className={styles.timer}>
        {/* <div className={styles.text}>Remaining</div> */}
        <div className={styles.value}>{remainingTime}</div>
        {/* <div className={styles.text}>seconds</div> */}
      </div>
    );
  };

  public render(): React.ReactElement<ICompaignPopupProps> {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          //onAfterOpen={e => this.afterOpenModal(e)}
          // style={customStyles}
          ariaHideApp={false} className="modal" >

          <div className="modal-dialog yamp" role="document">
            <div className="modal-content">


              {this.state.isImage && <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                  onClick={(e) => this.onModalClose(e)}>
                  <span aria-hidden="true">&times;</span>
                </button> </div>}

              {!this.state.isImage && <div className="modal-header yheader">

                <CountdownCircleTimer
                  size={25}
                  strokeWidth={2}
                  isPlaying
                  duration={5}
                  colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000", 0.33]]}
                  onComplete={() => [false, 1000]}
                >
                  {this.renderTime}
                </CountdownCircleTimer>
              </div>}

              <div className="modal-body">
                <div className="row">
                  {!this.state.RightAnswer && !this.state.WrongAnswer &&
                    !this.state.campaignQuestion && <div id="divImage" className="col-12 yam-img">
                      {this.state.items && this.state.items.map((item, i) => {
                        if (item.Types == "Image") {
                          return [

                            <img src={item.AttachmentFiles[0].ServerRelativeUrl} className="img-fluid"></img>
                          ];
                        }
                        else {
                          return [
                            <><h6>Watch video and earn points (You have recieved {item.AdditionalPoints} points after 40 seconds of video)</h6>
                              <video id="VidPlayer" className="img-fluid"
                                autoPlay
                                muted
                                controls
                                ref={this.video_ref}
                              >
                                <source src={item.AttachmentFiles[0].ServerRelativeUrl}
                                  type="video/mp4"></source>
                              </video></>
                          ];
                        }
                      })}
                    </div>}

                  {this.state.RightAnswer && <div className="col-12 yam-r">
                    <h4>Hehe.. Congratulations. <br /> You have successfully unlocked your account.</h4>
                    <img src={`${this.props.siteUrl}/Style%20Library/TEC/Images/emoji-happy.png`} />
                  </div>}

                  {this.state.WrongAnswer && <div className="col-12 yam-r">
                    <h4>Oho.. Bad Luck. <br /> Better Luck Next Time.</h4>
                    <img src={`${this.props.siteUrl}/Style%20Library/TEC/Images/emoji-sad.png`} />
                  </div>}
                  {/* <div className="col-12 yamp-ip">
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                  </div> */}

                  {!this.state.RightAnswer && !this.state.WrongAnswer && this.state.campaignQuestion
                    && <div id="divQuestion" className="col-12 yam-q">
                      <h5>{this.state.Question}</h5>
                      <TextField name="Answer" value={this.state.Answer}
                        onChange={this.handleChange} />
                    </div>}

                  <div className="col-12 text-center">
                    {!this.state.RightAnswer && !this.state.WrongAnswer && !this.state.campaignQuestion
                      && <button className="btn yamp-btn"
                        onClick={this.handleFormAcknowledge}> Acknowledge </button>}
                    {!this.state.RightAnswer && !this.state.WrongAnswer && this.state.campaignQuestion
                      && <button className="btn yamp-btn"
                        onClick={this.handleFormSubmit}> Submit </button>}
                    {(this.state.RightAnswer || this.state.WrongAnswer) && <button className="btn yamp-btn"
                      onClick={(e) => this.onModalClose(e)}> Close </button>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.yammerModalIsOpen}
          //onAfterOpen={e => this.afterOpenModal(e)}
          // style={customStyles}
          ariaHideApp={false} className="modal" >

          <div className="modal-dialog yamp" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                  onClick={(e) => this.onModalCloseYammer(e)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div id="divImage" className="col-12 yam-img">
                    <video id="VidPlayer" className="img-fluid"
                      autoPlay
                      muted
                      controls
                      ref={this.video_ref}>

                      <source src={this.state.yammerVideo} type="video/mp4"></source>

                    </video>
                  </div>
                  <div className="col-12 text-center">
                    <button className="btn yamp-btn"
                      onClick={(e) => this.onModalCloseYammer(e)}> Close </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  public async getPoints() {
    let web = Web(this.props.siteUrl);
    const listItems: any[] = await web.lists.getByTitle("Campaign_AcknowledgeList").items
      .select('*')
      .filter(`LK_CampaignId eq '${this.state.CampaignId}' and
                  EmployeeId eq '${this.props.context.pageContext.legacyPageContext["userId"]}'`)
      .get();

    console.log(listItems);
    let strPoints = 0;
    let strAdditionalPoints = 0;
    if (listItems.length > 0) {

      listItems.forEach((li) => {
        strPoints += li.Points;
        strAdditionalPoints += li.AdditionalPoints
      });
      console.log(strPoints);
      console.log(strAdditionalPoints);
    }
    this.setState({ Points: strPoints });
    this.setState({ AdditionalPoints: strAdditionalPoints });
    //  return await strAns;
  }
  private textFieldChanged(newValue: string) {
    let vidplay = this.video_ref.current;
    let source = document.createElement('source');
    source.setAttribute('src', newValue);
    vidplay.appendChild(source);
    vidplay.load();
    vidplay.play();
  }
  public async checkVideoCurrentTime() {
    var isCheck = false;
    //  var vid=document.getElementById("VidPlayer");
    if (this.video_ref.current != null && this.video_ref.current.currentTime > 40) {
      isCheck = true;
    }
    return await isCheck;
  }

}
