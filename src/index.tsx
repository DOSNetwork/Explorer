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
import { Locale } from './i18n'
import { connectToClient } from "./util/web3.js";
const userLang = localStorage.getItem('DOSNETWORK_LANG') || navigator.language
const message = Locale(userLang)
store.dispatch({
    type: 'GLOBAL_CONFIG_SET_LANG',
    lang: userLang
})
connectToClient().then(() => {
    ReactDOM.render(
        <Provider store={store}>
            <IntlProvider locale={userLang} key={userLang} messages={message}>
                <App />
            </IntlProvider>
        </Provider>
        , document.getElementById('root'));
})
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
