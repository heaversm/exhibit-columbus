import './Vision.scss';

import React from 'react';
import _ from 'lodash';
import { view } from 'react-easy-state';
import { visionData } from '../../data/dev_data';

class Vision extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {}

  render() {
    const { index, data } = this.props;

    const level = Math.ceil(index/visionData.DIVISIONS);
    const levelScaleBase = Math.pow(visionData.SCALE_BASE,level);
    const levelScaleVariance = visionData.SCALE_BASE_VARIANCE/level;
    const levelRotation = visionData.GROUP_ROTATIONS[level-1];
    const levelTranslation = visionData.GROUP_TRANSLATIONS[level-1];
    
    const curScale = _.random(levelScaleBase-levelScaleVariance,levelScaleBase+levelScaleVariance);
    //const dataRotation = data.rotation ? data.rotation : 60; //to get rotation from data file e.g transform: `rotate(${-index * dataRotation}deg)`
    
    return (

      <div
        className="vision__rotator"
        style={{
          transform: `rotate(${index * levelRotation}deg)`
        }}
      >
        <div
          className="vision__positioner"
          style={{
            transform: `translateX(${levelTranslation}px)`
          }}
        >
          <div 
            className="vision__reverser"
            style={{
              transform: `rotate(${-index * levelRotation}deg)`
            }}
          >
            <div className="vision__container"
              style={{
                transform: `translate(-50%,-50%) scale(${curScale})`
              }}
            >
              <img
                className="vision__image"
                src={`./assets/images/temp/${data.image}`}
                alt="Inspiration"
              />
              <div className="vision__content_container">
                <div className="vision__content">
                  <p className="vision">
                    {data.text}
                    <span className="vision__author">{data.author}</span>
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