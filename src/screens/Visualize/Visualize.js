import './Visualize.scss';

import { siteData, visualizeData } from '../../data/site_data';

import { Link } from 'react-router-dom';
import React from 'react';
import SVG from 'react-inlinesvg';
import { userState } from '../../store';
import { view } from 'react-easy-state';
import { visualizeSettingsData } from '../../data/dev_data';

class Visualize extends React.Component {

  state = {
    signModalActive: false, //when true, show sign modal
    curImageCategory: visualizeSettingsData.CATEGORIES[0], //fills with the name of the selected images category
    curImage: null, //fills with the data of the selected image item from the curImageCategory
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

  toggleSignModal(doShow) {
    this.setState({
      signModalActive: doShow,
    });
  }

  handleVisualizeCategoryClick = (visualizeCategory) => {
    this.setState({
      curImageCategory: visualizeCategory
    })
  }

  handleVisualizeImageClick = (visualizeImage)=>{
    this.setState({
      curImage: visualizeImage
    })
  }

  handleCanvasControlClick = (control) => {
    console.log(control);
  }

  render() {

    const { signModalActive, curImageCategory, curImage } = this.state;

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
            <div className="visualize__canvas_container">
              <div className="visualize__canvas_controls">
                {
                  visualizeSettingsData.CONTROLS.map((control,index)=>{
                    return (
                      <button 
                        className={`visualize__canvas_control ${control.name} ${control.initialState ? control.initialState : ''}`}
                        key={`visualize__canvas_control--${index}`}
                        onClick={()=>{
                          this.handleCanvasControlClick(control);
                        }}
                      >
                        <SVG
                            src={`./assets/images/icons/${control.icon}`}
                            className="visualize__canvas_control_icon"
                            //preloader={<Loader />}
                        />
                      </button>
                    )
                  })
                }
              </div>
              
            </div>
            <div className="visualize__images_container">
              <div className="visualize__image_categories">
                {
                  visualizeSettingsData.CATEGORIES.map((category, index) => {
                    return (
                      <div
                        className={`visualize__image_category ${curImageCategory === category ? 'active' : ''}`}
                        onClick={() => { this.handleVisualizeCategoryClick(category) }}
                        key={`visualize__image_category--${index}`}
                      >
                        {category}
                      </div>
                    )
                  })
                }
              </div>
              <div className="visualize__images__scroll_container">
                <div className="visualize__images">
                  {
                    visualizeData[curImageCategory].map((imageItem, index) => {
                      return (
                        <div
                          className={`visualize__image_container ${curImage && curImage.title === imageItem.title ? 'active' : ''}`}
                          key={`visualize__image--${index}`}
                          onClick={()=>{
                            this.handleVisualizeImageClick(imageItem)
                          }}
                        >
                          <img src={`./assets/images/temp/visualize/${curImageCategory}/${imageItem.image}`} alt={imageItem.title} className="visualize__image" />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
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