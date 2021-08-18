import React from 'react';

import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/homepage/homepage.component';
import CharacterPreview from './pages/character-preview/character-preview.component';

import { GlobalStyleContainer } from './global.styles';
import './App.scss';

const App = () => {
  return (
    <div className="root-container">
      <div className="main-container">
        <GlobalStyleContainer />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path={`/:characterName`} component={CharacterPreview} />
        </Switch>
      </div>
    </div>
  )
}

export default App;
