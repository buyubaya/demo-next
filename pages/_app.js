import React from 'react';
import App from 'next/app';
import withRedux from "next-redux-wrapper";
// STORE
import { Provider } from "react-redux";
import { createStore } from 'redux';
const reducer = (state = {foo: ''}, action) => {
  switch (action.type) {
      case 'FOO':
          return {...state, foo: action.payload};
      default:
          return state
  }
};
const makeStore = (initialState, options) => {
  return createStore(reducer, initialState);
};


class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  static async getInitialProps(appContext) {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);
  
    return { ...appProps }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return(
      <Provider store={store}>
        <div>
          <h1>HELLO NEXT</h1>
          <Component {...pageProps} />
        </div>
      </Provider>
    );
  }
}

export default withRedux(makeStore)(MyApp);