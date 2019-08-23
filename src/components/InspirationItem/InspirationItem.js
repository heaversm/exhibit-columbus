import './InspirationItem.scss';

import { appSettingsData, inspirationSettingsData } from '../../data/dev_data';
import { dataStore, userState } from '../../store';

import React from 'react';
import _ from 'lodash';
import { view } from 'react-easy-state';

let level, levelScaleBase, levelScaleVariance, levelRotation, levelTranslation;
let posTimeout, introAnimTimeout; //initial positions, intro animation timeouts

class InspirationItem extends React.Component {

  state = {
    introAnimComplete: false,
    curTranslation: 0,
    curScale: 0,
    curRotate: 0,
  }

  componentDidMount(){
    posTimeout = setTimeout(()=>{
      this.assignPositions();
    },1000)
    
  }

  componentWillUnmount(){
    if (posTimeout){
      clearTimeout(posTimeout);
    }
    if (introAnimTimeout){
      clearTimeout(introAnimTimeout);
    }
  }

  componentDidUpdate(prevProps,prevState){
    if (!prevProps.doOutro && this.props.doOutro){
      this.setState({
        curRotate: 0,
        curScale: 0
      });
    }
  }

  assignPositions = ()=>{
    const { index } = this.props;

    level = Math.ceil((index + 1) / inspirationSettingsData.DIVISIONS); //current group of visions
    levelScaleBase = Math.pow(userState.isPro ? inspirationSettingsData.SCALE_BASE : inspirationSettingsData.SCALE_BASE_SM, level); //base scale per group
    levelScaleVariance = inspirationSettingsData.SCALE_BASE_VARIANCE / level; //amount the scale can vary for this group
    levelRotation = inspirationSettingsData.GROUP_ROTATIONS[level - 1]; //rotation for this group
    levelTranslation = userState.isPro ? inspirationSettingsData.GROUP_TRANSLATIONS[level - 1] : inspirationSettingsData.GROUP_TRANSLATIONS_SM[level - 1]; //base translation for this group

    this.setState({
      curTranslation: _.random(levelTranslation - inspirationSettingsData.GROUP_TRANSLATIONS_VARIANCE, levelTranslation + inspirationSettingsData.GROUP_TRANSLATIONS_VARIANCE), //translation amount for this particular item
      curScale: _.random(levelScaleBase - levelScaleVariance, levelScaleBase + levelScaleVariance), //scale amount for this particular item
      curRotate: index * levelRotation,
    });

    introAnimTimeout = setTimeout(()=>{
      this.setState({
        introAnimComplete: true
      });
    },index * inspirationSettingsData.TRANSITION_DELAY_INCREMENT);

  }

  render() {
    const { index, data, isActive, onInspirationItemClick, doOutro } = this.props;
    const { introAnimComplete, curTranslation, curScale, curRotate} = this.state;
    const transitionDelay = introAnimComplete ? `0ms` : `${index * inspirationSettingsData.TRANSITION_DELAY_INCREMENT}ms`;

    let inspirationImage;
    
    if (data.image){
      inspirationImage = `https:${data.image.fields.file.url}?w=${inspirationSettingsData.IMAGE_WIDTH}&h=${inspirationSettingsData.IMAGE_WIDTH}&fit=fill&q=${inspirationSettingsData.IMAGE_QUALITY}`;
    } else {
      inspirationImage = 'assets/images/temp/inspiration.jpg';
    }

    return (

        <div
          className={`inspiration_item__rotator ${isActive ? 'active' : ''}`}
          style={{
            transform: `rotate(${curRotate}deg)`,
            transitionDelay: transitionDelay,
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
                transform: `rotate(${-curRotate}deg)`,
                transitionDelay: transitionDelay,
              }}
            >
              <div className="inspiration_item__container"
                style={{
                  transform: `translate(-50%,-50%) scale(${doOutro ? 0 : isActive ? 1 : curScale})`,
                  transitionDelay: transitionDelay,
                }}
              >
                <img
                  className="inspiration_item__image"
                  src={inspirationImage}
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
                      onClick={() => {
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