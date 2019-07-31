import './Redesign.scss';

import { dataStore, userState } from '../../store';

import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'
import _ from 'lodash';
import { redesignSettingsData } from '../../data/dev_data';
import { view } from 'react-easy-state';

let introAnimTimeout;

class Redesign extends React.Component {



  state = {
    data: null, //will hold data passed from the inspiration screen
    activeObject: null, //will hold the currently selected object
    activeObjective: null, //will hold the currently selected objective
    objects: null, //will hold active random subset of objects
    objectives: null, //will hold active random subset of objectives
    isInWriteMode: false, //true when user chooses to write their own objective
    objectsAreLoaded: false, //when object images have finished loading
    introAnimComplete: false, //true when objects have animated in (after successfully loading)
  }

  constructor(props) {
    super(props);
    this.handleWriteObjectiveType = this.handleWriteObjectiveType.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.objects && this.state.objects) {
      this.loadObjectImages();
    }
  }

  componentDidMount() {
    //const { id } = this.props.match.params
    const { inspirationData } = userState;
    this.setState({
      data: inspirationData,
      objectives: _.sampleSize(dataStore.objectivesData, redesignSettingsData.SAMPLE_SIZE),
      objects: _.sampleSize(dataStore.objectsData, redesignSettingsData.SAMPLE_SIZE),
      numObjectsLoaded: 0,
    });

  }

  componentWillUnmount(){
    if (introAnimTimeout){
      clearTimeout(introAnimTimeout);
    }
  }

  loadObjectImages = () => {
    this.state.objects.map((object, index) => {
      const objectImage = new Image();
      objectImage.src = object.image.fields.file.url;
      objectImage.addEventListener('load', () => {
        const newNumObjects = this.state.numObjectsLoaded + 1;
        const objectsAreLoaded = newNumObjects >= redesignSettingsData.SAMPLE_SIZE;
        this.setState({
          numObjectsLoaded: newNumObjects,
          objectsAreLoaded: objectsAreLoaded,
        });

        if (objectsAreLoaded){
          introAnimTimeout = setTimeout(()=>{
            this.setState({
              introAnimComplete: true,
            });
          },redesignSettingsData.SAMPLE_SIZE* redesignSettingsData.TRANSITION_DELAY_INCREMENT)
        }

      });
    });
  }

  handleWriteObjectiveType(event) {
    const writtenObjective = {
      "id": Math.floor(Math.random() * Math.floor(100000)), //TODO: find a way to ensure this is unique
      "title": event.target.value,
    }
    this.setState({
      activeObjective: writtenObjective,
    });
  }

  handleObjectClick = (object) => {
    const { activeObject } = this.state;
    if (activeObject !== null) {
      if (object.slug === this.state.activeObject.slug) {
        this.setState({
          activeObject: null,
        });
      } else {
        this.setState({
          activeObject: object,
        });
      }
    } else {
      this.setState({
        activeObject: object,
      });
    }


  }

  handleObjectiveClick = (objective) => {
    const { activeObjective } = this.state;
    if (activeObjective !== null) {
      if (objective.slug === this.state.activeObjective.slug) {
        this.setState({
          activeObjective: null,
        });
      } else {
        this.setState({
          activeObjective: objective,
        });
      }
    } else {
      this.setState({
        activeObjective: objective,
      });
    }


  }

  handleLoadMoreObjectivesClick = () => {
    this.setState({
      objectives: _.sampleSize(dataStore.objectivesData, redesignSettingsData.SAMPLE_SIZE),
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
    const { activeObject, activeObjective } = this.state;
    userState.objectData = _.cloneDeep(activeObject); //MH not sure if we need deep clone here or not
    userState.objectiveData = _.cloneDeep(activeObjective); //MH not sure if we need deep clone here or not
    this.props.history.push(`/visualize`)
  }

  render() {

    const { data, objects, objectives, activeObjective, activeObject, isInWriteMode, objectsAreLoaded, introAnimComplete } = this.state;

    if (!data) {
      return (
        <div
          className="loading"
        >
          LOADING
        </div>
      )
    }

    return (
      <div className="redesign app_screen">
        <main>
          <section className="redesign__inspiration_section ctnr">
            <div className="row">
              <div className="redesign__inspiration_title_container middle-md col-xs-4">
                <h1 className="redesign__inspiration_title">{dataStore.siteData.redesignInspirationText}</h1>
              </div>
              <div className="redesign__choice_container col-xs-6 col-xs-offset-2">
                <div className={`redesign__choice center-xs ${objectsAreLoaded ? 'active' : ''}`}>
                  <img
                    src={`https:${data.image.fields.file.url}?w=${redesignSettingsData.INSPIRATION_WIDTH}&q=${redesignSettingsData.IMAGE_QUALITY}`}
                    alt={data.title}
                    className="redesign__choice_image"
                  />
                  <div className="redesign__choice_content">
                    <h2 className="redesign__choice_title">{data.title}</h2>
                    <span className="redesign__choice_text">
                      {`${dataStore.siteData.visualizeLead} ${data.object} ${dataStore.siteData.visualizeSublead}${data.objective}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="redesign__objects_section ctnr">
            <h3 className="redesign__objects_title">{`${dataStore.siteData.redesignObjectsTitle} ${activeObject !== null ? activeObject.title : ''}`}</h3>
            <ScrollContainer
              className={`redesign__objects_container ${objectsAreLoaded ? 'active' : ''}`}
            >
              {objects.map((object, index) => {

                const transitionDelay = introAnimComplete ? '0ms' : `${index*redesignSettingsData.TRANSITION_DELAY_INCREMENT}ms`

                return (
                  <div
                    className={`redesign__object_container ${activeObject !== null && activeObject.slug === object.slug ? 'active' : ''}`}
                    key={`redesign__object--${object.slug}`}
                    onClick={() => {
                      this.handleObjectClick(object)
                    }}
                    style={{
                      transitionDelay: transitionDelay
                    }}
                  >
                    <img
                      src={`https:${object.image.fields.file.url}?w=${redesignSettingsData.OBJECT_WIDTH}&q=${redesignSettingsData.IMAGE_QUALITY}`}
                      alt={object.title}
                      className="redesign__object_image"
                    />
                    <h4 className="redesign__object_text">{object.title}</h4>
                  </div>
                )
              })}

            </ScrollContainer>
          </section>
          <section className="redesign__objectives_section ctnr">
            <h3 className="redesign__objectives_title">{dataStore.siteData.redesignObjectivesTitle}</h3>
            <div className="redesign__objectives_container row">
              {
                !isInWriteMode ? (
                  <ScrollContainer
                    className="redesign__objectives col-xs-8"
                    vertical={true}
                    horizontal={false}
                    hideScrollbars={true}
                  >
                    {
                      objectives.map((objective, index) => {
                        return (
                          <div
                            className={`redesign__objective ${activeObjective !== null && activeObjective.slug === objective.slug ? 'active' : ''}`}
                            key={`redesign__objective--${objective.slug}`}
                            onClick={() => { this.handleObjectiveClick(objective) }}
                          >
                            {objective.title}
                          </div>
                        )
                      })
                    }
                  </ScrollContainer>
                ) : (
                    <div className="redesign__objective_input_container col-xs-8">
                      <input
                        type="text"
                        className="redesign__objective_input"
                        placeholder={dataStore.siteData.redesignObjectiveInputPlaceholder}
                        onChange={this.handleWriteObjectiveType}
                      />
                    </div>
                  )
              }

              <div className="redesign__objectives_divider_container col-xs-1">
                <div className="redesign__objectives_divider"></div>
              </div>
              <div className="redesign__objectives_more_container col-xs-3">
                {
                  !isInWriteMode &&

                  <button
                    className="button button--rounded button--md redesign__objectives_more_button"
                    onClick={this.handleLoadMoreObjectivesClick}
                  >
                    {dataStore.siteData.redesignMoreButtonLabel}
                  </button>
                }
                {
                  isInWriteMode ? (
                    <button
                      className="button button--rounded button--md redesign__objectives_help_button"
                      onClick={this.handleHelpChooseClick}
                    >
                      {dataStore.siteData.redesignObjectiveHelpChooseText}
                    </button>
                  ) : (
                      <button
                        className="button button--rounded button--md redesign__objectives_write_button"
                        onClick={this.handleWriteObjectiveClick}
                      >
                        {dataStore.siteData.redesignObjectiveUserSubmitText}
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
              {dataStore.siteData.redesignContinueButtonLabel}
            </button>
          </div>
        </main>
      </div>
    )
  }
}

export default view(Redesign);