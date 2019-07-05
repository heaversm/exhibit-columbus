import './Vision.scss';

import React from 'react';
import { view } from 'react-easy-state';

class Vision extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {}

  render() {

    const { index, data } = this.props;
    const translateStr = `translateX(${data.translateX}px)`
    return (

      <div
        className="vision__rotator"
        style={{
          transform: `rotate(${index * 60}deg)`
        }}
      >
        <div
          className="vision__positioner"
          style={{
            transform: translateStr
          }}
        >
          <div 
            className="vision__reverser"
            style={{
              transform: `rotate(${-index * 60}deg)`
            }}
          >
            <div className="vision__container">
              <img
                className="vision__image"
                src="./assets/images/temp/inspiration.jpg"
                alt="Inspiration"
              />
              <div className="vision__content_container">
                <div className="vision__content">
                  <p className="vision">
                    Let's redesign parks to transport us to different spaces and times.
                    <span className="vision__author">Victor V.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default view(Vision);