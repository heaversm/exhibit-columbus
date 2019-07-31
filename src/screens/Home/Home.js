/* eslint-disable */

import './Home.scss';

import { Link } from 'react-router-dom';
import React from 'react';
import { Vision } from '../../components';
import { dataStore } from '../../store';
import { homeData } from '../../data/dev_data';
import { view } from 'react-easy-state';

let visionSelectorInterval, outroTimeout;

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
    visionsAreLoaded: false,
    numVisionsLoaded: 0,
    doOutro: false, //when true, perform outgoing animation
  }

  componentDidMount(){
    this.setState({
      visions: _.sampleSize(dataStore.visionsData,homeData.NUM_VISIONS)
    });
  }

  componentWillUnmount(){
    if (visionSelectorInterval){
      clearInterval(visionSelectorInterval);
    }

    if (outroTimeout){
      clearInterval(outroTimeout);
    }
  }

  componentDidUpdate(prevProps,prevState){
    if (!prevState.visions && this.state.visions){
      this.loadVisionImages();
      this.setVisionSelectionInterval();
    }
  }

  loadVisionImages = ()=>{
    this.state.visions.map((vision, index) => {
        const visionImage = new Image();
        visionImage.src = vision.image.fields.file.url;
        visionImage.addEventListener('load', ()=> {
          const newNumVisions = this.state.numVisionsLoaded+1;
          const visionsAreLoaded = newNumVisions >= homeData.NUM_VISIONS;
          this.setState({
            numVisionsLoaded: newNumVisions,
            visionsAreLoaded: visionsAreLoaded,
          });
      });
    });
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

  handleContinueButtonClick = ()=>{
    
    this.setState({
      doOutro: true,
    });
    outroTimeout = setTimeout(()=>{
      this.props.history.push('/inspiration');
    },homeData.NUM_VISIONS * homeData.TRANSITION_DELAY_INCREMENT);
  }

  render() {

    const {visionsAreLoaded, visions, doOutro} = this.state;

    if (!dataStore.visionsData || !visions){
      return (
        <div className="loading">Loading</div>
      )
    }

    return (
      <main className={`Home app_screen`}>
        <section className={`home__title_container ctnr ${!doOutro && visionsAreLoaded ? 'active' : ''}`}>
          <div className="row center-xs">
            <div className="col-xs-6">
              <h1 className="home__title">{dataStore.siteData.introTitle}</h1>
              <div 
                className="home__continue_button button button--rounded"
                onClick={this.handleContinueButtonClick}
              >
                {dataStore.siteData.introContinueButtonText}
              </div>
            </div>
          </div>
        </section>
        <section className={`home__visions_container ${visionsAreLoaded ? 'active' : ''}`}>
          <div className="home__visions_positioner">
            {
              
              visions.map((vision, index) => {
                const isActive = this.state.activeVisionIndex === index;

                return (
                  <Vision
                    index={index}
                    key={`vision--${vision.slug}`}
                    data={vision}
                    isActive={isActive}
                    doOutro={doOutro}
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