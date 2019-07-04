import './Home.scss';

import { Link, Route, BrowserRouter as Router } from 'react-router-dom';

import React from 'react';
//import { Template } from '../../components';
import { siteData } from '../../data/site_data';
import { view } from 'react-easy-state';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {}

  render() {

    return (
      <div className="Home app_screen">
        <div className="home__title_container ctnr">
          <div className="row center-xs">
            <div className="col-xs-6">
              <h1 className="home__title">{siteData.introTitle}</h1>
              <Link className="home__continue_button button button--rounded" to="/inspiration">{siteData.introContinueButtonText}</Link>
            </div>
          </div>
          
        </div>
        <div className="home__continue_container">
          
        </div>
        <div className="home__visions_container">

        </div>
      </div>
    )
  }
}

export default view(Home);