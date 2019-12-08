import React from 'react';
import {
    Provider
} from 'react-redux';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './redux/store'
import { IntlProvider } from 'react-intl'; /* react-intl imports */
import zh from './i18n/zh-CN'
import en from './i18n/en-US'
ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale='en' messages={zh}>
            <App />
        </IntlProvider>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
