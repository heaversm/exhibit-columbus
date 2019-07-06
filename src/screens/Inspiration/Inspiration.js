/* eslint-disable */

import './Inspiration.scss';

import { inspirationsData, siteData } from '../../data/site_data';

import { InspirationItem } from '../../components';
import { Link } from 'react-router-dom';
import React from 'react';
import { homeData } from '../../data/dev_data';
import { view } from 'react-easy-state';

class Inspiration extends React.Component {

  static defaultProps = {
    numInspirations: inspirationsData.length
  }

  state = {
    curInspirationIndex: -1,
  }

  handleInspirationItemClick = (index)=>{
    this.setState({
      curInspirationIndex: index
    })
  }

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
          <div className="inspiration__examples_positioner">
          {
              
              inspirationsData.map((inspiration, index) => {
                const isActive = this.state.curInspirationIndex === index;

                return (
                  <InspirationItem
                    index={index}
                    key={`inspiration--${index}`}
                    data={inspiration}
                    isActive={isActive}
                    onInspirationItemClick={this.handleInspirationItemClick}
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