import React from 'react';
import { appSettingsData } from '../../data/dev_data';
import { withRouter } from "react-router";

class Reset extends React.Component {

  state = {
    resetClicks: 0,
  }

  handleAppResetClick = () => {
    const newResetClicks = this.state.resetClicks + 1;

    if (newResetClicks >= appSettingsData.RESET_CLICKS) {
      this.handleAppReset();
    } else {
      this.setState({
        resetClicks: newResetClicks
      });
    }

  }

  handleAppReset = () => { //when we have enough clicks to reset
    this.setState({
      resetClicks: 0
    });
    this.props.history.replace('/');
  }

  render() {

    return (
      <div
        className="app__reset"
        onClick={this.handleAppResetClick}
      />
    )
  }
}

export default withRouter(Reset)