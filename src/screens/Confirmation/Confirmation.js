import './Confirmation.scss';

import { Link, Route, BrowserRouter as Router } from 'react-router-dom';

import React from 'react';
//import { Template } from '../../components';
import { siteData } from '../../data/site_data';
import { view } from 'react-easy-state';

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {}

  render() {

    return (
      <div className="Confirmation app_screen">
        <main>
          <div className="confirmation__title_container ctnr">
            <h1 className="confirmation__title">{siteData.confirmationTitle}</h1>
            <div className="confirmation__continue_container">
              <Link to="/">{siteData.confirmationContinueButtonText}</Link>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default view(Confirmation);