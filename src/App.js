import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.css';
import Advanced from './Advanced';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Advanced />
      </div>
    </Provider>
  );
}

export default App;
