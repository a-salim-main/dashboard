"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[843],{4939:(t,e,s)=>{s.d(e,{j:()=>r});var i=s(9010),n=s(6298),r=new class extends i.l{#t;#e;#s;constructor(){super(),this.#s=t=>{if(!n.sk&&window.addEventListener){let e=()=>t();return window.addEventListener("visibilitychange",e,!1),()=>{window.removeEventListener("visibilitychange",e)}}}}onSubscribe(){this.#e||this.setEventListener(this.#s)}onUnsubscribe(){this.hasListeners()||(this.#e?.(),this.#e=void 0)}setEventListener(t){this.#s=t,this.#e?.(),this.#e=t(t=>{"boolean"==typeof t?this.setFocused(t):this.onFocus()})}setFocused(t){this.#t!==t&&(this.#t=t,this.onFocus())}onFocus(){let t=this.isFocused();this.listeners.forEach(e=>{e(t)})}isFocused(){return"boolean"==typeof this.#t?this.#t:globalThis.document?.visibilityState!=="hidden"}}},2812:(t,e,s)=>{s.d(e,{R:()=>a,m:()=>o});var i=s(9948),n=s(3494),r=s(924),o=class extends n.F{#i;#n;#r;constructor(t){super(),this.mutationId=t.mutationId,this.#n=t.mutationCache,this.#i=[],this.state=t.state||a(),this.setOptions(t.options),this.scheduleGc()}setOptions(t){this.options=t,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(t){this.#i.includes(t)||(this.#i.push(t),this.clearGcTimeout(),this.#n.notify({type:"observerAdded",mutation:this,observer:t}))}removeObserver(t){this.#i=this.#i.filter(e=>e!==t),this.scheduleGc(),this.#n.notify({type:"observerRemoved",mutation:this,observer:t})}optionalRemove(){this.#i.length||("pending"===this.state.status?this.scheduleGc():this.#n.remove(this))}continue(){return this.#r?.continue()??this.execute(this.state.variables)}async execute(t){this.#r=(0,r.Mz)({fn:()=>this.options.mutationFn?this.options.mutationFn(t):Promise.reject(Error("No mutationFn found")),onFail:(t,e)=>{this.#o({type:"failed",failureCount:t,error:e})},onPause:()=>{this.#o({type:"pause"})},onContinue:()=>{this.#o({type:"continue"})},retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>this.#n.canRun(this)});let e="pending"===this.state.status,s=!this.#r.canStart();try{if(!e){this.#o({type:"pending",variables:t,isPaused:s}),await this.#n.config.onMutate?.(t,this);let e=await this.options.onMutate?.(t);e!==this.state.context&&this.#o({type:"pending",context:e,variables:t,isPaused:s})}let i=await this.#r.start();return await this.#n.config.onSuccess?.(i,t,this.state.context,this),await this.options.onSuccess?.(i,t,this.state.context),await this.#n.config.onSettled?.(i,null,this.state.variables,this.state.context,this),await this.options.onSettled?.(i,null,t,this.state.context),this.#o({type:"success",data:i}),i}catch(e){try{throw await this.#n.config.onError?.(e,t,this.state.context,this),await this.options.onError?.(e,t,this.state.context),await this.#n.config.onSettled?.(void 0,e,this.state.variables,this.state.context,this),await this.options.onSettled?.(void 0,e,t,this.state.context),e}finally{this.#o({type:"error",error:e})}}finally{this.#n.runNext(this)}}#o(t){this.state=(e=>{switch(t.type){case"failed":return{...e,failureCount:t.failureCount,failureReason:t.error};case"pause":return{...e,isPaused:!0};case"continue":return{...e,isPaused:!1};case"pending":return{...e,context:t.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:t.isPaused,status:"pending",variables:t.variables,submittedAt:Date.now()};case"success":return{...e,data:t.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...e,data:void 0,error:t.error,failureCount:e.failureCount+1,failureReason:t.error,isPaused:!1,status:"error"}}})(this.state),i.V.batch(()=>{this.#i.forEach(e=>{e.onMutationUpdate(t)}),this.#n.notify({mutation:this,type:"updated",action:t})})}};function a(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}},9948:(t,e,s)=>{s.d(e,{V:()=>i});var i=function(){let t=[],e=0,s=t=>{t()},i=t=>{t()},n=t=>setTimeout(t,0),r=i=>{e?t.push(i):n(()=>{s(i)})},o=()=>{let e=t;t=[],e.length&&n(()=>{i(()=>{e.forEach(t=>{s(t)})})})};return{batch:t=>{let s;e++;try{s=t()}finally{--e||o()}return s},batchCalls:t=>(...e)=>{r(()=>{t(...e)})},schedule:r,setNotifyFunction:t=>{s=t},setBatchNotifyFunction:t=>{i=t},setScheduler:t=>{n=t}}}()},9937:(t,e,s)=>{s.d(e,{N:()=>r});var i=s(9010),n=s(6298),r=new class extends i.l{#a=!0;#e;#s;constructor(){super(),this.#s=t=>{if(!n.sk&&window.addEventListener){let e=()=>t(!0),s=()=>t(!1);return window.addEventListener("online",e,!1),window.addEventListener("offline",s,!1),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",s)}}}}onSubscribe(){this.#e||this.setEventListener(this.#s)}onUnsubscribe(){this.hasListeners()||(this.#e?.(),this.#e=void 0)}setEventListener(t){this.#s=t,this.#e?.(),this.#e=t(this.setOnline.bind(this))}setOnline(t){this.#a!==t&&(this.#a=t,this.listeners.forEach(e=>{e(t)}))}isOnline(){return this.#a}}},2459:(t,e,s)=>{s.d(e,{A:()=>a,z:()=>c});var i=s(6298),n=s(9948),r=s(924),o=s(3494),a=class extends o.F{#c;#u;#h;#r;#l;#d;constructor(t){super(),this.#d=!1,this.#l=t.defaultOptions,this.setOptions(t.options),this.observers=[],this.#h=t.cache,this.queryKey=t.queryKey,this.queryHash=t.queryHash,this.#c=function(t){let e="function"==typeof t.initialData?t.initialData():t.initialData,s=void 0!==e,i=s?"function"==typeof t.initialDataUpdatedAt?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:s?i??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:s?"success":"pending",fetchStatus:"idle"}}(this.options),this.state=t.state??this.#c,this.scheduleGc()}get meta(){return this.options.meta}get promise(){return this.#r?.promise}setOptions(t){this.options={...this.#l,...t},this.updateGcTime(this.options.gcTime)}optionalRemove(){this.observers.length||"idle"!==this.state.fetchStatus||this.#h.remove(this)}setData(t,e){let s=(0,i.oE)(this.state.data,t,this.options);return this.#o({data:s,type:"success",dataUpdatedAt:e?.updatedAt,manual:e?.manual}),s}setState(t,e){this.#o({type:"setState",state:t,setStateOptions:e})}cancel(t){let e=this.#r?.promise;return this.#r?.cancel(t),e?e.then(i.ZT).catch(i.ZT):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(this.#c)}isActive(){return this.observers.some(t=>!1!==(0,i.Nc)(t.options.enabled,this))}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===i.CN||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStale(){return!!this.state.isInvalidated||(this.getObserversCount()>0?this.observers.some(t=>t.getCurrentResult().isStale):void 0===this.state.data)}isStaleByTime(t=0){return this.state.isInvalidated||void 0===this.state.data||!(0,i.Kp)(this.state.dataUpdatedAt,t)}onFocus(){let t=this.observers.find(t=>t.shouldFetchOnWindowFocus());t?.refetch({cancelRefetch:!1}),this.#r?.continue()}onOnline(){let t=this.observers.find(t=>t.shouldFetchOnReconnect());t?.refetch({cancelRefetch:!1}),this.#r?.continue()}addObserver(t){this.observers.includes(t)||(this.observers.push(t),this.clearGcTimeout(),this.#h.notify({type:"observerAdded",query:this,observer:t}))}removeObserver(t){this.observers.includes(t)&&(this.observers=this.observers.filter(e=>e!==t),this.observers.length||(this.#r&&(this.#d?this.#r.cancel({revert:!0}):this.#r.cancelRetry()),this.scheduleGc()),this.#h.notify({type:"observerRemoved",query:this,observer:t}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||this.#o({type:"invalidate"})}fetch(t,e){if("idle"!==this.state.fetchStatus){if(void 0!==this.state.data&&e?.cancelRefetch)this.cancel({silent:!0});else if(this.#r)return this.#r.continueRetry(),this.#r.promise}if(t&&this.setOptions(t),!this.options.queryFn){let t=this.observers.find(t=>t.options.queryFn);t&&this.setOptions(t.options)}let s=new AbortController,n=t=>{Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(this.#d=!0,s.signal)})},o={fetchOptions:e,options:this.options,queryKey:this.queryKey,state:this.state,fetchFn:()=>{let t=(0,i.cG)(this.options,e),s={queryKey:this.queryKey,meta:this.meta};return(n(s),this.#d=!1,this.options.persister)?this.options.persister(t,s,this):t(s)}};n(o),this.options.behavior?.onFetch(o,this),this.#u=this.state,("idle"===this.state.fetchStatus||this.state.fetchMeta!==o.fetchOptions?.meta)&&this.#o({type:"fetch",meta:o.fetchOptions?.meta});let a=t=>{(0,r.DV)(t)&&t.silent||this.#o({type:"error",error:t}),(0,r.DV)(t)||(this.#h.config.onError?.(t,this),this.#h.config.onSettled?.(this.state.data,t,this)),this.scheduleGc()};return this.#r=(0,r.Mz)({initialPromise:e?.initialPromise,fn:o.fetchFn,abort:s.abort.bind(s),onSuccess:t=>{if(void 0===t){a(Error(`${this.queryHash} data is undefined`));return}try{this.setData(t)}catch(t){a(t);return}this.#h.config.onSuccess?.(t,this),this.#h.config.onSettled?.(t,this.state.error,this),this.scheduleGc()},onError:a,onFail:(t,e)=>{this.#o({type:"failed",failureCount:t,error:e})},onPause:()=>{this.#o({type:"pause"})},onContinue:()=>{this.#o({type:"continue"})},retry:o.options.retry,retryDelay:o.options.retryDelay,networkMode:o.options.networkMode,canRun:()=>!0}),this.#r.start()}#o(t){this.state=(e=>{switch(t.type){case"failed":return{...e,fetchFailureCount:t.failureCount,fetchFailureReason:t.error};case"pause":return{...e,fetchStatus:"paused"};case"continue":return{...e,fetchStatus:"fetching"};case"fetch":return{...e,...c(e.data,this.options),fetchMeta:t.meta??null};case"success":return{...e,data:t.data,dataUpdateCount:e.dataUpdateCount+1,dataUpdatedAt:t.dataUpdatedAt??Date.now(),error:null,isInvalidated:!1,status:"success",...!t.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};case"error":let s=t.error;if((0,r.DV)(s)&&s.revert&&this.#u)return{...this.#u,fetchStatus:"idle"};return{...e,error:s,errorUpdateCount:e.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:e.fetchFailureCount+1,fetchFailureReason:s,fetchStatus:"idle",status:"error"};case"invalidate":return{...e,isInvalidated:!0};case"setState":return{...e,...t.state}}})(this.state),n.V.batch(()=>{this.observers.forEach(t=>{t.onQueryUpdate()}),this.#h.notify({query:this,type:"updated",action:t})})}};function c(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:(0,r.Kw)(e.networkMode)?"fetching":"paused",...void 0===t&&{error:null,status:"pending"}}}},3494:(t,e,s)=>{s.d(e,{F:()=>n});var i=s(6298),n=class{#f;destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),(0,i.PN)(this.gcTime)&&(this.#f=setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??(i.sk?1/0:3e5))}clearGcTimeout(){this.#f&&(clearTimeout(this.#f),this.#f=void 0)}}},924:(t,e,s)=>{s.d(e,{DV:()=>h,Kw:()=>c,Mz:()=>l});var i=s(4939),n=s(9937),r=s(6922),o=s(6298);function a(t){return Math.min(1e3*2**t,3e4)}function c(t){return(t??"online")!=="online"||n.N.isOnline()}var u=class extends Error{constructor(t){super("CancelledError"),this.revert=t?.revert,this.silent=t?.silent}};function h(t){return t instanceof u}function l(t){let e,s=!1,h=0,l=!1,d=(0,r.O)(),f=()=>i.j.isFocused()&&("always"===t.networkMode||n.N.isOnline())&&t.canRun(),p=()=>c(t.networkMode)&&t.canRun(),m=s=>{l||(l=!0,t.onSuccess?.(s),e?.(),d.resolve(s))},y=s=>{l||(l=!0,t.onError?.(s),e?.(),d.reject(s))},v=()=>new Promise(s=>{e=t=>{(l||f())&&s(t)},t.onPause?.()}).then(()=>{e=void 0,l||t.onContinue?.()}),b=()=>{let e;if(l)return;let i=0===h?t.initialPromise:void 0;try{e=i??t.fn()}catch(t){e=Promise.reject(t)}Promise.resolve(e).then(m).catch(e=>{if(l)return;let i=t.retry??(o.sk?0:3),n=t.retryDelay??a,r="function"==typeof n?n(h,e):n,c=!0===i||"number"==typeof i&&h<i||"function"==typeof i&&i(h,e);if(s||!c){y(e);return}h++,t.onFail?.(h,e),(0,o._v)(r).then(()=>f()?void 0:v()).then(()=>{s?y(e):b()})})};return{promise:d,cancel:e=>{l||(y(new u(e)),t.abort?.())},continue:()=>(e?.(),d),cancelRetry:()=>{s=!0},continueRetry:()=>{s=!1},canStart:p,start:()=>(p()?b():v().then(b),d)}}},9010:(t,e,s)=>{s.d(e,{l:()=>i});var i=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}}},6922:(t,e,s)=>{s.d(e,{O:()=>i});function i(){let t,e;let s=new Promise((s,i)=>{t=s,e=i});function i(t){Object.assign(s,t),delete s.resolve,delete s.reject}return s.status="pending",s.catch(()=>{}),s.resolve=e=>{i({status:"fulfilled",value:e}),t(e)},s.reject=t=>{i({status:"rejected",reason:t}),e(t)},s}},6298:(t,e,s)=>{s.d(e,{CN:()=>O,Ht:()=>C,KC:()=>c,Kp:()=>a,Nc:()=>u,PN:()=>o,Rm:()=>d,SE:()=>r,VS:()=>m,VX:()=>w,X7:()=>l,Ym:()=>f,ZT:()=>n,_v:()=>g,_x:()=>h,cG:()=>F,oE:()=>S,sk:()=>i,to:()=>p});var i="undefined"==typeof window||"Deno"in globalThis;function n(){}function r(t,e){return"function"==typeof t?t(e):t}function o(t){return"number"==typeof t&&t>=0&&t!==1/0}function a(t,e){return Math.max(t+(e||0)-Date.now(),0)}function c(t,e){return"function"==typeof t?t(e):t}function u(t,e){return"function"==typeof t?t(e):t}function h(t,e){let{type:s="all",exact:i,fetchStatus:n,predicate:r,queryKey:o,stale:a}=t;if(o){if(i){if(e.queryHash!==d(o,e.options))return!1}else if(!p(e.queryKey,o))return!1}if("all"!==s){let t=e.isActive();if("active"===s&&!t||"inactive"===s&&t)return!1}return("boolean"!=typeof a||e.isStale()===a)&&(!n||n===e.state.fetchStatus)&&(!r||!!r(e))}function l(t,e){let{exact:s,status:i,predicate:n,mutationKey:r}=t;if(r){if(!e.options.mutationKey)return!1;if(s){if(f(e.options.mutationKey)!==f(r))return!1}else if(!p(e.options.mutationKey,r))return!1}return(!i||e.state.status===i)&&(!n||!!n(e))}function d(t,e){return(e?.queryKeyHashFn||f)(t)}function f(t){return JSON.stringify(t,(t,e)=>v(e)?Object.keys(e).sort().reduce((t,s)=>(t[s]=e[s],t),{}):e)}function p(t,e){return t===e||typeof t==typeof e&&!!t&&!!e&&"object"==typeof t&&"object"==typeof e&&!Object.keys(e).some(s=>!p(t[s],e[s]))}function m(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(let s in t)if(t[s]!==e[s])return!1;return!0}function y(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function v(t){if(!b(t))return!1;let e=t.constructor;if(void 0===e)return!0;let s=e.prototype;return!!(b(s)&&s.hasOwnProperty("isPrototypeOf"))&&Object.getPrototypeOf(t)===Object.prototype}function b(t){return"[object Object]"===Object.prototype.toString.call(t)}function g(t){return new Promise(e=>{setTimeout(e,t)})}function S(t,e,s){return"function"==typeof s.structuralSharing?s.structuralSharing(t,e):!1!==s.structuralSharing?function t(e,s){if(e===s)return e;let i=y(e)&&y(s);if(i||v(e)&&v(s)){let n=i?e:Object.keys(e),r=n.length,o=i?s:Object.keys(s),a=o.length,c=i?[]:{},u=0;for(let r=0;r<a;r++){let a=i?r:o[r];(!i&&n.includes(a)||i)&&void 0===e[a]&&void 0===s[a]?(c[a]=void 0,u++):(c[a]=t(e[a],s[a]),c[a]===e[a]&&void 0!==e[a]&&u++)}return r===a&&u===r?e:c}return s}(t,e):e}function w(t,e,s=0){let i=[...t,e];return s&&i.length>s?i.slice(1):i}function C(t,e,s=0){let i=[e,...t];return s&&i.length>s?i.slice(0,-1):i}var O=Symbol();function F(t,e){return!t.queryFn&&e?.initialPromise?()=>e.initialPromise:t.queryFn&&t.queryFn!==O?t.queryFn:()=>Promise.reject(Error(`Missing queryFn: '${t.queryHash}'`))}},3191:(t,e,s)=>{s.d(e,{NL:()=>o,aH:()=>a});var i=s(2265),n=s(7437),r=i.createContext(void 0),o=t=>{let e=i.useContext(r);if(t)return t;if(!e)throw Error("No QueryClient set, use QueryClientProvider to set one");return e},a=t=>{let{client:e,children:s}=t;return i.useEffect(()=>(e.mount(),()=>{e.unmount()}),[e]),(0,n.jsx)(r.Provider,{value:e,children:s})}},9512:(t,e,s)=>{s.d(e,{F:()=>u,f:()=>h});var i=s(2265),n=["light","dark"],r="(prefers-color-scheme: dark)",o="undefined"==typeof window,a=i.createContext(void 0),c={setTheme:t=>{},themes:[]},u=()=>{var t;return null!=(t=i.useContext(a))?t:c},h=t=>i.useContext(a)?t.children:i.createElement(d,{...t}),l=["light","dark"],d=t=>{let{forcedTheme:e,disableTransitionOnChange:s=!1,enableSystem:o=!0,enableColorScheme:c=!0,storageKey:u="theme",themes:h=l,defaultTheme:d=o?"system":"light",attribute:v="data-theme",value:b,children:g,nonce:S}=t,[w,C]=i.useState(()=>p(u,d)),[O,F]=i.useState(()=>p(u)),E=b?Object.values(b):h,T=i.useCallback(t=>{let e=t;if(!e)return;"system"===t&&o&&(e=y());let i=b?b[e]:e,r=s?m():null,a=document.documentElement;if("class"===v?(a.classList.remove(...E),i&&a.classList.add(i)):i?a.setAttribute(v,i):a.removeAttribute(v),c){let t=n.includes(d)?d:null,s=n.includes(e)?e:t;a.style.colorScheme=s}null==r||r()},[]),k=i.useCallback(t=>{let e="function"==typeof t?t(t):t;C(e);try{localStorage.setItem(u,e)}catch(t){}},[e]),x=i.useCallback(t=>{F(y(t)),"system"===w&&o&&!e&&T("system")},[w,e]);i.useEffect(()=>{let t=window.matchMedia(r);return t.addListener(x),x(t),()=>t.removeListener(x)},[x]),i.useEffect(()=>{let t=t=>{t.key===u&&k(t.newValue||d)};return window.addEventListener("storage",t),()=>window.removeEventListener("storage",t)},[k]),i.useEffect(()=>{T(null!=e?e:w)},[e,w]);let P=i.useMemo(()=>({theme:w,setTheme:k,forcedTheme:e,resolvedTheme:"system"===w?O:w,themes:o?[...h,"system"]:h,systemTheme:o?O:void 0}),[w,k,e,O,o,h]);return i.createElement(a.Provider,{value:P},i.createElement(f,{forcedTheme:e,disableTransitionOnChange:s,enableSystem:o,enableColorScheme:c,storageKey:u,themes:h,defaultTheme:d,attribute:v,value:b,children:g,attrs:E,nonce:S}),g)},f=i.memo(t=>{let{forcedTheme:e,storageKey:s,attribute:o,enableSystem:a,enableColorScheme:c,defaultTheme:u,value:h,attrs:l,nonce:d}=t,f="system"===u,p="class"===o?"var d=document.documentElement,c=d.classList;".concat("c.remove(".concat(l.map(t=>"'".concat(t,"'")).join(","),")"),";"):"var d=document.documentElement,n='".concat(o,"',s='setAttribute';"),m=c?(n.includes(u)?u:null)?"if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'".concat(u,"'"):"if(e==='light'||e==='dark')d.style.colorScheme=e":"",y=function(t){let e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],s=!(arguments.length>2)||void 0===arguments[2]||arguments[2],i=h?h[t]:t,r=e?t+"|| ''":"'".concat(i,"'"),a="";return c&&s&&!e&&n.includes(t)&&(a+="d.style.colorScheme = '".concat(t,"';")),"class"===o?e||i?a+="c.add(".concat(r,")"):a+="null":i&&(a+="d[s](n,".concat(r,")")),a},v=e?"!function(){".concat(p).concat(y(e),"}()"):a?"!function(){try{".concat(p,"var e=localStorage.getItem('").concat(s,"');if('system'===e||(!e&&").concat(f,")){var t='").concat(r,"',m=window.matchMedia(t);if(m.media!==t||m.matches){").concat(y("dark"),"}else{").concat(y("light"),"}}else if(e){").concat(h?"var x=".concat(JSON.stringify(h),";"):"").concat(y(h?"x[e]":"e",!0),"}").concat(f?"":"else{"+y(u,!1,!1)+"}").concat(m,"}catch(e){}}()"):"!function(){try{".concat(p,"var e=localStorage.getItem('").concat(s,"');if(e){").concat(h?"var x=".concat(JSON.stringify(h),";"):"").concat(y(h?"x[e]":"e",!0),"}else{").concat(y(u,!1,!1),";}").concat(m,"}catch(t){}}();");return i.createElement("script",{nonce:d,dangerouslySetInnerHTML:{__html:v}})}),p=(t,e)=>{let s;if(!o){try{s=localStorage.getItem(t)||void 0}catch(t){}return s||e}},m=()=>{let t=document.createElement("style");return t.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(t),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(t)},1)}},y=t=>(t||(t=window.matchMedia(r)),t.matches?"dark":"light")}}]);