import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { join } from 'path';
import { readFileSync } from 'fs';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { enableProdMode } from '@angular/core';
import { XhrFactory } from '@angular/common/http';
import { NgxRequest, NgxResponce } from '@gorniv/ngx-universal';

import * as express from 'express';
import * as proxy from 'express-http-proxy';
import * as compression from 'compression';
import * as cookieparser from 'cookie-parser';

const domino = require('domino');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

// gzip
app.use(compression());
// cokies
app.use(cookieparser());

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST_FOLDER, 'index.html')).toString();
const win = domino.createWindow(template);

global['window'] = win;
global['Node'] = win.Node;
global['navigator'] = win.navigator;
global['screen'] = { width: 0, height: 0 };
global['Event'] = win.Event;
global['Event']['prototype'] = win.Event.prototype;
global['document'] = win.document;
global['window']['Promise'] = global.Promise;
global['window']['Minds'] = {
  cdn_url: '/',
  cdn_assets_url: '/',
  blockchain: {
    network_address: 'https://www.minds.com/api/v2/blockchain/proxy/',
    token: {
      abi: [],
    },
  },
  features: {
    blockchain_creditcard: false,
    'suggested-users': true,
    helpdesk: true,
    'top-feeds': true,
    'top-feeds-filter': false,
    'channel-filter-feeds': false,
    'dark-mode': true,
    'es-feeds': true,
    'cassandra-notifications': true,
    'media-modal': true,
    'allow-comments-toggle': false,
    permissions: false,
    'wire-multi-currency': 'canary',
    'cdn-jwt': false,
    'post-scheduler': 'canary',
    pro: false,
    'purchase-pro': true,
    'top-feeds-by-age': true,
  },
};
global['window']['localStorage'] = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
global['localStorage'] = global['window']['localStorage'];
global['window']['scrollTo'] = pos => {};

Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: 'myCookie=omnomnom',
});

Object.defineProperty(window.document, 'referrer', {
  writable: true,
  value: '',
});

Object.defineProperty(window.document, 'localStorage', {
  writable: true,
  value: global['window']['localStorage'],
});

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
} = require('./dist/server/main');

const {
  provideModuleMap,
} = require('@nguniversal/module-map-ngfactory-loader');

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)],
  })
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Server static files from dist folder
app.get('*.*', express.static(DIST_FOLDER));

// Socket.io hitting wrong endpoint (dev?)
app.get('/socket.io', (req, res) => {
  res.send('You are using the wrong domain.');
});

// /undefined is an issue with angular
app.get('/undefined', (req, res) => {
  res.send('There was problem');
});

// cache
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 120 });

const cache = () => {
  return (req, res, next) => {
    const sessKey = req.cookies['minds_sess'] || 'loggedout';
    const key = `__express__/${sessKey}/` + (req.originalUrl || req.url);
    const exists = myCache.has(key);
    if (exists) {
      console.log(`from cache: ${key}`);
      const cachedBody = myCache.get(key);
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        myCache.set(key, body);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// All regular routes use the Universal engine
app.get('*', cache(), (req, res) => {
  const http =
    req.headers['x-forwarded-proto'] === undefined
      ? 'http'
      : req.headers['x-forwarded-proto'];

  const url = req.originalUrl;
  // tslint:disable-next-line:no-console
  console.time(`GET: ${url}`);
  res.render(
    'index',
    {
      req: req,
      res: res,
      // provers from server
      providers: [
        // for http and cookies
        {
          provide: REQUEST,
          useValue: req,
        },
        {
          provide: RESPONSE,
          useValue: res,
        },
        // for cookie
        {
          provide: NgxRequest,
          useValue: req,
        },
        {
          provide: NgxResponce,
          useValue: res,
        },
        // for absolute path
        {
          provide: 'ORIGIN_URL',
          useValue: `${http}://${req.headers.host}`,
        },
      ],
    },
    (err, html) => {
      if (!!err) {
        throw err;
      }

      // tslint:disable-next-line:no-console
      console.timeEnd(`GET: ${url}`);
      res.send(html);
    }
  );
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});