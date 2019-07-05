/* eslint-disable */

import './Home.scss';

import { Link } from 'react-router-dom';
import React from 'react';
import { Vision } from '../../components';
import { siteData } from '../../data/site_data';
import { view } from 'react-easy-state';

const visions = [
  {
    "translateX": 150,
  },
  {
    "translateX": 150,
  },
  {
    "translateX": 150,
  },
  {
    "translateX": 150,
  },

  {
    "translateX": 150,
  },
  {
    "translateX": 150,
  },
];

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
            </div>
          </div>

        </div>
        <div className="home__continue_container center-xs">
          <Link className="home__continue_button button button--rounded" to="/inspiration">{siteData.introContinueButtonText}</Link>
        </div>
        <div className="home__visions_container">
          <div className="home__visions_positioner">
            {visions.map((vision, index) => {
              return (
                <Vision
                  index={index}
                  key={`vision--${index}`}
                  data={visions[index]}
                />
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default view(Home);