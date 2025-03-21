import AppContent from 'components/AppContent';
import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../../redux/store';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent/>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
