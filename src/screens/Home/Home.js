/* eslint-disable */

import './Home.scss';

import { Link } from 'react-router-dom';
import React from 'react';
import { Vision } from '../../components';
import { dataStore } from '../../store';
import { homeData } from '../../data/dev_data';
import { view } from 'react-easy-state';

let visionSelectorInterval = null;

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    numVisions: homeData.NUM_VISIONS,
  }

  state = {
    activeVisionIndex: 0,
    visions: null, //will hold the array of visions sampled from the dataStore
  }

  componentDidMount(){
    this.setState({
      visions: _.sampleSize(dataStore.visionsData,homeData.NUM_VISIONS)
    });
  }

  componentWillUnmount(){
    clearInterval(visionSelectorInterval);
  }

  componentDidUpdate(prevProps,prevState){
    if (!prevState.visions && this.state.visions){
      this.setVisionSelectionInterval();
    }
  }

  setVisionSelectionInterval = ()=>{
    visionSelectorInterval = setInterval(()=>{
      this.selectNewVision();
    },homeData.SELECTION_INTERVAL);
  }

  selectNewVision = ()=>{
    const {numVisions} = this.props;
    const newVisionIndex = _.random(0,numVisions-1);
    this.setState({
      activeVisionIndex: newVisionIndex
    })
  }
  

  render() {

    return (
      <main className="Home app_screen">
        <section className="home__title_container ctnr">
          <div className="row center-xs">
            <div className="col-xs-6">
              <h1 className="home__title">{dataStore.siteData.introTitle}</h1>
              <Link className="home__continue_button button button--rounded" to="/inspiration">{dataStore.siteData.introContinueButtonText}</Link>
            </div>
          </div>
        </section>
        <section className="home__visions_container">
          <div className="home__visions_positioner">
            {
              
              dataStore.visionsData.map((vision, index) => {
                const isActive = this.state.activeVisionIndex === index;

                return (
                  <Vision
                    index={index}
                    key={`vision--${vision.slug}`}
                    data={vision}
                    isActive={isActive}
                  />
                )
              }
            )}
          </div>
        </section>
      </main>
    )
  }
}

export default view(Home);