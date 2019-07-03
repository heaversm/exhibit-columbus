//styles
import './scss/App.scss';

//dependencies
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Confirmation from './screens/Confirmation/Confirmation';
import Home from './screens/Home/Home';
import Inspiration from './screens/Inspiration/Inspiration';
import React from 'react';
import Redesign from './screens/Redesign/Redesign';
import Visualize from './screens/Visualize/Visualize';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route exact path="/inspiration" component={Inspiration} />
        <Route exact path="/redesign" component={Redesign} />
        <Route exact path="/visualize" component={Visualize} />
        <Route exact path="/confirmation" component={Confirmation} />
      </div>
    </Router>
  );
}

export default App;
