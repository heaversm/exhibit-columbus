import './index.css';

import * as contentful from 'contentful'
import * as serviceWorker from './serviceWorker';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

let contentfulClient = contentful.createClient({
  space: 'xbl068csq86a',
  accessToken: 'ok3nAinl4Tz6xrzqpM_V49TX064YXj3LQxKsU7giAeA'
});
contentfulClient.getEntries().then(entries => {
  entries.items.forEach(entry => {
    if (entry.fields) {
      console.log(entry.fields)
    }
  })
})

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
