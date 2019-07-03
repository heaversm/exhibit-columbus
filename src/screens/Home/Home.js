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
        <div className="intro__title_container ctnr">
          <h1 className="intro__title">{siteData.introTitle}</h1>
          <div className="intro__continue_container">
            <Link to="/inspiration">{siteData.introContinueButtonText}</Link>
          </div>
          <div className="intro__visions_container">

          </div>
        </div>
      </div>
    )
  }
}

export default view(Home);