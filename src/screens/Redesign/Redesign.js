import './Redesign.scss';

//import { Template } from '../../components';
import { objectivesData, objectsData, siteData } from '../../data/site_data';

import { Link } from 'react-router-dom';
import React from 'react';
import _ from 'lodash';
import { redesignSettingsData } from '../../data/dev_data';
import { view } from 'react-easy-state';

class Redesign extends React.Component {



  state = {
    data: null, //will hold data passed from the inspiration screen
    activeObject: null, //will hold the currently selected object
    activeObjective: null, //will hold the currently selected objective
    objects: null, //will hold active random subset of objects
    objectives: null, //will hold active random subset of objectives
    isInWriteMode: false, //true when user chooses to write their own objective
  }

  constructor(props) {
    super(props);
    this.handleWriteObjectiveType = this.handleWriteObjectiveType.bind(this);
  }

  componentDidMount() {
    //const { id } = this.props.match.params
    const { data } = this.props.location.state;
    this.setState({
      data: data,
      objectives: _.sampleSize(objectivesData, redesignSettingsData.SAMPLE_SIZE),
      objects: _.sampleSize(objectsData, redesignSettingsData.SAMPLE_SIZE),
    });

  }

  handleWriteObjectiveType(event) {
    this.setState({
      activeObjective: event.target.value,
    });
  }

  handleObjectClick = (id) => {
    if (id === this.state.activeObject) {
      this.setState({
        activeObject: null,
      });
    } else {
      this.setState({
        activeObject: id,
      });
    }

  }

  handleObjectiveClick = (id) => {
    if (id === this.state.activeObjective) {
      this.setState({
        activeObjective: null,
      });
    } else {
      this.setState({
        activeObjective: id,
      });
    }

  }

  handleLoadMoreObjectivesClick = () => {
    this.setState({
      objectives: _.sampleSize(objectivesData, redesignSettingsData.SAMPLE_SIZE),
      activeObjective: null,
    });
  }

  handleHelpChooseClick = () => {
    this.setState({
      activeObjective: null,
      isInWriteMode: false,
    });
  }

  handleWriteObjectiveClick = () => {
    this.setState({
      activeObjective: null,
      isInWriteMode: true,
    });
  }

  handleVisualizeClick = () => {
    console.log(this.state);
  }

  render() {

    const { data, objects, objectives, activeObjective, activeObject, isInWriteMode } = this.state;
    let activeObjectData = null;

    if (objects !== null && activeObject !== null){
      activeObjectData = objects.find(object => object.id === activeObject);
    }

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
                    <img src={`/assets/images/temp/inspirations/${data.image}`} alt={data.title} className="redesign__choice_image" />
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
              <h3 className="redesign__objects_title">{`${siteData.redesignObjectsTitle} ${activeObjectData !== null ? activeObjectData.title : ''}`}</h3>
              <div className="redesign__objects_container">
                {objects.map((object, index) => {
                  return (
                    <div
                      className={`redesign__object_container ${activeObject === object.id ? 'active' : ''}`}
                      key={`redesign__object--${index}`}
                      onClick={() => {
                        this.handleObjectClick(object.id)
                      }}
                    >
                      <img
                        src={`/assets/images/temp/objects/${object.image}`}
                        alt={object.title}
                        className="redesign__object_image"
                      />
                      <h4 className="redesign__object_text">{object.title}</h4>
                    </div>
                  )
                })}

              </div>
            </section>
            <section className="redesign__objectives_section ctnr">
              <h3 className="redesign__objectives_title">{siteData.redesignObjectivesTitle}</h3>
              <div className="redesign__objectives_container row">
                {
                  !isInWriteMode ? (
                    <div className="redesign__objectives col-md-8">
                      {
                        objectives.map((objective, index) => {
                          return (
                            <div
                              className={`redesign__objective ${objective.id === activeObjective ? 'active' : ''}`}
                              key={`redesign__objective--${index}`}
                              onClick={() => { this.handleObjectiveClick(objective.id) }}
                            >
                              {objective.title}
                            </div>
                          )
                        })
                      }
                    </div>
                  ) : (
                      <div className="redesign__objective_input_container col-md-8">
                        <input
                          type="text"
                          className="redesign__objective_input"
                          placeholder={siteData.redesignObjectiveInputPlaceholder}
                          onChange={this.handleWriteObjectiveType}
                        />
                      </div>
                    )
                }

                <div className="redesign__objectives_divider_container col-md-1">
                  <div className="redesign__objectives_divider"></div>
                </div>
                <div className="redesign__objectives_more_container col-md-3">
                  {
                    !isInWriteMode &&

                    <button
                      className="button button--rounded button--md redesign__objectives_more_button"
                      onClick={this.handleLoadMoreObjectivesClick}
                    >
                      {siteData.redesignMoreButtonLabel}
                    </button>
                  }
                  {
                    isInWriteMode ? (
                      <button
                        className="button button--rounded button--md redesign__objectives_help_button"
                        onClick={this.handleHelpChooseClick}
                      >
                        {siteData.redesignObjectiveHelpChooseText}
                      </button>
                    ) : (
                        <button
                          className="button button--rounded button--md redesign__objectives_write_button"
                          onClick={this.handleWriteObjectiveClick}
                        >
                          {siteData.redesignObjectiveUserSubmitText}
                        </button>
                      )
                  }

                </div>
              </div>
            </section>
            <div className="redesign__visualize_section center-xs">
              <button
                className={`redesign__visualize_button button button--rounded button--lg ${activeObjective !== null && activeObject !== null ? 'active' : ''}`}
                onClick={this.handleVisualizeClick}
              >
                {siteData.redesignContinueButtonLabel}
              </button>
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