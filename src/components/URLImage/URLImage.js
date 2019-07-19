import { Image } from 'react-konva';
import React from 'react';
import { visualizeSettingsData } from '../../data/dev_data';
export default class URLImage extends React.Component {
  state = {
    image: null, //fills with the reference to the dom image and its properties (width, height, etc)
    isDragging: false, //when true, user is moving the image on screen
    curScale: 1.0, //the scale in decimal percent
    curRotation: 0, //the rotation in degrees
    doScaleUp: false,
  };

  static defaultProps = {
    x: visualizeSettingsData.CANVAS_SIZE / 2, //default to placing image at center stage
    y: visualizeSettingsData.CANVAS_SIZE / 2, //default to placing image at center stage
    doCenterImage: true, //when false, keep image origin at top left
    isInteractable: false, //when true, image is the active image and thus can be scaled, rotated, etc
    updateScale: false, //when true, update the scale of the image, then set this back to false
  }
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.loadImage();
    }
    if (!prevProps.updateScale && this.props.updateScale) { //update the scale
      this.handleScaleImage();
    }
    if (!prevProps.updateRotation && this.props.updateRotation) { //update the rotation
      this.handleRotateImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image
    });

    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };

  handleScaleImage = () => {
    const { curScale, doScaleUp } = this.state;
    let newScale;

    if (doScaleUp) { //make the image larger
      newScale = curScale + visualizeSettingsData.SCALE_INCREMENT;
      if (newScale + visualizeSettingsData.SCALE_INCREMENT >= visualizeSettingsData.SCALE_MAX) {
        this.setState({
          curScale: newScale,
          doScaleUp: false,
        });
      } else {
        this.setState({
          curScale: newScale
        });
      }
    } else { //make the image smaller
      newScale = curScale - visualizeSettingsData.SCALE_INCREMENT;
      if (newScale - visualizeSettingsData.SCALE_INCREMENT <= visualizeSettingsData.SCALE_MIN) {
        this.setState({
          curScale: newScale,
          doScaleUp: true,
        });
      } else {
        this.setState({
          curScale: newScale,
        });
      }
    }
    this.props.onUpdateScaleFinished();
  }

  handleRotateImage = () => {
    const { curRotation } = this.state;
    let newRotation;

    newRotation = curRotation + visualizeSettingsData.ROTATION_INCREMENT;
    this.setState({
      curRotation: newRotation
    });
    this.props.onUpdateRotationFinished();
  }

  handleSwitchScaleDirection = (doScaleUp) => {
    this.setState({
      doScaleUp: doScaleUp
    });
  }

  render() {

    const { doCenterImage, isInteractable } = this.props;
    const { curScale, curRotation } = this.state;
    let offsetX, offsetY = 0;

    if (this.state.image && doCenterImage) {
      offsetX = this.state.image.width / 2;
      offsetY = this.state.image.height / 2;
    }

    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        zIndex={this.props.zIndex}
        shadowColor={visualizeSettingsData.INTERACTABLE_SHADOW_COLOR}
        shadowOffset={{ x: 5, y: 5 }}
        shadowEnabled={isInteractable}
        image={this.state.image}
        ref={node => {
          this.imageNode = node;
        }}
        offsetX={offsetX}
        offsetY={offsetY}
        scaleX={curScale}
        scaleY={curScale}
        rotation={curRotation}
        draggable={isInteractable}
        listening={isInteractable}
        onDragStart={(e) => {
          this.setState({
            isDragging: true
          });
        }}
        onDragEnd={e => {
          this.setState({
            isDragging: false,
            x: e.target.x(),
            y: e.target.y()
          });
        }}

      />
    );
  }
}