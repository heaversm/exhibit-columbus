//FOR REFERENCE ONLY - DO NOT IMPORT THIS COMPONENT

import './Template.scss';

import React from 'react';
import { view } from 'react-easy-state';

class Template extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {}

  render() {

    return (
      <div>
        TEMPLATE
      </div>
    )
  }
}

export default view(Template);