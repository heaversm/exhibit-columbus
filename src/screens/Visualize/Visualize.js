import './Visualize.scss';

import { Link, Route, BrowserRouter as Router } from 'react-router-dom';

import React from 'react';
//import { Template } from '../../components';
import { siteData } from '../../data/site_data';
import { view } from 'react-easy-state';

class Visualize extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {}

  render() {

    return (
      <div className="Visualize">
        <main>
          <h1 className="visualize__title">{siteData.visualizeTitle}</h1>
          <section className="visualize__sentence_section ctnr">
            <div className="visualize__sentence_container">
              <p className="visualize__sentence">
                <span className="visualize__sentence_component visualize__sentence_component--lead">{siteData.visualizeLead}</span>
                
                <span className="visualize__sentence_component visualize__sentence_component--sublead">{siteData.visualizeSublead}</span>
              </p>
            </div>
          </section>
          <section className="visualize__canvas_section">
            <div className="visualize__canvas_container"></div>
            <div className="visualize__images_container"></div>
          </section>
          <div className="visualize__continue_container">
            <button className="visualize__continue_button">{siteData.visualizeContinueButtonLabel}</button>
          </div>
          <div className="visualize__sign_modal_container modal__container">
            <div className="modal__bg"></div>
            <div className="modal__content_container">
              <h2 className="visualize__sign_title">{siteData.visualizeSignTitle}</h2>
              <div className="visualize__signature_container">
                <div className="visualize__signature_canvas"></div>
              </div>
              <div className="visualize__sign_buttons">
                <Link to="/confirmation" className="visualize__sign_button visualize__sign_button--send">{siteData.visualizeContinueButtonLabel}</Link>
                <button className="visualize__sign_button visualize__sign_button--skip">{siteData.visualizeSkipButtonLabel}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default view(Visualize);