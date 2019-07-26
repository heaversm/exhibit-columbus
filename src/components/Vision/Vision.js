import './Vision.scss';

import React from 'react';
import _ from 'lodash';
import { dataStore } from '../../store';
import { view } from 'react-easy-state';
import { visionData } from '../../data/dev_data';

class Vision extends React.Component {

  state = {}

  render() {
    const { index, data, isActive } = this.props;

    const level = Math.ceil((index+1)/visionData.DIVISIONS); //current group of visions
    const levelScaleBase = Math.pow(visionData.SCALE_BASE,level); //base scale per group
    const levelScaleVariance = visionData.SCALE_BASE_VARIANCE/level; //amount the scale can vary for this group
    const levelRotation = visionData.GROUP_ROTATIONS[level-1]; //rotation for this group
    const levelTranslation = visionData.GROUP_TRANSLATIONS[level-1]; //base translation for this group
    
    const curTranslation = _.random(levelTranslation-visionData.GROUP_TRANSLATIONS_VARIANCE, levelTranslation+visionData.GROUP_TRANSLATIONS_VARIANCE); //translation amount for this particular item
    const curScale = _.random(levelScaleBase-levelScaleVariance,levelScaleBase+levelScaleVariance); //scale amount for this particular item
    return (

      <div
        className={`vision__rotator ${isActive ? 'active' : ''}`}
        style={{
          transform: `rotate(${index * levelRotation}deg)`
        }}
      >
        <div
          className="vision__positioner"
          style={{
            transform: `translateX(${isActive ? 0 : curTranslation}px)`
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
                transform: `translate(-50%,-50%) scale(${isActive ? 1 : curScale})`
              }}
            >
              <img
                className="vision__image"
                src={`https:${data.image.fields.file.url}?w=${visionData.VISION_WIDTH}&q=${visionData.VISION_QUALITY}`}
                alt="Vision"
              />
              <div className="vision__content_container">
                <div className="vision__content">
                  <p className="vision">
                    {dataStore.siteData.visualizeLead} {data.object} {dataStore.siteData.visualizeSublead}  {data.objective}
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