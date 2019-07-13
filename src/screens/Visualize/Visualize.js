import './Visualize.scss';

import { Link } from 'react-router-dom';
import React from 'react';
import { siteData } from '../../data/site_data';
import { userState } from '../../store';
import { view } from 'react-easy-state';

class Visualize extends React.Component {

  state = {
    signModalActive: false, //when true, show sign modal
  }

  handleVisualizeContinueClick = () => {
    this.toggleSignModal(true)
  }

  handleVisualizeSkipClick = () => {
    this.toggleSignModal(false)
  }
  
  handleVisualizeSignClick = () => {
    this.toggleSignModal(false)
  }

  toggleSignModal(doShow){
    console.log(doShow)
    this.setState({
      signModalActive: doShow,
    });
    console.log(this.state);
  }

  render() {

    const {signModalActive} = this.state;

    return (
      <div className="Visualize app_screen">
        <main>
          <section className="visualize__sentence_section ctnr center-xs">
            <h1 className="visualize__title">{siteData.visualizeTitle}</h1>
            <div className="visualize__sentence_container">
              <p className="visualize__sentence">
                <span className="visualize__sentence_component visualize__sentence_component--lead">{siteData.visualizeLead}</span>
                <span className="visualize__sentence_entry">{userState.objectData !== null && userState.objectData.title}</span>
                <span className="visualize__sentence_component visualize__sentence_component--sublead">{siteData.visualizeSublead}</span>
                <span className="visualize__sentence_entry">{userState.objectiveData !== null && userState.objectiveData.title}</span>
              </p>
            </div>
          </section>
          <section className="visualize__canvas_section">
            <div className="visualize__canvas_container"></div>
            <div className="visualize__images_container"></div>
          </section>
          <div className="visualize__continue_container center-xs">
            <button
              className="visualize__continue_button button button--rounded button--md"
              onClick={this.handleVisualizeContinueClick}
            >
              {siteData.visualizeContinueButtonLabel}
            </button>
          </div>
          <div className={`visualize__sign_modal_container modal__container ${signModalActive ? 'active' : ''}`}>
            <div className="modal__bg"></div>
            <div className="modal__content_container">
              <h2 className="visualize__sign_title">{siteData.visualizeSignTitle}</h2>
              <div className="visualize__signature_container">
                <div className="visualize__signature_canvas"></div>
              </div>
              <div className="visualize__sign_buttons row between-md">
                <button
                  className="visualize__sign_button visualize__sign_button--send col-md-5 center-xs button"
                  onClick={this.handleVisualizeSignClick}
                >
                  {siteData.visualizeContinueButtonLabel}
                </button>
                <button
                  className="visualize__sign_button visualize__sign_button--skip col-md-5 center-xs button"
                  onClick={this.handleVisualizeSkipClick}
                >
                  {siteData.visualizeSkipButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default view(Visualize);