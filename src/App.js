//styles
import './fonts/Gravur-Condensed.ttf';
import './fonts/Gravur-CondensedBlack.ttf';
import './fonts/Gravur-CondensedThin.ttf';
import './scss/App.scss';

import * as contentful from 'contentful'

//dependencies
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Confirmation from './screens/Confirmation/Confirmation';
import Home from './screens/Home/Home';
import Inspiration from './screens/Inspiration/Inspiration';
import React from 'react';
import Redesign from './screens/Redesign/Redesign';
import Visualize from './screens/Visualize/Visualize';
import config from './config'
import { dataStore } from './store';

class App extends React.Component {

  componentDidMount(){
    this.fetchData();
  }

  state = {
    dataLoaded: false,
  }

  contentfulClient = contentful.createClient({
    space: 'xbl068csq86a',
    accessToken: 'ok3nAinl4Tz6xrzqpM_V49TX064YXj3LQxKsU7giAeA'
  });

  fetchData = ()=>{

    this.contentfulClient.getEntry('4KGFPDFY2MZrRWCi4hZj2g')
    .then((entry) => {
      //console.log(entry);
      dataStore.siteData = entry.fields;
    })
    .then(()=>{
      this.contentfulClient.getEntries({
        content_type: 'visionsData'
      })
      .then((response) => {
        let visionsArr = [];
        response.items.map((vision)=>{
          visionsArr.push(vision.fields);
        });
        dataStore.visionsData = visionsArr;
      })
    })
    .then(()=>{
      this.contentfulClient.getEntries({
        content_type: 'inspirationsData'
      })
      .then((response) => {
        //console.log(response.items);
  
        let inspirationsArr = [];
        response.items.map((inspiration)=>{
          inspirationsArr.push(inspiration.fields);
        });
        dataStore.inspirationsData = inspirationsArr;
      })
    })
    .then(()=>{
      this.contentfulClient.getEntries({
        content_type: 'objectsData'
      })
      .then((response) => {
        //console.log(response.items);
  
        let objectsArr = [];
        response.items.map((object)=>{
          objectsArr.push(object.fields);
        });
        dataStore.objectsData = objectsArr;
      })
    })
    .then(()=>{
      this.contentfulClient.getEntries({
        content_type: 'objectivesData'
      })
      .then((response) => {
        //console.log(response.items);
  
        let objectivesArr = [];
        response.items.map((objective)=>{
          objectivesArr.push(objective.fields);
        });
        dataStore.objectivesData = objectivesArr;
      })
    })
    .then(()=>{
      this.contentfulClient.getEntries({
        content_type: 'objectivesData'
      })
      .then((response) => {
        //console.log(response.items);
  
        let objectivesArr = [];
        response.items.map((objective)=>{
          objectivesArr.push(objective.fields);
        });
        dataStore.objectivesData = objectivesArr;
      })
    })
    .then(()=>{
      this.contentfulClient.getEntries({
        content_type: 'visualizeData'
      })
      .then((response) => {
        //console.log(response.items);
        let visualizeData = {
          "objects": [],
          "background": [],
          "foreground": [],
          "effects": [],
          "people": [],
        }
        response.items.map((visualizeItem)=>{
          visualizeData[visualizeItem.fields.category].push(visualizeItem.fields);
        });
        dataStore.visualizeData = visualizeData;
        
      })
      .then(()=>{
        this.setState({
          dataLoaded: true,
        })
      });
    })
    .catch(console.error)
  }

  render(){
    const {dataLoaded} = this.state;

    if (!dataLoaded){
      return (<div>LOADING</div>)
    }
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
