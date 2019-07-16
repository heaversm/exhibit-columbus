/* eslint-disable */

import './Home.scss';

import { siteData, visionsData } from '../../data/site_data';

import { Link } from 'react-router-dom';
import React from 'react';
import { Vision } from '../../components';
import { homeData } from '../../data/dev_data';
import { view } from 'react-easy-state';

let visionSelectorInterval = null;

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    numVisions: visionsData.length
  }

  state = {
    activeVisionIndex: 0,
  }
  

  componentDidMount(){

    visionSelectorInterval = setInterval(()=>{
      this.selectNewVision();
    },homeData.SELECTION_INTERVAL);
  }

  componentWillUnmount(){
    clearInterval(visionSelectorInterval);
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
              <h1 className="home__title">{siteData.introTitle}</h1>
              <Link className="home__continue_button button button--rounded" to="/inspiration">{siteData.introContinueButtonText}</Link>
            </div>
          </div>
        </section>
        <section className="home__visions_container">
          <div className="home__visions_positioner">
            {
              
              visionsData.map((vision, index) => {
                const isActive = this.state.activeVisionIndex === index;

                return (
                  <Vision
                    index={index}
                    key={`vision--${index}`}
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