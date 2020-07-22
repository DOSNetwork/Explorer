### Install
- `$ npm install`

### Start dev environment
- `$ npm run start`
- View `http://localhost:3000/` in browser

#### change API Proxy
Defaut http request proxy is `http://localhost:3000`, change the property `proxy` in `package.json` and rebuild.


#### file directory
```
project tree
├── App.js
├── App.scss
├── App.test.js
├── Layout      
│   ├── index.jsx
│   └── page.jsx
├── components    //common components
│   ├── Navigation
│   └── SearchInput
├── index.scss
├── index.tsx
├── module.scss
├── pages         //page corresponding to ONE path
│   ├── AjaxDemo
│   ├── EchartDemo
│   ├── Explorer
│   ├── HomePage
│   ├── NodeList
│   ├── NotFound404
│   ├── ReduxDemo
│   └── RouterDemo
├── react-app-env.d.ts
├── redux         //redux
│   ├── action.js
│   ├── reducer.js
│   └── store.js
├── serviceWorker.js
├── styles        // Public styles
│   ├── layout.scss
│   ├── main.scss
│   ├── media.scss
│   ├── reset.scss
│   └── vars.scss
├── util          // tools, web3 etc.
│   └── const.js  // abi const here
└── test.module.css
```

```
mock-server directory
.
├── apis
│   ├── api-v1.js   //api-version
│   ├── demo
│   ├── explorer    // api folder
│   ├── index.js
│   └── node        // api folder
├── config
├── config.js
├── entities        // api response scheme
│   ├── demo        
│   ├── dos
│   └── index.js
├── index.js
└── middleware
    └── api-wrapper.js  //response scheme wrapper
```
