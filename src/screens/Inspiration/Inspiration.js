/* eslint-disable */

import './Inspiration.scss';

import { Link } from 'react-router-dom';
import React from 'react';
//import p5 from 'p5';
//import { Template } from '../../components';
import { siteData } from '../../data/site_data';
import { view } from 'react-easy-state';

class Inspiration extends React.Component {

  state = {}

  render() {

    return (
      <main className="Inspiration app_screen">
        <section className="inspiration__title_container ctnr">
          <div className="row center-xs">
            <div className="col-xs-6">
              <h1 className="inspiration__title">{siteData.inspirationTitle}</h1>
            </div>
          </div>
        </section>
        <section className="inspiration__examples_container">
          <div className="inspiration__example_container">
            <img src="" alt="" className="inspiration__example_image" />
            <h2 className="inspiration__example_title"></h2>
          </div>
        </section>
        <div className="inspiration__choice_container">
          <h3 className="inspiration__choice_title"></h3>
          <p className="inspiration__choice_text"></p>
          <p className="inspiration__choice_source"></p>
        </div>
        <div className="inspiration__select_container">
          <Link to="/redesign" className="inspiration__select_choice">{siteData.inspirationSelectButtonLabel}</Link>
        </div>
      </main>
    )
  }
}

export default view(Inspiration);