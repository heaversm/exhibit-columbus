import './Redesign.scss';

import { Link } from 'react-router-dom';
import React from 'react';
//import { Template } from '../../components';
import { siteData } from '../../data/site_data';
import { view } from 'react-easy-state';

/* eslint-disable */


class Redesign extends React.Component {

  state = {
    data: null,
  }

  componentDidMount() {
    //const { id } = this.props.match.params
    const { data } = this.props.location.state;
    this.setState({
      data: data
    })
  }

  render() {

    const { data } = this.state;
    console.log(data);

    if (data) {
      return (
        <div className="redesign app_screen">
          <main>
            <section className="redesign__inspiration_section ctnr">
              <div className="row">
                <div className="redesign__inspiration_title_container middle-md col-md-4">
                  <h1 className="redesign__inspiration_title">{siteData.redesignInspirationText}</h1>
                </div>
                <div className="redesign__choice_container col-md-6 col-md-offset-2">
                  <div className="redesign__choice center-xs">
                    <img src={`/assets/images/temp/inspirations/${data.image}`} alt={data.title} className="redesign__choice_image"/>
                    <div className="redesign__choice_content">
                      <h2 className="redesign__choice_title">{data.title}</h2>
                      <span className="redesign__choice_text">
                        {`${siteData.visualizeLead} ${data.object} ${siteData.visualizeSublead}${data.objective}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="redesign__objects_section ctnr">
              <h3 className="redesign__objects_title">{siteData.redesignObjectsTitle}</h3>
              <div className="redesign__objects_container">
                <div className="redesign__object_container">
                  <img src="" alt="" className="redesign__object_image" />
                  <h4 className="redesign__object_text"></h4>
                </div>
              </div>
            </section>
            <section className="redesign__objectives_section ctnr">
              <h3 className="redesign__objectives_title">{siteData.redesignObjectivesTitle}</h3>
              <div className="redesign__objectives_container">
                <div className="redesign__objectives">
                  <div className="redesign__objective"></div>
                  <div className="redesign__objective--user_entry" data-id="user_entry">
                    <input type="text" placeholder={siteData.redesignObjectiveUserSubmitText} className="redesign__objective_entry_field" />
                  </div>
                </div>
                <div className="redesign__objectives_more_container">
                  <button className="redesign__objectives_more_button">{siteData.redesignMoreButtonLabel}</button>
                </div>
              </div>
            </section>
            <div className="redesign__visualize_section">
              <Link to="/visualize" className="redesign__visualize_button">{siteData.redesignContinueButtonLabel}</Link>
            </div>
          </main>
        </div>
      )
    }

    return (
      <div
        className="loading__container"
      >
        LOADING
      </div>
    )
  }
}

export default view(Redesign);