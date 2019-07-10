import './Redesign.scss';

//import { Template } from '../../components';
import { inspirationsData, objectivesData, siteData } from '../../data/site_data';

import { Link } from 'react-router-dom';
import React from 'react';
import { view } from 'react-easy-state';

/* eslint-disable */


class Redesign extends React.Component {

  state = {
    data: null,
    activeObjective: null,
  }

  componentDidMount() {
    //const { id } = this.props.match.params
    const { data } = this.props.location.state;
    this.setState({
      data: data
    })
  }

  renderObjectives = () => {

    const {activeObjective} = this.state;

    let objectives = []

    for (let i = 0; i < 10; i++) {
      const objectiveData = objectivesData[i];
      objectives.push(
        <div 
          className={`redesign__objective ${i === activeObjective ? 'active' : ''}`}
          key={`redesign__objective--${i}`}
          onClick={()=>{this.handleObjectiveClick(i)}}
        >
          {objectiveData.title}
        </div>
      )
    }
    return objectives
  }

  handleObjectiveClick = (index)=>{
    if (index === this.state.activeObjective){
      this.setState({
        activeObjective: null,
      });
    } else {
      this.setState({
        activeObjective: index,
      });
    }
    
  }

  render() {

    const { data, activeObjective } = this.state;

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
              <h3 className="redesign__objects_title">{siteData.redesignObjectsTitle}</h3>
              <div className="redesign__objects_container">
                {inspirationsData.map((inspiration, index) => {
                  return (
                    <div 
                      className="redesign__object_container"
                      key={`redesign__object--${index}`}
                    >
                      <img 
                        src={`/assets/images/temp/inspirations/${inspiration.image}`}
                        alt={inspiration.title} 
                        className="redesign__object_image" 
                      />
                      <h4 className="redesign__object_text">{inspiration.title}</h4>
                    </div>
                  )
                })}

              </div>
            </section>
            <section className="redesign__objectives_section ctnr">
              <h3 className="redesign__objectives_title">{siteData.redesignObjectivesTitle}</h3>
              <div className="redesign__objectives_container row">
                <div className="redesign__objectives col-md-8">
                  {this.renderObjectives()}
                </div>
                <div className="redesign__objectives_divider_container col-md-1">
                  <div className="redesign__objectives_divider"></div>
                </div>
                <div className="redesign__objectives_more_container col-md-3">
                  <button className="button button--rounded button--md redesign__objectives_more_button">{siteData.redesignMoreButtonLabel}</button>
                  <button className="button button--rounded button--md redesign__objectives_write_button">{siteData.redesignObjectiveUserSubmitText}</button>
                </div>
              </div>
            </section>
            <div className="redesign__visualize_section center-xs">
              <Link to="/visualize" className={`redesign__visualize_button button button--rounded button--lg ${activeObjective !== null ? 'active' : ''}`}>{siteData.redesignContinueButtonLabel}</Link>
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