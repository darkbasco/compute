"use strict";var precacheConfig=[["/compute/index.html","ba8f142ada2772075a0e897caa08654a"],["/compute/static/css/main.ae152a59.css","d1d2d060d9efafc8b9e66b14f0fdbda9"],["/compute/static/js/main.0860cba3.js","6a4e72207a8cdc2a661caf602fb9ad5d"],["/compute/static/media/comp_armsup.f538e3f4.png","f538e3f4f267ec78e07705d65d9d394c"],["/compute/static/media/comp_baby.d14108e0.png","d14108e0924c3afc1fdb14b1418a27ce"],["/compute/static/media/comp_barbell.62cec9a5.png","62cec9a5cdc6b9f71722ccdd89aa1520"],["/compute/static/media/comp_caveman.132202bc.png","132202bc3b436466444d6ae1364aea1d"],["/compute/static/media/comp_cena.a151621e.png","a151621e27fe8024b133ac0a63587e16"],["/compute/static/media/comp_deadlift.0886f819.png","0886f8197721dcc1dd9f39e1e9bb4591"],["/compute/static/media/comp_geek.b1190e3d.png","b1190e3d00640e34c81a6da0f650a0e2"],["/compute/static/media/comp_hulk.9879aac3.png","9879aac34a8d830c77a4f3e8777acc73"],["/compute/static/media/comp_oldguy.6786c669.png","6786c669cfb79ed548a25f0bee282839"],["/compute/static/media/comp_thumbsup.48752196.png","48752196b39b7279f7de0fd8c7c2363e"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,a,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return a.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),c=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,a=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),e=urlsToCacheKeys.has(a));var c="/compute/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(a=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});