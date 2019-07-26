import './InspirationItem.scss';

import React from 'react';
import _ from 'lodash';
import { dataStore } from '../../store';
import { inspirationSettingsData } from '../../data/dev_data';
import { view } from 'react-easy-state';

class InspirationItem extends React.Component {

  state = {}

  render() {
    const { index, data, isActive, onInspirationItemClick } = this.props;

    const level = Math.ceil((index + 1) / inspirationSettingsData.DIVISIONS); //current group of visions
    const levelScaleBase = Math.pow(inspirationSettingsData.SCALE_BASE, level); //base scale per group
    const levelScaleVariance = inspirationSettingsData.SCALE_BASE_VARIANCE / level; //amount the scale can vary for this group
    const levelRotation = inspirationSettingsData.GROUP_ROTATIONS[level - 1]; //rotation for this group
    const levelTranslation = inspirationSettingsData.GROUP_TRANSLATIONS[level - 1]; //base translation for this group

    const curTranslation = _.random(levelTranslation - inspirationSettingsData.GROUP_TRANSLATIONS_VARIANCE, levelTranslation + inspirationSettingsData.GROUP_TRANSLATIONS_VARIANCE); //translation amount for this particular item
    const curScale = _.random(levelScaleBase - levelScaleVariance, levelScaleBase + levelScaleVariance); //scale amount for this particular item
    return (

      <div
        className={`inspiration_item__rotator ${isActive ? 'active' : ''}`}
        style={{
          transform: `rotate(${index * levelRotation}deg)`
        }}
        onClick={() => { onInspirationItemClick(index) }}
      >
        <div
          className="inspiration_item__positioner"
          style={{
            transform: `translateX(${isActive ? 0 : curTranslation}px)`
          }}
        >
          <div
            className="inspiration_item__reverser"
            style={{
              transform: `rotate(${-index * levelRotation}deg)`
            }}
          >
            <div className="inspiration_item__container"
              style={{
                transform: `translate(-50%,-50%) scale(${isActive ? 1 : curScale})`
              }}
            >
              <img
                className="inspiration_item__image"
                src={`https:${data.image.fields.file.url}?w=${inspirationSettingsData.IMAGE_WIDTH}&q=${inspirationSettingsData.IMAGE_QUALITY}`}
                alt="Inspiration"
              />
              <div className="inspiration_item__title_container">
                <h2 className="inspiration_item__title">{data.title}</h2>
              </div>
              <div className="inspiration_item__content_container">
                <div className="inspiration_item__content">
                  <h3 className="inspiration_item__choice_title">{data.title}</h3>
                  <p className="inspiration_item__choice_text">{data.description}</p>
                  <p className="inspiration_item__choice_source">{data.location}</p>
                  <button 
                    className="button button--rounded inspiration_item__choice_button"
                    onClick={()=>{
                      this.props.onInspirationSelectClick(data);
                    }}
                  >{dataStore.siteData.inspirationSelectButtonText}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default view(InspirationItem);