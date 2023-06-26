import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers'; // Replace 'rootReducer' with your actual root reducer file
import './App.css';
import Advanced from './Advanced';

// Create the Redux store using the rootReducer
const store = createStore(rootReducer);

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
