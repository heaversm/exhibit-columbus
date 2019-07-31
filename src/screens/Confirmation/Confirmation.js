/* eslint-disable */

import './Confirmation.scss';

import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import { dataStore, userState } from '../../store';

import React from 'react';
import {confirmationSettingsData} from '../../data/dev_data';
import { view } from 'react-easy-state';

let confirmationTimeout, transitionTimeout; //will hold reference to the timeout 

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.handleConfirmationTimeout = this.handleConfirmationTimeout.bind(this);
  }

  state = {
    doTransition: false,
  }

  componentDidMount(){
    confirmationTimeout = setTimeout(this.handleConfirmationTimeout,confirmationSettingsData.CONFIRMATION_TIMEOUT);
    transitionTimeout = setTimeout(()=>{
      this.setState({
        doTransition: true
      });
    },1000);
  }

  componentWillUnmount(){
    if (confirmationTimeout){
      clearTimeout(confirmationTimeout);
    }
    if (transitionTimeout){
      clearTimeout(transitionTimeout);
    }
  }

  handleConfirmationTimeout(){
    this.setState({
      doTransition: false
    });
    transitionTimeout = setTimeout(()=>{
      this.props.history.push('/');
    },1000);
  }

  render() {

    const {doTransition} = this.state;

    return (
      <div className="Confirmation app_screen">
        <main
          className={`confirmation__main ${doTransition ? 'active' : ''}`}
        >
          <div className="confirmation__title_container ctnr center-xs">
            <h1 className="confirmation__title">{dataStore.siteData.confirmationTitle}</h1>
            <div className="confirmation__continue_container">
              <p className="confirmation__description">{dataStore.siteData.confirmationDescription}</p>
              <div className="confirmation__image_container">
              {
                userState.visualizeData && userState.visualizeData.imageURL ? (
                  <img src={userState.visualizeData.imageURL} alt="Final Image" className="confirmation__image"/>
                ) : (
                  <p>IMAGE UNAVAILABLE</p>
                )
              }
              </div>
              
              <Link 
                to="/"
                className="confirmation__continue_link button button--rounded"
              >
                {dataStore.siteData.confirmationContinueButtonText}
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default view(Confirmation);