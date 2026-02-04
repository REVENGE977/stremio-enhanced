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
      let nav = document.querySelector(SELECTORS.NAV_MENU);
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
      let item = document.querySelector('[title="Shortcuts"]');
      return item;
    }
    static getSettingsPanel() {
      let panel = document.querySelector(SELECTORS.SECTIONS_CONTAINER);
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

  // src/android/preload.ts
  PlatformManager.setPlatform(new CapacitorPlatform());
  NodeJS.addListener("log", (data) => {
    console.log("[Server]", ...data.args);
  });
  NodeJS.addListener("error", (data) => {
    console.error("[Server Error]", ...data.args);
    Helpers_default.showAlert("error", "Server Error", data.args.join(" "), ["OK"]);
  });
  window.addEventListener("load", async () => {
    if (!PlatformManager.current) PlatformManager.setPlatform(new CapacitorPlatform());
    await PlatformManager.current.init();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvY29yZS9idWlsZC91dGlsLmpzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2FwYWNpdG9yL2NvcmUvYnVpbGQvcnVudGltZS5qcyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9jb3JlL2J1aWxkL2dsb2JhbC5qcyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9jb3JlL2J1aWxkL3dlYi1wbHVnaW4uanMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvY29yZS9idWlsZC9jb3JlLXBsdWdpbnMuanMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvZmlsZXN5c3RlbS9zcmMvZGVmaW5pdGlvbnMudHMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvZmlsZXN5c3RlbS9zcmMvd2ViLnRzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2FwYWNpdG9yL2Jyb3dzZXIvc3JjL3dlYi50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jYXBhY2l0b3Itbm9kZWpzL3NyYy93ZWIudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL3BsYXRmb3JtL1BsYXRmb3JtTWFuYWdlci50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9maWxlc3lzdGVtL3NyYy9pbmRleC50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9zeW5hcHNlL2Rpc3Qvc3luYXBzZS5tanMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvYnJvd3Nlci9zcmMvaW5kZXgudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL3BsYXRmb3JtL0NhcGFjaXRvclBsYXRmb3JtLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9IZWxwZXJzLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9sb2dnZXIuYnJvd3Nlci50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3RhbnRzL2luZGV4LnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZHMtdGFiL21vZHMtdGFiLmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvbW9kcy1pdGVtL21vZHMtaXRlbS5odG1sIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2Fib3V0LWNhdGVnb3J5L2Fib3V0LWNhdGVnb3J5Lmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvZGVmYXVsdC10aGVtZS9kZWZhdWx0LXRoZW1lLmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvYmFjay1idG4vYmFjay1idG4uaHRtbCIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy90aXRsZS1iYXIvdGl0bGUtYmFyLmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL3RlbXBsYXRlQ2FjaGUuYnJvd3Nlci50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy90b2FzdC90b2FzdC50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9wbHVnaW4taXRlbS9wbHVnaW5JdGVtLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3RoZW1lLWl0ZW0vdGhlbWVJdGVtLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2VuaGFuY2VkLW5hdi9lbmhhbmNlZE5hdi50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29yZS9Qcm9wZXJ0aWVzLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2FwcGx5LXRoZW1lL2FwcGx5VGhlbWUuYnJvd3Nlci50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29yZS9Nb2RNYW5hZ2VyLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9pbnRlcmZhY2VzL01ldGFEYXRhLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9FeHRyYWN0TWV0YURhdGEudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvcmUvU2V0dGluZ3MudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvbW9kcy10YWIvbW9kc1RhYi50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9tb2RzLWl0ZW0vbW9kc0l0ZW0udHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvYWJvdXQtY2F0ZWdvcnkvYWJvdXRDYXRlZ29yeS50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9kZWZhdWx0LXRoZW1lL2RlZmF1bHRUaGVtZS50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9iYWNrLWJ0bi9iYWNrQnRuLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9hbmRyb2lkL3ByZWxvYWQudHMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhcGFjaXRvci1ub2RlanMvc3JjL05vZGVKUy50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY2FwYWNpdG9yLW5vZGVqcy9zcmMvaW1wbGVtZW50YXRpb24udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCB2YXIgRXhjZXB0aW9uQ29kZTtcbihmdW5jdGlvbiAoRXhjZXB0aW9uQ29kZSkge1xuICAgIC8qKlxuICAgICAqIEFQSSBpcyBub3QgaW1wbGVtZW50ZWQuXG4gICAgICpcbiAgICAgKiBUaGlzIHVzdWFsbHkgbWVhbnMgdGhlIEFQSSBjYW4ndCBiZSB1c2VkIGJlY2F1c2UgaXQgaXMgbm90IGltcGxlbWVudGVkIGZvclxuICAgICAqIHRoZSBjdXJyZW50IHBsYXRmb3JtLlxuICAgICAqL1xuICAgIEV4Y2VwdGlvbkNvZGVbXCJVbmltcGxlbWVudGVkXCJdID0gXCJVTklNUExFTUVOVEVEXCI7XG4gICAgLyoqXG4gICAgICogQVBJIGlzIG5vdCBhdmFpbGFibGUuXG4gICAgICpcbiAgICAgKiBUaGlzIG1lYW5zIHRoZSBBUEkgY2FuJ3QgYmUgdXNlZCByaWdodCBub3cgYmVjYXVzZTpcbiAgICAgKiAgIC0gaXQgaXMgY3VycmVudGx5IG1pc3NpbmcgYSBwcmVyZXF1aXNpdGUsIHN1Y2ggYXMgbmV0d29yayBjb25uZWN0aXZpdHlcbiAgICAgKiAgIC0gaXQgcmVxdWlyZXMgYSBwYXJ0aWN1bGFyIHBsYXRmb3JtIG9yIGJyb3dzZXIgdmVyc2lvblxuICAgICAqL1xuICAgIEV4Y2VwdGlvbkNvZGVbXCJVbmF2YWlsYWJsZVwiXSA9IFwiVU5BVkFJTEFCTEVcIjtcbn0pKEV4Y2VwdGlvbkNvZGUgfHwgKEV4Y2VwdGlvbkNvZGUgPSB7fSkpO1xuZXhwb3J0IGNsYXNzIENhcGFjaXRvckV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBjb2RlLCBkYXRhKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBnZXRQbGF0Zm9ybUlkID0gKHdpbikgPT4ge1xuICAgIHZhciBfYSwgX2I7XG4gICAgaWYgKHdpbiA9PT0gbnVsbCB8fCB3aW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHdpbi5hbmRyb2lkQnJpZGdlKSB7XG4gICAgICAgIHJldHVybiAnYW5kcm9pZCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKChfYiA9IChfYSA9IHdpbiA9PT0gbnVsbCB8fCB3aW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHdpbi53ZWJraXQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXNzYWdlSGFuZGxlcnMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5icmlkZ2UpIHtcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuICd3ZWInO1xuICAgIH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlsLmpzLm1hcCIsICJpbXBvcnQgeyBDYXBhY2l0b3JFeGNlcHRpb24sIGdldFBsYXRmb3JtSWQsIEV4Y2VwdGlvbkNvZGUgfSBmcm9tICcuL3V0aWwnO1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUNhcGFjaXRvciA9ICh3aW4pID0+IHtcbiAgICBjb25zdCBjYXBDdXN0b21QbGF0Zm9ybSA9IHdpbi5DYXBhY2l0b3JDdXN0b21QbGF0Zm9ybSB8fCBudWxsO1xuICAgIGNvbnN0IGNhcCA9IHdpbi5DYXBhY2l0b3IgfHwge307XG4gICAgY29uc3QgUGx1Z2lucyA9IChjYXAuUGx1Z2lucyA9IGNhcC5QbHVnaW5zIHx8IHt9KTtcbiAgICBjb25zdCBnZXRQbGF0Zm9ybSA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGNhcEN1c3RvbVBsYXRmb3JtICE9PSBudWxsID8gY2FwQ3VzdG9tUGxhdGZvcm0ubmFtZSA6IGdldFBsYXRmb3JtSWQod2luKTtcbiAgICB9O1xuICAgIGNvbnN0IGlzTmF0aXZlUGxhdGZvcm0gPSAoKSA9PiBnZXRQbGF0Zm9ybSgpICE9PSAnd2ViJztcbiAgICBjb25zdCBpc1BsdWdpbkF2YWlsYWJsZSA9IChwbHVnaW5OYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IHJlZ2lzdGVyZWRQbHVnaW5zLmdldChwbHVnaW5OYW1lKTtcbiAgICAgICAgaWYgKHBsdWdpbiA9PT0gbnVsbCB8fCBwbHVnaW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBsdWdpbi5wbGF0Zm9ybXMuaGFzKGdldFBsYXRmb3JtKCkpKSB7XG4gICAgICAgICAgICAvLyBKUyBpbXBsZW1lbnRhdGlvbiBhdmFpbGFibGUgZm9yIHRoZSBjdXJyZW50IHBsYXRmb3JtLlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdldFBsdWdpbkhlYWRlcihwbHVnaW5OYW1lKSkge1xuICAgICAgICAgICAgLy8gTmF0aXZlIGltcGxlbWVudGF0aW9uIGF2YWlsYWJsZS5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIGNvbnN0IGdldFBsdWdpbkhlYWRlciA9IChwbHVnaW5OYW1lKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGNhcC5QbHVnaW5IZWFkZXJzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZmluZCgoaCkgPT4gaC5uYW1lID09PSBwbHVnaW5OYW1lKTsgfTtcbiAgICBjb25zdCBoYW5kbGVFcnJvciA9IChlcnIpID0+IHdpbi5jb25zb2xlLmVycm9yKGVycik7XG4gICAgY29uc3QgcmVnaXN0ZXJlZFBsdWdpbnMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgcmVnaXN0ZXJQbHVnaW4gPSAocGx1Z2luTmFtZSwganNJbXBsZW1lbnRhdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICBjb25zdCByZWdpc3RlcmVkUGx1Z2luID0gcmVnaXN0ZXJlZFBsdWdpbnMuZ2V0KHBsdWdpbk5hbWUpO1xuICAgICAgICBpZiAocmVnaXN0ZXJlZFBsdWdpbikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBDYXBhY2l0b3IgcGx1Z2luIFwiJHtwbHVnaW5OYW1lfVwiIGFscmVhZHkgcmVnaXN0ZXJlZC4gQ2Fubm90IHJlZ2lzdGVyIHBsdWdpbnMgdHdpY2UuYCk7XG4gICAgICAgICAgICByZXR1cm4gcmVnaXN0ZXJlZFBsdWdpbi5wcm94eTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwbGF0Zm9ybSA9IGdldFBsYXRmb3JtKCk7XG4gICAgICAgIGNvbnN0IHBsdWdpbkhlYWRlciA9IGdldFBsdWdpbkhlYWRlcihwbHVnaW5OYW1lKTtcbiAgICAgICAgbGV0IGpzSW1wbGVtZW50YXRpb247XG4gICAgICAgIGNvbnN0IGxvYWRQbHVnaW5JbXBsZW1lbnRhdGlvbiA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmICghanNJbXBsZW1lbnRhdGlvbiAmJiBwbGF0Zm9ybSBpbiBqc0ltcGxlbWVudGF0aW9ucykge1xuICAgICAgICAgICAgICAgIGpzSW1wbGVtZW50YXRpb24gPVxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YganNJbXBsZW1lbnRhdGlvbnNbcGxhdGZvcm1dID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICA/IChqc0ltcGxlbWVudGF0aW9uID0gYXdhaXQganNJbXBsZW1lbnRhdGlvbnNbcGxhdGZvcm1dKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IChqc0ltcGxlbWVudGF0aW9uID0ganNJbXBsZW1lbnRhdGlvbnNbcGxhdGZvcm1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNhcEN1c3RvbVBsYXRmb3JtICE9PSBudWxsICYmICFqc0ltcGxlbWVudGF0aW9uICYmICd3ZWInIGluIGpzSW1wbGVtZW50YXRpb25zKSB7XG4gICAgICAgICAgICAgICAganNJbXBsZW1lbnRhdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBqc0ltcGxlbWVudGF0aW9uc1snd2ViJ10gPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKGpzSW1wbGVtZW50YXRpb24gPSBhd2FpdCBqc0ltcGxlbWVudGF0aW9uc1snd2ViJ10oKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKGpzSW1wbGVtZW50YXRpb24gPSBqc0ltcGxlbWVudGF0aW9uc1snd2ViJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGpzSW1wbGVtZW50YXRpb247XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNyZWF0ZVBsdWdpbk1ldGhvZCA9IChpbXBsLCBwcm9wKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgaWYgKHBsdWdpbkhlYWRlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZEhlYWRlciA9IHBsdWdpbkhlYWRlciA9PT0gbnVsbCB8fCBwbHVnaW5IZWFkZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBsdWdpbkhlYWRlci5tZXRob2RzLmZpbmQoKG0pID0+IHByb3AgPT09IG0ubmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKG1ldGhvZEhlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kSGVhZGVyLnJ0eXBlID09PSAncHJvbWlzZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAob3B0aW9ucykgPT4gY2FwLm5hdGl2ZVByb21pc2UocGx1Z2luTmFtZSwgcHJvcC50b1N0cmluZygpLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAob3B0aW9ucywgY2FsbGJhY2spID0+IGNhcC5uYXRpdmVDYWxsYmFjayhwbHVnaW5OYW1lLCBwcm9wLnRvU3RyaW5nKCksIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpbXBsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoX2EgPSBpbXBsW3Byb3BdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYmluZChpbXBsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbXBsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYiA9IGltcGxbcHJvcF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5iaW5kKGltcGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENhcGFjaXRvckV4Y2VwdGlvbihgXCIke3BsdWdpbk5hbWV9XCIgcGx1Z2luIGlzIG5vdCBpbXBsZW1lbnRlZCBvbiAke3BsYXRmb3JtfWAsIEV4Y2VwdGlvbkNvZGUuVW5pbXBsZW1lbnRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNyZWF0ZVBsdWdpbk1ldGhvZFdyYXBwZXIgPSAocHJvcCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlbW92ZTtcbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZXIgPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBsb2FkUGx1Z2luSW1wbGVtZW50YXRpb24oKS50aGVuKChpbXBsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gY3JlYXRlUGx1Z2luTWV0aG9kKGltcGwsIHByb3ApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBmbiguLi5hcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZSA9IHAgPT09IG51bGwgfHwgcCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcC5yZW1vdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBDYXBhY2l0b3JFeGNlcHRpb24oYFwiJHtwbHVnaW5OYW1lfS4ke3Byb3B9KClcIiBpcyBub3QgaW1wbGVtZW50ZWQgb24gJHtwbGF0Zm9ybX1gLCBFeGNlcHRpb25Db2RlLlVuaW1wbGVtZW50ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHByb3AgPT09ICdhZGRMaXN0ZW5lcicpIHtcbiAgICAgICAgICAgICAgICAgICAgcC5yZW1vdmUgPSBhc3luYyAoKSA9PiByZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gU29tZSBmbGFpciDinKhcbiAgICAgICAgICAgIHdyYXBwZXIudG9TdHJpbmcgPSAoKSA9PiBgJHtwcm9wLnRvU3RyaW5nKCl9KCkgeyBbY2FwYWNpdG9yIGNvZGVdIH1gO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdyYXBwZXIsICduYW1lJywge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9wLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgYWRkTGlzdGVuZXIgPSBjcmVhdGVQbHVnaW5NZXRob2RXcmFwcGVyKCdhZGRMaXN0ZW5lcicpO1xuICAgICAgICBjb25zdCByZW1vdmVMaXN0ZW5lciA9IGNyZWF0ZVBsdWdpbk1ldGhvZFdyYXBwZXIoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIGNvbnN0IGFkZExpc3RlbmVyTmF0aXZlID0gKGV2ZW50TmFtZSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGwgPSBhZGRMaXN0ZW5lcih7IGV2ZW50TmFtZSB9LCBjYWxsYmFjayk7XG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FsbGJhY2tJZCA9IGF3YWl0IGNhbGw7XG4gICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoe1xuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrSWQsXG4gICAgICAgICAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gY2FsbC50aGVuKCgpID0+IHJlc29sdmUoeyByZW1vdmUgfSkpKTtcbiAgICAgICAgICAgIHAucmVtb3ZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVXNpbmcgYWRkTGlzdGVuZXIoKSB3aXRob3V0ICdhd2FpdCcgaXMgZGVwcmVjYXRlZC5gKTtcbiAgICAgICAgICAgICAgICBhd2FpdCByZW1vdmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgICAgIGdldChfLCBwcm9wKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMjAwMzBcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnJCR0eXBlb2YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndG9KU09OJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiAoe30pO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdhZGRMaXN0ZW5lcic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGx1Z2luSGVhZGVyID8gYWRkTGlzdGVuZXJOYXRpdmUgOiBhZGRMaXN0ZW5lcjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncmVtb3ZlTGlzdGVuZXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZUxpc3RlbmVyO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVBsdWdpbk1ldGhvZFdyYXBwZXIocHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIFBsdWdpbnNbcGx1Z2luTmFtZV0gPSBwcm94eTtcbiAgICAgICAgcmVnaXN0ZXJlZFBsdWdpbnMuc2V0KHBsdWdpbk5hbWUsIHtcbiAgICAgICAgICAgIG5hbWU6IHBsdWdpbk5hbWUsXG4gICAgICAgICAgICBwcm94eSxcbiAgICAgICAgICAgIHBsYXRmb3JtczogbmV3IFNldChbLi4uT2JqZWN0LmtleXMoanNJbXBsZW1lbnRhdGlvbnMpLCAuLi4ocGx1Z2luSGVhZGVyID8gW3BsYXRmb3JtXSA6IFtdKV0pLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH07XG4gICAgLy8gQWRkIGluIGNvbnZlcnRGaWxlU3JjIGZvciB3ZWIsIGl0IHdpbGwgYWxyZWFkeSBiZSBhdmFpbGFibGUgaW4gbmF0aXZlIGNvbnRleHRcbiAgICBpZiAoIWNhcC5jb252ZXJ0RmlsZVNyYykge1xuICAgICAgICBjYXAuY29udmVydEZpbGVTcmMgPSAoZmlsZVBhdGgpID0+IGZpbGVQYXRoO1xuICAgIH1cbiAgICBjYXAuZ2V0UGxhdGZvcm0gPSBnZXRQbGF0Zm9ybTtcbiAgICBjYXAuaGFuZGxlRXJyb3IgPSBoYW5kbGVFcnJvcjtcbiAgICBjYXAuaXNOYXRpdmVQbGF0Zm9ybSA9IGlzTmF0aXZlUGxhdGZvcm07XG4gICAgY2FwLmlzUGx1Z2luQXZhaWxhYmxlID0gaXNQbHVnaW5BdmFpbGFibGU7XG4gICAgY2FwLnJlZ2lzdGVyUGx1Z2luID0gcmVnaXN0ZXJQbHVnaW47XG4gICAgY2FwLkV4Y2VwdGlvbiA9IENhcGFjaXRvckV4Y2VwdGlvbjtcbiAgICBjYXAuREVCVUcgPSAhIWNhcC5ERUJVRztcbiAgICBjYXAuaXNMb2dnaW5nRW5hYmxlZCA9ICEhY2FwLmlzTG9nZ2luZ0VuYWJsZWQ7XG4gICAgcmV0dXJuIGNhcDtcbn07XG5leHBvcnQgY29uc3QgaW5pdENhcGFjaXRvckdsb2JhbCA9ICh3aW4pID0+ICh3aW4uQ2FwYWNpdG9yID0gY3JlYXRlQ2FwYWNpdG9yKHdpbikpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cnVudGltZS5qcy5tYXAiLCAiaW1wb3J0IHsgaW5pdENhcGFjaXRvckdsb2JhbCB9IGZyb20gJy4vcnVudGltZSc7XG5leHBvcnQgY29uc3QgQ2FwYWNpdG9yID0gLyojX19QVVJFX18qLyBpbml0Q2FwYWNpdG9yR2xvYmFsKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJ1xuICAgID8gZ2xvYmFsVGhpc1xuICAgIDogdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gc2VsZlxuICAgICAgICA6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICA/IHdpbmRvd1xuICAgICAgICAgICAgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgID8gZ2xvYmFsXG4gICAgICAgICAgICAgICAgOiB7fSk7XG5leHBvcnQgY29uc3QgcmVnaXN0ZXJQbHVnaW4gPSBDYXBhY2l0b3IucmVnaXN0ZXJQbHVnaW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nbG9iYWwuanMubWFwIiwgImltcG9ydCB7IENhcGFjaXRvciB9IGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IEV4Y2VwdGlvbkNvZGUgfSBmcm9tICcuL3V0aWwnO1xuLyoqXG4gKiBCYXNlIGNsYXNzIHdlYiBwbHVnaW5zIHNob3VsZCBleHRlbmQuXG4gKi9cbmV4cG9ydCBjbGFzcyBXZWJQbHVnaW4ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgICAgICB0aGlzLnJldGFpbmVkRXZlbnRBcmd1bWVudHMgPSB7fTtcbiAgICAgICAgdGhpcy53aW5kb3dMaXN0ZW5lcnMgPSB7fTtcbiAgICB9XG4gICAgYWRkTGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lckZ1bmMpIHtcbiAgICAgICAgbGV0IGZpcnN0TGlzdGVuZXIgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgICAgIGZpcnN0TGlzdGVuZXIgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaChsaXN0ZW5lckZ1bmMpO1xuICAgICAgICAvLyBJZiB3ZSBoYXZlbid0IGFkZGVkIGEgd2luZG93IGxpc3RlbmVyIGZvciB0aGlzIGV2ZW50IGFuZCBpdCByZXF1aXJlcyBvbmUsXG4gICAgICAgIC8vIGdvIGFoZWFkIGFuZCBhZGQgaXRcbiAgICAgICAgY29uc3Qgd2luZG93TGlzdGVuZXIgPSB0aGlzLndpbmRvd0xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgICAgICBpZiAod2luZG93TGlzdGVuZXIgJiYgIXdpbmRvd0xpc3RlbmVyLnJlZ2lzdGVyZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkV2luZG93TGlzdGVuZXIod2luZG93TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaXJzdExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnNlbmRSZXRhaW5lZEFyZ3VtZW50c0ZvckV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVtb3ZlID0gYXN5bmMgKCkgPT4gdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyRnVuYyk7XG4gICAgICAgIGNvbnN0IHAgPSBQcm9taXNlLnJlc29sdmUoeyByZW1vdmUgfSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBhc3luYyByZW1vdmVBbGxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgaW4gdGhpcy53aW5kb3dMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlV2luZG93TGlzdGVuZXIodGhpcy53aW5kb3dMaXN0ZW5lcnNbbGlzdGVuZXJdKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndpbmRvd0xpc3RlbmVycyA9IHt9O1xuICAgIH1cbiAgICBub3RpZnlMaXN0ZW5lcnMoZXZlbnROYW1lLCBkYXRhLCByZXRhaW5VbnRpbENvbnN1bWVkKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAocmV0YWluVW50aWxDb25zdW1lZCkge1xuICAgICAgICAgICAgICAgIGxldCBhcmdzID0gdGhpcy5yZXRhaW5lZEV2ZW50QXJndW1lbnRzW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKCFhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMucmV0YWluZWRFdmVudEFyZ3VtZW50c1tldmVudE5hbWVdID0gYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IGxpc3RlbmVyKGRhdGEpKTtcbiAgICB9XG4gICAgaGFzTGlzdGVuZXJzKGV2ZW50TmFtZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAhISgoX2EgPSB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJXaW5kb3dMaXN0ZW5lcih3aW5kb3dFdmVudE5hbWUsIHBsdWdpbkV2ZW50TmFtZSkge1xuICAgICAgICB0aGlzLndpbmRvd0xpc3RlbmVyc1twbHVnaW5FdmVudE5hbWVdID0ge1xuICAgICAgICAgICAgcmVnaXN0ZXJlZDogZmFsc2UsXG4gICAgICAgICAgICB3aW5kb3dFdmVudE5hbWUsXG4gICAgICAgICAgICBwbHVnaW5FdmVudE5hbWUsXG4gICAgICAgICAgICBoYW5kbGVyOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vdGlmeUxpc3RlbmVycyhwbHVnaW5FdmVudE5hbWUsIGV2ZW50KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIHVuaW1wbGVtZW50ZWQobXNnID0gJ25vdCBpbXBsZW1lbnRlZCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDYXBhY2l0b3IuRXhjZXB0aW9uKG1zZywgRXhjZXB0aW9uQ29kZS5VbmltcGxlbWVudGVkKTtcbiAgICB9XG4gICAgdW5hdmFpbGFibGUobXNnID0gJ25vdCBhdmFpbGFibGUnKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2FwYWNpdG9yLkV4Y2VwdGlvbihtc2csIEV4Y2VwdGlvbkNvZGUuVW5hdmFpbGFibGUpO1xuICAgIH1cbiAgICBhc3luYyByZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyRnVuYykge1xuICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXJGdW5jKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBsaXN0ZW5lcnMgZm9yIHRoaXMgdHlwZSBvZiBldmVudCxcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSB3aW5kb3cgbGlzdGVuZXJcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVXaW5kb3dMaXN0ZW5lcih0aGlzLndpbmRvd0xpc3RlbmVyc1tldmVudE5hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGRXaW5kb3dMaXN0ZW5lcihoYW5kbGUpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoaGFuZGxlLndpbmRvd0V2ZW50TmFtZSwgaGFuZGxlLmhhbmRsZXIpO1xuICAgICAgICBoYW5kbGUucmVnaXN0ZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHJlbW92ZVdpbmRvd0xpc3RlbmVyKGhhbmRsZSkge1xuICAgICAgICBpZiAoIWhhbmRsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGhhbmRsZS53aW5kb3dFdmVudE5hbWUsIGhhbmRsZS5oYW5kbGVyKTtcbiAgICAgICAgaGFuZGxlLnJlZ2lzdGVyZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgc2VuZFJldGFpbmVkQXJndW1lbnRzRm9yRXZlbnQoZXZlbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLnJldGFpbmVkRXZlbnRBcmd1bWVudHNbZXZlbnROYW1lXTtcbiAgICAgICAgaWYgKCFhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMucmV0YWluZWRFdmVudEFyZ3VtZW50c1tldmVudE5hbWVdO1xuICAgICAgICBhcmdzLmZvckVhY2goKGFyZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5ub3RpZnlMaXN0ZW5lcnMoZXZlbnROYW1lLCBhcmcpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD13ZWItcGx1Z2luLmpzLm1hcCIsICJpbXBvcnQgeyByZWdpc3RlclBsdWdpbiB9IGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCB7IFdlYlBsdWdpbiB9IGZyb20gJy4vd2ViLXBsdWdpbic7XG5leHBvcnQgY29uc3QgV2ViVmlldyA9IC8qI19fUFVSRV9fKi8gcmVnaXN0ZXJQbHVnaW4oJ1dlYlZpZXcnKTtcbi8qKioqKioqKiBFTkQgV0VCIFZJRVcgUExVR0lOICoqKioqKioqL1xuLyoqKioqKioqIENPT0tJRVMgUExVR0lOICoqKioqKioqL1xuLyoqXG4gKiBTYWZlbHkgd2ViIGVuY29kZSBhIHN0cmluZyB2YWx1ZSAoaW5zcGlyZWQgYnkganMtY29va2llKVxuICogQHBhcmFtIHN0ciBUaGUgc3RyaW5nIHZhbHVlIHRvIGVuY29kZVxuICovXG5jb25zdCBlbmNvZGUgPSAoc3RyKSA9PiBlbmNvZGVVUklDb21wb25lbnQoc3RyKVxuICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAucmVwbGFjZSgvWygpXS9nLCBlc2NhcGUpO1xuLyoqXG4gKiBTYWZlbHkgd2ViIGRlY29kZSBhIHN0cmluZyB2YWx1ZSAoaW5zcGlyZWQgYnkganMtY29va2llKVxuICogQHBhcmFtIHN0ciBUaGUgc3RyaW5nIHZhbHVlIHRvIGRlY29kZVxuICovXG5jb25zdCBkZWNvZGUgPSAoc3RyKSA9PiBzdHIucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpO1xuZXhwb3J0IGNsYXNzIENhcGFjaXRvckNvb2tpZXNQbHVnaW5XZWIgZXh0ZW5kcyBXZWJQbHVnaW4ge1xuICAgIGFzeW5jIGdldENvb2tpZXMoKSB7XG4gICAgICAgIGNvbnN0IGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWU7XG4gICAgICAgIGNvbnN0IGNvb2tpZU1hcCA9IHt9O1xuICAgICAgICBjb29raWVzLnNwbGl0KCc7JykuZm9yRWFjaCgoY29va2llKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29va2llLmxlbmd0aCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgZmlyc3QgXCI9XCIgd2l0aCBDQVBfQ09PS0lFIHRvIHByZXZlbnQgc3BsaXR0aW5nIG9uIGFkZGl0aW9uYWwgXCI9XCJcbiAgICAgICAgICAgIGxldCBba2V5LCB2YWx1ZV0gPSBjb29raWUucmVwbGFjZSgvPS8sICdDQVBfQ09PS0lFJykuc3BsaXQoJ0NBUF9DT09LSUUnKTtcbiAgICAgICAgICAgIGtleSA9IGRlY29kZShrZXkpLnRyaW0oKTtcbiAgICAgICAgICAgIHZhbHVlID0gZGVjb2RlKHZhbHVlKS50cmltKCk7XG4gICAgICAgICAgICBjb29raWVNYXBba2V5XSA9IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvb2tpZU1hcDtcbiAgICB9XG4gICAgYXN5bmMgc2V0Q29va2llKG9wdGlvbnMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFNhZmVseSBFbmNvZGVkIEtleS9WYWx1ZVxuICAgICAgICAgICAgY29uc3QgZW5jb2RlZEtleSA9IGVuY29kZShvcHRpb25zLmtleSk7XG4gICAgICAgICAgICBjb25zdCBlbmNvZGVkVmFsdWUgPSBlbmNvZGUob3B0aW9ucy52YWx1ZSk7XG4gICAgICAgICAgICAvLyBDbGVhbiAmIHNhbml0aXplIG9wdGlvbnNcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZXMgPSBgOyBleHBpcmVzPSR7KG9wdGlvbnMuZXhwaXJlcyB8fCAnJykucmVwbGFjZSgnZXhwaXJlcz0nLCAnJyl9YDsgLy8gRGVmYXVsdCBpcyBcIjsgZXhwaXJlcz1cIlxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IChvcHRpb25zLnBhdGggfHwgJy8nKS5yZXBsYWNlKCdwYXRoPScsICcnKTsgLy8gRGVmYXVsdCBpcyBcInBhdGg9L1wiXG4gICAgICAgICAgICBjb25zdCBkb21haW4gPSBvcHRpb25zLnVybCAhPSBudWxsICYmIG9wdGlvbnMudXJsLmxlbmd0aCA+IDAgPyBgZG9tYWluPSR7b3B0aW9ucy51cmx9YCA6ICcnO1xuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gYCR7ZW5jb2RlZEtleX09JHtlbmNvZGVkVmFsdWUgfHwgJyd9JHtleHBpcmVzfTsgcGF0aD0ke3BhdGh9OyAke2RvbWFpbn07YDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZGVsZXRlQ29va2llKG9wdGlvbnMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke29wdGlvbnMua2V5fT07IE1heC1BZ2U9MGA7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGNsZWFyQ29va2llcygpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKSB8fCBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY29va2llIG9mIGNvb2tpZXMpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUucmVwbGFjZSgvXiArLywgJycpLnJlcGxhY2UoLz0uKi8sIGA9O2V4cGlyZXM9JHtuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCl9O3BhdGg9L2ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBjbGVhckFsbENvb2tpZXMoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNsZWFyQ29va2llcygpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBDYXBhY2l0b3JDb29raWVzID0gcmVnaXN0ZXJQbHVnaW4oJ0NhcGFjaXRvckNvb2tpZXMnLCB7XG4gICAgd2ViOiAoKSA9PiBuZXcgQ2FwYWNpdG9yQ29va2llc1BsdWdpbldlYigpLFxufSk7XG4vLyBVVElMSVRZIEZVTkNUSU9OU1xuLyoqXG4gKiBSZWFkIGluIGEgQmxvYiB2YWx1ZSBhbmQgcmV0dXJuIGl0IGFzIGEgYmFzZTY0IHN0cmluZ1xuICogQHBhcmFtIGJsb2IgVGhlIGJsb2IgdmFsdWUgdG8gY29udmVydCB0byBhIGJhc2U2NCBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IHJlYWRCbG9iQXNCYXNlNjQgPSBhc3luYyAoYmxvYikgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgYmFzZTY0U3RyaW5nID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgICAgLy8gcmVtb3ZlIHByZWZpeCBcImRhdGE6YXBwbGljYXRpb24vcGRmO2Jhc2U2NCxcIlxuICAgICAgICByZXNvbHZlKGJhc2U2NFN0cmluZy5pbmRleE9mKCcsJykgPj0gMCA/IGJhc2U2NFN0cmluZy5zcGxpdCgnLCcpWzFdIDogYmFzZTY0U3RyaW5nKTtcbiAgICB9O1xuICAgIHJlYWRlci5vbmVycm9yID0gKGVycm9yKSA9PiByZWplY3QoZXJyb3IpO1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpO1xufSk7XG4vKipcbiAqIE5vcm1hbGl6ZSBhbiBIdHRwSGVhZGVycyBtYXAgYnkgbG93ZXJjYXNpbmcgYWxsIG9mIHRoZSB2YWx1ZXNcbiAqIEBwYXJhbSBoZWFkZXJzIFRoZSBIdHRwSGVhZGVycyBvYmplY3QgdG8gbm9ybWFsaXplXG4gKi9cbmNvbnN0IG5vcm1hbGl6ZUh0dHBIZWFkZXJzID0gKGhlYWRlcnMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IG9yaWdpbmFsS2V5cyA9IE9iamVjdC5rZXlzKGhlYWRlcnMpO1xuICAgIGNvbnN0IGxvd2VyZWRLZXlzID0gT2JqZWN0LmtleXMoaGVhZGVycykubWFwKChrKSA9PiBrLnRvTG9jYWxlTG93ZXJDYXNlKCkpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBsb3dlcmVkS2V5cy5yZWR1Y2UoKGFjYywga2V5LCBpbmRleCkgPT4ge1xuICAgICAgICBhY2Nba2V5XSA9IGhlYWRlcnNbb3JpZ2luYWxLZXlzW2luZGV4XV07XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBub3JtYWxpemVkO1xufTtcbi8qKlxuICogQnVpbGRzIGEgc3RyaW5nIG9mIHVybCBwYXJhbWV0ZXJzIHRoYXRcbiAqIEBwYXJhbSBwYXJhbXMgQSBtYXAgb2YgdXJsIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSBzaG91bGRFbmNvZGUgdHJ1ZSBpZiB5b3Ugc2hvdWxkIGVuY29kZVVSSUNvbXBvbmVudCgpIHRoZSB2YWx1ZXMgKHRydWUgYnkgZGVmYXVsdClcbiAqL1xuY29uc3QgYnVpbGRVcmxQYXJhbXMgPSAocGFyYW1zLCBzaG91bGRFbmNvZGUgPSB0cnVlKSA9PiB7XG4gICAgaWYgKCFwYXJhbXMpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IG91dHB1dCA9IE9iamVjdC5lbnRyaWVzKHBhcmFtcykucmVkdWNlKChhY2N1bXVsYXRvciwgZW50cnkpID0+IHtcbiAgICAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gZW50cnk7XG4gICAgICAgIGxldCBlbmNvZGVkVmFsdWU7XG4gICAgICAgIGxldCBpdGVtO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGl0ZW0gPSAnJztcbiAgICAgICAgICAgIHZhbHVlLmZvckVhY2goKHN0cikgPT4ge1xuICAgICAgICAgICAgICAgIGVuY29kZWRWYWx1ZSA9IHNob3VsZEVuY29kZSA/IGVuY29kZVVSSUNvbXBvbmVudChzdHIpIDogc3RyO1xuICAgICAgICAgICAgICAgIGl0ZW0gKz0gYCR7a2V5fT0ke2VuY29kZWRWYWx1ZX0mYDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gbGFzdCBjaGFyYWN0ZXIgd2lsbCBhbHdheXMgYmUgXCImXCIgc28gc2xpY2UgaXQgb2ZmXG4gICAgICAgICAgICBpdGVtLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVuY29kZWRWYWx1ZSA9IHNob3VsZEVuY29kZSA/IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkgOiB2YWx1ZTtcbiAgICAgICAgICAgIGl0ZW0gPSBgJHtrZXl9PSR7ZW5jb2RlZFZhbHVlfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGAke2FjY3VtdWxhdG9yfSYke2l0ZW19YDtcbiAgICB9LCAnJyk7XG4gICAgLy8gUmVtb3ZlIGluaXRpYWwgXCImXCIgZnJvbSB0aGUgcmVkdWNlXG4gICAgcmV0dXJuIG91dHB1dC5zdWJzdHIoMSk7XG59O1xuLyoqXG4gKiBCdWlsZCB0aGUgUmVxdWVzdEluaXQgb2JqZWN0IGJhc2VkIG9uIHRoZSBvcHRpb25zIHBhc3NlZCBpbnRvIHRoZSBpbml0aWFsIHJlcXVlc3RcbiAqIEBwYXJhbSBvcHRpb25zIFRoZSBIdHRwIHBsdWdpbiBvcHRpb25zXG4gKiBAcGFyYW0gZXh0cmEgQW55IGV4dHJhIFJlcXVlc3RJbml0IHZhbHVlc1xuICovXG5leHBvcnQgY29uc3QgYnVpbGRSZXF1ZXN0SW5pdCA9IChvcHRpb25zLCBleHRyYSA9IHt9KSA9PiB7XG4gICAgY29uc3Qgb3V0cHV0ID0gT2JqZWN0LmFzc2lnbih7IG1ldGhvZDogb3B0aW9ucy5tZXRob2QgfHwgJ0dFVCcsIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyB9LCBleHRyYSk7XG4gICAgLy8gR2V0IHRoZSBjb250ZW50LXR5cGVcbiAgICBjb25zdCBoZWFkZXJzID0gbm9ybWFsaXplSHR0cEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKTtcbiAgICBjb25zdCB0eXBlID0gaGVhZGVyc1snY29udGVudC10eXBlJ10gfHwgJyc7XG4gICAgLy8gSWYgYm9keSBpcyBhbHJlYWR5IGEgc3RyaW5nLCB0aGVuIHBhc3MgaXQgdGhyb3VnaCBhcy1pcy5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgb3V0cHV0LmJvZHkgPSBvcHRpb25zLmRhdGE7XG4gICAgfVxuICAgIC8vIEJ1aWxkIHJlcXVlc3QgaW5pdGlhbGl6ZXJzIGJhc2VkIG9mZiBvZiBjb250ZW50LXR5cGVcbiAgICBlbHNlIGlmICh0eXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKSkge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9wdGlvbnMuZGF0YSB8fCB7fSkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0LmJvZHkgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZS5pbmNsdWRlcygnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpIHx8IG9wdGlvbnMuZGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XG4gICAgICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZGF0YSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XG4gICAgICAgICAgICBvcHRpb25zLmRhdGEuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvcHRpb25zLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmQoa2V5LCBvcHRpb25zLmRhdGFba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0LmJvZHkgPSBmb3JtO1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMob3V0cHV0LmhlYWRlcnMpO1xuICAgICAgICBoZWFkZXJzLmRlbGV0ZSgnY29udGVudC10eXBlJyk7IC8vIGNvbnRlbnQtdHlwZSB3aWxsIGJlIHNldCBieSBgd2luZG93LmZldGNoYCB0byBpbmNsdWR5IGJvdW5kYXJ5XG4gICAgICAgIG91dHB1dC5oZWFkZXJzID0gaGVhZGVycztcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpIHx8IHR5cGVvZiBvcHRpb25zLmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG91dHB1dC5ib2R5ID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5kYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG4vLyBXRUIgSU1QTEVNRU5UQVRJT05cbmV4cG9ydCBjbGFzcyBDYXBhY2l0b3JIdHRwUGx1Z2luV2ViIGV4dGVuZHMgV2ViUGx1Z2luIHtcbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGFuIEh0dHAgcmVxdWVzdCBnaXZlbiBhIHNldCBvZiBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBidWlsZCB0aGUgSFRUUCByZXF1ZXN0XG4gICAgICovXG4gICAgYXN5bmMgcmVxdWVzdChvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RJbml0ID0gYnVpbGRSZXF1ZXN0SW5pdChvcHRpb25zLCBvcHRpb25zLndlYkZldGNoRXh0cmEpO1xuICAgICAgICBjb25zdCB1cmxQYXJhbXMgPSBidWlsZFVybFBhcmFtcyhvcHRpb25zLnBhcmFtcywgb3B0aW9ucy5zaG91bGRFbmNvZGVVcmxQYXJhbXMpO1xuICAgICAgICBjb25zdCB1cmwgPSB1cmxQYXJhbXMgPyBgJHtvcHRpb25zLnVybH0/JHt1cmxQYXJhbXN9YCA6IG9wdGlvbnMudXJsO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgcmVxdWVzdEluaXQpO1xuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSB8fCAnJztcbiAgICAgICAgLy8gRGVmYXVsdCB0byAndGV4dCcgcmVzcG9uc2VUeXBlIHNvIG5vIHBhcnNpbmcgaGFwcGVuc1xuICAgICAgICBsZXQgeyByZXNwb25zZVR5cGUgPSAndGV4dCcgfSA9IHJlc3BvbnNlLm9rID8gb3B0aW9ucyA6IHt9O1xuICAgICAgICAvLyBJZiB0aGUgcmVzcG9uc2UgY29udGVudC10eXBlIGlzIGpzb24sIGZvcmNlIHRoZSByZXNwb25zZSB0byBiZSBqc29uXG4gICAgICAgIGlmIChjb250ZW50VHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICByZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgIGxldCBibG9iO1xuICAgICAgICBzd2l0Y2ggKHJlc3BvbnNlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnYXJyYXlidWZmZXInOlxuICAgICAgICAgICAgY2FzZSAnYmxvYic6XG4gICAgICAgICAgICAgICAgYmxvYiA9IGF3YWl0IHJlc3BvbnNlLmJsb2IoKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVhZEJsb2JBc0Jhc2U2NChibG9iKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkb2N1bWVudCc6XG4gICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDb252ZXJ0IGZldGNoIGhlYWRlcnMgdG8gQ2FwYWNpdG9yIEh0dHBIZWFkZXJzXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7fTtcbiAgICAgICAgcmVzcG9uc2UuaGVhZGVycy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBoZWFkZXJzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgdXJsOiByZXNwb25zZS51cmwsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gSHR0cCBHRVQgcmVxdWVzdCBnaXZlbiBhIHNldCBvZiBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBidWlsZCB0aGUgSFRUUCByZXF1ZXN0XG4gICAgICovXG4gICAgYXN5bmMgZ2V0KG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IG1ldGhvZDogJ0dFVCcgfSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGFuIEh0dHAgUE9TVCByZXF1ZXN0IGdpdmVuIGEgc2V0IG9mIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIGJ1aWxkIHRoZSBIVFRQIHJlcXVlc3RcbiAgICAgKi9cbiAgICBhc3luYyBwb3N0KG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IG1ldGhvZDogJ1BPU1QnIH0pKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhbiBIdHRwIFBVVCByZXF1ZXN0IGdpdmVuIGEgc2V0IG9mIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIGJ1aWxkIHRoZSBIVFRQIHJlcXVlc3RcbiAgICAgKi9cbiAgICBhc3luYyBwdXQob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgbWV0aG9kOiAnUFVUJyB9KSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gSHR0cCBQQVRDSCByZXF1ZXN0IGdpdmVuIGEgc2V0IG9mIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIGJ1aWxkIHRoZSBIVFRQIHJlcXVlc3RcbiAgICAgKi9cbiAgICBhc3luYyBwYXRjaChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBtZXRob2Q6ICdQQVRDSCcgfSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGFuIEh0dHAgREVMRVRFIHJlcXVlc3QgZ2l2ZW4gYSBzZXQgb2Ygb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gYnVpbGQgdGhlIEhUVFAgcmVxdWVzdFxuICAgICAqL1xuICAgIGFzeW5jIGRlbGV0ZShvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBtZXRob2Q6ICdERUxFVEUnIH0pKTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgQ2FwYWNpdG9ySHR0cCA9IHJlZ2lzdGVyUGx1Z2luKCdDYXBhY2l0b3JIdHRwJywge1xuICAgIHdlYjogKCkgPT4gbmV3IENhcGFjaXRvckh0dHBQbHVnaW5XZWIoKSxcbn0pO1xuLyoqKioqKioqIEVORCBIVFRQIFBMVUdJTiAqKioqKioqKi9cbi8qKioqKioqKiBTWVNURU0gQkFSUyBQTFVHSU4gKioqKioqKiovXG4vKipcbiAqIEF2YWlsYWJsZSBzdGF0dXMgYmFyIHN0eWxlcy5cbiAqL1xuZXhwb3J0IHZhciBTeXN0ZW1CYXJzU3R5bGU7XG4oZnVuY3Rpb24gKFN5c3RlbUJhcnNTdHlsZSkge1xuICAgIC8qKlxuICAgICAqIExpZ2h0IHN5c3RlbSBiYXIgY29udGVudCBvbiBhIGRhcmsgYmFja2dyb3VuZC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSA4LjAuMFxuICAgICAqL1xuICAgIFN5c3RlbUJhcnNTdHlsZVtcIkRhcmtcIl0gPSBcIkRBUktcIjtcbiAgICAvKipcbiAgICAgKiBGb3IgZGFyayBzeXN0ZW0gYmFyIGNvbnRlbnQgb24gYSBsaWdodCBiYWNrZ3JvdW5kLlxuICAgICAqXG4gICAgICogQHNpbmNlIDguMC4wXG4gICAgICovXG4gICAgU3lzdGVtQmFyc1N0eWxlW1wiTGlnaHRcIl0gPSBcIkxJR0hUXCI7XG4gICAgLyoqXG4gICAgICogVGhlIHN0eWxlIGlzIGJhc2VkIG9uIHRoZSBkZXZpY2UgYXBwZWFyYW5jZSBvciB0aGUgdW5kZXJseWluZyBjb250ZW50LlxuICAgICAqIElmIHRoZSBkZXZpY2UgaXMgdXNpbmcgRGFyayBtb2RlLCB0aGUgc3lzdGVtIGJhcnMgY29udGVudCB3aWxsIGJlIGxpZ2h0LlxuICAgICAqIElmIHRoZSBkZXZpY2UgaXMgdXNpbmcgTGlnaHQgbW9kZSwgdGhlIHN5c3RlbSBiYXJzIGNvbnRlbnQgd2lsbCBiZSBkYXJrLlxuICAgICAqXG4gICAgICogQHNpbmNlIDguMC4wXG4gICAgICovXG4gICAgU3lzdGVtQmFyc1N0eWxlW1wiRGVmYXVsdFwiXSA9IFwiREVGQVVMVFwiO1xufSkoU3lzdGVtQmFyc1N0eWxlIHx8IChTeXN0ZW1CYXJzU3R5bGUgPSB7fSkpO1xuLyoqXG4gKiBBdmFpbGFibGUgc3lzdGVtIGJhciB0eXBlcy5cbiAqL1xuZXhwb3J0IHZhciBTeXN0ZW1CYXJUeXBlO1xuKGZ1bmN0aW9uIChTeXN0ZW1CYXJUeXBlKSB7XG4gICAgLyoqXG4gICAgICogVGhlIHRvcCBzdGF0dXMgYmFyIG9uIGJvdGggQW5kcm9pZCBhbmQgaU9TLlxuICAgICAqXG4gICAgICogQHNpbmNlIDguMC4wXG4gICAgICovXG4gICAgU3lzdGVtQmFyVHlwZVtcIlN0YXR1c0JhclwiXSA9IFwiU3RhdHVzQmFyXCI7XG4gICAgLyoqXG4gICAgICogVGhlIG5hdmlnYXRpb24gYmFyIChvciBnZXN0dXJlIGJhciBvbiBpT1MpIG9uIGJvdGggQW5kcm9pZCBhbmQgaU9TLlxuICAgICAqXG4gICAgICogQHNpbmNlIDguMC4wXG4gICAgICovXG4gICAgU3lzdGVtQmFyVHlwZVtcIk5hdmlnYXRpb25CYXJcIl0gPSBcIk5hdmlnYXRpb25CYXJcIjtcbn0pKFN5c3RlbUJhclR5cGUgfHwgKFN5c3RlbUJhclR5cGUgPSB7fSkpO1xuZXhwb3J0IGNsYXNzIFN5c3RlbUJhcnNQbHVnaW5XZWIgZXh0ZW5kcyBXZWJQbHVnaW4ge1xuICAgIGFzeW5jIHNldFN0eWxlKCkge1xuICAgICAgICB0aGlzLnVuYXZhaWxhYmxlKCdub3QgYXZhaWxhYmxlIGZvciB3ZWInKTtcbiAgICB9XG4gICAgYXN5bmMgc2V0QW5pbWF0aW9uKCkge1xuICAgICAgICB0aGlzLnVuYXZhaWxhYmxlKCdub3QgYXZhaWxhYmxlIGZvciB3ZWInKTtcbiAgICB9XG4gICAgYXN5bmMgc2hvdygpIHtcbiAgICAgICAgdGhpcy51bmF2YWlsYWJsZSgnbm90IGF2YWlsYWJsZSBmb3Igd2ViJyk7XG4gICAgfVxuICAgIGFzeW5jIGhpZGUoKSB7XG4gICAgICAgIHRoaXMudW5hdmFpbGFibGUoJ25vdCBhdmFpbGFibGUgZm9yIHdlYicpO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBTeXN0ZW1CYXJzID0gcmVnaXN0ZXJQbHVnaW4oJ1N5c3RlbUJhcnMnLCB7XG4gICAgd2ViOiAoKSA9PiBuZXcgU3lzdGVtQmFyc1BsdWdpbldlYigpLFxufSk7XG4vKioqKioqKiogRU5EIFNZU1RFTSBCQVJTIFBMVUdJTiAqKioqKioqKi9cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvcmUtcGx1Z2lucy5qcy5tYXAiLCAiaW1wb3J0IHR5cGUgeyBIdHRwT3B0aW9ucywgUGVybWlzc2lvblN0YXRlLCBQbHVnaW5MaXN0ZW5lckhhbmRsZSB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5cbmV4cG9ydCB0eXBlIENhbGxiYWNrSUQgPSBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGVybWlzc2lvblN0YXR1cyB7XG4gIHB1YmxpY1N0b3JhZ2U6IFBlcm1pc3Npb25TdGF0ZTtcbn1cblxuZXhwb3J0IGVudW0gRGlyZWN0b3J5IHtcbiAgLyoqXG4gICAqIFRoZSBEb2N1bWVudHMgZGlyZWN0b3J5LlxuICAgKiBPbiBpT1MgaXQncyB0aGUgYXBwJ3MgZG9jdW1lbnRzIGRpcmVjdG9yeS5cbiAgICogVXNlIHRoaXMgZGlyZWN0b3J5IHRvIHN0b3JlIHVzZXItZ2VuZXJhdGVkIGNvbnRlbnQuXG4gICAqIE9uIEFuZHJvaWQgaXQncyB0aGUgUHVibGljIERvY3VtZW50cyBmb2xkZXIsIHNvIGl0J3MgYWNjZXNzaWJsZSBmcm9tIG90aGVyIGFwcHMuXG4gICAqIEl0J3Mgbm90IGFjY2Vzc2libGUgb24gQW5kcm9pZCAxMCB1bmxlc3MgdGhlIGFwcCBlbmFibGVzIGxlZ2FjeSBFeHRlcm5hbCBTdG9yYWdlXG4gICAqIGJ5IGFkZGluZyBgYW5kcm9pZDpyZXF1ZXN0TGVnYWN5RXh0ZXJuYWxTdG9yYWdlPVwidHJ1ZVwiYCBpbiB0aGUgYGFwcGxpY2F0aW9uYCB0YWdcbiAgICogaW4gdGhlIGBBbmRyb2lkTWFuaWZlc3QueG1sYC5cbiAgICogT24gQW5kcm9pZCAxMSBvciBuZXdlciB0aGUgYXBwIGNhbiBvbmx5IGFjY2VzcyB0aGUgZmlsZXMvZm9sZGVycyB0aGUgYXBwIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgRG9jdW1lbnRzID0gJ0RPQ1VNRU5UUycsXG5cbiAgLyoqXG4gICAqIFRoZSBEYXRhIGRpcmVjdG9yeS5cbiAgICogT24gaU9TIGl0IHdpbGwgdXNlIHRoZSBEb2N1bWVudHMgZGlyZWN0b3J5LlxuICAgKiBPbiBBbmRyb2lkIGl0J3MgdGhlIGRpcmVjdG9yeSBob2xkaW5nIGFwcGxpY2F0aW9uIGZpbGVzLlxuICAgKiBGaWxlcyB3aWxsIGJlIGRlbGV0ZWQgd2hlbiB0aGUgYXBwbGljYXRpb24gaXMgdW5pbnN0YWxsZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgRGF0YSA9ICdEQVRBJyxcblxuICAvKipcbiAgICogVGhlIExpYnJhcnkgZGlyZWN0b3J5LlxuICAgKiBPbiBpT1MgaXQgd2lsbCB1c2UgdGhlIExpYnJhcnkgZGlyZWN0b3J5LlxuICAgKiBPbiBBbmRyb2lkIGl0J3MgdGhlIGRpcmVjdG9yeSBob2xkaW5nIGFwcGxpY2F0aW9uIGZpbGVzLlxuICAgKiBGaWxlcyB3aWxsIGJlIGRlbGV0ZWQgd2hlbiB0aGUgYXBwbGljYXRpb24gaXMgdW5pbnN0YWxsZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKi9cbiAgTGlicmFyeSA9ICdMSUJSQVJZJyxcblxuICAvKipcbiAgICogVGhlIENhY2hlIGRpcmVjdG9yeS5cbiAgICogQ2FuIGJlIGRlbGV0ZWQgaW4gY2FzZXMgb2YgbG93IG1lbW9yeSwgc28gdXNlIHRoaXMgZGlyZWN0b3J5IHRvIHdyaXRlIGFwcC1zcGVjaWZpYyBmaWxlcy5cbiAgICogdGhhdCB5b3VyIGFwcCBjYW4gcmUtY3JlYXRlIGVhc2lseS5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBDYWNoZSA9ICdDQUNIRScsXG5cbiAgLyoqXG4gICAqIFRoZSBleHRlcm5hbCBkaXJlY3RvcnkuXG4gICAqIE9uIGlPUyBpdCB3aWxsIHVzZSB0aGUgRG9jdW1lbnRzIGRpcmVjdG9yeS5cbiAgICogT24gQW5kcm9pZCBpdCdzIHRoZSBkaXJlY3Rvcnkgb24gdGhlIHByaW1hcnkgc2hhcmVkL2V4dGVybmFsXG4gICAqIHN0b3JhZ2UgZGV2aWNlIHdoZXJlIHRoZSBhcHBsaWNhdGlvbiBjYW4gcGxhY2UgcGVyc2lzdGVudCBmaWxlcyBpdCBvd25zLlxuICAgKiBUaGVzZSBmaWxlcyBhcmUgaW50ZXJuYWwgdG8gdGhlIGFwcGxpY2F0aW9ucywgYW5kIG5vdCB0eXBpY2FsbHkgdmlzaWJsZVxuICAgKiB0byB0aGUgdXNlciBhcyBtZWRpYS5cbiAgICogRmlsZXMgd2lsbCBiZSBkZWxldGVkIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIHVuaW5zdGFsbGVkLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIEV4dGVybmFsID0gJ0VYVEVSTkFMJyxcblxuICAvKipcbiAgICogVGhlIGV4dGVybmFsIHN0b3JhZ2UgZGlyZWN0b3J5LlxuICAgKiBPbiBpT1MgaXQgd2lsbCB1c2UgdGhlIERvY3VtZW50cyBkaXJlY3RvcnkuXG4gICAqIE9uIEFuZHJvaWQgaXQncyB0aGUgcHJpbWFyeSBzaGFyZWQvZXh0ZXJuYWwgc3RvcmFnZSBkaXJlY3RvcnkuXG4gICAqIEl0J3Mgbm90IGFjY2Vzc2libGUgb24gQW5kcm9pZCAxMCB1bmxlc3MgdGhlIGFwcCBlbmFibGVzIGxlZ2FjeSBFeHRlcm5hbCBTdG9yYWdlXG4gICAqIGJ5IGFkZGluZyBgYW5kcm9pZDpyZXF1ZXN0TGVnYWN5RXh0ZXJuYWxTdG9yYWdlPVwidHJ1ZVwiYCBpbiB0aGUgYGFwcGxpY2F0aW9uYCB0YWdcbiAgICogaW4gdGhlIGBBbmRyb2lkTWFuaWZlc3QueG1sYC5cbiAgICogSXQncyBub3QgYWNjZXNzaWJsZSBvbiBBbmRyb2lkIDExIG9yIG5ld2VyLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG5cbiAgRXh0ZXJuYWxTdG9yYWdlID0gJ0VYVEVSTkFMX1NUT1JBR0UnLFxuICAvKipcbiAgICogVGhlIGV4dGVybmFsIGNhY2hlIGRpcmVjdG9yeS5cbiAgICogT24gaU9TIGl0IHdpbGwgdXNlIHRoZSBEb2N1bWVudHMgZGlyZWN0b3J5LlxuICAgKiBPbiBBbmRyb2lkIGl0J3MgdGhlIHByaW1hcnkgc2hhcmVkL2V4dGVybmFsIGNhY2hlLlxuICAgKlxuICAgKiBAc2luY2UgNy4xLjBcbiAgICovXG4gIEV4dGVybmFsQ2FjaGUgPSAnRVhURVJOQUxfQ0FDSEUnLFxuXG4gIC8qKlxuICAgKiBUaGUgTGlicmFyeSBkaXJlY3Rvcnkgd2l0aG91dCBjbG91ZCBiYWNrdXAuIFVzZWQgaW4gaU9TLlxuICAgKiBPbiBBbmRyb2lkIGl0J3MgdGhlIGRpcmVjdG9yeSBob2xkaW5nIGFwcGxpY2F0aW9uIGZpbGVzLlxuICAgKlxuICAgKiBAc2luY2UgNy4xLjBcbiAgICovXG4gIExpYnJhcnlOb0Nsb3VkID0gJ0xJQlJBUllfTk9fQ0xPVUQnLFxuXG4gIC8qKlxuICAgKiBBIHRlbXBvcmFyeSBkaXJlY3RvcnkgZm9yIGlPUy5cbiAgICogT24gQW5kcm9pZCBpdCdzIHRoZSBkaXJlY3RvcnkgaG9sZGluZyB0aGUgYXBwbGljYXRpb24gY2FjaGUuXG4gICAqXG4gICAqIEBzaW5jZSA3LjEuMFxuICAgKi9cbiAgVGVtcG9yYXJ5ID0gJ1RFTVBPUkFSWScsXG59XG5cbmV4cG9ydCBlbnVtIEVuY29kaW5nIHtcbiAgLyoqXG4gICAqIEVpZ2h0LWJpdCBVQ1MgVHJhbnNmb3JtYXRpb24gRm9ybWF0XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgVVRGOCA9ICd1dGY4JyxcblxuICAvKipcbiAgICogU2V2ZW4tYml0IEFTQ0lJLCBhLmsuYS4gSVNPNjQ2LVVTLCBhLmsuYS4gdGhlIEJhc2ljIExhdGluIGJsb2NrIG9mIHRoZVxuICAgKiBVbmljb2RlIGNoYXJhY3RlciBzZXRcbiAgICogVGhpcyBlbmNvZGluZyBpcyBvbmx5IHN1cHBvcnRlZCBvbiBBbmRyb2lkLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIEFTQ0lJID0gJ2FzY2lpJyxcblxuICAvKipcbiAgICogU2l4dGVlbi1iaXQgVUNTIFRyYW5zZm9ybWF0aW9uIEZvcm1hdCwgYnl0ZSBvcmRlciBpZGVudGlmaWVkIGJ5IGFuXG4gICAqIG9wdGlvbmFsIGJ5dGUtb3JkZXIgbWFya1xuICAgKiBUaGlzIGVuY29kaW5nIGlzIG9ubHkgc3VwcG9ydGVkIG9uIEFuZHJvaWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgVVRGMTYgPSAndXRmMTYnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdyaXRlRmlsZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIGZpbGUgdG8gd3JpdGVcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRhIHRvIHdyaXRlXG4gICAqXG4gICAqIE5vdGU6IEJsb2IgZGF0YSBpcyBvbmx5IHN1cHBvcnRlZCBvbiBXZWIuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGF0YTogc3RyaW5nIHwgQmxvYjtcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIHN0b3JlIHRoZSBmaWxlIGluXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xuXG4gIC8qKlxuICAgKiBUaGUgZW5jb2RpbmcgdG8gd3JpdGUgdGhlIGZpbGUgaW4uIElmIG5vdCBwcm92aWRlZCwgZGF0YVxuICAgKiBpcyB3cml0dGVuIGFzIGJhc2U2NCBlbmNvZGVkLlxuICAgKlxuICAgKiBQYXNzIEVuY29kaW5nLlVURjggdG8gd3JpdGUgZGF0YSBhcyBzdHJpbmdcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBlbmNvZGluZz86IEVuY29kaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNyZWF0ZSBhbnkgbWlzc2luZyBwYXJlbnQgZGlyZWN0b3JpZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVjdXJzaXZlPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcHBlbmRGaWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0byBhcHBlbmRcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRhIHRvIHdyaXRlXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGF0YTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gc3RvcmUgdGhlIGZpbGUgaW5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG5cbiAgLyoqXG4gICAqIFRoZSBlbmNvZGluZyB0byB3cml0ZSB0aGUgZmlsZSBpbi4gSWYgbm90IHByb3ZpZGVkLCBkYXRhXG4gICAqIGlzIHdyaXR0ZW4gYXMgYmFzZTY0IGVuY29kZWQuXG4gICAqXG4gICAqIFBhc3MgRW5jb2RpbmcuVVRGOCB0byB3cml0ZSBkYXRhIGFzIHN0cmluZ1xuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGVuY29kaW5nPzogRW5jb2Rpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZEZpbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRvIHJlYWRcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byByZWFkIHRoZSBmaWxlIGZyb21cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG5cbiAgLyoqXG4gICAqIFRoZSBlbmNvZGluZyB0byByZWFkIHRoZSBmaWxlIGluLCBpZiBub3QgcHJvdmlkZWQsIGRhdGFcbiAgICogaXMgcmVhZCBhcyBiaW5hcnkgYW5kIHJldHVybmVkIGFzIGJhc2U2NCBlbmNvZGVkLlxuICAgKlxuICAgKiBQYXNzIEVuY29kaW5nLlVURjggdG8gcmVhZCBkYXRhIGFzIHN0cmluZ1xuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGVuY29kaW5nPzogRW5jb2Rpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBvZmZzZXQgdG8gc3RhcnQgcmVhZGluZyB0aGUgZmlsZSBmcm9tLCBpbiBieXRlcy5cbiAgICogTmF0aXZlIG9ubHkgKG5vdCBhdmFpbGFibGUgaW4gd2ViKS5cbiAgICogQ2FuIGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBsZW5ndGggdG8gcGFydGlhbGx5IHJlYWQgZmlsZXMuXG4gICAqXG4gICAqIEBzaW5jZSA4LjEuMFxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICBvZmZzZXQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBsZW5ndGggb2YgZGF0YSB0byByZWFkLCBpbiBieXRlcy5cbiAgICogQW55IG5vbi1wb3NpdGl2ZSB2YWx1ZSBtZWFucyB0byByZWFkIHRvIHRoZSBlbmQgb2YgdGhlIGZpbGUuXG4gICAqIE5hdGl2ZSBvbmx5IChub3QgYXZhaWxhYmxlIGluIHdlYikuXG4gICAqIENhbiBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggb2Zmc2V0IHRvIHBhcnRpYWxseSByZWFkIGZpbGVzLlxuICAgKlxuICAgKiBAc2luY2UgOC4xLjBcbiAgICogQGRlZmF1bHQgLTFcbiAgICovXG4gIGxlbmd0aD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWFkRmlsZUluQ2h1bmtzT3B0aW9ucyBleHRlbmRzIFJlYWRGaWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTaXplIG9mIHRoZSBjaHVua3MgaW4gYnl0ZXMuXG4gICAqXG4gICAqIEBzaW5jZSA3LjEuMFxuICAgKi9cbiAgY2h1bmtTaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlRmlsZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIGZpbGUgdG8gZGVsZXRlXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gZGVsZXRlIHRoZSBmaWxlIGZyb21cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWtkaXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBuZXcgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gbWFrZSB0aGUgbmV3IGRpcmVjdG9yeSBpblxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBjcmVhdGUgYW55IG1pc3NpbmcgcGFyZW50IGRpcmVjdG9yaWVzIGFzIHdlbGwuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVjdXJzaXZlPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSbWRpck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIGRpcmVjdG9yeSB0byByZW1vdmVcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byByZW1vdmUgdGhlIGRpcmVjdG9yeSBmcm9tXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJlY3Vyc2l2ZWx5IHJlbW92ZSB0aGUgY29udGVudHMgb2YgdGhlIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlY3Vyc2l2ZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZGRpck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIGRpcmVjdG9yeSB0byByZWFkXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gbGlzdCBmaWxlcyBmcm9tXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFVyaU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIGZpbGUgdG8gZ2V0IHRoZSBVUkkgZm9yXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gZ2V0IHRoZSBmaWxlIHVuZGVyXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5OiBEaXJlY3Rvcnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIGZpbGUgdG8gZ2V0IGRhdGEgYWJvdXRcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byBnZXQgdGhlIGZpbGUgdW5kZXJcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGV4aXN0aW5nIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZnJvbTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzdGluYXRpb24gZmlsZSBvciBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICB0bzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgY29udGFpbmluZyB0aGUgZXhpc3RpbmcgZmlsZSBvciBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCBjb250YWluaW5nIHRoZSBkZXN0aW5hdGlvbiBmaWxlIG9yIGRpcmVjdG9yeS4gSWYgbm90IHN1cHBsaWVkIHdpbGwgdXNlIHRoZSAnZGlyZWN0b3J5J1xuICAgKiBwYXJhbWV0ZXIgYXMgdGhlIGRlc3RpbmF0aW9uXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgdG9EaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG59XG5cbmV4cG9ydCB0eXBlIFJlbmFtZU9wdGlvbnMgPSBDb3B5T3B0aW9ucztcblxuZXhwb3J0IGludGVyZmFjZSBSZWFkRmlsZVJlc3VsdCB7XG4gIC8qKlxuICAgKiBUaGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRhdGEgY29udGFpbmVkIGluIHRoZSBmaWxlXG4gICAqXG4gICAqIE5vdGU6IEJsb2IgaXMgb25seSBhdmFpbGFibGUgb24gV2ViLiBPbiBuYXRpdmUsIHRoZSBkYXRhIGlzIHJldHVybmVkIGFzIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRhdGE6IHN0cmluZyB8IEJsb2I7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV3JpdGVGaWxlUmVzdWx0IHtcbiAgLyoqXG4gICAqIFRoZSB1cmkgd2hlcmUgdGhlIGZpbGUgd2FzIHdyaXR0ZW4gaW50b1xuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHVyaTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRkaXJSZXN1bHQge1xuICAvKipcbiAgICogTGlzdCBvZiBmaWxlcyBhbmQgZGlyZWN0b3JpZXMgaW5zaWRlIHRoZSBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBmaWxlczogRmlsZUluZm9bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGaWxlSW5mbyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBmaWxlIG9yIGRpcmVjdG9yeS5cbiAgICpcbiAgICogQHNpbmNlIDcuMS4wXG4gICAqL1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIGZpbGUuXG4gICAqXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKi9cbiAgdHlwZTogJ2RpcmVjdG9yeScgfCAnZmlsZSc7XG5cbiAgLyoqXG4gICAqIFNpemUgb2YgdGhlIGZpbGUgaW4gYnl0ZXMuXG4gICAqXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKi9cbiAgc2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaW1lIG9mIGNyZWF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICpcbiAgICogSXQncyBub3QgYXZhaWxhYmxlIG9uIEFuZHJvaWQgNyBhbmQgb2xkZXIgZGV2aWNlcy5cbiAgICpcbiAgICogQHNpbmNlIDcuMS4wXG4gICAqL1xuICBjdGltZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGltZSBvZiBsYXN0IG1vZGlmaWNhdGlvbiBpbiBtaWxsaXNlY29uZHMuXG4gICAqXG4gICAqIEBzaW5jZSA3LjEuMFxuICAgKi9cbiAgbXRpbWU6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHVyaSBvZiB0aGUgZmlsZS5cbiAgICpcbiAgICogQHNpbmNlIDQuMC4wXG4gICAqL1xuICB1cmk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRVcmlSZXN1bHQge1xuICAvKipcbiAgICogVGhlIHVyaSBvZiB0aGUgZmlsZVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHVyaTogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBTdGF0UmVzdWx0ID0gRmlsZUluZm87XG5leHBvcnQgaW50ZXJmYWNlIENvcHlSZXN1bHQge1xuICAvKipcbiAgICogVGhlIHVyaSB3aGVyZSB0aGUgZmlsZSB3YXMgY29waWVkIGludG9cbiAgICpcbiAgICogQHNpbmNlIDQuMC4wXG4gICAqL1xuICB1cmk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEb3dubG9hZEZpbGVPcHRpb25zIGV4dGVuZHMgSHR0cE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggdGhlIGRvd25sb2FkZWQgZmlsZSBzaG91bGQgYmUgbW92ZWQgdG8uXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGRpcmVjdG9yeSB0byB3cml0ZSB0aGUgZmlsZSB0by5cbiAgICogSWYgdGhpcyBvcHRpb24gaXMgdXNlZCwgZmlsZVBhdGggY2FuIGJlIGEgcmVsYXRpdmUgcGF0aCByYXRoZXIgdGhhbiBhYnNvbHV0ZS5cbiAgICogVGhlIGRlZmF1bHQgaXMgdGhlIGBEQVRBYCBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgbGlzdGVuZXIgZnVuY3Rpb24gdG8gcmVjZWl2ZSBkb3dubG9hZGVkIHByb2dyZXNzIGV2ZW50cy5cbiAgICogSWYgdGhpcyBvcHRpb24gaXMgdXNlZCwgcHJvZ3Jlc3MgZXZlbnQgc2hvdWxkIGJlIGRpc3BhdGNoZWQgb24gZXZlcnkgY2h1bmsgcmVjZWl2ZWQuXG4gICAqIENodW5rcyBhcmUgdGhyb3R0bGVkIHRvIGV2ZXJ5IDEwMG1zIG9uIEFuZHJvaWQvaU9TIHRvIGF2b2lkIHNsb3dkb3ducy5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqL1xuICBwcm9ncmVzcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNyZWF0ZSBhbnkgbWlzc2luZyBwYXJlbnQgZGlyZWN0b3JpZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEBzaW5jZSA1LjEuMlxuICAgKi9cbiAgcmVjdXJzaXZlPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEb3dubG9hZEZpbGVSZXN1bHQge1xuICAvKipcbiAgICogVGhlIHBhdGggdGhlIGZpbGUgd2FzIGRvd25sb2FkZWQgdG8uXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgcGF0aD86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBibG9iIGRhdGEgb2YgdGhlIGRvd25sb2FkZWQgZmlsZS5cbiAgICogVGhpcyBpcyBvbmx5IGF2YWlsYWJsZSBvbiB3ZWIuXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgYmxvYj86IEJsb2I7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvZ3Jlc3NTdGF0dXMge1xuICAvKipcbiAgICogVGhlIHVybCBvZiB0aGUgZmlsZSBiZWluZyBkb3dubG9hZGVkLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIHVybDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBieXRlcyBkb3dubG9hZGVkIHNvIGZhci5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqL1xuICBieXRlczogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIHRvdGFsIG51bWJlciBvZiBieXRlcyB0byBkb3dubG9hZCBmb3IgdGhpcyBmaWxlLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIGNvbnRlbnRMZW5ndGg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBmb3IgcmVjZWl2aW5nIGNodW5rcyByZWFkIGZyb20gYSBmaWxlLCBvciBlcnJvciBpZiBzb21ldGhpbmcgd2VudCB3cm9uZy5cbiAqXG4gKiBAc2luY2UgNy4xLjBcbiAqL1xuZXhwb3J0IHR5cGUgUmVhZEZpbGVJbkNodW5rc0NhbGxiYWNrID0gKGNodW5rUmVhZDogUmVhZEZpbGVSZXN1bHQgfCBudWxsLCBlcnI/OiBhbnkpID0+IHZvaWQ7XG5cbi8qKlxuICogQSBsaXN0ZW5lciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHByb2dyZXNzIGV2ZW50cy5cbiAqXG4gKiBAc2luY2UgNS4xLjBcbiAqL1xuZXhwb3J0IHR5cGUgUHJvZ3Jlc3NMaXN0ZW5lciA9IChwcm9ncmVzczogUHJvZ3Jlc3NTdGF0dXMpID0+IHZvaWQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZXN5c3RlbVBsdWdpbiB7XG4gIC8qKlxuICAgKiBDaGVjayByZWFkL3dyaXRlIHBlcm1pc3Npb25zLlxuICAgKiBSZXF1aXJlZCBvbiBBbmRyb2lkLCBvbmx5IHdoZW4gdXNpbmcgYERpcmVjdG9yeS5Eb2N1bWVudHNgIG9yXG4gICAqIGBEaXJlY3RvcnkuRXh0ZXJuYWxTdG9yYWdlYC5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBjaGVja1Blcm1pc3Npb25zKCk6IFByb21pc2U8UGVybWlzc2lvblN0YXR1cz47XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgcmVhZC93cml0ZSBwZXJtaXNzaW9ucy5cbiAgICogUmVxdWlyZWQgb24gQW5kcm9pZCwgb25seSB3aGVuIHVzaW5nIGBEaXJlY3RvcnkuRG9jdW1lbnRzYCBvclxuICAgKiBgRGlyZWN0b3J5LkV4dGVybmFsU3RvcmFnZWAuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVxdWVzdFBlcm1pc3Npb25zKCk6IFByb21pc2U8UGVybWlzc2lvblN0YXR1cz47XG5cbiAgLyoqXG4gICAqIFJlYWQgYSBmaWxlIGZyb20gZGlza1xuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlYWRGaWxlKG9wdGlvbnM6IFJlYWRGaWxlT3B0aW9ucyk6IFByb21pc2U8UmVhZEZpbGVSZXN1bHQ+O1xuXG4gIC8qKlxuICAgKiBSZWFkIGEgZmlsZSBmcm9tIGRpc2ssIGluIGNodW5rcy5cbiAgICogTmF0aXZlIG9ubHkgKG5vdCBhdmFpbGFibGUgaW4gd2ViKS5cbiAgICogVXNlIHRoZSBjYWxsYmFjayB0byByZWNlaXZlIGVhY2ggcmVhZCBjaHVuay5cbiAgICogSWYgZW1wdHkgY2h1bmsgaXMgcmV0dXJuZWQsIGl0IG1lYW5zIGZpbGUgaGFzIGJlZW4gY29tcGxldGVseSByZWFkLlxuICAgKlxuICAgKiBAc2luY2UgNy4xLjBcbiAgICovXG4gIHJlYWRGaWxlSW5DaHVua3Mob3B0aW9uczogUmVhZEZpbGVJbkNodW5rc09wdGlvbnMsIGNhbGxiYWNrOiBSZWFkRmlsZUluQ2h1bmtzQ2FsbGJhY2spOiBQcm9taXNlPENhbGxiYWNrSUQ+O1xuXG4gIC8qKlxuICAgKiBXcml0ZSBhIGZpbGUgdG8gZGlzayBpbiB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uIG9uIGRldmljZVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHdyaXRlRmlsZShvcHRpb25zOiBXcml0ZUZpbGVPcHRpb25zKTogUHJvbWlzZTxXcml0ZUZpbGVSZXN1bHQ+O1xuXG4gIC8qKlxuICAgKiBBcHBlbmQgdG8gYSBmaWxlIG9uIGRpc2sgaW4gdGhlIHNwZWNpZmllZCBsb2NhdGlvbiBvbiBkZXZpY2VcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBhcHBlbmRGaWxlKG9wdGlvbnM6IEFwcGVuZEZpbGVPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogRGVsZXRlIGEgZmlsZSBmcm9tIGRpc2tcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkZWxldGVGaWxlKG9wdGlvbnM6IERlbGV0ZUZpbGVPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIG1rZGlyKG9wdGlvbnM6IE1rZGlyT3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJtZGlyKG9wdGlvbnM6IFJtZGlyT3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGxpc3Qgb2YgZmlsZXMgZnJvbSB0aGUgZGlyZWN0b3J5IChub3QgcmVjdXJzaXZlKVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlYWRkaXIob3B0aW9uczogUmVhZGRpck9wdGlvbnMpOiBQcm9taXNlPFJlYWRkaXJSZXN1bHQ+O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gZnVsbCBGaWxlIFVSSSBmb3IgYSBwYXRoIGFuZCBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBnZXRVcmkob3B0aW9uczogR2V0VXJpT3B0aW9ucyk6IFByb21pc2U8R2V0VXJpUmVzdWx0PjtcblxuICAvKipcbiAgICogUmV0dXJuIGRhdGEgYWJvdXQgYSBmaWxlXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgc3RhdChvcHRpb25zOiBTdGF0T3B0aW9ucyk6IFByb21pc2U8U3RhdFJlc3VsdD47XG5cbiAgLyoqXG4gICAqIFJlbmFtZSBhIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcmVuYW1lKG9wdGlvbnM6IFJlbmFtZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBDb3B5IGEgZmlsZSBvciBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBjb3B5KG9wdGlvbnM6IENvcHlPcHRpb25zKTogUHJvbWlzZTxDb3B5UmVzdWx0PjtcblxuICAvKipcbiAgICogUGVyZm9ybSBhIGh0dHAgcmVxdWVzdCB0byBhIHNlcnZlciBhbmQgZG93bmxvYWQgdGhlIGZpbGUgdG8gdGhlIHNwZWNpZmllZCBkZXN0aW5hdGlvbi5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDcuMS4wLlxuICAgKiBXZSByZWNvbW1lbmQgdXNpbmcgdGhlIEBjYXBhY2l0b3IvZmlsZS10cmFuc2ZlciBwbHVnaW4gaW5zdGVhZCwgaW4gY29uanVuY3Rpb24gd2l0aCB0aGlzIHBsdWdpbi5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgQGNhcGFjaXRvci9maWxlLXRyYW5zZmVyIHBsdWdpbiBpbnN0ZWFkLlxuICAgKi9cbiAgZG93bmxvYWRGaWxlKG9wdGlvbnM6IERvd25sb2FkRmlsZU9wdGlvbnMpOiBQcm9taXNlPERvd25sb2FkRmlsZVJlc3VsdD47XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGZpbGUgZG93bmxvYWQgcHJvZ3Jlc3MgZXZlbnRzLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gNy4xLjAuXG4gICAqIFdlIHJlY29tbWVuZCB1c2luZyB0aGUgQGNhcGFjaXRvci9maWxlLXRyYW5zZmVyIHBsdWdpbiBpbnN0ZWFkLCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoaXMgcGx1Z2luLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBAY2FwYWNpdG9yL2ZpbGUtdHJhbnNmZXIgcGx1Z2luIGluc3RlYWQuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihldmVudE5hbWU6ICdwcm9ncmVzcycsIGxpc3RlbmVyRnVuYzogUHJvZ3Jlc3NMaXN0ZW5lcik6IFByb21pc2U8UGx1Z2luTGlzdGVuZXJIYW5kbGU+O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhpcyBwbHVnaW4uXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiA3LjEuMC5cbiAgICogV2UgcmVjb21tZW5kIHVzaW5nIHRoZSBAY2FwYWNpdG9yL2ZpbGUtdHJhbnNmZXIgcGx1Z2luIGluc3RlYWQsIGluIGNvbmp1bmN0aW9uIHdpdGggdGhpcyBwbHVnaW4uXG4gICAqXG4gICAqIEBzaW5jZSA1LjIuMFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIEBjYXBhY2l0b3IvZmlsZS10cmFuc2ZlciBwbHVnaW4gaW5zdGVhZC5cbiAgICovXG4gIHJlbW92ZUFsbExpc3RlbmVycygpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG4vKipcbiAqIFN0cnVjdHVyZSBmb3IgZXJyb3JzIHJldHVybmVkIGJ5IHRoZSBwbHVnaW4uXG4gKlxuICogYGNvZGVgIGZvbGxvd3MgXCJPUy1QTFVHLUZJTEUtWFhYWFwiIGZvcm1hdFxuICpcbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgdHlwZSBQbHVnaW5FcnJvciA9IHtcbiAgY29kZTogc3RyaW5nO1xuICBtZXNzYWdlOiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgUmVhZEZpbGVPcHRpb25zYC5cbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgdHlwZSBGaWxlUmVhZE9wdGlvbnMgPSBSZWFkRmlsZU9wdGlvbnM7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBSZWFkRmlsZVJlc3VsdGAuXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgRmlsZVJlYWRSZXN1bHQgPSBSZWFkRmlsZVJlc3VsdDtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFdyaXRlRmlsZU9wdGlvbnNgLlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVXcml0ZU9wdGlvbnMgPSBXcml0ZUZpbGVPcHRpb25zO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgV3JpdGVGaWxlUmVzdWx0YC5cbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgdHlwZSBGaWxlV3JpdGVSZXN1bHQgPSBXcml0ZUZpbGVSZXN1bHQ7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBBcHBlbmRGaWxlT3B0aW9uc2AuXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgRmlsZUFwcGVuZE9wdGlvbnMgPSBBcHBlbmRGaWxlT3B0aW9ucztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYERlbGV0ZUZpbGVPcHRpb25zYC5cbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgdHlwZSBGaWxlRGVsZXRlT3B0aW9ucyA9IERlbGV0ZUZpbGVPcHRpb25zO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgRGlyZWN0b3J5YC5cbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgY29uc3QgRmlsZXN5c3RlbURpcmVjdG9yeSA9IERpcmVjdG9yeTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYEVuY29kaW5nYC5cbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgY29uc3QgRmlsZXN5c3RlbUVuY29kaW5nID0gRW5jb2Rpbmc7XG4iLCAiaW1wb3J0IHsgV2ViUGx1Z2luLCBidWlsZFJlcXVlc3RJbml0IH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcblxuaW1wb3J0IHR5cGUge1xuICBBcHBlbmRGaWxlT3B0aW9ucyxcbiAgQ29weU9wdGlvbnMsXG4gIENvcHlSZXN1bHQsXG4gIERlbGV0ZUZpbGVPcHRpb25zLFxuICBGaWxlc3lzdGVtUGx1Z2luLFxuICBHZXRVcmlPcHRpb25zLFxuICBHZXRVcmlSZXN1bHQsXG4gIE1rZGlyT3B0aW9ucyxcbiAgUGVybWlzc2lvblN0YXR1cyxcbiAgUmVhZEZpbGVPcHRpb25zLFxuICBSZWFkRmlsZVJlc3VsdCxcbiAgUmVhZGRpck9wdGlvbnMsXG4gIFJlYWRkaXJSZXN1bHQsXG4gIFJlbmFtZU9wdGlvbnMsXG4gIFJtZGlyT3B0aW9ucyxcbiAgU3RhdE9wdGlvbnMsXG4gIFN0YXRSZXN1bHQsXG4gIFdyaXRlRmlsZU9wdGlvbnMsXG4gIFdyaXRlRmlsZVJlc3VsdCxcbiAgRGlyZWN0b3J5LFxuICBSZWFkRmlsZUluQ2h1bmtzT3B0aW9ucyxcbiAgQ2FsbGJhY2tJRCxcbiAgRG93bmxvYWRGaWxlT3B0aW9ucyxcbiAgRG93bmxvYWRGaWxlUmVzdWx0LFxuICBQcm9ncmVzc1N0YXR1cyxcbiAgUmVhZEZpbGVJbkNodW5rc0NhbGxiYWNrLFxufSBmcm9tICcuL2RlZmluaXRpb25zJztcbmltcG9ydCB7IEVuY29kaW5nIH0gZnJvbSAnLi9kZWZpbml0aW9ucyc7XG5cbmZ1bmN0aW9uIHJlc29sdmUocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcG9zaXggPSBwYXRoLnNwbGl0KCcvJykuZmlsdGVyKChpdGVtKSA9PiBpdGVtICE9PSAnLicpO1xuICBjb25zdCBuZXdQb3NpeDogc3RyaW5nW10gPSBbXTtcblxuICBwb3NpeC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaWYgKGl0ZW0gPT09ICcuLicgJiYgbmV3UG9zaXgubGVuZ3RoID4gMCAmJiBuZXdQb3NpeFtuZXdQb3NpeC5sZW5ndGggLSAxXSAhPT0gJy4uJykge1xuICAgICAgbmV3UG9zaXgucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1Bvc2l4LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbmV3UG9zaXguam9pbignLycpO1xufVxuZnVuY3Rpb24gaXNQYXRoUGFyZW50KHBhcmVudDogc3RyaW5nLCBjaGlsZHJlbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHBhcmVudCA9IHJlc29sdmUocGFyZW50KTtcbiAgY2hpbGRyZW4gPSByZXNvbHZlKGNoaWxkcmVuKTtcbiAgY29uc3QgcGF0aHNBID0gcGFyZW50LnNwbGl0KCcvJyk7XG4gIGNvbnN0IHBhdGhzQiA9IGNoaWxkcmVuLnNwbGl0KCcvJyk7XG5cbiAgcmV0dXJuIHBhcmVudCAhPT0gY2hpbGRyZW4gJiYgcGF0aHNBLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlID09PSBwYXRoc0JbaW5kZXhdKTtcbn1cblxuZXhwb3J0IGNsYXNzIEZpbGVzeXN0ZW1XZWIgZXh0ZW5kcyBXZWJQbHVnaW4gaW1wbGVtZW50cyBGaWxlc3lzdGVtUGx1Z2luIHtcbiAgcmVhZEZpbGVJbkNodW5rcyhfb3B0aW9uczogUmVhZEZpbGVJbkNodW5rc09wdGlvbnMsIF9jYWxsYmFjazogUmVhZEZpbGVJbkNodW5rc0NhbGxiYWNrKTogUHJvbWlzZTxDYWxsYmFja0lEPiB7XG4gICAgdGhyb3cgdGhpcy51bmF2YWlsYWJsZSgnTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgfVxuICBEQl9WRVJTSU9OID0gMTtcbiAgREJfTkFNRSA9ICdEaXNjJztcblxuICBwcml2YXRlIF93cml0ZUNtZHM6IHN0cmluZ1tdID0gWydhZGQnLCAncHV0JywgJ2RlbGV0ZSddO1xuICBwcml2YXRlIF9kYj86IElEQkRhdGFiYXNlO1xuICBzdGF0aWMgX2RlYnVnID0gdHJ1ZTtcbiAgYXN5bmMgaW5pdERiKCk6IFByb21pc2U8SURCRGF0YWJhc2U+IHtcbiAgICBpZiAodGhpcy5fZGIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RiO1xuICAgIH1cbiAgICBpZiAoISgnaW5kZXhlZERCJyBpbiB3aW5kb3cpKSB7XG4gICAgICB0aHJvdyB0aGlzLnVuYXZhaWxhYmxlKFwiVGhpcyBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBJbmRleGVkREJcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPElEQkRhdGFiYXNlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4odGhpcy5EQl9OQU1FLCB0aGlzLkRCX1ZFUlNJT04pO1xuICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSBGaWxlc3lzdGVtV2ViLmRvVXBncmFkZTtcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICB0aGlzLl9kYiA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICByZXF1ZXN0Lm9uYmxvY2tlZCA9ICgpID0+IHtcbiAgICAgICAgY29uc29sZS53YXJuKCdkYiBibG9ja2VkJyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGRvVXBncmFkZShldmVudDogSURCVmVyc2lvbkNoYW5nZUV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQgYXMgSURCT3BlbkRCUmVxdWVzdDtcbiAgICBjb25zdCBkYiA9IGV2ZW50VGFyZ2V0LnJlc3VsdDtcbiAgICBzd2l0Y2ggKGV2ZW50Lm9sZFZlcnNpb24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgIGNhc2UgMTpcbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgaWYgKGRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoJ0ZpbGVTdG9yYWdlJykpIHtcbiAgICAgICAgICBkYi5kZWxldGVPYmplY3RTdG9yZSgnRmlsZVN0b3JhZ2UnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKCdGaWxlU3RvcmFnZScsIHsga2V5UGF0aDogJ3BhdGgnIH0pO1xuICAgICAgICBzdG9yZS5jcmVhdGVJbmRleCgnYnlfZm9sZGVyJywgJ2ZvbGRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRiUmVxdWVzdChjbWQ6IHN0cmluZywgYXJnczogYW55W10pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHJlYWRGbGFnID0gdGhpcy5fd3JpdGVDbWRzLmluZGV4T2YoY21kKSAhPT0gLTEgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seSc7XG4gICAgcmV0dXJuIHRoaXMuaW5pdERiKCkudGhlbigoY29ubjogSURCRGF0YWJhc2UpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxJREJPYmplY3RTdG9yZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB0eDogSURCVHJhbnNhY3Rpb24gPSBjb25uLnRyYW5zYWN0aW9uKFsnRmlsZVN0b3JhZ2UnXSwgcmVhZEZsYWcpO1xuICAgICAgICBjb25zdCBzdG9yZTogYW55ID0gdHgub2JqZWN0U3RvcmUoJ0ZpbGVTdG9yYWdlJyk7XG4gICAgICAgIGNvbnN0IHJlcSA9IHN0b3JlW2NtZF0oLi4uYXJncyk7XG4gICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoKSA9PiByZXNvbHZlKHJlcS5yZXN1bHQpO1xuICAgICAgICByZXEub25lcnJvciA9ICgpID0+IHJlamVjdChyZXEuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBkYkluZGV4UmVxdWVzdChpbmRleE5hbWU6IHN0cmluZywgY21kOiBzdHJpbmcsIGFyZ3M6IFthbnldKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCByZWFkRmxhZyA9IHRoaXMuX3dyaXRlQ21kcy5pbmRleE9mKGNtZCkgIT09IC0xID8gJ3JlYWR3cml0ZScgOiAncmVhZG9ubHknO1xuICAgIHJldHVybiB0aGlzLmluaXREYigpLnRoZW4oKGNvbm46IElEQkRhdGFiYXNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8SURCT2JqZWN0U3RvcmU+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdHg6IElEQlRyYW5zYWN0aW9uID0gY29ubi50cmFuc2FjdGlvbihbJ0ZpbGVTdG9yYWdlJ10sIHJlYWRGbGFnKTtcbiAgICAgICAgY29uc3Qgc3RvcmU6IElEQk9iamVjdFN0b3JlID0gdHgub2JqZWN0U3RvcmUoJ0ZpbGVTdG9yYWdlJyk7XG4gICAgICAgIGNvbnN0IGluZGV4OiBhbnkgPSBzdG9yZS5pbmRleChpbmRleE5hbWUpO1xuICAgICAgICBjb25zdCByZXEgPSBpbmRleFtjbWRdKC4uLmFyZ3MpIGFzIGFueTtcbiAgICAgICAgcmVxLm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUocmVxLnJlc3VsdCk7XG4gICAgICAgIHJlcS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHJlcS5lcnJvcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UGF0aChkaXJlY3Rvcnk6IERpcmVjdG9yeSB8IHVuZGVmaW5lZCwgdXJpUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICBjb25zdCBjbGVhbmVkVXJpUGF0aCA9IHVyaVBhdGggIT09IHVuZGVmaW5lZCA/IHVyaVBhdGgucmVwbGFjZSgvXlsvXSt8Wy9dKyQvZywgJycpIDogJyc7XG4gICAgbGV0IGZzUGF0aCA9ICcnO1xuICAgIGlmIChkaXJlY3RvcnkgIT09IHVuZGVmaW5lZCkgZnNQYXRoICs9ICcvJyArIGRpcmVjdG9yeTtcbiAgICBpZiAodXJpUGF0aCAhPT0gJycpIGZzUGF0aCArPSAnLycgKyBjbGVhbmVkVXJpUGF0aDtcbiAgICByZXR1cm4gZnNQYXRoO1xuICB9XG5cbiAgYXN5bmMgY2xlYXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY29ubjogSURCRGF0YWJhc2UgPSBhd2FpdCB0aGlzLmluaXREYigpO1xuICAgIGNvbnN0IHR4OiBJREJUcmFuc2FjdGlvbiA9IGNvbm4udHJhbnNhY3Rpb24oWydGaWxlU3RvcmFnZSddLCAncmVhZHdyaXRlJyk7XG4gICAgY29uc3Qgc3RvcmU6IElEQk9iamVjdFN0b3JlID0gdHgub2JqZWN0U3RvcmUoJ0ZpbGVTdG9yYWdlJyk7XG4gICAgc3RvcmUuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIGEgZmlsZSBmcm9tIGRpc2tcbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBmb3IgdGhlIGZpbGUgcmVhZFxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlYWQgZmlsZSBkYXRhIHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgcmVhZEZpbGUob3B0aW9uczogUmVhZEZpbGVPcHRpb25zKTogUHJvbWlzZTxSZWFkRmlsZVJlc3VsdD4ge1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChvcHRpb25zLmRpcmVjdG9yeSwgb3B0aW9ucy5wYXRoKTtcbiAgICAvLyBjb25zdCBlbmNvZGluZyA9IG9wdGlvbnMuZW5jb2Rpbmc7XG5cbiAgICBjb25zdCBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKCdGaWxlIGRvZXMgbm90IGV4aXN0LicpO1xuICAgIHJldHVybiB7IGRhdGE6IGVudHJ5LmNvbnRlbnQgPyBlbnRyeS5jb250ZW50IDogJycgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSBhIGZpbGUgdG8gZGlzayBpbiB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uIG9uIGRldmljZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGUgZmlsZSB3cml0ZVxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGZpbGUgd3JpdGUgcmVzdWx0XG4gICAqL1xuICBhc3luYyB3cml0ZUZpbGUob3B0aW9uczogV3JpdGVGaWxlT3B0aW9ucyk6IFByb21pc2U8V3JpdGVGaWxlUmVzdWx0PiB7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKG9wdGlvbnMuZGlyZWN0b3J5LCBvcHRpb25zLnBhdGgpO1xuICAgIGxldCBkYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgIGNvbnN0IGVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZztcbiAgICBjb25zdCBkb1JlY3Vyc2l2ZSA9IG9wdGlvbnMucmVjdXJzaXZlO1xuXG4gICAgY29uc3Qgb2NjdXBpZWRFbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKG9jY3VwaWVkRW50cnkgJiYgb2NjdXBpZWRFbnRyeS50eXBlID09PSAnZGlyZWN0b3J5JykgdGhyb3cgRXJyb3IoJ1RoZSBzdXBwbGllZCBwYXRoIGlzIGEgZGlyZWN0b3J5LicpO1xuXG4gICAgY29uc3QgcGFyZW50UGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGgubGFzdEluZGV4T2YoJy8nKSk7XG5cbiAgICBjb25zdCBwYXJlbnRFbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhcmVudFBhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKHBhcmVudEVudHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHN1YkRpckluZGV4ID0gcGFyZW50UGF0aC5pbmRleE9mKCcvJywgMSk7XG4gICAgICBpZiAoc3ViRGlySW5kZXggIT09IC0xKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudEFyZ1BhdGggPSBwYXJlbnRQYXRoLnN1YnN0cihzdWJEaXJJbmRleCk7XG4gICAgICAgIGF3YWl0IHRoaXMubWtkaXIoe1xuICAgICAgICAgIHBhdGg6IHBhcmVudEFyZ1BhdGgsXG4gICAgICAgICAgZGlyZWN0b3J5OiBvcHRpb25zLmRpcmVjdG9yeSxcbiAgICAgICAgICByZWN1cnNpdmU6IGRvUmVjdXJzaXZlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWVuY29kaW5nICYmICEoZGF0YSBpbnN0YW5jZW9mIEJsb2IpKSB7XG4gICAgICBkYXRhID0gZGF0YS5pbmRleE9mKCcsJykgPj0gMCA/IGRhdGEuc3BsaXQoJywnKVsxXSA6IGRhdGE7XG4gICAgICBpZiAoIXRoaXMuaXNCYXNlNjRTdHJpbmcoZGF0YSkpIHRocm93IEVycm9yKCdUaGUgc3VwcGxpZWQgZGF0YSBpcyBub3QgdmFsaWQgYmFzZTY0IGNvbnRlbnQuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBwYXRoT2JqOiBFbnRyeU9iaiA9IHtcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBmb2xkZXI6IHBhcmVudFBhdGgsXG4gICAgICB0eXBlOiAnZmlsZScsXG4gICAgICBzaXplOiBkYXRhIGluc3RhbmNlb2YgQmxvYiA/IGRhdGEuc2l6ZSA6IGRhdGEubGVuZ3RoLFxuICAgICAgY3RpbWU6IG5vdyxcbiAgICAgIG10aW1lOiBub3csXG4gICAgICBjb250ZW50OiBkYXRhLFxuICAgIH07XG4gICAgYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ3B1dCcsIFtwYXRoT2JqXSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVyaTogcGF0aE9iai5wYXRoLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kIHRvIGEgZmlsZSBvbiBkaXNrIGluIHRoZSBzcGVjaWZpZWQgbG9jYXRpb24gb24gZGV2aWNlXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgZm9yIHRoZSBmaWxlIGFwcGVuZFxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGZpbGUgd3JpdGUgcmVzdWx0XG4gICAqL1xuICBhc3luYyBhcHBlbmRGaWxlKG9wdGlvbnM6IEFwcGVuZEZpbGVPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKG9wdGlvbnMuZGlyZWN0b3J5LCBvcHRpb25zLnBhdGgpO1xuICAgIGxldCBkYXRhID0gb3B0aW9ucy5kYXRhO1xuICAgIGNvbnN0IGVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZztcbiAgICBjb25zdCBwYXJlbnRQYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aC5sYXN0SW5kZXhPZignLycpKTtcblxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgbGV0IGN0aW1lID0gbm93O1xuXG4gICAgY29uc3Qgb2NjdXBpZWRFbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKG9jY3VwaWVkRW50cnkgJiYgb2NjdXBpZWRFbnRyeS50eXBlID09PSAnZGlyZWN0b3J5JykgdGhyb3cgRXJyb3IoJ1RoZSBzdXBwbGllZCBwYXRoIGlzIGEgZGlyZWN0b3J5LicpO1xuXG4gICAgY29uc3QgcGFyZW50RW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXJlbnRQYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChwYXJlbnRFbnRyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBzdWJEaXJJbmRleCA9IHBhcmVudFBhdGguaW5kZXhPZignLycsIDEpO1xuICAgICAgaWYgKHN1YkRpckluZGV4ICE9PSAtMSkge1xuICAgICAgICBjb25zdCBwYXJlbnRBcmdQYXRoID0gcGFyZW50UGF0aC5zdWJzdHIoc3ViRGlySW5kZXgpO1xuICAgICAgICBhd2FpdCB0aGlzLm1rZGlyKHtcbiAgICAgICAgICBwYXRoOiBwYXJlbnRBcmdQYXRoLFxuICAgICAgICAgIGRpcmVjdG9yeTogb3B0aW9ucy5kaXJlY3RvcnksXG4gICAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWVuY29kaW5nICYmICF0aGlzLmlzQmFzZTY0U3RyaW5nKGRhdGEpKSB0aHJvdyBFcnJvcignVGhlIHN1cHBsaWVkIGRhdGEgaXMgbm90IHZhbGlkIGJhc2U2NCBjb250ZW50LicpO1xuXG4gICAgaWYgKG9jY3VwaWVkRW50cnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG9jY3VwaWVkRW50cnkuY29udGVudCBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1RoZSBvY2N1cGllZCBlbnRyeSBjb250YWlucyBhIEJsb2Igb2JqZWN0IHdoaWNoIGNhbm5vdCBiZSBhcHBlbmRlZCB0by4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9jY3VwaWVkRW50cnkuY29udGVudCAhPT0gdW5kZWZpbmVkICYmICFlbmNvZGluZykge1xuICAgICAgICBkYXRhID0gYnRvYShhdG9iKG9jY3VwaWVkRW50cnkuY29udGVudCkgKyBhdG9iKGRhdGEpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGEgPSBvY2N1cGllZEVudHJ5LmNvbnRlbnQgKyBkYXRhO1xuICAgICAgfVxuICAgICAgY3RpbWUgPSBvY2N1cGllZEVudHJ5LmN0aW1lO1xuICAgIH1cbiAgICBjb25zdCBwYXRoT2JqOiBFbnRyeU9iaiA9IHtcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBmb2xkZXI6IHBhcmVudFBhdGgsXG4gICAgICB0eXBlOiAnZmlsZScsXG4gICAgICBzaXplOiBkYXRhLmxlbmd0aCxcbiAgICAgIGN0aW1lOiBjdGltZSxcbiAgICAgIG10aW1lOiBub3csXG4gICAgICBjb250ZW50OiBkYXRhLFxuICAgIH07XG4gICAgYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ3B1dCcsIFtwYXRoT2JqXSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGEgZmlsZSBmcm9tIGRpc2tcbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBmb3IgdGhlIGZpbGUgZGVsZXRlXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgZGVsZXRlZCBmaWxlIGRhdGEgcmVzdWx0XG4gICAqL1xuICBhc3luYyBkZWxldGVGaWxlKG9wdGlvbnM6IERlbGV0ZUZpbGVPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKG9wdGlvbnMuZGlyZWN0b3J5LCBvcHRpb25zLnBhdGgpO1xuXG4gICAgY29uc3QgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcignRmlsZSBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICBjb25zdCBlbnRyaWVzID0gYXdhaXQgdGhpcy5kYkluZGV4UmVxdWVzdCgnYnlfZm9sZGVyJywgJ2dldEFsbEtleXMnLCBbSURCS2V5UmFuZ2Uub25seShwYXRoKV0pO1xuICAgIGlmIChlbnRyaWVzLmxlbmd0aCAhPT0gMCkgdGhyb3cgRXJyb3IoJ0ZvbGRlciBpcyBub3QgZW1wdHkuJyk7XG5cbiAgICBhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZGVsZXRlJywgW3BhdGhdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBkaXJlY3RvcnkuXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgZm9yIHRoZSBta2RpclxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIG1rZGlyIHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgbWtkaXIob3B0aW9uczogTWtkaXJPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKG9wdGlvbnMuZGlyZWN0b3J5LCBvcHRpb25zLnBhdGgpO1xuICAgIGNvbnN0IGRvUmVjdXJzaXZlID0gb3B0aW9ucy5yZWN1cnNpdmU7XG4gICAgY29uc3QgcGFyZW50UGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGgubGFzdEluZGV4T2YoJy8nKSk7XG5cbiAgICBjb25zdCBkZXB0aCA9IChwYXRoLm1hdGNoKC9cXC8vZykgfHwgW10pLmxlbmd0aDtcbiAgICBjb25zdCBwYXJlbnRFbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhcmVudFBhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgY29uc3Qgb2NjdXBpZWRFbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKGRlcHRoID09PSAxKSB0aHJvdyBFcnJvcignQ2Fubm90IGNyZWF0ZSBSb290IGRpcmVjdG9yeScpO1xuICAgIGlmIChvY2N1cGllZEVudHJ5ICE9PSB1bmRlZmluZWQpIHRocm93IEVycm9yKCdDdXJyZW50IGRpcmVjdG9yeSBkb2VzIGFscmVhZHkgZXhpc3QuJyk7XG4gICAgaWYgKCFkb1JlY3Vyc2l2ZSAmJiBkZXB0aCAhPT0gMiAmJiBwYXJlbnRFbnRyeSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcignUGFyZW50IGRpcmVjdG9yeSBtdXN0IGV4aXN0Jyk7XG5cbiAgICBpZiAoZG9SZWN1cnNpdmUgJiYgZGVwdGggIT09IDIgJiYgcGFyZW50RW50cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcGFyZW50QXJnUGF0aCA9IHBhcmVudFBhdGguc3Vic3RyKHBhcmVudFBhdGguaW5kZXhPZignLycsIDEpKTtcbiAgICAgIGF3YWl0IHRoaXMubWtkaXIoe1xuICAgICAgICBwYXRoOiBwYXJlbnRBcmdQYXRoLFxuICAgICAgICBkaXJlY3Rvcnk6IG9wdGlvbnMuZGlyZWN0b3J5LFxuICAgICAgICByZWN1cnNpdmU6IGRvUmVjdXJzaXZlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgY29uc3QgcGF0aE9iajogRW50cnlPYmogPSB7XG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgZm9sZGVyOiBwYXJlbnRQYXRoLFxuICAgICAgdHlwZTogJ2RpcmVjdG9yeScsXG4gICAgICBzaXplOiAwLFxuICAgICAgY3RpbWU6IG5vdyxcbiAgICAgIG10aW1lOiBub3csXG4gICAgfTtcbiAgICBhd2FpdCB0aGlzLmRiUmVxdWVzdCgncHV0JywgW3BhdGhPYmpdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBkaXJlY3RvcnlcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSBkaXJlY3RvcnkgcmVtb3ZlXG4gICAqL1xuICBhc3luYyBybWRpcihvcHRpb25zOiBSbWRpck9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHBhdGgsIGRpcmVjdG9yeSwgcmVjdXJzaXZlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGZ1bGxQYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgoZGlyZWN0b3J5LCBwYXRoKTtcblxuICAgIGNvbnN0IGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbZnVsbFBhdGhdKSkgYXMgRW50cnlPYmo7XG5cbiAgICBpZiAoZW50cnkgPT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3IoJ0ZvbGRlciBkb2VzIG5vdCBleGlzdC4nKTtcblxuICAgIGlmIChlbnRyeS50eXBlICE9PSAnZGlyZWN0b3J5JykgdGhyb3cgRXJyb3IoJ1JlcXVlc3RlZCBwYXRoIGlzIG5vdCBhIGRpcmVjdG9yeScpO1xuXG4gICAgY29uc3QgcmVhZERpclJlc3VsdCA9IGF3YWl0IHRoaXMucmVhZGRpcih7IHBhdGgsIGRpcmVjdG9yeSB9KTtcblxuICAgIGlmIChyZWFkRGlyUmVzdWx0LmZpbGVzLmxlbmd0aCAhPT0gMCAmJiAhcmVjdXJzaXZlKSB0aHJvdyBFcnJvcignRm9sZGVyIGlzIG5vdCBlbXB0eScpO1xuXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiByZWFkRGlyUmVzdWx0LmZpbGVzKSB7XG4gICAgICBjb25zdCBlbnRyeVBhdGggPSBgJHtwYXRofS8ke2VudHJ5Lm5hbWV9YDtcbiAgICAgIGNvbnN0IGVudHJ5T2JqID0gYXdhaXQgdGhpcy5zdGF0KHsgcGF0aDogZW50cnlQYXRoLCBkaXJlY3RvcnkgfSk7XG4gICAgICBpZiAoZW50cnlPYmoudHlwZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZGVsZXRlRmlsZSh7IHBhdGg6IGVudHJ5UGF0aCwgZGlyZWN0b3J5IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgdGhpcy5ybWRpcih7IHBhdGg6IGVudHJ5UGF0aCwgZGlyZWN0b3J5LCByZWN1cnNpdmUgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2RlbGV0ZScsIFtmdWxsUGF0aF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGxpc3Qgb2YgZmlsZXMgZnJvbSB0aGUgZGlyZWN0b3J5IChub3QgcmVjdXJzaXZlKVxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhlIHJlYWRkaXIgb3BlcmF0aW9uXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgcmVhZGRpciBkaXJlY3RvcnkgbGlzdGluZyByZXN1bHRcbiAgICovXG4gIGFzeW5jIHJlYWRkaXIob3B0aW9uczogUmVhZGRpck9wdGlvbnMpOiBQcm9taXNlPFJlYWRkaXJSZXN1bHQ+IHtcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgob3B0aW9ucy5kaXJlY3RvcnksIG9wdGlvbnMucGF0aCk7XG5cbiAgICBjb25zdCBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgaWYgKG9wdGlvbnMucGF0aCAhPT0gJycgJiYgZW50cnkgPT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3IoJ0ZvbGRlciBkb2VzIG5vdCBleGlzdC4nKTtcblxuICAgIGNvbnN0IGVudHJpZXM6IHN0cmluZ1tdID0gYXdhaXQgdGhpcy5kYkluZGV4UmVxdWVzdCgnYnlfZm9sZGVyJywgJ2dldEFsbEtleXMnLCBbSURCS2V5UmFuZ2Uub25seShwYXRoKV0pO1xuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBlbnRyaWVzLm1hcChhc3luYyAoZSkgPT4ge1xuICAgICAgICBsZXQgc3ViRW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtlXSkpIGFzIEVudHJ5T2JqO1xuICAgICAgICBpZiAoc3ViRW50cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHN1YkVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbZSArICcvJ10pKSBhcyBFbnRyeU9iajtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGUuc3Vic3RyaW5nKHBhdGgubGVuZ3RoICsgMSksXG4gICAgICAgICAgdHlwZTogc3ViRW50cnkudHlwZSxcbiAgICAgICAgICBzaXplOiBzdWJFbnRyeS5zaXplLFxuICAgICAgICAgIGN0aW1lOiBzdWJFbnRyeS5jdGltZSxcbiAgICAgICAgICBtdGltZTogc3ViRW50cnkubXRpbWUsXG4gICAgICAgICAgdXJpOiBzdWJFbnRyeS5wYXRoLFxuICAgICAgICB9O1xuICAgICAgfSksXG4gICAgKTtcbiAgICByZXR1cm4geyBmaWxlczogZmlsZXMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gZnVsbCBGaWxlIFVSSSBmb3IgYSBwYXRoIGFuZCBkaXJlY3RvcnlcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSBzdGF0IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGZpbGUgc3RhdCByZXN1bHRcbiAgICovXG4gIGFzeW5jIGdldFVyaShvcHRpb25zOiBHZXRVcmlPcHRpb25zKTogUHJvbWlzZTxHZXRVcmlSZXN1bHQ+IHtcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgob3B0aW9ucy5kaXJlY3RvcnksIG9wdGlvbnMucGF0aCk7XG5cbiAgICBsZXQgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGggKyAnLyddKSkgYXMgRW50cnlPYmo7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB1cmk6IGVudHJ5Py5wYXRoIHx8IHBhdGgsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gZGF0YSBhYm91dCBhIGZpbGVcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSBzdGF0IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGZpbGUgc3RhdCByZXN1bHRcbiAgICovXG4gIGFzeW5jIHN0YXQob3B0aW9uczogU3RhdE9wdGlvbnMpOiBQcm9taXNlPFN0YXRSZXN1bHQ+IHtcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgob3B0aW9ucy5kaXJlY3RvcnksIG9wdGlvbnMucGF0aCk7XG5cbiAgICBsZXQgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW3BhdGggKyAnLyddKSkgYXMgRW50cnlPYmo7XG4gICAgfVxuICAgIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcignRW50cnkgZG9lcyBub3QgZXhpc3QuJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogZW50cnkucGF0aC5zdWJzdHJpbmcocGF0aC5sZW5ndGggKyAxKSxcbiAgICAgIHR5cGU6IGVudHJ5LnR5cGUsXG4gICAgICBzaXplOiBlbnRyeS5zaXplLFxuICAgICAgY3RpbWU6IGVudHJ5LmN0aW1lLFxuICAgICAgbXRpbWU6IGVudHJ5Lm10aW1lLFxuICAgICAgdXJpOiBlbnRyeS5wYXRoLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVuYW1lIGEgZmlsZSBvciBkaXJlY3RvcnlcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSByZW5hbWUgb3BlcmF0aW9uXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgcmVuYW1lIHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgcmVuYW1lKG9wdGlvbnM6IFJlbmFtZU9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLl9jb3B5KG9wdGlvbnMsIHRydWUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5IGEgZmlsZSBvciBkaXJlY3RvcnlcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSBjb3B5IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGNvcHkgcmVzdWx0XG4gICAqL1xuICBhc3luYyBjb3B5KG9wdGlvbnM6IENvcHlPcHRpb25zKTogUHJvbWlzZTxDb3B5UmVzdWx0PiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvcHkob3B0aW9ucywgZmFsc2UpO1xuICB9XG5cbiAgYXN5bmMgcmVxdWVzdFBlcm1pc3Npb25zKCk6IFByb21pc2U8UGVybWlzc2lvblN0YXR1cz4ge1xuICAgIHJldHVybiB7IHB1YmxpY1N0b3JhZ2U6ICdncmFudGVkJyB9O1xuICB9XG5cbiAgYXN5bmMgY2hlY2tQZXJtaXNzaW9ucygpOiBQcm9taXNlPFBlcm1pc3Npb25TdGF0dXM+IHtcbiAgICByZXR1cm4geyBwdWJsaWNTdG9yYWdlOiAnZ3JhbnRlZCcgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IGNhbiBwZXJmb3JtIGEgY29weSBvciBhIHJlbmFtZVxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhlIHJlbmFtZSBvcGVyYXRpb25cbiAgICogQHBhcmFtIGRvUmVuYW1lIHdoZXRoZXIgdG8gcGVyZm9ybSBhIHJlbmFtZSBvciBjb3B5IG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlc3VsdFxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBfY29weShvcHRpb25zOiBDb3B5T3B0aW9ucywgZG9SZW5hbWUgPSBmYWxzZSk6IFByb21pc2U8Q29weVJlc3VsdD4ge1xuICAgIGxldCB7IHRvRGlyZWN0b3J5IH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IHsgdG8sIGZyb20sIGRpcmVjdG9yeTogZnJvbURpcmVjdG9yeSB9ID0gb3B0aW9ucztcblxuICAgIGlmICghdG8gfHwgIWZyb20pIHtcbiAgICAgIHRocm93IEVycm9yKCdCb3RoIHRvIGFuZCBmcm9tIG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBcInRvXCIgZGlyZWN0b3J5IGlzIHByb3ZpZGVkLCB1c2UgdGhlIFwiZnJvbVwiIGRpcmVjdG9yeVxuICAgIGlmICghdG9EaXJlY3RvcnkpIHtcbiAgICAgIHRvRGlyZWN0b3J5ID0gZnJvbURpcmVjdG9yeTtcbiAgICB9XG5cbiAgICBjb25zdCBmcm9tUGF0aCA9IHRoaXMuZ2V0UGF0aChmcm9tRGlyZWN0b3J5LCBmcm9tKTtcbiAgICBjb25zdCB0b1BhdGggPSB0aGlzLmdldFBhdGgodG9EaXJlY3RvcnksIHRvKTtcblxuICAgIC8vIFRlc3QgdGhhdCB0aGUgXCJ0b1wiIGFuZCBcImZyb21cIiBsb2NhdGlvbnMgYXJlIGRpZmZlcmVudFxuICAgIGlmIChmcm9tUGF0aCA9PT0gdG9QYXRoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmk6IHRvUGF0aCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKGlzUGF0aFBhcmVudChmcm9tUGF0aCwgdG9QYXRoKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RvIHBhdGggY2Fubm90IGNvbnRhaW4gdGhlIGZyb20gcGF0aCcpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHRoZSBzdGF0ZSBvZiB0aGUgXCJ0b1wiIGxvY2F0aW9uXG4gICAgbGV0IHRvT2JqO1xuICAgIHRyeSB7XG4gICAgICB0b09iaiA9IGF3YWl0IHRoaXMuc3RhdCh7XG4gICAgICAgIHBhdGg6IHRvLFxuICAgICAgICBkaXJlY3Rvcnk6IHRvRGlyZWN0b3J5LFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gVG8gbG9jYXRpb24gZG9lcyBub3QgZXhpc3QsIGVuc3VyZSB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgXCJ0b1wiIGxvY2F0aW9uIGV4aXN0cyBhbmQgaXMgYSBkaXJlY3RvcnlcbiAgICAgIGNvbnN0IHRvUGF0aENvbXBvbmVudHMgPSB0by5zcGxpdCgnLycpO1xuICAgICAgdG9QYXRoQ29tcG9uZW50cy5wb3AoKTtcbiAgICAgIGNvbnN0IHRvUGF0aCA9IHRvUGF0aENvbXBvbmVudHMuam9pbignLycpO1xuXG4gICAgICAvLyBDaGVjayB0aGUgY29udGFpbmluZyBkaXJlY3Rvcnkgb2YgdGhlIFwidG9cIiBsb2NhdGlvbiBleGlzdHNcbiAgICAgIGlmICh0b1BhdGhDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgdG9QYXJlbnREaXJlY3RvcnkgPSBhd2FpdCB0aGlzLnN0YXQoe1xuICAgICAgICAgIHBhdGg6IHRvUGF0aCxcbiAgICAgICAgICBkaXJlY3Rvcnk6IHRvRGlyZWN0b3J5LFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodG9QYXJlbnREaXJlY3RvcnkudHlwZSAhPT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBkaXJlY3Rvcnkgb2YgdGhlIHRvIHBhdGggaXMgYSBmaWxlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDYW5ub3Qgb3ZlcndyaXRlIGEgZGlyZWN0b3J5XG4gICAgaWYgKHRvT2JqICYmIHRvT2JqLnR5cGUgPT09ICdkaXJlY3RvcnknKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBvdmVyd3JpdGUgYSBkaXJlY3Rvcnkgd2l0aCBhIGZpbGUnKTtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgdGhlIFwiZnJvbVwiIG9iamVjdCBleGlzdHNcbiAgICBjb25zdCBmcm9tT2JqID0gYXdhaXQgdGhpcy5zdGF0KHtcbiAgICAgIHBhdGg6IGZyb20sXG4gICAgICBkaXJlY3Rvcnk6IGZyb21EaXJlY3RvcnksXG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdGhlIG10aW1lL2N0aW1lIG9mIHRoZSBzdXBwbGllZCBwYXRoXG4gICAgY29uc3QgdXBkYXRlVGltZSA9IGFzeW5jIChwYXRoOiBzdHJpbmcsIGN0aW1lOiBudW1iZXIsIG10aW1lOiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgodG9EaXJlY3RvcnksIHBhdGgpO1xuICAgICAgY29uc3QgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtmdWxsUGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICAgIGVudHJ5LmN0aW1lID0gY3RpbWU7XG4gICAgICBlbnRyeS5tdGltZSA9IG10aW1lO1xuICAgICAgYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ3B1dCcsIFtlbnRyeV0pO1xuICAgIH07XG5cbiAgICBjb25zdCBjdGltZSA9IGZyb21PYmouY3RpbWUgPyBmcm9tT2JqLmN0aW1lIDogRGF0ZS5ub3coKTtcblxuICAgIHN3aXRjaCAoZnJvbU9iai50eXBlKSB7XG4gICAgICAvLyBUaGUgXCJmcm9tXCIgb2JqZWN0IGlzIGEgZmlsZVxuICAgICAgY2FzZSAnZmlsZSc6IHtcbiAgICAgICAgLy8gUmVhZCB0aGUgZmlsZVxuICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgdGhpcy5yZWFkRmlsZSh7XG4gICAgICAgICAgcGF0aDogZnJvbSxcbiAgICAgICAgICBkaXJlY3Rvcnk6IGZyb21EaXJlY3RvcnksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE9wdGlvbmFsbHkgcmVtb3ZlIHRoZSBmaWxlXG4gICAgICAgIGlmIChkb1JlbmFtZSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuZGVsZXRlRmlsZSh7XG4gICAgICAgICAgICBwYXRoOiBmcm9tLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBmcm9tRGlyZWN0b3J5LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVuY29kaW5nO1xuICAgICAgICBpZiAoIShmaWxlLmRhdGEgaW5zdGFuY2VvZiBCbG9iKSAmJiAhdGhpcy5pc0Jhc2U2NFN0cmluZyhmaWxlLmRhdGEpKSB7XG4gICAgICAgICAgZW5jb2RpbmcgPSBFbmNvZGluZy5VVEY4O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV3JpdGUgdGhlIGZpbGUgdG8gdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICBjb25zdCB3cml0ZVJlc3VsdCA9IGF3YWl0IHRoaXMud3JpdGVGaWxlKHtcbiAgICAgICAgICBwYXRoOiB0byxcbiAgICAgICAgICBkaXJlY3Rvcnk6IHRvRGlyZWN0b3J5LFxuICAgICAgICAgIGRhdGE6IGZpbGUuZGF0YSxcbiAgICAgICAgICBlbmNvZGluZzogZW5jb2RpbmcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENvcHkgdGhlIG10aW1lL2N0aW1lIG9mIGEgcmVuYW1lZCBmaWxlXG4gICAgICAgIGlmIChkb1JlbmFtZSkge1xuICAgICAgICAgIGF3YWl0IHVwZGF0ZVRpbWUodG8sIGN0aW1lLCBmcm9tT2JqLm10aW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgcHJvbWlzZVxuICAgICAgICByZXR1cm4gd3JpdGVSZXN1bHQ7XG4gICAgICB9XG4gICAgICBjYXNlICdkaXJlY3RvcnknOiB7XG4gICAgICAgIGlmICh0b09iaikge1xuICAgICAgICAgIHRocm93IEVycm9yKCdDYW5ub3QgbW92ZSBhIGRpcmVjdG9yeSBvdmVyIGFuIGV4aXN0aW5nIG9iamVjdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBDcmVhdGUgdGhlIHRvIGRpcmVjdG9yeVxuICAgICAgICAgIGF3YWl0IHRoaXMubWtkaXIoe1xuICAgICAgICAgICAgcGF0aDogdG8sXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IHRvRGlyZWN0b3J5LFxuICAgICAgICAgICAgcmVjdXJzaXZlOiBmYWxzZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIENvcHkgdGhlIG10aW1lL2N0aW1lIG9mIGEgcmVuYW1lZCBkaXJlY3RvcnlcbiAgICAgICAgICBpZiAoZG9SZW5hbWUpIHtcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVRpbWUodG8sIGN0aW1lLCBmcm9tT2JqLm10aW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgY29udGVudHMgb2YgdGhlIGZyb20gbG9jYXRpb25cbiAgICAgICAgY29uc3QgY29udGVudHMgPSAoXG4gICAgICAgICAgYXdhaXQgdGhpcy5yZWFkZGlyKHtcbiAgICAgICAgICAgIHBhdGg6IGZyb20sXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IGZyb21EaXJlY3RvcnksXG4gICAgICAgICAgfSlcbiAgICAgICAgKS5maWxlcztcblxuICAgICAgICBmb3IgKGNvbnN0IGZpbGVuYW1lIG9mIGNvbnRlbnRzKSB7XG4gICAgICAgICAgLy8gTW92ZSBpdGVtIGZyb20gdGhlIGZyb20gZGlyZWN0b3J5IHRvIHRoZSB0byBkaXJlY3RvcnlcbiAgICAgICAgICBhd2FpdCB0aGlzLl9jb3B5KFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmcm9tOiBgJHtmcm9tfS8ke2ZpbGVuYW1lLm5hbWV9YCxcbiAgICAgICAgICAgICAgdG86IGAke3RvfS8ke2ZpbGVuYW1lLm5hbWV9YCxcbiAgICAgICAgICAgICAgZGlyZWN0b3J5OiBmcm9tRGlyZWN0b3J5LFxuICAgICAgICAgICAgICB0b0RpcmVjdG9yeSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb1JlbmFtZSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3B0aW9uYWxseSByZW1vdmUgdGhlIG9yaWdpbmFsIGZyb20gZGlyZWN0b3J5XG4gICAgICAgIGlmIChkb1JlbmFtZSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMucm1kaXIoe1xuICAgICAgICAgICAgcGF0aDogZnJvbSxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogZnJvbURpcmVjdG9yeSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdXJpOiB0b1BhdGgsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGEgaHR0cCByZXF1ZXN0IHRvIGEgc2VydmVyIGFuZCBkb3dubG9hZHMgdGhlIGZpbGUgdG8gdGhlIHNwZWNpZmllZCBkZXN0aW5hdGlvblxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIEBjYXBhY2l0b3IvZmlsZS10cmFuc2ZlciBwbHVnaW4gaW5zdGVhZC5cbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSBkb3dubG9hZCBvcGVyYXRpb25cbiAgICogQHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgZG93bmxvYWQgZmlsZSByZXN1bHRcbiAgICovXG4gIHB1YmxpYyBkb3dubG9hZEZpbGUgPSBhc3luYyAob3B0aW9uczogRG93bmxvYWRGaWxlT3B0aW9ucyk6IFByb21pc2U8RG93bmxvYWRGaWxlUmVzdWx0PiA9PiB7XG4gICAgY29uc3QgcmVxdWVzdEluaXQgPSBidWlsZFJlcXVlc3RJbml0KG9wdGlvbnMsIG9wdGlvbnMud2ViRmV0Y2hFeHRyYSk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChvcHRpb25zLnVybCwgcmVxdWVzdEluaXQpO1xuICAgIGxldCBibG9iOiBCbG9iO1xuXG4gICAgaWYgKCFvcHRpb25zLnByb2dyZXNzKSBibG9iID0gYXdhaXQgcmVzcG9uc2UuYmxvYigpO1xuICAgIGVsc2UgaWYgKCFyZXNwb25zZT8uYm9keSkgYmxvYiA9IG5ldyBCbG9iKCk7XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCByZWFkZXIgPSByZXNwb25zZS5ib2R5LmdldFJlYWRlcigpO1xuXG4gICAgICBsZXQgYnl0ZXMgPSAwO1xuICAgICAgY29uc3QgY2h1bmtzOiAoVWludDhBcnJheSB8IHVuZGVmaW5lZClbXSA9IFtdO1xuXG4gICAgICBjb25zdCBjb250ZW50VHlwZTogc3RyaW5nIHwgbnVsbCA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRMZW5ndGg6IG51bWJlciA9IHBhcnNlSW50KHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LWxlbmd0aCcpIHx8ICcwJywgMTApO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBjb25zdCB7IGRvbmUsIHZhbHVlIH0gPSBhd2FpdCByZWFkZXIucmVhZCgpO1xuXG4gICAgICAgIGlmIChkb25lKSBicmVhaztcblxuICAgICAgICBjaHVua3MucHVzaCh2YWx1ZSk7XG4gICAgICAgIGJ5dGVzICs9IHZhbHVlPy5sZW5ndGggfHwgMDtcblxuICAgICAgICBjb25zdCBzdGF0dXM6IFByb2dyZXNzU3RhdHVzID0ge1xuICAgICAgICAgIHVybDogb3B0aW9ucy51cmwsXG4gICAgICAgICAgYnl0ZXMsXG4gICAgICAgICAgY29udGVudExlbmd0aCxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm5vdGlmeUxpc3RlbmVycygncHJvZ3Jlc3MnLCBzdGF0dXMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhbGxDaHVua3MgPSBuZXcgVWludDhBcnJheShieXRlcyk7XG4gICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgZm9yIChjb25zdCBjaHVuayBvZiBjaHVua3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjaHVuayA9PT0gJ3VuZGVmaW5lZCcpIGNvbnRpbnVlO1xuXG4gICAgICAgIGFsbENodW5rcy5zZXQoY2h1bmssIHBvc2l0aW9uKTtcbiAgICAgICAgcG9zaXRpb24gKz0gY2h1bmsubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBibG9iID0gbmV3IEJsb2IoW2FsbENodW5rcy5idWZmZXJdLCB7IHR5cGU6IGNvbnRlbnRUeXBlIHx8IHVuZGVmaW5lZCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLndyaXRlRmlsZSh7XG4gICAgICBwYXRoOiBvcHRpb25zLnBhdGgsXG4gICAgICBkaXJlY3Rvcnk6IG9wdGlvbnMuZGlyZWN0b3J5ID8/IHVuZGVmaW5lZCxcbiAgICAgIHJlY3Vyc2l2ZTogb3B0aW9ucy5yZWN1cnNpdmUgPz8gZmFsc2UsXG4gICAgICBkYXRhOiBibG9iLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgcGF0aDogcmVzdWx0LnVyaSwgYmxvYiB9O1xuICB9O1xuXG4gIHByaXZhdGUgaXNCYXNlNjRTdHJpbmcoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGJ0b2EoYXRvYihzdHIpKSA9PSBzdHI7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbmludGVyZmFjZSBFbnRyeU9iaiB7XG4gIHBhdGg6IHN0cmluZztcbiAgZm9sZGVyOiBzdHJpbmc7XG4gIHR5cGU6ICdkaXJlY3RvcnknIHwgJ2ZpbGUnO1xuICBzaXplOiBudW1iZXI7XG4gIGN0aW1lOiBudW1iZXI7XG4gIG10aW1lOiBudW1iZXI7XG4gIHVyaT86IHN0cmluZztcbiAgY29udGVudD86IHN0cmluZyB8IEJsb2I7XG59XG4iLCAiaW1wb3J0IHsgV2ViUGx1Z2luIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBCcm93c2VyUGx1Z2luLCBPcGVuT3B0aW9ucyB9IGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgQnJvd3NlcldlYiBleHRlbmRzIFdlYlBsdWdpbiBpbXBsZW1lbnRzIEJyb3dzZXJQbHVnaW4ge1xuICBfbGFzdFdpbmRvdzogV2luZG93IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2xhc3RXaW5kb3cgPSBudWxsO1xuICB9XG5cbiAgYXN5bmMgb3BlbihvcHRpb25zOiBPcGVuT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuX2xhc3RXaW5kb3cgPSB3aW5kb3cub3BlbihvcHRpb25zLnVybCwgb3B0aW9ucy53aW5kb3dOYW1lIHx8ICdfYmxhbmsnKTtcbiAgfVxuXG4gIGFzeW5jIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5fbGFzdFdpbmRvdyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2xhc3RXaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5fbGFzdFdpbmRvdyA9IG51bGw7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdCgnTm8gYWN0aXZlIHdpbmRvdyB0byBjbG9zZSEnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBCcm93c2VyID0gbmV3IEJyb3dzZXJXZWIoKTtcblxuZXhwb3J0IHsgQnJvd3NlciB9O1xuIiwgIi8vICdwYXRoJyBtb2R1bGUgZXh0cmFjdGVkIGZyb20gTm9kZS5qcyB2OC4xMS4xIChvbmx5IHRoZSBwb3NpeCBwYXJ0KVxuLy8gdHJhbnNwbGl0ZWQgd2l0aCBCYWJlbFxuXG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhc3NlcnRQYXRoKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1BhdGggbXVzdCBiZSBhIHN0cmluZy4gUmVjZWl2ZWQgJyArIEpTT04uc3RyaW5naWZ5KHBhdGgpKTtcbiAgfVxufVxuXG4vLyBSZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggd2l0aCBkaXJlY3RvcnkgbmFtZXNcbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0cmluZ1Bvc2l4KHBhdGgsIGFsbG93QWJvdmVSb290KSB7XG4gIHZhciByZXMgPSAnJztcbiAgdmFyIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgdmFyIGxhc3RTbGFzaCA9IC0xO1xuICB2YXIgZG90cyA9IDA7XG4gIHZhciBjb2RlO1xuICBmb3IgKHZhciBpID0gMDsgaSA8PSBwYXRoLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGkgPCBwYXRoLmxlbmd0aClcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgZWxzZSBpZiAoY29kZSA9PT0gNDcgLyovKi8pXG4gICAgICBicmVhaztcbiAgICBlbHNlXG4gICAgICBjb2RlID0gNDcgLyovKi87XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICBpZiAobGFzdFNsYXNoID09PSBpIC0gMSB8fCBkb3RzID09PSAxKSB7XG4gICAgICAgIC8vIE5PT1BcbiAgICAgIH0gZWxzZSBpZiAobGFzdFNsYXNoICE9PSBpIC0gMSAmJiBkb3RzID09PSAyKSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoIDwgMiB8fCBsYXN0U2VnbWVudExlbmd0aCAhPT0gMiB8fCByZXMuY2hhckNvZGVBdChyZXMubGVuZ3RoIC0gMSkgIT09IDQ2IC8qLiovIHx8IHJlcy5jaGFyQ29kZUF0KHJlcy5sZW5ndGggLSAyKSAhPT0gNDYgLyouKi8pIHtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIHZhciBsYXN0U2xhc2hJbmRleCA9IHJlcy5sYXN0SW5kZXhPZignLycpO1xuICAgICAgICAgICAgaWYgKGxhc3RTbGFzaEluZGV4ICE9PSByZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICBpZiAobGFzdFNsYXNoSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gJyc7XG4gICAgICAgICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5zbGljZSgwLCBsYXN0U2xhc2hJbmRleCk7XG4gICAgICAgICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSByZXMubGVuZ3RoIC0gMSAtIHJlcy5sYXN0SW5kZXhPZignLycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICAgIGRvdHMgPSAwO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPT09IDIgfHwgcmVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmVzID0gJyc7XG4gICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gICAgICAgICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgICAgICAgZG90cyA9IDA7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgcmVzICs9ICcvLi4nO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlcyA9ICcuLic7XG4gICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSAyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgcmVzICs9ICcvJyArIHBhdGguc2xpY2UobGFzdFNsYXNoICsgMSwgaSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXMgPSBwYXRoLnNsaWNlKGxhc3RTbGFzaCArIDEsIGkpO1xuICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IGkgLSBsYXN0U2xhc2ggLSAxO1xuICAgICAgfVxuICAgICAgbGFzdFNsYXNoID0gaTtcbiAgICAgIGRvdHMgPSAwO1xuICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gNDYgLyouKi8gJiYgZG90cyAhPT0gLTEpIHtcbiAgICAgICsrZG90cztcbiAgICB9IGVsc2Uge1xuICAgICAgZG90cyA9IC0xO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBfZm9ybWF0KHNlcCwgcGF0aE9iamVjdCkge1xuICB2YXIgZGlyID0gcGF0aE9iamVjdC5kaXIgfHwgcGF0aE9iamVjdC5yb290O1xuICB2YXIgYmFzZSA9IHBhdGhPYmplY3QuYmFzZSB8fCAocGF0aE9iamVjdC5uYW1lIHx8ICcnKSArIChwYXRoT2JqZWN0LmV4dCB8fCAnJyk7XG4gIGlmICghZGlyKSB7XG4gICAgcmV0dXJuIGJhc2U7XG4gIH1cbiAgaWYgKGRpciA9PT0gcGF0aE9iamVjdC5yb290KSB7XG4gICAgcmV0dXJuIGRpciArIGJhc2U7XG4gIH1cbiAgcmV0dXJuIGRpciArIHNlcCArIGJhc2U7XG59XG5cbnZhciBwb3NpeCA9IHtcbiAgLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKCkge1xuICAgIHZhciByZXNvbHZlZFBhdGggPSAnJztcbiAgICB2YXIgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuICAgIHZhciBjd2Q7XG5cbiAgICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgICAgdmFyIHBhdGg7XG4gICAgICBpZiAoaSA+PSAwKVxuICAgICAgICBwYXRoID0gYXJndW1lbnRzW2ldO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChjd2QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgICAgICBwYXRoID0gY3dkO1xuICAgICAgfVxuXG4gICAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgICAvLyBTa2lwIGVtcHR5IGVudHJpZXNcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IDQ3IC8qLyovO1xuICAgIH1cblxuICAgIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICAgIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZVN0cmluZ1Bvc2l4KHJlc29sdmVkUGF0aCwgIXJlc29sdmVkQWJzb2x1dGUpO1xuXG4gICAgaWYgKHJlc29sdmVkQWJzb2x1dGUpIHtcbiAgICAgIGlmIChyZXNvbHZlZFBhdGgubGVuZ3RoID4gMClcbiAgICAgICAgcmV0dXJuICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICcvJztcbiAgICB9IGVsc2UgaWYgKHJlc29sdmVkUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZWRQYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJy4nO1xuICAgIH1cbiAgfSxcblxuICBub3JtYWxpemU6IGZ1bmN0aW9uIG5vcm1hbGl6ZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcuJztcblxuICAgIHZhciBpc0Fic29sdXRlID0gcGF0aC5jaGFyQ29kZUF0KDApID09PSA0NyAvKi8qLztcbiAgICB2YXIgdHJhaWxpbmdTZXBhcmF0b3IgPSBwYXRoLmNoYXJDb2RlQXQocGF0aC5sZW5ndGggLSAxKSA9PT0gNDcgLyovKi87XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgICBwYXRoID0gbm9ybWFsaXplU3RyaW5nUG9zaXgocGF0aCwgIWlzQWJzb2x1dGUpO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwICYmICFpc0Fic29sdXRlKSBwYXRoID0gJy4nO1xuICAgIGlmIChwYXRoLmxlbmd0aCA+IDAgJiYgdHJhaWxpbmdTZXBhcmF0b3IpIHBhdGggKz0gJy8nO1xuXG4gICAgaWYgKGlzQWJzb2x1dGUpIHJldHVybiAnLycgKyBwYXRoO1xuICAgIHJldHVybiBwYXRoO1xuICB9LFxuXG4gIGlzQWJzb2x1dGU6IGZ1bmN0aW9uIGlzQWJzb2x1dGUocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG4gICAgcmV0dXJuIHBhdGgubGVuZ3RoID4gMCAmJiBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IDQ3IC8qLyovO1xuICB9LFxuXG4gIGpvaW46IGZ1bmN0aW9uIGpvaW4oKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gJy4nO1xuICAgIHZhciBqb2luZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG4gICAgICBhc3NlcnRQYXRoKGFyZyk7XG4gICAgICBpZiAoYXJnLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKGpvaW5lZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIGpvaW5lZCA9IGFyZztcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGpvaW5lZCArPSAnLycgKyBhcmc7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqb2luZWQgPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiAnLic7XG4gICAgcmV0dXJuIHBvc2l4Lm5vcm1hbGl6ZShqb2luZWQpO1xuICB9LFxuXG4gIHJlbGF0aXZlOiBmdW5jdGlvbiByZWxhdGl2ZShmcm9tLCB0bykge1xuICAgIGFzc2VydFBhdGgoZnJvbSk7XG4gICAgYXNzZXJ0UGF0aCh0byk7XG5cbiAgICBpZiAoZnJvbSA9PT0gdG8pIHJldHVybiAnJztcblxuICAgIGZyb20gPSBwb3NpeC5yZXNvbHZlKGZyb20pO1xuICAgIHRvID0gcG9zaXgucmVzb2x2ZSh0byk7XG5cbiAgICBpZiAoZnJvbSA9PT0gdG8pIHJldHVybiAnJztcblxuICAgIC8vIFRyaW0gYW55IGxlYWRpbmcgYmFja3NsYXNoZXNcbiAgICB2YXIgZnJvbVN0YXJ0ID0gMTtcbiAgICBmb3IgKDsgZnJvbVN0YXJ0IDwgZnJvbS5sZW5ndGg7ICsrZnJvbVN0YXJ0KSB7XG4gICAgICBpZiAoZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCkgIT09IDQ3IC8qLyovKVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdmFyIGZyb21FbmQgPSBmcm9tLmxlbmd0aDtcbiAgICB2YXIgZnJvbUxlbiA9IGZyb21FbmQgLSBmcm9tU3RhcnQ7XG5cbiAgICAvLyBUcmltIGFueSBsZWFkaW5nIGJhY2tzbGFzaGVzXG4gICAgdmFyIHRvU3RhcnQgPSAxO1xuICAgIGZvciAoOyB0b1N0YXJ0IDwgdG8ubGVuZ3RoOyArK3RvU3RhcnQpIHtcbiAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQpICE9PSA0NyAvKi8qLylcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHZhciB0b0VuZCA9IHRvLmxlbmd0aDtcbiAgICB2YXIgdG9MZW4gPSB0b0VuZCAtIHRvU3RhcnQ7XG5cbiAgICAvLyBDb21wYXJlIHBhdGhzIHRvIGZpbmQgdGhlIGxvbmdlc3QgY29tbW9uIHBhdGggZnJvbSByb290XG4gICAgdmFyIGxlbmd0aCA9IGZyb21MZW4gPCB0b0xlbiA/IGZyb21MZW4gOiB0b0xlbjtcbiAgICB2YXIgbGFzdENvbW1vblNlcCA9IC0xO1xuICAgIHZhciBpID0gMDtcbiAgICBmb3IgKDsgaSA8PSBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGkgPT09IGxlbmd0aCkge1xuICAgICAgICBpZiAodG9MZW4gPiBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAodG8uY2hhckNvZGVBdCh0b1N0YXJ0ICsgaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgZnJvbWAgaXMgdGhlIGV4YWN0IGJhc2UgcGF0aCBmb3IgYHRvYC5cbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvZm9vL2Jhcic7IHRvPScvZm9vL2Jhci9iYXonXG4gICAgICAgICAgICByZXR1cm4gdG8uc2xpY2UodG9TdGFydCArIGkgKyAxKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGBmcm9tYCBpcyB0aGUgcm9vdFxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy8nOyB0bz0nL2ZvbydcbiAgICAgICAgICAgIHJldHVybiB0by5zbGljZSh0b1N0YXJ0ICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZyb21MZW4gPiBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAoZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCArIGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYHRvYCBpcyB0aGUgZXhhY3QgYmFzZSBwYXRoIGZvciBgZnJvbWAuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvby9iYXIvYmF6JzsgdG89Jy9mb28vYmFyJ1xuICAgICAgICAgICAgbGFzdENvbW1vblNlcCA9IGk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgdG9gIGlzIHRoZSByb290LlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28nOyB0bz0nLydcbiAgICAgICAgICAgIGxhc3RDb21tb25TZXAgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHZhciBmcm9tQ29kZSA9IGZyb20uY2hhckNvZGVBdChmcm9tU3RhcnQgKyBpKTtcbiAgICAgIHZhciB0b0NvZGUgPSB0by5jaGFyQ29kZUF0KHRvU3RhcnQgKyBpKTtcbiAgICAgIGlmIChmcm9tQ29kZSAhPT0gdG9Db2RlKVxuICAgICAgICBicmVhaztcbiAgICAgIGVsc2UgaWYgKGZyb21Db2RlID09PSA0NyAvKi8qLylcbiAgICAgICAgbGFzdENvbW1vblNlcCA9IGk7XG4gICAgfVxuXG4gICAgdmFyIG91dCA9ICcnO1xuICAgIC8vIEdlbmVyYXRlIHRoZSByZWxhdGl2ZSBwYXRoIGJhc2VkIG9uIHRoZSBwYXRoIGRpZmZlcmVuY2UgYmV0d2VlbiBgdG9gXG4gICAgLy8gYW5kIGBmcm9tYFxuICAgIGZvciAoaSA9IGZyb21TdGFydCArIGxhc3RDb21tb25TZXAgKyAxOyBpIDw9IGZyb21FbmQ7ICsraSkge1xuICAgICAgaWYgKGkgPT09IGZyb21FbmQgfHwgZnJvbS5jaGFyQ29kZUF0KGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICBpZiAob3V0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgICBvdXQgKz0gJy4uJztcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG91dCArPSAnLy4uJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMYXN0bHksIGFwcGVuZCB0aGUgcmVzdCBvZiB0aGUgZGVzdGluYXRpb24gKGB0b2ApIHBhdGggdGhhdCBjb21lcyBhZnRlclxuICAgIC8vIHRoZSBjb21tb24gcGF0aCBwYXJ0c1xuICAgIGlmIChvdXQubGVuZ3RoID4gMClcbiAgICAgIHJldHVybiBvdXQgKyB0by5zbGljZSh0b1N0YXJ0ICsgbGFzdENvbW1vblNlcCk7XG4gICAgZWxzZSB7XG4gICAgICB0b1N0YXJ0ICs9IGxhc3RDb21tb25TZXA7XG4gICAgICBpZiAodG8uY2hhckNvZGVBdCh0b1N0YXJ0KSA9PT0gNDcgLyovKi8pXG4gICAgICAgICsrdG9TdGFydDtcbiAgICAgIHJldHVybiB0by5zbGljZSh0b1N0YXJ0KTtcbiAgICB9XG4gIH0sXG5cbiAgX21ha2VMb25nOiBmdW5jdGlvbiBfbWFrZUxvbmcocGF0aCkge1xuICAgIHJldHVybiBwYXRoO1xuICB9LFxuXG4gIGRpcm5hbWU6IGZ1bmN0aW9uIGRpcm5hbWUocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xuICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICAgIHZhciBoYXNSb290ID0gY29kZSA9PT0gNDcgLyovKi87XG4gICAgdmFyIGVuZCA9IC0xO1xuICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAgIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMTsgLS1pKSB7XG4gICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yXG4gICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbmQgPT09IC0xKSByZXR1cm4gaGFzUm9vdCA/ICcvJyA6ICcuJztcbiAgICBpZiAoaGFzUm9vdCAmJiBlbmQgPT09IDEpIHJldHVybiAnLy8nO1xuICAgIHJldHVybiBwYXRoLnNsaWNlKDAsIGVuZCk7XG4gIH0sXG5cbiAgYmFzZW5hbWU6IGZ1bmN0aW9uIGJhc2VuYW1lKHBhdGgsIGV4dCkge1xuICAgIGlmIChleHQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZXh0ICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJleHRcIiBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcblxuICAgIHZhciBzdGFydCA9IDA7XG4gICAgdmFyIGVuZCA9IC0xO1xuICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAgIHZhciBpO1xuXG4gICAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkICYmIGV4dC5sZW5ndGggPiAwICYmIGV4dC5sZW5ndGggPD0gcGF0aC5sZW5ndGgpIHtcbiAgICAgIGlmIChleHQubGVuZ3RoID09PSBwYXRoLmxlbmd0aCAmJiBleHQgPT09IHBhdGgpIHJldHVybiAnJztcbiAgICAgIHZhciBleHRJZHggPSBleHQubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBmaXJzdE5vblNsYXNoRW5kID0gLTE7XG4gICAgICBmb3IgKGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGZpcnN0Tm9uU2xhc2hFbmQgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgcmVtZW1iZXIgdGhpcyBpbmRleCBpbiBjYXNlXG4gICAgICAgICAgICAvLyB3ZSBuZWVkIGl0IGlmIHRoZSBleHRlbnNpb24gZW5kcyB1cCBub3QgbWF0Y2hpbmdcbiAgICAgICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICAgICAgZmlyc3ROb25TbGFzaEVuZCA9IGkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXh0SWR4ID49IDApIHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBtYXRjaCB0aGUgZXhwbGljaXQgZXh0ZW5zaW9uXG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gZXh0LmNoYXJDb2RlQXQoZXh0SWR4KSkge1xuICAgICAgICAgICAgICBpZiAoLS1leHRJZHggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgbWF0Y2hlZCB0aGUgZXh0ZW5zaW9uLCBzbyBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXIgcGF0aFxuICAgICAgICAgICAgICAgIC8vIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEV4dGVuc2lvbiBkb2VzIG5vdCBtYXRjaCwgc28gb3VyIHJlc3VsdCBpcyB0aGUgZW50aXJlIHBhdGhcbiAgICAgICAgICAgICAgLy8gY29tcG9uZW50XG4gICAgICAgICAgICAgIGV4dElkeCA9IC0xO1xuICAgICAgICAgICAgICBlbmQgPSBmaXJzdE5vblNsYXNoRW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RhcnQgPT09IGVuZCkgZW5kID0gZmlyc3ROb25TbGFzaEVuZDtlbHNlIGlmIChlbmQgPT09IC0xKSBlbmQgPSBwYXRoLmxlbmd0aDtcbiAgICAgIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGlmIChwYXRoLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAgICAgLy8gcGF0aCBjb21wb25lbnRcbiAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgICAgICBlbmQgPSBpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW5kID09PSAtMSkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgfVxuICB9LFxuXG4gIGV4dG5hbWU6IGZ1bmN0aW9uIGV4dG5hbWUocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG4gICAgdmFyIHN0YXJ0RG90ID0gLTE7XG4gICAgdmFyIHN0YXJ0UGFydCA9IDA7XG4gICAgdmFyIGVuZCA9IC0xO1xuICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAgIC8vIFRyYWNrIHRoZSBzdGF0ZSBvZiBjaGFyYWN0ZXJzIChpZiBhbnkpIHdlIHNlZSBiZWZvcmUgb3VyIGZpcnN0IGRvdCBhbmRcbiAgICAvLyBhZnRlciBhbnkgcGF0aCBzZXBhcmF0b3Igd2UgZmluZFxuICAgIHZhciBwcmVEb3RTdGF0ZSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgc3RhcnRQYXJ0ID0gaSArIDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgICAgLy8gZXh0ZW5zaW9uXG4gICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICBlbmQgPSBpICsgMTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xuICAgICAgICAgIC8vIElmIHRoaXMgaXMgb3VyIGZpcnN0IGRvdCwgbWFyayBpdCBhcyB0aGUgc3RhcnQgb2Ygb3VyIGV4dGVuc2lvblxuICAgICAgICAgIGlmIChzdGFydERvdCA9PT0gLTEpXG4gICAgICAgICAgICBzdGFydERvdCA9IGk7XG4gICAgICAgICAgZWxzZSBpZiAocHJlRG90U3RhdGUgIT09IDEpXG4gICAgICAgICAgICBwcmVEb3RTdGF0ZSA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHN0YXJ0RG90ICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBzYXcgYSBub24tZG90IGFuZCBub24tcGF0aCBzZXBhcmF0b3IgYmVmb3JlIG91ciBkb3QsIHNvIHdlIHNob3VsZFxuICAgICAgICAvLyBoYXZlIGEgZ29vZCBjaGFuY2UgYXQgaGF2aW5nIGEgbm9uLWVtcHR5IGV4dGVuc2lvblxuICAgICAgICBwcmVEb3RTdGF0ZSA9IC0xO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxuICAgICAgICAvLyBXZSBzYXcgYSBub24tZG90IGNoYXJhY3RlciBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGRvdFxuICAgICAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxuICAgICAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXG4gICAgICAgIHByZURvdFN0YXRlID09PSAxICYmIHN0YXJ0RG90ID09PSBlbmQgLSAxICYmIHN0YXJ0RG90ID09PSBzdGFydFBhcnQgKyAxKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0RG90LCBlbmQpO1xuICB9LFxuXG4gIGZvcm1hdDogZnVuY3Rpb24gZm9ybWF0KHBhdGhPYmplY3QpIHtcbiAgICBpZiAocGF0aE9iamVjdCA9PT0gbnVsbCB8fCB0eXBlb2YgcGF0aE9iamVjdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcInBhdGhPYmplY3RcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgcGF0aE9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBfZm9ybWF0KCcvJywgcGF0aE9iamVjdCk7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgdmFyIHJldCA9IHsgcm9vdDogJycsIGRpcjogJycsIGJhc2U6ICcnLCBleHQ6ICcnLCBuYW1lOiAnJyB9O1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJldDtcbiAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdCgwKTtcbiAgICB2YXIgaXNBYnNvbHV0ZSA9IGNvZGUgPT09IDQ3IC8qLyovO1xuICAgIHZhciBzdGFydDtcbiAgICBpZiAoaXNBYnNvbHV0ZSkge1xuICAgICAgcmV0LnJvb3QgPSAnLyc7XG4gICAgICBzdGFydCA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0RG90ID0gLTE7XG4gICAgdmFyIHN0YXJ0UGFydCA9IDA7XG4gICAgdmFyIGVuZCA9IC0xO1xuICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAgIHZhciBpID0gcGF0aC5sZW5ndGggLSAxO1xuXG4gICAgLy8gVHJhY2sgdGhlIHN0YXRlIG9mIGNoYXJhY3RlcnMgKGlmIGFueSkgd2Ugc2VlIGJlZm9yZSBvdXIgZmlyc3QgZG90IGFuZFxuICAgIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gICAgdmFyIHByZURvdFN0YXRlID0gMDtcblxuICAgIC8vIEdldCBub24tZGlyIGluZm9cbiAgICBmb3IgKDsgaSA+PSBzdGFydDsgLS1pKSB7XG4gICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgc3RhcnRQYXJ0ID0gaSArIDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgICAgLy8gZXh0ZW5zaW9uXG4gICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICBlbmQgPSBpICsgMTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xuICAgICAgICAgIC8vIElmIHRoaXMgaXMgb3VyIGZpcnN0IGRvdCwgbWFyayBpdCBhcyB0aGUgc3RhcnQgb2Ygb3VyIGV4dGVuc2lvblxuICAgICAgICAgIGlmIChzdGFydERvdCA9PT0gLTEpIHN0YXJ0RG90ID0gaTtlbHNlIGlmIChwcmVEb3RTdGF0ZSAhPT0gMSkgcHJlRG90U3RhdGUgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0RG90ICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBzYXcgYSBub24tZG90IGFuZCBub24tcGF0aCBzZXBhcmF0b3IgYmVmb3JlIG91ciBkb3QsIHNvIHdlIHNob3VsZFxuICAgICAgICAvLyBoYXZlIGEgZ29vZCBjaGFuY2UgYXQgaGF2aW5nIGEgbm9uLWVtcHR5IGV4dGVuc2lvblxuICAgICAgICBwcmVEb3RTdGF0ZSA9IC0xO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxuICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XG4gICAgcHJlRG90U3RhdGUgPT09IDAgfHxcbiAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXG4gICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcbiAgICAgIGlmIChlbmQgIT09IC0xKSB7XG4gICAgICAgIGlmIChzdGFydFBhcnQgPT09IDAgJiYgaXNBYnNvbHV0ZSkgcmV0LmJhc2UgPSByZXQubmFtZSA9IHBhdGguc2xpY2UoMSwgZW5kKTtlbHNlIHJldC5iYXNlID0gcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKHN0YXJ0UGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXJ0UGFydCA9PT0gMCAmJiBpc0Fic29sdXRlKSB7XG4gICAgICAgIHJldC5uYW1lID0gcGF0aC5zbGljZSgxLCBzdGFydERvdCk7XG4gICAgICAgIHJldC5iYXNlID0gcGF0aC5zbGljZSgxLCBlbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKHN0YXJ0UGFydCwgc3RhcnREb3QpO1xuICAgICAgICByZXQuYmFzZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBlbmQpO1xuICAgICAgfVxuICAgICAgcmV0LmV4dCA9IHBhdGguc2xpY2Uoc3RhcnREb3QsIGVuZCk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0UGFydCA+IDApIHJldC5kaXIgPSBwYXRoLnNsaWNlKDAsIHN0YXJ0UGFydCAtIDEpO2Vsc2UgaWYgKGlzQWJzb2x1dGUpIHJldC5kaXIgPSAnLyc7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIHNlcDogJy8nLFxuICBkZWxpbWl0ZXI6ICc6JyxcbiAgd2luMzI6IG51bGwsXG4gIHBvc2l4OiBudWxsXG59O1xuXG5wb3NpeC5wb3NpeCA9IHBvc2l4O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBvc2l4O1xuIiwgImltcG9ydCB7IFdlYlBsdWdpbiB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5pbXBvcnQgdHlwZSB7IENhcGFjaXRvckV4Y2VwdGlvbiB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5cbmltcG9ydCB0eXBlIHsgQ2FwYWNpdG9yTm9kZUpTUGx1Z2luIH0gZnJvbSAnLi9pbXBsZW1lbnRhdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBDYXBhY2l0b3JOb2RlSlNXZWIgZXh0ZW5kcyBXZWJQbHVnaW4gaW1wbGVtZW50cyBDYXBhY2l0b3JOb2RlSlNQbHVnaW4ge1xuICBwcm90ZWN0ZWQgdW5hdmFpbGFibGVOb2RlSlMoKTogQ2FwYWNpdG9yRXhjZXB0aW9uIHtcbiAgICByZXR1cm4gdGhpcy51bmF2YWlsYWJsZSgnVGhlIE5vZGVKUyBlbmdpbmUgaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgYnJvd3NlciEnKTtcbiAgfVxuXG4gIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRocm93IHRoaXMudW5hdmFpbGFibGVOb2RlSlMoKTtcbiAgfVxuXG4gIHNlbmQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhyb3cgdGhpcy51bmF2YWlsYWJsZU5vZGVKUygpO1xuICB9XG5cbiAgd2hlblJlYWR5KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRocm93IHRoaXMudW5hdmFpbGFibGVOb2RlSlMoKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IElQbGF0Zm9ybSB9IGZyb20gXCIuL0lQbGF0Zm9ybVwiO1xuXG5leHBvcnQgY2xhc3MgUGxhdGZvcm1NYW5hZ2VyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogSVBsYXRmb3JtO1xuXG4gICAgcHVibGljIHN0YXRpYyBzZXRQbGF0Zm9ybShwbGF0Zm9ybTogSVBsYXRmb3JtKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBwbGF0Zm9ybTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldCBjdXJyZW50KCk6IElQbGF0Zm9ybSB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGxhdGZvcm0gbm90IGluaXRpYWxpemVkLiBDYWxsIFBsYXRmb3JtTWFuYWdlci5zZXRQbGF0Zm9ybSgpIGZpcnN0LlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgcmVnaXN0ZXJQbHVnaW4gfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuaW1wb3J0IHsgZXhwb3NlU3luYXBzZSB9IGZyb20gJ0BjYXBhY2l0b3Ivc3luYXBzZSc7XG5cbmltcG9ydCB0eXBlIHsgRmlsZXN5c3RlbVBsdWdpbiB9IGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuXG5jb25zdCBGaWxlc3lzdGVtID0gcmVnaXN0ZXJQbHVnaW48RmlsZXN5c3RlbVBsdWdpbj4oJ0ZpbGVzeXN0ZW0nLCB7XG4gIHdlYjogKCkgPT4gaW1wb3J0KCcuL3dlYicpLnRoZW4oKG0pID0+IG5ldyBtLkZpbGVzeXN0ZW1XZWIoKSksXG59KTtcblxuZXhwb3NlU3luYXBzZSgpO1xuXG5leHBvcnQgKiBmcm9tICcuL2RlZmluaXRpb25zJztcbmV4cG9ydCB7IEZpbGVzeXN0ZW0gfTtcbiIsICJmdW5jdGlvbiBzKHQpIHtcbiAgdC5DYXBhY2l0b3JVdGlscy5TeW5hcHNlID0gbmV3IFByb3h5KFxuICAgIHt9LFxuICAgIHtcbiAgICAgIGdldChlLCBuKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgICBnZXQodywgbykge1xuICAgICAgICAgICAgcmV0dXJuIChjLCBwLCByKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGkgPSB0LkNhcGFjaXRvci5QbHVnaW5zW25dO1xuICAgICAgICAgICAgICBpZiAoaSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgcihuZXcgRXJyb3IoYENhcGFjaXRvciBwbHVnaW4gJHtufSBub3QgZm91bmRgKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgaVtvXSAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByKG5ldyBFcnJvcihgTWV0aG9kICR7b30gbm90IGZvdW5kIGluIENhcGFjaXRvciBwbHVnaW4gJHtufWApKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgYSA9IGF3YWl0IGlbb10oYyk7XG4gICAgICAgICAgICAgICAgICBwKGEpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGEpIHtcbiAgICAgICAgICAgICAgICAgIHIoYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgKTtcbn1cbmZ1bmN0aW9uIHUodCkge1xuICB0LkNhcGFjaXRvclV0aWxzLlN5bmFwc2UgPSBuZXcgUHJveHkoXG4gICAge30sXG4gICAge1xuICAgICAgZ2V0KGUsIG4pIHtcbiAgICAgICAgcmV0dXJuIHQuY29yZG92YS5wbHVnaW5zW25dO1xuICAgICAgfVxuICAgIH1cbiAgKTtcbn1cbmZ1bmN0aW9uIGYodCA9ICExKSB7XG4gIHR5cGVvZiB3aW5kb3cgPiBcInVcIiB8fCAod2luZG93LkNhcGFjaXRvclV0aWxzID0gd2luZG93LkNhcGFjaXRvclV0aWxzIHx8IHt9LCB3aW5kb3cuQ2FwYWNpdG9yICE9PSB2b2lkIDAgJiYgIXQgPyBzKHdpbmRvdykgOiB3aW5kb3cuY29yZG92YSAhPT0gdm9pZCAwICYmIHUod2luZG93KSk7XG59XG5leHBvcnQge1xuICBmIGFzIGV4cG9zZVN5bmFwc2Vcbn07XG4iLCAiaW1wb3J0IHsgcmVnaXN0ZXJQbHVnaW4gfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuXG5pbXBvcnQgdHlwZSB7IEJyb3dzZXJQbHVnaW4gfSBmcm9tICcuL2RlZmluaXRpb25zJztcblxuY29uc3QgQnJvd3NlciA9IHJlZ2lzdGVyUGx1Z2luPEJyb3dzZXJQbHVnaW4+KCdCcm93c2VyJywge1xuICB3ZWI6ICgpID0+IGltcG9ydCgnLi93ZWInKS50aGVuKChtKSA9PiBuZXcgbS5Ccm93c2VyV2ViKCkpLFxufSk7XG5cbmV4cG9ydCAqIGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuZXhwb3J0IHsgQnJvd3NlciB9O1xuIiwgImltcG9ydCB7IElQbGF0Zm9ybSwgRmlsZVN0YXQgfSBmcm9tIFwiLi9JUGxhdGZvcm1cIjtcbmltcG9ydCB7IEZpbGVzeXN0ZW0sIERpcmVjdG9yeSwgRW5jb2RpbmcgfSBmcm9tIFwiQGNhcGFjaXRvci9maWxlc3lzdGVtXCI7XG5pbXBvcnQgeyBCcm93c2VyIH0gZnJvbSBcIkBjYXBhY2l0b3IvYnJvd3NlclwiO1xuXG5leHBvcnQgY2xhc3MgQ2FwYWNpdG9yUGxhdGZvcm0gaW1wbGVtZW50cyBJUGxhdGZvcm0ge1xuICAgIGlkOiBcImNhcGFjaXRvclwiID0gXCJjYXBhY2l0b3JcIjtcblxuICAgIGFzeW5jIHJlYWRGaWxlKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEZpbGVzeXN0ZW0ucmVhZEZpbGUoe1xuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogRGlyZWN0b3J5LkRhdGEsXG4gICAgICAgICAgICBlbmNvZGluZzogRW5jb2RpbmcuVVRGOFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhIGFzIHN0cmluZztcbiAgICB9XG5cbiAgICBhc3luYyB3cml0ZUZpbGUocGF0aDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgRmlsZXN5c3RlbS53cml0ZUZpbGUoe1xuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgIGRhdGE6IGNvbnRlbnQsXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IERpcmVjdG9yeS5EYXRhLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IEVuY29kaW5nLlVURjhcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVhZGRpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEZpbGVzeXN0ZW0ucmVhZGRpcih7XG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBEaXJlY3RvcnkuRGF0YVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ2FwYWNpdG9yIDQvNTogZmlsZXMgaXMgRmlsZUluZm9bXS4gbmFtZSBpcyB0aGUgcHJvcGVydHkuXG4gICAgICAgIHJldHVybiByZXN1bHQuZmlsZXMubWFwKGYgPT4gZi5uYW1lKTtcbiAgICB9XG5cbiAgICBhc3luYyBleGlzdHMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBGaWxlc3lzdGVtLnN0YXQoe1xuICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgZGlyZWN0b3J5OiBEaXJlY3RvcnkuRGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB1bmxpbmsocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IEZpbGVzeXN0ZW0uZGVsZXRlRmlsZSh7XG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBEaXJlY3RvcnkuRGF0YVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBta2RpcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEZpbGVzeXN0ZW0ubWtkaXIoe1xuICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgZGlyZWN0b3J5OiBEaXJlY3RvcnkuRGF0YSxcbiAgICAgICAgICAgICAgICByZWN1cnNpdmU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgZXJyb3IgaWYgZGlyZWN0b3J5IGFscmVhZHkgZXhpc3RzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBzdGF0KHBhdGg6IHN0cmluZyk6IFByb21pc2U8RmlsZVN0YXQ+IHtcbiAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IEZpbGVzeXN0ZW0uc3RhdCh7XG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBEaXJlY3RvcnkuRGF0YVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzRmlsZTogc3RhdC50eXBlID09PSAnZmlsZScsXG4gICAgICAgICAgICBpc0RpcmVjdG9yeTogc3RhdC50eXBlID09PSAnZGlyZWN0b3J5J1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFzeW5jIG9wZW5QYXRoKHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9wZW5QYXRoIG5vdCBzdXBwb3J0ZWQgb24gQ2FwYWNpdG9yXCIsIHBhdGgpO1xuICAgIH1cblxuICAgIGFzeW5jIG9wZW5FeHRlcm5hbCh1cmw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBCcm93c2VyLm9wZW4oeyB1cmwgfSk7XG4gICAgfVxuXG4gICAgZ2V0VGhlbWVzUGF0aCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJ0aGVtZXNcIjtcbiAgICB9XG5cbiAgICBnZXRQbHVnaW5zUGF0aCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJwbHVnaW5zXCI7XG4gICAgfVxuXG4gICAgZ2V0RW5oYW5jZWRQYXRoKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICghYXdhaXQgdGhpcy5leGlzdHModGhpcy5nZXRUaGVtZXNQYXRoKCkpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm1rZGlyKHRoaXMuZ2V0VGhlbWVzUGF0aCgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuZXhpc3RzKHRoaXMuZ2V0UGx1Z2luc1BhdGgoKSkpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubWtkaXIodGhpcy5nZXRQbHVnaW5zUGF0aCgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBkaWFsb2csIEJyb3dzZXJXaW5kb3cgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCI7XG5pbXBvcnQgeyBTRUxFQ1RPUlMsIFRJTUVPVVRTIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ2V0VG9hc3RUZW1wbGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL3RvYXN0L3RvYXN0XCI7XG5cbmNsYXNzIEhlbHBlcnMge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBIZWxwZXJzO1xuICAgIHByaXZhdGUgbWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyB8IG51bGwgPSBudWxsO1xuICAgIFxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIFxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBIZWxwZXJzIHtcbiAgICAgICAgaWYgKCFIZWxwZXJzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmluc3RhbmNlID0gbmV3IEhlbHBlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSGVscGVycy5pbnN0YW5jZTtcbiAgICB9XG4gICAgXG4gICAgc2V0TWFpbldpbmRvdyhtYWluV2luZG93OiBCcm93c2VyV2luZG93KTogdm9pZCB7XG4gICAgICAgIHRoaXMubWFpbldpbmRvdyA9IG1haW5XaW5kb3c7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHNob3dBbGVydChcbiAgICAgICAgYWxlcnRUeXBlOiAnaW5mbycgfCAnd2FybmluZycgfCAnZXJyb3InLCBcbiAgICAgICAgdGl0bGU6IHN0cmluZywgXG4gICAgICAgIG1lc3NhZ2U6IHN0cmluZywgXG4gICAgICAgIGJ1dHRvbnM6IHN0cmluZ1tdXG4gICAgKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogRWxlY3Ryb24uTWVzc2FnZUJveE9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0eXBlOiBhbGVydFR5cGUsXG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICBidXR0b25zXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkaWFsb2cuc2hvd01lc3NhZ2VCb3godGhpcy5tYWluV2luZG93ISwgb3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UucmVzcG9uc2U7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGRpc3BsYXlpbmcgYWxlcnQ6ICcgKyAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIC0xOyBcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB3YWl0Rm9yRWxtKHNlbGVjdG9yOiBzdHJpbmcsIHRpbWVvdXQ6IG51bWJlciA9IFRJTUVPVVRTLkVMRU1FTlRfV0FJVCk6IFByb21pc2U8RWxlbWVudD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZXhpc3RpbmdFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgVGltZW91dCB3YWl0aW5nIGZvciBlbGVtZW50IHdpdGggc2VsZWN0b3I6ICR7c2VsZWN0b3J9YCkpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdhaXRGb3JFbG1CeVhQYXRoKHhwYXRoOiBzdHJpbmcsIHRpbWVvdXQ6IG51bWJlciA9IFRJTUVPVVRTLkVMRU1FTlRfV0FJVCk6IFByb21pc2U8Tm9kZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXZhbHVhdGVYUGF0aCA9ICgpOiBOb2RlIHwgbnVsbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG4gICAgICAgICAgICAgICAgICAgIHhwYXRoLCBcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQsIFxuICAgICAgICAgICAgICAgICAgICBudWxsLCBcbiAgICAgICAgICAgICAgICAgICAgWFBhdGhSZXN1bHQuRklSU1RfT1JERVJFRF9OT0RFX1RZUEUsIFxuICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNpbmdsZU5vZGVWYWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgXG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ0VsZW1lbnQgPSBldmFsdWF0ZVhQYXRoKCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZXhpc3RpbmdFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGV2YWx1YXRlWFBhdGgoKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgVGltZW91dCB3YWl0aW5nIGZvciBlbGVtZW50IHdpdGggWFBhdGg6ICR7eHBhdGh9YCkpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG5cbiAgICB3YWl0Rm9yVGl0bGVDaGFuZ2UodGltZW91dDogbnVtYmVyID0gVElNRU9VVFMuRUxFTUVOVF9XQUlUKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpO1xuICAgICAgICAgICAgaWYgKCFoZWFkRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdIZWFkIGVsZW1lbnQgbm90IGZvdW5kJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudC50aXRsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShoZWFkRWxlbWVudCwge1xuICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdUaW1lb3V0IHdhaXRpbmcgZm9yIGRvY3VtZW50LnRpdGxlIHRvIGNoYW5nZScpKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY3JlYXRlVG9hc3QodG9hc3RJZDogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogXCJzdWNjZXNzXCIgfCBcImZhaWxcIiB8IFwiaW5mb1wiLCB0aW1lb3V0TXM6bnVtYmVyID0gMzAwMCkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGF3YWl0IGdldFRvYXN0VGVtcGxhdGUodG9hc3RJZCwgdGl0bGUsIG1lc3NhZ2UsIHN0YXR1cyk7XG4gICAgICAgIGNvbnN0IHRvYXN0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuVE9BU1RfQ09OVEFJTkVSKTtcbiAgICAgICAgaWYodG9hc3RDb250YWluZXIpIHtcbiAgICAgICAgICAgIHRvYXN0Q29udGFpbmVyLmlubmVySFRNTCArPSB0ZW1wbGF0ZTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9hc3RJZCk/LnJlbW92ZSgpO1xuICAgICAgICAgICAgfSwgdGltZW91dE1zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgSmF2YVNjcmlwdCBpbiB0aGUgY29udGV4dCBvZiBTdHJlbWlvJ3MgY29yZSBzZXJ2aWNlc1xuICAgICAqIEBwYXJhbSBqcyAtIEphdmFTY3JpcHQgY29kZSB0byBleGVjdXRlXG4gICAgICogQHJldHVybnMgUHJvbWlzZSB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIGV4ZWN1dGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBfZXZhbChqczogc3RyaW5nKTogUHJvbWlzZTx1bmtub3duPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9ICdzdHJlbWlvLWVuaGFuY2VkJztcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKGRhdGE6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgoZGF0YSBhcyBDdXN0b21FdmVudCkuZGV0YWlsKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2NyaXB0LmlkID0gZXZlbnROYW1lO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvcmUgPSB3aW5kb3cuc2VydmljZXMuY29yZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAke2pzfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnRoZW4oKGF3YWl0ZWRSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiJHtldmVudE5hbWV9XCIsIHsgZGV0YWlsOiBhd2FpdGVkUmVzdWx0IH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiJHtldmVudE5hbWV9XCIsIHsgZGV0YWlsOiByZXN1bHQgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBgKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEVsZW1lbnRCeVhwYXRoKHBhdGg6IHN0cmluZyk6IE5vZGUgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmV2YWx1YXRlKFxuICAgICAgICAgICAgcGF0aCwgXG4gICAgICAgICAgICBkb2N1bWVudCwgXG4gICAgICAgICAgICBudWxsLCBcbiAgICAgICAgICAgIFhQYXRoUmVzdWx0LkZJUlNUX09SREVSRURfTk9ERV9UWVBFLCBcbiAgICAgICAgICAgIG51bGxcbiAgICAgICAgKS5zaW5nbGVOb2RlVmFsdWU7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZpbGVOYW1lRnJvbVVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgIHJldHVybiBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXSB8fCAnJztcbiAgICB9XG5cbiAgICBwdWJsaWMgZm9ybWF0VGltZShzZWNvbmRzOiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBob3VycyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuICAgICAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcigoc2Vjb25kcyAlIDM2MDApIC8gNjApO1xuICAgICAgICBjb25zdCByZW1haW5pbmdTZWNvbmRzID0gTWF0aC5mbG9vcihzZWNvbmRzICUgNjApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGAke1N0cmluZyhob3VycykucGFkU3RhcnQoMiwgJzAnKX06JHtTdHJpbmcobWludXRlcykucGFkU3RhcnQoMiwgJzAnKX06JHtTdHJpbmcocmVtYWluaW5nU2Vjb25kcykucGFkU3RhcnQoMiwgJzAnKX1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbXBhcmUgdHdvIHNlbWFudGljIHZlcnNpb24gc3RyaW5nc1xuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdmVyc2lvbjEgPiB2ZXJzaW9uMlxuICAgICAqL1xuICAgIHB1YmxpYyBpc05ld2VyVmVyc2lvbih2ZXJzaW9uMTogc3RyaW5nLCB2ZXJzaW9uMjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZSA9ICh2OiBzdHJpbmcpOiBudW1iZXJbXSA9PiBcbiAgICAgICAgICAgIHYucmVwbGFjZSgvXnYvLCAnJykuc3BsaXQoJy4nKS5tYXAobiA9PiBwYXJzZUludChuLCAxMCkgfHwgMCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB2MVBhcnRzID0gbm9ybWFsaXplKHZlcnNpb24xKTtcbiAgICAgICAgY29uc3QgdjJQYXJ0cyA9IG5vcm1hbGl6ZSh2ZXJzaW9uMik7XG4gICAgICAgIGNvbnN0IG1heExlbmd0aCA9IE1hdGgubWF4KHYxUGFydHMubGVuZ3RoLCB2MlBhcnRzLmxlbmd0aCk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB2MSA9IHYxUGFydHNbaV0gPz8gMDtcbiAgICAgICAgICAgIGNvbnN0IHYyID0gdjJQYXJ0c1tpXSA/PyAwO1xuICAgICAgICAgICAgaWYgKHYxID4gdjIpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKHYxIDwgdjIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5jb25zdCBoZWxwZXJzSW5zdGFuY2UgPSBIZWxwZXJzLmdldEluc3RhbmNlKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGhlbHBlcnNJbnN0YW5jZTtcbiIsICJjbGFzcyBCcm93c2VyTG9nZ2VyIHtcbiAgICBpbmZvKG1lc3NhZ2U6IHN0cmluZywgLi4ubWV0YTogYW55W10pIHtcbiAgICAgICAgY29uc29sZS5pbmZvKGBbSU5GT10gJHttZXNzYWdlfWAsIC4uLm1ldGEpO1xuICAgIH1cbiAgICB3YXJuKG1lc3NhZ2U6IHN0cmluZywgLi4ubWV0YTogYW55W10pIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBbV0FSTl0gJHttZXNzYWdlfWAsIC4uLm1ldGEpO1xuICAgIH1cbiAgICBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIC4uLm1ldGE6IGFueVtdKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFtFUlJPUl0gJHttZXNzYWdlfWAsIC4uLm1ldGEpO1xuICAgIH1cbn1cblxuY29uc3QgbG9nZ2VyID0gbmV3IEJyb3dzZXJMb2dnZXIoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2dlcihsYWJlbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGxvZ2dlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyO1xuIiwgIi8qKlxuICogQ2VudHJhbGl6ZWQgY29uc3RhbnRzIGZvciBTdHJlbWlvIEVuaGFuY2VkXG4gKiBVc2luZyBjb25zdGFudHMgaW5zdGVhZCBvZiBtYWdpYyBzdHJpbmdzIGltcHJvdmVzIG1haW50YWluYWJpbGl0eVxuICovXG5cbi8vIENTUyBTZWxlY3RvcnMgdXNlZCB0byBpbnRlcmFjdCB3aXRoIFN0cmVtaW8ncyBVSVxuLy8gTm90ZTogVGhlc2UgbWF5IG5lZWQgdXBkYXRpbmcgd2hlbiBTdHJlbWlvIHVwZGF0ZXMgdGhlaXIgY2xhc3MgbmFtZXNcbmV4cG9ydCBjb25zdCBTRUxFQ1RPUlMgPSB7XG4gICAgU0VDVElPTlNfQ09OVEFJTkVSOiAnW2NsYXNzXj1cInNlY3Rpb25zLWNvbnRhaW5lci1cIl0nLFxuICAgIFNFQ1RJT046ICdbY2xhc3NePVwic2VjdGlvbi1cIl0nLFxuICAgIENBVEVHT1JZOiAnLmNhdGVnb3J5LUdQMGhJJyxcbiAgICBDQVRFR09SWV9MQUJFTDogJy5sYWJlbC1OX08ydicsXG4gICAgQ0FURUdPUllfSUNPTjogJy5pY29uLW9ab3lWJyxcbiAgICBDQVRFR09SWV9IRUFESU5HOiAnLmhlYWRpbmctWGVQRmwnLFxuICAgIExBQkVMOiAnW2NsYXNzXj1cImxhYmVsLXdYRzNlXCJdJyxcbiAgICBOQVZfTUVOVTogJy5tZW51LXhlRTA2JyxcbiAgICBTRVRUSU5HU19DT05URU5UOiAnLnNldHRpbmdzLWNvbnRlbnQtY281ZVUnLFxuICAgIEVOSEFOQ0VEX1NFQ1RJT046ICcjZW5oYW5jZWQnLFxuICAgIFRIRU1FU19DQVRFR09SWTogJyNlbmhhbmNlZCA+IGRpdjpudGgtY2hpbGQoMiknLFxuICAgIFBMVUdJTlNfQ0FURUdPUlk6ICcjZW5oYW5jZWQgPiBkaXY6bnRoLWNoaWxkKDMpJyxcbiAgICBBQk9VVF9DQVRFR09SWTogJyNlbmhhbmNlZCA+IGRpdjpudGgtY2hpbGQoNCknLFxuICAgIFJPVVRFX0NPTlRBSU5FUjogJy5yb3V0ZS1jb250YWluZXI6bGFzdC1jaGlsZCAucm91dGUtY29udGVudCcsXG4gICAgTUVUQV9ERVRBSUxTX0NPTlRBSU5FUjogJy5tZXRhZGV0YWlscy1jb250YWluZXItS19EcWEnLFxuICAgIERFU0NSSVBUSU9OX0NPTlRBSU5FUjogJy5kZXNjcmlwdGlvbi1jb250YWluZXIteWk4aVUnLFxuICAgIEFERE9OU19MSVNUX0NPTlRBSU5FUjogJy5hZGRvbnMtbGlzdC1jb250YWluZXItT3ZyMlonLFxuICAgIEFERE9OX0NPTlRBSU5FUjogJy5hZGRvbi1jb250YWluZXItbEM1S04nLFxuICAgIE5BTUVfQ09OVEFJTkVSOiAnLm5hbWUtY29udGFpbmVyLXFJQWc4JyxcbiAgICBERVNDUklQVElPTl9JVEVNOiAnLmRlc2NyaXB0aW9uLWNvbnRhaW5lci12N0poZScsXG4gICAgVFlQRVNfQ09OVEFJTkVSOiAnLnR5cGVzLWNvbnRhaW5lci1EYU9yZycsXG4gICAgU0VBUkNIX0lOUFVUOiAnLnNlYXJjaC1pbnB1dC1iQWdBaCcsXG4gICAgSE9SSVpPTlRBTF9OQVY6ICcuaG9yaXpvbnRhbC1uYXYtYmFyLWNvbnRhaW5lci1ZX3p2SycsXG4gICAgVE9BU1RfSVRFTTogJy50b2FzdC1pdGVtLWNvbnRhaW5lci1uRzB1aycsXG4gICAgVE9BU1RfQ09OVEFJTkVSOiAnLnRvYXN0cy1jb250YWluZXItb0tFQ3knXG59IGFzIGNvbnN0O1xuXG4vLyBDU1MgQ2xhc3NlcyB1c2VkIGZvciBzdHlsaW5nXG5leHBvcnQgY29uc3QgQ0xBU1NFUyA9IHtcbiAgICBPUFRJT046ICdvcHRpb24tdkZPQVMnLFxuICAgIENPTlRFTlQ6ICdjb250ZW50LVAyVDBpJyxcbiAgICBCVVRUT046ICdidXR0b24tRE5tWUwnLFxuICAgIEJVVFRPTl9DT05UQUlORVI6ICdidXR0b24tY29udGFpbmVyLXpWTEg2JyxcbiAgICBTRUxFQ1RFRDogJ3NlbGVjdGVkLVM3U2VLJyxcbiAgICBJTlNUQUxMX0JVVFRPTjogJ2luc3RhbGwtYnV0dG9uLWNvbnRhaW5lci15ZmNxNScsXG4gICAgVU5JTlNUQUxMX0JVVFRPTjogJ3VuaW5zdGFsbC1idXR0b24tY29udGFpbmVyLW9WNFlvJyxcbiAgICBDSEVDS0VEOiAnY2hlY2tlZCcsXG59IGFzIGNvbnN0O1xuXG4vLyBMb2NhbFN0b3JhZ2Uga2V5c1xuZXhwb3J0IGNvbnN0IFNUT1JBR0VfS0VZUyA9IHtcbiAgICBFTkFCTEVEX1BMVUdJTlM6ICdlbmFibGVkUGx1Z2lucycsXG4gICAgQ1VSUkVOVF9USEVNRTogJ2N1cnJlbnRUaGVtZScsXG4gICAgRElTQ09SRF9SUEM6ICdkaXNjb3JkcmljaHByZXNlbmNlJyxcbiAgICBDSEVDS19VUERBVEVTX09OX1NUQVJUVVA6ICdjaGVja0ZvclVwZGF0ZXNPblN0YXJ0dXAnLFxufSBhcyBjb25zdDtcblxuLy8gSVBDIENoYW5uZWwgbmFtZXMgZm9yIG1haW4gPC0+IHJlbmRlcmVyIGNvbW11bmljYXRpb25cbmV4cG9ydCBjb25zdCBJUENfQ0hBTk5FTFMgPSB7XG4gICAgTUlOSU1JWkVfV0lORE9XOiAnbWluaW1pemUtd2luZG93JyxcbiAgICBNQVhJTUlaRV9XSU5ET1c6ICdtYXhpbWl6ZS13aW5kb3cnLFxuICAgIENMT1NFX1dJTkRPVzogJ2Nsb3NlLXdpbmRvdycsXG4gICAgU0VUX1RSQU5TUEFSRU5DWTogJ3NldC10cmFuc3BhcmVuY3knLFxuICAgIEdFVF9UUkFOU1BBUkVOQ1lfU1RBVFVTOiAnZ2V0LXRyYW5zcGFyZW5jeS1zdGF0dXMnLFxuICAgIFVQREFURV9DSEVDS19TVEFSVFVQOiAndXBkYXRlLWNoZWNrLW9uLXN0YXJ0dXAnLFxuICAgIFVQREFURV9DSEVDS19VU0VSOiAndXBkYXRlLWNoZWNrLXVzZXJyZXF1ZXN0JyxcbiAgICBGVUxMU0NSRUVOX0NIQU5HRUQ6ICdmdWxsc2NyZWVuLWNoYW5nZWQnLFxuICAgIEVYVFJBQ1RfRU1CRURERURfU1VCVElUTEVTOiAnZXh0cmFjdC1lbWJlZGRlZC1zdWJ0aXRsZXMnLFxufSBhcyBjb25zdDtcblxuLy8gRmlsZSBleHRlbnNpb25zIGZvciBtb2RzXG5leHBvcnQgY29uc3QgRklMRV9FWFRFTlNJT05TID0ge1xuICAgIFRIRU1FOiAnLnRoZW1lLmNzcycsXG4gICAgUExVR0lOOiAnLnBsdWdpbi5qcycsXG59IGFzIGNvbnN0O1xuXG4vLyBVUkxzXG5leHBvcnQgY29uc3QgVVJMUyA9IHtcbiAgICBTVFJFTUlPX1dFQjogJ2h0dHBzOi8vd2ViLnN0cmVtaW8uY29tLycsXG4gICAgU1RSRU1JT19XRUJfQUREX0FERE9OOiAnaHR0cHM6Ly93ZWIuc3RyZW1pby5jb20vIy9hZGRvbnM/YWRkb249JyxcbiAgICBSRUdJU1RSWTogJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9SRVZFTkdFOTc3L3N0cmVtaW8tZW5oYW5jZWQtcmVnaXN0cnkvcmVmcy9oZWFkcy9tYWluL3JlZ2lzdHJ5Lmpzb24nLFxuICAgIFZFUlNJT05fQ0hFQ0s6ICdodHRwczovL2dpdGh1Yi5jb20vUkVWRU5HRTk3Ny9zdHJlbWlvLWVuaGFuY2VkLWNvbW11bml0eS9yYXcvbWFpbi92ZXJzaW9uJyxcbiAgICBSRUxFQVNFU19BUEk6ICdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL1JFVkVOR0U5Nzcvc3RyZW1pby1lbmhhbmNlZC1jb21tdW5pdHkvcmVsZWFzZXMvbGF0ZXN0JyxcbiAgICBSRUxFQVNFU19QQUdFOiAnaHR0cHM6Ly9naXRodWIuY29tL1JFVkVOR0U5Nzcvc3RyZW1pby1lbmhhbmNlZC1jb21tdW5pdHkvcmVsZWFzZXMvbGF0ZXN0JyxcbiAgICBTVFJFTUlPX1NFUlZJQ0VfR0lUSFVCX0FQSTogXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL1N0cmVtaW8vc3RyZW1pby1zZXJ2aWNlL3JlbGVhc2VzL2xhdGVzdFwiXG59IGFzIGNvbnN0O1xuXG4vLyBzZXJ2ZXIuanMgKFN0cmVtaW8gc3RyZWFtaW5nIHNlcnZlcikgRG93bmxvYWQgVVJMXG5leHBvcnQgY29uc3QgU0VSVkVSX0pTX1VSTCA9IFwiaHR0cHM6Ly9kbC5zdHJlbS5pby9zZXJ2ZXIvdjQuMjAuMTIvZGVza3RvcC9zZXJ2ZXIuanNcIjtcblxuLy8gRkZtcGVnIERvd25sb2FkIFVSTHNcbmV4cG9ydCBjb25zdCBGRk1QRUdfVVJMUyA9IHtcbiAgICB3aW4zMjoge1xuICAgICAgICB4NjQ6IFwiaHR0cHM6Ly9naXRodWIuY29tL0J0Yk4vRkZtcGVnLUJ1aWxkcy9yZWxlYXNlcy9kb3dubG9hZC9sYXRlc3QvZmZtcGVnLW1hc3Rlci1sYXRlc3Qtd2luNjQtZ3BsLnppcFwiLFxuICAgICAgICBhcm02NDogXCJodHRwczovL2dpdGh1Yi5jb20vQnRiTi9GRm1wZWctQnVpbGRzL3JlbGVhc2VzL2Rvd25sb2FkL2xhdGVzdC9mZm1wZWctbWFzdGVyLWxhdGVzdC13aW5hcm02NC1ncGwuemlwXCIsXG4gICAgfSxcbiAgICBkYXJ3aW46IHtcbiAgICAgICAgeDY0OiBcImh0dHBzOi8vZmZtcGVnLm1hcnRpbi1yaWVkbC5kZS9kb3dubG9hZC9tYWNvcy9hbWQ2NC8xNzY2NDM3Mjk3XzguMC4xL2ZmbXBlZy56aXBcIixcbiAgICAgICAgYXJtNjQ6IFwiaHR0cHM6Ly9mZm1wZWcubWFydGluLXJpZWRsLmRlL2Rvd25sb2FkL21hY29zL2FybTY0LzE3NjY0MzAxMzJfOC4wLjEvZmZtcGVnLnppcFwiLFxuICAgIH0sXG4gICAgbGludXg6IHtcbiAgICAgICAgeDY0OiBcImh0dHBzOi8vam9obnZhbnNpY2tsZS5jb20vZmZtcGVnL3JlbGVhc2VzL2ZmbXBlZy1yZWxlYXNlLWFtZDY0LXN0YXRpYy50YXIueHpcIixcbiAgICAgICAgYXJtNjQ6IFwiaHR0cHM6Ly9qb2hudmFuc2lja2xlLmNvbS9mZm1wZWcvcmVsZWFzZXMvZmZtcGVnLXJlbGVhc2UtYXJtNjQtc3RhdGljLnRhci54elwiLFxuICAgIH0sXG59IGFzIGNvbnN0O1xuXG4vLyBGRnByb2JlIERvd25sb2FkIFVSTHMgZm9yIG1hY09TXG5leHBvcnQgY29uc3QgTUFDT1NfRkZQUk9CRV9VUkxTID0ge1xuICAgIHg2NDogXCJodHRwczovL2ZmbXBlZy5tYXJ0aW4tcmllZGwuZGUvZG93bmxvYWQvbWFjb3MvYW1kNjQvMTc2NjQzNzI5N184LjAuMS9mZnByb2JlLnppcFwiLFxuICAgIGFybTY0OiBcImh0dHBzOi8vZmZtcGVnLm1hcnRpbi1yaWVkbC5kZS9kb3dubG9hZC9tYWNvcy9hcm02NC8xNzY2NDMwMTMyXzguMC4xL2ZmcHJvYmUuemlwXCIsXG59O1xuXG4vLyBEaXNjb3JkIFJQQ1xuZXhwb3J0IGNvbnN0IERJU0NPUkQgPSB7XG4gICAgQ0xJRU5UX0lEOiAnMTIwMDE4Njc1MDcyNzg5MzE2NCcsXG4gICAgUkVDT05ORUNUX0lOVEVSVkFMOiAxMDAwMCxcbiAgICBERUZBVUxUX0lNQUdFOiAnMTAyNHN0cmVtaW8nLFxufSBhcyBjb25zdDtcblxuLy8gVGltZW91dHNcbmV4cG9ydCBjb25zdCBUSU1FT1VUUyA9IHtcbiAgICBFTEVNRU5UX1dBSVQ6IDEwMDAwLFxuICAgIElOU1RBTExfQ09NUExFVElPTjogMTIwMDAwLFxuICAgIFNFUlZJQ0VfQ0hFQ0tfSU5URVJWQUw6IDUwMDAsXG4gICAgU0VSVkVSX1JFTE9BRF9ERUxBWTogMTUwMCxcbiAgICBDT1JFU1RBVEVfUkVUUllfSU5URVJWQUw6IDEwMDAsXG4gICAgQ09SRVNUQVRFX01BWF9SRVRSSUVTOiAzMCxcbn0gYXMgY29uc3Q7XG4iLCAiPGRpdiBjbGFzcz1cIm5hdi1jb250ZW50LWNvbnRhaW5lci16bDloUVwiIHN0eWxlPVwid2lkdGg6IDkwJTsgb3ZlcmZsb3cteTogYXV0bztcIj5cbiAgICA8ZGl2IGNsYXNzPVwiYWRkb25zLWNvbnRlbnQtemhGQmxcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNlbGVjdGFibGUtaW5wdXRzLWNvbnRhaW5lci10VXVsMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNwYWNpbmctd0gxdzVcIj48L2Rpdj5cbiAgICAgICAgICAgIDxsYWJlbCB0aXRsZT1cIlNlYXJjaCB0aGVtZXMvcGx1Z2luc1wiIGNsYXNzPVwic2VhcmNoLWJhci1rN01YZCBzZWFyY2gtYmFyLWNvbnRhaW5lci1wNHRTdFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBzaXplPVwiMVwiIGF1dG9jb3JyZWN0PVwib2ZmXCIgYXV0b2NhcGl0YWxpemU9XCJvZmZcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBzcGVsbGNoZWNrPVwiZmFsc2VcIiB0YWJpbmRleD1cIjBcIiBjbGFzcz1cInNlYXJjaC1pbnB1dC1iQWdBaCB0ZXh0LWlucHV0LWhuTGl6XCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaCB0aGVtZXMvcGx1Z2luc1wiIHZhbHVlPVwiXCI+XG4gICAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cImljb24tUU9ZZkpcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk00NTYuODgyIDQxNS43OTk5OTk5OTk5OTk3bC05My43OTEtODkuNDVjMjIuNjA1LTI4LjY3IDM0Ljc4NC02My41NyAzNC42ODYtOTkuNDQgMC05MS41NC03OC4xNDItMTY2LjA3LTE3NC4xMjUtMTY2LjA3cy0xNzQuMTI1IDc0LjUzLTE3NC4xMjUgMTY2LjE3YzAgOTEuNTQgNzguMTQyIDE2Ni4wNyAxNzQuMTI1IDE2Ni4wNyAzNy41ODYgMCA3NC4xNjEtMTEuNjEgMTA0LjI1Ni0zMy4wOGw5My43OSA4OS40NWMzLjUzNSAzLjA0IDcuOTEgNS4wNSAxMi42MDQgNS43OSA0LjY5NiAwLjc0IDkuNTE1IDAuMTggMTMuODg3LTEuNjEgNC4zNzQtMS43OSA4LjExNy00Ljc0IDEwLjc4OC04LjQ5IDIuNjcxLTMuNzYgNC4xNTctOC4xNyA0LjI4NC0xMi43IDAuMTA4LTYuMTEtMi4xNjUtMTIuMDQtNi4zNzktMTYuNjRtLTM1Ny42Mi0xODguNzljLTAuMDEtMjkuNDMgMTEuNDUzLTU3LjggMzIuMTYyLTc5LjYxIDIwLjcwOS0yMS44MiA0OS4xODMtMzUuNDkgNzkuODg0LTM4LjM5IDMwLjctMi45IDYxLjQzMyA1LjIgODYuMjIxIDIyLjcyIDI0Ljc4NyAxNy41MiA0MS44NTggNDMuMiA0Ny44OTEgNzIuMDUgNi4wMzQgMjguODYgMC41OTggNTguODMtMTUuMjQ5IDg0LjA3cy00MC45NzIgNDMuOTYtNzAuNDg5IDUyLjUzYy0yOS41MTggOC41NS02MS4zMTcgNi4zMy04OS4yMTMtNi4yNHMtNDkuODk1LTM0LjU3LTYxLjcxOC02MS43NWMtNi4yNTgtMTQuMzgtOS40ODMtMjkuODEtOS40ODgtNDUuMzhcIiBzdHlsZT1cImZpbGw6IGN1cnJlbnRjb2xvcjtcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJyLz5cbiAgICAgICAgPGRpdiB0YWJpbmRleD1cIjBcIiB0aXRsZT1cIlN1Ym1pdCB5b3VyIHRoZW1lcyBhbmQgcGx1Z2lucyBoZXJlXCIgdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3M9XCJsaW5rLUZyTDF0IGJ1dHRvbi1jb250YWluZXItelZMSDZcIj5cbiAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vUkVWRU5HRTk3Ny9zdHJlbWlvLWVuaGFuY2VkLXJlZ2lzdHJ5XCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9yZWZlcnJlclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbC1QSnZTSlwiIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPlN1Ym1pdCB5b3VyIHRoZW1lcyBhbmQgcGx1Z2luczwvZGl2PlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWRkb25zLWxpc3QtY29udGFpbmVyLU92cjJaXCIgaWQ9XCJtb2RzLWxpc3RcIj5cbiAgICAgICAgICAgIFxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJyLz5cbiAgICA8L2Rpdj5cbjwvZGl2PiIsICI8YnI+XG48ZGl2IHRhYmluZGV4PVwiMFwiIGNsYXNzPVwiYWRkb24td2htZE8gYW5pbWF0aW9uLWZhZGUtaW4gYWRkb24tY29udGFpbmVyLWxDNUtOIGJ1dHRvbi1jb250YWluZXItelZMSDZcIj5cbiAgICA8ZGl2IGNsYXNzPVwibG9nby1jb250YWluZXItWmNTU0NcIj5cbiAgICAgICAgPCEtLSB0aGVtZSBwcmV2aWV3IGhlcmUgLS0+XG5cbiAgICAgICAgPCEtLSBwbHVnaW4gaWNvbiBoZXJlIC0tPlxuICAgIDwvZGl2PlxuXG5cdDxkaXYgY2xhc3M9XCJpbmZvLWNvbnRhaW5lci1BZE1CNlwiPlxuXHRcdDxkaXYgY2xhc3M9XCJuYW1lLWNvbnRhaW5lci1xSUFnOFwiIHRpdGxlPVwie3sgbmFtZSB9fVwiPnt7IG5hbWUgfX08L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwidmVyc2lvbi1jb250YWluZXItemRQeU5cIiB0aXRsZT1cInt7IHZlcnNpb24gfX1cIj57eyB2ZXJzaW9uIH19PC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cInR5cGVzLWNvbnRhaW5lci1EYU9yZ1wiPnt7IHR5cGUgfX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRlc2NyaXB0aW9uLWNvbnRhaW5lci12N0poZVwiPlxuICAgICAgICAgICAgPGI+RGVzY3JpcHRpb246PC9iPiB7eyBkZXNjcmlwdGlvbiB9fVxuICAgICAgICAgICAgPGJyPlxuICAgICAgICAgICAgPGI+QXV0aG9yOjwvYj4ge3sgYXV0aG9yIH19XG4gICAgICAgIDwvZGl2PlxuXHQ8L2Rpdj5cblx0PGRpdiBjbGFzcz1cImJ1dHRvbnMtY29udGFpbmVyLWcweFhyXCI+XG5cdFx0PGRpdiBjbGFzcz1cImFjdGlvbi1idXR0b25zLWNvbnRhaW5lci14TVZtelwiPlxuXHRcdFx0PGRpdiB0YWJpbmRleD1cIi0xXCIgdGl0bGU9XCJ7eyBhY3Rpb25idG5UaXRsZSB9fVwiIGNsYXNzPVwie3sgYWN0aW9uYnRuQ2xhc3MgfX0gYnV0dG9uLWNvbnRhaW5lci16VkxINiBtb2RBY3Rpb25CdG5cIiBkYXRhLWxpbms9XCJ7eyBkb3dubG9hZCB9fVwiIGRhdGEtdHlwZT1cInt7IHR5cGUgfX1cIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImxhYmVsLU9uV2gyXCI+e3sgYWN0aW9uYnRuVGl0bGUgfX08L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdDxhIGhyZWY9XCJ7eyByZXBvIH19XCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9yZWZlcnJlclwiIGNsYXNzPVwic2hhcmUtYnV0dG9uLWNvbnRhaW5lci1zM2d3UCBidXR0b24tY29udGFpbmVyLXpWTEg2XCI+XG5cdFx0XHQ8c3ZnIGNsYXNzPVwiaWNvbi1HeFZiWVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cblx0XHRcdFx0PHBhdGggZD1cIk0xMiwyQTEwLDEwIDAgMCwwIDIsMTJDMiwxNi40MiA0Ljg3LDIwLjE3IDguODQsMjEuNUM5LjM0LDIxLjU4IDkuNSwyMS4yNyA5LjUsMjFDOS41LDIwLjc3IDkuNSwyMC4xNCA5LjUsMTkuMzFDNi43MywxOS45MSA2LjE0LDE3Ljk3IDYuMTQsMTcuOTdDNS42OCwxNi44MSA1LjAzLDE2LjUgNS4wMywxNi41QzQuMTIsMTUuODggNS4xLDE1LjkgNS4xLDE1LjlDNi4xLDE1Ljk3IDYuNjMsMTYuOTMgNi42MywxNi45M0M3LjUsMTguNDUgOC45NywxOCA5LjU0LDE3Ljc2QzkuNjMsMTcuMTEgOS44OSwxNi42NyAxMC4xNywxNi40MkM3Ljk1LDE2LjE3IDUuNjIsMTUuMzEgNS42MiwxMS41QzUuNjIsMTAuMzkgNiw5LjUgNi42NSw4Ljc5QzYuNTUsOC41NCA2LjIsNy41IDYuNzUsNi4xNUM2Ljc1LDYuMTUgNy41OSw1Ljg4IDkuNSw3LjE3QzEwLjI5LDYuOTUgMTEuMTUsNi44NCAxMiw2Ljg0QzEyLjg1LDYuODQgMTMuNzEsNi45NSAxNC41LDcuMTdDMTYuNDEsNS44OCAxNy4yNSw2LjE1IDE3LjI1LDYuMTVDMTcuOCw3LjUgMTcuNDUsOC41NCAxNy4zNSw4Ljc5QzE4LDkuNSAxOC4zOCwxMC4zOSAxOC4zOCwxMS41QzE4LjM4LDE1LjMyIDE2LjA0LDE2LjE2IDEzLjgxLDE2LjQxQzE0LjE3LDE2LjcyIDE0LjUsMTcuMzMgMTQuNSwxOC4yNkMxNC41LDE5LjYgMTQuNSwyMC42OCAxNC41LDIxQzE0LjUsMjEuMjcgMTQuNjYsMjEuNTkgMTUuMTcsMjEuNUMxOS4xNCwyMC4xNiAyMiwxNi40MiAyMiwxMkExMCwxMCAwIDAsMCAxMiwyWlwiIHN0eWxlPVwiZmlsbDogY3VycmVudGNvbG9yO1wiIC8+XG5cdFx0XHQ8L3N2Zz5cblx0XHRcdDxkaXYgY2xhc3M9XCJsYWJlbC1PbldoMlwiPk9wZW4gcmVwb3NpdG9yeTwvZGl2PlxuXHRcdDwvYT5cblx0PC9kaXY+XG48L2Rpdj5cbiIsICI8aDQgc3R5bGU9XCJjb2xvcjogd2hpdGU7IG1hcmdpbi1ib3R0b206IDFyZW07XCI+XG4gICAgRGV2ZWxvcGVkIEJ5OiA8cCBzdHlsZT1cImRpc3BsYXk6IGlubGluZSAhaW1wb3J0YW50O1wiPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vUkVWRU5HRTk3N1wiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5SRVZFTkdFOTc3PC9hPjwvcD5cbiAgICA8YnIvPlxuICAgIFZlcnNpb246IHZ7eyB2ZXJzaW9uIH19XG4gICAgPGJyLz5cbjwvaDQ+XG5cbjxkaXYgY2xhc3M9XCJvcHRpb24tdkZPQVNcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGluZy1kWU1EdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWwtcUk2VmhcIj5DaGVjayBmb3IgdXBkYXRlcyBvbiBzdGFydHVwPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtUDJUMGlcIj5cbiAgICAgICAgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCJ0b2dnbGUtY29udGFpbmVyLWxaZkhQIGJ1dHRvbi1jb250YWluZXItelZMSDYge3sgY2hlY2tGb3JVcGRhdGVzT25TdGFydHVwIH19XCIgaWQ9XCJjaGVja0ZvclVwZGF0ZXNPblN0YXJ0dXBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b2dnbGUtdG9PV01cIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cIm9wdGlvbi12Rk9BU1wiPlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkaW5nLWRZTUR0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbC1xSTZWaFwiPkRpc2NvcmQgUmljaCBQcmVzZW5jZTwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LVAyVDBpXCI+XG4gICAgICAgIDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwidG9nZ2xlLWNvbnRhaW5lci1sWmZIUCBidXR0b24tY29udGFpbmVyLXpWTEg2IHt7IGRpc2NvcmRyaWNocHJlc2VuY2UgfX1cIiBpZD1cImRpc2NvcmRyaWNocHJlc2VuY2VcIiBzdHlsZT1cIm91dGxpbmU6IG5vbmU7XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9nZ2xlLXRvT1dNXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJvcHRpb24tdkZPQVNcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGluZy1kWU1EdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWwtcUk2VmhcIj5XaW5kb3cgdHJhbnNwYXJlbmN5PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtUDJUMGlcIj5cbiAgICAgICAgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCJ0b2dnbGUtY29udGFpbmVyLWxaZkhQIGJ1dHRvbi1jb250YWluZXItelZMSDYge3sgZW5hYmxlVHJhbnNwYXJlbnRUaGVtZXMgfX1cIiBpZD1cImVuYWJsZVRyYW5zcGFyZW50VGhlbWVzXCIgc3R5bGU9XCJvdXRsaW5lOiBub25lO1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvZ2dsZS10b09XTVwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48cCBzdHlsZT1cImNvbG9yOmdyYXk7XCI+VGhpcyBvcHRpb24gaGFzIHRvIGJlIGVuYWJsZWQgZm9yIHRoZW1lcyB0aGF0IHN1cHBvcnQgdHJhbnNwYXJlbmN5IHRvIHdvcmsuIChleHBlcmltZW50YWwpPC9wPlxuPGJyLz5cblxuPGRpdiBjbGFzcz1cIm9wdGlvbi12Rk9BU1wiPlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LVAyVDBpXCI+XG4gICAgICAgIDxkaXYgdGFiaW5kZXg9XCIwXCIgdGl0bGU9XCJDb21tdW5pdHkgUGx1Z2lucyAmYW1wOyBUaGVtZXNcIiBjbGFzcz1cImJ1dHRvbi1ETm1ZTCBidXR0b24tY29udGFpbmVyLXpWTEg2IGJ1dHRvblwiIGlkPVwiYnJvd3NlUGx1Z2luc1RoZW1lc0J0blwiPlxuICAgICAgICAgICAgQ29tbXVuaXR5IE1hcmtldHBsYWNlXG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJvcHRpb24tdkZPQVNcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1QMlQwaVwiPlxuICAgICAgICA8ZGl2IHRhYmluZGV4PVwiMFwiIHRpdGxlPVwiQ2hlY2sgRm9yIFVwZGF0ZXNcIiBjbGFzcz1cImJ1dHRvbi1ETm1ZTCBidXR0b24tY29udGFpbmVyLXpWTEg2IGJ1dHRvblwiIGlkPVwiY2hlY2tmb3J1cGRhdGVzQnRuXCI+XG4gICAgICAgICAgICBDaGVjayBGb3IgVXBkYXRlc1xuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48YnIvPiIsICI8ZGl2IGNsYXNzPVwib3B0aW9uLXZGT0FTXCI+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRpbmctZFlNRHRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsLXFJNlZoXCI+RGVmYXVsdDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LVAyVDBpXCI+XG4gICAgICAgIDxkaXYgXG4gICAgICAgIHRpdGxlPVwiRGVmYXVsdFwiIFxuICAgICAgICBpZD1cIkRlZmF1bHRcIiBcbiAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgIG9uY2xpY2s9XCJhcHBseVRoZW1lKCdEZWZhdWx0JylcIlxuICAgICAgICBzdHlsZT1cImNvbG9yOiB3aGl0ZTsgbWFyZ2luLWJvdHRvbTogMXJlbTsgd2lkdGg6IG1heC1jb250ZW50OyBiYWNrZ3JvdW5kLWNvbG9yOiB7eyBiYWNrZ3JvdW5kQ29sb3IgfX07XCJcbiAgICAgICAgY2xhc3M9XCJidXR0b24gYnV0dG9uLWNvbnRhaW5lci16VkxINiB7eyBkaXNhYmxlZCB9fVwiXG4gICAgICAgID57eyBsYWJlbCB9fTwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG4iLCAiPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCJidXR0b24tY29udGFpbmVyLXhUOV9MIGJhY2stYnV0dG9uLWNvbnRhaW5lci1sREIxTiBidXR0b24tY29udGFpbmVyLXpWTEg2XCIgaWQ9XCJiYWNrLWJ0blwiPlxuICAgIDxzdmcgY2xhc3M9XCJpY29uLVQ4TVU2XCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNMzI4LjYxMDAwMDAwMDAwMDYgMTA2LjQ2OWwtMTQzLjUzIDEzNi44ODkgMTQzLjUzIDEzNi44ODlcIiBzdHlsZT1cInN0cm9rZTogY3VycmVudGNvbG9yOyBzdHJva2UtbGluZWNhcDogcm91bmQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IHN0cm9rZS13aWR0aDogNDg7IGZpbGw6IG5vbmU7XCI+PC9wYXRoPlxuICAgIDwvc3ZnPlxuPC9kaXY+IiwgIjxuYXYgY2xhc3M9XCJ0aXRsZS1iYXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwidGl0bGUtYmFyLWJ1dHRvbnNcIj5cbiAgICAgICAgPGRpdiBpZD1cIm1pbmltaXplQXBwLWJ0blwiIHRpdGxlPVwiTWluaW1pemVcIiBjbGFzcz1cImJ1dHRvblwiPlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMCwxNEg0VjEwSDIwXCIgc3R5bGU9XCJmaWxsOndoaXRlO1wiPjwvcGF0aD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cIm1heGltaXplQXBwLWJ0blwiIHRpdGxlPVwiTWF4aW1pemVcIiBjbGFzcz1cImJ1dHRvblwiPlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zLDNIMjFWMjFIM1YzTTUsNVYxOUgxOVY1SDVaXCIgc3R5bGU9XCJmaWxsOndoaXRlO1wiPjwvcGF0aD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cImNsb3NlQXBwLWJ0blwiIHRpdGxlPVwiQ2xvc2VcIiBjbGFzcz1cImJ1dHRvblwiPlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgc3R5bGU9XCJ3aWR0aDogMjVweDsgaGVpZ2h0OiAyNXB4O1wiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTksNi40MUwxNy41OSw1TDEyLDEwLjU5TDYuNDEsNUw1LDYuNDFMMTAuNTksMTJMNSwxNy41OUw2LjQxLDE5TDEyLDEzLjQxTDE3LjU5LDE5TDE5LDE3LjU5TDEzLjQxLDEyTDE5LDYuNDFaXCIgc3R5bGU9XCJmaWxsOndoaXRlO1wiPjwvcGF0aD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxzdHlsZT5cblx0XHRib2R5ID4gKjpub3QoLnRpdGxlLWJhcikge1xuXHRcdFx0cGFkZGluZy10b3A6IDQwcHg7IFxuXHRcdH1cblxuICAgICAgICAuYnV0dG9uIHtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC50aXRsZS1iYXIge1xuICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkOyBcbiAgICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICAgIGxlZnQ6IDA7XG4gICAgICAgICAgICByaWdodDogMDtcbiAgICAgICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgICAgIHotaW5kZXg6IDk5OTk7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLDAuMTUpO1xuICAgICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDIwcHgpIHNhdHVyYXRlKDEyMCUpO1xuXHRcdFx0LXdlYmtpdC1hcHAtcmVnaW9uOiBkcmFnO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRpdGxlLWJhci1idXR0b25zIHtcbiAgICAgICAgICAgIC13ZWJraXQtYXBwLXJlZ2lvbjogbm8tZHJhZztcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiAyLjByZW07XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogYXV0bztcblx0XHRcdG1hcmdpbi1yaWdodDogMjBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC50aXRsZS1iYXItYnV0dG9ucyBzdmcge1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgIH1cbiAgICA8L3N0eWxlPlxuPC9uYXY+XG4iLCAiaW1wb3J0IG1vZHNUYWIgZnJvbSAnLi4vY29tcG9uZW50cy9tb2RzLXRhYi9tb2RzLXRhYi5odG1sJztcbmltcG9ydCBtb2RzSXRlbSBmcm9tICcuLi9jb21wb25lbnRzL21vZHMtaXRlbS9tb2RzLWl0ZW0uaHRtbCc7XG5pbXBvcnQgYWJvdXRDYXRlZ29yeSBmcm9tICcuLi9jb21wb25lbnRzL2Fib3V0LWNhdGVnb3J5L2Fib3V0LWNhdGVnb3J5Lmh0bWwnO1xuaW1wb3J0IGRlZmF1bHRUaGVtZSBmcm9tICcuLi9jb21wb25lbnRzL2RlZmF1bHQtdGhlbWUvZGVmYXVsdC10aGVtZS5odG1sJztcbmltcG9ydCBiYWNrQnRuIGZyb20gJy4uL2NvbXBvbmVudHMvYmFjay1idG4vYmFjay1idG4uaHRtbCc7XG5pbXBvcnQgdGl0bGVCYXIgZnJvbSAnLi4vY29tcG9uZW50cy90aXRsZS1iYXIvdGl0bGUtYmFyLmh0bWwnO1xuXG5jb25zdCB0ZW1wbGF0ZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgJ21vZHMtdGFiJzogbW9kc1RhYixcbiAgICAnbW9kcy1pdGVtJzogbW9kc0l0ZW0sXG4gICAgJ2Fib3V0LWNhdGVnb3J5JzogYWJvdXRDYXRlZ29yeSxcbiAgICAnZGVmYXVsdC10aGVtZSc6IGRlZmF1bHRUaGVtZSxcbiAgICAnYmFjay1idG4nOiBiYWNrQnRuLFxuICAgICd0aXRsZS1iYXInOiB0aXRsZUJhcixcbn07XG5cbmNsYXNzIFRlbXBsYXRlQ2FjaGUge1xuICAgIHB1YmxpYyBzdGF0aWMgbG9hZChkaXI6IHN0cmluZywgbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgLy8gV2UgaWdub3JlIGRpciBpbiBicm93c2VyIGJ1aWxkXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZXNbbmFtZV0gfHwgXCJcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlbXBsYXRlQ2FjaGU7XG4iLCAiaW1wb3J0IFRlbXBsYXRlQ2FjaGUgZnJvbSBcIi4uLy4uL3V0aWxzL3RlbXBsYXRlQ2FjaGVcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRvYXN0VGVtcGxhdGUoaWQ6IHN0cmluZywgdGl0bGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IFwic3VjY2Vzc1wiIHwgXCJmYWlsXCIgfCBcImluZm9cIik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZUNhY2hlLmxvYWQoX19kaXJuYW1lLCAndG9hc3QnKTtcbiAgICBsZXQgdG9hc3RTdGF0dXM7XG5cbiAgICBzd2l0Y2goc3RhdHVzKSB7XG4gICAgICAgIGNhc2UgXCJzdWNjZXNzXCI6XG4gICAgICAgICAgICB0b2FzdFN0YXR1cyA9IFwic3VjY2Vzcy1lSURUYVwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmYWlsXCI6XG4gICAgICAgICAgICB0b2FzdFN0YXR1cyA9IFwiZXJyb3ItcXV5T2RcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaW5mb1wiOlxuICAgICAgICAgICAgdG9hc3RTdGF0dXMgPSBcImluZm8tS0VXcThcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdGVtcGxhdGVcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBpZCB9fVwiLCBpZClcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyB0aXRsZSB9fVwiLCB0aXRsZSlcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBtZXNzYWdlIH19XCIsIG1lc3NhZ2UpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgc3RhdHVzIH19XCIsIHRvYXN0U3RhdHVzKTtcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcbmltcG9ydCB7IE1ldGFEYXRhIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9NZXRhRGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbHVnaW5JdGVtVGVtcGxhdGUoXG4gICAgZmlsZW5hbWU6IHN0cmluZywgXG4gICAgbWV0YURhdGE6IE1ldGFEYXRhLFxuICAgIGNoZWNrZWQ6IGJvb2xlYW5cbik6IHN0cmluZyB7XG4gICAgbGV0IHRlbXBsYXRlID0gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ3BsdWdpbi1pdGVtJyk7XG4gICAgXG4gICAgLy8gUmVwbGFjZSBtZXRhZGF0YSBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBtZXRhS2V5cyA9IFsnbmFtZScsICdkZXNjcmlwdGlvbicsICdhdXRob3InLCAndmVyc2lvbiddIGFzIGNvbnN0O1xuICAgIG1ldGFLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGB7e1xcXFxzKiR7a2V5fVxcXFxzKn19YCwgJ2cnKTtcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKHJlZ2V4LCBtZXRhRGF0YVtrZXldIHx8ICcnKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgICAgICAucmVwbGFjZShcInt7IGNoZWNrZWQgfX1cIiwgY2hlY2tlZCA/IFwiY2hlY2tlZFwiIDogXCJcIilcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccypmaWxlTmFtZVxccypcXH1cXH0vZywgZmlsZW5hbWUpO1xufVxuIiwgImltcG9ydCBUZW1wbGF0ZUNhY2hlIGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlQ2FjaGUnO1xuaW1wb3J0IHsgTWV0YURhdGEgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL01ldGFEYXRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRoZW1lSXRlbVRlbXBsYXRlKFxuICAgIGZpbGVuYW1lOiBzdHJpbmcsIFxuICAgIG1ldGFEYXRhOiBNZXRhRGF0YSxcbiAgICBhcHBsaWVkOiBib29sZWFuXG4pOiBzdHJpbmcge1xuICAgIGxldCB0ZW1wbGF0ZSA9IFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICd0aGVtZS1pdGVtJyk7XG4gICAgXG4gICAgLy8gUmVwbGFjZSBtZXRhZGF0YSBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBtZXRhS2V5cyA9IFsnbmFtZScsICdkZXNjcmlwdGlvbicsICdhdXRob3InLCAndmVyc2lvbiddIGFzIGNvbnN0O1xuICAgIG1ldGFLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGB7e1xcXFxzKiR7a2V5fVxcXFxzKn19YCwgJ2cnKTtcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKHJlZ2V4LCBtZXRhRGF0YVtrZXldIHx8ICcnKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgICAgICAucmVwbGFjZShcInt7IGRpc2FibGVkIH19XCIsIGFwcGxpZWQgPyBcImRpc2FibGVkXCIgOiBcIlwiKVxuICAgICAgICAucmVwbGFjZSgvXFx7XFx7XFxzKmZpbGVOYW1lXFxzKlxcfVxcfS9nLCBmaWxlbmFtZSlcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBsYWJlbCB9fVwiLCBhcHBsaWVkID8gXCJBcHBsaWVkXCIgOiBcIkFwcGx5XCIpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgYnV0dG9uQ2xhc3MgfX1cIiwgYXBwbGllZCA/IFwidW5pbnN0YWxsLWJ1dHRvbi1jb250YWluZXItb1Y0WW9cIiA6IFwiaW5zdGFsbC1idXR0b24tY29udGFpbmVyLXlmY3E1XCIpO1xufVxuIiwgImltcG9ydCBUZW1wbGF0ZUNhY2hlIGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlQ2FjaGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW5oYW5jZWROYXYoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ2VuaGFuY2VkLW5hdicpO1xufVxuIiwgImltcG9ydCB7IFBsYXRmb3JtTWFuYWdlciB9IGZyb20gXCIuLi9wbGF0Zm9ybS9QbGF0Zm9ybU1hbmFnZXJcIjtcblxuY2xhc3MgUHJvcGVydGllcyB7XG4gICAgcHVibGljIHN0YXRpYyB0aGVtZUxpbmtTZWxlY3Rvcjogc3RyaW5nID0gXCJoZWFkID4gbGlua1tyZWw9c3R5bGVzaGVldF1cIjtcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGVuaGFuY2VkUGF0aCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuZ2V0RW5oYW5jZWRQYXRoKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXQgdGhlbWVzUGF0aCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuZ2V0VGhlbWVzUGF0aCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHBsdWdpbnNQYXRoKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5nZXRQbHVnaW5zUGF0aCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNVc2luZ1N0cmVtaW9TZXJ2aWNlID0gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb3BlcnRpZXM7XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGx5VGhlbWVUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgXG4gICAgZnVuY3Rpb24gYXBwbHlUaGVtZSh0aGVtZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImFwcGx5aW5nIFwiICsgdGhlbWUpO1xuXG4gICAgICAgIC8vIENhbGwgdGhlIG5hdGl2ZS9wcmVsb2FkIGhhbmRsZXIgdG8gYWN0dWFsbHkgbG9hZCB0aGUgQ1NTXG4gICAgICAgIGlmICh3aW5kb3cuc3RyZW1pb0VuaGFuY2VkICYmIHdpbmRvdy5zdHJlbWlvRW5oYW5jZWQuYXBwbHlUaGVtZSkge1xuICAgICAgICAgICAgd2luZG93LnN0cmVtaW9FbmhhbmNlZC5hcHBseVRoZW1lKHRoZW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVJIFVwZGF0ZXNcbiAgICAgICAgY29uc3QgY3VycmVudFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjdXJyZW50VGhlbWVcIik7XG4gICAgICAgIGlmIChjdXJyZW50VGhlbWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaGVtZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjdXJyZW50VGhlbWUpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaGVtZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGhlbWVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGhlbWUgIT09IFwiRGVmYXVsdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcInVuaW5zdGFsbC1idXR0b24tY29udGFpbmVyLW9WNFlvXCIpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGhlbWVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJpbnN0YWxsLWJ1dHRvbi1jb250YWluZXIteWZjcTVcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRoZW1lRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInZhcigtLXNlY29uZGFyeS1hY2NlbnQtY29sb3IpXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VycmVudFRoZW1lRWxlbWVudC5pbm5lclRleHQgPSBcIkFwcGx5XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImN1cnJlbnRUaGVtZVwiLCB0aGVtZSk7XG5cbiAgICAgICAgY29uc3QgbmV3VGhlbWVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhlbWUpO1xuICAgICAgICBpZiAobmV3VGhlbWVFbGVtZW50KSB7XG4gICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuXG4gICAgICAgICAgICBpZiAodGhlbWUgIT09IFwiRGVmYXVsdFwiKSB7XG4gICAgICAgICAgICAgICAgbmV3VGhlbWVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJpbnN0YWxsLWJ1dHRvbi1jb250YWluZXIteWZjcTVcIik7XG4gICAgICAgICAgICAgICAgbmV3VGhlbWVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ1bmluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci1vVjRZb1wiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3VGhlbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidmFyKC0tb3ZlcmxheS1jb2xvcilcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV3VGhlbWVFbGVtZW50LmlubmVyVGV4dCA9IFwiQXBwbGllZFwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGA7XG59XG4iLCAiaW1wb3J0IFNldHRpbmdzIGZyb20gXCIuL1NldHRpbmdzXCI7XG5pbXBvcnQgeyBQbGF0Zm9ybU1hbmFnZXIgfSBmcm9tIFwiLi4vcGxhdGZvcm0vUGxhdGZvcm1NYW5hZ2VyXCI7XG5pbXBvcnQgcHJvcGVydGllcyBmcm9tIFwiLi9Qcm9wZXJ0aWVzXCI7XG5pbXBvcnQgaGVscGVycyBmcm9tIFwiLi4vdXRpbHMvSGVscGVyc1wiO1xuaW1wb3J0IHsgTWV0YURhdGEgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9NZXRhRGF0YVwiO1xuaW1wb3J0IHsgZ2V0TG9nZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IFByb3BlcnRpZXMgZnJvbSBcIi4vUHJvcGVydGllc1wiO1xuaW1wb3J0IHsgZ2V0QXBwbHlUaGVtZVRlbXBsYXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvYXBwbHktdGhlbWUvYXBwbHlUaGVtZVwiO1xuaW1wb3J0IHsgYmFzZW5hbWUsIGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgU1RPUkFHRV9LRVlTLCBTRUxFQ1RPUlMsIENMQVNTRVMsIFVSTFMgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgRXh0cmFjdE1ldGFEYXRhIGZyb20gXCIuLi91dGlscy9FeHRyYWN0TWV0YURhdGFcIjtcblxuY2xhc3MgTW9kTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9nZ2VyID0gZ2V0TG9nZ2VyKFwiTW9kTWFuYWdlclwiKTtcbiAgICBcbiAgICAvKipcbiAgICAgKiBMb2FkIGFuZCBlbmFibGUgYSBwbHVnaW4gYnkgZmlsZW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGxvYWRQbHVnaW4ocGx1Z2luTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwbHVnaW5OYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgUGx1Z2luICR7cGx1Z2luTmFtZX0gaXMgYWxyZWFkeSBsb2FkZWRgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBsdWdpblBhdGggPSBqb2luKHByb3BlcnRpZXMucGx1Z2luc1BhdGgsIHBsdWdpbk5hbWUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5leGlzdHMocGx1Z2luUGF0aCkpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBQbHVnaW4gZmlsZSBub3QgZm91bmQ6ICR7cGx1Z2luUGF0aH1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRGaWxlKHBsdWdpblBhdGgpO1xuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICBzY3JpcHQuaW5uZXJIVE1MID0gcGx1Z2luO1xuICAgICAgICBzY3JpcHQuaWQgPSBwbHVnaW5OYW1lO1xuICAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgZW5hYmxlZFBsdWdpbnM6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5FTkFCTEVEX1BMVUdJTlMpIHx8IFwiW11cIlxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFlbmFibGVkUGx1Z2lucy5pbmNsdWRlcyhwbHVnaW5OYW1lKSkge1xuICAgICAgICAgICAgZW5hYmxlZFBsdWdpbnMucHVzaChwbHVnaW5OYW1lKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZUy5FTkFCTEVEX1BMVUdJTlMsIEpTT04uc3RyaW5naWZ5KGVuYWJsZWRQbHVnaW5zKSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oYFBsdWdpbiAke3BsdWdpbk5hbWV9IGxvYWRlZCFgKTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogVW5sb2FkIGFuZCBkaXNhYmxlIGEgcGx1Z2luIGJ5IGZpbGVuYW1lXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB1bmxvYWRQbHVnaW4ocGx1Z2luTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBsdWdpbkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwbHVnaW5OYW1lKTtcbiAgICAgICAgaWYgKHBsdWdpbkVsZW1lbnQpIHtcbiAgICAgICAgICAgIHBsdWdpbkVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxldCBlbmFibGVkUGx1Z2luczogc3RyaW5nW10gPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUykgfHwgXCJbXVwiXG4gICAgICAgICk7XG4gICAgICAgIGVuYWJsZWRQbHVnaW5zID0gZW5hYmxlZFBsdWdpbnMuZmlsdGVyKCh4OiBzdHJpbmcpID0+IHggIT09IHBsdWdpbk5hbWUpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TLCBKU09OLnN0cmluZ2lmeShlbmFibGVkUGx1Z2lucykpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgUGx1Z2luICR7cGx1Z2luTmFtZX0gdW5sb2FkZWQhYCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2ggbW9kcyBmcm9tIHRoZSByZWdpc3RyeSByZXBvc2l0b3J5XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBmZXRjaE1vZHMoKTogUHJvbWlzZTx7IHBsdWdpbnM6IHVua25vd25bXTsgdGhlbWVzOiB1bmtub3duW10gfT4ge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFVSTFMuUkVHSVNUUlkpO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvd25sb2FkIGFuZCBzYXZlIGEgbW9kIChwbHVnaW4gb3IgdGhlbWUpXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBkb3dubG9hZE1vZChtb2RMaW5rOiBzdHJpbmcsIHR5cGU6IFwicGx1Z2luXCIgfCBcInRoZW1lXCIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBEb3dubG9hZGluZyAke3R5cGV9IGZyb206ICR7bW9kTGlua31gKTtcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKG1vZExpbmspO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBkb3dubG9hZDogJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHNhdmVEaXIgPSB0eXBlID09PSBcInBsdWdpblwiID8gUHJvcGVydGllcy5wbHVnaW5zUGF0aCA6IFByb3BlcnRpZXMudGhlbWVzUGF0aDtcbiAgICAgICAgaWYgKCFhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5leGlzdHMoc2F2ZURpcikpIHtcbiAgICAgICAgICAgIGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50Lm1rZGlyKHNhdmVEaXIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGJhc2VuYW1lKG5ldyBVUkwobW9kTGluaykucGF0aG5hbWUpIHx8IGAke3R5cGV9LSR7RGF0ZS5ub3coKX1gO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGpvaW4oc2F2ZURpciwgZmlsZW5hbWUpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LndyaXRlRmlsZShmaWxlUGF0aCwgY29udGVudCk7XG5cbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgRG93bmxvYWRlZCAke3R5cGV9IHNhdmVkIHRvOiAke2ZpbGVQYXRofWApO1xuICAgICAgICByZXR1cm4gZmlsZVBhdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgbW9kIGZpbGUgYW5kIGNsZWFuIHVwIGFzc29jaWF0ZWQgc3RhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHJlbW92ZU1vZChmaWxlTmFtZTogc3RyaW5nLCB0eXBlOiBcInBsdWdpblwiIHwgXCJ0aGVtZVwiKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oYFJlbW92aW5nICR7dHlwZX0gZmlsZTogJHtmaWxlTmFtZX1gKTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJwbHVnaW5cIjpcbiAgICAgICAgICAgICAgICBpZiAoYXdhaXQgdGhpcy5pc1BsdWdpbkluc3RhbGxlZChmaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQudW5saW5rKGpvaW4oUHJvcGVydGllcy5wbHVnaW5zUGF0aCwgZmlsZU5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVuYWJsZWRQbHVnaW5zOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TKSB8fCBcIltdXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuYWJsZWRQbHVnaW5zLmluY2x1ZGVzKGZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZFBsdWdpbnMgPSBlbmFibGVkUGx1Z2lucy5maWx0ZXIoKHg6IHN0cmluZykgPT4geCAhPT0gZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUywgSlNPTi5zdHJpbmdpZnkoZW5hYmxlZFBsdWdpbnMpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ0aGVtZVwiOlxuICAgICAgICAgICAgICAgIGlmIChhd2FpdCB0aGlzLmlzVGhlbWVJbnN0YWxsZWQoZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSkgPT09IGZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSwgXCJEZWZhdWx0XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWN0aXZlVGhlbWVcIik/LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC51bmxpbmsoam9pbihQcm9wZXJ0aWVzLnRoZW1lc1BhdGgsIGZpbGVOYW1lKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBpc1RoZW1lSW5zdGFsbGVkKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLmdldEluc3RhbGxlZFRoZW1lcygpKS5pbmNsdWRlcyhmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBpc1BsdWdpbkluc3RhbGxlZChmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRJbnN0YWxsZWRQbHVnaW5zKCkpLmluY2x1ZGVzKGZpbGVOYW1lKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBhc3luYyBnZXRJbnN0YWxsZWRUaGVtZXMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCBkaXJQYXRoID0gUHJvcGVydGllcy50aGVtZXNQYXRoO1xuICAgICAgICBpZiAoIWF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmV4aXN0cyhkaXJQYXRoKSkgcmV0dXJuIFtdO1xuXG4gICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZGRpcihkaXJQYXRoKTtcbiAgICAgICAgY29uc3QgZmlsZVN0YXRzID0gYXdhaXQgUHJvbWlzZS5hbGwoZmlsZXMubWFwKGFzeW5jIGZpbGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnN0YXQoam9pbihkaXJQYXRoLCBmaWxlKSk7XG4gICAgICAgICAgICByZXR1cm4geyBmaWxlLCBpc0ZpbGU6IHN0YXQuaXNGaWxlIH07XG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmaWxlU3RhdHMuZmlsdGVyKGYgPT4gZi5pc0ZpbGUpLm1hcChmID0+IGYuZmlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgZ2V0SW5zdGFsbGVkUGx1Z2lucygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IGRpclBhdGggPSBQcm9wZXJ0aWVzLnBsdWdpbnNQYXRoO1xuICAgICAgICBpZiAoIWF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmV4aXN0cyhkaXJQYXRoKSkgcmV0dXJuIFtdO1xuXG4gICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZGRpcihkaXJQYXRoKTtcbiAgICAgICAgY29uc3QgZmlsZVN0YXRzID0gYXdhaXQgUHJvbWlzZS5hbGwoZmlsZXMubWFwKGFzeW5jIGZpbGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnN0YXQoam9pbihkaXJQYXRoLCBmaWxlKSk7XG4gICAgICAgICAgICByZXR1cm4geyBmaWxlLCBpc0ZpbGU6IHN0YXQuaXNGaWxlIH07XG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmaWxlU3RhdHMuZmlsdGVyKGYgPT4gZi5pc0ZpbGUpLm1hcChmID0+IGYuZmlsZSk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFNldCB1cCBldmVudCBsaXN0ZW5lcnMgZm9yIHBsdWdpbiB0b2dnbGUgY2hlY2tib3hlc1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdG9nZ2xlUGx1Z2luTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGhlbHBlcnMud2FpdEZvckVsbShTRUxFQ1RPUlMuUExVR0lOU19DQVRFR09SWSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKFwiTGlzdGVuaW5nIHRvIHBsdWdpbiBjaGVja2JveGVzLi4uXCIpO1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luQ2hlY2tib3hlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbHVnaW5cIikgYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRWxlbWVudD47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGx1Z2luQ2hlY2tib3hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBsdWdpbkNoZWNrYm94ZXNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luQ2hlY2tib3hlc1tpXS5jbGFzc0xpc3QudG9nZ2xlKENMQVNTRVMuQ0hFQ0tFRCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsdWdpbk5hbWUgPSBwbHVnaW5DaGVja2JveGVzW2ldLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGx1Z2luTmFtZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwbHVnaW5DaGVja2JveGVzW2ldLmNsYXNzTGlzdC5jb250YWlucyhDTEFTU0VTLkNIRUNLRUQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRQbHVnaW4ocGx1Z2luTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVubG9hZFBsdWdpbihwbHVnaW5OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1JlbG9hZFdhcm5pbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBzZXR1cCBwbHVnaW4gbGlzdGVuZXJzOiAke2Vycn1gKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hvd1JlbG9hZFdhcm5pbmcoKTogdm9pZCB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsdWdpbi1yZWxvYWQtd2FybmluZ1wiKSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhcIlBsdWdpbiB1bmxvYWRlZCwgYWRkaW5nIHJlbG9hZCB3YXJuaW5nLlwiKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuUExVR0lOU19DQVRFR09SWSk7XG4gICAgICAgIGlmICghY29udGFpbmVyKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIHBhcmFncmFwaC5pZCA9IFwicGx1Z2luLXJlbG9hZC13YXJuaW5nXCI7XG4gICAgICAgIHBhcmFncmFwaC5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgbGluay5zdHlsZS5jb2xvciA9IFwiY3lhblwiO1xuICAgICAgICBsaW5rLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICBsaW5rLnRleHRDb250ZW50ID0gXCJoZXJlXCI7XG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHBhcmFncmFwaC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlJlbG9hZCBpcyByZXF1aXJlZCB0byBkaXNhYmxlIHBsdWdpbnMuIENsaWNrIFwiKSk7XG4gICAgICAgIHBhcmFncmFwaC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgcGFyYWdyYXBoLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiIHRvIHJlbG9hZC5cIikpO1xuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBhcmFncmFwaCk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzdGF0aWMgb3BlblRoZW1lc0ZvbGRlcigpOiB2b2lkIHtcbiAgICAgICAgaGVscGVycy53YWl0Rm9yRWxtKFwiI29wZW50aGVtZXNmb2xkZXJCdG5cIikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW50aGVtZXNmb2xkZXJCdG5cIik7XG4gICAgICAgICAgICBidXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5vcGVuRm9sZGVyKFByb3BlcnRpZXMudGhlbWVzUGF0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gc2V0dXAgdGhlbWVzIGZvbGRlciBidXR0b246ICR7ZXJyfWApKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIG9wZW5QbHVnaW5zRm9sZGVyKCk6IHZvaWQge1xuICAgICAgICBoZWxwZXJzLndhaXRGb3JFbG0oXCIjb3BlbnBsdWdpbnNmb2xkZXJCdG5cIikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW5wbHVnaW5zZm9sZGVyQnRuXCIpO1xuICAgICAgICAgICAgYnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMub3BlbkZvbGRlcihQcm9wZXJ0aWVzLnBsdWdpbnNQYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBzZXR1cCBwbHVnaW5zIGZvbGRlciBidXR0b246ICR7ZXJyfWApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVuIGEgZm9sZGVyIGluIHRoZSBzeXN0ZW0gZmlsZSBleHBsb3JlclxuICAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIG9wZW5Gb2xkZXIoZm9sZGVyUGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5vcGVuUGF0aChmb2xkZXJQYXRoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gb3BlbiBmb2xkZXIgJHtmb2xkZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgXG4gICAgcHVibGljIHN0YXRpYyBzY3JvbGxMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgaGVscGVycy53YWl0Rm9yRWxtKFwiLm1lbnUteGVFMDYgPiBkaXY6bnRoLWNoaWxkKDUpID4gZGl2XCIpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW5oYW5jZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5oYW5jZWQnKTtcbiAgICAgICAgICAgIGNvbnN0IGVuaGFuY2VkTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUteGVFMDYgPiBkaXY6bnRoLWNoaWxkKDUpID4gZGl2Jyk7XG5cbiAgICAgICAgICAgIGlmICghZW5oYW5jZWQgfHwgIWVuaGFuY2VkTmF2KSByZXR1cm47XG5cbiAgICAgICAgICAgIGVuaGFuY2VkTmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlyc3RDaGlsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZW5oYW5jZWQgPiBkaXZcIik7XG4gICAgICAgICAgICAgICAgZmlyc3RDaGlsZD8uc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrOiAnc3RhcnQnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgU2V0dGluZ3MuYWN0aXZlU2VjdGlvbihlbmhhbmNlZE5hdik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgICAgICAgICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNldHRpbmdzLmFjdGl2ZVNlY3Rpb24oZW5oYW5jZWROYXYpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5oYW5jZWROYXYuY2xhc3NMaXN0LnJlbW92ZShDTEFTU0VTLlNFTEVDVEVEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgeyB0aHJlc2hvbGQ6IDAuMSB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVuaGFuY2VkKTtcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gc2V0dXAgc2Nyb2xsIGxpc3RlbmVyOiAke2Vycn1gKSk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgYXBwbHlUaGVtZSBmdW5jdGlvbiB0byB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkQXBwbHlUaGVtZUZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBhcHBseVRoZW1lU2NyaXB0ID0gZ2V0QXBwbHlUaGVtZVRlbXBsYXRlKCk7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ICBcbiAgICAgICAgc2NyaXB0LmlubmVySFRNTCA9IGFwcGx5VGhlbWVTY3JpcHQ7XG4gICAgICAgIFxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIENoZWNrIGZvciB1cGRhdGVzIGZvciBhIHNwZWNpZmljIHBsdWdpbiBvciB0aGVtZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgY2hlY2tGb3JJdGVtVXBkYXRlcyhpdGVtRmlsZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oJ0NoZWNraW5nIGZvciB1cGRhdGVzIGZvciAnICsgaXRlbUZpbGUpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgaXRlbUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKGAke2l0ZW1GaWxlfS1ib3hgKVswXTtcbiAgICAgICAgaWYgKCFpdGVtQm94KSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGAke2l0ZW1GaWxlfS1ib3ggZWxlbWVudCBub3QgZm91bmQuYCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwbHVnaW5PclRoZW1lOiAndGhlbWUnIHwgJ3BsdWdpbicgPSBpdGVtRmlsZS5lbmRzV2l0aChcIi50aGVtZS5jc3NcIikgPyBcInRoZW1lXCIgOiBcInBsdWdpblwiO1xuICAgICAgICBjb25zdCBpdGVtUGF0aCA9IGpvaW4oXG4gICAgICAgICAgICBwbHVnaW5PclRoZW1lID09PSBcInRoZW1lXCIgPyBwcm9wZXJ0aWVzLnRoZW1lc1BhdGggOiBwcm9wZXJ0aWVzLnBsdWdpbnNQYXRoLCBcbiAgICAgICAgICAgIGl0ZW1GaWxlXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICAvLyBSZWZhY3RvcmVkOiBSZWFkIGZpbGUgZmlyc3RcbiAgICAgICAgbGV0IGZpbGVDb250ZW50ID0gXCJcIjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpbGVDb250ZW50ID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZEZpbGUoaXRlbVBhdGgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIHJlYWQgZmlsZSAke2l0ZW1QYXRofTogJHtlfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5zdGFsbGVkSXRlbU1ldGFEYXRhID0gRXh0cmFjdE1ldGFEYXRhLmV4dHJhY3RNZXRhZGF0YUZyb21UZXh0KGZpbGVDb250ZW50KSBhcyBNZXRhRGF0YSB8IG51bGw7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWluc3RhbGxlZEl0ZW1NZXRhRGF0YSB8fCBPYmplY3Qua2V5cyhpbnN0YWxsZWRJdGVtTWV0YURhdGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXBkYXRlVXJsID0gaW5zdGFsbGVkSXRlbU1ldGFEYXRhLnVwZGF0ZVVybDtcbiAgICAgICAgaWYgKCF1cGRhdGVVcmwgfHwgdXBkYXRlVXJsID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgTm8gdXBkYXRlIFVSTCBwcm92aWRlZCBmb3IgJHtwbHVnaW5PclRoZW1lfSAoJHtpbnN0YWxsZWRJdGVtTWV0YURhdGEubmFtZX0pYCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IGF3YWl0IGZldGNoKHVwZGF0ZVVybCk7XG4gICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEZhaWxlZCB0byBmZXRjaCB1cGRhdGUgZm9yICR7aXRlbUZpbGV9OiBIVFRQICR7cmVxdWVzdC5zdGF0dXN9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3QudGV4dCgpO1xuICAgICAgICAgICAgY29uc3QgZXh0cmFjdGVkTWV0YURhdGEgPSBFeHRyYWN0TWV0YURhdGEuZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQocmVzcG9uc2UpIGFzIE1ldGFEYXRhIHwgbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFleHRyYWN0ZWRNZXRhRGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEZhaWxlZCB0byBleHRyYWN0IG1ldGFkYXRhIGZyb20gcmVzcG9uc2UgZm9yICR7cGx1Z2luT3JUaGVtZX0gKCR7aW5zdGFsbGVkSXRlbU1ldGFEYXRhLm5hbWV9KWApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhlbHBlcnMuaXNOZXdlclZlcnNpb24oZXh0cmFjdGVkTWV0YURhdGEudmVyc2lvbiwgaW5zdGFsbGVkSXRlbU1ldGFEYXRhLnZlcnNpb24pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgYFVwZGF0ZSBhdmFpbGFibGUgZm9yICR7cGx1Z2luT3JUaGVtZX0gKCR7aW5zdGFsbGVkSXRlbU1ldGFEYXRhLm5hbWV9KTogYCArXG4gICAgICAgICAgICAgICAgICAgIGB2JHtpbnN0YWxsZWRJdGVtTWV0YURhdGEudmVyc2lvbn0gLT4gdiR7ZXh0cmFjdGVkTWV0YURhdGEudmVyc2lvbn1gXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2l0ZW1GaWxlfS11cGRhdGVgKTtcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlQnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQud3JpdGVGaWxlKGl0ZW1QYXRoLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBTZXR0aW5ncy5yZW1vdmVJdGVtKGl0ZW1GaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNldHRpbmdzLmFkZEl0ZW0ocGx1Z2luT3JUaGVtZSwgaXRlbUZpbGUsIGV4dHJhY3RlZE1ldGFEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICBgTm8gdXBkYXRlIGF2YWlsYWJsZSBmb3IgJHtwbHVnaW5PclRoZW1lfSAoJHtpbnN0YWxsZWRJdGVtTWV0YURhdGEubmFtZX0pLiBgICtcbiAgICAgICAgICAgICAgICAgICAgYEN1cnJlbnQgdmVyc2lvbjogdiR7aW5zdGFsbGVkSXRlbU1ldGFEYXRhLnZlcnNpb259YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgRXJyb3IgY2hlY2tpbmcgdXBkYXRlcyBmb3IgJHtpdGVtRmlsZX06ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApO1xuICAgICAgICB9XG4gICAgfVxufVxuICAgIFxuZXhwb3J0IGRlZmF1bHQgTW9kTWFuYWdlcjtcbiIsICIvKipcbiAqIE1ldGFkYXRhIHN0cnVjdHVyZSBmb3IgcGx1Z2lucyBhbmQgdGhlbWVzXG4gKiBFeHRyYWN0ZWQgZnJvbSBKU0RvYy1zdHlsZSBjb21tZW50cyBpbiBtb2QgZmlsZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRhRGF0YSB7XG4gICAgLyoqIERpc3BsYXkgbmFtZSBvZiB0aGUgbW9kICovXG4gICAgbmFtZTogc3RyaW5nO1xuICAgIC8qKiBCcmllZiBkZXNjcmlwdGlvbiBvZiB3aGF0IHRoZSBtb2QgZG9lcyAqL1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgLyoqIEF1dGhvci9jcmVhdG9yIG9mIHRoZSBtb2QgKi9cbiAgICBhdXRob3I6IHN0cmluZztcbiAgICAvKiogU2VtYW50aWMgdmVyc2lvbiBzdHJpbmcgKGUuZy4sIFwiMS4wLjBcIikgKi9cbiAgICB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgLyoqIFVSTCB0byBjaGVjayBmb3IgdXBkYXRlcyAob3B0aW9uYWwpICovXG4gICAgdXBkYXRlVXJsPzogc3RyaW5nO1xuICAgIC8qKiBTb3VyY2UgY29kZSByZXBvc2l0b3J5IFVSTCAob3B0aW9uYWwpICovXG4gICAgc291cmNlPzogc3RyaW5nO1xuICAgIC8qKiBMaWNlbnNlIHR5cGUgKG9wdGlvbmFsKSAqL1xuICAgIGxpY2Vuc2U/OiBzdHJpbmc7XG4gICAgLyoqIEhvbWVwYWdlL2RvY3VtZW50YXRpb24gVVJMIChvcHRpb25hbCkgKi9cbiAgICBob21lcGFnZT86IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgTWV0YWRhdGFLZXkgPSBrZXlvZiBNZXRhRGF0YTtcblxuZXhwb3J0IGNvbnN0IFJFUVVJUkVEX01FVEFEQVRBX0tFWVMgPSBbXG4gICAgXCJuYW1lXCIsXG4gICAgXCJkZXNjcmlwdGlvblwiLFxuICAgIFwiYXV0aG9yXCIsXG4gICAgXCJ2ZXJzaW9uXCIsXG5dIGFzIGNvbnN0IHNhdGlzZmllcyByZWFkb25seSBNZXRhZGF0YUtleVtdO1xuXG5leHBvcnQgY29uc3QgQUxMX01FVEFEQVRBX0tFWVMgPSBbXG4gICAgXCJuYW1lXCIsXG4gICAgXCJkZXNjcmlwdGlvblwiLFxuICAgIFwiYXV0aG9yXCIsXG4gICAgXCJ2ZXJzaW9uXCIsXG4gICAgXCJ1cGRhdGVVcmxcIixcbiAgICBcInNvdXJjZVwiLFxuICAgIFwibGljZW5zZVwiLFxuICAgIFwiaG9tZXBhZ2VcIixcbl0gYXMgY29uc3Qgc2F0aXNmaWVzIHJlYWRvbmx5IE1ldGFkYXRhS2V5W107XG4iLCAiaW1wb3J0IHtcbiAgICBNZXRhRGF0YSxcbiAgICBNZXRhZGF0YUtleSxcbiAgICBSRVFVSVJFRF9NRVRBREFUQV9LRVlTLFxuICAgIEFMTF9NRVRBREFUQV9LRVlTLFxufSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9NZXRhRGF0YVwiO1xuaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIjtcblxuY2xhc3MgRXh0cmFjdE1ldGFEYXRhIHtcbiAgICAvKipcbiAgICAgKiBQYXJzZSBtZXRhZGF0YSBmcm9tIGEgY29tbWVudCBibG9jayBpbiB0aGUgZm9ybWF0OlxuICAgICAqIC8qKiBAa2V5IHZhbHVlICpcXC9cbiAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIHBhcnNlTWV0YWRhdGFGcm9tQ29udGVudChjb250ZW50OiBzdHJpbmcpOiBNZXRhRGF0YSB8IG51bGwge1xuICAgICAgICBjb25zdCBibG9ja01hdGNoID0gY29udGVudC5tYXRjaCgvXFwvXFwqXFwqKFtcXHNcXFNdKj8pXFwqXFwvLyk7XG4gICAgICAgIGlmICghYmxvY2tNYXRjaCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBQYXJ0aWFsPE1ldGFEYXRhPiA9IHt9O1xuICAgICAgICBjb25zdCB0YWdSZWdleCA9IC9AKFxcdyspXFxzKyhbXlxcblxccl0rKS9nO1xuXG4gICAgICAgIGZvciAoY29uc3QgWywgcmF3S2V5LCByYXdWYWx1ZV0gb2YgYmxvY2tNYXRjaFsxXS5tYXRjaEFsbCh0YWdSZWdleCkpIHtcbiAgICAgICAgICAgIGlmICghQUxMX01FVEFEQVRBX0tFWVMuaW5jbHVkZXMocmF3S2V5IGFzIE1ldGFkYXRhS2V5KSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHJhd0tleSBhcyBNZXRhZGF0YUtleTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdFtrZXldICE9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHJhd1ZhbHVlLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIFJFUVVJUkVEX01FVEFEQVRBX0tFWVMpIHtcbiAgICAgICAgICAgIGlmICghcmVzdWx0W2tleV0pIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBNZXRhRGF0YTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGV4dHJhY3RNZXRhZGF0YUZyb21UZXh0KHRleHRDb250ZW50OiBzdHJpbmcpOiBNZXRhRGF0YSB8IG51bGwge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMucGFyc2VNZXRhZGF0YUZyb21Db250ZW50KHRleHRDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghbWV0YWRhdGEpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignQ29tbWVudCBibG9jayBub3QgZm91bmQgaW4gdGhlIHByb3ZpZGVkIHRleHQnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG1ldGFkYXRhO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXh0cmFjdE1ldGFEYXRhO1xuIiwgImltcG9ydCBIZWxwZXJzIGZyb20gXCIuLi91dGlscy9IZWxwZXJzXCI7XG5pbXBvcnQgeyBNZXRhRGF0YSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL01ldGFEYXRhXCI7XG5pbXBvcnQgeyBnZXRQbHVnaW5JdGVtVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9wbHVnaW4taXRlbS9wbHVnaW5JdGVtXCI7XG5pbXBvcnQgeyBnZXRUaGVtZUl0ZW1UZW1wbGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL3RoZW1lLWl0ZW0vdGhlbWVJdGVtXCI7XG5pbXBvcnQgeyBnZXRFbmhhbmNlZE5hdiB9IGZyb20gXCIuLi9jb21wb25lbnRzL2VuaGFuY2VkLW5hdi9lbmhhbmNlZE5hdlwiO1xuaW1wb3J0IHsgZ2V0TG9nZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IE1vZE1hbmFnZXIgZnJvbSBcIi4vTW9kTWFuYWdlclwiO1xuaW1wb3J0IHsgU0VMRUNUT1JTLCBDTEFTU0VTLCBTVE9SQUdFX0tFWVMgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5cbmNsYXNzIFNldHRpbmdzIHtcbiAgICBwcml2YXRlIHN0YXRpYyBsb2dnZXIgPSBnZXRMb2dnZXIoXCJTZXR0aW5nc1wiKTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIG5ldyBzZWN0aW9uIHRvIHRoZSBzZXR0aW5ncyBwYW5lbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkU2VjdGlvbihzZWN0aW9uSWQ6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLndhaXRGb3JTZXR0aW5nc1BhbmVsKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBBZGRpbmcgc2VjdGlvbjogJHtzZWN0aW9uSWR9IHdpdGggdGl0bGU6ICR7dGl0bGV9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzUGFuZWwgPSB0aGlzLmdldFNldHRpbmdzUGFuZWwoKTtcbiAgICAgICAgICAgIGlmICghc2V0dGluZ3NQYW5lbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBzZWN0aW9uRWxlbWVudCA9IHRoaXMuZ2V0RXhpc3RpbmdTZWN0aW9uKHNldHRpbmdzUGFuZWwpO1xuICAgICAgICAgICAgY29uc3QgbGFiZWxFbGVtZW50ID0gdGhpcy5nZXRFeGlzdGluZ1NlY3Rpb25MYWJlbChzZWN0aW9uRWxlbWVudCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghc2VjdGlvbkVsZW1lbnQgfHwgIWxhYmVsRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBzZWN0aW9uQ2xhc3NOYW1lID0gc2VjdGlvbkVsZW1lbnQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgY29uc3QgdGl0bGVDbGFzc05hbWUgPSBsYWJlbEVsZW1lbnQuY2xhc3NOYW1lO1xuXG4gICAgICAgICAgICBjb25zdCBzZWN0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHNlY3Rpb25Db250YWluZXIuY2xhc3NOYW1lID0gc2VjdGlvbkNsYXNzTmFtZTtcbiAgICAgICAgICAgIHNlY3Rpb25Db250YWluZXIuaWQgPSBzZWN0aW9uSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBzZWN0aW9uVGl0bGUuY2xhc3NOYW1lID0gdGl0bGVDbGFzc05hbWU7XG4gICAgICAgICAgICBzZWN0aW9uVGl0bGUudGV4dENvbnRlbnQgPSB0aXRsZTtcblxuICAgICAgICAgICAgc2VjdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uVGl0bGUpO1xuICAgICAgICAgICAgc2V0dGluZ3NQYW5lbC5hcHBlbmRDaGlsZChzZWN0aW9uQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gQWRkIHNlY3Rpb24gdG8gbmF2XG4gICAgICAgICAgICB0aGlzLndhaXRGb3JOYXZNZW51KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmF2ID0gdGhpcy5nZXROYXZNZW51KCk7XG4gICAgICAgICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgc2hvcnRjdXRzIG5hdiB0byBpbnNlcnQgYWZ0ZXIsIG9yIGp1c3QgYXBwZW5kXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hvcnRjdXRzTmF2ID0gdGhpcy5nZXROYXZTaG9ydGN1dEl0ZW0oKTtcblxuICAgICAgICAgICAgICAgIGlmICghbmF2KSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2VjdGlvbj1cIiR7c2VjdGlvbklkfVwiXWApKSByZXR1cm47IC8vIE5hdiBpdGVtIGFscmVhZHkgZXhpc3RzXG5cbiAgICAgICAgICAgICAgICBjb25zdCBlbmhhbmNlZE5hdkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgZW5oYW5jZWROYXZDb250YWluZXIuaW5uZXJIVE1MID0gZ2V0RW5oYW5jZWROYXYoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoc2hvcnRjdXRzTmF2KSB7XG4gICAgICAgICAgICAgICAgICAgIG5hdi5pbnNlcnRCZWZvcmUoZW5oYW5jZWROYXZDb250YWluZXIsIHNob3J0Y3V0c05hdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmF2LmFwcGVuZENoaWxkKGVuaGFuY2VkTmF2Q29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgbmF2OiAke2Vycn1gKSk7XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGFkZCBzZWN0aW9uOiAke2Vycn1gKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY2F0ZWdvcnkgd2l0aGluIGEgc2VjdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkQ2F0ZWdvcnkodGl0bGU6IHN0cmluZywgc2VjdGlvbklkOiBzdHJpbmcsIGljb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLndhaXRGb3JTZXR0aW5nc1BhbmVsKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBBZGRpbmcgY2F0ZWdvcnk6ICR7dGl0bGV9IHRvIHNlY3Rpb246ICR7c2VjdGlvbklkfWApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yeVRlbXBsYXRlID0gdGhpcy5nZXRDYXRlZ29yeVRlbXBsYXRlKCk7XG4gICAgICAgICAgICBpZiAoIWNhdGVnb3J5VGVtcGxhdGUpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgeyBjYXRlZ29yeUNsYXNzLCBjYXRlZ29yeVRpdGxlQ2xhc3MsIGhlYWRpbmdDbGFzcywgaWNvbkNsYXNzIH0gPSBjYXRlZ29yeVRlbXBsYXRlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBSZXBsYWNlIGljb24gY2xhc3NcbiAgICAgICAgICAgIGljb24gPSBpY29uLnJlcGxhY2UoYGNsYXNzPVwiaWNvblwiYCwgYGNsYXNzPVwiJHtpY29uQ2xhc3N9XCJgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlY3Rpb25JZCk7XG4gICAgICAgICAgICBpZiAoIXNlY3Rpb24pIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgY2F0ZWdvcnlEaXYuY2xhc3NOYW1lID0gY2F0ZWdvcnlDbGFzcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdGl0bGVEaXYuY2xhc3NOYW1lID0gY2F0ZWdvcnlUaXRsZUNsYXNzO1xuICAgICAgICAgICAgdGl0bGVEaXYuaW5uZXJIVE1MID0gdGl0bGU7XG5cbiAgICAgICAgICAgIGNvbnN0IGhlYWRpbmdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgLy8gSWYgd2UgZm91bmQgYSBjbGFzcywgdXNlIGl0LiBJZiBub3QsIGZhbGxiYWNrIHRvIHNlbGVjdG9yIGxvZ2ljIG9yIGVtcHR5XG4gICAgICAgICAgICBpZiAoaGVhZGluZ0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgaGVhZGluZ0Rpdi5jbGFzc05hbWUgPSBoZWFkaW5nQ2xhc3M7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICBoZWFkaW5nRGl2LmNsYXNzTGlzdC5hZGQoU0VMRUNUT1JTLkNBVEVHT1JZX0hFQURJTkcucmVwbGFjZSgnLicsICcnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGhlYWRpbmdEaXYuaW5uZXJIVE1MICs9IGljb247XG4gICAgICAgICAgICBoZWFkaW5nRGl2LmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2F0ZWdvcnlEaXYuYXBwZW5kQ2hpbGQoaGVhZGluZ0Rpdik7XG4gICAgICAgICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGNhdGVnb3J5RGl2KTtcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gYWRkIGNhdGVnb3J5OiAke2Vycn1gKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgYnV0dG9uIHRvIHRoZSBzZXR0aW5nc1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkQnV0dG9uKHRpdGxlOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHF1ZXJ5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgSGVscGVycy53YWl0Rm9yRWxtKHF1ZXJ5KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHF1ZXJ5KTtcbiAgICAgICAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBvcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgb3B0aW9uRGl2LmNsYXNzTGlzdC5hZGQoQ0xBU1NFUy5PUFRJT04pO1xuXG4gICAgICAgICAgICBjb25zdCBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGNvbnRlbnREaXYuY2xhc3NMaXN0LmFkZChDTEFTU0VTLkNPTlRFTlQpO1xuXG4gICAgICAgICAgICBjb25zdCBidXR0b25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgYnV0dG9uRGl2LnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgICAgIGJ1dHRvbkRpdi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCB0aXRsZSk7XG4gICAgICAgICAgICBidXR0b25EaXYuY2xhc3NMaXN0LmFkZChDTEFTU0VTLkJVVFRPTiwgQ0xBU1NFUy5CVVRUT05fQ09OVEFJTkVSLCBcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIGJ1dHRvbkRpdi5pZCA9IGlkO1xuICAgICAgICAgICAgYnV0dG9uRGl2LnRleHRDb250ZW50ID0gdGl0bGU7XG5cbiAgICAgICAgICAgIGNvbnRlbnREaXYuYXBwZW5kQ2hpbGQoYnV0dG9uRGl2KTtcbiAgICAgICAgICAgIG9wdGlvbkRpdi5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob3B0aW9uRGl2KTtcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gYWRkIGJ1dHRvbjogJHtlcnJ9YCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHRoZW1lIG9yIHBsdWdpbiBpdGVtIHRvIHRoZSBzZXR0aW5nc1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkSXRlbSh0eXBlOiBcInRoZW1lXCIgfCBcInBsdWdpblwiLCBmaWxlTmFtZTogc3RyaW5nLCBtZXRhRGF0YTogTWV0YURhdGEpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgQWRkaW5nICR7dHlwZX06ICR7ZmlsZU5hbWV9YCk7XG4gICAgICAgIFxuICAgICAgICBpZiAodHlwZSA9PT0gXCJ0aGVtZVwiKSB7XG4gICAgICAgICAgICBIZWxwZXJzLndhaXRGb3JFbG0oU0VMRUNUT1JTLlRIRU1FU19DQVRFR09SWSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUaGVtZShmaWxlTmFtZSwgbWV0YURhdGEpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gYWRkIHRoZW1lOiAke2Vycn1gKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJwbHVnaW5cIikge1xuICAgICAgICAgICAgSGVscGVycy53YWl0Rm9yRWxtKFNFTEVDVE9SUy5QTFVHSU5TX0NBVEVHT1JZKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFBsdWdpbihmaWxlTmFtZSwgbWV0YURhdGEpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gYWRkIHBsdWdpbjogJHtlcnJ9YCkpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBhZGRQbHVnaW4oZmlsZU5hbWU6IHN0cmluZywgbWV0YURhdGE6IE1ldGFEYXRhKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGVuYWJsZWRQbHVnaW5zOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TKSB8fCBcIltdXCJcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBwbHVnaW5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBwbHVnaW5Db250YWluZXIuaW5uZXJIVE1MID0gZ2V0UGx1Z2luSXRlbVRlbXBsYXRlKGZpbGVOYW1lLCBtZXRhRGF0YSwgZW5hYmxlZFBsdWdpbnMuaW5jbHVkZXMoZmlsZU5hbWUpKTtcbiAgICAgICAgcGx1Z2luQ29udGFpbmVyLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgYCR7ZmlsZU5hbWV9LWJveGApO1xuXG4gICAgICAgIGNvbnN0IHBsdWdpbnNDYXRlZ29yeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlBMVUdJTlNfQ0FURUdPUlkpO1xuICAgICAgICBwbHVnaW5zQ2F0ZWdvcnk/LmFwcGVuZENoaWxkKHBsdWdpbkNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICBNb2RNYW5hZ2VyLmNoZWNrRm9ySXRlbVVwZGF0ZXMoZmlsZU5hbWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGFkZFRoZW1lKGZpbGVOYW1lOiBzdHJpbmcsIG1ldGFEYXRhOiBNZXRhRGF0YSk6IHZvaWQge1xuICAgICAgICBjb25zdCBjdXJyZW50VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSk7XG5cbiAgICAgICAgY29uc3QgdGhlbWVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGVtZUNvbnRhaW5lci5pbm5lckhUTUwgPSBnZXRUaGVtZUl0ZW1UZW1wbGF0ZShmaWxlTmFtZSwgbWV0YURhdGEsIGN1cnJlbnRUaGVtZSA9PT0gZmlsZU5hbWUpO1xuICAgICAgICB0aGVtZUNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIGAke2ZpbGVOYW1lfS1ib3hgKTtcblxuICAgICAgICBjb25zdCB0aGVtZXNDYXRlZ29yeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlRIRU1FU19DQVRFR09SWSk7XG4gICAgICAgIHRoZW1lc0NhdGVnb3J5Py5hcHBlbmRDaGlsZCh0aGVtZUNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICBNb2RNYW5hZ2VyLmNoZWNrRm9ySXRlbVVwZGF0ZXMoZmlsZU5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBpdGVtIGZyb20gdGhlIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZW1vdmVJdGVtKGZpbGVOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKGAke2ZpbGVOYW1lfS1ib3hgKVswXTtcbiAgICAgICAgZWxlbWVudD8ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGEgbmF2aWdhdGlvbiBlbGVtZW50IGFzIGFjdGl2ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWN0aXZlU2VjdGlvbihlbGVtZW50OiBFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5hdiA9IHRoaXMuZ2V0TmF2TWVudSgpO1xuICAgICAgICBpZiAobmF2KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgc2VsZWN0ZWQgY2xhc3MgZnJvbSBhbGwgbmF2IGl0ZW1zXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hdi5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG5hdi5jaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKENMQVNTRVMuU0VMRUNURUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgIC8vIEZhbGxiYWNrIHRvIHF1ZXJ5U2VsZWN0b3JcbiAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hdkl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke1NFTEVDVE9SUy5OQVZfTUVOVX0gPiBkaXY6bnRoLWNoaWxkKCR7aX0pYCk7XG4gICAgICAgICAgICAgICAgbmF2SXRlbT8uY2xhc3NMaXN0LnJlbW92ZShDTEFTU0VTLlNFTEVDVEVEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChDTEFTU0VTLlNFTEVDVEVEKTtcbiAgICB9XG5cbiAgICAvLyAtLS0gRHluYW1pYyBEaXNjb3ZlcnkgSGVscGVycyAtLS1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldE5hdk1lbnUoKTogRWxlbWVudCB8IG51bGwge1xuICAgICAgICAvLyBUcnkgc2VsZWN0b3JcbiAgICAgICAgbGV0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLk5BVl9NRU5VKTtcbiAgICAgICAgaWYgKG5hdikgcmV0dXJuIG5hdjtcblxuICAgICAgICAvLyBEeW5hbWljIGZhbGxiYWNrXG4gICAgICAgIGNvbnN0IGtleXdvcmRzID0gW1wiQm9hcmRcIiwgXCJEaXNjb3ZlclwiLCBcIkxpYnJhcnlcIl07XG4gICAgICAgIGNvbnN0IGxpbmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLCBkaXZbdGl0bGVdJykpO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBsaW5rIG9mIGxpbmtzKSB7XG4gICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBsaW5rLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcbiAgICAgICAgICAgICBpZiAodGl0bGUgJiYga2V5d29yZHMuaW5jbHVkZXModGl0bGUpKSB7XG4gICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSBsaW5rLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgIHdoaWxlKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmQgPSBrZXl3b3Jkcy5maWx0ZXIoayA9PiBwYXJlbnQhLnF1ZXJ5U2VsZWN0b3IoYFt0aXRsZT1cIiR7a31cIl1gKSk7XG4gICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50ID09PSBkb2N1bWVudC5ib2R5KSBicmVhaztcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXROYXZTaG9ydGN1dEl0ZW0oKTogRWxlbWVudCB8IG51bGwge1xuICAgICAgICBsZXQgaXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1t0aXRsZT1cIlNob3J0Y3V0c1wiXScpO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRTZXR0aW5nc1BhbmVsKCk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICAgICAgLy8gVHJ5IHNlbGVjdG9yXG4gICAgICAgIGxldCBwYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlNFQ1RJT05TX0NPTlRBSU5FUik7XG4gICAgICAgIGlmIChwYW5lbCkgcmV0dXJuIHBhbmVsO1xuXG4gICAgICAgIC8vIER5bmFtaWMgZmFsbGJhY2tcbiAgICAgICAgY29uc3Qga2V5d29yZHMgPSBbXCJHZW5lcmFsXCIsIFwiUGxheWVyXCIsIFwiU3RyZWFtaW5nXCJdO1xuICAgICAgICBjb25zdCBhbGxEaXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdkaXYnKSk7XG4gICAgICAgIGZvciAoY29uc3QgZGl2IG9mIGFsbERpdnMpIHtcbiAgICAgICAgICAgICBpZiAoZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgbGV0IG1hdGNoQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpdi5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgaWYgKGtleXdvcmRzLnNvbWUoayA9PiBkaXYuY2hpbGRyZW5baV0udGV4dENvbnRlbnQ/LmluY2x1ZGVzKGspKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBpZiAobWF0Y2hDb3VudCA+PSAyKSByZXR1cm4gZGl2O1xuICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRFeGlzdGluZ1NlY3Rpb24ocGFuZWw6IEVsZW1lbnQpOiBFbGVtZW50IHwgbnVsbCB7XG4gICAgICAgIC8vIEZpbmQgYSBjaGlsZCB0aGF0IGNvbnRhaW5zIFwiR2VuZXJhbFwiIG9yIFwiUGxheWVyXCJcbiAgICAgICAgY29uc3Qga2V5d29yZHMgPSBbXCJHZW5lcmFsXCIsIFwiUGxheWVyXCJdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhbmVsLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IHBhbmVsLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGtleXdvcmRzLnNvbWUoayA9PiBjaGlsZC50ZXh0Q29udGVudD8uaW5jbHVkZXMoaykpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEZhbGxiYWNrIHRvIHNlbGVjdG9yXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5TRUNUSU9OKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRFeGlzdGluZ1NlY3Rpb25MYWJlbChzZWN0aW9uOiBFbGVtZW50IHwgbnVsbCk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICAgICAgaWYgKCFzZWN0aW9uKSByZXR1cm4gbnVsbDtcbiAgICAgICAgLy8gVGhlIGxhYmVsIGlzIHVzdWFsbHkgdGhlIGZpcnN0IGNoaWxkIG9yIGNsYXNzIGNvbnRhaW5zIGxhYmVsXG4gICAgICAgIGlmIChzZWN0aW9uLmNoaWxkcmVuLmxlbmd0aCA+IDApIHJldHVybiBzZWN0aW9uLmNoaWxkcmVuWzBdO1xuICAgICAgICAvLyBGYWxsYmFja1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuTEFCRUwpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldENhdGVnb3J5VGVtcGxhdGUoKTogeyBjYXRlZ29yeUNsYXNzOiBzdHJpbmcsIGNhdGVnb3J5VGl0bGVDbGFzczogc3RyaW5nLCBoZWFkaW5nQ2xhc3M6IHN0cmluZywgaWNvbkNsYXNzOiBzdHJpbmcgfSB8IG51bGwge1xuICAgICAgICAvLyBUcnkgdG8gZmluZCBhbiBleGlzdGluZyBjYXRlZ29yeSB0byBjb3B5IGNsYXNzZXNcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuQ0FURUdPUlkpO1xuICAgICAgICBjb25zdCBjYXRlZ29yeVRpdGxlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLkNBVEVHT1JZX0xBQkVMKTtcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlJY29uRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLkNBVEVHT1JZX0lDT04pO1xuICAgICAgICBjb25zdCBjYXRlZ29yeUhlYWRpbmdFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuQ0FURUdPUllfSEVBRElORyk7XG5cbiAgICAgICAgbGV0IGNhdGVnb3J5Q2xhc3MgPSBjYXRlZ29yeUVsZW1lbnQ/LmNsYXNzTmFtZSB8fCBcIlwiO1xuICAgICAgICBsZXQgY2F0ZWdvcnlUaXRsZUNsYXNzID0gY2F0ZWdvcnlUaXRsZUVsZW1lbnQ/LmNsYXNzTmFtZSB8fCBcIlwiO1xuICAgICAgICBsZXQgaGVhZGluZ0NsYXNzID0gY2F0ZWdvcnlIZWFkaW5nRWxlbWVudD8uY2xhc3NOYW1lIHx8IFwiXCI7XG4gICAgICAgIFxuICAgICAgICBsZXQgaWNvbkNsYXNzID0gJ2ljb24nO1xuICAgICAgICBpZiAoY2F0ZWdvcnlJY29uRWxlbWVudCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGljb25DbGFzcyA9IGNhdGVnb3J5SWNvbkVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWw7XG4gICAgICAgIH0gZWxzZSBpZiAoY2F0ZWdvcnlJY29uRWxlbWVudCkge1xuICAgICAgICAgICAgaWNvbkNsYXNzID0gY2F0ZWdvcnlJY29uRWxlbWVudC5jbGFzc05hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2F0ZWdvcnlDbGFzcyAmJiBjYXRlZ29yeVRpdGxlQ2xhc3MpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGNhdGVnb3J5Q2xhc3MsIGNhdGVnb3J5VGl0bGVDbGFzcywgaGVhZGluZ0NsYXNzLCBpY29uQ2xhc3MgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRyeSBkeW5hbWljIGlmIHNlbGVjdG9yIGZhaWxlZFxuICAgICAgICBjb25zdCBwYW5lbCA9IHRoaXMuZ2V0U2V0dGluZ3NQYW5lbCgpO1xuICAgICAgICBpZiAocGFuZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb24gPSB0aGlzLmdldEV4aXN0aW5nU2VjdGlvbihwYW5lbCk7XG4gICAgICAgICAgICBpZiAoc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIEZpbmQgYSBjYXRlZ29yeSBpbnNpZGUgc2VjdGlvblxuICAgICAgICAgICAgICAgIC8vIFVzdWFsbHkgbm90IHRoZSBmaXJzdCBjaGlsZCAoTGFiZWwpXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7IGk8c2VjdGlvbi5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IHNlY3Rpb24uY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgICAgIC8vIFNraXAgaWYgaXQgaXMgdGhlIGxhYmVsL3RpdGxlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5nZXRFeGlzdGluZ1NlY3Rpb25MYWJlbChzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkID09PSBsYWJlbCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGNoaWxkIGlzIGxpa2VseSBhIGNhdGVnb3J5XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5Q2xhc3MgPSBjaGlsZC5jbGFzc05hbWU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBGaW5kIEhlYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVhZGluZyA9IGNoaWxkLmNoaWxkcmVuWzBdOyAvLyBBc3N1bWluZyBmaXJzdCBjaGlsZCBpcyBoZWFkaW5nXG4gICAgICAgICAgICAgICAgICAgIGlmIChoZWFkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkaW5nQ2xhc3MgPSBoZWFkaW5nLmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhlYWRpbmcgY29udGFpbnMgSWNvbiBhbmQgVGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpY29uID0gaGVhZGluZy5xdWVyeVNlbGVjdG9yKCdzdmcnKSB8fCBoZWFkaW5nLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpY29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpY29uIGluc3RhbmNlb2YgU1ZHRWxlbWVudCkgaWNvbkNsYXNzID0gaWNvbi5jbGFzc05hbWUuYmFzZVZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpY29uQ2xhc3MgPSBpY29uLmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBoZWFkaW5nLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpIHx8IGhlYWRpbmcuY2hpbGRyZW5bMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRpdGxlKSBjYXRlZ29yeVRpdGxlQ2xhc3MgPSB0aXRsZS5jbGFzc05hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXRlZ29yeUNsYXNzICYmIGNhdGVnb3J5VGl0bGVDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGNhdGVnb3J5Q2xhc3MsIGNhdGVnb3J5VGl0bGVDbGFzcywgaGVhZGluZ0NsYXNzLCBpY29uQ2xhc3MgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHdhaXRGb3JTZXR0aW5nc1BhbmVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGxldCByZXRyaWVzID0gMDtcbiAgICAgICAgICAgIGNvbnN0IG1heFJldHJpZXMgPSAyMDsgLy8gMTAgc2Vjb25kc1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2V0dGluZ3NQYW5lbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0cmllcysrO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0cmllcyA+IG1heFJldHJpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIlRpbWVvdXQgd2FpdGluZyBmb3Igc2V0dGluZ3MgcGFuZWxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyAvLyByZXNvbHZlIHRvIGxldCBpdCBmYWlsIGdyYWNlZnVsbHkgaW5zaWRlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyB3YWl0Rm9yTmF2TWVudSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJldHJpZXMgPSAwO1xuICAgICAgICAgICAgY29uc3QgbWF4UmV0cmllcyA9IDIwO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0TmF2TWVudSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0cmllcysrO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0cmllcyA+IG1heFJldHJpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihcIlRpbWVvdXQgd2FpdGluZyBmb3IgbmF2IG1lbnVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5ncztcbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vZHNUYWJUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBUZW1wbGF0ZUNhY2hlLmxvYWQoX19kaXJuYW1lLCAnbW9kcy10YWInKTtcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuaW50ZXJmYWNlIE1vZE1ldGFEYXRhIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICBhdXRob3I6IHN0cmluZztcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgcHJldmlldz86IHN0cmluZztcbiAgICBkb3dubG9hZDogc3RyaW5nO1xuICAgIHJlcG86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vZEl0ZW1UZW1wbGF0ZShcbiAgICBtZXRhRGF0YTogTW9kTWV0YURhdGEsXG4gICAgdHlwZTogXCJQbHVnaW5cIiB8IFwiVGhlbWVcIiwgXG4gICAgaW5zdGFsbGVkOiBib29sZWFuXG4pOiBzdHJpbmcge1xuICAgIGxldCB0ZW1wbGF0ZSA9IFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICdtb2RzLWl0ZW0nKTtcbiAgICBcbiAgICAvLyBHZW5lcmF0ZSBsb2dvIGJsb2NrIGJhc2VkIG9uIHR5cGVcbiAgICBsZXQgbG9nb0Jsb2NrID0gXCJcIjtcblxuICAgIGlmKHR5cGUgPT09IFwiVGhlbWVcIikge1xuICAgICAgICBpZighbWV0YURhdGEucHJldmlldykge1xuICAgICAgICAgICAgLy8gSWYgbm8gcHJldmlldyBpcyBwcm92aWRlZCBmb3IgdGhlbWUsIHVzZSBhIHBsYWNlaG9sZGVyXG4gICAgICAgICAgICBsb2dvQmxvY2sgPSBgXG4gICAgICAgIDxzdmcgY2xhc3M9XCJpY29uLUd4VmJZXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk00IDNoMTZhMSAxIDAgMCAxIDEgMXY1YTEgMSAwIDAgMS0xIDFINGExIDEgMCAwIDEtMS0xVjRhMSAxIDAgMCAxIDEtMXptMiA5aDZhMSAxIDAgMCAxIDEgMXYzaDF2NmgtNHYtNmgxdi0ySDVhMSAxIDAgMCAxLTEtMXYtMmgydjF6bTExLjczMiAxLjczMmwxLjc2OC0xLjc2OCAxLjc2OCAxLjc2OGEyLjUgMi41IDAgMSAxLTMuNTM2IDB6XCIgc3R5bGU9XCJmaWxsOiBjdXJyZW50Y29sb3I7XCI+PC9wYXRoPlxuICAgICAgICA8L3N2Zz5gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVXNlIHRoZSBwcmV2aWV3IGltYWdlIGZvciB0aGVtZSBsb2dvXG4gICAgICAgICAgICBsb2dvQmxvY2sgPSBgXG4gICAgICAgICAgICA8YSBocmVmPVwiJHttZXRhRGF0YS5wcmV2aWV3fVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibG9nby1XcnNHRlwiIHNyYz1cIiR7bWV0YURhdGEucHJldmlld31cIiBhbHQ9XCJUaGVtZSBQcmV2aWV3XCIgbG9hZGluZz1cImxhenlcIj5cbiAgICAgICAgICAgIDwvYT5gO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbG9nb0Jsb2NrID0gYFxuICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvbi1HeFZiWVwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0zNDUuNjUwMDAwMDAwMDAwMSA0NTYuMzAwMDAwMDAwMDAwMmgtNzAuODdjLTIuMzUgMC4wMS00LjY5LTAuNDMtNi44Ni0xLjI5LTIuMTgtMC44Ny00LjE1LTIuMTQtNS43OS0zLjc1LTMuMzctMy4xOS01LjI3LTcuNTQtNS4yOS0xMi4wN3YtMjYuMzNjMC4wMy00LjA1LTAuODEtOC4wNy0yLjQ5LTExLjc5cy00LjEyLTcuMDctNy4xNy05Ljg5Yy03Ljc4LTcuMjItMTkuMDQtMTEuMjItMzAuOC0xMC45My0yMS4zMyAwLjQ3LTM5LjI3IDE4LjM1LTM5LjI3IDM5LjA3djE5Ljg3YzAuMDEgMi4yNC0wLjQ1IDQuNDgtMS4zNiA2LjU1cy0yLjI0IDMuOTUtMy45MyA1LjUyYy0zLjM1IDMuMjEtNy45IDUuMDItMTIuNjUgNS4wNGgtNzAuMTdjLTE0LjcxIDAuMDEtMjguODMtNS41NS0zOS4yMy0xNS40Ni0xMC40Mi05LjkxLTE2LjI4LTIzLjM2LTE2LjI5LTM3LjR2LTY2LjkyYzAuMDMtNC41MyAxLjkyLTguODcgNS4yOC0xMi4wNyAzLjM2LTMuMjEgNy45MS01LjAxIDEyLjY2LTUuMDRoMjcuNjFjOS4xNyAwIDE4LjA0LTMuNzEgMjUuMDItMTAuNDYgMy44OS0zLjcyIDYuOTgtOC4xNSA5LjA3LTEzLjAyYTM3LjIgMzcuMiAwIDAgMCAzLjA5LTE1LjRjLTAuMy0yMC4xNS0xNy42NC0zNy4xNy0zNy45OC0zNy4xN2gtMjYuNzFjLTIuMzUgMC4wMS00LjY5LTAuNDMtNi44Ny0xLjI5YTE3LjcgMTcuNyAwIDAgMS01Ljc5LTMuNzVjLTMuMzctMy4xOS01LjI2LTcuNTQtNS4yOC0xMi4wN3YtNjYuOTJhNTAuOSA1MC45IDAgMCAxIDQuMTktMjAuMjVjMi43Ni02LjQzIDYuODYtMTIuMjUgMTIuMDYtMTcuMTEgMTAuMzktOS45MSAyNC40OC0xNS40OCAzOS4xNy0xNS41aDU1LjAyYzIuMTIgMC4wMSA0LjE2LTAuNzcgNS42OC0yLjE5IDAuNzMtMC43MSAxLjMyLTEuNTUgMS43MS0yLjQ5IDAuNC0wLjkzIDAuNi0xLjkyIDAuNTgtMi45MnYtNi4xOGE1OSA1OSAwIDAgMSA1LjA4LTI0LjA1YzMuMzgtNy42MiA4LjI5LTE0LjUzIDE0LjQ2LTIwLjM1IDYuMTktNS44IDEzLjU1LTEwLjM2IDIxLjYyLTEzLjRhNjkuOCA2OS44IDAgMCAxIDI1LjMyLTQuNDdjMzUuMzggMC41NyA2NC4xOSAyOC45IDY0LjE5IDYzLjAzdjUuNDJjLTAuMDMgMS41MSAwLjQyIDMgMS4yOSA0LjI1YTcuNzMgNy43MyAwIDAgMCAzLjYxIDIuODFjMC45OCAwLjM3IDIuMDMgMC41NiAzLjA3IDAuNTRoNTUuMDJhNTYuNCA1Ni40IDAgMCAxIDIwLjkzIDMuOTljMTMuNCA1LjMxIDI0LjA0IDE1LjQ2IDI5LjYgMjguMjQgMi43NyA2LjMyIDQuMiAxMy4xMSA0LjE5IDE5Ljk2djUyLjQ3Yy0wLjAzIDEuNTIgMC40MiAzLjAxIDEuMyA0LjI2YTcuNjYgNy42NiAwIDAgMCAzLjYgMi44MWMwLjk4IDAuMzcgMi4wMyAwLjU2IDMuMDcgMC41NGg1LjY4YzM2LjQ4IDAgNjYuMDkgMjcuNTcgNjYuMDkgNjEuNDEgMCAzNC43OS0yOS4zMSA2My4xMi02NS4yOSA2My4xMmgtNi40OGMtMi4xMi0wLjAxLTQuMTUgMC43OC01LjY4IDIuMTlhNy40IDcuNCAwIDAgMC0xLjcxIDIuNDljLTAuNCAwLjkzLTAuNiAxLjkzLTAuNTggMi45M3Y1My4yM2MwLjAxIDYuODUtMS40MiAxMy42NC00LjE5IDE5Ljk2LTUuNTYgMTIuNzgtMTYuMiAyMi45My0yOS42IDI4LjI0YTU2IDU2IDAgMCAxLTIwLjkzIDMuOTlcIiBzdHlsZT1cImZpbGw6IGN1cnJlbnRjb2xvcjtcIj48L3BhdGg+XG4gICAgICAgIDwvc3ZnPmBcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIG1ldGFkYXRhIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1ldGFLZXlzID0gWyduYW1lJywgJ2Rlc2NyaXB0aW9uJywgJ2F1dGhvcicsICd2ZXJzaW9uJ10gYXMgY29uc3Q7XG4gICAgbWV0YUtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYHt7XFxcXHMqJHtrZXl9XFxcXHMqfX1gLCAnZycpO1xuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UocmVnZXgsIG1ldGFEYXRhW2tleV0gfHwgJycpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqdHlwZVxccypcXH1cXH0vZywgdHlwZSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccyphY3Rpb25idG5UaXRsZVxccypcXH1cXH0vZywgaW5zdGFsbGVkID8gXCJVbmluc3RhbGxcIiA6IFwiSW5zdGFsbFwiKVxuICAgICAgICAucmVwbGFjZShcInt7IGFjdGlvbmJ0bkNsYXNzIH19XCIsIGluc3RhbGxlZCA/IFwidW5pbnN0YWxsLWJ1dHRvbi1jb250YWluZXItb1Y0WW9cIiA6IFwiaW5zdGFsbC1idXR0b24tY29udGFpbmVyLXlmY3E1XCIpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgZG93bmxvYWQgfX1cIiwgbWV0YURhdGEuZG93bmxvYWQpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgcmVwbyB9fVwiLCBtZXRhRGF0YS5yZXBvKVxuICAgICAgICAucmVwbGFjZShcIjwhLS0gdGhlbWUgcHJldmlldyBoZXJlIC0tPlwiLCBsb2dvQmxvY2spXG4gICAgICAgIC5yZXBsYWNlKFwiPCEtLSBwbHVnaW4gaWNvbiBoZXJlIC0tPlwiLCBcIlwiKTsgXG59XG4iLCAiaW1wb3J0IFRlbXBsYXRlQ2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvdGVtcGxhdGVDYWNoZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBYm91dENhdGVnb3J5VGVtcGxhdGUoXG4gICAgdmVyc2lvbjogc3RyaW5nLCBcbiAgICBjaGVja0ZvclVwZGF0ZXNPblN0YXJ0dXA6IGJvb2xlYW4sIFxuICAgIGRpc2NvcmRSaWNoUHJlc2VuY2U6IGJvb2xlYW4sIFxuICAgIGVuYWJsZVRyYW5zcGFyZW50VGhlbWVzOiBib29sZWFuXG4pOiBzdHJpbmcge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ2Fib3V0LWNhdGVnb3J5Jyk7XG4gICAgXG4gICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIC5yZXBsYWNlKFwie3sgdmVyc2lvbiB9fVwiLCB2ZXJzaW9uKVxuICAgICAgICAucmVwbGFjZShcInt7IGNoZWNrRm9yVXBkYXRlc09uU3RhcnR1cCB9fVwiLCBjaGVja0ZvclVwZGF0ZXNPblN0YXJ0dXAgPyBcImNoZWNrZWRcIiA6IFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgZGlzY29yZHJpY2hwcmVzZW5jZSB9fVwiLCBkaXNjb3JkUmljaFByZXNlbmNlID8gXCJjaGVja2VkXCIgOiBcIlwiKVxuICAgICAgICAucmVwbGFjZShcInt7IGVuYWJsZVRyYW5zcGFyZW50VGhlbWVzIH19XCIsIGVuYWJsZVRyYW5zcGFyZW50VGhlbWVzID8gXCJjaGVja2VkXCIgOiBcIlwiKTtcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRUaGVtZVRlbXBsYXRlKGFwcGxpZWQ6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ2RlZmF1bHQtdGhlbWUnKTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgICAgICAucmVwbGFjZShcInt7IGRpc2FibGVkIH19XCIsIGFwcGxpZWQgPyBcImRpc2FibGVkXCIgOiBcIlwiKVxuICAgICAgICAucmVwbGFjZShcInt7IGxhYmVsIH19XCIsIGFwcGxpZWQgPyBcIkFwcGxpZWRcIiA6IFwiQXBwbHlcIilcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBiYWNrZ3JvdW5kQ29sb3IgfX1cIiwgYXBwbGllZCA/IFwidmFyKC0tb3ZlcmxheS1jb2xvcilcIiA6IFwidmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcilcIik7XG59XG4iLCAiaW1wb3J0IFRlbXBsYXRlQ2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvdGVtcGxhdGVDYWNoZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYWNrQnV0dG9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICdiYWNrLWJ0bicpO1xufVxuIiwgImltcG9ydCB7IFBsYXRmb3JtTWFuYWdlciB9IGZyb20gXCIuLi9wbGF0Zm9ybS9QbGF0Zm9ybU1hbmFnZXJcIjtcbmltcG9ydCB7IENhcGFjaXRvclBsYXRmb3JtIH0gZnJvbSBcIi4uL3BsYXRmb3JtL0NhcGFjaXRvclBsYXRmb3JtXCI7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSBcIi4uL2NvcmUvU2V0dGluZ3NcIjtcbmltcG9ydCBwcm9wZXJ0aWVzIGZyb20gXCIuLi9jb3JlL1Byb3BlcnRpZXNcIjtcbmltcG9ydCBNb2RNYW5hZ2VyIGZyb20gXCIuLi9jb3JlL01vZE1hbmFnZXJcIjtcbmltcG9ydCBIZWxwZXJzIGZyb20gXCIuLi91dGlscy9IZWxwZXJzXCI7XG5pbXBvcnQgeyBnZXRNb2RzVGFiVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tb2RzLXRhYi9tb2RzVGFiXCI7XG5pbXBvcnQgeyBnZXRNb2RJdGVtVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tb2RzLWl0ZW0vbW9kc0l0ZW1cIjtcbmltcG9ydCB7IGdldEFib3V0Q2F0ZWdvcnlUZW1wbGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL2Fib3V0LWNhdGVnb3J5L2Fib3V0Q2F0ZWdvcnlcIjtcbmltcG9ydCB7IGdldERlZmF1bHRUaGVtZVRlbXBsYXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvZGVmYXVsdC10aGVtZS9kZWZhdWx0VGhlbWVcIjtcbmltcG9ydCB7IGdldEJhY2tCdXR0b24gfSBmcm9tIFwiLi4vY29tcG9uZW50cy9iYWNrLWJ0bi9iYWNrQnRuXCI7XG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuLi91dGlscy9sb2dnZXJcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHtcbiAgICBTVE9SQUdFX0tFWVMsXG4gICAgU0VMRUNUT1JTLFxuICAgIENMQVNTRVMsXG4gICAgRklMRV9FWFRFTlNJT05TLFxufSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgRXh0cmFjdE1ldGFEYXRhIGZyb20gXCIuLi91dGlscy9FeHRyYWN0TWV0YURhdGFcIjtcbmltcG9ydCB7IE5vZGVKUyB9IGZyb20gJ2NhcGFjaXRvci1ub2RlanMnO1xuXG4vLyBJbml0aWFsaXplIHBsYXRmb3JtIGZvciBDYXBhY2l0b3JcblBsYXRmb3JtTWFuYWdlci5zZXRQbGF0Zm9ybShuZXcgQ2FwYWNpdG9yUGxhdGZvcm0oKSk7XG5cbi8vIExpc3RlbiBmb3Igc2VydmVyIGxvZ3MgYW5kIGVycm9yc1xuTm9kZUpTLmFkZExpc3RlbmVyKCdsb2cnLCAoZGF0YSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdbU2VydmVyXScsIC4uLmRhdGEuYXJncyk7XG59KTtcblxuTm9kZUpTLmFkZExpc3RlbmVyKCdlcnJvcicsIChkYXRhKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcignW1NlcnZlciBFcnJvcl0nLCAuLi5kYXRhLmFyZ3MpO1xuICAgIEhlbHBlcnMuc2hvd0FsZXJ0KCdlcnJvcicsICdTZXJ2ZXIgRXJyb3InLCBkYXRhLmFyZ3Muam9pbignICcpLCBbJ09LJ10pO1xufSk7XG5cbi8vIE1vY2sgaXBjUmVuZGVyZXIgZm9yIEFuZHJvaWRcbmNvbnN0IGlwY1JlbmRlcmVyID0ge1xuICAgIGludm9rZTogYXN5bmMgKGNoYW5uZWw6IHN0cmluZywgLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oYFtBbmRyb2lkXSBJbnZva2UgJHtjaGFubmVsfWAsIGFyZ3MpO1xuICAgICAgICBpZiAoY2hhbm5lbCA9PT0gJ2dldC10cmFuc3BhcmVuY3ktc3RhdHVzJykgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoY2hhbm5lbCA9PT0gJ2V4dHJhY3QtZW1iZWRkZWQtc3VidGl0bGVzJykgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHNlbmQ6IChjaGFubmVsOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKGBbQW5kcm9pZF0gU2VuZCAke2NoYW5uZWx9YCwgYXJncyk7XG4gICAgfSxcbiAgICBvbjogKGNoYW5uZWw6IHN0cmluZywgbGlzdGVuZXI6IGFueSkgPT4ge1xuICAgICAgICAvLyBOby1vcFxuICAgIH1cbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gSW5pdGlhbGl6ZSBwbGF0Zm9ybVxuICAgIGlmICghUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQpIFBsYXRmb3JtTWFuYWdlci5zZXRQbGF0Zm9ybShuZXcgQ2FwYWNpdG9yUGxhdGZvcm0oKSk7XG4gICAgYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuaW5pdCgpO1xuXG4gICAgLy8gRXhwb3NlIEFQSSBmb3IgaW5qZWN0ZWQgc2NyaXB0c1xuICAgICh3aW5kb3cgYXMgYW55KS5zdHJlbWlvRW5oYW5jZWQgPSB7XG4gICAgICAgIGFwcGx5VGhlbWU6IGFzeW5jICh0aGVtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAvLyBhcHBseVVzZXJUaGVtZSByZWFkcyBmcm9tIGxvY2FsU3RvcmFnZSB3aGljaCBpcyB1cGRhdGVkIGJ5IHRoZSBpbmplY3RlZCBzY3JpcHRcbiAgICAgICAgICAgIGF3YWl0IGFwcGx5VXNlclRoZW1lKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5pdGlhbGl6ZVVzZXJTZXR0aW5ncygpO1xuXG4gICAgLy8gQXBwbHkgZW5hYmxlZCB0aGVtZVxuICAgIGF3YWl0IGFwcGx5VXNlclRoZW1lKCk7XG5cbiAgICAvLyBMb2FkIGVuYWJsZWQgcGx1Z2luc1xuICAgIGF3YWl0IGxvYWRFbmFibGVkUGx1Z2lucygpO1xuXG4gICAgLy8gSGFuZGxlIG5hdmlnYXRpb24gY2hhbmdlc1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IGNoZWNrU2V0dGluZ3MoKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBTZXR0aW5ncyBwYWdlIG9wZW5lZFxuYXN5bmMgZnVuY3Rpb24gY2hlY2tTZXR0aW5ncygpIHtcbiAgICBpZiAoIWxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCIjL3NldHRpbmdzXCIpKSByZXR1cm47XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGFbaHJlZj1cIiNzZXR0aW5ncy1lbmhhbmNlZFwiXWApKSByZXR1cm47XG5cbiAgICBNb2RNYW5hZ2VyLmFkZEFwcGx5VGhlbWVGdW5jdGlvbigpO1xuXG4gICAgY29uc3QgdGhlbWVzUGF0aCA9IHByb3BlcnRpZXMudGhlbWVzUGF0aDtcbiAgICBjb25zdCBwbHVnaW5zUGF0aCA9IHByb3BlcnRpZXMucGx1Z2luc1BhdGg7XG5cbiAgICBsZXQgYWxsVGhlbWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBhbGxQbHVnaW5zOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgYWxsVGhlbWVzID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZGRpcih0aGVtZXNQYXRoKTtcbiAgICAgICAgYWxsUGx1Z2lucyA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRkaXIocGx1Z2luc1BhdGgpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gcmVhZCB0aGVtZXMvcGx1Z2lucyBkaXJlY3RvcmllczogXCIgKyBlKTtcbiAgICB9XG5cbiAgICBjb25zdCB0aGVtZXNMaXN0ID0gYWxsVGhlbWVzLmZpbHRlcihmaWxlTmFtZSA9PiBmaWxlTmFtZS5lbmRzV2l0aChGSUxFX0VYVEVOU0lPTlMuVEhFTUUpKTtcbiAgICBjb25zdCBwbHVnaW5zTGlzdCA9IGFsbFBsdWdpbnMuZmlsdGVyKGZpbGVOYW1lID0+IGZpbGVOYW1lLmVuZHNXaXRoKEZJTEVfRVhURU5TSU9OUy5QTFVHSU4pKTtcblxuICAgIGxvZ2dlci5pbmZvKFwiQWRkaW5nICdFbmhhbmNlZCcgc2VjdGlvbnMuLi5cIik7XG4gICAgU2V0dGluZ3MuYWRkU2VjdGlvbihcImVuaGFuY2VkXCIsIFwiRW5oYW5jZWRcIik7XG4gICAgU2V0dGluZ3MuYWRkQ2F0ZWdvcnkoXCJUaGVtZXNcIiwgXCJlbmhhbmNlZFwiLCBnZXRUaGVtZUljb24oKSk7XG4gICAgU2V0dGluZ3MuYWRkQ2F0ZWdvcnkoXCJQbHVnaW5zXCIsIFwiZW5oYW5jZWRcIiwgZ2V0UGx1Z2luSWNvbigpKTtcbiAgICBTZXR0aW5ncy5hZGRDYXRlZ29yeShcIkFib3V0XCIsIFwiZW5oYW5jZWRcIiwgZ2V0QWJvdXRJY29uKCkpO1xuXG4gICAgU2V0dGluZ3MuYWRkQnV0dG9uKFwiT3BlbiBUaGVtZXMgRm9sZGVyXCIsIFwib3BlbnRoZW1lc2ZvbGRlckJ0blwiLCBTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKTtcbiAgICBTZXR0aW5ncy5hZGRCdXR0b24oXCJPcGVuIFBsdWdpbnMgRm9sZGVyXCIsIFwib3BlbnBsdWdpbnNmb2xkZXJCdG5cIiwgU0VMRUNUT1JTLlBMVUdJTlNfQ0FURUdPUlkpO1xuXG4gICAgd3JpdGVBYm91dCgpO1xuXG4gICAgLy8gQnJvd3NlIHBsdWdpbnMvdGhlbWVzIGZyb20gc3RyZW1pby1lbmhhbmNlZC1yZWdpc3RyeVxuICAgIHNldHVwQnJvd3NlTW9kc0J1dHRvbigpO1xuXG4gICAgLy8gQWRkIHRoZW1lcyB0byBzZXR0aW5nc1xuICAgIEhlbHBlcnMud2FpdEZvckVsbShTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKS50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gRGVmYXVsdCB0aGVtZVxuICAgICAgICBjb25zdCBpc0N1cnJlbnRUaGVtZURlZmF1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSkgPT09IFwiRGVmYXVsdFwiO1xuICAgICAgICBjb25zdCBkZWZhdWx0VGhlbWVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkZWZhdWx0VGhlbWVDb250YWluZXIuaW5uZXJIVE1MID0gZ2V0RGVmYXVsdFRoZW1lVGVtcGxhdGUoaXNDdXJyZW50VGhlbWVEZWZhdWx0KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKT8uYXBwZW5kQ2hpbGQoZGVmYXVsdFRoZW1lQ29udGFpbmVyKTtcblxuICAgICAgICAvLyBBZGQgaW5zdGFsbGVkIHRoZW1lc1xuICAgICAgICBmb3IgKGNvbnN0IHRoZW1lIG9mIHRoZW1lc0xpc3QpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhlbWVQYXRoID0gam9pbih0aGVtZXNQYXRoLCB0aGVtZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRGaWxlKHRoZW1lUGF0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSBFeHRyYWN0TWV0YURhdGEuZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQoY29udGVudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAobWV0YURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFEYXRhLm5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNldHRpbmdzLmFkZEl0ZW0oXCJ0aGVtZVwiLCB0aGVtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1ldGFEYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGFEYXRhLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcjogbWV0YURhdGEuYXV0aG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb246IG1ldGFEYXRhLnZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlVXJsOiBtZXRhRGF0YS51cGRhdGVVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBtZXRhRGF0YS5zb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGxvYWQgdGhlbWUgbWV0YWRhdGEgZm9yICR7dGhlbWV9OiAke2V9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KS5jYXRjaChlcnIgPT4gbG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIHNldHVwIHRoZW1lczogXCIgKyBlcnIpKTtcblxuICAgIC8vIEFkZCBwbHVnaW5zIHRvIHNldHRpbmdzXG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgcGx1Z2luc0xpc3QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBsdWdpblBhdGggPSBqb2luKHBsdWdpbnNQYXRoLCBwbHVnaW4pO1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRGaWxlKHBsdWdpblBhdGgpO1xuICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSBFeHRyYWN0TWV0YURhdGEuZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQoY29udGVudCk7XG5cbiAgICAgICAgICAgIGlmIChtZXRhRGF0YSkge1xuICAgICAgICAgICAgICAgIFNldHRpbmdzLmFkZEl0ZW0oXCJwbHVnaW5cIiwgcGx1Z2luLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG1ldGFEYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhRGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yOiBtZXRhRGF0YS5hdXRob3IsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IG1ldGFEYXRhLnZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVVybDogbWV0YURhdGEudXBkYXRlVXJsLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IG1ldGFEYXRhLnNvdXJjZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBsb2FkIHBsdWdpbiBtZXRhZGF0YSBmb3IgJHtwbHVnaW59OiAke2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNb2RNYW5hZ2VyLnRvZ2dsZVBsdWdpbkxpc3RlbmVyKCk7XG4gICAgTW9kTWFuYWdlci5zY3JvbGxMaXN0ZW5lcigpO1xuICAgIC8vIE1vZE1hbmFnZXIub3BlblRoZW1lc0ZvbGRlcigpOyAvLyBVc2VzIHBsYXRmb3JtIG9wZW5QYXRoIHdoaWNoIGxvZ3Mgbm90IHN1cHBvcnRlZCBvbiBBbmRyb2lkXG4gICAgLy8gTW9kTWFuYWdlci5vcGVuUGx1Z2luc0ZvbGRlcigpO1xuXG4gICAgLy8gT3ZlcnJpZGUgb3BlbiBmb2xkZXIgYnV0dG9ucyB0byBkbyBzb21ldGhpbmcgZWxzZSBvciBqdXN0IGxvZz9cbiAgICAvLyBNb2RNYW5hZ2VyLm9wZW5UaGVtZXNGb2xkZXIgdXNlcyBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5vcGVuUGF0aFxuICAgIC8vIEluIENhcGFjaXRvclBsYXRmb3JtLCBpdCBqdXN0IGxvZ3MuXG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVVc2VyU2V0dGluZ3MoKTogdm9pZCB7XG4gICAgY29uc3QgZGVmYXVsdHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgIFtTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TXTogXCJbXVwiLFxuICAgICAgICBbU1RPUkFHRV9LRVlTLkNIRUNLX1VQREFURVNfT05fU1RBUlRVUF06IFwiZmFsc2VcIixcbiAgICAgICAgW1NUT1JBR0VfS0VZUy5ESVNDT1JEX1JQQ106IFwiZmFsc2VcIixcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBba2V5LCBkZWZhdWx0VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRlZmF1bHRzKSkge1xuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gYXBwbHlVc2VyVGhlbWUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY3VycmVudFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkNVUlJFTlRfVEhFTUUpO1xuXG4gICAgaWYgKCFjdXJyZW50VGhlbWUgfHwgY3VycmVudFRoZW1lID09PSBcIkRlZmF1bHRcIikge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSwgXCJEZWZhdWx0XCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGhlbWVQYXRoID0gam9pbihwcm9wZXJ0aWVzLnRoZW1lc1BhdGgsIGN1cnJlbnRUaGVtZSk7XG5cbiAgICAvLyBJbiBjYXBhY2l0b3IsIHdlIG5lZWQgdG8gcmVhZCB0aGUgZmlsZSBjb250ZW50IGFuZCBpbmplY3QgaXQgYXMgc3R5bGVcbiAgICAvLyBiZWNhdXNlIGZpbGU6Ly8gVVJMcyBtaWdodCBub3Qgd29yayBvciBhcmUgcmVzdHJpY3RlZC5cbiAgICAvLyBFbGVjdHJvbiBpbXBsZW1lbnRhdGlvbiB1c2VzIHBhdGhUb0ZpbGVVUkwgd2hpY2ggcmVzdWx0cyBpbiBmaWxlOi8vLlxuICAgIC8vIExldCdzIHRyeSB0byByZWFkIGNvbnRlbnQgYW5kIGluamVjdCA8c3R5bGU+IGluc3RlYWQgb2YgPGxpbms+LlxuXG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKCFhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5leGlzdHModGhlbWVQYXRoKSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVlTLkNVUlJFTlRfVEhFTUUsIFwiRGVmYXVsdFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBleGlzdGluZyB0aGVtZSBpZiBwcmVzZW50XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWN0aXZlVGhlbWVcIik/LnJlbW92ZSgpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5yZWFkRmlsZSh0aGVtZVBhdGgpO1xuXG4gICAgICAgIGNvbnN0IHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImFjdGl2ZVRoZW1lXCIpO1xuICAgICAgICBzdHlsZUVsZW1lbnQudGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gYXBwbHkgdGhlbWU6IFwiICsgZSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkRW5hYmxlZFBsdWdpbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGx1Z2luc1BhdGggPSBwcm9wZXJ0aWVzLnBsdWdpbnNQYXRoO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICghYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuZXhpc3RzKHBsdWdpbnNQYXRoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGFsbFBsdWdpbnMgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5yZWFkZGlyKHBsdWdpbnNQYXRoKTtcbiAgICAgICAgY29uc3QgcGx1Z2luc1RvTG9hZCA9IGFsbFBsdWdpbnMuZmlsdGVyKGZpbGVOYW1lID0+IGZpbGVOYW1lLmVuZHNXaXRoKEZJTEVfRVhURU5TSU9OUy5QTFVHSU4pKTtcblxuICAgICAgICBjb25zdCBlbmFibGVkUGx1Z2luczogc3RyaW5nW10gPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUykgfHwgXCJbXVwiXG4gICAgICAgICk7XG5cbiAgICAgICAgZm9yIChjb25zdCBwbHVnaW4gb2YgcGx1Z2luc1RvTG9hZCkge1xuICAgICAgICAgICAgaWYgKGVuYWJsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbikpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBNb2RNYW5hZ2VyLmxvYWRQbHVnaW4ocGx1Z2luKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIGxvYWQgcGx1Z2luczogXCIgKyBlKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJyb3dzZU1vZHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc2V0dGluZ3NDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuU0VUVElOR1NfQ09OVEVOVCk7XG4gICAgaWYgKCFzZXR0aW5nc0NvbnRlbnQpIHJldHVybjtcblxuICAgIHNldHRpbmdzQ29udGVudC5pbm5lckhUTUwgPSBnZXRNb2RzVGFiVGVtcGxhdGUoKTtcblxuICAgIGNvbnN0IG1vZHMgPSBhd2FpdCBNb2RNYW5hZ2VyLmZldGNoTW9kcygpO1xuICAgIGNvbnN0IG1vZHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RzLWxpc3RcIik7XG4gICAgaWYgKCFtb2RzTGlzdCkgcmV0dXJuO1xuXG4gICAgaW50ZXJmYWNlIFJlZ2lzdHJ5TW9kIHtcbiAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgICAgICBhdXRob3I6IHN0cmluZztcbiAgICAgICAgdmVyc2lvbjogc3RyaW5nO1xuICAgICAgICBwcmV2aWV3Pzogc3RyaW5nO1xuICAgICAgICBkb3dubG9hZDogc3RyaW5nO1xuICAgICAgICByZXBvOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgLy8gQWRkIHBsdWdpbnNcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiAobW9kcy5wbHVnaW5zIGFzIFJlZ2lzdHJ5TW9kW10pKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbGxlZCA9IGF3YWl0IE1vZE1hbmFnZXIuaXNQbHVnaW5JbnN0YWxsZWQoSGVscGVycy5nZXRGaWxlTmFtZUZyb21VcmwocGx1Z2luLmRvd25sb2FkKSk7XG4gICAgICAgIG1vZHNMaXN0LmlubmVySFRNTCArPSBnZXRNb2RJdGVtVGVtcGxhdGUocGx1Z2luLCBcIlBsdWdpblwiLCBpbnN0YWxsZWQpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGVtZXNcbiAgICBmb3IgKGNvbnN0IHRoZW1lIG9mIChtb2RzLnRoZW1lcyBhcyBSZWdpc3RyeU1vZFtdKSkge1xuICAgICAgICBjb25zdCBpbnN0YWxsZWQgPSBhd2FpdCBNb2RNYW5hZ2VyLmlzVGhlbWVJbnN0YWxsZWQoSGVscGVycy5nZXRGaWxlTmFtZUZyb21VcmwodGhlbWUuZG93bmxvYWQpKTtcbiAgICAgICAgbW9kc0xpc3QuaW5uZXJIVE1MICs9IGdldE1vZEl0ZW1UZW1wbGF0ZSh0aGVtZSwgXCJUaGVtZVwiLCBpbnN0YWxsZWQpO1xuICAgIH1cblxuICAgIC8vIFNldCB1cCBhY3Rpb24gYnV0dG9uc1xuICAgIGNvbnN0IGFjdGlvbkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vZEFjdGlvbkJ0blwiKTtcbiAgICBhY3Rpb25CdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBidG4uZ2V0QXR0cmlidXRlKFwiZGF0YS1saW5rXCIpO1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IGJ0bi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR5cGVcIik/LnRvTG93ZXJDYXNlKCkgYXMgXCJwbHVnaW5cIiB8IFwidGhlbWVcIjtcblxuICAgICAgICAgICAgaWYgKCFsaW5rIHx8ICF0eXBlKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChidG4uZ2V0QXR0cmlidXRlKFwidGl0bGVcIikgPT09IFwiSW5zdGFsbFwiKSB7XG4gICAgICAgICAgICAgICAgTW9kTWFuYWdlci5kb3dubG9hZE1vZChsaW5rLCB0eXBlKTtcbiAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZShDTEFTU0VTLklOU1RBTExfQlVUVE9OKTtcbiAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChDTEFTU0VTLlVOSU5TVEFMTF9CVVRUT04pO1xuICAgICAgICAgICAgICAgIGJ0bi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIlVuaW5zdGFsbFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYnRuLmNoaWxkTm9kZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYnRuLmNoaWxkTm9kZXNbMV0udGV4dENvbnRlbnQgPSBcIlVuaW5zdGFsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgTW9kTWFuYWdlci5yZW1vdmVNb2QoSGVscGVycy5nZXRGaWxlTmFtZUZyb21VcmwobGluayksIHR5cGUpO1xuICAgICAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKENMQVNTRVMuVU5JTlNUQUxMX0JVVFRPTik7XG4gICAgICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoQ0xBU1NFUy5JTlNUQUxMX0JVVFRPTik7XG4gICAgICAgICAgICAgICAgYnRuLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIFwiSW5zdGFsbFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYnRuLmNoaWxkTm9kZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYnRuLmNoaWxkTm9kZXNbMV0udGV4dENvbnRlbnQgPSBcIkluc3RhbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gU2VhcmNoIGJhciBsb2dpY1xuICAgIHNldHVwU2VhcmNoQmFyKCk7XG5cbiAgICAvLyBBZGQgYmFjayBidXR0b25cbiAgICBjb25zdCBob3Jpem9udGFsTmF2cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoU0VMRUNUT1JTLkhPUklaT05UQUxfTkFWKTtcbiAgICBjb25zdCBob3Jpem9udGFsTmF2ID0gaG9yaXpvbnRhbE5hdnNbMV07XG4gICAgaWYgKGhvcml6b250YWxOYXYpIHtcbiAgICAgICAgaG9yaXpvbnRhbE5hdi5pbm5lckhUTUwgPSBnZXRCYWNrQnV0dG9uKCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFjay1idG5cIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvJztcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSAnIy9zZXR0aW5ncyc7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXR1cFNlYXJjaEJhcigpOiB2b2lkIHtcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlNFQVJDSF9JTlBVVCkgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBjb25zdCBhZGRvbnNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5BRERPTlNfTElTVF9DT05UQUlORVIpO1xuXG4gICAgaWYgKCFzZWFyY2hJbnB1dCB8fCAhYWRkb25zQ29udGFpbmVyKSByZXR1cm47XG5cbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBzZWFyY2hJbnB1dC52YWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgbW9kSXRlbXMgPSBhZGRvbnNDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUlMuQURET05fQ09OVEFJTkVSKTtcblxuICAgICAgICBtb2RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gaXRlbS5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5OQU1FX0NPTlRBSU5FUik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpIHx8IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGl0ZW0ucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuREVTQ1JJUFRJT05fSVRFTSk/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpIHx8IFwiXCI7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gaXRlbS5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5UWVBFU19DT05UQUlORVIpPy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKSB8fCBcIlwiO1xuXG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IG5hbWUuaW5jbHVkZXMoZmlsdGVyKSB8fCBkZXNjcmlwdGlvbi5pbmNsdWRlcyhmaWx0ZXIpIHx8IHR5cGUuaW5jbHVkZXMoZmlsdGVyKTtcbiAgICAgICAgICAgIChpdGVtIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gbWF0Y2ggPyBcIlwiIDogXCJub25lXCI7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzZXR1cEJyb3dzZU1vZHNCdXR0b24oKTogdm9pZCB7XG4gICAgSGVscGVycy53YWl0Rm9yRWxtKCcjYnJvd3NlUGx1Z2luc1RoZW1lc0J0bicpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJyb3dzZVBsdWdpbnNUaGVtZXNCdG5cIik7XG4gICAgICAgIGJ0bj8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJyb3dzZU1vZHMpO1xuICAgIH0pLmNhdGNoKCgpID0+IHt9KTtcbn1cblxuZnVuY3Rpb24gd3JpdGVBYm91dCgpOiB2b2lkIHtcbiAgICBIZWxwZXJzLndhaXRGb3JFbG0oU0VMRUNUT1JTLkFCT1VUX0NBVEVHT1JZKS50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgYWJvdXRDYXRlZ29yeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLkFCT1VUX0NBVEVHT1JZKTtcbiAgICAgICAgaWYgKGFib3V0Q2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIC8vIEhhcmRjb2RlZCB2YWx1ZXMgZm9yIEFuZHJvaWRcbiAgICAgICAgICAgIGFib3V0Q2F0ZWdvcnkuaW5uZXJIVE1MICs9IGdldEFib3V0Q2F0ZWdvcnlUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICBcIkFuZHJvaWQtdjEuMC4wXCIsXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9KS5jYXRjaChlcnIgPT4gbG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIHdyaXRlIGFib3V0IHNlY3Rpb246IFwiICsgZXJyKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFib3V0SWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICA8Zz48cGF0aCBmaWxsPVwibm9uZVwiIGQ9XCJNMCAwaDI0djI0SDB6XCI+PC9wYXRoPlxuICAgICAgICA8cGF0aCBkPVwiTTEyIDIyQzYuNDc3IDIyIDIgMTcuNTIzIDIgMTJTNi40NzcgMiAxMiAyczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwem0tMS0xMXY2aDJ2LTZoLTJ6bTAtNHYyaDJWN2gtMnpcIiBzdHlsZT1cImZpbGw6Y3VycmVudGNvbG9yXCI+PC9wYXRoPjwvZz48L3N2Zz5gO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVtZUljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBjbGFzcz1cImljb25cIj5cbiAgICAgICAgPGc+PHBhdGggZmlsbD1cIm5vbmVcIiBkPVwiTTAgMGgyNHYyNEgwelwiPjwvcGF0aD5cbiAgICAgICAgPHBhdGggZD1cIk00IDNoMTZhMSAxIDAgMCAxIDEgMXY1YTEgMSAwIDAgMS0xIDFINGExIDEgMCAwIDEtMS0xVjRhMSAxIDAgMCAxIDEtMXptMiA5aDZhMSAxIDAgMCAxIDEgMXYzaDF2NmgtNHYtNmgxdi0ySDVhMSAxIDAgMCAxLTEtMXYtMmgydjF6bTExLjczMiAxLjczMmwxLjc2OC0xLjc2OCAxLjc2OCAxLjc2OGEyLjUgMi41IDAgMSAxLTMuNTM2IDB6XCIgc3R5bGU9XCJmaWxsOiBjdXJyZW50Y29sb3I7XCI+PC9wYXRoPjwvZz48L3N2Zz5gO1xufVxuXG5mdW5jdGlvbiBnZXRQbHVnaW5JY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGA8c3ZnIGljb249XCJhZGRvbnMtb3V0bGluZVwiIGNsYXNzPVwiaWNvblwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHN0eWxlPVwiZmlsbDogY3VycmVudGNvbG9yO1wiPlxuICAgICAgICA8cGF0aCBkPVwiTTQxMy43IDI0Ni4xSDM4NmMtMC41My0wLjAxLTEuMDMtMC4yMy0xLjQtMC42LTAuMzctMC4zNy0wLjU5LTAuODctMC42LTEuNHYtNzcuMmEzOC45NCAzOC45NCAwIDAgMC0xMS40LTI3LjUgMzguOTQgMzguOTQgMCAwIDAtMjcuNS0xMS40aC03Ny4yYy0wLjUzLTAuMDEtMS4wMy0wLjIzLTEuNC0wLjYtMC4zNy0wLjM3LTAuNTktMC44Ny0wLjYtMS40di0yNy43YzAtMjcuMS0yMS41LTQ5LjktNDguNi01MC4zLTYuNTctMC4xLTEzLjA5IDEuMDktMTkuMiAzLjVhNDkuNjE2IDQ5LjYxNiAwIDAgMC0xNi40IDEwLjcgNDkuODIzIDQ5LjgyMyAwIDAgMC0xMSAxNi4yIDQ4Ljg5NCA0OC44OTQgMCAwIDAtMy45IDE5LjJ2MjguNWMtMC4wMSAwLjUzLTAuMjMgMS4wMy0wLjYgMS40LTAuMzcgMC4zNy0wLjg3IDAuNTktMS40IDAuNmgtNzcuMmMtMTAuNSAwLTIwLjU3IDQuMTctMjggMTEuNmEzOS41OTQgMzkuNTk0IDAgMCAwLTExLjYgMjh2NzAuNGMwLjAxIDAuNTMgMC4yMyAxLjAzIDAuNiAxLjQgMC4zNyAwLjM3IDAuODcgMC41OSAxLjQgMC42aDI2LjljMjkuNCAwIDUzLjcgMjUuNSA1NC4xIDU0LjggMC40IDI5LjktMjMuNSA1Ny4yLTUzLjMgNTcuMkg1MGMtMC41MyAwLjAxLTEuMDMgMC4yMy0xLjQgMC42LTAuMzcgMC4zNy0wLjU5IDAuODctMC42IDEuNHY3MC40YzAgMTAuNSA0LjE3IDIwLjU3IDExLjYgMjhzMTcuNSAxMS42IDI4IDExLjZoNzAuNGMwLjUzLTAuMDEgMS4wMy0wLjIzIDEuNC0wLjYgMC4zNy0wLjM3IDAuNTktMC44NyAwLjYtMS40VjQ0MS4yYzAtMzAuMyAyNC44LTU2LjQgNTUtNTcuMSAzMC4xLTAuNyA1NyAyMC4zIDU3IDUwLjN2MjcuN2MwLjAxIDAuNTMgMC4yMyAxLjAzIDAuNiAxLjQgMC4zNyAwLjM3IDAuODcgMC41OSAxLjQgMC42aDcxLjFhMzguOTQgMzguOTQgMCAwIDAgMjcuNS0xMS40IDM4Ljk1OCAzOC45NTggMCAwIDAgMTEuNC0yNy41di03OGMwLjAxLTAuNTMgMC4yMy0xLjAzIDAuNi0xLjQgMC4zNy0wLjM3IDAuODctMC41OSAxLjQtMC42aDI4LjVjMjcuNiAwIDQ5LjUtMjIuNyA0OS41LTUwLjRzLTIzLjItNDguNy01MC4zLTQ4LjdaXCIgc3R5bGU9XCJzdHJva2U6Y3VycmVudGNvbG9yO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MzI7ZmlsbDogY3VycmVudENvbG9yO1wiPjwvcGF0aD48L3N2Zz5gO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUGx1Z2luTGlzdGVuZXJIYW5kbGUgfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuaW1wb3J0IHsgQ2FwYWNpdG9yIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBDaGFubmVsUGF5bG9hZERhdGEsIENoYW5uZWxDYWxsYmFja0RhdGEsIENoYW5uZWxMaXN0ZW5lckNhbGxiYWNrLCBTdGFydE9wdGlvbnMgfSBmcm9tICcuL2RlZmluaXRpb25zJztcbmltcG9ydCB7IENhcGFjaXRvck5vZGVKUyB9IGZyb20gJy4vaW1wbGVtZW50YXRpb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVKU0ludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIE5vZGUuanMgZW5naW5lIHdpdGggcHJvcGVydGllcyBhcyBzZXQgYnkgdGhlIGBvcHRpb25zYC5cbiAgICpcbiAgICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIG9ubHkgYXZhaWxhYmxlIGlmIHRoZSBOb2RlLmpzIGVuZ2luZSBzdGFydHVwIG1vZGUgd2FzIHNldCB0byBgJ21hbnVhbCdgIHZpYSB0aGUgcGx1Z2luIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgc3RhcnQob3B0aW9ucz86IFN0YXJ0T3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgTm9kZS5qcyBwcm9jZXNzLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHNlbmQoYXJnczogQ2hhbm5lbFBheWxvYWREYXRhKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogUmVzb2x2ZXMgd2hlbiB0aGUgTm9kZS5qcyBwcm9jZXNzIGlzIGluaXRpYWxpemVkLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHdoZW5SZWFkeSgpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIHRvIGBldmVudE5hbWVgIGFuZCBjYWxscyBgbGlzdGVuZXJGdW5jKGRhdGEpYCB3aGVuIGEgbmV3IG1lc3NhZ2UgYXJyaXZlcyBmcm9tIHRoZSBOb2RlLmpzIHByb2Nlc3MuXG4gICAqXG4gICAqICoqTm90ZToqKiBXaGVuIHVzaW5nIHRoZSBFbGVjdHJvbiBwbGF0Zm9ybSwgW2BQbHVnaW5MaXN0ZW5lckhhbmRsZS5yZW1vdmUoKWBdKCNwbHVnaW5saXN0ZW5lcmhhbmRsZSkgZG9lcyBub3Qgd29yayBkdWUgdG8gbGltaXRhdGlvbnMuXG4gICAqIFVzZSBbYHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyRnVuYylgXSgjcmVtb3ZlbGlzdGVuZXIpIGluc3RlYWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgYWRkTGlzdGVuZXIoXG4gICAgZXZlbnROYW1lOiBzdHJpbmcsXG4gICAgbGlzdGVuZXJGdW5jOiBDaGFubmVsTGlzdGVuZXJDYWxsYmFjayxcbiAgKTogUHJvbWlzZTxQbHVnaW5MaXN0ZW5lckhhbmRsZT47XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCBgbGlzdGVuZXJIYW5kbGVgIGZyb20gdGhlIGxpc3RlbmVyIGFycmF5IGZvciB0aGUgZXZlbnQgaXQgcmVmZXJzIHRvLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVySGFuZGxlOiBQbHVnaW5MaXN0ZW5lckhhbmRsZSk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycywgb3IgdGhvc2Ugb2YgdGhlIHNwZWNpZmllZCBgZXZlbnROYW1lYCwgZm9yIHRoaXMgcGx1Z2luLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlbW92ZUFsbExpc3RlbmVycyhldmVudE5hbWU/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG5jbGFzcyBOb2RlSlNQbHVnaW4gaW1wbGVtZW50cyBOb2RlSlNJbnRlcmZhY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGxpc3RlbmVyTGlzdDoge1xuICAgIGV2ZW50TmFtZTogc3RyaW5nO1xuICAgIGxpc3RlbmVySGFuZGxlOiBQcm9taXNlPFBsdWdpbkxpc3RlbmVySGFuZGxlPjtcbiAgfVtdID0gW107XG5cbiAgc3RhcnQoYXJncz86IFN0YXJ0T3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBDYXBhY2l0b3JOb2RlSlMuc3RhcnQoYXJncyk7XG4gIH1cblxuICBzZW5kKGFyZ3M6IENoYW5uZWxQYXlsb2FkRGF0YSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBDYXBhY2l0b3JOb2RlSlMuc2VuZChhcmdzKTtcbiAgfVxuXG4gIHdoZW5SZWFkeSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gQ2FwYWNpdG9yTm9kZUpTLndoZW5SZWFkeSgpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIoXG4gICAgZXZlbnROYW1lOiBzdHJpbmcsXG4gICAgbGlzdGVuZXJGdW5jOiBDaGFubmVsTGlzdGVuZXJDYWxsYmFjayxcbiAgKTogUHJvbWlzZTxQbHVnaW5MaXN0ZW5lckhhbmRsZT47XG5cbiAgYWRkTGlzdGVuZXIoXG4gICAgZXZlbnROYW1lOiBhbnksXG4gICAgbGlzdGVuZXJGdW5jOiBDaGFubmVsTGlzdGVuZXJDYWxsYmFjayxcbiAgKTogUHJvbWlzZTxQbHVnaW5MaXN0ZW5lckhhbmRsZT4ge1xuICAgIGNvbnN0IGxpc3RlbmVySGFuZGxlID0gQ2FwYWNpdG9yTm9kZUpTLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgKGRhdGE6IENoYW5uZWxDYWxsYmFja0RhdGEpID0+IHtcbiAgICAgIGxpc3RlbmVyRnVuYyhkYXRhKTtcbiAgICB9KTtcblxuICAgIHRoaXMubGlzdGVuZXJMaXN0LnB1c2goeyBldmVudE5hbWUsIGxpc3RlbmVySGFuZGxlIH0pO1xuICAgIHJldHVybiBsaXN0ZW5lckhhbmRsZTtcbiAgfVxuXG4gIGFzeW5jIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVySGFuZGxlOiBQbHVnaW5MaXN0ZW5lckhhbmRsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChDYXBhY2l0b3IuZ2V0UGxhdGZvcm0oKSA9PT0gJ2VsZWN0cm9uJykge1xuICAgICAgYXdhaXQgKENhcGFjaXRvck5vZGVKUyBhcyBhbnkpLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVySGFuZGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgbGlzdGVuZXJIYW5kbGUucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubGlzdGVuZXJMaXN0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyTGlzdFtpbmRleF07XG5cbiAgICAgIGlmIChsaXN0ZW5lckhhbmRsZSA9PT0gKGF3YWl0IGxpc3RlbmVyLmxpc3RlbmVySGFuZGxlKSkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnROYW1lPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiBbLi4udGhpcy5saXN0ZW5lckxpc3RdKSB7XG4gICAgICBpZiAoIWV2ZW50TmFtZSB8fCBldmVudE5hbWUgPT09IGxpc3RlbmVyLmV2ZW50TmFtZSkge1xuICAgICAgICBjb25zdCBsaXN0ZW5lckhhbmRsZSA9IGF3YWl0IGxpc3RlbmVyLmxpc3RlbmVySGFuZGxlO1xuICAgICAgICBhd2FpdCB0aGlzLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVySGFuZGxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgTm9kZUpTID0gbmV3IE5vZGVKU1BsdWdpbigpO1xuXG5leHBvcnQgeyBOb2RlSlMgfTtcbiIsICJpbXBvcnQgdHlwZSB7IFBsdWdpbkxpc3RlbmVySGFuZGxlIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcbmltcG9ydCB7IHJlZ2lzdGVyUGx1Z2luIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBDaGFubmVsUGF5bG9hZERhdGEsIENoYW5uZWxMaXN0ZW5lckNhbGxiYWNrLCBTdGFydE9wdGlvbnMgfSBmcm9tICcuL2RlZmluaXRpb25zJztcblxuZXhwb3J0IGludGVyZmFjZSBDYXBhY2l0b3JOb2RlSlNQbHVnaW4ge1xuICBzdGFydChhcmdzPzogU3RhcnRPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcbiAgc2VuZChhcmdzOiBDaGFubmVsUGF5bG9hZERhdGEpOiBQcm9taXNlPHZvaWQ+O1xuICB3aGVuUmVhZHkoKTogUHJvbWlzZTx2b2lkPjtcblxuICBhZGRMaXN0ZW5lcihcbiAgICBldmVudE5hbWU6IHN0cmluZyxcbiAgICBsaXN0ZW5lckZ1bmM6IENoYW5uZWxMaXN0ZW5lckNhbGxiYWNrLFxuICApOiBQcm9taXNlPFBsdWdpbkxpc3RlbmVySGFuZGxlPjtcbn1cblxuY29uc3QgQ2FwYWNpdG9yTm9kZUpTID0gcmVnaXN0ZXJQbHVnaW48Q2FwYWNpdG9yTm9kZUpTUGx1Z2luPignQ2FwYWNpdG9yTm9kZUpTJywge1xuICB3ZWI6ICgpID0+IGltcG9ydCgnLi93ZWInKS50aGVuKChtKSA9PiBuZXcgbS5DYXBhY2l0b3JOb2RlSlNXZWIoKSksXG4gIGVsZWN0cm9uOiAoKSA9PiAod2luZG93IGFzIGFueSkuQ2FwYWNpdG9yQ3VzdG9tUGxhdGZvcm0ucGx1Z2lucy5DYXBhY2l0b3JOb2RlSlMsXG59KTtcblxuZXhwb3J0IHsgQ2FwYWNpdG9yTm9kZUpTIH07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUFXLGVBa0JFLG9CQVFBLGVDekJBLGlCQTJKQSxxQkMzSkEsV0FTQSxnQkNMQSxXQ0lQLFFBT0EsUUFDTywyQkEwREEsa0JBUUEsa0JBY1Asc0JBY0EsZ0JBOEJPLGtCQXdDQSx3QkFpRkEsZUFRRixpQkEwQkEsZUFlRSxxQkFjQTs7O0FKcFViLE9BQUMsU0FBVUEsZ0JBQWU7QUFPdEIsUUFBQUEsZUFBYyxlQUFlLElBQUk7QUFRakMsUUFBQUEsZUFBYyxhQUFhLElBQUk7TUFDbkMsR0FBRyxrQkFBa0IsZ0JBQWdCLENBQUEsRUFBRztBQUNqQyxNQUFNLHFCQUFOLGNBQWlDLE1BQU07UUFDMUMsWUFBWSxTQUFTLE1BQU0sTUFBTTtBQUM3QixnQkFBTSxPQUFPO0FBQ2IsZUFBSyxVQUFVO0FBQ2YsZUFBSyxPQUFPO0FBQ1osZUFBSyxPQUFPO1FBQ3BCO01BQ0E7QUFDTyxNQUFNLGdCQUFnQixDQUFDLFFBQVE7QUFDbEMsWUFBSSxJQUFJO0FBQ1IsWUFBSSxRQUFRLFFBQVEsUUFBUSxTQUFTLFNBQVMsSUFBSSxlQUFlO0FBQzdELGlCQUFPO1FBQ2YsWUFDYyxNQUFNLEtBQUssUUFBUSxRQUFRLFFBQVEsU0FBUyxTQUFTLElBQUksWUFBWSxRQUFRLE9BQU8sU0FBUyxTQUFTLEdBQUcscUJBQXFCLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxRQUFRO0FBQ2hMLGlCQUFPO1FBQ2YsT0FDUztBQUNELGlCQUFPO1FBQ2Y7TUFDQTtBQ3BDTyxNQUFNLGtCQUFrQixDQUFDLFFBQVE7QUFDcEMsY0FBTSxvQkFBb0IsSUFBSSwyQkFBMkI7QUFDekQsY0FBTSxNQUFNLElBQUksYUFBYSxDQUFBO0FBQzdCLGNBQU0sVUFBVyxJQUFJLFVBQVUsSUFBSSxXQUFXLENBQUE7QUFDOUMsY0FBTSxjQUFjLE1BQU07QUFDdEIsaUJBQU8sc0JBQXNCLE9BQU8sa0JBQWtCLE9BQU8sY0FBYyxHQUFHO1FBQ3RGO0FBQ0ksY0FBTSxtQkFBbUIsTUFBTSxZQUFXLE1BQU87QUFDakQsY0FBTSxvQkFBb0IsQ0FBQyxlQUFlO0FBQ3RDLGdCQUFNLFNBQVMsa0JBQWtCLElBQUksVUFBVTtBQUMvQyxjQUFJLFdBQVcsUUFBUSxXQUFXLFNBQVMsU0FBUyxPQUFPLFVBQVUsSUFBSSxZQUFXLENBQUUsR0FBRztBQUVyRixtQkFBTztVQUNuQjtBQUNRLGNBQUksZ0JBQWdCLFVBQVUsR0FBRztBQUU3QixtQkFBTztVQUNuQjtBQUNRLGlCQUFPO1FBQ2Y7QUFDSSxjQUFNLGtCQUFrQixDQUFDLGVBQWU7QUFBRSxjQUFJO0FBQUksa0JBQVEsS0FBSyxJQUFJLG1CQUFtQixRQUFRLE9BQU8sU0FBUyxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLFVBQVU7UUFBRTtBQUM3SixjQUFNLGNBQWMsQ0FBQyxRQUFRLElBQUksUUFBUSxNQUFNLEdBQUc7QUFDbEQsY0FBTSxvQkFBb0Isb0JBQUksSUFBRztBQUNqQyxjQUFNQyxrQkFBaUIsQ0FBQyxZQUFZLG9CQUFvQixDQUFBLE1BQU87QUFDM0QsZ0JBQU0sbUJBQW1CLGtCQUFrQixJQUFJLFVBQVU7QUFDekQsY0FBSSxrQkFBa0I7QUFDbEIsb0JBQVEsS0FBSyxxQkFBcUIsVUFBVSxzREFBc0Q7QUFDbEcsbUJBQU8saUJBQWlCO1VBQ3BDO0FBQ1EsZ0JBQU0sV0FBVyxZQUFXO0FBQzVCLGdCQUFNLGVBQWUsZ0JBQWdCLFVBQVU7QUFDL0MsY0FBSTtBQUNKLGdCQUFNLDJCQUEyQixZQUFZO0FBQ3pDLGdCQUFJLENBQUMsb0JBQW9CLFlBQVksbUJBQW1CO0FBQ3BELGlDQUNJLE9BQU8sa0JBQWtCLFFBQVEsTUFBTSxhQUNoQyxtQkFBbUIsTUFBTSxrQkFBa0IsUUFBUSxFQUFDLElBQ3BELG1CQUFtQixrQkFBa0IsUUFBUTtZQUN4RSxXQUNxQixzQkFBc0IsUUFBUSxDQUFDLG9CQUFvQixTQUFTLG1CQUFtQjtBQUNwRixpQ0FDSSxPQUFPLGtCQUFrQixLQUFLLE1BQU0sYUFDN0IsbUJBQW1CLE1BQU0sa0JBQWtCLEtBQUssRUFBQyxJQUNqRCxtQkFBbUIsa0JBQWtCLEtBQUs7WUFDckU7QUFDWSxtQkFBTztVQUNuQjtBQUNRLGdCQUFNLHFCQUFxQixDQUFDLE1BQU0sU0FBUztBQUN2QyxnQkFBSSxJQUFJO0FBQ1IsZ0JBQUksY0FBYztBQUNkLG9CQUFNLGVBQWUsaUJBQWlCLFFBQVEsaUJBQWlCLFNBQVMsU0FBUyxhQUFhLFFBQVEsS0FBSyxDQUFDLE1BQU0sU0FBUyxFQUFFLElBQUk7QUFDakksa0JBQUksY0FBYztBQUNkLG9CQUFJLGFBQWEsVUFBVSxXQUFXO0FBQ2xDLHlCQUFPLENBQUMsWUFBWSxJQUFJLGNBQWMsWUFBWSxLQUFLLFNBQVEsR0FBSSxPQUFPO2dCQUNsRyxPQUN5QjtBQUNELHlCQUFPLENBQUMsU0FBUyxhQUFhLElBQUksZUFBZSxZQUFZLEtBQUssU0FBUSxHQUFJLFNBQVMsUUFBUTtnQkFDdkg7Y0FDQSxXQUN5QixNQUFNO0FBQ1gsd0JBQVEsS0FBSyxLQUFLLElBQUksT0FBTyxRQUFRLE9BQU8sU0FBUyxTQUFTLEdBQUcsS0FBSyxJQUFJO2NBQzlGO1lBQ0EsV0FDcUIsTUFBTTtBQUNYLHNCQUFRLEtBQUssS0FBSyxJQUFJLE9BQU8sUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHLEtBQUssSUFBSTtZQUMxRixPQUNpQjtBQUNELG9CQUFNLElBQUksbUJBQW1CLElBQUksVUFBVSxrQ0FBa0MsUUFBUSxJQUFJLGNBQWMsYUFBYTtZQUNwSTtVQUNBO0FBQ1EsZ0JBQU0sNEJBQTRCLENBQUMsU0FBUztBQUN4QyxnQkFBSTtBQUNKLGtCQUFNLFVBQVUsSUFBSSxTQUFTO0FBQ3pCLG9CQUFNLElBQUkseUJBQXdCLEVBQUcsS0FBSyxDQUFDLFNBQVM7QUFDaEQsc0JBQU0sS0FBSyxtQkFBbUIsTUFBTSxJQUFJO0FBQ3hDLG9CQUFJLElBQUk7QUFDSix3QkFBTUMsS0FBSSxHQUFHLEdBQUcsSUFBSTtBQUNwQiwyQkFBU0EsT0FBTSxRQUFRQSxPQUFNLFNBQVMsU0FBU0EsR0FBRTtBQUNqRCx5QkFBT0E7Z0JBQy9CLE9BQ3lCO0FBQ0Qsd0JBQU0sSUFBSSxtQkFBbUIsSUFBSSxVQUFVLElBQUksSUFBSSw2QkFBNkIsUUFBUSxJQUFJLGNBQWMsYUFBYTtnQkFDL0k7Y0FDQSxDQUFpQjtBQUNELGtCQUFJLFNBQVMsZUFBZTtBQUN4QixrQkFBRSxTQUFTLFlBQVksT0FBTTtjQUNqRDtBQUNnQixxQkFBTztZQUN2QjtBQUVZLG9CQUFRLFdBQVcsTUFBTSxHQUFHLEtBQUssU0FBUSxDQUFFO0FBQzNDLG1CQUFPLGVBQWUsU0FBUyxRQUFRO2NBQ25DLE9BQU87Y0FDUCxVQUFVO2NBQ1YsY0FBYztZQUM5QixDQUFhO0FBQ0QsbUJBQU87VUFDbkI7QUFDUSxnQkFBTSxjQUFjLDBCQUEwQixhQUFhO0FBQzNELGdCQUFNLGlCQUFpQiwwQkFBMEIsZ0JBQWdCO0FBQ2pFLGdCQUFNLG9CQUFvQixDQUFDLFdBQVcsYUFBYTtBQUMvQyxrQkFBTSxPQUFPLFlBQVksRUFBRSxVQUFTLEdBQUksUUFBUTtBQUNoRCxrQkFBTSxTQUFTLFlBQVk7QUFDdkIsb0JBQU0sYUFBYSxNQUFNO0FBQ3pCLDZCQUFlO2dCQUNYO2dCQUNBO2NBQ3BCLEdBQW1CLFFBQVE7WUFDM0I7QUFDWSxrQkFBTSxJQUFJLElBQUksUUFBUSxDQUFDQyxhQUFZLEtBQUssS0FBSyxNQUFNQSxTQUFRLEVBQUUsT0FBTSxDQUFFLENBQUMsQ0FBQztBQUN2RSxjQUFFLFNBQVMsWUFBWTtBQUNuQixzQkFBUSxLQUFLLG9EQUFvRDtBQUNqRSxvQkFBTSxPQUFNO1lBQzVCO0FBQ1ksbUJBQU87VUFDbkI7QUFDUSxnQkFBTSxRQUFRLElBQUksTUFBTSxDQUFBLEdBQUk7WUFDeEIsSUFBSSxHQUFHLE1BQU07QUFDVCxzQkFBUSxNQUFJOztnQkFFUixLQUFLO0FBQ0QseUJBQU87Z0JBQ1gsS0FBSztBQUNELHlCQUFPLE9BQU8sQ0FBQTtnQkFDbEIsS0FBSztBQUNELHlCQUFPLGVBQWUsb0JBQW9CO2dCQUM5QyxLQUFLO0FBQ0QseUJBQU87Z0JBQ1g7QUFDSSx5QkFBTywwQkFBMEIsSUFBSTtjQUM3RDtZQUNBO1VBQ0EsQ0FBUztBQUNELGtCQUFRLFVBQVUsSUFBSTtBQUN0Qiw0QkFBa0IsSUFBSSxZQUFZO1lBQzlCLE1BQU07WUFDTjtZQUNBLFdBQVcsb0JBQUksSUFBSSxDQUFDLEdBQUcsT0FBTyxLQUFLLGlCQUFpQixHQUFHLEdBQUksZUFBZSxDQUFDLFFBQVEsSUFBSSxDQUFBLENBQUcsQ0FBQztVQUN2RyxDQUFTO0FBQ0QsaUJBQU87UUFDZjtBQUVJLFlBQUksQ0FBQyxJQUFJLGdCQUFnQjtBQUNyQixjQUFJLGlCQUFpQixDQUFDLGFBQWE7UUFDM0M7QUFDSSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxjQUFjO0FBQ2xCLFlBQUksbUJBQW1CO0FBQ3ZCLFlBQUksb0JBQW9CO0FBQ3hCLFlBQUksaUJBQWlCRjtBQUNyQixZQUFJLFlBQVk7QUFDaEIsWUFBSSxRQUFRLENBQUMsQ0FBQyxJQUFJO0FBQ2xCLFlBQUksbUJBQW1CLENBQUMsQ0FBQyxJQUFJO0FBQzdCLGVBQU87TUFDWDtBQUNPLE1BQU0sc0JBQXNCLENBQUMsUUFBUyxJQUFJLFlBQVksZ0JBQWdCLEdBQUc7QUMzSnBFLE1BQUMsWUFBMEIsb0NBQW9CLE9BQU8sZUFBZSxjQUMzRSxhQUNBLE9BQU8sU0FBUyxjQUNaLE9BQ0EsT0FBTyxXQUFXLGNBQ2QsU0FDQSxPQUFPLFdBQVcsY0FDZCxTQUNBLENBQUEsQ0FBRTtBQUNSLE1BQUMsaUJBQWlCLFVBQVU7QUNMakMsTUFBTSxZQUFOLE1BQWdCO1FBQ25CLGNBQWM7QUFDVixlQUFLLFlBQVksQ0FBQTtBQUNqQixlQUFLLHlCQUF5QixDQUFBO0FBQzlCLGVBQUssa0JBQWtCLENBQUE7UUFDL0I7UUFDSSxZQUFZLFdBQVcsY0FBYztBQUNqQyxjQUFJLGdCQUFnQjtBQUNwQixnQkFBTSxZQUFZLEtBQUssVUFBVSxTQUFTO0FBQzFDLGNBQUksQ0FBQyxXQUFXO0FBQ1osaUJBQUssVUFBVSxTQUFTLElBQUksQ0FBQTtBQUM1Qiw0QkFBZ0I7VUFDNUI7QUFDUSxlQUFLLFVBQVUsU0FBUyxFQUFFLEtBQUssWUFBWTtBQUczQyxnQkFBTSxpQkFBaUIsS0FBSyxnQkFBZ0IsU0FBUztBQUNyRCxjQUFJLGtCQUFrQixDQUFDLGVBQWUsWUFBWTtBQUM5QyxpQkFBSyxrQkFBa0IsY0FBYztVQUNqRDtBQUNRLGNBQUksZUFBZTtBQUNmLGlCQUFLLDhCQUE4QixTQUFTO1VBQ3hEO0FBQ1EsZ0JBQU0sU0FBUyxZQUFZLEtBQUssZUFBZSxXQUFXLFlBQVk7QUFDdEUsZ0JBQU0sSUFBSSxRQUFRLFFBQVEsRUFBRSxPQUFNLENBQUU7QUFDcEMsaUJBQU87UUFDZjtRQUNJLE1BQU0scUJBQXFCO0FBQ3ZCLGVBQUssWUFBWSxDQUFBO0FBQ2pCLHFCQUFXLFlBQVksS0FBSyxpQkFBaUI7QUFDekMsaUJBQUsscUJBQXFCLEtBQUssZ0JBQWdCLFFBQVEsQ0FBQztVQUNwRTtBQUNRLGVBQUssa0JBQWtCLENBQUE7UUFDL0I7UUFDSSxnQkFBZ0IsV0FBVyxNQUFNLHFCQUFxQjtBQUNsRCxnQkFBTSxZQUFZLEtBQUssVUFBVSxTQUFTO0FBQzFDLGNBQUksQ0FBQyxXQUFXO0FBQ1osZ0JBQUkscUJBQXFCO0FBQ3JCLGtCQUFJLE9BQU8sS0FBSyx1QkFBdUIsU0FBUztBQUNoRCxrQkFBSSxDQUFDLE1BQU07QUFDUCx1QkFBTyxDQUFBO2NBQzNCO0FBQ2dCLG1CQUFLLEtBQUssSUFBSTtBQUNkLG1CQUFLLHVCQUF1QixTQUFTLElBQUk7WUFDekQ7QUFDWTtVQUNaO0FBQ1Esb0JBQVUsUUFBUSxDQUFDLGFBQWEsU0FBUyxJQUFJLENBQUM7UUFDdEQ7UUFDSSxhQUFhLFdBQVc7QUFDcEIsY0FBSTtBQUNKLGlCQUFPLENBQUMsR0FBRyxLQUFLLEtBQUssVUFBVSxTQUFTLE9BQU8sUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHO1FBQzNGO1FBQ0ksdUJBQXVCLGlCQUFpQixpQkFBaUI7QUFDckQsZUFBSyxnQkFBZ0IsZUFBZSxJQUFJO1lBQ3BDLFlBQVk7WUFDWjtZQUNBO1lBQ0EsU0FBUyxDQUFDLFVBQVU7QUFDaEIsbUJBQUssZ0JBQWdCLGlCQUFpQixLQUFLO1lBQzNEO1VBQ0E7UUFDQTtRQUNJLGNBQWMsTUFBTSxtQkFBbUI7QUFDbkMsaUJBQU8sSUFBSSxVQUFVLFVBQVUsS0FBSyxjQUFjLGFBQWE7UUFDdkU7UUFDSSxZQUFZLE1BQU0saUJBQWlCO0FBQy9CLGlCQUFPLElBQUksVUFBVSxVQUFVLEtBQUssY0FBYyxXQUFXO1FBQ3JFO1FBQ0ksTUFBTSxlQUFlLFdBQVcsY0FBYztBQUMxQyxnQkFBTSxZQUFZLEtBQUssVUFBVSxTQUFTO0FBQzFDLGNBQUksQ0FBQyxXQUFXO0FBQ1o7VUFDWjtBQUNRLGdCQUFNLFFBQVEsVUFBVSxRQUFRLFlBQVk7QUFDNUMsZUFBSyxVQUFVLFNBQVMsRUFBRSxPQUFPLE9BQU8sQ0FBQztBQUd6QyxjQUFJLENBQUMsS0FBSyxVQUFVLFNBQVMsRUFBRSxRQUFRO0FBQ25DLGlCQUFLLHFCQUFxQixLQUFLLGdCQUFnQixTQUFTLENBQUM7VUFDckU7UUFDQTtRQUNJLGtCQUFrQixRQUFRO0FBQ3RCLGlCQUFPLGlCQUFpQixPQUFPLGlCQUFpQixPQUFPLE9BQU87QUFDOUQsaUJBQU8sYUFBYTtRQUM1QjtRQUNJLHFCQUFxQixRQUFRO0FBQ3pCLGNBQUksQ0FBQyxRQUFRO0FBQ1Q7VUFDWjtBQUNRLGlCQUFPLG9CQUFvQixPQUFPLGlCQUFpQixPQUFPLE9BQU87QUFDakUsaUJBQU8sYUFBYTtRQUM1QjtRQUNJLDhCQUE4QixXQUFXO0FBQ3JDLGdCQUFNLE9BQU8sS0FBSyx1QkFBdUIsU0FBUztBQUNsRCxjQUFJLENBQUMsTUFBTTtBQUNQO1VBQ1o7QUFDUSxpQkFBTyxLQUFLLHVCQUF1QixTQUFTO0FBQzVDLGVBQUssUUFBUSxDQUFDLFFBQVE7QUFDbEIsaUJBQUssZ0JBQWdCLFdBQVcsR0FBRztVQUMvQyxDQUFTO1FBQ1Q7TUFDQTtBQ25HQSxNQUFNLFNBQVMsQ0FBQyxRQUFRLG1CQUFtQixHQUFHLEVBQ3pDLFFBQVEsd0JBQXdCLGtCQUFrQixFQUNsRCxRQUFRLFNBQVMsTUFBTTtBQUs1QixNQUFNLFNBQVMsQ0FBQyxRQUFRLElBQUksUUFBUSxvQkFBb0Isa0JBQWtCO0FBQ25FLE1BQU0sNEJBQU4sY0FBd0MsVUFBVTtRQUNyRCxNQUFNLGFBQWE7QUFDZixnQkFBTSxVQUFVLFNBQVM7QUFDekIsZ0JBQU0sWUFBWSxDQUFBO0FBQ2xCLGtCQUFRLE1BQU0sR0FBRyxFQUFFLFFBQVEsQ0FBQyxXQUFXO0FBQ25DLGdCQUFJLE9BQU8sVUFBVTtBQUNqQjtBQUVKLGdCQUFJLENBQUMsS0FBSyxLQUFLLElBQUksT0FBTyxRQUFRLEtBQUssWUFBWSxFQUFFLE1BQU0sWUFBWTtBQUN2RSxrQkFBTSxPQUFPLEdBQUcsRUFBRSxLQUFJO0FBQ3RCLG9CQUFRLE9BQU8sS0FBSyxFQUFFLEtBQUk7QUFDMUIsc0JBQVUsR0FBRyxJQUFJO1VBQzdCLENBQVM7QUFDRCxpQkFBTztRQUNmO1FBQ0ksTUFBTSxVQUFVLFNBQVM7QUFDckIsY0FBSTtBQUVBLGtCQUFNLGFBQWEsT0FBTyxRQUFRLEdBQUc7QUFDckMsa0JBQU0sZUFBZSxPQUFPLFFBQVEsS0FBSztBQUV6QyxrQkFBTSxVQUFVLGNBQWMsUUFBUSxXQUFXLElBQUksUUFBUSxZQUFZLEVBQUUsQ0FBQztBQUM1RSxrQkFBTSxRQUFRLFFBQVEsUUFBUSxLQUFLLFFBQVEsU0FBUyxFQUFFO0FBQ3RELGtCQUFNLFNBQVMsUUFBUSxPQUFPLFFBQVEsUUFBUSxJQUFJLFNBQVMsSUFBSSxVQUFVLFFBQVEsR0FBRyxLQUFLO0FBQ3pGLHFCQUFTLFNBQVMsR0FBRyxVQUFVLElBQUksZ0JBQWdCLEVBQUUsR0FBRyxPQUFPLFVBQVUsSUFBSSxLQUFLLE1BQU07VUFDcEcsU0FDZSxPQUFPO0FBQ1YsbUJBQU8sUUFBUSxPQUFPLEtBQUs7VUFDdkM7UUFDQTtRQUNJLE1BQU0sYUFBYSxTQUFTO0FBQ3hCLGNBQUk7QUFDQSxxQkFBUyxTQUFTLEdBQUcsUUFBUSxHQUFHO1VBQzVDLFNBQ2UsT0FBTztBQUNWLG1CQUFPLFFBQVEsT0FBTyxLQUFLO1VBQ3ZDO1FBQ0E7UUFDSSxNQUFNLGVBQWU7QUFDakIsY0FBSTtBQUNBLGtCQUFNLFVBQVUsU0FBUyxPQUFPLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDOUMsdUJBQVcsVUFBVSxTQUFTO0FBQzFCLHVCQUFTLFNBQVMsT0FBTyxRQUFRLE9BQU8sRUFBRSxFQUFFLFFBQVEsT0FBTyxjQUFhLG9CQUFJLEtBQUksR0FBRyxZQUFXLENBQUUsU0FBUztZQUN6SDtVQUNBLFNBQ2UsT0FBTztBQUNWLG1CQUFPLFFBQVEsT0FBTyxLQUFLO1VBQ3ZDO1FBQ0E7UUFDSSxNQUFNLGtCQUFrQjtBQUNwQixjQUFJO0FBQ0Esa0JBQU0sS0FBSyxhQUFZO1VBQ25DLFNBQ2UsT0FBTztBQUNWLG1CQUFPLFFBQVEsT0FBTyxLQUFLO1VBQ3ZDO1FBQ0E7TUFDQTtBQUNZLE1BQUMsbUJBQW1CLGVBQWUsb0JBQW9CO1FBQy9ELEtBQUssTUFBTSxJQUFJLDBCQUF5QjtNQUM1QyxDQUFDO0FBTU0sTUFBTSxtQkFBbUIsT0FBTyxTQUFTLElBQUksUUFBUSxDQUFDRSxVQUFTLFdBQVc7QUFDN0UsY0FBTSxTQUFTLElBQUksV0FBVTtBQUM3QixlQUFPLFNBQVMsTUFBTTtBQUNsQixnQkFBTSxlQUFlLE9BQU87QUFFNUIsVUFBQUEsU0FBUSxhQUFhLFFBQVEsR0FBRyxLQUFLLElBQUksYUFBYSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksWUFBWTtRQUMxRjtBQUNJLGVBQU8sVUFBVSxDQUFDLFVBQVUsT0FBTyxLQUFLO0FBQ3hDLGVBQU8sY0FBYyxJQUFJO01BQzdCLENBQUM7QUFLRCxNQUFNLHVCQUF1QixDQUFDLFVBQVUsQ0FBQSxNQUFPO0FBQzNDLGNBQU0sZUFBZSxPQUFPLEtBQUssT0FBTztBQUN4QyxjQUFNLGNBQWMsT0FBTyxLQUFLLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLGtCQUFpQixDQUFFO0FBQ3pFLGNBQU0sYUFBYSxZQUFZLE9BQU8sQ0FBQyxLQUFLLEtBQUssVUFBVTtBQUN2RCxjQUFJLEdBQUcsSUFBSSxRQUFRLGFBQWEsS0FBSyxDQUFDO0FBQ3RDLGlCQUFPO1FBQ2YsR0FBTyxDQUFBLENBQUU7QUFDTCxlQUFPO01BQ1g7QUFNQSxNQUFNLGlCQUFpQixDQUFDLFFBQVEsZUFBZSxTQUFTO0FBQ3BELFlBQUksQ0FBQztBQUNELGlCQUFPO0FBQ1gsY0FBTSxTQUFTLE9BQU8sUUFBUSxNQUFNLEVBQUUsT0FBTyxDQUFDLGFBQWEsVUFBVTtBQUNqRSxnQkFBTSxDQUFDLEtBQUssS0FBSyxJQUFJO0FBQ3JCLGNBQUk7QUFDSixjQUFJO0FBQ0osY0FBSSxNQUFNLFFBQVEsS0FBSyxHQUFHO0FBQ3RCLG1CQUFPO0FBQ1Asa0JBQU0sUUFBUSxDQUFDLFFBQVE7QUFDbkIsNkJBQWUsZUFBZSxtQkFBbUIsR0FBRyxJQUFJO0FBQ3hELHNCQUFRLEdBQUcsR0FBRyxJQUFJLFlBQVk7WUFDOUMsQ0FBYTtBQUVELGlCQUFLLE1BQU0sR0FBRyxFQUFFO1VBQzVCLE9BQ2E7QUFDRCwyQkFBZSxlQUFlLG1CQUFtQixLQUFLLElBQUk7QUFDMUQsbUJBQU8sR0FBRyxHQUFHLElBQUksWUFBWTtVQUN6QztBQUNRLGlCQUFPLEdBQUcsV0FBVyxJQUFJLElBQUk7UUFDckMsR0FBTyxFQUFFO0FBRUwsZUFBTyxPQUFPLE9BQU8sQ0FBQztNQUMxQjtBQU1ZLE1BQUMsbUJBQW1CLENBQUMsU0FBUyxRQUFRLENBQUEsTUFBTztBQUNyRCxjQUFNLFNBQVMsT0FBTyxPQUFPLEVBQUUsUUFBUSxRQUFRLFVBQVUsT0FBTyxTQUFTLFFBQVEsUUFBTyxHQUFJLEtBQUs7QUFFakcsY0FBTSxVQUFVLHFCQUFxQixRQUFRLE9BQU87QUFDcEQsY0FBTSxPQUFPLFFBQVEsY0FBYyxLQUFLO0FBRXhDLFlBQUksT0FBTyxRQUFRLFNBQVMsVUFBVTtBQUNsQyxpQkFBTyxPQUFPLFFBQVE7UUFDOUIsV0FFYSxLQUFLLFNBQVMsbUNBQW1DLEdBQUc7QUFDekQsZ0JBQU0sU0FBUyxJQUFJLGdCQUFlO0FBQ2xDLHFCQUFXLENBQUMsS0FBSyxLQUFLLEtBQUssT0FBTyxRQUFRLFFBQVEsUUFBUSxDQUFBLENBQUUsR0FBRztBQUMzRCxtQkFBTyxJQUFJLEtBQUssS0FBSztVQUNqQztBQUNRLGlCQUFPLE9BQU8sT0FBTyxTQUFRO1FBQ3JDLFdBQ2EsS0FBSyxTQUFTLHFCQUFxQixLQUFLLFFBQVEsZ0JBQWdCLFVBQVU7QUFDL0UsZ0JBQU0sT0FBTyxJQUFJLFNBQVE7QUFDekIsY0FBSSxRQUFRLGdCQUFnQixVQUFVO0FBQ2xDLG9CQUFRLEtBQUssUUFBUSxDQUFDLE9BQU8sUUFBUTtBQUNqQyxtQkFBSyxPQUFPLEtBQUssS0FBSztZQUN0QyxDQUFhO1VBQ2IsT0FDYTtBQUNELHVCQUFXLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxHQUFHO0FBQ3pDLG1CQUFLLE9BQU8sS0FBSyxRQUFRLEtBQUssR0FBRyxDQUFDO1lBQ2xEO1VBQ0E7QUFDUSxpQkFBTyxPQUFPO0FBQ2QsZ0JBQU1DLFdBQVUsSUFBSSxRQUFRLE9BQU8sT0FBTztBQUMxQyxVQUFBQSxTQUFRLE9BQU8sY0FBYztBQUM3QixpQkFBTyxVQUFVQTtRQUN6QixXQUNhLEtBQUssU0FBUyxrQkFBa0IsS0FBSyxPQUFPLFFBQVEsU0FBUyxVQUFVO0FBQzVFLGlCQUFPLE9BQU8sS0FBSyxVQUFVLFFBQVEsSUFBSTtRQUNqRDtBQUNJLGVBQU87TUFDWDtBQUVPLE1BQU0seUJBQU4sY0FBcUMsVUFBVTs7Ozs7UUFLbEQsTUFBTSxRQUFRLFNBQVM7QUFDbkIsZ0JBQU0sY0FBYyxpQkFBaUIsU0FBUyxRQUFRLGFBQWE7QUFDbkUsZ0JBQU0sWUFBWSxlQUFlLFFBQVEsUUFBUSxRQUFRLHFCQUFxQjtBQUM5RSxnQkFBTSxNQUFNLFlBQVksR0FBRyxRQUFRLEdBQUcsSUFBSSxTQUFTLEtBQUssUUFBUTtBQUNoRSxnQkFBTSxXQUFXLE1BQU0sTUFBTSxLQUFLLFdBQVc7QUFDN0MsZ0JBQU0sY0FBYyxTQUFTLFFBQVEsSUFBSSxjQUFjLEtBQUs7QUFFNUQsY0FBSSxFQUFFLGVBQWUsT0FBTSxJQUFLLFNBQVMsS0FBSyxVQUFVLENBQUE7QUFFeEQsY0FBSSxZQUFZLFNBQVMsa0JBQWtCLEdBQUc7QUFDMUMsMkJBQWU7VUFDM0I7QUFDUSxjQUFJO0FBQ0osY0FBSTtBQUNKLGtCQUFRLGNBQVk7WUFDaEIsS0FBSztZQUNMLEtBQUs7QUFDRCxxQkFBTyxNQUFNLFNBQVMsS0FBSTtBQUMxQixxQkFBTyxNQUFNLGlCQUFpQixJQUFJO0FBQ2xDO1lBQ0osS0FBSztBQUNELHFCQUFPLE1BQU0sU0FBUyxLQUFJO0FBQzFCO1lBQ0osS0FBSztZQUNMLEtBQUs7WUFDTDtBQUNJLHFCQUFPLE1BQU0sU0FBUyxLQUFJO1VBQzFDO0FBRVEsZ0JBQU0sVUFBVSxDQUFBO0FBQ2hCLG1CQUFTLFFBQVEsUUFBUSxDQUFDLE9BQU8sUUFBUTtBQUNyQyxvQkFBUSxHQUFHLElBQUk7VUFDM0IsQ0FBUztBQUNELGlCQUFPO1lBQ0g7WUFDQTtZQUNBLFFBQVEsU0FBUztZQUNqQixLQUFLLFNBQVM7VUFDMUI7UUFDQTs7Ozs7UUFLSSxNQUFNLElBQUksU0FBUztBQUNmLGlCQUFPLEtBQUssUUFBUSxPQUFPLE9BQU8sT0FBTyxPQUFPLENBQUEsR0FBSSxPQUFPLEdBQUcsRUFBRSxRQUFRLE1BQUssQ0FBRSxDQUFDO1FBQ3hGOzs7OztRQUtJLE1BQU0sS0FBSyxTQUFTO0FBQ2hCLGlCQUFPLEtBQUssUUFBUSxPQUFPLE9BQU8sT0FBTyxPQUFPLENBQUEsR0FBSSxPQUFPLEdBQUcsRUFBRSxRQUFRLE9BQU0sQ0FBRSxDQUFDO1FBQ3pGOzs7OztRQUtJLE1BQU0sSUFBSSxTQUFTO0FBQ2YsaUJBQU8sS0FBSyxRQUFRLE9BQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQSxHQUFJLE9BQU8sR0FBRyxFQUFFLFFBQVEsTUFBSyxDQUFFLENBQUM7UUFDeEY7Ozs7O1FBS0ksTUFBTSxNQUFNLFNBQVM7QUFDakIsaUJBQU8sS0FBSyxRQUFRLE9BQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQSxHQUFJLE9BQU8sR0FBRyxFQUFFLFFBQVEsUUFBTyxDQUFFLENBQUM7UUFDMUY7Ozs7O1FBS0ksTUFBTSxPQUFPLFNBQVM7QUFDbEIsaUJBQU8sS0FBSyxRQUFRLE9BQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQSxHQUFJLE9BQU8sR0FBRyxFQUFFLFFBQVEsU0FBUSxDQUFFLENBQUM7UUFDM0Y7TUFDQTtBQUNZLE1BQUMsZ0JBQWdCLGVBQWUsaUJBQWlCO1FBQ3pELEtBQUssTUFBTSxJQUFJLHVCQUFzQjtNQUN6QyxDQUFDO0FBT0QsT0FBQyxTQUFVQyxrQkFBaUI7QUFNeEIsUUFBQUEsaUJBQWdCLE1BQU0sSUFBSTtBQU0xQixRQUFBQSxpQkFBZ0IsT0FBTyxJQUFJO0FBUTNCLFFBQUFBLGlCQUFnQixTQUFTLElBQUk7TUFDakMsR0FBRyxvQkFBb0Isa0JBQWtCLENBQUEsRUFBRztBQUs1QyxPQUFDLFNBQVVDLGdCQUFlO0FBTXRCLFFBQUFBLGVBQWMsV0FBVyxJQUFJO0FBTTdCLFFBQUFBLGVBQWMsZUFBZSxJQUFJO01BQ3JDLEdBQUcsa0JBQWtCLGdCQUFnQixDQUFBLEVBQUc7QUFDakMsTUFBTSxzQkFBTixjQUFrQyxVQUFVO1FBQy9DLE1BQU0sV0FBVztBQUNiLGVBQUssWUFBWSx1QkFBdUI7UUFDaEQ7UUFDSSxNQUFNLGVBQWU7QUFDakIsZUFBSyxZQUFZLHVCQUF1QjtRQUNoRDtRQUNJLE1BQU0sT0FBTztBQUNULGVBQUssWUFBWSx1QkFBdUI7UUFDaEQ7UUFDSSxNQUFNLE9BQU87QUFDVCxlQUFLLFlBQVksdUJBQXVCO1FBQ2hEO01BQ0E7QUFDWSxNQUFDLGFBQWEsZUFBZSxjQUFjO1FBQ25ELEtBQUssTUFBTSxJQUFJLG9CQUFtQjtNQUN0QyxDQUFDOzs7OztBQy9URCxNQUFZLFdBZ0dBO0FBaEdaOztBQUFBLE9BQUEsU0FBWUMsWUFBUztBQWFuQixRQUFBQSxXQUFBLFdBQUEsSUFBQTtBQVVBLFFBQUFBLFdBQUEsTUFBQSxJQUFBO0FBVUEsUUFBQUEsV0FBQSxTQUFBLElBQUE7QUFTQSxRQUFBQSxXQUFBLE9BQUEsSUFBQTtBQWFBLFFBQUFBLFdBQUEsVUFBQSxJQUFBO0FBY0EsUUFBQUEsV0FBQSxpQkFBQSxJQUFBO0FBUUEsUUFBQUEsV0FBQSxlQUFBLElBQUE7QUFRQSxRQUFBQSxXQUFBLGdCQUFBLElBQUE7QUFRQSxRQUFBQSxXQUFBLFdBQUEsSUFBQTtNQUNGLEdBOUZZLGNBQUEsWUFBUyxDQUFBLEVBQUE7QUFnR3JCLE9BQUEsU0FBWUMsV0FBUTtBQU1sQixRQUFBQSxVQUFBLE1BQUEsSUFBQTtBQVNBLFFBQUFBLFVBQUEsT0FBQSxJQUFBO0FBU0EsUUFBQUEsVUFBQSxPQUFBLElBQUE7TUFDRixHQXpCWSxhQUFBLFdBQVEsQ0FBQSxFQUFBOzs7OztBQ3hHcEI7Ozs7QUFnQ0EsV0FBUyxRQUFRLE1BQVk7QUFDM0IsVUFBTSxRQUFRLEtBQUssTUFBTSxHQUFHLEVBQUUsT0FBTyxDQUFDLFNBQVMsU0FBUyxHQUFHO0FBQzNELFVBQU0sV0FBcUIsQ0FBQTtBQUUzQixVQUFNLFFBQVEsQ0FBQyxTQUFRO0FBQ3JCLFVBQUksU0FBUyxRQUFRLFNBQVMsU0FBUyxLQUFLLFNBQVMsU0FBUyxTQUFTLENBQUMsTUFBTSxNQUFNO0FBQ2xGLGlCQUFTLElBQUc7TUFDZCxPQUFPO0FBQ0wsaUJBQVMsS0FBSyxJQUFJO01BQ3BCO0lBQ0YsQ0FBQztBQUVELFdBQU8sU0FBUyxLQUFLLEdBQUc7RUFDMUI7QUFDQSxXQUFTLGFBQWEsUUFBZ0IsVUFBZ0I7QUFDcEQsYUFBUyxRQUFRLE1BQU07QUFDdkIsZUFBVyxRQUFRLFFBQVE7QUFDM0IsVUFBTSxTQUFTLE9BQU8sTUFBTSxHQUFHO0FBQy9CLFVBQU0sU0FBUyxTQUFTLE1BQU0sR0FBRztBQUVqQyxXQUFPLFdBQVcsWUFBWSxPQUFPLE1BQU0sQ0FBQyxPQUFPLFVBQVUsVUFBVSxPQUFPLEtBQUssQ0FBQztFQUN0RjtBQXJEQSxNQXVEYTtBQXZEYjs7O0FBOEJBO0FBeUJNLE1BQU8sZ0JBQVAsTUFBTyx1QkFBc0IsVUFBUztRQUE1QyxjQUFBOztBQUlFLGVBQUEsYUFBYTtBQUNiLGVBQUEsVUFBVTtBQUVGLGVBQUEsYUFBdUIsQ0FBQyxPQUFPLE9BQU8sUUFBUTtBQXdqQi9DLGVBQUEsZUFBZSxPQUFPLFlBQTZEOztBQUN4RixrQkFBTSxjQUFjLGlCQUFpQixTQUFTLFFBQVEsYUFBYTtBQUNuRSxrQkFBTSxXQUFXLE1BQU0sTUFBTSxRQUFRLEtBQUssV0FBVztBQUNyRCxnQkFBSTtBQUVKLGdCQUFJLENBQUMsUUFBUTtBQUFVLHFCQUFPLE1BQU0sU0FBUyxLQUFJO3FCQUN4QyxFQUFDLGFBQVEsUUFBUixhQUFRLFNBQUEsU0FBUixTQUFVO0FBQU0scUJBQU8sSUFBSSxLQUFJO2lCQUNwQztBQUNILG9CQUFNLFNBQVMsU0FBUyxLQUFLLFVBQVM7QUFFdEMsa0JBQUksUUFBUTtBQUNaLG9CQUFNLFNBQXFDLENBQUE7QUFFM0Msb0JBQU0sY0FBNkIsU0FBUyxRQUFRLElBQUksY0FBYztBQUN0RSxvQkFBTSxnQkFBd0IsU0FBUyxTQUFTLFFBQVEsSUFBSSxnQkFBZ0IsS0FBSyxLQUFLLEVBQUU7QUFFeEYscUJBQU8sTUFBTTtBQUNYLHNCQUFNLEVBQUUsTUFBTSxNQUFLLElBQUssTUFBTSxPQUFPLEtBQUk7QUFFekMsb0JBQUk7QUFBTTtBQUVWLHVCQUFPLEtBQUssS0FBSztBQUNqQiwwQkFBUyxVQUFLLFFBQUwsVUFBSyxTQUFBLFNBQUwsTUFBTyxXQUFVO0FBRTFCLHNCQUFNLFNBQXlCO2tCQUM3QixLQUFLLFFBQVE7a0JBQ2I7a0JBQ0E7O0FBR0YscUJBQUssZ0JBQWdCLFlBQVksTUFBTTtjQUN6QztBQUVBLG9CQUFNLFlBQVksSUFBSSxXQUFXLEtBQUs7QUFDdEMsa0JBQUksV0FBVztBQUNmLHlCQUFXLFNBQVMsUUFBUTtBQUMxQixvQkFBSSxPQUFPLFVBQVU7QUFBYTtBQUVsQywwQkFBVSxJQUFJLE9BQU8sUUFBUTtBQUM3Qiw0QkFBWSxNQUFNO2NBQ3BCO0FBRUEscUJBQU8sSUFBSSxLQUFLLENBQUMsVUFBVSxNQUFNLEdBQUcsRUFBRSxNQUFNLGVBQWUsT0FBUyxDQUFFO1lBQ3hFO0FBRUEsa0JBQU0sU0FBUyxNQUFNLEtBQUssVUFBVTtjQUNsQyxNQUFNLFFBQVE7Y0FDZCxZQUFXLEtBQUEsUUFBUSxlQUFTLFFBQUEsT0FBQSxTQUFBLEtBQUk7Y0FDaEMsWUFBVyxLQUFBLFFBQVEsZUFBUyxRQUFBLE9BQUEsU0FBQSxLQUFJO2NBQ2hDLE1BQU07YUFDUDtBQUVELG1CQUFPLEVBQUUsTUFBTSxPQUFPLEtBQUssS0FBSTtVQUNqQztRQVNGO1FBNW5CRSxpQkFBaUIsVUFBbUMsV0FBbUM7QUFDckYsZ0JBQU0sS0FBSyxZQUFZLHlCQUF5QjtRQUNsRDtRQU9BLE1BQU0sU0FBTTtBQUNWLGNBQUksS0FBSyxRQUFRLFFBQVc7QUFDMUIsbUJBQU8sS0FBSztVQUNkO0FBQ0EsY0FBSSxFQUFFLGVBQWUsU0FBUztBQUM1QixrQkFBTSxLQUFLLFlBQVksd0NBQXdDO1VBQ2pFO0FBRUEsaUJBQU8sSUFBSSxRQUFxQixDQUFDQyxVQUFTLFdBQVU7QUFDbEQsa0JBQU0sVUFBVSxVQUFVLEtBQUssS0FBSyxTQUFTLEtBQUssVUFBVTtBQUM1RCxvQkFBUSxrQkFBa0IsZUFBYztBQUN4QyxvQkFBUSxZQUFZLE1BQUs7QUFDdkIsbUJBQUssTUFBTSxRQUFRO0FBQ25CLGNBQUFBLFNBQVEsUUFBUSxNQUFNO1lBQ3hCO0FBQ0Esb0JBQVEsVUFBVSxNQUFNLE9BQU8sUUFBUSxLQUFLO0FBQzVDLG9CQUFRLFlBQVksTUFBSztBQUN2QixzQkFBUSxLQUFLLFlBQVk7WUFDM0I7VUFDRixDQUFDO1FBQ0g7UUFFQSxPQUFPLFVBQVUsT0FBNEI7QUFDM0MsZ0JBQU0sY0FBYyxNQUFNO0FBQzFCLGdCQUFNLEtBQUssWUFBWTtBQUN2QixrQkFBUSxNQUFNLFlBQVk7WUFDeEIsS0FBSztZQUNMLEtBQUs7WUFDTCxTQUFTO0FBQ1Asa0JBQUksR0FBRyxpQkFBaUIsU0FBUyxhQUFhLEdBQUc7QUFDL0MsbUJBQUcsa0JBQWtCLGFBQWE7Y0FDcEM7QUFDQSxvQkFBTSxRQUFRLEdBQUcsa0JBQWtCLGVBQWUsRUFBRSxTQUFTLE9BQU0sQ0FBRTtBQUNyRSxvQkFBTSxZQUFZLGFBQWEsUUFBUTtZQUN6QztVQUNGO1FBQ0Y7UUFFQSxNQUFNLFVBQVUsS0FBYSxNQUFXO0FBQ3RDLGdCQUFNLFdBQVcsS0FBSyxXQUFXLFFBQVEsR0FBRyxNQUFNLEtBQUssY0FBYztBQUNyRSxpQkFBTyxLQUFLLE9BQU0sRUFBRyxLQUFLLENBQUMsU0FBcUI7QUFDOUMsbUJBQU8sSUFBSSxRQUF3QixDQUFDQSxVQUFTLFdBQVU7QUFDckQsb0JBQU0sS0FBcUIsS0FBSyxZQUFZLENBQUMsYUFBYSxHQUFHLFFBQVE7QUFDckUsb0JBQU0sUUFBYSxHQUFHLFlBQVksYUFBYTtBQUMvQyxvQkFBTSxNQUFNLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSTtBQUM5QixrQkFBSSxZQUFZLE1BQU1BLFNBQVEsSUFBSSxNQUFNO0FBQ3hDLGtCQUFJLFVBQVUsTUFBTSxPQUFPLElBQUksS0FBSztZQUN0QyxDQUFDO1VBQ0gsQ0FBQztRQUNIO1FBRUEsTUFBTSxlQUFlLFdBQW1CLEtBQWEsTUFBVztBQUM5RCxnQkFBTSxXQUFXLEtBQUssV0FBVyxRQUFRLEdBQUcsTUFBTSxLQUFLLGNBQWM7QUFDckUsaUJBQU8sS0FBSyxPQUFNLEVBQUcsS0FBSyxDQUFDLFNBQXFCO0FBQzlDLG1CQUFPLElBQUksUUFBd0IsQ0FBQ0EsVUFBUyxXQUFVO0FBQ3JELG9CQUFNLEtBQXFCLEtBQUssWUFBWSxDQUFDLGFBQWEsR0FBRyxRQUFRO0FBQ3JFLG9CQUFNLFFBQXdCLEdBQUcsWUFBWSxhQUFhO0FBQzFELG9CQUFNLFFBQWEsTUFBTSxNQUFNLFNBQVM7QUFDeEMsb0JBQU0sTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUk7QUFDOUIsa0JBQUksWUFBWSxNQUFNQSxTQUFRLElBQUksTUFBTTtBQUN4QyxrQkFBSSxVQUFVLE1BQU0sT0FBTyxJQUFJLEtBQUs7WUFDdEMsQ0FBQztVQUNILENBQUM7UUFDSDtRQUVRLFFBQVEsV0FBa0MsU0FBMkI7QUFDM0UsZ0JBQU0saUJBQWlCLFlBQVksU0FBWSxRQUFRLFFBQVEsZ0JBQWdCLEVBQUUsSUFBSTtBQUNyRixjQUFJLFNBQVM7QUFDYixjQUFJLGNBQWM7QUFBVyxzQkFBVSxNQUFNO0FBQzdDLGNBQUksWUFBWTtBQUFJLHNCQUFVLE1BQU07QUFDcEMsaUJBQU87UUFDVDtRQUVBLE1BQU0sUUFBSztBQUNULGdCQUFNLE9BQW9CLE1BQU0sS0FBSyxPQUFNO0FBQzNDLGdCQUFNLEtBQXFCLEtBQUssWUFBWSxDQUFDLGFBQWEsR0FBRyxXQUFXO0FBQ3hFLGdCQUFNLFFBQXdCLEdBQUcsWUFBWSxhQUFhO0FBQzFELGdCQUFNLE1BQUs7UUFDYjs7Ozs7O1FBT0EsTUFBTSxTQUFTLFNBQXdCO0FBQ3JDLGdCQUFNLE9BQWUsS0FBSyxRQUFRLFFBQVEsV0FBVyxRQUFRLElBQUk7QUFHakUsZ0JBQU0sUUFBUyxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ2pELGNBQUksVUFBVTtBQUFXLGtCQUFNLE1BQU0sc0JBQXNCO0FBQzNELGlCQUFPLEVBQUUsTUFBTSxNQUFNLFVBQVUsTUFBTSxVQUFVLEdBQUU7UUFDbkQ7Ozs7OztRQU9BLE1BQU0sVUFBVSxTQUF5QjtBQUN2QyxnQkFBTSxPQUFlLEtBQUssUUFBUSxRQUFRLFdBQVcsUUFBUSxJQUFJO0FBQ2pFLGNBQUksT0FBTyxRQUFRO0FBQ25CLGdCQUFNLFdBQVcsUUFBUTtBQUN6QixnQkFBTSxjQUFjLFFBQVE7QUFFNUIsZ0JBQU0sZ0JBQWlCLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDekQsY0FBSSxpQkFBaUIsY0FBYyxTQUFTO0FBQWEsa0JBQU0sTUFBTSxtQ0FBbUM7QUFFeEcsZ0JBQU0sYUFBYSxLQUFLLE9BQU8sR0FBRyxLQUFLLFlBQVksR0FBRyxDQUFDO0FBRXZELGdCQUFNLGNBQWUsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUM3RCxjQUFJLGdCQUFnQixRQUFXO0FBQzdCLGtCQUFNLGNBQWMsV0FBVyxRQUFRLEtBQUssQ0FBQztBQUM3QyxnQkFBSSxnQkFBZ0IsSUFBSTtBQUN0QixvQkFBTSxnQkFBZ0IsV0FBVyxPQUFPLFdBQVc7QUFDbkQsb0JBQU0sS0FBSyxNQUFNO2dCQUNmLE1BQU07Z0JBQ04sV0FBVyxRQUFRO2dCQUNuQixXQUFXO2VBQ1o7WUFDSDtVQUNGO0FBRUEsY0FBSSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsT0FBTztBQUN4QyxtQkFBTyxLQUFLLFFBQVEsR0FBRyxLQUFLLElBQUksS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDckQsZ0JBQUksQ0FBQyxLQUFLLGVBQWUsSUFBSTtBQUFHLG9CQUFNLE1BQU0sZ0RBQWdEO1VBQzlGO0FBRUEsZ0JBQU0sTUFBTSxLQUFLLElBQUc7QUFDcEIsZ0JBQU0sVUFBb0I7WUFDeEI7WUFDQSxRQUFRO1lBQ1IsTUFBTTtZQUNOLE1BQU0sZ0JBQWdCLE9BQU8sS0FBSyxPQUFPLEtBQUs7WUFDOUMsT0FBTztZQUNQLE9BQU87WUFDUCxTQUFTOztBQUVYLGdCQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3JDLGlCQUFPO1lBQ0wsS0FBSyxRQUFROztRQUVqQjs7Ozs7O1FBT0EsTUFBTSxXQUFXLFNBQTBCO0FBQ3pDLGdCQUFNLE9BQWUsS0FBSyxRQUFRLFFBQVEsV0FBVyxRQUFRLElBQUk7QUFDakUsY0FBSSxPQUFPLFFBQVE7QUFDbkIsZ0JBQU0sV0FBVyxRQUFRO0FBQ3pCLGdCQUFNLGFBQWEsS0FBSyxPQUFPLEdBQUcsS0FBSyxZQUFZLEdBQUcsQ0FBQztBQUV2RCxnQkFBTSxNQUFNLEtBQUssSUFBRztBQUNwQixjQUFJLFFBQVE7QUFFWixnQkFBTSxnQkFBaUIsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN6RCxjQUFJLGlCQUFpQixjQUFjLFNBQVM7QUFBYSxrQkFBTSxNQUFNLG1DQUFtQztBQUV4RyxnQkFBTSxjQUFlLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDN0QsY0FBSSxnQkFBZ0IsUUFBVztBQUM3QixrQkFBTSxjQUFjLFdBQVcsUUFBUSxLQUFLLENBQUM7QUFDN0MsZ0JBQUksZ0JBQWdCLElBQUk7QUFDdEIsb0JBQU0sZ0JBQWdCLFdBQVcsT0FBTyxXQUFXO0FBQ25ELG9CQUFNLEtBQUssTUFBTTtnQkFDZixNQUFNO2dCQUNOLFdBQVcsUUFBUTtnQkFDbkIsV0FBVztlQUNaO1lBQ0g7VUFDRjtBQUVBLGNBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxlQUFlLElBQUk7QUFBRyxrQkFBTSxNQUFNLGdEQUFnRDtBQUV6RyxjQUFJLGtCQUFrQixRQUFXO0FBQy9CLGdCQUFJLGNBQWMsbUJBQW1CLE1BQU07QUFDekMsb0JBQU0sTUFBTSx3RUFBd0U7WUFDdEY7QUFFQSxnQkFBSSxjQUFjLFlBQVksVUFBYSxDQUFDLFVBQVU7QUFDcEQscUJBQU8sS0FBSyxLQUFLLGNBQWMsT0FBTyxJQUFJLEtBQUssSUFBSSxDQUFDO1lBQ3RELE9BQU87QUFDTCxxQkFBTyxjQUFjLFVBQVU7WUFDakM7QUFDQSxvQkFBUSxjQUFjO1VBQ3hCO0FBQ0EsZ0JBQU0sVUFBb0I7WUFDeEI7WUFDQSxRQUFRO1lBQ1IsTUFBTTtZQUNOLE1BQU0sS0FBSztZQUNYO1lBQ0EsT0FBTztZQUNQLFNBQVM7O0FBRVgsZ0JBQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDdkM7Ozs7OztRQU9BLE1BQU0sV0FBVyxTQUEwQjtBQUN6QyxnQkFBTSxPQUFlLEtBQUssUUFBUSxRQUFRLFdBQVcsUUFBUSxJQUFJO0FBRWpFLGdCQUFNLFFBQVMsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNqRCxjQUFJLFVBQVU7QUFBVyxrQkFBTSxNQUFNLHNCQUFzQjtBQUMzRCxnQkFBTSxVQUFVLE1BQU0sS0FBSyxlQUFlLGFBQWEsY0FBYyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQztBQUM3RixjQUFJLFFBQVEsV0FBVztBQUFHLGtCQUFNLE1BQU0sc0JBQXNCO0FBRTVELGdCQUFNLEtBQUssVUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ3ZDOzs7Ozs7UUFPQSxNQUFNLE1BQU0sU0FBcUI7QUFDL0IsZ0JBQU0sT0FBZSxLQUFLLFFBQVEsUUFBUSxXQUFXLFFBQVEsSUFBSTtBQUNqRSxnQkFBTSxjQUFjLFFBQVE7QUFDNUIsZ0JBQU0sYUFBYSxLQUFLLE9BQU8sR0FBRyxLQUFLLFlBQVksR0FBRyxDQUFDO0FBRXZELGdCQUFNLFNBQVMsS0FBSyxNQUFNLEtBQUssS0FBSyxDQUFBLEdBQUk7QUFDeEMsZ0JBQU0sY0FBZSxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzdELGdCQUFNLGdCQUFpQixNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3pELGNBQUksVUFBVTtBQUFHLGtCQUFNLE1BQU0sOEJBQThCO0FBQzNELGNBQUksa0JBQWtCO0FBQVcsa0JBQU0sTUFBTSx1Q0FBdUM7QUFDcEYsY0FBSSxDQUFDLGVBQWUsVUFBVSxLQUFLLGdCQUFnQjtBQUFXLGtCQUFNLE1BQU0sNkJBQTZCO0FBRXZHLGNBQUksZUFBZSxVQUFVLEtBQUssZ0JBQWdCLFFBQVc7QUFDM0Qsa0JBQU0sZ0JBQWdCLFdBQVcsT0FBTyxXQUFXLFFBQVEsS0FBSyxDQUFDLENBQUM7QUFDbEUsa0JBQU0sS0FBSyxNQUFNO2NBQ2YsTUFBTTtjQUNOLFdBQVcsUUFBUTtjQUNuQixXQUFXO2FBQ1o7VUFDSDtBQUNBLGdCQUFNLE1BQU0sS0FBSyxJQUFHO0FBQ3BCLGdCQUFNLFVBQW9CO1lBQ3hCO1lBQ0EsUUFBUTtZQUNSLE1BQU07WUFDTixNQUFNO1lBQ04sT0FBTztZQUNQLE9BQU87O0FBRVQsZ0JBQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDdkM7Ozs7O1FBTUEsTUFBTSxNQUFNLFNBQXFCO0FBQy9CLGdCQUFNLEVBQUUsTUFBTSxXQUFXLFVBQVMsSUFBSztBQUN2QyxnQkFBTSxXQUFtQixLQUFLLFFBQVEsV0FBVyxJQUFJO0FBRXJELGdCQUFNLFFBQVMsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUVyRCxjQUFJLFVBQVU7QUFBVyxrQkFBTSxNQUFNLHdCQUF3QjtBQUU3RCxjQUFJLE1BQU0sU0FBUztBQUFhLGtCQUFNLE1BQU0sbUNBQW1DO0FBRS9FLGdCQUFNLGdCQUFnQixNQUFNLEtBQUssUUFBUSxFQUFFLE1BQU0sVUFBUyxDQUFFO0FBRTVELGNBQUksY0FBYyxNQUFNLFdBQVcsS0FBSyxDQUFDO0FBQVcsa0JBQU0sTUFBTSxxQkFBcUI7QUFFckYscUJBQVdDLFVBQVMsY0FBYyxPQUFPO0FBQ3ZDLGtCQUFNLFlBQVksR0FBRyxJQUFJLElBQUlBLE9BQU0sSUFBSTtBQUN2QyxrQkFBTSxXQUFXLE1BQU0sS0FBSyxLQUFLLEVBQUUsTUFBTSxXQUFXLFVBQVMsQ0FBRTtBQUMvRCxnQkFBSSxTQUFTLFNBQVMsUUFBUTtBQUM1QixvQkFBTSxLQUFLLFdBQVcsRUFBRSxNQUFNLFdBQVcsVUFBUyxDQUFFO1lBQ3RELE9BQU87QUFDTCxvQkFBTSxLQUFLLE1BQU0sRUFBRSxNQUFNLFdBQVcsV0FBVyxVQUFTLENBQUU7WUFDNUQ7VUFDRjtBQUVBLGdCQUFNLEtBQUssVUFBVSxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQzNDOzs7Ozs7UUFPQSxNQUFNLFFBQVEsU0FBdUI7QUFDbkMsZ0JBQU0sT0FBZSxLQUFLLFFBQVEsUUFBUSxXQUFXLFFBQVEsSUFBSTtBQUVqRSxnQkFBTSxRQUFTLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDakQsY0FBSSxRQUFRLFNBQVMsTUFBTSxVQUFVO0FBQVcsa0JBQU0sTUFBTSx3QkFBd0I7QUFFcEYsZ0JBQU0sVUFBb0IsTUFBTSxLQUFLLGVBQWUsYUFBYSxjQUFjLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ3ZHLGdCQUFNLFFBQVEsTUFBTSxRQUFRLElBQzFCLFFBQVEsSUFBSSxPQUFPLE1BQUs7QUFDdEIsZ0JBQUksV0FBWSxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQy9DLGdCQUFJLGFBQWEsUUFBVztBQUMxQix5QkFBWSxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUM7WUFDbkQ7QUFDQSxtQkFBTztjQUNMLE1BQU0sRUFBRSxVQUFVLEtBQUssU0FBUyxDQUFDO2NBQ2pDLE1BQU0sU0FBUztjQUNmLE1BQU0sU0FBUztjQUNmLE9BQU8sU0FBUztjQUNoQixPQUFPLFNBQVM7Y0FDaEIsS0FBSyxTQUFTOztVQUVsQixDQUFDLENBQUM7QUFFSixpQkFBTyxFQUFFLE1BQVk7UUFDdkI7Ozs7OztRQU9BLE1BQU0sT0FBTyxTQUFzQjtBQUNqQyxnQkFBTSxPQUFlLEtBQUssUUFBUSxRQUFRLFdBQVcsUUFBUSxJQUFJO0FBRWpFLGNBQUksUUFBUyxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQy9DLGNBQUksVUFBVSxRQUFXO0FBQ3ZCLG9CQUFTLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQztVQUNuRDtBQUNBLGlCQUFPO1lBQ0wsTUFBSyxVQUFLLFFBQUwsVUFBSyxTQUFBLFNBQUwsTUFBTyxTQUFROztRQUV4Qjs7Ozs7O1FBT0EsTUFBTSxLQUFLLFNBQW9CO0FBQzdCLGdCQUFNLE9BQWUsS0FBSyxRQUFRLFFBQVEsV0FBVyxRQUFRLElBQUk7QUFFakUsY0FBSSxRQUFTLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDL0MsY0FBSSxVQUFVLFFBQVc7QUFDdkIsb0JBQVMsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDO1VBQ25EO0FBQ0EsY0FBSSxVQUFVO0FBQVcsa0JBQU0sTUFBTSx1QkFBdUI7QUFFNUQsaUJBQU87WUFDTCxNQUFNLE1BQU0sS0FBSyxVQUFVLEtBQUssU0FBUyxDQUFDO1lBQzFDLE1BQU0sTUFBTTtZQUNaLE1BQU0sTUFBTTtZQUNaLE9BQU8sTUFBTTtZQUNiLE9BQU8sTUFBTTtZQUNiLEtBQUssTUFBTTs7UUFFZjs7Ozs7O1FBT0EsTUFBTSxPQUFPLFNBQXNCO0FBQ2pDLGdCQUFNLEtBQUssTUFBTSxTQUFTLElBQUk7QUFDOUI7UUFDRjs7Ozs7O1FBT0EsTUFBTSxLQUFLLFNBQW9CO0FBQzdCLGlCQUFPLEtBQUssTUFBTSxTQUFTLEtBQUs7UUFDbEM7UUFFQSxNQUFNLHFCQUFrQjtBQUN0QixpQkFBTyxFQUFFLGVBQWUsVUFBUztRQUNuQztRQUVBLE1BQU0sbUJBQWdCO0FBQ3BCLGlCQUFPLEVBQUUsZUFBZSxVQUFTO1FBQ25DOzs7Ozs7O1FBUVEsTUFBTSxNQUFNLFNBQXNCLFdBQVcsT0FBSztBQUN4RCxjQUFJLEVBQUUsWUFBVyxJQUFLO0FBQ3RCLGdCQUFNLEVBQUUsSUFBSSxNQUFNLFdBQVcsY0FBYSxJQUFLO0FBRS9DLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtBQUNoQixrQkFBTSxNQUFNLG1DQUFtQztVQUNqRDtBQUdBLGNBQUksQ0FBQyxhQUFhO0FBQ2hCLDBCQUFjO1VBQ2hCO0FBRUEsZ0JBQU0sV0FBVyxLQUFLLFFBQVEsZUFBZSxJQUFJO0FBQ2pELGdCQUFNLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUczQyxjQUFJLGFBQWEsUUFBUTtBQUN2QixtQkFBTztjQUNMLEtBQUs7O1VBRVQ7QUFFQSxjQUFJLGFBQWEsVUFBVSxNQUFNLEdBQUc7QUFDbEMsa0JBQU0sTUFBTSxzQ0FBc0M7VUFDcEQ7QUFHQSxjQUFJO0FBQ0osY0FBSTtBQUNGLG9CQUFRLE1BQU0sS0FBSyxLQUFLO2NBQ3RCLE1BQU07Y0FDTixXQUFXO2FBQ1o7VUFDSCxTQUFTLEdBQUc7QUFFVixrQkFBTSxtQkFBbUIsR0FBRyxNQUFNLEdBQUc7QUFDckMsNkJBQWlCLElBQUc7QUFDcEIsa0JBQU1DLFVBQVMsaUJBQWlCLEtBQUssR0FBRztBQUd4QyxnQkFBSSxpQkFBaUIsU0FBUyxHQUFHO0FBQy9CLG9CQUFNLG9CQUFvQixNQUFNLEtBQUssS0FBSztnQkFDeEMsTUFBTUE7Z0JBQ04sV0FBVztlQUNaO0FBRUQsa0JBQUksa0JBQWtCLFNBQVMsYUFBYTtBQUMxQyxzQkFBTSxJQUFJLE1BQU0sMkNBQTJDO2NBQzdEO1lBQ0Y7VUFDRjtBQUdBLGNBQUksU0FBUyxNQUFNLFNBQVMsYUFBYTtBQUN2QyxrQkFBTSxJQUFJLE1BQU0sMENBQTBDO1VBQzVEO0FBR0EsZ0JBQU0sVUFBVSxNQUFNLEtBQUssS0FBSztZQUM5QixNQUFNO1lBQ04sV0FBVztXQUNaO0FBR0QsZ0JBQU0sYUFBYSxPQUFPLE1BQWNDLFFBQWUsVUFBaUI7QUFDdEUsa0JBQU0sV0FBbUIsS0FBSyxRQUFRLGFBQWEsSUFBSTtBQUN2RCxrQkFBTSxRQUFTLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDckQsa0JBQU0sUUFBUUE7QUFDZCxrQkFBTSxRQUFRO0FBQ2Qsa0JBQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFLLENBQUM7VUFDckM7QUFFQSxnQkFBTSxRQUFRLFFBQVEsUUFBUSxRQUFRLFFBQVEsS0FBSyxJQUFHO0FBRXRELGtCQUFRLFFBQVEsTUFBTTs7WUFFcEIsS0FBSyxRQUFRO0FBRVgsb0JBQU0sT0FBTyxNQUFNLEtBQUssU0FBUztnQkFDL0IsTUFBTTtnQkFDTixXQUFXO2VBQ1o7QUFHRCxrQkFBSSxVQUFVO0FBQ1osc0JBQU0sS0FBSyxXQUFXO2tCQUNwQixNQUFNO2tCQUNOLFdBQVc7aUJBQ1o7Y0FDSDtBQUVBLGtCQUFJO0FBQ0osa0JBQUksRUFBRSxLQUFLLGdCQUFnQixTQUFTLENBQUMsS0FBSyxlQUFlLEtBQUssSUFBSSxHQUFHO0FBQ25FLDJCQUFXLFNBQVM7Y0FDdEI7QUFHQSxvQkFBTSxjQUFjLE1BQU0sS0FBSyxVQUFVO2dCQUN2QyxNQUFNO2dCQUNOLFdBQVc7Z0JBQ1gsTUFBTSxLQUFLO2dCQUNYO2VBQ0Q7QUFHRCxrQkFBSSxVQUFVO0FBQ1osc0JBQU0sV0FBVyxJQUFJLE9BQU8sUUFBUSxLQUFLO2NBQzNDO0FBR0EscUJBQU87WUFDVDtZQUNBLEtBQUssYUFBYTtBQUNoQixrQkFBSSxPQUFPO0FBQ1Qsc0JBQU0sTUFBTSxpREFBaUQ7Y0FDL0Q7QUFFQSxrQkFBSTtBQUVGLHNCQUFNLEtBQUssTUFBTTtrQkFDZixNQUFNO2tCQUNOLFdBQVc7a0JBQ1gsV0FBVztpQkFDWjtBQUdELG9CQUFJLFVBQVU7QUFDWix3QkFBTSxXQUFXLElBQUksT0FBTyxRQUFRLEtBQUs7Z0JBQzNDO2NBQ0YsU0FBUyxHQUFHO2NBRVo7QUFHQSxvQkFBTSxZQUNKLE1BQU0sS0FBSyxRQUFRO2dCQUNqQixNQUFNO2dCQUNOLFdBQVc7ZUFDWixHQUNEO0FBRUYseUJBQVcsWUFBWSxVQUFVO0FBRS9CLHNCQUFNLEtBQUssTUFDVDtrQkFDRSxNQUFNLEdBQUcsSUFBSSxJQUFJLFNBQVMsSUFBSTtrQkFDOUIsSUFBSSxHQUFHLEVBQUUsSUFBSSxTQUFTLElBQUk7a0JBQzFCLFdBQVc7a0JBQ1g7bUJBRUYsUUFBUTtjQUVaO0FBR0Esa0JBQUksVUFBVTtBQUNaLHNCQUFNLEtBQUssTUFBTTtrQkFDZixNQUFNO2tCQUNOLFdBQVc7aUJBQ1o7Y0FDSDtZQUNGO1VBQ0Y7QUFDQSxpQkFBTztZQUNMLEtBQUs7O1FBRVQ7UUFnRVEsZUFBZSxLQUFXO0FBQ2hDLGNBQUk7QUFDRixtQkFBTyxLQUFLLEtBQUssR0FBRyxDQUFDLEtBQUs7VUFDNUIsU0FBUyxLQUFLO0FBQ1osbUJBQU87VUFDVDtRQUNGOztBQW5uQk8sb0JBQUEsU0FBUzs7Ozs7QUNoRWxCLE1BQUFDLGVBQUE7V0FBQUEsY0FBQTs7OztNQUlhLFlBeUJQO0FBN0JOLE1BQUFDLFlBQUE7OztBQUlNLE1BQU8sYUFBUCxjQUEwQixVQUFTO1FBR3ZDLGNBQUE7QUFDRSxnQkFBSztBQUNMLGVBQUssY0FBYztRQUNyQjtRQUVBLE1BQU0sS0FBSyxTQUFvQjtBQUM3QixlQUFLLGNBQWMsT0FBTyxLQUFLLFFBQVEsS0FBSyxRQUFRLGNBQWMsUUFBUTtRQUM1RTtRQUVBLE1BQU0sUUFBSztBQUNULGlCQUFPLElBQUksUUFBUSxDQUFDQyxVQUFTLFdBQVU7QUFDckMsZ0JBQUksS0FBSyxlQUFlLE1BQU07QUFDNUIsbUJBQUssWUFBWSxNQUFLO0FBQ3RCLG1CQUFLLGNBQWM7QUFDbkIsY0FBQUEsU0FBTztZQUNULE9BQU87QUFDTCxxQkFBTyw0QkFBNEI7WUFDckM7VUFDRixDQUFDO1FBQ0g7O0FBR0YsTUFBTSxVQUFVLElBQUksV0FBVTs7Ozs7QUM3QjlCO0FBQUE7QUFBQTtBQTBCQSxlQUFTLFdBQVcsTUFBTTtBQUN4QixZQUFJLE9BQU8sU0FBUyxVQUFVO0FBQzVCLGdCQUFNLElBQUksVUFBVSxxQ0FBcUMsS0FBSyxVQUFVLElBQUksQ0FBQztBQUFBLFFBQy9FO0FBQUEsTUFDRjtBQUdBLGVBQVMscUJBQXFCLE1BQU0sZ0JBQWdCO0FBQ2xELFlBQUksTUFBTTtBQUNWLFlBQUksb0JBQW9CO0FBQ3hCLFlBQUksWUFBWTtBQUNoQixZQUFJLE9BQU87QUFDWCxZQUFJO0FBQ0osaUJBQVMsSUFBSSxHQUFHLEtBQUssS0FBSyxRQUFRLEVBQUUsR0FBRztBQUNyQyxjQUFJLElBQUksS0FBSztBQUNYLG1CQUFPLEtBQUssV0FBVyxDQUFDO0FBQUEsbUJBQ2pCLFNBQVM7QUFDaEI7QUFBQTtBQUVBLG1CQUFPO0FBQ1QsY0FBSSxTQUFTLElBQVU7QUFDckIsZ0JBQUksY0FBYyxJQUFJLEtBQUssU0FBUyxHQUFHO0FBQUEsWUFFdkMsV0FBVyxjQUFjLElBQUksS0FBSyxTQUFTLEdBQUc7QUFDNUMsa0JBQUksSUFBSSxTQUFTLEtBQUssc0JBQXNCLEtBQUssSUFBSSxXQUFXLElBQUksU0FBUyxDQUFDLE1BQU0sTUFBWSxJQUFJLFdBQVcsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFVO0FBQzNJLG9CQUFJLElBQUksU0FBUyxHQUFHO0FBQ2xCLHNCQUFJLGlCQUFpQixJQUFJLFlBQVksR0FBRztBQUN4QyxzQkFBSSxtQkFBbUIsSUFBSSxTQUFTLEdBQUc7QUFDckMsd0JBQUksbUJBQW1CLElBQUk7QUFDekIsNEJBQU07QUFDTiwwQ0FBb0I7QUFBQSxvQkFDdEIsT0FBTztBQUNMLDRCQUFNLElBQUksTUFBTSxHQUFHLGNBQWM7QUFDakMsMENBQW9CLElBQUksU0FBUyxJQUFJLElBQUksWUFBWSxHQUFHO0FBQUEsb0JBQzFEO0FBQ0EsZ0NBQVk7QUFDWiwyQkFBTztBQUNQO0FBQUEsa0JBQ0Y7QUFBQSxnQkFDRixXQUFXLElBQUksV0FBVyxLQUFLLElBQUksV0FBVyxHQUFHO0FBQy9DLHdCQUFNO0FBQ04sc0NBQW9CO0FBQ3BCLDhCQUFZO0FBQ1oseUJBQU87QUFDUDtBQUFBLGdCQUNGO0FBQUEsY0FDRjtBQUNBLGtCQUFJLGdCQUFnQjtBQUNsQixvQkFBSSxJQUFJLFNBQVM7QUFDZix5QkFBTztBQUFBO0FBRVAsd0JBQU07QUFDUixvQ0FBb0I7QUFBQSxjQUN0QjtBQUFBLFlBQ0YsT0FBTztBQUNMLGtCQUFJLElBQUksU0FBUztBQUNmLHVCQUFPLE1BQU0sS0FBSyxNQUFNLFlBQVksR0FBRyxDQUFDO0FBQUE7QUFFeEMsc0JBQU0sS0FBSyxNQUFNLFlBQVksR0FBRyxDQUFDO0FBQ25DLGtDQUFvQixJQUFJLFlBQVk7QUFBQSxZQUN0QztBQUNBLHdCQUFZO0FBQ1osbUJBQU87QUFBQSxVQUNULFdBQVcsU0FBUyxNQUFZLFNBQVMsSUFBSTtBQUMzQyxjQUFFO0FBQUEsVUFDSixPQUFPO0FBQ0wsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUNBLGVBQU87QUFBQSxNQUNUO0FBRUEsZUFBUyxRQUFRLEtBQUssWUFBWTtBQUNoQyxZQUFJLE1BQU0sV0FBVyxPQUFPLFdBQVc7QUFDdkMsWUFBSSxPQUFPLFdBQVcsU0FBUyxXQUFXLFFBQVEsT0FBTyxXQUFXLE9BQU87QUFDM0UsWUFBSSxDQUFDLEtBQUs7QUFDUixpQkFBTztBQUFBLFFBQ1Q7QUFDQSxZQUFJLFFBQVEsV0FBVyxNQUFNO0FBQzNCLGlCQUFPLE1BQU07QUFBQSxRQUNmO0FBQ0EsZUFBTyxNQUFNLE1BQU07QUFBQSxNQUNyQjtBQUVBLFVBQUksUUFBUTtBQUFBO0FBQUEsUUFFVixTQUFTLFNBQVNDLFdBQVU7QUFDMUIsY0FBSSxlQUFlO0FBQ25CLGNBQUksbUJBQW1CO0FBQ3ZCLGNBQUk7QUFFSixtQkFBUyxJQUFJLFVBQVUsU0FBUyxHQUFHLEtBQUssTUFBTSxDQUFDLGtCQUFrQixLQUFLO0FBQ3BFLGdCQUFJO0FBQ0osZ0JBQUksS0FBSztBQUNQLHFCQUFPLFVBQVUsQ0FBQztBQUFBLGlCQUNmO0FBQ0gsa0JBQUksUUFBUTtBQUNWLHNCQUFNLFFBQVEsSUFBSTtBQUNwQixxQkFBTztBQUFBLFlBQ1Q7QUFFQSx1QkFBVyxJQUFJO0FBR2YsZ0JBQUksS0FBSyxXQUFXLEdBQUc7QUFDckI7QUFBQSxZQUNGO0FBRUEsMkJBQWUsT0FBTyxNQUFNO0FBQzVCLCtCQUFtQixLQUFLLFdBQVcsQ0FBQyxNQUFNO0FBQUEsVUFDNUM7QUFNQSx5QkFBZSxxQkFBcUIsY0FBYyxDQUFDLGdCQUFnQjtBQUVuRSxjQUFJLGtCQUFrQjtBQUNwQixnQkFBSSxhQUFhLFNBQVM7QUFDeEIscUJBQU8sTUFBTTtBQUFBO0FBRWIscUJBQU87QUFBQSxVQUNYLFdBQVcsYUFBYSxTQUFTLEdBQUc7QUFDbEMsbUJBQU87QUFBQSxVQUNULE9BQU87QUFDTCxtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsUUFFQSxXQUFXLFNBQVMsVUFBVSxNQUFNO0FBQ2xDLHFCQUFXLElBQUk7QUFFZixjQUFJLEtBQUssV0FBVyxFQUFHLFFBQU87QUFFOUIsY0FBSSxhQUFhLEtBQUssV0FBVyxDQUFDLE1BQU07QUFDeEMsY0FBSSxvQkFBb0IsS0FBSyxXQUFXLEtBQUssU0FBUyxDQUFDLE1BQU07QUFHN0QsaUJBQU8scUJBQXFCLE1BQU0sQ0FBQyxVQUFVO0FBRTdDLGNBQUksS0FBSyxXQUFXLEtBQUssQ0FBQyxXQUFZLFFBQU87QUFDN0MsY0FBSSxLQUFLLFNBQVMsS0FBSyxrQkFBbUIsU0FBUTtBQUVsRCxjQUFJLFdBQVksUUFBTyxNQUFNO0FBQzdCLGlCQUFPO0FBQUEsUUFDVDtBQUFBLFFBRUEsWUFBWSxTQUFTLFdBQVcsTUFBTTtBQUNwQyxxQkFBVyxJQUFJO0FBQ2YsaUJBQU8sS0FBSyxTQUFTLEtBQUssS0FBSyxXQUFXLENBQUMsTUFBTTtBQUFBLFFBQ25EO0FBQUEsUUFFQSxNQUFNLFNBQVNDLFFBQU87QUFDcEIsY0FBSSxVQUFVLFdBQVc7QUFDdkIsbUJBQU87QUFDVCxjQUFJO0FBQ0osbUJBQVMsSUFBSSxHQUFHLElBQUksVUFBVSxRQUFRLEVBQUUsR0FBRztBQUN6QyxnQkFBSSxNQUFNLFVBQVUsQ0FBQztBQUNyQix1QkFBVyxHQUFHO0FBQ2QsZ0JBQUksSUFBSSxTQUFTLEdBQUc7QUFDbEIsa0JBQUksV0FBVztBQUNiLHlCQUFTO0FBQUE7QUFFVCwwQkFBVSxNQUFNO0FBQUEsWUFDcEI7QUFBQSxVQUNGO0FBQ0EsY0FBSSxXQUFXO0FBQ2IsbUJBQU87QUFDVCxpQkFBTyxNQUFNLFVBQVUsTUFBTTtBQUFBLFFBQy9CO0FBQUEsUUFFQSxVQUFVLFNBQVMsU0FBUyxNQUFNLElBQUk7QUFDcEMscUJBQVcsSUFBSTtBQUNmLHFCQUFXLEVBQUU7QUFFYixjQUFJLFNBQVMsR0FBSSxRQUFPO0FBRXhCLGlCQUFPLE1BQU0sUUFBUSxJQUFJO0FBQ3pCLGVBQUssTUFBTSxRQUFRLEVBQUU7QUFFckIsY0FBSSxTQUFTLEdBQUksUUFBTztBQUd4QixjQUFJLFlBQVk7QUFDaEIsaUJBQU8sWUFBWSxLQUFLLFFBQVEsRUFBRSxXQUFXO0FBQzNDLGdCQUFJLEtBQUssV0FBVyxTQUFTLE1BQU07QUFDakM7QUFBQSxVQUNKO0FBQ0EsY0FBSSxVQUFVLEtBQUs7QUFDbkIsY0FBSSxVQUFVLFVBQVU7QUFHeEIsY0FBSSxVQUFVO0FBQ2QsaUJBQU8sVUFBVSxHQUFHLFFBQVEsRUFBRSxTQUFTO0FBQ3JDLGdCQUFJLEdBQUcsV0FBVyxPQUFPLE1BQU07QUFDN0I7QUFBQSxVQUNKO0FBQ0EsY0FBSSxRQUFRLEdBQUc7QUFDZixjQUFJLFFBQVEsUUFBUTtBQUdwQixjQUFJLFNBQVMsVUFBVSxRQUFRLFVBQVU7QUFDekMsY0FBSSxnQkFBZ0I7QUFDcEIsY0FBSSxJQUFJO0FBQ1IsaUJBQU8sS0FBSyxRQUFRLEVBQUUsR0FBRztBQUN2QixnQkFBSSxNQUFNLFFBQVE7QUFDaEIsa0JBQUksUUFBUSxRQUFRO0FBQ2xCLG9CQUFJLEdBQUcsV0FBVyxVQUFVLENBQUMsTUFBTSxJQUFVO0FBRzNDLHlCQUFPLEdBQUcsTUFBTSxVQUFVLElBQUksQ0FBQztBQUFBLGdCQUNqQyxXQUFXLE1BQU0sR0FBRztBQUdsQix5QkFBTyxHQUFHLE1BQU0sVUFBVSxDQUFDO0FBQUEsZ0JBQzdCO0FBQUEsY0FDRixXQUFXLFVBQVUsUUFBUTtBQUMzQixvQkFBSSxLQUFLLFdBQVcsWUFBWSxDQUFDLE1BQU0sSUFBVTtBQUcvQyxrQ0FBZ0I7QUFBQSxnQkFDbEIsV0FBVyxNQUFNLEdBQUc7QUFHbEIsa0NBQWdCO0FBQUEsZ0JBQ2xCO0FBQUEsY0FDRjtBQUNBO0FBQUEsWUFDRjtBQUNBLGdCQUFJLFdBQVcsS0FBSyxXQUFXLFlBQVksQ0FBQztBQUM1QyxnQkFBSSxTQUFTLEdBQUcsV0FBVyxVQUFVLENBQUM7QUFDdEMsZ0JBQUksYUFBYTtBQUNmO0FBQUEscUJBQ08sYUFBYTtBQUNwQiw4QkFBZ0I7QUFBQSxVQUNwQjtBQUVBLGNBQUksTUFBTTtBQUdWLGVBQUssSUFBSSxZQUFZLGdCQUFnQixHQUFHLEtBQUssU0FBUyxFQUFFLEdBQUc7QUFDekQsZ0JBQUksTUFBTSxXQUFXLEtBQUssV0FBVyxDQUFDLE1BQU0sSUFBVTtBQUNwRCxrQkFBSSxJQUFJLFdBQVc7QUFDakIsdUJBQU87QUFBQTtBQUVQLHVCQUFPO0FBQUEsWUFDWDtBQUFBLFVBQ0Y7QUFJQSxjQUFJLElBQUksU0FBUztBQUNmLG1CQUFPLE1BQU0sR0FBRyxNQUFNLFVBQVUsYUFBYTtBQUFBLGVBQzFDO0FBQ0gsdUJBQVc7QUFDWCxnQkFBSSxHQUFHLFdBQVcsT0FBTyxNQUFNO0FBQzdCLGdCQUFFO0FBQ0osbUJBQU8sR0FBRyxNQUFNLE9BQU87QUFBQSxVQUN6QjtBQUFBLFFBQ0Y7QUFBQSxRQUVBLFdBQVcsU0FBUyxVQUFVLE1BQU07QUFDbEMsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFFQSxTQUFTLFNBQVMsUUFBUSxNQUFNO0FBQzlCLHFCQUFXLElBQUk7QUFDZixjQUFJLEtBQUssV0FBVyxFQUFHLFFBQU87QUFDOUIsY0FBSSxPQUFPLEtBQUssV0FBVyxDQUFDO0FBQzVCLGNBQUksVUFBVSxTQUFTO0FBQ3ZCLGNBQUksTUFBTTtBQUNWLGNBQUksZUFBZTtBQUNuQixtQkFBUyxJQUFJLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUc7QUFDekMsbUJBQU8sS0FBSyxXQUFXLENBQUM7QUFDeEIsZ0JBQUksU0FBUyxJQUFVO0FBQ25CLGtCQUFJLENBQUMsY0FBYztBQUNqQixzQkFBTTtBQUNOO0FBQUEsY0FDRjtBQUFBLFlBQ0YsT0FBTztBQUVQLDZCQUFlO0FBQUEsWUFDakI7QUFBQSxVQUNGO0FBRUEsY0FBSSxRQUFRLEdBQUksUUFBTyxVQUFVLE1BQU07QUFDdkMsY0FBSSxXQUFXLFFBQVEsRUFBRyxRQUFPO0FBQ2pDLGlCQUFPLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFBQSxRQUMxQjtBQUFBLFFBRUEsVUFBVSxTQUFTQyxVQUFTLE1BQU0sS0FBSztBQUNyQyxjQUFJLFFBQVEsVUFBYSxPQUFPLFFBQVEsU0FBVSxPQUFNLElBQUksVUFBVSxpQ0FBaUM7QUFDdkcscUJBQVcsSUFBSTtBQUVmLGNBQUksUUFBUTtBQUNaLGNBQUksTUFBTTtBQUNWLGNBQUksZUFBZTtBQUNuQixjQUFJO0FBRUosY0FBSSxRQUFRLFVBQWEsSUFBSSxTQUFTLEtBQUssSUFBSSxVQUFVLEtBQUssUUFBUTtBQUNwRSxnQkFBSSxJQUFJLFdBQVcsS0FBSyxVQUFVLFFBQVEsS0FBTSxRQUFPO0FBQ3ZELGdCQUFJLFNBQVMsSUFBSSxTQUFTO0FBQzFCLGdCQUFJLG1CQUFtQjtBQUN2QixpQkFBSyxJQUFJLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUc7QUFDckMsa0JBQUksT0FBTyxLQUFLLFdBQVcsQ0FBQztBQUM1QixrQkFBSSxTQUFTLElBQVU7QUFHbkIsb0JBQUksQ0FBQyxjQUFjO0FBQ2pCLDBCQUFRLElBQUk7QUFDWjtBQUFBLGdCQUNGO0FBQUEsY0FDRixPQUFPO0FBQ1Asb0JBQUkscUJBQXFCLElBQUk7QUFHM0IsaUNBQWU7QUFDZixxQ0FBbUIsSUFBSTtBQUFBLGdCQUN6QjtBQUNBLG9CQUFJLFVBQVUsR0FBRztBQUVmLHNCQUFJLFNBQVMsSUFBSSxXQUFXLE1BQU0sR0FBRztBQUNuQyx3QkFBSSxFQUFFLFdBQVcsSUFBSTtBQUduQiw0QkFBTTtBQUFBLG9CQUNSO0FBQUEsa0JBQ0YsT0FBTztBQUdMLDZCQUFTO0FBQ1QsMEJBQU07QUFBQSxrQkFDUjtBQUFBLGdCQUNGO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFFQSxnQkFBSSxVQUFVLElBQUssT0FBTTtBQUFBLHFCQUEwQixRQUFRLEdBQUksT0FBTSxLQUFLO0FBQzFFLG1CQUFPLEtBQUssTUFBTSxPQUFPLEdBQUc7QUFBQSxVQUM5QixPQUFPO0FBQ0wsaUJBQUssSUFBSSxLQUFLLFNBQVMsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHO0FBQ3JDLGtCQUFJLEtBQUssV0FBVyxDQUFDLE1BQU0sSUFBVTtBQUdqQyxvQkFBSSxDQUFDLGNBQWM7QUFDakIsMEJBQVEsSUFBSTtBQUNaO0FBQUEsZ0JBQ0Y7QUFBQSxjQUNGLFdBQVcsUUFBUSxJQUFJO0FBR3ZCLCtCQUFlO0FBQ2Ysc0JBQU0sSUFBSTtBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBRUEsZ0JBQUksUUFBUSxHQUFJLFFBQU87QUFDdkIsbUJBQU8sS0FBSyxNQUFNLE9BQU8sR0FBRztBQUFBLFVBQzlCO0FBQUEsUUFDRjtBQUFBLFFBRUEsU0FBUyxTQUFTLFFBQVEsTUFBTTtBQUM5QixxQkFBVyxJQUFJO0FBQ2YsY0FBSSxXQUFXO0FBQ2YsY0FBSSxZQUFZO0FBQ2hCLGNBQUksTUFBTTtBQUNWLGNBQUksZUFBZTtBQUduQixjQUFJLGNBQWM7QUFDbEIsbUJBQVMsSUFBSSxLQUFLLFNBQVMsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHO0FBQ3pDLGdCQUFJLE9BQU8sS0FBSyxXQUFXLENBQUM7QUFDNUIsZ0JBQUksU0FBUyxJQUFVO0FBR25CLGtCQUFJLENBQUMsY0FBYztBQUNqQiw0QkFBWSxJQUFJO0FBQ2hCO0FBQUEsY0FDRjtBQUNBO0FBQUEsWUFDRjtBQUNGLGdCQUFJLFFBQVEsSUFBSTtBQUdkLDZCQUFlO0FBQ2Ysb0JBQU0sSUFBSTtBQUFBLFlBQ1o7QUFDQSxnQkFBSSxTQUFTLElBQVU7QUFFbkIsa0JBQUksYUFBYTtBQUNmLDJCQUFXO0FBQUEsdUJBQ0osZ0JBQWdCO0FBQ3ZCLDhCQUFjO0FBQUEsWUFDcEIsV0FBVyxhQUFhLElBQUk7QUFHMUIsNEJBQWM7QUFBQSxZQUNoQjtBQUFBLFVBQ0Y7QUFFQSxjQUFJLGFBQWEsTUFBTSxRQUFRO0FBQUEsVUFFM0IsZ0JBQWdCO0FBQUEsVUFFaEIsZ0JBQWdCLEtBQUssYUFBYSxNQUFNLEtBQUssYUFBYSxZQUFZLEdBQUc7QUFDM0UsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU8sS0FBSyxNQUFNLFVBQVUsR0FBRztBQUFBLFFBQ2pDO0FBQUEsUUFFQSxRQUFRLFNBQVMsT0FBTyxZQUFZO0FBQ2xDLGNBQUksZUFBZSxRQUFRLE9BQU8sZUFBZSxVQUFVO0FBQ3pELGtCQUFNLElBQUksVUFBVSxxRUFBcUUsT0FBTyxVQUFVO0FBQUEsVUFDNUc7QUFDQSxpQkFBTyxRQUFRLEtBQUssVUFBVTtBQUFBLFFBQ2hDO0FBQUEsUUFFQSxPQUFPLFNBQVMsTUFBTSxNQUFNO0FBQzFCLHFCQUFXLElBQUk7QUFFZixjQUFJLE1BQU0sRUFBRSxNQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSSxLQUFLLElBQUksTUFBTSxHQUFHO0FBQzNELGNBQUksS0FBSyxXQUFXLEVBQUcsUUFBTztBQUM5QixjQUFJLE9BQU8sS0FBSyxXQUFXLENBQUM7QUFDNUIsY0FBSSxhQUFhLFNBQVM7QUFDMUIsY0FBSTtBQUNKLGNBQUksWUFBWTtBQUNkLGdCQUFJLE9BQU87QUFDWCxvQkFBUTtBQUFBLFVBQ1YsT0FBTztBQUNMLG9CQUFRO0FBQUEsVUFDVjtBQUNBLGNBQUksV0FBVztBQUNmLGNBQUksWUFBWTtBQUNoQixjQUFJLE1BQU07QUFDVixjQUFJLGVBQWU7QUFDbkIsY0FBSSxJQUFJLEtBQUssU0FBUztBQUl0QixjQUFJLGNBQWM7QUFHbEIsaUJBQU8sS0FBSyxPQUFPLEVBQUUsR0FBRztBQUN0QixtQkFBTyxLQUFLLFdBQVcsQ0FBQztBQUN4QixnQkFBSSxTQUFTLElBQVU7QUFHbkIsa0JBQUksQ0FBQyxjQUFjO0FBQ2pCLDRCQUFZLElBQUk7QUFDaEI7QUFBQSxjQUNGO0FBQ0E7QUFBQSxZQUNGO0FBQ0YsZ0JBQUksUUFBUSxJQUFJO0FBR2QsNkJBQWU7QUFDZixvQkFBTSxJQUFJO0FBQUEsWUFDWjtBQUNBLGdCQUFJLFNBQVMsSUFBVTtBQUVuQixrQkFBSSxhQUFhLEdBQUksWUFBVztBQUFBLHVCQUFXLGdCQUFnQixFQUFHLGVBQWM7QUFBQSxZQUM5RSxXQUFXLGFBQWEsSUFBSTtBQUc1Qiw0QkFBYztBQUFBLFlBQ2hCO0FBQUEsVUFDRjtBQUVBLGNBQUksYUFBYSxNQUFNLFFBQVE7QUFBQSxVQUUvQixnQkFBZ0I7QUFBQSxVQUVoQixnQkFBZ0IsS0FBSyxhQUFhLE1BQU0sS0FBSyxhQUFhLFlBQVksR0FBRztBQUN2RSxnQkFBSSxRQUFRLElBQUk7QUFDZCxrQkFBSSxjQUFjLEtBQUssV0FBWSxLQUFJLE9BQU8sSUFBSSxPQUFPLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFBQSxrQkFBTyxLQUFJLE9BQU8sSUFBSSxPQUFPLEtBQUssTUFBTSxXQUFXLEdBQUc7QUFBQSxZQUNsSTtBQUFBLFVBQ0YsT0FBTztBQUNMLGdCQUFJLGNBQWMsS0FBSyxZQUFZO0FBQ2pDLGtCQUFJLE9BQU8sS0FBSyxNQUFNLEdBQUcsUUFBUTtBQUNqQyxrQkFBSSxPQUFPLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFBQSxZQUM5QixPQUFPO0FBQ0wsa0JBQUksT0FBTyxLQUFLLE1BQU0sV0FBVyxRQUFRO0FBQ3pDLGtCQUFJLE9BQU8sS0FBSyxNQUFNLFdBQVcsR0FBRztBQUFBLFlBQ3RDO0FBQ0EsZ0JBQUksTUFBTSxLQUFLLE1BQU0sVUFBVSxHQUFHO0FBQUEsVUFDcEM7QUFFQSxjQUFJLFlBQVksRUFBRyxLQUFJLE1BQU0sS0FBSyxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQUEsbUJBQVcsV0FBWSxLQUFJLE1BQU07QUFFekYsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFFQSxLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsUUFDUCxPQUFPO0FBQUEsTUFDVDtBQUVBLFlBQU0sUUFBUTtBQUVkLGFBQU8sVUFBVTtBQUFBO0FBQUE7OztBQ2hoQmpCLE1BQUFDLGVBQUE7V0FBQUEsY0FBQTs7O01BS2E7QUFMYixNQUFBQyxZQUFBOzs7QUFLTSxNQUFPLHFCQUFQLGNBQWtDLFVBQVM7UUFDckMsb0JBQWlCO0FBQ3pCLGlCQUFPLEtBQUssWUFBWSxvREFBb0Q7UUFDOUU7UUFFQSxRQUFLO0FBQ0gsZ0JBQU0sS0FBSyxrQkFBaUI7UUFDOUI7UUFFQSxPQUFJO0FBQ0YsZ0JBQU0sS0FBSyxrQkFBaUI7UUFDOUI7UUFFQSxZQUFTO0FBQ1AsZ0JBQU0sS0FBSyxrQkFBaUI7UUFDOUI7Ozs7OztBQ2xCSyxNQUFNLGtCQUFOLE1BQXNCO0FBQUEsSUFHekIsT0FBYyxZQUFZLFVBQTJCO0FBQ2pELFdBQUssV0FBVztBQUFBLElBQ3BCO0FBQUEsSUFFQSxXQUFrQixVQUFxQjtBQUNuQyxVQUFJLENBQUMsS0FBSyxVQUFVO0FBQ2hCLGNBQU0sSUFBSSxNQUFNLHFFQUFxRTtBQUFBLE1BQ3pGO0FBQ0EsYUFBTyxLQUFLO0FBQUEsSUFDaEI7QUFBQSxFQUNKO0FBWkksZ0JBRFMsaUJBQ007OztBQ0huQjs7O0FDQUEsV0FBUyxFQUFFLEdBQUc7QUFDWixNQUFFLGVBQWUsVUFBVSxJQUFJO0FBQUEsTUFDN0IsQ0FBQztBQUFBLE1BQ0Q7QUFBQSxRQUNFLElBQUksR0FBRyxHQUFHO0FBQ1IsaUJBQU8sSUFBSSxNQUFNLENBQUMsR0FBRztBQUFBLFlBQ25CLElBQUksR0FBRyxHQUFHO0FBQ1IscUJBQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTTtBQUNsQixzQkFBTSxJQUFJLEVBQUUsVUFBVSxRQUFRLENBQUM7QUFDL0Isb0JBQUksTUFBTSxRQUFRO0FBQ2hCLG9CQUFFLElBQUksTUFBTSxvQkFBb0IsQ0FBQyxZQUFZLENBQUM7QUFDOUM7QUFBQSxnQkFDRjtBQUNBLG9CQUFJLE9BQU8sRUFBRSxDQUFDLEtBQUssWUFBWTtBQUM3QixvQkFBRSxJQUFJLE1BQU0sVUFBVSxDQUFDLGtDQUFrQyxDQUFDLEVBQUUsQ0FBQztBQUM3RDtBQUFBLGdCQUNGO0FBQ0EsaUJBQUMsWUFBWTtBQUNYLHNCQUFJO0FBQ0YsMEJBQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDdEIsc0JBQUUsQ0FBQztBQUFBLGtCQUNMLFNBQVMsR0FBRztBQUNWLHNCQUFFLENBQUM7QUFBQSxrQkFDTDtBQUFBLGdCQUNGLEdBQUc7QUFBQSxjQUNMO0FBQUEsWUFDRjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDQSxXQUFTLEVBQUUsR0FBRztBQUNaLE1BQUUsZUFBZSxVQUFVLElBQUk7QUFBQSxNQUM3QixDQUFDO0FBQUEsTUFDRDtBQUFBLFFBQ0UsSUFBSSxHQUFHLEdBQUc7QUFDUixpQkFBTyxFQUFFLFFBQVEsUUFBUSxDQUFDO0FBQUEsUUFDNUI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDQSxXQUFTLEVBQUUsSUFBSSxPQUFJO0FBQ2pCLFdBQU8sU0FBUyxRQUFRLE9BQU8saUJBQWlCLE9BQU8sa0JBQWtCLENBQUMsR0FBRyxPQUFPLGNBQWMsVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLElBQUksT0FBTyxZQUFZLFVBQVUsRUFBRSxNQUFNO0FBQUEsRUFDcEs7OztBRGpDQTtBQU5BLE1BQU0sYUFBYSxlQUFpQyxjQUFjO0lBQ2hFLEtBQUssTUFBTSx3REFBZ0IsS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLGNBQWEsQ0FBRTtHQUM3RDtBQUVELElBQWE7OztBRVRiO0FBSUEsTUFBTUMsV0FBVSxlQUE4QixXQUFXO0lBQ3ZELEtBQUssTUFBTSwwREFBZ0IsS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLFdBQVUsQ0FBRTtHQUMxRDs7O0FDRk0sTUFBTSxvQkFBTixNQUE2QztBQUFBLElBQTdDO0FBQ0gsZ0NBQWtCO0FBQUE7QUFBQSxJQUVsQixNQUFNLFNBQVMsTUFBK0I7QUFDMUMsWUFBTSxTQUFTLE1BQU0sV0FBVyxTQUFTO0FBQUEsUUFDckM7QUFBQSxRQUNBLFdBQVcsVUFBVTtBQUFBLFFBQ3JCLFVBQVUsU0FBUztBQUFBLE1BQ3ZCLENBQUM7QUFDRCxhQUFPLE9BQU87QUFBQSxJQUNsQjtBQUFBLElBRUEsTUFBTSxVQUFVLE1BQWMsU0FBZ0M7QUFDMUQsWUFBTSxXQUFXLFVBQVU7QUFBQSxRQUN2QjtBQUFBLFFBQ0EsTUFBTTtBQUFBLFFBQ04sV0FBVyxVQUFVO0FBQUEsUUFDckIsVUFBVSxTQUFTO0FBQUEsTUFDdkIsQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUVBLE1BQU0sUUFBUSxNQUFpQztBQUMzQyxZQUFNLFNBQVMsTUFBTSxXQUFXLFFBQVE7QUFBQSxRQUNwQztBQUFBLFFBQ0EsV0FBVyxVQUFVO0FBQUEsTUFDekIsQ0FBQztBQUVELGFBQU8sT0FBTyxNQUFNLElBQUksQ0FBQUMsT0FBS0EsR0FBRSxJQUFJO0FBQUEsSUFDdkM7QUFBQSxJQUVBLE1BQU0sT0FBTyxNQUFnQztBQUN6QyxVQUFJO0FBQ0EsY0FBTSxXQUFXLEtBQUs7QUFBQSxVQUNsQjtBQUFBLFVBQ0EsV0FBVyxVQUFVO0FBQUEsUUFDekIsQ0FBQztBQUNELGVBQU87QUFBQSxNQUNYLFFBQVE7QUFDSixlQUFPO0FBQUEsTUFDWDtBQUFBLElBQ0o7QUFBQSxJQUVBLE1BQU0sT0FBTyxNQUE2QjtBQUN0QyxZQUFNLFdBQVcsV0FBVztBQUFBLFFBQ3hCO0FBQUEsUUFDQSxXQUFXLFVBQVU7QUFBQSxNQUN6QixDQUFDO0FBQUEsSUFDTDtBQUFBLElBRUEsTUFBTSxNQUFNLE1BQTZCO0FBQ3JDLFVBQUk7QUFDQSxjQUFNLFdBQVcsTUFBTTtBQUFBLFVBQ25CO0FBQUEsVUFDQSxXQUFXLFVBQVU7QUFBQSxVQUNyQixXQUFXO0FBQUEsUUFDZixDQUFDO0FBQUEsTUFDTCxTQUFTLEdBQUc7QUFBQSxNQUVaO0FBQUEsSUFDSjtBQUFBLElBRUEsTUFBTSxLQUFLLE1BQWlDO0FBQ3hDLFlBQU0sT0FBTyxNQUFNLFdBQVcsS0FBSztBQUFBLFFBQy9CO0FBQUEsUUFDQSxXQUFXLFVBQVU7QUFBQSxNQUN6QixDQUFDO0FBQ0QsYUFBTztBQUFBLFFBQ0gsUUFBUSxLQUFLLFNBQVM7QUFBQSxRQUN0QixhQUFhLEtBQUssU0FBUztBQUFBLE1BQy9CO0FBQUEsSUFDSjtBQUFBLElBRUEsTUFBTSxTQUFTLE1BQTZCO0FBQ3hDLGNBQVEsSUFBSSx1Q0FBdUMsSUFBSTtBQUFBLElBQzNEO0FBQUEsSUFFQSxNQUFNLGFBQWEsS0FBNEI7QUFDM0MsWUFBTUMsU0FBUSxLQUFLLEVBQUUsSUFBSSxDQUFDO0FBQUEsSUFDOUI7QUFBQSxJQUVBLGdCQUF3QjtBQUNwQixhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsaUJBQXlCO0FBQ3JCLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxrQkFBMEI7QUFDdEIsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUVBLE1BQU0sT0FBc0I7QUFDeEIsVUFBSSxDQUFDLE1BQU0sS0FBSyxPQUFPLEtBQUssY0FBYyxDQUFDLEdBQUc7QUFDMUMsY0FBTSxLQUFLLE1BQU0sS0FBSyxjQUFjLENBQUM7QUFBQSxNQUN6QztBQUNBLFVBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxLQUFLLGVBQWUsQ0FBQyxHQUFHO0FBQzNDLGNBQU0sS0FBSyxNQUFNLEtBQUssZUFBZSxDQUFDO0FBQUEsTUFDMUM7QUFBQSxJQUNKO0FBQUEsRUFDSjs7O0FDeEdBLHdCQUFzQzs7O0FDQXRDLE1BQU0sZ0JBQU4sTUFBb0I7QUFBQSxJQUNoQixLQUFLLFlBQW9CLE1BQWE7QUFDbEMsY0FBUSxLQUFLLFVBQVUsT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLElBQzdDO0FBQUEsSUFDQSxLQUFLLFlBQW9CLE1BQWE7QUFDbEMsY0FBUSxLQUFLLFVBQVUsT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLElBQzdDO0FBQUEsSUFDQSxNQUFNLFlBQW9CLE1BQWE7QUFDbkMsY0FBUSxNQUFNLFdBQVcsT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLElBQy9DO0FBQUEsRUFDSjtBQUVBLE1BQU0sU0FBUyxJQUFJLGNBQWM7QUFFMUIsV0FBUyxVQUFVLE9BQWU7QUFDckMsV0FBTztBQUFBLEVBQ1g7QUFFQSxNQUFPLHlCQUFROzs7QUNYUixNQUFNLFlBQVk7QUFBQSxJQUNyQixvQkFBb0I7QUFBQSxJQUNwQixTQUFTO0FBQUEsSUFDVCxVQUFVO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxJQUNoQixlQUFlO0FBQUEsSUFDZixrQkFBa0I7QUFBQSxJQUNsQixPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixrQkFBa0I7QUFBQSxJQUNsQixrQkFBa0I7QUFBQSxJQUNsQixpQkFBaUI7QUFBQSxJQUNqQixrQkFBa0I7QUFBQSxJQUNsQixnQkFBZ0I7QUFBQSxJQUNoQixpQkFBaUI7QUFBQSxJQUNqQix3QkFBd0I7QUFBQSxJQUN4Qix1QkFBdUI7QUFBQSxJQUN2Qix1QkFBdUI7QUFBQSxJQUN2QixpQkFBaUI7QUFBQSxJQUNqQixnQkFBZ0I7QUFBQSxJQUNoQixrQkFBa0I7QUFBQSxJQUNsQixpQkFBaUI7QUFBQSxJQUNqQixjQUFjO0FBQUEsSUFDZCxnQkFBZ0I7QUFBQSxJQUNoQixZQUFZO0FBQUEsSUFDWixpQkFBaUI7QUFBQSxFQUNyQjtBQUdPLE1BQU0sVUFBVTtBQUFBLElBQ25CLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFFBQVE7QUFBQSxJQUNSLGtCQUFrQjtBQUFBLElBQ2xCLFVBQVU7QUFBQSxJQUNWLGdCQUFnQjtBQUFBLElBQ2hCLGtCQUFrQjtBQUFBLElBQ2xCLFNBQVM7QUFBQSxFQUNiO0FBR08sTUFBTSxlQUFlO0FBQUEsSUFDeEIsaUJBQWlCO0FBQUEsSUFDakIsZUFBZTtBQUFBLElBQ2YsYUFBYTtBQUFBLElBQ2IsMEJBQTBCO0FBQUEsRUFDOUI7QUFnQk8sTUFBTSxrQkFBa0I7QUFBQSxJQUMzQixPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsRUFDWjtBQUdPLE1BQU0sT0FBTztBQUFBLElBQ2hCLGFBQWE7QUFBQSxJQUNiLHVCQUF1QjtBQUFBLElBQ3ZCLFVBQVU7QUFBQSxJQUNWLGVBQWU7QUFBQSxJQUNmLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxJQUNmLDRCQUE0QjtBQUFBLEVBQ2hDO0FBbUNPLE1BQU0sV0FBVztBQUFBLElBQ3BCLGNBQWM7QUFBQSxJQUNkLG9CQUFvQjtBQUFBLElBQ3BCLHdCQUF3QjtBQUFBLElBQ3hCLHFCQUFxQjtBQUFBLElBQ3JCLDBCQUEwQjtBQUFBLElBQzFCLHVCQUF1QjtBQUFBLEVBQzNCOzs7QUM3SEE7OztBQ0FBOzs7QUNBQTs7O0FDQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ0FBOzs7QUNBQTs7O0FDT0EsTUFBTSxZQUFvQztBQUFBLElBQ3RDLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxJQUNiLGtCQUFrQjtBQUFBLElBQ2xCLGlCQUFpQjtBQUFBLElBQ2pCLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxFQUNqQjtBQUVBLE1BQU0sZ0JBQU4sTUFBb0I7QUFBQSxJQUNoQixPQUFjLEtBQUssS0FBYSxNQUFzQjtBQUVsRCxhQUFPLFVBQVUsSUFBSSxLQUFLO0FBQUEsSUFDOUI7QUFBQSxFQUNKO0FBRUEsTUFBTyxnQ0FBUTs7O0FDckJmLGlCQUFzQixpQkFBaUIsSUFBWSxPQUFlLFNBQWlCLFFBQXNEO0FBQ3JJLFVBQU0sV0FBVyw4QkFBYyxLQUFLLEtBQVcsT0FBTztBQUN0RCxRQUFJO0FBRUosWUFBTyxRQUFRO0FBQUEsTUFDWCxLQUFLO0FBQ0Qsc0JBQWM7QUFDZDtBQUFBLE1BQ0osS0FBSztBQUNELHNCQUFjO0FBQ2Q7QUFBQSxNQUNKLEtBQUs7QUFDRCxzQkFBYztBQUNkO0FBQUEsSUFDUjtBQUVBLFdBQU8sU0FDRixRQUFRLFlBQVksRUFBRSxFQUN0QixRQUFRLGVBQWUsS0FBSyxFQUM1QixRQUFRLGlCQUFpQixPQUFPLEVBQ2hDLFFBQVEsZ0JBQWdCLFdBQVc7QUFBQSxFQUM1Qzs7O0FWbEJBLE1BQU0sV0FBTixNQUFNLFNBQVE7QUFBQSxJQUlGLGNBQWM7QUFGdEIsMEJBQVEsY0FBbUM7QUFBQSxJQUVwQjtBQUFBLElBRXZCLE9BQU8sY0FBdUI7QUFDMUIsVUFBSSxDQUFDLFNBQVEsVUFBVTtBQUNuQixpQkFBUSxXQUFXLElBQUksU0FBUTtBQUFBLE1BQ25DO0FBQ0EsYUFBTyxTQUFRO0FBQUEsSUFDbkI7QUFBQSxJQUVBLGNBQWMsWUFBaUM7QUFDM0MsV0FBSyxhQUFhO0FBQUEsSUFDdEI7QUFBQSxJQUVBLE1BQU0sVUFDRixXQUNBLE9BQ0EsU0FDQSxTQUNlO0FBQ2YsWUFBTSxVQUFzQztBQUFBLFFBQ3hDLE1BQU07QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBRUEsVUFBSTtBQUNBLGNBQU0sV0FBVyxNQUFNLHVCQUFPLGVBQWUsS0FBSyxZQUFhLE9BQU87QUFDdEUsZUFBTyxTQUFTO0FBQUEsTUFDcEIsU0FBUyxPQUFPO0FBQ1osK0JBQU8sTUFBTSw2QkFBOEIsTUFBZ0IsT0FBTztBQUNsRSxlQUFPO0FBQUEsTUFDWDtBQUFBLElBQ0o7QUFBQSxJQUVBLFdBQVcsVUFBa0IsVUFBa0IsU0FBUyxjQUFnQztBQUNwRixhQUFPLElBQUksUUFBUSxDQUFDQyxVQUFTLFdBQVc7QUFDcEMsY0FBTSxrQkFBa0IsU0FBUyxjQUFjLFFBQVE7QUFDdkQsWUFBSSxpQkFBaUI7QUFDakIsaUJBQU9BLFNBQVEsZUFBZTtBQUFBLFFBQ2xDO0FBRUEsY0FBTSxXQUFXLElBQUksaUJBQWlCLE1BQU07QUFDeEMsZ0JBQU0sVUFBVSxTQUFTLGNBQWMsUUFBUTtBQUMvQyxjQUFJLFNBQVM7QUFDVCxxQkFBUyxXQUFXO0FBQ3BCLFlBQUFBLFNBQVEsT0FBTztBQUFBLFVBQ25CO0FBQUEsUUFDSixDQUFDO0FBRUQsaUJBQVMsUUFBUSxTQUFTLE1BQU07QUFBQSxVQUM1QixXQUFXO0FBQUEsVUFDWCxTQUFTO0FBQUEsUUFDYixDQUFDO0FBRUQsbUJBQVcsTUFBTTtBQUNiLG1CQUFTLFdBQVc7QUFDcEIsaUJBQU8sSUFBSSxNQUFNLDhDQUE4QyxRQUFRLEVBQUUsQ0FBQztBQUFBLFFBQzlFLEdBQUcsT0FBTztBQUFBLE1BQ2QsQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUVBLGtCQUFrQixPQUFlLFVBQWtCLFNBQVMsY0FBNkI7QUFDckYsYUFBTyxJQUFJLFFBQVEsQ0FBQ0EsVUFBUyxXQUFXO0FBQ3BDLGNBQU0sZ0JBQWdCLE1BQW1CO0FBQ3JDLGdCQUFNLFNBQVMsU0FBUztBQUFBLFlBQ3BCO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBLFlBQVk7QUFBQSxZQUNaO0FBQUEsVUFDSjtBQUNBLGlCQUFPLE9BQU87QUFBQSxRQUNsQjtBQUVBLGNBQU0sa0JBQWtCLGNBQWM7QUFDdEMsWUFBSSxpQkFBaUI7QUFDakIsaUJBQU9BLFNBQVEsZUFBZTtBQUFBLFFBQ2xDO0FBRUEsY0FBTSxXQUFXLElBQUksaUJBQWlCLE1BQU07QUFDeEMsZ0JBQU0sVUFBVSxjQUFjO0FBQzlCLGNBQUksU0FBUztBQUNULHFCQUFTLFdBQVc7QUFDcEIsWUFBQUEsU0FBUSxPQUFPO0FBQUEsVUFDbkI7QUFBQSxRQUNKLENBQUM7QUFFRCxpQkFBUyxRQUFRLFNBQVMsTUFBTTtBQUFBLFVBQzVCLFdBQVc7QUFBQSxVQUNYLFNBQVM7QUFBQSxRQUNiLENBQUM7QUFFRCxtQkFBVyxNQUFNO0FBQ2IsbUJBQVMsV0FBVztBQUNwQixpQkFBTyxJQUFJLE1BQU0sMkNBQTJDLEtBQUssRUFBRSxDQUFDO0FBQUEsUUFDeEUsR0FBRyxPQUFPO0FBQUEsTUFDZCxDQUFDO0FBQUEsSUFDTDtBQUFBLElBRUEsbUJBQW1CLFVBQWtCLFNBQVMsY0FBK0I7QUFDekUsYUFBTyxJQUFJLFFBQVEsQ0FBQ0EsVUFBUyxXQUFXO0FBQ3BDLGNBQU0sY0FBYyxTQUFTLGNBQWMsTUFBTTtBQUNqRCxZQUFJLENBQUMsYUFBYTtBQUNkLGlCQUFPLE9BQU8sSUFBSSxNQUFNLHdCQUF3QixDQUFDO0FBQUEsUUFDckQ7QUFFQSxjQUFNLFdBQVcsSUFBSSxpQkFBaUIsTUFBTTtBQUN4QyxtQkFBUyxXQUFXO0FBQ3BCLFVBQUFBLFNBQVEsU0FBUyxLQUFLO0FBQUEsUUFDMUIsQ0FBQztBQUVELGlCQUFTLFFBQVEsYUFBYTtBQUFBLFVBQzFCLFNBQVM7QUFBQSxVQUNULFdBQVc7QUFBQSxRQUNmLENBQUM7QUFFRCxtQkFBVyxNQUFNO0FBQ2IsbUJBQVMsV0FBVztBQUNwQixpQkFBTyxJQUFJLE1BQU0sOENBQThDLENBQUM7QUFBQSxRQUNwRSxHQUFHLE9BQU87QUFBQSxNQUNkLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFFQSxNQUFhLFlBQVksU0FBaUIsT0FBZSxTQUFpQixRQUFxQyxZQUFtQixLQUFNO0FBQ3BJLFlBQU0sV0FBVyxNQUFNLGlCQUFpQixTQUFTLE9BQU8sU0FBUyxNQUFNO0FBQ3ZFLFlBQU0saUJBQWlCLFNBQVMsY0FBYyxVQUFVLGVBQWU7QUFDdkUsVUFBRyxnQkFBZ0I7QUFDZix1QkFBZSxhQUFhO0FBRTVCLG1CQUFXLE1BQU07QUFDYixtQkFBUyxlQUFlLE9BQU8sR0FBRyxPQUFPO0FBQUEsUUFDN0MsR0FBRyxTQUFTO0FBQUEsTUFDaEI7QUFBQSxJQUNKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBT08sTUFBTSxJQUE4QjtBQUN2QyxhQUFPLElBQUksUUFBUSxDQUFDQSxVQUFTLFdBQVc7QUFDcEMsWUFBSTtBQUNBLGdCQUFNLFlBQVk7QUFDbEIsZ0JBQU0sU0FBUyxTQUFTLGNBQWMsUUFBUTtBQUU5QyxnQkFBTSxVQUFVLENBQUMsU0FBZ0I7QUFDN0IsbUJBQU8sT0FBTztBQUNkLFlBQUFBLFNBQVMsS0FBcUIsTUFBTTtBQUFBLFVBQ3hDO0FBRUEsaUJBQU8saUJBQWlCLFdBQVcsU0FBUyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBRTFELGlCQUFPLEtBQUs7QUFDWixpQkFBTztBQUFBLFlBQ0gsU0FBUyxlQUFlO0FBQUE7QUFBQSx1Q0FFTCxFQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUEsd0VBSStCLFNBQVM7QUFBQTtBQUFBO0FBQUEsb0VBR2IsU0FBUztBQUFBO0FBQUEscUJBRXhEO0FBQUEsVUFDTDtBQUVBLG1CQUFTLEtBQUssWUFBWSxNQUFNO0FBQUEsUUFDcEMsU0FBUyxLQUFLO0FBQ1YsaUJBQU8sR0FBRztBQUFBLFFBQ2Q7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFFTyxrQkFBa0IsTUFBMkI7QUFDaEQsYUFBTyxTQUFTO0FBQUEsUUFDWjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQSxZQUFZO0FBQUEsUUFDWjtBQUFBLE1BQ0osRUFBRTtBQUFBLElBQ047QUFBQSxJQUVPLG1CQUFtQixLQUFxQjtBQUMzQyxZQUFNLFFBQVEsSUFBSSxNQUFNLEdBQUc7QUFDM0IsYUFBTyxNQUFNLE1BQU0sU0FBUyxDQUFDLEtBQUs7QUFBQSxJQUN0QztBQUFBLElBRU8sV0FBVyxTQUF5QjtBQUN2QyxZQUFNLFFBQVEsS0FBSyxNQUFNLFVBQVUsSUFBSTtBQUN2QyxZQUFNLFVBQVUsS0FBSyxNQUFPLFVBQVUsT0FBUSxFQUFFO0FBQ2hELFlBQU0sbUJBQW1CLEtBQUssTUFBTSxVQUFVLEVBQUU7QUFFaEQsYUFBTyxHQUFHLE9BQU8sS0FBSyxFQUFFLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxPQUFPLE9BQU8sRUFBRSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksT0FBTyxnQkFBZ0IsRUFBRSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQUEsSUFDN0g7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTU8sZUFBZSxVQUFrQixVQUEyQjtBQUMvRCxZQUFNLFlBQVksQ0FBQyxNQUNmLEVBQUUsUUFBUSxNQUFNLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxJQUFJLE9BQUssU0FBUyxHQUFHLEVBQUUsS0FBSyxDQUFDO0FBRWhFLFlBQU0sVUFBVSxVQUFVLFFBQVE7QUFDbEMsWUFBTSxVQUFVLFVBQVUsUUFBUTtBQUNsQyxZQUFNLFlBQVksS0FBSyxJQUFJLFFBQVEsUUFBUSxRQUFRLE1BQU07QUFFekQsZUFBUyxJQUFJLEdBQUcsSUFBSSxXQUFXLEtBQUs7QUFDaEMsY0FBTSxLQUFLLFFBQVEsQ0FBQyxLQUFLO0FBQ3pCLGNBQU0sS0FBSyxRQUFRLENBQUMsS0FBSztBQUN6QixZQUFJLEtBQUssR0FBSSxRQUFPO0FBQ3BCLFlBQUksS0FBSyxHQUFJLFFBQU87QUFBQSxNQUN4QjtBQUNBLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQS9OSSxnQkFERSxVQUNhO0FBRG5CLE1BQU0sVUFBTjtBQWtPQSxNQUFNLGtCQUFrQixRQUFRLFlBQVk7QUFFNUMsTUFBTyxrQkFBUTs7O0FXdE9SLFdBQVMsc0JBQ1osVUFDQSxVQUNBLFNBQ007QUFDTixRQUFJLFdBQVcsOEJBQWMsS0FBSyxLQUFXLGFBQWE7QUFHMUQsVUFBTSxXQUFXLENBQUMsUUFBUSxlQUFlLFVBQVUsU0FBUztBQUM1RCxhQUFTLFFBQVEsU0FBTztBQUNwQixZQUFNLFFBQVEsSUFBSSxPQUFPLFNBQVMsR0FBRyxVQUFVLEdBQUc7QUFDbEQsaUJBQVcsU0FBUyxRQUFRLE9BQU8sU0FBUyxHQUFHLEtBQUssRUFBRTtBQUFBLElBQzFELENBQUM7QUFFRCxXQUFPLFNBQ0YsUUFBUSxpQkFBaUIsVUFBVSxZQUFZLEVBQUUsRUFDakQsUUFBUSwyQkFBMkIsUUFBUTtBQUFBLEVBQ3BEOzs7QUNqQk8sV0FBUyxxQkFDWixVQUNBLFVBQ0EsU0FDTTtBQUNOLFFBQUksV0FBVyw4QkFBYyxLQUFLLEtBQVcsWUFBWTtBQUd6RCxVQUFNLFdBQVcsQ0FBQyxRQUFRLGVBQWUsVUFBVSxTQUFTO0FBQzVELGFBQVMsUUFBUSxTQUFPO0FBQ3BCLFlBQU0sUUFBUSxJQUFJLE9BQU8sU0FBUyxHQUFHLFVBQVUsR0FBRztBQUNsRCxpQkFBVyxTQUFTLFFBQVEsT0FBTyxTQUFTLEdBQUcsS0FBSyxFQUFFO0FBQUEsSUFDMUQsQ0FBQztBQUVELFdBQU8sU0FDRixRQUFRLGtCQUFrQixVQUFVLGFBQWEsRUFBRSxFQUNuRCxRQUFRLDJCQUEyQixRQUFRLEVBQzNDLFFBQVEsZUFBZSxVQUFVLFlBQVksT0FBTyxFQUNwRCxRQUFRLHFCQUFxQixVQUFVLHFDQUFxQyxnQ0FBZ0M7QUFBQSxFQUNySDs7O0FDcEJPLFdBQVMsaUJBQXlCO0FBQ3JDLFdBQU8sOEJBQWMsS0FBSyxLQUFXLGNBQWM7QUFBQSxFQUN2RDs7O0FDRkEsTUFBTSxhQUFOLE1BQWlCO0FBQUEsSUFHYixXQUFrQixlQUF1QjtBQUNyQyxhQUFPLGdCQUFnQixRQUFRLGdCQUFnQjtBQUFBLElBQ25EO0FBQUEsSUFFQSxXQUFrQixhQUFxQjtBQUNuQyxhQUFPLGdCQUFnQixRQUFRLGNBQWM7QUFBQSxJQUNqRDtBQUFBLElBRUEsV0FBa0IsY0FBc0I7QUFDcEMsYUFBTyxnQkFBZ0IsUUFBUSxlQUFlO0FBQUEsSUFDbEQ7QUFBQSxFQUdKO0FBZkksZ0JBREUsWUFDWSxxQkFBNEI7QUFjMUMsZ0JBZkUsWUFlWSx5QkFBd0I7QUFHMUMsTUFBTyxxQkFBUTs7O0FDcEJSLFdBQVMsd0JBQWdDO0FBQzVDLFdBQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBNENYOzs7QUNyQ0Esb0JBQStCOzs7QUNpQnhCLE1BQU0seUJBQXlCO0FBQUEsSUFDbEM7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNKO0FBRU8sTUFBTSxvQkFBb0I7QUFBQSxJQUM3QjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNKOzs7QUNqQ0EsTUFBTSxrQkFBTixNQUFzQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLbEIsT0FBZSx5QkFBeUIsU0FBa0M7QUFDdEUsWUFBTSxhQUFhLFFBQVEsTUFBTSxzQkFBc0I7QUFDdkQsVUFBSSxDQUFDLFdBQVksUUFBTztBQUV4QixZQUFNLFNBQTRCLENBQUM7QUFDbkMsWUFBTSxXQUFXO0FBRWpCLGlCQUFXLENBQUMsRUFBRSxRQUFRLFFBQVEsS0FBSyxXQUFXLENBQUMsRUFBRSxTQUFTLFFBQVEsR0FBRztBQUNqRSxZQUFJLENBQUMsa0JBQWtCLFNBQVMsTUFBcUIsRUFBRztBQUV4RCxjQUFNLE1BQU07QUFFWixZQUFJLE9BQU8sR0FBRyxNQUFNLE9BQVc7QUFFL0IsZUFBTyxHQUFHLElBQUksU0FBUyxLQUFLO0FBQUEsTUFDaEM7QUFFQSxpQkFBVyxPQUFPLHdCQUF3QjtBQUN0QyxZQUFJLENBQUMsT0FBTyxHQUFHLEVBQUcsUUFBTztBQUFBLE1BQzdCO0FBRUEsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUVBLE9BQWMsd0JBQXdCLGFBQXNDO0FBQ3hFLFlBQU0sV0FBVyxLQUFLLHlCQUF5QixXQUFXO0FBRTFELFVBQUksQ0FBQyxVQUFVO0FBQ1gsK0JBQU8sTUFBTSw4Q0FBOEM7QUFBQSxNQUMvRDtBQUVBLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUVBLE1BQU8sMEJBQVE7OztBRnBDZixNQUFNLGFBQU4sTUFBaUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1iLGFBQW9CLFdBQVcsWUFBbUM7QUFDOUQsVUFBSSxTQUFTLGVBQWUsVUFBVSxHQUFHO0FBQ3JDLGFBQUssT0FBTyxLQUFLLFVBQVUsVUFBVSxvQkFBb0I7QUFDekQ7QUFBQSxNQUNKO0FBRUEsWUFBTSxpQkFBYSxrQkFBSyxtQkFBVyxhQUFhLFVBQVU7QUFFMUQsVUFBSSxDQUFDLE1BQU0sZ0JBQWdCLFFBQVEsT0FBTyxVQUFVLEdBQUc7QUFDbkQsYUFBSyxPQUFPLE1BQU0sMEJBQTBCLFVBQVUsRUFBRTtBQUN4RDtBQUFBLE1BQ0o7QUFFQSxZQUFNLFNBQVMsTUFBTSxnQkFBZ0IsUUFBUSxTQUFTLFVBQVU7QUFDaEUsWUFBTSxTQUFTLFNBQVMsY0FBYyxRQUFRO0FBQzlDLGFBQU8sWUFBWTtBQUNuQixhQUFPLEtBQUs7QUFFWixlQUFTLEtBQUssWUFBWSxNQUFNO0FBRWhDLFlBQU0saUJBQTJCLEtBQUs7QUFBQSxRQUNsQyxhQUFhLFFBQVEsYUFBYSxlQUFlLEtBQUs7QUFBQSxNQUMxRDtBQUVBLFVBQUksQ0FBQyxlQUFlLFNBQVMsVUFBVSxHQUFHO0FBQ3RDLHVCQUFlLEtBQUssVUFBVTtBQUM5QixxQkFBYSxRQUFRLGFBQWEsaUJBQWlCLEtBQUssVUFBVSxjQUFjLENBQUM7QUFBQSxNQUNyRjtBQUVBLFdBQUssT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVO0FBQUEsSUFDbkQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLE9BQWMsYUFBYSxZQUEwQjtBQUNqRCxZQUFNLGdCQUFnQixTQUFTLGVBQWUsVUFBVTtBQUN4RCxVQUFJLGVBQWU7QUFDZixzQkFBYyxPQUFPO0FBQUEsTUFDekI7QUFFQSxVQUFJLGlCQUEyQixLQUFLO0FBQUEsUUFDaEMsYUFBYSxRQUFRLGFBQWEsZUFBZSxLQUFLO0FBQUEsTUFDMUQ7QUFDQSx1QkFBaUIsZUFBZSxPQUFPLENBQUMsTUFBYyxNQUFNLFVBQVU7QUFDdEUsbUJBQWEsUUFBUSxhQUFhLGlCQUFpQixLQUFLLFVBQVUsY0FBYyxDQUFDO0FBRWpGLFdBQUssT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZO0FBQUEsSUFDckQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLGFBQW9CLFlBQWdFO0FBQ2hGLFlBQU0sV0FBVyxNQUFNLE1BQU0sS0FBSyxRQUFRO0FBQzFDLGFBQU8sU0FBUyxLQUFLO0FBQUEsSUFDekI7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLGFBQW9CLFlBQVksU0FBaUIsTUFBMkM7QUFDeEYsV0FBSyxPQUFPLEtBQUssZUFBZSxJQUFJLFVBQVUsT0FBTyxFQUFFO0FBRXZELFlBQU0sV0FBVyxNQUFNLE1BQU0sT0FBTztBQUNwQyxVQUFJLENBQUMsU0FBUyxHQUFJLE9BQU0sSUFBSSxNQUFNLHVCQUF1QixTQUFTLE1BQU0sSUFBSSxTQUFTLFVBQVUsRUFBRTtBQUVqRyxZQUFNLFVBQVUsU0FBUyxXQUFXLG1CQUFXLGNBQWMsbUJBQVc7QUFDeEUsVUFBSSxDQUFDLE1BQU0sZ0JBQWdCLFFBQVEsT0FBTyxPQUFPLEdBQUc7QUFDaEQsY0FBTSxnQkFBZ0IsUUFBUSxNQUFNLE9BQU87QUFBQSxNQUMvQztBQUVBLFlBQU0sZUFBVyxzQkFBUyxJQUFJLElBQUksT0FBTyxFQUFFLFFBQVEsS0FBSyxHQUFHLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQztBQUM3RSxZQUFNLGVBQVcsa0JBQUssU0FBUyxRQUFRO0FBRXZDLFlBQU0sVUFBVSxNQUFNLFNBQVMsS0FBSztBQUNwQyxZQUFNLGdCQUFnQixRQUFRLFVBQVUsVUFBVSxPQUFPO0FBRXpELFdBQUssT0FBTyxLQUFLLGNBQWMsSUFBSSxjQUFjLFFBQVEsRUFBRTtBQUMzRCxhQUFPO0FBQUEsSUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsYUFBb0IsVUFBVSxVQUFrQixNQUF5QztBQUNyRixXQUFLLE9BQU8sS0FBSyxZQUFZLElBQUksVUFBVSxRQUFRLEVBQUU7QUFFckQsY0FBUSxNQUFNO0FBQUEsUUFDVixLQUFLO0FBQ0QsY0FBSSxNQUFNLEtBQUssa0JBQWtCLFFBQVEsR0FBRztBQUN4QyxrQkFBTSxnQkFBZ0IsUUFBUSxXQUFPLGtCQUFLLG1CQUFXLGFBQWEsUUFBUSxDQUFDO0FBQzNFLGdCQUFJLGlCQUEyQixLQUFLO0FBQUEsY0FDaEMsYUFBYSxRQUFRLGFBQWEsZUFBZSxLQUFLO0FBQUEsWUFDMUQ7QUFDQSxnQkFBSSxlQUFlLFNBQVMsUUFBUSxHQUFHO0FBQ25DLCtCQUFpQixlQUFlLE9BQU8sQ0FBQyxNQUFjLE1BQU0sUUFBUTtBQUNwRSwyQkFBYSxRQUFRLGFBQWEsaUJBQWlCLEtBQUssVUFBVSxjQUFjLENBQUM7QUFBQSxZQUNyRjtBQUFBLFVBQ0o7QUFDQTtBQUFBLFFBQ0osS0FBSztBQUNELGNBQUksTUFBTSxLQUFLLGlCQUFpQixRQUFRLEdBQUc7QUFDdkMsZ0JBQUksYUFBYSxRQUFRLGFBQWEsYUFBYSxNQUFNLFVBQVU7QUFDL0QsMkJBQWEsUUFBUSxhQUFhLGVBQWUsU0FBUztBQUFBLFlBQzlEO0FBQ0EscUJBQVMsZUFBZSxhQUFhLEdBQUcsT0FBTztBQUMvQyxrQkFBTSxnQkFBZ0IsUUFBUSxXQUFPLGtCQUFLLG1CQUFXLFlBQVksUUFBUSxDQUFDO0FBQUEsVUFDOUU7QUFDQTtBQUFBLE1BQ1I7QUFBQSxJQUNKO0FBQUEsSUFFQSxhQUFvQixpQkFBaUIsVUFBb0M7QUFDckUsY0FBUSxNQUFNLEtBQUssbUJBQW1CLEdBQUcsU0FBUyxRQUFRO0FBQUEsSUFDOUQ7QUFBQSxJQUVBLGFBQW9CLGtCQUFrQixVQUFvQztBQUN0RSxjQUFRLE1BQU0sS0FBSyxvQkFBb0IsR0FBRyxTQUFTLFFBQVE7QUFBQSxJQUMvRDtBQUFBLElBRUEsYUFBcUIscUJBQXdDO0FBQ3pELFlBQU0sVUFBVSxtQkFBVztBQUMzQixVQUFJLENBQUMsTUFBTSxnQkFBZ0IsUUFBUSxPQUFPLE9BQU8sRUFBRyxRQUFPLENBQUM7QUFFNUQsWUFBTSxRQUFRLE1BQU0sZ0JBQWdCLFFBQVEsUUFBUSxPQUFPO0FBQzNELFlBQU0sWUFBWSxNQUFNLFFBQVEsSUFBSSxNQUFNLElBQUksT0FBTSxTQUFRO0FBQ3hELGNBQU0sT0FBTyxNQUFNLGdCQUFnQixRQUFRLFNBQUssa0JBQUssU0FBUyxJQUFJLENBQUM7QUFDbkUsZUFBTyxFQUFFLE1BQU0sUUFBUSxLQUFLLE9BQU87QUFBQSxNQUN2QyxDQUFDLENBQUM7QUFFRixhQUFPLFVBQVUsT0FBTyxDQUFBQyxPQUFLQSxHQUFFLE1BQU0sRUFBRSxJQUFJLENBQUFBLE9BQUtBLEdBQUUsSUFBSTtBQUFBLElBQzFEO0FBQUEsSUFFQSxhQUFxQixzQkFBeUM7QUFDMUQsWUFBTSxVQUFVLG1CQUFXO0FBQzNCLFVBQUksQ0FBQyxNQUFNLGdCQUFnQixRQUFRLE9BQU8sT0FBTyxFQUFHLFFBQU8sQ0FBQztBQUU1RCxZQUFNLFFBQVEsTUFBTSxnQkFBZ0IsUUFBUSxRQUFRLE9BQU87QUFDM0QsWUFBTSxZQUFZLE1BQU0sUUFBUSxJQUFJLE1BQU0sSUFBSSxPQUFNLFNBQVE7QUFDeEQsY0FBTSxPQUFPLE1BQU0sZ0JBQWdCLFFBQVEsU0FBSyxrQkFBSyxTQUFTLElBQUksQ0FBQztBQUNuRSxlQUFPLEVBQUUsTUFBTSxRQUFRLEtBQUssT0FBTztBQUFBLE1BQ3ZDLENBQUMsQ0FBQztBQUVGLGFBQU8sVUFBVSxPQUFPLENBQUFBLE9BQUtBLEdBQUUsTUFBTSxFQUFFLElBQUksQ0FBQUEsT0FBS0EsR0FBRSxJQUFJO0FBQUEsSUFDMUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLE9BQWMsdUJBQTZCO0FBQ3ZDLHNCQUFRLFdBQVcsVUFBVSxnQkFBZ0IsRUFBRSxLQUFLLE1BQU07QUFDdEQsYUFBSyxPQUFPLEtBQUssbUNBQW1DO0FBQ3BELGNBQU0sbUJBQW1CLFNBQVMsdUJBQXVCLFFBQVE7QUFFakUsaUJBQVMsSUFBSSxHQUFHLElBQUksaUJBQWlCLFFBQVEsS0FBSztBQUM5QywyQkFBaUIsQ0FBQyxFQUFFLGlCQUFpQixTQUFTLFlBQVk7QUFDdEQsNkJBQWlCLENBQUMsRUFBRSxVQUFVLE9BQU8sUUFBUSxPQUFPO0FBQ3BELGtCQUFNLGFBQWEsaUJBQWlCLENBQUMsRUFBRSxhQUFhLE1BQU07QUFFMUQsZ0JBQUksQ0FBQyxXQUFZO0FBRWpCLGdCQUFJLGlCQUFpQixDQUFDLEVBQUUsVUFBVSxTQUFTLFFBQVEsT0FBTyxHQUFHO0FBQ3pELG9CQUFNLEtBQUssV0FBVyxVQUFVO0FBQUEsWUFDcEMsT0FBTztBQUNILG1CQUFLLGFBQWEsVUFBVTtBQUM1QixtQkFBSyxrQkFBa0I7QUFBQSxZQUMzQjtBQUFBLFVBQ0osQ0FBQztBQUFBLFFBQ0w7QUFBQSxNQUNKLENBQUMsRUFBRSxNQUFNLFNBQU8sS0FBSyxPQUFPLE1BQU0scUNBQXFDLEdBQUcsRUFBRSxDQUFDO0FBQUEsSUFDakY7QUFBQSxJQUVBLE9BQWUsb0JBQTBCO0FBQ3JDLFVBQUksU0FBUyxlQUFlLHVCQUF1QixFQUFHO0FBRXRELFdBQUssT0FBTyxLQUFLLHlDQUF5QztBQUMxRCxZQUFNLFlBQVksU0FBUyxjQUFjLFVBQVUsZ0JBQWdCO0FBQ25FLFVBQUksQ0FBQyxVQUFXO0FBRWhCLFlBQU0sWUFBWSxTQUFTLGNBQWMsR0FBRztBQUM1QyxnQkFBVSxLQUFLO0FBQ2YsZ0JBQVUsTUFBTSxRQUFRO0FBRXhCLFlBQU0sT0FBTyxTQUFTLGNBQWMsR0FBRztBQUN2QyxXQUFLLE1BQU0sUUFBUTtBQUNuQixXQUFLLE1BQU0sU0FBUztBQUNwQixXQUFLLGNBQWM7QUFDbkIsV0FBSyxpQkFBaUIsU0FBUyxNQUFNO0FBQ2pDLGVBQU8sU0FBUyxPQUFPO0FBQUEsTUFDM0IsQ0FBQztBQUVELGdCQUFVLFlBQVksU0FBUyxlQUFlLCtDQUErQyxDQUFDO0FBQzlGLGdCQUFVLFlBQVksSUFBSTtBQUMxQixnQkFBVSxZQUFZLFNBQVMsZUFBZSxhQUFhLENBQUM7QUFFNUQsZ0JBQVUsWUFBWSxTQUFTO0FBQUEsSUFDbkM7QUFBQSxJQUVBLE9BQWMsbUJBQXlCO0FBQ25DLHNCQUFRLFdBQVcsc0JBQXNCLEVBQUUsS0FBSyxNQUFNO0FBQ2xELGNBQU0sU0FBUyxTQUFTLGVBQWUscUJBQXFCO0FBQzVELGdCQUFRLGlCQUFpQixTQUFTLFlBQVk7QUFDMUMsZ0JBQU0sS0FBSyxXQUFXLG1CQUFXLFVBQVU7QUFBQSxRQUMvQyxDQUFDO0FBQUEsTUFDTCxDQUFDLEVBQUUsTUFBTSxTQUFPLEtBQUssT0FBTyxNQUFNLHlDQUF5QyxHQUFHLEVBQUUsQ0FBQztBQUFBLElBQ3JGO0FBQUEsSUFFQSxPQUFjLG9CQUEwQjtBQUNwQyxzQkFBUSxXQUFXLHVCQUF1QixFQUFFLEtBQUssTUFBTTtBQUNuRCxjQUFNLFNBQVMsU0FBUyxlQUFlLHNCQUFzQjtBQUM3RCxnQkFBUSxpQkFBaUIsU0FBUyxZQUFZO0FBQzFDLGdCQUFNLEtBQUssV0FBVyxtQkFBVyxXQUFXO0FBQUEsUUFDaEQsQ0FBQztBQUFBLE1BQ0wsQ0FBQyxFQUFFLE1BQU0sU0FBTyxLQUFLLE9BQU8sTUFBTSwwQ0FBMEMsR0FBRyxFQUFFLENBQUM7QUFBQSxJQUN0RjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsYUFBcUIsV0FBVyxZQUFtQztBQUMvRCxVQUFJO0FBQ0EsY0FBTSxnQkFBZ0IsUUFBUSxTQUFTLFVBQVU7QUFBQSxNQUNyRCxTQUFTLE9BQU87QUFDWixhQUFLLE9BQU8sTUFBTSx5QkFBeUIsVUFBVSxLQUFLLEtBQUssRUFBRTtBQUFBLE1BQ3JFO0FBQUEsSUFDSjtBQUFBLElBRUEsT0FBYyxpQkFBdUI7QUFDakMsc0JBQVEsV0FBVyxzQ0FBc0MsRUFBRSxLQUFLLE1BQU07QUFDbEUsY0FBTSxXQUFXLFNBQVMsZUFBZSxVQUFVO0FBQ25ELGNBQU0sY0FBYyxTQUFTLGNBQWMsc0NBQXNDO0FBRWpGLFlBQUksQ0FBQyxZQUFZLENBQUMsWUFBYTtBQUUvQixvQkFBWSxpQkFBaUIsU0FBUyxNQUFNO0FBQ3hDLGdCQUFNLGFBQWEsU0FBUyxjQUFjLGlCQUFpQjtBQUMzRCxzQkFBWSxlQUFlO0FBQUEsWUFDdkIsVUFBVTtBQUFBLFlBQ1YsT0FBTztBQUFBLFVBQ1gsQ0FBQztBQUVELDJCQUFTLGNBQWMsV0FBVztBQUFBLFFBQ3RDLENBQUM7QUFFRCxjQUFNLFdBQVcsSUFBSSxxQkFBcUIsQ0FBQyxZQUFZO0FBQ25ELGtCQUFRLFFBQVEsV0FBUztBQUNyQixnQkFBSSxNQUFNLGdCQUFnQjtBQUN0QiwrQkFBUyxjQUFjLFdBQVc7QUFBQSxZQUN0QyxPQUFPO0FBQ0gsMEJBQVksVUFBVSxPQUFPLFFBQVEsUUFBUTtBQUFBLFlBQ2pEO0FBQUEsVUFDSixDQUFDO0FBQUEsUUFDTCxHQUFHLEVBQUUsV0FBVyxJQUFJLENBQUM7QUFFckIsaUJBQVMsUUFBUSxRQUFRO0FBQUEsTUFDN0IsQ0FBQyxFQUFFLE1BQU0sU0FBTyxLQUFLLE9BQU8sTUFBTSxvQ0FBb0MsR0FBRyxFQUFFLENBQUM7QUFBQSxJQUNoRjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsT0FBYyx3QkFBOEI7QUFDeEMsWUFBTSxtQkFBbUIsc0JBQXNCO0FBQy9DLFlBQU0sU0FBUyxTQUFTLGNBQWMsUUFBUTtBQUM5QyxhQUFPLFlBQVk7QUFFbkIsZUFBUyxLQUFLLFlBQVksTUFBTTtBQUFBLElBQ3BDO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxhQUFvQixvQkFBb0IsVUFBaUM7QUFDckUsV0FBSyxPQUFPLEtBQUssOEJBQThCLFFBQVE7QUFFdkQsWUFBTSxVQUFVLFNBQVMsa0JBQWtCLEdBQUcsUUFBUSxNQUFNLEVBQUUsQ0FBQztBQUMvRCxVQUFJLENBQUMsU0FBUztBQUNWLGFBQUssT0FBTyxLQUFLLEdBQUcsUUFBUSx5QkFBeUI7QUFDckQ7QUFBQSxNQUNKO0FBRUEsWUFBTSxnQkFBb0MsU0FBUyxTQUFTLFlBQVksSUFBSSxVQUFVO0FBQ3RGLFlBQU0sZUFBVztBQUFBLFFBQ2Isa0JBQWtCLFVBQVUsbUJBQVcsYUFBYSxtQkFBVztBQUFBLFFBQy9EO0FBQUEsTUFDSjtBQUdBLFVBQUksY0FBYztBQUNsQixVQUFJO0FBQ0Esc0JBQWMsTUFBTSxnQkFBZ0IsUUFBUSxTQUFTLFFBQVE7QUFBQSxNQUNqRSxTQUFTLEdBQUc7QUFDUixhQUFLLE9BQU8sTUFBTSx1QkFBdUIsUUFBUSxLQUFLLENBQUMsRUFBRTtBQUN6RDtBQUFBLE1BQ0o7QUFFQSxZQUFNLHdCQUF3Qix3QkFBZ0Isd0JBQXdCLFdBQVc7QUFFakYsVUFBSSxDQUFDLHlCQUF5QixPQUFPLEtBQUsscUJBQXFCLEVBQUUsV0FBVyxHQUFHO0FBQzNFO0FBQUEsTUFDSjtBQUVBLFlBQU0sWUFBWSxzQkFBc0I7QUFDeEMsVUFBSSxDQUFDLGFBQWEsY0FBYyxRQUFRO0FBQ3BDLGFBQUssT0FBTyxLQUFLLDhCQUE4QixhQUFhLEtBQUssc0JBQXNCLElBQUksR0FBRztBQUM5RjtBQUFBLE1BQ0o7QUFFQSxVQUFJO0FBQ0EsY0FBTSxVQUFVLE1BQU0sTUFBTSxTQUFTO0FBQ3JDLFlBQUksUUFBUSxXQUFXLEtBQUs7QUFDeEIsZUFBSyxPQUFPLEtBQUssOEJBQThCLFFBQVEsVUFBVSxRQUFRLE1BQU0sRUFBRTtBQUNqRjtBQUFBLFFBQ0o7QUFFQSxjQUFNLFdBQVcsTUFBTSxRQUFRLEtBQUs7QUFDcEMsY0FBTSxvQkFBb0Isd0JBQWdCLHdCQUF3QixRQUFRO0FBRTFFLFlBQUksQ0FBQyxtQkFBbUI7QUFDcEIsZUFBSyxPQUFPLEtBQUssZ0RBQWdELGFBQWEsS0FBSyxzQkFBc0IsSUFBSSxHQUFHO0FBQ2hIO0FBQUEsUUFDSjtBQUVBLFlBQUksZ0JBQVEsZUFBZSxrQkFBa0IsU0FBUyxzQkFBc0IsT0FBTyxHQUFHO0FBQ2xGLGVBQUssT0FBTztBQUFBLFlBQ1Isd0JBQXdCLGFBQWEsS0FBSyxzQkFBc0IsSUFBSSxPQUNoRSxzQkFBc0IsT0FBTyxRQUFRLGtCQUFrQixPQUFPO0FBQUEsVUFDdEU7QUFFQSxnQkFBTSxlQUFlLFNBQVMsZUFBZSxHQUFHLFFBQVEsU0FBUztBQUNqRSxjQUFJLGNBQWM7QUFDZCx5QkFBYSxNQUFNLFVBQVU7QUFDN0IseUJBQWEsaUJBQWlCLFNBQVMsWUFBWTtBQUMvQyxvQkFBTSxnQkFBZ0IsUUFBUSxVQUFVLFVBQVUsUUFBUTtBQUMxRCwrQkFBUyxXQUFXLFFBQVE7QUFDNUIsK0JBQVMsUUFBUSxlQUFlLFVBQVUsaUJBQWlCO0FBQUEsWUFDL0QsQ0FBQztBQUFBLFVBQ0w7QUFBQSxRQUNKLE9BQU87QUFDSCxlQUFLLE9BQU87QUFBQSxZQUNSLDJCQUEyQixhQUFhLEtBQUssc0JBQXNCLElBQUksd0JBQ2xELHNCQUFzQixPQUFPO0FBQUEsVUFDdEQ7QUFBQSxRQUNKO0FBQUEsTUFDSixTQUFTLE9BQU87QUFDWixhQUFLLE9BQU8sTUFBTSw4QkFBOEIsUUFBUSxLQUFNLE1BQWdCLE9BQU8sRUFBRTtBQUFBLE1BQzNGO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFsV0ksZ0JBREUsWUFDYSxVQUFTLFVBQVUsWUFBWTtBQW9XbEQsTUFBTyxxQkFBUTs7O0FHeFdmLE1BQU0sV0FBTixNQUFlO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNWCxPQUFjLFdBQVcsV0FBbUIsT0FBcUI7QUFDN0QsV0FBSyxxQkFBcUIsRUFBRSxLQUFLLE1BQU07QUFDbkMsYUFBSyxPQUFPLEtBQUssbUJBQW1CLFNBQVMsZ0JBQWdCLEtBQUssRUFBRTtBQUVwRSxjQUFNLGdCQUFnQixLQUFLLGlCQUFpQjtBQUM1QyxZQUFJLENBQUMsY0FBZTtBQUVwQixjQUFNLGlCQUFpQixLQUFLLG1CQUFtQixhQUFhO0FBQzVELGNBQU0sZUFBZSxLQUFLLHdCQUF3QixjQUFjO0FBRWhFLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFjO0FBRXRDLGNBQU0sbUJBQW1CLGVBQWU7QUFDeEMsY0FBTSxpQkFBaUIsYUFBYTtBQUVwQyxjQUFNLG1CQUFtQixTQUFTLGNBQWMsS0FBSztBQUNyRCx5QkFBaUIsWUFBWTtBQUM3Qix5QkFBaUIsS0FBSztBQUV0QixjQUFNLGVBQWUsU0FBUyxjQUFjLEtBQUs7QUFDakQscUJBQWEsWUFBWTtBQUN6QixxQkFBYSxjQUFjO0FBRTNCLHlCQUFpQixZQUFZLFlBQVk7QUFDekMsc0JBQWMsWUFBWSxnQkFBZ0I7QUFHMUMsYUFBSyxlQUFlLEVBQUUsS0FBSyxNQUFNO0FBQzdCLGdCQUFNLE1BQU0sS0FBSyxXQUFXO0FBRTVCLGdCQUFNLGVBQWUsS0FBSyxtQkFBbUI7QUFFN0MsY0FBSSxDQUFDLElBQUs7QUFDVixjQUFHLFNBQVMsY0FBYyxrQkFBa0IsU0FBUyxJQUFJLEVBQUc7QUFFNUQsZ0JBQU0sdUJBQXVCLFNBQVMsY0FBYyxLQUFLO0FBQ3pELCtCQUFxQixZQUFZLGVBQWU7QUFFaEQsY0FBSSxjQUFjO0FBQ2QsZ0JBQUksYUFBYSxzQkFBc0IsYUFBYSxXQUFXO0FBQUEsVUFDbkUsT0FBTztBQUNILGdCQUFJLFlBQVksb0JBQW9CO0FBQUEsVUFDeEM7QUFBQSxRQUNKLENBQUMsRUFBRSxNQUFNLFNBQU8sS0FBSyxPQUFPLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBQUEsTUFDbEUsQ0FBQyxFQUFFLE1BQU0sU0FBTyxLQUFLLE9BQU8sTUFBTSwwQkFBMEIsR0FBRyxFQUFFLENBQUM7QUFBQSxJQUN0RTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsT0FBYyxZQUFZLE9BQWUsV0FBbUIsTUFBb0I7QUFDNUUsV0FBSyxxQkFBcUIsRUFBRSxLQUFLLE1BQU07QUFDbkMsYUFBSyxPQUFPLEtBQUssb0JBQW9CLEtBQUssZ0JBQWdCLFNBQVMsRUFBRTtBQUVyRSxjQUFNLG1CQUFtQixLQUFLLG9CQUFvQjtBQUNsRCxZQUFJLENBQUMsaUJBQWtCO0FBRXZCLGNBQU0sRUFBRSxlQUFlLG9CQUFvQixjQUFjLFVBQVUsSUFBSTtBQUd2RSxlQUFPLEtBQUssUUFBUSxnQkFBZ0IsVUFBVSxTQUFTLEdBQUc7QUFFMUQsY0FBTSxVQUFVLFNBQVMsZUFBZSxTQUFTO0FBQ2pELFlBQUksQ0FBQyxRQUFTO0FBRWQsY0FBTSxjQUFjLFNBQVMsY0FBYyxLQUFLO0FBQ2hELG9CQUFZLFlBQVk7QUFFeEIsY0FBTSxXQUFXLFNBQVMsY0FBYyxLQUFLO0FBQzdDLGlCQUFTLFlBQVk7QUFDckIsaUJBQVMsWUFBWTtBQUVyQixjQUFNLGFBQWEsU0FBUyxjQUFjLEtBQUs7QUFFL0MsWUFBSSxjQUFjO0FBQ2QscUJBQVcsWUFBWTtBQUFBLFFBQzNCLE9BQU87QUFDRixxQkFBVyxVQUFVLElBQUksVUFBVSxpQkFBaUIsUUFBUSxLQUFLLEVBQUUsQ0FBQztBQUFBLFFBQ3pFO0FBRUEsbUJBQVcsYUFBYTtBQUN4QixtQkFBVyxZQUFZLFFBQVE7QUFFL0Isb0JBQVksWUFBWSxVQUFVO0FBQ2xDLGdCQUFRLFlBQVksV0FBVztBQUFBLE1BQ25DLENBQUMsRUFBRSxNQUFNLFNBQU8sS0FBSyxPQUFPLE1BQU0sMkJBQTJCLEdBQUcsRUFBRSxDQUFDO0FBQUEsSUFDdkU7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLE9BQWMsVUFBVSxPQUFlLElBQVksT0FBcUI7QUFDcEUsc0JBQVEsV0FBVyxLQUFLLEVBQUUsS0FBSyxNQUFNO0FBQ2pDLGNBQU0sVUFBVSxTQUFTLGNBQWMsS0FBSztBQUM1QyxZQUFJLENBQUMsUUFBUztBQUVkLGNBQU0sWUFBWSxTQUFTLGNBQWMsS0FBSztBQUM5QyxrQkFBVSxVQUFVLElBQUksUUFBUSxNQUFNO0FBRXRDLGNBQU0sYUFBYSxTQUFTLGNBQWMsS0FBSztBQUMvQyxtQkFBVyxVQUFVLElBQUksUUFBUSxPQUFPO0FBRXhDLGNBQU0sWUFBWSxTQUFTLGNBQWMsS0FBSztBQUM5QyxrQkFBVSxhQUFhLFlBQVksR0FBRztBQUN0QyxrQkFBVSxhQUFhLFNBQVMsS0FBSztBQUNyQyxrQkFBVSxVQUFVLElBQUksUUFBUSxRQUFRLFFBQVEsa0JBQWtCLFFBQVE7QUFDMUUsa0JBQVUsS0FBSztBQUNmLGtCQUFVLGNBQWM7QUFFeEIsbUJBQVcsWUFBWSxTQUFTO0FBQ2hDLGtCQUFVLFlBQVksVUFBVTtBQUNoQyxnQkFBUSxZQUFZLFNBQVM7QUFBQSxNQUNqQyxDQUFDLEVBQUUsTUFBTSxTQUFPLEtBQUssT0FBTyxNQUFNLHlCQUF5QixHQUFHLEVBQUUsQ0FBQztBQUFBLElBQ3JFO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxPQUFjLFFBQVEsTUFBMEIsVUFBa0IsVUFBMEI7QUFDeEYsV0FBSyxPQUFPLEtBQUssVUFBVSxJQUFJLEtBQUssUUFBUSxFQUFFO0FBRTlDLFVBQUksU0FBUyxTQUFTO0FBQ2xCLHdCQUFRLFdBQVcsVUFBVSxlQUFlLEVBQUUsS0FBSyxNQUFNO0FBQ3JELGVBQUssU0FBUyxVQUFVLFFBQVE7QUFBQSxRQUNwQyxDQUFDLEVBQUUsTUFBTSxTQUFPLEtBQUssT0FBTyxNQUFNLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztBQUFBLE1BQ3BFLFdBQVcsU0FBUyxVQUFVO0FBQzFCLHdCQUFRLFdBQVcsVUFBVSxnQkFBZ0IsRUFBRSxLQUFLLE1BQU07QUFDdEQsZUFBSyxVQUFVLFVBQVUsUUFBUTtBQUFBLFFBQ3JDLENBQUMsRUFBRSxNQUFNLFNBQU8sS0FBSyxPQUFPLE1BQU0seUJBQXlCLEdBQUcsRUFBRSxDQUFDO0FBQUEsTUFDckU7QUFBQSxJQUNKO0FBQUEsSUFFQSxPQUFlLFVBQVUsVUFBa0IsVUFBMEI7QUFDakUsWUFBTSxpQkFBMkIsS0FBSztBQUFBLFFBQ2xDLGFBQWEsUUFBUSxhQUFhLGVBQWUsS0FBSztBQUFBLE1BQzFEO0FBRUEsWUFBTSxrQkFBa0IsU0FBUyxjQUFjLEtBQUs7QUFDcEQsc0JBQWdCLFlBQVksc0JBQXNCLFVBQVUsVUFBVSxlQUFlLFNBQVMsUUFBUSxDQUFDO0FBQ3ZHLHNCQUFnQixhQUFhLFFBQVEsR0FBRyxRQUFRLE1BQU07QUFFdEQsWUFBTSxrQkFBa0IsU0FBUyxjQUFjLFVBQVUsZ0JBQWdCO0FBQ3pFLHVCQUFpQixZQUFZLGVBQWU7QUFFNUMseUJBQVcsb0JBQW9CLFFBQVE7QUFBQSxJQUMzQztBQUFBLElBRUEsT0FBZSxTQUFTLFVBQWtCLFVBQTBCO0FBQ2hFLFlBQU0sZUFBZSxhQUFhLFFBQVEsYUFBYSxhQUFhO0FBRXBFLFlBQU0saUJBQWlCLFNBQVMsY0FBYyxLQUFLO0FBQ25ELHFCQUFlLFlBQVkscUJBQXFCLFVBQVUsVUFBVSxpQkFBaUIsUUFBUTtBQUM3RixxQkFBZSxhQUFhLFFBQVEsR0FBRyxRQUFRLE1BQU07QUFFckQsWUFBTSxpQkFBaUIsU0FBUyxjQUFjLFVBQVUsZUFBZTtBQUN2RSxzQkFBZ0IsWUFBWSxjQUFjO0FBRTFDLHlCQUFXLG9CQUFvQixRQUFRO0FBQUEsSUFDM0M7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLE9BQWMsV0FBVyxVQUF3QjtBQUM3QyxZQUFNLFVBQVUsU0FBUyxrQkFBa0IsR0FBRyxRQUFRLE1BQU0sRUFBRSxDQUFDO0FBQy9ELGVBQVMsT0FBTztBQUFBLElBQ3BCO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxPQUFjLGNBQWMsU0FBd0I7QUFDaEQsWUFBTSxNQUFNLEtBQUssV0FBVztBQUM1QixVQUFJLEtBQUs7QUFFTCxpQkFBUyxJQUFJLEdBQUcsSUFBSSxJQUFJLFNBQVMsUUFBUSxLQUFLO0FBQzFDLGNBQUksU0FBUyxDQUFDLEVBQUUsVUFBVSxPQUFPLFFBQVEsUUFBUTtBQUFBLFFBQ3JEO0FBQUEsTUFDSixPQUFPO0FBRUYsaUJBQVMsSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLO0FBQ3pCLGdCQUFNLFVBQVUsU0FBUyxjQUFjLEdBQUcsVUFBVSxRQUFRLG9CQUFvQixDQUFDLEdBQUc7QUFDcEYsbUJBQVMsVUFBVSxPQUFPLFFBQVEsUUFBUTtBQUFBLFFBQzlDO0FBQUEsTUFDSjtBQUVBLGNBQVEsVUFBVSxJQUFJLFFBQVEsUUFBUTtBQUFBLElBQzFDO0FBQUE7QUFBQSxJQUlBLE9BQWUsYUFBNkI7QUFFeEMsVUFBSSxNQUFNLFNBQVMsY0FBYyxVQUFVLFFBQVE7QUFDbkQsVUFBSSxJQUFLLFFBQU87QUFHaEIsWUFBTSxXQUFXLENBQUMsU0FBUyxZQUFZLFNBQVM7QUFDaEQsWUFBTSxRQUFRLE1BQU0sS0FBSyxTQUFTLGlCQUFpQixlQUFlLENBQUM7QUFFbkUsaUJBQVcsUUFBUSxPQUFPO0FBQ3JCLGNBQU0sUUFBUSxLQUFLLGFBQWEsT0FBTztBQUN2QyxZQUFJLFNBQVMsU0FBUyxTQUFTLEtBQUssR0FBRztBQUNuQyxjQUFJLFNBQVMsS0FBSztBQUNsQixpQkFBTSxRQUFRO0FBQ1Ysa0JBQU0sUUFBUSxTQUFTLE9BQU8sT0FBSyxPQUFRLGNBQWMsV0FBVyxDQUFDLElBQUksQ0FBQztBQUMxRSxnQkFBSSxNQUFNLFVBQVUsR0FBRztBQUNuQixxQkFBTztBQUFBLFlBQ1g7QUFDQSxxQkFBUyxPQUFPO0FBQ2hCLGdCQUFJLFdBQVcsU0FBUyxLQUFNO0FBQUEsVUFDbEM7QUFBQSxRQUNKO0FBQUEsTUFDTDtBQUNBLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxPQUFlLHFCQUFxQztBQUNoRCxVQUFJLE9BQU8sU0FBUyxjQUFjLHFCQUFxQjtBQUN2RCxhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsT0FBZSxtQkFBbUM7QUFFOUMsVUFBSSxRQUFRLFNBQVMsY0FBYyxVQUFVLGtCQUFrQjtBQUMvRCxVQUFJLE1BQU8sUUFBTztBQUdsQixZQUFNLFdBQVcsQ0FBQyxXQUFXLFVBQVUsV0FBVztBQUNsRCxZQUFNLFVBQVUsTUFBTSxLQUFLLFNBQVMsaUJBQWlCLEtBQUssQ0FBQztBQUMzRCxpQkFBVyxPQUFPLFNBQVM7QUFDdEIsWUFBSSxJQUFJLFNBQVMsU0FBUyxHQUFHO0FBQ3pCLGNBQUksYUFBYTtBQUNqQixtQkFBUyxJQUFJLEdBQUcsSUFBSSxJQUFJLFNBQVMsUUFBUSxLQUFLO0FBQzFDLGdCQUFJLFNBQVMsS0FBSyxPQUFLLElBQUksU0FBUyxDQUFDLEVBQUUsYUFBYSxTQUFTLENBQUMsQ0FBQyxHQUFHO0FBQzlEO0FBQUEsWUFDSjtBQUFBLFVBQ0o7QUFDQSxjQUFJLGNBQWMsRUFBRyxRQUFPO0FBQUEsUUFDaEM7QUFBQSxNQUNMO0FBQ0EsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUVBLE9BQWUsbUJBQW1CLE9BQWdDO0FBRTlELFlBQU0sV0FBVyxDQUFDLFdBQVcsUUFBUTtBQUNyQyxlQUFTLElBQUksR0FBRyxJQUFJLE1BQU0sU0FBUyxRQUFRLEtBQUs7QUFDNUMsY0FBTSxRQUFRLE1BQU0sU0FBUyxDQUFDO0FBQzlCLFlBQUksU0FBUyxLQUFLLE9BQUssTUFBTSxhQUFhLFNBQVMsQ0FBQyxDQUFDLEdBQUc7QUFDcEQsaUJBQU87QUFBQSxRQUNYO0FBQUEsTUFDSjtBQUVBLGFBQU8sU0FBUyxjQUFjLFVBQVUsT0FBTztBQUFBLElBQ25EO0FBQUEsSUFFQSxPQUFlLHdCQUF3QixTQUF5QztBQUM1RSxVQUFJLENBQUMsUUFBUyxRQUFPO0FBRXJCLFVBQUksUUFBUSxTQUFTLFNBQVMsRUFBRyxRQUFPLFFBQVEsU0FBUyxDQUFDO0FBRTFELGFBQU8sU0FBUyxjQUFjLFVBQVUsS0FBSztBQUFBLElBQ2pEO0FBQUEsSUFFQSxPQUFlLHNCQUE2SDtBQUV4SSxZQUFNLGtCQUFrQixTQUFTLGNBQWMsVUFBVSxRQUFRO0FBQ2pFLFlBQU0sdUJBQXVCLFNBQVMsY0FBYyxVQUFVLGNBQWM7QUFDNUUsWUFBTSxzQkFBc0IsU0FBUyxjQUFjLFVBQVUsYUFBYTtBQUMxRSxZQUFNLHlCQUF5QixTQUFTLGNBQWMsVUFBVSxnQkFBZ0I7QUFFaEYsVUFBSSxnQkFBZ0IsaUJBQWlCLGFBQWE7QUFDbEQsVUFBSSxxQkFBcUIsc0JBQXNCLGFBQWE7QUFDNUQsVUFBSSxlQUFlLHdCQUF3QixhQUFhO0FBRXhELFVBQUksWUFBWTtBQUNoQixVQUFJLCtCQUErQixZQUFZO0FBQzNDLG9CQUFZLG9CQUFvQixVQUFVO0FBQUEsTUFDOUMsV0FBVyxxQkFBcUI7QUFDNUIsb0JBQVksb0JBQW9CO0FBQUEsTUFDcEM7QUFFQSxVQUFJLGlCQUFpQixvQkFBb0I7QUFDckMsZUFBTyxFQUFFLGVBQWUsb0JBQW9CLGNBQWMsVUFBVTtBQUFBLE1BQ3hFO0FBR0EsWUFBTSxRQUFRLEtBQUssaUJBQWlCO0FBQ3BDLFVBQUksT0FBTztBQUNQLGNBQU0sVUFBVSxLQUFLLG1CQUFtQixLQUFLO0FBQzdDLFlBQUksU0FBUztBQUdULG1CQUFRLElBQUUsR0FBRyxJQUFFLFFBQVEsU0FBUyxRQUFRLEtBQUs7QUFDekMsa0JBQU0sUUFBUSxRQUFRLFNBQVMsQ0FBQztBQUVoQyxrQkFBTSxRQUFRLEtBQUssd0JBQXdCLE9BQU87QUFDbEQsZ0JBQUksVUFBVSxNQUFPO0FBR3JCLDRCQUFnQixNQUFNO0FBR3RCLGtCQUFNLFVBQVUsTUFBTSxTQUFTLENBQUM7QUFDaEMsZ0JBQUksU0FBUztBQUNULDZCQUFlLFFBQVE7QUFFdEIsb0JBQU0sT0FBTyxRQUFRLGNBQWMsS0FBSyxLQUFLLFFBQVEsU0FBUyxDQUFDO0FBQy9ELGtCQUFJLE1BQU07QUFDTixvQkFBSSxnQkFBZ0IsV0FBWSxhQUFZLEtBQUssVUFBVTtBQUFBLG9CQUN0RCxhQUFZLEtBQUs7QUFBQSxjQUMxQjtBQUVBLG9CQUFNLFFBQVEsUUFBUSxjQUFjLEtBQUssS0FBSyxRQUFRLFNBQVMsQ0FBQztBQUNoRSxrQkFBSSxNQUFPLHNCQUFxQixNQUFNO0FBQUEsWUFDM0M7QUFFQSxnQkFBSSxpQkFBaUIsb0JBQW9CO0FBQ3BDLHFCQUFPLEVBQUUsZUFBZSxvQkFBb0IsY0FBYyxVQUFVO0FBQUEsWUFDekU7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFFQSxhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsT0FBZSx1QkFBc0M7QUFDakQsYUFBTyxJQUFJLFFBQVEsQ0FBQ0MsYUFBWTtBQUM1QixZQUFJLFVBQVU7QUFDZCxjQUFNLGFBQWE7QUFDbkIsY0FBTSxXQUFXLFlBQVksTUFBTTtBQUMvQixjQUFJLEtBQUssaUJBQWlCLEdBQUc7QUFDekIsMEJBQWMsUUFBUTtBQUN0QixZQUFBQSxTQUFRO0FBQUEsVUFDWixPQUFPO0FBQ0g7QUFDQSxnQkFBSSxVQUFVLFlBQVk7QUFDckIsNEJBQWMsUUFBUTtBQUN0QixtQkFBSyxPQUFPLE1BQU0sb0NBQW9DO0FBQ3RELGNBQUFBLFNBQVE7QUFBQSxZQUNiO0FBQUEsVUFDSjtBQUFBLFFBQ0osR0FBRyxHQUFHO0FBQUEsTUFDVixDQUFDO0FBQUEsSUFDTDtBQUFBLElBRUEsT0FBZSxpQkFBZ0M7QUFDMUMsYUFBTyxJQUFJLFFBQVEsQ0FBQ0EsYUFBWTtBQUM3QixZQUFJLFVBQVU7QUFDZCxjQUFNLGFBQWE7QUFDbkIsY0FBTSxXQUFXLFlBQVksTUFBTTtBQUMvQixjQUFJLEtBQUssV0FBVyxHQUFHO0FBQ25CLDBCQUFjLFFBQVE7QUFDdEIsWUFBQUEsU0FBUTtBQUFBLFVBQ1osT0FBTztBQUNIO0FBQ0EsZ0JBQUksVUFBVSxZQUFZO0FBQ3JCLDRCQUFjLFFBQVE7QUFDdEIsbUJBQUssT0FBTyxNQUFNLDhCQUE4QjtBQUNoRCxjQUFBQSxTQUFRO0FBQUEsWUFDYjtBQUFBLFVBQ0o7QUFBQSxRQUNKLEdBQUcsR0FBRztBQUFBLE1BQ1YsQ0FBQztBQUFBLElBQ0w7QUFBQSxFQUNKO0FBcFhJLGdCQURFLFVBQ2EsVUFBUyxVQUFVLFVBQVU7QUFzWGhELE1BQU8sbUJBQVE7OztBQzlYUixXQUFTLHFCQUE2QjtBQUN6QyxXQUFPLDhCQUFjLEtBQUssS0FBVyxVQUFVO0FBQUEsRUFDbkQ7OztBQ1FPLFdBQVMsbUJBQ1osVUFDQSxNQUNBLFdBQ007QUFDTixRQUFJLFdBQVcsOEJBQWMsS0FBSyxLQUFXLFdBQVc7QUFHeEQsUUFBSSxZQUFZO0FBRWhCLFFBQUcsU0FBUyxTQUFTO0FBQ2pCLFVBQUcsQ0FBQyxTQUFTLFNBQVM7QUFFbEIsb0JBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUloQixPQUFPO0FBRUgsb0JBQVk7QUFBQSx1QkFDRCxTQUFTLE9BQU87QUFBQSwrQ0FDUSxTQUFTLE9BQU87QUFBQTtBQUFBLE1BRXZEO0FBQUEsSUFDSixPQUFPO0FBQ0gsa0JBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUloQjtBQUdBLFVBQU0sV0FBVyxDQUFDLFFBQVEsZUFBZSxVQUFVLFNBQVM7QUFDNUQsYUFBUyxRQUFRLFNBQU87QUFDcEIsWUFBTSxRQUFRLElBQUksT0FBTyxTQUFTLEdBQUcsVUFBVSxHQUFHO0FBQ2xELGlCQUFXLFNBQVMsUUFBUSxPQUFPLFNBQVMsR0FBRyxLQUFLLEVBQUU7QUFBQSxJQUMxRCxDQUFDO0FBRUQsV0FBTyxTQUNGLFFBQVEsdUJBQXVCLElBQUksRUFDbkMsUUFBUSxpQ0FBaUMsWUFBWSxjQUFjLFNBQVMsRUFDNUUsUUFBUSx3QkFBd0IsWUFBWSxxQ0FBcUMsZ0NBQWdDLEVBQ2pILFFBQVEsa0JBQWtCLFNBQVMsUUFBUSxFQUMzQyxRQUFRLGNBQWMsU0FBUyxJQUFJLEVBQ25DLFFBQVEsK0JBQStCLFNBQVMsRUFDaEQsUUFBUSw2QkFBNkIsRUFBRTtBQUFBLEVBQ2hEOzs7QUN4RE8sV0FBUyx5QkFDWixTQUNBLDBCQUNBLHFCQUNBLHlCQUNNO0FBQ04sVUFBTSxXQUFXLDhCQUFjLEtBQUssS0FBVyxnQkFBZ0I7QUFFL0QsV0FBTyxTQUNGLFFBQVEsaUJBQWlCLE9BQU8sRUFDaEMsUUFBUSxrQ0FBa0MsMkJBQTJCLFlBQVksRUFBRSxFQUNuRixRQUFRLDZCQUE2QixzQkFBc0IsWUFBWSxFQUFFLEVBQ3pFLFFBQVEsaUNBQWlDLDBCQUEwQixZQUFZLEVBQUU7QUFBQSxFQUMxRjs7O0FDYk8sV0FBUyx3QkFBd0IsU0FBMEI7QUFDOUQsVUFBTSxXQUFXLDhCQUFjLEtBQUssS0FBVyxlQUFlO0FBRTlELFdBQU8sU0FDRixRQUFRLGtCQUFrQixVQUFVLGFBQWEsRUFBRSxFQUNuRCxRQUFRLGVBQWUsVUFBVSxZQUFZLE9BQU8sRUFDcEQsUUFBUSx5QkFBeUIsVUFBVSx5QkFBeUIsK0JBQStCO0FBQUEsRUFDNUc7OztBQ1BPLFdBQVMsZ0JBQXdCO0FBQ3BDLFdBQU8sOEJBQWMsS0FBSyxLQUFXLFVBQVU7QUFBQSxFQUNuRDs7O0FDUUEsTUFBQUMsZUFBcUI7OztBQ1hyQjs7O0FDQUE7QUFlQSxNQUFNLGtCQUFrQixlQUFzQyxtQkFBbUI7SUFDL0UsS0FBSyxNQUFNLDBEQUFnQixLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsbUJBQWtCLENBQUU7SUFDakUsVUFBVSxNQUFPLE9BQWUsd0JBQXdCLFFBQVE7R0FDakU7OztBRHVDRCxNQUFNLGVBQU4sTUFBa0I7SUFBbEIsY0FBQTtBQUNtQixXQUFBLGVBR1gsQ0FBQTtJQXdEUjtJQXRERSxNQUFNLE1BQW1CO0FBQ3ZCLGFBQU8sZ0JBQWdCLE1BQU0sSUFBSTtJQUNuQztJQUVBLEtBQUssTUFBd0I7QUFDM0IsYUFBTyxnQkFBZ0IsS0FBSyxJQUFJO0lBQ2xDO0lBRUEsWUFBUztBQUNQLGFBQU8sZ0JBQWdCLFVBQVM7SUFDbEM7SUFPQSxZQUNFLFdBQ0EsY0FBcUM7QUFFckMsWUFBTSxpQkFBaUIsZ0JBQWdCLFlBQVksV0FBVyxDQUFDLFNBQTZCO0FBQzFGLHFCQUFhLElBQUk7TUFDbkIsQ0FBQztBQUVELFdBQUssYUFBYSxLQUFLLEVBQUUsV0FBVyxlQUFjLENBQUU7QUFDcEQsYUFBTztJQUNUO0lBRUEsTUFBTSxlQUFlLGdCQUFvQztBQUN2RCxVQUFJLFVBQVUsWUFBVyxNQUFPLFlBQVk7QUFDMUMsY0FBTyxnQkFBd0IsZUFBZSxjQUFjO2FBQ3ZEO0FBQ0wsY0FBTSxlQUFlLE9BQU07O0FBRzdCLGVBQVMsUUFBUSxHQUFHLFFBQVEsS0FBSyxhQUFhLFFBQVEsU0FBUztBQUM3RCxjQUFNLFdBQVcsS0FBSyxhQUFhLEtBQUs7QUFFeEMsWUFBSSxtQkFBb0IsTUFBTSxTQUFTLGdCQUFpQjtBQUN0RCxlQUFLLGFBQWEsT0FBTyxPQUFPLENBQUM7QUFDakM7OztJQUdOO0lBRUEsTUFBTSxtQkFBbUIsV0FBa0I7QUFDekMsaUJBQVcsWUFBWSxDQUFDLEdBQUcsS0FBSyxZQUFZLEdBQUc7QUFDN0MsWUFBSSxDQUFDLGFBQWEsY0FBYyxTQUFTLFdBQVc7QUFDbEQsZ0JBQU0saUJBQWlCLE1BQU0sU0FBUztBQUN0QyxnQkFBTSxLQUFLLGVBQWUsY0FBYzs7O0lBRzlDOztBQUdGLE1BQU0sU0FBUyxJQUFJLGFBQVk7OztBRGpHL0Isa0JBQWdCLFlBQVksSUFBSSxrQkFBa0IsQ0FBQztBQUduRCxTQUFPLFlBQVksT0FBTyxDQUFDLFNBQVM7QUFDaEMsWUFBUSxJQUFJLFlBQVksR0FBRyxLQUFLLElBQUk7QUFBQSxFQUN4QyxDQUFDO0FBRUQsU0FBTyxZQUFZLFNBQVMsQ0FBQyxTQUFTO0FBQ2xDLFlBQVEsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLElBQUk7QUFDNUMsb0JBQVEsVUFBVSxTQUFTLGdCQUFnQixLQUFLLEtBQUssS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUMxRSxDQUFDO0FBa0JELFNBQU8saUJBQWlCLFFBQVEsWUFBWTtBQUV4QyxRQUFJLENBQUMsZ0JBQWdCLFFBQVMsaUJBQWdCLFlBQVksSUFBSSxrQkFBa0IsQ0FBQztBQUNqRixVQUFNLGdCQUFnQixRQUFRLEtBQUs7QUFHbkMsSUFBQyxPQUFlLGtCQUFrQjtBQUFBLE1BQzlCLFlBQVksT0FBTyxVQUFrQjtBQUVqQyxjQUFNLGVBQWU7QUFBQSxNQUN6QjtBQUFBLElBQ0o7QUFFQSwyQkFBdUI7QUFHdkIsVUFBTSxlQUFlO0FBR3JCLFVBQU0sbUJBQW1CO0FBR3pCLFdBQU8saUJBQWlCLGNBQWMsWUFBWTtBQUM5QyxZQUFNLGNBQWM7QUFBQSxJQUN4QixDQUFDO0FBQUEsRUFDTCxDQUFDO0FBR0QsaUJBQWUsZ0JBQWdCO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxZQUFZLEVBQUc7QUFDM0MsUUFBSSxTQUFTLGNBQWMsOEJBQThCLEVBQUc7QUFFNUQsdUJBQVcsc0JBQXNCO0FBRWpDLFVBQU0sYUFBYSxtQkFBVztBQUM5QixVQUFNLGNBQWMsbUJBQVc7QUFFL0IsUUFBSSxZQUFzQixDQUFDO0FBQzNCLFFBQUksYUFBdUIsQ0FBQztBQUU1QixRQUFJO0FBQ0Esa0JBQVksTUFBTSxnQkFBZ0IsUUFBUSxRQUFRLFVBQVU7QUFDNUQsbUJBQWEsTUFBTSxnQkFBZ0IsUUFBUSxRQUFRLFdBQVc7QUFBQSxJQUNsRSxTQUFRLEdBQUc7QUFDUCw2QkFBTyxNQUFNLGdEQUFnRCxDQUFDO0FBQUEsSUFDbEU7QUFFQSxVQUFNLGFBQWEsVUFBVSxPQUFPLGNBQVksU0FBUyxTQUFTLGdCQUFnQixLQUFLLENBQUM7QUFDeEYsVUFBTSxjQUFjLFdBQVcsT0FBTyxjQUFZLFNBQVMsU0FBUyxnQkFBZ0IsTUFBTSxDQUFDO0FBRTNGLDJCQUFPLEtBQUssK0JBQStCO0FBQzNDLHFCQUFTLFdBQVcsWUFBWSxVQUFVO0FBQzFDLHFCQUFTLFlBQVksVUFBVSxZQUFZLGFBQWEsQ0FBQztBQUN6RCxxQkFBUyxZQUFZLFdBQVcsWUFBWSxjQUFjLENBQUM7QUFDM0QscUJBQVMsWUFBWSxTQUFTLFlBQVksYUFBYSxDQUFDO0FBRXhELHFCQUFTLFVBQVUsc0JBQXNCLHVCQUF1QixVQUFVLGVBQWU7QUFDekYscUJBQVMsVUFBVSx1QkFBdUIsd0JBQXdCLFVBQVUsZ0JBQWdCO0FBRTVGLGVBQVc7QUFHWCwwQkFBc0I7QUFHdEIsb0JBQVEsV0FBVyxVQUFVLGVBQWUsRUFBRSxLQUFLLFlBQVk7QUFFM0QsWUFBTSx3QkFBd0IsYUFBYSxRQUFRLGFBQWEsYUFBYSxNQUFNO0FBQ25GLFlBQU0sd0JBQXdCLFNBQVMsY0FBYyxLQUFLO0FBQzFELDRCQUFzQixZQUFZLHdCQUF3QixxQkFBcUI7QUFDL0UsZUFBUyxjQUFjLFVBQVUsZUFBZSxHQUFHLFlBQVkscUJBQXFCO0FBR3BGLGlCQUFXLFNBQVMsWUFBWTtBQUM1QixZQUFJO0FBQ0EsZ0JBQU0sZ0JBQVksbUJBQUssWUFBWSxLQUFLO0FBQ3hDLGdCQUFNLFVBQVUsTUFBTSxnQkFBZ0IsUUFBUSxTQUFTLFNBQVM7QUFDaEUsZ0JBQU0sV0FBVyx3QkFBZ0Isd0JBQXdCLE9BQU87QUFFaEUsY0FBSSxVQUFVO0FBQ1YsZ0JBQUksU0FBUyxLQUFLLFlBQVksTUFBTSxXQUFXO0FBQzNDLCtCQUFTLFFBQVEsU0FBUyxPQUFPO0FBQUEsZ0JBQzdCLE1BQU0sU0FBUztBQUFBLGdCQUNmLGFBQWEsU0FBUztBQUFBLGdCQUN0QixRQUFRLFNBQVM7QUFBQSxnQkFDakIsU0FBUyxTQUFTO0FBQUEsZ0JBQ2xCLFdBQVcsU0FBUztBQUFBLGdCQUNwQixRQUFRLFNBQVM7QUFBQSxjQUNyQixDQUFDO0FBQUEsWUFDTDtBQUFBLFVBQ0o7QUFBQSxRQUNKLFNBQVMsR0FBRztBQUNSLGlDQUFPLE1BQU0scUNBQXFDLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFBQSxRQUNuRTtBQUFBLE1BQ0o7QUFBQSxJQUNKLENBQUMsRUFBRSxNQUFNLFNBQU8sdUJBQU8sTUFBTSw2QkFBNkIsR0FBRyxDQUFDO0FBRzlELGVBQVcsVUFBVSxhQUFhO0FBQzlCLFVBQUk7QUFDQSxjQUFNLGlCQUFhLG1CQUFLLGFBQWEsTUFBTTtBQUMzQyxjQUFNLFVBQVUsTUFBTSxnQkFBZ0IsUUFBUSxTQUFTLFVBQVU7QUFDakUsY0FBTSxXQUFXLHdCQUFnQix3QkFBd0IsT0FBTztBQUVoRSxZQUFJLFVBQVU7QUFDViwyQkFBUyxRQUFRLFVBQVUsUUFBUTtBQUFBLFlBQy9CLE1BQU0sU0FBUztBQUFBLFlBQ2YsYUFBYSxTQUFTO0FBQUEsWUFDdEIsUUFBUSxTQUFTO0FBQUEsWUFDakIsU0FBUyxTQUFTO0FBQUEsWUFDbEIsV0FBVyxTQUFTO0FBQUEsWUFDcEIsUUFBUSxTQUFTO0FBQUEsVUFDckIsQ0FBQztBQUFBLFFBQ0w7QUFBQSxNQUNKLFNBQVMsR0FBRztBQUNSLCtCQUFPLE1BQU0sc0NBQXNDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFBQSxNQUNyRTtBQUFBLElBQ0o7QUFFQSx1QkFBVyxxQkFBcUI7QUFDaEMsdUJBQVcsZUFBZTtBQUFBLEVBTzlCO0FBRUEsV0FBUyx5QkFBK0I7QUFDcEMsVUFBTSxXQUFtQztBQUFBLE1BQ3JDLENBQUMsYUFBYSxlQUFlLEdBQUc7QUFBQSxNQUNoQyxDQUFDLGFBQWEsd0JBQXdCLEdBQUc7QUFBQSxNQUN6QyxDQUFDLGFBQWEsV0FBVyxHQUFHO0FBQUEsSUFDaEM7QUFFQSxlQUFXLENBQUMsS0FBSyxZQUFZLEtBQUssT0FBTyxRQUFRLFFBQVEsR0FBRztBQUN4RCxVQUFJLENBQUMsYUFBYSxRQUFRLEdBQUcsR0FBRztBQUM1QixxQkFBYSxRQUFRLEtBQUssWUFBWTtBQUFBLE1BQzFDO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFFQSxpQkFBZSxpQkFBZ0M7QUFDM0MsVUFBTSxlQUFlLGFBQWEsUUFBUSxhQUFhLGFBQWE7QUFFcEUsUUFBSSxDQUFDLGdCQUFnQixpQkFBaUIsV0FBVztBQUM3QyxtQkFBYSxRQUFRLGFBQWEsZUFBZSxTQUFTO0FBQzFEO0FBQUEsSUFDSjtBQUVBLFVBQU0sZ0JBQVksbUJBQUssbUJBQVcsWUFBWSxZQUFZO0FBTzFELFFBQUk7QUFDQSxVQUFJLENBQUMsTUFBTSxnQkFBZ0IsUUFBUSxPQUFPLFNBQVMsR0FBRztBQUNsRCxxQkFBYSxRQUFRLGFBQWEsZUFBZSxTQUFTO0FBQzFEO0FBQUEsTUFDSjtBQUdBLGVBQVMsZUFBZSxhQUFhLEdBQUcsT0FBTztBQUUvQyxZQUFNLFVBQVUsTUFBTSxnQkFBZ0IsUUFBUSxTQUFTLFNBQVM7QUFFaEUsWUFBTSxlQUFlLFNBQVMsY0FBYyxPQUFPO0FBQ25ELG1CQUFhLGFBQWEsTUFBTSxhQUFhO0FBQzdDLG1CQUFhLGNBQWM7QUFDM0IsZUFBUyxLQUFLLFlBQVksWUFBWTtBQUFBLElBQzFDLFNBQVMsR0FBRztBQUNSLDZCQUFPLE1BQU0sNEJBQTRCLENBQUM7QUFBQSxJQUM5QztBQUFBLEVBQ0o7QUFFQSxpQkFBZSxxQkFBb0M7QUFDL0MsVUFBTSxjQUFjLG1CQUFXO0FBQy9CLFFBQUk7QUFDQSxVQUFJLENBQUMsTUFBTSxnQkFBZ0IsUUFBUSxPQUFPLFdBQVcsRUFBRztBQUV4RCxZQUFNLGFBQWEsTUFBTSxnQkFBZ0IsUUFBUSxRQUFRLFdBQVc7QUFDcEUsWUFBTSxnQkFBZ0IsV0FBVyxPQUFPLGNBQVksU0FBUyxTQUFTLGdCQUFnQixNQUFNLENBQUM7QUFFN0YsWUFBTSxpQkFBMkIsS0FBSztBQUFBLFFBQ2xDLGFBQWEsUUFBUSxhQUFhLGVBQWUsS0FBSztBQUFBLE1BQzFEO0FBRUEsaUJBQVcsVUFBVSxlQUFlO0FBQ2hDLFlBQUksZUFBZSxTQUFTLE1BQU0sR0FBRztBQUNqQyxnQkFBTSxtQkFBVyxXQUFXLE1BQU07QUFBQSxRQUN0QztBQUFBLE1BQ0o7QUFBQSxJQUNKLFNBQVMsR0FBRztBQUNSLDZCQUFPLE1BQU0sNkJBQTZCLENBQUM7QUFBQSxJQUMvQztBQUFBLEVBQ0o7QUFFQSxpQkFBZSxhQUE0QjtBQUN2QyxVQUFNLGtCQUFrQixTQUFTLGNBQWMsVUFBVSxnQkFBZ0I7QUFDekUsUUFBSSxDQUFDLGdCQUFpQjtBQUV0QixvQkFBZ0IsWUFBWSxtQkFBbUI7QUFFL0MsVUFBTSxPQUFPLE1BQU0sbUJBQVcsVUFBVTtBQUN4QyxVQUFNLFdBQVcsU0FBUyxlQUFlLFdBQVc7QUFDcEQsUUFBSSxDQUFDLFNBQVU7QUFhZixlQUFXLFVBQVcsS0FBSyxTQUEyQjtBQUNsRCxZQUFNLFlBQVksTUFBTSxtQkFBVyxrQkFBa0IsZ0JBQVEsbUJBQW1CLE9BQU8sUUFBUSxDQUFDO0FBQ2hHLGVBQVMsYUFBYSxtQkFBbUIsUUFBUSxVQUFVLFNBQVM7QUFBQSxJQUN4RTtBQUdBLGVBQVcsU0FBVSxLQUFLLFFBQTBCO0FBQ2hELFlBQU0sWUFBWSxNQUFNLG1CQUFXLGlCQUFpQixnQkFBUSxtQkFBbUIsTUFBTSxRQUFRLENBQUM7QUFDOUYsZUFBUyxhQUFhLG1CQUFtQixPQUFPLFNBQVMsU0FBUztBQUFBLElBQ3RFO0FBR0EsVUFBTSxhQUFhLFNBQVMsaUJBQWlCLGVBQWU7QUFDNUQsZUFBVyxRQUFRLENBQUMsUUFBUTtBQUN4QixVQUFJLGlCQUFpQixTQUFTLE1BQU07QUFDaEMsY0FBTSxPQUFPLElBQUksYUFBYSxXQUFXO0FBQ3pDLGNBQU0sT0FBTyxJQUFJLGFBQWEsV0FBVyxHQUFHLFlBQVk7QUFFeEQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFNO0FBRXBCLFlBQUksSUFBSSxhQUFhLE9BQU8sTUFBTSxXQUFXO0FBQ3pDLDZCQUFXLFlBQVksTUFBTSxJQUFJO0FBQ2pDLGNBQUksVUFBVSxPQUFPLFFBQVEsY0FBYztBQUMzQyxjQUFJLFVBQVUsSUFBSSxRQUFRLGdCQUFnQjtBQUMxQyxjQUFJLGFBQWEsU0FBUyxXQUFXO0FBQ3JDLGNBQUksSUFBSSxXQUFXLENBQUMsR0FBRztBQUNuQixnQkFBSSxXQUFXLENBQUMsRUFBRSxjQUFjO0FBQUEsVUFDcEM7QUFBQSxRQUNKLE9BQU87QUFDSCw2QkFBVyxVQUFVLGdCQUFRLG1CQUFtQixJQUFJLEdBQUcsSUFBSTtBQUMzRCxjQUFJLFVBQVUsT0FBTyxRQUFRLGdCQUFnQjtBQUM3QyxjQUFJLFVBQVUsSUFBSSxRQUFRLGNBQWM7QUFDeEMsY0FBSSxhQUFhLFNBQVMsU0FBUztBQUNuQyxjQUFJLElBQUksV0FBVyxDQUFDLEdBQUc7QUFDbkIsZ0JBQUksV0FBVyxDQUFDLEVBQUUsY0FBYztBQUFBLFVBQ3BDO0FBQUEsUUFDSjtBQUFBLE1BQ0osQ0FBQztBQUFBLElBQ0wsQ0FBQztBQUdELG1CQUFlO0FBR2YsVUFBTSxpQkFBaUIsU0FBUyxpQkFBaUIsVUFBVSxjQUFjO0FBQ3pFLFVBQU0sZ0JBQWdCLGVBQWUsQ0FBQztBQUN0QyxRQUFJLGVBQWU7QUFDZixvQkFBYyxZQUFZLGNBQWM7QUFDeEMsZUFBUyxlQUFlLFVBQVUsR0FBRyxpQkFBaUIsU0FBUyxNQUFNO0FBQ2pFLGlCQUFTLE9BQU87QUFDaEIsbUJBQVcsTUFBTTtBQUNiLG1CQUFTLE9BQU87QUFBQSxRQUNwQixHQUFHLENBQUM7QUFBQSxNQUNSLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUVBLFdBQVMsaUJBQXVCO0FBQzVCLFVBQU0sY0FBYyxTQUFTLGNBQWMsVUFBVSxZQUFZO0FBQ2pFLFVBQU0sa0JBQWtCLFNBQVMsY0FBYyxVQUFVLHFCQUFxQjtBQUU5RSxRQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFpQjtBQUV0QyxnQkFBWSxpQkFBaUIsU0FBUyxNQUFNO0FBQ3hDLFlBQU0sU0FBUyxZQUFZLE1BQU0sS0FBSyxFQUFFLFlBQVk7QUFDcEQsWUFBTSxXQUFXLGdCQUFnQixpQkFBaUIsVUFBVSxlQUFlO0FBRTNFLGVBQVMsUUFBUSxDQUFDLFNBQVM7QUFDdkIsY0FBTSxPQUFPLEtBQUssY0FBYyxVQUFVLGNBQWMsR0FBRyxhQUFhLFlBQVksS0FBSztBQUN6RixjQUFNLGNBQWMsS0FBSyxjQUFjLFVBQVUsZ0JBQWdCLEdBQUcsYUFBYSxZQUFZLEtBQUs7QUFDbEcsY0FBTSxPQUFPLEtBQUssY0FBYyxVQUFVLGVBQWUsR0FBRyxhQUFhLFlBQVksS0FBSztBQUUxRixjQUFNLFFBQVEsS0FBSyxTQUFTLE1BQU0sS0FBSyxZQUFZLFNBQVMsTUFBTSxLQUFLLEtBQUssU0FBUyxNQUFNO0FBQzNGLFFBQUMsS0FBcUIsTUFBTSxVQUFVLFFBQVEsS0FBSztBQUFBLE1BQ3ZELENBQUM7QUFBQSxJQUNMLENBQUM7QUFBQSxFQUNMO0FBRUEsV0FBUyx3QkFBOEI7QUFDbkMsb0JBQVEsV0FBVyx5QkFBeUIsRUFBRSxLQUFLLE1BQU07QUFDckQsWUFBTSxNQUFNLFNBQVMsZUFBZSx3QkFBd0I7QUFDNUQsV0FBSyxpQkFBaUIsU0FBUyxVQUFVO0FBQUEsSUFDN0MsQ0FBQyxFQUFFLE1BQU0sTUFBTTtBQUFBLElBQUMsQ0FBQztBQUFBLEVBQ3JCO0FBRUEsV0FBUyxhQUFtQjtBQUN4QixvQkFBUSxXQUFXLFVBQVUsY0FBYyxFQUFFLEtBQUssWUFBWTtBQUMxRCxZQUFNLGdCQUFnQixTQUFTLGNBQWMsVUFBVSxjQUFjO0FBQ3JFLFVBQUksZUFBZTtBQUVmLHNCQUFjLGFBQWE7QUFBQSxVQUN2QjtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSixDQUFDLEVBQUUsTUFBTSxTQUFPLHVCQUFPLE1BQU0sb0NBQW9DLEdBQUcsQ0FBQztBQUFBLEVBQ3pFO0FBRUEsV0FBUyxlQUF1QjtBQUM1QixXQUFPO0FBQUE7QUFBQTtBQUFBLEVBR1g7QUFFQSxXQUFTLGVBQXVCO0FBQzVCLFdBQU87QUFBQTtBQUFBO0FBQUEsRUFHWDtBQUVBLFdBQVMsZ0JBQXdCO0FBQzdCLFdBQU87QUFBQTtBQUFBLEVBRVg7IiwKICAibmFtZXMiOiBbIkV4Y2VwdGlvbkNvZGUiLCAicmVnaXN0ZXJQbHVnaW4iLCAicCIsICJyZXNvbHZlIiwgImhlYWRlcnMiLCAiU3lzdGVtQmFyc1N0eWxlIiwgIlN5c3RlbUJhclR5cGUiLCAiRGlyZWN0b3J5IiwgIkVuY29kaW5nIiwgInJlc29sdmUiLCAiZW50cnkiLCAidG9QYXRoIiwgImN0aW1lIiwgIndlYl9leHBvcnRzIiwgImluaXRfd2ViIiwgInJlc29sdmUiLCAicmVzb2x2ZSIsICJqb2luIiwgImJhc2VuYW1lIiwgIndlYl9leHBvcnRzIiwgImluaXRfd2ViIiwgIkJyb3dzZXIiLCAiZiIsICJCcm93c2VyIiwgInJlc29sdmUiLCAiZiIsICJyZXNvbHZlIiwgImltcG9ydF9wYXRoIl0KfQo=
