/* eslint-disable */

import './Inspiration.scss';

import { dataStore, userState } from '../../store';

import { InspirationItem } from '../../components';
import { Link } from 'react-router-dom';
import React from 'react';
import { inspirationSettingsData } from '../../data/dev_data';
import { view } from 'react-easy-state';

class Inspiration extends React.Component {

  state = {
    activeInspirationIndex: -1,
    activeInspirations: null,
  }

  componentDidMount(){
    this.state.activeInspirations = _.sampleSize(dataStore.inspirationsData,inspirationSettingsData.DIVISIONS);
    this.forceUpdate();
  }
  


  handleInspirationItemClick = (index)=>{
    this.setState({
      activeInspirationIndex: index
    })
  }

  handleInspirationSelectClick = (data)=>{
    userState.inspirationData = data;
    this.props.history.push(`/redesign`)
  }

  render() {

    const {activeInspirations, activeInspirationIndex} = this.state;
    console.log(activeInspirations);

    if (!activeInspirations){
      return (<div>Loading</div>)
    }

    return (
      <main className="Inspiration app_screen">
        <section className="inspiration__title_container ctnr">
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