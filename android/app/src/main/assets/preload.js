"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/@capacitor/core/dist/index.js
  var ExceptionCode, CapacitorException, getPlatformId, createCapacitor, initCapacitorGlobal, Capacitor, registerPlugin, WebPlugin, encode, decode, CapacitorCookiesPluginWeb, CapacitorCookies, readBlobAsBase64, normalizeHttpHeaders, buildUrlParams, buildRequestInit, CapacitorHttpPluginWeb, CapacitorHttp, SystemBarsStyle, SystemBarType, SystemBarsPluginWeb, SystemBars;
  var init_dist = __esm({
    "node_modules/@capacitor/core/dist/index.js"() {
      (function(ExceptionCode2) {
        ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
        ExceptionCode2["Unavailable"] = "UNAVAILABLE";
      })(ExceptionCode || (ExceptionCode = {}));
      CapacitorException = class extends Error {
        constructor(message, code, data) {
          super(message);
          this.message = message;
          this.code = code;
          this.data = data;
        }
      };
      getPlatformId = (win) => {
        var _a, _b;
        if (win === null || win === void 0 ? void 0 : win.androidBridge) {
          return "android";
        } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
          return "ios";
        } else {
          return "web";
        }
      };
      createCapacitor = (win) => {
        const capCustomPlatform = win.CapacitorCustomPlatform || null;
        const cap = win.Capacitor || {};
        const Plugins = cap.Plugins = cap.Plugins || {};
        const getPlatform = () => {
          return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
        };
        const isNativePlatform = () => getPlatform() !== "web";
        const isPluginAvailable = (pluginName) => {
          const plugin = registeredPlugins.get(pluginName);
          if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
            return true;
          }
          if (getPluginHeader(pluginName)) {
            return true;
          }
          return false;
        };
        const getPluginHeader = (pluginName) => {
          var _a;
          return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
        };
        const handleError = (err) => win.console.error(err);
        const registeredPlugins = /* @__PURE__ */ new Map();
        const registerPlugin2 = (pluginName, jsImplementations = {}) => {
          const registeredPlugin = registeredPlugins.get(pluginName);
          if (registeredPlugin) {
            console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
            return registeredPlugin.proxy;
          }
          const platform = getPlatform();
          const pluginHeader = getPluginHeader(pluginName);
          let jsImplementation;
          const loadPluginImplementation = async () => {
            if (!jsImplementation && platform in jsImplementations) {
              jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
            } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
              jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
            }
            return jsImplementation;
          };
          const createPluginMethod = (impl, prop) => {
            var _a, _b;
            if (pluginHeader) {
              const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
              if (methodHeader) {
                if (methodHeader.rtype === "promise") {
                  return (options) => cap.nativePromise(pluginName, prop.toString(), options);
                } else {
                  return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
                }
              } else if (impl) {
                return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
              }
            } else if (impl) {
              return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
            } else {
              throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
            }
          };
          const createPluginMethodWrapper = (prop) => {
            let remove;
            const wrapper = (...args) => {
              const p = loadPluginImplementation().then((impl) => {
                const fn = createPluginMethod(impl, prop);
                if (fn) {
                  const p2 = fn(...args);
                  remove = p2 === null || p2 === void 0 ? void 0 : p2.remove;
                  return p2;
                } else {
                  throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
                }
              });
              if (prop === "addListener") {
                p.remove = async () => remove();
              }
              return p;
            };
            wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
            Object.defineProperty(wrapper, "name", {
              value: prop,
              writable: false,
              configurable: false
            });
            return wrapper;
          };
          const addListener = createPluginMethodWrapper("addListener");
          const removeListener = createPluginMethodWrapper("removeListener");
          const addListenerNative = (eventName, callback) => {
            const call = addListener({ eventName }, callback);
            const remove = async () => {
              const callbackId = await call;
              removeListener({
                eventName,
                callbackId
              }, callback);
            };
            const p = new Promise((resolve2) => call.then(() => resolve2({ remove })));
            p.remove = async () => {
              console.warn(`Using addListener() without 'await' is deprecated.`);
              await remove();
            };
            return p;
          };
          const proxy = new Proxy({}, {
            get(_, prop) {
              switch (prop) {
                // https://github.com/facebook/react/issues/20030
                case "$$typeof":
                  return void 0;
                case "toJSON":
                  return () => ({});
                case "addListener":
                  return pluginHeader ? addListenerNative : addListener;
                case "removeListener":
                  return removeListener;
                default:
                  return createPluginMethodWrapper(prop);
              }
            }
          });
          Plugins[pluginName] = proxy;
          registeredPlugins.set(pluginName, {
            name: pluginName,
            proxy,
            platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
          });
          return proxy;
        };
        if (!cap.convertFileSrc) {
          cap.convertFileSrc = (filePath) => filePath;
        }
        cap.getPlatform = getPlatform;
        cap.handleError = handleError;
        cap.isNativePlatform = isNativePlatform;
        cap.isPluginAvailable = isPluginAvailable;
        cap.registerPlugin = registerPlugin2;
        cap.Exception = CapacitorException;
        cap.DEBUG = !!cap.DEBUG;
        cap.isLoggingEnabled = !!cap.isLoggingEnabled;
        return cap;
      };
      initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
      Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      registerPlugin = Capacitor.registerPlugin;
      WebPlugin = class {
        constructor() {
          this.listeners = {};
          this.retainedEventArguments = {};
          this.windowListeners = {};
        }
        addListener(eventName, listenerFunc) {
          let firstListener = false;
          const listeners = this.listeners[eventName];
          if (!listeners) {
            this.listeners[eventName] = [];
            firstListener = true;
          }
          this.listeners[eventName].push(listenerFunc);
          const windowListener = this.windowListeners[eventName];
          if (windowListener && !windowListener.registered) {
            this.addWindowListener(windowListener);
          }
          if (firstListener) {
            this.sendRetainedArgumentsForEvent(eventName);
          }
          const remove = async () => this.removeListener(eventName, listenerFunc);
          const p = Promise.resolve({ remove });
          return p;
        }
        async removeAllListeners() {
          this.listeners = {};
          for (const listener in this.windowListeners) {
            this.removeWindowListener(this.windowListeners[listener]);
          }
          this.windowListeners = {};
        }
        notifyListeners(eventName, data, retainUntilConsumed) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            if (retainUntilConsumed) {
              let args = this.retainedEventArguments[eventName];
              if (!args) {
                args = [];
              }
              args.push(data);
              this.retainedEventArguments[eventName] = args;
            }
            return;
          }
          listeners.forEach((listener) => listener(data));
        }
        hasListeners(eventName) {
          var _a;
          return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
        }
        registerWindowListener(windowEventName, pluginEventName) {
          this.windowListeners[pluginEventName] = {
            registered: false,
            windowEventName,
            pluginEventName,
            handler: (event) => {
              this.notifyListeners(pluginEventName, event);
            }
          };
        }
        unimplemented(msg = "not implemented") {
          return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
        }
        unavailable(msg = "not available") {
          return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
        }
        async removeListener(eventName, listenerFunc) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            return;
          }
          const index = listeners.indexOf(listenerFunc);
          this.listeners[eventName].splice(index, 1);
          if (!this.listeners[eventName].length) {
            this.removeWindowListener(this.windowListeners[eventName]);
          }
        }
        addWindowListener(handle) {
          window.addEventListener(handle.windowEventName, handle.handler);
          handle.registered = true;
        }
        removeWindowListener(handle) {
          if (!handle) {
            return;
          }
          window.removeEventListener(handle.windowEventName, handle.handler);
          handle.registered = false;
        }
        sendRetainedArgumentsForEvent(eventName) {
          const args = this.retainedEventArguments[eventName];
          if (!args) {
            return;
          }
          delete this.retainedEventArguments[eventName];
          args.forEach((arg) => {
            this.notifyListeners(eventName, arg);
          });
        }
      };
      encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
      CapacitorCookiesPluginWeb = class extends WebPlugin {
        async getCookies() {
          const cookies = document.cookie;
          const cookieMap = {};
          cookies.split(";").forEach((cookie) => {
            if (cookie.length <= 0)
              return;
            let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
            key = decode(key).trim();
            value = decode(value).trim();
            cookieMap[key] = value;
          });
          return cookieMap;
        }
        async setCookie(options) {
          try {
            const encodedKey = encode(options.key);
            const encodedValue = encode(options.value);
            const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
            const path = (options.path || "/").replace("path=", "");
            const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
            document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async deleteCookie(options) {
          try {
            document.cookie = `${options.key}=; Max-Age=0`;
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async clearCookies() {
          try {
            const cookies = document.cookie.split(";") || [];
            for (const cookie of cookies) {
              document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
        async clearAllCookies() {
          try {
            await this.clearCookies();
          } catch (error) {
            return Promise.reject(error);
          }
        }
      };
      CapacitorCookies = registerPlugin("CapacitorCookies", {
        web: () => new CapacitorCookiesPluginWeb()
      });
      readBlobAsBase64 = async (blob) => new Promise((resolve2, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          resolve2(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
      normalizeHttpHeaders = (headers = {}) => {
        const originalKeys = Object.keys(headers);
        const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
        const normalized = loweredKeys.reduce((acc, key, index) => {
          acc[key] = headers[originalKeys[index]];
          return acc;
        }, {});
        return normalized;
      };
      buildUrlParams = (params, shouldEncode = true) => {
        if (!params)
          return null;
        const output = Object.entries(params).reduce((accumulator, entry) => {
          const [key, value] = entry;
          let encodedValue;
          let item;
          if (Array.isArray(value)) {
            item = "";
            value.forEach((str) => {
              encodedValue = shouldEncode ? encodeURIComponent(str) : str;
              item += `${key}=${encodedValue}&`;
            });
            item.slice(0, -1);
          } else {
            encodedValue = shouldEncode ? encodeURIComponent(value) : value;
            item = `${key}=${encodedValue}`;
          }
          return `${accumulator}&${item}`;
        }, "");
        return output.substr(1);
      };
      buildRequestInit = (options, extra = {}) => {
        const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
        const headers = normalizeHttpHeaders(options.headers);
        const type = headers["content-type"] || "";
        if (typeof options.data === "string") {
          output.body = options.data;
        } else if (type.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(options.data || {})) {
            params.set(key, value);
          }
          output.body = params.toString();
        } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
          const form = new FormData();
          if (options.data instanceof FormData) {
            options.data.forEach((value, key) => {
              form.append(key, value);
            });
          } else {
            for (const key of Object.keys(options.data)) {
              form.append(key, options.data[key]);
            }
          }
          output.body = form;
          const headers2 = new Headers(output.headers);
          headers2.delete("content-type");
          output.headers = headers2;
        } else if (type.includes("application/json") || typeof options.data === "object") {
          output.body = JSON.stringify(options.data);
        }
        return output;
      };
      CapacitorHttpPluginWeb = class extends WebPlugin {
        /**
         * Perform an Http request given a set of options
         * @param options Options to build the HTTP request
         */
        async request(options) {
          const requestInit = buildRequestInit(options, options.webFetchExtra);
          const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
          const url = urlParams ? `${options.url}?${urlParams}` : options.url;
          const response = await fetch(url, requestInit);
          const contentType = response.headers.get("content-type") || "";
          let { responseType = "text" } = response.ok ? options : {};
          if (contentType.includes("application/json")) {
            responseType = "json";
          }
          let data;
          let blob;
          switch (responseType) {
            case "arraybuffer":
            case "blob":
              blob = await response.blob();
              data = await readBlobAsBase64(blob);
              break;
            case "json":
              data = await response.json();
              break;
            case "document":
            case "text":
            default:
              data = await response.text();
          }
          const headers = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
          return {
            data,
            headers,
            status: response.status,
            url: response.url
          };
        }
        /**
         * Perform an Http GET request given a set of options
         * @param options Options to build the HTTP request
         */
        async get(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
        }
        /**
         * Perform an Http POST request given a set of options
         * @param options Options to build the HTTP request
         */
        async post(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
        }
        /**
         * Perform an Http PUT request given a set of options
         * @param options Options to build the HTTP request
         */
        async put(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
        }
        /**
         * Perform an Http PATCH request given a set of options
         * @param options Options to build the HTTP request
         */
        async patch(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
        }
        /**
         * Perform an Http DELETE request given a set of options
         * @param options Options to build the HTTP request
         */
        async delete(options) {
          return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
        }
      };
      CapacitorHttp = registerPlugin("CapacitorHttp", {
        web: () => new CapacitorHttpPluginWeb()
      });
      (function(SystemBarsStyle2) {
        SystemBarsStyle2["Dark"] = "DARK";
        SystemBarsStyle2["Light"] = "LIGHT";
        SystemBarsStyle2["Default"] = "DEFAULT";
      })(SystemBarsStyle || (SystemBarsStyle = {}));
      (function(SystemBarType2) {
        SystemBarType2["StatusBar"] = "StatusBar";
        SystemBarType2["NavigationBar"] = "NavigationBar";
      })(SystemBarType || (SystemBarType = {}));
      SystemBarsPluginWeb = class extends WebPlugin {
        async setStyle() {
          this.unavailable("not available for web");
        }
        async setAnimation() {
          this.unavailable("not available for web");
        }
        async show() {
          this.unavailable("not available for web");
        }
        async hide() {
          this.unavailable("not available for web");
        }
      };
      SystemBars = registerPlugin("SystemBars", {
        web: () => new SystemBarsPluginWeb()
      });
    }
  });

  // node_modules/@capacitor/filesystem/dist/esm/definitions.js
  var Directory, Encoding;
  var init_definitions = __esm({
    "node_modules/@capacitor/filesystem/dist/esm/definitions.js"() {
      (function(Directory2) {
        Directory2["Documents"] = "DOCUMENTS";
        Directory2["Data"] = "DATA";
        Directory2["Library"] = "LIBRARY";
        Directory2["Cache"] = "CACHE";
        Directory2["External"] = "EXTERNAL";
        Directory2["ExternalStorage"] = "EXTERNAL_STORAGE";
        Directory2["ExternalCache"] = "EXTERNAL_CACHE";
        Directory2["LibraryNoCloud"] = "LIBRARY_NO_CLOUD";
        Directory2["Temporary"] = "TEMPORARY";
      })(Directory || (Directory = {}));
      (function(Encoding2) {
        Encoding2["UTF8"] = "utf8";
        Encoding2["ASCII"] = "ascii";
        Encoding2["UTF16"] = "utf16";
      })(Encoding || (Encoding = {}));
    }
  });

  // node_modules/@capacitor/filesystem/dist/esm/web.js
  var web_exports = {};
  __export(web_exports, {
    FilesystemWeb: () => FilesystemWeb
  });
  function resolve(path) {
    const posix = path.split("/").filter((item) => item !== ".");
    const newPosix = [];
    posix.forEach((item) => {
      if (item === ".." && newPosix.length > 0 && newPosix[newPosix.length - 1] !== "..") {
        newPosix.pop();
      } else {
        newPosix.push(item);
      }
    });
    return newPosix.join("/");
  }
  function isPathParent(parent, children) {
    parent = resolve(parent);
    children = resolve(children);
    const pathsA = parent.split("/");
    const pathsB = children.split("/");
    return parent !== children && pathsA.every((value, index) => value === pathsB[index]);
  }
  var FilesystemWeb;
  var init_web = __esm({
    "node_modules/@capacitor/filesystem/dist/esm/web.js"() {
      init_dist();
      init_definitions();
      FilesystemWeb = class _FilesystemWeb extends WebPlugin {
        constructor() {
          super(...arguments);
          this.DB_VERSION = 1;
          this.DB_NAME = "Disc";
          this._writeCmds = ["add", "put", "delete"];
          this.downloadFile = async (options) => {
            var _a, _b;
            const requestInit = buildRequestInit(options, options.webFetchExtra);
            const response = await fetch(options.url, requestInit);
            let blob;
            if (!options.progress)
              blob = await response.blob();
            else if (!(response === null || response === void 0 ? void 0 : response.body))
              blob = new Blob();
            else {
              const reader = response.body.getReader();
              let bytes = 0;
              const chunks = [];
              const contentType = response.headers.get("content-type");
              const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
              while (true) {
                const { done, value } = await reader.read();
                if (done)
                  break;
                chunks.push(value);
                bytes += (value === null || value === void 0 ? void 0 : value.length) || 0;
                const status = {
                  url: options.url,
                  bytes,
                  contentLength
                };
                this.notifyListeners("progress", status);
              }
              const allChunks = new Uint8Array(bytes);
              let position = 0;
              for (const chunk of chunks) {
                if (typeof chunk === "undefined")
                  continue;
                allChunks.set(chunk, position);
                position += chunk.length;
              }
              blob = new Blob([allChunks.buffer], { type: contentType || void 0 });
            }
            const result = await this.writeFile({
              path: options.path,
              directory: (_a = options.directory) !== null && _a !== void 0 ? _a : void 0,
              recursive: (_b = options.recursive) !== null && _b !== void 0 ? _b : false,
              data: blob
            });
            return { path: result.uri, blob };
          };
        }
        readFileInChunks(_options, _callback) {
          throw this.unavailable("Method not implemented.");
        }
        async initDb() {
          if (this._db !== void 0) {
            return this._db;
          }
          if (!("indexedDB" in window)) {
            throw this.unavailable("This browser doesn't support IndexedDB");
          }
          return new Promise((resolve2, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onupgradeneeded = _FilesystemWeb.doUpgrade;
            request.onsuccess = () => {
              this._db = request.result;
              resolve2(request.result);
            };
            request.onerror = () => reject(request.error);
            request.onblocked = () => {
              console.warn("db blocked");
            };
          });
        }
        static doUpgrade(event) {
          const eventTarget = event.target;
          const db = eventTarget.result;
          switch (event.oldVersion) {
            case 0:
            case 1:
            default: {
              if (db.objectStoreNames.contains("FileStorage")) {
                db.deleteObjectStore("FileStorage");
              }
              const store = db.createObjectStore("FileStorage", { keyPath: "path" });
              store.createIndex("by_folder", "folder");
            }
          }
        }
        async dbRequest(cmd, args) {
          const readFlag = this._writeCmds.indexOf(cmd) !== -1 ? "readwrite" : "readonly";
          return this.initDb().then((conn) => {
            return new Promise((resolve2, reject) => {
              const tx = conn.transaction(["FileStorage"], readFlag);
              const store = tx.objectStore("FileStorage");
              const req = store[cmd](...args);
              req.onsuccess = () => resolve2(req.result);
              req.onerror = () => reject(req.error);
            });
          });
        }
        async dbIndexRequest(indexName, cmd, args) {
          const readFlag = this._writeCmds.indexOf(cmd) !== -1 ? "readwrite" : "readonly";
          return this.initDb().then((conn) => {
            return new Promise((resolve2, reject) => {
              const tx = conn.transaction(["FileStorage"], readFlag);
              const store = tx.objectStore("FileStorage");
              const index = store.index(indexName);
              const req = index[cmd](...args);
              req.onsuccess = () => resolve2(req.result);
              req.onerror = () => reject(req.error);
            });
          });
        }
        getPath(directory, uriPath) {
          const cleanedUriPath = uriPath !== void 0 ? uriPath.replace(/^[/]+|[/]+$/g, "") : "";
          let fsPath = "";
          if (directory !== void 0)
            fsPath += "/" + directory;
          if (uriPath !== "")
            fsPath += "/" + cleanedUriPath;
          return fsPath;
        }
        async clear() {
          const conn = await this.initDb();
          const tx = conn.transaction(["FileStorage"], "readwrite");
          const store = tx.objectStore("FileStorage");
          store.clear();
        }
        /**
         * Read a file from disk
         * @param options options for the file read
         * @return a promise that resolves with the read file data result
         */
        async readFile(options) {
          const path = this.getPath(options.directory, options.path);
          const entry = await this.dbRequest("get", [path]);
          if (entry === void 0)
            throw Error("File does not exist.");
          return { data: entry.content ? entry.content : "" };
        }
        /**
         * Write a file to disk in the specified location on device
         * @param options options for the file write
         * @return a promise that resolves with the file write result
         */
        async writeFile(options) {
          const path = this.getPath(options.directory, options.path);
          let data = options.data;
          const encoding = options.encoding;
          const doRecursive = options.recursive;
          const occupiedEntry = await this.dbRequest("get", [path]);
          if (occupiedEntry && occupiedEntry.type === "directory")
            throw Error("The supplied path is a directory.");
          const parentPath = path.substr(0, path.lastIndexOf("/"));
          const parentEntry = await this.dbRequest("get", [parentPath]);
          if (parentEntry === void 0) {
            const subDirIndex = parentPath.indexOf("/", 1);
            if (subDirIndex !== -1) {
              const parentArgPath = parentPath.substr(subDirIndex);
              await this.mkdir({
                path: parentArgPath,
                directory: options.directory,
                recursive: doRecursive
              });
            }
          }
          if (!encoding && !(data instanceof Blob)) {
            data = data.indexOf(",") >= 0 ? data.split(",")[1] : data;
            if (!this.isBase64String(data))
              throw Error("The supplied data is not valid base64 content.");
          }
          const now = Date.now();
          const pathObj = {
            path,
            folder: parentPath,
            type: "file",
            size: data instanceof Blob ? data.size : data.length,
            ctime: now,
            mtime: now,
            content: data
          };
          await this.dbRequest("put", [pathObj]);
          return {
            uri: pathObj.path
          };
        }
        /**
         * Append to a file on disk in the specified location on device
         * @param options options for the file append
         * @return a promise that resolves with the file write result
         */
        async appendFile(options) {
          const path = this.getPath(options.directory, options.path);
          let data = options.data;
          const encoding = options.encoding;
          const parentPath = path.substr(0, path.lastIndexOf("/"));
          const now = Date.now();
          let ctime = now;
          const occupiedEntry = await this.dbRequest("get", [path]);
          if (occupiedEntry && occupiedEntry.type === "directory")
            throw Error("The supplied path is a directory.");
          const parentEntry = await this.dbRequest("get", [parentPath]);
          if (parentEntry === void 0) {
            const subDirIndex = parentPath.indexOf("/", 1);
            if (subDirIndex !== -1) {
              const parentArgPath = parentPath.substr(subDirIndex);
              await this.mkdir({
                path: parentArgPath,
                directory: options.directory,
                recursive: true
              });
            }
          }
          if (!encoding && !this.isBase64String(data))
            throw Error("The supplied data is not valid base64 content.");
          if (occupiedEntry !== void 0) {
            if (occupiedEntry.content instanceof Blob) {
              throw Error("The occupied entry contains a Blob object which cannot be appended to.");
            }
            if (occupiedEntry.content !== void 0 && !encoding) {
              data = btoa(atob(occupiedEntry.content) + atob(data));
            } else {
              data = occupiedEntry.content + data;
            }
            ctime = occupiedEntry.ctime;
          }
          const pathObj = {
            path,
            folder: parentPath,
            type: "file",
            size: data.length,
            ctime,
            mtime: now,
            content: data
          };
          await this.dbRequest("put", [pathObj]);
        }
        /**
         * Delete a file from disk
         * @param options options for the file delete
         * @return a promise that resolves with the deleted file data result
         */
        async deleteFile(options) {
          const path = this.getPath(options.directory, options.path);
          const entry = await this.dbRequest("get", [path]);
          if (entry === void 0)
            throw Error("File does not exist.");
          const entries = await this.dbIndexRequest("by_folder", "getAllKeys", [IDBKeyRange.only(path)]);
          if (entries.length !== 0)
            throw Error("Folder is not empty.");
          await this.dbRequest("delete", [path]);
        }
        /**
         * Create a directory.
         * @param options options for the mkdir
         * @return a promise that resolves with the mkdir result
         */
        async mkdir(options) {
          const path = this.getPath(options.directory, options.path);
          const doRecursive = options.recursive;
          const parentPath = path.substr(0, path.lastIndexOf("/"));
          const depth = (path.match(/\//g) || []).length;
          const parentEntry = await this.dbRequest("get", [parentPath]);
          const occupiedEntry = await this.dbRequest("get", [path]);
          if (depth === 1)
            throw Error("Cannot create Root directory");
          if (occupiedEntry !== void 0)
            throw Error("Current directory does already exist.");
          if (!doRecursive && depth !== 2 && parentEntry === void 0)
            throw Error("Parent directory must exist");
          if (doRecursive && depth !== 2 && parentEntry === void 0) {
            const parentArgPath = parentPath.substr(parentPath.indexOf("/", 1));
            await this.mkdir({
              path: parentArgPath,
              directory: options.directory,
              recursive: doRecursive
            });
          }
          const now = Date.now();
          const pathObj = {
            path,
            folder: parentPath,
            type: "directory",
            size: 0,
            ctime: now,
            mtime: now
          };
          await this.dbRequest("put", [pathObj]);
        }
        /**
         * Remove a directory
         * @param options the options for the directory remove
         */
        async rmdir(options) {
          const { path, directory, recursive } = options;
          const fullPath = this.getPath(directory, path);
          const entry = await this.dbRequest("get", [fullPath]);
          if (entry === void 0)
            throw Error("Folder does not exist.");
          if (entry.type !== "directory")
            throw Error("Requested path is not a directory");
          const readDirResult = await this.readdir({ path, directory });
          if (readDirResult.files.length !== 0 && !recursive)
            throw Error("Folder is not empty");
          for (const entry2 of readDirResult.files) {
            const entryPath = `${path}/${entry2.name}`;
            const entryObj = await this.stat({ path: entryPath, directory });
            if (entryObj.type === "file") {
              await this.deleteFile({ path: entryPath, directory });
            } else {
              await this.rmdir({ path: entryPath, directory, recursive });
            }
          }
          await this.dbRequest("delete", [fullPath]);
        }
        /**
         * Return a list of files from the directory (not recursive)
         * @param options the options for the readdir operation
         * @return a promise that resolves with the readdir directory listing result
         */
        async readdir(options) {
          const path = this.getPath(options.directory, options.path);
          const entry = await this.dbRequest("get", [path]);
          if (options.path !== "" && entry === void 0)
            throw Error("Folder does not exist.");
          const entries = await this.dbIndexRequest("by_folder", "getAllKeys", [IDBKeyRange.only(path)]);
          const files = await Promise.all(entries.map(async (e) => {
            let subEntry = await this.dbRequest("get", [e]);
            if (subEntry === void 0) {
              subEntry = await this.dbRequest("get", [e + "/"]);
            }
            return {
              name: e.substring(path.length + 1),
              type: subEntry.type,
              size: subEntry.size,
              ctime: subEntry.ctime,
              mtime: subEntry.mtime,
              uri: subEntry.path
            };
          }));
          return { files };
        }
        /**
         * Return full File URI for a path and directory
         * @param options the options for the stat operation
         * @return a promise that resolves with the file stat result
         */
        async getUri(options) {
          const path = this.getPath(options.directory, options.path);
          let entry = await this.dbRequest("get", [path]);
          if (entry === void 0) {
            entry = await this.dbRequest("get", [path + "/"]);
          }
          return {
            uri: (entry === null || entry === void 0 ? void 0 : entry.path) || path
          };
        }
        /**
         * Return data about a file
         * @param options the options for the stat operation
         * @return a promise that resolves with the file stat result
         */
        async stat(options) {
          const path = this.getPath(options.directory, options.path);
          let entry = await this.dbRequest("get", [path]);
          if (entry === void 0) {
            entry = await this.dbRequest("get", [path + "/"]);
          }
          if (entry === void 0)
            throw Error("Entry does not exist.");
          return {
            name: entry.path.substring(path.length + 1),
            type: entry.type,
            size: entry.size,
            ctime: entry.ctime,
            mtime: entry.mtime,
            uri: entry.path
          };
        }
        /**
         * Rename a file or directory
         * @param options the options for the rename operation
         * @return a promise that resolves with the rename result
         */
        async rename(options) {
          await this._copy(options, true);
          return;
        }
        /**
         * Copy a file or directory
         * @param options the options for the copy operation
         * @return a promise that resolves with the copy result
         */
        async copy(options) {
          return this._copy(options, false);
        }
        async requestPermissions() {
          return { publicStorage: "granted" };
        }
        async checkPermissions() {
          return { publicStorage: "granted" };
        }
        /**
         * Function that can perform a copy or a rename
         * @param options the options for the rename operation
         * @param doRename whether to perform a rename or copy operation
         * @return a promise that resolves with the result
         */
        async _copy(options, doRename = false) {
          let { toDirectory } = options;
          const { to, from, directory: fromDirectory } = options;
          if (!to || !from) {
            throw Error("Both to and from must be provided");
          }
          if (!toDirectory) {
            toDirectory = fromDirectory;
          }
          const fromPath = this.getPath(fromDirectory, from);
          const toPath = this.getPath(toDirectory, to);
          if (fromPath === toPath) {
            return {
              uri: toPath
            };
          }
          if (isPathParent(fromPath, toPath)) {
            throw Error("To path cannot contain the from path");
          }
          let toObj;
          try {
            toObj = await this.stat({
              path: to,
              directory: toDirectory
            });
          } catch (e) {
            const toPathComponents = to.split("/");
            toPathComponents.pop();
            const toPath2 = toPathComponents.join("/");
            if (toPathComponents.length > 0) {
              const toParentDirectory = await this.stat({
                path: toPath2,
                directory: toDirectory
              });
              if (toParentDirectory.type !== "directory") {
                throw new Error("Parent directory of the to path is a file");
              }
            }
          }
          if (toObj && toObj.type === "directory") {
            throw new Error("Cannot overwrite a directory with a file");
          }
          const fromObj = await this.stat({
            path: from,
            directory: fromDirectory
          });
          const updateTime = async (path, ctime2, mtime) => {
            const fullPath = this.getPath(toDirectory, path);
            const entry = await this.dbRequest("get", [fullPath]);
            entry.ctime = ctime2;
            entry.mtime = mtime;
            await this.dbRequest("put", [entry]);
          };
          const ctime = fromObj.ctime ? fromObj.ctime : Date.now();
          switch (fromObj.type) {
            // The "from" object is a file
            case "file": {
              const file = await this.readFile({
                path: from,
                directory: fromDirectory
              });
              if (doRename) {
                await this.deleteFile({
                  path: from,
                  directory: fromDirectory
                });
              }
              let encoding;
              if (!(file.data instanceof Blob) && !this.isBase64String(file.data)) {
                encoding = Encoding.UTF8;
              }
              const writeResult = await this.writeFile({
                path: to,
                directory: toDirectory,
                data: file.data,
                encoding
              });
              if (doRename) {
                await updateTime(to, ctime, fromObj.mtime);
              }
              return writeResult;
            }
            case "directory": {
              if (toObj) {
                throw Error("Cannot move a directory over an existing object");
              }
              try {
                await this.mkdir({
                  path: to,
                  directory: toDirectory,
                  recursive: false
                });
                if (doRename) {
                  await updateTime(to, ctime, fromObj.mtime);
                }
              } catch (e) {
              }
              const contents = (await this.readdir({
                path: from,
                directory: fromDirectory
              })).files;
              for (const filename of contents) {
                await this._copy({
                  from: `${from}/${filename.name}`,
                  to: `${to}/${filename.name}`,
                  directory: fromDirectory,
                  toDirectory
                }, doRename);
              }
              if (doRename) {
                await this.rmdir({
                  path: from,
                  directory: fromDirectory
                });
              }
            }
          }
          return {
            uri: toPath
          };
        }
        isBase64String(str) {
          try {
            return btoa(atob(str)) == str;
          } catch (err) {
            return false;
          }
        }
      };
      FilesystemWeb._debug = true;
    }
  });

  // node_modules/@capacitor/browser/dist/esm/web.js
  var web_exports2 = {};
  __export(web_exports2, {
    Browser: () => Browser,
    BrowserWeb: () => BrowserWeb
  });
  var BrowserWeb, Browser;
  var init_web2 = __esm({
    "node_modules/@capacitor/browser/dist/esm/web.js"() {
      init_dist();
      BrowserWeb = class extends WebPlugin {
        constructor() {
          super();
          this._lastWindow = null;
        }
        async open(options) {
          this._lastWindow = window.open(options.url, options.windowName || "_blank");
        }
        async close() {
          return new Promise((resolve2, reject) => {
            if (this._lastWindow != null) {
              this._lastWindow.close();
              this._lastWindow = null;
              resolve2();
            } else {
              reject("No active window to close!");
            }
          });
        }
      };
      Browser = new BrowserWeb();
    }
  });

  // node_modules/path-browserify/index.js
  var require_path_browserify = __commonJS({
    "node_modules/path-browserify/index.js"(exports, module) {
      "use strict";
      function assertPath(path) {
        if (typeof path !== "string") {
          throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
        }
      }
      function normalizeStringPosix(path, allowAboveRoot) {
        var res = "";
        var lastSegmentLength = 0;
        var lastSlash = -1;
        var dots = 0;
        var code;
        for (var i = 0; i <= path.length; ++i) {
          if (i < path.length)
            code = path.charCodeAt(i);
          else if (code === 47)
            break;
          else
            code = 47;
          if (code === 47) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
              if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                if (res.length > 2) {
                  var lastSlashIndex = res.lastIndexOf("/");
                  if (lastSlashIndex !== res.length - 1) {
                    if (lastSlashIndex === -1) {
                      res = "";
                      lastSegmentLength = 0;
                    } else {
                      res = res.slice(0, lastSlashIndex);
                      lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                    }
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = "";
                  lastSegmentLength = 0;
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              }
              if (allowAboveRoot) {
                if (res.length > 0)
                  res += "/..";
                else
                  res = "..";
                lastSegmentLength = 2;
              }
            } else {
              if (res.length > 0)
                res += "/" + path.slice(lastSlash + 1, i);
              else
                res = path.slice(lastSlash + 1, i);
              lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
          } else if (code === 46 && dots !== -1) {
            ++dots;
          } else {
            dots = -1;
          }
        }
        return res;
      }
      function _format(sep, pathObject) {
        var dir = pathObject.dir || pathObject.root;
        var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir) {
          return base;
        }
        if (dir === pathObject.root) {
          return dir + base;
        }
        return dir + sep + base;
      }
      var posix = {
        // path.resolve([from ...], to)
        resolve: function resolve2() {
          var resolvedPath = "";
          var resolvedAbsolute = false;
          var cwd;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path;
            if (i >= 0)
              path = arguments[i];
            else {
              if (cwd === void 0)
                cwd = process.cwd();
              path = cwd;
            }
            assertPath(path);
            if (path.length === 0) {
              continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47;
          }
          resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
          if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
              return "/" + resolvedPath;
            else
              return "/";
          } else if (resolvedPath.length > 0) {
            return resolvedPath;
          } else {
            return ".";
          }
        },
        normalize: function normalize(path) {
          assertPath(path);
          if (path.length === 0) return ".";
          var isAbsolute = path.charCodeAt(0) === 47;
          var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
          path = normalizeStringPosix(path, !isAbsolute);
          if (path.length === 0 && !isAbsolute) path = ".";
          if (path.length > 0 && trailingSeparator) path += "/";
          if (isAbsolute) return "/" + path;
          return path;
        },
        isAbsolute: function isAbsolute(path) {
          assertPath(path);
          return path.length > 0 && path.charCodeAt(0) === 47;
        },
        join: function join3() {
          if (arguments.length === 0)
            return ".";
          var joined;
          for (var i = 0; i < arguments.length; ++i) {
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
              if (joined === void 0)
                joined = arg;
              else
                joined += "/" + arg;
            }
          }
          if (joined === void 0)
            return ".";
          return posix.normalize(joined);
        },
        relative: function relative(from, to) {
          assertPath(from);
          assertPath(to);
          if (from === to) return "";
          from = posix.resolve(from);
          to = posix.resolve(to);
          if (from === to) return "";
          var fromStart = 1;
          for (; fromStart < from.length; ++fromStart) {
            if (from.charCodeAt(fromStart) !== 47)
              break;
          }
          var fromEnd = from.length;
          var fromLen = fromEnd - fromStart;
          var toStart = 1;
          for (; toStart < to.length; ++toStart) {
            if (to.charCodeAt(toStart) !== 47)
              break;
          }
          var toEnd = to.length;
          var toLen = toEnd - toStart;
          var length = fromLen < toLen ? fromLen : toLen;
          var lastCommonSep = -1;
          var i = 0;
          for (; i <= length; ++i) {
            if (i === length) {
              if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                  return to.slice(toStart + i + 1);
                } else if (i === 0) {
                  return to.slice(toStart + i);
                }
              } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                  lastCommonSep = i;
                } else if (i === 0) {
                  lastCommonSep = 0;
                }
              }
              break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
              break;
            else if (fromCode === 47)
              lastCommonSep = i;
          }
          var out = "";
          for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === 47) {
              if (out.length === 0)
                out += "..";
              else
                out += "/..";
            }
          }
          if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
          else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47)
              ++toStart;
            return to.slice(toStart);
          }
        },
        _makeLong: function _makeLong(path) {
          return path;
        },
        dirname: function dirname(path) {
          assertPath(path);
          if (path.length === 0) return ".";
          var code = path.charCodeAt(0);
          var hasRoot = code === 47;
          var end = -1;
          var matchedSlash = true;
          for (var i = path.length - 1; i >= 1; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
              matchedSlash = false;
            }
          }
          if (end === -1) return hasRoot ? "/" : ".";
          if (hasRoot && end === 1) return "//";
          return path.slice(0, end);
        },
        basename: function basename2(path, ext) {
          if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
          assertPath(path);
          var start = 0;
          var end = -1;
          var matchedSlash = true;
          var i;
          if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path) return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
              var code = path.charCodeAt(i);
              if (code === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else {
                if (firstNonSlashEnd === -1) {
                  matchedSlash = false;
                  firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                  if (code === ext.charCodeAt(extIdx)) {
                    if (--extIdx === -1) {
                      end = i;
                    }
                  } else {
                    extIdx = -1;
                    end = firstNonSlashEnd;
                  }
                }
              }
            }
            if (start === end) end = firstNonSlashEnd;
            else if (end === -1) end = path.length;
            return path.slice(start, end);
          } else {
            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
            }
            if (end === -1) return "";
            return path.slice(start, end);
          }
        },
        extname: function extname(path) {
          assertPath(path);
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var preDotState = 0;
          for (var i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
          }
          return path.slice(startDot, end);
        },
        format: function format(pathObject) {
          if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
          }
          return _format("/", pathObject);
        },
        parse: function parse(path) {
          assertPath(path);
          var ret = { root: "", dir: "", base: "", ext: "", name: "" };
          if (path.length === 0) return ret;
          var code = path.charCodeAt(0);
          var isAbsolute = code === 47;
          var start;
          if (isAbsolute) {
            ret.root = "/";
            start = 1;
          } else {
            start = 0;
          }
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var i = path.length - 1;
          var preDotState = 0;
          for (; i >= start; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1) startDot = i;
              else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
              if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
              else ret.base = ret.name = path.slice(startPart, end);
            }
          } else {
            if (startPart === 0 && isAbsolute) {
              ret.name = path.slice(1, startDot);
              ret.base = path.slice(1, end);
            } else {
              ret.name = path.slice(startPart, startDot);
              ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
          }
          if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
          else if (isAbsolute) ret.dir = "/";
          return ret;
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
      };
      posix.posix = posix;
      module.exports = posix;
    }
  });

  // node_modules/capacitor-nodejs/dist/esm/web.js
  var web_exports3 = {};
  __export(web_exports3, {
    CapacitorNodeJSWeb: () => CapacitorNodeJSWeb
  });
  var CapacitorNodeJSWeb;
  var init_web3 = __esm({
    "node_modules/capacitor-nodejs/dist/esm/web.js"() {
      init_dist();
      CapacitorNodeJSWeb = class extends WebPlugin {
        unavailableNodeJS() {
          return this.unavailable("The NodeJS engine is not available in the browser!");
        }
        start() {
          throw this.unavailableNodeJS();
        }
        send() {
          throw this.unavailableNodeJS();
        }
        whenReady() {
          throw this.unavailableNodeJS();
        }
      };
    }
  });

  // src/platform/PlatformManager.ts
  var PlatformManager = class {
    static setPlatform(platform) {
      this.instance = platform;
    }
    static get current() {
      if (!this.instance) {
        throw new Error("Platform not initialized. Call PlatformManager.setPlatform() first.");
      }
      return this.instance;
    }
  };
  __publicField(PlatformManager, "instance");

  // node_modules/@capacitor/filesystem/dist/esm/index.js
  init_dist();

  // node_modules/@capacitor/synapse/dist/synapse.mjs
  function s(t) {
    t.CapacitorUtils.Synapse = new Proxy(
      {},
      {
        get(e, n) {
          return new Proxy({}, {
            get(w, o) {
              return (c, p, r) => {
                const i = t.Capacitor.Plugins[n];
                if (i === void 0) {
                  r(new Error(`Capacitor plugin ${n} not found`));
                  return;
                }
                if (typeof i[o] != "function") {
                  r(new Error(`Method ${o} not found in Capacitor plugin ${n}`));
                  return;
                }
                (async () => {
                  try {
                    const a = await i[o](c);
                    p(a);
                  } catch (a) {
                    r(a);
                  }
                })();
              };
            }
          });
        }
      }
    );
  }
  function u(t) {
    t.CapacitorUtils.Synapse = new Proxy(
      {},
      {
        get(e, n) {
          return t.cordova.plugins[n];
        }
      }
    );
  }
  function f(t = false) {
    typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !t ? s(window) : window.cordova !== void 0 && u(window));
  }

  // node_modules/@capacitor/filesystem/dist/esm/index.js
  init_definitions();
  var Filesystem = registerPlugin("Filesystem", {
    web: () => Promise.resolve().then(() => (init_web(), web_exports)).then((m) => new m.FilesystemWeb())
  });
  f();

  // node_modules/@capacitor/browser/dist/esm/index.js
  init_dist();
  var Browser2 = registerPlugin("Browser", {
    web: () => Promise.resolve().then(() => (init_web2(), web_exports2)).then((m) => new m.BrowserWeb())
  });

  // src/platform/CapacitorPlatform.ts
  var CapacitorPlatform = class {
    constructor() {
      __publicField(this, "id", "capacitor");
    }
    async readFile(path) {
      const result = await Filesystem.readFile({
        path,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      return result.data;
    }
    async writeFile(path, content) {
      await Filesystem.writeFile({
        path,
        data: content,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
    }
    async readdir(path) {
      const result = await Filesystem.readdir({
        path,
        directory: Directory.Data
      });
      return result.files.map((f2) => f2.name);
    }
    async exists(path) {
      try {
        await Filesystem.stat({
          path,
          directory: Directory.Data
        });
        return true;
      } catch {
        return false;
      }
    }
    async unlink(path) {
      await Filesystem.deleteFile({
        path,
        directory: Directory.Data
      });
    }
    async mkdir(path) {
      try {
        await Filesystem.mkdir({
          path,
          directory: Directory.Data,
          recursive: true
        });
      } catch (e) {
      }
    }
    async stat(path) {
      const stat = await Filesystem.stat({
        path,
        directory: Directory.Data
      });
      return {
        isFile: stat.type === "file",
        isDirectory: stat.type === "directory"
      };
    }
    async openPath(path) {
      console.log("openPath not supported on Capacitor", path);
    }
    async openExternal(url) {
      await Browser2.open({ url });
    }
    getThemesPath() {
      return "themes";
    }
    getPluginsPath() {
      return "plugins";
    }
    getEnhancedPath() {
      return "";
    }
    async init() {
      if (!await this.exists(this.getThemesPath())) {
        await this.mkdir(this.getThemesPath());
      }
      if (!await this.exists(this.getPluginsPath())) {
        await this.mkdir(this.getPluginsPath());
      }
    }
  };

  // src/utils/Helpers.ts
  var import_electron = __require("electron");

  // src/utils/logger.browser.ts
  var BrowserLogger = class {
    info(message, ...meta) {
      console.info(`[INFO] ${message}`, ...meta);
    }
    warn(message, ...meta) {
      console.warn(`[WARN] ${message}`, ...meta);
    }
    error(message, ...meta) {
      console.error(`[ERROR] ${message}`, ...meta);
    }
  };
  var logger = new BrowserLogger();
  function getLogger(label) {
    return logger;
  }
  var logger_browser_default = logger;

  // src/constants/index.ts
  var SELECTORS = {
    SECTIONS_CONTAINER: '[class^="sections-container-"]',
    SECTION: '[class^="section-"]',
    CATEGORY: ".category-GP0hI",
    CATEGORY_LABEL: ".label-N_O2v",
    CATEGORY_ICON: ".icon-oZoyV",
    CATEGORY_HEADING: ".heading-XePFl",
    LABEL: '[class^="label-wXG3e"]',
    NAV_MENU: ".menu-xeE06",
    SETTINGS_CONTENT: ".settings-content-co5eU",
    ENHANCED_SECTION: "#enhanced",
    THEMES_CATEGORY: "#enhanced > div:nth-child(2)",
    PLUGINS_CATEGORY: "#enhanced > div:nth-child(3)",
    ABOUT_CATEGORY: "#enhanced > div:nth-child(4)",
    ROUTE_CONTAINER: ".route-container:last-child .route-content",
    META_DETAILS_CONTAINER: ".metadetails-container-K_Dqa",
    DESCRIPTION_CONTAINER: ".description-container-yi8iU",
    ADDONS_LIST_CONTAINER: ".addons-list-container-Ovr2Z",
    ADDON_CONTAINER: ".addon-container-lC5KN",
    NAME_CONTAINER: ".name-container-qIAg8",
    DESCRIPTION_ITEM: ".description-container-v7Jhe",
    TYPES_CONTAINER: ".types-container-DaOrg",
    SEARCH_INPUT: ".search-input-bAgAh",
    HORIZONTAL_NAV: ".horizontal-nav-bar-container-Y_zvK",
    TOAST_ITEM: ".toast-item-container-nG0uk",
    TOAST_CONTAINER: ".toasts-container-oKECy"
  };
  var CLASSES = {
    OPTION: "option-vFOAS",
    CONTENT: "content-P2T0i",
    BUTTON: "button-DNmYL",
    BUTTON_CONTAINER: "button-container-zVLH6",
    SELECTED: "selected-S7SeK",
    INSTALL_BUTTON: "install-button-container-yfcq5",
    UNINSTALL_BUTTON: "uninstall-button-container-oV4Yo",
    CHECKED: "checked"
  };
  var STORAGE_KEYS = {
    ENABLED_PLUGINS: "enabledPlugins",
    CURRENT_THEME: "currentTheme",
    DISCORD_RPC: "discordrichpresence",
    CHECK_UPDATES_ON_STARTUP: "checkForUpdatesOnStartup"
  };
  var FILE_EXTENSIONS = {
    THEME: ".theme.css",
    PLUGIN: ".plugin.js"
  };
  var URLS = {
    STREMIO_WEB: "https://web.stremio.com/",
    STREMIO_WEB_ADD_ADDON: "https://web.stremio.com/#/addons?addon=",
    REGISTRY: "https://raw.githubusercontent.com/REVENGE977/stremio-enhanced-registry/refs/heads/main/registry.json",
    VERSION_CHECK: "https://github.com/REVENGE977/stremio-enhanced-community/raw/main/version",
    RELEASES_API: "https://api.github.com/repos/REVENGE977/stremio-enhanced-community/releases/latest",
    RELEASES_PAGE: "https://github.com/REVENGE977/stremio-enhanced-community/releases/latest",
    STREMIO_SERVICE_GITHUB_API: "https://api.github.com/repos/Stremio/stremio-service/releases/latest"
  };
  var TIMEOUTS = {
    ELEMENT_WAIT: 1e4,
    INSTALL_COMPLETION: 12e4,
    SERVICE_CHECK_INTERVAL: 5e3,
    SERVER_RELOAD_DELAY: 1500,
    CORESTATE_RETRY_INTERVAL: 1e3,
    CORESTATE_MAX_RETRIES: 30
  };

  // src/components/mods-tab/mods-tab.html
  var mods_tab_default = '<div class="nav-content-container-zl9hQ" style="width: 90%; overflow-y: auto;">\n    <div class="addons-content-zhFBl">\n        <div class="selectable-inputs-container-tUul1">\n            <div class="spacing-wH1w5"></div>\n            <label title="Search themes/plugins" class="search-bar-k7MXd search-bar-container-p4tSt">\n                <input size="1" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" tabindex="0" class="search-input-bAgAh text-input-hnLiz" type="text" placeholder="Search themes/plugins" value="">\n                <svg class="icon-QOYfJ" viewBox="0 0 512 512">\n                    <path d="M456.882 415.7999999999997l-93.791-89.45c22.605-28.67 34.784-63.57 34.686-99.44 0-91.54-78.142-166.07-174.125-166.07s-174.125 74.53-174.125 166.17c0 91.54 78.142 166.07 174.125 166.07 37.586 0 74.161-11.61 104.256-33.08l93.79 89.45c3.535 3.04 7.91 5.05 12.604 5.79 4.696 0.74 9.515 0.18 13.887-1.61 4.374-1.79 8.117-4.74 10.788-8.49 2.671-3.76 4.157-8.17 4.284-12.7 0.108-6.11-2.165-12.04-6.379-16.64m-357.62-188.79c-0.01-29.43 11.453-57.8 32.162-79.61 20.709-21.82 49.183-35.49 79.884-38.39 30.7-2.9 61.433 5.2 86.221 22.72 24.787 17.52 41.858 43.2 47.891 72.05 6.034 28.86 0.598 58.83-15.249 84.07s-40.972 43.96-70.489 52.53c-29.518 8.55-61.317 6.33-89.213-6.24s-49.895-34.57-61.718-61.75c-6.258-14.38-9.483-29.81-9.488-45.38" style="fill: currentcolor;"></path>\n                </svg>\n            </label>\n        </div>\n        <br/>\n        <div tabindex="0" title="Submit your themes and plugins here" target="_blank" class="link-FrL1t button-container-zVLH6">\n            <a href="https://github.com/REVENGE977/stremio-enhanced-registry" target="_blank" rel="noreferrer">\n                <div class="label-PJvSJ" style="text-align: center;">Submit your themes and plugins</div>\n            </a>\n        </div>\n\n        <div class="addons-list-container-Ovr2Z" id="mods-list">\n            \n        </div>\n        <br/>\n    </div>\n</div>';

  // src/components/mods-item/mods-item.html
  var mods_item_default = '<br>\n<div tabindex="0" class="addon-whmdO animation-fade-in addon-container-lC5KN button-container-zVLH6">\n    <div class="logo-container-ZcSSC">\n        <!-- theme preview here -->\n\n        <!-- plugin icon here -->\n    </div>\n\n	<div class="info-container-AdMB6">\n		<div class="name-container-qIAg8" title="{{ name }}">{{ name }}</div>\n		<div class="version-container-zdPyN" title="{{ version }}">{{ version }}</div>\n		<div class="types-container-DaOrg">{{ type }}</div>\n        <div class="description-container-v7Jhe">\n            <b>Description:</b> {{ description }}\n            <br>\n            <b>Author:</b> {{ author }}\n        </div>\n	</div>\n	<div class="buttons-container-g0xXr">\n		<div class="action-buttons-container-xMVmz">\n			<div tabindex="-1" title="{{ actionbtnTitle }}" class="{{ actionbtnClass }} button-container-zVLH6 modActionBtn" data-link="{{ download }}" data-type="{{ type }}">\n				<div class="label-OnWh2">{{ actionbtnTitle }}</div>\n			</div>\n		</div>\n		<a href="{{ repo }}" target="_blank" rel="noreferrer" class="share-button-container-s3gwP button-container-zVLH6">\n			<svg class="icon-GxVbY" viewBox="0 0 24 24">\n				<path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" style="fill: currentcolor;" />\n			</svg>\n			<div class="label-OnWh2">Open repository</div>\n		</a>\n	</div>\n</div>\n';

  // src/components/about-category/about-category.html
  var about_category_default = '<h4 style="color: white; margin-bottom: 1rem;">\n    Developed By: <p style="display: inline !important;"><a href="https://github.com/REVENGE977" target="_blank" rel="noreferrer">REVENGE977</a></p>\n    <br/>\n    Version: v{{ version }}\n    <br/>\n</h4>\n\n<div class="option-vFOAS">\n    <div class="heading-dYMDt">\n        <div class="label-qI6Vh">Check for updates on startup</div>\n    </div>\n    <div class="content-P2T0i">\n        <div tabindex="-1" class="toggle-container-lZfHP button-container-zVLH6 {{ checkForUpdatesOnStartup }}" id="checkForUpdatesOnStartup">\n            <div class="toggle-toOWM"></div>\n        </div>\n    </div>\n</div>\n\n<div class="option-vFOAS">\n    <div class="heading-dYMDt">\n        <div class="label-qI6Vh">Discord Rich Presence</div>\n    </div>\n    <div class="content-P2T0i">\n        <div tabindex="-1" class="toggle-container-lZfHP button-container-zVLH6 {{ discordrichpresence }}" id="discordrichpresence" style="outline: none;">\n            <div class="toggle-toOWM"></div>\n        </div>\n    </div>\n</div>\n\n<div class="option-vFOAS">\n    <div class="heading-dYMDt">\n        <div class="label-qI6Vh">Window transparency</div>\n    </div>\n    <div class="content-P2T0i">\n        <div tabindex="-1" class="toggle-container-lZfHP button-container-zVLH6 {{ enableTransparentThemes }}" id="enableTransparentThemes" style="outline: none;">\n            <div class="toggle-toOWM"></div>\n        </div>\n    </div>\n</div>\n\n<p style="color:gray;">This option has to be enabled for themes that support transparency to work. (experimental)</p>\n<br/>\n\n<div class="option-vFOAS">\n    <div class="content-P2T0i">\n        <div tabindex="0" title="Community Plugins &amp; Themes" class="button-DNmYL button-container-zVLH6 button" id="browsePluginsThemesBtn">\n            Community Marketplace\n        </div>\n    </div>\n</div>\n\n<div class="option-vFOAS">\n    <div class="content-P2T0i">\n        <div tabindex="0" title="Check For Updates" class="button-DNmYL button-container-zVLH6 button" id="checkforupdatesBtn">\n            Check For Updates\n        </div>\n    </div>\n</div>\n\n<br/>';

  // src/components/default-theme/default-theme.html
  var default_theme_default = `<div class="option-vFOAS">
    <div class="heading-dYMDt">
        <div class="label-qI6Vh">Default</div>
    </div>
    <div class="content-P2T0i">
        <div
        title="Default"
        id="Default"
        tabindex="-1"
        onclick="applyTheme('Default')"
        style="color: white; margin-bottom: 1rem; width: max-content; background-color: {{ backgroundColor }};"
        class="button button-container-zVLH6 {{ disabled }}"
        >{{ label }}</div>
    </div>
</div>
`;

  // src/components/back-btn/back-btn.html
  var back_btn_default = '<div tabindex="-1" class="button-container-xT9_L back-button-container-lDB1N button-container-zVLH6" id="back-btn">\n    <svg class="icon-T8MU6" viewBox="0 0 512 512">\n        <path d="M328.6100000000006 106.469l-143.53 136.889 143.53 136.889" style="stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 48; fill: none;"></path>\n    </svg>\n</div>';

  // src/components/title-bar/title-bar.html
  var title_bar_default = '<nav class="title-bar">\n    <div class="title-bar-buttons">\n        <div id="minimizeApp-btn" title="Minimize" class="button">\n            <svg viewBox="0 0 24 24">\n                <path d="M20,14H4V10H20" style="fill:white;"></path>\n            </svg>\n        </div>\n        <div id="maximizeApp-btn" title="Maximize" class="button">\n            <svg viewBox="0 0 24 24">\n                <path d="M3,3H21V21H3V3M5,5V19H19V5H5Z" style="fill:white;"></path>\n            </svg>\n        </div>\n        <div id="closeApp-btn" title="Close" class="button">\n            <svg viewBox="0 0 24 24" style="width: 25px; height: 25px;">\n                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" style="fill:white;"></path>\n            </svg>\n        </div>\n    </div>\n\n    <style>\n		body > *:not(.title-bar) {\n			padding-top: 40px; \n		}\n\n        .button {\n            cursor: pointer;\n        }\n\n        .title-bar {\n            position: fixed; \n            top: 0;\n            left: 0;\n            right: 0;\n            height: 40px;\n            z-index: 9999;\n            display: flex;\n            align-items: center;\n            justify-content: flex-end;\n            background: rgba(0,0,0,0.15);\n            backdrop-filter: blur(20px) saturate(120%);\n			-webkit-app-region: drag;\n        }\n\n        .title-bar-buttons {\n            -webkit-app-region: no-drag;\n            display: flex;\n            align-items: center;\n            gap: 2.0rem;\n            margin-left: auto;\n			margin-right: 20px;\n        }\n\n        .title-bar-buttons svg {\n            width: 20px;\n            height: 20px;\n        }\n    </style>\n</nav>\n';

  // src/utils/templateCache.browser.ts
  var templates = {
    "mods-tab": mods_tab_default,
    "mods-item": mods_item_default,
    "about-category": about_category_default,
    "default-theme": default_theme_default,
    "back-btn": back_btn_default,
    "title-bar": title_bar_default
  };
  var TemplateCache = class {
    static load(dir, name) {
      return templates[name] || "";
    }
  };
  var templateCache_browser_default = TemplateCache;

  // src/components/toast/toast.ts
  async function getToastTemplate(id, title, message, status) {
    const template = templateCache_browser_default.load("/", "toast");
    let toastStatus;
    switch (status) {
      case "success":
        toastStatus = "success-eIDTa";
        break;
      case "fail":
        toastStatus = "error-quyOd";
        break;
      case "info":
        toastStatus = "info-KEWq8";
        break;
    }
    return template.replace("{{ id }}", id).replace("{{ title }}", title).replace("{{ message }}", message).replace("{{ status }}", toastStatus);
  }

  // src/utils/Helpers.ts
  var _Helpers = class _Helpers {
    constructor() {
      __publicField(this, "mainWindow", null);
    }
    static getInstance() {
      if (!_Helpers.instance) {
        _Helpers.instance = new _Helpers();
      }
      return _Helpers.instance;
    }
    setMainWindow(mainWindow) {
      this.mainWindow = mainWindow;
    }
    async showAlert(alertType, title, message, buttons) {
      const options = {
        type: alertType,
        title,
        message,
        buttons
      };
      try {
        const response = await import_electron.dialog.showMessageBox(this.mainWindow, options);
        return response.response;
      } catch (error) {
        logger_browser_default.error("Error displaying alert: " + error.message);
        return -1;
      }
    }
    waitForElm(selector, timeout = TIMEOUTS.ELEMENT_WAIT) {
      return new Promise((resolve2, reject) => {
        const existingElement = document.querySelector(selector);
        if (existingElement) {
          return resolve2(existingElement);
        }
        const observer = new MutationObserver(() => {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve2(element);
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Timeout waiting for element with selector: ${selector}`));
        }, timeout);
      });
    }
    waitForElmByXPath(xpath, timeout = TIMEOUTS.ELEMENT_WAIT) {
      return new Promise((resolve2, reject) => {
        const evaluateXPath = () => {
          const result = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          return result.singleNodeValue;
        };
        const existingElement = evaluateXPath();
        if (existingElement) {
          return resolve2(existingElement);
        }
        const observer = new MutationObserver(() => {
          const element = evaluateXPath();
          if (element) {
            observer.disconnect();
            resolve2(element);
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Timeout waiting for element with XPath: ${xpath}`));
        }, timeout);
      });
    }
    waitForTitleChange(timeout = TIMEOUTS.ELEMENT_WAIT) {
      return new Promise((resolve2, reject) => {
        const headElement = document.querySelector("head");
        if (!headElement) {
          return reject(new Error("Head element not found"));
        }
        const observer = new MutationObserver(() => {
          observer.disconnect();
          resolve2(document.title);
        });
        observer.observe(headElement, {
          subtree: true,
          childList: true
        });
        setTimeout(() => {
          observer.disconnect();
          reject(new Error("Timeout waiting for document.title to change"));
        }, timeout);
      });
    }
    async createToast(toastId, title, message, status, timeoutMs = 3e3) {
      const template = await getToastTemplate(toastId, title, message, status);
      const toastContainer = document.querySelector(SELECTORS.TOAST_CONTAINER);
      if (toastContainer) {
        toastContainer.innerHTML += template;
        setTimeout(() => {
          document.getElementById(toastId)?.remove();
        }, timeoutMs);
      }
    }
    /**
     * Execute JavaScript in the context of Stremio's core services
     * @param js - JavaScript code to execute
     * @returns Promise with the result of the execution
     */
    _eval(js) {
      return new Promise((resolve2, reject) => {
        try {
          const eventName = "stremio-enhanced";
          const script = document.createElement("script");
          const handler = (data) => {
            script.remove();
            resolve2(data.detail);
          };
          window.addEventListener(eventName, handler, { once: true });
          script.id = eventName;
          script.appendChild(
            document.createTextNode(`
                        var core = window.services.core;
                        var result = ${js};

                        if (result instanceof Promise) {
                            result.then((awaitedResult) => {
                                window.dispatchEvent(new CustomEvent("${eventName}", { detail: awaitedResult }));
                            });
                        } else {
                            window.dispatchEvent(new CustomEvent("${eventName}", { detail: result }));
                        }
                    `)
          );
          document.head.appendChild(script);
        } catch (err) {
          reject(err);
        }
      });
    }
    getElementByXpath(path) {
      return document.evaluate(
        path,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    }
    getFileNameFromUrl(url) {
      const parts = url.split("/");
      return parts[parts.length - 1] || "";
    }
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
    /**
     * Compare two semantic version strings
     * @returns true if version1 > version2
     */
    isNewerVersion(version1, version2) {
      const normalize = (v) => v.replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
      const v1Parts = normalize(version1);
      const v2Parts = normalize(version2);
      const maxLength = Math.max(v1Parts.length, v2Parts.length);
      for (let i = 0; i < maxLength; i++) {
        const v1 = v1Parts[i] ?? 0;
        const v2 = v2Parts[i] ?? 0;
        if (v1 > v2) return true;
        if (v1 < v2) return false;
      }
      return false;
    }
  };
  __publicField(_Helpers, "instance");
  var Helpers = _Helpers;
  var helpersInstance = Helpers.getInstance();
  var Helpers_default = helpersInstance;

  // src/components/plugin-item/pluginItem.ts
  function getPluginItemTemplate(filename, metaData, checked) {
    let template = templateCache_browser_default.load("/", "plugin-item");
    const metaKeys = ["name", "description", "author", "version"];
    metaKeys.forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      template = template.replace(regex, metaData[key] || "");
    });
    return template.replace("{{ checked }}", checked ? "checked" : "").replace(/\{\{\s*fileName\s*\}\}/g, filename);
  }

  // src/components/theme-item/themeItem.ts
  function getThemeItemTemplate(filename, metaData, applied) {
    let template = templateCache_browser_default.load("/", "theme-item");
    const metaKeys = ["name", "description", "author", "version"];
    metaKeys.forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      template = template.replace(regex, metaData[key] || "");
    });
    return template.replace("{{ disabled }}", applied ? "disabled" : "").replace(/\{\{\s*fileName\s*\}\}/g, filename).replace("{{ label }}", applied ? "Applied" : "Apply").replace("{{ buttonClass }}", applied ? "uninstall-button-container-oV4Yo" : "install-button-container-yfcq5");
  }

  // src/components/enhanced-nav/enhancedNav.ts
  function getEnhancedNav() {
    return templateCache_browser_default.load("/", "enhanced-nav");
  }

  // src/core/Properties.ts
  var Properties = class {
    static get enhancedPath() {
      return PlatformManager.current.getEnhancedPath();
    }
    static get themesPath() {
      return PlatformManager.current.getThemesPath();
    }
    static get pluginsPath() {
      return PlatformManager.current.getPluginsPath();
    }
  };
  __publicField(Properties, "themeLinkSelector", "head > link[rel=stylesheet]");
  __publicField(Properties, "isUsingStremioService", false);
  var Properties_default = Properties;

  // src/components/apply-theme/applyTheme.browser.ts
  function getApplyThemeTemplate() {
    return `
    function applyTheme(theme) {
        console.log("applying " + theme);

        // Call the native/preload handler to actually load the CSS
        if (window.stremioEnhanced && window.stremioEnhanced.applyTheme) {
            window.stremioEnhanced.applyTheme(theme);
        }

        // UI Updates
        const currentTheme = localStorage.getItem("currentTheme");
        if (currentTheme) {
            const currentThemeElement = document.getElementById(currentTheme);
            if (currentThemeElement) {
                currentThemeElement.classList.remove("disabled");

                if (currentTheme !== "Default") {
                    currentThemeElement.classList.remove("uninstall-button-container-oV4Yo");
                    currentThemeElement.classList.add("install-button-container-yfcq5");
                } else {
                    currentThemeElement.style.backgroundColor = "var(--secondary-accent-color)";
                }

                currentThemeElement.innerText = "Apply";
            }
        }

        localStorage.setItem("currentTheme", theme);

        const newThemeElement = document.getElementById(theme);
        if (newThemeElement) {
            newThemeElement.classList.add("disabled");

            if (theme !== "Default") {
                newThemeElement.classList.remove("install-button-container-yfcq5");
                newThemeElement.classList.add("uninstall-button-container-oV4Yo");
            } else {
                newThemeElement.style.backgroundColor = "var(--overlay-color)";
            }

            newThemeElement.innerText = "Applied";
        }
    }
    `;
  }

  // src/core/ModManager.ts
  var import_path = __toESM(require_path_browserify());

  // src/interfaces/MetaData.ts
  var REQUIRED_METADATA_KEYS = [
    "name",
    "description",
    "author",
    "version"
  ];
  var ALL_METADATA_KEYS = [
    "name",
    "description",
    "author",
    "version",
    "updateUrl",
    "source",
    "license",
    "homepage"
  ];

  // src/utils/ExtractMetaData.ts
  var ExtractMetaData = class {
    /**
     * Parse metadata from a comment block in the format:
     * /** @key value *\/
    */
    static parseMetadataFromContent(content) {
      const blockMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
      if (!blockMatch) return null;
      const result = {};
      const tagRegex = /@(\w+)\s+([^\n\r]+)/g;
      for (const [, rawKey, rawValue] of blockMatch[1].matchAll(tagRegex)) {
        if (!ALL_METADATA_KEYS.includes(rawKey)) continue;
        const key = rawKey;
        if (result[key] !== void 0) continue;
        result[key] = rawValue.trim();
      }
      for (const key of REQUIRED_METADATA_KEYS) {
        if (!result[key]) return null;
      }
      return result;
    }
    static extractMetadataFromText(textContent) {
      const metadata = this.parseMetadataFromContent(textContent);
      if (!metadata) {
        logger_browser_default.error("Comment block not found in the provided text");
      }
      return metadata;
    }
  };
  var ExtractMetaData_default = ExtractMetaData;

  // src/core/ModManager.ts
  var ModManager = class {
    /**
     * Load and enable a plugin by filename
     */
    static async loadPlugin(pluginName) {
      if (document.getElementById(pluginName)) {
        this.logger.info(`Plugin ${pluginName} is already loaded`);
        return;
      }
      const pluginPath = (0, import_path.join)(Properties_default.pluginsPath, pluginName);
      if (!await PlatformManager.current.exists(pluginPath)) {
        this.logger.error(`Plugin file not found: ${pluginPath}`);
        return;
      }
      const plugin = await PlatformManager.current.readFile(pluginPath);
      const script = document.createElement("script");
      script.innerHTML = plugin;
      script.id = pluginName;
      document.body.appendChild(script);
      const enabledPlugins = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
      );
      if (!enabledPlugins.includes(pluginName)) {
        enabledPlugins.push(pluginName);
        localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
      }
      this.logger.info(`Plugin ${pluginName} loaded!`);
    }
    /**
     * Unload and disable a plugin by filename
     */
    static unloadPlugin(pluginName) {
      const pluginElement = document.getElementById(pluginName);
      if (pluginElement) {
        pluginElement.remove();
      }
      let enabledPlugins = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
      );
      enabledPlugins = enabledPlugins.filter((x) => x !== pluginName);
      localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
      this.logger.info(`Plugin ${pluginName} unloaded!`);
    }
    /**
     * Fetch mods from the registry repository
     */
    static async fetchMods() {
      const response = await fetch(URLS.REGISTRY);
      return response.json();
    }
    /**
     * Download and save a mod (plugin or theme)
     */
    static async downloadMod(modLink, type) {
      this.logger.info(`Downloading ${type} from: ${modLink}`);
      const response = await fetch(modLink);
      if (!response.ok) throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      const saveDir = type === "plugin" ? Properties_default.pluginsPath : Properties_default.themesPath;
      if (!await PlatformManager.current.exists(saveDir)) {
        await PlatformManager.current.mkdir(saveDir);
      }
      const filename = (0, import_path.basename)(new URL(modLink).pathname) || `${type}-${Date.now()}`;
      const filePath = (0, import_path.join)(saveDir, filename);
      const content = await response.text();
      await PlatformManager.current.writeFile(filePath, content);
      this.logger.info(`Downloaded ${type} saved to: ${filePath}`);
      return filePath;
    }
    /**
     * Remove a mod file and clean up associated state
     */
    static async removeMod(fileName, type) {
      this.logger.info(`Removing ${type} file: ${fileName}`);
      switch (type) {
        case "plugin":
          if (await this.isPluginInstalled(fileName)) {
            await PlatformManager.current.unlink((0, import_path.join)(Properties_default.pluginsPath, fileName));
            let enabledPlugins = JSON.parse(
              localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
            );
            if (enabledPlugins.includes(fileName)) {
              enabledPlugins = enabledPlugins.filter((x) => x !== fileName);
              localStorage.setItem(STORAGE_KEYS.ENABLED_PLUGINS, JSON.stringify(enabledPlugins));
            }
          }
          break;
        case "theme":
          if (await this.isThemeInstalled(fileName)) {
            if (localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) === fileName) {
              localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
            }
            document.getElementById("activeTheme")?.remove();
            await PlatformManager.current.unlink((0, import_path.join)(Properties_default.themesPath, fileName));
          }
          break;
      }
    }
    static async isThemeInstalled(fileName) {
      return (await this.getInstalledThemes()).includes(fileName);
    }
    static async isPluginInstalled(fileName) {
      return (await this.getInstalledPlugins()).includes(fileName);
    }
    static async getInstalledThemes() {
      const dirPath = Properties_default.themesPath;
      if (!await PlatformManager.current.exists(dirPath)) return [];
      const files = await PlatformManager.current.readdir(dirPath);
      const fileStats = await Promise.all(files.map(async (file) => {
        const stat = await PlatformManager.current.stat((0, import_path.join)(dirPath, file));
        return { file, isFile: stat.isFile };
      }));
      return fileStats.filter((f2) => f2.isFile).map((f2) => f2.file);
    }
    static async getInstalledPlugins() {
      const dirPath = Properties_default.pluginsPath;
      if (!await PlatformManager.current.exists(dirPath)) return [];
      const files = await PlatformManager.current.readdir(dirPath);
      const fileStats = await Promise.all(files.map(async (file) => {
        const stat = await PlatformManager.current.stat((0, import_path.join)(dirPath, file));
        return { file, isFile: stat.isFile };
      }));
      return fileStats.filter((f2) => f2.isFile).map((f2) => f2.file);
    }
    /**
     * Set up event listeners for plugin toggle checkboxes
     */
    static togglePluginListener() {
      Helpers_default.waitForElm(SELECTORS.PLUGINS_CATEGORY).then(() => {
        this.logger.info("Listening to plugin checkboxes...");
        const pluginCheckboxes = document.getElementsByClassName("plugin");
        for (let i = 0; i < pluginCheckboxes.length; i++) {
          pluginCheckboxes[i].addEventListener("click", async () => {
            pluginCheckboxes[i].classList.toggle(CLASSES.CHECKED);
            const pluginName = pluginCheckboxes[i].getAttribute("name");
            if (!pluginName) return;
            if (pluginCheckboxes[i].classList.contains(CLASSES.CHECKED)) {
              await this.loadPlugin(pluginName);
            } else {
              this.unloadPlugin(pluginName);
              this.showReloadWarning();
            }
          });
        }
      }).catch((err) => this.logger.error(`Failed to setup plugin listeners: ${err}`));
    }
    static showReloadWarning() {
      if (document.getElementById("plugin-reload-warning")) return;
      this.logger.info("Plugin unloaded, adding reload warning.");
      const container = document.querySelector(SELECTORS.PLUGINS_CATEGORY);
      if (!container) return;
      const paragraph = document.createElement("p");
      paragraph.id = "plugin-reload-warning";
      paragraph.style.color = "white";
      const link = document.createElement("a");
      link.style.color = "cyan";
      link.style.cursor = "pointer";
      link.textContent = "here";
      link.addEventListener("click", () => {
        window.location.href = "/";
      });
      paragraph.appendChild(document.createTextNode("Reload is required to disable plugins. Click "));
      paragraph.appendChild(link);
      paragraph.appendChild(document.createTextNode(" to reload."));
      container.appendChild(paragraph);
    }
    static openThemesFolder() {
      Helpers_default.waitForElm("#openthemesfolderBtn").then(() => {
        const button = document.getElementById("openthemesfolderBtn");
        button?.addEventListener("click", async () => {
          await this.openFolder(Properties_default.themesPath);
        });
      }).catch((err) => this.logger.error(`Failed to setup themes folder button: ${err}`));
    }
    static openPluginsFolder() {
      Helpers_default.waitForElm("#openpluginsfolderBtn").then(() => {
        const button = document.getElementById("openpluginsfolderBtn");
        button?.addEventListener("click", async () => {
          await this.openFolder(Properties_default.pluginsPath);
        });
      }).catch((err) => this.logger.error(`Failed to setup plugins folder button: ${err}`));
    }
    /**
     * Open a folder in the system file explorer
     */
    static async openFolder(folderPath) {
      try {
        await PlatformManager.current.openPath(folderPath);
      } catch (error) {
        this.logger.error(`Failed to open folder ${folderPath}: ${error}`);
      }
    }
    static scrollListener() {
      Helpers_default.waitForElm(".menu-xeE06 > div:nth-child(5) > div").then(() => {
        const enhanced = document.getElementById("enhanced");
        const enhancedNav = document.querySelector(".menu-xeE06 > div:nth-child(5) > div");
        if (!enhanced || !enhancedNav) return;
        enhancedNav.addEventListener("click", () => {
          const firstChild = document.querySelector("#enhanced > div");
          firstChild?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          Settings_default.activeSection(enhancedNav);
        });
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              Settings_default.activeSection(enhancedNav);
            } else {
              enhancedNav.classList.remove(CLASSES.SELECTED);
            }
          });
        }, { threshold: 0.1 });
        observer.observe(enhanced);
      }).catch((err) => this.logger.error(`Failed to setup scroll listener: ${err}`));
    }
    /**
     * Add the applyTheme function to the page
     */
    static addApplyThemeFunction() {
      const applyThemeScript = getApplyThemeTemplate();
      const script = document.createElement("script");
      script.innerHTML = applyThemeScript;
      document.body.appendChild(script);
    }
    /**
     * Check for updates for a specific plugin or theme
     */
    static async checkForItemUpdates(itemFile) {
      this.logger.info("Checking for updates for " + itemFile);
      const itemBox = document.getElementsByName(`${itemFile}-box`)[0];
      if (!itemBox) {
        this.logger.warn(`${itemFile}-box element not found.`);
        return;
      }
      const pluginOrTheme = itemFile.endsWith(".theme.css") ? "theme" : "plugin";
      const itemPath = (0, import_path.join)(
        pluginOrTheme === "theme" ? Properties_default.themesPath : Properties_default.pluginsPath,
        itemFile
      );
      let fileContent = "";
      try {
        fileContent = await PlatformManager.current.readFile(itemPath);
      } catch (e) {
        this.logger.error(`Failed to read file ${itemPath}: ${e}`);
        return;
      }
      const installedItemMetaData = ExtractMetaData_default.extractMetadataFromText(fileContent);
      if (!installedItemMetaData || Object.keys(installedItemMetaData).length === 0) {
        return;
      }
      const updateUrl = installedItemMetaData.updateUrl;
      if (!updateUrl || updateUrl === "none") {
        this.logger.info(`No update URL provided for ${pluginOrTheme} (${installedItemMetaData.name})`);
        return;
      }
      try {
        const request = await fetch(updateUrl);
        if (request.status !== 200) {
          this.logger.warn(`Failed to fetch update for ${itemFile}: HTTP ${request.status}`);
          return;
        }
        const response = await request.text();
        const extractedMetaData = ExtractMetaData_default.extractMetadataFromText(response);
        if (!extractedMetaData) {
          this.logger.warn(`Failed to extract metadata from response for ${pluginOrTheme} (${installedItemMetaData.name})`);
          return;
        }
        if (Helpers_default.isNewerVersion(extractedMetaData.version, installedItemMetaData.version)) {
          this.logger.info(
            `Update available for ${pluginOrTheme} (${installedItemMetaData.name}): v${installedItemMetaData.version} -> v${extractedMetaData.version}`
          );
          const updateButton = document.getElementById(`${itemFile}-update`);
          if (updateButton) {
            updateButton.style.display = "flex";
            updateButton.addEventListener("click", async () => {
              await PlatformManager.current.writeFile(itemPath, response);
              Settings_default.removeItem(itemFile);
              Settings_default.addItem(pluginOrTheme, itemFile, extractedMetaData);
            });
          }
        } else {
          this.logger.info(
            `No update available for ${pluginOrTheme} (${installedItemMetaData.name}). Current version: v${installedItemMetaData.version}`
          );
        }
      } catch (error) {
        this.logger.error(`Error checking updates for ${itemFile}: ${error.message}`);
      }
    }
  };
  __publicField(ModManager, "logger", getLogger("ModManager"));
  var ModManager_default = ModManager;

  // src/core/Settings.ts
  var Settings = class {
    /**
     * Add a new section to the settings panel
     */
    static addSection(sectionId, title) {
      this.waitForSettingsPanel().then(() => {
        this.logger.info(`Adding section: ${sectionId} with title: ${title}`);
        const settingsPanel = this.getSettingsPanel();
        if (!settingsPanel) return;
        const sectionElement = this.getExistingSection(settingsPanel);
        const labelElement = this.getExistingSectionLabel(sectionElement);
        if (!sectionElement || !labelElement) return;
        const sectionClassName = sectionElement.className;
        const titleClassName = labelElement.className;
        const sectionContainer = document.createElement("div");
        sectionContainer.className = sectionClassName;
        sectionContainer.id = sectionId;
        const sectionTitle = document.createElement("div");
        sectionTitle.className = titleClassName;
        sectionTitle.textContent = title;
        sectionContainer.appendChild(sectionTitle);
        settingsPanel.appendChild(sectionContainer);
        this.waitForNavMenu().then(() => {
          const nav = this.getNavMenu();
          const shortcutsNav = this.getNavShortcutItem();
          if (!nav) return;
          if (document.querySelector(`[data-section="${sectionId}"]`)) return;
          const enhancedNavContainer = document.createElement("div");
          enhancedNavContainer.innerHTML = getEnhancedNav();
          if (shortcutsNav) {
            nav.insertBefore(enhancedNavContainer, shortcutsNav.nextSibling);
          } else {
            nav.appendChild(enhancedNavContainer);
          }
        }).catch((err) => this.logger.error(`Failed to add nav: ${err}`));
      }).catch((err) => this.logger.error(`Failed to add section: ${err}`));
    }
    /**
     * Add a category within a section
     */
    static addCategory(title, sectionId, icon) {
      this.waitForSettingsPanel().then(() => {
        this.logger.info(`Adding category: ${title} to section: ${sectionId}`);
        const categoryTemplate = this.getCategoryTemplate();
        if (!categoryTemplate) return;
        const { categoryClass, categoryTitleClass, headingClass, iconClass } = categoryTemplate;
        icon = icon.replace(`class="icon"`, `class="${iconClass}"`);
        const section = document.getElementById(sectionId);
        if (!section) return;
        const categoryDiv = document.createElement("div");
        categoryDiv.className = categoryClass;
        const titleDiv = document.createElement("div");
        titleDiv.className = categoryTitleClass;
        titleDiv.innerHTML = title;
        const headingDiv = document.createElement("div");
        if (headingClass) {
          headingDiv.className = headingClass;
        } else {
          headingDiv.classList.add(SELECTORS.CATEGORY_HEADING.replace(".", ""));
        }
        headingDiv.innerHTML += icon;
        headingDiv.appendChild(titleDiv);
        categoryDiv.appendChild(headingDiv);
        section.appendChild(categoryDiv);
      }).catch((err) => this.logger.error(`Failed to add category: ${err}`));
    }
    /**
     * Add a button to the settings
     */
    static addButton(title, id, query) {
      Helpers_default.waitForElm(query).then(() => {
        const element = document.querySelector(query);
        if (!element) return;
        const optionDiv = document.createElement("div");
        optionDiv.classList.add(CLASSES.OPTION);
        const contentDiv = document.createElement("div");
        contentDiv.classList.add(CLASSES.CONTENT);
        const buttonDiv = document.createElement("div");
        buttonDiv.setAttribute("tabindex", "0");
        buttonDiv.setAttribute("title", title);
        buttonDiv.classList.add(CLASSES.BUTTON, CLASSES.BUTTON_CONTAINER, "button");
        buttonDiv.id = id;
        buttonDiv.textContent = title;
        contentDiv.appendChild(buttonDiv);
        optionDiv.appendChild(contentDiv);
        element.appendChild(optionDiv);
      }).catch((err) => this.logger.error(`Failed to add button: ${err}`));
    }
    /**
     * Add a theme or plugin item to the settings
     */
    static addItem(type, fileName, metaData) {
      this.logger.info(`Adding ${type}: ${fileName}`);
      if (type === "theme") {
        Helpers_default.waitForElm(SELECTORS.THEMES_CATEGORY).then(() => {
          this.addTheme(fileName, metaData);
        }).catch((err) => this.logger.error(`Failed to add theme: ${err}`));
      } else if (type === "plugin") {
        Helpers_default.waitForElm(SELECTORS.PLUGINS_CATEGORY).then(() => {
          this.addPlugin(fileName, metaData);
        }).catch((err) => this.logger.error(`Failed to add plugin: ${err}`));
      }
    }
    static addPlugin(fileName, metaData) {
      const enabledPlugins = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
      );
      const pluginContainer = document.createElement("div");
      pluginContainer.innerHTML = getPluginItemTemplate(fileName, metaData, enabledPlugins.includes(fileName));
      pluginContainer.setAttribute("name", `${fileName}-box`);
      const pluginsCategory = document.querySelector(SELECTORS.PLUGINS_CATEGORY);
      pluginsCategory?.appendChild(pluginContainer);
      ModManager_default.checkForItemUpdates(fileName);
    }
    static addTheme(fileName, metaData) {
      const currentTheme = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME);
      const themeContainer = document.createElement("div");
      themeContainer.innerHTML = getThemeItemTemplate(fileName, metaData, currentTheme === fileName);
      themeContainer.setAttribute("name", `${fileName}-box`);
      const themesCategory = document.querySelector(SELECTORS.THEMES_CATEGORY);
      themesCategory?.appendChild(themeContainer);
      ModManager_default.checkForItemUpdates(fileName);
    }
    /**
     * Remove an item from the settings
     */
    static removeItem(fileName) {
      const element = document.getElementsByName(`${fileName}-box`)[0];
      element?.remove();
    }
    /**
     * Set a navigation element as active
     */
    static activeSection(element) {
      const nav = this.getNavMenu();
      if (nav) {
        for (let i = 0; i < nav.children.length; i++) {
          nav.children[i].classList.remove(CLASSES.SELECTED);
        }
      } else {
        for (let i = 0; i < 6; i++) {
          const navItem = document.querySelector(`${SELECTORS.NAV_MENU} > div:nth-child(${i})`);
          navItem?.classList.remove(CLASSES.SELECTED);
        }
      }
      element.classList.add(CLASSES.SELECTED);
    }
    // --- Dynamic Discovery Helpers ---
    static getNavMenu() {
      const nav = document.querySelector(SELECTORS.NAV_MENU);
      if (nav) return nav;
      const keywords = ["Board", "Discover", "Library"];
      const links = Array.from(document.querySelectorAll("a, div[title]"));
      for (const link of links) {
        const title = link.getAttribute("title");
        if (title && keywords.includes(title)) {
          let parent = link.parentElement;
          while (parent) {
            const found = keywords.filter((k) => parent.querySelector(`[title="${k}"]`));
            if (found.length >= 2) {
              return parent;
            }
            parent = parent.parentElement;
            if (parent === document.body) break;
          }
        }
      }
      return null;
    }
    static getNavShortcutItem() {
      const item = document.querySelector('[title="Shortcuts"]');
      return item;
    }
    static getSettingsPanel() {
      const panel = document.querySelector(SELECTORS.SECTIONS_CONTAINER);
      if (panel) return panel;
      const keywords = ["General", "Player", "Streaming"];
      const allDivs = Array.from(document.querySelectorAll("div"));
      for (const div of allDivs) {
        if (div.children.length > 2) {
          let matchCount = 0;
          for (let i = 0; i < div.children.length; i++) {
            if (keywords.some((k) => div.children[i].textContent?.includes(k))) {
              matchCount++;
            }
          }
          if (matchCount >= 2) return div;
        }
      }
      return null;
    }
    static getExistingSection(panel) {
      const keywords = ["General", "Player"];
      for (let i = 0; i < panel.children.length; i++) {
        const child = panel.children[i];
        if (keywords.some((k) => child.textContent?.includes(k))) {
          return child;
        }
      }
      return document.querySelector(SELECTORS.SECTION);
    }
    static getExistingSectionLabel(section) {
      if (!section) return null;
      if (section.children.length > 0) return section.children[0];
      return document.querySelector(SELECTORS.LABEL);
    }
    static getCategoryTemplate() {
      const categoryElement = document.querySelector(SELECTORS.CATEGORY);
      const categoryTitleElement = document.querySelector(SELECTORS.CATEGORY_LABEL);
      const categoryIconElement = document.querySelector(SELECTORS.CATEGORY_ICON);
      const categoryHeadingElement = document.querySelector(SELECTORS.CATEGORY_HEADING);
      let categoryClass = categoryElement?.className || "";
      let categoryTitleClass = categoryTitleElement?.className || "";
      let headingClass = categoryHeadingElement?.className || "";
      let iconClass = "icon";
      if (categoryIconElement instanceof SVGElement) {
        iconClass = categoryIconElement.className.baseVal;
      } else if (categoryIconElement) {
        iconClass = categoryIconElement.className;
      }
      if (categoryClass && categoryTitleClass) {
        return { categoryClass, categoryTitleClass, headingClass, iconClass };
      }
      const panel = this.getSettingsPanel();
      if (panel) {
        const section = this.getExistingSection(panel);
        if (section) {
          for (let i = 0; i < section.children.length; i++) {
            const child = section.children[i];
            const label = this.getExistingSectionLabel(section);
            if (child === label) continue;
            categoryClass = child.className;
            const heading = child.children[0];
            if (heading) {
              headingClass = heading.className;
              const icon = heading.querySelector("svg") || heading.children[0];
              if (icon) {
                if (icon instanceof SVGElement) iconClass = icon.className.baseVal;
                else iconClass = icon.className;
              }
              const title = heading.querySelector("div") || heading.children[1];
              if (title) categoryTitleClass = title.className;
            }
            if (categoryClass && categoryTitleClass) {
              return { categoryClass, categoryTitleClass, headingClass, iconClass };
            }
          }
        }
      }
      return null;
    }
    static waitForSettingsPanel() {
      return new Promise((resolve2) => {
        let retries = 0;
        const maxRetries = 20;
        const interval = setInterval(() => {
          if (this.getSettingsPanel()) {
            clearInterval(interval);
            resolve2();
          } else {
            retries++;
            if (retries > maxRetries) {
              clearInterval(interval);
              this.logger.error("Timeout waiting for settings panel");
              resolve2();
            }
          }
        }, 500);
      });
    }
    static waitForNavMenu() {
      return new Promise((resolve2) => {
        let retries = 0;
        const maxRetries = 20;
        const interval = setInterval(() => {
          if (this.getNavMenu()) {
            clearInterval(interval);
            resolve2();
          } else {
            retries++;
            if (retries > maxRetries) {
              clearInterval(interval);
              this.logger.error("Timeout waiting for nav menu");
              resolve2();
            }
          }
        }, 500);
      });
    }
  };
  __publicField(Settings, "logger", getLogger("Settings"));
  var Settings_default = Settings;

  // src/components/mods-tab/modsTab.ts
  function getModsTabTemplate() {
    return templateCache_browser_default.load("/", "mods-tab");
  }

  // src/components/mods-item/modsItem.ts
  function getModItemTemplate(metaData, type, installed) {
    let template = templateCache_browser_default.load("/", "mods-item");
    let logoBlock = "";
    if (type === "Theme") {
      if (!metaData.preview) {
        logoBlock = `
        <svg class="icon-GxVbY" viewBox="0 0 24 24">
            <path d="M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z" style="fill: currentcolor;"></path>
        </svg>`;
      } else {
        logoBlock = `
            <a href="${metaData.preview}" target="_blank" rel="noreferrer">
                <img class="logo-WrsGF" src="${metaData.preview}" alt="Theme Preview" loading="lazy">
            </a>`;
      }
    } else {
      logoBlock = `
        <svg class="icon-GxVbY" viewBox="0 0 512 512">
            <path d="M345.6500000000001 456.3000000000002h-70.87c-2.35 0.01-4.69-0.43-6.86-1.29-2.18-0.87-4.15-2.14-5.79-3.75-3.37-3.19-5.27-7.54-5.29-12.07v-26.33c0.03-4.05-0.81-8.07-2.49-11.79s-4.12-7.07-7.17-9.89c-7.78-7.22-19.04-11.22-30.8-10.93-21.33 0.47-39.27 18.35-39.27 39.07v19.87c0.01 2.24-0.45 4.48-1.36 6.55s-2.24 3.95-3.93 5.52c-3.35 3.21-7.9 5.02-12.65 5.04h-70.17c-14.71 0.01-28.83-5.55-39.23-15.46-10.42-9.91-16.28-23.36-16.29-37.4v-66.92c0.03-4.53 1.92-8.87 5.28-12.07 3.36-3.21 7.91-5.01 12.66-5.04h27.61c9.17 0 18.04-3.71 25.02-10.46 3.89-3.72 6.98-8.15 9.07-13.02a37.2 37.2 0 0 0 3.09-15.4c-0.3-20.15-17.64-37.17-37.98-37.17h-26.71c-2.35 0.01-4.69-0.43-6.87-1.29a17.7 17.7 0 0 1-5.79-3.75c-3.37-3.19-5.26-7.54-5.28-12.07v-66.92a50.9 50.9 0 0 1 4.19-20.25c2.76-6.43 6.86-12.25 12.06-17.11 10.39-9.91 24.48-15.48 39.17-15.5h55.02c2.12 0.01 4.16-0.77 5.68-2.19 0.73-0.71 1.32-1.55 1.71-2.49 0.4-0.93 0.6-1.92 0.58-2.92v-6.18a59 59 0 0 1 5.08-24.05c3.38-7.62 8.29-14.53 14.46-20.35 6.19-5.8 13.55-10.36 21.62-13.4a69.8 69.8 0 0 1 25.32-4.47c35.38 0.57 64.19 28.9 64.19 63.03v5.42c-0.03 1.51 0.42 3 1.29 4.25a7.73 7.73 0 0 0 3.61 2.81c0.98 0.37 2.03 0.56 3.07 0.54h55.02a56.4 56.4 0 0 1 20.93 3.99c13.4 5.31 24.04 15.46 29.6 28.24 2.77 6.32 4.2 13.11 4.19 19.96v52.47c-0.03 1.52 0.42 3.01 1.3 4.26a7.66 7.66 0 0 0 3.6 2.81c0.98 0.37 2.03 0.56 3.07 0.54h5.68c36.48 0 66.09 27.57 66.09 61.41 0 34.79-29.31 63.12-65.29 63.12h-6.48c-2.12-0.01-4.15 0.78-5.68 2.19a7.4 7.4 0 0 0-1.71 2.49c-0.4 0.93-0.6 1.93-0.58 2.93v53.23c0.01 6.85-1.42 13.64-4.19 19.96-5.56 12.78-16.2 22.93-29.6 28.24a56 56 0 0 1-20.93 3.99" style="fill: currentcolor;"></path>
        </svg>`;
    }
    const metaKeys = ["name", "description", "author", "version"];
    metaKeys.forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      template = template.replace(regex, metaData[key] || "");
    });
    return template.replace(/\{\{\s*type\s*\}\}/g, type).replace(/\{\{\s*actionbtnTitle\s*\}\}/g, installed ? "Uninstall" : "Install").replace("{{ actionbtnClass }}", installed ? "uninstall-button-container-oV4Yo" : "install-button-container-yfcq5").replace("{{ download }}", metaData.download).replace("{{ repo }}", metaData.repo).replace("<!-- theme preview here -->", logoBlock).replace("<!-- plugin icon here -->", "");
  }

  // src/components/about-category/aboutCategory.ts
  function getAboutCategoryTemplate(version, checkForUpdatesOnStartup, discordRichPresence, enableTransparentThemes) {
    const template = templateCache_browser_default.load("/", "about-category");
    return template.replace("{{ version }}", version).replace("{{ checkForUpdatesOnStartup }}", checkForUpdatesOnStartup ? "checked" : "").replace("{{ discordrichpresence }}", discordRichPresence ? "checked" : "").replace("{{ enableTransparentThemes }}", enableTransparentThemes ? "checked" : "");
  }

  // src/components/default-theme/defaultTheme.ts
  function getDefaultThemeTemplate(applied) {
    const template = templateCache_browser_default.load("/", "default-theme");
    return template.replace("{{ disabled }}", applied ? "disabled" : "").replace("{{ label }}", applied ? "Applied" : "Apply").replace("{{ backgroundColor }}", applied ? "var(--overlay-color)" : "var(--secondary-accent-color)");
  }

  // src/components/back-btn/backBtn.ts
  function getBackButton() {
    return templateCache_browser_default.load("/", "back-btn");
  }

  // src/android/preload.ts
  var import_path2 = __toESM(require_path_browserify());

  // node_modules/capacitor-nodejs/dist/esm/NodeJS.js
  init_dist();

  // node_modules/capacitor-nodejs/dist/esm/implementation.js
  init_dist();
  var CapacitorNodeJS = registerPlugin("CapacitorNodeJS", {
    web: () => Promise.resolve().then(() => (init_web3(), web_exports3)).then((m) => new m.CapacitorNodeJSWeb()),
    electron: () => window.CapacitorCustomPlatform.plugins.CapacitorNodeJS
  });

  // node_modules/capacitor-nodejs/dist/esm/NodeJS.js
  var NodeJSPlugin = class {
    constructor() {
      this.listenerList = [];
    }
    start(args) {
      return CapacitorNodeJS.start(args);
    }
    send(args) {
      return CapacitorNodeJS.send(args);
    }
    whenReady() {
      return CapacitorNodeJS.whenReady();
    }
    addListener(eventName, listenerFunc) {
      const listenerHandle = CapacitorNodeJS.addListener(eventName, (data) => {
        listenerFunc(data);
      });
      this.listenerList.push({ eventName, listenerHandle });
      return listenerHandle;
    }
    async removeListener(listenerHandle) {
      if (Capacitor.getPlatform() === "electron") {
        await CapacitorNodeJS.removeListener(listenerHandle);
      } else {
        await listenerHandle.remove();
      }
      for (let index = 0; index < this.listenerList.length; index++) {
        const listener = this.listenerList[index];
        if (listenerHandle === await listener.listenerHandle) {
          this.listenerList.splice(index, 1);
          break;
        }
      }
    }
    async removeAllListeners(eventName) {
      for (const listener of [...this.listenerList]) {
        if (!eventName || eventName === listener.eventName) {
          const listenerHandle = await listener.listenerHandle;
          await this.removeListener(listenerHandle);
        }
      }
    }
  };
  var NodeJS = new NodeJSPlugin();

  // src/core/LogManager.ts
  var _LogManager = class _LogManager {
    constructor() {
      __publicField(this, "logs", []);
      __publicField(this, "maxLogs", 1e3);
      __publicField(this, "originalConsole", {});
      __publicField(this, "isHooked", false);
    }
    static getInstance() {
      if (!_LogManager.instance) {
        _LogManager.instance = new _LogManager();
      }
      return _LogManager.instance;
    }
    hookConsole() {
      if (this.isHooked) return;
      this.isHooked = true;
      const methods = ["INFO", "WARN", "ERROR", "DEBUG"];
      methods.forEach((level) => {
        const consoleMethod = level.toLowerCase();
        this.originalConsole[consoleMethod] = console[consoleMethod].bind(console);
        console[consoleMethod] = (...args) => {
          this.addLog(level, args.map(
            (arg) => typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          ).join(" "));
          this.originalConsole[consoleMethod](...args);
        };
      });
      this.originalConsole["log"] = console.log.bind(console);
      console.log = (...args) => {
        this.addLog("INFO", args.map(
          (arg) => typeof arg === "object" ? JSON.stringify(arg) : String(arg)
        ).join(" "));
        this.originalConsole["log"](...args);
      };
    }
    addLog(level, message) {
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[1].slice(0, -1);
      this.logs.push({ timestamp, level, message });
      if (this.logs.length > this.maxLogs) {
        this.logs.shift();
      }
    }
    showLogs() {
      const overlayId = "stremio-enhanced-logs-overlay";
      if (document.getElementById(overlayId)) return;
      const overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
            color: #fff;
            font-family: monospace;
        `;
      const header = document.createElement("div");
      header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            background: #1a1a1a;
            padding: 10px;
            border-radius: 5px;
        `;
      const title = document.createElement("h2");
      title.textContent = "Logs";
      title.style.margin = "0";
      const controls = document.createElement("div");
      controls.style.display = "flex";
      controls.style.gap = "10px";
      const filterSelect = document.createElement("select");
      filterSelect.style.cssText = `
            background: #333;
            color: white;
            border: 1px solid #555;
            padding: 5px;
            border-radius: 3px;
        `;
      ["ALL", "INFO", "WARN", "ERROR"].forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        filterSelect.appendChild(option);
      });
      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Copy All";
      copyBtn.style.cssText = `
            background: #4a4a4a;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        `;
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Close";
      closeBtn.style.cssText = `
            background: #c0392b;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        `;
      controls.appendChild(filterSelect);
      controls.appendChild(copyBtn);
      controls.appendChild(closeBtn);
      header.appendChild(title);
      header.appendChild(controls);
      const logsContainer = document.createElement("div");
      logsContainer.id = "logs-container";
      logsContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            background: #111;
            padding: 10px;
            border-radius: 5px;
            white-space: pre-wrap;
            word-break: break-all;
            font-size: 12px;
        `;
      overlay.appendChild(header);
      overlay.appendChild(logsContainer);
      document.body.appendChild(overlay);
      const renderLogs = () => {
        const filter = filterSelect.value;
        const filteredLogs = filter === "ALL" ? this.logs : this.logs.filter((l) => l.level === filter);
        logsContainer.innerHTML = filteredLogs.map((l) => {
          const color = l.level === "ERROR" ? "#ff5555" : l.level === "WARN" ? "#ffb86c" : "#50fa7b";
          return `<div style="margin-bottom: 2px;"><span style="color: #6272a4">[${l.timestamp}]</span> <span style="color: ${color}">[${l.level}]</span> ${this.escapeHtml(l.message)}</div>`;
        }).join("");
        logsContainer.scrollTop = logsContainer.scrollHeight;
      };
      renderLogs();
      filterSelect.addEventListener("change", renderLogs);
      copyBtn.addEventListener("click", () => {
        const text = this.logs.map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`).join("\n");
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = originalText, 2e3);
      });
      closeBtn.addEventListener("click", () => {
        overlay.remove();
      });
    }
    escapeHtml(unsafe) {
      return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
  };
  __publicField(_LogManager, "instance");
  var LogManager = _LogManager;
  var LogManager_default = LogManager.getInstance();

  // src/android/preload.ts
  PlatformManager.setPlatform(new CapacitorPlatform());
  LogManager_default.hookConsole();
  NodeJS.addListener("log", (data) => {
    LogManager_default.addLog("INFO", `[Server] ${data.args.join(" ")}`);
    console.log("[Server]", ...data.args);
  });
  NodeJS.addListener("error", (data) => {
    LogManager_default.addLog("ERROR", `[Server Error] ${data.args.join(" ")}`);
    console.error("[Server Error]", ...data.args);
    Helpers_default.showAlert("error", "Server Error", data.args.join(" "), ["OK"]);
  });
  window.addEventListener("load", async () => {
    if (!PlatformManager.current) PlatformManager.setPlatform(new CapacitorPlatform());
    await PlatformManager.current.init();
    const style = document.createElement("style");
    style.textContent = `
        [title="Fullscreen"],
        [title="Exit Fullscreen"],
        button[aria-label="Fullscreen"],
        .fullscreen-toggle {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    window.stremioEnhanced = {
      applyTheme: async (theme) => {
        await applyUserTheme();
      }
    };
    initializeUserSettings();
    await applyUserTheme();
    await loadEnabledPlugins();
    window.addEventListener("hashchange", async () => {
      await checkSettings();
    });
  });
  async function checkSettings() {
    if (!location.href.includes("#/settings")) return;
    if (document.querySelector(`a[href="#settings-enhanced"]`)) return;
    ModManager_default.addApplyThemeFunction();
    const themesPath = Properties_default.themesPath;
    const pluginsPath = Properties_default.pluginsPath;
    let allThemes = [];
    let allPlugins = [];
    try {
      allThemes = await PlatformManager.current.readdir(themesPath);
      allPlugins = await PlatformManager.current.readdir(pluginsPath);
    } catch (e) {
      logger_browser_default.error("Failed to read themes/plugins directories: " + e);
    }
    const themesList = allThemes.filter((fileName) => fileName.endsWith(FILE_EXTENSIONS.THEME));
    const pluginsList = allPlugins.filter((fileName) => fileName.endsWith(FILE_EXTENSIONS.PLUGIN));
    logger_browser_default.info("Adding 'Enhanced' sections...");
    Settings_default.addSection("enhanced", "Enhanced");
    Settings_default.addCategory("Themes", "enhanced", getThemeIcon());
    Settings_default.addCategory("Plugins", "enhanced", getPluginIcon());
    Settings_default.addCategory("About", "enhanced", getAboutIcon());
    Settings_default.addButton("Open Themes Folder", "openthemesfolderBtn", SELECTORS.THEMES_CATEGORY);
    Settings_default.addButton("Open Plugins Folder", "openpluginsfolderBtn", SELECTORS.PLUGINS_CATEGORY);
    writeAbout();
    setupBrowseModsButton();
    Helpers_default.waitForElm(SELECTORS.THEMES_CATEGORY).then(async () => {
      const isCurrentThemeDefault = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) === "Default";
      const defaultThemeContainer = document.createElement("div");
      defaultThemeContainer.innerHTML = getDefaultThemeTemplate(isCurrentThemeDefault);
      document.querySelector(SELECTORS.THEMES_CATEGORY)?.appendChild(defaultThemeContainer);
      for (const theme of themesList) {
        try {
          const themePath = (0, import_path2.join)(themesPath, theme);
          const content = await PlatformManager.current.readFile(themePath);
          const metaData = ExtractMetaData_default.extractMetadataFromText(content);
          if (metaData) {
            if (metaData.name.toLowerCase() !== "default") {
              Settings_default.addItem("theme", theme, {
                name: metaData.name,
                description: metaData.description,
                author: metaData.author,
                version: metaData.version,
                updateUrl: metaData.updateUrl,
                source: metaData.source
              });
            }
          }
        } catch (e) {
          logger_browser_default.error(`Failed to load theme metadata for ${theme}: ${e}`);
        }
      }
    }).catch((err) => logger_browser_default.error("Failed to setup themes: " + err));
    for (const plugin of pluginsList) {
      try {
        const pluginPath = (0, import_path2.join)(pluginsPath, plugin);
        const content = await PlatformManager.current.readFile(pluginPath);
        const metaData = ExtractMetaData_default.extractMetadataFromText(content);
        if (metaData) {
          Settings_default.addItem("plugin", plugin, {
            name: metaData.name,
            description: metaData.description,
            author: metaData.author,
            version: metaData.version,
            updateUrl: metaData.updateUrl,
            source: metaData.source
          });
        }
      } catch (e) {
        logger_browser_default.error(`Failed to load plugin metadata for ${plugin}: ${e}`);
      }
    }
    ModManager_default.togglePluginListener();
    ModManager_default.scrollListener();
  }
  function initializeUserSettings() {
    const defaults = {
      [STORAGE_KEYS.ENABLED_PLUGINS]: "[]",
      [STORAGE_KEYS.CHECK_UPDATES_ON_STARTUP]: "false",
      [STORAGE_KEYS.DISCORD_RPC]: "false"
    };
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, defaultValue);
      }
    }
  }
  async function applyUserTheme() {
    const currentTheme = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME);
    if (!currentTheme || currentTheme === "Default") {
      localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
      return;
    }
    const themePath = (0, import_path2.join)(Properties_default.themesPath, currentTheme);
    try {
      if (!await PlatformManager.current.exists(themePath)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, "Default");
        return;
      }
      document.getElementById("activeTheme")?.remove();
      const content = await PlatformManager.current.readFile(themePath);
      const styleElement = document.createElement("style");
      styleElement.setAttribute("id", "activeTheme");
      styleElement.textContent = content;
      document.head.appendChild(styleElement);
    } catch (e) {
      logger_browser_default.error("Failed to apply theme: " + e);
    }
  }
  async function loadEnabledPlugins() {
    const pluginsPath = Properties_default.pluginsPath;
    try {
      if (!await PlatformManager.current.exists(pluginsPath)) return;
      const allPlugins = await PlatformManager.current.readdir(pluginsPath);
      const pluginsToLoad = allPlugins.filter((fileName) => fileName.endsWith(FILE_EXTENSIONS.PLUGIN));
      const enabledPlugins = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ENABLED_PLUGINS) || "[]"
      );
      for (const plugin of pluginsToLoad) {
        if (enabledPlugins.includes(plugin)) {
          await ModManager_default.loadPlugin(plugin);
        }
      }
    } catch (e) {
      logger_browser_default.error("Failed to load plugins: " + e);
    }
  }
  async function browseMods() {
    const settingsContent = document.querySelector(SELECTORS.SETTINGS_CONTENT);
    if (!settingsContent) return;
    settingsContent.innerHTML = getModsTabTemplate();
    const mods = await ModManager_default.fetchMods();
    const modsList = document.getElementById("mods-list");
    if (!modsList) return;
    for (const plugin of mods.plugins) {
      const installed = await ModManager_default.isPluginInstalled(Helpers_default.getFileNameFromUrl(plugin.download));
      modsList.innerHTML += getModItemTemplate(plugin, "Plugin", installed);
    }
    for (const theme of mods.themes) {
      const installed = await ModManager_default.isThemeInstalled(Helpers_default.getFileNameFromUrl(theme.download));
      modsList.innerHTML += getModItemTemplate(theme, "Theme", installed);
    }
    const actionBtns = document.querySelectorAll(".modActionBtn");
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const link = btn.getAttribute("data-link");
        const type = btn.getAttribute("data-type")?.toLowerCase();
        if (!link || !type) return;
        if (btn.getAttribute("title") === "Install") {
          ModManager_default.downloadMod(link, type);
          btn.classList.remove(CLASSES.INSTALL_BUTTON);
          btn.classList.add(CLASSES.UNINSTALL_BUTTON);
          btn.setAttribute("title", "Uninstall");
          if (btn.childNodes[1]) {
            btn.childNodes[1].textContent = "Uninstall";
          }
        } else {
          ModManager_default.removeMod(Helpers_default.getFileNameFromUrl(link), type);
          btn.classList.remove(CLASSES.UNINSTALL_BUTTON);
          btn.classList.add(CLASSES.INSTALL_BUTTON);
          btn.setAttribute("title", "Install");
          if (btn.childNodes[1]) {
            btn.childNodes[1].textContent = "Install";
          }
        }
      });
    });
    setupSearchBar();
    const horizontalNavs = document.querySelectorAll(SELECTORS.HORIZONTAL_NAV);
    const horizontalNav = horizontalNavs[1];
    if (horizontalNav) {
      horizontalNav.innerHTML = getBackButton();
      document.getElementById("back-btn")?.addEventListener("click", () => {
        location.hash = "#/";
        setTimeout(() => {
          location.hash = "#/settings";
        }, 0);
      });
    }
  }
  function setupSearchBar() {
    const searchInput = document.querySelector(SELECTORS.SEARCH_INPUT);
    const addonsContainer = document.querySelector(SELECTORS.ADDONS_LIST_CONTAINER);
    if (!searchInput || !addonsContainer) return;
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.trim().toLowerCase();
      const modItems = addonsContainer.querySelectorAll(SELECTORS.ADDON_CONTAINER);
      modItems.forEach((item) => {
        const name = item.querySelector(SELECTORS.NAME_CONTAINER)?.textContent?.toLowerCase() || "";
        const description = item.querySelector(SELECTORS.DESCRIPTION_ITEM)?.textContent?.toLowerCase() || "";
        const type = item.querySelector(SELECTORS.TYPES_CONTAINER)?.textContent?.toLowerCase() || "";
        const match = name.includes(filter) || description.includes(filter) || type.includes(filter);
        item.style.display = match ? "" : "none";
      });
    });
  }
  function setupBrowseModsButton() {
    Helpers_default.waitForElm("#browsePluginsThemesBtn").then(() => {
      const btn = document.getElementById("browsePluginsThemesBtn");
      btn?.addEventListener("click", browseMods);
    }).catch(() => {
    });
  }
  function writeAbout() {
    Helpers_default.waitForElm(SELECTORS.ABOUT_CATEGORY).then(async () => {
      const aboutCategory = document.querySelector(SELECTORS.ABOUT_CATEGORY);
      if (aboutCategory) {
        aboutCategory.innerHTML += getAboutCategoryTemplate(
          "Android-v1.0.0",
          false,
          false,
          false
        );
        Settings_default.addButton("Open Logs", "openLogsBtn", SELECTORS.ABOUT_CATEGORY);
        Helpers_default.waitForElm("#openLogsBtn").then(() => {
          document.getElementById("openLogsBtn")?.addEventListener("click", () => {
            LogManager_default.showLogs();
          });
        });
      }
    }).catch((err) => logger_browser_default.error("Failed to write about section: " + err));
  }
  function getAboutIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <g><path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" style="fill:currentcolor"></path></g></svg>`;
  }
  function getThemeIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <g><path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z" style="fill: currentcolor;"></path></g></svg>`;
  }
  function getPluginIcon() {
    return `<svg icon="addons-outline" class="icon" viewBox="0 0 512 512" style="fill: currentcolor;">
        <path d="M413.7 246.1H386c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-77.2a38.94 38.94 0 0 0-11.4-27.5 38.94 38.94 0 0 0-27.5-11.4h-77.2c-0.53-0.01-1.03-0.23-1.4-0.6-0.37-0.37-0.59-0.87-0.6-1.4v-27.7c0-27.1-21.5-49.9-48.6-50.3-6.57-0.1-13.09 1.09-19.2 3.5a49.616 49.616 0 0 0-16.4 10.7 49.823 49.823 0 0 0-11 16.2 48.894 48.894 0 0 0-3.9 19.2v28.5c-0.01 0.53-0.23 1.03-0.6 1.4-0.37 0.37-0.87 0.59-1.4 0.6h-77.2c-10.5 0-20.57 4.17-28 11.6a39.594 39.594 0 0 0-11.6 28v70.4c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h26.9c29.4 0 53.7 25.5 54.1 54.8 0.4 29.9-23.5 57.2-53.3 57.2H50c-0.53 0.01-1.03 0.23-1.4 0.6-0.37 0.37-0.59 0.87-0.6 1.4v70.4c0 10.5 4.17 20.57 11.6 28s17.5 11.6 28 11.6h70.4c0.53-0.01 1.03-0.23 1.4-0.6 0.37-0.37 0.59-0.87 0.6-1.4V441.2c0-30.3 24.8-56.4 55-57.1 30.1-0.7 57 20.3 57 50.3v27.7c0.01 0.53 0.23 1.03 0.6 1.4 0.37 0.37 0.87 0.59 1.4 0.6h71.1a38.94 38.94 0 0 0 27.5-11.4 38.958 38.958 0 0 0 11.4-27.5v-78c0.01-0.53 0.23-1.03 0.6-1.4 0.37-0.37 0.87-0.59 1.4-0.6h28.5c27.6 0 49.5-22.7 49.5-50.4s-23.2-48.7-50.3-48.7Z" style="stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32;fill: currentColor;"></path></svg>`;
  }
})();
/*! Bundled license information:

@capacitor/core/dist/index.js:
  (*! Capacitor: https://capacitorjs.com/ - MIT License *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvY29yZS9idWlsZC91dGlsLmpzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2FwYWNpdG9yL2NvcmUvYnVpbGQvcnVudGltZS5qcyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9jb3JlL2J1aWxkL2dsb2JhbC5qcyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9jb3JlL2J1aWxkL3dlYi1wbHVnaW4uanMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvY29yZS9idWlsZC9jb3JlLXBsdWdpbnMuanMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvZmlsZXN5c3RlbS9zcmMvZGVmaW5pdGlvbnMudHMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvZmlsZXN5c3RlbS9zcmMvd2ViLnRzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2FwYWNpdG9yL2Jyb3dzZXIvc3JjL3dlYi50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jYXBhY2l0b3Itbm9kZWpzL3NyYy93ZWIudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL3BsYXRmb3JtL1BsYXRmb3JtTWFuYWdlci50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9maWxlc3lzdGVtL3NyYy9pbmRleC50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9zeW5hcHNlL2Rpc3Qvc3luYXBzZS5tanMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvYnJvd3Nlci9zcmMvaW5kZXgudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL3BsYXRmb3JtL0NhcGFjaXRvclBsYXRmb3JtLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9IZWxwZXJzLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9sb2dnZXIuYnJvd3Nlci50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3RhbnRzL2luZGV4LnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZHMtdGFiL21vZHMtdGFiLmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvbW9kcy1pdGVtL21vZHMtaXRlbS5odG1sIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2Fib3V0LWNhdGVnb3J5L2Fib3V0LWNhdGVnb3J5Lmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvZGVmYXVsdC10aGVtZS9kZWZhdWx0LXRoZW1lLmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvYmFjay1idG4vYmFjay1idG4uaHRtbCIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy90aXRsZS1iYXIvdGl0bGUtYmFyLmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL3RlbXBsYXRlQ2FjaGUuYnJvd3Nlci50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy90b2FzdC90b2FzdC50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9wbHVnaW4taXRlbS9wbHVnaW5JdGVtLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3RoZW1lLWl0ZW0vdGhlbWVJdGVtLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2VuaGFuY2VkLW5hdi9lbmhhbmNlZE5hdi50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29yZS9Qcm9wZXJ0aWVzLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcGx5LXRoZW1lL2FwcGx5VGhlbWUuYnJvd3Nlci50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29yZS9Nb2RNYW5hZ2VyLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9pbnRlcmZhY2VzL01ldGFEYXRhLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9FeHRyYWN0TWV0YURhdGEudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvcmUvU2V0dGluZ3MudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvbW9kcy10YWIvbW9kc1RhYi50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9tb2RzLWl0ZW0vbW9kc0l0ZW0udHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvYWJvdXQtY2F0ZWdvcnkvYWJvdXRDYXRlZ29yeS50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9kZWZhdWx0LXRoZW1lL2RlZmF1bHRUaGVtZS50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9iYWNrLWJ0bi9iYWNrQnRuLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9hbmRyb2lkL3ByZWxvYWQudHMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhcGFjaXRvci1ub2RlanMvc3JjL05vZGVKUy50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY2FwYWNpdG9yLW5vZGVqcy9zcmMvaW1wbGVtZW50YXRpb24udHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvcmUvTG9nTWFuYWdlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IHZhciBFeGNlcHRpb25Db2RlO1xuKGZ1bmN0aW9uIChFeGNlcHRpb25Db2RlKSB7XG4gICAgLyoqXG4gICAgICogQVBJIGlzIG5vdCBpbXBsZW1lbnRlZC5cbiAgICAgKlxuICAgICAqIFRoaXMgdXN1YWxseSBtZWFucyB0aGUgQVBJIGNhbid0IGJlIHVzZWQgYmVjYXVzZSBpdCBpcyBub3QgaW1wbGVtZW50ZWQgZm9yXG4gICAgICogdGhlIGN1cnJlbnQgcGxhdGZvcm0uXG4gICAgICovXG4gICAgRXhjZXB0aW9uQ29kZVtcIlVuaW1wbGVtZW50ZWRcIl0gPSBcIlVOSU1QTEVNRU5URURcIjtcbiAgICAvKipcbiAgICAgKiBBUEkgaXMgbm90IGF2YWlsYWJsZS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWVhbnMgdGhlIEFQSSBjYW4ndCBiZSB1c2VkIHJpZ2h0IG5vdyBiZWNhdXNlOlxuICAgICAqICAgLSBpdCBpcyBjdXJyZW50bHkgbWlzc2luZyBhIHByZXJlcXVpc2l0ZSwgc3VjaCBhcyBuZXR3b3JrIGNvbm5lY3Rpdml0eVxuICAgICAqICAgLSBpdCByZXF1aXJlcyBhIHBhcnRpY3VsYXIgcGxhdGZvcm0gb3IgYnJvd3NlciB2ZXJzaW9uXG4gICAgICovXG4gICAgRXhjZXB0aW9uQ29kZVtcIlVuYXZhaWxhYmxlXCJdID0gXCJVTkFWQUlMQUJMRVwiO1xufSkoRXhjZXB0aW9uQ29kZSB8fCAoRXhjZXB0aW9uQ29kZSA9IHt9KSk7XG5leHBvcnQgY2xhc3MgQ2FwYWNpdG9yRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGNvZGUsIGRhdGEpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IGdldFBsYXRmb3JtSWQgPSAod2luKSA9PiB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBpZiAod2luID09PSBudWxsIHx8IHdpbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogd2luLmFuZHJvaWRCcmlkZ2UpIHtcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICB9XG4gICAgZWxzZSBpZiAoKF9iID0gKF9hID0gd2luID09PSBudWxsIHx8IHdpbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogd2luLndlYmtpdCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2VIYW5kbGVycykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmJyaWRnZSkge1xuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gJ3dlYic7XG4gICAgfVxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwuanMubWFwIiwgImltcG9ydCB7IENhcGFjaXRvckV4Y2VwdGlvbiwgZ2V0UGxhdGZvcm1JZCwgRXhjZXB0aW9uQ29kZSB9IGZyb20gJy4vdXRpbCc7XG5leHBvcnQgY29uc3QgY3JlYXRlQ2FwYWNpdG9yID0gKHdpbikgPT4ge1xuICAgIGNvbnN0IGNhcEN1c3RvbVBsYXRmb3JtID0gd2luLkNhcGFjaXRvckN1c3RvbVBsYXRmb3JtIHx8IG51bGw7XG4gICAgY29uc3QgY2FwID0gd2luLkNhcGFjaXRvciB8fCB7fTtcbiAgICBjb25zdCBQbHVnaW5zID0gKGNhcC5QbHVnaW5zID0gY2FwLlBsdWdpbnMgfHwge30pO1xuICAgIGNvbnN0IGdldFBsYXRmb3JtID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gY2FwQ3VzdG9tUGxhdGZvcm0gIT09IG51bGwgPyBjYXBDdXN0b21QbGF0Zm9ybS5uYW1lIDogZ2V0UGxhdGZvcm1JZCh3aW4pO1xuICAgIH07XG4gICAgY29uc3QgaXNOYXRpdmVQbGF0Zm9ybSA9ICgpID0+IGdldFBsYXRmb3JtKCkgIT09ICd3ZWInO1xuICAgIGNvbnN0IGlzUGx1Z2luQXZhaWxhYmxlID0gKHBsdWdpbk5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgcGx1Z2luID0gcmVnaXN0ZXJlZFBsdWdpbnMuZ2V0KHBsdWdpbk5hbWUpO1xuICAgICAgICBpZiAocGx1Z2luID09PSBudWxsIHx8IHBsdWdpbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGx1Z2luLnBsYXRmb3Jtcy5oYXMoZ2V0UGxhdGZvcm0oKSkpIHtcbiAgICAgICAgICAgIC8vIEpTIGltcGxlbWVudGF0aW9uIGF2YWlsYWJsZSBmb3IgdGhlIGN1cnJlbnQgcGxhdGZvcm0uXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2V0UGx1Z2luSGVhZGVyKHBsdWdpbk5hbWUpKSB7XG4gICAgICAgICAgICAvLyBOYXRpdmUgaW1wbGVtZW50YXRpb24gYXZhaWxhYmxlLlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgY29uc3QgZ2V0UGx1Z2luSGVhZGVyID0gKHBsdWdpbk5hbWUpID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gY2FwLlBsdWdpbkhlYWRlcnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5maW5kKChoKSA9PiBoLm5hbWUgPT09IHBsdWdpbk5hbWUpOyB9O1xuICAgIGNvbnN0IGhhbmRsZUVycm9yID0gKGVycikgPT4gd2luLmNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBjb25zdCByZWdpc3RlcmVkUGx1Z2lucyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCByZWdpc3RlclBsdWdpbiA9IChwbHVnaW5OYW1lLCBqc0ltcGxlbWVudGF0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdGVyZWRQbHVnaW4gPSByZWdpc3RlcmVkUGx1Z2lucy5nZXQocGx1Z2luTmFtZSk7XG4gICAgICAgIGlmIChyZWdpc3RlcmVkUGx1Z2luKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYENhcGFjaXRvciBwbHVnaW4gXCIke3BsdWdpbk5hbWV9XCIgYWxyZWFkeSByZWdpc3RlcmVkLiBDYW5ub3QgcmVnaXN0ZXIgcGx1Z2lucyB0d2ljZS5gKTtcbiAgICAgICAgICAgIHJldHVybiByZWdpc3RlcmVkUGx1Z2luLnByb3h5O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBsYXRmb3JtID0gZ2V0UGxhdGZvcm0oKTtcbiAgICAgICAgY29uc3QgcGx1Z2luSGVhZGVyID0gZ2V0UGx1Z2luSGVhZGVyKHBsdWdpbk5hbWUpO1xuICAgICAgICBsZXQganNJbXBsZW1lbnRhdGlvbjtcbiAgICAgICAgY29uc3QgbG9hZFBsdWdpbkltcGxlbWVudGF0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFqc0ltcGxlbWVudGF0aW9uICYmIHBsYXRmb3JtIGluIGpzSW1wbGVtZW50YXRpb25zKSB7XG4gICAgICAgICAgICAgICAganNJbXBsZW1lbnRhdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBqc0ltcGxlbWVudGF0aW9uc1twbGF0Zm9ybV0gPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKGpzSW1wbGVtZW50YXRpb24gPSBhd2FpdCBqc0ltcGxlbWVudGF0aW9uc1twbGF0Zm9ybV0oKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKGpzSW1wbGVtZW50YXRpb24gPSBqc0ltcGxlbWVudGF0aW9uc1twbGF0Zm9ybV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2FwQ3VzdG9tUGxhdGZvcm0gIT09IG51bGwgJiYgIWpzSW1wbGVtZW50YXRpb24gJiYgJ3dlYicgaW4ganNJbXBsZW1lbnRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBqc0ltcGxlbWVudGF0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGpzSW1wbGVtZW50YXRpb25zWyd3ZWInXSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyAoanNJbXBsZW1lbnRhdGlvbiA9IGF3YWl0IGpzSW1wbGVtZW50YXRpb25zWyd3ZWInXSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiAoanNJbXBsZW1lbnRhdGlvbiA9IGpzSW1wbGVtZW50YXRpb25zWyd3ZWInXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ganNJbXBsZW1lbnRhdGlvbjtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY3JlYXRlUGx1Z2luTWV0aG9kID0gKGltcGwsIHByb3ApID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICBpZiAocGx1Z2luSGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kSGVhZGVyID0gcGx1Z2luSGVhZGVyID09PSBudWxsIHx8IHBsdWdpbkhlYWRlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGx1Z2luSGVhZGVyLm1ldGhvZHMuZmluZCgobSkgPT4gcHJvcCA9PT0gbS5uYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kSGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRob2RIZWFkZXIucnR5cGUgPT09ICdwcm9taXNlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChvcHRpb25zKSA9PiBjYXAubmF0aXZlUHJvbWlzZShwbHVnaW5OYW1lLCBwcm9wLnRvU3RyaW5nKCksIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChvcHRpb25zLCBjYWxsYmFjaykgPT4gY2FwLm5hdGl2ZUNhbGxiYWNrKHBsdWdpbk5hbWUsIHByb3AudG9TdHJpbmcoKSwgb3B0aW9ucywgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGltcGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9IGltcGxbcHJvcF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5iaW5kKGltcGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGltcGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKF9iID0gaW1wbFtwcm9wXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmJpbmQoaW1wbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ2FwYWNpdG9yRXhjZXB0aW9uKGBcIiR7cGx1Z2luTmFtZX1cIiBwbHVnaW4gaXMgbm90IGltcGxlbWVudGVkIG9uICR7cGxhdGZvcm19YCwgRXhjZXB0aW9uQ29kZS5VbmltcGxlbWVudGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY3JlYXRlUGx1Z2luTWV0aG9kV3JhcHBlciA9IChwcm9wKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVtb3ZlO1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IGxvYWRQbHVnaW5JbXBsZW1lbnRhdGlvbigpLnRoZW4oKGltcGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm4gPSBjcmVhdGVQbHVnaW5NZXRob2QoaW1wbCwgcHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IGZuKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlID0gcCA9PT0gbnVsbCB8fCBwID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwLnJlbW92ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IENhcGFjaXRvckV4Y2VwdGlvbihgXCIke3BsdWdpbk5hbWV9LiR7cHJvcH0oKVwiIGlzIG5vdCBpbXBsZW1lbnRlZCBvbiAke3BsYXRmb3JtfWAsIEV4Y2VwdGlvbkNvZGUuVW5pbXBsZW1lbnRlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gJ2FkZExpc3RlbmVyJykge1xuICAgICAgICAgICAgICAgICAgICBwLnJlbW92ZSA9IGFzeW5jICgpID0+IHJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBTb21lIGZsYWlyIOKcqFxuICAgICAgICAgICAgd3JhcHBlci50b1N0cmluZyA9ICgpID0+IGAke3Byb3AudG9TdHJpbmcoKX0oKSB7IFtjYXBhY2l0b3IgY29kZV0gfWA7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod3JhcHBlciwgJ25hbWUnLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHByb3AsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBhZGRMaXN0ZW5lciA9IGNyZWF0ZVBsdWdpbk1ldGhvZFdyYXBwZXIoJ2FkZExpc3RlbmVyJyk7XG4gICAgICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVyID0gY3JlYXRlUGx1Z2luTWV0aG9kV3JhcHBlcigncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgY29uc3QgYWRkTGlzdGVuZXJOYXRpdmUgPSAoZXZlbnROYW1lLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FsbCA9IGFkZExpc3RlbmVyKHsgZXZlbnROYW1lIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFja0lkID0gYXdhaXQgY2FsbDtcbiAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcih7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tJZCxcbiAgICAgICAgICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBjYWxsLnRoZW4oKCkgPT4gcmVzb2x2ZSh7IHJlbW92ZSB9KSkpO1xuICAgICAgICAgICAgcC5yZW1vdmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVc2luZyBhZGRMaXN0ZW5lcigpIHdpdGhvdXQgJ2F3YWl0JyBpcyBkZXByZWNhdGVkLmApO1xuICAgICAgICAgICAgICAgIGF3YWl0IHJlbW92ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBwcm94eSA9IG5ldyBQcm94eSh7fSwge1xuICAgICAgICAgICAgZ2V0KF8sIHByb3ApIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8yMDAzMFxuICAgICAgICAgICAgICAgICAgICBjYXNlICckJHR5cGVvZic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0b0pTT04nOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+ICh7fSk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FkZExpc3RlbmVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwbHVnaW5IZWFkZXIgPyBhZGRMaXN0ZW5lck5hdGl2ZSA6IGFkZExpc3RlbmVyO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdyZW1vdmVMaXN0ZW5lcic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlTGlzdGVuZXI7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlUGx1Z2luTWV0aG9kV3JhcHBlcihwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgUGx1Z2luc1twbHVnaW5OYW1lXSA9IHByb3h5O1xuICAgICAgICByZWdpc3RlcmVkUGx1Z2lucy5zZXQocGx1Z2luTmFtZSwge1xuICAgICAgICAgICAgbmFtZTogcGx1Z2luTmFtZSxcbiAgICAgICAgICAgIHByb3h5LFxuICAgICAgICAgICAgcGxhdGZvcm1zOiBuZXcgU2V0KFsuLi5PYmplY3Qua2V5cyhqc0ltcGxlbWVudGF0aW9ucyksIC4uLihwbHVnaW5IZWFkZXIgPyBbcGxhdGZvcm1dIDogW10pXSksXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfTtcbiAgICAvLyBBZGQgaW4gY29udmVydEZpbGVTcmMgZm9yIHdlYiwgaXQgd2lsbCBhbHJlYWR5IGJlIGF2YWlsYWJsZSBpbiBuYXRpdmUgY29udGV4dFxuICAgIGlmICghY2FwLmNvbnZlcnRGaWxlU3JjKSB7XG4gICAgICAgIGNhcC5jb252ZXJ0RmlsZVNyYyA9IChmaWxlUGF0aCkgPT4gZmlsZVBhdGg7XG4gICAgfVxuICAgIGNhcC5nZXRQbGF0Zm9ybSA9IGdldFBsYXRmb3JtO1xuICAgIGNhcC5oYW5kbGVFcnJvciA9IGhhbmRsZUVycm9yO1xuICAgIGNhcC5pc05hdGl2ZVBsYXRmb3JtID0gaXNOYXRpdmVQbGF0Zm9ybTtcbiAgICBjYXAuaXNQbHVnaW5BdmFpbGFibGUgPSBpc1BsdWdpbkF2YWlsYWJsZTtcbiAgICBjYXAucmVnaXN0ZXJQbHVnaW4gPSByZWdpc3RlclBsdWdpbjtcbiAgICBjYXAuRXhjZXB0aW9uID0gQ2FwYWNpdG9yRXhjZXB0aW9uO1xuICAgIGNhcC5ERUJVRyA9ICEhY2FwLkRFQlVHO1xuICAgIGNhcC5pc0xvZ2dpbmdFbmFibGVkID0gISFjYXAuaXNMb2dnaW5nRW5hYmxlZDtcbiAgICByZXR1cm4gY2FwO1xufTtcbmV4cG9ydCBjb25zdCBpbml0Q2FwYWNpdG9yR2xvYmFsID0gKHdpbikgPT4gKHdpbi5DYXBhY2l0b3IgPSBjcmVhdGVDYXBhY2l0b3Iod2luKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ydW50aW1lLmpzLm1hcCIsICJpbXBvcnQgeyBpbml0Q2FwYWNpdG9yR2xvYmFsIH0gZnJvbSAnLi9ydW50aW1lJztcbmV4cG9ydCBjb25zdCBDYXBhY2l0b3IgPSAvKiNfX1BVUkVfXyovIGluaXRDYXBhY2l0b3JHbG9iYWwodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnXG4gICAgPyBnbG9iYWxUaGlzXG4gICAgOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBzZWxmXG4gICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgID8gd2luZG93XG4gICAgICAgICAgICA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgPyBnbG9iYWxcbiAgICAgICAgICAgICAgICA6IHt9KTtcbmV4cG9ydCBjb25zdCByZWdpc3RlclBsdWdpbiA9IENhcGFjaXRvci5yZWdpc3RlclBsdWdpbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdsb2JhbC5qcy5tYXAiLCAiaW1wb3J0IHsgQ2FwYWNpdG9yIH0gZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgRXhjZXB0aW9uQ29kZSB9IGZyb20gJy4vdXRpbCc7XG4vKipcbiAqIEJhc2UgY2xhc3Mgd2ViIHBsdWdpbnMgc2hvdWxkIGV4dGVuZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFdlYlBsdWdpbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgICAgIHRoaXMucmV0YWluZWRFdmVudEFyZ3VtZW50cyA9IHt9O1xuICAgICAgICB0aGlzLndpbmRvd0xpc3RlbmVycyA9IHt9O1xuICAgIH1cbiAgICBhZGRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyRnVuYykge1xuICAgICAgICBsZXQgZmlyc3RMaXN0ZW5lciA9IGZhbHNlO1xuICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXSA9IFtdO1xuICAgICAgICAgICAgZmlyc3RMaXN0ZW5lciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKGxpc3RlbmVyRnVuYyk7XG4gICAgICAgIC8vIElmIHdlIGhhdmVuJ3QgYWRkZWQgYSB3aW5kb3cgbGlzdGVuZXIgZm9yIHRoaXMgZXZlbnQgYW5kIGl0IHJlcXVpcmVzIG9uZSxcbiAgICAgICAgLy8gZ28gYWhlYWQgYW5kIGFkZCBpdFxuICAgICAgICBjb25zdCB3aW5kb3dMaXN0ZW5lciA9IHRoaXMud2luZG93TGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgICAgIGlmICh3aW5kb3dMaXN0ZW5lciAmJiAhd2luZG93TGlzdGVuZXIucmVnaXN0ZXJlZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRXaW5kb3dMaXN0ZW5lcih3aW5kb3dMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpcnN0TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2VuZFJldGFpbmVkQXJndW1lbnRzRm9yRXZlbnQoZXZlbnROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZW1vdmUgPSBhc3luYyAoKSA9PiB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXJGdW5jKTtcbiAgICAgICAgY29uc3QgcCA9IFByb21pc2UucmVzb2x2ZSh7IHJlbW92ZSB9KTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGFzeW5jIHJlbW92ZUFsbExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBsaXN0ZW5lciBpbiB0aGlzLndpbmRvd0xpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVXaW5kb3dMaXN0ZW5lcih0aGlzLndpbmRvd0xpc3RlbmVyc1tsaXN0ZW5lcl0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud2luZG93TGlzdGVuZXJzID0ge307XG4gICAgfVxuICAgIG5vdGlmeUxpc3RlbmVycyhldmVudE5hbWUsIGRhdGEsIHJldGFpblVudGlsQ29uc3VtZWQpIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChyZXRhaW5VbnRpbENvbnN1bWVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFyZ3MgPSB0aGlzLnJldGFpbmVkRXZlbnRBcmd1bWVudHNbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoIWFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXRhaW5lZEV2ZW50QXJndW1lbnRzW2V2ZW50TmFtZV0gPSBhcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIoZGF0YSkpO1xuICAgIH1cbiAgICBoYXNMaXN0ZW5lcnMoZXZlbnROYW1lKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuICEhKChfYSA9IHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpO1xuICAgIH1cbiAgICByZWdpc3RlcldpbmRvd0xpc3RlbmVyKHdpbmRvd0V2ZW50TmFtZSwgcGx1Z2luRXZlbnROYW1lKSB7XG4gICAgICAgIHRoaXMud2luZG93TGlzdGVuZXJzW3BsdWdpbkV2ZW50TmFtZV0gPSB7XG4gICAgICAgICAgICByZWdpc3RlcmVkOiBmYWxzZSxcbiAgICAgICAgICAgIHdpbmRvd0V2ZW50TmFtZSxcbiAgICAgICAgICAgIHBsdWdpbkV2ZW50TmFtZSxcbiAgICAgICAgICAgIGhhbmRsZXI6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5TGlzdGVuZXJzKHBsdWdpbkV2ZW50TmFtZSwgZXZlbnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdW5pbXBsZW1lbnRlZChtc2cgPSAnbm90IGltcGxlbWVudGVkJykge1xuICAgICAgICByZXR1cm4gbmV3IENhcGFjaXRvci5FeGNlcHRpb24obXNnLCBFeGNlcHRpb25Db2RlLlVuaW1wbGVtZW50ZWQpO1xuICAgIH1cbiAgICB1bmF2YWlsYWJsZShtc2cgPSAnbm90IGF2YWlsYWJsZScpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDYXBhY2l0b3IuRXhjZXB0aW9uKG1zZywgRXhjZXB0aW9uQ29kZS5VbmF2YWlsYWJsZSk7XG4gICAgfVxuICAgIGFzeW5jIHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXJGdW5jKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lckZ1bmMpO1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBtb3JlIGxpc3RlbmVycyBmb3IgdGhpcyB0eXBlIG9mIGV2ZW50LFxuICAgICAgICAvLyByZW1vdmUgdGhlIHdpbmRvdyBsaXN0ZW5lclxuICAgICAgICBpZiAoIXRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVdpbmRvd0xpc3RlbmVyKHRoaXMud2luZG93TGlzdGVuZXJzW2V2ZW50TmFtZV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZFdpbmRvd0xpc3RlbmVyKGhhbmRsZSkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihoYW5kbGUud2luZG93RXZlbnROYW1lLCBoYW5kbGUuaGFuZGxlcik7XG4gICAgICAgIGhhbmRsZS5yZWdpc3RlcmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmVtb3ZlV2luZG93TGlzdGVuZXIoaGFuZGxlKSB7XG4gICAgICAgIGlmICghaGFuZGxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoaGFuZGxlLndpbmRvd0V2ZW50TmFtZSwgaGFuZGxlLmhhbmRsZXIpO1xuICAgICAgICBoYW5kbGUucmVnaXN0ZXJlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBzZW5kUmV0YWluZWRBcmd1bWVudHNGb3JFdmVudChldmVudE5hbWUpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMucmV0YWluZWRFdmVudEFyZ3VtZW50c1tldmVudE5hbWVdO1xuICAgICAgICBpZiAoIWFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5yZXRhaW5lZEV2ZW50QXJndW1lbnRzW2V2ZW50TmFtZV07XG4gICAgICAgIGFyZ3MuZm9yRWFjaCgoYXJnKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeUxpc3RlbmVycyhldmVudE5hbWUsIGFyZyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdlYi1wbHVnaW4uanMubWFwIiwgImltcG9ydCB7IHJlZ2lzdGVyUGx1Z2luIH0gZnJvbSAnLi9nbG9iYWwnO1xuaW1wb3J0IHsgV2ViUGx1Z2luIH0gZnJvbSAnLi93ZWItcGx1Z2luJztcbmV4cG9ydCBjb25zdCBXZWJWaWV3ID0gLyojX19QVVJFX18qLyByZWdpc3RlclBsdWdpbignV2ViVmlldycpO1xuLyoqKioqKioqIEVORCBXRUIgVklFVyBQTFVHSU4gKioqKioqKiovXG4vKioqKioqKiogQ09PS0lFUyBQTFVHSU4gKioqKioqKiovXG4vKipcbiAqIFNhZmVseSB3ZWIgZW5jb2RlIGEgc3RyaW5nIHZhbHVlIChpbnNwaXJlZCBieSBqcy1jb29raWUpXG4gKiBAcGFyYW0gc3RyIFRoZSBzdHJpbmcgdmFsdWUgdG8gZW5jb2RlXG4gKi9cbmNvbnN0IGVuY29kZSA9IChzdHIpID0+IGVuY29kZVVSSUNvbXBvbmVudChzdHIpXG4gICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgIC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XG4vKipcbiAqIFNhZmVseSB3ZWIgZGVjb2RlIGEgc3RyaW5nIHZhbHVlIChpbnNwaXJlZCBieSBqcy1jb29raWUpXG4gKiBAcGFyYW0gc3RyIFRoZSBzdHJpbmcgdmFsdWUgdG8gZGVjb2RlXG4gKi9cbmNvbnN0IGRlY29kZSA9IChzdHIpID0+IHN0ci5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudCk7XG5leHBvcnQgY2xhc3MgQ2FwYWNpdG9yQ29va2llc1BsdWdpbldlYiBleHRlbmRzIFdlYlBsdWdpbiB7XG4gICAgYXN5bmMgZ2V0Q29va2llcygpIHtcbiAgICAgICAgY29uc3QgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZTtcbiAgICAgICAgY29uc3QgY29va2llTWFwID0ge307XG4gICAgICAgIGNvb2tpZXMuc3BsaXQoJzsnKS5mb3JFYWNoKChjb29raWUpID0+IHtcbiAgICAgICAgICAgIGlmIChjb29raWUubGVuZ3RoIDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLy8gUmVwbGFjZSBmaXJzdCBcIj1cIiB3aXRoIENBUF9DT09LSUUgdG8gcHJldmVudCBzcGxpdHRpbmcgb24gYWRkaXRpb25hbCBcIj1cIlxuICAgICAgICAgICAgbGV0IFtrZXksIHZhbHVlXSA9IGNvb2tpZS5yZXBsYWNlKC89LywgJ0NBUF9DT09LSUUnKS5zcGxpdCgnQ0FQX0NPT0tJRScpO1xuICAgICAgICAgICAga2V5ID0gZGVjb2RlKGtleSkudHJpbSgpO1xuICAgICAgICAgICAgdmFsdWUgPSBkZWNvZGUodmFsdWUpLnRyaW0oKTtcbiAgICAgICAgICAgIGNvb2tpZU1hcFtrZXldID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY29va2llTWFwO1xuICAgIH1cbiAgICBhc3luYyBzZXRDb29raWUob3B0aW9ucykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gU2FmZWx5IEVuY29kZWQgS2V5L1ZhbHVlXG4gICAgICAgICAgICBjb25zdCBlbmNvZGVkS2V5ID0gZW5jb2RlKG9wdGlvbnMua2V5KTtcbiAgICAgICAgICAgIGNvbnN0IGVuY29kZWRWYWx1ZSA9IGVuY29kZShvcHRpb25zLnZhbHVlKTtcbiAgICAgICAgICAgIC8vIENsZWFuICYgc2FuaXRpemUgb3B0aW9uc1xuICAgICAgICAgICAgY29uc3QgZXhwaXJlcyA9IGA7IGV4cGlyZXM9JHsob3B0aW9ucy5leHBpcmVzIHx8ICcnKS5yZXBsYWNlKCdleHBpcmVzPScsICcnKX1gOyAvLyBEZWZhdWx0IGlzIFwiOyBleHBpcmVzPVwiXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gKG9wdGlvbnMucGF0aCB8fCAnLycpLnJlcGxhY2UoJ3BhdGg9JywgJycpOyAvLyBEZWZhdWx0IGlzIFwicGF0aD0vXCJcbiAgICAgICAgICAgIGNvbnN0IGRvbWFpbiA9IG9wdGlvbnMudXJsICE9IG51bGwgJiYgb3B0aW9ucy51cmwubGVuZ3RoID4gMCA/IGBkb21haW49JHtvcHRpb25zLnVybH1gIDogJyc7XG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBgJHtlbmNvZGVkS2V5fT0ke2VuY29kZWRWYWx1ZSB8fCAnJ30ke2V4cGlyZXN9OyBwYXRoPSR7cGF0aH07ICR7ZG9tYWlufTtgO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBkZWxldGVDb29raWUob3B0aW9ucykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7b3B0aW9ucy5rZXl9PTsgTWF4LUFnZT0wYDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgY2xlYXJDb29raWVzKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpIHx8IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBjb29raWUgb2YgY29va2llcykge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5yZXBsYWNlKC9eICsvLCAnJykucmVwbGFjZSgvPS4qLywgYD07ZXhwaXJlcz0ke25ldyBEYXRlKCkudG9VVENTdHJpbmcoKX07cGF0aD0vYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGNsZWFyQWxsQ29va2llcygpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2xlYXJDb29raWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IENhcGFjaXRvckNvb2tpZXMgPSByZWdpc3RlclBsdWdpbignQ2FwYWNpdG9yQ29va2llcycsIHtcbiAgICB3ZWI6ICgpID0+IG5ldyBDYXBhY2l0b3JDb29raWVzUGx1Z2luV2ViKCksXG59KTtcbi8vIFVUSUxJVFkgRlVOQ1RJT05TXG4vKipcbiAqIFJlYWQgaW4gYSBCbG9iIHZhbHVlIGFuZCByZXR1cm4gaXQgYXMgYSBiYXNlNjQgc3RyaW5nXG4gKiBAcGFyYW0gYmxvYiBUaGUgYmxvYiB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgYmFzZTY0IHN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgcmVhZEJsb2JBc0Jhc2U2NCA9IGFzeW5jIChibG9iKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBiYXNlNjRTdHJpbmcgPSByZWFkZXIucmVzdWx0O1xuICAgICAgICAvLyByZW1vdmUgcHJlZml4IFwiZGF0YTphcHBsaWNhdGlvbi9wZGY7YmFzZTY0LFwiXG4gICAgICAgIHJlc29sdmUoYmFzZTY0U3RyaW5nLmluZGV4T2YoJywnKSA+PSAwID8gYmFzZTY0U3RyaW5nLnNwbGl0KCcsJylbMV0gOiBiYXNlNjRTdHJpbmcpO1xuICAgIH07XG4gICAgcmVhZGVyLm9uZXJyb3IgPSAoZXJyb3IpID0+IHJlamVjdChlcnJvcik7XG4gICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoYmxvYik7XG59KTtcbi8qKlxuICogTm9ybWFsaXplIGFuIEh0dHBIZWFkZXJzIG1hcCBieSBsb3dlcmNhc2luZyBhbGwgb2YgdGhlIHZhbHVlc1xuICogQHBhcmFtIGhlYWRlcnMgVGhlIEh0dHBIZWFkZXJzIG9iamVjdCB0byBub3JtYWxpemVcbiAqL1xuY29uc3Qgbm9ybWFsaXplSHR0cEhlYWRlcnMgPSAoaGVhZGVycyA9IHt9KSA9PiB7XG4gICAgY29uc3Qgb3JpZ2luYWxLZXlzID0gT2JqZWN0LmtleXMoaGVhZGVycyk7XG4gICAgY29uc3QgbG93ZXJlZEtleXMgPSBPYmplY3Qua2V5cyhoZWFkZXJzKS5tYXAoKGspID0+IGsudG9Mb2NhbGVMb3dlckNhc2UoKSk7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IGxvd2VyZWRLZXlzLnJlZHVjZSgoYWNjLCBrZXksIGluZGV4KSA9PiB7XG4gICAgICAgIGFjY1trZXldID0gaGVhZGVyc1tvcmlnaW5hbEtleXNbaW5kZXhdXTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG59O1xuLyoqXG4gKiBCdWlsZHMgYSBzdHJpbmcgb2YgdXJsIHBhcmFtZXRlcnMgdGhhdFxuICogQHBhcmFtIHBhcmFtcyBBIG1hcCBvZiB1cmwgcGFyYW1ldGVyc1xuICogQHBhcmFtIHNob3VsZEVuY29kZSB0cnVlIGlmIHlvdSBzaG91bGQgZW5jb2RlVVJJQ29tcG9uZW50KCkgdGhlIHZhbHVlcyAodHJ1ZSBieSBkZWZhdWx0KVxuICovXG5jb25zdCBidWlsZFVybFBhcmFtcyA9IChwYXJhbXMsIHNob3VsZEVuY29kZSA9IHRydWUpID0+IHtcbiAgICBpZiAoIXBhcmFtcylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3Qgb3V0cHV0ID0gT2JqZWN0LmVudHJpZXMocGFyYW1zKS5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBlbnRyeSkgPT4ge1xuICAgICAgICBjb25zdCBba2V5LCB2YWx1ZV0gPSBlbnRyeTtcbiAgICAgICAgbGV0IGVuY29kZWRWYWx1ZTtcbiAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgaXRlbSA9ICcnO1xuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaCgoc3RyKSA9PiB7XG4gICAgICAgICAgICAgICAgZW5jb2RlZFZhbHVlID0gc2hvdWxkRW5jb2RlID8gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikgOiBzdHI7XG4gICAgICAgICAgICAgICAgaXRlbSArPSBgJHtrZXl9PSR7ZW5jb2RlZFZhbHVlfSZgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBsYXN0IGNoYXJhY3RlciB3aWxsIGFsd2F5cyBiZSBcIiZcIiBzbyBzbGljZSBpdCBvZmZcbiAgICAgICAgICAgIGl0ZW0uc2xpY2UoMCwgLTEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZW5jb2RlZFZhbHVlID0gc2hvdWxkRW5jb2RlID8gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICAgICAgaXRlbSA9IGAke2tleX09JHtlbmNvZGVkVmFsdWV9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYCR7YWNjdW11bGF0b3J9JiR7aXRlbX1gO1xuICAgIH0sICcnKTtcbiAgICAvLyBSZW1vdmUgaW5pdGlhbCBcIiZcIiBmcm9tIHRoZSByZWR1Y2VcbiAgICByZXR1cm4gb3V0cHV0LnN1YnN0cigxKTtcbn07XG4vKipcbiAqIEJ1aWxkIHRoZSBSZXF1ZXN0SW5pdCBvYmplY3QgYmFzZWQgb24gdGhlIG9wdGlvbnMgcGFzc2VkIGludG8gdGhlIGluaXRpYWwgcmVxdWVzdFxuICogQHBhcmFtIG9wdGlvbnMgVGhlIEh0dHAgcGx1Z2luIG9wdGlvbnNcbiAqIEBwYXJhbSBleHRyYSBBbnkgZXh0cmEgUmVxdWVzdEluaXQgdmFsdWVzXG4gKi9cbmV4cG9ydCBjb25zdCBidWlsZFJlcXVlc3RJbml0ID0gKG9wdGlvbnMsIGV4dHJhID0ge30pID0+IHtcbiAgICBjb25zdCBvdXRwdXQgPSBPYmplY3QuYXNzaWduKHsgbWV0aG9kOiBvcHRpb25zLm1ldGhvZCB8fCAnR0VUJywgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzIH0sIGV4dHJhKTtcbiAgICAvLyBHZXQgdGhlIGNvbnRlbnQtdHlwZVxuICAgIGNvbnN0IGhlYWRlcnMgPSBub3JtYWxpemVIdHRwSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpO1xuICAgIGNvbnN0IHR5cGUgPSBoZWFkZXJzWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgICAvLyBJZiBib2R5IGlzIGFscmVhZHkgYSBzdHJpbmcsIHRoZW4gcGFzcyBpdCB0aHJvdWdoIGFzLWlzLlxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICBvdXRwdXQuYm9keSA9IG9wdGlvbnMuZGF0YTtcbiAgICB9XG4gICAgLy8gQnVpbGQgcmVxdWVzdCBpbml0aWFsaXplcnMgYmFzZWQgb2ZmIG9mIGNvbnRlbnQtdHlwZVxuICAgIGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob3B0aW9ucy5kYXRhIHx8IHt9KSkge1xuICAgICAgICAgICAgcGFyYW1zLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQuYm9keSA9IHBhcmFtcy50b1N0cmluZygpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlLmluY2x1ZGVzKCdtdWx0aXBhcnQvZm9ybS1kYXRhJykgfHwgb3B0aW9ucy5kYXRhIGluc3RhbmNlb2YgRm9ybURhdGEpIHtcbiAgICAgICAgY29uc3QgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBpZiAob3B0aW9ucy5kYXRhIGluc3RhbmNlb2YgRm9ybURhdGEpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZGF0YS5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9wdGlvbnMuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChrZXksIG9wdGlvbnMuZGF0YVtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQuYm9keSA9IGZvcm07XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhvdXRwdXQuaGVhZGVycyk7XG4gICAgICAgIGhlYWRlcnMuZGVsZXRlKCdjb250ZW50LXR5cGUnKTsgLy8gY29udGVudC10eXBlIHdpbGwgYmUgc2V0IGJ5IGB3aW5kb3cuZmV0Y2hgIHRvIGluY2x1ZHkgYm91bmRhcnlcbiAgICAgICAgb3V0cHV0LmhlYWRlcnMgPSBoZWFkZXJzO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi9qc29uJykgfHwgdHlwZW9mIG9wdGlvbnMuZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgb3V0cHV0LmJvZHkgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcbi8vIFdFQiBJTVBMRU1FTlRBVElPTlxuZXhwb3J0IGNsYXNzIENhcGFjaXRvckh0dHBQbHVnaW5XZWIgZXh0ZW5kcyBXZWJQbHVnaW4ge1xuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gSHR0cCByZXF1ZXN0IGdpdmVuIGEgc2V0IG9mIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIGJ1aWxkIHRoZSBIVFRQIHJlcXVlc3RcbiAgICAgKi9cbiAgICBhc3luYyByZXF1ZXN0KG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVxdWVzdEluaXQgPSBidWlsZFJlcXVlc3RJbml0KG9wdGlvbnMsIG9wdGlvbnMud2ViRmV0Y2hFeHRyYSk7XG4gICAgICAgIGNvbnN0IHVybFBhcmFtcyA9IGJ1aWxkVXJsUGFyYW1zKG9wdGlvbnMucGFyYW1zLCBvcHRpb25zLnNob3VsZEVuY29kZVVybFBhcmFtcyk7XG4gICAgICAgIGNvbnN0IHVybCA9IHVybFBhcmFtcyA/IGAke29wdGlvbnMudXJsfT8ke3VybFBhcmFtc31gIDogb3B0aW9ucy51cmw7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCByZXF1ZXN0SW5pdCk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpIHx8ICcnO1xuICAgICAgICAvLyBEZWZhdWx0IHRvICd0ZXh0JyByZXNwb25zZVR5cGUgc28gbm8gcGFyc2luZyBoYXBwZW5zXG4gICAgICAgIGxldCB7IHJlc3BvbnNlVHlwZSA9ICd0ZXh0JyB9ID0gcmVzcG9uc2Uub2sgPyBvcHRpb25zIDoge307XG4gICAgICAgIC8vIElmIHRoZSByZXNwb25zZSBjb250ZW50LXR5cGUgaXMganNvbiwgZm9yY2UgdGhlIHJlc3BvbnNlIHRvIGJlIGpzb25cbiAgICAgICAgaWYgKGNvbnRlbnRUeXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgbGV0IGJsb2I7XG4gICAgICAgIHN3aXRjaCAocmVzcG9uc2VUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdhcnJheWJ1ZmZlcic6XG4gICAgICAgICAgICBjYXNlICdibG9iJzpcbiAgICAgICAgICAgICAgICBibG9iID0gYXdhaXQgcmVzcG9uc2UuYmxvYigpO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZWFkQmxvYkFzQmFzZTY0KGJsb2IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RvY3VtZW50JzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENvbnZlcnQgZmV0Y2ggaGVhZGVycyB0byBDYXBhY2l0b3IgSHR0cEhlYWRlcnNcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHt9O1xuICAgICAgICByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGhlYWRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgICB1cmw6IHJlc3BvbnNlLnVybCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhbiBIdHRwIEdFVCByZXF1ZXN0IGdpdmVuIGEgc2V0IG9mIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIGJ1aWxkIHRoZSBIVFRQIHJlcXVlc3RcbiAgICAgKi9cbiAgICBhc3luYyBnZXQob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgbWV0aG9kOiAnR0VUJyB9KSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gSHR0cCBQT1NUIHJlcXVlc3QgZ2l2ZW4gYSBzZXQgb2Ygb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gYnVpbGQgdGhlIEhUVFAgcmVxdWVzdFxuICAgICAqL1xuICAgIGFzeW5jIHBvc3Qob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgbWV0aG9kOiAnUE9TVCcgfSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGFuIEh0dHAgUFVUIHJlcXVlc3QgZ2l2ZW4gYSBzZXQgb2Ygb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gYnVpbGQgdGhlIEhUVFAgcmVxdWVzdFxuICAgICAqL1xuICAgIGFzeW5jIHB1dChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBtZXRob2Q6ICdQVVQnIH0pKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhbiBIdHRwIFBBVENIIHJlcXVlc3QgZ2l2ZW4gYSBzZXQgb2Ygb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gYnVpbGQgdGhlIEhUVFAgcmVxdWVzdFxuICAgICAqL1xuICAgIGFzeW5jIHBhdGNoKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IG1ldGhvZDogJ1BBVENIJyB9KSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gSHR0cCBERUxFVEUgcmVxdWVzdCBnaXZlbiBhIHNldCBvZiBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBidWlsZCB0aGUgSFRUUCByZXF1ZXN0XG4gICAgICovXG4gICAgYXN5bmMgZGVsZXRlKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IG1ldGhvZDogJ0RFTEVURScgfSkpO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBDYXBhY2l0b3JIdHRwID0gcmVnaXN0ZXJQbHVnaW4oJ0NhcGFjaXRvckh0dHAnLCB7XG4gICAgd2ViOiAoKSA9PiBuZXcgQ2FwYWNpdG9ySHR0cFBsdWdpbldlYigpLFxufSk7XG4vKioqKioqKiogRU5EIEhUVFAgUExVR0lOICoqKioqKioqL1xuLyoqKioqKioqIFNZU1RFTSBCQVJTIFBMVUdJTiAqKioqKioqKi9cbi8qKlxuICogQXZhaWxhYmxlIHN0YXR1cyBiYXIgc3R5bGVzLlxuICovXG5leHBvcnQgdmFyIFN5c3RlbUJhcnNTdHlsZTtcbihmdW5jdGlvbiAoU3lzdGVtQmFyc1N0eWxlKSB7XG4gICAgLyoqXG4gICAgICogTGlnaHQgc3lzdGVtIGJhciBjb250ZW50IG9uIGEgZGFyayBiYWNrZ3JvdW5kLlxuICAgICAqXG4gICAgICogQHNpbmNlIDguMC4wXG4gICAgICovXG4gICAgU3lzdGVtQmFyc1N0eWxlW1wiRGFya1wiXSA9IFwiREFSS1wiO1xuICAgIC8qKlxuICAgICAqIEZvciBkYXJrIHN5c3RlbSBiYXIgY29udGVudCBvbiBhIGxpZ2h0IGJhY2tncm91bmQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgOC4wLjBcbiAgICAgKi9cbiAgICBTeXN0ZW1CYXJzU3R5bGVbXCJMaWdodFwiXSA9IFwiTElHSFRcIjtcbiAgICAvKipcbiAgICAgKiBUaGUgc3R5bGUgaXMgYmFzZWQgb24gdGhlIGRldmljZSBhcHBlYXJhbmNlIG9yIHRoZSB1bmRlcmx5aW5nIGNvbnRlbnQuXG4gICAgICogSWYgdGhlIGRldmljZSBpcyB1c2luZyBEYXJrIG1vZGUsIHRoZSBzeXN0ZW0gYmFycyBjb250ZW50IHdpbGwgYmUgbGlnaHQuXG4gICAgICogSWYgdGhlIGRldmljZSBpcyB1c2luZyBMaWdodCBtb2RlLCB0aGUgc3lzdGVtIGJhcnMgY29udGVudCB3aWxsIGJlIGRhcmsuXG4gICAgICpcbiAgICAgKiBAc2luY2UgOC4wLjBcbiAgICAgKi9cbiAgICBTeXN0ZW1CYXJzU3R5bGVbXCJEZWZhdWx0XCJdID0gXCJERUZBVUxUXCI7XG59KShTeXN0ZW1CYXJzU3R5bGUgfHwgKFN5c3RlbUJhcnNTdHlsZSA9IHt9KSk7XG4vKipcbiAqIEF2YWlsYWJsZSBzeXN0ZW0gYmFyIHR5cGVzLlxuICovXG5leHBvcnQgdmFyIFN5c3RlbUJhclR5cGU7XG4oZnVuY3Rpb24gKFN5c3RlbUJhclR5cGUpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgdG9wIHN0YXR1cyBiYXIgb24gYm90aCBBbmRyb2lkIGFuZCBpT1MuXG4gICAgICpcbiAgICAgKiBAc2luY2UgOC4wLjBcbiAgICAgKi9cbiAgICBTeXN0ZW1CYXJUeXBlW1wiU3RhdHVzQmFyXCJdID0gXCJTdGF0dXNCYXJcIjtcbiAgICAvKipcbiAgICAgKiBUaGUgbmF2aWdhdGlvbiBiYXIgKG9yIGdlc3R1cmUgYmFyIG9uIGlPUykgb24gYm90aCBBbmRyb2lkIGFuZCBpT1MuXG4gICAgICpcbiAgICAgKiBAc2luY2UgOC4wLjBcbiAgICAgKi9cbiAgICBTeXN0ZW1CYXJUeXBlW1wiTmF2aWdhdGlvbkJhclwiXSA9IFwiTmF2aWdhdGlvbkJhclwiO1xufSkoU3lzdGVtQmFyVHlwZSB8fCAoU3lzdGVtQmFyVHlwZSA9IHt9KSk7XG5leHBvcnQgY2xhc3MgU3lzdGVtQmFyc1BsdWdpbldlYiBleHRlbmRzIFdlYlBsdWdpbiB7XG4gICAgYXN5bmMgc2V0U3R5bGUoKSB7XG4gICAgICAgIHRoaXMudW5hdmFpbGFibGUoJ25vdCBhdmFpbGFibGUgZm9yIHdlYicpO1xuICAgIH1cbiAgICBhc3luYyBzZXRBbmltYXRpb24oKSB7XG4gICAgICAgIHRoaXMudW5hdmFpbGFibGUoJ25vdCBhdmFpbGFibGUgZm9yIHdlYicpO1xuICAgIH1cbiAgICBhc3luYyBzaG93KCkge1xuICAgICAgICB0aGlzLnVuYXZhaWxhYmxlKCdub3QgYXZhaWxhYmxlIGZvciB3ZWInKTtcbiAgICB9XG4gICAgYXN5bmMgaGlkZSgpIHtcbiAgICAgICAgdGhpcy51bmF2YWlsYWJsZSgnbm90IGF2YWlsYWJsZSBmb3Igd2ViJyk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFN5c3RlbUJhcnMgPSByZWdpc3RlclBsdWdpbignU3lzdGVtQmFycycsIHtcbiAgICB3ZWI6ICgpID0+IG5ldyBTeXN0ZW1CYXJzUGx1Z2luV2ViKCksXG59KTtcbi8qKioqKioqKiBFTkQgU1lTVEVNIEJBUlMgUExVR0lOICoqKioqKioqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29yZS1wbHVnaW5zLmpzLm1hcCIsICJpbXBvcnQgdHlwZSB7IEh0dHBPcHRpb25zLCBQZXJtaXNzaW9uU3RhdGUsIFBsdWdpbkxpc3RlbmVySGFuZGxlIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcblxuZXhwb3J0IHR5cGUgQ2FsbGJhY2tJRCA9IHN0cmluZztcblxuZXhwb3J0IGludGVyZmFjZSBQZXJtaXNzaW9uU3RhdHVzIHtcbiAgcHVibGljU3RvcmFnZTogUGVybWlzc2lvblN0YXRlO1xufVxuXG5leHBvcnQgZW51bSBEaXJlY3Rvcnkge1xuICAvKipcbiAgICogVGhlIERvY3VtZW50cyBkaXJlY3RvcnkuXG4gICAqIE9uIGlPUyBpdCdzIHRoZSBhcHAncyBkb2N1bWVudHMgZGlyZWN0b3J5LlxuICAgKiBVc2UgdGhpcyBkaXJlY3RvcnkgdG8gc3RvcmUgdXNlci1nZW5lcmF0ZWQgY29udGVudC5cbiAgICogT24gQW5kcm9pZCBpdCdzIHRoZSBQdWJsaWMgRG9jdW1lbnRzIGZvbGRlciwgc28gaXQncyBhY2Nlc3NpYmxlIGZyb20gb3RoZXIgYXBwcy5cbiAgICogSXQncyBub3QgYWNjZXNzaWJsZSBvbiBBbmRyb2lkIDEwIHVubGVzcyB0aGUgYXBwIGVuYWJsZXMgbGVnYWN5IEV4dGVybmFsIFN0b3JhZ2VcbiAgICogYnkgYWRkaW5nIGBhbmRyb2lkOnJlcXVlc3RMZWdhY3lFeHRlcm5hbFN0b3JhZ2U9XCJ0cnVlXCJgIGluIHRoZSBgYXBwbGljYXRpb25gIHRhZ1xuICAgKiBpbiB0aGUgYEFuZHJvaWRNYW5pZmVzdC54bWxgLlxuICAgKiBPbiBBbmRyb2lkIDExIG9yIG5ld2VyIHRoZSBhcHAgY2FuIG9ubHkgYWNjZXNzIHRoZSBmaWxlcy9mb2xkZXJzIHRoZSBhcHAgY3JlYXRlZC5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBEb2N1bWVudHMgPSAnRE9DVU1FTlRTJyxcblxuICAvKipcbiAgICogVGhlIERhdGEgZGlyZWN0b3J5LlxuICAgKiBPbiBpT1MgaXQgd2lsbCB1c2UgdGhlIERvY3VtZW50cyBkaXJlY3RvcnkuXG4gICAqIE9uIEFuZHJvaWQgaXQncyB0aGUgZGlyZWN0b3J5IGhvbGRpbmcgYXBwbGljYXRpb24gZmlsZXMuXG4gICAqIEZpbGVzIHdpbGwgYmUgZGVsZXRlZCB3aGVuIHRoZSBhcHBsaWNhdGlvbiBpcyB1bmluc3RhbGxlZC5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBEYXRhID0gJ0RBVEEnLFxuXG4gIC8qKlxuICAgKiBUaGUgTGlicmFyeSBkaXJlY3RvcnkuXG4gICAqIE9uIGlPUyBpdCB3aWxsIHVzZSB0aGUgTGlicmFyeSBkaXJlY3RvcnkuXG4gICAqIE9uIEFuZHJvaWQgaXQncyB0aGUgZGlyZWN0b3J5IGhvbGRpbmcgYXBwbGljYXRpb24gZmlsZXMuXG4gICAqIEZpbGVzIHdpbGwgYmUgZGVsZXRlZCB3aGVuIHRoZSBhcHBsaWNhdGlvbiBpcyB1bmluc3RhbGxlZC5cbiAgICpcbiAgICogQHNpbmNlIDEuMS4wXG4gICAqL1xuICBMaWJyYXJ5ID0gJ0xJQlJBUlknLFxuXG4gIC8qKlxuICAgKiBUaGUgQ2FjaGUgZGlyZWN0b3J5LlxuICAgKiBDYW4gYmUgZGVsZXRlZCBpbiBjYXNlcyBvZiBsb3cgbWVtb3J5LCBzbyB1c2UgdGhpcyBkaXJlY3RvcnkgdG8gd3JpdGUgYXBwLXNwZWNpZmljIGZpbGVzLlxuICAgKiB0aGF0IHlvdXIgYXBwIGNhbiByZS1jcmVhdGUgZWFzaWx5LlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIENhY2hlID0gJ0NBQ0hFJyxcblxuICAvKipcbiAgICogVGhlIGV4dGVybmFsIGRpcmVjdG9yeS5cbiAgICogT24gaU9TIGl0IHdpbGwgdXNlIHRoZSBEb2N1bWVudHMgZGlyZWN0b3J5LlxuICAgKiBPbiBBbmRyb2lkIGl0J3MgdGhlIGRpcmVjdG9yeSBvbiB0aGUgcHJpbWFyeSBzaGFyZWQvZXh0ZXJuYWxcbiAgICogc3RvcmFnZSBkZXZpY2Ugd2hlcmUgdGhlIGFwcGxpY2F0aW9uIGNhbiBwbGFjZSBwZXJzaXN0ZW50IGZpbGVzIGl0IG93bnMuXG4gICAqIFRoZXNlIGZpbGVzIGFyZSBpbnRlcm5hbCB0byB0aGUgYXBwbGljYXRpb25zLCBhbmQgbm90IHR5cGljYWxseSB2aXNpYmxlXG4gICAqIHRvIHRoZSB1c2VyIGFzIG1lZGlhLlxuICAgKiBGaWxlcyB3aWxsIGJlIGRlbGV0ZWQgd2hlbiB0aGUgYXBwbGljYXRpb24gaXMgdW5pbnN0YWxsZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgRXh0ZXJuYWwgPSAnRVhURVJOQUwnLFxuXG4gIC8qKlxuICAgKiBUaGUgZXh0ZXJuYWwgc3RvcmFnZSBkaXJlY3RvcnkuXG4gICAqIE9uIGlPUyBpdCB3aWxsIHVzZSB0aGUgRG9jdW1lbnRzIGRpcmVjdG9yeS5cbiAgICogT24gQW5kcm9pZCBpdCdzIHRoZSBwcmltYXJ5IHNoYXJlZC9leHRlcm5hbCBzdG9yYWdlIGRpcmVjdG9yeS5cbiAgICogSXQncyBub3QgYWNjZXNzaWJsZSBvbiBBbmRyb2lkIDEwIHVubGVzcyB0aGUgYXBwIGVuYWJsZXMgbGVnYWN5IEV4dGVybmFsIFN0b3JhZ2VcbiAgICogYnkgYWRkaW5nIGBhbmRyb2lkOnJlcXVlc3RMZWdhY3lFeHRlcm5hbFN0b3JhZ2U9XCJ0cnVlXCJgIGluIHRoZSBgYXBwbGljYXRpb25gIHRhZ1xuICAgKiBpbiB0aGUgYEFuZHJvaWRNYW5pZmVzdC54bWxgLlxuICAgKiBJdCdzIG5vdCBhY2Nlc3NpYmxlIG9uIEFuZHJvaWQgMTEgb3IgbmV3ZXIuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cblxuICBFeHRlcm5hbFN0b3JhZ2UgPSAnRVhURVJOQUxfU1RPUkFHRScsXG4gIC8qKlxuICAgKiBUaGUgZXh0ZXJuYWwgY2FjaGUgZGlyZWN0b3J5LlxuICAgKiBPbiBpT1MgaXQgd2lsbCB1c2UgdGhlIERvY3VtZW50cyBkaXJlY3RvcnkuXG4gICAqIE9uIEFuZHJvaWQgaXQncyB0aGUgcHJpbWFyeSBzaGFyZWQvZXh0ZXJuYWwgY2FjaGUuXG4gICAqXG4gICAqIEBzaW5jZSA3LjEuMFxuICAgKi9cbiAgRXh0ZXJuYWxDYWNoZSA9ICdFWFRFUk5BTF9DQUNIRScsXG5cbiAgLyoqXG4gICAqIFRoZSBMaWJyYXJ5IGRpcmVjdG9yeSB3aXRob3V0IGNsb3VkIGJhY2t1cC4gVXNlZCBpbiBpT1MuXG4gICAqIE9uIEFuZHJvaWQgaXQncyB0aGUgZGlyZWN0b3J5IGhvbGRpbmcgYXBwbGljYXRpb24gZmlsZXMuXG4gICAqXG4gICAqIEBzaW5jZSA3LjEuMFxuICAgKi9cbiAgTGlicmFyeU5vQ2xvdWQgPSAnTElCUkFSWV9OT19DTE9VRCcsXG5cbiAgLyoqXG4gICAqIEEgdGVtcG9yYXJ5IGRpcmVjdG9yeSBmb3IgaU9TLlxuICAgKiBPbiBBbmRyb2lkIGl0J3MgdGhlIGRpcmVjdG9yeSBob2xkaW5nIHRoZSBhcHBsaWNhdGlvbiBjYWNoZS5cbiAgICpcbiAgICogQHNpbmNlIDcuMS4wXG4gICAqL1xuICBUZW1wb3JhcnkgPSAnVEVNUE9SQVJZJyxcbn1cblxuZXhwb3J0IGVudW0gRW5jb2Rpbmcge1xuICAvKipcbiAgICogRWlnaHQtYml0IFVDUyBUcmFuc2Zvcm1hdGlvbiBGb3JtYXRcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBVVEY4ID0gJ3V0ZjgnLFxuXG4gIC8qKlxuICAgKiBTZXZlbi1iaXQgQVNDSUksIGEuay5hLiBJU082NDYtVVMsIGEuay5hLiB0aGUgQmFzaWMgTGF0aW4gYmxvY2sgb2YgdGhlXG4gICAqIFVuaWNvZGUgY2hhcmFjdGVyIHNldFxuICAgKiBUaGlzIGVuY29kaW5nIGlzIG9ubHkgc3VwcG9ydGVkIG9uIEFuZHJvaWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgQVNDSUkgPSAnYXNjaWknLFxuXG4gIC8qKlxuICAgKiBTaXh0ZWVuLWJpdCBVQ1MgVHJhbnNmb3JtYXRpb24gRm9ybWF0LCBieXRlIG9yZGVyIGlkZW50aWZpZWQgYnkgYW5cbiAgICogb3B0aW9uYWwgYnl0ZS1vcmRlciBtYXJrXG4gICAqIFRoaXMgZW5jb2RpbmcgaXMgb25seSBzdXBwb3J0ZWQgb24gQW5kcm9pZC5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBVVEYxNiA9ICd1dGYxNicsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV3JpdGVGaWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0byB3cml0ZVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRhdGEgdG8gd3JpdGVcbiAgICpcbiAgICogTm90ZTogQmxvYiBkYXRhIGlzIG9ubHkgc3VwcG9ydGVkIG9uIFdlYi5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkYXRhOiBzdHJpbmcgfCBCbG9iO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gc3RvcmUgdGhlIGZpbGUgaW5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG5cbiAgLyoqXG4gICAqIFRoZSBlbmNvZGluZyB0byB3cml0ZSB0aGUgZmlsZSBpbi4gSWYgbm90IHByb3ZpZGVkLCBkYXRhXG4gICAqIGlzIHdyaXR0ZW4gYXMgYmFzZTY0IGVuY29kZWQuXG4gICAqXG4gICAqIFBhc3MgRW5jb2RpbmcuVVRGOCB0byB3cml0ZSBkYXRhIGFzIHN0cmluZ1xuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGVuY29kaW5nPzogRW5jb2Rpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gY3JlYXRlIGFueSBtaXNzaW5nIHBhcmVudCBkaXJlY3Rvcmllcy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICByZWN1cnNpdmU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFwcGVuZEZpbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRvIGFwcGVuZFxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRhdGEgdG8gd3JpdGVcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkYXRhOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byBzdG9yZSB0aGUgZmlsZSBpblxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcblxuICAvKipcbiAgICogVGhlIGVuY29kaW5nIHRvIHdyaXRlIHRoZSBmaWxlIGluLiBJZiBub3QgcHJvdmlkZWQsIGRhdGFcbiAgICogaXMgd3JpdHRlbiBhcyBiYXNlNjQgZW5jb2RlZC5cbiAgICpcbiAgICogUGFzcyBFbmNvZGluZy5VVEY4IHRvIHdyaXRlIGRhdGEgYXMgc3RyaW5nXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZW5jb2Rpbmc/OiBFbmNvZGluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWFkRmlsZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIGZpbGUgdG8gcmVhZFxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIHJlYWQgdGhlIGZpbGUgZnJvbVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcblxuICAvKipcbiAgICogVGhlIGVuY29kaW5nIHRvIHJlYWQgdGhlIGZpbGUgaW4sIGlmIG5vdCBwcm92aWRlZCwgZGF0YVxuICAgKiBpcyByZWFkIGFzIGJpbmFyeSBhbmQgcmV0dXJuZWQgYXMgYmFzZTY0IGVuY29kZWQuXG4gICAqXG4gICAqIFBhc3MgRW5jb2RpbmcuVVRGOCB0byByZWFkIGRhdGEgYXMgc3RyaW5nXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZW5jb2Rpbmc/OiBFbmNvZGluZztcblxuICAvKipcbiAgICogVGhlIG9mZnNldCB0byBzdGFydCByZWFkaW5nIHRoZSBmaWxlIGZyb20sIGluIGJ5dGVzLlxuICAgKiBOYXRpdmUgb25seSAobm90IGF2YWlsYWJsZSBpbiB3ZWIpLlxuICAgKiBDYW4gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGxlbmd0aCB0byBwYXJ0aWFsbHkgcmVhZCBmaWxlcy5cbiAgICpcbiAgICogQHNpbmNlIDguMS4wXG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIG9mZnNldD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGxlbmd0aCBvZiBkYXRhIHRvIHJlYWQsIGluIGJ5dGVzLlxuICAgKiBBbnkgbm9uLXBvc2l0aXZlIHZhbHVlIG1lYW5zIHRvIHJlYWQgdG8gdGhlIGVuZCBvZiB0aGUgZmlsZS5cbiAgICogTmF0aXZlIG9ubHkgKG5vdCBhdmFpbGFibGUgaW4gd2ViKS5cbiAgICogQ2FuIGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBvZmZzZXQgdG8gcGFydGlhbGx5IHJlYWQgZmlsZXMuXG4gICAqXG4gICAqIEBzaW5jZSA4LjEuMFxuICAgKiBAZGVmYXVsdCAtMVxuICAgKi9cbiAgbGVuZ3RoPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRGaWxlSW5DaHVua3NPcHRpb25zIGV4dGVuZHMgUmVhZEZpbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNpemUgb2YgdGhlIGNodW5rcyBpbiBieXRlcy5cbiAgICpcbiAgICogQHNpbmNlIDcuMS4wXG4gICAqL1xuICBjaHVua1NpemU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEZWxldGVGaWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0byBkZWxldGVcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byBkZWxldGUgdGhlIGZpbGUgZnJvbVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNa2Rpck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIG5ldyBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byBtYWtlIHRoZSBuZXcgZGlyZWN0b3J5IGluXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNyZWF0ZSBhbnkgbWlzc2luZyBwYXJlbnQgZGlyZWN0b3JpZXMgYXMgd2VsbC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICByZWN1cnNpdmU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJtZGlyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZGlyZWN0b3J5IHRvIHJlbW92ZVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIHJlbW92ZSB0aGUgZGlyZWN0b3J5IGZyb21cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmVjdXJzaXZlbHkgcmVtb3ZlIHRoZSBjb250ZW50cyBvZiB0aGUgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVjdXJzaXZlPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWFkZGlyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZGlyZWN0b3J5IHRvIHJlYWRcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byBsaXN0IGZpbGVzIGZyb21cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0VXJpT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0byBnZXQgdGhlIFVSSSBmb3JcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byBnZXQgdGhlIGZpbGUgdW5kZXJcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk6IERpcmVjdG9yeTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdGF0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0byBnZXQgZGF0YSBhYm91dFxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIGdldCB0aGUgZmlsZSB1bmRlclxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgZXhpc3RpbmcgZmlsZSBvciBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBmcm9tOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXN0aW5hdGlvbiBmaWxlIG9yIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHRvOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCBjb250YWluaW5nIHRoZSBleGlzdGluZyBmaWxlIG9yIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIGNvbnRhaW5pbmcgdGhlIGRlc3RpbmF0aW9uIGZpbGUgb3IgZGlyZWN0b3J5LiBJZiBub3Qgc3VwcGxpZWQgd2lsbCB1c2UgdGhlICdkaXJlY3RvcnknXG4gICAqIHBhcmFtZXRlciBhcyB0aGUgZGVzdGluYXRpb25cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICB0b0RpcmVjdG9yeT86IERpcmVjdG9yeTtcbn1cblxuZXhwb3J0IHR5cGUgUmVuYW1lT3B0aW9ucyA9IENvcHlPcHRpb25zO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRGaWxlUmVzdWx0IHtcbiAgLyoqXG4gICAqIFRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZGF0YSBjb250YWluZWQgaW4gdGhlIGZpbGVcbiAgICpcbiAgICogTm90ZTogQmxvYiBpcyBvbmx5IGF2YWlsYWJsZSBvbiBXZWIuIE9uIG5hdGl2ZSwgdGhlIGRhdGEgaXMgcmV0dXJuZWQgYXMgYSBzdHJpbmcuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGF0YTogc3RyaW5nIHwgQmxvYjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXcml0ZUZpbGVSZXN1bHQge1xuICAvKipcbiAgICogVGhlIHVyaSB3aGVyZSB0aGUgZmlsZSB3YXMgd3JpdHRlbiBpbnRvXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgdXJpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZGRpclJlc3VsdCB7XG4gIC8qKlxuICAgKiBMaXN0IG9mIGZpbGVzIGFuZCBkaXJlY3RvcmllcyBpbnNpZGUgdGhlIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGZpbGVzOiBGaWxlSW5mb1tdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZpbGVJbmZvIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGZpbGUgb3IgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAc2luY2UgNy4xLjBcbiAgICovXG4gIG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVHlwZSBvZiB0aGUgZmlsZS5cbiAgICpcbiAgICogQHNpbmNlIDQuMC4wXG4gICAqL1xuICB0eXBlOiAnZGlyZWN0b3J5JyB8ICdmaWxlJztcblxuICAvKipcbiAgICogU2l6ZSBvZiB0aGUgZmlsZSBpbiBieXRlcy5cbiAgICpcbiAgICogQHNpbmNlIDQuMC4wXG4gICAqL1xuICBzaXplOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRpbWUgb2YgY3JlYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgKlxuICAgKiBJdCdzIG5vdCBhdmFpbGFibGUgb24gQW5kcm9pZCA3IGFuZCBvbGRlciBkZXZpY2VzLlxuICAgKlxuICAgKiBAc2luY2UgNy4xLjBcbiAgICovXG4gIGN0aW1lPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaW1lIG9mIGxhc3QgbW9kaWZpY2F0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICpcbiAgICogQHNpbmNlIDcuMS4wXG4gICAqL1xuICBtdGltZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgdXJpIG9mIHRoZSBmaWxlLlxuICAgKlxuICAgKiBAc2luY2UgNC4wLjBcbiAgICovXG4gIHVyaTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFVyaVJlc3VsdCB7XG4gIC8qKlxuICAgKiBUaGUgdXJpIG9mIHRoZSBmaWxlXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgdXJpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFN0YXRSZXN1bHQgPSBGaWxlSW5mbztcbmV4cG9ydCBpbnRlcmZhY2UgQ29weVJlc3VsdCB7XG4gIC8qKlxuICAgKiBUaGUgdXJpIHdoZXJlIHRoZSBmaWxlIHdhcyBjb3BpZWQgaW50b1xuICAgKlxuICAgKiBAc2luY2UgNC4wLjBcbiAgICovXG4gIHVyaTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERvd25sb2FkRmlsZU9wdGlvbnMgZXh0ZW5kcyBIdHRwT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0aGUgZG93bmxvYWRlZCBmaWxlIHNob3VsZCBiZSBtb3ZlZCB0by5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgZGlyZWN0b3J5IHRvIHdyaXRlIHRoZSBmaWxlIHRvLlxuICAgKiBJZiB0aGlzIG9wdGlvbiBpcyB1c2VkLCBmaWxlUGF0aCBjYW4gYmUgYSByZWxhdGl2ZSBwYXRoIHJhdGhlciB0aGFuIGFic29sdXRlLlxuICAgKiBUaGUgZGVmYXVsdCBpcyB0aGUgYERBVEFgIGRpcmVjdG9yeS5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBsaXN0ZW5lciBmdW5jdGlvbiB0byByZWNlaXZlIGRvd25sb2FkZWQgcHJvZ3Jlc3MgZXZlbnRzLlxuICAgKiBJZiB0aGlzIG9wdGlvbiBpcyB1c2VkLCBwcm9ncmVzcyBldmVudCBzaG91bGQgYmUgZGlzcGF0Y2hlZCBvbiBldmVyeSBjaHVuayByZWNlaXZlZC5cbiAgICogQ2h1bmtzIGFyZSB0aHJvdHRsZWQgdG8gZXZlcnkgMTAwbXMgb24gQW5kcm9pZC9pT1MgdG8gYXZvaWQgc2xvd2Rvd25zLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIHByb2dyZXNzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gY3JlYXRlIGFueSBtaXNzaW5nIHBhcmVudCBkaXJlY3Rvcmllcy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQHNpbmNlIDUuMS4yXG4gICAqL1xuICByZWN1cnNpdmU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERvd25sb2FkRmlsZVJlc3VsdCB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0aGUgZmlsZSB3YXMgZG93bmxvYWRlZCB0by5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqL1xuICBwYXRoPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGJsb2IgZGF0YSBvZiB0aGUgZG93bmxvYWRlZCBmaWxlLlxuICAgKiBUaGlzIGlzIG9ubHkgYXZhaWxhYmxlIG9uIHdlYi5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqL1xuICBibG9iPzogQmxvYjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc1N0YXR1cyB7XG4gIC8qKlxuICAgKiBUaGUgdXJsIG9mIHRoZSBmaWxlIGJlaW5nIGRvd25sb2FkZWQuXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgdXJsOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGJ5dGVzIGRvd25sb2FkZWQgc28gZmFyLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIGJ5dGVzOiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRvIGRvd25sb2FkIGZvciB0aGlzIGZpbGUuXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgY29udGVudExlbmd0aDogbnVtYmVyO1xufVxuXG4vKipcbiAqIENhbGxiYWNrIGZvciByZWNlaXZpbmcgY2h1bmtzIHJlYWQgZnJvbSBhIGZpbGUsIG9yIGVycm9yIGlmIHNvbWV0aGluZyB3ZW50IHdyb25nLlxuICpcbiAqIEBzaW5jZSA3LjEuMFxuICovXG5leHBvcnQgdHlwZSBSZWFkRmlsZUluQ2h1bmtzQ2FsbGJhY2sgPSAoY2h1bmtSZWFkOiBSZWFkRmlsZVJlc3VsdCB8IG51bGwsIGVycj86IGFueSkgPT4gdm9pZDtcblxuLyoqXG4gKiBBIGxpc3RlbmVyIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgcHJvZ3Jlc3MgZXZlbnRzLlxuICpcbiAqIEBzaW5jZSA1LjEuMFxuICovXG5leHBvcnQgdHlwZSBQcm9ncmVzc0xpc3RlbmVyID0gKHByb2dyZXNzOiBQcm9ncmVzc1N0YXR1cykgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBGaWxlc3lzdGVtUGx1Z2luIHtcbiAgLyoqXG4gICAqIENoZWNrIHJlYWQvd3JpdGUgcGVybWlzc2lvbnMuXG4gICAqIFJlcXVpcmVkIG9uIEFuZHJvaWQsIG9ubHkgd2hlbiB1c2luZyBgRGlyZWN0b3J5LkRvY3VtZW50c2Agb3JcbiAgICogYERpcmVjdG9yeS5FeHRlcm5hbFN0b3JhZ2VgLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGNoZWNrUGVybWlzc2lvbnMoKTogUHJvbWlzZTxQZXJtaXNzaW9uU3RhdHVzPjtcblxuICAvKipcbiAgICogUmVxdWVzdCByZWFkL3dyaXRlIHBlcm1pc3Npb25zLlxuICAgKiBSZXF1aXJlZCBvbiBBbmRyb2lkLCBvbmx5IHdoZW4gdXNpbmcgYERpcmVjdG9yeS5Eb2N1bWVudHNgIG9yXG4gICAqIGBEaXJlY3RvcnkuRXh0ZXJuYWxTdG9yYWdlYC5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICByZXF1ZXN0UGVybWlzc2lvbnMoKTogUHJvbWlzZTxQZXJtaXNzaW9uU3RhdHVzPjtcblxuICAvKipcbiAgICogUmVhZCBhIGZpbGUgZnJvbSBkaXNrXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVhZEZpbGUob3B0aW9uczogUmVhZEZpbGVPcHRpb25zKTogUHJvbWlzZTxSZWFkRmlsZVJlc3VsdD47XG5cbiAgLyoqXG4gICAqIFJlYWQgYSBmaWxlIGZyb20gZGlzaywgaW4gY2h1bmtzLlxuICAgKiBOYXRpdmUgb25seSAobm90IGF2YWlsYWJsZSBpbiB3ZWIpLlxuICAgKiBVc2UgdGhlIGNhbGxiYWNrIHRvIHJlY2VpdmUgZWFjaCByZWFkIGNodW5rLlxuICAgKiBJZiBlbXB0eSBjaHVuayBpcyByZXR1cm5lZCwgaXQgbWVhbnMgZmlsZSBoYXMgYmVlbiBjb21wbGV0ZWx5IHJlYWQuXG4gICAqXG4gICAqIEBzaW5jZSA3LjEuMFxuICAgKi9cbiAgcmVhZEZpbGVJbkNodW5rcyhvcHRpb25zOiBSZWFkRmlsZUluQ2h1bmtzT3B0aW9ucywgY2FsbGJhY2s6IFJlYWRGaWxlSW5DaHVua3NDYWxsYmFjayk6IFByb21pc2U8Q2FsbGJhY2tJRD47XG5cbiAgLyoqXG4gICAqIFdyaXRlIGEgZmlsZSB0byBkaXNrIGluIHRoZSBzcGVjaWZpZWQgbG9jYXRpb24gb24gZGV2aWNlXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgd3JpdGVGaWxlKG9wdGlvbnM6IFdyaXRlRmlsZU9wdGlvbnMpOiBQcm9taXNlPFdyaXRlRmlsZVJlc3VsdD47XG5cbiAgLyoqXG4gICAqIEFwcGVuZCB0byBhIGZpbGUgb24gZGlzayBpbiB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uIG9uIGRldmljZVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGFwcGVuZEZpbGUob3B0aW9uczogQXBwZW5kRmlsZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBEZWxldGUgYSBmaWxlIGZyb20gZGlza1xuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRlbGV0ZUZpbGUob3B0aW9uczogRGVsZXRlRmlsZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgbWtkaXIob3B0aW9uczogTWtkaXJPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogUmVtb3ZlIGEgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcm1kaXIob3B0aW9uczogUm1kaXJPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogUmV0dXJuIGEgbGlzdCBvZiBmaWxlcyBmcm9tIHRoZSBkaXJlY3RvcnkgKG5vdCByZWN1cnNpdmUpXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVhZGRpcihvcHRpb25zOiBSZWFkZGlyT3B0aW9ucyk6IFByb21pc2U8UmVhZGRpclJlc3VsdD47XG5cbiAgLyoqXG4gICAqIFJldHVybiBmdWxsIEZpbGUgVVJJIGZvciBhIHBhdGggYW5kIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGdldFVyaShvcHRpb25zOiBHZXRVcmlPcHRpb25zKTogUHJvbWlzZTxHZXRVcmlSZXN1bHQ+O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gZGF0YSBhYm91dCBhIGZpbGVcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBzdGF0KG9wdGlvbnM6IFN0YXRPcHRpb25zKTogUHJvbWlzZTxTdGF0UmVzdWx0PjtcblxuICAvKipcbiAgICogUmVuYW1lIGEgZmlsZSBvciBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICByZW5hbWUob3B0aW9uczogUmVuYW1lT3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIENvcHkgYSBmaWxlIG9yIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGNvcHkob3B0aW9uczogQ29weU9wdGlvbnMpOiBQcm9taXNlPENvcHlSZXN1bHQ+O1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGEgaHR0cCByZXF1ZXN0IHRvIGEgc2VydmVyIGFuZCBkb3dubG9hZCB0aGUgZmlsZSB0byB0aGUgc3BlY2lmaWVkIGRlc3RpbmF0aW9uLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gNy4xLjAuXG4gICAqIFdlIHJlY29tbWVuZCB1c2luZyB0aGUgQGNhcGFjaXRvci9maWxlLXRyYW5zZmVyIHBsdWdpbiBpbnN0ZWFkLCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoaXMgcGx1Z2luLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBAY2FwYWNpdG9yL2ZpbGUtdHJhbnNmZXIgcGx1Z2luIGluc3RlYWQuXG4gICAqL1xuICBkb3dubG9hZEZpbGUob3B0aW9uczogRG93bmxvYWRGaWxlT3B0aW9ucyk6IFByb21pc2U8RG93bmxvYWRGaWxlUmVzdWx0PjtcblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gZmlsZSBkb3dubG9hZCBwcm9ncmVzcyBldmVudHMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiA3LjEuMC5cbiAgICogV2UgcmVjb21tZW5kIHVzaW5nIHRoZSBAY2FwYWNpdG9yL2ZpbGUtdHJhbnNmZXIgcGx1Z2luIGluc3RlYWQsIGluIGNvbmp1bmN0aW9uIHdpdGggdGhpcyBwbHVnaW4uXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIEBjYXBhY2l0b3IvZmlsZS10cmFuc2ZlciBwbHVnaW4gaW5zdGVhZC5cbiAgICovXG4gIGFkZExpc3RlbmVyKGV2ZW50TmFtZTogJ3Byb2dyZXNzJywgbGlzdGVuZXJGdW5jOiBQcm9ncmVzc0xpc3RlbmVyKTogUHJvbWlzZTxQbHVnaW5MaXN0ZW5lckhhbmRsZT47XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciB0aGlzIHBsdWdpbi5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDcuMS4wLlxuICAgKiBXZSByZWNvbW1lbmQgdXNpbmcgdGhlIEBjYXBhY2l0b3IvZmlsZS10cmFuc2ZlciBwbHVnaW4gaW5zdGVhZCwgaW4gY29uanVuY3Rpb24gd2l0aCB0aGlzIHBsdWdpbi5cbiAgICpcbiAgICogQHNpbmNlIDUuMi4wXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgQGNhcGFjaXRvci9maWxlLXRyYW5zZmVyIHBsdWdpbiBpbnN0ZWFkLlxuICAgKi9cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzKCk6IFByb21pc2U8dm9pZD47XG59XG5cbi8qKlxuICogU3RydWN0dXJlIGZvciBlcnJvcnMgcmV0dXJuZWQgYnkgdGhlIHBsdWdpbi5cbiAqXG4gKiBgY29kZWAgZm9sbG93cyBcIk9TLVBMVUctRklMRS1YWFhYXCIgZm9ybWF0XG4gKlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIFBsdWdpbkVycm9yID0ge1xuICBjb2RlOiBzdHJpbmc7XG4gIG1lc3NhZ2U6IHN0cmluZztcbn07XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBSZWFkRmlsZU9wdGlvbnNgLlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVSZWFkT3B0aW9ucyA9IFJlYWRGaWxlT3B0aW9ucztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFJlYWRGaWxlUmVzdWx0YC5cbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgdHlwZSBGaWxlUmVhZFJlc3VsdCA9IFJlYWRGaWxlUmVzdWx0O1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgV3JpdGVGaWxlT3B0aW9uc2AuXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgRmlsZVdyaXRlT3B0aW9ucyA9IFdyaXRlRmlsZU9wdGlvbnM7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBXcml0ZUZpbGVSZXN1bHRgLlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVXcml0ZVJlc3VsdCA9IFdyaXRlRmlsZVJlc3VsdDtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYEFwcGVuZEZpbGVPcHRpb25zYC5cbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgdHlwZSBGaWxlQXBwZW5kT3B0aW9ucyA9IEFwcGVuZEZpbGVPcHRpb25zO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgRGVsZXRlRmlsZU9wdGlvbnNgLlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVEZWxldGVPcHRpb25zID0gRGVsZXRlRmlsZU9wdGlvbnM7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBEaXJlY3RvcnlgLlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBGaWxlc3lzdGVtRGlyZWN0b3J5ID0gRGlyZWN0b3J5O1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgRW5jb2RpbmdgLlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBGaWxlc3lzdGVtRW5jb2RpbmcgPSBFbmNvZGluZztcbiIsICJpbXBvcnQgeyBXZWJQbHVnaW4sIGJ1aWxkUmVxdWVzdEluaXQgfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuXG5pbXBvcnQgdHlwZSB7XG4gIEFwcGVuZEZpbGVPcHRpb25zLFxuICBDb3B5T3B0aW9ucyxcbiAgQ29weVJlc3VsdCxcbiAgRGVsZXRlRmlsZU9wdGlvbnMsXG4gIEZpbGVzeXN0ZW1QbHVnaW4sXG4gIEdldFVyaU9wdGlvbnMsXG4gIEdldFVyaVJlc3VsdCxcbiAgTWtkaXJPcHRpb25zLFxuICBQZXJtaXNzaW9uU3RhdHVzLFxuICBSZWFkRmlsZU9wdGlvbnMsXG4gIFJlYWRGaWxlUmVzdWx0LFxuICBSZWFkZGlyT3B0aW9ucyxcbiAgUmVhZGRpclJlc3VsdCxcbiAgUmVuYW1lT3B0aW9ucyxcbiAgUm1kaXJPcHRpb25zLFxuICBTdGF0T3B0aW9ucyxcbiAgU3RhdFJlc3VsdCxcbiAgV3JpdGVGaWxlT3B0aW9ucyxcbiAgV3JpdGVGaWxlUmVzdWx0LFxuICBEaXJlY3RvcnksXG4gIFJlYWRGaWxlSW5DaHVua3NPcHRpb25zLFxuICBDYWxsYmFja0lELFxuICBEb3dubG9hZEZpbGVPcHRpb25zLFxuICBEb3dubG9hZEZpbGVSZXN1bHQsXG4gIFByb2dyZXNzU3RhdHVzLFxuICBSZWFkRmlsZUluQ2h1bmtzQ2FsbGJhY2ssXG59IGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuaW1wb3J0IHsgRW5jb2RpbmcgfSBmcm9tICcuL2RlZmluaXRpb25zJztcblxuZnVuY3Rpb24gcmVzb2x2ZShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwb3NpeCA9IHBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0gIT09ICcuJyk7XG4gIGNvbnN0IG5ld1Bvc2l4OiBzdHJpbmdbXSA9IFtdO1xuXG4gIHBvc2l4LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAoaXRlbSA9PT0gJy4uJyAmJiBuZXdQb3NpeC5sZW5ndGggPiAwICYmIG5ld1Bvc2l4W25ld1Bvc2l4Lmxlbmd0aCAtIDFdICE9PSAnLi4nKSB7XG4gICAgICBuZXdQb3NpeC5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3UG9zaXgucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBuZXdQb3NpeC5qb2luKCcvJyk7XG59XG5mdW5jdGlvbiBpc1BhdGhQYXJlbnQocGFyZW50OiBzdHJpbmcsIGNoaWxkcmVuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcGFyZW50ID0gcmVzb2x2ZShwYXJlbnQpO1xuICBjaGlsZHJlbiA9IHJlc29sdmUoY2hpbGRyZW4pO1xuICBjb25zdCBwYXRoc0EgPSBwYXJlbnQuc3BsaXQoJy8nKTtcbiAgY29uc3QgcGF0aHNCID0gY2hpbGRyZW4uc3BsaXQoJy8nKTtcblxuICByZXR1cm4gcGFyZW50ICE9PSBjaGlsZHJlbiAmJiBwYXRoc0EuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWUgPT09IHBhdGhzQltpbmRleF0pO1xufVxuXG5leHBvcnQgY2xhc3MgRmlsZXN5c3RlbVdlYiBleHRlbmRzIFdlYlBsdWdpbiBpbXBsZW1lbnRzIEZpbGVzeXN0ZW1QbHVnaW4ge1xuICByZWFkRmlsZUluQ2h1bmtzKF9vcHRpb25zOiBSZWFkRmlsZUluQ2h1bmtzT3B0aW9ucywgX2NhbGxiYWNrOiBSZWFkRmlsZUluQ2h1bmtzQ2FsbGJhY2spOiBQcm9taXNlPENhbGxiYWNrSUQ+IHtcbiAgICB0aHJvdyB0aGlzLnVuYXZhaWxhYmxlKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpO1xuICB9XG4gIERCX1ZFUlNJT04gPSAxO1xuICBEQl9OQU1FID0gJ0Rpc2MnO1xuXG4gIHByaXZhdGUgX3dyaXRlQ21kczogc3RyaW5nW10gPSBbJ2FkZCcsICdwdXQnLCAnZGVsZXRlJ107XG4gIHByaXZhdGUgX2RiPzogSURCRGF0YWJhc2U7XG4gIHN0YXRpYyBfZGVidWcgPSB0cnVlO1xuICBhc3luYyBpbml0RGIoKTogUHJvbWlzZTxJREJEYXRhYmFzZT4ge1xuICAgIGlmICh0aGlzLl9kYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGI7XG4gICAgfVxuICAgIGlmICghKCdpbmRleGVkREInIGluIHdpbmRvdykpIHtcbiAgICAgIHRocm93IHRoaXMudW5hdmFpbGFibGUoXCJUaGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEluZGV4ZWREQlwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8SURCRGF0YWJhc2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3Blbih0aGlzLkRCX05BTUUsIHRoaXMuREJfVkVSU0lPTik7XG4gICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IEZpbGVzeXN0ZW1XZWIuZG9VcGdyYWRlO1xuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2RiID0gcmVxdWVzdC5yZXN1bHQ7XG4gICAgICAgIHJlc29sdmUocmVxdWVzdC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgIHJlcXVlc3Qub25ibG9ja2VkID0gKCkgPT4ge1xuICAgICAgICBjb25zb2xlLndhcm4oJ2RiIGJsb2NrZWQnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZG9VcGdyYWRlKGV2ZW50OiBJREJWZXJzaW9uQ2hhbmdlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBJREJPcGVuREJSZXF1ZXN0O1xuICAgIGNvbnN0IGRiID0gZXZlbnRUYXJnZXQucmVzdWx0O1xuICAgIHN3aXRjaCAoZXZlbnQub2xkVmVyc2lvbikge1xuICAgICAgY2FzZSAwOlxuICAgICAgY2FzZSAxOlxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBpZiAoZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucygnRmlsZVN0b3JhZ2UnKSkge1xuICAgICAgICAgIGRiLmRlbGV0ZU9iamVjdFN0b3JlKCdGaWxlU3RvcmFnZScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ0ZpbGVTdG9yYWdlJywgeyBrZXlQYXRoOiAncGF0aCcgfSk7XG4gICAgICAgIHN0b3JlLmNyZWF0ZUluZGV4KCdieV9mb2xkZXInLCAnZm9sZGVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGJSZXF1ZXN0KGNtZDogc3RyaW5nLCBhcmdzOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcmVhZEZsYWcgPSB0aGlzLl93cml0ZUNtZHMuaW5kZXhPZihjbWQpICE9PSAtMSA/ICdyZWFkd3JpdGUnIDogJ3JlYWRvbmx5JztcbiAgICByZXR1cm4gdGhpcy5pbml0RGIoKS50aGVuKChjb25uOiBJREJEYXRhYmFzZSkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPElEQk9iamVjdFN0b3JlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHR4OiBJREJUcmFuc2FjdGlvbiA9IGNvbm4udHJhbnNhY3Rpb24oWydGaWxlU3RvcmFnZSddLCByZWFkRmxhZyk7XG4gICAgICAgIGNvbnN0IHN0b3JlOiBhbnkgPSB0eC5vYmplY3RTdG9yZSgnRmlsZVN0b3JhZ2UnKTtcbiAgICAgICAgY29uc3QgcmVxID0gc3RvcmVbY21kXSguLi5hcmdzKTtcbiAgICAgICAgcmVxLm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUocmVxLnJlc3VsdCk7XG4gICAgICAgIHJlcS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHJlcS5lcnJvcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRiSW5kZXhSZXF1ZXN0KGluZGV4TmFtZTogc3RyaW5nLCBjbWQ6IHN0cmluZywgYXJnczogW2FueV0pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlYWRGbGFnID0gdGhpcy5fd3JpdGVDbWRzLmluZGV4T2YoY21kKSAhPT0gLTEgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seSc7XG4gICAgcmV0dXJuIHRoaXMuaW5pdERiKCkudGhlbigoY29ubjogSURCRGF0YWJhc2UpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxJREJPYmplY3RTdG9yZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB0eDogSURCVHJhbnNhY3Rpb24gPSBjb25uLnRyYW5zYWN0aW9uKFsnRmlsZVN0b3JhZ2UnXSwgcmVhZEZsYWcpO1xuICAgICAgICBjb25zdCBzdG9yZTogSURCT2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZSgnRmlsZVN0b3JhZ2UnKTtcbiAgICAgICAgY29uc3QgaW5kZXg6IGFueSA9IHN0b3JlLmluZGV4KGluZGV4TmFtZSk7XG4gICAgICAgIGNvbnN0IHJlcSA9IGluZGV4W2NtZF0oLi4uYXJncykgYXMgYW55O1xuICAgICAgICByZXEub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShyZXEucmVzdWx0KTtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QocmVxLmVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQYXRoKGRpcmVjdG9yeTogRGlyZWN0b3J5IHwgdW5kZWZpbmVkLCB1cmlQYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNsZWFuZWRVcmlQYXRoID0gdXJpUGF0aCAhPT0gdW5kZWZpbmVkID8gdXJpUGF0aC5yZXBsYWNlKC9eWy9dK3xbL10rJC9nLCAnJykgOiAnJztcbiAgICBsZXQgZnNQYXRoID0gJyc7XG4gICAgaWYgKGRpcmVjdG9yeSAhPT0gdW5kZWZpbmVkKSBmc1BhdGggKz0gJy8nICsgZGlyZWN0b3J5O1xuICAgIGlmICh1cmlQYXRoICE9PSAnJykgZnNQYXRoICs9ICcvJyArIGNsZWFuZWRVcmlQYXRoO1xuICAgIHJldHVybiBmc1BhdGg7XG4gIH1cblxuICBhc3luYyBjbGVhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjb25uOiBJREJEYXRhYmFzZSA9IGF3YWl0IHRoaXMuaW5pdERiKCk7XG4gICAgY29uc3QgdHg6IElEQlRyYW5zYWN0aW9uID0gY29ubi50cmFuc2FjdGlvbihbJ0ZpbGVTdG9yYWdlJ10sICdyZWFkd3JpdGUnKTtcbiAgICBjb25zdCBzdG9yZTogSURCT2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZSgnRmlsZVN0b3JhZ2UnKTtcbiAgICBzdG9yZS5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYWQgYSBmaWxlIGZyb20gZGlza1xuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGUgZmlsZSByZWFkXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgcmVhZCBmaWxlIGRhdGEgcmVzdWx0XG4gICAqL1xuICBhc3luYyByZWFkRmlsZShvcHRpb25zOiBSZWFkRmlsZU9wdGlvbnMpOiBQcm9taXNlPFJlYWRGaWxlUmVzdWx0PiB7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKG9wdGlvbnMuZGlyZWN0b3J5LCBvcHRpb25zLnBhdGgpO1xuICAgIC8vIGNvbnN0IGVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZztcblxuICAgIGNvbnN0IGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAoZW50cnkgPT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3IoJ0ZpbGUgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgcmV0dXJuIHsgZGF0YTogZW50cnkuY29udGVudCA/IGVudHJ5LmNvbnRlbnQgOiAnJyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIGEgZmlsZSB0byBkaXNrIGluIHRoZSBzcGVjaWZpZWQgbG9jYXRpb24gb24gZGV2aWNlXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgZm9yIHRoZSBmaWxlIHdyaXRlXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgZmlsZSB3cml0ZSByZXN1bHRcbiAgICovXG4gIGFzeW5jIHdyaXRlRmlsZShvcHRpb25zOiBXcml0ZUZpbGVPcHRpb25zKTogUHJvbWlzZTxXcml0ZUZpbGVSZXN1bHQ+IHtcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgob3B0aW9ucy5kaXJlY3RvcnksIG9wdGlvbnMucGF0aCk7XG4gICAgbGV0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgY29uc3QgZW5jb2RpbmcgPSBvcHRpb25zLmVuY29kaW5nO1xuICAgIGNvbnN0IGRvUmVjdXJzaXZlID0gb3B0aW9ucy5yZWN1cnNpdmU7XG5cbiAgICBjb25zdCBvY2N1cGllZEVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAob2NjdXBpZWRFbnRyeSAmJiBvY2N1cGllZEVudHJ5LnR5cGUgPT09ICdkaXJlY3RvcnknKSB0aHJvdyBFcnJvcignVGhlIHN1cHBsaWVkIHBhdGggaXMgYSBkaXJlY3RvcnkuJyk7XG5cbiAgICBjb25zdCBwYXJlbnRQYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sYXN0SW5kZXhPZignLycpKTtcblxuICAgIGNvbnN0IHBhcmVudEVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGFyZW50UGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAocGFyZW50RW50cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3Qgc3ViRGlySW5kZXggPSBwYXJlbnRQYXRoLmluZGV4T2YoJy8nLCAxKTtcbiAgICAgIGlmIChzdWJEaXJJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29uc3QgcGFyZW50QXJnUGF0aCA9IHBhcmVudFBhdGguc3Vic3RyKHN1YkRpckluZGV4KTtcbiAgICAgICAgYXdhaXQgdGhpcy5ta2Rpcih7XG4gICAgICAgICAgcGF0aDogcGFyZW50QXJnUGF0aCxcbiAgICAgICAgICBkaXJlY3Rvcnk6IG9wdGlvbnMuZGlyZWN0b3J5LFxuICAgICAgICAgIHJlY3Vyc2l2ZTogZG9SZWN1cnNpdmUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZW5jb2RpbmcgJiYgIShkYXRhIGluc3RhbmNlb2YgQmxvYikpIHtcbiAgICAgIGRhdGEgPSBkYXRhLmluZGV4T2YoJywnKSA+PSAwID8gZGF0YS5zcGxpdCgnLCcpWzFdIDogZGF0YTtcbiAgICAgIGlmICghdGhpcy5pc0Jhc2U2NFN0cmluZyhkYXRhKSkgdGhyb3cgRXJyb3IoJ1RoZSBzdXBwbGllZCBkYXRhIGlzIG5vdCB2YWxpZCBiYXNlNjQgY29udGVudC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHBhdGhPYmo6IEVudHJ5T2JqID0ge1xuICAgICAgcGF0aDogcGF0aCxcbiAgICAgIGZvbGRlcjogcGFyZW50UGF0aCxcbiAgICAgIHR5cGU6ICdmaWxlJyxcbiAgICAgIHNpemU6IGRhdGEgaW5zdGFuY2VvZiBCbG9iID8gZGF0YS5zaXplIDogZGF0YS5sZW5ndGgsXG4gICAgICBjdGltZTogbm93LFxuICAgICAgbXRpbWU6IG5vdyxcbiAgICAgIGNvbnRlbnQ6IGRhdGEsXG4gICAgfTtcbiAgICBhd2FpdCB0aGlzLmRiUmVxdWVzdCgncHV0JywgW3BhdGhPYmpdKTtcbiAgICByZXR1cm4ge1xuICAgICAgdXJpOiBwYXRoT2JqLnBhdGgsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmQgdG8gYSBmaWxlIG9uIGRpc2sgaW4gdGhlIHNwZWNpZmllZCBsb2NhdGlvbiBvbiBkZXZpY2VcbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBmb3IgdGhlIGZpbGUgYXBwZW5kXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgZmlsZSB3cml0ZSByZXN1bHRcbiAgICovXG4gIGFzeW5jIGFwcGVuZEZpbGUob3B0aW9uczogQXBwZW5kRmlsZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgob3B0aW9ucy5kaXJlY3RvcnksIG9wdGlvbnMucGF0aCk7XG4gICAgbGV0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgY29uc3QgZW5jb2RpbmcgPSBvcHRpb25zLmVuY29kaW5nO1xuICAgIGNvbnN0IHBhcmVudFBhdGggPSBwYXRoLnN1YnN0cigwLCBwYXRoLmxhc3RJbmRleE9mKCcvJykpO1xuXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBsZXQgY3RpbWUgPSBub3c7XG5cbiAgICBjb25zdCBvY2N1cGllZEVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAob2NjdXBpZWRFbnRyeSAmJiBvY2N1cGllZEVudHJ5LnR5cGUgPT09ICdkaXJlY3RvcnknKSB0aHJvdyBFcnJvcignVGhlIHN1cHBsaWVkIHBhdGggaXMgYSBkaXJlY3RvcnkuJyk7XG5cbiAgICBjb25zdCBwYXJlbnRFbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhcmVudFBhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKHBhcmVudEVudHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHN1YkRpckluZGV4ID0gcGFyZW50UGF0aC5pbmRleE9mKCcvJywgMSk7XG4gICAgICBpZiAoc3ViRGlySW5kZXggIT09IC0xKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudEFyZ1BhdGggPSBwYXJlbnRQYXRoLnN1YnN0cihzdWJEaXJJbmRleCk7XG4gICAgICAgIGF3YWl0IHRoaXMubWtkaXIoe1xuICAgICAgICAgIHBhdGg6IHBhcmVudEFyZ1BhdGgsXG4gICAgICAgICAgZGlyZWN0b3J5OiBvcHRpb25zLmRpcmVjdG9yeSxcbiAgICAgICAgICByZWN1cnNpdmU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZW5jb2RpbmcgJiYgIXRoaXMuaXNCYXNlNjRTdHJpbmcoZGF0YSkpIHRocm93IEVycm9yKCdUaGUgc3VwcGxpZWQgZGF0YSBpcyBub3QgdmFsaWQgYmFzZTY0IGNvbnRlbnQuJyk7XG5cbiAgICBpZiAob2NjdXBpZWRFbnRyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAob2NjdXBpZWRFbnRyeS5jb250ZW50IGluc3RhbmNlb2YgQmxvYikge1xuICAgICAgICB0aHJvdyBFcnJvcignVGhlIG9jY3VwaWVkIGVudHJ5IGNvbnRhaW5zIGEgQmxvYiBvYmplY3Qgd2hpY2ggY2Fubm90IGJlIGFwcGVuZGVkIHRvLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAob2NjdXBpZWRFbnRyeS5jb250ZW50ICE9PSB1bmRlZmluZWQgJiYgIWVuY29kaW5nKSB7XG4gICAgICAgIGRhdGEgPSBidG9hKGF0b2Iob2NjdXBpZWRFbnRyeS5jb250ZW50KSArIGF0b2IoZGF0YSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IG9jY3VwaWVkRW50cnkuY29udGVudCArIGRhdGE7XG4gICAgICB9XG4gICAgICBjdGltZSA9IG9jY3VwaWVkRW50cnkuY3RpbWU7XG4gICAgfVxuICAgIGNvbnN0IHBhdGhPYmo6IEVudHJ5T2JqID0ge1xuICAgICAgcGF0aDogcGF0aCxcbiAgICAgIGZvbGRlcjogcGFyZW50UGF0aCxcbiAgICAgIHR5cGU6ICdmaWxlJyxcbiAgICAgIHNpemU6IGRhdGEubGVuZ3RoLFxuICAgICAgY3RpbWU6IGN0aW1lLFxuICAgICAgbXRpbWU6IG5vdyxcbiAgICAgIGNvbnRlbnQ6IGRhdGEsXG4gICAgfTtcbiAgICBhd2FpdCB0aGlzLmRiUmVxdWVzdCgncHV0JywgW3BhdGhPYmpdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgYSBmaWxlIGZyb20gZGlza1xuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGUgZmlsZSBkZWxldGVcbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBkZWxldGVkIGZpbGUgZGF0YSByZXN1bHRcbiAgICovXG4gIGFzeW5jIGRlbGV0ZUZpbGUob3B0aW9uczogRGVsZXRlRmlsZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgob3B0aW9ucy5kaXJlY3RvcnksIG9wdGlvbnMucGF0aCk7XG5cbiAgICBjb25zdCBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKCdGaWxlIGRvZXMgbm90IGV4aXN0LicpO1xuICAgIGNvbnN0IGVudHJpZXMgPSBhd2FpdCB0aGlzLmRiSW5kZXhSZXF1ZXN0KCdieV9mb2xkZXInLCAnZ2V0QWxsS2V5cycsIFtJREJLZXlSYW5nZS5vbmx5KHBhdGgpXSk7XG4gICAgaWYgKGVudHJpZXMubGVuZ3RoICE9PSAwKSB0aHJvdyBFcnJvcignRm9sZGVyIGlzIG5vdCBlbXB0eS4nKTtcblxuICAgIGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdkZWxldGUnLCBbcGF0aF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRpcmVjdG9yeS5cbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBmb3IgdGhlIG1rZGlyXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgbWtkaXIgcmVzdWx0XG4gICAqL1xuICBhc3luYyBta2RpcihvcHRpb25zOiBNa2Rpck9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgob3B0aW9ucy5kaXJlY3RvcnksIG9wdGlvbnMucGF0aCk7XG4gICAgY29uc3QgZG9SZWN1cnNpdmUgPSBvcHRpb25zLnJlY3Vyc2l2ZTtcbiAgICBjb25zdCBwYXJlbnRQYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sYXN0SW5kZXhPZignLycpKTtcblxuICAgIGNvbnN0IGRlcHRoID0gKHBhdGgubWF0Y2goL1xcLy9nKSB8fCBbXSkubGVuZ3RoO1xuICAgIGNvbnN0IHBhcmVudEVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGFyZW50UGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBjb25zdCBvY2N1cGllZEVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAoZGVwdGggPT09IDEpIHRocm93IEVycm9yKCdDYW5ub3QgY3JlYXRlIFJvb3QgZGlyZWN0b3J5Jyk7XG4gICAgaWYgKG9jY3VwaWVkRW50cnkgIT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3IoJ0N1cnJlbnQgZGlyZWN0b3J5IGRvZXMgYWxyZWFkeSBleGlzdC4nKTtcbiAgICBpZiAoIWRvUmVjdXJzaXZlICYmIGRlcHRoICE9PSAyICYmIHBhcmVudEVudHJ5ID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKCdQYXJlbnQgZGlyZWN0b3J5IG11c3QgZXhpc3QnKTtcblxuICAgIGlmIChkb1JlY3Vyc2l2ZSAmJiBkZXB0aCAhPT0gMiAmJiBwYXJlbnRFbnRyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBwYXJlbnRBcmdQYXRoID0gcGFyZW50UGF0aC5zdWJzdHIocGFyZW50UGF0aC5pbmRleE9mKCcvJywgMSkpO1xuICAgICAgYXdhaXQgdGhpcy5ta2Rpcih7XG4gICAgICAgIHBhdGg6IHBhcmVudEFyZ1BhdGgsXG4gICAgICAgIGRpcmVjdG9yeTogb3B0aW9ucy5kaXJlY3RvcnksXG4gICAgICAgIHJlY3Vyc2l2ZTogZG9SZWN1cnNpdmUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBwYXRoT2JqOiBFbnRyeU9iaiA9IHtcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBmb2xkZXI6IHBhcmVudFBhdGgsXG4gICAgICB0eXBlOiAnZGlyZWN0b3J5JyxcbiAgICAgIHNpemU6IDAsXG4gICAgICBjdGltZTogbm93LFxuICAgICAgbXRpbWU6IG5vdyxcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdwdXQnLCBbcGF0aE9ial0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhlIGRpcmVjdG9yeSByZW1vdmVcbiAgICovXG4gIGFzeW5jIHJtZGlyKG9wdGlvbnM6IFJtZGlyT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgcGF0aCwgZGlyZWN0b3J5LCByZWN1cnNpdmUgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgZnVsbFBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChkaXJlY3RvcnksIHBhdGgpO1xuXG4gICAgY29uc3QgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtmdWxsUGF0aF0pKSBhcyBFbnRyeU9iajtcblxuICAgIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcignRm9sZGVyIGRvZXMgbm90IGV4aXN0LicpO1xuXG4gICAgaWYgKGVudHJ5LnR5cGUgIT09ICdkaXJlY3RvcnknKSB0aHJvdyBFcnJvcignUmVxdWVzdGVkIHBhdGggaXMgbm90IGEgZGlyZWN0b3J5Jyk7XG5cbiAgICBjb25zdCByZWFkRGlyUmVzdWx0ID0gYXdhaXQgdGhpcy5yZWFkZGlyKHsgcGF0aCwgZGlyZWN0b3J5IH0pO1xuXG4gICAgaWYgKHJlYWREaXJSZXN1bHQuZmlsZXMubGVuZ3RoICE9PSAwICYmICFyZWN1cnNpdmUpIHRocm93IEVycm9yKCdGb2xkZXIgaXMgbm90IGVtcHR5Jyk7XG5cbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJlYWREaXJSZXN1bHQuZmlsZXMpIHtcbiAgICAgIGNvbnN0IGVudHJ5UGF0aCA9IGAke3BhdGh9LyR7ZW50cnkubmFtZX1gO1xuICAgICAgY29uc3QgZW50cnlPYmogPSBhd2FpdCB0aGlzLnN0YXQoeyBwYXRoOiBlbnRyeVBhdGgsIGRpcmVjdG9yeSB9KTtcbiAgICAgIGlmIChlbnRyeU9iai50eXBlID09PSAnZmlsZScpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5kZWxldGVGaWxlKHsgcGF0aDogZW50cnlQYXRoLCBkaXJlY3RvcnkgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCB0aGlzLnJtZGlyKHsgcGF0aDogZW50cnlQYXRoLCBkaXJlY3RvcnksIHJlY3Vyc2l2ZSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZGVsZXRlJywgW2Z1bGxQYXRoXSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgbGlzdCBvZiBmaWxlcyBmcm9tIHRoZSBkaXJlY3RvcnkgKG5vdCByZWN1cnNpdmUpXG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgcmVhZGRpciBvcGVyYXRpb25cbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZWFkZGlyIGRpcmVjdG9yeSBsaXN0aW5nIHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgcmVhZGRpcihvcHRpb25zOiBSZWFkZGlyT3B0aW9ucyk6IFByb21pc2U8UmVhZGRpclJlc3VsdD4ge1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChvcHRpb25zLmRpcmVjdG9yeSwgb3B0aW9ucy5wYXRoKTtcblxuICAgIGNvbnN0IGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAob3B0aW9ucy5wYXRoICE9PSAnJyAmJiBlbnRyeSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcignRm9sZGVyIGRvZXMgbm90IGV4aXN0LicpO1xuXG4gICAgY29uc3QgZW50cmllczogc3RyaW5nW10gPSBhd2FpdCB0aGlzLmRiSW5kZXhSZXF1ZXN0KCdieV9mb2xkZXInLCAnZ2V0QWxsS2V5cycsIFtJREJLZXlSYW5nZS5vbmx5KHBhdGgpXSk7XG4gICAgY29uc3QgZmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGVudHJpZXMubWFwKGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGxldCBzdWJFbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW2VdKSkgYXMgRW50cnlPYmo7XG4gICAgICAgIGlmIChzdWJFbnRyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3ViRW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtlICsgJy8nXSkpIGFzIEVudHJ5T2JqO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogZS5zdWJzdHJpbmcocGF0aC5sZW5ndGggKyAxKSxcbiAgICAgICAgICB0eXBlOiBzdWJFbnRyeS50eXBlLFxuICAgICAgICAgIHNpemU6IHN1YkVudHJ5LnNpemUsXG4gICAgICAgICAgY3RpbWU6IHN1YkVudHJ5LmN0aW1lLFxuICAgICAgICAgIG10aW1lOiBzdWJFbnRyeS5tdGltZSxcbiAgICAgICAgICB1cmk6IHN1YkVudHJ5LnBhdGgsXG4gICAgICAgIH07XG4gICAgICB9KSxcbiAgICApO1xuICAgIHJldHVybiB7IGZpbGVzOiBmaWxlcyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBmdWxsIEZpbGUgVVJJIGZvciBhIHBhdGggYW5kIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhlIHN0YXQgb3BlcmF0aW9uXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgZmlsZSBzdGF0IHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgZ2V0VXJpKG9wdGlvbnM6IEdldFVyaU9wdGlvbnMpOiBQcm9taXNlPEdldFVyaVJlc3VsdD4ge1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChvcHRpb25zLmRpcmVjdG9yeSwgb3B0aW9ucy5wYXRoKTtcblxuICAgIGxldCBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aCArICcvJ10pKSBhcyBFbnRyeU9iajtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHVyaTogZW50cnk/LnBhdGggfHwgcGF0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBkYXRhIGFib3V0IGEgZmlsZVxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhlIHN0YXQgb3BlcmF0aW9uXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgZmlsZSBzdGF0IHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgc3RhdChvcHRpb25zOiBTdGF0T3B0aW9ucyk6IFByb21pc2U8U3RhdFJlc3VsdD4ge1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChvcHRpb25zLmRpcmVjdG9yeSwgb3B0aW9ucy5wYXRoKTtcblxuICAgIGxldCBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aCArICcvJ10pKSBhcyBFbnRyeU9iajtcbiAgICB9XG4gICAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKCdFbnRyeSBkb2VzIG5vdCBleGlzdC4nKTtcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBlbnRyeS5wYXRoLnN1YnN0cmluZyhwYXRoLmxlbmd0aCArIDEpLFxuICAgICAgdHlwZTogZW50cnkudHlwZSxcbiAgICAgIHNpemU6IGVudHJ5LnNpemUsXG4gICAgICBjdGltZTogZW50cnkuY3RpbWUsXG4gICAgICBtdGltZTogZW50cnkubXRpbWUsXG4gICAgICB1cmk6IGVudHJ5LnBhdGgsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5hbWUgYSBmaWxlIG9yIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhlIHJlbmFtZSBvcGVyYXRpb25cbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZW5hbWUgcmVzdWx0XG4gICAqL1xuICBhc3luYyByZW5hbWUob3B0aW9uczogUmVuYW1lT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2NvcHkob3B0aW9ucywgdHJ1ZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcHkgYSBmaWxlIG9yIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhlIGNvcHkgb3BlcmF0aW9uXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgY29weSByZXN1bHRcbiAgICovXG4gIGFzeW5jIGNvcHkob3B0aW9uczogQ29weU9wdGlvbnMpOiBQcm9taXNlPENvcHlSZXN1bHQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY29weShvcHRpb25zLCBmYWxzZSk7XG4gIH1cblxuICBhc3luYyByZXF1ZXN0UGVybWlzc2lvbnMoKTogUHJvbWlzZTxQZXJtaXNzaW9uU3RhdHVzPiB7XG4gICAgcmV0dXJuIHsgcHVibGljU3RvcmFnZTogJ2dyYW50ZWQnIH07XG4gIH1cblxuICBhc3luYyBjaGVja1Blcm1pc3Npb25zKCk6IFByb21pc2U8UGVybWlzc2lvblN0YXR1cz4ge1xuICAgIHJldHVybiB7IHB1YmxpY1N0b3JhZ2U6ICdncmFudGVkJyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgY2FuIHBlcmZvcm0gYSBjb3B5IG9yIGEgcmVuYW1lXG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgcmVuYW1lIG9wZXJhdGlvblxuICAgKiBAcGFyYW0gZG9SZW5hbWUgd2hldGhlciB0byBwZXJmb3JtIGEgcmVuYW1lIG9yIGNvcHkgb3BlcmF0aW9uXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgcmVzdWx0XG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9jb3B5KG9wdGlvbnM6IENvcHlPcHRpb25zLCBkb1JlbmFtZSA9IGZhbHNlKTogUHJvbWlzZTxDb3B5UmVzdWx0PiB7XG4gICAgbGV0IHsgdG9EaXJlY3RvcnkgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgeyB0bywgZnJvbSwgZGlyZWN0b3J5OiBmcm9tRGlyZWN0b3J5IH0gPSBvcHRpb25zO1xuXG4gICAgaWYgKCF0byB8fCAhZnJvbSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0JvdGggdG8gYW5kIGZyb20gbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIC8vIElmIG5vIFwidG9cIiBkaXJlY3RvcnkgaXMgcHJvdmlkZWQsIHVzZSB0aGUgXCJmcm9tXCIgZGlyZWN0b3J5XG4gICAgaWYgKCF0b0RpcmVjdG9yeSkge1xuICAgICAgdG9EaXJlY3RvcnkgPSBmcm9tRGlyZWN0b3J5O1xuICAgIH1cblxuICAgIGNvbnN0IGZyb21QYXRoID0gdGhpcy5nZXRQYXRoKGZyb21EaXJlY3RvcnksIGZyb20pO1xuICAgIGNvbnN0IHRvUGF0aCA9IHRoaXMuZ2V0UGF0aCh0b0RpcmVjdG9yeSwgdG8pO1xuXG4gICAgLy8gVGVzdCB0aGF0IHRoZSBcInRvXCIgYW5kIFwiZnJvbVwiIGxvY2F0aW9ucyBhcmUgZGlmZmVyZW50XG4gICAgaWYgKGZyb21QYXRoID09PSB0b1BhdGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVyaTogdG9QYXRoLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoaXNQYXRoUGFyZW50KGZyb21QYXRoLCB0b1BhdGgpKSB7XG4gICAgICB0aHJvdyBFcnJvcignVG8gcGF0aCBjYW5ub3QgY29udGFpbiB0aGUgZnJvbSBwYXRoJyk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdGhlIHN0YXRlIG9mIHRoZSBcInRvXCIgbG9jYXRpb25cbiAgICBsZXQgdG9PYmo7XG4gICAgdHJ5IHtcbiAgICAgIHRvT2JqID0gYXdhaXQgdGhpcy5zdGF0KHtcbiAgICAgICAgcGF0aDogdG8sXG4gICAgICAgIGRpcmVjdG9yeTogdG9EaXJlY3RvcnksXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBUbyBsb2NhdGlvbiBkb2VzIG5vdCBleGlzdCwgZW5zdXJlIHRoZSBkaXJlY3RvcnkgY29udGFpbmluZyBcInRvXCIgbG9jYXRpb24gZXhpc3RzIGFuZCBpcyBhIGRpcmVjdG9yeVxuICAgICAgY29uc3QgdG9QYXRoQ29tcG9uZW50cyA9IHRvLnNwbGl0KCcvJyk7XG4gICAgICB0b1BhdGhDb21wb25lbnRzLnBvcCgpO1xuICAgICAgY29uc3QgdG9QYXRoID0gdG9QYXRoQ29tcG9uZW50cy5qb2luKCcvJyk7XG5cbiAgICAgIC8vIENoZWNrIHRoZSBjb250YWluaW5nIGRpcmVjdG9yeSBvZiB0aGUgXCJ0b1wiIGxvY2F0aW9uIGV4aXN0c1xuICAgICAgaWYgKHRvUGF0aENvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB0b1BhcmVudERpcmVjdG9yeSA9IGF3YWl0IHRoaXMuc3RhdCh7XG4gICAgICAgICAgcGF0aDogdG9QYXRoLFxuICAgICAgICAgIGRpcmVjdG9yeTogdG9EaXJlY3RvcnksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0b1BhcmVudERpcmVjdG9yeS50eXBlICE9PSAnZGlyZWN0b3J5Jykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyZW50IGRpcmVjdG9yeSBvZiB0aGUgdG8gcGF0aCBpcyBhIGZpbGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENhbm5vdCBvdmVyd3JpdGUgYSBkaXJlY3RvcnlcbiAgICBpZiAodG9PYmogJiYgdG9PYmoudHlwZSA9PT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IG92ZXJ3cml0ZSBhIGRpcmVjdG9yeSB3aXRoIGEgZmlsZScpO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGUgXCJmcm9tXCIgb2JqZWN0IGV4aXN0c1xuICAgIGNvbnN0IGZyb21PYmogPSBhd2FpdCB0aGlzLnN0YXQoe1xuICAgICAgcGF0aDogZnJvbSxcbiAgICAgIGRpcmVjdG9yeTogZnJvbURpcmVjdG9yeSxcbiAgICB9KTtcblxuICAgIC8vIFNldCB0aGUgbXRpbWUvY3RpbWUgb2YgdGhlIHN1cHBsaWVkIHBhdGhcbiAgICBjb25zdCB1cGRhdGVUaW1lID0gYXN5bmMgKHBhdGg6IHN0cmluZywgY3RpbWU6IG51bWJlciwgbXRpbWU6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgZnVsbFBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aCh0b0RpcmVjdG9yeSwgcGF0aCk7XG4gICAgICBjb25zdCBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW2Z1bGxQYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgICAgZW50cnkuY3RpbWUgPSBjdGltZTtcbiAgICAgIGVudHJ5Lm10aW1lID0gbXRpbWU7XG4gICAgICBhd2FpdCB0aGlzLmRiUmVxdWVzdCgncHV0JywgW2VudHJ5XSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGN0aW1lID0gZnJvbU9iai5jdGltZSA/IGZyb21PYmouY3RpbWUgOiBEYXRlLm5vdygpO1xuXG4gICAgc3dpdGNoIChmcm9tT2JqLnR5cGUpIHtcbiAgICAgIC8vIFRoZSBcImZyb21cIiBvYmplY3QgaXMgYSBmaWxlXG4gICAgICBjYXNlICdmaWxlJzoge1xuICAgICAgICAvLyBSZWFkIHRoZSBmaWxlXG4gICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCB0aGlzLnJlYWRGaWxlKHtcbiAgICAgICAgICBwYXRoOiBmcm9tLFxuICAgICAgICAgIGRpcmVjdG9yeTogZnJvbURpcmVjdG9yeSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gT3B0aW9uYWxseSByZW1vdmUgdGhlIGZpbGVcbiAgICAgICAgaWYgKGRvUmVuYW1lKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5kZWxldGVGaWxlKHtcbiAgICAgICAgICAgIHBhdGg6IGZyb20sXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IGZyb21EaXJlY3RvcnksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZW5jb2Rpbmc7XG4gICAgICAgIGlmICghKGZpbGUuZGF0YSBpbnN0YW5jZW9mIEJsb2IpICYmICF0aGlzLmlzQmFzZTY0U3RyaW5nKGZpbGUuZGF0YSkpIHtcbiAgICAgICAgICBlbmNvZGluZyA9IEVuY29kaW5nLlVURjg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXcml0ZSB0aGUgZmlsZSB0byB0aGUgbmV3IGxvY2F0aW9uXG4gICAgICAgIGNvbnN0IHdyaXRlUmVzdWx0ID0gYXdhaXQgdGhpcy53cml0ZUZpbGUoe1xuICAgICAgICAgIHBhdGg6IHRvLFxuICAgICAgICAgIGRpcmVjdG9yeTogdG9EaXJlY3RvcnksXG4gICAgICAgICAgZGF0YTogZmlsZS5kYXRhLFxuICAgICAgICAgIGVuY29kaW5nOiBlbmNvZGluZyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ29weSB0aGUgbXRpbWUvY3RpbWUgb2YgYSByZW5hbWVkIGZpbGVcbiAgICAgICAgaWYgKGRvUmVuYW1lKSB7XG4gICAgICAgICAgYXdhaXQgdXBkYXRlVGltZSh0bywgY3RpbWUsIGZyb21PYmoubXRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzb2x2ZSBwcm9taXNlXG4gICAgICAgIHJldHVybiB3cml0ZVJlc3VsdDtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2RpcmVjdG9yeSc6IHtcbiAgICAgICAgaWYgKHRvT2JqKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBtb3ZlIGEgZGlyZWN0b3J5IG92ZXIgYW4gZXhpc3Rpbmcgb2JqZWN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgdG8gZGlyZWN0b3J5XG4gICAgICAgICAgYXdhaXQgdGhpcy5ta2Rpcih7XG4gICAgICAgICAgICBwYXRoOiB0byxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogdG9EaXJlY3RvcnksXG4gICAgICAgICAgICByZWN1cnNpdmU6IGZhbHNlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gQ29weSB0aGUgbXRpbWUvY3RpbWUgb2YgYSByZW5hbWVkIGRpcmVjdG9yeVxuICAgICAgICAgIGlmIChkb1JlbmFtZSkge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlVGltZSh0bywgY3RpbWUsIGZyb21PYmoubXRpbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBjb250ZW50cyBvZiB0aGUgZnJvbSBsb2NhdGlvblxuICAgICAgICBjb25zdCBjb250ZW50cyA9IChcbiAgICAgICAgICBhd2FpdCB0aGlzLnJlYWRkaXIoe1xuICAgICAgICAgICAgcGF0aDogZnJvbSxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogZnJvbURpcmVjdG9yeSxcbiAgICAgICAgICB9KVxuICAgICAgICApLmZpbGVzO1xuXG4gICAgICAgIGZvciAoY29uc3QgZmlsZW5hbWUgb2YgY29udGVudHMpIHtcbiAgICAgICAgICAvLyBNb3ZlIGl0ZW0gZnJvbSB0aGUgZnJvbSBkaXJlY3RvcnkgdG8gdGhlIHRvIGRpcmVjdG9yeVxuICAgICAgICAgIGF3YWl0IHRoaXMuX2NvcHkoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZyb206IGAke2Zyb219LyR7ZmlsZW5hbWUubmFtZX1gLFxuICAgICAgICAgICAgICB0bzogYCR7dG99LyR7ZmlsZW5hbWUubmFtZX1gLFxuICAgICAgICAgICAgICBkaXJlY3Rvcnk6IGZyb21EaXJlY3RvcnksXG4gICAgICAgICAgICAgIHRvRGlyZWN0b3J5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvUmVuYW1lLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcHRpb25hbGx5IHJlbW92ZSB0aGUgb3JpZ2luYWwgZnJvbSBkaXJlY3RvcnlcbiAgICAgICAgaWYgKGRvUmVuYW1lKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5ybWRpcih7XG4gICAgICAgICAgICBwYXRoOiBmcm9tLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBmcm9tRGlyZWN0b3J5LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB1cmk6IHRvUGF0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgYSBodHRwIHJlcXVlc3QgdG8gYSBzZXJ2ZXIgYW5kIGRvd25sb2FkcyB0aGUgZmlsZSB0byB0aGUgc3BlY2lmaWVkIGRlc3RpbmF0aW9uXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgQGNhcGFjaXRvci9maWxlLXRyYW5zZmVyIHBsdWdpbiBpbnN0ZWFkLlxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhlIGRvd25sb2FkIG9wZXJhdGlvblxuICAgKiBAcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBkb3dubG9hZCBmaWxlIHJlc3VsdFxuICAgKi9cbiAgcHVibGljIGRvd25sb2FkRmlsZSA9IGFzeW5jIChvcHRpb25zOiBEb3dubG9hZEZpbGVPcHRpb25zKTogUHJvbWlzZTxEb3dubG9hZEZpbGVSZXN1bHQ+ID0+IHtcbiAgICBjb25zdCByZXF1ZXN0SW5pdCA9IGJ1aWxkUmVxdWVzdEluaXQob3B0aW9ucywgb3B0aW9ucy53ZWJGZXRjaEV4dHJhKTtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKG9wdGlvbnMudXJsLCByZXF1ZXN0SW5pdCk7XG4gICAgbGV0IGJsb2I6IEJsb2I7XG5cbiAgICBpZiAoIW9wdGlvbnMucHJvZ3Jlc3MpIGJsb2IgPSBhd2FpdCByZXNwb25zZS5ibG9iKCk7XG4gICAgZWxzZSBpZiAoIXJlc3BvbnNlPy5ib2R5KSBibG9iID0gbmV3IEJsb2IoKTtcbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IHJlc3BvbnNlLmJvZHkuZ2V0UmVhZGVyKCk7XG5cbiAgICAgIGxldCBieXRlcyA9IDA7XG4gICAgICBjb25zdCBjaHVua3M6IChVaW50OEFycmF5IHwgdW5kZWZpbmVkKVtdID0gW107XG5cbiAgICAgIGNvbnN0IGNvbnRlbnRUeXBlOiBzdHJpbmcgfCBudWxsID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpO1xuICAgICAgY29uc3QgY29udGVudExlbmd0aDogbnVtYmVyID0gcGFyc2VJbnQocmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtbGVuZ3RoJykgfHwgJzAnLCAxMCk7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IHsgZG9uZSwgdmFsdWUgfSA9IGF3YWl0IHJlYWRlci5yZWFkKCk7XG5cbiAgICAgICAgaWYgKGRvbmUpIGJyZWFrO1xuXG4gICAgICAgIGNodW5rcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgYnl0ZXMgKz0gdmFsdWU/Lmxlbmd0aCB8fCAwO1xuXG4gICAgICAgIGNvbnN0IHN0YXR1czogUHJvZ3Jlc3NTdGF0dXMgPSB7XG4gICAgICAgICAgdXJsOiBvcHRpb25zLnVybCxcbiAgICAgICAgICBieXRlcyxcbiAgICAgICAgICBjb250ZW50TGVuZ3RoLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubm90aWZ5TGlzdGVuZXJzKCdwcm9ncmVzcycsIHN0YXR1cyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFsbENodW5rcyA9IG5ldyBVaW50OEFycmF5KGJ5dGVzKTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgICBmb3IgKGNvbnN0IGNodW5rIG9mIGNodW5rcykge1xuICAgICAgICBpZiAodHlwZW9mIGNodW5rID09PSAndW5kZWZpbmVkJykgY29udGludWU7XG5cbiAgICAgICAgYWxsQ2h1bmtzLnNldChjaHVuaywgcG9zaXRpb24pO1xuICAgICAgICBwb3NpdGlvbiArPSBjaHVuay5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGJsb2IgPSBuZXcgQmxvYihbYWxsQ2h1bmtzLmJ1ZmZlcl0sIHsgdHlwZTogY29udGVudFR5cGUgfHwgdW5kZWZpbmVkIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMud3JpdGVGaWxlKHtcbiAgICAgIHBhdGg6IG9wdGlvbnMucGF0aCxcbiAgICAgIGRpcmVjdG9yeTogb3B0aW9ucy5kaXJlY3RvcnkgPz8gdW5kZWZpbmVkLFxuICAgICAgcmVjdXJzaXZlOiBvcHRpb25zLnJlY3Vyc2l2ZSA/PyBmYWxzZSxcbiAgICAgIGRhdGE6IGJsb2IsXG4gICAgfSk7XG5cbiAgICByZXR1cm4geyBwYXRoOiByZXN1bHQudXJpLCBibG9iIH07XG4gIH07XG5cbiAgcHJpdmF0ZSBpc0Jhc2U2NFN0cmluZyhzdHI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYnRvYShhdG9iKHN0cikpID09IHN0cjtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxuaW50ZXJmYWNlIEVudHJ5T2JqIHtcbiAgcGF0aDogc3RyaW5nO1xuICBmb2xkZXI6IHN0cmluZztcbiAgdHlwZTogJ2RpcmVjdG9yeScgfCAnZmlsZSc7XG4gIHNpemU6IG51bWJlcjtcbiAgY3RpbWU6IG51bWJlcjtcbiAgbXRpbWU6IG51bWJlcjtcbiAgdXJpPzogc3RyaW5nO1xuICBjb250ZW50Pzogc3RyaW5nIHwgQmxvYjtcbn1cbiIsICJpbXBvcnQgeyBXZWJQbHVnaW4gfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuXG5pbXBvcnQgdHlwZSB7IEJyb3dzZXJQbHVnaW4sIE9wZW5PcHRpb25zIH0gZnJvbSAnLi9kZWZpbml0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBCcm93c2VyV2ViIGV4dGVuZHMgV2ViUGx1Z2luIGltcGxlbWVudHMgQnJvd3NlclBsdWdpbiB7XG4gIF9sYXN0V2luZG93OiBXaW5kb3cgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fbGFzdFdpbmRvdyA9IG51bGw7XG4gIH1cblxuICBhc3luYyBvcGVuKG9wdGlvbnM6IE9wZW5PcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5fbGFzdFdpbmRvdyA9IHdpbmRvdy5vcGVuKG9wdGlvbnMudXJsLCBvcHRpb25zLndpbmRvd05hbWUgfHwgJ19ibGFuaycpO1xuICB9XG5cbiAgYXN5bmMgY2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0aGlzLl9sYXN0V2luZG93ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fbGFzdFdpbmRvdy5jbG9zZSgpO1xuICAgICAgICB0aGlzLl9sYXN0V2luZG93ID0gbnVsbDtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KCdObyBhY3RpdmUgd2luZG93IHRvIGNsb3NlIScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IEJyb3dzZXIgPSBuZXcgQnJvd3NlcldlYigpO1xuXG5leHBvcnQgeyBCcm93c2VyIH07XG4iLCAiLy8gJ3BhdGgnIG1vZHVsZSBleHRyYWN0ZWQgZnJvbSBOb2RlLmpzIHY4LjExLjEgKG9ubHkgdGhlIHBvc2l4IHBhcnQpXG4vLyB0cmFuc3BsaXRlZCB3aXRoIEJhYmVsXG5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2VydFBhdGgocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGF0aCBtdXN0IGJlIGEgc3RyaW5nLiBSZWNlaXZlZCAnICsgSlNPTi5zdHJpbmdpZnkocGF0aCkpO1xuICB9XG59XG5cbi8vIFJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCB3aXRoIGRpcmVjdG9yeSBuYW1lc1xuZnVuY3Rpb24gbm9ybWFsaXplU3RyaW5nUG9zaXgocGF0aCwgYWxsb3dBYm92ZVJvb3QpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICB2YXIgbGFzdFNlZ21lbnRMZW5ndGggPSAwO1xuICB2YXIgbGFzdFNsYXNoID0gLTE7XG4gIHZhciBkb3RzID0gMDtcbiAgdmFyIGNvZGU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDw9IHBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoaSA8IHBhdGgubGVuZ3RoKVxuICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICBlbHNlIGlmIChjb2RlID09PSA0NyAvKi8qLylcbiAgICAgIGJyZWFrO1xuICAgIGVsc2VcbiAgICAgIGNvZGUgPSA0NyAvKi8qLztcbiAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgIGlmIChsYXN0U2xhc2ggPT09IGkgLSAxIHx8IGRvdHMgPT09IDEpIHtcbiAgICAgICAgLy8gTk9PUFxuICAgICAgfSBlbHNlIGlmIChsYXN0U2xhc2ggIT09IGkgLSAxICYmIGRvdHMgPT09IDIpIHtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPCAyIHx8IGxhc3RTZWdtZW50TGVuZ3RoICE9PSAyIHx8IHJlcy5jaGFyQ29kZUF0KHJlcy5sZW5ndGggLSAxKSAhPT0gNDYgLyouKi8gfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDIpICE9PSA0NiAvKi4qLykge1xuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdmFyIGxhc3RTbGFzaEluZGV4ID0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICAgICAgICBpZiAobGFzdFNsYXNoSW5kZXggIT09IHJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXMgPSAnJztcbiAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzID0gcmVzLnNsaWNlKDAsIGxhc3RTbGFzaEluZGV4KTtcbiAgICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IHJlcy5sZW5ndGggLSAxIC0gcmVzLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGFzdFNsYXNoID0gaTtcbiAgICAgICAgICAgICAgZG90cyA9IDA7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMiB8fCByZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXMgPSAnJztcbiAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICBkb3RzID0gMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXMgKz0gJy8uLic7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzID0gJy4uJztcbiAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMClcbiAgICAgICAgICByZXMgKz0gJy8nICsgcGF0aC5zbGljZShsYXN0U2xhc2ggKyAxLCBpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlcyA9IHBhdGguc2xpY2UobGFzdFNsYXNoICsgMSwgaSk7XG4gICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gaSAtIGxhc3RTbGFzaCAtIDE7XG4gICAgICB9XG4gICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgZG90cyA9IDA7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSA0NiAvKi4qLyAmJiBkb3RzICE9PSAtMSkge1xuICAgICAgKytkb3RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb3RzID0gLTE7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIF9mb3JtYXQoc2VwLCBwYXRoT2JqZWN0KSB7XG4gIHZhciBkaXIgPSBwYXRoT2JqZWN0LmRpciB8fCBwYXRoT2JqZWN0LnJvb3Q7XG4gIHZhciBiYXNlID0gcGF0aE9iamVjdC5iYXNlIHx8IChwYXRoT2JqZWN0Lm5hbWUgfHwgJycpICsgKHBhdGhPYmplY3QuZXh0IHx8ICcnKTtcbiAgaWYgKCFkaXIpIHtcbiAgICByZXR1cm4gYmFzZTtcbiAgfVxuICBpZiAoZGlyID09PSBwYXRoT2JqZWN0LnJvb3QpIHtcbiAgICByZXR1cm4gZGlyICsgYmFzZTtcbiAgfVxuICByZXR1cm4gZGlyICsgc2VwICsgYmFzZTtcbn1cblxudmFyIHBvc2l4ID0ge1xuICAvLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoKSB7XG4gICAgdmFyIHJlc29sdmVkUGF0aCA9ICcnO1xuICAgIHZhciByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG4gICAgdmFyIGN3ZDtcblxuICAgIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgICB2YXIgcGF0aDtcbiAgICAgIGlmIChpID49IDApXG4gICAgICAgIHBhdGggPSBhcmd1bWVudHNbaV07XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKGN3ZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIGN3ZCA9IHByb2Nlc3MuY3dkKCk7XG4gICAgICAgIHBhdGggPSBjd2Q7XG4gICAgICB9XG5cbiAgICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICAgIC8vIFNraXAgZW1wdHkgZW50cmllc1xuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gICAgfVxuXG4gICAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAgIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplU3RyaW5nUG9zaXgocmVzb2x2ZWRQYXRoLCAhcmVzb2x2ZWRBYnNvbHV0ZSk7XG5cbiAgICBpZiAocmVzb2x2ZWRBYnNvbHV0ZSkge1xuICAgICAgaWYgKHJlc29sdmVkUGF0aC5sZW5ndGggPiAwKVxuICAgICAgICByZXR1cm4gJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJy8nO1xuICAgIH0gZWxzZSBpZiAocmVzb2x2ZWRQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiByZXNvbHZlZFBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnLic7XG4gICAgfVxuICB9LFxuXG4gIG5vcm1hbGl6ZTogZnVuY3Rpb24gbm9ybWFsaXplKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xuXG4gICAgdmFyIGlzQWJzb2x1dGUgPSBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IDQ3IC8qLyovO1xuICAgIHZhciB0cmFpbGluZ1NlcGFyYXRvciA9IHBhdGguY2hhckNvZGVBdChwYXRoLmxlbmd0aCAtIDEpID09PSA0NyAvKi8qLztcblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICAgIHBhdGggPSBub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoLCAhaXNBYnNvbHV0ZSk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDAgJiYgIWlzQWJzb2x1dGUpIHBhdGggPSAnLic7XG4gICAgaWYgKHBhdGgubGVuZ3RoID4gMCAmJiB0cmFpbGluZ1NlcGFyYXRvcikgcGF0aCArPSAnLyc7XG5cbiAgICBpZiAoaXNBYnNvbHV0ZSkgcmV0dXJuICcvJyArIHBhdGg7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0sXG5cbiAgaXNBYnNvbHV0ZTogZnVuY3Rpb24gaXNBYnNvbHV0ZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICByZXR1cm4gcGF0aC5sZW5ndGggPiAwICYmIHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gIH0sXG5cbiAgam9pbjogZnVuY3Rpb24gam9pbigpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiAnLic7XG4gICAgdmFyIGpvaW5lZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGFzc2VydFBhdGgoYXJnKTtcbiAgICAgIGlmIChhcmcubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoam9pbmVkID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgam9pbmVkID0gYXJnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgam9pbmVkICs9ICcvJyArIGFyZztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGpvaW5lZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuICcuJztcbiAgICByZXR1cm4gcG9zaXgubm9ybWFsaXplKGpvaW5lZCk7XG4gIH0sXG5cbiAgcmVsYXRpdmU6IGZ1bmN0aW9uIHJlbGF0aXZlKGZyb20sIHRvKSB7XG4gICAgYXNzZXJ0UGF0aChmcm9tKTtcbiAgICBhc3NlcnRQYXRoKHRvKTtcblxuICAgIGlmIChmcm9tID09PSB0bykgcmV0dXJuICcnO1xuXG4gICAgZnJvbSA9IHBvc2l4LnJlc29sdmUoZnJvbSk7XG4gICAgdG8gPSBwb3NpeC5yZXNvbHZlKHRvKTtcblxuICAgIGlmIChmcm9tID09PSB0bykgcmV0dXJuICcnO1xuXG4gICAgLy8gVHJpbSBhbnkgbGVhZGluZyBiYWNrc2xhc2hlc1xuICAgIHZhciBmcm9tU3RhcnQgPSAxO1xuICAgIGZvciAoOyBmcm9tU3RhcnQgPCBmcm9tLmxlbmd0aDsgKytmcm9tU3RhcnQpIHtcbiAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0KSAhPT0gNDcgLyovKi8pXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgZnJvbUVuZCA9IGZyb20ubGVuZ3RoO1xuICAgIHZhciBmcm9tTGVuID0gZnJvbUVuZCAtIGZyb21TdGFydDtcblxuICAgIC8vIFRyaW0gYW55IGxlYWRpbmcgYmFja3NsYXNoZXNcbiAgICB2YXIgdG9TdGFydCA9IDE7XG4gICAgZm9yICg7IHRvU3RhcnQgPCB0by5sZW5ndGg7ICsrdG9TdGFydCkge1xuICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCkgIT09IDQ3IC8qLyovKVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdmFyIHRvRW5kID0gdG8ubGVuZ3RoO1xuICAgIHZhciB0b0xlbiA9IHRvRW5kIC0gdG9TdGFydDtcblxuICAgIC8vIENvbXBhcmUgcGF0aHMgdG8gZmluZCB0aGUgbG9uZ2VzdCBjb21tb24gcGF0aCBmcm9tIHJvb3RcbiAgICB2YXIgbGVuZ3RoID0gZnJvbUxlbiA8IHRvTGVuID8gZnJvbUxlbiA6IHRvTGVuO1xuICAgIHZhciBsYXN0Q29tbW9uU2VwID0gLTE7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAoOyBpIDw9IGxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoaSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGlmICh0b0xlbiA+IGxlbmd0aCkge1xuICAgICAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQgKyBpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGBmcm9tYCBpcyB0aGUgZXhhY3QgYmFzZSBwYXRoIGZvciBgdG9gLlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28vYmFyJzsgdG89Jy9mb28vYmFyL2JheidcbiAgICAgICAgICAgIHJldHVybiB0by5zbGljZSh0b1N0YXJ0ICsgaSArIDEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYGZyb21gIGlzIHRoZSByb290XG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nLyc7IHRvPScvZm9vJ1xuICAgICAgICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQgKyBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZnJvbUxlbiA+IGxlbmd0aCkge1xuICAgICAgICAgIGlmIChmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0ICsgaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgdG9gIGlzIHRoZSBleGFjdCBiYXNlIHBhdGggZm9yIGBmcm9tYC5cbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvZm9vL2Jhci9iYXonOyB0bz0nL2Zvby9iYXInXG4gICAgICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGB0b2AgaXMgdGhlIHJvb3QuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvbyc7IHRvPScvJ1xuICAgICAgICAgICAgbGFzdENvbW1vblNlcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdmFyIGZyb21Db2RlID0gZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCArIGkpO1xuICAgICAgdmFyIHRvQ29kZSA9IHRvLmNoYXJDb2RlQXQodG9TdGFydCArIGkpO1xuICAgICAgaWYgKGZyb21Db2RlICE9PSB0b0NvZGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgZWxzZSBpZiAoZnJvbUNvZGUgPT09IDQ3IC8qLyovKVxuICAgICAgICBsYXN0Q29tbW9uU2VwID0gaTtcbiAgICB9XG5cbiAgICB2YXIgb3V0ID0gJyc7XG4gICAgLy8gR2VuZXJhdGUgdGhlIHJlbGF0aXZlIHBhdGggYmFzZWQgb24gdGhlIHBhdGggZGlmZmVyZW5jZSBiZXR3ZWVuIGB0b2BcbiAgICAvLyBhbmQgYGZyb21gXG4gICAgZm9yIChpID0gZnJvbVN0YXJ0ICsgbGFzdENvbW1vblNlcCArIDE7IGkgPD0gZnJvbUVuZDsgKytpKSB7XG4gICAgICBpZiAoaSA9PT0gZnJvbUVuZCB8fCBmcm9tLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIGlmIChvdXQubGVuZ3RoID09PSAwKVxuICAgICAgICAgIG91dCArPSAnLi4nO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgb3V0ICs9ICcvLi4nO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExhc3RseSwgYXBwZW5kIHRoZSByZXN0IG9mIHRoZSBkZXN0aW5hdGlvbiAoYHRvYCkgcGF0aCB0aGF0IGNvbWVzIGFmdGVyXG4gICAgLy8gdGhlIGNvbW1vbiBwYXRoIHBhcnRzXG4gICAgaWYgKG91dC5sZW5ndGggPiAwKVxuICAgICAgcmV0dXJuIG91dCArIHRvLnNsaWNlKHRvU3RhcnQgKyBsYXN0Q29tbW9uU2VwKTtcbiAgICBlbHNlIHtcbiAgICAgIHRvU3RhcnQgKz0gbGFzdENvbW1vblNlcDtcbiAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQpID09PSA0NyAvKi8qLylcbiAgICAgICAgKyt0b1N0YXJ0O1xuICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQpO1xuICAgIH1cbiAgfSxcblxuICBfbWFrZUxvbmc6IGZ1bmN0aW9uIF9tYWtlTG9uZyhwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH0sXG5cbiAgZGlybmFtZTogZnVuY3Rpb24gZGlybmFtZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoMCk7XG4gICAgdmFyIGhhc1Jvb3QgPSBjb2RlID09PSA0NyAvKi8qLztcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAxOyAtLWkpIHtcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3JcbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiBoYXNSb290ID8gJy8nIDogJy4nO1xuICAgIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkgcmV0dXJuICcvLyc7XG4gICAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcbiAgfSxcblxuICBiYXNlbmFtZTogZnVuY3Rpb24gYmFzZW5hbWUocGF0aCwgZXh0KSB7XG4gICAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBleHQgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImV4dFwiIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoZXh0ICE9PSB1bmRlZmluZWQgJiYgZXh0Lmxlbmd0aCA+IDAgJiYgZXh0Lmxlbmd0aCA8PSBwYXRoLmxlbmd0aCkge1xuICAgICAgaWYgKGV4dC5sZW5ndGggPT09IHBhdGgubGVuZ3RoICYmIGV4dCA9PT0gcGF0aCkgcmV0dXJuICcnO1xuICAgICAgdmFyIGV4dElkeCA9IGV4dC5sZW5ndGggLSAxO1xuICAgICAgdmFyIGZpcnN0Tm9uU2xhc2hFbmQgPSAtMTtcbiAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZmlyc3ROb25TbGFzaEVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCByZW1lbWJlciB0aGlzIGluZGV4IGluIGNhc2VcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgaXQgaWYgdGhlIGV4dGVuc2lvbiBlbmRzIHVwIG5vdCBtYXRjaGluZ1xuICAgICAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgICAgICBmaXJzdE5vblNsYXNoRW5kID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChleHRJZHggPj0gMCkge1xuICAgICAgICAgICAgLy8gVHJ5IHRvIG1hdGNoIHRoZSBleHBsaWNpdCBleHRlbnNpb25cbiAgICAgICAgICAgIGlmIChjb2RlID09PSBleHQuY2hhckNvZGVBdChleHRJZHgpKSB7XG4gICAgICAgICAgICAgIGlmICgtLWV4dElkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBtYXRjaGVkIHRoZSBleHRlbnNpb24sIHNvIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91ciBwYXRoXG4gICAgICAgICAgICAgICAgLy8gY29tcG9uZW50XG4gICAgICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gRXh0ZW5zaW9uIGRvZXMgbm90IG1hdGNoLCBzbyBvdXIgcmVzdWx0IGlzIHRoZSBlbnRpcmUgcGF0aFxuICAgICAgICAgICAgICAvLyBjb21wb25lbnRcbiAgICAgICAgICAgICAgZXh0SWR4ID0gLTE7XG4gICAgICAgICAgICAgIGVuZCA9IGZpcnN0Tm9uU2xhc2hFbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGFydCA9PT0gZW5kKSBlbmQgPSBmaXJzdE5vblNsYXNoRW5kO2Vsc2UgaWYgKGVuZCA9PT0gLTEpIGVuZCA9IHBhdGgubGVuZ3RoO1xuICAgICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgaWYgKHBhdGguY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgICAgICAvLyBwYXRoIGNvbXBvbmVudFxuICAgICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmQgPT09IC0xKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbiAgICB9XG4gIH0sXG5cbiAgZXh0bmFtZTogZnVuY3Rpb24gZXh0bmFtZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcbiAgICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgLy8gVHJhY2sgdGhlIHN0YXRlIG9mIGNoYXJhY3RlcnMgKGlmIGFueSkgd2Ugc2VlIGJlZm9yZSBvdXIgZmlyc3QgZG90IGFuZFxuICAgIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gICAgdmFyIHByZURvdFN0YXRlID0gMDtcbiAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAvLyBleHRlbnNpb25cbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSlcbiAgICAgICAgICAgIHN0YXJ0RG90ID0gaTtcbiAgICAgICAgICBlbHNlIGlmIChwcmVEb3RTdGF0ZSAhPT0gMSlcbiAgICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XG4gICAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICAgICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnREb3QsIGVuZCk7XG4gIH0sXG5cbiAgZm9ybWF0OiBmdW5jdGlvbiBmb3JtYXQocGF0aE9iamVjdCkge1xuICAgIGlmIChwYXRoT2JqZWN0ID09PSBudWxsIHx8IHR5cGVvZiBwYXRoT2JqZWN0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwicGF0aE9iamVjdFwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBwYXRoT2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIF9mb3JtYXQoJy8nLCBwYXRoT2JqZWN0KTtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24gcGFyc2UocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICB2YXIgcmV0ID0geyByb290OiAnJywgZGlyOiAnJywgYmFzZTogJycsIGV4dDogJycsIG5hbWU6ICcnIH07XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gcmV0O1xuICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICAgIHZhciBpc0Fic29sdXRlID0gY29kZSA9PT0gNDcgLyovKi87XG4gICAgdmFyIHN0YXJ0O1xuICAgIGlmIChpc0Fic29sdXRlKSB7XG4gICAgICByZXQucm9vdCA9ICcvJztcbiAgICAgIHN0YXJ0ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgICB2YXIgZW5kID0gLTE7XG4gICAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gICAgdmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7XG5cbiAgICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gICAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcbiAgICB2YXIgcHJlRG90U3RhdGUgPSAwO1xuXG4gICAgLy8gR2V0IG5vbi1kaXIgaW5mb1xuICAgIGZvciAoOyBpID49IHN0YXJ0OyAtLWkpIHtcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAvLyBleHRlbnNpb25cbiAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgIGVuZCA9IGkgKyAxO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSkgc3RhcnREb3QgPSBpO2Vsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKSBwcmVEb3RTdGF0ZSA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxuICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgICAgaWYgKGVuZCAhPT0gLTEpIHtcbiAgICAgICAgaWYgKHN0YXJ0UGFydCA9PT0gMCAmJiBpc0Fic29sdXRlKSByZXQuYmFzZSA9IHJldC5uYW1lID0gcGF0aC5zbGljZSgxLCBlbmQpO2Vsc2UgcmV0LmJhc2UgPSByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBlbmQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRQYXJ0ID09PSAwICYmIGlzQWJzb2x1dGUpIHtcbiAgICAgICAgcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKDEsIHN0YXJ0RG90KTtcbiAgICAgICAgcmV0LmJhc2UgPSBwYXRoLnNsaWNlKDEsIGVuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQubmFtZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBzdGFydERvdCk7XG4gICAgICAgIHJldC5iYXNlID0gcGF0aC5zbGljZShzdGFydFBhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgICByZXQuZXh0ID0gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRQYXJ0ID4gMCkgcmV0LmRpciA9IHBhdGguc2xpY2UoMCwgc3RhcnRQYXJ0IC0gMSk7ZWxzZSBpZiAoaXNBYnNvbHV0ZSkgcmV0LmRpciA9ICcvJztcblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgc2VwOiAnLycsXG4gIGRlbGltaXRlcjogJzonLFxuICB3aW4zMjogbnVsbCxcbiAgcG9zaXg6IG51bGxcbn07XG5cbnBvc2l4LnBvc2l4ID0gcG9zaXg7XG5cbm1vZHVsZS5leHBvcnRzID0gcG9zaXg7XG4iLCAiaW1wb3J0IHsgV2ViUGx1Z2luIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcbmltcG9ydCB0eXBlIHsgQ2FwYWNpdG9yRXhjZXB0aW9uIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBDYXBhY2l0b3JOb2RlSlNQbHVnaW4gfSBmcm9tICcuL2ltcGxlbWVudGF0aW9uJztcblxuZXhwb3J0IGNsYXNzIENhcGFjaXRvck5vZGVKU1dlYiBleHRlbmRzIFdlYlBsdWdpbiBpbXBsZW1lbnRzIENhcGFjaXRvck5vZGVKU1BsdWdpbiB7XG4gIHByb3RlY3RlZCB1bmF2YWlsYWJsZU5vZGVKUygpOiBDYXBhY2l0b3JFeGNlcHRpb24ge1xuICAgIHJldHVybiB0aGlzLnVuYXZhaWxhYmxlKCdUaGUgTm9kZUpTIGVuZ2luZSBpcyBub3QgYXZhaWxhYmxlIGluIHRoZSBicm93c2VyIScpO1xuICB9XG5cbiAgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhyb3cgdGhpcy51bmF2YWlsYWJsZU5vZGVKUygpO1xuICB9XG5cbiAgc2VuZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aHJvdyB0aGlzLnVuYXZhaWxhYmxlTm9kZUpTKCk7XG4gIH1cblxuICB3aGVuUmVhZHkoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhyb3cgdGhpcy51bmF2YWlsYWJsZU5vZGVKUygpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgSVBsYXRmb3JtIH0gZnJvbSBcIi4vSVBsYXRmb3JtXCI7XG5cbmV4cG9ydCBjbGFzcyBQbGF0Zm9ybU1hbmFnZXIge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBJUGxhdGZvcm07XG5cbiAgICBwdWJsaWMgc3RhdGljIHNldFBsYXRmb3JtKHBsYXRmb3JtOiBJUGxhdGZvcm0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHBsYXRmb3JtO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGN1cnJlbnQoKTogSVBsYXRmb3JtIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQbGF0Zm9ybSBub3QgaW5pdGlhbGl6ZWQuIENhbGwgUGxhdGZvcm1NYW5hZ2VyLnNldFBsYXRmb3JtKCkgZmlyc3QuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyByZWdpc3RlclBsdWdpbiB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5pbXBvcnQgeyBleHBvc2VTeW5hcHNlIH0gZnJvbSAnQGNhcGFjaXRvci9zeW5hcHNlJztcblxuaW1wb3J0IHR5cGUgeyBGaWxlc3lzdGVtUGx1Z2luIH0gZnJvbSAnLi9kZWZpbml0aW9ucyc7XG5cbmNvbnN0IEZpbGVzeXN0ZW0gPSByZWdpc3RlclBsdWdpbjxGaWxlc3lzdGVtUGx1Z2luPignRmlsZXN5c3RlbScsIHtcbiAgd2ViOiAoKSA9PiBpbXBvcnQoJy4vd2ViJykudGhlbigobSkgPT4gbmV3IG0uRmlsZXN5c3RlbVdlYigpKSxcbn0pO1xuXG5leHBvc2VTeW5hcHNlKCk7XG5cbmV4cG9ydCAqIGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuZXhwb3J0IHsgRmlsZXN5c3RlbSB9O1xuIiwgImZ1bmN0aW9uIHModCkge1xuICB0LkNhcGFjaXRvclV0aWxzLlN5bmFwc2UgPSBuZXcgUHJveHkoXG4gICAge30sXG4gICAge1xuICAgICAgZ2V0KGUsIG4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh7fSwge1xuICAgICAgICAgIGdldCh3LCBvKSB7XG4gICAgICAgICAgICByZXR1cm4gKGMsIHAsIHIpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgaSA9IHQuQ2FwYWNpdG9yLlBsdWdpbnNbbl07XG4gICAgICAgICAgICAgIGlmIChpID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICByKG5ldyBFcnJvcihgQ2FwYWNpdG9yIHBsdWdpbiAke259IG5vdCBmb3VuZGApKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpW29dICE9IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHIobmV3IEVycm9yKGBNZXRob2QgJHtvfSBub3QgZm91bmQgaW4gQ2FwYWNpdG9yIHBsdWdpbiAke259YCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBhID0gYXdhaXQgaVtvXShjKTtcbiAgICAgICAgICAgICAgICAgIHAoYSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoYSkge1xuICAgICAgICAgICAgICAgICAgcihhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICApO1xufVxuZnVuY3Rpb24gdSh0KSB7XG4gIHQuQ2FwYWNpdG9yVXRpbHMuU3luYXBzZSA9IG5ldyBQcm94eShcbiAgICB7fSxcbiAgICB7XG4gICAgICBnZXQoZSwgbikge1xuICAgICAgICByZXR1cm4gdC5jb3Jkb3ZhLnBsdWdpbnNbbl07XG4gICAgICB9XG4gICAgfVxuICApO1xufVxuZnVuY3Rpb24gZih0ID0gITEpIHtcbiAgdHlwZW9mIHdpbmRvdyA+IFwidVwiIHx8ICh3aW5kb3cuQ2FwYWNpdG9yVXRpbHMgPSB3aW5kb3cuQ2FwYWNpdG9yVXRpbHMgfHwge30sIHdpbmRvdy5DYXBhY2l0b3IgIT09IHZvaWQgMCAmJiAhdCA/IHMod2luZG93KSA6IHdpbmRvdy5jb3Jkb3ZhICE9PSB2b2lkIDAgJiYgdSh3aW5kb3cpKTtcbn1cbmV4cG9ydCB7XG4gIGYgYXMgZXhwb3NlU3luYXBzZVxufTtcbiIsICJpbXBvcnQgeyByZWdpc3RlclBsdWdpbiB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5cbmltcG9ydCB0eXBlIHsgQnJvd3NlclBsdWdpbiB9IGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuXG5jb25zdCBCcm93c2VyID0gcmVnaXN0ZXJQbHVnaW48QnJvd3NlclBsdWdpbj4oJ0Jyb3dzZXInLCB7XG4gIHdlYjogKCkgPT4gaW1wb3J0KCcuL3dlYicpLnRoZW4oKG0pID0+IG5ldyBtLkJyb3dzZXJXZWIoKSksXG59KTtcblxuZXhwb3J0ICogZnJvbSAnLi9kZWZpbml0aW9ucyc7XG5leHBvcnQgeyBCcm93c2VyIH07XG4iLCAiaW1wb3J0IHsgSVBsYXRmb3JtLCBGaWxlU3RhdCB9IGZyb20gXCIuL0lQbGF0Zm9ybVwiO1xuaW1wb3J0IHsgRmlsZXN5c3RlbSwgRGlyZWN0b3J5LCBFbmNvZGluZyB9IGZyb20gXCJAY2FwYWNpdG9yL2ZpbGVzeXN0ZW1cIjtcbmltcG9ydCB7IEJyb3dzZXIgfSBmcm9tIFwiQGNhcGFjaXRvci9icm93c2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBDYXBhY2l0b3JQbGF0Zm9ybSBpbXBsZW1lbnRzIElQbGF0Zm9ybSB7XG4gICAgaWQ6IFwiY2FwYWNpdG9yXCIgPSBcImNhcGFjaXRvclwiO1xuXG4gICAgYXN5bmMgcmVhZEZpbGUocGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRmlsZXN5c3RlbS5yZWFkRmlsZSh7XG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBEaXJlY3RvcnkuRGF0YSxcbiAgICAgICAgICAgIGVuY29kaW5nOiBFbmNvZGluZy5VVEY4XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmRhdGEgYXMgc3RyaW5nO1xuICAgIH1cblxuICAgIGFzeW5jIHdyaXRlRmlsZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBGaWxlc3lzdGVtLndyaXRlRmlsZSh7XG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgZGF0YTogY29udGVudCxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogRGlyZWN0b3J5LkRhdGEsXG4gICAgICAgICAgICBlbmNvZGluZzogRW5jb2RpbmcuVVRGOFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyByZWFkZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRmlsZXN5c3RlbS5yZWFkZGlyKHtcbiAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IERpcmVjdG9yeS5EYXRhXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBDYXBhY2l0b3IgNC81OiBmaWxlcyBpcyBGaWxlSW5mb1tdLiBuYW1lIGlzIHRoZSBwcm9wZXJ0eS5cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5maWxlcy5tYXAoZiA9PiBmLm5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIGV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEZpbGVzeXN0ZW0uc3RhdCh7XG4gICAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rvcnk6IERpcmVjdG9yeS5EYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHVubGluayhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgRmlsZXN5c3RlbS5kZWxldGVGaWxlKHtcbiAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IERpcmVjdG9yeS5EYXRhXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIG1rZGlyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgRmlsZXN5c3RlbS5ta2Rpcih7XG4gICAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rvcnk6IERpcmVjdG9yeS5EYXRhLFxuICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIElnbm9yZSBlcnJvciBpZiBkaXJlY3RvcnkgYWxyZWFkeSBleGlzdHNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHN0YXQocGF0aDogc3RyaW5nKTogUHJvbWlzZTxGaWxlU3RhdD4ge1xuICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgRmlsZXN5c3RlbS5zdGF0KHtcbiAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IERpcmVjdG9yeS5EYXRhXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXNGaWxlOiBzdGF0LnR5cGUgPT09ICdmaWxlJyxcbiAgICAgICAgICAgIGlzRGlyZWN0b3J5OiBzdGF0LnR5cGUgPT09ICdkaXJlY3RvcnknXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMgb3BlblBhdGgocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib3BlblBhdGggbm90IHN1cHBvcnRlZCBvbiBDYXBhY2l0b3JcIiwgcGF0aCk7XG4gICAgfVxuXG4gICAgYXN5bmMgb3BlbkV4dGVybmFsKHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IEJyb3dzZXIub3Blbih7IHVybCB9KTtcbiAgICB9XG5cbiAgICBnZXRUaGVtZXNQYXRoKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcInRoZW1lc1wiO1xuICAgIH1cblxuICAgIGdldFBsdWdpbnNQYXRoKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcInBsdWdpbnNcIjtcbiAgICB9XG5cbiAgICBnZXRFbmhhbmNlZFBhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLmV4aXN0cyh0aGlzLmdldFRoZW1lc1BhdGgoKSkpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubWtkaXIodGhpcy5nZXRUaGVtZXNQYXRoKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5leGlzdHModGhpcy5nZXRQbHVnaW5zUGF0aCgpKSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5ta2Rpcih0aGlzLmdldFBsdWdpbnNQYXRoKCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwgImltcG9ydCB7IGRpYWxvZywgQnJvd3NlcldpbmRvdyB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIjtcbmltcG9ydCB7IFNFTEVDVE9SUywgVElNRU9VVFMgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRUb2FzdFRlbXBsYXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvdG9hc3QvdG9hc3RcIjtcblxuY2xhc3MgSGVscGVycyB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEhlbHBlcnM7XG4gICAgcHJpdmF0ZSBtYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgbnVsbCA9IG51bGw7XG4gICAgXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG4gICAgXG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IEhlbHBlcnMge1xuICAgICAgICBpZiAoIUhlbHBlcnMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW5zdGFuY2UgPSBuZXcgSGVscGVycygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBIZWxwZXJzLmluc3RhbmNlO1xuICAgIH1cbiAgICBcbiAgICBzZXRNYWluV2luZG93KG1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tYWluV2luZG93ID0gbWFpbldpbmRvdztcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgc2hvd0FsZXJ0KFxuICAgICAgICBhbGVydFR5cGU6ICdpbmZvJyB8ICd3YXJuaW5nJyB8ICdlcnJvcicsIFxuICAgICAgICB0aXRsZTogc3RyaW5nLCBcbiAgICAgICAgbWVzc2FnZTogc3RyaW5nLCBcbiAgICAgICAgYnV0dG9uczogc3RyaW5nW11cbiAgICApOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBFbGVjdHJvbi5NZXNzYWdlQm94T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHR5cGU6IGFsZXJ0VHlwZSxcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgIGJ1dHRvbnNcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGRpYWxvZy5zaG93TWVzc2FnZUJveCh0aGlzLm1haW5XaW5kb3chLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5yZXNwb25zZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZGlzcGxheWluZyBhbGVydDogJyArIChlcnJvciBhcyBFcnJvcikubWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm4gLTE7IFxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHdhaXRGb3JFbG0oc2VsZWN0b3I6IHN0cmluZywgdGltZW91dDogbnVtYmVyID0gVElNRU9VVFMuRUxFTUVOVF9XQUlUKTogUHJvbWlzZTxFbGVtZW50PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShleGlzdGluZ0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBUaW1lb3V0IHdhaXRpbmcgZm9yIGVsZW1lbnQgd2l0aCBzZWxlY3RvcjogJHtzZWxlY3Rvcn1gKSk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2FpdEZvckVsbUJ5WFBhdGgoeHBhdGg6IHN0cmluZywgdGltZW91dDogbnVtYmVyID0gVElNRU9VVFMuRUxFTUVOVF9XQUlUKTogUHJvbWlzZTxOb2RlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBldmFsdWF0ZVhQYXRoID0gKCk6IE5vZGUgfCBudWxsID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkb2N1bWVudC5ldmFsdWF0ZShcbiAgICAgICAgICAgICAgICAgICAgeHBhdGgsIFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudCwgXG4gICAgICAgICAgICAgICAgICAgIG51bGwsIFxuICAgICAgICAgICAgICAgICAgICBYUGF0aFJlc3VsdC5GSVJTVF9PUkRFUkVEX05PREVfVFlQRSwgXG4gICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQuc2luZ2xlTm9kZVZhbHVlO1xuICAgICAgICAgICAgfTtcbiAgICBcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IGV2YWx1YXRlWFBhdGgoKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShleGlzdGluZ0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gZXZhbHVhdGVYUGF0aCgpO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBUaW1lb3V0IHdhaXRpbmcgZm9yIGVsZW1lbnQgd2l0aCBYUGF0aDogJHt4cGF0aH1gKSk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfSk7XG4gICAgfSAgICBcblxuICAgIHdhaXRGb3JUaXRsZUNoYW5nZSh0aW1lb3V0OiBudW1iZXIgPSBUSU1FT1VUUy5FTEVNRU5UX1dBSVQpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGVhZEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJyk7XG4gICAgICAgICAgICBpZiAoIWhlYWRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ0hlYWQgZWxlbWVudCBub3QgZm91bmQnKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRvY3VtZW50LnRpdGxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGhlYWRFbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1RpbWVvdXQgd2FpdGluZyBmb3IgZG9jdW1lbnQudGl0bGUgdG8gY2hhbmdlJykpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjcmVhdGVUb2FzdCh0b2FzdElkOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBcInN1Y2Nlc3NcIiB8IFwiZmFpbFwiIHwgXCJpbmZvXCIsIHRpbWVvdXRNczpudW1iZXIgPSAzMDAwKSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXdhaXQgZ2V0VG9hc3RUZW1wbGF0ZSh0b2FzdElkLCB0aXRsZSwgbWVzc2FnZSwgc3RhdHVzKTtcbiAgICAgICAgY29uc3QgdG9hc3RDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5UT0FTVF9DT05UQUlORVIpO1xuICAgICAgICBpZih0b2FzdENvbnRhaW5lcikge1xuICAgICAgICAgICAgdG9hc3RDb250YWluZXIuaW5uZXJIVE1MICs9IHRlbXBsYXRlO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b2FzdElkKT8ucmVtb3ZlKCk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0TXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBKYXZhU2NyaXB0IGluIHRoZSBjb250ZXh0IG9mIFN0cmVtaW8ncyBjb3JlIHNlcnZpY2VzXG4gICAgICogQHBhcmFtIGpzIC0gSmF2YVNjcmlwdCBjb2RlIHRvIGV4ZWN1dGVcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHdpdGggdGhlIHJlc3VsdCBvZiB0aGUgZXhlY3V0aW9uXG4gICAgICovXG4gICAgcHVibGljIF9ldmFsKGpzOiBzdHJpbmcpOiBQcm9taXNlPHVua25vd24+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gJ3N0cmVtaW8tZW5oYW5jZWQnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZGF0YTogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKChkYXRhIGFzIEN1c3RvbUV2ZW50KS5kZXRhaWwpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzY3JpcHQuaWQgPSBldmVudE5hbWU7XG4gICAgICAgICAgICAgICAgc2NyaXB0LmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29yZSA9IHdpbmRvdy5zZXJ2aWNlcy5jb3JlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICR7anN9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQudGhlbigoYXdhaXRlZFJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCIke2V2ZW50TmFtZX1cIiwgeyBkZXRhaWw6IGF3YWl0ZWRSZXN1bHQgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCIke2V2ZW50TmFtZX1cIiwgeyBkZXRhaWw6IHJlc3VsdCB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGApLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RWxlbWVudEJ5WHBhdGgocGF0aDogc3RyaW5nKTogTm9kZSB8IG51bGwge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZXZhbHVhdGUoXG4gICAgICAgICAgICBwYXRoLCBcbiAgICAgICAgICAgIGRvY3VtZW50LCBcbiAgICAgICAgICAgIG51bGwsIFxuICAgICAgICAgICAgWFBhdGhSZXN1bHQuRklSU1RfT1JERVJFRF9OT0RFX1RZUEUsIFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICApLnNpbmdsZU5vZGVWYWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RmlsZU5hbWVGcm9tVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcGFydHMgPSB1cmwuc3BsaXQoJy8nKTtcbiAgICAgICAgcmV0dXJuIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdIHx8ICcnO1xuICAgIH1cblxuICAgIHB1YmxpYyBmb3JtYXRUaW1lKHNlY29uZHM6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKChzZWNvbmRzICUgMzYwMCkgLyA2MCk7XG4gICAgICAgIGNvbnN0IHJlbWFpbmluZ1NlY29uZHMgPSBNYXRoLmZsb29yKHNlY29uZHMgJSA2MCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gYCR7U3RyaW5nKGhvdXJzKS5wYWRTdGFydCgyLCAnMCcpfToke1N0cmluZyhtaW51dGVzKS5wYWRTdGFydCgyLCAnMCcpfToke1N0cmluZyhyZW1haW5pbmdTZWNvbmRzKS5wYWRTdGFydCgyLCAnMCcpfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcGFyZSB0d28gc2VtYW50aWMgdmVyc2lvbiBzdHJpbmdzXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB2ZXJzaW9uMSA+IHZlcnNpb24yXG4gICAgICovXG4gICAgcHVibGljIGlzTmV3ZXJWZXJzaW9uKHZlcnNpb24xOiBzdHJpbmcsIHZlcnNpb24yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplID0gKHY6IHN0cmluZyk6IG51bWJlcltdID0+IFxuICAgICAgICAgICAgdi5yZXBsYWNlKC9edi8sICcnKS5zcGxpdCgnLicpLm1hcChuID0+IHBhcnNlSW50KG4sIDEwKSB8fCAwKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHYxUGFydHMgPSBub3JtYWxpemUodmVyc2lvbjEpO1xuICAgICAgICBjb25zdCB2MlBhcnRzID0gbm9ybWFsaXplKHZlcnNpb24yKTtcbiAgICAgICAgY29uc3QgbWF4TGVuZ3RoID0gTWF0aC5tYXgodjFQYXJ0cy5sZW5ndGgsIHYyUGFydHMubGVuZ3RoKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4TGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHYxID0gdjFQYXJ0c1tpXSA/PyAwO1xuICAgICAgICAgICAgY29uc3QgdjIgPSB2MlBhcnRzW2ldID8/IDA7XG4gICAgICAgICAgICBpZiAodjEgPiB2MikgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBpZiAodjEgPCB2MikgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGhlbHBlcnNJbnN0YW5jZSA9IEhlbHBlcnMuZ2V0SW5zdGFuY2UoKTtcblxuZXhwb3J0IGRlZmF1bHQgaGVscGVyc0luc3RhbmNlO1xuIiwgImNsYXNzIEJyb3dzZXJMb2dnZXIge1xuICAgIGluZm8obWVzc2FnZTogc3RyaW5nLCAuLi5tZXRhOiBhbnlbXSkge1xuICAgICAgICBjb25zb2xlLmluZm8oYFtJTkZPXSAke21lc3NhZ2V9YCwgLi4ubWV0YSk7XG4gICAgfVxuICAgIHdhcm4obWVzc2FnZTogc3RyaW5nLCAuLi5tZXRhOiBhbnlbXSkge1xuICAgICAgICBjb25zb2xlLndhcm4oYFtXQVJOXSAke21lc3NhZ2V9YCwgLi4ubWV0YSk7XG4gICAgfVxuICAgIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgLi4ubWV0YTogYW55W10pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgW0VSUk9SXSAke21lc3NhZ2V9YCwgLi4ubWV0YSk7XG4gICAgfVxufVxuXG5jb25zdCBsb2dnZXIgPSBuZXcgQnJvd3NlckxvZ2dlcigpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9nZ2VyKGxhYmVsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbG9nZ2VyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsb2dnZXI7XG4iLCAiLyoqXG4gKiBDZW50cmFsaXplZCBjb25zdGFudHMgZm9yIFN0cmVtaW8gRW5oYW5jZWRcbiAqIFVzaW5nIGNvbnN0YW50cyBpbnN0ZWFkIG9mIG1hZ2ljIHN0cmluZ3MgaW1wcm92ZXMgbWFpbnRhaW5hYmlsaXR5XG4gKi9cblxuLy8gQ1NTIFNlbGVjdG9ycyB1c2VkIHRvIGludGVyYWN0IHdpdGggU3RyZW1pbydzIFVJXG4vLyBOb3RlOiBUaGVzZSBtYXkgbmVlZCB1cGRhdGluZyB3aGVuIFN0cmVtaW8gdXBkYXRlcyB0aGVpciBjbGFzcyBuYW1lc1xuZXhwb3J0IGNvbnN0IFNFTEVDVE9SUyA9IHtcbiAgICBTRUNUSU9OU19DT05UQUlORVI6ICdbY2xhc3NePVwic2VjdGlvbnMtY29udGFpbmVyLVwiXScsXG4gICAgU0VDVElPTjogJ1tjbGFzc149XCJzZWN0aW9uLVwiXScsXG4gICAgQ0FURUdPUlk6ICcuY2F0ZWdvcnktR1AwaEknLFxuICAgIENBVEVHT1JZX0xBQkVMOiAnLmxhYmVsLU5fTzJ2JyxcbiAgICBDQVRFR09SWV9JQ09OOiAnLmljb24tb1pveVYnLFxuICAgIENBVEVHT1JZX0hFQURJTkc6ICcuaGVhZGluZy1YZVBGbCcsXG4gICAgTEFCRUw6ICdbY2xhc3NePVwibGFiZWwtd1hHM2VcIl0nLFxuICAgIE5BVl9NRU5VOiAnLm1lbnUteGVFMDYnLFxuICAgIFNFVFRJTkdTX0NPTlRFTlQ6ICcuc2V0dGluZ3MtY29udGVudC1jbzVlVScsXG4gICAgRU5IQU5DRURfU0VDVElPTjogJyNlbmhhbmNlZCcsXG4gICAgVEhFTUVTX0NBVEVHT1JZOiAnI2VuaGFuY2VkID4gZGl2Om50aC1jaGlsZCgyKScsXG4gICAgUExVR0lOU19DQVRFR09SWTogJyNlbmhhbmNlZCA+IGRpdjpudGgtY2hpbGQoMyknLFxuICAgIEFCT1VUX0NBVEVHT1JZOiAnI2VuaGFuY2VkID4gZGl2Om50aC1jaGlsZCg0KScsXG4gICAgUk9VVEVfQ09OVEFJTkVSOiAnLnJvdXRlLWNvbnRhaW5lcjpsYXN0LWNoaWxkIC5yb3V0ZS1jb250ZW50JyxcbiAgICBNRVRBX0RFVEFJTFNfQ09OVEFJTkVSOiAnLm1ldGFkZXRhaWxzLWNvbnRhaW5lci1LX0RxYScsXG4gICAgREVTQ1JJUFRJT05fQ09OVEFJTkVSOiAnLmRlc2NyaXB0aW9uLWNvbnRhaW5lci15aThpVScsXG4gICAgQURET05TX0xJU1RfQ09OVEFJTkVSOiAnLmFkZG9ucy1saXN0LWNvbnRhaW5lci1PdnIyWicsXG4gICAgQURET05fQ09OVEFJTkVSOiAnLmFkZG9uLWNvbnRhaW5lci1sQzVLTicsXG4gICAgTkFNRV9DT05UQUlORVI6ICcubmFtZS1jb250YWluZXItcUlBZzgnLFxuICAgIERFU0NSSVBUSU9OX0lURU06ICcuZGVzY3JpcHRpb24tY29udGFpbmVyLXY3SmhlJyxcbiAgICBUWVBFU19DT05UQUlORVI6ICcudHlwZXMtY29udGFpbmVyLURhT3JnJyxcbiAgICBTRUFSQ0hfSU5QVVQ6ICcuc2VhcmNoLWlucHV0LWJBZ0FoJyxcbiAgICBIT1JJWk9OVEFMX05BVjogJy5ob3Jpem9udGFsLW5hdi1iYXItY29udGFpbmVyLVlfenZLJyxcbiAgICBUT0FTVF9JVEVNOiAnLnRvYXN0LWl0ZW0tY29udGFpbmVyLW5HMHVrJyxcbiAgICBUT0FTVF9DT05UQUlORVI6ICcudG9hc3RzLWNvbnRhaW5lci1vS0VDeSdcbn0gYXMgY29uc3Q7XG5cbi8vIENTUyBDbGFzc2VzIHVzZWQgZm9yIHN0eWxpbmdcbmV4cG9ydCBjb25zdCBDTEFTU0VTID0ge1xuICAgIE9QVElPTjogJ29wdGlvbi12Rk9BUycsXG4gICAgQ09OVEVOVDogJ2NvbnRlbnQtUDJUMGknLFxuICAgIEJVVFRPTjogJ2J1dHRvbi1ETm1ZTCcsXG4gICAgQlVUVE9OX0NPTlRBSU5FUjogJ2J1dHRvbi1jb250YWluZXItelZMSDYnLFxuICAgIFNFTEVDVEVEOiAnc2VsZWN0ZWQtUzdTZUsnLFxuICAgIElOU1RBTExfQlVUVE9OOiAnaW5zdGFsbC1idXR0b24tY29udGFpbmVyLXlmY3E1JyxcbiAgICBVTklOU1RBTExfQlVUVE9OOiAndW5pbnN0YWxsLWJ1dHRvbi1jb250YWluZXItb1Y0WW8nLFxuICAgIENIRUNLRUQ6ICdjaGVja2VkJyxcbn0gYXMgY29uc3Q7XG5cbi8vIExvY2FsU3RvcmFnZSBrZXlzXG5leHBvcnQgY29uc3QgU1RPUkFHRV9LRVlTID0ge1xuICAgIEVOQUJMRURfUExVR0lOUzogJ2VuYWJsZWRQbHVnaW5zJyxcbiAgICBDVVJSRU5UX1RIRU1FOiAnY3VycmVudFRoZW1lJyxcbiAgICBESVNDT1JEX1JQQzogJ2Rpc2NvcmRyaWNocHJlc2VuY2UnLFxuICAgIENIRUNLX1VQREFURVNfT05fU1RBUlRVUDogJ2NoZWNrRm9yVXBkYXRlc09uU3RhcnR1cCcsXG59IGFzIGNvbnN0O1xuXG4vLyBJUEMgQ2hhbm5lbCBuYW1lcyBmb3IgbWFpbiA8LT4gcmVuZGVyZXIgY29tbXVuaWNhdGlvblxuZXhwb3J0IGNvbnN0IElQQ19DSEFOTkVMUyA9IHtcbiAgICBNSU5JTUlaRV9XSU5ET1c6ICdtaW5pbWl6ZS13aW5kb3cnLFxuICAgIE1BWElNSVpFX1dJTkRPVzogJ21heGltaXplLXdpbmRvdycsXG4gICAgQ0xPU0VfV0lORE9XOiAnY2xvc2Utd2luZG93JyxcbiAgICBTRVRfVFJBTlNQQVJFTkNZOiAnc2V0LXRyYW5zcGFyZW5jeScsXG4gICAgR0VUX1RSQU5TUEFSRU5DWV9TVEFUVVM6ICdnZXQtdHJhbnNwYXJlbmN5LXN0YXR1cycsXG4gICAgVVBEQVRFX0NIRUNLX1NUQVJUVVA6ICd1cGRhdGUtY2hlY2stb24tc3RhcnR1cCcsXG4gICAgVVBEQVRFX0NIRUNLX1VTRVI6ICd1cGRhdGUtY2hlY2stdXNlcnJlcXVlc3QnLFxuICAgIEZVTExTQ1JFRU5fQ0hBTkdFRDogJ2Z1bGxzY3JlZW4tY2hhbmdlZCcsXG4gICAgRVhUUkFDVF9FTUJFRERFRF9TVUJUSVRMRVM6ICdleHRyYWN0LWVtYmVkZGVkLXN1YnRpdGxlcycsXG59IGFzIGNvbnN0O1xuXG4vLyBGaWxlIGV4dGVuc2lvbnMgZm9yIG1vZHNcbmV4cG9ydCBjb25zdCBGSUxFX0VYVEVOU0lPTlMgPSB7XG4gICAgVEhFTUU6ICcudGhlbWUuY3NzJyxcbiAgICBQTFVHSU46ICcucGx1Z2luLmpzJyxcbn0gYXMgY29uc3Q7XG5cbi8vIFVSTHNcbmV4cG9ydCBjb25zdCBVUkxTID0ge1xuICAgIFNUUkVNSU9fV0VCOiAnaHR0cHM6Ly93ZWIuc3RyZW1pby5jb20vJyxcbiAgICBTVFJFTUlPX1dFQl9BRERfQURET046ICdodHRwczovL3dlYi5zdHJlbWlvLmNvbS8jL2FkZG9ucz9hZGRvbj0nLFxuICAgIFJFR0lTVFJZOiAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1JFVkVOR0U5Nzcvc3RyZW1pby1lbmhhbmNlZC1yZWdpc3RyeS9yZWZzL2hlYWRzL21haW4vcmVnaXN0cnkuanNvbicsXG4gICAgVkVSU0lPTl9DSEVDSzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9SRVZFTkdFOTc3L3N0cmVtaW8tZW5oYW5jZWQtY29tbXVuaXR5L3Jhdy9tYWluL3ZlcnNpb24nLFxuICAgIFJFTEVBU0VTX0FQSTogJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvUkVWRU5HRTk3Ny9zdHJlbWlvLWVuaGFuY2VkLWNvbW11bml0eS9yZWxlYXNlcy9sYXRlc3QnLFxuICAgIFJFTEVBU0VTX1BBR0U6ICdodHRwczovL2dpdGh1Yi5jb20vUkVWRU5HRTk3Ny9zdHJlbWlvLWVuaGFuY2VkLWNvbW11bml0eS9yZWxlYXNlcy9sYXRlc3QnLFxuICAgIFNUUkVNSU9fU0VSVklDRV9HSVRIVUJfQVBJOiBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvU3RyZW1pby9zdHJlbWlvLXNlcnZpY2UvcmVsZWFzZXMvbGF0ZXN0XCJcbn0gYXMgY29uc3Q7XG5cbi8vIHNlcnZlci5qcyAoU3RyZW1pbyBzdHJlYW1pbmcgc2VydmVyKSBEb3dubG9hZCBVUkxcbmV4cG9ydCBjb25zdCBTRVJWRVJfSlNfVVJMID0gXCJodHRwczovL2RsLnN0cmVtLmlvL3NlcnZlci92NC4yMC4xMi9kZXNrdG9wL3NlcnZlci5qc1wiO1xuXG4vLyBGRm1wZWcgRG93bmxvYWQgVVJMc1xuZXhwb3J0IGNvbnN0IEZGTVBFR19VUkxTID0ge1xuICAgIHdpbjMyOiB7XG4gICAgICAgIHg2NDogXCJodHRwczovL2dpdGh1Yi5jb20vQnRiTi9GRm1wZWctQnVpbGRzL3JlbGVhc2VzL2Rvd25sb2FkL2xhdGVzdC9mZm1wZWctbWFzdGVyLWxhdGVzdC13aW42NC1ncGwuemlwXCIsXG4gICAgICAgIGFybTY0OiBcImh0dHBzOi8vZ2l0aHViLmNvbS9CdGJOL0ZGbXBlZy1CdWlsZHMvcmVsZWFzZXMvZG93bmxvYWQvbGF0ZXN0L2ZmbXBlZy1tYXN0ZXItbGF0ZXN0LXdpbmFybTY0LWdwbC56aXBcIixcbiAgICB9LFxuICAgIGRhcndpbjoge1xuICAgICAgICB4NjQ6IFwiaHR0cHM6Ly9mZm1wZWcubWFydGluLXJpZWRsLmRlL2Rvd25sb2FkL21hY29zL2FtZDY0LzE3NjY0MzcyOTdfOC4wLjEvZmZtcGVnLnppcFwiLFxuICAgICAgICBhcm02NDogXCJodHRwczovL2ZmbXBlZy5tYXJ0aW4tcmllZGwuZGUvZG93bmxvYWQvbWFjb3MvYXJtNjQvMTc2NjQzMDEzMl84LjAuMS9mZm1wZWcuemlwXCIsXG4gICAgfSxcbiAgICBsaW51eDoge1xuICAgICAgICB4NjQ6IFwiaHR0cHM6Ly9qb2hudmFuc2lja2xlLmNvbS9mZm1wZWcvcmVsZWFzZXMvZmZtcGVnLXJlbGVhc2UtYW1kNjQtc3RhdGljLnRhci54elwiLFxuICAgICAgICBhcm02NDogXCJodHRwczovL2pvaG52YW5zaWNrbGUuY29tL2ZmbXBlZy9yZWxlYXNlcy9mZm1wZWctcmVsZWFzZS1hcm02NC1zdGF0aWMudGFyLnh6XCIsXG4gICAgfSxcbn0gYXMgY29uc3Q7XG5cbi8vIEZGcHJvYmUgRG93bmxvYWQgVVJMcyBmb3IgbWFjT1NcbmV4cG9ydCBjb25zdCBNQUNPU19GRlBST0JFX1VSTFMgPSB7XG4gICAgeDY0OiBcImh0dHBzOi8vZmZtcGVnLm1hcnRpbi1yaWVkbC5kZS9kb3dubG9hZC9tYWNvcy9hbWQ2NC8xNzY2NDM3Mjk3XzguMC4xL2ZmcHJvYmUuemlwXCIsXG4gICAgYXJtNjQ6IFwiaHR0cHM6Ly9mZm1wZWcubWFydGluLXJpZWRsLmRlL2Rvd25sb2FkL21hY29zL2FybTY0LzE3NjY0MzAxMzJfOC4wLjEvZmZwcm9iZS56aXBcIixcbn07XG5cbi8vIERpc2NvcmQgUlBDXG5leHBvcnQgY29uc3QgRElTQ09SRCA9IHtcbiAgICBDTElFTlRfSUQ6ICcxMjAwMTg2NzUwNzI3ODkzMTY0JyxcbiAgICBSRUNPTk5FQ1RfSU5URVJWQUw6IDEwMDAwLFxuICAgIERFRkFVTFRfSU1BR0U6ICcxMDI0c3RyZW1pbycsXG59IGFzIGNvbnN0O1xuXG4vLyBUaW1lb3V0c1xuZXhwb3J0IGNvbnN0IFRJTUVPVVRTID0ge1xuICAgIEVMRU1FTlRfV0FJVDogMTAwMDAsXG4gICAgSU5TVEFMTF9DT01QTEVUSU9OOiAxMjAwMDAsXG4gICAgU0VSVklDRV9DSEVDS19JTlRFUlZBTDogNTAwMCxcbiAgICBTRVJWRVJfUkVMT0FEX0RFTEFZOiAxNTAwLFxuICAgIENPUkVTVEFURV9SRVRSWV9JTlRFUlZBTDogMTAwMCxcbiAgICBDT1JFU1RBVEVfTUFYX1JFVFJJRVM6IDMwLFxufSBhcyBjb25zdDtcbiIsICI8ZGl2IGNsYXNzPVwibmF2LWNvbnRlbnQtY29udGFpbmVyLXpsOWhRXCIgc3R5bGU9XCJ3aWR0aDogOTAlOyBvdmVyZmxvdy15OiBhdXRvO1wiPlxuICAgIDxkaXYgY2xhc3M9XCJhZGRvbnMtY29udGVudC16aEZCbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VsZWN0YWJsZS1pbnB1dHMtY29udGFpbmVyLXRVdWwxXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BhY2luZy13SDF3NVwiPjwvZGl2PlxuICAgICAgICAgICAgPGxhYmVsIHRpdGxlPVwiU2VhcmNoIHRoZW1lcy9wbHVnaW5zXCIgY2xhc3M9XCJzZWFyY2gtYmFyLWs3TVhkIHNlYXJjaC1iYXItY29udGFpbmVyLXA0dFN0XCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IHNpemU9XCIxXCIgYXV0b2NvcnJlY3Q9XCJvZmZcIiBhdXRvY2FwaXRhbGl6ZT1cIm9mZlwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiIHNwZWxsY2hlY2s9XCJmYWxzZVwiIHRhYmluZGV4PVwiMFwiIGNsYXNzPVwic2VhcmNoLWlucHV0LWJBZ0FoIHRleHQtaW5wdXQtaG5MaXpcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoIHRoZW1lcy9wbHVnaW5zXCIgdmFsdWU9XCJcIj5cbiAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvbi1RT1lmSlwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTQ1Ni44ODIgNDE1Ljc5OTk5OTk5OTk5OTdsLTkzLjc5MS04OS40NWMyMi42MDUtMjguNjcgMzQuNzg0LTYzLjU3IDM0LjY4Ni05OS40NCAwLTkxLjU0LTc4LjE0Mi0xNjYuMDctMTc0LjEyNS0xNjYuMDdzLTE3NC4xMjUgNzQuNTMtMTc0LjEyNSAxNjYuMTdjMCA5MS41NCA3OC4xNDIgMTY2LjA3IDE3NC4xMjUgMTY2LjA3IDM3LjU4NiAwIDc0LjE2MS0xMS42MSAxMDQuMjU2LTMzLjA4bDkzLjc5IDg5LjQ1YzMuNTM1IDMuMDQgNy45MSA1LjA1IDEyLjYwNCA1Ljc5IDQuNjk2IDAuNzQgOS41MTUgMC4xOCAxMy44ODctMS42MSA0LjM3NC0xLjc5IDguMTE3LTQuNzQgMTAuNzg4LTguNDkgMi42NzEtMy43NiA0LjE1Ny04LjE3IDQuMjg0LTEyLjcgMC4xMDgtNi4xMS0yLjE2NS0xMi4wNC02LjM3OS0xNi42NG0tMzU3LjYyLTE4OC43OWMtMC4wMS0yOS40MyAxMS40NTMtNTcuOCAzMi4xNjItNzkuNjEgMjAuNzA5LTIxLjgyIDQ5LjE4My0zNS40OSA3OS44ODQtMzguMzkgMzAuNy0yLjkgNjEuNDMzIDUuMiA4Ni4yMjEgMjIuNzIgMjQuNzg3IDE3LjUyIDQxLjg1OCA0My4yIDQ3Ljg5MSA3Mi4wNSA2LjAzNCAyOC44NiAwLjU5OCA1OC44My0xNS4yNDkgODQuMDdzLTQwLjk3MiA0My45Ni03MC40ODkgNTIuNTNjLTI5LjUxOCA4LjU1LTYxLjMxNyA2LjMzLTg5LjIxMy02LjI0cy00OS44OTUtMzQuNTctNjEuNzE4LTYxLjc1Yy02LjI1OC0xNC4zOC05LjQ4My0yOS44MS05LjQ4OC00NS4zOFwiIHN0eWxlPVwiZmlsbDogY3VycmVudGNvbG9yO1wiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnIvPlxuICAgICAgICA8ZGl2IHRhYmluZGV4PVwiMFwiIHRpdGxlPVwiU3VibWl0IHlvdXIgdGhlbWVzIGFuZCBwbHVnaW5zIGhlcmVcIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImxpbmstRnJMMXQgYnV0dG9uLWNvbnRhaW5lci16VkxINlwiPlxuICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9SRVZFTkdFOTc3L3N0cmVtaW8tZW5oYW5jZWQtcmVnaXN0cnlcIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsLVBKdlNKXCIgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+U3VibWl0IHlvdXIgdGhlbWVzIGFuZCBwbHVnaW5zPC9kaXY+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhZGRvbnMtbGlzdC1jb250YWluZXItT3ZyMlpcIiBpZD1cIm1vZHMtbGlzdFwiPlxuICAgICAgICAgICAgXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnIvPlxuICAgIDwvZGl2PlxuPC9kaXY+IiwgIjxicj5cbjxkaXYgdGFiaW5kZXg9XCIwXCIgY2xhc3M9XCJhZGRvbi13aG1kTyBhbmltYXRpb24tZmFkZS1pbiBhZGRvbi1jb250YWluZXItbEM1S04gYnV0dG9uLWNvbnRhaW5lci16VkxINlwiPlxuICAgIDxkaXYgY2xhc3M9XCJsb2dvLWNvbnRhaW5lci1aY1NTQ1wiPlxuICAgICAgICA8IS0tIHRoZW1lIHByZXZpZXcgaGVyZSAtLT5cblxuICAgICAgICA8IS0tIHBsdWdpbiBpY29uIGhlcmUgLS0+XG4gICAgPC9kaXY+XG5cblx0PGRpdiBjbGFzcz1cImluZm8tY29udGFpbmVyLUFkTUI2XCI+XG5cdFx0PGRpdiBjbGFzcz1cIm5hbWUtY29udGFpbmVyLXFJQWc4XCIgdGl0bGU9XCJ7eyBuYW1lIH19XCI+e3sgbmFtZSB9fTwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJ2ZXJzaW9uLWNvbnRhaW5lci16ZFB5TlwiIHRpdGxlPVwie3sgdmVyc2lvbiB9fVwiPnt7IHZlcnNpb24gfX08L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwidHlwZXMtY29udGFpbmVyLURhT3JnXCI+e3sgdHlwZSB9fTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb24tY29udGFpbmVyLXY3SmhlXCI+XG4gICAgICAgICAgICA8Yj5EZXNjcmlwdGlvbjo8L2I+IHt7IGRlc2NyaXB0aW9uIH19XG4gICAgICAgICAgICA8YnI+XG4gICAgICAgICAgICA8Yj5BdXRob3I6PC9iPiB7eyBhdXRob3IgfX1cbiAgICAgICAgPC9kaXY+XG5cdDwvZGl2PlxuXHQ8ZGl2IGNsYXNzPVwiYnV0dG9ucy1jb250YWluZXItZzB4WHJcIj5cblx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uLWJ1dHRvbnMtY29udGFpbmVyLXhNVm16XCI+XG5cdFx0XHQ8ZGl2IHRhYmluZGV4PVwiLTFcIiB0aXRsZT1cInt7IGFjdGlvbmJ0blRpdGxlIH19XCIgY2xhc3M9XCJ7eyBhY3Rpb25idG5DbGFzcyB9fSBidXR0b24tY29udGFpbmVyLXpWTEg2IG1vZEFjdGlvbkJ0blwiIGRhdGEtbGluaz1cInt7IGRvd25sb2FkIH19XCIgZGF0YS10eXBlPVwie3sgdHlwZSB9fVwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwibGFiZWwtT25XaDJcIj57eyBhY3Rpb25idG5UaXRsZSB9fTwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdFx0PGEgaHJlZj1cInt7IHJlcG8gfX1cIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCIgY2xhc3M9XCJzaGFyZS1idXR0b24tY29udGFpbmVyLXMzZ3dQIGJ1dHRvbi1jb250YWluZXItelZMSDZcIj5cblx0XHRcdDxzdmcgY2xhc3M9XCJpY29uLUd4VmJZXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxuXHRcdFx0XHQ8cGF0aCBkPVwiTTEyLDJBMTAsMTAgMCAwLDAgMiwxMkMyLDE2LjQyIDQuODcsMjAuMTcgOC44NCwyMS41QzkuMzQsMjEuNTggOS41LDIxLjI3IDkuNSwyMUM5LjUsMjAuNzcgOS41LDIwLjE0IDkuNSwxOS4zMUM2LjczLDE5LjkxIDYuMTQsMTcuOTcgNi4xNCwxNy45N0M1LjY4LDE2LjgxIDUuMDMsMTYuNSA1LjAzLDE2LjVDNC4xMiwxNS44OCA1LjEsMTUuOSA1LjEsMTUuOUM2LjEsMTUuOTcgNi42MywxNi45MyA2LjYzLDE2LjkzQzcuNSwxOC40NSA4Ljk3LDE4IDkuNTQsMTcuNzZDOS42MywxNy4xMSA5Ljg5LDE2LjY3IDEwLjE3LDE2LjQyQzcuOTUsMTYuMTcgNS42MiwxNS4zMSA1LjYyLDExLjVDNS42MiwxMC4zOSA2LDkuNSA2LjY1LDguNzlDNi41NSw4LjU0IDYuMiw3LjUgNi43NSw2LjE1QzYuNzUsNi4xNSA3LjU5LDUuODggOS41LDcuMTdDMTAuMjksNi45NSAxMS4xNSw2Ljg0IDEyLDYuODRDMTIuODUsNi44NCAxMy43MSw2Ljk1IDE0LjUsNy4xN0MxNi40MSw1Ljg4IDE3LjI1LDYuMTUgMTcuMjUsNi4xNUMxNy44LDcuNSAxNy40NSw4LjU0IDE3LjM1LDguNzlDMTgsOS41IDE4LjM4LDEwLjM5IDE4LjM4LDExLjVDMTguMzgsMTUuMzIgMTYuMDQsMTYuMTYgMTMuODEsMTYuNDFDMTQuMTcsMTYuNzIgMTQuNSwxNy4zMyAxNC41LDE4LjI2QzE0LjUsMTkuNiAxNC41LDIwLjY4IDE0LjUsMjFDMTQuNSwyMS4yNyAxNC42NiwyMS41OSAxNS4xNywyMS41QzE5LjE0LDIwLjE2IDIyLDE2LjQyIDIyLDEyQTEwLDEwIDAgMCwwIDEyLDJaXCIgc3R5bGU9XCJmaWxsOiBjdXJyZW50Y29sb3I7XCIgLz5cblx0XHRcdDwvc3ZnPlxuXHRcdFx0PGRpdiBjbGFzcz1cImxhYmVsLU9uV2gyXCI+T3BlbiByZXBvc2l0b3J5PC9kaXY+XG5cdFx0PC9hPlxuXHQ8L2Rpdj5cbjwvZGl2PlxuIiwgIjxoNCBzdHlsZT1cImNvbG9yOiB3aGl0ZTsgbWFyZ2luLWJvdHRvbTogMXJlbTtcIj5cbiAgICBEZXZlbG9wZWQgQnk6IDxwIHN0eWxlPVwiZGlzcGxheTogaW5saW5lICFpbXBvcnRhbnQ7XCI+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9SRVZFTkdFOTc3XCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9yZWZlcnJlclwiPlJFVkVOR0U5Nzc8L2E+PC9wPlxuICAgIDxici8+XG4gICAgVmVyc2lvbjogdnt7IHZlcnNpb24gfX1cbiAgICA8YnIvPlxuPC9oND5cblxuPGRpdiBjbGFzcz1cIm9wdGlvbi12Rk9BU1wiPlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkaW5nLWRZTUR0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbC1xSTZWaFwiPkNoZWNrIGZvciB1cGRhdGVzIG9uIHN0YXJ0dXA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1QMlQwaVwiPlxuICAgICAgICA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cInRvZ2dsZS1jb250YWluZXItbFpmSFAgYnV0dG9uLWNvbnRhaW5lci16VkxINiB7eyBjaGVja0ZvclVwZGF0ZXNPblN0YXJ0dXAgfX1cIiBpZD1cImNoZWNrRm9yVXBkYXRlc09uU3RhcnR1cFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvZ2dsZS10b09XTVwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwib3B0aW9uLXZGT0FTXCI+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRpbmctZFlNRHRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsLXFJNlZoXCI+RGlzY29yZCBSaWNoIFByZXNlbmNlPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtUDJUMGlcIj5cbiAgICAgICAgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCJ0b2dnbGUtY29udGFpbmVyLWxaZkhQIGJ1dHRvbi1jb250YWluZXItelZMSDYge3sgZGlzY29yZHJpY2hwcmVzZW5jZSB9fVwiIGlkPVwiZGlzY29yZHJpY2hwcmVzZW5jZVwiIHN0eWxlPVwib3V0bGluZTogbm9uZTtcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b2dnbGUtdG9PV01cIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cIm9wdGlvbi12Rk9BU1wiPlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkaW5nLWRZTUR0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbC1xSTZWaFwiPldpbmRvdyB0cmFuc3BhcmVuY3k8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1QMlQwaVwiPlxuICAgICAgICA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cInRvZ2dsZS1jb250YWluZXItbFpmSFAgYnV0dG9uLWNvbnRhaW5lci16VkxINiB7eyBlbmFibGVUcmFuc3BhcmVudFRoZW1lcyB9fVwiIGlkPVwiZW5hYmxlVHJhbnNwYXJlbnRUaGVtZXNcIiBzdHlsZT1cIm91dGxpbmU6IG5vbmU7XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9nZ2xlLXRvT1dNXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxwIHN0eWxlPVwiY29sb3I6Z3JheTtcIj5UaGlzIG9wdGlvbiBoYXMgdG8gYmUgZW5hYmxlZCBmb3IgdGhlbWVzIHRoYXQgc3VwcG9ydCB0cmFuc3BhcmVuY3kgdG8gd29yay4gKGV4cGVyaW1lbnRhbCk8L3A+XG48YnIvPlxuXG48ZGl2IGNsYXNzPVwib3B0aW9uLXZGT0FTXCI+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtUDJUMGlcIj5cbiAgICAgICAgPGRpdiB0YWJpbmRleD1cIjBcIiB0aXRsZT1cIkNvbW11bml0eSBQbHVnaW5zICZhbXA7IFRoZW1lc1wiIGNsYXNzPVwiYnV0dG9uLURObVlMIGJ1dHRvbi1jb250YWluZXItelZMSDYgYnV0dG9uXCIgaWQ9XCJicm93c2VQbHVnaW5zVGhlbWVzQnRuXCI+XG4gICAgICAgICAgICBDb21tdW5pdHkgTWFya2V0cGxhY2VcbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cIm9wdGlvbi12Rk9BU1wiPlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LVAyVDBpXCI+XG4gICAgICAgIDxkaXYgdGFiaW5kZXg9XCIwXCIgdGl0bGU9XCJDaGVjayBGb3IgVXBkYXRlc1wiIGNsYXNzPVwiYnV0dG9uLURObVlMIGJ1dHRvbi1jb250YWluZXItelZMSDYgYnV0dG9uXCIgaWQ9XCJjaGVja2ZvcnVwZGF0ZXNCdG5cIj5cbiAgICAgICAgICAgIENoZWNrIEZvciBVcGRhdGVzXG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxici8+IiwgIjxkaXYgY2xhc3M9XCJvcHRpb24tdkZPQVNcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGluZy1kWU1EdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWwtcUk2VmhcIj5EZWZhdWx0PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtUDJUMGlcIj5cbiAgICAgICAgPGRpdiBcbiAgICAgICAgdGl0bGU9XCJEZWZhdWx0XCIgXG4gICAgICAgIGlkPVwiRGVmYXVsdFwiIFxuICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgb25jbGljaz1cImFwcGx5VGhlbWUoJ0RlZmF1bHQnKVwiXG4gICAgICAgIHN0eWxlPVwiY29sb3I6IHdoaXRlOyBtYXJnaW4tYm90dG9tOiAxcmVtOyB3aWR0aDogbWF4LWNvbnRlbnQ7IGJhY2tncm91bmQtY29sb3I6IHt7IGJhY2tncm91bmRDb2xvciB9fTtcIlxuICAgICAgICBjbGFzcz1cImJ1dHRvbiBidXR0b24tY29udGFpbmVyLXpWTEg2IHt7IGRpc2FibGVkIH19XCJcbiAgICAgICAgPnt7IGxhYmVsIH19PC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cbiIsICI8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXIteFQ5X0wgYmFjay1idXR0b24tY29udGFpbmVyLWxEQjFOIGJ1dHRvbi1jb250YWluZXItelZMSDZcIiBpZD1cImJhY2stYnRuXCI+XG4gICAgPHN2ZyBjbGFzcz1cImljb24tVDhNVTZcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj5cbiAgICAgICAgPHBhdGggZD1cIk0zMjguNjEwMDAwMDAwMDAwNiAxMDYuNDY5bC0xNDMuNTMgMTM2Ljg4OSAxNDMuNTMgMTM2Ljg4OVwiIHN0eWxlPVwic3Ryb2tlOiBjdXJyZW50Y29sb3I7IHN0cm9rZS1saW5lY2FwOiByb3VuZDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsgc3Ryb2tlLXdpZHRoOiA0ODsgZmlsbDogbm9uZTtcIj48L3BhdGg+XG4gICAgPC9zdmc+XG48L2Rpdj4iLCAiPG5hdiBjbGFzcz1cInRpdGxlLWJhclwiPlxuICAgIDxkaXYgY2xhc3M9XCJ0aXRsZS1iYXItYnV0dG9uc1wiPlxuICAgICAgICA8ZGl2IGlkPVwibWluaW1pemVBcHAtYnRuXCIgdGl0bGU9XCJNaW5pbWl6ZVwiIGNsYXNzPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTIwLDE0SDRWMTBIMjBcIiBzdHlsZT1cImZpbGw6d2hpdGU7XCI+PC9wYXRoPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwibWF4aW1pemVBcHAtYnRuXCIgdGl0bGU9XCJNYXhpbWl6ZVwiIGNsYXNzPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMsM0gyMVYyMUgzVjNNNSw1VjE5SDE5VjVINVpcIiBzdHlsZT1cImZpbGw6d2hpdGU7XCI+PC9wYXRoPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwiY2xvc2VBcHAtYnRuXCIgdGl0bGU9XCJDbG9zZVwiIGNsYXNzPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBzdHlsZT1cIndpZHRoOiAyNXB4OyBoZWlnaHQ6IDI1cHg7XCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xOSw2LjQxTDE3LjU5LDVMMTIsMTAuNTlMNi40MSw1TDUsNi40MUwxMC41OSwxMkw1LDE3LjU5TDYuNDEsMTlMMTIsMTMuNDFMMTcuNTksMTlMMTksMTcuNTlMMTMuNDEsMTJMMTksNi40MVpcIiBzdHlsZT1cImZpbGw6d2hpdGU7XCI+PC9wYXRoPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPHN0eWxlPlxuXHRcdGJvZHkgPiAqOm5vdCgudGl0bGUtYmFyKSB7XG5cdFx0XHRwYWRkaW5nLXRvcDogNDBweDsgXG5cdFx0fVxuXG4gICAgICAgIC5idXR0b24ge1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRpdGxlLWJhciB7XG4gICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7IFxuICAgICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICAgICAgei1pbmRleDogOTk5OTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsMC4xNSk7XG4gICAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMjBweCkgc2F0dXJhdGUoMTIwJSk7XG5cdFx0XHQtd2Via2l0LWFwcC1yZWdpb246IGRyYWc7XG4gICAgICAgIH1cblxuICAgICAgICAudGl0bGUtYmFyLWJ1dHRvbnMge1xuICAgICAgICAgICAgLXdlYmtpdC1hcHAtcmVnaW9uOiBuby1kcmFnO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBnYXA6IDIuMHJlbTtcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuXHRcdFx0bWFyZ2luLXJpZ2h0OiAyMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnRpdGxlLWJhci1idXR0b25zIHN2ZyB7XG4gICAgICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgICAgIGhlaWdodDogMjBweDtcbiAgICAgICAgfVxuICAgIDwvc3R5bGU+XG48L25hdj5cbiIsICJpbXBvcnQgbW9kc1RhYiBmcm9tICcuLi9jb21wb25lbnRzL21vZHMtdGFiL21vZHMtdGFiLmh0bWwnO1xuaW1wb3J0IG1vZHNJdGVtIGZyb20gJy4uL2NvbXBvbmVudHMvbW9kcy1pdGVtL21vZHMtaXRlbS5odG1sJztcbmltcG9ydCBhYm91dENhdGVnb3J5IGZyb20gJy4uL2NvbXBvbmVudHMvYWJvdXQtY2F0ZWdvcnkvYWJvdXQtY2F0ZWdvcnkuaHRtbCc7XG5pbXBvcnQgZGVmYXVsdFRoZW1lIGZyb20gJy4uL2NvbXBvbmVudHMvZGVmYXVsdC10aGVtZS9kZWZhdWx0LXRoZW1lLmh0bWwnO1xuaW1wb3J0IGJhY2tCdG4gZnJvbSAnLi4vY29tcG9uZW50cy9iYWNrLWJ0bi9iYWNrLWJ0bi5odG1sJztcbmltcG9ydCB0aXRsZUJhciBmcm9tICcuLi9jb21wb25lbnRzL3RpdGxlLWJhci90aXRsZS1iYXIuaHRtbCc7XG5cbmNvbnN0IHRlbXBsYXRlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAnbW9kcy10YWInOiBtb2RzVGFiLFxuICAgICdtb2RzLWl0ZW0nOiBtb2RzSXRlbSxcbiAgICAnYWJvdXQtY2F0ZWdvcnknOiBhYm91dENhdGVnb3J5LFxuICAgICdkZWZhdWx0LXRoZW1lJzogZGVmYXVsdFRoZW1lLFxuICAgICdiYWNrLWJ0bic6IGJhY2tCdG4sXG4gICAgJ3RpdGxlLWJhcic6IHRpdGxlQmFyLFxufTtcblxuY2xhc3MgVGVtcGxhdGVDYWNoZSB7XG4gICAgcHVibGljIHN0YXRpYyBsb2FkKGRpcjogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAvLyBXZSBpZ25vcmUgZGlyIGluIGJyb3dzZXIgYnVpbGRcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlc1tuYW1lXSB8fCBcIlwiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGVtcGxhdGVDYWNoZTtcbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tIFwiLi4vLi4vdXRpbHMvdGVtcGxhdGVDYWNoZVwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VG9hc3RUZW1wbGF0ZShpZDogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogXCJzdWNjZXNzXCIgfCBcImZhaWxcIiB8IFwiaW5mb1wiKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICd0b2FzdCcpO1xuICAgIGxldCB0b2FzdFN0YXR1cztcblxuICAgIHN3aXRjaChzdGF0dXMpIHtcbiAgICAgICAgY2FzZSBcInN1Y2Nlc3NcIjpcbiAgICAgICAgICAgIHRvYXN0U3RhdHVzID0gXCJzdWNjZXNzLWVJRFRhXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZhaWxcIjpcbiAgICAgICAgICAgIHRvYXN0U3RhdHVzID0gXCJlcnJvci1xdXlPZFwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpbmZvXCI6XG4gICAgICAgICAgICB0b2FzdFN0YXR1cyA9IFwiaW5mby1LRVdxOFwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgICAgICAucmVwbGFjZShcInt7IGlkIH19XCIsIGlkKVxuICAgICAgICAucmVwbGFjZShcInt7IHRpdGxlIH19XCIsIHRpdGxlKVxuICAgICAgICAucmVwbGFjZShcInt7IG1lc3NhZ2UgfX1cIiwgbWVzc2FnZSlcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBzdGF0dXMgfX1cIiwgdG9hc3RTdGF0dXMpO1xufVxuIiwgImltcG9ydCBUZW1wbGF0ZUNhY2hlIGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlQ2FjaGUnO1xuaW1wb3J0IHsgTWV0YURhdGEgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL01ldGFEYXRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBsdWdpbkl0ZW1UZW1wbGF0ZShcbiAgICBmaWxlbmFtZTogc3RyaW5nLCBcbiAgICBtZXRhRGF0YTogTWV0YURhdGEsXG4gICAgY2hlY2tlZDogYm9vbGVhblxuKTogc3RyaW5nIHtcbiAgICBsZXQgdGVtcGxhdGUgPSBUZW1wbGF0ZUNhY2hlLmxvYWQoX19kaXJuYW1lLCAncGx1Z2luLWl0ZW0nKTtcbiAgICBcbiAgICAvLyBSZXBsYWNlIG1ldGFkYXRhIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1ldGFLZXlzID0gWyduYW1lJywgJ2Rlc2NyaXB0aW9uJywgJ2F1dGhvcicsICd2ZXJzaW9uJ10gYXMgY29uc3Q7XG4gICAgbWV0YUtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYHt7XFxcXHMqJHtrZXl9XFxcXHMqfX1gLCAnZycpO1xuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UocmVnZXgsIG1ldGFEYXRhW2tleV0gfHwgJycpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIC5yZXBsYWNlKFwie3sgY2hlY2tlZCB9fVwiLCBjaGVja2VkID8gXCJjaGVja2VkXCIgOiBcIlwiKVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmZpbGVOYW1lXFxzKlxcfVxcfS9nLCBmaWxlbmFtZSk7XG59XG4iLCAiaW1wb3J0IFRlbXBsYXRlQ2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvdGVtcGxhdGVDYWNoZSc7XG5pbXBvcnQgeyBNZXRhRGF0YSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvTWV0YURhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGhlbWVJdGVtVGVtcGxhdGUoXG4gICAgZmlsZW5hbWU6IHN0cmluZywgXG4gICAgbWV0YURhdGE6IE1ldGFEYXRhLFxuICAgIGFwcGxpZWQ6IGJvb2xlYW5cbik6IHN0cmluZyB7XG4gICAgbGV0IHRlbXBsYXRlID0gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ3RoZW1lLWl0ZW0nKTtcbiAgICBcbiAgICAvLyBSZXBsYWNlIG1ldGFkYXRhIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1ldGFLZXlzID0gWyduYW1lJywgJ2Rlc2NyaXB0aW9uJywgJ2F1dGhvcicsICd2ZXJzaW9uJ10gYXMgY29uc3Q7XG4gICAgbWV0YUtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYHt7XFxcXHMqJHtrZXl9XFxcXHMqfX1gLCAnZycpO1xuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UocmVnZXgsIG1ldGFEYXRhW2tleV0gfHwgJycpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIC5yZXBsYWNlKFwie3sgZGlzYWJsZWQgfX1cIiwgYXBwbGllZCA/IFwiZGlzYWJsZWRcIiA6IFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqZmlsZU5hbWVcXHMqXFx9XFx9L2csIGZpbGVuYW1lKVxuICAgICAgICAucmVwbGFjZShcInt7IGxhYmVsIH19XCIsIGFwcGxpZWQgPyBcIkFwcGxpZWRcIiA6IFwiQXBwbHlcIilcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBidXR0b25DbGFzcyB9fVwiLCBhcHBsaWVkID8gXCJ1bmluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci1vVjRZb1wiIDogXCJpbnN0YWxsLWJ1dHRvbi1jb250YWluZXIteWZjcTVcIik7XG59XG4iLCAiaW1wb3J0IFRlbXBsYXRlQ2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvdGVtcGxhdGVDYWNoZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmhhbmNlZE5hdigpOiBzdHJpbmcge1xuICAgIHJldHVybiBUZW1wbGF0ZUNhY2hlLmxvYWQoX19kaXJuYW1lLCAnZW5oYW5jZWQtbmF2Jyk7XG59XG4iLCAiaW1wb3J0IHsgUGxhdGZvcm1NYW5hZ2VyIH0gZnJvbSBcIi4uL3BsYXRmb3JtL1BsYXRmb3JtTWFuYWdlclwiO1xuXG5jbGFzcyBQcm9wZXJ0aWVzIHtcbiAgICBwdWJsaWMgc3RhdGljIHRoZW1lTGlua1NlbGVjdG9yOiBzdHJpbmcgPSBcImhlYWQgPiBsaW5rW3JlbD1zdHlsZXNoZWV0XVwiO1xuXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZW5oYW5jZWRQYXRoKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5nZXRFbmhhbmNlZFBhdGgoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldCB0aGVtZXNQYXRoKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5nZXRUaGVtZXNQYXRoKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXQgcGx1Z2luc1BhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmdldFBsdWdpbnNQYXRoKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc1VzaW5nU3RyZW1pb1NlcnZpY2UgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvcGVydGllcztcbiIsICJleHBvcnQgZnVuY3Rpb24gZ2V0QXBwbHlUaGVtZVRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBcbiAgICBmdW5jdGlvbiBhcHBseVRoZW1lKHRoZW1lKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYXBwbHlpbmcgXCIgKyB0aGVtZSk7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgbmF0aXZlL3ByZWxvYWQgaGFuZGxlciB0byBhY3R1YWxseSBsb2FkIHRoZSBDU1NcbiAgICAgICAgaWYgKHdpbmRvdy5zdHJlbWlvRW5oYW5jZWQgJiYgd2luZG93LnN0cmVtaW9FbmhhbmNlZC5hcHBseVRoZW1lKSB7XG4gICAgICAgICAgICB3aW5kb3cuc3RyZW1pb0VuaGFuY2VkLmFwcGx5VGhlbWUodGhlbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVUkgVXBkYXRlc1xuICAgICAgICBjb25zdCBjdXJyZW50VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImN1cnJlbnRUaGVtZVwiKTtcbiAgICAgICAgaWYgKGN1cnJlbnRUaGVtZSkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFRoZW1lRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGN1cnJlbnRUaGVtZSk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFRoZW1lRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaGVtZSAhPT0gXCJEZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRoZW1lRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwidW5pbnN0YWxsLWJ1dHRvbi1jb250YWluZXItb1Y0WW9cIik7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci15ZmNxNVwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGhlbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcilcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50VGhlbWVFbGVtZW50LmlubmVyVGV4dCA9IFwiQXBwbHlcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VycmVudFRoZW1lXCIsIHRoZW1lKTtcblxuICAgICAgICBjb25zdCBuZXdUaGVtZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGVtZSk7XG4gICAgICAgIGlmIChuZXdUaGVtZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIG5ld1RoZW1lRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG5cbiAgICAgICAgICAgIGlmICh0aGVtZSAhPT0gXCJEZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci15ZmNxNVwiKTtcbiAgICAgICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInVuaW5zdGFsbC1idXR0b24tY29udGFpbmVyLW9WNFlvXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ2YXIoLS1vdmVybGF5LWNvbG9yKVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuaW5uZXJUZXh0ID0gXCJBcHBsaWVkXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYDtcbn1cbiIsICJpbXBvcnQgU2V0dGluZ3MgZnJvbSBcIi4vU2V0dGluZ3NcIjtcbmltcG9ydCB7IFBsYXRmb3JtTWFuYWdlciB9IGZyb20gXCIuLi9wbGF0Zm9ybS9QbGF0Zm9ybU1hbmFnZXJcIjtcbmltcG9ydCBwcm9wZXJ0aWVzIGZyb20gXCIuL1Byb3BlcnRpZXNcIjtcbmltcG9ydCBoZWxwZXJzIGZyb20gXCIuLi91dGlscy9IZWxwZXJzXCI7XG5pbXBvcnQgeyBNZXRhRGF0YSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL01ldGFEYXRhXCI7XG5pbXBvcnQgeyBnZXRMb2dnZXIgfSBmcm9tIFwiLi4vdXRpbHMvbG9nZ2VyXCI7XG5pbXBvcnQgUHJvcGVydGllcyBmcm9tIFwiLi9Qcm9wZXJ0aWVzXCI7XG5pbXBvcnQgeyBnZXRBcHBseVRoZW1lVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9hcHBseS10aGVtZS9hcHBseVRoZW1lXCI7XG5pbXBvcnQgeyBiYXNlbmFtZSwgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBTVE9SQUdFX0tFWVMsIFNFTEVDVE9SUywgQ0xBU1NFUywgVVJMUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCBFeHRyYWN0TWV0YURhdGEgZnJvbSBcIi4uL3V0aWxzL0V4dHJhY3RNZXRhRGF0YVwiO1xuXG5jbGFzcyBNb2RNYW5hZ2VyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBsb2dnZXIgPSBnZXRMb2dnZXIoXCJNb2RNYW5hZ2VyXCIpO1xuICAgIFxuICAgIC8qKlxuICAgICAqIExvYWQgYW5kIGVuYWJsZSBhIHBsdWdpbiBieSBmaWxlbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgbG9hZFBsdWdpbihwbHVnaW5OYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBsdWdpbk5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBQbHVnaW4gJHtwbHVnaW5OYW1lfSBpcyBhbHJlYWR5IGxvYWRlZGApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGx1Z2luUGF0aCA9IGpvaW4ocHJvcGVydGllcy5wbHVnaW5zUGF0aCwgcGx1Z2luTmFtZSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmV4aXN0cyhwbHVnaW5QYXRoKSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYFBsdWdpbiBmaWxlIG5vdCBmb3VuZDogJHtwbHVnaW5QYXRofWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGx1Z2luID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZEZpbGUocGx1Z2luUGF0aCk7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdC5pbm5lckhUTUwgPSBwbHVnaW47XG4gICAgICAgIHNjcmlwdC5pZCA9IHBsdWdpbk5hbWU7XG4gICAgICAgIFxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBlbmFibGVkUGx1Z2luczogc3RyaW5nW10gPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUykgfHwgXCJbXVwiXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWVuYWJsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbk5hbWUpKSB7XG4gICAgICAgICAgICBlbmFibGVkUGx1Z2lucy5wdXNoKHBsdWdpbk5hbWUpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUywgSlNPTi5zdHJpbmdpZnkoZW5hYmxlZFBsdWdpbnMpKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgUGx1Z2luICR7cGx1Z2luTmFtZX0gbG9hZGVkIWApO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBVbmxvYWQgYW5kIGRpc2FibGUgYSBwbHVnaW4gYnkgZmlsZW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHVubG9hZFBsdWdpbihwbHVnaW5OYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGx1Z2luRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBsdWdpbk5hbWUpO1xuICAgICAgICBpZiAocGx1Z2luRWxlbWVudCkge1xuICAgICAgICAgICAgcGx1Z2luRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGV0IGVuYWJsZWRQbHVnaW5zOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TKSB8fCBcIltdXCJcbiAgICAgICAgKTtcbiAgICAgICAgZW5hYmxlZFBsdWdpbnMgPSBlbmFibGVkUGx1Z2lucy5maWx0ZXIoKHg6IHN0cmluZykgPT4geCAhPT0gcGx1Z2luTmFtZSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZUy5FTkFCTEVEX1BMVUdJTlMsIEpTT04uc3RyaW5naWZ5KGVuYWJsZWRQbHVnaW5zKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBQbHVnaW4gJHtwbHVnaW5OYW1lfSB1bmxvYWRlZCFgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaCBtb2RzIGZyb20gdGhlIHJlZ2lzdHJ5IHJlcG9zaXRvcnlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGZldGNoTW9kcygpOiBQcm9taXNlPHsgcGx1Z2luczogdW5rbm93bltdOyB0aGVtZXM6IHVua25vd25bXSB9PiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goVVJMUy5SRUdJU1RSWSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG93bmxvYWQgYW5kIHNhdmUgYSBtb2QgKHBsdWdpbiBvciB0aGVtZSlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGRvd25sb2FkTW9kKG1vZExpbms6IHN0cmluZywgdHlwZTogXCJwbHVnaW5cIiB8IFwidGhlbWVcIik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oYERvd25sb2FkaW5nICR7dHlwZX0gZnJvbTogJHttb2RMaW5rfWApO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gobW9kTGluayk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGRvd25sb2FkOiAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgc2F2ZURpciA9IHR5cGUgPT09IFwicGx1Z2luXCIgPyBQcm9wZXJ0aWVzLnBsdWdpbnNQYXRoIDogUHJvcGVydGllcy50aGVtZXNQYXRoO1xuICAgICAgICBpZiAoIWF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmV4aXN0cyhzYXZlRGlyKSkge1xuICAgICAgICAgICAgYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQubWtkaXIoc2F2ZURpcik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYmFzZW5hbWUobmV3IFVSTChtb2RMaW5rKS5wYXRobmFtZSkgfHwgYCR7dHlwZX0tJHtEYXRlLm5vdygpfWA7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gam9pbihzYXZlRGlyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQud3JpdGVGaWxlKGZpbGVQYXRoLCBjb250ZW50KTtcblxuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBEb3dubG9hZGVkICR7dHlwZX0gc2F2ZWQgdG86ICR7ZmlsZVBhdGh9YCk7XG4gICAgICAgIHJldHVybiBmaWxlUGF0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBtb2QgZmlsZSBhbmQgY2xlYW4gdXAgYXNzb2NpYXRlZCBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmVtb3ZlTW9kKGZpbGVOYW1lOiBzdHJpbmcsIHR5cGU6IFwicGx1Z2luXCIgfCBcInRoZW1lXCIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgUmVtb3ZpbmcgJHt0eXBlfSBmaWxlOiAke2ZpbGVOYW1lfWApO1xuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInBsdWdpblwiOlxuICAgICAgICAgICAgICAgIGlmIChhd2FpdCB0aGlzLmlzUGx1Z2luSW5zdGFsbGVkKGZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC51bmxpbmsoam9pbihQcm9wZXJ0aWVzLnBsdWdpbnNQYXRoLCBmaWxlTmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZW5hYmxlZFBsdWdpbnM6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5FTkFCTEVEX1BMVUdJTlMpIHx8IFwiW11cIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5hYmxlZFBsdWdpbnMuaW5jbHVkZXMoZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkUGx1Z2lucyA9IGVuYWJsZWRQbHVnaW5zLmZpbHRlcigoeDogc3RyaW5nKSA9PiB4ICE9PSBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TLCBKU09OLnN0cmluZ2lmeShlbmFibGVkUGx1Z2lucykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInRoZW1lXCI6XG4gICAgICAgICAgICAgICAgaWYgKGF3YWl0IHRoaXMuaXNUaGVtZUluc3RhbGxlZChmaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5DVVJSRU5UX1RIRU1FKSA9PT0gZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZUy5DVVJSRU5UX1RIRU1FLCBcIkRlZmF1bHRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY3RpdmVUaGVtZVwiKT8ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnVubGluayhqb2luKFByb3BlcnRpZXMudGhlbWVzUGF0aCwgZmlsZU5hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGlzVGhlbWVJbnN0YWxsZWQoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0SW5zdGFsbGVkVGhlbWVzKCkpLmluY2x1ZGVzKGZpbGVOYW1lKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGlzUGx1Z2luSW5zdGFsbGVkKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLmdldEluc3RhbGxlZFBsdWdpbnMoKSkuaW5jbHVkZXMoZmlsZU5hbWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGdldEluc3RhbGxlZFRoZW1lcygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IGRpclBhdGggPSBQcm9wZXJ0aWVzLnRoZW1lc1BhdGg7XG4gICAgICAgIGlmICghYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuZXhpc3RzKGRpclBhdGgpKSByZXR1cm4gW107XG5cbiAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5yZWFkZGlyKGRpclBhdGgpO1xuICAgICAgICBjb25zdCBmaWxlU3RhdHMgPSBhd2FpdCBQcm9taXNlLmFsbChmaWxlcy5tYXAoYXN5bmMgZmlsZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuc3RhdChqb2luKGRpclBhdGgsIGZpbGUpKTtcbiAgICAgICAgICAgIHJldHVybiB7IGZpbGUsIGlzRmlsZTogc3RhdC5pc0ZpbGUgfTtcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZpbGVTdGF0cy5maWx0ZXIoZiA9PiBmLmlzRmlsZSkubWFwKGYgPT4gZi5maWxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBnZXRJbnN0YWxsZWRQbHVnaW5zKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgZGlyUGF0aCA9IFByb3BlcnRpZXMucGx1Z2luc1BhdGg7XG4gICAgICAgIGlmICghYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuZXhpc3RzKGRpclBhdGgpKSByZXR1cm4gW107XG5cbiAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5yZWFkZGlyKGRpclBhdGgpO1xuICAgICAgICBjb25zdCBmaWxlU3RhdHMgPSBhd2FpdCBQcm9taXNlLmFsbChmaWxlcy5tYXAoYXN5bmMgZmlsZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuc3RhdChqb2luKGRpclBhdGgsIGZpbGUpKTtcbiAgICAgICAgICAgIHJldHVybiB7IGZpbGUsIGlzRmlsZTogc3RhdC5pc0ZpbGUgfTtcbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZpbGVTdGF0cy5maWx0ZXIoZiA9PiBmLmlzRmlsZSkubWFwKGYgPT4gZi5maWxlKTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogU2V0IHVwIGV2ZW50IGxpc3RlbmVycyBmb3IgcGx1Z2luIHRvZ2dsZSBjaGVja2JveGVzXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0b2dnbGVQbHVnaW5MaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgaGVscGVycy53YWl0Rm9yRWxtKFNFTEVDVE9SUy5QTFVHSU5TX0NBVEVHT1JZKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmluZm8oXCJMaXN0ZW5pbmcgdG8gcGx1Z2luIGNoZWNrYm94ZXMuLi5cIik7XG4gICAgICAgICAgICBjb25zdCBwbHVnaW5DaGVja2JveGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsdWdpblwiKSBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50PjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbHVnaW5DaGVja2JveGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcGx1Z2luQ2hlY2tib3hlc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW5DaGVja2JveGVzW2ldLmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NFUy5DSEVDS0VEKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGx1Z2luTmFtZSA9IHBsdWdpbkNoZWNrYm94ZXNbaV0uZ2V0QXR0cmlidXRlKCduYW1lJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwbHVnaW5OYW1lKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbkNoZWNrYm94ZXNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTRVMuQ0hFQ0tFRCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZFBsdWdpbihwbHVnaW5OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5sb2FkUGx1Z2luKHBsdWdpbk5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93UmVsb2FkV2FybmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIHNldHVwIHBsdWdpbiBsaXN0ZW5lcnM6ICR7ZXJyfWApKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBzaG93UmVsb2FkV2FybmluZygpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGx1Z2luLXJlbG9hZC13YXJuaW5nXCIpKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKFwiUGx1Z2luIHVubG9hZGVkLCBhZGRpbmcgcmVsb2FkIHdhcm5pbmcuXCIpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5QTFVHSU5TX0NBVEVHT1JZKTtcbiAgICAgICAgaWYgKCFjb250YWluZXIpIHJldHVybjtcblxuICAgICAgICBjb25zdCBwYXJhZ3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgcGFyYWdyYXBoLmlkID0gXCJwbHVnaW4tcmVsb2FkLXdhcm5pbmdcIjtcbiAgICAgICAgcGFyYWdyYXBoLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBsaW5rLnN0eWxlLmNvbG9yID0gXCJjeWFuXCI7XG4gICAgICAgIGxpbmsuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgIGxpbmsudGV4dENvbnRlbnQgPSBcImhlcmVcIjtcbiAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcGFyYWdyYXBoLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiUmVsb2FkIGlzIHJlcXVpcmVkIHRvIGRpc2FibGUgcGx1Z2lucy4gQ2xpY2sgXCIpKTtcbiAgICAgICAgcGFyYWdyYXBoLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBwYXJhZ3JhcGguYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCIgdG8gcmVsb2FkLlwiKSk7XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFyYWdyYXBoKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHN0YXRpYyBvcGVuVGhlbWVzRm9sZGVyKCk6IHZvaWQge1xuICAgICAgICBoZWxwZXJzLndhaXRGb3JFbG0oXCIjb3BlbnRoZW1lc2ZvbGRlckJ0blwiKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3BlbnRoZW1lc2ZvbGRlckJ0blwiKTtcbiAgICAgICAgICAgIGJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLm9wZW5Gb2xkZXIoUHJvcGVydGllcy50aGVtZXNQYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBzZXR1cCB0aGVtZXMgZm9sZGVyIGJ1dHRvbjogJHtlcnJ9YCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgb3BlblBsdWdpbnNGb2xkZXIoKTogdm9pZCB7XG4gICAgICAgIGhlbHBlcnMud2FpdEZvckVsbShcIiNvcGVucGx1Z2luc2ZvbGRlckJ0blwiKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3BlbnBsdWdpbnNmb2xkZXJCdG5cIik7XG4gICAgICAgICAgICBidXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5vcGVuRm9sZGVyKFByb3BlcnRpZXMucGx1Z2luc1BhdGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIHNldHVwIHBsdWdpbnMgZm9sZGVyIGJ1dHRvbjogJHtlcnJ9YCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9wZW4gYSBmb2xkZXIgaW4gdGhlIHN5c3RlbSBmaWxlIGV4cGxvcmVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgb3BlbkZvbGRlcihmb2xkZXJQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50Lm9wZW5QYXRoKGZvbGRlclBhdGgpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBvcGVuIGZvbGRlciAke2ZvbGRlclBhdGh9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgfVxuICAgICAgICBcbiAgICBwdWJsaWMgc3RhdGljIHNjcm9sbExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBoZWxwZXJzLndhaXRGb3JFbG0oXCIubWVudS14ZUUwNiA+IGRpdjpudGgtY2hpbGQoNSkgPiBkaXZcIikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbmhhbmNlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmhhbmNlZCcpO1xuICAgICAgICAgICAgY29uc3QgZW5oYW5jZWROYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudS14ZUUwNiA+IGRpdjpudGgtY2hpbGQoNSkgPiBkaXYnKTtcblxuICAgICAgICAgICAgaWYgKCFlbmhhbmNlZCB8fCAhZW5oYW5jZWROYXYpIHJldHVybjtcblxuICAgICAgICAgICAgZW5oYW5jZWROYXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaXJzdENoaWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlbmhhbmNlZCA+IGRpdlwiKTtcbiAgICAgICAgICAgICAgICBmaXJzdENoaWxkPy5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcbiAgICAgICAgICAgICAgICAgICAgYmxvY2s6ICdzdGFydCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBTZXR0aW5ncy5hY3RpdmVTZWN0aW9uKGVuaGFuY2VkTmF2KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICAgICAgICAgIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgU2V0dGluZ3MuYWN0aXZlU2VjdGlvbihlbmhhbmNlZE5hdik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmhhbmNlZE5hdi5jbGFzc0xpc3QucmVtb3ZlKENMQVNTRVMuU0VMRUNURUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCB7IHRocmVzaG9sZDogMC4xIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZW5oYW5jZWQpO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBzZXR1cCBzY3JvbGwgbGlzdGVuZXI6ICR7ZXJyfWApKTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBhcHBseVRoZW1lIGZ1bmN0aW9uIHRvIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRBcHBseVRoZW1lRnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFwcGx5VGhlbWVTY3JpcHQgPSBnZXRBcHBseVRoZW1lVGVtcGxhdGUoKTtcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTsgIFxuICAgICAgICBzY3JpcHQuaW5uZXJIVE1MID0gYXBwbHlUaGVtZVNjcmlwdDtcbiAgICAgICAgXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogQ2hlY2sgZm9yIHVwZGF0ZXMgZm9yIGEgc3BlY2lmaWMgcGx1Z2luIG9yIHRoZW1lXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBjaGVja0Zvckl0ZW1VcGRhdGVzKGl0ZW1GaWxlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbygnQ2hlY2tpbmcgZm9yIHVwZGF0ZXMgZm9yICcgKyBpdGVtRmlsZSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBpdGVtQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoYCR7aXRlbUZpbGV9LWJveGApWzBdO1xuICAgICAgICBpZiAoIWl0ZW1Cb3gpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYCR7aXRlbUZpbGV9LWJveCBlbGVtZW50IG5vdCBmb3VuZC5gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBsdWdpbk9yVGhlbWU6ICd0aGVtZScgfCAncGx1Z2luJyA9IGl0ZW1GaWxlLmVuZHNXaXRoKFwiLnRoZW1lLmNzc1wiKSA/IFwidGhlbWVcIiA6IFwicGx1Z2luXCI7XG4gICAgICAgIGNvbnN0IGl0ZW1QYXRoID0gam9pbihcbiAgICAgICAgICAgIHBsdWdpbk9yVGhlbWUgPT09IFwidGhlbWVcIiA/IHByb3BlcnRpZXMudGhlbWVzUGF0aCA6IHByb3BlcnRpZXMucGx1Z2luc1BhdGgsIFxuICAgICAgICAgICAgaXRlbUZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlZmFjdG9yZWQ6IFJlYWQgZmlsZSBmaXJzdFxuICAgICAgICBsZXQgZmlsZUNvbnRlbnQgPSBcIlwiO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmlsZUNvbnRlbnQgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5yZWFkRmlsZShpdGVtUGF0aCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gcmVhZCBmaWxlICR7aXRlbVBhdGh9OiAke2V9YCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbnN0YWxsZWRJdGVtTWV0YURhdGEgPSBFeHRyYWN0TWV0YURhdGEuZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQoZmlsZUNvbnRlbnQpIGFzIE1ldGFEYXRhIHwgbnVsbDtcbiAgICAgICAgXG4gICAgICAgIGlmICghaW5zdGFsbGVkSXRlbU1ldGFEYXRhIHx8IE9iamVjdC5rZXlzKGluc3RhbGxlZEl0ZW1NZXRhRGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cGRhdGVVcmwgPSBpbnN0YWxsZWRJdGVtTWV0YURhdGEudXBkYXRlVXJsO1xuICAgICAgICBpZiAoIXVwZGF0ZVVybCB8fCB1cGRhdGVVcmwgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBObyB1cGRhdGUgVVJMIHByb3ZpZGVkIGZvciAke3BsdWdpbk9yVGhlbWV9ICgke2luc3RhbGxlZEl0ZW1NZXRhRGF0YS5uYW1lfSlgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gYXdhaXQgZmV0Y2godXBkYXRlVXJsKTtcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybihgRmFpbGVkIHRvIGZldGNoIHVwZGF0ZSBmb3IgJHtpdGVtRmlsZX06IEhUVFAgJHtyZXF1ZXN0LnN0YXR1c31gKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdC50ZXh0KCk7XG4gICAgICAgICAgICBjb25zdCBleHRyYWN0ZWRNZXRhRGF0YSA9IEV4dHJhY3RNZXRhRGF0YS5leHRyYWN0TWV0YWRhdGFGcm9tVGV4dChyZXNwb25zZSkgYXMgTWV0YURhdGEgfCBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWV4dHJhY3RlZE1ldGFEYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybihgRmFpbGVkIHRvIGV4dHJhY3QgbWV0YWRhdGEgZnJvbSByZXNwb25zZSBmb3IgJHtwbHVnaW5PclRoZW1lfSAoJHtpbnN0YWxsZWRJdGVtTWV0YURhdGEubmFtZX0pYCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGVscGVycy5pc05ld2VyVmVyc2lvbihleHRyYWN0ZWRNZXRhRGF0YS52ZXJzaW9uLCBpbnN0YWxsZWRJdGVtTWV0YURhdGEudmVyc2lvbikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICBgVXBkYXRlIGF2YWlsYWJsZSBmb3IgJHtwbHVnaW5PclRoZW1lfSAoJHtpbnN0YWxsZWRJdGVtTWV0YURhdGEubmFtZX0pOiBgICtcbiAgICAgICAgICAgICAgICAgICAgYHYke2luc3RhbGxlZEl0ZW1NZXRhRGF0YS52ZXJzaW9ufSAtPiB2JHtleHRyYWN0ZWRNZXRhRGF0YS52ZXJzaW9ufWBcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7aXRlbUZpbGV9LXVwZGF0ZWApO1xuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC53cml0ZUZpbGUoaXRlbVBhdGgsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNldHRpbmdzLnJlbW92ZUl0ZW0oaXRlbUZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgU2V0dGluZ3MuYWRkSXRlbShwbHVnaW5PclRoZW1lLCBpdGVtRmlsZSwgZXh0cmFjdGVkTWV0YURhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmluZm8oXG4gICAgICAgICAgICAgICAgICAgIGBObyB1cGRhdGUgYXZhaWxhYmxlIGZvciAke3BsdWdpbk9yVGhlbWV9ICgke2luc3RhbGxlZEl0ZW1NZXRhRGF0YS5uYW1lfSkuIGAgK1xuICAgICAgICAgICAgICAgICAgICBgQ3VycmVudCB2ZXJzaW9uOiB2JHtpbnN0YWxsZWRJdGVtTWV0YURhdGEudmVyc2lvbn1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBFcnJvciBjaGVja2luZyB1cGRhdGVzIGZvciAke2l0ZW1GaWxlfTogJHsoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4gICAgXG5leHBvcnQgZGVmYXVsdCBNb2RNYW5hZ2VyO1xuIiwgIi8qKlxuICogTWV0YWRhdGEgc3RydWN0dXJlIGZvciBwbHVnaW5zIGFuZCB0aGVtZXNcbiAqIEV4dHJhY3RlZCBmcm9tIEpTRG9jLXN0eWxlIGNvbW1lbnRzIGluIG1vZCBmaWxlc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldGFEYXRhIHtcbiAgICAvKiogRGlzcGxheSBuYW1lIG9mIHRoZSBtb2QgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgLyoqIEJyaWVmIGRlc2NyaXB0aW9uIG9mIHdoYXQgdGhlIG1vZCBkb2VzICovXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICAvKiogQXV0aG9yL2NyZWF0b3Igb2YgdGhlIG1vZCAqL1xuICAgIGF1dGhvcjogc3RyaW5nO1xuICAgIC8qKiBTZW1hbnRpYyB2ZXJzaW9uIHN0cmluZyAoZS5nLiwgXCIxLjAuMFwiKSAqL1xuICAgIHZlcnNpb246IHN0cmluZztcbiAgICAvKiogVVJMIHRvIGNoZWNrIGZvciB1cGRhdGVzIChvcHRpb25hbCkgKi9cbiAgICB1cGRhdGVVcmw/OiBzdHJpbmc7XG4gICAgLyoqIFNvdXJjZSBjb2RlIHJlcG9zaXRvcnkgVVJMIChvcHRpb25hbCkgKi9cbiAgICBzb3VyY2U/OiBzdHJpbmc7XG4gICAgLyoqIExpY2Vuc2UgdHlwZSAob3B0aW9uYWwpICovXG4gICAgbGljZW5zZT86IHN0cmluZztcbiAgICAvKiogSG9tZXBhZ2UvZG9jdW1lbnRhdGlvbiBVUkwgKG9wdGlvbmFsKSAqL1xuICAgIGhvbWVwYWdlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBNZXRhZGF0YUtleSA9IGtleW9mIE1ldGFEYXRhO1xuXG5leHBvcnQgY29uc3QgUkVRVUlSRURfTUVUQURBVEFfS0VZUyA9IFtcbiAgICBcIm5hbWVcIixcbiAgICBcImRlc2NyaXB0aW9uXCIsXG4gICAgXCJhdXRob3JcIixcbiAgICBcInZlcnNpb25cIixcbl0gYXMgY29uc3Qgc2F0aXNmaWVzIHJlYWRvbmx5IE1ldGFkYXRhS2V5W107XG5cbmV4cG9ydCBjb25zdCBBTExfTUVUQURBVEFfS0VZUyA9IFtcbiAgICBcIm5hbWVcIixcbiAgICBcImRlc2NyaXB0aW9uXCIsXG4gICAgXCJhdXRob3JcIixcbiAgICBcInZlcnNpb25cIixcbiAgICBcInVwZGF0ZVVybFwiLFxuICAgIFwic291cmNlXCIsXG4gICAgXCJsaWNlbnNlXCIsXG4gICAgXCJob21lcGFnZVwiLFxuXSBhcyBjb25zdCBzYXRpc2ZpZXMgcmVhZG9ubHkgTWV0YWRhdGFLZXlbXTtcbiIsICJpbXBvcnQge1xuICAgIE1ldGFEYXRhLFxuICAgIE1ldGFkYXRhS2V5LFxuICAgIFJFUVVJUkVEX01FVEFEQVRBX0tFWVMsXG4gICAgQUxMX01FVEFEQVRBX0tFWVMsXG59IGZyb20gXCIuLi9pbnRlcmZhY2VzL01ldGFEYXRhXCI7XG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiO1xuXG5jbGFzcyBFeHRyYWN0TWV0YURhdGEge1xuICAgIC8qKlxuICAgICAqIFBhcnNlIG1ldGFkYXRhIGZyb20gYSBjb21tZW50IGJsb2NrIGluIHRoZSBmb3JtYXQ6XG4gICAgICogLyoqIEBrZXkgdmFsdWUgKlxcL1xuICAgICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFyc2VNZXRhZGF0YUZyb21Db250ZW50KGNvbnRlbnQ6IHN0cmluZyk6IE1ldGFEYXRhIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IGJsb2NrTWF0Y2ggPSBjb250ZW50Lm1hdGNoKC9cXC9cXCpcXCooW1xcc1xcU10qPylcXCpcXC8vKTtcbiAgICAgICAgaWYgKCFibG9ja01hdGNoKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCByZXN1bHQ6IFBhcnRpYWw8TWV0YURhdGE+ID0ge307XG4gICAgICAgIGNvbnN0IHRhZ1JlZ2V4ID0gL0AoXFx3KylcXHMrKFteXFxuXFxyXSspL2c7XG5cbiAgICAgICAgZm9yIChjb25zdCBbLCByYXdLZXksIHJhd1ZhbHVlXSBvZiBibG9ja01hdGNoWzFdLm1hdGNoQWxsKHRhZ1JlZ2V4KSkge1xuICAgICAgICAgICAgaWYgKCFBTExfTUVUQURBVEFfS0VZUy5pbmNsdWRlcyhyYXdLZXkgYXMgTWV0YWRhdGFLZXkpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3Qga2V5ID0gcmF3S2V5IGFzIE1ldGFkYXRhS2V5O1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0W2tleV0gIT09IHVuZGVmaW5lZCkgY29udGludWU7XG5cbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gcmF3VmFsdWUudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgUkVRVUlSRURfTUVUQURBVEFfS0VZUykge1xuICAgICAgICAgICAgaWYgKCFyZXN1bHRba2V5XSkgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0IGFzIE1ldGFEYXRhO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQodGV4dENvbnRlbnQ6IHN0cmluZyk6IE1ldGFEYXRhIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5wYXJzZU1ldGFkYXRhRnJvbUNvbnRlbnQodGV4dENvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFtZXRhZGF0YSkge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdDb21tZW50IGJsb2NrIG5vdCBmb3VuZCBpbiB0aGUgcHJvdmlkZWQgdGV4dCcpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbWV0YWRhdGE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFeHRyYWN0TWV0YURhdGE7XG4iLCAiaW1wb3J0IEhlbHBlcnMgZnJvbSBcIi4uL3V0aWxzL0hlbHBlcnNcIjtcbmltcG9ydCB7IE1ldGFEYXRhIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvTWV0YURhdGFcIjtcbmltcG9ydCB7IGdldFBsdWdpbkl0ZW1UZW1wbGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL3BsdWdpbi1pdGVtL3BsdWdpbkl0ZW1cIjtcbmltcG9ydCB7IGdldFRoZW1lSXRlbVRlbXBsYXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvdGhlbWUtaXRlbS90aGVtZUl0ZW1cIjtcbmltcG9ydCB7IGdldEVuaGFuY2VkTmF2IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvZW5oYW5jZWQtbmF2L2VuaGFuY2VkTmF2XCI7XG5pbXBvcnQgeyBnZXRMb2dnZXIgfSBmcm9tIFwiLi4vdXRpbHMvbG9nZ2VyXCI7XG5pbXBvcnQgTW9kTWFuYWdlciBmcm9tIFwiLi9Nb2RNYW5hZ2VyXCI7XG5pbXBvcnQgeyBTRUxFQ1RPUlMsIENMQVNTRVMsIFNUT1JBR0VfS0VZUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuY2xhc3MgU2V0dGluZ3Mge1xuICAgIHByaXZhdGUgc3RhdGljIGxvZ2dlciA9IGdldExvZ2dlcihcIlNldHRpbmdzXCIpO1xuXG4gICAgLyoqXG4gICAgICogQWRkIGEgbmV3IHNlY3Rpb24gdG8gdGhlIHNldHRpbmdzIHBhbmVsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRTZWN0aW9uKHNlY3Rpb25JZDogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMud2FpdEZvclNldHRpbmdzUGFuZWwoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmluZm8oYEFkZGluZyBzZWN0aW9uOiAke3NlY3Rpb25JZH0gd2l0aCB0aXRsZTogJHt0aXRsZX1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3NQYW5lbCA9IHRoaXMuZ2V0U2V0dGluZ3NQYW5lbCgpO1xuICAgICAgICAgICAgaWYgKCFzZXR0aW5nc1BhbmVsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25FbGVtZW50ID0gdGhpcy5nZXRFeGlzdGluZ1NlY3Rpb24oc2V0dGluZ3NQYW5lbCk7XG4gICAgICAgICAgICBjb25zdCBsYWJlbEVsZW1lbnQgPSB0aGlzLmdldEV4aXN0aW5nU2VjdGlvbkxhYmVsKHNlY3Rpb25FbGVtZW50KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFzZWN0aW9uRWxlbWVudCB8fCAhbGFiZWxFbGVtZW50KSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25DbGFzc05hbWUgPSBzZWN0aW9uRWxlbWVudC5jbGFzc05hbWU7XG4gICAgICAgICAgICBjb25zdCB0aXRsZUNsYXNzTmFtZSA9IGxhYmVsRWxlbWVudC5jbGFzc05hbWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgc2VjdGlvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBzZWN0aW9uQ2xhc3NOYW1lO1xuICAgICAgICAgICAgc2VjdGlvbkNvbnRhaW5lci5pZCA9IHNlY3Rpb25JZDtcblxuICAgICAgICAgICAgY29uc3Qgc2VjdGlvblRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHNlY3Rpb25UaXRsZS5jbGFzc05hbWUgPSB0aXRsZUNsYXNzTmFtZTtcbiAgICAgICAgICAgIHNlY3Rpb25UaXRsZS50ZXh0Q29udGVudCA9IHRpdGxlO1xuXG4gICAgICAgICAgICBzZWN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb25UaXRsZSk7XG4gICAgICAgICAgICBzZXR0aW5nc1BhbmVsLmFwcGVuZENoaWxkKHNlY3Rpb25Db250YWluZXIpO1xuXG4gICAgICAgICAgICAvLyBBZGQgc2VjdGlvbiB0byBuYXZcbiAgICAgICAgICAgIHRoaXMud2FpdEZvck5hdk1lbnUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYXYgPSB0aGlzLmdldE5hdk1lbnUoKTtcbiAgICAgICAgICAgICAgICAvLyBUcnkgdG8gZmluZCBzaG9ydGN1dHMgbmF2IHRvIGluc2VydCBhZnRlciwgb3IganVzdCBhcHBlbmRcbiAgICAgICAgICAgICAgICBjb25zdCBzaG9ydGN1dHNOYXYgPSB0aGlzLmdldE5hdlNob3J0Y3V0SXRlbSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFuYXYpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZWN0aW9uPVwiJHtzZWN0aW9uSWR9XCJdYCkpIHJldHVybjsgLy8gTmF2IGl0ZW0gYWxyZWFkeSBleGlzdHNcblxuICAgICAgICAgICAgICAgIGNvbnN0IGVuaGFuY2VkTmF2Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBlbmhhbmNlZE5hdkNvbnRhaW5lci5pbm5lckhUTUwgPSBnZXRFbmhhbmNlZE5hdigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzaG9ydGN1dHNOYXYpIHtcbiAgICAgICAgICAgICAgICAgICAgbmF2Lmluc2VydEJlZm9yZShlbmhhbmNlZE5hdkNvbnRhaW5lciwgc2hvcnRjdXRzTmF2Lm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuYXYuYXBwZW5kQ2hpbGQoZW5oYW5jZWROYXZDb250YWluZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGFkZCBuYXY6ICR7ZXJyfWApKTtcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gYWRkIHNlY3Rpb246ICR7ZXJyfWApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjYXRlZ29yeSB3aXRoaW4gYSBzZWN0aW9uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRDYXRlZ29yeSh0aXRsZTogc3RyaW5nLCBzZWN0aW9uSWQ6IHN0cmluZywgaWNvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMud2FpdEZvclNldHRpbmdzUGFuZWwoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmluZm8oYEFkZGluZyBjYXRlZ29yeTogJHt0aXRsZX0gdG8gc2VjdGlvbjogJHtzZWN0aW9uSWR9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNhdGVnb3J5VGVtcGxhdGUgPSB0aGlzLmdldENhdGVnb3J5VGVtcGxhdGUoKTtcbiAgICAgICAgICAgIGlmICghY2F0ZWdvcnlUZW1wbGF0ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCB7IGNhdGVnb3J5Q2xhc3MsIGNhdGVnb3J5VGl0bGVDbGFzcywgaGVhZGluZ0NsYXNzLCBpY29uQ2xhc3MgfSA9IGNhdGVnb3J5VGVtcGxhdGU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgaWNvbiBjbGFzc1xuICAgICAgICAgICAgaWNvbiA9IGljb24ucmVwbGFjZShgY2xhc3M9XCJpY29uXCJgLCBgY2xhc3M9XCIke2ljb25DbGFzc31cImApO1xuXG4gICAgICAgICAgICBjb25zdCBzZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VjdGlvbklkKTtcbiAgICAgICAgICAgIGlmICghc2VjdGlvbikgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yeURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBjYXRlZ29yeURpdi5jbGFzc05hbWUgPSBjYXRlZ29yeUNsYXNzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB0aXRsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0aXRsZURpdi5jbGFzc05hbWUgPSBjYXRlZ29yeVRpdGxlQ2xhc3M7XG4gICAgICAgICAgICB0aXRsZURpdi5pbm5lckhUTUwgPSB0aXRsZTtcblxuICAgICAgICAgICAgY29uc3QgaGVhZGluZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAvLyBJZiB3ZSBmb3VuZCBhIGNsYXNzLCB1c2UgaXQuIElmIG5vdCwgZmFsbGJhY2sgdG8gc2VsZWN0b3IgbG9naWMgb3IgZW1wdHlcbiAgICAgICAgICAgIGlmIChoZWFkaW5nQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nRGl2LmNsYXNzTmFtZSA9IGhlYWRpbmdDbGFzcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgIGhlYWRpbmdEaXYuY2xhc3NMaXN0LmFkZChTRUxFQ1RPUlMuQ0FURUdPUllfSEVBRElORy5yZXBsYWNlKCcuJywgJycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaGVhZGluZ0Rpdi5pbm5lckhUTUwgKz0gaWNvbjtcbiAgICAgICAgICAgIGhlYWRpbmdEaXYuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXRlZ29yeURpdi5hcHBlbmRDaGlsZChoZWFkaW5nRGl2KTtcbiAgICAgICAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoY2F0ZWdvcnlEaXYpO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgY2F0ZWdvcnk6ICR7ZXJyfWApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBidXR0b24gdG8gdGhlIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRCdXR0b24odGl0bGU6IHN0cmluZywgaWQ6IHN0cmluZywgcXVlcnk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBIZWxwZXJzLndhaXRGb3JFbG0ocXVlcnkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnkpO1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBvcHRpb25EaXYuY2xhc3NMaXN0LmFkZChDTEFTU0VTLk9QVElPTik7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgY29udGVudERpdi5jbGFzc0xpc3QuYWRkKENMQVNTRVMuQ09OVEVOVCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBidXR0b25EaXYuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAgICAgYnV0dG9uRGl2LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIHRpdGxlKTtcbiAgICAgICAgICAgIGJ1dHRvbkRpdi5jbGFzc0xpc3QuYWRkKENMQVNTRVMuQlVUVE9OLCBDTEFTU0VTLkJVVFRPTl9DT05UQUlORVIsIFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgYnV0dG9uRGl2LmlkID0gaWQ7XG4gICAgICAgICAgICBidXR0b25EaXYudGV4dENvbnRlbnQgPSB0aXRsZTtcblxuICAgICAgICAgICAgY29udGVudERpdi5hcHBlbmRDaGlsZChidXR0b25EaXYpO1xuICAgICAgICAgICAgb3B0aW9uRGl2LmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvcHRpb25EaXYpO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgYnV0dG9uOiAke2Vycn1gKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgdGhlbWUgb3IgcGx1Z2luIGl0ZW0gdG8gdGhlIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRJdGVtKHR5cGU6IFwidGhlbWVcIiB8IFwicGx1Z2luXCIsIGZpbGVOYW1lOiBzdHJpbmcsIG1ldGFEYXRhOiBNZXRhRGF0YSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBBZGRpbmcgJHt0eXBlfTogJHtmaWxlTmFtZX1gKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0eXBlID09PSBcInRoZW1lXCIpIHtcbiAgICAgICAgICAgIEhlbHBlcnMud2FpdEZvckVsbShTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRoZW1lKGZpbGVOYW1lLCBtZXRhRGF0YSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgdGhlbWU6ICR7ZXJyfWApKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcInBsdWdpblwiKSB7XG4gICAgICAgICAgICBIZWxwZXJzLndhaXRGb3JFbG0oU0VMRUNUT1JTLlBMVUdJTlNfQ0FURUdPUlkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGx1Z2luKGZpbGVOYW1lLCBtZXRhRGF0YSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgcGx1Z2luOiAke2Vycn1gKSk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGFkZFBsdWdpbihmaWxlTmFtZTogc3RyaW5nLCBtZXRhRGF0YTogTWV0YURhdGEpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZW5hYmxlZFBsdWdpbnM6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5FTkFCTEVEX1BMVUdJTlMpIHx8IFwiW11cIlxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBsdWdpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHBsdWdpbkNvbnRhaW5lci5pbm5lckhUTUwgPSBnZXRQbHVnaW5JdGVtVGVtcGxhdGUoZmlsZU5hbWUsIG1ldGFEYXRhLCBlbmFibGVkUGx1Z2lucy5pbmNsdWRlcyhmaWxlTmFtZSkpO1xuICAgICAgICBwbHVnaW5Db250YWluZXIuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBgJHtmaWxlTmFtZX0tYm94YCk7XG5cbiAgICAgICAgY29uc3QgcGx1Z2luc0NhdGVnb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuUExVR0lOU19DQVRFR09SWSk7XG4gICAgICAgIHBsdWdpbnNDYXRlZ29yeT8uYXBwZW5kQ2hpbGQocGx1Z2luQ29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIE1vZE1hbmFnZXIuY2hlY2tGb3JJdGVtVXBkYXRlcyhmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkVGhlbWUoZmlsZU5hbWU6IHN0cmluZywgbWV0YURhdGE6IE1ldGFEYXRhKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5DVVJSRU5UX1RIRU1FKTtcblxuICAgICAgICBjb25zdCB0aGVtZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoZW1lQ29udGFpbmVyLmlubmVySFRNTCA9IGdldFRoZW1lSXRlbVRlbXBsYXRlKGZpbGVOYW1lLCBtZXRhRGF0YSwgY3VycmVudFRoZW1lID09PSBmaWxlTmFtZSk7XG4gICAgICAgIHRoZW1lQ29udGFpbmVyLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgYCR7ZmlsZU5hbWV9LWJveGApO1xuXG4gICAgICAgIGNvbnN0IHRoZW1lc0NhdGVnb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKTtcbiAgICAgICAgdGhlbWVzQ2F0ZWdvcnk/LmFwcGVuZENoaWxkKHRoZW1lQ29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIE1vZE1hbmFnZXIuY2hlY2tGb3JJdGVtVXBkYXRlcyhmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgc2V0dGluZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUl0ZW0oZmlsZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoYCR7ZmlsZU5hbWV9LWJveGApWzBdO1xuICAgICAgICBlbGVtZW50Py5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBuYXZpZ2F0aW9uIGVsZW1lbnQgYXMgYWN0aXZlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhY3RpdmVTZWN0aW9uKGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbmF2ID0gdGhpcy5nZXROYXZNZW51KCk7XG4gICAgICAgIGlmIChuYXYpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBzZWxlY3RlZCBjbGFzcyBmcm9tIGFsbCBuYXYgaXRlbXNcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmF2LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbmF2LmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NFUy5TRUxFQ1RFRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgLy8gRmFsbGJhY2sgdG8gcXVlcnlTZWxlY3RvclxuICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmF2SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7U0VMRUNUT1JTLk5BVl9NRU5VfSA+IGRpdjpudGgtY2hpbGQoJHtpfSlgKTtcbiAgICAgICAgICAgICAgICBuYXZJdGVtPy5jbGFzc0xpc3QucmVtb3ZlKENMQVNTRVMuU0VMRUNURUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKENMQVNTRVMuU0VMRUNURUQpO1xuICAgIH1cblxuICAgIC8vIC0tLSBEeW5hbWljIERpc2NvdmVyeSBIZWxwZXJzIC0tLVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0TmF2TWVudSgpOiBFbGVtZW50IHwgbnVsbCB7XG4gICAgICAgIC8vIFRyeSBzZWxlY3RvclxuICAgICAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5OQVZfTUVOVSk7XG4gICAgICAgIGlmIChuYXYpIHJldHVybiBuYXY7XG5cbiAgICAgICAgLy8gRHluYW1pYyBmYWxsYmFja1xuICAgICAgICBjb25zdCBrZXl3b3JkcyA9IFtcIkJvYXJkXCIsIFwiRGlzY292ZXJcIiwgXCJMaWJyYXJ5XCJdO1xuICAgICAgICBjb25zdCBsaW5rcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYSwgZGl2W3RpdGxlXScpKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgbGluayBvZiBsaW5rcykge1xuICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gbGluay5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XG4gICAgICAgICAgICAgaWYgKHRpdGxlICYmIGtleXdvcmRzLmluY2x1ZGVzKHRpdGxlKSkge1xuICAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gbGluay5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgICB3aGlsZShwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kID0ga2V5d29yZHMuZmlsdGVyKGsgPT4gcGFyZW50IS5xdWVyeVNlbGVjdG9yKGBbdGl0bGU9XCIke2t9XCJdYCkpO1xuICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudCA9PT0gZG9jdW1lbnQuYm9keSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0TmF2U2hvcnRjdXRJdGVtKCk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1t0aXRsZT1cIlNob3J0Y3V0c1wiXScpO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRTZXR0aW5nc1BhbmVsKCk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICAgICAgLy8gVHJ5IHNlbGVjdG9yXG4gICAgICAgIGNvbnN0IHBhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuU0VDVElPTlNfQ09OVEFJTkVSKTtcbiAgICAgICAgaWYgKHBhbmVsKSByZXR1cm4gcGFuZWw7XG5cbiAgICAgICAgLy8gRHluYW1pYyBmYWxsYmFja1xuICAgICAgICBjb25zdCBrZXl3b3JkcyA9IFtcIkdlbmVyYWxcIiwgXCJQbGF5ZXJcIiwgXCJTdHJlYW1pbmdcIl07XG4gICAgICAgIGNvbnN0IGFsbERpdnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2RpdicpKTtcbiAgICAgICAgZm9yIChjb25zdCBkaXYgb2YgYWxsRGl2cykge1xuICAgICAgICAgICAgIGlmIChkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICAgICBsZXQgbWF0Y2hDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICBpZiAoa2V5d29yZHMuc29tZShrID0+IGRpdi5jaGlsZHJlbltpXS50ZXh0Q29udGVudD8uaW5jbHVkZXMoaykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGlmIChtYXRjaENvdW50ID49IDIpIHJldHVybiBkaXY7XG4gICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldEV4aXN0aW5nU2VjdGlvbihwYW5lbDogRWxlbWVudCk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICAgICAgLy8gRmluZCBhIGNoaWxkIHRoYXQgY29udGFpbnMgXCJHZW5lcmFsXCIgb3IgXCJQbGF5ZXJcIlxuICAgICAgICBjb25zdCBrZXl3b3JkcyA9IFtcIkdlbmVyYWxcIiwgXCJQbGF5ZXJcIl07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFuZWwuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gcGFuZWwuY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoa2V5d29yZHMuc29tZShrID0+IGNoaWxkLnRleHRDb250ZW50Py5pbmNsdWRlcyhrKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmFsbGJhY2sgdG8gc2VsZWN0b3JcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlNFQ1RJT04pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldEV4aXN0aW5nU2VjdGlvbkxhYmVsKHNlY3Rpb246IEVsZW1lbnQgfCBudWxsKTogRWxlbWVudCB8IG51bGwge1xuICAgICAgICBpZiAoIXNlY3Rpb24pIHJldHVybiBudWxsO1xuICAgICAgICAvLyBUaGUgbGFiZWwgaXMgdXN1YWxseSB0aGUgZmlyc3QgY2hpbGQgb3IgY2xhc3MgY29udGFpbnMgbGFiZWxcbiAgICAgICAgaWYgKHNlY3Rpb24uY2hpbGRyZW4ubGVuZ3RoID4gMCkgcmV0dXJuIHNlY3Rpb24uY2hpbGRyZW5bMF07XG4gICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5MQUJFTCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Q2F0ZWdvcnlUZW1wbGF0ZSgpOiB7IGNhdGVnb3J5Q2xhc3M6IHN0cmluZywgY2F0ZWdvcnlUaXRsZUNsYXNzOiBzdHJpbmcsIGhlYWRpbmdDbGFzczogc3RyaW5nLCBpY29uQ2xhc3M6IHN0cmluZyB9IHwgbnVsbCB7XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGFuIGV4aXN0aW5nIGNhdGVnb3J5IHRvIGNvcHkgY2xhc3Nlc1xuICAgICAgICBjb25zdCBjYXRlZ29yeUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5DQVRFR09SWSk7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5VGl0bGVFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuQ0FURUdPUllfTEFCRUwpO1xuICAgICAgICBjb25zdCBjYXRlZ29yeUljb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuQ0FURUdPUllfSUNPTik7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5SGVhZGluZ0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5DQVRFR09SWV9IRUFESU5HKTtcblxuICAgICAgICBsZXQgY2F0ZWdvcnlDbGFzcyA9IGNhdGVnb3J5RWxlbWVudD8uY2xhc3NOYW1lIHx8IFwiXCI7XG4gICAgICAgIGxldCBjYXRlZ29yeVRpdGxlQ2xhc3MgPSBjYXRlZ29yeVRpdGxlRWxlbWVudD8uY2xhc3NOYW1lIHx8IFwiXCI7XG4gICAgICAgIGxldCBoZWFkaW5nQ2xhc3MgPSBjYXRlZ29yeUhlYWRpbmdFbGVtZW50Py5jbGFzc05hbWUgfHwgXCJcIjtcbiAgICAgICAgXG4gICAgICAgIGxldCBpY29uQ2xhc3MgPSAnaWNvbic7XG4gICAgICAgIGlmIChjYXRlZ29yeUljb25FbGVtZW50IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgICAgICAgICAgaWNvbkNsYXNzID0gY2F0ZWdvcnlJY29uRWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbDtcbiAgICAgICAgfSBlbHNlIGlmIChjYXRlZ29yeUljb25FbGVtZW50KSB7XG4gICAgICAgICAgICBpY29uQ2xhc3MgPSBjYXRlZ29yeUljb25FbGVtZW50LmNsYXNzTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXRlZ29yeUNsYXNzICYmIGNhdGVnb3J5VGl0bGVDbGFzcykge1xuICAgICAgICAgICAgcmV0dXJuIHsgY2F0ZWdvcnlDbGFzcywgY2F0ZWdvcnlUaXRsZUNsYXNzLCBoZWFkaW5nQ2xhc3MsIGljb25DbGFzcyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVHJ5IGR5bmFtaWMgaWYgc2VsZWN0b3IgZmFpbGVkXG4gICAgICAgIGNvbnN0IHBhbmVsID0gdGhpcy5nZXRTZXR0aW5nc1BhbmVsKCk7XG4gICAgICAgIGlmIChwYW5lbCkge1xuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IHRoaXMuZ2V0RXhpc3RpbmdTZWN0aW9uKHBhbmVsKTtcbiAgICAgICAgICAgIGlmIChzZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gRmluZCBhIGNhdGVnb3J5IGluc2lkZSBzZWN0aW9uXG4gICAgICAgICAgICAgICAgLy8gVXN1YWxseSBub3QgdGhlIGZpcnN0IGNoaWxkIChMYWJlbClcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDsgaTxzZWN0aW9uLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gc2VjdGlvbi5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2tpcCBpZiBpdCBpcyB0aGUgbGFiZWwvdGl0bGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLmdldEV4aXN0aW5nU2VjdGlvbkxhYmVsKHNlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQgPT09IGxhYmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgY2hpbGQgaXMgbGlrZWx5IGEgY2F0ZWdvcnlcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlDbGFzcyA9IGNoaWxkLmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbmQgSGVhZGluZ1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWFkaW5nID0gY2hpbGQuY2hpbGRyZW5bMF07IC8vIEFzc3VtaW5nIGZpcnN0IGNoaWxkIGlzIGhlYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhlYWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRpbmdDbGFzcyA9IGhlYWRpbmcuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGVhZGluZyBjb250YWlucyBJY29uIGFuZCBUaXRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGljb24gPSBoZWFkaW5nLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpIHx8IGhlYWRpbmcuY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGljb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGljb24gaW5zdGFuY2VvZiBTVkdFbGVtZW50KSBpY29uQ2xhc3MgPSBpY29uLmNsYXNzTmFtZS5iYXNlVmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGljb25DbGFzcyA9IGljb24uY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IGhlYWRpbmcucXVlcnlTZWxlY3RvcignZGl2JykgfHwgaGVhZGluZy5jaGlsZHJlblsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGl0bGUpIGNhdGVnb3J5VGl0bGVDbGFzcyA9IHRpdGxlLmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5Q2xhc3MgJiYgY2F0ZWdvcnlUaXRsZUNsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgY2F0ZWdvcnlDbGFzcywgY2F0ZWdvcnlUaXRsZUNsYXNzLCBoZWFkaW5nQ2xhc3MsIGljb25DbGFzcyB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgd2FpdEZvclNldHRpbmdzUGFuZWwoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJldHJpZXMgPSAwO1xuICAgICAgICAgICAgY29uc3QgbWF4UmV0cmllcyA9IDIwOyAvLyAxMCBzZWNvbmRzXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTZXR0aW5nc1BhbmVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXRyaWVzKys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXRyaWVzID4gbWF4UmV0cmllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiVGltZW91dCB3YWl0aW5nIGZvciBzZXR0aW5ncyBwYW5lbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7IC8vIHJlc29sdmUgdG8gbGV0IGl0IGZhaWwgZ3JhY2VmdWxseSBpbnNpZGVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHdhaXRGb3JOYXZNZW51KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmV0cmllcyA9IDA7XG4gICAgICAgICAgICBjb25zdCBtYXhSZXRyaWVzID0gMjA7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXROYXZNZW51KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXRyaWVzKys7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXRyaWVzID4gbWF4UmV0cmllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiVGltZW91dCB3YWl0aW5nIGZvciBuYXYgbWVudVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzO1xuIiwgImltcG9ydCBUZW1wbGF0ZUNhY2hlIGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlQ2FjaGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9kc1RhYlRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICdtb2RzLXRhYicpO1xufVxuIiwgImltcG9ydCBUZW1wbGF0ZUNhY2hlIGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlQ2FjaGUnO1xuXG5pbnRlcmZhY2UgTW9kTWV0YURhdGEge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIGF1dGhvcjogc3RyaW5nO1xuICAgIHZlcnNpb246IHN0cmluZztcbiAgICBwcmV2aWV3Pzogc3RyaW5nO1xuICAgIGRvd25sb2FkOiBzdHJpbmc7XG4gICAgcmVwbzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9kSXRlbVRlbXBsYXRlKFxuICAgIG1ldGFEYXRhOiBNb2RNZXRhRGF0YSxcbiAgICB0eXBlOiBcIlBsdWdpblwiIHwgXCJUaGVtZVwiLCBcbiAgICBpbnN0YWxsZWQ6IGJvb2xlYW5cbik6IHN0cmluZyB7XG4gICAgbGV0IHRlbXBsYXRlID0gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ21vZHMtaXRlbScpO1xuICAgIFxuICAgIC8vIEdlbmVyYXRlIGxvZ28gYmxvY2sgYmFzZWQgb24gdHlwZVxuICAgIGxldCBsb2dvQmxvY2sgPSBcIlwiO1xuXG4gICAgaWYodHlwZSA9PT0gXCJUaGVtZVwiKSB7XG4gICAgICAgIGlmKCFtZXRhRGF0YS5wcmV2aWV3KSB7XG4gICAgICAgICAgICAvLyBJZiBubyBwcmV2aWV3IGlzIHByb3ZpZGVkIGZvciB0aGVtZSwgdXNlIGEgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIGxvZ29CbG9jayA9IGBcbiAgICAgICAgPHN2ZyBjbGFzcz1cImljb24tR3hWYllcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTQgM2gxNmExIDEgMCAwIDEgMSAxdjVhMSAxIDAgMCAxLTEgMUg0YTEgMSAwIDAgMS0xLTFWNGExIDEgMCAwIDEgMS0xem0yIDloNmExIDEgMCAwIDEgMSAxdjNoMXY2aC00di02aDF2LTJINWExIDEgMCAwIDEtMS0xdi0yaDJ2MXptMTEuNzMyIDEuNzMybDEuNzY4LTEuNzY4IDEuNzY4IDEuNzY4YTIuNSAyLjUgMCAxIDEtMy41MzYgMHpcIiBzdHlsZT1cImZpbGw6IGN1cnJlbnRjb2xvcjtcIj48L3BhdGg+XG4gICAgICAgIDwvc3ZnPmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBVc2UgdGhlIHByZXZpZXcgaW1hZ2UgZm9yIHRoZW1lIGxvZ29cbiAgICAgICAgICAgIGxvZ29CbG9jayA9IGBcbiAgICAgICAgICAgIDxhIGhyZWY9XCIke21ldGFEYXRhLnByZXZpZXd9XCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9yZWZlcnJlclwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJsb2dvLVdyc0dGXCIgc3JjPVwiJHttZXRhRGF0YS5wcmV2aWV3fVwiIGFsdD1cIlRoZW1lIFByZXZpZXdcIiBsb2FkaW5nPVwibGF6eVwiPlxuICAgICAgICAgICAgPC9hPmA7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBsb2dvQmxvY2sgPSBgXG4gICAgICAgIDxzdmcgY2xhc3M9XCJpY29uLUd4VmJZXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTM0NS42NTAwMDAwMDAwMDAxIDQ1Ni4zMDAwMDAwMDAwMDAyaC03MC44N2MtMi4zNSAwLjAxLTQuNjktMC40My02Ljg2LTEuMjktMi4xOC0wLjg3LTQuMTUtMi4xNC01Ljc5LTMuNzUtMy4zNy0zLjE5LTUuMjctNy41NC01LjI5LTEyLjA3di0yNi4zM2MwLjAzLTQuMDUtMC44MS04LjA3LTIuNDktMTEuNzlzLTQuMTItNy4wNy03LjE3LTkuODljLTcuNzgtNy4yMi0xOS4wNC0xMS4yMi0zMC44LTEwLjkzLTIxLjMzIDAuNDctMzkuMjcgMTguMzUtMzkuMjcgMzkuMDd2MTkuODdjMC4wMSAyLjI0LTAuNDUgNC40OC0xLjM2IDYuNTVzLTIuMjQgMy45NS0zLjkzIDUuNTJjLTMuMzUgMy4yMS03LjkgNS4wMi0xMi42NSA1LjA0aC03MC4xN2MtMTQuNzEgMC4wMS0yOC44My01LjU1LTM5LjIzLTE1LjQ2LTEwLjQyLTkuOTEtMTYuMjgtMjMuMzYtMTYuMjktMzcuNHYtNjYuOTJjMC4wMy00LjUzIDEuOTItOC44NyA1LjI4LTEyLjA3IDMuMzYtMy4yMSA3LjkxLTUuMDEgMTIuNjYtNS4wNGgyNy42MWM5LjE3IDAgMTguMDQtMy43MSAyNS4wMi0xMC40NiAzLjg5LTMuNzIgNi45OC04LjE1IDkuMDctMTMuMDJhMzcuMiAzNy4yIDAgMCAwIDMuMDktMTUuNGMtMC4zLTIwLjE1LTE3LjY0LTM3LjE3LTM3Ljk4LTM3LjE3aC0yNi43MWMtMi4zNSAwLjAxLTQuNjktMC40My02Ljg3LTEuMjlhMTcuNyAxNy43IDAgMCAxLTUuNzktMy43NWMtMy4zNy0zLjE5LTUuMjYtNy41NC01LjI4LTEyLjA3di02Ni45MmE1MC45IDUwLjkgMCAwIDEgNC4xOS0yMC4yNWMyLjc2LTYuNDMgNi44Ni0xMi4yNSAxMi4wNi0xNy4xMSAxMC4zOS05LjkxIDI0LjQ4LTE1LjQ4IDM5LjE3LTE1LjVoNTUuMDJjMi4xMiAwLjAxIDQuMTYtMC43NyA1LjY4LTIuMTkgMC43My0wLjcxIDEuMzItMS41NSAxLjcxLTIuNDkgMC40LTAuOTMgMC42LTEuOTIgMC41OC0yLjkydi02LjE4YTU5IDU5IDAgMCAxIDUuMDgtMjQuMDVjMy4zOC03LjYyIDguMjktMTQuNTMgMTQuNDYtMjAuMzUgNi4xOS01LjggMTMuNTUtMTAuMzYgMjEuNjItMTMuNGE2OS44IDY5LjggMCAwIDEgMjUuMzItNC40N2MzNS4zOCAwLjU3IDY0LjE5IDI4LjkgNjQuMTkgNjMuMDN2NS40MmMtMC4wMyAxLjUxIDAuNDIgMyAxLjI5IDQuMjVhNy43MyA3LjczIDAgMCAwIDMuNjEgMi44MWMwLjk4IDAuMzcgMi4wMyAwLjU2IDMuMDcgMC41NGg1NS4wMmE1Ni40IDU2LjQgMCAwIDEgMjAuOTMgMy45OWMxMy40IDUuMzEgMjQuMDQgMTUuNDYgMjkuNiAyOC4yNCAyLjc3IDYuMzIgNC4yIDEzLjExIDQuMTkgMTkuOTZ2NTIuNDdjLTAuMDMgMS41MiAwLjQyIDMuMDEgMS4zIDQuMjZhNy42NiA3LjY2IDAgMCAwIDMuNiAyLjgxYzAuOTggMC4zNyAyLjAzIDAuNTYgMy4wNyAwLjU0aDUuNjhjMzYuNDggMCA2Ni4wOSAyNy41NyA2Ni4wOSA2MS40MSAwIDM0Ljc5LTI5LjMxIDYzLjEyLTY1LjI5IDYzLjEyaC02LjQ4Yy0yLjEyLTAuMDEtNC4xNSAwLjc4LTUuNjggMi4xOWE3LjQgNy40IDAgMCAwLTEuNzEgMi40OWMtMC40IDAuOTMtMC42IDEuOTMtMC41OCAyLjkzdjUzLjIzYzAuMDEgNi44NS0xLjQyIDEzLjY0LTQuMTkgMTkuOTYtNS41NiAxMi43OC0xNi4yIDIyLjkzLTI5LjYgMjguMjRhNTYgNTYgMCAwIDEtMjAuOTMgMy45OVwiIHN0eWxlPVwiZmlsbDogY3VycmVudGNvbG9yO1wiPjwvcGF0aD5cbiAgICAgICAgPC9zdmc+YFxuICAgIH1cblxuICAgIC8vIFJlcGxhY2UgbWV0YWRhdGEgcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgbWV0YUtleXMgPSBbJ25hbWUnLCAnZGVzY3JpcHRpb24nLCAnYXV0aG9yJywgJ3ZlcnNpb24nXSBhcyBjb25zdDtcbiAgICBtZXRhS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChge3tcXFxccyoke2tleX1cXFxccyp9fWAsICdnJyk7XG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShyZWdleCwgbWV0YURhdGFba2V5XSB8fCAnJyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGVtcGxhdGVcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccyp0eXBlXFxzKlxcfVxcfS9nLCB0eXBlKVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmFjdGlvbmJ0blRpdGxlXFxzKlxcfVxcfS9nLCBpbnN0YWxsZWQgPyBcIlVuaW5zdGFsbFwiIDogXCJJbnN0YWxsXCIpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgYWN0aW9uYnRuQ2xhc3MgfX1cIiwgaW5zdGFsbGVkID8gXCJ1bmluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci1vVjRZb1wiIDogXCJpbnN0YWxsLWJ1dHRvbi1jb250YWluZXIteWZjcTVcIilcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBkb3dubG9hZCB9fVwiLCBtZXRhRGF0YS5kb3dubG9hZClcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyByZXBvIH19XCIsIG1ldGFEYXRhLnJlcG8pXG4gICAgICAgIC5yZXBsYWNlKFwiPCEtLSB0aGVtZSBwcmV2aWV3IGhlcmUgLS0+XCIsIGxvZ29CbG9jaylcbiAgICAgICAgLnJlcGxhY2UoXCI8IS0tIHBsdWdpbiBpY29uIGhlcmUgLS0+XCIsIFwiXCIpOyBcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFib3V0Q2F0ZWdvcnlUZW1wbGF0ZShcbiAgICB2ZXJzaW9uOiBzdHJpbmcsIFxuICAgIGNoZWNrRm9yVXBkYXRlc09uU3RhcnR1cDogYm9vbGVhbiwgXG4gICAgZGlzY29yZFJpY2hQcmVzZW5jZTogYm9vbGVhbiwgXG4gICAgZW5hYmxlVHJhbnNwYXJlbnRUaGVtZXM6IGJvb2xlYW5cbik6IHN0cmluZyB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZUNhY2hlLmxvYWQoX19kaXJuYW1lLCAnYWJvdXQtY2F0ZWdvcnknKTtcbiAgICBcbiAgICByZXR1cm4gdGVtcGxhdGVcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyB2ZXJzaW9uIH19XCIsIHZlcnNpb24pXG4gICAgICAgIC5yZXBsYWNlKFwie3sgY2hlY2tGb3JVcGRhdGVzT25TdGFydHVwIH19XCIsIGNoZWNrRm9yVXBkYXRlc09uU3RhcnR1cCA/IFwiY2hlY2tlZFwiIDogXCJcIilcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBkaXNjb3JkcmljaHByZXNlbmNlIH19XCIsIGRpc2NvcmRSaWNoUHJlc2VuY2UgPyBcImNoZWNrZWRcIiA6IFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgZW5hYmxlVHJhbnNwYXJlbnRUaGVtZXMgfX1cIiwgZW5hYmxlVHJhbnNwYXJlbnRUaGVtZXMgPyBcImNoZWNrZWRcIiA6IFwiXCIpO1xufVxuIiwgImltcG9ydCBUZW1wbGF0ZUNhY2hlIGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlQ2FjaGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFRoZW1lVGVtcGxhdGUoYXBwbGllZDogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZUNhY2hlLmxvYWQoX19kaXJuYW1lLCAnZGVmYXVsdC10aGVtZScpO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIC5yZXBsYWNlKFwie3sgZGlzYWJsZWQgfX1cIiwgYXBwbGllZCA/IFwiZGlzYWJsZWRcIiA6IFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgbGFiZWwgfX1cIiwgYXBwbGllZCA/IFwiQXBwbGllZFwiIDogXCJBcHBseVwiKVxuICAgICAgICAucmVwbGFjZShcInt7IGJhY2tncm91bmRDb2xvciB9fVwiLCBhcHBsaWVkID8gXCJ2YXIoLS1vdmVybGF5LWNvbG9yKVwiIDogXCJ2YXIoLS1zZWNvbmRhcnktYWNjZW50LWNvbG9yKVwiKTtcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhY2tCdXR0b24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ2JhY2stYnRuJyk7XG59XG4iLCAiaW1wb3J0IHsgUGxhdGZvcm1NYW5hZ2VyIH0gZnJvbSBcIi4uL3BsYXRmb3JtL1BsYXRmb3JtTWFuYWdlclwiO1xuaW1wb3J0IHsgQ2FwYWNpdG9yUGxhdGZvcm0gfSBmcm9tIFwiLi4vcGxhdGZvcm0vQ2FwYWNpdG9yUGxhdGZvcm1cIjtcbmltcG9ydCBTZXR0aW5ncyBmcm9tIFwiLi4vY29yZS9TZXR0aW5nc1wiO1xuaW1wb3J0IHByb3BlcnRpZXMgZnJvbSBcIi4uL2NvcmUvUHJvcGVydGllc1wiO1xuaW1wb3J0IE1vZE1hbmFnZXIgZnJvbSBcIi4uL2NvcmUvTW9kTWFuYWdlclwiO1xuaW1wb3J0IEhlbHBlcnMgZnJvbSBcIi4uL3V0aWxzL0hlbHBlcnNcIjtcbmltcG9ydCB7IGdldE1vZHNUYWJUZW1wbGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL21vZHMtdGFiL21vZHNUYWJcIjtcbmltcG9ydCB7IGdldE1vZEl0ZW1UZW1wbGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL21vZHMtaXRlbS9tb2RzSXRlbVwiO1xuaW1wb3J0IHsgZ2V0QWJvdXRDYXRlZ29yeVRlbXBsYXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvYWJvdXQtY2F0ZWdvcnkvYWJvdXRDYXRlZ29yeVwiO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdFRoZW1lVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9kZWZhdWx0LXRoZW1lL2RlZmF1bHRUaGVtZVwiO1xuaW1wb3J0IHsgZ2V0QmFja0J1dHRvbiB9IGZyb20gXCIuLi9jb21wb25lbnRzL2JhY2stYnRuL2JhY2tCdG5cIjtcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge1xuICAgIFNUT1JBR0VfS0VZUyxcbiAgICBTRUxFQ1RPUlMsXG4gICAgQ0xBU1NFUyxcbiAgICBGSUxFX0VYVEVOU0lPTlMsXG59IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCBFeHRyYWN0TWV0YURhdGEgZnJvbSBcIi4uL3V0aWxzL0V4dHJhY3RNZXRhRGF0YVwiO1xuaW1wb3J0IHsgTm9kZUpTIH0gZnJvbSAnY2FwYWNpdG9yLW5vZGVqcyc7XG5pbXBvcnQgTG9nTWFuYWdlciBmcm9tIFwiLi4vY29yZS9Mb2dNYW5hZ2VyXCI7XG5cbi8vIEluaXRpYWxpemUgcGxhdGZvcm0gZm9yIENhcGFjaXRvclxuUGxhdGZvcm1NYW5hZ2VyLnNldFBsYXRmb3JtKG5ldyBDYXBhY2l0b3JQbGF0Zm9ybSgpKTtcblxuLy8gSG9vayBjb25zb2xlIGZvciBsb2dzIG1lbnVcbkxvZ01hbmFnZXIuaG9va0NvbnNvbGUoKTtcblxuLy8gTGlzdGVuIGZvciBzZXJ2ZXIgbG9ncyBhbmQgZXJyb3JzXG5Ob2RlSlMuYWRkTGlzdGVuZXIoJ2xvZycsIChkYXRhKSA9PiB7XG4gICAgTG9nTWFuYWdlci5hZGRMb2coJ0lORk8nLCBgW1NlcnZlcl0gJHtkYXRhLmFyZ3Muam9pbignICcpfWApO1xuICAgIGNvbnNvbGUubG9nKCdbU2VydmVyXScsIC4uLmRhdGEuYXJncyk7XG59KTtcblxuTm9kZUpTLmFkZExpc3RlbmVyKCdlcnJvcicsIChkYXRhKSA9PiB7XG4gICAgTG9nTWFuYWdlci5hZGRMb2coJ0VSUk9SJywgYFtTZXJ2ZXIgRXJyb3JdICR7ZGF0YS5hcmdzLmpvaW4oJyAnKX1gKTtcbiAgICBjb25zb2xlLmVycm9yKCdbU2VydmVyIEVycm9yXScsIC4uLmRhdGEuYXJncyk7XG4gICAgSGVscGVycy5zaG93QWxlcnQoJ2Vycm9yJywgJ1NlcnZlciBFcnJvcicsIGRhdGEuYXJncy5qb2luKCcgJyksIFsnT0snXSk7XG59KTtcblxuLy8gTW9jayBpcGNSZW5kZXJlciBmb3IgQW5kcm9pZFxuY29uc3QgaXBjUmVuZGVyZXIgPSB7XG4gICAgaW52b2tlOiBhc3luYyAoY2hhbm5lbDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhgW0FuZHJvaWRdIEludm9rZSAke2NoYW5uZWx9YCwgYXJncyk7XG4gICAgICAgIGlmIChjaGFubmVsID09PSAnZ2V0LXRyYW5zcGFyZW5jeS1zdGF0dXMnKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChjaGFubmVsID09PSAnZXh0cmFjdC1lbWJlZGRlZC1zdWJ0aXRsZXMnKSByZXR1cm4gW107XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgc2VuZDogKGNoYW5uZWw6IHN0cmluZywgLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oYFtBbmRyb2lkXSBTZW5kICR7Y2hhbm5lbH1gLCBhcmdzKTtcbiAgICB9LFxuICAgIG9uOiAoY2hhbm5lbDogc3RyaW5nLCBsaXN0ZW5lcjogYW55KSA9PiB7XG4gICAgICAgIC8vIE5vLW9wXG4gICAgfVxufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgICAvLyBJbml0aWFsaXplIHBsYXRmb3JtXG4gICAgaWYgKCFQbGF0Zm9ybU1hbmFnZXIuY3VycmVudCkgUGxhdGZvcm1NYW5hZ2VyLnNldFBsYXRmb3JtKG5ldyBDYXBhY2l0b3JQbGF0Zm9ybSgpKTtcbiAgICBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5pbml0KCk7XG5cbiAgICAvLyBJbmplY3QgQ1NTIHRvIGhpZGUgZnVsbHNjcmVlbiBidXR0b25cbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGUudGV4dENvbnRlbnQgPSBgXG4gICAgICAgIFt0aXRsZT1cIkZ1bGxzY3JlZW5cIl0sIFxuICAgICAgICBbdGl0bGU9XCJFeGl0IEZ1bGxzY3JlZW5cIl0sIFxuICAgICAgICBidXR0b25bYXJpYS1sYWJlbD1cIkZ1bGxzY3JlZW5cIl0sXG4gICAgICAgIC5mdWxsc2NyZWVuLXRvZ2dsZSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICBgO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gICAgLy8gRXhwb3NlIEFQSSBmb3IgaW5qZWN0ZWQgc2NyaXB0c1xuICAgICh3aW5kb3cgYXMgYW55KS5zdHJlbWlvRW5oYW5jZWQgPSB7XG4gICAgICAgIGFwcGx5VGhlbWU6IGFzeW5jICh0aGVtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAvLyBhcHBseVVzZXJUaGVtZSByZWFkcyBmcm9tIGxvY2FsU3RvcmFnZSB3aGljaCBpcyB1cGRhdGVkIGJ5IHRoZSBpbmplY3RlZCBzY3JpcHRcbiAgICAgICAgICAgIGF3YWl0IGFwcGx5VXNlclRoZW1lKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5pdGlhbGl6ZVVzZXJTZXR0aW5ncygpO1xuXG4gICAgLy8gQXBwbHkgZW5hYmxlZCB0aGVtZVxuICAgIGF3YWl0IGFwcGx5VXNlclRoZW1lKCk7XG5cbiAgICAvLyBMb2FkIGVuYWJsZWQgcGx1Z2luc1xuICAgIGF3YWl0IGxvYWRFbmFibGVkUGx1Z2lucygpO1xuXG4gICAgLy8gSGFuZGxlIG5hdmlnYXRpb24gY2hhbmdlc1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IGNoZWNrU2V0dGluZ3MoKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBTZXR0aW5ncyBwYWdlIG9wZW5lZFxuYXN5bmMgZnVuY3Rpb24gY2hlY2tTZXR0aW5ncygpIHtcbiAgICBpZiAoIWxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCIjL3NldHRpbmdzXCIpKSByZXR1cm47XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGFbaHJlZj1cIiNzZXR0aW5ncy1lbmhhbmNlZFwiXWApKSByZXR1cm47XG5cbiAgICBNb2RNYW5hZ2VyLmFkZEFwcGx5VGhlbWVGdW5jdGlvbigpO1xuXG4gICAgY29uc3QgdGhlbWVzUGF0aCA9IHByb3BlcnRpZXMudGhlbWVzUGF0aDtcbiAgICBjb25zdCBwbHVnaW5zUGF0aCA9IHByb3BlcnRpZXMucGx1Z2luc1BhdGg7XG5cbiAgICBsZXQgYWxsVGhlbWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBhbGxQbHVnaW5zOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgYWxsVGhlbWVzID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZGRpcih0aGVtZXNQYXRoKTtcbiAgICAgICAgYWxsUGx1Z2lucyA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRkaXIocGx1Z2luc1BhdGgpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gcmVhZCB0aGVtZXMvcGx1Z2lucyBkaXJlY3RvcmllczogXCIgKyBlKTtcbiAgICB9XG5cbiAgICBjb25zdCB0aGVtZXNMaXN0ID0gYWxsVGhlbWVzLmZpbHRlcihmaWxlTmFtZSA9PiBmaWxlTmFtZS5lbmRzV2l0aChGSUxFX0VYVEVOU0lPTlMuVEhFTUUpKTtcbiAgICBjb25zdCBwbHVnaW5zTGlzdCA9IGFsbFBsdWdpbnMuZmlsdGVyKGZpbGVOYW1lID0+IGZpbGVOYW1lLmVuZHNXaXRoKEZJTEVfRVhURU5TSU9OUy5QTFVHSU4pKTtcblxuICAgIGxvZ2dlci5pbmZvKFwiQWRkaW5nICdFbmhhbmNlZCcgc2VjdGlvbnMuLi5cIik7XG4gICAgU2V0dGluZ3MuYWRkU2VjdGlvbihcImVuaGFuY2VkXCIsIFwiRW5oYW5jZWRcIik7XG4gICAgU2V0dGluZ3MuYWRkQ2F0ZWdvcnkoXCJUaGVtZXNcIiwgXCJlbmhhbmNlZFwiLCBnZXRUaGVtZUljb24oKSk7XG4gICAgU2V0dGluZ3MuYWRkQ2F0ZWdvcnkoXCJQbHVnaW5zXCIsIFwiZW5oYW5jZWRcIiwgZ2V0UGx1Z2luSWNvbigpKTtcbiAgICBTZXR0aW5ncy5hZGRDYXRlZ29yeShcIkFib3V0XCIsIFwiZW5oYW5jZWRcIiwgZ2V0QWJvdXRJY29uKCkpO1xuXG4gICAgU2V0dGluZ3MuYWRkQnV0dG9uKFwiT3BlbiBUaGVtZXMgRm9sZGVyXCIsIFwib3BlbnRoZW1lc2ZvbGRlckJ0blwiLCBTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKTtcbiAgICBTZXR0aW5ncy5hZGRCdXR0b24oXCJPcGVuIFBsdWdpbnMgRm9sZGVyXCIsIFwib3BlbnBsdWdpbnNmb2xkZXJCdG5cIiwgU0VMRUNUT1JTLlBMVUdJTlNfQ0FURUdPUlkpO1xuXG4gICAgd3JpdGVBYm91dCgpO1xuXG4gICAgLy8gQnJvd3NlIHBsdWdpbnMvdGhlbWVzIGZyb20gc3RyZW1pby1lbmhhbmNlZC1yZWdpc3RyeVxuICAgIHNldHVwQnJvd3NlTW9kc0J1dHRvbigpO1xuXG4gICAgLy8gQWRkIHRoZW1lcyB0byBzZXR0aW5nc1xuICAgIEhlbHBlcnMud2FpdEZvckVsbShTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKS50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gRGVmYXVsdCB0aGVtZVxuICAgICAgICBjb25zdCBpc0N1cnJlbnRUaGVtZURlZmF1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSkgPT09IFwiRGVmYXVsdFwiO1xuICAgICAgICBjb25zdCBkZWZhdWx0VGhlbWVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkZWZhdWx0VGhlbWVDb250YWluZXIuaW5uZXJIVE1MID0gZ2V0RGVmYXVsdFRoZW1lVGVtcGxhdGUoaXNDdXJyZW50VGhlbWVEZWZhdWx0KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKT8uYXBwZW5kQ2hpbGQoZGVmYXVsdFRoZW1lQ29udGFpbmVyKTtcblxuICAgICAgICAvLyBBZGQgaW5zdGFsbGVkIHRoZW1lc1xuICAgICAgICBmb3IgKGNvbnN0IHRoZW1lIG9mIHRoZW1lc0xpc3QpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhlbWVQYXRoID0gam9pbih0aGVtZXNQYXRoLCB0aGVtZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRGaWxlKHRoZW1lUGF0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSBFeHRyYWN0TWV0YURhdGEuZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQoY29udGVudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAobWV0YURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFEYXRhLm5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNldHRpbmdzLmFkZEl0ZW0oXCJ0aGVtZVwiLCB0aGVtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1ldGFEYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGFEYXRhLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcjogbWV0YURhdGEuYXV0aG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IG1ldGFEYXRhLnZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVXJsOiBtZXRhRGF0YS51cGRhdGVVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBtZXRhRGF0YS5zb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGxvYWQgdGhlbWUgbWV0YWRhdGEgZm9yICR7dGhlbWV9OiAke2V9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KS5jYXRjaChlcnIgPT4gbG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIHNldHVwIHRoZW1lczogXCIgKyBlcnIpKTtcblxuICAgIC8vIEFkZCBwbHVnaW5zIHRvIHNldHRpbmdzXG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgcGx1Z2luc0xpc3QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBsdWdpblBhdGggPSBqb2luKHBsdWdpbnNQYXRoLCBwbHVnaW4pO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRGaWxlKHBsdWdpblBhdGgpO1xuICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSBFeHRyYWN0TWV0YURhdGEuZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQoY29udGVudCk7XG5cbiAgICAgICAgICAgIGlmIChtZXRhRGF0YSkge1xuICAgICAgICAgICAgICAgIFNldHRpbmdzLmFkZEl0ZW0oXCJwbHVnaW5cIiwgcGx1Z2luLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG1ldGFEYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhRGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yOiBtZXRhRGF0YS5hdXRob3IsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IG1ldGFEYXRhLnZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVVybDogbWV0YURhdGEudXBkYXRlVXJsLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IG1ldGFEYXRhLnNvdXJjZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBsb2FkIHBsdWdpbiBtZXRhZGF0YSBmb3IgJHtwbHVnaW59OiAke2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNb2RNYW5hZ2VyLnRvZ2dsZVBsdWdpbkxpc3RlbmVyKCk7XG4gICAgTW9kTWFuYWdlci5zY3JvbGxMaXN0ZW5lcigpO1xuICAgIC8vIE1vZE1hbmFnZXIub3BlblRoZW1lc0ZvbGRlcigpOyAvLyBVc2VzIHBsYXRmb3JtIG9wZW5QYXRoIHdoaWNoIGxvZ3Mgbm90IHN1cHBvcnRlZCBvbiBBbmRyb2lkXG4gICAgLy8gTW9kTWFuYWdlci5vcGVuUGx1Z2luc0ZvbGRlcigpO1xuXG4gICAgLy8gT3ZlcnJpZGUgb3BlbiBmb2xkZXIgYnV0dG9ucyB0byBkbyBzb21ldGhpbmcgZWxzZSBvciBqdXN0IGxvZz9cbiAgICAvLyBNb2RNYW5hZ2VyLm9wZW5UaGVtZXNGb2xkZXIgdXNlcyBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5vcGVuUGF0aFxuICAgIC8vIEluIENhcGFjaXRvclBsYXRmb3JtLCBpdCBqdXN0IGxvZ3MuXG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVVc2VyU2V0dGluZ3MoKTogdm9pZCB7XG4gICAgY29uc3QgZGVmYXVsdHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgIFtTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TXTogXCJbXVwiLFxuICAgICAgICBbU1RPUkFHRV9LRVlTLkNIRUNLX1VQREFURVNfT05fU1RBUlRVUF06IFwiZmFsc2VcIixcbiAgICAgICAgW1NUT1JBR0VfS0VZUy5ESVNDT1JEX1JQQ106IFwiZmFsc2VcIixcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBba2V5LCBkZWZhdWx0VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlZmF1bHRzKSkge1xuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gYXBwbHlVc2VyVGhlbWUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY3VycmVudFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkNVUlJFTlRfVEhFTUUpO1xuXG4gICAgaWYgKCFjdXJyZW50VGhlbWUgfHwgY3VycmVudFRoZW1lID09PSBcIkRlZmF1bHRcIikge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSwgXCJEZWZhdWx0XCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGhlbWVQYXRoID0gam9pbihwcm9wZXJ0aWVzLnRoZW1lc1BhdGgsIGN1cnJlbnRUaGVtZSk7XG5cbiAgICAvLyBJbiBjYXBhY2l0b3IsIHdlIG5lZWQgdG8gcmVhZCB0aGUgZmlsZSBjb250ZW50IGFuZCBpbmplY3QgaXQgYXMgc3R5bGVcbiAgICAvLyBiZWNhdXNlIGZpbGU6Ly8gVVJMcyBtaWdodCBub3Qgd29yayBvciBhcmUgcmVzdHJpY3RlZC5cbiAgICAvLyBFbGVjdHJvbiBpbXBsZW1lbnRhdGlvbiB1c2VzIHBhdGhUb0ZpbGVVUkwgd2hpY2ggcmVzdWx0cyBpbiBmaWxlOi8vLlxuICAgIC8vIExldCdzIHRyeSB0byByZWFkIGNvbnRlbnQgYW5kIGluamVjdCA8c3R5bGU+IGluc3RlYWQgb2YgPGxpbms+LlxuXG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKCFhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5leGlzdHModGhlbWVQYXRoKSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVlTLkNVUlJFTlRfVEhFTUUsIFwiRGVmYXVsdFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBleGlzdGluZyB0aGVtZSBpZiBwcmVzZW50XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWN0aXZlVGhlbWVcIik/LnJlbW92ZSgpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5yZWFkRmlsZSh0aGVtZVBhdGgpO1xuXG4gICAgICAgIGNvbnN0IHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImFjdGl2ZVRoZW1lXCIpO1xuICAgICAgICBzdHlsZUVsZW1lbnQudGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gYXBwbHkgdGhlbWU6IFwiICsgZSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkRW5hYmxlZFBsdWdpbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGx1Z2luc1BhdGggPSBwcm9wZXJ0aWVzLnBsdWdpbnNQYXRoO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICghYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuZXhpc3RzKHBsdWdpbnNQYXRoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGFsbFBsdWdpbnMgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5yZWFkZGlyKHBsdWdpbnNQYXRoKTtcbiAgICAgICAgY29uc3QgcGx1Z2luc1RvTG9hZCA9IGFsbFBsdWdpbnMuZmlsdGVyKGZpbGVOYW1lID0+IGZpbGVOYW1lLmVuZHNXaXRoKEZJTEVfRVhURU5TSU9OUy5QTFVHSU4pKTtcblxuICAgICAgICBjb25zdCBlbmFibGVkUGx1Z2luczogc3RyaW5nW10gPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUykgfHwgXCJbXVwiXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBwbHVnaW4gb2YgcGx1Z2luc1RvTG9hZCkge1xuICAgICAgICAgICAgaWYgKGVuYWJsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbikpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBNb2RNYW5hZ2VyLmxvYWRQbHVnaW4ocGx1Z2luKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIGxvYWQgcGx1Z2luczogXCIgKyBlKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJyb3dzZU1vZHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2V0dGluZ3NDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuU0VUVElOR1NfQ09OVEVOVCk7XG4gICAgaWYgKCFzZXR0aW5nc0NvbnRlbnQpIHJldHVybjtcblxuICAgIHNldHRpbmdzQ29udGVudC5pbm5lckhUTUwgPSBnZXRNb2RzVGFiVGVtcGxhdGUoKTtcblxuICAgIGNvbnN0IG1vZHMgPSBhd2FpdCBNb2RNYW5hZ2VyLmZldGNoTW9kcygpO1xuICAgIGNvbnN0IG1vZHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RzLWxpc3RcIik7XG4gICAgaWYgKCFtb2RzTGlzdCkgcmV0dXJuO1xuXG4gICAgaW50ZXJmYWNlIFJlZ2lzdHJ5TW9kIHtcbiAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgICAgICBhdXRob3I6IHN0cmluZztcbiAgICAgICAgdmVyc2lvbjogc3RyaW5nO1xuICAgICAgICBwcmV2aWV3Pzogc3RyaW5nO1xuICAgICAgICBkb3dubG9hZDogc3RyaW5nO1xuICAgICAgICByZXBvOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgLy8gQWRkIHBsdWdpbnNcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiAobW9kcy5wbHVnaW5zIGFzIFJlZ2lzdHJ5TW9kW10pKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbGxlZCA9IGF3YWl0IE1vZE1hbmFnZXIuaXNQbHVnaW5JbnN0YWxsZWQoSGVscGVycy5nZXRGaWxlTmFtZUZyb21VcmwocGx1Z2luLmRvd25sb2FkKSk7XG4gICAgICAgIG1vZHNMaXN0LmlubmVySFRNTCArPSBnZXRNb2RJdGVtVGVtcGxhdGUocGx1Z2luLCBcIlBsdWdpblwiLCBpbnN0YWxsZWQpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGVtZXNcbiAgICBmb3IgKGNvbnN0IHRoZW1lIG9mIChtb2RzLnRoZW1lcyBhcyBSZWdpc3RyeU1vZFtdKSkge1xuICAgICAgICBjb25zdCBpbnN0YWxsZWQgPSBhd2FpdCBNb2RNYW5hZ2VyLmlzVGhlbWVJbnN0YWxsZWQoSGVscGVycy5nZXRGaWxlTmFtZUZyb21VcmwodGhlbWUuZG93bmxvYWQpKTtcbiAgICAgICAgbW9kc0xpc3QuaW5uZXJIVE1MICs9IGdldE1vZEl0ZW1UZW1wbGF0ZSh0aGVtZSwgXCJUaGVtZVwiLCBpbnN0YWxsZWQpO1xuICAgIH1cblxuICAgIC8vIFNldCB1cCBhY3Rpb24gYnV0dG9uc1xuICAgIGNvbnN0IGFjdGlvbkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vZEFjdGlvbkJ0blwiKTtcbiAgICBhY3Rpb25CdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBidG4uZ2V0QXR0cmlidXRlKFwiZGF0YS1saW5rXCIpO1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IGJ0bi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIik/LnRvTG93ZXJDYXNlKCkgYXMgXCJwbHVnaW5cIiB8IFwidGhlbWVcIjtcblxuICAgICAgICAgICAgaWYgKCFsaW5rIHx8ICF0eXBlKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChidG4uZ2V0QXR0cmlidXRlKFwidGl0bGVcIikgPT09IFwiSW5zdGFsbFwiKSB7XG4gICAgICAgICAgICAgICAgTW9kTWFuYWdlci5kb3dubG9hZE1vZChsaW5rLCB0eXBlKTtcbiAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZShDTEFTU0VTLklOU1RBTExfQlVUVE9OKTtcbiAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChDTEFTU0VTLlVOSU5TVEFMTF9CVVRUT04pO1xuICAgICAgICAgICAgICAgIGJ0bi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIlVuaW5zdGFsbFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYnRuLmNoaWxkTm9kZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYnRuLmNoaWxkTm9kZXNbMV0udGV4dENvbnRlbnQgPSBcIlVuaW5zdGFsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgTW9kTWFuYWdlci5yZW1vdmVNb2QoSGVscGVycy5nZXRGaWxlTmFtZUZyb21VcmwobGluayksIHR5cGUpO1xuICAgICAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKENMQVNTRVMuVU5JTlNUQUxMX0JVVFRPTik7XG4gICAgICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoQ0xBU1NFUy5JTlNUQUxMX0JVVFRPTik7XG4gICAgICAgICAgICAgICAgYnRuLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIFwiSW5zdGFsbFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYnRuLmNoaWxkTm9kZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYnRuLmNoaWxkTm9kZXNbMV0udGV4dENvbnRlbnQgPSBcIkluc3RhbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU2VhcmNoIGJhciBsb2dpY1xuICAgIHNldHVwU2VhcmNoQmFyKCk7XG5cbiAgICAvLyBBZGQgYmFjayBidXR0b25cbiAgICBjb25zdCBob3Jpem9udGFsTmF2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JTLkhPUklaT05UQUxfTkFWKTtcbiAgICBjb25zdCBob3Jpem9udGFsTmF2ID0gaG9yaXpvbnRhbE5hdnNbMV07XG4gICAgaWYgKGhvcml6b250YWxOYXYpIHtcbiAgICAgICAgaG9yaXpvbnRhbE5hdi5pbm5lckhUTUwgPSBnZXRCYWNrQnV0dG9uKCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFjay1idG5cIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvJztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9zZXR0aW5ncyc7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXR1cFNlYXJjaEJhcigpOiB2b2lkIHtcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlNFQVJDSF9JTlBVVCkgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBjb25zdCBhZGRvbnNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5BRERPTlNfTElTVF9DT05UQUlORVIpO1xuXG4gICAgaWYgKCFzZWFyY2hJbnB1dCB8fCAhYWRkb25zQ29udGFpbmVyKSByZXR1cm47XG5cbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBzZWFyY2hJbnB1dC52YWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgbW9kSXRlbXMgPSBhZGRvbnNDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUlMuQURET05fQ09OVEFJTkVSKTtcblxuICAgICAgICBtb2RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gaXRlbS5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5OQU1FX0NPTlRBSU5FUik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpIHx8IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGl0ZW0ucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuREVTQ1JJUFRJT05fSVRFTSk/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpIHx8IFwiXCI7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gaXRlbS5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5UWVBFU19DT05UQUlORVIpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSB8fCBcIlwiO1xuXG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IG5hbWUuaW5jbHVkZXMoZmlsdGVyKSB8fCBkZXNjcmlwdGlvbi5pbmNsdWRlcyhmaWx0ZXIpIHx8IHR5cGUuaW5jbHVkZXMoZmlsdGVyKTtcbiAgICAgICAgICAgIChpdGVtIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gbWF0Y2ggPyBcIlwiIDogXCJub25lXCI7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzZXR1cEJyb3dzZU1vZHNCdXR0b24oKTogdm9pZCB7XG4gICAgSGVscGVycy53YWl0Rm9yRWxtKCcjYnJvd3NlUGx1Z2luc1RoZW1lc0J0bicpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJyb3dzZVBsdWdpbnNUaGVtZXNCdG5cIik7XG4gICAgICAgIGJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJyb3dzZU1vZHMpO1xuICAgIH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuZnVuY3Rpb24gd3JpdGVBYm91dCgpOiB2b2lkIHtcbiAgICBIZWxwZXJzLndhaXRGb3JFbG0oU0VMRUNUT1JTLkFCT1VUX0NBVEVHT1JZKS50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgYWJvdXRDYXRlZ29yeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLkFCT1VUX0NBVEVHT1JZKTtcbiAgICAgICAgaWYgKGFib3V0Q2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIC8vIEhhcmRjb2RlZCB2YWx1ZXMgZm9yIEFuZHJvaWRcbiAgICAgICAgICAgIGFib3V0Q2F0ZWdvcnkuaW5uZXJIVE1MICs9IGdldEFib3V0Q2F0ZWdvcnlUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICBcIkFuZHJvaWQtdjEuMC4wXCIsXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEFkZCBPcGVuIExvZ3MgYnV0dG9uXG4gICAgICAgICAgICBTZXR0aW5ncy5hZGRCdXR0b24oXCJPcGVuIExvZ3NcIiwgXCJvcGVuTG9nc0J0blwiLCBTRUxFQ1RPUlMuQUJPVVRfQ0FURUdPUlkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBBdHRhY2ggbGlzdGVuZXJcbiAgICAgICAgICAgIEhlbHBlcnMud2FpdEZvckVsbShcIiNvcGVuTG9nc0J0blwiKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW5Mb2dzQnRuXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBMb2dNYW5hZ2VyLnNob3dMb2dzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pLmNhdGNoKGVyciA9PiBsb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gd3JpdGUgYWJvdXQgc2VjdGlvbjogXCIgKyBlcnIpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWJvdXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgIDxnPjxwYXRoIGZpbGw9XCJub25lXCIgZD1cIk0wIDBoMjR2MjRIMHpcIj48L3BhdGg+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTIgMjJDNi40NzcgMjIgMiAxNy41MjMgMiAxMlM2LjQ3NyAyIDEyIDJzMTAgNC40NzcgMTAgMTAtNC40NzcgMTAtMTAgMTB6bS0xLTExdjZoMnYtNmgtMnptMC00djJoMlY3aC0yelwiIHN0eWxlPVwiZmlsbDpjdXJyZW50Y29sb3JcIj48L3BhdGg+PC9nPjwvc3ZnPmA7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1lSWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICA8Zz48cGF0aCBmaWxsPVwibm9uZVwiIGQ9XCJNMCAwaDI0djI0SDB6XCI+PC9wYXRoPlxuICAgICAgICA8cGF0aCBkPVwiTTQgM2gxNmExIDEgMCAwIDEgMSAxdjVhMSAxIDAgMCAxLTEgMUg0YTEgMSAwIDAgMS0xLTFWNGExIDEgMCAwIDEgMS0xem0yIDloNmExIDEgMCAwIDEgMSAxdjNoMXY2aC00di02aDF2LTJINWExIDEgMCAwIDEtMS0xdi0yaDJ2MXptMTEuNzMyIDEuNzMybDEuNzY4LTEuNzY4IDEuNzY4IDEuNzY4YTIuNSAyLjUgMCAxIDEtMy41MzYgMHpcIiBzdHlsZT1cImZpbGw6IGN1cnJlbnRjb2xvcjtcIj48L3BhdGg+PC9nPjwvc3ZnPmA7XG59XG5cbmZ1bmN0aW9uIGdldFBsdWdpbkljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDxzdmcgaWNvbj1cImFkZG9ucy1vdXRsaW5lXCIgY2xhc3M9XCJpY29uXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgc3R5bGU9XCJmaWxsOiBjdXJyZW50Y29sb3I7XCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNNDEzLjcgMjQ2LjFIMzg2Yy0wLjUzLTAuMDEtMS4wMy0wLjIzLTEuNC0wLjYtMC4zNy0wLjM3LTAuNTktMC44Ny0wLjYtMS40di03Ny4yYTM4Ljk0IDM4Ljk0IDAgMCAwLTExLjQtMjcuNSAzOC45NCAzOC45NCAwIDAgMC0yNy41LTExLjRoLTc3LjJjLTAuNTMtMC4wMS0xLjAzLTAuMjMtMS40LTAuNi0wLjM3LTAuMzctMC41OS0wLjg3LTAuNi0xLjR2LTI3LjdjMC0yNy4xLTIxLjUtNDkuOS00OC42LTUwLjMtNi41Ny0wLjEtMTMuMDkgMS4wOS0xOS4yIDMuNWE0OS42MTYgNDkuNjE2IDAgMCAwLTE2LjQgMTAuNyA0OS44MjMgNDkuODIzIDAgMCAwLTExIDE2LjIgNDguODk0IDQ4Ljg5NCAwIDAgMC0zLjkgMTkuMnYyOC41Yy0wLjAxIDAuNTMtMC4yMyAxLjAzLTAuNiAxLjQtMC4zNyAwLjM3LTAuODcgMC41OS0xLjQgMC42aC03Ny4yYy0xMC41IDAtMjAuNTcgNC4xNy0yOCAxMS42YTM5LjU5NCAzOS41OTQgMCAwIDAtMTEuNiAyOHY3MC40YzAuMDEgMC41MyAwLjIzIDEuMDMgMC42IDEuNCAwLjM3IDAuMzcgMC44NyAwLjU5IDEuNCAwLjZoMjYuOWMyOS40IDAgNTMuNyAyNS41IDU0LjEgNTQuOCAwLjQgMjkuOS0yMy41IDU3LjItNTMuMyA1Ny4ySDUwYy0wLjUzIDAuMDEtMS4wMyAwLjIzLTEuNCAwLjYtMC4zNyAwLjM3LTAuNTkgMC44Ny0wLjYgMS40djcwLjRjMCAxMC41IDQuMTcgMjAuNTcgMTEuNiAyOHMxNy41IDExLjYgMjggMTEuNmg3MC40YzAuNTMtMC4wMSAxLjAzLTAuMjMgMS40LTAuNiAwLjM3LTAuMzcgMC41OS0wLjg3IDAuNi0xLjRWNDQxLjJjMC0zMC4zIDI0LjgtNTYuNCA1NS01Ny4xIDMwLjEtMC43IDU3IDIwLjMgNTcgNTAuM3YyNy43YzAuMDEgMC41MyAwLjIzIDEuMDMgMC42IDEuNCAwLjM3IDAuMzcgMC44NyAwLjU5IDEuNCAwLjZoNzEuMWEzOC45NCAzOC45NCAwIDAgMCAyNy41LTExLjQgMzguOTU4IDM4Ljk1OCAwIDAgMCAxMS40LTI3LjV2LTc4YzAuMDEtMC41MyAwLjIzLTEuMDMgMC42LTEuNCAwLjM3LTAuMzcgMC44Ny0wLjU5IDEuNC0wLjZoMjguNWMyNy42IDAgNDkuNS0yMi43IDQ5LjUtNTAuNHMtMjMuMi00OC43LTUwLjMtNDguN1pcIiBzdHlsZT1cInN0cm9rZTpjdXJyZW50Y29sb3I7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDozMjtmaWxsOiBjdXJyZW50Q29sb3I7XCI+PC9wYXRoPjwvc3ZnPmA7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBQbHVnaW5MaXN0ZW5lckhhbmRsZSB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5pbXBvcnQgeyBDYXBhY2l0b3IgfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuXG5pbXBvcnQgdHlwZSB7IENoYW5uZWxQYXlsb2FkRGF0YSwgQ2hhbm5lbENhbGxiYWNrRGF0YSwgQ2hhbm5lbExpc3RlbmVyQ2FsbGJhY2ssIFN0YXJ0T3B0aW9ucyB9IGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuaW1wb3J0IHsgQ2FwYWNpdG9yTm9kZUpTIH0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZUpTSW50ZXJmYWNlIHtcbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgTm9kZS5qcyBlbmdpbmUgd2l0aCBwcm9wZXJ0aWVzIGFzIHNldCBieSB0aGUgYG9wdGlvbnNgLlxuICAgKlxuICAgKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgb25seSBhdmFpbGFibGUgaWYgdGhlIE5vZGUuanMgZW5naW5lIHN0YXJ0dXAgbW9kZSB3YXMgc2V0IHRvIGAnbWFudWFsJ2AgdmlhIHRoZSBwbHVnaW4gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBzdGFydChvcHRpb25zPzogU3RhcnRPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBOb2RlLmpzIHByb2Nlc3MuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgc2VuZChhcmdzOiBDaGFubmVsUGF5bG9hZERhdGEpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyB3aGVuIHRoZSBOb2RlLmpzIHByb2Nlc3MgaXMgaW5pdGlhbGl6ZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgd2hlblJlYWR5KCk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIExpc3RlbnMgdG8gYGV2ZW50TmFtZWAgYW5kIGNhbGxzIGBsaXN0ZW5lckZ1bmMoZGF0YSlgIHdoZW4gYSBuZXcgbWVzc2FnZSBhcnJpdmVzIGZyb20gdGhlIE5vZGUuanMgcHJvY2Vzcy5cbiAgICpcbiAgICogKipOb3RlOioqIFdoZW4gdXNpbmcgdGhlIEVsZWN0cm9uIHBsYXRmb3JtLCBbYFBsdWdpbkxpc3RlbmVySGFuZGxlLnJlbW92ZSgpYF0oI3BsdWdpbmxpc3RlbmVyaGFuZGxlKSBkb2VzIG5vdCB3b3JrIGR1ZSB0byBsaW1pdGF0aW9ucy5cbiAgICogVXNlIFtgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXJGdW5jKWBdKCNyZW1vdmVsaXN0ZW5lcikgaW5zdGVhZC5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBhZGRMaXN0ZW5lcihcbiAgICBldmVudE5hbWU6IHN0cmluZyxcbiAgICBsaXN0ZW5lckZ1bmM6IENoYW5uZWxMaXN0ZW5lckNhbGxiYWNrLFxuICApOiBQcm9taXNlPFBsdWdpbkxpc3RlbmVySGFuZGxlPjtcblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGBsaXN0ZW5lckhhbmRsZWAgZnJvbSB0aGUgbGlzdGVuZXIgYXJyYXkgZm9yIHRoZSBldmVudCBpdCByZWZlcnMgdG8uXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXJIYW5kbGU6IFBsdWdpbkxpc3RlbmVySGFuZGxlKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGBldmVudE5hbWVgLCBmb3IgdGhpcyBwbHVnaW4uXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50TmFtZT86IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG59XG5cbmNsYXNzIE5vZGVKU1BsdWdpbiBpbXBsZW1lbnRzIE5vZGVKU0ludGVyZmFjZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGlzdGVuZXJMaXN0OiB7XG4gICAgZXZlbnROYW1lOiBzdHJpbmc7XG4gICAgbGlzdGVuZXJIYW5kbGU6IFByb21pc2U8UGx1Z2luTGlzdGVuZXJIYW5kbGU+O1xuICB9W10gPSBbXTtcblxuICBzdGFydChhcmdzPzogU3RhcnRPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIENhcGFjaXRvck5vZGVKUy5zdGFydChhcmdzKTtcbiAgfVxuXG4gIHNlbmQoYXJnczogQ2hhbm5lbFBheWxvYWREYXRhKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIENhcGFjaXRvck5vZGVKUy5zZW5kKGFyZ3MpO1xuICB9XG5cbiAgd2hlblJlYWR5KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBDYXBhY2l0b3JOb2RlSlMud2hlblJlYWR5KCk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcihcbiAgICBldmVudE5hbWU6IHN0cmluZyxcbiAgICBsaXN0ZW5lckZ1bmM6IENoYW5uZWxMaXN0ZW5lckNhbGxiYWNrLFxuICApOiBQcm9taXNlPFBsdWdpbkxpc3RlbmVySGFuZGxlPjtcblxuICBhZGRMaXN0ZW5lcihcbiAgICBldmVudE5hbWU6IGFueSxcbiAgICBsaXN0ZW5lckZ1bmM6IENoYW5uZWxMaXN0ZW5lckNhbGxiYWNrLFxuICApOiBQcm9taXNlPFBsdWdpbkxpc3RlbmVySGFuZGxlPiB7XG4gICAgY29uc3QgbGlzdGVuZXJIYW5kbGUgPSBDYXBhY2l0b3JOb2RlSlMuYWRkTGlzdGVuZXIoZXZlbnROYW1lLCAoZGF0YTogQ2hhbm5lbENhbGxiYWNrRGF0YSkgPT4ge1xuICAgICAgbGlzdGVuZXJGdW5jKGRhdGEpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5saXN0ZW5lckxpc3QucHVzaCh7IGV2ZW50TmFtZSwgbGlzdGVuZXJIYW5kbGUgfSk7XG4gICAgcmV0dXJuIGxpc3RlbmVySGFuZGxlO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXJIYW5kbGU6IFBsdWdpbkxpc3RlbmVySGFuZGxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKENhcGFjaXRvci5nZXRQbGF0Zm9ybSgpID09PSAnZWxlY3Ryb24nKSB7XG4gICAgICBhd2FpdCAoQ2FwYWNpdG9yTm9kZUpTIGFzIGFueSkucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXJIYW5kbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBsaXN0ZW5lckhhbmRsZS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5saXN0ZW5lckxpc3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJMaXN0W2luZGV4XTtcblxuICAgICAgaWYgKGxpc3RlbmVySGFuZGxlID09PSAoYXdhaXQgbGlzdGVuZXIubGlzdGVuZXJIYW5kbGUpKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlbW92ZUFsbExpc3RlbmVycyhldmVudE5hbWU/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIFsuLi50aGlzLmxpc3RlbmVyTGlzdF0pIHtcbiAgICAgIGlmICghZXZlbnROYW1lIHx8IGV2ZW50TmFtZSA9PT0gbGlzdGVuZXIuZXZlbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVySGFuZGxlID0gYXdhaXQgbGlzdGVuZXIubGlzdGVuZXJIYW5kbGU7XG4gICAgICAgIGF3YWl0IHRoaXMucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXJIYW5kbGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBOb2RlSlMgPSBuZXcgTm9kZUpTUGx1Z2luKCk7XG5cbmV4cG9ydCB7IE5vZGVKUyB9O1xuIiwgImltcG9ydCB0eXBlIHsgUGx1Z2luTGlzdGVuZXJIYW5kbGUgfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuaW1wb3J0IHsgcmVnaXN0ZXJQbHVnaW4gfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuXG5pbXBvcnQgdHlwZSB7IENoYW5uZWxQYXlsb2FkRGF0YSwgQ2hhbm5lbExpc3RlbmVyQ2FsbGJhY2ssIFN0YXJ0T3B0aW9ucyB9IGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENhcGFjaXRvck5vZGVKU1BsdWdpbiB7XG4gIHN0YXJ0KGFyZ3M/OiBTdGFydE9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+O1xuICBzZW5kKGFyZ3M6IENoYW5uZWxQYXlsb2FkRGF0YSk6IFByb21pc2U8dm9pZD47XG4gIHdoZW5SZWFkeSgpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIGFkZExpc3RlbmVyKFxuICAgIGV2ZW50TmFtZTogc3RyaW5nLFxuICAgIGxpc3RlbmVyRnVuYzogQ2hhbm5lbExpc3RlbmVyQ2FsbGJhY2ssXG4gICk6IFByb21pc2U8UGx1Z2luTGlzdGVuZXJIYW5kbGU+O1xufVxuXG5jb25zdCBDYXBhY2l0b3JOb2RlSlMgPSByZWdpc3RlclBsdWdpbjxDYXBhY2l0b3JOb2RlSlNQbHVnaW4+KCdDYXBhY2l0b3JOb2RlSlMnLCB7XG4gIHdlYjogKCkgPT4gaW1wb3J0KCcuL3dlYicpLnRoZW4oKG0pID0+IG5ldyBtLkNhcGFjaXRvck5vZGVKU1dlYigpKSxcbiAgZWxlY3Ryb246ICgpID0+ICh3aW5kb3cgYXMgYW55KS5DYXBhY2l0b3JDdXN0b21QbGF0Zm9ybS5wbHVnaW5zLkNhcGFjaXRvck5vZGVKUyxcbn0pO1xuXG5leHBvcnQgeyBDYXBhY2l0b3JOb2RlSlMgfTtcbiIsICJleHBvcnQgdHlwZSBMb2dMZXZlbCA9ICdJTkZPJyB8ICdXQVJOJyB8ICdFUlJPUicgfCAnREVCVUcnO1xuXG5pbnRlcmZhY2UgTG9nRW50cnkge1xuICAgIHRpbWVzdGFtcDogc3RyaW5nO1xuICAgIGxldmVsOiBMb2dMZXZlbDtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG59XG5cbmNsYXNzIExvZ01hbmFnZXIge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBMb2dNYW5hZ2VyO1xuICAgIHByaXZhdGUgbG9nczogTG9nRW50cnlbXSA9IFtdO1xuICAgIHByaXZhdGUgbWF4TG9ncyA9IDEwMDA7XG4gICAgcHJpdmF0ZSBvcmlnaW5hbENvbnNvbGU6IGFueSA9IHt9O1xuICAgIHByaXZhdGUgaXNIb29rZWQgPSBmYWxzZTtcblxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBMb2dNYW5hZ2VyIHtcbiAgICAgICAgaWYgKCFMb2dNYW5hZ2VyLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBMb2dNYW5hZ2VyLmluc3RhbmNlID0gbmV3IExvZ01hbmFnZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTG9nTWFuYWdlci5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaG9va0NvbnNvbGUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSG9va2VkKSByZXR1cm47XG4gICAgICAgIHRoaXMuaXNIb29rZWQgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IG1ldGhvZHM6IExvZ0xldmVsW10gPSBbJ0lORk8nLCAnV0FSTicsICdFUlJPUicsICdERUJVRyddO1xuICAgICAgICBcbiAgICAgICAgbWV0aG9kcy5mb3JFYWNoKGxldmVsID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnNvbGVNZXRob2QgPSBsZXZlbC50b0xvd2VyQ2FzZSgpIGFzIGtleW9mIENvbnNvbGU7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbENvbnNvbGVbY29uc29sZU1ldGhvZF0gPSAoY29uc29sZSBhcyBhbnkpW2NvbnNvbGVNZXRob2RdLmJpbmQoY29uc29sZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICAoY29uc29sZSBhcyBhbnkpW2NvbnNvbGVNZXRob2RdID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRMb2cobGV2ZWwsIGFyZ3MubWFwKGFyZyA9PiBcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeShhcmcpIDogU3RyaW5nKGFyZylcbiAgICAgICAgICAgICAgICApLmpvaW4oJyAnKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCBvcmlnaW5hbFxuICAgICAgICAgICAgICAgIHRoaXMub3JpZ2luYWxDb25zb2xlW2NvbnNvbGVNZXRob2RdKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSG9vayBsb2cgYXMgSU5GT1xuICAgICAgICB0aGlzLm9yaWdpbmFsQ29uc29sZVsnbG9nJ10gPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgICAgICBjb25zb2xlLmxvZyA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRMb2coJ0lORk8nLCBhcmdzLm1hcChhcmcgPT4gXG4gICAgICAgICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeShhcmcpIDogU3RyaW5nKGFyZylcbiAgICAgICAgICAgICkuam9pbignICcpKTtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxDb25zb2xlWydsb2cnXSguLi5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhZGRMb2cobGV2ZWw6IExvZ0xldmVsLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMV0uc2xpY2UoMCwgLTEpO1xuICAgICAgICB0aGlzLmxvZ3MucHVzaCh7IHRpbWVzdGFtcCwgbGV2ZWwsIG1lc3NhZ2UgfSk7XG4gICAgICAgIGlmICh0aGlzLmxvZ3MubGVuZ3RoID4gdGhpcy5tYXhMb2dzKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ3Muc2hpZnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzaG93TG9ncygpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgb3ZlcmxheUlkID0gJ3N0cmVtaW8tZW5oYW5jZWQtbG9ncy1vdmVybGF5JztcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG92ZXJsYXlJZCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG92ZXJsYXkuaWQgPSBvdmVybGF5SWQ7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICAgIGxlZnQ6IDA7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC44KTtcbiAgICAgICAgICAgIHotaW5kZXg6IDk5OTk5O1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4O1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcbiAgICAgICAgYDtcblxuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGVhZGVyLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMWExYTFhO1xuICAgICAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgICAgYDtcblxuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ0xvZ3MnO1xuICAgICAgICB0aXRsZS5zdHlsZS5tYXJnaW4gPSAnMCc7XG5cbiAgICAgICAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udHJvbHMuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgICAgY29udHJvbHMuc3R5bGUuZ2FwID0gJzEwcHgnO1xuXG4gICAgICAgIGNvbnN0IGZpbHRlclNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgICBmaWx0ZXJTZWxlY3Quc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICMzMzM7XG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjNTU1O1xuICAgICAgICAgICAgcGFkZGluZzogNXB4O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgICAgICBgO1xuICAgICAgICBbJ0FMTCcsICdJTkZPJywgJ1dBUk4nLCAnRVJST1InXS5mb3JFYWNoKGxldmVsID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gbGV2ZWw7XG4gICAgICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBsZXZlbDtcbiAgICAgICAgICAgIGZpbHRlclNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjb3B5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGNvcHlCdG4udGV4dENvbnRlbnQgPSAnQ29weSBBbGwnO1xuICAgICAgICBjb3B5QnRuLnN0eWxlLmNzc1RleHQgPSBgXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjNGE0YTRhO1xuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgcGFkZGluZzogNXB4IDEwcHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGA7XG5cbiAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgY2xvc2VCdG4udGV4dENvbnRlbnQgPSAnQ2xvc2UnO1xuICAgICAgICBjbG9zZUJ0bi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2MwMzkyYjtcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIHBhZGRpbmc6IDVweCAxMHB4O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBgO1xuXG4gICAgICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKGZpbHRlclNlbGVjdCk7XG4gICAgICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKGNvcHlCdG4pO1xuICAgICAgICBjb250cm9scy5hcHBlbmRDaGlsZChjbG9zZUJ0bik7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChjb250cm9scyk7XG5cbiAgICAgICAgY29uc3QgbG9nc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsb2dzQ29udGFpbmVyLmlkID0gJ2xvZ3MtY29udGFpbmVyJztcbiAgICAgICAgbG9nc0NvbnRhaW5lci5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgICAgICAgZmxleDogMTtcbiAgICAgICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMTExO1xuICAgICAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbiAgICAgICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgYDtcblxuICAgICAgICBvdmVybGF5LmFwcGVuZENoaWxkKGhlYWRlcik7XG4gICAgICAgIG92ZXJsYXkuYXBwZW5kQ2hpbGQobG9nc0NvbnRhaW5lcik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyTG9ncyA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlclNlbGVjdC52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkTG9ncyA9IGZpbHRlciA9PT0gJ0FMTCcgXG4gICAgICAgICAgICAgICAgPyB0aGlzLmxvZ3MgXG4gICAgICAgICAgICAgICAgOiB0aGlzLmxvZ3MuZmlsdGVyKGwgPT4gbC5sZXZlbCA9PT0gZmlsdGVyKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbG9nc0NvbnRhaW5lci5pbm5lckhUTUwgPSBmaWx0ZXJlZExvZ3MubWFwKGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbC5sZXZlbCA9PT0gJ0VSUk9SJyA/ICcjZmY1NTU1JyA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbC5sZXZlbCA9PT0gJ1dBUk4nID8gJyNmZmI4NmMnIDogJyM1MGZhN2InO1xuICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweDtcIj48c3BhbiBzdHlsZT1cImNvbG9yOiAjNjI3MmE0XCI+WyR7bC50aW1lc3RhbXB9XTwvc3Bhbj4gPHNwYW4gc3R5bGU9XCJjb2xvcjogJHtjb2xvcn1cIj5bJHtsLmxldmVsfV08L3NwYW4+ICR7dGhpcy5lc2NhcGVIdG1sKGwubWVzc2FnZSl9PC9kaXY+YDtcbiAgICAgICAgICAgIH0pLmpvaW4oJycpO1xuICAgICAgICAgICAgbG9nc0NvbnRhaW5lci5zY3JvbGxUb3AgPSBsb2dzQ29udGFpbmVyLnNjcm9sbEhlaWdodDtcbiAgICAgICAgfTtcblxuICAgICAgICByZW5kZXJMb2dzKCk7XG5cbiAgICAgICAgZmlsdGVyU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHJlbmRlckxvZ3MpO1xuXG4gICAgICAgIGNvcHlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5sb2dzLm1hcChsID0+IGBbJHtsLnRpbWVzdGFtcH1dIFske2wubGV2ZWx9XSAke2wubWVzc2FnZX1gKS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgIGNvbnN0IHRleHRBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuICAgICAgICAgICAgdGV4dEFyZWEudmFsdWUgPSB0ZXh0O1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0QXJlYSk7XG4gICAgICAgICAgICB0ZXh0QXJlYS5zZWxlY3QoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiQ29weVwiKTtcbiAgICAgICAgICAgIHRleHRBcmVhLnJlbW92ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbFRleHQgPSBjb3B5QnRuLnRleHRDb250ZW50O1xuICAgICAgICAgICAgY29weUJ0bi50ZXh0Q29udGVudCA9ICdDb3BpZWQhJztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY29weUJ0bi50ZXh0Q29udGVudCA9IG9yaWdpbmFsVGV4dCwgMjAwMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgb3ZlcmxheS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlc2NhcGVIdG1sKHVuc2FmZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHVuc2FmZVxuICAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAgICAgICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAgICAgICAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIiYjMDM5O1wiKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvZ01hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BQVcsZUFrQkUsb0JBUUEsZUN6QkEsaUJBMkpBLHFCQzNKQSxXQVNBLGdCQ0xBLFdDSVAsUUFPQSxRQUNPLDJCQTBEQSxrQkFRQSxrQkFjUCxzQkFjQSxnQkE4Qk8sa0JBd0NBLHdCQWlGQSxlQVFGLGlCQTBCQSxlQWVFLHFCQWNBOzs7QUpwVWIsT0FBQyxTQUFVQSxnQkFBZTtBQU90QixRQUFBQSxlQUFjLGVBQWUsSUFBSTtBQVFqQyxRQUFBQSxlQUFjLGFBQWEsSUFBSTtNQUNuQyxHQUFHLGtCQUFrQixnQkFBZ0IsQ0FBQSxFQUFHO0FBQ2pDLE1BQU0scUJBQU4sY0FBaUMsTUFBTTtRQUMxQyxZQUFZLFNBQVMsTUFBTSxNQUFNO0FBQzdCLGdCQUFNLE9BQU87QUFDYixlQUFLLFVBQVU7QUFDZixlQUFLLE9BQU87QUFDWixlQUFLLE9BQU87UUFDcEI7TUFDQTtBQUNPLE1BQU0sZ0JBQWdCLENBQUMsUUFBUTtBQUNsQyxZQUFJLElBQUk7QUFDUixZQUFJLFFBQVEsUUFBUSxRQUFRLFNBQVMsU0FBUyxJQUFJLGVBQWU7QUFDN0QsaUJBQU87UUFDZixZQUNjLE1BQU0sS0FBSyxRQUFRLFFBQVEsUUFBUSxTQUFTLFNBQVMsSUFBSSxZQUFZLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxxQkFBcUIsUUFBUSxPQUFPLFNBQVMsU0FB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LFVBQVUsZUFBZSxHQUFHLGFBQWEsWUFBWSxLQUFLO0FBRTFGLGNBQU0sUUFBUSxLQUFLLFNBQVMsTUFBTSxLQUFLLFlBQVksU0FBUyxNQUFNLEtBQUssS0FBSyxTQUFTLE1BQU07QUFDM0YsUUFBQyxLQUFxQixNQUFNLFVBQVUsUUFBUSxLQUFLO0FBQUEsTUFDdkQsQ0FBQztBQUFBLElBQ0wsQ0FBQztBQUFBLEVBQ0w7QUFFQSxXQUFTLHdCQUE4QjtBQUNuQyxvQkFBUSxXQUFXLHlCQUF5QixFQUFFLEtBQUssTUFBTTtBQUNyRCxZQUFNLE1BQU0sU0FBUyxlQUFlLHdCQUF3QjtBQUM1RCxXQUFLLGlCQUFpQixTQUFTLFVBQVU7QUFBQSxJQUM3QyxDQUFDLEVBQUUsTUFBTSxNQUFNO0FBQUEsSUFBQyxDQUFDO0FBQUEsRUFDckI7QUFFQSxXQUFTLGFBQW1CO0FBQ3hCLG9CQUFRLFdBQVcsVUFBVSxjQUFjLEVBQUUsS0FBSyxZQUFZO0FBQzFELFlBQU0sZ0JBQWdCLFNBQVMsY0FBYyxVQUFVLGNBQWM7QUFDckUsVUFBSSxlQUFlO0FBRWYsc0JBQWMsYUFBYTtBQUFBLFVBQ3ZCO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDSjtBQUdBLHlCQUFTLFVBQVUsYUFBYSxlQUFlLFVBQVUsY0FBYztBQUd2RSx3QkFBUSxXQUFXLGNBQWMsRUFBRSxLQUFLLE1BQU07QUFDMUMsbUJBQVMsZUFBZSxhQUFhLEdBQUcsaUJBQWlCLFNBQVMsTUFBTTtBQUNwRSwrQkFBVyxTQUFTO0FBQUEsVUFDeEIsQ0FBQztBQUFBLFFBQ0wsQ0FBQztBQUFBLE1BQ0w7QUFBQSxJQUNKLENBQUMsRUFBRSxNQUFNLFNBQU8sdUJBQU8sTUFBTSxvQ0FBb0MsR0FBRyxDQUFDO0FBQUEsRUFDekU7QUFFQSxXQUFTLGVBQXVCO0FBQzVCLFdBQU87QUFBQTtBQUFBO0FBQUEsRUFHWDtBQUVBLFdBQVMsZUFBdUI7QUFDNUIsV0FBTztBQUFBO0FBQUE7QUFBQSxFQUdYO0FBRUEsV0FBUyxnQkFBd0I7QUFDN0IsV0FBTztBQUFBO0FBQUEsRUFFWDsiLAogICJuYW1lcyI6IFsiRXhjZXB0aW9uQ29kZSIsICJyZWdpc3RlclBsdWdpbiIsICJwIiwgInJlc29sdmUiLCAiaGVhZGVycyIsICJTeXN0ZW1CYXJzU3R5bGUiLCAiU3lzdGVtQmFyVHlwZSIsICJEaXJlY3RvcnkiLCAiRW5jb2RpbmciLCAicmVzb2x2ZSIsICJlbnRyeSIsICJ0b1BhdGgiLCAiY3RpbWUiLCAid2ViX2V4cG9ydHMiLCAiaW5pdF93ZWIiLCAicmVzb2x2ZSIsICJyZXNvbHZlIiwgImpvaW4iLCAiYmFzZW5hbWUiLCAid2ViX2V4cG9ydHMiLCAiaW5pdF93ZWIiLCAiQnJvd3NlciIsICJmIiwgIkJyb3dzZXIiLCAicmVzb2x2ZSIsICJmIiwgInJlc29sdmUiLCAiaW1wb3J0X3BhdGgiXQp9Cg==
