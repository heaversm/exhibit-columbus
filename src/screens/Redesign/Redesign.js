import './Redesign.scss';

import { Link, Route, BrowserRouter as Router } from 'react-router-dom';

import React from 'react';
//import { Template } from '../../components';
import { siteData } from '../../data/site_data';
import { view } from 'react-easy-state';

class Redesign extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {}

  render() {

    return (
      <div className="redesign app_screen">
        <main>
          <section className="redesign__inspiration_section ctnr">
            <h1 className="redesign__inspiration_text">{siteData.redesignInspirationText}</h1>
            <div className="redesign__choice_container">
              <div className="redesign__choice">
                <h2 className="redesign__choice_title"></h2>
                <span className="redesign__choice_text"></span>
              </div>
            </div>
          </section>
          <section className="redesign__objects_section ctnr">
            <h3 className="redesign__objects_title">{siteData.redesignObjectsTitle}</h3>
            <div className="redesign__objects_container">
              <div className="redesign__object_container">
                <img src="" alt="" className="redesign__object_image"/>
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
                  <input type="text" placeholder={siteData.redesignObjectiveUserSubmitText} className="redesign__objective_entry_field"/>
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
}

export default view(Redesign);