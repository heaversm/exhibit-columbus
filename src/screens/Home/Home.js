/* eslint-disable */

import './Home.scss';

import { Link } from 'react-router-dom';
import React from 'react';
import { Vision } from '../../components';
import { homeData } from '../../data/dev_data';
import { siteData } from '../../data/site_data';
import { view } from 'react-easy-state';

let visionSelectorInterval = null;

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    numVisions: siteData.visions.length
  }

  state = {
    curVisionIndex: 0,
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
      curVisionIndex: newVisionIndex
    })
  }
  

  render() {

    return (
      <div className="Home app_screen">
        <div className="home__title_container ctnr">
          <div className="row center-xs">
            <div className="col-xs-6">
              <h1 className="home__title">{siteData.introTitle}</h1>
            </div>
          </div>

        </div>
        <div className="home__continue_container center-xs">
          <Link className="home__continue_button button button--rounded" to="/inspiration">{siteData.introContinueButtonText}</Link>
        </div>
        <div className="home__visions_container">
          <div className="home__visions_positioner">
            {
              
              siteData.visions.map((vision, index) => {
                const isActive = this.state.curVisionIndex === index;

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
        </div>
      </div>
    )
  }
}

export default view(Home);