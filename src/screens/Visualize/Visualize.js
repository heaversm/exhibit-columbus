import './Visualize.scss';

import { Image, Layer, Rect, Stage } from 'react-konva';
import { siteData, visualizeData } from '../../data/site_data';

import Konva from 'konva';
import { Link } from 'react-router-dom';
import React from 'react';
import SVG from 'react-inlinesvg';
import useImage from 'use-image';
import { userState } from '../../store';
import { view } from 'react-easy-state';
import { visualizeSettingsData } from '../../data/dev_data';

const CanvasImage = (imageURL) => {
  console.log(imageURL);
  const [image] = useImage('./assets/images/perspective-grid.png');
  return <Image 
    image={image} 
  />;
};

class Visualize extends React.Component {

  state = {
    signModalActive: false, //when true, show sign modal
    activeImageCategory: visualizeSettingsData.CATEGORIES[0], //fills with the name of the selected images category
    activeImage: null, //fills with the data of the selected image item from the activeImageCategory
    activeCanvasImage: null, //fills with the reference to the current canvas image
    activeControl: null, //fills with active control
    frontEnabled: false, //true when we can order the active item higher up in the z-hierarchy
    backEnabled: false, //true when we can order the active item lower down in the z-hierarchy
    scaleUp: false, //true when we can no longer scale the active image down
    blurUp: false, //true when we can no longer blur the image any more
    helpActive: false, //true when we are showing the help modal
    canvasImages: [], //fills with the non-foreground / background objects that have been placed on the canvas
  }

  componentDidMount() {
    //
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
      activeImageCategory: visualizeCategory
    })
  }

  handleVisualizeImageClick = (visualizeImage) => {
    this.setState({
      activeImage: visualizeImage
    })
  }

  handleCanvasControlClick = (control) => {

    this.setState({
      activeControl: control
    })

    switch (control.name) {
      case 'front':
        this.handleFrontClick();
        break;
      case 'back':
        this.handleBackClick();
        break;
      case 'scale':
        this.handleScaleClick()
        break;
      case 'rotate':
        this.handleRotateClick();
        break;
      case 'blur':
        this.handleBlurClick();
        break;
      case 'remove':
        this.handleRemoveClick();
        break;
      case 'help':
        this.handleHelpClick();
        break;
      default:
        console.log('unknown button');
        break;
    }
  }

  handleFrontClick = () => {

  }
  handleBackClick = () => {

  }
  handleScaleClick = () => {

  }
  handleRotateClick = () => {

  }
  handleBlurClick = () => {

  }
  handleRemoveClick = () => {

  }
  handleHelpClick = () => {

  }

  render() {

    const { signModalActive, activeImageCategory, activeImage } = this.state;

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
                  visualizeSettingsData.CONTROLS.map((control, index) => {
                    return (
                      <button
                        className={`visualize__canvas_control ${control.name} ${control.initialState ? control.initialState : ''}`}
                        key={`visualize__canvas_control--${index}`}
                        onClick={() => {
                          this.handleCanvasControlClick(control);
                        }}
                      >
                        <SVG
                          src={`./assets/images/icons/${control.icon}`}
                          className="visualize__canvas_control_icon"
                        />
                      </button>
                    )
                  })
                }
              </div>

              <Stage
                width={visualizeSettingsData.CANVAS_SIZE}
                height={visualizeSettingsData.CANVAS_SIZE}
                className="visualize__canvas"
              >
                <Layer>
                  <Rect
                    x={320}
                    y={320}
                    width={50}
                    height={50}
                    fill={`red`}
                  />
                  <CanvasImage
                    imageURL={'./assets/images/perspective-grid.png'}
                  />
                </Layer>
              </Stage>

            </div>
            <div className="visualize__images_container">
              <div className="visualize__image_categories">
                {
                  visualizeSettingsData.CATEGORIES.map((category, index) => {
                    return (
                      <div
                        className={`visualize__image_category ${activeImageCategory === category ? 'active' : ''}`}
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
                    visualizeData[activeImageCategory].map((imageItem, index) => {
                      return (
                        <div
                          className={`visualize__image_container ${activeImage && activeImage.title === imageItem.title ? 'active' : ''}`}
                          key={`visualize__image--${index}`}
                          onClick={() => {
                            this.handleVisualizeImageClick(imageItem)
                          }}
                        >
                          <img src={`./assets/images/temp/${activeImageCategory}/${imageItem.image}`} alt={imageItem.title} className="visualize__image" />
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