## install & start

install 
```bash
cd <RootDir>
npm install
```

start dev & mock-server
```bash
npm run start
```

view `http://localhost:3000/` in browser

## file directory

```
project tree
├── App.js
├── App.scss
├── App.test.js
├── Layout      
│   ├── index.jsx
│   └── page.jsx
├── components   //common components
│   ├── Navigation
│   └── SearchInput
├── index.scss
├── index.tsx
├── module.scss
├── pages       //page corresponding to ONE path
│   ├── AjaxDemo
│   ├── EchartDemo
│   ├── Explorer
│   ├── HomePage
│   ├── NodeList
│   ├── NotFound404
│   ├── ReduxDemo
│   └── RouterDemo
├── react-app-env.d.ts
├── redux       //redux
│   ├── action.js
│   ├── reducer.js
│   └── store.js
├── serviceWorker.js
├── styles      //公共样式
│   ├── layout.scss
│   ├── main.scss
│   ├── media.scss
│   ├── reset.scss
│   └── vars.scss
└── test.module.css
```

```
mock-server directory
.
├── apis
│   ├── api-v1.js //api-version
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

## TODO
- [x] Redux
- [x] Router
- [x] Mock-Server
- [x] EChart
- [] Responsive
- [x] Api mock
- [] footer
- [] metaMask
- [] allAPis
- pages
    - [] Home
    - [x] Node List
    - [] Node Detail
    - [x] explorer
    - [] account
