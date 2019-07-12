//styles
import './fonts/Gravur-Condensed.ttf';
import './fonts/Gravur-CondensedBlack.ttf';
import './fonts/Gravur-CondensedThin.ttf';
import './scss/App.scss';

//dependencies
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Confirmation from './screens/Confirmation/Confirmation';
import Home from './screens/Home/Home';
import Inspiration from './screens/Inspiration/Inspiration';
import React from 'react';
import Redesign from './screens/Redesign/Redesign';
import Visualize from './screens/Visualize/Visualize';
import config from './config'

class App extends React.Component {

  componentDidMount(){
    //window.gapi.load("client", this.initClient);
  }

  initClient = () => {
    // 2. Initialize the JavaScript client library.
    window.gapi.client
      .init({
        apiKey: config.apiKey,
        clientId: config.clientId,
        // Your API key will be automatically added to the Discovery Document URLs.
        discoveryDocs: config.discoveryDocs,
        scope: config.scope
      })
      .then((a) => {
        console.log(a);
        this.handleClientLoad();
      // 3. Initialize and make the API request.
      //load(this.handleClientLoad);
    });
  }

  handleClientLoad = ()=>{
    window.gapi.client.load("sheets", "v4", () => {
      window.gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: config.spreadsheetId,
          range: 'Sheet1',
        })
        .then(
          response => {
            const data = response.result.values;
            console.log(data);
          },
          response => {
            //callback(false, response.result.error);
            console.log(response);
          }
        );
    });
  }

  render(){
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
}

export default App;
