import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

import Amplify from "aws-amplify";
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

