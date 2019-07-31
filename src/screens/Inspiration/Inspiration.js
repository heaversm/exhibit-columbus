/* eslint-disable */

import './Inspiration.scss';

import { dataStore, userState } from '../../store';

import { InspirationItem } from '../../components';
import { Link } from 'react-router-dom';
import React from 'react';
import { inspirationSettingsData } from '../../data/dev_data';
import { view } from 'react-easy-state';

let outroTimeout, introTimeout;

class Inspiration extends React.Component {

  state = {
    activeInspirationIndex: -1,
    activeInspirations: null,
    doIntro: false, //when true, do intro
    doOutro: false, //when true, user has selected an inspiration and is moving on to the next step
  }

  componentDidMount(){
    this.state.activeInspirations = _.sampleSize(dataStore.inspirationsData,inspirationSettingsData.DIVISIONS);
    this.forceUpdate();
    introTimeout = setTimeout(()=>{
      const {doIntro} = this.state;
      this.setState({
        doIntro: true
      });
    },1000);
  }
  
  componentWillUnmount(){
    if (outroTimeout){
      clearTimeout(outroTimeout);
    }

    if (introTimeout){
      clearTimeout(introTimeout);
    }
  }

  handleInspirationItemClick = (index)=>{
    this.setState({
      activeInspirationIndex: index
    })
  }

  handleInspirationSelectClick = (data)=>{
    userState.inspirationData = data;
    
    this.setState({
      doOutro: true,
      doIntro: false,
    });
    outroTimeout = setTimeout(()=>{
      this.props.history.push(`/redesign`)
    },inspirationSettingsData.DIVISIONS*inspirationSettingsData.TRANSITION_DELAY_INCREMENT);
  }

  render() {

    const {activeInspirations, activeInspirationIndex, doOutro, doIntro} = this.state;

    if (!activeInspirations){
      return (<div className="loading">Loading</div>)
    }

    return (
      <main className="Inspiration app_screen">
        <section className={`inspiration__title_container ctnr ${doIntro ? 'active' : ''}`}>
          <div className="row center-xs">
            <div className="col-xs-6">
              <h1 className="inspiration__title">{dataStore.siteData.inspirationTitle}</h1>
            </div>
          </div>
        </section>
        <section className="inspiration__examples_container">
          <div className="inspiration__examples_positioner">
          {
              
              activeInspirations.map((inspiration, index) => {
                const isActive = activeInspirationIndex === index;

                return (
                  <InspirationItem
                    index={index}
                    key={`inspiration--${inspiration.slug}`}
                    data={inspiration}
                    isActive={isActive}
                    onInspirationItemClick={this.handleInspirationItemClick}
                    onInspirationSelectClick={this.handleInspirationSelectClick}
                    doOutro={doOutro}
                  />
                )
              }
            )}
          </div>
        </section>
        <div className="inspiration__choice_container">
          <h3 className="inspiration__choice_title"></h3>
          <p className="inspiration__choice_text"></p>
          <p className="inspiration__choice_source"></p>
        </div>

      </main>
    )
  }
}

export default view(Inspiration);