// scroll bar
import 'simplebar/src/simplebar.css';

import { hydrate, render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

//
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddlerware from 'redux-promise';
import reduxThunk from 'redux-thunk';
import reducer from './redux/reducers';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import App from './App';

// ----------------------------------------------------------------------

const createStoreWithMiddleware = applyMiddleware(promiseMiddlerware, reduxThunk)(createStore);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(
    <Provider store={createStoreWithMiddleware(reducer)}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>,
    rootElement
  );
} else {
  render(
    <Provider store={createStoreWithMiddleware(reducer)}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>,
    rootElement
  );
}

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
