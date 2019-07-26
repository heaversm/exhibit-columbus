/* eslint-disable */

import './Home.scss';

import * as contentful from 'contentful'

import { Link } from 'react-router-dom';
import React from 'react';
import { Vision } from '../../components';
import { dataStore } from '../../store';
import { homeData } from '../../data/dev_data';
import { view } from 'react-easy-state';

//import { visionsData } from '../../data/site_data';

let visionSelectorInterval = null;

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    numVisions: 2
  }

  state = {
    activeVisionIndex: 0,
    dataLoaded: false,
  }
  
  contentfulClient = contentful.createClient({
    space: 'xbl068csq86a',
    accessToken: 'ok3nAinl4Tz6xrzqpM_V49TX064YXj3LQxKsU7giAeA'
  });

  componentDidMount(){
    this.fetchData();
  }

  componentWillUnmount(){
    clearInterval(visionSelectorInterval);
  }

  componentDidUpdate(prevProps,prevState){
    if (!prevState.dataLoaded && this.state.dataLoaded){
      this.setVisionSelectionInterval();
    }
  }

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

  setVisionSelectionInterval = ()=>{
    visionSelectorInterval = setInterval(()=>{
      this.selectNewVision();
    },homeData.SELECTION_INTERVAL);
  }

  selectNewVision = ()=>{
    const {numVisions} = this.props;
    const newVisionIndex = _.random(0,numVisions-1);
    this.setState({
      activeVisionIndex: newVisionIndex
    })
  }
  

  render() {

    const {dataLoaded} = this.state;

    if (!dataLoaded){ //MH TODO - design loader
      return (<div>LOADING</div>)
    }

    console.log(dataStore.visionsData);

    return (
      <main className="Home app_screen">
        <section className="home__title_container ctnr">
          <div className="row center-xs">
            <div className="col-xs-6">
              <h1 className="home__title">{dataStore.siteData.introTitle}</h1>
              <Link className="home__continue_button button button--rounded" to="/inspiration">{dataStore.siteData.introContinueButtonText}</Link>
            </div>
          </div>
        </section>
        <section className="home__visions_container">
          <div className="home__visions_positioner">
            {
              
              dataStore.visionsData.map((vision, index) => {
                const isActive = this.state.activeVisionIndex === index;

                return (
                  <Vision
                    index={index}
                    key={`vision--${vision.slug}`}
                    data={vision}
                    isActive={isActive}
                  />
                )
              }
            )}
          </div>
        </section>
      </main>
    )
  }
}

export default view(Home);