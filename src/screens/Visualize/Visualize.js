import './Visualize.scss';

import { Layer, Stage } from 'react-konva';
import { siteData, visualizeData } from '../../data/site_data';

import React from 'react';
import SVG from 'react-inlinesvg';
import { URLImage } from '../../components';
import { userState } from '../../store';
import { view } from 'react-easy-state';
import { visualizeSettingsData } from '../../data/dev_data';

class Visualize extends React.Component {

  state = {
    signModalActive: false, //when true, show sign modal
    activeImageCategory: visualizeSettingsData.CATEGORIES[0], //fills with the name of the selected images category
    activeImage: null, //fills with the data of the selected image item from the activeImageCategory
    activeCanvasImageIndex: -1, //fills with reference to the canvasImages index of the active item
    activeControl: null, //fills with active control
    frontEnabled: false, //true when we can order the active item higher up in the z-hierarchy
    backEnabled: false, //true when we can order the active item lower down in the z-hierarchy
    scaleUp: false, //true when we can no longer scale the active image down
    blurUp: false, //true when we can no longer blur the image any more
    helpActive: false, //true when we are showing the help modal
    canvasImages: [], //fills with the non-foreground / background objects that have been placed on the canvas
  }

  componentDidMount() {

    const { canvasImages } = this.state;
    //


    if (userState.objectData) {
      //const activeImage = userState.objectData.chosenObject;
      const activeCanvasImage = userState.objectData;
      activeCanvasImage.zIndex = 0;
      canvasImages.push(activeCanvasImage);
      this.setState({
        canvasImages: canvasImages,
        activeCanvasImageIndex: canvasImages.length - 1,
      })

    }
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
    const { canvasImages } = this.state;
    canvasImages.push(visualizeImage);
    const newActiveIndex = canvasImages.length-1;
    canvasImages[newActiveIndex].zIndex = newActiveIndex;

    const backEnabled = canvasImages.length > 1 ? true : false;

    this.setState({
      activeImage: visualizeImage,
      activeCanvasImageIndex: newActiveIndex,
      canvasImages: canvasImages,
      backEnabled: backEnabled,
      frontEnabled: false,
    });


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
    const { canvasImages, activeCanvasImageIndex, backEnabled } = this.state;
    const curCanvasImage = canvasImages[activeCanvasImageIndex];

    if (curCanvasImage.zIndex < canvasImages.length-1){
      const upperCanvasImage = canvasImages.find((canvasImage)=>{
        return canvasImage.zIndex === curCanvasImage.zIndex+1;
      });
  
      const curZIndex = curCanvasImage.zIndex;
      const upperZIndex = upperCanvasImage.zIndex;
  
      curCanvasImage.zIndex = upperZIndex;
      upperCanvasImage.zIndex = curZIndex;

      if (upperZIndex === canvasImages.length-1){
        this.disableFrontClick();
      }
      
      if (!backEnabled && canvasImages.length > 1){
        this.setState({
          backEnabled: true,
        });
      }

    } 
  }
  handleBackClick = () => {

    const { canvasImages, activeCanvasImageIndex, frontEnabled } = this.state;
    const curCanvasImage = canvasImages[activeCanvasImageIndex];

    if (curCanvasImage.zIndex > 0){
      const lowerCanvasImage = canvasImages.find((canvasImage)=>{
        return canvasImage.zIndex === curCanvasImage.zIndex-1;
      });
  
      const curZIndex = curCanvasImage.zIndex;
      const lowerZIndex = lowerCanvasImage.zIndex;
  
      curCanvasImage.zIndex = lowerZIndex;
      lowerCanvasImage.zIndex = curZIndex;

      if (lowerZIndex === 0){
        this.disableBackClick();
      }
      
      if (!frontEnabled && canvasImages.length > 1){
        this.setState({
          frontEnabled: true,
        });
      }

    } 
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

  disableBackClick = ()=>{
    this.setState({
      backEnabled: false,
    });
  }

  disableFrontClick = ()=>{
    this.setState({
      frontEnabled: false,
    });
  }

  render() {

    const { signModalActive, activeImageCategory, activeImage, activeCanvasImageIndex, canvasImages, frontEnabled, backEnabled } = this.state;
    const canvasSize = visualizeSettingsData.CANVAS_SIZE;

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
            <div className={`
              visualize__canvas_container 
              ${canvasImages.length > 0 && 'interactables'}
              ${!backEnabled && 'backDisabled'}
              ${!frontEnabled && 'frontDisabled'}
            `}>
              <div className="visualize__canvas_controls">
                {
                  visualizeSettingsData.CONTROLS.map((control, index) => {
                    return (
                      <button
                        className={`visualize__canvas_control ${control.name}`}
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
                width={canvasSize}
                height={canvasSize}
                className="visualize__canvas canvas__stage"
              >
                <Layer
                  className={`canvas__grid_layer`}
                >
                  <URLImage
                    src={'./assets/images/perspective-grid.png'}
                    isDraggable={false}
                    className={`canvas__grid`}
                  />
                </Layer>
                <Layer
                  className={`canvas__interactables_layer`}
                >
                  {
                    canvasImages.map((canvasImage, index) => {
                      return (
                        <URLImage
                          src={`${canvasImage.image}`}
                          zIndex={canvasImage.zIndex}
                          isInteractable={activeCanvasImageIndex === index}
                          className={`canvas__interactable`}
                          key={`canvas__interactable--${canvasImage.object}_${index}`}
                        />
                      )
                    })
                  }
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
                          key={`visualize__image--${imageItem.title}`}
                          onClick={() => {
                            this.handleVisualizeImageClick(imageItem)
                          }}
                        >
                          <img src={`${imageItem.image}`} alt={imageItem.title} className="visualize__image" />
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