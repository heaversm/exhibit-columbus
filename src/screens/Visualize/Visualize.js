import './Visualize.scss';

import { siteData, visualizeData } from '../../data/site_data';
import { visualizeInstructionsData, visualizeSettingsData } from '../../data/dev_data';

import React from 'react';
import SVG from 'react-inlinesvg';
import { userState } from '../../store';
import { view } from 'react-easy-state';

class Visualize extends React.Component {

  constructor(props) {
    super(props);
    this.handleSignatureChange = this.handleSignatureChange.bind(this);
  }

  state = {
    signModalActive: false, //when true, show sign modal
    activeImageCategory: visualizeSettingsData.CATEGORIES[0], //fills with the name of the selected images category
    activeImage: null, //fills with the data of the selected image item from the activeImageCategory
    helpActive: false, //true when we are showing the help modal
    isProcessing: false, //true when we have click sign and send or skip buttons
    signature: '', //fills with the value of the signature input field
  }

  componentDidMount() {
    window.canvasInstance.init(userState.objectData);
    this.addMutationObserver();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isProcessing && this.state.isProcessing) {
      this.handleCanvasSave();
    }
  }

  addMutationObserver = () => {
    //Start watching for new specific nodes in outside app that contain class 'post_about_cat'
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const newNodes = mutation.addedNodes;
        newNodes.forEach(node => {
          console.log(node);
          if (node.classList && node.classList.contains('visualize__collage_image')) {
            //collage has been created, hide the modal
            this.handleCollageImageCreated();
          }
        });
      });
    });
    mutationObserver.observe(document.querySelector('.visualize__canvas_image_container'), {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: true,
      attributeOldValue: false,
      characterDataOldValue: false
    });
  }

  handleSignatureChange(event) {
    this.setState({ signature: event.target.value });
  }

  handleCanvasSave = () => {
    const {signature,} = this.state;
    let visualizeSentence;
    if (userState.objectData && userState.objectiveData) {
      visualizeSentence = `${siteData.visualizeLead}${userState.objectData.title}${siteData.visualizeSublead}${userState.objectiveData.title}`;
    } else {
      visualizeSentence = 'blank'
    }
    let userMetadata = {
      "goal": visualizeSentence,
      "signature": signature && signature !== '' ? signature : 'anonymous',
    }
    window.canvasInstance.onSaveClick(userMetadata);
  }

  handleCollageImageCreated = () => {
    this.setState({
      isProcessing: false,
      signModalActive: false,
    });
  }

  handleVisualizeContinueClick = () => {
    this.toggleSignModal(true)
  }

  handleSignatureCancel = ()=>{
    this.toggleSignModal(false);
  }

  handleVisualizeSignClick = () => {
    this.setState({
      isProcessing: true,
    });
  }

  handleVisualizeSkipClick = () => {
    this.setState({
      isProcessing: true,
      signature: '',
    });
  }

  toggleSignModal(doShow) {
    this.setState({
      signModalActive: doShow,
    });
  }

  handleVisualizeCategoryClick = (visualizeCategory) => {
    this.setState({
      activeImageCategory: visualizeCategory
    });
  }

  handleVisualizeImageClick = (visualizeImage) => {
    //add image to canvas
  }

  render() {

    const { signModalActive, activeImageCategory, activeImage, isProcessing, signature } = this.state;

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
            <div className={`visualize__canvas_container`}>
              <div className="visualize__canvas_controls canvas-controls">
                {
                  visualizeSettingsData.CONTROLS.map((control, index) => {
                    return (
                      <button
                        className={`visualize__canvas_control ${control.name} ${control.initalState ? control.initalState : ''}`}
                        key={`visualize__canvas_control--${index}`}
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
              <div className="visualize__canvas">
                <canvas
                  id="collageCanvas"
                  className="collage-canvas visualize__collage_canvas"
                  width="640"
                  height="640"
                />
                <div className="visualize__canvas_image_container"></div>
              </div>

            </div>
            <div className="visualize__debugger"></div>
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
                {
                  visualizeSettingsData.CATEGORIES.map((category, index) => {
                    return (
                      <div
                        className={`visualize__images ${category} ${activeImageCategory === category ? 'active' : ''}`}
                        key={`visualize__images--${category}`}
                      >
                        {
                          visualizeData[category].map((imageItem, index) => {
                            return (
                              <div
                                className={`visualize__image_container ${activeImage && activeImage.title === imageItem.title ? 'active' : ''}`}
                                key={`visualize__image--${imageItem.title}`}
                              // onClick={() => {
                              //   this.handleVisualizeImageClick(imageItem)
                              // }}
                              >
                                <img
                                  src={`${imageItem.image}`}
                                  alt={imageItem.title}
                                  className="visualize__image image-button"
                                  data-type={activeImageCategory}
                                  data-id={`${activeImageCategory}-${imageItem.id}`}
                                />
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }

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
          <div className="visualize__help_modal_container modal__container">
            <div className="modal__bg"></div>
            <div className="visualize__instructions_container visualize__instructions_container--controls">
              <ul className="visualize__instructions_list right-xs">
                {

                  visualizeSettingsData.CONTROLS.map((control, index) => {
                    if (!visualizeInstructionsData.controls[control.name]) {
                      return false;
                    }
                    return (
                      <li
                        className="visualize__instructions_item"
                        key={`visualize__instructions_item--${index}`}
                      >
                        {visualizeInstructionsData.controls[control.name]}
                      </li>
                    )
                  })
                }

              </ul>
            </div>
            <div className="visualize__instructions_container visualize__instructions_container--canvas">
              <ul className="visualize__instructions_list center-xs">
                {
                  visualizeInstructionsData.canvas.map((canvasInstruction, index) => {
                    return (
                      <li
                        className="visualize__instructions_item"
                        key={`visualize__instruction--${index}`}
                      >
                        {canvasInstruction}
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div className="visualize__instructions_container visualize__instructions_container--items">
              <ul className="visualize__instructions_list center-xs">
                {
                  visualizeInstructionsData.items.map((itemInstruction, index) => {
                    return (
                      <li
                        className="visualize__instructions_item"
                        key={`visualize__instruction--${index}`}
                      >
                        {itemInstruction}
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
          <div className={`visualize__sign_modal_container modal__container ${signModalActive ? 'active' : ''} ${isProcessing ? 'processing' : ''}`}>
            <div 
              className="modal__bg"
              onClick={this.handleSignatureCancel}
            />
            <div className="modal__content_container">
              <h2 className="visualize__sign_title">{siteData.visualizeSignTitle}</h2>

              <div className={`visualize__signature_container`}>
                <input
                  type="text"
                  className="visualize__signature_input"
                  value={signature}
                  placeholder={visualizeInstructionsData.signaturePlaceholder}
                  onChange={this.handleSignatureChange}
                />
              </div>
              <p
                className="visualize__processing_message"
              >
                {visualizeInstructionsData.processingMessage}
              </p>
              <div className="visualize__sign_buttons row between-md">
                <button
                  className="visualize__sign_button visualize__sign_button--send col-md-5 center-xs button"
                  onClick={() => {
                    this.handleVisualizeSignClick();
                  }}
                >
                  {siteData.visualizeContinueButtonLabel}
                </button>
                <button
                  className="visualize__sign_button visualize__sign_button--skip col-md-5 center-xs button"
                  onClick={() => {
                    this.handleVisualizeSkipClick();
                  }}
                >
                  {siteData.visualizeSkipButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div >
    )
  }
}

export default view(Visualize);