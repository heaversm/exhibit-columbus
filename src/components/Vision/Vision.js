import './Vision.scss';

import React from 'react';
import _ from 'lodash';
import { dataStore } from '../../store';
import { view } from 'react-easy-state';
import { visionData } from '../../data/dev_data';

let level, levelScaleBase, levelScaleVariance, levelRotation, levelTranslation;

let posTimeout, introAnimTimeout; //initial positions, intro animation timeouts

class Vision extends React.Component {

  state = {
    curTranslation: 0,
    curScale: 0,
    introAnimComplete: false,
  }

  componentDidMount() {
    posTimeout = setTimeout(()=>{
      this.assignPositions();
    },1000); //MH - TODO - need a mmore dynamic method than this to assign positions
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
        curTranslation: 0,
        curScale: 0
      });
    }
  }

  assignPositions = () => {
    const { index } = this.props;
    

    level = Math.ceil((index + 1) / visionData.DIVISIONS); //current group of visions
    levelScaleBase = Math.pow(visionData.SCALE_BASE, level); //base scale per group
    levelScaleVariance = visionData.SCALE_BASE_VARIANCE / level; //amount the scale can vary for this group
    levelRotation = visionData.GROUP_ROTATIONS[level - 1]; //rotation for this group
    levelTranslation = visionData.GROUP_TRANSLATIONS[level - 1]; //base translation for this group

    this.setState({
      curTranslation: _.random(levelTranslation - visionData.GROUP_TRANSLATIONS_VARIANCE, levelTranslation + visionData.GROUP_TRANSLATIONS_VARIANCE), //translation amount for this particular item
      curScale: _.random(levelScaleBase - levelScaleVariance, levelScaleBase + levelScaleVariance) //scale amount for this particular item
    });

    introAnimTimeout = setTimeout(()=>{
      this.setState({
        introAnimComplete: true
      });
    },(index * visionData.TRANSITION_DELAY_INCREMENT))
  }

  render() {
    const { index, data, isActive, doOutro } = this.props;
    const { curTranslation, curScale, introAnimComplete } = this.state;

    const transitionDelay = introAnimComplete ? `0ms` : `${index * visionData.TRANSITION_DELAY_INCREMENT}ms`;

    let visionImage;

    if (data.image && data.image.fields && data.image.fields.file) {
      visionImage = `https:${data.image.fields.file.url}?w=${visionData.VISION_WIDTH}&h=${visionData.VISION_WIDTH}&q=${visionData.VISION_QUALITY}&fit=fill`;
    } else {
      visionImage = 'assets/images/temp/inspiration.jpg';
    }

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
            transform: `translateX(${isActive ? 0 : curTranslation}px)`,
            transitionDelay: transitionDelay
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
                transform: `translate(-50%,-50%) scale(${doOutro ? 0 : isActive ? 1 : curScale})`,
                transitionDelay: transitionDelay
              }}
            >
              <img
                className="vision__image"
                src={visionImage}
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