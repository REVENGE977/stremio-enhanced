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
      Helpers_default.waitForElm(SELECTORS.SECTIONS_CONTAINER).then(() => {
        this.logger.info(`Adding section: ${sectionId} with title: ${title}`);
        const settingsPanel = document.querySelector(SELECTORS.SECTIONS_CONTAINER);
        if (!settingsPanel) return;
        const sectionElement = document.querySelector(SELECTORS.SECTION);
        const labelElement = document.querySelector(SELECTORS.LABEL);
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
        Helpers_default.waitForElm(SELECTORS.NAV_MENU).then(() => {
          const nav = document.querySelector(SELECTORS.NAV_MENU);
          const shortcutsNav = document.querySelector('[title="Shortcuts"]');
          if (!nav || !shortcutsNav) return;
          if (document.querySelector(`[data-section="${sectionId}"]`)) return;
          const enhancedNavContainer = document.createElement("div");
          enhancedNavContainer.innerHTML = getEnhancedNav();
          nav.insertBefore(enhancedNavContainer, shortcutsNav.nextSibling);
        }).catch((err) => this.logger.error(`Failed to add nav: ${err}`));
      }).catch((err) => this.logger.error(`Failed to add section: ${err}`));
    }
    /**
     * Add a category within a section
     */
    static addCategory(title, sectionId, icon) {
      Helpers_default.waitForElm(SELECTORS.SECTIONS_CONTAINER).then(() => {
        this.logger.info(`Adding category: ${title} to section: ${sectionId}`);
        const categoryElement = document.querySelector(SELECTORS.CATEGORY);
        const categoryTitleElement = document.querySelector(SELECTORS.CATEGORY_LABEL);
        const categoryIconElement = document.querySelector(SELECTORS.CATEGORY_ICON);
        if (!categoryElement || !categoryTitleElement) return;
        const categoryClass = categoryElement.className;
        const categoryTitleClass = categoryTitleElement.className;
        let categoryIconClass = "";
        if (categoryIconElement instanceof SVGElement) {
          categoryIconClass = categoryIconElement.className.baseVal;
        } else if (categoryIconElement) {
          categoryIconClass = categoryIconElement.className;
        }
        icon = icon.replace(`class="icon"`, `class="${categoryIconClass}"`);
        const section = document.getElementById(sectionId);
        if (!section) return;
        const categoryDiv = document.createElement("div");
        categoryDiv.className = categoryClass;
        const titleDiv = document.createElement("div");
        titleDiv.className = categoryTitleClass;
        titleDiv.innerHTML = title;
        const headingDiv = document.createElement("div");
        headingDiv.classList.add(SELECTORS.CATEGORY_HEADING.replace(".", ""));
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
      for (let i = 0; i < 6; i++) {
        const navItem = document.querySelector(`${SELECTORS.NAV_MENU} > div:nth-child(${i})`);
        navItem?.classList.remove(CLASSES.SELECTED);
      }
      element.classList.add(CLASSES.SELECTED);
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
  PlatformManager.setPlatform(new CapacitorPlatform());
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvY29yZS9idWlsZC91dGlsLmpzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2FwYWNpdG9yL2NvcmUvYnVpbGQvcnVudGltZS5qcyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9jb3JlL2J1aWxkL2dsb2JhbC5qcyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNhcGFjaXRvci9jb3JlL2J1aWxkL3dlYi1wbHVnaW4uanMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvY29yZS9idWlsZC9jb3JlLXBsdWdpbnMuanMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvZmlsZXN5c3RlbS9zcmMvZGVmaW5pdGlvbnMudHMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvZmlsZXN5c3RlbS9zcmMvd2ViLnRzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2FwYWNpdG9yL2Jyb3dzZXIvc3JjL3dlYi50cyIsICIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9wbGF0Zm9ybS9QbGF0Zm9ybU1hbmFnZXIudHMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3IvZmlsZXN5c3RlbS9zcmMvaW5kZXgudHMiLCAiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BjYXBhY2l0b3Ivc3luYXBzZS9kaXN0L3N5bmFwc2UubWpzIiwgIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY2FwYWNpdG9yL2Jyb3dzZXIvc3JjL2luZGV4LnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9wbGF0Zm9ybS9DYXBhY2l0b3JQbGF0Zm9ybS50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvdXRpbHMvSGVscGVycy50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvdXRpbHMvbG9nZ2VyLmJyb3dzZXIudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbnN0YW50cy9pbmRleC50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9tb2RzLXRhYi9tb2RzLXRhYi5odG1sIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZHMtaXRlbS9tb2RzLWl0ZW0uaHRtbCIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9hYm91dC1jYXRlZ29yeS9hYm91dC1jYXRlZ29yeS5odG1sIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2RlZmF1bHQtdGhlbWUvZGVmYXVsdC10aGVtZS5odG1sIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2JhY2stYnRuL2JhY2stYnRuLmh0bWwiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvdGl0bGUtYmFyL3RpdGxlLWJhci5odG1sIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy90ZW1wbGF0ZUNhY2hlLmJyb3dzZXIudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvdG9hc3QvdG9hc3QudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvcGx1Z2luLWl0ZW0vcGx1Z2luSXRlbS50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy90aGVtZS1pdGVtL3RoZW1lSXRlbS50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9lbmhhbmNlZC1uYXYvZW5oYW5jZWROYXYudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvcmUvUHJvcGVydGllcy50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9hcHBseS10aGVtZS9hcHBseVRoZW1lLmJyb3dzZXIudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvcmUvTW9kTWFuYWdlci50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlcy9NZXRhRGF0YS50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvdXRpbHMvRXh0cmFjdE1ldGFEYXRhLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb3JlL1NldHRpbmdzLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZHMtdGFiL21vZHNUYWIudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvbW9kcy1pdGVtL21vZHNJdGVtLnRzIiwgIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2Fib3V0LWNhdGVnb3J5L2Fib3V0Q2F0ZWdvcnkudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvZGVmYXVsdC10aGVtZS9kZWZhdWx0VGhlbWUudHMiLCAiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvYmFjay1idG4vYmFja0J0bi50cyIsICIuLi8uLi8uLi8uLi8uLi9zcmMvYW5kcm9pZC9wcmVsb2FkLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgdmFyIEV4Y2VwdGlvbkNvZGU7XG4oZnVuY3Rpb24gKEV4Y2VwdGlvbkNvZGUpIHtcbiAgICAvKipcbiAgICAgKiBBUEkgaXMgbm90IGltcGxlbWVudGVkLlxuICAgICAqXG4gICAgICogVGhpcyB1c3VhbGx5IG1lYW5zIHRoZSBBUEkgY2FuJ3QgYmUgdXNlZCBiZWNhdXNlIGl0IGlzIG5vdCBpbXBsZW1lbnRlZCBmb3JcbiAgICAgKiB0aGUgY3VycmVudCBwbGF0Zm9ybS5cbiAgICAgKi9cbiAgICBFeGNlcHRpb25Db2RlW1wiVW5pbXBsZW1lbnRlZFwiXSA9IFwiVU5JTVBMRU1FTlRFRFwiO1xuICAgIC8qKlxuICAgICAqIEFQSSBpcyBub3QgYXZhaWxhYmxlLlxuICAgICAqXG4gICAgICogVGhpcyBtZWFucyB0aGUgQVBJIGNhbid0IGJlIHVzZWQgcmlnaHQgbm93IGJlY2F1c2U6XG4gICAgICogICAtIGl0IGlzIGN1cnJlbnRseSBtaXNzaW5nIGEgcHJlcmVxdWlzaXRlLCBzdWNoIGFzIG5ldHdvcmsgY29ubmVjdGl2aXR5XG4gICAgICogICAtIGl0IHJlcXVpcmVzIGEgcGFydGljdWxhciBwbGF0Zm9ybSBvciBicm93c2VyIHZlcnNpb25cbiAgICAgKi9cbiAgICBFeGNlcHRpb25Db2RlW1wiVW5hdmFpbGFibGVcIl0gPSBcIlVOQVZBSUxBQkxFXCI7XG59KShFeGNlcHRpb25Db2RlIHx8IChFeGNlcHRpb25Db2RlID0ge30pKTtcbmV4cG9ydCBjbGFzcyBDYXBhY2l0b3JFeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgY29kZSwgZGF0YSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgZ2V0UGxhdGZvcm1JZCA9ICh3aW4pID0+IHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGlmICh3aW4gPT09IG51bGwgfHwgd2luID09PSB2b2lkIDAgPyB2b2lkIDAgOiB3aW4uYW5kcm9pZEJyaWRnZSkge1xuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgIH1cbiAgICBlbHNlIGlmICgoX2IgPSAoX2EgPSB3aW4gPT09IG51bGwgfHwgd2luID09PSB2b2lkIDAgPyB2b2lkIDAgOiB3aW4ud2Via2l0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZUhhbmRsZXJzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuYnJpZGdlKSB7XG4gICAgICAgIHJldHVybiAnaW9zJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAnd2ViJztcbiAgICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbC5qcy5tYXAiLCAiaW1wb3J0IHsgQ2FwYWNpdG9yRXhjZXB0aW9uLCBnZXRQbGF0Zm9ybUlkLCBFeGNlcHRpb25Db2RlIH0gZnJvbSAnLi91dGlsJztcbmV4cG9ydCBjb25zdCBjcmVhdGVDYXBhY2l0b3IgPSAod2luKSA9PiB7XG4gICAgY29uc3QgY2FwQ3VzdG9tUGxhdGZvcm0gPSB3aW4uQ2FwYWNpdG9yQ3VzdG9tUGxhdGZvcm0gfHwgbnVsbDtcbiAgICBjb25zdCBjYXAgPSB3aW4uQ2FwYWNpdG9yIHx8IHt9O1xuICAgIGNvbnN0IFBsdWdpbnMgPSAoY2FwLlBsdWdpbnMgPSBjYXAuUGx1Z2lucyB8fCB7fSk7XG4gICAgY29uc3QgZ2V0UGxhdGZvcm0gPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBjYXBDdXN0b21QbGF0Zm9ybSAhPT0gbnVsbCA/IGNhcEN1c3RvbVBsYXRmb3JtLm5hbWUgOiBnZXRQbGF0Zm9ybUlkKHdpbik7XG4gICAgfTtcbiAgICBjb25zdCBpc05hdGl2ZVBsYXRmb3JtID0gKCkgPT4gZ2V0UGxhdGZvcm0oKSAhPT0gJ3dlYic7XG4gICAgY29uc3QgaXNQbHVnaW5BdmFpbGFibGUgPSAocGx1Z2luTmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBwbHVnaW4gPSByZWdpc3RlcmVkUGx1Z2lucy5nZXQocGx1Z2luTmFtZSk7XG4gICAgICAgIGlmIChwbHVnaW4gPT09IG51bGwgfHwgcGx1Z2luID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwbHVnaW4ucGxhdGZvcm1zLmhhcyhnZXRQbGF0Zm9ybSgpKSkge1xuICAgICAgICAgICAgLy8gSlMgaW1wbGVtZW50YXRpb24gYXZhaWxhYmxlIGZvciB0aGUgY3VycmVudCBwbGF0Zm9ybS5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnZXRQbHVnaW5IZWFkZXIocGx1Z2luTmFtZSkpIHtcbiAgICAgICAgICAgIC8vIE5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBhdmFpbGFibGUuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBjb25zdCBnZXRQbHVnaW5IZWFkZXIgPSAocGx1Z2luTmFtZSkgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBjYXAuUGx1Z2luSGVhZGVycykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZpbmQoKGgpID0+IGgubmFtZSA9PT0gcGx1Z2luTmFtZSk7IH07XG4gICAgY29uc3QgaGFuZGxlRXJyb3IgPSAoZXJyKSA9PiB3aW4uY29uc29sZS5lcnJvcihlcnIpO1xuICAgIGNvbnN0IHJlZ2lzdGVyZWRQbHVnaW5zID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gKHBsdWdpbk5hbWUsIGpzSW1wbGVtZW50YXRpb25zID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZFBsdWdpbiA9IHJlZ2lzdGVyZWRQbHVnaW5zLmdldChwbHVnaW5OYW1lKTtcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWRQbHVnaW4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ2FwYWNpdG9yIHBsdWdpbiBcIiR7cGx1Z2luTmFtZX1cIiBhbHJlYWR5IHJlZ2lzdGVyZWQuIENhbm5vdCByZWdpc3RlciBwbHVnaW5zIHR3aWNlLmApO1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdGVyZWRQbHVnaW4ucHJveHk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGxhdGZvcm0gPSBnZXRQbGF0Zm9ybSgpO1xuICAgICAgICBjb25zdCBwbHVnaW5IZWFkZXIgPSBnZXRQbHVnaW5IZWFkZXIocGx1Z2luTmFtZSk7XG4gICAgICAgIGxldCBqc0ltcGxlbWVudGF0aW9uO1xuICAgICAgICBjb25zdCBsb2FkUGx1Z2luSW1wbGVtZW50YXRpb24gPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWpzSW1wbGVtZW50YXRpb24gJiYgcGxhdGZvcm0gaW4ganNJbXBsZW1lbnRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBqc0ltcGxlbWVudGF0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGpzSW1wbGVtZW50YXRpb25zW3BsYXRmb3JtXSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyAoanNJbXBsZW1lbnRhdGlvbiA9IGF3YWl0IGpzSW1wbGVtZW50YXRpb25zW3BsYXRmb3JtXSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiAoanNJbXBsZW1lbnRhdGlvbiA9IGpzSW1wbGVtZW50YXRpb25zW3BsYXRmb3JtXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjYXBDdXN0b21QbGF0Zm9ybSAhPT0gbnVsbCAmJiAhanNJbXBsZW1lbnRhdGlvbiAmJiAnd2ViJyBpbiBqc0ltcGxlbWVudGF0aW9ucykge1xuICAgICAgICAgICAgICAgIGpzSW1wbGVtZW50YXRpb24gPVxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YganNJbXBsZW1lbnRhdGlvbnNbJ3dlYiddID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICA/IChqc0ltcGxlbWVudGF0aW9uID0gYXdhaXQganNJbXBsZW1lbnRhdGlvbnNbJ3dlYiddKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IChqc0ltcGxlbWVudGF0aW9uID0ganNJbXBsZW1lbnRhdGlvbnNbJ3dlYiddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBqc0ltcGxlbWVudGF0aW9uO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjcmVhdGVQbHVnaW5NZXRob2QgPSAoaW1wbCwgcHJvcCkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIGlmIChwbHVnaW5IZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRob2RIZWFkZXIgPSBwbHVnaW5IZWFkZXIgPT09IG51bGwgfHwgcGx1Z2luSGVhZGVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwbHVnaW5IZWFkZXIubWV0aG9kcy5maW5kKChtKSA9PiBwcm9wID09PSBtLm5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChtZXRob2RIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZEhlYWRlci5ydHlwZSA9PT0gJ3Byb21pc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG9wdGlvbnMpID0+IGNhcC5uYXRpdmVQcm9taXNlKHBsdWdpbk5hbWUsIHByb3AudG9TdHJpbmcoKSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG9wdGlvbnMsIGNhbGxiYWNrKSA9PiBjYXAubmF0aXZlQ2FsbGJhY2socGx1Z2luTmFtZSwgcHJvcC50b1N0cmluZygpLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaW1wbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKF9hID0gaW1wbFtwcm9wXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmJpbmQoaW1wbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW1wbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoX2IgPSBpbXBsW3Byb3BdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuYmluZChpbXBsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDYXBhY2l0b3JFeGNlcHRpb24oYFwiJHtwbHVnaW5OYW1lfVwiIHBsdWdpbiBpcyBub3QgaW1wbGVtZW50ZWQgb24gJHtwbGF0Zm9ybX1gLCBFeGNlcHRpb25Db2RlLlVuaW1wbGVtZW50ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjcmVhdGVQbHVnaW5NZXRob2RXcmFwcGVyID0gKHByb3ApID0+IHtcbiAgICAgICAgICAgIGxldCByZW1vdmU7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gbG9hZFBsdWdpbkltcGxlbWVudGF0aW9uKCkudGhlbigoaW1wbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmbiA9IGNyZWF0ZVBsdWdpbk1ldGhvZChpbXBsLCBwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gZm4oLi4uYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmUgPSBwID09PSBudWxsIHx8IHAgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHAucmVtb3ZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ2FwYWNpdG9yRXhjZXB0aW9uKGBcIiR7cGx1Z2luTmFtZX0uJHtwcm9wfSgpXCIgaXMgbm90IGltcGxlbWVudGVkIG9uICR7cGxhdGZvcm19YCwgRXhjZXB0aW9uQ29kZS5VbmltcGxlbWVudGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSAnYWRkTGlzdGVuZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHAucmVtb3ZlID0gYXN5bmMgKCkgPT4gcmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIFNvbWUgZmxhaXIg4pyoXG4gICAgICAgICAgICB3cmFwcGVyLnRvU3RyaW5nID0gKCkgPT4gYCR7cHJvcC50b1N0cmluZygpfSgpIHsgW2NhcGFjaXRvciBjb2RlXSB9YDtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3cmFwcGVyLCAnbmFtZScsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogcHJvcCxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGFkZExpc3RlbmVyID0gY3JlYXRlUGx1Z2luTWV0aG9kV3JhcHBlcignYWRkTGlzdGVuZXInKTtcbiAgICAgICAgY29uc3QgcmVtb3ZlTGlzdGVuZXIgPSBjcmVhdGVQbHVnaW5NZXRob2RXcmFwcGVyKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgICAgICBjb25zdCBhZGRMaXN0ZW5lck5hdGl2ZSA9IChldmVudE5hbWUsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWxsID0gYWRkTGlzdGVuZXIoeyBldmVudE5hbWUgfSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrSWQgPSBhd2FpdCBjYWxsO1xuICAgICAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja0lkLFxuICAgICAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBwID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IGNhbGwudGhlbigoKSA9PiByZXNvbHZlKHsgcmVtb3ZlIH0pKSk7XG4gICAgICAgICAgICBwLnJlbW92ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFVzaW5nIGFkZExpc3RlbmVyKCkgd2l0aG91dCAnYXdhaXQnIGlzIGRlcHJlY2F0ZWQuYCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgcmVtb3ZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHByb3h5ID0gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgICAgICBnZXQoXywgcHJvcCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzIwMDMwXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyQkdHlwZW9mJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RvSlNPTic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gKHt9KTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYWRkTGlzdGVuZXInOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsdWdpbkhlYWRlciA/IGFkZExpc3RlbmVyTmF0aXZlIDogYWRkTGlzdGVuZXI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JlbW92ZUxpc3RlbmVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVMaXN0ZW5lcjtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVQbHVnaW5NZXRob2RXcmFwcGVyKHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBQbHVnaW5zW3BsdWdpbk5hbWVdID0gcHJveHk7XG4gICAgICAgIHJlZ2lzdGVyZWRQbHVnaW5zLnNldChwbHVnaW5OYW1lLCB7XG4gICAgICAgICAgICBuYW1lOiBwbHVnaW5OYW1lLFxuICAgICAgICAgICAgcHJveHksXG4gICAgICAgICAgICBwbGF0Zm9ybXM6IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGpzSW1wbGVtZW50YXRpb25zKSwgLi4uKHBsdWdpbkhlYWRlciA/IFtwbGF0Zm9ybV0gOiBbXSldKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9O1xuICAgIC8vIEFkZCBpbiBjb252ZXJ0RmlsZVNyYyBmb3Igd2ViLCBpdCB3aWxsIGFscmVhZHkgYmUgYXZhaWxhYmxlIGluIG5hdGl2ZSBjb250ZXh0XG4gICAgaWYgKCFjYXAuY29udmVydEZpbGVTcmMpIHtcbiAgICAgICAgY2FwLmNvbnZlcnRGaWxlU3JjID0gKGZpbGVQYXRoKSA9PiBmaWxlUGF0aDtcbiAgICB9XG4gICAgY2FwLmdldFBsYXRmb3JtID0gZ2V0UGxhdGZvcm07XG4gICAgY2FwLmhhbmRsZUVycm9yID0gaGFuZGxlRXJyb3I7XG4gICAgY2FwLmlzTmF0aXZlUGxhdGZvcm0gPSBpc05hdGl2ZVBsYXRmb3JtO1xuICAgIGNhcC5pc1BsdWdpbkF2YWlsYWJsZSA9IGlzUGx1Z2luQXZhaWxhYmxlO1xuICAgIGNhcC5yZWdpc3RlclBsdWdpbiA9IHJlZ2lzdGVyUGx1Z2luO1xuICAgIGNhcC5FeGNlcHRpb24gPSBDYXBhY2l0b3JFeGNlcHRpb247XG4gICAgY2FwLkRFQlVHID0gISFjYXAuREVCVUc7XG4gICAgY2FwLmlzTG9nZ2luZ0VuYWJsZWQgPSAhIWNhcC5pc0xvZ2dpbmdFbmFibGVkO1xuICAgIHJldHVybiBjYXA7XG59O1xuZXhwb3J0IGNvbnN0IGluaXRDYXBhY2l0b3JHbG9iYWwgPSAod2luKSA9PiAod2luLkNhcGFjaXRvciA9IGNyZWF0ZUNhcGFjaXRvcih3aW4pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJ1bnRpbWUuanMubWFwIiwgImltcG9ydCB7IGluaXRDYXBhY2l0b3JHbG9iYWwgfSBmcm9tICcuL3J1bnRpbWUnO1xuZXhwb3J0IGNvbnN0IENhcGFjaXRvciA9IC8qI19fUFVSRV9fKi8gaW5pdENhcGFjaXRvckdsb2JhbCh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IGdsb2JhbFRoaXNcbiAgICA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IHNlbGZcbiAgICAgICAgOiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyB3aW5kb3dcbiAgICAgICAgICAgIDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IGdsb2JhbFxuICAgICAgICAgICAgICAgIDoge30pO1xuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gQ2FwYWNpdG9yLnJlZ2lzdGVyUGx1Z2luO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2xvYmFsLmpzLm1hcCIsICJpbXBvcnQgeyBDYXBhY2l0b3IgfSBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBFeGNlcHRpb25Db2RlIH0gZnJvbSAnLi91dGlsJztcbi8qKlxuICogQmFzZSBjbGFzcyB3ZWIgcGx1Z2lucyBzaG91bGQgZXh0ZW5kLlxuICovXG5leHBvcnQgY2xhc3MgV2ViUGx1Z2luIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICAgICAgdGhpcy5yZXRhaW5lZEV2ZW50QXJndW1lbnRzID0ge307XG4gICAgICAgIHRoaXMud2luZG93TGlzdGVuZXJzID0ge307XG4gICAgfVxuICAgIGFkZExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXJGdW5jKSB7XG4gICAgICAgIGxldCBmaXJzdExpc3RlbmVyID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdID0gW107XG4gICAgICAgICAgICBmaXJzdExpc3RlbmVyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdLnB1c2gobGlzdGVuZXJGdW5jKTtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZW4ndCBhZGRlZCBhIHdpbmRvdyBsaXN0ZW5lciBmb3IgdGhpcyBldmVudCBhbmQgaXQgcmVxdWlyZXMgb25lLFxuICAgICAgICAvLyBnbyBhaGVhZCBhbmQgYWRkIGl0XG4gICAgICAgIGNvbnN0IHdpbmRvd0xpc3RlbmVyID0gdGhpcy53aW5kb3dMaXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICAgICAgaWYgKHdpbmRvd0xpc3RlbmVyICYmICF3aW5kb3dMaXN0ZW5lci5yZWdpc3RlcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFdpbmRvd0xpc3RlbmVyKHdpbmRvd0xpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlyc3RMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5zZW5kUmV0YWluZWRBcmd1bWVudHNGb3JFdmVudChldmVudE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlbW92ZSA9IGFzeW5jICgpID0+IHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lckZ1bmMpO1xuICAgICAgICBjb25zdCBwID0gUHJvbWlzZS5yZXNvbHZlKHsgcmVtb3ZlIH0pO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgYXN5bmMgcmVtb3ZlQWxsTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIGluIHRoaXMud2luZG93TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVdpbmRvd0xpc3RlbmVyKHRoaXMud2luZG93TGlzdGVuZXJzW2xpc3RlbmVyXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53aW5kb3dMaXN0ZW5lcnMgPSB7fTtcbiAgICB9XG4gICAgbm90aWZ5TGlzdGVuZXJzKGV2ZW50TmFtZSwgZGF0YSwgcmV0YWluVW50aWxDb25zdW1lZCkge1xuICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKHJldGFpblVudGlsQ29uc3VtZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJncyA9IHRoaXMucmV0YWluZWRFdmVudEFyZ3VtZW50c1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICghYXJncykge1xuICAgICAgICAgICAgICAgICAgICBhcmdzID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJldGFpbmVkRXZlbnRBcmd1bWVudHNbZXZlbnROYW1lXSA9IGFyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcihkYXRhKSk7XG4gICAgfVxuICAgIGhhc0xpc3RlbmVycyhldmVudE5hbWUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gISEoKF9hID0gdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCk7XG4gICAgfVxuICAgIHJlZ2lzdGVyV2luZG93TGlzdGVuZXIod2luZG93RXZlbnROYW1lLCBwbHVnaW5FdmVudE5hbWUpIHtcbiAgICAgICAgdGhpcy53aW5kb3dMaXN0ZW5lcnNbcGx1Z2luRXZlbnROYW1lXSA9IHtcbiAgICAgICAgICAgIHJlZ2lzdGVyZWQ6IGZhbHNlLFxuICAgICAgICAgICAgd2luZG93RXZlbnROYW1lLFxuICAgICAgICAgICAgcGx1Z2luRXZlbnROYW1lLFxuICAgICAgICAgICAgaGFuZGxlcjogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlMaXN0ZW5lcnMocGx1Z2luRXZlbnROYW1lLCBldmVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICB1bmltcGxlbWVudGVkKG1zZyA9ICdub3QgaW1wbGVtZW50ZWQnKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2FwYWNpdG9yLkV4Y2VwdGlvbihtc2csIEV4Y2VwdGlvbkNvZGUuVW5pbXBsZW1lbnRlZCk7XG4gICAgfVxuICAgIHVuYXZhaWxhYmxlKG1zZyA9ICdub3QgYXZhaWxhYmxlJykge1xuICAgICAgICByZXR1cm4gbmV3IENhcGFjaXRvci5FeGNlcHRpb24obXNnLCBFeGNlcHRpb25Db2RlLlVuYXZhaWxhYmxlKTtcbiAgICB9XG4gICAgYXN5bmMgcmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lckZ1bmMpIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyRnVuYyk7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vcmUgbGlzdGVuZXJzIGZvciB0aGlzIHR5cGUgb2YgZXZlbnQsXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgd2luZG93IGxpc3RlbmVyXG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlV2luZG93TGlzdGVuZXIodGhpcy53aW5kb3dMaXN0ZW5lcnNbZXZlbnROYW1lXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkV2luZG93TGlzdGVuZXIoaGFuZGxlKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGhhbmRsZS53aW5kb3dFdmVudE5hbWUsIGhhbmRsZS5oYW5kbGVyKTtcbiAgICAgICAgaGFuZGxlLnJlZ2lzdGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZW1vdmVXaW5kb3dMaXN0ZW5lcihoYW5kbGUpIHtcbiAgICAgICAgaWYgKCFoYW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihoYW5kbGUud2luZG93RXZlbnROYW1lLCBoYW5kbGUuaGFuZGxlcik7XG4gICAgICAgIGhhbmRsZS5yZWdpc3RlcmVkID0gZmFsc2U7XG4gICAgfVxuICAgIHNlbmRSZXRhaW5lZEFyZ3VtZW50c0ZvckV2ZW50KGV2ZW50TmFtZSkge1xuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5yZXRhaW5lZEV2ZW50QXJndW1lbnRzW2V2ZW50TmFtZV07XG4gICAgICAgIGlmICghYXJncykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLnJldGFpbmVkRXZlbnRBcmd1bWVudHNbZXZlbnROYW1lXTtcbiAgICAgICAgYXJncy5mb3JFYWNoKChhcmcpID0+IHtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5TGlzdGVuZXJzKGV2ZW50TmFtZSwgYXJnKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2ViLXBsdWdpbi5qcy5tYXAiLCAiaW1wb3J0IHsgcmVnaXN0ZXJQbHVnaW4gfSBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBXZWJQbHVnaW4gfSBmcm9tICcuL3dlYi1wbHVnaW4nO1xuZXhwb3J0IGNvbnN0IFdlYlZpZXcgPSAvKiNfX1BVUkVfXyovIHJlZ2lzdGVyUGx1Z2luKCdXZWJWaWV3Jyk7XG4vKioqKioqKiogRU5EIFdFQiBWSUVXIFBMVUdJTiAqKioqKioqKi9cbi8qKioqKioqKiBDT09LSUVTIFBMVUdJTiAqKioqKioqKi9cbi8qKlxuICogU2FmZWx5IHdlYiBlbmNvZGUgYSBzdHJpbmcgdmFsdWUgKGluc3BpcmVkIGJ5IGpzLWNvb2tpZSlcbiAqIEBwYXJhbSBzdHIgVGhlIHN0cmluZyB2YWx1ZSB0byBlbmNvZGVcbiAqL1xuY29uc3QgZW5jb2RlID0gKHN0cikgPT4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgICAucmVwbGFjZSgvJSgyWzM0NkJdfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpXG4gICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcbi8qKlxuICogU2FmZWx5IHdlYiBkZWNvZGUgYSBzdHJpbmcgdmFsdWUgKGluc3BpcmVkIGJ5IGpzLWNvb2tpZSlcbiAqIEBwYXJhbSBzdHIgVGhlIHN0cmluZyB2YWx1ZSB0byBkZWNvZGVcbiAqL1xuY29uc3QgZGVjb2RlID0gKHN0cikgPT4gc3RyLnJlcGxhY2UoLyglW1xcZEEtRl17Mn0pKy9naSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcbmV4cG9ydCBjbGFzcyBDYXBhY2l0b3JDb29raWVzUGx1Z2luV2ViIGV4dGVuZHMgV2ViUGx1Z2luIHtcbiAgICBhc3luYyBnZXRDb29raWVzKCkge1xuICAgICAgICBjb25zdCBjb29raWVzID0gZG9jdW1lbnQuY29va2llO1xuICAgICAgICBjb25zdCBjb29raWVNYXAgPSB7fTtcbiAgICAgICAgY29va2llcy5zcGxpdCgnOycpLmZvckVhY2goKGNvb2tpZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvb2tpZS5sZW5ndGggPD0gMClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyBSZXBsYWNlIGZpcnN0IFwiPVwiIHdpdGggQ0FQX0NPT0tJRSB0byBwcmV2ZW50IHNwbGl0dGluZyBvbiBhZGRpdGlvbmFsIFwiPVwiXG4gICAgICAgICAgICBsZXQgW2tleSwgdmFsdWVdID0gY29va2llLnJlcGxhY2UoLz0vLCAnQ0FQX0NPT0tJRScpLnNwbGl0KCdDQVBfQ09PS0lFJyk7XG4gICAgICAgICAgICBrZXkgPSBkZWNvZGUoa2V5KS50cmltKCk7XG4gICAgICAgICAgICB2YWx1ZSA9IGRlY29kZSh2YWx1ZSkudHJpbSgpO1xuICAgICAgICAgICAgY29va2llTWFwW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb29raWVNYXA7XG4gICAgfVxuICAgIGFzeW5jIHNldENvb2tpZShvcHRpb25zKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBTYWZlbHkgRW5jb2RlZCBLZXkvVmFsdWVcbiAgICAgICAgICAgIGNvbnN0IGVuY29kZWRLZXkgPSBlbmNvZGUob3B0aW9ucy5rZXkpO1xuICAgICAgICAgICAgY29uc3QgZW5jb2RlZFZhbHVlID0gZW5jb2RlKG9wdGlvbnMudmFsdWUpO1xuICAgICAgICAgICAgLy8gQ2xlYW4gJiBzYW5pdGl6ZSBvcHRpb25zXG4gICAgICAgICAgICBjb25zdCBleHBpcmVzID0gYDsgZXhwaXJlcz0keyhvcHRpb25zLmV4cGlyZXMgfHwgJycpLnJlcGxhY2UoJ2V4cGlyZXM9JywgJycpfWA7IC8vIERlZmF1bHQgaXMgXCI7IGV4cGlyZXM9XCJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSAob3B0aW9ucy5wYXRoIHx8ICcvJykucmVwbGFjZSgncGF0aD0nLCAnJyk7IC8vIERlZmF1bHQgaXMgXCJwYXRoPS9cIlxuICAgICAgICAgICAgY29uc3QgZG9tYWluID0gb3B0aW9ucy51cmwgIT0gbnVsbCAmJiBvcHRpb25zLnVybC5sZW5ndGggPiAwID8gYGRvbWFpbj0ke29wdGlvbnMudXJsfWAgOiAnJztcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke2VuY29kZWRLZXl9PSR7ZW5jb2RlZFZhbHVlIHx8ICcnfSR7ZXhwaXJlc307IHBhdGg9JHtwYXRofTsgJHtkb21haW59O2A7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGRlbGV0ZUNvb2tpZShvcHRpb25zKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBgJHtvcHRpb25zLmtleX09OyBNYXgtQWdlPTBgO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBjbGVhckNvb2tpZXMoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7JykgfHwgW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNvb2tpZSBvZiBjb29raWVzKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLnJlcGxhY2UoL14gKy8sICcnKS5yZXBsYWNlKC89LiovLCBgPTtleHBpcmVzPSR7bmV3IERhdGUoKS50b1VUQ1N0cmluZygpfTtwYXRoPS9gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgY2xlYXJBbGxDb29raWVzKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5jbGVhckNvb2tpZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgY29uc3QgQ2FwYWNpdG9yQ29va2llcyA9IHJlZ2lzdGVyUGx1Z2luKCdDYXBhY2l0b3JDb29raWVzJywge1xuICAgIHdlYjogKCkgPT4gbmV3IENhcGFjaXRvckNvb2tpZXNQbHVnaW5XZWIoKSxcbn0pO1xuLy8gVVRJTElUWSBGVU5DVElPTlNcbi8qKlxuICogUmVhZCBpbiBhIEJsb2IgdmFsdWUgYW5kIHJldHVybiBpdCBhcyBhIGJhc2U2NCBzdHJpbmdcbiAqIEBwYXJhbSBibG9iIFRoZSBibG9iIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBiYXNlNjQgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCByZWFkQmxvYkFzQmFzZTY0ID0gYXN5bmMgKGJsb2IpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJhc2U2NFN0cmluZyA9IHJlYWRlci5yZXN1bHQ7XG4gICAgICAgIC8vIHJlbW92ZSBwcmVmaXggXCJkYXRhOmFwcGxpY2F0aW9uL3BkZjtiYXNlNjQsXCJcbiAgICAgICAgcmVzb2x2ZShiYXNlNjRTdHJpbmcuaW5kZXhPZignLCcpID49IDAgPyBiYXNlNjRTdHJpbmcuc3BsaXQoJywnKVsxXSA6IGJhc2U2NFN0cmluZyk7XG4gICAgfTtcbiAgICByZWFkZXIub25lcnJvciA9IChlcnJvcikgPT4gcmVqZWN0KGVycm9yKTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcbn0pO1xuLyoqXG4gKiBOb3JtYWxpemUgYW4gSHR0cEhlYWRlcnMgbWFwIGJ5IGxvd2VyY2FzaW5nIGFsbCBvZiB0aGUgdmFsdWVzXG4gKiBAcGFyYW0gaGVhZGVycyBUaGUgSHR0cEhlYWRlcnMgb2JqZWN0IHRvIG5vcm1hbGl6ZVxuICovXG5jb25zdCBub3JtYWxpemVIdHRwSGVhZGVycyA9IChoZWFkZXJzID0ge30pID0+IHtcbiAgICBjb25zdCBvcmlnaW5hbEtleXMgPSBPYmplY3Qua2V5cyhoZWFkZXJzKTtcbiAgICBjb25zdCBsb3dlcmVkS2V5cyA9IE9iamVjdC5rZXlzKGhlYWRlcnMpLm1hcCgoaykgPT4gay50b0xvY2FsZUxvd2VyQ2FzZSgpKTtcbiAgICBjb25zdCBub3JtYWxpemVkID0gbG93ZXJlZEtleXMucmVkdWNlKChhY2MsIGtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSBoZWFkZXJzW29yaWdpbmFsS2V5c1tpbmRleF1dO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gbm9ybWFsaXplZDtcbn07XG4vKipcbiAqIEJ1aWxkcyBhIHN0cmluZyBvZiB1cmwgcGFyYW1ldGVycyB0aGF0XG4gKiBAcGFyYW0gcGFyYW1zIEEgbWFwIG9mIHVybCBwYXJhbWV0ZXJzXG4gKiBAcGFyYW0gc2hvdWxkRW5jb2RlIHRydWUgaWYgeW91IHNob3VsZCBlbmNvZGVVUklDb21wb25lbnQoKSB0aGUgdmFsdWVzICh0cnVlIGJ5IGRlZmF1bHQpXG4gKi9cbmNvbnN0IGJ1aWxkVXJsUGFyYW1zID0gKHBhcmFtcywgc2hvdWxkRW5jb2RlID0gdHJ1ZSkgPT4ge1xuICAgIGlmICghcGFyYW1zKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBvdXRwdXQgPSBPYmplY3QuZW50cmllcyhwYXJhbXMpLnJlZHVjZSgoYWNjdW11bGF0b3IsIGVudHJ5KSA9PiB7XG4gICAgICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IGVudHJ5O1xuICAgICAgICBsZXQgZW5jb2RlZFZhbHVlO1xuICAgICAgICBsZXQgaXRlbTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBpdGVtID0gJyc7XG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKChzdHIpID0+IHtcbiAgICAgICAgICAgICAgICBlbmNvZGVkVmFsdWUgPSBzaG91bGRFbmNvZGUgPyBlbmNvZGVVUklDb21wb25lbnQoc3RyKSA6IHN0cjtcbiAgICAgICAgICAgICAgICBpdGVtICs9IGAke2tleX09JHtlbmNvZGVkVmFsdWV9JmA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGxhc3QgY2hhcmFjdGVyIHdpbGwgYWx3YXlzIGJlIFwiJlwiIHNvIHNsaWNlIGl0IG9mZlxuICAgICAgICAgICAgaXRlbS5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbmNvZGVkVmFsdWUgPSBzaG91bGRFbmNvZGUgPyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpIDogdmFsdWU7XG4gICAgICAgICAgICBpdGVtID0gYCR7a2V5fT0ke2VuY29kZWRWYWx1ZX1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHthY2N1bXVsYXRvcn0mJHtpdGVtfWA7XG4gICAgfSwgJycpO1xuICAgIC8vIFJlbW92ZSBpbml0aWFsIFwiJlwiIGZyb20gdGhlIHJlZHVjZVxuICAgIHJldHVybiBvdXRwdXQuc3Vic3RyKDEpO1xufTtcbi8qKlxuICogQnVpbGQgdGhlIFJlcXVlc3RJbml0IG9iamVjdCBiYXNlZCBvbiB0aGUgb3B0aW9ucyBwYXNzZWQgaW50byB0aGUgaW5pdGlhbCByZXF1ZXN0XG4gKiBAcGFyYW0gb3B0aW9ucyBUaGUgSHR0cCBwbHVnaW4gb3B0aW9uc1xuICogQHBhcmFtIGV4dHJhIEFueSBleHRyYSBSZXF1ZXN0SW5pdCB2YWx1ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkUmVxdWVzdEluaXQgPSAob3B0aW9ucywgZXh0cmEgPSB7fSkgPT4ge1xuICAgIGNvbnN0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oeyBtZXRob2Q6IG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnLCBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMgfSwgZXh0cmEpO1xuICAgIC8vIEdldCB0aGUgY29udGVudC10eXBlXG4gICAgY29uc3QgaGVhZGVycyA9IG5vcm1hbGl6ZUh0dHBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyk7XG4gICAgY29uc3QgdHlwZSA9IGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddIHx8ICcnO1xuICAgIC8vIElmIGJvZHkgaXMgYWxyZWFkeSBhIHN0cmluZywgdGhlbiBwYXNzIGl0IHRocm91Z2ggYXMtaXMuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG91dHB1dC5ib2R5ID0gb3B0aW9ucy5kYXRhO1xuICAgIH1cbiAgICAvLyBCdWlsZCByZXF1ZXN0IGluaXRpYWxpemVycyBiYXNlZCBvZmYgb2YgY29udGVudC10eXBlXG4gICAgZWxzZSBpZiAodHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvcHRpb25zLmRhdGEgfHwge30pKSB7XG4gICAgICAgICAgICBwYXJhbXMuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dC5ib2R5ID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoJ211bHRpcGFydC9mb3JtLWRhdGEnKSB8fCBvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xuICAgICAgICBjb25zdCBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgIGlmIChvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xuICAgICAgICAgICAgb3B0aW9ucy5kYXRhLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob3B0aW9ucy5kYXRhKSkge1xuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kKGtleSwgb3B0aW9ucy5kYXRhW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG91dHB1dC5ib2R5ID0gZm9ybTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKG91dHB1dC5oZWFkZXJzKTtcbiAgICAgICAgaGVhZGVycy5kZWxldGUoJ2NvbnRlbnQtdHlwZScpOyAvLyBjb250ZW50LXR5cGUgd2lsbCBiZSBzZXQgYnkgYHdpbmRvdy5mZXRjaGAgdG8gaW5jbHVkeSBib3VuZGFyeVxuICAgICAgICBvdXRwdXQuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL2pzb24nKSB8fCB0eXBlb2Ygb3B0aW9ucy5kYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICBvdXRwdXQuYm9keSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuLy8gV0VCIElNUExFTUVOVEFUSU9OXG5leHBvcnQgY2xhc3MgQ2FwYWNpdG9ySHR0cFBsdWdpbldlYiBleHRlbmRzIFdlYlBsdWdpbiB7XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhbiBIdHRwIHJlcXVlc3QgZ2l2ZW4gYSBzZXQgb2Ygb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gYnVpbGQgdGhlIEhUVFAgcmVxdWVzdFxuICAgICAqL1xuICAgIGFzeW5jIHJlcXVlc3Qob3B0aW9ucykge1xuICAgICAgICBjb25zdCByZXF1ZXN0SW5pdCA9IGJ1aWxkUmVxdWVzdEluaXQob3B0aW9ucywgb3B0aW9ucy53ZWJGZXRjaEV4dHJhKTtcbiAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gYnVpbGRVcmxQYXJhbXMob3B0aW9ucy5wYXJhbXMsIG9wdGlvbnMuc2hvdWxkRW5jb2RlVXJsUGFyYW1zKTtcbiAgICAgICAgY29uc3QgdXJsID0gdXJsUGFyYW1zID8gYCR7b3B0aW9ucy51cmx9PyR7dXJsUGFyYW1zfWAgOiBvcHRpb25zLnVybDtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHJlcXVlc3RJbml0KTtcbiAgICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgfHwgJyc7XG4gICAgICAgIC8vIERlZmF1bHQgdG8gJ3RleHQnIHJlc3BvbnNlVHlwZSBzbyBubyBwYXJzaW5nIGhhcHBlbnNcbiAgICAgICAgbGV0IHsgcmVzcG9uc2VUeXBlID0gJ3RleHQnIH0gPSByZXNwb25zZS5vayA/IG9wdGlvbnMgOiB7fTtcbiAgICAgICAgLy8gSWYgdGhlIHJlc3BvbnNlIGNvbnRlbnQtdHlwZSBpcyBqc29uLCBmb3JjZSB0aGUgcmVzcG9uc2UgdG8gYmUganNvblxuICAgICAgICBpZiAoY29udGVudFR5cGUuaW5jbHVkZXMoJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgICAgICAgcmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICBsZXQgYmxvYjtcbiAgICAgICAgc3dpdGNoIChyZXNwb25zZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FycmF5YnVmZmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jsb2InOlxuICAgICAgICAgICAgICAgIGJsb2IgPSBhd2FpdCByZXNwb25zZS5ibG9iKCk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHJlYWRCbG9iQXNCYXNlNjQoYmxvYik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZG9jdW1lbnQnOlxuICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ29udmVydCBmZXRjaCBoZWFkZXJzIHRvIENhcGFjaXRvciBIdHRwSGVhZGVyc1xuICAgICAgICBjb25zdCBoZWFkZXJzID0ge307XG4gICAgICAgIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgaGVhZGVyc1trZXldID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICAgIHVybDogcmVzcG9uc2UudXJsLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGFuIEh0dHAgR0VUIHJlcXVlc3QgZ2l2ZW4gYSBzZXQgb2Ygb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gYnVpbGQgdGhlIEhUVFAgcmVxdWVzdFxuICAgICAqL1xuICAgIGFzeW5jIGdldChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBtZXRob2Q6ICdHRVQnIH0pKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhbiBIdHRwIFBPU1QgcmVxdWVzdCBnaXZlbiBhIHNldCBvZiBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBidWlsZCB0aGUgSFRUUCByZXF1ZXN0XG4gICAgICovXG4gICAgYXN5bmMgcG9zdChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBtZXRob2Q6ICdQT1NUJyB9KSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gYW4gSHR0cCBQVVQgcmVxdWVzdCBnaXZlbiBhIHNldCBvZiBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBidWlsZCB0aGUgSFRUUCByZXF1ZXN0XG4gICAgICovXG4gICAgYXN5bmMgcHV0KG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IG1ldGhvZDogJ1BVVCcgfSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGFuIEh0dHAgUEFUQ0ggcmVxdWVzdCBnaXZlbiBhIHNldCBvZiBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBidWlsZCB0aGUgSFRUUCByZXF1ZXN0XG4gICAgICovXG4gICAgYXN5bmMgcGF0Y2gob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgbWV0aG9kOiAnUEFUQ0gnIH0pKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhbiBIdHRwIERFTEVURSByZXF1ZXN0IGdpdmVuIGEgc2V0IG9mIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIGJ1aWxkIHRoZSBIVFRQIHJlcXVlc3RcbiAgICAgKi9cbiAgICBhc3luYyBkZWxldGUob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgbWV0aG9kOiAnREVMRVRFJyB9KSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IENhcGFjaXRvckh0dHAgPSByZWdpc3RlclBsdWdpbignQ2FwYWNpdG9ySHR0cCcsIHtcbiAgICB3ZWI6ICgpID0+IG5ldyBDYXBhY2l0b3JIdHRwUGx1Z2luV2ViKCksXG59KTtcbi8qKioqKioqKiBFTkQgSFRUUCBQTFVHSU4gKioqKioqKiovXG4vKioqKioqKiogU1lTVEVNIEJBUlMgUExVR0lOICoqKioqKioqL1xuLyoqXG4gKiBBdmFpbGFibGUgc3RhdHVzIGJhciBzdHlsZXMuXG4gKi9cbmV4cG9ydCB2YXIgU3lzdGVtQmFyc1N0eWxlO1xuKGZ1bmN0aW9uIChTeXN0ZW1CYXJzU3R5bGUpIHtcbiAgICAvKipcbiAgICAgKiBMaWdodCBzeXN0ZW0gYmFyIGNvbnRlbnQgb24gYSBkYXJrIGJhY2tncm91bmQuXG4gICAgICpcbiAgICAgKiBAc2luY2UgOC4wLjBcbiAgICAgKi9cbiAgICBTeXN0ZW1CYXJzU3R5bGVbXCJEYXJrXCJdID0gXCJEQVJLXCI7XG4gICAgLyoqXG4gICAgICogRm9yIGRhcmsgc3lzdGVtIGJhciBjb250ZW50IG9uIGEgbGlnaHQgYmFja2dyb3VuZC5cbiAgICAgKlxuICAgICAqIEBzaW5jZSA4LjAuMFxuICAgICAqL1xuICAgIFN5c3RlbUJhcnNTdHlsZVtcIkxpZ2h0XCJdID0gXCJMSUdIVFwiO1xuICAgIC8qKlxuICAgICAqIFRoZSBzdHlsZSBpcyBiYXNlZCBvbiB0aGUgZGV2aWNlIGFwcGVhcmFuY2Ugb3IgdGhlIHVuZGVybHlpbmcgY29udGVudC5cbiAgICAgKiBJZiB0aGUgZGV2aWNlIGlzIHVzaW5nIERhcmsgbW9kZSwgdGhlIHN5c3RlbSBiYXJzIGNvbnRlbnQgd2lsbCBiZSBsaWdodC5cbiAgICAgKiBJZiB0aGUgZGV2aWNlIGlzIHVzaW5nIExpZ2h0IG1vZGUsIHRoZSBzeXN0ZW0gYmFycyBjb250ZW50IHdpbGwgYmUgZGFyay5cbiAgICAgKlxuICAgICAqIEBzaW5jZSA4LjAuMFxuICAgICAqL1xuICAgIFN5c3RlbUJhcnNTdHlsZVtcIkRlZmF1bHRcIl0gPSBcIkRFRkFVTFRcIjtcbn0pKFN5c3RlbUJhcnNTdHlsZSB8fCAoU3lzdGVtQmFyc1N0eWxlID0ge30pKTtcbi8qKlxuICogQXZhaWxhYmxlIHN5c3RlbSBiYXIgdHlwZXMuXG4gKi9cbmV4cG9ydCB2YXIgU3lzdGVtQmFyVHlwZTtcbihmdW5jdGlvbiAoU3lzdGVtQmFyVHlwZSkge1xuICAgIC8qKlxuICAgICAqIFRoZSB0b3Agc3RhdHVzIGJhciBvbiBib3RoIEFuZHJvaWQgYW5kIGlPUy5cbiAgICAgKlxuICAgICAqIEBzaW5jZSA4LjAuMFxuICAgICAqL1xuICAgIFN5c3RlbUJhclR5cGVbXCJTdGF0dXNCYXJcIl0gPSBcIlN0YXR1c0JhclwiO1xuICAgIC8qKlxuICAgICAqIFRoZSBuYXZpZ2F0aW9uIGJhciAob3IgZ2VzdHVyZSBiYXIgb24gaU9TKSBvbiBib3RoIEFuZHJvaWQgYW5kIGlPUy5cbiAgICAgKlxuICAgICAqIEBzaW5jZSA4LjAuMFxuICAgICAqL1xuICAgIFN5c3RlbUJhclR5cGVbXCJOYXZpZ2F0aW9uQmFyXCJdID0gXCJOYXZpZ2F0aW9uQmFyXCI7XG59KShTeXN0ZW1CYXJUeXBlIHx8IChTeXN0ZW1CYXJUeXBlID0ge30pKTtcbmV4cG9ydCBjbGFzcyBTeXN0ZW1CYXJzUGx1Z2luV2ViIGV4dGVuZHMgV2ViUGx1Z2luIHtcbiAgICBhc3luYyBzZXRTdHlsZSgpIHtcbiAgICAgICAgdGhpcy51bmF2YWlsYWJsZSgnbm90IGF2YWlsYWJsZSBmb3Igd2ViJyk7XG4gICAgfVxuICAgIGFzeW5jIHNldEFuaW1hdGlvbigpIHtcbiAgICAgICAgdGhpcy51bmF2YWlsYWJsZSgnbm90IGF2YWlsYWJsZSBmb3Igd2ViJyk7XG4gICAgfVxuICAgIGFzeW5jIHNob3coKSB7XG4gICAgICAgIHRoaXMudW5hdmFpbGFibGUoJ25vdCBhdmFpbGFibGUgZm9yIHdlYicpO1xuICAgIH1cbiAgICBhc3luYyBoaWRlKCkge1xuICAgICAgICB0aGlzLnVuYXZhaWxhYmxlKCdub3QgYXZhaWxhYmxlIGZvciB3ZWInKTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgU3lzdGVtQmFycyA9IHJlZ2lzdGVyUGx1Z2luKCdTeXN0ZW1CYXJzJywge1xuICAgIHdlYjogKCkgPT4gbmV3IFN5c3RlbUJhcnNQbHVnaW5XZWIoKSxcbn0pO1xuLyoqKioqKioqIEVORCBTWVNURU0gQkFSUyBQTFVHSU4gKioqKioqKiovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb3JlLXBsdWdpbnMuanMubWFwIiwgImltcG9ydCB0eXBlIHsgSHR0cE9wdGlvbnMsIFBlcm1pc3Npb25TdGF0ZSwgUGx1Z2luTGlzdGVuZXJIYW5kbGUgfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuXG5leHBvcnQgdHlwZSBDYWxsYmFja0lEID0gc3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBlcm1pc3Npb25TdGF0dXMge1xuICBwdWJsaWNTdG9yYWdlOiBQZXJtaXNzaW9uU3RhdGU7XG59XG5cbmV4cG9ydCBlbnVtIERpcmVjdG9yeSB7XG4gIC8qKlxuICAgKiBUaGUgRG9jdW1lbnRzIGRpcmVjdG9yeS5cbiAgICogT24gaU9TIGl0J3MgdGhlIGFwcCdzIGRvY3VtZW50cyBkaXJlY3RvcnkuXG4gICAqIFVzZSB0aGlzIGRpcmVjdG9yeSB0byBzdG9yZSB1c2VyLWdlbmVyYXRlZCBjb250ZW50LlxuICAgKiBPbiBBbmRyb2lkIGl0J3MgdGhlIFB1YmxpYyBEb2N1bWVudHMgZm9sZGVyLCBzbyBpdCdzIGFjY2Vzc2libGUgZnJvbSBvdGhlciBhcHBzLlxuICAgKiBJdCdzIG5vdCBhY2Nlc3NpYmxlIG9uIEFuZHJvaWQgMTAgdW5sZXNzIHRoZSBhcHAgZW5hYmxlcyBsZWdhY3kgRXh0ZXJuYWwgU3RvcmFnZVxuICAgKiBieSBhZGRpbmcgYGFuZHJvaWQ6cmVxdWVzdExlZ2FjeUV4dGVybmFsU3RvcmFnZT1cInRydWVcImAgaW4gdGhlIGBhcHBsaWNhdGlvbmAgdGFnXG4gICAqIGluIHRoZSBgQW5kcm9pZE1hbmlmZXN0LnhtbGAuXG4gICAqIE9uIEFuZHJvaWQgMTEgb3IgbmV3ZXIgdGhlIGFwcCBjYW4gb25seSBhY2Nlc3MgdGhlIGZpbGVzL2ZvbGRlcnMgdGhlIGFwcCBjcmVhdGVkLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIERvY3VtZW50cyA9ICdET0NVTUVOVFMnLFxuXG4gIC8qKlxuICAgKiBUaGUgRGF0YSBkaXJlY3RvcnkuXG4gICAqIE9uIGlPUyBpdCB3aWxsIHVzZSB0aGUgRG9jdW1lbnRzIGRpcmVjdG9yeS5cbiAgICogT24gQW5kcm9pZCBpdCdzIHRoZSBkaXJlY3RvcnkgaG9sZGluZyBhcHBsaWNhdGlvbiBmaWxlcy5cbiAgICogRmlsZXMgd2lsbCBiZSBkZWxldGVkIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIHVuaW5zdGFsbGVkLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIERhdGEgPSAnREFUQScsXG5cbiAgLyoqXG4gICAqIFRoZSBMaWJyYXJ5IGRpcmVjdG9yeS5cbiAgICogT24gaU9TIGl0IHdpbGwgdXNlIHRoZSBMaWJyYXJ5IGRpcmVjdG9yeS5cbiAgICogT24gQW5kcm9pZCBpdCdzIHRoZSBkaXJlY3RvcnkgaG9sZGluZyBhcHBsaWNhdGlvbiBmaWxlcy5cbiAgICogRmlsZXMgd2lsbCBiZSBkZWxldGVkIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIHVuaW5zdGFsbGVkLlxuICAgKlxuICAgKiBAc2luY2UgMS4xLjBcbiAgICovXG4gIExpYnJhcnkgPSAnTElCUkFSWScsXG5cbiAgLyoqXG4gICAqIFRoZSBDYWNoZSBkaXJlY3RvcnkuXG4gICAqIENhbiBiZSBkZWxldGVkIGluIGNhc2VzIG9mIGxvdyBtZW1vcnksIHNvIHVzZSB0aGlzIGRpcmVjdG9yeSB0byB3cml0ZSBhcHAtc3BlY2lmaWMgZmlsZXMuXG4gICAqIHRoYXQgeW91ciBhcHAgY2FuIHJlLWNyZWF0ZSBlYXNpbHkuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgQ2FjaGUgPSAnQ0FDSEUnLFxuXG4gIC8qKlxuICAgKiBUaGUgZXh0ZXJuYWwgZGlyZWN0b3J5LlxuICAgKiBPbiBpT1MgaXQgd2lsbCB1c2UgdGhlIERvY3VtZW50cyBkaXJlY3RvcnkuXG4gICAqIE9uIEFuZHJvaWQgaXQncyB0aGUgZGlyZWN0b3J5IG9uIHRoZSBwcmltYXJ5IHNoYXJlZC9leHRlcm5hbFxuICAgKiBzdG9yYWdlIGRldmljZSB3aGVyZSB0aGUgYXBwbGljYXRpb24gY2FuIHBsYWNlIHBlcnNpc3RlbnQgZmlsZXMgaXQgb3ducy5cbiAgICogVGhlc2UgZmlsZXMgYXJlIGludGVybmFsIHRvIHRoZSBhcHBsaWNhdGlvbnMsIGFuZCBub3QgdHlwaWNhbGx5IHZpc2libGVcbiAgICogdG8gdGhlIHVzZXIgYXMgbWVkaWEuXG4gICAqIEZpbGVzIHdpbGwgYmUgZGVsZXRlZCB3aGVuIHRoZSBhcHBsaWNhdGlvbiBpcyB1bmluc3RhbGxlZC5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBFeHRlcm5hbCA9ICdFWFRFUk5BTCcsXG5cbiAgLyoqXG4gICAqIFRoZSBleHRlcm5hbCBzdG9yYWdlIGRpcmVjdG9yeS5cbiAgICogT24gaU9TIGl0IHdpbGwgdXNlIHRoZSBEb2N1bWVudHMgZGlyZWN0b3J5LlxuICAgKiBPbiBBbmRyb2lkIGl0J3MgdGhlIHByaW1hcnkgc2hhcmVkL2V4dGVybmFsIHN0b3JhZ2UgZGlyZWN0b3J5LlxuICAgKiBJdCdzIG5vdCBhY2Nlc3NpYmxlIG9uIEFuZHJvaWQgMTAgdW5sZXNzIHRoZSBhcHAgZW5hYmxlcyBsZWdhY3kgRXh0ZXJuYWwgU3RvcmFnZVxuICAgKiBieSBhZGRpbmcgYGFuZHJvaWQ6cmVxdWVzdExlZ2FjeUV4dGVybmFsU3RvcmFnZT1cInRydWVcImAgaW4gdGhlIGBhcHBsaWNhdGlvbmAgdGFnXG4gICAqIGluIHRoZSBgQW5kcm9pZE1hbmlmZXN0LnhtbGAuXG4gICAqIEl0J3Mgbm90IGFjY2Vzc2libGUgb24gQW5kcm9pZCAxMSBvciBuZXdlci5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuXG4gIEV4dGVybmFsU3RvcmFnZSA9ICdFWFRFUk5BTF9TVE9SQUdFJyxcbiAgLyoqXG4gICAqIFRoZSBleHRlcm5hbCBjYWNoZSBkaXJlY3RvcnkuXG4gICAqIE9uIGlPUyBpdCB3aWxsIHVzZSB0aGUgRG9jdW1lbnRzIGRpcmVjdG9yeS5cbiAgICogT24gQW5kcm9pZCBpdCdzIHRoZSBwcmltYXJ5IHNoYXJlZC9leHRlcm5hbCBjYWNoZS5cbiAgICpcbiAgICogQHNpbmNlIDcuMS4wXG4gICAqL1xuICBFeHRlcm5hbENhY2hlID0gJ0VYVEVSTkFMX0NBQ0hFJyxcblxuICAvKipcbiAgICogVGhlIExpYnJhcnkgZGlyZWN0b3J5IHdpdGhvdXQgY2xvdWQgYmFja3VwLiBVc2VkIGluIGlPUy5cbiAgICogT24gQW5kcm9pZCBpdCdzIHRoZSBkaXJlY3RvcnkgaG9sZGluZyBhcHBsaWNhdGlvbiBmaWxlcy5cbiAgICpcbiAgICogQHNpbmNlIDcuMS4wXG4gICAqL1xuICBMaWJyYXJ5Tm9DbG91ZCA9ICdMSUJSQVJZX05PX0NMT1VEJyxcblxuICAvKipcbiAgICogQSB0ZW1wb3JhcnkgZGlyZWN0b3J5IGZvciBpT1MuXG4gICAqIE9uIEFuZHJvaWQgaXQncyB0aGUgZGlyZWN0b3J5IGhvbGRpbmcgdGhlIGFwcGxpY2F0aW9uIGNhY2hlLlxuICAgKlxuICAgKiBAc2luY2UgNy4xLjBcbiAgICovXG4gIFRlbXBvcmFyeSA9ICdURU1QT1JBUlknLFxufVxuXG5leHBvcnQgZW51bSBFbmNvZGluZyB7XG4gIC8qKlxuICAgKiBFaWdodC1iaXQgVUNTIFRyYW5zZm9ybWF0aW9uIEZvcm1hdFxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIFVURjggPSAndXRmOCcsXG5cbiAgLyoqXG4gICAqIFNldmVuLWJpdCBBU0NJSSwgYS5rLmEuIElTTzY0Ni1VUywgYS5rLmEuIHRoZSBCYXNpYyBMYXRpbiBibG9jayBvZiB0aGVcbiAgICogVW5pY29kZSBjaGFyYWN0ZXIgc2V0XG4gICAqIFRoaXMgZW5jb2RpbmcgaXMgb25seSBzdXBwb3J0ZWQgb24gQW5kcm9pZC5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBBU0NJSSA9ICdhc2NpaScsXG5cbiAgLyoqXG4gICAqIFNpeHRlZW4tYml0IFVDUyBUcmFuc2Zvcm1hdGlvbiBGb3JtYXQsIGJ5dGUgb3JkZXIgaWRlbnRpZmllZCBieSBhblxuICAgKiBvcHRpb25hbCBieXRlLW9yZGVyIG1hcmtcbiAgICogVGhpcyBlbmNvZGluZyBpcyBvbmx5IHN1cHBvcnRlZCBvbiBBbmRyb2lkLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIFVURjE2ID0gJ3V0ZjE2Jyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXcml0ZUZpbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRvIHdyaXRlXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF0YSB0byB3cml0ZVxuICAgKlxuICAgKiBOb3RlOiBCbG9iIGRhdGEgaXMgb25seSBzdXBwb3J0ZWQgb24gV2ViLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRhdGE6IHN0cmluZyB8IEJsb2I7XG5cbiAgLyoqXG4gICAqIFRoZSBgRGlyZWN0b3J5YCB0byBzdG9yZSB0aGUgZmlsZSBpblxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcblxuICAvKipcbiAgICogVGhlIGVuY29kaW5nIHRvIHdyaXRlIHRoZSBmaWxlIGluLiBJZiBub3QgcHJvdmlkZWQsIGRhdGFcbiAgICogaXMgd3JpdHRlbiBhcyBiYXNlNjQgZW5jb2RlZC5cbiAgICpcbiAgICogUGFzcyBFbmNvZGluZy5VVEY4IHRvIHdyaXRlIGRhdGEgYXMgc3RyaW5nXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZW5jb2Rpbmc/OiBFbmNvZGluZztcblxuICAvKipcbiAgICogV2hldGhlciB0byBjcmVhdGUgYW55IG1pc3NpbmcgcGFyZW50IGRpcmVjdG9yaWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlY3Vyc2l2ZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBwZW5kRmlsZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhdGggb2YgdGhlIGZpbGUgdG8gYXBwZW5kXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF0YSB0byB3cml0ZVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRhdGE6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIHN0b3JlIHRoZSBmaWxlIGluXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xuXG4gIC8qKlxuICAgKiBUaGUgZW5jb2RpbmcgdG8gd3JpdGUgdGhlIGZpbGUgaW4uIElmIG5vdCBwcm92aWRlZCwgZGF0YVxuICAgKiBpcyB3cml0dGVuIGFzIGJhc2U2NCBlbmNvZGVkLlxuICAgKlxuICAgKiBQYXNzIEVuY29kaW5nLlVURjggdG8gd3JpdGUgZGF0YSBhcyBzdHJpbmdcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBlbmNvZGluZz86IEVuY29kaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRGaWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0byByZWFkXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gcmVhZCB0aGUgZmlsZSBmcm9tXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xuXG4gIC8qKlxuICAgKiBUaGUgZW5jb2RpbmcgdG8gcmVhZCB0aGUgZmlsZSBpbiwgaWYgbm90IHByb3ZpZGVkLCBkYXRhXG4gICAqIGlzIHJlYWQgYXMgYmluYXJ5IGFuZCByZXR1cm5lZCBhcyBiYXNlNjQgZW5jb2RlZC5cbiAgICpcbiAgICogUGFzcyBFbmNvZGluZy5VVEY4IHRvIHJlYWQgZGF0YSBhcyBzdHJpbmdcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBlbmNvZGluZz86IEVuY29kaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgb2Zmc2V0IHRvIHN0YXJ0IHJlYWRpbmcgdGhlIGZpbGUgZnJvbSwgaW4gYnl0ZXMuXG4gICAqIE5hdGl2ZSBvbmx5IChub3QgYXZhaWxhYmxlIGluIHdlYikuXG4gICAqIENhbiBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggbGVuZ3RoIHRvIHBhcnRpYWxseSByZWFkIGZpbGVzLlxuICAgKlxuICAgKiBAc2luY2UgOC4xLjBcbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgb2Zmc2V0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbGVuZ3RoIG9mIGRhdGEgdG8gcmVhZCwgaW4gYnl0ZXMuXG4gICAqIEFueSBub24tcG9zaXRpdmUgdmFsdWUgbWVhbnMgdG8gcmVhZCB0byB0aGUgZW5kIG9mIHRoZSBmaWxlLlxuICAgKiBOYXRpdmUgb25seSAobm90IGF2YWlsYWJsZSBpbiB3ZWIpLlxuICAgKiBDYW4gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIG9mZnNldCB0byBwYXJ0aWFsbHkgcmVhZCBmaWxlcy5cbiAgICpcbiAgICogQHNpbmNlIDguMS4wXG4gICAqIEBkZWZhdWx0IC0xXG4gICAqL1xuICBsZW5ndGg/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZEZpbGVJbkNodW5rc09wdGlvbnMgZXh0ZW5kcyBSZWFkRmlsZU9wdGlvbnMge1xuICAvKipcbiAgICogU2l6ZSBvZiB0aGUgY2h1bmtzIGluIGJ5dGVzLlxuICAgKlxuICAgKiBAc2luY2UgNy4xLjBcbiAgICovXG4gIGNodW5rU2l6ZTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZUZpbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRvIGRlbGV0ZVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIGRlbGV0ZSB0aGUgZmlsZSBmcm9tXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1rZGlyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgbmV3IGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIG1ha2UgdGhlIG5ldyBkaXJlY3RvcnkgaW5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkaXJlY3Rvcnk/OiBEaXJlY3Rvcnk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gY3JlYXRlIGFueSBtaXNzaW5nIHBhcmVudCBkaXJlY3RvcmllcyBhcyB3ZWxsLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlY3Vyc2l2ZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUm1kaXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBkaXJlY3RvcnkgdG8gcmVtb3ZlXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gcmVtb3ZlIHRoZSBkaXJlY3RvcnkgZnJvbVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcblxuICAvKipcbiAgICogV2hldGhlciB0byByZWN1cnNpdmVseSByZW1vdmUgdGhlIGNvbnRlbnRzIG9mIHRoZSBkaXJlY3RvcnlcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICByZWN1cnNpdmU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlYWRkaXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBkaXJlY3RvcnkgdG8gcmVhZFxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIGxpc3QgZmlsZXMgZnJvbVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRVcmlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRvIGdldCB0aGUgVVJJIGZvclxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIHRvIGdldCB0aGUgZmlsZSB1bmRlclxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGRpcmVjdG9yeTogRGlyZWN0b3J5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHRvIGdldCBkYXRhIGFib3V0XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgdG8gZ2V0IHRoZSBmaWxlIHVuZGVyXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBleGlzdGluZyBmaWxlIG9yIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIGZyb206IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgdG86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGBEaXJlY3RvcnlgIGNvbnRhaW5pbmcgdGhlIGV4aXN0aW5nIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGlyZWN0b3J5PzogRGlyZWN0b3J5O1xuXG4gIC8qKlxuICAgKiBUaGUgYERpcmVjdG9yeWAgY29udGFpbmluZyB0aGUgZGVzdGluYXRpb24gZmlsZSBvciBkaXJlY3RvcnkuIElmIG5vdCBzdXBwbGllZCB3aWxsIHVzZSB0aGUgJ2RpcmVjdG9yeSdcbiAgICogcGFyYW1ldGVyIGFzIHRoZSBkZXN0aW5hdGlvblxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHRvRGlyZWN0b3J5PzogRGlyZWN0b3J5O1xufVxuXG5leHBvcnQgdHlwZSBSZW5hbWVPcHRpb25zID0gQ29weU9wdGlvbnM7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZEZpbGVSZXN1bHQge1xuICAvKipcbiAgICogVGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkYXRhIGNvbnRhaW5lZCBpbiB0aGUgZmlsZVxuICAgKlxuICAgKiBOb3RlOiBCbG9iIGlzIG9ubHkgYXZhaWxhYmxlIG9uIFdlYi4gT24gbmF0aXZlLCB0aGUgZGF0YSBpcyByZXR1cm5lZCBhcyBhIHN0cmluZy5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBkYXRhOiBzdHJpbmcgfCBCbG9iO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdyaXRlRmlsZVJlc3VsdCB7XG4gIC8qKlxuICAgKiBUaGUgdXJpIHdoZXJlIHRoZSBmaWxlIHdhcyB3cml0dGVuIGludG9cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICB1cmk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWFkZGlyUmVzdWx0IHtcbiAgLyoqXG4gICAqIExpc3Qgb2YgZmlsZXMgYW5kIGRpcmVjdG9yaWVzIGluc2lkZSB0aGUgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZmlsZXM6IEZpbGVJbmZvW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZUluZm8ge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgZmlsZSBvciBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBzaW5jZSA3LjEuMFxuICAgKi9cbiAgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHRoZSBmaWxlLlxuICAgKlxuICAgKiBAc2luY2UgNC4wLjBcbiAgICovXG4gIHR5cGU6ICdkaXJlY3RvcnknIHwgJ2ZpbGUnO1xuXG4gIC8qKlxuICAgKiBTaXplIG9mIHRoZSBmaWxlIGluIGJ5dGVzLlxuICAgKlxuICAgKiBAc2luY2UgNC4wLjBcbiAgICovXG4gIHNpemU6IG51bWJlcjtcblxuICAvKipcbiAgICogVGltZSBvZiBjcmVhdGlvbiBpbiBtaWxsaXNlY29uZHMuXG4gICAqXG4gICAqIEl0J3Mgbm90IGF2YWlsYWJsZSBvbiBBbmRyb2lkIDcgYW5kIG9sZGVyIGRldmljZXMuXG4gICAqXG4gICAqIEBzaW5jZSA3LjEuMFxuICAgKi9cbiAgY3RpbWU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRpbWUgb2YgbGFzdCBtb2RpZmljYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxuICAgKlxuICAgKiBAc2luY2UgNy4xLjBcbiAgICovXG4gIG10aW1lOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB1cmkgb2YgdGhlIGZpbGUuXG4gICAqXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKi9cbiAgdXJpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0VXJpUmVzdWx0IHtcbiAgLyoqXG4gICAqIFRoZSB1cmkgb2YgdGhlIGZpbGVcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICB1cmk6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgU3RhdFJlc3VsdCA9IEZpbGVJbmZvO1xuZXhwb3J0IGludGVyZmFjZSBDb3B5UmVzdWx0IHtcbiAgLyoqXG4gICAqIFRoZSB1cmkgd2hlcmUgdGhlIGZpbGUgd2FzIGNvcGllZCBpbnRvXG4gICAqXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKi9cbiAgdXJpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRG93bmxvYWRGaWxlT3B0aW9ucyBleHRlbmRzIEh0dHBPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIHRoZSBkb3dubG9hZGVkIGZpbGUgc2hvdWxkIGJlIG1vdmVkIHRvLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBkaXJlY3RvcnkgdG8gd3JpdGUgdGhlIGZpbGUgdG8uXG4gICAqIElmIHRoaXMgb3B0aW9uIGlzIHVzZWQsIGZpbGVQYXRoIGNhbiBiZSBhIHJlbGF0aXZlIHBhdGggcmF0aGVyIHRoYW4gYWJzb2x1dGUuXG4gICAqIFRoZSBkZWZhdWx0IGlzIHRoZSBgREFUQWAgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIGRpcmVjdG9yeT86IERpcmVjdG9yeTtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIHJlY2VpdmUgZG93bmxvYWRlZCBwcm9ncmVzcyBldmVudHMuXG4gICAqIElmIHRoaXMgb3B0aW9uIGlzIHVzZWQsIHByb2dyZXNzIGV2ZW50IHNob3VsZCBiZSBkaXNwYXRjaGVkIG9uIGV2ZXJ5IGNodW5rIHJlY2VpdmVkLlxuICAgKiBDaHVua3MgYXJlIHRocm90dGxlZCB0byBldmVyeSAxMDBtcyBvbiBBbmRyb2lkL2lPUyB0byBhdm9pZCBzbG93ZG93bnMuXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgcHJvZ3Jlc3M/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciB0byBjcmVhdGUgYW55IG1pc3NpbmcgcGFyZW50IGRpcmVjdG9yaWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAc2luY2UgNS4xLjJcbiAgICovXG4gIHJlY3Vyc2l2ZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRG93bmxvYWRGaWxlUmVzdWx0IHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIHRoZSBmaWxlIHdhcyBkb3dubG9hZGVkIHRvLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIHBhdGg/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgYmxvYiBkYXRhIG9mIHRoZSBkb3dubG9hZGVkIGZpbGUuXG4gICAqIFRoaXMgaXMgb25seSBhdmFpbGFibGUgb24gd2ViLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIGJsb2I/OiBCbG9iO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzU3RhdHVzIHtcbiAgLyoqXG4gICAqIFRoZSB1cmwgb2YgdGhlIGZpbGUgYmVpbmcgZG93bmxvYWRlZC5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqL1xuICB1cmw6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgYnl0ZXMgZG93bmxvYWRlZCBzbyBmYXIuXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgYnl0ZXM6IG51bWJlcjtcbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgYnl0ZXMgdG8gZG93bmxvYWQgZm9yIHRoaXMgZmlsZS5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqL1xuICBjb250ZW50TGVuZ3RoOiBudW1iZXI7XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgZm9yIHJlY2VpdmluZyBjaHVua3MgcmVhZCBmcm9tIGEgZmlsZSwgb3IgZXJyb3IgaWYgc29tZXRoaW5nIHdlbnQgd3JvbmcuXG4gKlxuICogQHNpbmNlIDcuMS4wXG4gKi9cbmV4cG9ydCB0eXBlIFJlYWRGaWxlSW5DaHVua3NDYWxsYmFjayA9IChjaHVua1JlYWQ6IFJlYWRGaWxlUmVzdWx0IHwgbnVsbCwgZXJyPzogYW55KSA9PiB2b2lkO1xuXG4vKipcbiAqIEEgbGlzdGVuZXIgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBwcm9ncmVzcyBldmVudHMuXG4gKlxuICogQHNpbmNlIDUuMS4wXG4gKi9cbmV4cG9ydCB0eXBlIFByb2dyZXNzTGlzdGVuZXIgPSAocHJvZ3Jlc3M6IFByb2dyZXNzU3RhdHVzKSA9PiB2b2lkO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZpbGVzeXN0ZW1QbHVnaW4ge1xuICAvKipcbiAgICogQ2hlY2sgcmVhZC93cml0ZSBwZXJtaXNzaW9ucy5cbiAgICogUmVxdWlyZWQgb24gQW5kcm9pZCwgb25seSB3aGVuIHVzaW5nIGBEaXJlY3RvcnkuRG9jdW1lbnRzYCBvclxuICAgKiBgRGlyZWN0b3J5LkV4dGVybmFsU3RvcmFnZWAuXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgY2hlY2tQZXJtaXNzaW9ucygpOiBQcm9taXNlPFBlcm1pc3Npb25TdGF0dXM+O1xuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IHJlYWQvd3JpdGUgcGVybWlzc2lvbnMuXG4gICAqIFJlcXVpcmVkIG9uIEFuZHJvaWQsIG9ubHkgd2hlbiB1c2luZyBgRGlyZWN0b3J5LkRvY3VtZW50c2Agb3JcbiAgICogYERpcmVjdG9yeS5FeHRlcm5hbFN0b3JhZ2VgLlxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlcXVlc3RQZXJtaXNzaW9ucygpOiBQcm9taXNlPFBlcm1pc3Npb25TdGF0dXM+O1xuXG4gIC8qKlxuICAgKiBSZWFkIGEgZmlsZSBmcm9tIGRpc2tcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICByZWFkRmlsZShvcHRpb25zOiBSZWFkRmlsZU9wdGlvbnMpOiBQcm9taXNlPFJlYWRGaWxlUmVzdWx0PjtcblxuICAvKipcbiAgICogUmVhZCBhIGZpbGUgZnJvbSBkaXNrLCBpbiBjaHVua3MuXG4gICAqIE5hdGl2ZSBvbmx5IChub3QgYXZhaWxhYmxlIGluIHdlYikuXG4gICAqIFVzZSB0aGUgY2FsbGJhY2sgdG8gcmVjZWl2ZSBlYWNoIHJlYWQgY2h1bmsuXG4gICAqIElmIGVtcHR5IGNodW5rIGlzIHJldHVybmVkLCBpdCBtZWFucyBmaWxlIGhhcyBiZWVuIGNvbXBsZXRlbHkgcmVhZC5cbiAgICpcbiAgICogQHNpbmNlIDcuMS4wXG4gICAqL1xuICByZWFkRmlsZUluQ2h1bmtzKG9wdGlvbnM6IFJlYWRGaWxlSW5DaHVua3NPcHRpb25zLCBjYWxsYmFjazogUmVhZEZpbGVJbkNodW5rc0NhbGxiYWNrKTogUHJvbWlzZTxDYWxsYmFja0lEPjtcblxuICAvKipcbiAgICogV3JpdGUgYSBmaWxlIHRvIGRpc2sgaW4gdGhlIHNwZWNpZmllZCBsb2NhdGlvbiBvbiBkZXZpY2VcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICB3cml0ZUZpbGUob3B0aW9uczogV3JpdGVGaWxlT3B0aW9ucyk6IFByb21pc2U8V3JpdGVGaWxlUmVzdWx0PjtcblxuICAvKipcbiAgICogQXBwZW5kIHRvIGEgZmlsZSBvbiBkaXNrIGluIHRoZSBzcGVjaWZpZWQgbG9jYXRpb24gb24gZGV2aWNlXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgYXBwZW5kRmlsZShvcHRpb25zOiBBcHBlbmRGaWxlT3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhIGZpbGUgZnJvbSBkaXNrXG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZGVsZXRlRmlsZShvcHRpb25zOiBEZWxldGVGaWxlT3B0aW9ucyk6IFByb21pc2U8dm9pZD47XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGRpcmVjdG9yeS5cbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBta2RpcihvcHRpb25zOiBNa2Rpck9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBkaXJlY3RvcnlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICBybWRpcihvcHRpb25zOiBSbWRpck9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBsaXN0IG9mIGZpbGVzIGZyb20gdGhlIGRpcmVjdG9yeSAobm90IHJlY3Vyc2l2ZSlcbiAgICpcbiAgICogQHNpbmNlIDEuMC4wXG4gICAqL1xuICByZWFkZGlyKG9wdGlvbnM6IFJlYWRkaXJPcHRpb25zKTogUHJvbWlzZTxSZWFkZGlyUmVzdWx0PjtcblxuICAvKipcbiAgICogUmV0dXJuIGZ1bGwgRmlsZSBVUkkgZm9yIGEgcGF0aCBhbmQgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgZ2V0VXJpKG9wdGlvbnM6IEdldFVyaU9wdGlvbnMpOiBQcm9taXNlPEdldFVyaVJlc3VsdD47XG5cbiAgLyoqXG4gICAqIFJldHVybiBkYXRhIGFib3V0IGEgZmlsZVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHN0YXQob3B0aW9uczogU3RhdE9wdGlvbnMpOiBQcm9taXNlPFN0YXRSZXN1bHQ+O1xuXG4gIC8qKlxuICAgKiBSZW5hbWUgYSBmaWxlIG9yIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAc2luY2UgMS4wLjBcbiAgICovXG4gIHJlbmFtZShvcHRpb25zOiBSZW5hbWVPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKipcbiAgICogQ29weSBhIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBzaW5jZSAxLjAuMFxuICAgKi9cbiAgY29weShvcHRpb25zOiBDb3B5T3B0aW9ucyk6IFByb21pc2U8Q29weVJlc3VsdD47XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gYSBodHRwIHJlcXVlc3QgdG8gYSBzZXJ2ZXIgYW5kIGRvd25sb2FkIHRoZSBmaWxlIHRvIHRoZSBzcGVjaWZpZWQgZGVzdGluYXRpb24uXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiA3LjEuMC5cbiAgICogV2UgcmVjb21tZW5kIHVzaW5nIHRoZSBAY2FwYWNpdG9yL2ZpbGUtdHJhbnNmZXIgcGx1Z2luIGluc3RlYWQsIGluIGNvbmp1bmN0aW9uIHdpdGggdGhpcyBwbHVnaW4uXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIEBjYXBhY2l0b3IvZmlsZS10cmFuc2ZlciBwbHVnaW4gaW5zdGVhZC5cbiAgICovXG4gIGRvd25sb2FkRmlsZShvcHRpb25zOiBEb3dubG9hZEZpbGVPcHRpb25zKTogUHJvbWlzZTxEb3dubG9hZEZpbGVSZXN1bHQ+O1xuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBmaWxlIGRvd25sb2FkIHByb2dyZXNzIGV2ZW50cy5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDcuMS4wLlxuICAgKiBXZSByZWNvbW1lbmQgdXNpbmcgdGhlIEBjYXBhY2l0b3IvZmlsZS10cmFuc2ZlciBwbHVnaW4gaW5zdGVhZCwgaW4gY29uanVuY3Rpb24gd2l0aCB0aGlzIHBsdWdpbi5cbiAgICpcbiAgICogQHNpbmNlIDUuMS4wXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgQGNhcGFjaXRvci9maWxlLXRyYW5zZmVyIHBsdWdpbiBpbnN0ZWFkLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIoZXZlbnROYW1lOiAncHJvZ3Jlc3MnLCBsaXN0ZW5lckZ1bmM6IFByb2dyZXNzTGlzdGVuZXIpOiBQcm9taXNlPFBsdWdpbkxpc3RlbmVySGFuZGxlPjtcblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIHRoaXMgcGx1Z2luLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gNy4xLjAuXG4gICAqIFdlIHJlY29tbWVuZCB1c2luZyB0aGUgQGNhcGFjaXRvci9maWxlLXRyYW5zZmVyIHBsdWdpbiBpbnN0ZWFkLCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoaXMgcGx1Z2luLlxuICAgKlxuICAgKiBAc2luY2UgNS4yLjBcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBAY2FwYWNpdG9yL2ZpbGUtdHJhbnNmZXIgcGx1Z2luIGluc3RlYWQuXG4gICAqL1xuICByZW1vdmVBbGxMaXN0ZW5lcnMoKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuLyoqXG4gKiBTdHJ1Y3R1cmUgZm9yIGVycm9ycyByZXR1cm5lZCBieSB0aGUgcGx1Z2luLlxuICpcbiAqIGBjb2RlYCBmb2xsb3dzIFwiT1MtUExVRy1GSUxFLVhYWFhcIiBmb3JtYXRcbiAqXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgUGx1Z2luRXJyb3IgPSB7XG4gIGNvZGU6IHN0cmluZztcbiAgbWVzc2FnZTogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFJlYWRGaWxlT3B0aW9uc2AuXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgRmlsZVJlYWRPcHRpb25zID0gUmVhZEZpbGVPcHRpb25zO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgUmVhZEZpbGVSZXN1bHRgLlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVSZWFkUmVzdWx0ID0gUmVhZEZpbGVSZXN1bHQ7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBXcml0ZUZpbGVPcHRpb25zYC5cbiAqIEBzaW5jZSAxLjAuMFxuICovXG5leHBvcnQgdHlwZSBGaWxlV3JpdGVPcHRpb25zID0gV3JpdGVGaWxlT3B0aW9ucztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFdyaXRlRmlsZVJlc3VsdGAuXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgRmlsZVdyaXRlUmVzdWx0ID0gV3JpdGVGaWxlUmVzdWx0O1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgQXBwZW5kRmlsZU9wdGlvbnNgLlxuICogQHNpbmNlIDEuMC4wXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVBcHBlbmRPcHRpb25zID0gQXBwZW5kRmlsZU9wdGlvbnM7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBEZWxldGVGaWxlT3B0aW9uc2AuXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgRmlsZURlbGV0ZU9wdGlvbnMgPSBEZWxldGVGaWxlT3B0aW9ucztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYERpcmVjdG9yeWAuXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IEZpbGVzeXN0ZW1EaXJlY3RvcnkgPSBEaXJlY3Rvcnk7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBFbmNvZGluZ2AuXG4gKiBAc2luY2UgMS4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IEZpbGVzeXN0ZW1FbmNvZGluZyA9IEVuY29kaW5nO1xuIiwgImltcG9ydCB7IFdlYlBsdWdpbiwgYnVpbGRSZXF1ZXN0SW5pdCB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5cbmltcG9ydCB0eXBlIHtcbiAgQXBwZW5kRmlsZU9wdGlvbnMsXG4gIENvcHlPcHRpb25zLFxuICBDb3B5UmVzdWx0LFxuICBEZWxldGVGaWxlT3B0aW9ucyxcbiAgRmlsZXN5c3RlbVBsdWdpbixcbiAgR2V0VXJpT3B0aW9ucyxcbiAgR2V0VXJpUmVzdWx0LFxuICBNa2Rpck9wdGlvbnMsXG4gIFBlcm1pc3Npb25TdGF0dXMsXG4gIFJlYWRGaWxlT3B0aW9ucyxcbiAgUmVhZEZpbGVSZXN1bHQsXG4gIFJlYWRkaXJPcHRpb25zLFxuICBSZWFkZGlyUmVzdWx0LFxuICBSZW5hbWVPcHRpb25zLFxuICBSbWRpck9wdGlvbnMsXG4gIFN0YXRPcHRpb25zLFxuICBTdGF0UmVzdWx0LFxuICBXcml0ZUZpbGVPcHRpb25zLFxuICBXcml0ZUZpbGVSZXN1bHQsXG4gIERpcmVjdG9yeSxcbiAgUmVhZEZpbGVJbkNodW5rc09wdGlvbnMsXG4gIENhbGxiYWNrSUQsXG4gIERvd25sb2FkRmlsZU9wdGlvbnMsXG4gIERvd25sb2FkRmlsZVJlc3VsdCxcbiAgUHJvZ3Jlc3NTdGF0dXMsXG4gIFJlYWRGaWxlSW5DaHVua3NDYWxsYmFjayxcbn0gZnJvbSAnLi9kZWZpbml0aW9ucyc7XG5pbXBvcnQgeyBFbmNvZGluZyB9IGZyb20gJy4vZGVmaW5pdGlvbnMnO1xuXG5mdW5jdGlvbiByZXNvbHZlKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBvc2l4ID0gcGF0aC5zcGxpdCgnLycpLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gJy4nKTtcbiAgY29uc3QgbmV3UG9zaXg6IHN0cmluZ1tdID0gW107XG5cbiAgcG9zaXguZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGlmIChpdGVtID09PSAnLi4nICYmIG5ld1Bvc2l4Lmxlbmd0aCA+IDAgJiYgbmV3UG9zaXhbbmV3UG9zaXgubGVuZ3RoIC0gMV0gIT09ICcuLicpIHtcbiAgICAgIG5ld1Bvc2l4LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdQb3NpeC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG5ld1Bvc2l4LmpvaW4oJy8nKTtcbn1cbmZ1bmN0aW9uIGlzUGF0aFBhcmVudChwYXJlbnQ6IHN0cmluZywgY2hpbGRyZW46IHN0cmluZyk6IGJvb2xlYW4ge1xuICBwYXJlbnQgPSByZXNvbHZlKHBhcmVudCk7XG4gIGNoaWxkcmVuID0gcmVzb2x2ZShjaGlsZHJlbik7XG4gIGNvbnN0IHBhdGhzQSA9IHBhcmVudC5zcGxpdCgnLycpO1xuICBjb25zdCBwYXRoc0IgPSBjaGlsZHJlbi5zcGxpdCgnLycpO1xuXG4gIHJldHVybiBwYXJlbnQgIT09IGNoaWxkcmVuICYmIHBhdGhzQS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZSA9PT0gcGF0aHNCW2luZGV4XSk7XG59XG5cbmV4cG9ydCBjbGFzcyBGaWxlc3lzdGVtV2ViIGV4dGVuZHMgV2ViUGx1Z2luIGltcGxlbWVudHMgRmlsZXN5c3RlbVBsdWdpbiB7XG4gIHJlYWRGaWxlSW5DaHVua3MoX29wdGlvbnM6IFJlYWRGaWxlSW5DaHVua3NPcHRpb25zLCBfY2FsbGJhY2s6IFJlYWRGaWxlSW5DaHVua3NDYWxsYmFjayk6IFByb21pc2U8Q2FsbGJhY2tJRD4ge1xuICAgIHRocm93IHRoaXMudW5hdmFpbGFibGUoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cbiAgREJfVkVSU0lPTiA9IDE7XG4gIERCX05BTUUgPSAnRGlzYyc7XG5cbiAgcHJpdmF0ZSBfd3JpdGVDbWRzOiBzdHJpbmdbXSA9IFsnYWRkJywgJ3B1dCcsICdkZWxldGUnXTtcbiAgcHJpdmF0ZSBfZGI/OiBJREJEYXRhYmFzZTtcbiAgc3RhdGljIF9kZWJ1ZyA9IHRydWU7XG4gIGFzeW5jIGluaXREYigpOiBQcm9taXNlPElEQkRhdGFiYXNlPiB7XG4gICAgaWYgKHRoaXMuX2RiICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kYjtcbiAgICB9XG4gICAgaWYgKCEoJ2luZGV4ZWREQicgaW4gd2luZG93KSkge1xuICAgICAgdGhyb3cgdGhpcy51bmF2YWlsYWJsZShcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgSW5kZXhlZERCXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxJREJEYXRhYmFzZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKHRoaXMuREJfTkFNRSwgdGhpcy5EQl9WRVJTSU9OKTtcbiAgICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gRmlsZXN5c3RlbVdlYi5kb1VwZ3JhZGU7XG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5fZGIgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgcmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgcmVxdWVzdC5vbmJsb2NrZWQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUud2FybignZGIgYmxvY2tlZCcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBkb1VwZ3JhZGUoZXZlbnQ6IElEQlZlcnNpb25DaGFuZ2VFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIElEQk9wZW5EQlJlcXVlc3Q7XG4gICAgY29uc3QgZGIgPSBldmVudFRhcmdldC5yZXN1bHQ7XG4gICAgc3dpdGNoIChldmVudC5vbGRWZXJzaW9uKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICBjYXNlIDE6XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmIChkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKCdGaWxlU3RvcmFnZScpKSB7XG4gICAgICAgICAgZGIuZGVsZXRlT2JqZWN0U3RvcmUoJ0ZpbGVTdG9yYWdlJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RvcmUgPSBkYi5jcmVhdGVPYmplY3RTdG9yZSgnRmlsZVN0b3JhZ2UnLCB7IGtleVBhdGg6ICdwYXRoJyB9KTtcbiAgICAgICAgc3RvcmUuY3JlYXRlSW5kZXgoJ2J5X2ZvbGRlcicsICdmb2xkZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBkYlJlcXVlc3QoY21kOiBzdHJpbmcsIGFyZ3M6IGFueVtdKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCByZWFkRmxhZyA9IHRoaXMuX3dyaXRlQ21kcy5pbmRleE9mKGNtZCkgIT09IC0xID8gJ3JlYWR3cml0ZScgOiAncmVhZG9ubHknO1xuICAgIHJldHVybiB0aGlzLmluaXREYigpLnRoZW4oKGNvbm46IElEQkRhdGFiYXNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8SURCT2JqZWN0U3RvcmU+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdHg6IElEQlRyYW5zYWN0aW9uID0gY29ubi50cmFuc2FjdGlvbihbJ0ZpbGVTdG9yYWdlJ10sIHJlYWRGbGFnKTtcbiAgICAgICAgY29uc3Qgc3RvcmU6IGFueSA9IHR4Lm9iamVjdFN0b3JlKCdGaWxlU3RvcmFnZScpO1xuICAgICAgICBjb25zdCByZXEgPSBzdG9yZVtjbWRdKC4uLmFyZ3MpO1xuICAgICAgICByZXEub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShyZXEucmVzdWx0KTtcbiAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QocmVxLmVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZGJJbmRleFJlcXVlc3QoaW5kZXhOYW1lOiBzdHJpbmcsIGNtZDogc3RyaW5nLCBhcmdzOiBbYW55XSk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcmVhZEZsYWcgPSB0aGlzLl93cml0ZUNtZHMuaW5kZXhPZihjbWQpICE9PSAtMSA/ICdyZWFkd3JpdGUnIDogJ3JlYWRvbmx5JztcbiAgICByZXR1cm4gdGhpcy5pbml0RGIoKS50aGVuKChjb25uOiBJREJEYXRhYmFzZSkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPElEQk9iamVjdFN0b3JlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHR4OiBJREJUcmFuc2FjdGlvbiA9IGNvbm4udHJhbnNhY3Rpb24oWydGaWxlU3RvcmFnZSddLCByZWFkRmxhZyk7XG4gICAgICAgIGNvbnN0IHN0b3JlOiBJREJPYmplY3RTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdGaWxlU3RvcmFnZScpO1xuICAgICAgICBjb25zdCBpbmRleDogYW55ID0gc3RvcmUuaW5kZXgoaW5kZXhOYW1lKTtcbiAgICAgICAgY29uc3QgcmVxID0gaW5kZXhbY21kXSguLi5hcmdzKSBhcyBhbnk7XG4gICAgICAgIHJlcS5vbnN1Y2Nlc3MgPSAoKSA9PiByZXNvbHZlKHJlcS5yZXN1bHQpO1xuICAgICAgICByZXEub25lcnJvciA9ICgpID0+IHJlamVjdChyZXEuZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldFBhdGgoZGlyZWN0b3J5OiBEaXJlY3RvcnkgfCB1bmRlZmluZWQsIHVyaVBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgY29uc3QgY2xlYW5lZFVyaVBhdGggPSB1cmlQYXRoICE9PSB1bmRlZmluZWQgPyB1cmlQYXRoLnJlcGxhY2UoL15bL10rfFsvXSskL2csICcnKSA6ICcnO1xuICAgIGxldCBmc1BhdGggPSAnJztcbiAgICBpZiAoZGlyZWN0b3J5ICE9PSB1bmRlZmluZWQpIGZzUGF0aCArPSAnLycgKyBkaXJlY3Rvcnk7XG4gICAgaWYgKHVyaVBhdGggIT09ICcnKSBmc1BhdGggKz0gJy8nICsgY2xlYW5lZFVyaVBhdGg7XG4gICAgcmV0dXJuIGZzUGF0aDtcbiAgfVxuXG4gIGFzeW5jIGNsZWFyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNvbm46IElEQkRhdGFiYXNlID0gYXdhaXQgdGhpcy5pbml0RGIoKTtcbiAgICBjb25zdCB0eDogSURCVHJhbnNhY3Rpb24gPSBjb25uLnRyYW5zYWN0aW9uKFsnRmlsZVN0b3JhZ2UnXSwgJ3JlYWR3cml0ZScpO1xuICAgIGNvbnN0IHN0b3JlOiBJREJPYmplY3RTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdGaWxlU3RvcmFnZScpO1xuICAgIHN0b3JlLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVhZCBhIGZpbGUgZnJvbSBkaXNrXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgZm9yIHRoZSBmaWxlIHJlYWRcbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZWFkIGZpbGUgZGF0YSByZXN1bHRcbiAgICovXG4gIGFzeW5jIHJlYWRGaWxlKG9wdGlvbnM6IFJlYWRGaWxlT3B0aW9ucyk6IFByb21pc2U8UmVhZEZpbGVSZXN1bHQ+IHtcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSB0aGlzLmdldFBhdGgob3B0aW9ucy5kaXJlY3RvcnksIG9wdGlvbnMucGF0aCk7XG4gICAgLy8gY29uc3QgZW5jb2RpbmcgPSBvcHRpb25zLmVuY29kaW5nO1xuXG4gICAgY29uc3QgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcignRmlsZSBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICByZXR1cm4geyBkYXRhOiBlbnRyeS5jb250ZW50ID8gZW50cnkuY29udGVudCA6ICcnIH07XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgYSBmaWxlIHRvIGRpc2sgaW4gdGhlIHNwZWNpZmllZCBsb2NhdGlvbiBvbiBkZXZpY2VcbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBmb3IgdGhlIGZpbGUgd3JpdGVcbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBmaWxlIHdyaXRlIHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgd3JpdGVGaWxlKG9wdGlvbnM6IFdyaXRlRmlsZU9wdGlvbnMpOiBQcm9taXNlPFdyaXRlRmlsZVJlc3VsdD4ge1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChvcHRpb25zLmRpcmVjdG9yeSwgb3B0aW9ucy5wYXRoKTtcbiAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICBjb25zdCBlbmNvZGluZyA9IG9wdGlvbnMuZW5jb2Rpbmc7XG4gICAgY29uc3QgZG9SZWN1cnNpdmUgPSBvcHRpb25zLnJlY3Vyc2l2ZTtcblxuICAgIGNvbnN0IG9jY3VwaWVkRW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChvY2N1cGllZEVudHJ5ICYmIG9jY3VwaWVkRW50cnkudHlwZSA9PT0gJ2RpcmVjdG9yeScpIHRocm93IEVycm9yKCdUaGUgc3VwcGxpZWQgcGF0aCBpcyBhIGRpcmVjdG9yeS4nKTtcblxuICAgIGNvbnN0IHBhcmVudFBhdGggPSBwYXRoLnN1YnN0cigwLCBwYXRoLmxhc3RJbmRleE9mKCcvJykpO1xuXG4gICAgY29uc3QgcGFyZW50RW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXJlbnRQYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChwYXJlbnRFbnRyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBzdWJEaXJJbmRleCA9IHBhcmVudFBhdGguaW5kZXhPZignLycsIDEpO1xuICAgICAgaWYgKHN1YkRpckluZGV4ICE9PSAtMSkge1xuICAgICAgICBjb25zdCBwYXJlbnRBcmdQYXRoID0gcGFyZW50UGF0aC5zdWJzdHIoc3ViRGlySW5kZXgpO1xuICAgICAgICBhd2FpdCB0aGlzLm1rZGlyKHtcbiAgICAgICAgICBwYXRoOiBwYXJlbnRBcmdQYXRoLFxuICAgICAgICAgIGRpcmVjdG9yeTogb3B0aW9ucy5kaXJlY3RvcnksXG4gICAgICAgICAgcmVjdXJzaXZlOiBkb1JlY3Vyc2l2ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFlbmNvZGluZyAmJiAhKGRhdGEgaW5zdGFuY2VvZiBCbG9iKSkge1xuICAgICAgZGF0YSA9IGRhdGEuaW5kZXhPZignLCcpID49IDAgPyBkYXRhLnNwbGl0KCcsJylbMV0gOiBkYXRhO1xuICAgICAgaWYgKCF0aGlzLmlzQmFzZTY0U3RyaW5nKGRhdGEpKSB0aHJvdyBFcnJvcignVGhlIHN1cHBsaWVkIGRhdGEgaXMgbm90IHZhbGlkIGJhc2U2NCBjb250ZW50LicpO1xuICAgIH1cblxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgY29uc3QgcGF0aE9iajogRW50cnlPYmogPSB7XG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgZm9sZGVyOiBwYXJlbnRQYXRoLFxuICAgICAgdHlwZTogJ2ZpbGUnLFxuICAgICAgc2l6ZTogZGF0YSBpbnN0YW5jZW9mIEJsb2IgPyBkYXRhLnNpemUgOiBkYXRhLmxlbmd0aCxcbiAgICAgIGN0aW1lOiBub3csXG4gICAgICBtdGltZTogbm93LFxuICAgICAgY29udGVudDogZGF0YSxcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdwdXQnLCBbcGF0aE9ial0pO1xuICAgIHJldHVybiB7XG4gICAgICB1cmk6IHBhdGhPYmoucGF0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZCB0byBhIGZpbGUgb24gZGlzayBpbiB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uIG9uIGRldmljZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGUgZmlsZSBhcHBlbmRcbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBmaWxlIHdyaXRlIHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgYXBwZW5kRmlsZShvcHRpb25zOiBBcHBlbmRGaWxlT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChvcHRpb25zLmRpcmVjdG9yeSwgb3B0aW9ucy5wYXRoKTtcbiAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcbiAgICBjb25zdCBlbmNvZGluZyA9IG9wdGlvbnMuZW5jb2Rpbmc7XG4gICAgY29uc3QgcGFyZW50UGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGgubGFzdEluZGV4T2YoJy8nKSk7XG5cbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGxldCBjdGltZSA9IG5vdztcblxuICAgIGNvbnN0IG9jY3VwaWVkRW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChvY2N1cGllZEVudHJ5ICYmIG9jY3VwaWVkRW50cnkudHlwZSA9PT0gJ2RpcmVjdG9yeScpIHRocm93IEVycm9yKCdUaGUgc3VwcGxpZWQgcGF0aCBpcyBhIGRpcmVjdG9yeS4nKTtcblxuICAgIGNvbnN0IHBhcmVudEVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGFyZW50UGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAocGFyZW50RW50cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3Qgc3ViRGlySW5kZXggPSBwYXJlbnRQYXRoLmluZGV4T2YoJy8nLCAxKTtcbiAgICAgIGlmIChzdWJEaXJJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29uc3QgcGFyZW50QXJnUGF0aCA9IHBhcmVudFBhdGguc3Vic3RyKHN1YkRpckluZGV4KTtcbiAgICAgICAgYXdhaXQgdGhpcy5ta2Rpcih7XG4gICAgICAgICAgcGF0aDogcGFyZW50QXJnUGF0aCxcbiAgICAgICAgICBkaXJlY3Rvcnk6IG9wdGlvbnMuZGlyZWN0b3J5LFxuICAgICAgICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFlbmNvZGluZyAmJiAhdGhpcy5pc0Jhc2U2NFN0cmluZyhkYXRhKSkgdGhyb3cgRXJyb3IoJ1RoZSBzdXBwbGllZCBkYXRhIGlzIG5vdCB2YWxpZCBiYXNlNjQgY29udGVudC4nKTtcblxuICAgIGlmIChvY2N1cGllZEVudHJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChvY2N1cGllZEVudHJ5LmNvbnRlbnQgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdUaGUgb2NjdXBpZWQgZW50cnkgY29udGFpbnMgYSBCbG9iIG9iamVjdCB3aGljaCBjYW5ub3QgYmUgYXBwZW5kZWQgdG8uJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvY2N1cGllZEVudHJ5LmNvbnRlbnQgIT09IHVuZGVmaW5lZCAmJiAhZW5jb2RpbmcpIHtcbiAgICAgICAgZGF0YSA9IGJ0b2EoYXRvYihvY2N1cGllZEVudHJ5LmNvbnRlbnQpICsgYXRvYihkYXRhKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhID0gb2NjdXBpZWRFbnRyeS5jb250ZW50ICsgZGF0YTtcbiAgICAgIH1cbiAgICAgIGN0aW1lID0gb2NjdXBpZWRFbnRyeS5jdGltZTtcbiAgICB9XG4gICAgY29uc3QgcGF0aE9iajogRW50cnlPYmogPSB7XG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgZm9sZGVyOiBwYXJlbnRQYXRoLFxuICAgICAgdHlwZTogJ2ZpbGUnLFxuICAgICAgc2l6ZTogZGF0YS5sZW5ndGgsXG4gICAgICBjdGltZTogY3RpbWUsXG4gICAgICBtdGltZTogbm93LFxuICAgICAgY29udGVudDogZGF0YSxcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdwdXQnLCBbcGF0aE9ial0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhIGZpbGUgZnJvbSBkaXNrXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgZm9yIHRoZSBmaWxlIGRlbGV0ZVxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGRlbGV0ZWQgZmlsZSBkYXRhIHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgZGVsZXRlRmlsZShvcHRpb25zOiBEZWxldGVGaWxlT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChvcHRpb25zLmRpcmVjdG9yeSwgb3B0aW9ucy5wYXRoKTtcblxuICAgIGNvbnN0IGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAoZW50cnkgPT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3IoJ0ZpbGUgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgY29uc3QgZW50cmllcyA9IGF3YWl0IHRoaXMuZGJJbmRleFJlcXVlc3QoJ2J5X2ZvbGRlcicsICdnZXRBbGxLZXlzJywgW0lEQktleVJhbmdlLm9ubHkocGF0aCldKTtcbiAgICBpZiAoZW50cmllcy5sZW5ndGggIT09IDApIHRocm93IEVycm9yKCdGb2xkZXIgaXMgbm90IGVtcHR5LicpO1xuXG4gICAgYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2RlbGV0ZScsIFtwYXRoXSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGlyZWN0b3J5LlxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGUgbWtkaXJcbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBta2RpciByZXN1bHRcbiAgICovXG4gIGFzeW5jIG1rZGlyKG9wdGlvbnM6IE1rZGlyT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhdGg6IHN0cmluZyA9IHRoaXMuZ2V0UGF0aChvcHRpb25zLmRpcmVjdG9yeSwgb3B0aW9ucy5wYXRoKTtcbiAgICBjb25zdCBkb1JlY3Vyc2l2ZSA9IG9wdGlvbnMucmVjdXJzaXZlO1xuICAgIGNvbnN0IHBhcmVudFBhdGggPSBwYXRoLnN1YnN0cigwLCBwYXRoLmxhc3RJbmRleE9mKCcvJykpO1xuXG4gICAgY29uc3QgZGVwdGggPSAocGF0aC5tYXRjaCgvXFwvL2cpIHx8IFtdKS5sZW5ndGg7XG4gICAgY29uc3QgcGFyZW50RW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXJlbnRQYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGNvbnN0IG9jY3VwaWVkRW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChkZXB0aCA9PT0gMSkgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgUm9vdCBkaXJlY3RvcnknKTtcbiAgICBpZiAob2NjdXBpZWRFbnRyeSAhPT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcignQ3VycmVudCBkaXJlY3RvcnkgZG9lcyBhbHJlYWR5IGV4aXN0LicpO1xuICAgIGlmICghZG9SZWN1cnNpdmUgJiYgZGVwdGggIT09IDIgJiYgcGFyZW50RW50cnkgPT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3IoJ1BhcmVudCBkaXJlY3RvcnkgbXVzdCBleGlzdCcpO1xuXG4gICAgaWYgKGRvUmVjdXJzaXZlICYmIGRlcHRoICE9PSAyICYmIHBhcmVudEVudHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHBhcmVudEFyZ1BhdGggPSBwYXJlbnRQYXRoLnN1YnN0cihwYXJlbnRQYXRoLmluZGV4T2YoJy8nLCAxKSk7XG4gICAgICBhd2FpdCB0aGlzLm1rZGlyKHtcbiAgICAgICAgcGF0aDogcGFyZW50QXJnUGF0aCxcbiAgICAgICAgZGlyZWN0b3J5OiBvcHRpb25zLmRpcmVjdG9yeSxcbiAgICAgICAgcmVjdXJzaXZlOiBkb1JlY3Vyc2l2ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHBhdGhPYmo6IEVudHJ5T2JqID0ge1xuICAgICAgcGF0aDogcGF0aCxcbiAgICAgIGZvbGRlcjogcGFyZW50UGF0aCxcbiAgICAgIHR5cGU6ICdkaXJlY3RvcnknLFxuICAgICAgc2l6ZTogMCxcbiAgICAgIGN0aW1lOiBub3csXG4gICAgICBtdGltZTogbm93LFxuICAgIH07XG4gICAgYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ3B1dCcsIFtwYXRoT2JqXSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgZGlyZWN0b3J5IHJlbW92ZVxuICAgKi9cbiAgYXN5bmMgcm1kaXIob3B0aW9uczogUm1kaXJPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBwYXRoLCBkaXJlY3RvcnksIHJlY3Vyc2l2ZSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBmdWxsUGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKGRpcmVjdG9yeSwgcGF0aCk7XG5cbiAgICBjb25zdCBlbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW2Z1bGxQYXRoXSkpIGFzIEVudHJ5T2JqO1xuXG4gICAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKCdGb2xkZXIgZG9lcyBub3QgZXhpc3QuJyk7XG5cbiAgICBpZiAoZW50cnkudHlwZSAhPT0gJ2RpcmVjdG9yeScpIHRocm93IEVycm9yKCdSZXF1ZXN0ZWQgcGF0aCBpcyBub3QgYSBkaXJlY3RvcnknKTtcblxuICAgIGNvbnN0IHJlYWREaXJSZXN1bHQgPSBhd2FpdCB0aGlzLnJlYWRkaXIoeyBwYXRoLCBkaXJlY3RvcnkgfSk7XG5cbiAgICBpZiAocmVhZERpclJlc3VsdC5maWxlcy5sZW5ndGggIT09IDAgJiYgIXJlY3Vyc2l2ZSkgdGhyb3cgRXJyb3IoJ0ZvbGRlciBpcyBub3QgZW1wdHknKTtcblxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgcmVhZERpclJlc3VsdC5maWxlcykge1xuICAgICAgY29uc3QgZW50cnlQYXRoID0gYCR7cGF0aH0vJHtlbnRyeS5uYW1lfWA7XG4gICAgICBjb25zdCBlbnRyeU9iaiA9IGF3YWl0IHRoaXMuc3RhdCh7IHBhdGg6IGVudHJ5UGF0aCwgZGlyZWN0b3J5IH0pO1xuICAgICAgaWYgKGVudHJ5T2JqLnR5cGUgPT09ICdmaWxlJykge1xuICAgICAgICBhd2FpdCB0aGlzLmRlbGV0ZUZpbGUoeyBwYXRoOiBlbnRyeVBhdGgsIGRpcmVjdG9yeSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHRoaXMucm1kaXIoeyBwYXRoOiBlbnRyeVBhdGgsIGRpcmVjdG9yeSwgcmVjdXJzaXZlIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdkZWxldGUnLCBbZnVsbFBhdGhdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBsaXN0IG9mIGZpbGVzIGZyb20gdGhlIGRpcmVjdG9yeSAobm90IHJlY3Vyc2l2ZSlcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSByZWFkZGlyIG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlYWRkaXIgZGlyZWN0b3J5IGxpc3RpbmcgcmVzdWx0XG4gICAqL1xuICBhc3luYyByZWFkZGlyKG9wdGlvbnM6IFJlYWRkaXJPcHRpb25zKTogUHJvbWlzZTxSZWFkZGlyUmVzdWx0PiB7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKG9wdGlvbnMuZGlyZWN0b3J5LCBvcHRpb25zLnBhdGgpO1xuXG4gICAgY29uc3QgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoXSkpIGFzIEVudHJ5T2JqO1xuICAgIGlmIChvcHRpb25zLnBhdGggIT09ICcnICYmIGVudHJ5ID09PSB1bmRlZmluZWQpIHRocm93IEVycm9yKCdGb2xkZXIgZG9lcyBub3QgZXhpc3QuJyk7XG5cbiAgICBjb25zdCBlbnRyaWVzOiBzdHJpbmdbXSA9IGF3YWl0IHRoaXMuZGJJbmRleFJlcXVlc3QoJ2J5X2ZvbGRlcicsICdnZXRBbGxLZXlzJywgW0lEQktleVJhbmdlLm9ubHkocGF0aCldKTtcbiAgICBjb25zdCBmaWxlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgZW50cmllcy5tYXAoYXN5bmMgKGUpID0+IHtcbiAgICAgICAgbGV0IHN1YkVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbZV0pKSBhcyBFbnRyeU9iajtcbiAgICAgICAgaWYgKHN1YkVudHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdWJFbnRyeSA9IChhd2FpdCB0aGlzLmRiUmVxdWVzdCgnZ2V0JywgW2UgKyAnLyddKSkgYXMgRW50cnlPYmo7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBlLnN1YnN0cmluZyhwYXRoLmxlbmd0aCArIDEpLFxuICAgICAgICAgIHR5cGU6IHN1YkVudHJ5LnR5cGUsXG4gICAgICAgICAgc2l6ZTogc3ViRW50cnkuc2l6ZSxcbiAgICAgICAgICBjdGltZTogc3ViRW50cnkuY3RpbWUsXG4gICAgICAgICAgbXRpbWU6IHN1YkVudHJ5Lm10aW1lLFxuICAgICAgICAgIHVyaTogc3ViRW50cnkucGF0aCxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgcmV0dXJuIHsgZmlsZXM6IGZpbGVzIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGZ1bGwgRmlsZSBVUkkgZm9yIGEgcGF0aCBhbmQgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgc3RhdCBvcGVyYXRpb25cbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBmaWxlIHN0YXQgcmVzdWx0XG4gICAqL1xuICBhc3luYyBnZXRVcmkob3B0aW9uczogR2V0VXJpT3B0aW9ucyk6IFByb21pc2U8R2V0VXJpUmVzdWx0PiB7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKG9wdGlvbnMuZGlyZWN0b3J5LCBvcHRpb25zLnBhdGgpO1xuXG4gICAgbGV0IGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAoZW50cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoICsgJy8nXSkpIGFzIEVudHJ5T2JqO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdXJpOiBlbnRyeT8ucGF0aCB8fCBwYXRoLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGRhdGEgYWJvdXQgYSBmaWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgc3RhdCBvcGVyYXRpb25cbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBmaWxlIHN0YXQgcmVzdWx0XG4gICAqL1xuICBhc3luYyBzdGF0KG9wdGlvbnM6IFN0YXRPcHRpb25zKTogUHJvbWlzZTxTdGF0UmVzdWx0PiB7XG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKG9wdGlvbnMuZGlyZWN0b3J5LCBvcHRpb25zLnBhdGgpO1xuXG4gICAgbGV0IGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbcGF0aF0pKSBhcyBFbnRyeU9iajtcbiAgICBpZiAoZW50cnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZW50cnkgPSAoYXdhaXQgdGhpcy5kYlJlcXVlc3QoJ2dldCcsIFtwYXRoICsgJy8nXSkpIGFzIEVudHJ5T2JqO1xuICAgIH1cbiAgICBpZiAoZW50cnkgPT09IHVuZGVmaW5lZCkgdGhyb3cgRXJyb3IoJ0VudHJ5IGRvZXMgbm90IGV4aXN0LicpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGVudHJ5LnBhdGguc3Vic3RyaW5nKHBhdGgubGVuZ3RoICsgMSksXG4gICAgICB0eXBlOiBlbnRyeS50eXBlLFxuICAgICAgc2l6ZTogZW50cnkuc2l6ZSxcbiAgICAgIGN0aW1lOiBlbnRyeS5jdGltZSxcbiAgICAgIG10aW1lOiBlbnRyeS5tdGltZSxcbiAgICAgIHVyaTogZW50cnkucGF0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmFtZSBhIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgcmVuYW1lIG9wZXJhdGlvblxuICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlbmFtZSByZXN1bHRcbiAgICovXG4gIGFzeW5jIHJlbmFtZShvcHRpb25zOiBSZW5hbWVPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fY29weShvcHRpb25zLCB0cnVlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogQ29weSBhIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgY29weSBvcGVyYXRpb25cbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBjb3B5IHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgY29weShvcHRpb25zOiBDb3B5T3B0aW9ucyk6IFByb21pc2U8Q29weVJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLl9jb3B5KG9wdGlvbnMsIGZhbHNlKTtcbiAgfVxuXG4gIGFzeW5jIHJlcXVlc3RQZXJtaXNzaW9ucygpOiBQcm9taXNlPFBlcm1pc3Npb25TdGF0dXM+IHtcbiAgICByZXR1cm4geyBwdWJsaWNTdG9yYWdlOiAnZ3JhbnRlZCcgfTtcbiAgfVxuXG4gIGFzeW5jIGNoZWNrUGVybWlzc2lvbnMoKTogUHJvbWlzZTxQZXJtaXNzaW9uU3RhdHVzPiB7XG4gICAgcmV0dXJuIHsgcHVibGljU3RvcmFnZTogJ2dyYW50ZWQnIH07XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCBjYW4gcGVyZm9ybSBhIGNvcHkgb3IgYSByZW5hbWVcbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSByZW5hbWUgb3BlcmF0aW9uXG4gICAqIEBwYXJhbSBkb1JlbmFtZSB3aGV0aGVyIHRvIHBlcmZvcm0gYSByZW5hbWUgb3IgY29weSBvcGVyYXRpb25cbiAgICogQHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZXN1bHRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX2NvcHkob3B0aW9uczogQ29weU9wdGlvbnMsIGRvUmVuYW1lID0gZmFsc2UpOiBQcm9taXNlPENvcHlSZXN1bHQ+IHtcbiAgICBsZXQgeyB0b0RpcmVjdG9yeSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCB7IHRvLCBmcm9tLCBkaXJlY3Rvcnk6IGZyb21EaXJlY3RvcnkgfSA9IG9wdGlvbnM7XG5cbiAgICBpZiAoIXRvIHx8ICFmcm9tKSB7XG4gICAgICB0aHJvdyBFcnJvcignQm90aCB0byBhbmQgZnJvbSBtdXN0IGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gXCJ0b1wiIGRpcmVjdG9yeSBpcyBwcm92aWRlZCwgdXNlIHRoZSBcImZyb21cIiBkaXJlY3RvcnlcbiAgICBpZiAoIXRvRGlyZWN0b3J5KSB7XG4gICAgICB0b0RpcmVjdG9yeSA9IGZyb21EaXJlY3Rvcnk7XG4gICAgfVxuXG4gICAgY29uc3QgZnJvbVBhdGggPSB0aGlzLmdldFBhdGgoZnJvbURpcmVjdG9yeSwgZnJvbSk7XG4gICAgY29uc3QgdG9QYXRoID0gdGhpcy5nZXRQYXRoKHRvRGlyZWN0b3J5LCB0byk7XG5cbiAgICAvLyBUZXN0IHRoYXQgdGhlIFwidG9cIiBhbmQgXCJmcm9tXCIgbG9jYXRpb25zIGFyZSBkaWZmZXJlbnRcbiAgICBpZiAoZnJvbVBhdGggPT09IHRvUGF0aCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJpOiB0b1BhdGgsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmIChpc1BhdGhQYXJlbnQoZnJvbVBhdGgsIHRvUGF0aCkpIHtcbiAgICAgIHRocm93IEVycm9yKCdUbyBwYXRoIGNhbm5vdCBjb250YWluIHRoZSBmcm9tIHBhdGgnKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0aGUgc3RhdGUgb2YgdGhlIFwidG9cIiBsb2NhdGlvblxuICAgIGxldCB0b09iajtcbiAgICB0cnkge1xuICAgICAgdG9PYmogPSBhd2FpdCB0aGlzLnN0YXQoe1xuICAgICAgICBwYXRoOiB0byxcbiAgICAgICAgZGlyZWN0b3J5OiB0b0RpcmVjdG9yeSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFRvIGxvY2F0aW9uIGRvZXMgbm90IGV4aXN0LCBlbnN1cmUgdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIFwidG9cIiBsb2NhdGlvbiBleGlzdHMgYW5kIGlzIGEgZGlyZWN0b3J5XG4gICAgICBjb25zdCB0b1BhdGhDb21wb25lbnRzID0gdG8uc3BsaXQoJy8nKTtcbiAgICAgIHRvUGF0aENvbXBvbmVudHMucG9wKCk7XG4gICAgICBjb25zdCB0b1BhdGggPSB0b1BhdGhDb21wb25lbnRzLmpvaW4oJy8nKTtcblxuICAgICAgLy8gQ2hlY2sgdGhlIGNvbnRhaW5pbmcgZGlyZWN0b3J5IG9mIHRoZSBcInRvXCIgbG9jYXRpb24gZXhpc3RzXG4gICAgICBpZiAodG9QYXRoQ29tcG9uZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHRvUGFyZW50RGlyZWN0b3J5ID0gYXdhaXQgdGhpcy5zdGF0KHtcbiAgICAgICAgICBwYXRoOiB0b1BhdGgsXG4gICAgICAgICAgZGlyZWN0b3J5OiB0b0RpcmVjdG9yeSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRvUGFyZW50RGlyZWN0b3J5LnR5cGUgIT09ICdkaXJlY3RvcnknKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXJlbnQgZGlyZWN0b3J5IG9mIHRoZSB0byBwYXRoIGlzIGEgZmlsZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2Fubm90IG92ZXJ3cml0ZSBhIGRpcmVjdG9yeVxuICAgIGlmICh0b09iaiAmJiB0b09iai50eXBlID09PSAnZGlyZWN0b3J5Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgb3ZlcndyaXRlIGEgZGlyZWN0b3J5IHdpdGggYSBmaWxlJyk7XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoZSBcImZyb21cIiBvYmplY3QgZXhpc3RzXG4gICAgY29uc3QgZnJvbU9iaiA9IGF3YWl0IHRoaXMuc3RhdCh7XG4gICAgICBwYXRoOiBmcm9tLFxuICAgICAgZGlyZWN0b3J5OiBmcm9tRGlyZWN0b3J5LFxuICAgIH0pO1xuXG4gICAgLy8gU2V0IHRoZSBtdGltZS9jdGltZSBvZiB0aGUgc3VwcGxpZWQgcGF0aFxuICAgIGNvbnN0IHVwZGF0ZVRpbWUgPSBhc3luYyAocGF0aDogc3RyaW5nLCBjdGltZTogbnVtYmVyLCBtdGltZTogbnVtYmVyKSA9PiB7XG4gICAgICBjb25zdCBmdWxsUGF0aDogc3RyaW5nID0gdGhpcy5nZXRQYXRoKHRvRGlyZWN0b3J5LCBwYXRoKTtcbiAgICAgIGNvbnN0IGVudHJ5ID0gKGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdnZXQnLCBbZnVsbFBhdGhdKSkgYXMgRW50cnlPYmo7XG4gICAgICBlbnRyeS5jdGltZSA9IGN0aW1lO1xuICAgICAgZW50cnkubXRpbWUgPSBtdGltZTtcbiAgICAgIGF3YWl0IHRoaXMuZGJSZXF1ZXN0KCdwdXQnLCBbZW50cnldKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3RpbWUgPSBmcm9tT2JqLmN0aW1lID8gZnJvbU9iai5jdGltZSA6IERhdGUubm93KCk7XG5cbiAgICBzd2l0Y2ggKGZyb21PYmoudHlwZSkge1xuICAgICAgLy8gVGhlIFwiZnJvbVwiIG9iamVjdCBpcyBhIGZpbGVcbiAgICAgIGNhc2UgJ2ZpbGUnOiB7XG4gICAgICAgIC8vIFJlYWQgdGhlIGZpbGVcbiAgICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IHRoaXMucmVhZEZpbGUoe1xuICAgICAgICAgIHBhdGg6IGZyb20sXG4gICAgICAgICAgZGlyZWN0b3J5OiBmcm9tRGlyZWN0b3J5LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBPcHRpb25hbGx5IHJlbW92ZSB0aGUgZmlsZVxuICAgICAgICBpZiAoZG9SZW5hbWUpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmRlbGV0ZUZpbGUoe1xuICAgICAgICAgICAgcGF0aDogZnJvbSxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogZnJvbURpcmVjdG9yeSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbmNvZGluZztcbiAgICAgICAgaWYgKCEoZmlsZS5kYXRhIGluc3RhbmNlb2YgQmxvYikgJiYgIXRoaXMuaXNCYXNlNjRTdHJpbmcoZmlsZS5kYXRhKSkge1xuICAgICAgICAgIGVuY29kaW5nID0gRW5jb2RpbmcuVVRGODtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdyaXRlIHRoZSBmaWxlIHRvIHRoZSBuZXcgbG9jYXRpb25cbiAgICAgICAgY29uc3Qgd3JpdGVSZXN1bHQgPSBhd2FpdCB0aGlzLndyaXRlRmlsZSh7XG4gICAgICAgICAgcGF0aDogdG8sXG4gICAgICAgICAgZGlyZWN0b3J5OiB0b0RpcmVjdG9yeSxcbiAgICAgICAgICBkYXRhOiBmaWxlLmRhdGEsXG4gICAgICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDb3B5IHRoZSBtdGltZS9jdGltZSBvZiBhIHJlbmFtZWQgZmlsZVxuICAgICAgICBpZiAoZG9SZW5hbWUpIHtcbiAgICAgICAgICBhd2FpdCB1cGRhdGVUaW1lKHRvLCBjdGltZSwgZnJvbU9iai5tdGltZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNvbHZlIHByb21pc2VcbiAgICAgICAgcmV0dXJuIHdyaXRlUmVzdWx0O1xuICAgICAgfVxuICAgICAgY2FzZSAnZGlyZWN0b3J5Jzoge1xuICAgICAgICBpZiAodG9PYmopIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignQ2Fubm90IG1vdmUgYSBkaXJlY3Rvcnkgb3ZlciBhbiBleGlzdGluZyBvYmplY3QnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSB0byBkaXJlY3RvcnlcbiAgICAgICAgICBhd2FpdCB0aGlzLm1rZGlyKHtcbiAgICAgICAgICAgIHBhdGg6IHRvLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiB0b0RpcmVjdG9yeSxcbiAgICAgICAgICAgIHJlY3Vyc2l2ZTogZmFsc2UsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBDb3B5IHRoZSBtdGltZS9jdGltZSBvZiBhIHJlbmFtZWQgZGlyZWN0b3J5XG4gICAgICAgICAgaWYgKGRvUmVuYW1lKSB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVUaW1lKHRvLCBjdGltZSwgZnJvbU9iai5tdGltZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIGNvbnRlbnRzIG9mIHRoZSBmcm9tIGxvY2F0aW9uXG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gKFxuICAgICAgICAgIGF3YWl0IHRoaXMucmVhZGRpcih7XG4gICAgICAgICAgICBwYXRoOiBmcm9tLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBmcm9tRGlyZWN0b3J5LFxuICAgICAgICAgIH0pXG4gICAgICAgICkuZmlsZXM7XG5cbiAgICAgICAgZm9yIChjb25zdCBmaWxlbmFtZSBvZiBjb250ZW50cykge1xuICAgICAgICAgIC8vIE1vdmUgaXRlbSBmcm9tIHRoZSBmcm9tIGRpcmVjdG9yeSB0byB0aGUgdG8gZGlyZWN0b3J5XG4gICAgICAgICAgYXdhaXQgdGhpcy5fY29weShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZnJvbTogYCR7ZnJvbX0vJHtmaWxlbmFtZS5uYW1lfWAsXG4gICAgICAgICAgICAgIHRvOiBgJHt0b30vJHtmaWxlbmFtZS5uYW1lfWAsXG4gICAgICAgICAgICAgIGRpcmVjdG9yeTogZnJvbURpcmVjdG9yeSxcbiAgICAgICAgICAgICAgdG9EaXJlY3RvcnksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZG9SZW5hbWUsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9wdGlvbmFsbHkgcmVtb3ZlIHRoZSBvcmlnaW5hbCBmcm9tIGRpcmVjdG9yeVxuICAgICAgICBpZiAoZG9SZW5hbWUpIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLnJtZGlyKHtcbiAgICAgICAgICAgIHBhdGg6IGZyb20sXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IGZyb21EaXJlY3RvcnksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHVyaTogdG9QYXRoLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBhIGh0dHAgcmVxdWVzdCB0byBhIHNlcnZlciBhbmQgZG93bmxvYWRzIHRoZSBmaWxlIHRvIHRoZSBzcGVjaWZpZWQgZGVzdGluYXRpb25cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBAY2FwYWNpdG9yL2ZpbGUtdHJhbnNmZXIgcGx1Z2luIGluc3RlYWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgZG93bmxvYWQgb3BlcmF0aW9uXG4gICAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGRvd25sb2FkIGZpbGUgcmVzdWx0XG4gICAqL1xuICBwdWJsaWMgZG93bmxvYWRGaWxlID0gYXN5bmMgKG9wdGlvbnM6IERvd25sb2FkRmlsZU9wdGlvbnMpOiBQcm9taXNlPERvd25sb2FkRmlsZVJlc3VsdD4gPT4ge1xuICAgIGNvbnN0IHJlcXVlc3RJbml0ID0gYnVpbGRSZXF1ZXN0SW5pdChvcHRpb25zLCBvcHRpb25zLndlYkZldGNoRXh0cmEpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gob3B0aW9ucy51cmwsIHJlcXVlc3RJbml0KTtcbiAgICBsZXQgYmxvYjogQmxvYjtcblxuICAgIGlmICghb3B0aW9ucy5wcm9ncmVzcykgYmxvYiA9IGF3YWl0IHJlc3BvbnNlLmJsb2IoKTtcbiAgICBlbHNlIGlmICghcmVzcG9uc2U/LmJvZHkpIGJsb2IgPSBuZXcgQmxvYigpO1xuICAgIGVsc2Uge1xuICAgICAgY29uc3QgcmVhZGVyID0gcmVzcG9uc2UuYm9keS5nZXRSZWFkZXIoKTtcblxuICAgICAgbGV0IGJ5dGVzID0gMDtcbiAgICAgIGNvbnN0IGNodW5rczogKFVpbnQ4QXJyYXkgfCB1bmRlZmluZWQpW10gPSBbXTtcblxuICAgICAgY29uc3QgY29udGVudFR5cGU6IHN0cmluZyB8IG51bGwgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJyk7XG4gICAgICBjb25zdCBjb250ZW50TGVuZ3RoOiBudW1iZXIgPSBwYXJzZUludChyZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC1sZW5ndGgnKSB8fCAnMCcsIDEwKTtcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY29uc3QgeyBkb25lLCB2YWx1ZSB9ID0gYXdhaXQgcmVhZGVyLnJlYWQoKTtcblxuICAgICAgICBpZiAoZG9uZSkgYnJlYWs7XG5cbiAgICAgICAgY2h1bmtzLnB1c2godmFsdWUpO1xuICAgICAgICBieXRlcyArPSB2YWx1ZT8ubGVuZ3RoIHx8IDA7XG5cbiAgICAgICAgY29uc3Qgc3RhdHVzOiBQcm9ncmVzc1N0YXR1cyA9IHtcbiAgICAgICAgICB1cmw6IG9wdGlvbnMudXJsLFxuICAgICAgICAgIGJ5dGVzLFxuICAgICAgICAgIGNvbnRlbnRMZW5ndGgsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5ub3RpZnlMaXN0ZW5lcnMoJ3Byb2dyZXNzJywgc3RhdHVzKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWxsQ2h1bmtzID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMpO1xuICAgICAgbGV0IHBvc2l0aW9uID0gMDtcbiAgICAgIGZvciAoY29uc3QgY2h1bmsgb2YgY2h1bmtzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2h1bmsgPT09ICd1bmRlZmluZWQnKSBjb250aW51ZTtcblxuICAgICAgICBhbGxDaHVua3Muc2V0KGNodW5rLCBwb3NpdGlvbik7XG4gICAgICAgIHBvc2l0aW9uICs9IGNodW5rLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgYmxvYiA9IG5ldyBCbG9iKFthbGxDaHVua3MuYnVmZmVyXSwgeyB0eXBlOiBjb250ZW50VHlwZSB8fCB1bmRlZmluZWQgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy53cml0ZUZpbGUoe1xuICAgICAgcGF0aDogb3B0aW9ucy5wYXRoLFxuICAgICAgZGlyZWN0b3J5OiBvcHRpb25zLmRpcmVjdG9yeSA/PyB1bmRlZmluZWQsXG4gICAgICByZWN1cnNpdmU6IG9wdGlvbnMucmVjdXJzaXZlID8/IGZhbHNlLFxuICAgICAgZGF0YTogYmxvYixcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHBhdGg6IHJlc3VsdC51cmksIGJsb2IgfTtcbiAgfTtcblxuICBwcml2YXRlIGlzQmFzZTY0U3RyaW5nKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBidG9hKGF0b2Ioc3RyKSkgPT0gc3RyO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuXG5pbnRlcmZhY2UgRW50cnlPYmoge1xuICBwYXRoOiBzdHJpbmc7XG4gIGZvbGRlcjogc3RyaW5nO1xuICB0eXBlOiAnZGlyZWN0b3J5JyB8ICdmaWxlJztcbiAgc2l6ZTogbnVtYmVyO1xuICBjdGltZTogbnVtYmVyO1xuICBtdGltZTogbnVtYmVyO1xuICB1cmk/OiBzdHJpbmc7XG4gIGNvbnRlbnQ/OiBzdHJpbmcgfCBCbG9iO1xufVxuIiwgImltcG9ydCB7IFdlYlBsdWdpbiB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5cbmltcG9ydCB0eXBlIHsgQnJvd3NlclBsdWdpbiwgT3Blbk9wdGlvbnMgfSBmcm9tICcuL2RlZmluaXRpb25zJztcblxuZXhwb3J0IGNsYXNzIEJyb3dzZXJXZWIgZXh0ZW5kcyBXZWJQbHVnaW4gaW1wbGVtZW50cyBCcm93c2VyUGx1Z2luIHtcbiAgX2xhc3RXaW5kb3c6IFdpbmRvdyB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9sYXN0V2luZG93ID0gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIG9wZW4ob3B0aW9uczogT3Blbk9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLl9sYXN0V2luZG93ID0gd2luZG93Lm9wZW4ob3B0aW9ucy51cmwsIG9wdGlvbnMud2luZG93TmFtZSB8fCAnX2JsYW5rJyk7XG4gIH1cblxuICBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2xhc3RXaW5kb3cgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9sYXN0V2luZG93LmNsb3NlKCk7XG4gICAgICAgIHRoaXMuX2xhc3RXaW5kb3cgPSBudWxsO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QoJ05vIGFjdGl2ZSB3aW5kb3cgdG8gY2xvc2UhJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgQnJvd3NlciA9IG5ldyBCcm93c2VyV2ViKCk7XG5cbmV4cG9ydCB7IEJyb3dzZXIgfTtcbiIsICIvLyAncGF0aCcgbW9kdWxlIGV4dHJhY3RlZCBmcm9tIE5vZGUuanMgdjguMTEuMSAob25seSB0aGUgcG9zaXggcGFydClcbi8vIHRyYW5zcGxpdGVkIHdpdGggQmFiZWxcblxuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gYXNzZXJ0UGF0aChwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQYXRoIG11c3QgYmUgYSBzdHJpbmcuIFJlY2VpdmVkICcgKyBKU09OLnN0cmluZ2lmeShwYXRoKSk7XG4gIH1cbn1cblxuLy8gUmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIHdpdGggZGlyZWN0b3J5IG5hbWVzXG5mdW5jdGlvbiBub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoLCBhbGxvd0Fib3ZlUm9vdCkge1xuICB2YXIgcmVzID0gJyc7XG4gIHZhciBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gIHZhciBsYXN0U2xhc2ggPSAtMTtcbiAgdmFyIGRvdHMgPSAwO1xuICB2YXIgY29kZTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPD0gcGF0aC5sZW5ndGg7ICsraSkge1xuICAgIGlmIChpIDwgcGF0aC5sZW5ndGgpXG4gICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgIGVsc2UgaWYgKGNvZGUgPT09IDQ3IC8qLyovKVxuICAgICAgYnJlYWs7XG4gICAgZWxzZVxuICAgICAgY29kZSA9IDQ3IC8qLyovO1xuICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgaWYgKGxhc3RTbGFzaCA9PT0gaSAtIDEgfHwgZG90cyA9PT0gMSkge1xuICAgICAgICAvLyBOT09QXG4gICAgICB9IGVsc2UgaWYgKGxhc3RTbGFzaCAhPT0gaSAtIDEgJiYgZG90cyA9PT0gMikge1xuICAgICAgICBpZiAocmVzLmxlbmd0aCA8IDIgfHwgbGFzdFNlZ21lbnRMZW5ndGggIT09IDIgfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDEpICE9PSA0NiAvKi4qLyB8fCByZXMuY2hhckNvZGVBdChyZXMubGVuZ3RoIC0gMikgIT09IDQ2IC8qLiovKSB7XG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFNsYXNoSW5kZXggPSByZXMubGFzdEluZGV4T2YoJy8nKTtcbiAgICAgICAgICAgIGlmIChsYXN0U2xhc2hJbmRleCAhPT0gcmVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgaWYgKGxhc3RTbGFzaEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlcyA9ICcnO1xuICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXMgPSByZXMuc2xpY2UoMCwgbGFzdFNsYXNoSW5kZXgpO1xuICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gcmVzLmxlbmd0aCAtIDEgLSByZXMubGFzdEluZGV4T2YoJy8nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgICAgICAgICBkb3RzID0gMDtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID09PSAyIHx8IHJlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJlcyA9ICcnO1xuICAgICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSAwO1xuICAgICAgICAgICAgbGFzdFNsYXNoID0gaTtcbiAgICAgICAgICAgIGRvdHMgPSAwO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJlcyArPSAnLy4uJztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXMgPSAnLi4nO1xuICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKVxuICAgICAgICAgIHJlcyArPSAnLycgKyBwYXRoLnNsaWNlKGxhc3RTbGFzaCArIDEsIGkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVzID0gcGF0aC5zbGljZShsYXN0U2xhc2ggKyAxLCBpKTtcbiAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSBpIC0gbGFzdFNsYXNoIC0gMTtcbiAgICAgIH1cbiAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICBkb3RzID0gMDtcbiAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDQ2IC8qLiovICYmIGRvdHMgIT09IC0xKSB7XG4gICAgICArK2RvdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvdHMgPSAtMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gX2Zvcm1hdChzZXAsIHBhdGhPYmplY3QpIHtcbiAgdmFyIGRpciA9IHBhdGhPYmplY3QuZGlyIHx8IHBhdGhPYmplY3Qucm9vdDtcbiAgdmFyIGJhc2UgPSBwYXRoT2JqZWN0LmJhc2UgfHwgKHBhdGhPYmplY3QubmFtZSB8fCAnJykgKyAocGF0aE9iamVjdC5leHQgfHwgJycpO1xuICBpZiAoIWRpcikge1xuICAgIHJldHVybiBiYXNlO1xuICB9XG4gIGlmIChkaXIgPT09IHBhdGhPYmplY3Qucm9vdCkge1xuICAgIHJldHVybiBkaXIgKyBiYXNlO1xuICB9XG4gIHJldHVybiBkaXIgKyBzZXAgKyBiYXNlO1xufVxuXG52YXIgcG9zaXggPSB7XG4gIC8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSgpIHtcbiAgICB2YXIgcmVzb2x2ZWRQYXRoID0gJyc7XG4gICAgdmFyIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcbiAgICB2YXIgY3dkO1xuXG4gICAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICAgIHZhciBwYXRoO1xuICAgICAgaWYgKGkgPj0gMClcbiAgICAgICAgcGF0aCA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoY3dkID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgY3dkID0gcHJvY2Vzcy5jd2QoKTtcbiAgICAgICAgcGF0aCA9IGN3ZDtcbiAgICAgIH1cblxuICAgICAgYXNzZXJ0UGF0aChwYXRoKTtcblxuICAgICAgLy8gU2tpcCBlbXB0eSBlbnRyaWVzXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQ29kZUF0KDApID09PSA0NyAvKi8qLztcbiAgICB9XG5cbiAgICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gICAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVTdHJpbmdQb3NpeChyZXNvbHZlZFBhdGgsICFyZXNvbHZlZEFic29sdXRlKTtcblxuICAgIGlmIChyZXNvbHZlZEFic29sdXRlKSB7XG4gICAgICBpZiAocmVzb2x2ZWRQYXRoLmxlbmd0aCA+IDApXG4gICAgICAgIHJldHVybiAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnLyc7XG4gICAgfSBlbHNlIGlmIChyZXNvbHZlZFBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVkUGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcuJztcbiAgICB9XG4gIH0sXG5cbiAgbm9ybWFsaXplOiBmdW5jdGlvbiBub3JtYWxpemUocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG5cbiAgICB2YXIgaXNBYnNvbHV0ZSA9IHBhdGguY2hhckNvZGVBdCgwKSA9PT0gNDcgLyovKi87XG4gICAgdmFyIHRyYWlsaW5nU2VwYXJhdG9yID0gcGF0aC5jaGFyQ29kZUF0KHBhdGgubGVuZ3RoIC0gMSkgPT09IDQ3IC8qLyovO1xuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcGF0aCA9IG5vcm1hbGl6ZVN0cmluZ1Bvc2l4KHBhdGgsICFpc0Fic29sdXRlKTtcblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCAmJiAhaXNBYnNvbHV0ZSkgcGF0aCA9ICcuJztcbiAgICBpZiAocGF0aC5sZW5ndGggPiAwICYmIHRyYWlsaW5nU2VwYXJhdG9yKSBwYXRoICs9ICcvJztcblxuICAgIGlmIChpc0Fic29sdXRlKSByZXR1cm4gJy8nICsgcGF0aDtcbiAgICByZXR1cm4gcGF0aDtcbiAgfSxcblxuICBpc0Fic29sdXRlOiBmdW5jdGlvbiBpc0Fic29sdXRlKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuICAgIHJldHVybiBwYXRoLmxlbmd0aCA+IDAgJiYgcGF0aC5jaGFyQ29kZUF0KDApID09PSA0NyAvKi8qLztcbiAgfSxcblxuICBqb2luOiBmdW5jdGlvbiBqb2luKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuICcuJztcbiAgICB2YXIgam9pbmVkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuICAgICAgYXNzZXJ0UGF0aChhcmcpO1xuICAgICAgaWYgKGFyZy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChqb2luZWQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICBqb2luZWQgPSBhcmc7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBqb2luZWQgKz0gJy8nICsgYXJnO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoam9pbmVkID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gJy4nO1xuICAgIHJldHVybiBwb3NpeC5ub3JtYWxpemUoam9pbmVkKTtcbiAgfSxcblxuICByZWxhdGl2ZTogZnVuY3Rpb24gcmVsYXRpdmUoZnJvbSwgdG8pIHtcbiAgICBhc3NlcnRQYXRoKGZyb20pO1xuICAgIGFzc2VydFBhdGgodG8pO1xuXG4gICAgaWYgKGZyb20gPT09IHRvKSByZXR1cm4gJyc7XG5cbiAgICBmcm9tID0gcG9zaXgucmVzb2x2ZShmcm9tKTtcbiAgICB0byA9IHBvc2l4LnJlc29sdmUodG8pO1xuXG4gICAgaWYgKGZyb20gPT09IHRvKSByZXR1cm4gJyc7XG5cbiAgICAvLyBUcmltIGFueSBsZWFkaW5nIGJhY2tzbGFzaGVzXG4gICAgdmFyIGZyb21TdGFydCA9IDE7XG4gICAgZm9yICg7IGZyb21TdGFydCA8IGZyb20ubGVuZ3RoOyArK2Zyb21TdGFydCkge1xuICAgICAgaWYgKGZyb20uY2hhckNvZGVBdChmcm9tU3RhcnQpICE9PSA0NyAvKi8qLylcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHZhciBmcm9tRW5kID0gZnJvbS5sZW5ndGg7XG4gICAgdmFyIGZyb21MZW4gPSBmcm9tRW5kIC0gZnJvbVN0YXJ0O1xuXG4gICAgLy8gVHJpbSBhbnkgbGVhZGluZyBiYWNrc2xhc2hlc1xuICAgIHZhciB0b1N0YXJ0ID0gMTtcbiAgICBmb3IgKDsgdG9TdGFydCA8IHRvLmxlbmd0aDsgKyt0b1N0YXJ0KSB7XG4gICAgICBpZiAodG8uY2hhckNvZGVBdCh0b1N0YXJ0KSAhPT0gNDcgLyovKi8pXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgdG9FbmQgPSB0by5sZW5ndGg7XG4gICAgdmFyIHRvTGVuID0gdG9FbmQgLSB0b1N0YXJ0O1xuXG4gICAgLy8gQ29tcGFyZSBwYXRocyB0byBmaW5kIHRoZSBsb25nZXN0IGNvbW1vbiBwYXRoIGZyb20gcm9vdFxuICAgIHZhciBsZW5ndGggPSBmcm9tTGVuIDwgdG9MZW4gPyBmcm9tTGVuIDogdG9MZW47XG4gICAgdmFyIGxhc3RDb21tb25TZXAgPSAtMTtcbiAgICB2YXIgaSA9IDA7XG4gICAgZm9yICg7IGkgPD0gbGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChpID09PSBsZW5ndGgpIHtcbiAgICAgICAgaWYgKHRvTGVuID4gbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCArIGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYGZyb21gIGlzIHRoZSBleGFjdCBiYXNlIHBhdGggZm9yIGB0b2AuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvby9iYXInOyB0bz0nL2Zvby9iYXIvYmF6J1xuICAgICAgICAgICAgcmV0dXJuIHRvLnNsaWNlKHRvU3RhcnQgKyBpICsgMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgZnJvbWAgaXMgdGhlIHJvb3RcbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvJzsgdG89Jy9mb28nXG4gICAgICAgICAgICByZXR1cm4gdG8uc2xpY2UodG9TdGFydCArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChmcm9tTGVuID4gbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGZyb20uY2hhckNvZGVBdChmcm9tU3RhcnQgKyBpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGB0b2AgaXMgdGhlIGV4YWN0IGJhc2UgcGF0aCBmb3IgYGZyb21gLlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28vYmFyL2Jheic7IHRvPScvZm9vL2JhcidcbiAgICAgICAgICAgIGxhc3RDb21tb25TZXAgPSBpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYHRvYCBpcyB0aGUgcm9vdC5cbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvZm9vJzsgdG89Jy8nXG4gICAgICAgICAgICBsYXN0Q29tbW9uU2VwID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB2YXIgZnJvbUNvZGUgPSBmcm9tLmNoYXJDb2RlQXQoZnJvbVN0YXJ0ICsgaSk7XG4gICAgICB2YXIgdG9Db2RlID0gdG8uY2hhckNvZGVBdCh0b1N0YXJ0ICsgaSk7XG4gICAgICBpZiAoZnJvbUNvZGUgIT09IHRvQ29kZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBlbHNlIGlmIChmcm9tQ29kZSA9PT0gNDcgLyovKi8pXG4gICAgICAgIGxhc3RDb21tb25TZXAgPSBpO1xuICAgIH1cblxuICAgIHZhciBvdXQgPSAnJztcbiAgICAvLyBHZW5lcmF0ZSB0aGUgcmVsYXRpdmUgcGF0aCBiYXNlZCBvbiB0aGUgcGF0aCBkaWZmZXJlbmNlIGJldHdlZW4gYHRvYFxuICAgIC8vIGFuZCBgZnJvbWBcbiAgICBmb3IgKGkgPSBmcm9tU3RhcnQgKyBsYXN0Q29tbW9uU2VwICsgMTsgaSA8PSBmcm9tRW5kOyArK2kpIHtcbiAgICAgIGlmIChpID09PSBmcm9tRW5kIHx8IGZyb20uY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgaWYgKG91dC5sZW5ndGggPT09IDApXG4gICAgICAgICAgb3V0ICs9ICcuLic7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBvdXQgKz0gJy8uLic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGFzdGx5LCBhcHBlbmQgdGhlIHJlc3Qgb2YgdGhlIGRlc3RpbmF0aW9uIChgdG9gKSBwYXRoIHRoYXQgY29tZXMgYWZ0ZXJcbiAgICAvLyB0aGUgY29tbW9uIHBhdGggcGFydHNcbiAgICBpZiAob3V0Lmxlbmd0aCA+IDApXG4gICAgICByZXR1cm4gb3V0ICsgdG8uc2xpY2UodG9TdGFydCArIGxhc3RDb21tb25TZXApO1xuICAgIGVsc2Uge1xuICAgICAgdG9TdGFydCArPSBsYXN0Q29tbW9uU2VwO1xuICAgICAgaWYgKHRvLmNoYXJDb2RlQXQodG9TdGFydCkgPT09IDQ3IC8qLyovKVxuICAgICAgICArK3RvU3RhcnQ7XG4gICAgICByZXR1cm4gdG8uc2xpY2UodG9TdGFydCk7XG4gICAgfVxuICB9LFxuXG4gIF9tYWtlTG9uZzogZnVuY3Rpb24gX21ha2VMb25nKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aDtcbiAgfSxcblxuICBkaXJuYW1lOiBmdW5jdGlvbiBkaXJuYW1lKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcuJztcbiAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdCgwKTtcbiAgICB2YXIgaGFzUm9vdCA9IGNvZGUgPT09IDQ3IC8qLyovO1xuICAgIHZhciBlbmQgPSAtMTtcbiAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDE7IC0taSkge1xuICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvclxuICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZW5kID09PSAtMSkgcmV0dXJuIGhhc1Jvb3QgPyAnLycgOiAnLic7XG4gICAgaWYgKGhhc1Jvb3QgJiYgZW5kID09PSAxKSByZXR1cm4gJy8vJztcbiAgICByZXR1cm4gcGF0aC5zbGljZSgwLCBlbmQpO1xuICB9LFxuXG4gIGJhc2VuYW1lOiBmdW5jdGlvbiBiYXNlbmFtZShwYXRoLCBleHQpIHtcbiAgICBpZiAoZXh0ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGV4dCAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZXh0XCIgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG5cbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIHZhciBlbmQgPSAtMTtcbiAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgICB2YXIgaTtcblxuICAgIGlmIChleHQgIT09IHVuZGVmaW5lZCAmJiBleHQubGVuZ3RoID4gMCAmJiBleHQubGVuZ3RoIDw9IHBhdGgubGVuZ3RoKSB7XG4gICAgICBpZiAoZXh0Lmxlbmd0aCA9PT0gcGF0aC5sZW5ndGggJiYgZXh0ID09PSBwYXRoKSByZXR1cm4gJyc7XG4gICAgICB2YXIgZXh0SWR4ID0gZXh0Lmxlbmd0aCAtIDE7XG4gICAgICB2YXIgZmlyc3ROb25TbGFzaEVuZCA9IC0xO1xuICAgICAgZm9yIChpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChmaXJzdE5vblNsYXNoRW5kID09PSAtMSkge1xuICAgICAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIHJlbWVtYmVyIHRoaXMgaW5kZXggaW4gY2FzZVxuICAgICAgICAgICAgLy8gd2UgbmVlZCBpdCBpZiB0aGUgZXh0ZW5zaW9uIGVuZHMgdXAgbm90IG1hdGNoaW5nXG4gICAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgICAgICAgIGZpcnN0Tm9uU2xhc2hFbmQgPSBpICsgMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV4dElkeCA+PSAwKSB7XG4gICAgICAgICAgICAvLyBUcnkgdG8gbWF0Y2ggdGhlIGV4cGxpY2l0IGV4dGVuc2lvblxuICAgICAgICAgICAgaWYgKGNvZGUgPT09IGV4dC5jaGFyQ29kZUF0KGV4dElkeCkpIHtcbiAgICAgICAgICAgICAgaWYgKC0tZXh0SWR4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIFdlIG1hdGNoZWQgdGhlIGV4dGVuc2lvbiwgc28gbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyIHBhdGhcbiAgICAgICAgICAgICAgICAvLyBjb21wb25lbnRcbiAgICAgICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBFeHRlbnNpb24gZG9lcyBub3QgbWF0Y2gsIHNvIG91ciByZXN1bHQgaXMgdGhlIGVudGlyZSBwYXRoXG4gICAgICAgICAgICAgIC8vIGNvbXBvbmVudFxuICAgICAgICAgICAgICBleHRJZHggPSAtMTtcbiAgICAgICAgICAgICAgZW5kID0gZmlyc3ROb25TbGFzaEVuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXJ0ID09PSBlbmQpIGVuZCA9IGZpcnN0Tm9uU2xhc2hFbmQ7ZWxzZSBpZiAoZW5kID09PSAtMSkgZW5kID0gcGF0aC5sZW5ndGg7XG4gICAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBpZiAocGF0aC5jaGFyQ29kZUF0KGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgICAgIC8vIHBhdGggY29tcG9uZW50XG4gICAgICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICAgICAgZW5kID0gaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiAnJztcbiAgICAgIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIH1cbiAgfSxcblxuICBleHRuYW1lOiBmdW5jdGlvbiBleHRuYW1lKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuICAgIHZhciBzdGFydERvdCA9IC0xO1xuICAgIHZhciBzdGFydFBhcnQgPSAwO1xuICAgIHZhciBlbmQgPSAtMTtcbiAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gICAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcbiAgICB2YXIgcHJlRG90U3RhdGUgPSAwO1xuICAgIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgIHN0YXJ0UGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAgIC8vIGV4dGVuc2lvblxuICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgICAgZW5kID0gaSArIDE7XG4gICAgICB9XG4gICAgICBpZiAoY29kZSA9PT0gNDYgLyouKi8pIHtcbiAgICAgICAgICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBkb3QsIG1hcmsgaXQgYXMgdGhlIHN0YXJ0IG9mIG91ciBleHRlbnNpb25cbiAgICAgICAgICBpZiAoc3RhcnREb3QgPT09IC0xKVxuICAgICAgICAgICAgc3RhcnREb3QgPSBpO1xuICAgICAgICAgIGVsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKVxuICAgICAgICAgICAgcHJlRG90U3RhdGUgPSAxO1xuICAgICAgfSBlbHNlIGlmIChzdGFydERvdCAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBhbmQgbm9uLXBhdGggc2VwYXJhdG9yIGJlZm9yZSBvdXIgZG90LCBzbyB3ZSBzaG91bGRcbiAgICAgICAgLy8gaGF2ZSBhIGdvb2QgY2hhbmNlIGF0IGhhdmluZyBhIG5vbi1lbXB0eSBleHRlbnNpb25cbiAgICAgICAgcHJlRG90U3RhdGUgPSAtMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RhcnREb3QgPT09IC0xIHx8IGVuZCA9PT0gLTEgfHxcbiAgICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICAgICAgcHJlRG90U3RhdGUgPT09IDAgfHxcbiAgICAgICAgLy8gVGhlIChyaWdodC1tb3N0KSB0cmltbWVkIHBhdGggY29tcG9uZW50IGlzIGV4YWN0bHkgJy4uJ1xuICAgICAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbiAgfSxcblxuICBmb3JtYXQ6IGZ1bmN0aW9uIGZvcm1hdChwYXRoT2JqZWN0KSB7XG4gICAgaWYgKHBhdGhPYmplY3QgPT09IG51bGwgfHwgdHlwZW9mIHBhdGhPYmplY3QgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJwYXRoT2JqZWN0XCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIHBhdGhPYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gX2Zvcm1hdCgnLycsIHBhdGhPYmplY3QpO1xuICB9LFxuXG4gIHBhcnNlOiBmdW5jdGlvbiBwYXJzZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcblxuICAgIHZhciByZXQgPSB7IHJvb3Q6ICcnLCBkaXI6ICcnLCBiYXNlOiAnJywgZXh0OiAnJywgbmFtZTogJycgfTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiByZXQ7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoMCk7XG4gICAgdmFyIGlzQWJzb2x1dGUgPSBjb2RlID09PSA0NyAvKi8qLztcbiAgICB2YXIgc3RhcnQ7XG4gICAgaWYgKGlzQWJzb2x1dGUpIHtcbiAgICAgIHJldC5yb290ID0gJy8nO1xuICAgICAgc3RhcnQgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydERvdCA9IC0xO1xuICAgIHZhciBzdGFydFBhcnQgPSAwO1xuICAgIHZhciBlbmQgPSAtMTtcbiAgICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgICB2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTtcblxuICAgIC8vIFRyYWNrIHRoZSBzdGF0ZSBvZiBjaGFyYWN0ZXJzIChpZiBhbnkpIHdlIHNlZSBiZWZvcmUgb3VyIGZpcnN0IGRvdCBhbmRcbiAgICAvLyBhZnRlciBhbnkgcGF0aCBzZXBhcmF0b3Igd2UgZmluZFxuICAgIHZhciBwcmVEb3RTdGF0ZSA9IDA7XG5cbiAgICAvLyBHZXQgbm9uLWRpciBpbmZvXG4gICAgZm9yICg7IGkgPj0gc3RhcnQ7IC0taSkge1xuICAgICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgIHN0YXJ0UGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAgIC8vIGV4dGVuc2lvblxuICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgICAgZW5kID0gaSArIDE7XG4gICAgICB9XG4gICAgICBpZiAoY29kZSA9PT0gNDYgLyouKi8pIHtcbiAgICAgICAgICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBkb3QsIG1hcmsgaXQgYXMgdGhlIHN0YXJ0IG9mIG91ciBleHRlbnNpb25cbiAgICAgICAgICBpZiAoc3RhcnREb3QgPT09IC0xKSBzdGFydERvdCA9IGk7ZWxzZSBpZiAocHJlRG90U3RhdGUgIT09IDEpIHByZURvdFN0YXRlID0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChzdGFydERvdCAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBhbmQgbm9uLXBhdGggc2VwYXJhdG9yIGJlZm9yZSBvdXIgZG90LCBzbyB3ZSBzaG91bGRcbiAgICAgICAgLy8gaGF2ZSBhIGdvb2QgY2hhbmNlIGF0IGhhdmluZyBhIG5vbi1lbXB0eSBleHRlbnNpb25cbiAgICAgICAgcHJlRG90U3RhdGUgPSAtMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RhcnREb3QgPT09IC0xIHx8IGVuZCA9PT0gLTEgfHxcbiAgICAvLyBXZSBzYXcgYSBub24tZG90IGNoYXJhY3RlciBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGRvdFxuICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgLy8gVGhlIChyaWdodC1tb3N0KSB0cmltbWVkIHBhdGggY29tcG9uZW50IGlzIGV4YWN0bHkgJy4uJ1xuICAgIHByZURvdFN0YXRlID09PSAxICYmIHN0YXJ0RG90ID09PSBlbmQgLSAxICYmIHN0YXJ0RG90ID09PSBzdGFydFBhcnQgKyAxKSB7XG4gICAgICBpZiAoZW5kICE9PSAtMSkge1xuICAgICAgICBpZiAoc3RhcnRQYXJ0ID09PSAwICYmIGlzQWJzb2x1dGUpIHJldC5iYXNlID0gcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKDEsIGVuZCk7ZWxzZSByZXQuYmFzZSA9IHJldC5uYW1lID0gcGF0aC5zbGljZShzdGFydFBhcnQsIGVuZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGFydFBhcnQgPT09IDAgJiYgaXNBYnNvbHV0ZSkge1xuICAgICAgICByZXQubmFtZSA9IHBhdGguc2xpY2UoMSwgc3RhcnREb3QpO1xuICAgICAgICByZXQuYmFzZSA9IHBhdGguc2xpY2UoMSwgZW5kKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldC5uYW1lID0gcGF0aC5zbGljZShzdGFydFBhcnQsIHN0YXJ0RG90KTtcbiAgICAgICAgcmV0LmJhc2UgPSBwYXRoLnNsaWNlKHN0YXJ0UGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICAgIHJldC5leHQgPSBwYXRoLnNsaWNlKHN0YXJ0RG90LCBlbmQpO1xuICAgIH1cblxuICAgIGlmIChzdGFydFBhcnQgPiAwKSByZXQuZGlyID0gcGF0aC5zbGljZSgwLCBzdGFydFBhcnQgLSAxKTtlbHNlIGlmIChpc0Fic29sdXRlKSByZXQuZGlyID0gJy8nO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfSxcblxuICBzZXA6ICcvJyxcbiAgZGVsaW1pdGVyOiAnOicsXG4gIHdpbjMyOiBudWxsLFxuICBwb3NpeDogbnVsbFxufTtcblxucG9zaXgucG9zaXggPSBwb3NpeDtcblxubW9kdWxlLmV4cG9ydHMgPSBwb3NpeDtcbiIsICJpbXBvcnQgeyBJUGxhdGZvcm0gfSBmcm9tIFwiLi9JUGxhdGZvcm1cIjtcblxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IElQbGF0Zm9ybTtcblxuICAgIHB1YmxpYyBzdGF0aWMgc2V0UGxhdGZvcm0ocGxhdGZvcm06IElQbGF0Zm9ybSk6IHZvaWQge1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gcGxhdGZvcm07XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXQgY3VycmVudCgpOiBJUGxhdGZvcm0ge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBsYXRmb3JtIG5vdCBpbml0aWFsaXplZC4gQ2FsbCBQbGF0Zm9ybU1hbmFnZXIuc2V0UGxhdGZvcm0oKSBmaXJzdC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgfVxufVxuIiwgImltcG9ydCB7IHJlZ2lzdGVyUGx1Z2luIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcbmltcG9ydCB7IGV4cG9zZVN5bmFwc2UgfSBmcm9tICdAY2FwYWNpdG9yL3N5bmFwc2UnO1xuXG5pbXBvcnQgdHlwZSB7IEZpbGVzeXN0ZW1QbHVnaW4gfSBmcm9tICcuL2RlZmluaXRpb25zJztcblxuY29uc3QgRmlsZXN5c3RlbSA9IHJlZ2lzdGVyUGx1Z2luPEZpbGVzeXN0ZW1QbHVnaW4+KCdGaWxlc3lzdGVtJywge1xuICB3ZWI6ICgpID0+IGltcG9ydCgnLi93ZWInKS50aGVuKChtKSA9PiBuZXcgbS5GaWxlc3lzdGVtV2ViKCkpLFxufSk7XG5cbmV4cG9zZVN5bmFwc2UoKTtcblxuZXhwb3J0ICogZnJvbSAnLi9kZWZpbml0aW9ucyc7XG5leHBvcnQgeyBGaWxlc3lzdGVtIH07XG4iLCAiZnVuY3Rpb24gcyh0KSB7XG4gIHQuQ2FwYWNpdG9yVXRpbHMuU3luYXBzZSA9IG5ldyBQcm94eShcbiAgICB7fSxcbiAgICB7XG4gICAgICBnZXQoZSwgbikge1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgICAgZ2V0KHcsIG8pIHtcbiAgICAgICAgICAgIHJldHVybiAoYywgcCwgcikgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBpID0gdC5DYXBhY2l0b3IuUGx1Z2luc1tuXTtcbiAgICAgICAgICAgICAgaWYgKGkgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgIHIobmV3IEVycm9yKGBDYXBhY2l0b3IgcGx1Z2luICR7bn0gbm90IGZvdW5kYCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodHlwZW9mIGlbb10gIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcihuZXcgRXJyb3IoYE1ldGhvZCAke299IG5vdCBmb3VuZCBpbiBDYXBhY2l0b3IgcGx1Z2luICR7bn1gKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBhd2FpdCBpW29dKGMpO1xuICAgICAgICAgICAgICAgICAgcChhKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChhKSB7XG4gICAgICAgICAgICAgICAgICByKGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG59XG5mdW5jdGlvbiB1KHQpIHtcbiAgdC5DYXBhY2l0b3JVdGlscy5TeW5hcHNlID0gbmV3IFByb3h5KFxuICAgIHt9LFxuICAgIHtcbiAgICAgIGdldChlLCBuKSB7XG4gICAgICAgIHJldHVybiB0LmNvcmRvdmEucGx1Z2luc1tuXTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG59XG5mdW5jdGlvbiBmKHQgPSAhMSkge1xuICB0eXBlb2Ygd2luZG93ID4gXCJ1XCIgfHwgKHdpbmRvdy5DYXBhY2l0b3JVdGlscyA9IHdpbmRvdy5DYXBhY2l0b3JVdGlscyB8fCB7fSwgd2luZG93LkNhcGFjaXRvciAhPT0gdm9pZCAwICYmICF0ID8gcyh3aW5kb3cpIDogd2luZG93LmNvcmRvdmEgIT09IHZvaWQgMCAmJiB1KHdpbmRvdykpO1xufVxuZXhwb3J0IHtcbiAgZiBhcyBleHBvc2VTeW5hcHNlXG59O1xuIiwgImltcG9ydCB7IHJlZ2lzdGVyUGx1Z2luIH0gZnJvbSAnQGNhcGFjaXRvci9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBCcm93c2VyUGx1Z2luIH0gZnJvbSAnLi9kZWZpbml0aW9ucyc7XG5cbmNvbnN0IEJyb3dzZXIgPSByZWdpc3RlclBsdWdpbjxCcm93c2VyUGx1Z2luPignQnJvd3NlcicsIHtcbiAgd2ViOiAoKSA9PiBpbXBvcnQoJy4vd2ViJykudGhlbigobSkgPT4gbmV3IG0uQnJvd3NlcldlYigpKSxcbn0pO1xuXG5leHBvcnQgKiBmcm9tICcuL2RlZmluaXRpb25zJztcbmV4cG9ydCB7IEJyb3dzZXIgfTtcbiIsICJpbXBvcnQgeyBJUGxhdGZvcm0sIEZpbGVTdGF0IH0gZnJvbSBcIi4vSVBsYXRmb3JtXCI7XG5pbXBvcnQgeyBGaWxlc3lzdGVtLCBEaXJlY3RvcnksIEVuY29kaW5nIH0gZnJvbSBcIkBjYXBhY2l0b3IvZmlsZXN5c3RlbVwiO1xuaW1wb3J0IHsgQnJvd3NlciB9IGZyb20gXCJAY2FwYWNpdG9yL2Jyb3dzZXJcIjtcblxuZXhwb3J0IGNsYXNzIENhcGFjaXRvclBsYXRmb3JtIGltcGxlbWVudHMgSVBsYXRmb3JtIHtcbiAgICBpZDogXCJjYXBhY2l0b3JcIiA9IFwiY2FwYWNpdG9yXCI7XG5cbiAgICBhc3luYyByZWFkRmlsZShwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBGaWxlc3lzdGVtLnJlYWRGaWxlKHtcbiAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IERpcmVjdG9yeS5EYXRhLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IEVuY29kaW5nLlVURjhcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQuZGF0YSBhcyBzdHJpbmc7XG4gICAgfVxuXG4gICAgYXN5bmMgd3JpdGVGaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IEZpbGVzeXN0ZW0ud3JpdGVGaWxlKHtcbiAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICBkYXRhOiBjb250ZW50LFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBEaXJlY3RvcnkuRGF0YSxcbiAgICAgICAgICAgIGVuY29kaW5nOiBFbmNvZGluZy5VVEY4XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIHJlYWRkaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBGaWxlc3lzdGVtLnJlYWRkaXIoe1xuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogRGlyZWN0b3J5LkRhdGFcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIENhcGFjaXRvciA0LzU6IGZpbGVzIGlzIEZpbGVJbmZvW10uIG5hbWUgaXMgdGhlIHByb3BlcnR5LlxuICAgICAgICByZXR1cm4gcmVzdWx0LmZpbGVzLm1hcChmID0+IGYubmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhpc3RzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgRmlsZXN5c3RlbS5zdGF0KHtcbiAgICAgICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgICAgIGRpcmVjdG9yeTogRGlyZWN0b3J5LkRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgdW5saW5rKHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBGaWxlc3lzdGVtLmRlbGV0ZUZpbGUoe1xuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogRGlyZWN0b3J5LkRhdGFcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgbWtkaXIocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBGaWxlc3lzdGVtLm1rZGlyKHtcbiAgICAgICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgICAgIGRpcmVjdG9yeTogRGlyZWN0b3J5LkRhdGEsXG4gICAgICAgICAgICAgICAgcmVjdXJzaXZlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gSWdub3JlIGVycm9yIGlmIGRpcmVjdG9yeSBhbHJlYWR5IGV4aXN0c1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgc3RhdChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPEZpbGVTdGF0PiB7XG4gICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCBGaWxlc3lzdGVtLnN0YXQoe1xuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgIGRpcmVjdG9yeTogRGlyZWN0b3J5LkRhdGFcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc0ZpbGU6IHN0YXQudHlwZSA9PT0gJ2ZpbGUnLFxuICAgICAgICAgICAgaXNEaXJlY3Rvcnk6IHN0YXQudHlwZSA9PT0gJ2RpcmVjdG9yeSdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBvcGVuUGF0aChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJvcGVuUGF0aCBub3Qgc3VwcG9ydGVkIG9uIENhcGFjaXRvclwiLCBwYXRoKTtcbiAgICB9XG5cbiAgICBhc3luYyBvcGVuRXh0ZXJuYWwodXJsOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgQnJvd3Nlci5vcGVuKHsgdXJsIH0pO1xuICAgIH1cblxuICAgIGdldFRoZW1lc1BhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwidGhlbWVzXCI7XG4gICAgfVxuXG4gICAgZ2V0UGx1Z2luc1BhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwicGx1Z2luc1wiO1xuICAgIH1cblxuICAgIGdldEVuaGFuY2VkUGF0aCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuZXhpc3RzKHRoaXMuZ2V0VGhlbWVzUGF0aCgpKSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5ta2Rpcih0aGlzLmdldFRoZW1lc1BhdGgoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLmV4aXN0cyh0aGlzLmdldFBsdWdpbnNQYXRoKCkpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm1rZGlyKHRoaXMuZ2V0UGx1Z2luc1BhdGgoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgZGlhbG9nLCBCcm93c2VyV2luZG93IH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiO1xuaW1wb3J0IHsgU0VMRUNUT1JTLCBUSU1FT1VUUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldFRvYXN0VGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy90b2FzdC90b2FzdFwiO1xuXG5jbGFzcyBIZWxwZXJzIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogSGVscGVycztcbiAgICBwcml2YXRlIG1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCBudWxsID0gbnVsbDtcbiAgICBcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbiAgICBcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogSGVscGVycyB7XG4gICAgICAgIGlmICghSGVscGVycy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgSGVscGVycy5pbnN0YW5jZSA9IG5ldyBIZWxwZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEhlbHBlcnMuaW5zdGFuY2U7XG4gICAgfVxuICAgIFxuICAgIHNldE1haW5XaW5kb3cobWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyk6IHZvaWQge1xuICAgICAgICB0aGlzLm1haW5XaW5kb3cgPSBtYWluV2luZG93O1xuICAgIH1cbiAgICBcbiAgICBhc3luYyBzaG93QWxlcnQoXG4gICAgICAgIGFsZXJ0VHlwZTogJ2luZm8nIHwgJ3dhcm5pbmcnIHwgJ2Vycm9yJywgXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsIFxuICAgICAgICBtZXNzYWdlOiBzdHJpbmcsIFxuICAgICAgICBidXR0b25zOiBzdHJpbmdbXVxuICAgICk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEVsZWN0cm9uLk1lc3NhZ2VCb3hPcHRpb25zID0ge1xuICAgICAgICAgICAgdHlwZTogYWxlcnRUeXBlLFxuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgYnV0dG9uc1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZGlhbG9nLnNob3dNZXNzYWdlQm94KHRoaXMubWFpbldpbmRvdyEsIG9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnJlc3BvbnNlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBkaXNwbGF5aW5nIGFsZXJ0OiAnICsgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybiAtMTsgXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgd2FpdEZvckVsbShzZWxlY3Rvcjogc3RyaW5nLCB0aW1lb3V0OiBudW1iZXIgPSBUSU1FT1VUUy5FTEVNRU5UX1dBSVQpOiBQcm9taXNlPEVsZW1lbnQ+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGV4aXN0aW5nRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYFRpbWVvdXQgd2FpdGluZyBmb3IgZWxlbWVudCB3aXRoIHNlbGVjdG9yOiAke3NlbGVjdG9yfWApKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3YWl0Rm9yRWxtQnlYUGF0aCh4cGF0aDogc3RyaW5nLCB0aW1lb3V0OiBudW1iZXIgPSBUSU1FT1VUUy5FTEVNRU5UX1dBSVQpOiBQcm9taXNlPE5vZGU+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV2YWx1YXRlWFBhdGggPSAoKTogTm9kZSB8IG51bGwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRvY3VtZW50LmV2YWx1YXRlKFxuICAgICAgICAgICAgICAgICAgICB4cGF0aCwgXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LCBcbiAgICAgICAgICAgICAgICAgICAgbnVsbCwgXG4gICAgICAgICAgICAgICAgICAgIFhQYXRoUmVzdWx0LkZJUlNUX09SREVSRURfTk9ERV9UWVBFLCBcbiAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zaW5nbGVOb2RlVmFsdWU7XG4gICAgICAgICAgICB9O1xuICAgIFxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdFbGVtZW50ID0gZXZhbHVhdGVYUGF0aCgpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGV4aXN0aW5nRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBldmFsdWF0ZVhQYXRoKCk7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYFRpbWVvdXQgd2FpdGluZyBmb3IgZWxlbWVudCB3aXRoIFhQYXRoOiAke3hwYXRofWApKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgd2FpdEZvclRpdGxlQ2hhbmdlKHRpbWVvdXQ6IG51bWJlciA9IFRJTUVPVVRTLkVMRU1FTlRfV0FJVCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoZWFkRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKTtcbiAgICAgICAgICAgIGlmICghaGVhZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignSGVhZCBlbGVtZW50IG5vdCBmb3VuZCcpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnQudGl0bGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoaGVhZEVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignVGltZW91dCB3YWl0aW5nIGZvciBkb2N1bWVudC50aXRsZSB0byBjaGFuZ2UnKSk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNyZWF0ZVRvYXN0KHRvYXN0SWQ6IHN0cmluZywgdGl0bGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IFwic3VjY2Vzc1wiIHwgXCJmYWlsXCIgfCBcImluZm9cIiwgdGltZW91dE1zOm51bWJlciA9IDMwMDApIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBhd2FpdCBnZXRUb2FzdFRlbXBsYXRlKHRvYXN0SWQsIHRpdGxlLCBtZXNzYWdlLCBzdGF0dXMpO1xuICAgICAgICBjb25zdCB0b2FzdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlRPQVNUX0NPTlRBSU5FUik7XG4gICAgICAgIGlmKHRvYXN0Q29udGFpbmVyKSB7XG4gICAgICAgICAgICB0b2FzdENvbnRhaW5lci5pbm5lckhUTUwgKz0gdGVtcGxhdGU7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvYXN0SWQpPy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXRNcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIEphdmFTY3JpcHQgaW4gdGhlIGNvbnRleHQgb2YgU3RyZW1pbydzIGNvcmUgc2VydmljZXNcbiAgICAgKiBAcGFyYW0ganMgLSBKYXZhU2NyaXB0IGNvZGUgdG8gZXhlY3V0ZVxuICAgICAqIEByZXR1cm5zIFByb21pc2Ugd2l0aCB0aGUgcmVzdWx0IG9mIHRoZSBleGVjdXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgX2V2YWwoanM6IHN0cmluZyk6IFByb21pc2U8dW5rbm93bj4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSAnc3RyZW1pby1lbmhhbmNlZCc7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IChkYXRhOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzY3JpcHQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKGRhdGEgYXMgQ3VzdG9tRXZlbnQpLmRldGFpbCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNjcmlwdC5pZCA9IGV2ZW50TmFtZTtcbiAgICAgICAgICAgICAgICBzY3JpcHQuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb3JlID0gd2luZG93LnNlcnZpY2VzLmNvcmU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gJHtqc307XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC50aGVuKChhd2FpdGVkUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcIiR7ZXZlbnROYW1lfVwiLCB7IGRldGFpbDogYXdhaXRlZFJlc3VsdCB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcIiR7ZXZlbnROYW1lfVwiLCB7IGRldGFpbDogcmVzdWx0IH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYCksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRFbGVtZW50QnlYcGF0aChwYXRoOiBzdHJpbmcpOiBOb2RlIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5ldmFsdWF0ZShcbiAgICAgICAgICAgIHBhdGgsIFxuICAgICAgICAgICAgZG9jdW1lbnQsIFxuICAgICAgICAgICAgbnVsbCwgXG4gICAgICAgICAgICBYUGF0aFJlc3VsdC5GSVJTVF9PUkRFUkVEX05PREVfVFlQRSwgXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICkuc2luZ2xlTm9kZVZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGaWxlTmFtZUZyb21VcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHVybC5zcGxpdCgnLycpO1xuICAgICAgICByZXR1cm4gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0gfHwgJyc7XG4gICAgfVxuXG4gICAgcHVibGljIGZvcm1hdFRpbWUoc2Vjb25kczogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICAgICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoKHNlY29uZHMgJSAzNjAwKSAvIDYwKTtcbiAgICAgICAgY29uc3QgcmVtYWluaW5nU2Vjb25kcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBgJHtTdHJpbmcoaG91cnMpLnBhZFN0YXJ0KDIsICcwJyl9OiR7U3RyaW5nKG1pbnV0ZXMpLnBhZFN0YXJ0KDIsICcwJyl9OiR7U3RyaW5nKHJlbWFpbmluZ1NlY29uZHMpLnBhZFN0YXJ0KDIsICcwJyl9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wYXJlIHR3byBzZW1hbnRpYyB2ZXJzaW9uIHN0cmluZ3NcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHZlcnNpb24xID4gdmVyc2lvbjJcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNOZXdlclZlcnNpb24odmVyc2lvbjE6IHN0cmluZywgdmVyc2lvbjI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBub3JtYWxpemUgPSAodjogc3RyaW5nKTogbnVtYmVyW10gPT4gXG4gICAgICAgICAgICB2LnJlcGxhY2UoL152LywgJycpLnNwbGl0KCcuJykubWFwKG4gPT4gcGFyc2VJbnQobiwgMTApIHx8IDApO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgdjFQYXJ0cyA9IG5vcm1hbGl6ZSh2ZXJzaW9uMSk7XG4gICAgICAgIGNvbnN0IHYyUGFydHMgPSBub3JtYWxpemUodmVyc2lvbjIpO1xuICAgICAgICBjb25zdCBtYXhMZW5ndGggPSBNYXRoLm1heCh2MVBhcnRzLmxlbmd0aCwgdjJQYXJ0cy5sZW5ndGgpO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdjEgPSB2MVBhcnRzW2ldID8/IDA7XG4gICAgICAgICAgICBjb25zdCB2MiA9IHYyUGFydHNbaV0gPz8gMDtcbiAgICAgICAgICAgIGlmICh2MSA+IHYyKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh2MSA8IHYyKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgaGVscGVyc0luc3RhbmNlID0gSGVscGVycy5nZXRJbnN0YW5jZSgpO1xuXG5leHBvcnQgZGVmYXVsdCBoZWxwZXJzSW5zdGFuY2U7XG4iLCAiY2xhc3MgQnJvd3NlckxvZ2dlciB7XG4gICAgaW5mbyhtZXNzYWdlOiBzdHJpbmcsIC4uLm1ldGE6IGFueVtdKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgW0lORk9dICR7bWVzc2FnZX1gLCAuLi5tZXRhKTtcbiAgICB9XG4gICAgd2FybihtZXNzYWdlOiBzdHJpbmcsIC4uLm1ldGE6IGFueVtdKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgW1dBUk5dICR7bWVzc2FnZX1gLCAuLi5tZXRhKTtcbiAgICB9XG4gICAgZXJyb3IobWVzc2FnZTogc3RyaW5nLCAuLi5tZXRhOiBhbnlbXSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBbRVJST1JdICR7bWVzc2FnZX1gLCAuLi5tZXRhKTtcbiAgICB9XG59XG5cbmNvbnN0IGxvZ2dlciA9IG5ldyBCcm93c2VyTG9nZ2VyKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2dnZXIobGFiZWw6IHN0cmluZykge1xuICAgIHJldHVybiBsb2dnZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlcjtcbiIsICIvKipcbiAqIENlbnRyYWxpemVkIGNvbnN0YW50cyBmb3IgU3RyZW1pbyBFbmhhbmNlZFxuICogVXNpbmcgY29uc3RhbnRzIGluc3RlYWQgb2YgbWFnaWMgc3RyaW5ncyBpbXByb3ZlcyBtYWludGFpbmFiaWxpdHlcbiAqL1xuXG4vLyBDU1MgU2VsZWN0b3JzIHVzZWQgdG8gaW50ZXJhY3Qgd2l0aCBTdHJlbWlvJ3MgVUlcbi8vIE5vdGU6IFRoZXNlIG1heSBuZWVkIHVwZGF0aW5nIHdoZW4gU3RyZW1pbyB1cGRhdGVzIHRoZWlyIGNsYXNzIG5hbWVzXG5leHBvcnQgY29uc3QgU0VMRUNUT1JTID0ge1xuICAgIFNFQ1RJT05TX0NPTlRBSU5FUjogJ1tjbGFzc149XCJzZWN0aW9ucy1jb250YWluZXItXCJdJyxcbiAgICBTRUNUSU9OOiAnW2NsYXNzXj1cInNlY3Rpb24tXCJdJyxcbiAgICBDQVRFR09SWTogJy5jYXRlZ29yeS1HUDBoSScsXG4gICAgQ0FURUdPUllfTEFCRUw6ICcubGFiZWwtTl9PMnYnLFxuICAgIENBVEVHT1JZX0lDT046ICcuaWNvbi1vWm95VicsXG4gICAgQ0FURUdPUllfSEVBRElORzogJy5oZWFkaW5nLVhlUEZsJyxcbiAgICBMQUJFTDogJ1tjbGFzc149XCJsYWJlbC13WEczZVwiXScsXG4gICAgTkFWX01FTlU6ICcubWVudS14ZUUwNicsXG4gICAgU0VUVElOR1NfQ09OVEVOVDogJy5zZXR0aW5ncy1jb250ZW50LWNvNWVVJyxcbiAgICBFTkhBTkNFRF9TRUNUSU9OOiAnI2VuaGFuY2VkJyxcbiAgICBUSEVNRVNfQ0FURUdPUlk6ICcjZW5oYW5jZWQgPiBkaXY6bnRoLWNoaWxkKDIpJyxcbiAgICBQTFVHSU5TX0NBVEVHT1JZOiAnI2VuaGFuY2VkID4gZGl2Om50aC1jaGlsZCgzKScsXG4gICAgQUJPVVRfQ0FURUdPUlk6ICcjZW5oYW5jZWQgPiBkaXY6bnRoLWNoaWxkKDQpJyxcbiAgICBST1VURV9DT05UQUlORVI6ICcucm91dGUtY29udGFpbmVyOmxhc3QtY2hpbGQgLnJvdXRlLWNvbnRlbnQnLFxuICAgIE1FVEFfREVUQUlMU19DT05UQUlORVI6ICcubWV0YWRldGFpbHMtY29udGFpbmVyLUtfRHFhJyxcbiAgICBERVNDUklQVElPTl9DT05UQUlORVI6ICcuZGVzY3JpcHRpb24tY29udGFpbmVyLXlpOGlVJyxcbiAgICBBRERPTlNfTElTVF9DT05UQUlORVI6ICcuYWRkb25zLWxpc3QtY29udGFpbmVyLU92cjJaJyxcbiAgICBBRERPTl9DT05UQUlORVI6ICcuYWRkb24tY29udGFpbmVyLWxDNUtOJyxcbiAgICBOQU1FX0NPTlRBSU5FUjogJy5uYW1lLWNvbnRhaW5lci1xSUFnOCcsXG4gICAgREVTQ1JJUFRJT05fSVRFTTogJy5kZXNjcmlwdGlvbi1jb250YWluZXItdjdKaGUnLFxuICAgIFRZUEVTX0NPTlRBSU5FUjogJy50eXBlcy1jb250YWluZXItRGFPcmcnLFxuICAgIFNFQVJDSF9JTlBVVDogJy5zZWFyY2gtaW5wdXQtYkFnQWgnLFxuICAgIEhPUklaT05UQUxfTkFWOiAnLmhvcml6b250YWwtbmF2LWJhci1jb250YWluZXItWV96dksnLFxuICAgIFRPQVNUX0lURU06ICcudG9hc3QtaXRlbS1jb250YWluZXItbkcwdWsnLFxuICAgIFRPQVNUX0NPTlRBSU5FUjogJy50b2FzdHMtY29udGFpbmVyLW9LRUN5J1xufSBhcyBjb25zdDtcblxuLy8gQ1NTIENsYXNzZXMgdXNlZCBmb3Igc3R5bGluZ1xuZXhwb3J0IGNvbnN0IENMQVNTRVMgPSB7XG4gICAgT1BUSU9OOiAnb3B0aW9uLXZGT0FTJyxcbiAgICBDT05URU5UOiAnY29udGVudC1QMlQwaScsXG4gICAgQlVUVE9OOiAnYnV0dG9uLURObVlMJyxcbiAgICBCVVRUT05fQ09OVEFJTkVSOiAnYnV0dG9uLWNvbnRhaW5lci16VkxINicsXG4gICAgU0VMRUNURUQ6ICdzZWxlY3RlZC1TN1NlSycsXG4gICAgSU5TVEFMTF9CVVRUT046ICdpbnN0YWxsLWJ1dHRvbi1jb250YWluZXIteWZjcTUnLFxuICAgIFVOSU5TVEFMTF9CVVRUT046ICd1bmluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci1vVjRZbycsXG4gICAgQ0hFQ0tFRDogJ2NoZWNrZWQnLFxufSBhcyBjb25zdDtcblxuLy8gTG9jYWxTdG9yYWdlIGtleXNcbmV4cG9ydCBjb25zdCBTVE9SQUdFX0tFWVMgPSB7XG4gICAgRU5BQkxFRF9QTFVHSU5TOiAnZW5hYmxlZFBsdWdpbnMnLFxuICAgIENVUlJFTlRfVEhFTUU6ICdjdXJyZW50VGhlbWUnLFxuICAgIERJU0NPUkRfUlBDOiAnZGlzY29yZHJpY2hwcmVzZW5jZScsXG4gICAgQ0hFQ0tfVVBEQVRFU19PTl9TVEFSVFVQOiAnY2hlY2tGb3JVcGRhdGVzT25TdGFydHVwJyxcbn0gYXMgY29uc3Q7XG5cbi8vIElQQyBDaGFubmVsIG5hbWVzIGZvciBtYWluIDwtPiByZW5kZXJlciBjb21tdW5pY2F0aW9uXG5leHBvcnQgY29uc3QgSVBDX0NIQU5ORUxTID0ge1xuICAgIE1JTklNSVpFX1dJTkRPVzogJ21pbmltaXplLXdpbmRvdycsXG4gICAgTUFYSU1JWkVfV0lORE9XOiAnbWF4aW1pemUtd2luZG93JyxcbiAgICBDTE9TRV9XSU5ET1c6ICdjbG9zZS13aW5kb3cnLFxuICAgIFNFVF9UUkFOU1BBUkVOQ1k6ICdzZXQtdHJhbnNwYXJlbmN5JyxcbiAgICBHRVRfVFJBTlNQQVJFTkNZX1NUQVRVUzogJ2dldC10cmFuc3BhcmVuY3ktc3RhdHVzJyxcbiAgICBVUERBVEVfQ0hFQ0tfU1RBUlRVUDogJ3VwZGF0ZS1jaGVjay1vbi1zdGFydHVwJyxcbiAgICBVUERBVEVfQ0hFQ0tfVVNFUjogJ3VwZGF0ZS1jaGVjay11c2VycmVxdWVzdCcsXG4gICAgRlVMTFNDUkVFTl9DSEFOR0VEOiAnZnVsbHNjcmVlbi1jaGFuZ2VkJyxcbiAgICBFWFRSQUNUX0VNQkVEREVEX1NVQlRJVExFUzogJ2V4dHJhY3QtZW1iZWRkZWQtc3VidGl0bGVzJyxcbn0gYXMgY29uc3Q7XG5cbi8vIEZpbGUgZXh0ZW5zaW9ucyBmb3IgbW9kc1xuZXhwb3J0IGNvbnN0IEZJTEVfRVhURU5TSU9OUyA9IHtcbiAgICBUSEVNRTogJy50aGVtZS5jc3MnLFxuICAgIFBMVUdJTjogJy5wbHVnaW4uanMnLFxufSBhcyBjb25zdDtcblxuLy8gVVJMc1xuZXhwb3J0IGNvbnN0IFVSTFMgPSB7XG4gICAgU1RSRU1JT19XRUI6ICdodHRwczovL3dlYi5zdHJlbWlvLmNvbS8nLFxuICAgIFNUUkVNSU9fV0VCX0FERF9BRERPTjogJ2h0dHBzOi8vd2ViLnN0cmVtaW8uY29tLyMvYWRkb25zP2FkZG9uPScsXG4gICAgUkVHSVNUUlk6ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vUkVWRU5HRTk3Ny9zdHJlbWlvLWVuaGFuY2VkLXJlZ2lzdHJ5L3JlZnMvaGVhZHMvbWFpbi9yZWdpc3RyeS5qc29uJyxcbiAgICBWRVJTSU9OX0NIRUNLOiAnaHR0cHM6Ly9naXRodWIuY29tL1JFVkVOR0U5Nzcvc3RyZW1pby1lbmhhbmNlZC1jb21tdW5pdHkvcmF3L21haW4vdmVyc2lvbicsXG4gICAgUkVMRUFTRVNfQVBJOiAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9SRVZFTkdFOTc3L3N0cmVtaW8tZW5oYW5jZWQtY29tbXVuaXR5L3JlbGVhc2VzL2xhdGVzdCcsXG4gICAgUkVMRUFTRVNfUEFHRTogJ2h0dHBzOi8vZ2l0aHViLmNvbS9SRVZFTkdFOTc3L3N0cmVtaW8tZW5oYW5jZWQtY29tbXVuaXR5L3JlbGVhc2VzL2xhdGVzdCcsXG4gICAgU1RSRU1JT19TRVJWSUNFX0dJVEhVQl9BUEk6IFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9TdHJlbWlvL3N0cmVtaW8tc2VydmljZS9yZWxlYXNlcy9sYXRlc3RcIlxufSBhcyBjb25zdDtcblxuLy8gc2VydmVyLmpzIChTdHJlbWlvIHN0cmVhbWluZyBzZXJ2ZXIpIERvd25sb2FkIFVSTFxuZXhwb3J0IGNvbnN0IFNFUlZFUl9KU19VUkwgPSBcImh0dHBzOi8vZGwuc3RyZW0uaW8vc2VydmVyL3Y0LjIwLjEyL2Rlc2t0b3Avc2VydmVyLmpzXCI7XG5cbi8vIEZGbXBlZyBEb3dubG9hZCBVUkxzXG5leHBvcnQgY29uc3QgRkZNUEVHX1VSTFMgPSB7XG4gICAgd2luMzI6IHtcbiAgICAgICAgeDY0OiBcImh0dHBzOi8vZ2l0aHViLmNvbS9CdGJOL0ZGbXBlZy1CdWlsZHMvcmVsZWFzZXMvZG93bmxvYWQvbGF0ZXN0L2ZmbXBlZy1tYXN0ZXItbGF0ZXN0LXdpbjY0LWdwbC56aXBcIixcbiAgICAgICAgYXJtNjQ6IFwiaHR0cHM6Ly9naXRodWIuY29tL0J0Yk4vRkZtcGVnLUJ1aWxkcy9yZWxlYXNlcy9kb3dubG9hZC9sYXRlc3QvZmZtcGVnLW1hc3Rlci1sYXRlc3Qtd2luYXJtNjQtZ3BsLnppcFwiLFxuICAgIH0sXG4gICAgZGFyd2luOiB7XG4gICAgICAgIHg2NDogXCJodHRwczovL2ZmbXBlZy5tYXJ0aW4tcmllZGwuZGUvZG93bmxvYWQvbWFjb3MvYW1kNjQvMTc2NjQzNzI5N184LjAuMS9mZm1wZWcuemlwXCIsXG4gICAgICAgIGFybTY0OiBcImh0dHBzOi8vZmZtcGVnLm1hcnRpbi1yaWVkbC5kZS9kb3dubG9hZC9tYWNvcy9hcm02NC8xNzY2NDMwMTMyXzguMC4xL2ZmbXBlZy56aXBcIixcbiAgICB9LFxuICAgIGxpbnV4OiB7XG4gICAgICAgIHg2NDogXCJodHRwczovL2pvaG52YW5zaWNrbGUuY29tL2ZmbXBlZy9yZWxlYXNlcy9mZm1wZWctcmVsZWFzZS1hbWQ2NC1zdGF0aWMudGFyLnh6XCIsXG4gICAgICAgIGFybTY0OiBcImh0dHBzOi8vam9obnZhbnNpY2tsZS5jb20vZmZtcGVnL3JlbGVhc2VzL2ZmbXBlZy1yZWxlYXNlLWFybTY0LXN0YXRpYy50YXIueHpcIixcbiAgICB9LFxufSBhcyBjb25zdDtcblxuLy8gRkZwcm9iZSBEb3dubG9hZCBVUkxzIGZvciBtYWNPU1xuZXhwb3J0IGNvbnN0IE1BQ09TX0ZGUFJPQkVfVVJMUyA9IHtcbiAgICB4NjQ6IFwiaHR0cHM6Ly9mZm1wZWcubWFydGluLXJpZWRsLmRlL2Rvd25sb2FkL21hY29zL2FtZDY0LzE3NjY0MzcyOTdfOC4wLjEvZmZwcm9iZS56aXBcIixcbiAgICBhcm02NDogXCJodHRwczovL2ZmbXBlZy5tYXJ0aW4tcmllZGwuZGUvZG93bmxvYWQvbWFjb3MvYXJtNjQvMTc2NjQzMDEzMl84LjAuMS9mZnByb2JlLnppcFwiLFxufTtcblxuLy8gRGlzY29yZCBSUENcbmV4cG9ydCBjb25zdCBESVNDT1JEID0ge1xuICAgIENMSUVOVF9JRDogJzEyMDAxODY3NTA3Mjc4OTMxNjQnLFxuICAgIFJFQ09OTkVDVF9JTlRFUlZBTDogMTAwMDAsXG4gICAgREVGQVVMVF9JTUFHRTogJzEwMjRzdHJlbWlvJyxcbn0gYXMgY29uc3Q7XG5cbi8vIFRpbWVvdXRzXG5leHBvcnQgY29uc3QgVElNRU9VVFMgPSB7XG4gICAgRUxFTUVOVF9XQUlUOiAxMDAwMCxcbiAgICBJTlNUQUxMX0NPTVBMRVRJT046IDEyMDAwMCxcbiAgICBTRVJWSUNFX0NIRUNLX0lOVEVSVkFMOiA1MDAwLFxuICAgIFNFUlZFUl9SRUxPQURfREVMQVk6IDE1MDAsXG4gICAgQ09SRVNUQVRFX1JFVFJZX0lOVEVSVkFMOiAxMDAwLFxuICAgIENPUkVTVEFURV9NQVhfUkVUUklFUzogMzAsXG59IGFzIGNvbnN0O1xuIiwgIjxkaXYgY2xhc3M9XCJuYXYtY29udGVudC1jb250YWluZXItemw5aFFcIiBzdHlsZT1cIndpZHRoOiA5MCU7IG92ZXJmbG93LXk6IGF1dG87XCI+XG4gICAgPGRpdiBjbGFzcz1cImFkZG9ucy1jb250ZW50LXpoRkJsXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RhYmxlLWlucHV0cy1jb250YWluZXItdFV1bDFcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGFjaW5nLXdIMXc1XCI+PC9kaXY+XG4gICAgICAgICAgICA8bGFiZWwgdGl0bGU9XCJTZWFyY2ggdGhlbWVzL3BsdWdpbnNcIiBjbGFzcz1cInNlYXJjaC1iYXItazdNWGQgc2VhcmNoLWJhci1jb250YWluZXItcDR0U3RcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgc2l6ZT1cIjFcIiBhdXRvY29ycmVjdD1cIm9mZlwiIGF1dG9jYXBpdGFsaXplPVwib2ZmXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgc3BlbGxjaGVjaz1cImZhbHNlXCIgdGFiaW5kZXg9XCIwXCIgY2xhc3M9XCJzZWFyY2gtaW5wdXQtYkFnQWggdGV4dC1pbnB1dC1obkxpelwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJTZWFyY2ggdGhlbWVzL3BsdWdpbnNcIiB2YWx1ZT1cIlwiPlxuICAgICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uLVFPWWZKXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNDU2Ljg4MiA0MTUuNzk5OTk5OTk5OTk5N2wtOTMuNzkxLTg5LjQ1YzIyLjYwNS0yOC42NyAzNC43ODQtNjMuNTcgMzQuNjg2LTk5LjQ0IDAtOTEuNTQtNzguMTQyLTE2Ni4wNy0xNzQuMTI1LTE2Ni4wN3MtMTc0LjEyNSA3NC41My0xNzQuMTI1IDE2Ni4xN2MwIDkxLjU0IDc4LjE0MiAxNjYuMDcgMTc0LjEyNSAxNjYuMDcgMzcuNTg2IDAgNzQuMTYxLTExLjYxIDEwNC4yNTYtMzMuMDhsOTMuNzkgODkuNDVjMy41MzUgMy4wNCA3LjkxIDUuMDUgMTIuNjA0IDUuNzkgNC42OTYgMC43NCA5LjUxNSAwLjE4IDEzLjg4Ny0xLjYxIDQuMzc0LTEuNzkgOC4xMTctNC43NCAxMC43ODgtOC40OSAyLjY3MS0zLjc2IDQuMTU3LTguMTcgNC4yODQtMTIuNyAwLjEwOC02LjExLTIuMTY1LTEyLjA0LTYuMzc5LTE2LjY0bS0zNTcuNjItMTg4Ljc5Yy0wLjAxLTI5LjQzIDExLjQ1My01Ny44IDMyLjE2Mi03OS42MSAyMC43MDktMjEuODIgNDkuMTgzLTM1LjQ5IDc5Ljg4NC0zOC4zOSAzMC43LTIuOSA2MS40MzMgNS4yIDg2LjIyMSAyMi43MiAyNC43ODcgMTcuNTIgNDEuODU4IDQzLjIgNDcuODkxIDcyLjA1IDYuMDM0IDI4Ljg2IDAuNTk4IDU4LjgzLTE1LjI0OSA4NC4wN3MtNDAuOTcyIDQzLjk2LTcwLjQ4OSA1Mi41M2MtMjkuNTE4IDguNTUtNjEuMzE3IDYuMzMtODkuMjEzLTYuMjRzLTQ5Ljg5NS0zNC41Ny02MS43MTgtNjEuNzVjLTYuMjU4LTE0LjM4LTkuNDgzLTI5LjgxLTkuNDg4LTQ1LjM4XCIgc3R5bGU9XCJmaWxsOiBjdXJyZW50Y29sb3I7XCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxici8+XG4gICAgICAgIDxkaXYgdGFiaW5kZXg9XCIwXCIgdGl0bGU9XCJTdWJtaXQgeW91ciB0aGVtZXMgYW5kIHBsdWdpbnMgaGVyZVwiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwibGluay1GckwxdCBidXR0b24tY29udGFpbmVyLXpWTEg2XCI+XG4gICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL1JFVkVOR0U5Nzcvc3RyZW1pby1lbmhhbmNlZC1yZWdpc3RyeVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWwtUEp2U0pcIiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj5TdWJtaXQgeW91ciB0aGVtZXMgYW5kIHBsdWdpbnM8L2Rpdj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFkZG9ucy1saXN0LWNvbnRhaW5lci1PdnIyWlwiIGlkPVwibW9kcy1saXN0XCI+XG4gICAgICAgICAgICBcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxici8+XG4gICAgPC9kaXY+XG48L2Rpdj4iLCAiPGJyPlxuPGRpdiB0YWJpbmRleD1cIjBcIiBjbGFzcz1cImFkZG9uLXdobWRPIGFuaW1hdGlvbi1mYWRlLWluIGFkZG9uLWNvbnRhaW5lci1sQzVLTiBidXR0b24tY29udGFpbmVyLXpWTEg2XCI+XG4gICAgPGRpdiBjbGFzcz1cImxvZ28tY29udGFpbmVyLVpjU1NDXCI+XG4gICAgICAgIDwhLS0gdGhlbWUgcHJldmlldyBoZXJlIC0tPlxuXG4gICAgICAgIDwhLS0gcGx1Z2luIGljb24gaGVyZSAtLT5cbiAgICA8L2Rpdj5cblxuXHQ8ZGl2IGNsYXNzPVwiaW5mby1jb250YWluZXItQWRNQjZcIj5cblx0XHQ8ZGl2IGNsYXNzPVwibmFtZS1jb250YWluZXItcUlBZzhcIiB0aXRsZT1cInt7IG5hbWUgfX1cIj57eyBuYW1lIH19PC9kaXY+XG5cdFx0PGRpdiBjbGFzcz1cInZlcnNpb24tY29udGFpbmVyLXpkUHlOXCIgdGl0bGU9XCJ7eyB2ZXJzaW9uIH19XCI+e3sgdmVyc2lvbiB9fTwvZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJ0eXBlcy1jb250YWluZXItRGFPcmdcIj57eyB0eXBlIH19PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjcmlwdGlvbi1jb250YWluZXItdjdKaGVcIj5cbiAgICAgICAgICAgIDxiPkRlc2NyaXB0aW9uOjwvYj4ge3sgZGVzY3JpcHRpb24gfX1cbiAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgIDxiPkF1dGhvcjo8L2I+IHt7IGF1dGhvciB9fVxuICAgICAgICA8L2Rpdj5cblx0PC9kaXY+XG5cdDxkaXYgY2xhc3M9XCJidXR0b25zLWNvbnRhaW5lci1nMHhYclwiPlxuXHRcdDxkaXYgY2xhc3M9XCJhY3Rpb24tYnV0dG9ucy1jb250YWluZXIteE1WbXpcIj5cblx0XHRcdDxkaXYgdGFiaW5kZXg9XCItMVwiIHRpdGxlPVwie3sgYWN0aW9uYnRuVGl0bGUgfX1cIiBjbGFzcz1cInt7IGFjdGlvbmJ0bkNsYXNzIH19IGJ1dHRvbi1jb250YWluZXItelZMSDYgbW9kQWN0aW9uQnRuXCIgZGF0YS1saW5rPVwie3sgZG93bmxvYWQgfX1cIiBkYXRhLXR5cGU9XCJ7eyB0eXBlIH19XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJsYWJlbC1PbldoMlwiPnt7IGFjdGlvbmJ0blRpdGxlIH19PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj5cblx0XHQ8YSBocmVmPVwie3sgcmVwbyB9fVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIiBjbGFzcz1cInNoYXJlLWJ1dHRvbi1jb250YWluZXItczNnd1AgYnV0dG9uLWNvbnRhaW5lci16VkxINlwiPlxuXHRcdFx0PHN2ZyBjbGFzcz1cImljb24tR3hWYllcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XG5cdFx0XHRcdDxwYXRoIGQ9XCJNMTIsMkExMCwxMCAwIDAsMCAyLDEyQzIsMTYuNDIgNC44NywyMC4xNyA4Ljg0LDIxLjVDOS4zNCwyMS41OCA5LjUsMjEuMjcgOS41LDIxQzkuNSwyMC43NyA5LjUsMjAuMTQgOS41LDE5LjMxQzYuNzMsMTkuOTEgNi4xNCwxNy45NyA2LjE0LDE3Ljk3QzUuNjgsMTYuODEgNS4wMywxNi41IDUuMDMsMTYuNUM0LjEyLDE1Ljg4IDUuMSwxNS45IDUuMSwxNS45QzYuMSwxNS45NyA2LjYzLDE2LjkzIDYuNjMsMTYuOTNDNy41LDE4LjQ1IDguOTcsMTggOS41NCwxNy43NkM5LjYzLDE3LjExIDkuODksMTYuNjcgMTAuMTcsMTYuNDJDNy45NSwxNi4xNyA1LjYyLDE1LjMxIDUuNjIsMTEuNUM1LjYyLDEwLjM5IDYsOS41IDYuNjUsOC43OUM2LjU1LDguNTQgNi4yLDcuNSA2Ljc1LDYuMTVDNi43NSw2LjE1IDcuNTksNS44OCA5LjUsNy4xN0MxMC4yOSw2Ljk1IDExLjE1LDYuODQgMTIsNi44NEMxMi44NSw2Ljg0IDEzLjcxLDYuOTUgMTQuNSw3LjE3QzE2LjQxLDUuODggMTcuMjUsNi4xNSAxNy4yNSw2LjE1QzE3LjgsNy41IDE3LjQ1LDguNTQgMTcuMzUsOC43OUMxOCw5LjUgMTguMzgsMTAuMzkgMTguMzgsMTEuNUMxOC4zOCwxNS4zMiAxNi4wNCwxNi4xNiAxMy44MSwxNi40MUMxNC4xNywxNi43MiAxNC41LDE3LjMzIDE0LjUsMTguMjZDMTQuNSwxOS42IDE0LjUsMjAuNjggMTQuNSwyMUMxNC41LDIxLjI3IDE0LjY2LDIxLjU5IDE1LjE3LDIxLjVDMTkuMTQsMjAuMTYgMjIsMTYuNDIgMjIsMTJBMTAsMTAgMCAwLDAgMTIsMlpcIiBzdHlsZT1cImZpbGw6IGN1cnJlbnRjb2xvcjtcIiAvPlxuXHRcdFx0PC9zdmc+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwibGFiZWwtT25XaDJcIj5PcGVuIHJlcG9zaXRvcnk8L2Rpdj5cblx0XHQ8L2E+XG5cdDwvZGl2PlxuPC9kaXY+XG4iLCAiPGg0IHN0eWxlPVwiY29sb3I6IHdoaXRlOyBtYXJnaW4tYm90dG9tOiAxcmVtO1wiPlxuICAgIERldmVsb3BlZCBCeTogPHAgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUgIWltcG9ydGFudDtcIj48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL1JFVkVOR0U5NzdcIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub3JlZmVycmVyXCI+UkVWRU5HRTk3NzwvYT48L3A+XG4gICAgPGJyLz5cbiAgICBWZXJzaW9uOiB2e3sgdmVyc2lvbiB9fVxuICAgIDxici8+XG48L2g0PlxuXG48ZGl2IGNsYXNzPVwib3B0aW9uLXZGT0FTXCI+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRpbmctZFlNRHRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsLXFJNlZoXCI+Q2hlY2sgZm9yIHVwZGF0ZXMgb24gc3RhcnR1cDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LVAyVDBpXCI+XG4gICAgICAgIDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwidG9nZ2xlLWNvbnRhaW5lci1sWmZIUCBidXR0b24tY29udGFpbmVyLXpWTEg2IHt7IGNoZWNrRm9yVXBkYXRlc09uU3RhcnR1cCB9fVwiIGlkPVwiY2hlY2tGb3JVcGRhdGVzT25TdGFydHVwXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9nZ2xlLXRvT1dNXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJvcHRpb24tdkZPQVNcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGluZy1kWU1EdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGFiZWwtcUk2VmhcIj5EaXNjb3JkIFJpY2ggUHJlc2VuY2U8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1QMlQwaVwiPlxuICAgICAgICA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cInRvZ2dsZS1jb250YWluZXItbFpmSFAgYnV0dG9uLWNvbnRhaW5lci16VkxINiB7eyBkaXNjb3JkcmljaHByZXNlbmNlIH19XCIgaWQ9XCJkaXNjb3JkcmljaHByZXNlbmNlXCIgc3R5bGU9XCJvdXRsaW5lOiBub25lO1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvZ2dsZS10b09XTVwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwib3B0aW9uLXZGT0FTXCI+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRpbmctZFlNRHRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxhYmVsLXFJNlZoXCI+V2luZG93IHRyYW5zcGFyZW5jeTwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LVAyVDBpXCI+XG4gICAgICAgIDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwidG9nZ2xlLWNvbnRhaW5lci1sWmZIUCBidXR0b24tY29udGFpbmVyLXpWTEg2IHt7IGVuYWJsZVRyYW5zcGFyZW50VGhlbWVzIH19XCIgaWQ9XCJlbmFibGVUcmFuc3BhcmVudFRoZW1lc1wiIHN0eWxlPVwib3V0bGluZTogbm9uZTtcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b2dnbGUtdG9PV01cIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPHAgc3R5bGU9XCJjb2xvcjpncmF5O1wiPlRoaXMgb3B0aW9uIGhhcyB0byBiZSBlbmFibGVkIGZvciB0aGVtZXMgdGhhdCBzdXBwb3J0IHRyYW5zcGFyZW5jeSB0byB3b3JrLiAoZXhwZXJpbWVudGFsKTwvcD5cbjxici8+XG5cbjxkaXYgY2xhc3M9XCJvcHRpb24tdkZPQVNcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1QMlQwaVwiPlxuICAgICAgICA8ZGl2IHRhYmluZGV4PVwiMFwiIHRpdGxlPVwiQ29tbXVuaXR5IFBsdWdpbnMgJmFtcDsgVGhlbWVzXCIgY2xhc3M9XCJidXR0b24tRE5tWUwgYnV0dG9uLWNvbnRhaW5lci16VkxINiBidXR0b25cIiBpZD1cImJyb3dzZVBsdWdpbnNUaGVtZXNCdG5cIj5cbiAgICAgICAgICAgIENvbW11bml0eSBNYXJrZXRwbGFjZVxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwib3B0aW9uLXZGT0FTXCI+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtUDJUMGlcIj5cbiAgICAgICAgPGRpdiB0YWJpbmRleD1cIjBcIiB0aXRsZT1cIkNoZWNrIEZvciBVcGRhdGVzXCIgY2xhc3M9XCJidXR0b24tRE5tWUwgYnV0dG9uLWNvbnRhaW5lci16VkxINiBidXR0b25cIiBpZD1cImNoZWNrZm9ydXBkYXRlc0J0blwiPlxuICAgICAgICAgICAgQ2hlY2sgRm9yIFVwZGF0ZXNcbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPGJyLz4iLCAiPGRpdiBjbGFzcz1cIm9wdGlvbi12Rk9BU1wiPlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkaW5nLWRZTUR0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsYWJlbC1xSTZWaFwiPkRlZmF1bHQ8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1QMlQwaVwiPlxuICAgICAgICA8ZGl2IFxuICAgICAgICB0aXRsZT1cIkRlZmF1bHRcIiBcbiAgICAgICAgaWQ9XCJEZWZhdWx0XCIgXG4gICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICBvbmNsaWNrPVwiYXBwbHlUaGVtZSgnRGVmYXVsdCcpXCJcbiAgICAgICAgc3R5bGU9XCJjb2xvcjogd2hpdGU7IG1hcmdpbi1ib3R0b206IDFyZW07IHdpZHRoOiBtYXgtY29udGVudDsgYmFja2dyb3VuZC1jb2xvcjoge3sgYmFja2dyb3VuZENvbG9yIH19O1wiXG4gICAgICAgIGNsYXNzPVwiYnV0dG9uIGJ1dHRvbi1jb250YWluZXItelZMSDYge3sgZGlzYWJsZWQgfX1cIlxuICAgICAgICA+e3sgbGFiZWwgfX08L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuIiwgIjxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lci14VDlfTCBiYWNrLWJ1dHRvbi1jb250YWluZXItbERCMU4gYnV0dG9uLWNvbnRhaW5lci16VkxINlwiIGlkPVwiYmFjay1idG5cIj5cbiAgICA8c3ZnIGNsYXNzPVwiaWNvbi1UOE1VNlwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiPlxuICAgICAgICA8cGF0aCBkPVwiTTMyOC42MTAwMDAwMDAwMDA2IDEwNi40NjlsLTE0My41MyAxMzYuODg5IDE0My41MyAxMzYuODg5XCIgc3R5bGU9XCJzdHJva2U6IGN1cnJlbnRjb2xvcjsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyBzdHJva2Utd2lkdGg6IDQ4OyBmaWxsOiBub25lO1wiPjwvcGF0aD5cbiAgICA8L3N2Zz5cbjwvZGl2PiIsICI8bmF2IGNsYXNzPVwidGl0bGUtYmFyXCI+XG4gICAgPGRpdiBjbGFzcz1cInRpdGxlLWJhci1idXR0b25zXCI+XG4gICAgICAgIDxkaXYgaWQ9XCJtaW5pbWl6ZUFwcC1idG5cIiB0aXRsZT1cIk1pbmltaXplXCIgY2xhc3M9XCJidXR0b25cIj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAsMTRINFYxMEgyMFwiIHN0eWxlPVwiZmlsbDp3aGl0ZTtcIj48L3BhdGg+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJtYXhpbWl6ZUFwcC1idG5cIiB0aXRsZT1cIk1heGltaXplXCIgY2xhc3M9XCJidXR0b25cIj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMywzSDIxVjIxSDNWM001LDVWMTlIMTlWNUg1WlwiIHN0eWxlPVwiZmlsbDp3aGl0ZTtcIj48L3BhdGg+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJjbG9zZUFwcC1idG5cIiB0aXRsZT1cIkNsb3NlXCIgY2xhc3M9XCJidXR0b25cIj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIHN0eWxlPVwid2lkdGg6IDI1cHg7IGhlaWdodDogMjVweDtcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE5LDYuNDFMMTcuNTksNUwxMiwxMC41OUw2LjQxLDVMNSw2LjQxTDEwLjU5LDEyTDUsMTcuNTlMNi40MSwxOUwxMiwxMy40MUwxNy41OSwxOUwxOSwxNy41OUwxMy40MSwxMkwxOSw2LjQxWlwiIHN0eWxlPVwiZmlsbDp3aGl0ZTtcIj48L3BhdGg+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8c3R5bGU+XG5cdFx0Ym9keSA+ICo6bm90KC50aXRsZS1iYXIpIHtcblx0XHRcdHBhZGRpbmctdG9wOiA0MHB4OyBcblx0XHR9XG5cbiAgICAgICAgLmJ1dHRvbiB7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAudGl0bGUtYmFyIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDsgXG4gICAgICAgICAgICB0b3A6IDA7XG4gICAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgICAgICB6LWluZGV4OiA5OTk5O1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwwLjE1KTtcbiAgICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigyMHB4KSBzYXR1cmF0ZSgxMjAlKTtcblx0XHRcdC13ZWJraXQtYXBwLXJlZ2lvbjogZHJhZztcbiAgICAgICAgfVxuXG4gICAgICAgIC50aXRsZS1iYXItYnV0dG9ucyB7XG4gICAgICAgICAgICAtd2Via2l0LWFwcC1yZWdpb246IG5vLWRyYWc7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGdhcDogMi4wcmVtO1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG5cdFx0XHRtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAudGl0bGUtYmFyLWJ1dHRvbnMgc3ZnIHtcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICB9XG4gICAgPC9zdHlsZT5cbjwvbmF2PlxuIiwgImltcG9ydCBtb2RzVGFiIGZyb20gJy4uL2NvbXBvbmVudHMvbW9kcy10YWIvbW9kcy10YWIuaHRtbCc7XG5pbXBvcnQgbW9kc0l0ZW0gZnJvbSAnLi4vY29tcG9uZW50cy9tb2RzLWl0ZW0vbW9kcy1pdGVtLmh0bWwnO1xuaW1wb3J0IGFib3V0Q2F0ZWdvcnkgZnJvbSAnLi4vY29tcG9uZW50cy9hYm91dC1jYXRlZ29yeS9hYm91dC1jYXRlZ29yeS5odG1sJztcbmltcG9ydCBkZWZhdWx0VGhlbWUgZnJvbSAnLi4vY29tcG9uZW50cy9kZWZhdWx0LXRoZW1lL2RlZmF1bHQtdGhlbWUuaHRtbCc7XG5pbXBvcnQgYmFja0J0biBmcm9tICcuLi9jb21wb25lbnRzL2JhY2stYnRuL2JhY2stYnRuLmh0bWwnO1xuaW1wb3J0IHRpdGxlQmFyIGZyb20gJy4uL2NvbXBvbmVudHMvdGl0bGUtYmFyL3RpdGxlLWJhci5odG1sJztcblxuY29uc3QgdGVtcGxhdGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICdtb2RzLXRhYic6IG1vZHNUYWIsXG4gICAgJ21vZHMtaXRlbSc6IG1vZHNJdGVtLFxuICAgICdhYm91dC1jYXRlZ29yeSc6IGFib3V0Q2F0ZWdvcnksXG4gICAgJ2RlZmF1bHQtdGhlbWUnOiBkZWZhdWx0VGhlbWUsXG4gICAgJ2JhY2stYnRuJzogYmFja0J0bixcbiAgICAndGl0bGUtYmFyJzogdGl0bGVCYXIsXG59O1xuXG5jbGFzcyBUZW1wbGF0ZUNhY2hlIHtcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoZGlyOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIC8vIFdlIGlnbm9yZSBkaXIgaW4gYnJvd3NlciBidWlsZFxuICAgICAgICByZXR1cm4gdGVtcGxhdGVzW25hbWVdIHx8IFwiXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUZW1wbGF0ZUNhY2hlO1xuIiwgImltcG9ydCBUZW1wbGF0ZUNhY2hlIGZyb20gXCIuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRUb2FzdFRlbXBsYXRlKGlkOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBcInN1Y2Nlc3NcIiB8IFwiZmFpbFwiIHwgXCJpbmZvXCIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ3RvYXN0Jyk7XG4gICAgbGV0IHRvYXN0U3RhdHVzO1xuXG4gICAgc3dpdGNoKHN0YXR1cykge1xuICAgICAgICBjYXNlIFwic3VjY2Vzc1wiOlxuICAgICAgICAgICAgdG9hc3RTdGF0dXMgPSBcInN1Y2Nlc3MtZUlEVGFcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmFpbFwiOlxuICAgICAgICAgICAgdG9hc3RTdGF0dXMgPSBcImVycm9yLXF1eU9kXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImluZm9cIjpcbiAgICAgICAgICAgIHRvYXN0U3RhdHVzID0gXCJpbmZvLUtFV3E4XCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIC5yZXBsYWNlKFwie3sgaWQgfX1cIiwgaWQpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgdGl0bGUgfX1cIiwgdGl0bGUpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgbWVzc2FnZSB9fVwiLCBtZXNzYWdlKVxuICAgICAgICAucmVwbGFjZShcInt7IHN0YXR1cyB9fVwiLCB0b2FzdFN0YXR1cyk7XG59XG4iLCAiaW1wb3J0IFRlbXBsYXRlQ2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvdGVtcGxhdGVDYWNoZSc7XG5pbXBvcnQgeyBNZXRhRGF0YSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvTWV0YURhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGx1Z2luSXRlbVRlbXBsYXRlKFxuICAgIGZpbGVuYW1lOiBzdHJpbmcsIFxuICAgIG1ldGFEYXRhOiBNZXRhRGF0YSxcbiAgICBjaGVja2VkOiBib29sZWFuXG4pOiBzdHJpbmcge1xuICAgIGxldCB0ZW1wbGF0ZSA9IFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICdwbHVnaW4taXRlbScpO1xuICAgIFxuICAgIC8vIFJlcGxhY2UgbWV0YWRhdGEgcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgbWV0YUtleXMgPSBbJ25hbWUnLCAnZGVzY3JpcHRpb24nLCAnYXV0aG9yJywgJ3ZlcnNpb24nXSBhcyBjb25zdDtcbiAgICBtZXRhS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChge3tcXFxccyoke2tleX1cXFxccyp9fWAsICdnJyk7XG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShyZWdleCwgbWV0YURhdGFba2V5XSB8fCAnJyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGVtcGxhdGVcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBjaGVja2VkIH19XCIsIGNoZWNrZWQgPyBcImNoZWNrZWRcIiA6IFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqZmlsZU5hbWVcXHMqXFx9XFx9L2csIGZpbGVuYW1lKTtcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcbmltcG9ydCB7IE1ldGFEYXRhIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9NZXRhRGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaGVtZUl0ZW1UZW1wbGF0ZShcbiAgICBmaWxlbmFtZTogc3RyaW5nLCBcbiAgICBtZXRhRGF0YTogTWV0YURhdGEsXG4gICAgYXBwbGllZDogYm9vbGVhblxuKTogc3RyaW5nIHtcbiAgICBsZXQgdGVtcGxhdGUgPSBUZW1wbGF0ZUNhY2hlLmxvYWQoX19kaXJuYW1lLCAndGhlbWUtaXRlbScpO1xuICAgIFxuICAgIC8vIFJlcGxhY2UgbWV0YWRhdGEgcGxhY2Vob2xkZXJzXG4gICAgY29uc3QgbWV0YUtleXMgPSBbJ25hbWUnLCAnZGVzY3JpcHRpb24nLCAnYXV0aG9yJywgJ3ZlcnNpb24nXSBhcyBjb25zdDtcbiAgICBtZXRhS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChge3tcXFxccyoke2tleX1cXFxccyp9fWAsICdnJyk7XG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShyZWdleCwgbWV0YURhdGFba2V5XSB8fCAnJyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGVtcGxhdGVcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBkaXNhYmxlZCB9fVwiLCBhcHBsaWVkID8gXCJkaXNhYmxlZFwiIDogXCJcIilcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccypmaWxlTmFtZVxccypcXH1cXH0vZywgZmlsZW5hbWUpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgbGFiZWwgfX1cIiwgYXBwbGllZCA/IFwiQXBwbGllZFwiIDogXCJBcHBseVwiKVxuICAgICAgICAucmVwbGFjZShcInt7IGJ1dHRvbkNsYXNzIH19XCIsIGFwcGxpZWQgPyBcInVuaW5zdGFsbC1idXR0b24tY29udGFpbmVyLW9WNFlvXCIgOiBcImluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci15ZmNxNVwiKTtcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVuaGFuY2VkTmF2KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICdlbmhhbmNlZC1uYXYnKTtcbn1cbiIsICJpbXBvcnQgeyBQbGF0Zm9ybU1hbmFnZXIgfSBmcm9tIFwiLi4vcGxhdGZvcm0vUGxhdGZvcm1NYW5hZ2VyXCI7XG5cbmNsYXNzIFByb3BlcnRpZXMge1xuICAgIHB1YmxpYyBzdGF0aWMgdGhlbWVMaW5rU2VsZWN0b3I6IHN0cmluZyA9IFwiaGVhZCA+IGxpbmtbcmVsPXN0eWxlc2hlZXRdXCI7XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldCBlbmhhbmNlZFBhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmdldEVuaGFuY2VkUGF0aCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHRoZW1lc1BhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmdldFRoZW1lc1BhdGgoKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHN0YXRpYyBnZXQgcGx1Z2luc1BhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmdldFBsdWdpbnNQYXRoKCk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzdGF0aWMgaXNVc2luZ1N0cmVtaW9TZXJ2aWNlID0gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb3BlcnRpZXM7XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGx5VGhlbWVUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgXG4gICAgZnVuY3Rpb24gYXBwbHlUaGVtZSh0aGVtZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImFwcGx5aW5nIFwiICsgdGhlbWUpO1xuICAgICAgICBcbiAgICAgICAgLy8gQ2FsbCB0aGUgbmF0aXZlL3ByZWxvYWQgaGFuZGxlciB0byBhY3R1YWxseSBsb2FkIHRoZSBDU1NcbiAgICAgICAgaWYgKHdpbmRvdy5zdHJlbWlvRW5oYW5jZWQgJiYgd2luZG93LnN0cmVtaW9FbmhhbmNlZC5hcHBseVRoZW1lKSB7XG4gICAgICAgICAgICB3aW5kb3cuc3RyZW1pb0VuaGFuY2VkLmFwcGx5VGhlbWUodGhlbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVUkgVXBkYXRlc1xuICAgICAgICBjb25zdCBjdXJyZW50VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImN1cnJlbnRUaGVtZVwiKTtcbiAgICAgICAgaWYgKGN1cnJlbnRUaGVtZSkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFRoZW1lRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGN1cnJlbnRUaGVtZSk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFRoZW1lRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaGVtZSAhPT0gXCJEZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFRoZW1lRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwidW5pbnN0YWxsLWJ1dHRvbi1jb250YWluZXItb1Y0WW9cIik7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci15ZmNxNVwiKTsgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGhlbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcilcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50VGhlbWVFbGVtZW50LmlubmVyVGV4dCA9IFwiQXBwbHlcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiY3VycmVudFRoZW1lXCIsIHRoZW1lKTtcblxuICAgICAgICBjb25zdCBuZXdUaGVtZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGVtZSk7XG4gICAgICAgIGlmIChuZXdUaGVtZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIG5ld1RoZW1lRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG5cbiAgICAgICAgICAgIGlmICh0aGVtZSAhPT0gXCJEZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImluc3RhbGwtYnV0dG9uLWNvbnRhaW5lci15ZmNxNVwiKTtcbiAgICAgICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInVuaW5zdGFsbC1idXR0b24tY29udGFpbmVyLW9WNFlvXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ2YXIoLS1vdmVybGF5LWNvbG9yKVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdUaGVtZUVsZW1lbnQuaW5uZXJUZXh0ID0gXCJBcHBsaWVkXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYDtcbn1cbiIsICJpbXBvcnQgU2V0dGluZ3MgZnJvbSBcIi4vU2V0dGluZ3NcIjtcbmltcG9ydCB7IFBsYXRmb3JtTWFuYWdlciB9IGZyb20gXCIuLi9wbGF0Zm9ybS9QbGF0Zm9ybU1hbmFnZXJcIjtcbmltcG9ydCBwcm9wZXJ0aWVzIGZyb20gXCIuL1Byb3BlcnRpZXNcIjtcbmltcG9ydCBoZWxwZXJzIGZyb20gXCIuLi91dGlscy9IZWxwZXJzXCI7XG5pbXBvcnQgeyBNZXRhRGF0YSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL01ldGFEYXRhXCI7XG5pbXBvcnQgeyBnZXRMb2dnZXIgfSBmcm9tIFwiLi4vdXRpbHMvbG9nZ2VyXCI7XG5pbXBvcnQgUHJvcGVydGllcyBmcm9tIFwiLi9Qcm9wZXJ0aWVzXCI7XG5pbXBvcnQgeyBnZXRBcHBseVRoZW1lVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9hcHBseS10aGVtZS9hcHBseVRoZW1lXCI7XG5pbXBvcnQgeyBiYXNlbmFtZSwgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBTVE9SQUdFX0tFWVMsIFNFTEVDVE9SUywgQ0xBU1NFUywgVVJMUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCBFeHRyYWN0TWV0YURhdGEgZnJvbSBcIi4uL3V0aWxzL0V4dHJhY3RNZXRhRGF0YVwiO1xuXG5jbGFzcyBNb2RNYW5hZ2VyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBsb2dnZXIgPSBnZXRMb2dnZXIoXCJNb2RNYW5hZ2VyXCIpO1xuICAgIFxuICAgIC8qKlxuICAgICAqIExvYWQgYW5kIGVuYWJsZSBhIHBsdWdpbiBieSBmaWxlbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgbG9hZFBsdWdpbihwbHVnaW5OYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBsdWdpbk5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBQbHVnaW4gJHtwbHVnaW5OYW1lfSBpcyBhbHJlYWR5IGxvYWRlZGApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGx1Z2luUGF0aCA9IGpvaW4ocHJvcGVydGllcy5wbHVnaW5zUGF0aCwgcGx1Z2luTmFtZSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmV4aXN0cyhwbHVnaW5QYXRoKSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYFBsdWdpbiBmaWxlIG5vdCBmb3VuZDogJHtwbHVnaW5QYXRofWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGx1Z2luID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZEZpbGUocGx1Z2luUGF0aCk7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdC5pbm5lckhUTUwgPSBwbHVnaW47XG4gICAgICAgIHNjcmlwdC5pZCA9IHBsdWdpbk5hbWU7XG4gICAgICAgIFxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBlbmFibGVkUGx1Z2luczogc3RyaW5nW10gPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUykgfHwgXCJbXVwiXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWVuYWJsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbk5hbWUpKSB7XG4gICAgICAgICAgICBlbmFibGVkUGx1Z2lucy5wdXNoKHBsdWdpbk5hbWUpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUywgSlNPTi5zdHJpbmdpZnkoZW5hYmxlZFBsdWdpbnMpKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgUGx1Z2luICR7cGx1Z2luTmFtZX0gbG9hZGVkIWApO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBVbmxvYWQgYW5kIGRpc2FibGUgYSBwbHVnaW4gYnkgZmlsZW5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHVubG9hZFBsdWdpbihwbHVnaW5OYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGx1Z2luRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBsdWdpbk5hbWUpO1xuICAgICAgICBpZiAocGx1Z2luRWxlbWVudCkge1xuICAgICAgICAgICAgcGx1Z2luRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGV0IGVuYWJsZWRQbHVnaW5zOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TKSB8fCBcIltdXCJcbiAgICAgICAgKTtcbiAgICAgICAgZW5hYmxlZFBsdWdpbnMgPSBlbmFibGVkUGx1Z2lucy5maWx0ZXIoKHg6IHN0cmluZykgPT4geCAhPT0gcGx1Z2luTmFtZSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZUy5FTkFCTEVEX1BMVUdJTlMsIEpTT04uc3RyaW5naWZ5KGVuYWJsZWRQbHVnaW5zKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBQbHVnaW4gJHtwbHVnaW5OYW1lfSB1bmxvYWRlZCFgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaCBtb2RzIGZyb20gdGhlIHJlZ2lzdHJ5IHJlcG9zaXRvcnlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGZldGNoTW9kcygpOiBQcm9taXNlPHsgcGx1Z2luczogdW5rbm93bltdOyB0aGVtZXM6IHVua25vd25bXSB9PiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goVVJMUy5SRUdJU1RSWSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG93bmxvYWQgYW5kIHNhdmUgYSBtb2QgKHBsdWdpbiBvciB0aGVtZSlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGRvd25sb2FkTW9kKG1vZExpbms6IHN0cmluZywgdHlwZTogXCJwbHVnaW5cIiB8IFwidGhlbWVcIik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oYERvd25sb2FkaW5nICR7dHlwZX0gZnJvbTogJHttb2RMaW5rfWApO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gobW9kTGluayk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGRvd25sb2FkOiAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgc2F2ZURpciA9IHR5cGUgPT09IFwicGx1Z2luXCIgPyBQcm9wZXJ0aWVzLnBsdWdpbnNQYXRoIDogUHJvcGVydGllcy50aGVtZXNQYXRoO1xuICAgICAgICBpZiAoIWF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmV4aXN0cyhzYXZlRGlyKSkge1xuICAgICAgICAgICAgYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQubWtkaXIoc2F2ZURpcik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYmFzZW5hbWUobmV3IFVSTChtb2RMaW5rKS5wYXRobmFtZSkgfHwgYCR7dHlwZX0tJHtEYXRlLm5vdygpfWA7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gam9pbihzYXZlRGlyLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQud3JpdGVGaWxlKGZpbGVQYXRoLCBjb250ZW50KTtcblxuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBEb3dubG9hZGVkICR7dHlwZX0gc2F2ZWQgdG86ICR7ZmlsZVBhdGh9YCk7XG4gICAgICAgIHJldHVybiBmaWxlUGF0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBtb2QgZmlsZSBhbmQgY2xlYW4gdXAgYXNzb2NpYXRlZCBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmVtb3ZlTW9kKGZpbGVOYW1lOiBzdHJpbmcsIHR5cGU6IFwicGx1Z2luXCIgfCBcInRoZW1lXCIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgUmVtb3ZpbmcgJHt0eXBlfSBmaWxlOiAke2ZpbGVOYW1lfWApO1xuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInBsdWdpblwiOlxuICAgICAgICAgICAgICAgIGlmIChhd2FpdCB0aGlzLmlzUGx1Z2luSW5zdGFsbGVkKGZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC51bmxpbmsoam9pbihQcm9wZXJ0aWVzLnBsdWdpbnNQYXRoLCBmaWxlTmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZW5hYmxlZFBsdWdpbnM6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5FTkFCTEVEX1BMVUdJTlMpIHx8IFwiW11cIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5hYmxlZFBsdWdpbnMuaW5jbHVkZXMoZmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkUGx1Z2lucyA9IGVuYWJsZWRQbHVnaW5zLmZpbHRlcigoeDogc3RyaW5nKSA9PiB4ICE9PSBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX0tFWVMuRU5BQkxFRF9QTFVHSU5TLCBKU09OLnN0cmluZ2lmeShlbmFibGVkUGx1Z2lucykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInRoZW1lXCI6XG4gICAgICAgICAgICAgICAgaWYgKGF3YWl0IHRoaXMuaXNUaGVtZUluc3RhbGxlZChmaWxlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5DVVJSRU5UX1RIRU1FKSA9PT0gZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZUy5DVVJSRU5UX1RIRU1FLCBcIkRlZmF1bHRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY3RpdmVUaGVtZVwiKT8ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnVubGluayhqb2luKFByb3BlcnRpZXMudGhlbWVzUGF0aCwgZmlsZU5hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGlzVGhlbWVJbnN0YWxsZWQoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0SW5zdGFsbGVkVGhlbWVzKCkpLmluY2x1ZGVzKGZpbGVOYW1lKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGlzUGx1Z2luSW5zdGFsbGVkKGZpbGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLmdldEluc3RhbGxlZFBsdWdpbnMoKSkuaW5jbHVkZXMoZmlsZU5hbWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGdldEluc3RhbGxlZFRoZW1lcygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IGRpclBhdGggPSBQcm9wZXJ0aWVzLnRoZW1lc1BhdGg7XG4gICAgICAgIGlmICghYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQuZXhpc3RzKGRpclBhdGgpKSByZXR1cm4gW107XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRkaXIoZGlyUGF0aCk7XG4gICAgICAgIGNvbnN0IGZpbGVTdGF0cyA9IGF3YWl0IFByb21pc2UuYWxsKGZpbGVzLm1hcChhc3luYyBmaWxlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5zdGF0KGpvaW4oZGlyUGF0aCwgZmlsZSkpO1xuICAgICAgICAgICAgcmV0dXJuIHsgZmlsZSwgaXNGaWxlOiBzdGF0LmlzRmlsZSB9O1xuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmlsZVN0YXRzLmZpbHRlcihmID0+IGYuaXNGaWxlKS5tYXAoZiA9PiBmLmZpbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGdldEluc3RhbGxlZFBsdWdpbnMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCBkaXJQYXRoID0gUHJvcGVydGllcy5wbHVnaW5zUGF0aDtcbiAgICAgICAgaWYgKCFhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5leGlzdHMoZGlyUGF0aCkpIHJldHVybiBbXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZGRpcihkaXJQYXRoKTtcbiAgICAgICAgY29uc3QgZmlsZVN0YXRzID0gYXdhaXQgUHJvbWlzZS5hbGwoZmlsZXMubWFwKGFzeW5jIGZpbGUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnN0YXQoam9pbihkaXJQYXRoLCBmaWxlKSk7XG4gICAgICAgICAgICByZXR1cm4geyBmaWxlLCBpc0ZpbGU6IHN0YXQuaXNGaWxlIH07XG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmaWxlU3RhdHMuZmlsdGVyKGYgPT4gZi5pc0ZpbGUpLm1hcChmID0+IGYuZmlsZSk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIFNldCB1cCBldmVudCBsaXN0ZW5lcnMgZm9yIHBsdWdpbiB0b2dnbGUgY2hlY2tib3hlc1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdG9nZ2xlUGx1Z2luTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGhlbHBlcnMud2FpdEZvckVsbShTRUxFQ1RPUlMuUExVR0lOU19DQVRFR09SWSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKFwiTGlzdGVuaW5nIHRvIHBsdWdpbiBjaGVja2JveGVzLi4uXCIpO1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luQ2hlY2tib3hlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbHVnaW5cIikgYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRWxlbWVudD47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGx1Z2luQ2hlY2tib3hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBsdWdpbkNoZWNrYm94ZXNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luQ2hlY2tib3hlc1tpXS5jbGFzc0xpc3QudG9nZ2xlKENMQVNTRVMuQ0hFQ0tFRCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsdWdpbk5hbWUgPSBwbHVnaW5DaGVja2JveGVzW2ldLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGx1Z2luTmFtZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwbHVnaW5DaGVja2JveGVzW2ldLmNsYXNzTGlzdC5jb250YWlucyhDTEFTU0VTLkNIRUNLRUQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRQbHVnaW4ocGx1Z2luTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVubG9hZFBsdWdpbihwbHVnaW5OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1JlbG9hZFdhcm5pbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBzZXR1cCBwbHVnaW4gbGlzdGVuZXJzOiAke2Vycn1gKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hvd1JlbG9hZFdhcm5pbmcoKTogdm9pZCB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsdWdpbi1yZWxvYWQtd2FybmluZ1wiKSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhcIlBsdWdpbiB1bmxvYWRlZCwgYWRkaW5nIHJlbG9hZCB3YXJuaW5nLlwiKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuUExVR0lOU19DQVRFR09SWSk7XG4gICAgICAgIGlmICghY29udGFpbmVyKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIHBhcmFncmFwaC5pZCA9IFwicGx1Z2luLXJlbG9hZC13YXJuaW5nXCI7XG4gICAgICAgIHBhcmFncmFwaC5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgbGluay5zdHlsZS5jb2xvciA9IFwiY3lhblwiO1xuICAgICAgICBsaW5rLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICBsaW5rLnRleHRDb250ZW50ID0gXCJoZXJlXCI7XG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHBhcmFncmFwaC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlJlbG9hZCBpcyByZXF1aXJlZCB0byBkaXNhYmxlIHBsdWdpbnMuIENsaWNrIFwiKSk7XG4gICAgICAgIHBhcmFncmFwaC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgcGFyYWdyYXBoLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiIHRvIHJlbG9hZC5cIikpO1xuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBhcmFncmFwaCk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzdGF0aWMgb3BlblRoZW1lc0ZvbGRlcigpOiB2b2lkIHtcbiAgICAgICAgaGVscGVycy53YWl0Rm9yRWxtKFwiI29wZW50aGVtZXNmb2xkZXJCdG5cIikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW50aGVtZXNmb2xkZXJCdG5cIik7XG4gICAgICAgICAgICBidXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5vcGVuRm9sZGVyKFByb3BlcnRpZXMudGhlbWVzUGF0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gc2V0dXAgdGhlbWVzIGZvbGRlciBidXR0b246ICR7ZXJyfWApKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIG9wZW5QbHVnaW5zRm9sZGVyKCk6IHZvaWQge1xuICAgICAgICBoZWxwZXJzLndhaXRGb3JFbG0oXCIjb3BlbnBsdWdpbnNmb2xkZXJCdG5cIikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW5wbHVnaW5zZm9sZGVyQnRuXCIpO1xuICAgICAgICAgICAgYnV0dG9uPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMub3BlbkZvbGRlcihQcm9wZXJ0aWVzLnBsdWdpbnNQYXRoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBzZXR1cCBwbHVnaW5zIGZvbGRlciBidXR0b246ICR7ZXJyfWApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVuIGEgZm9sZGVyIGluIHRoZSBzeXN0ZW0gZmlsZSBleHBsb3JlclxuICAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIG9wZW5Gb2xkZXIoZm9sZGVyUGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5vcGVuUGF0aChmb2xkZXJQYXRoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gb3BlbiBmb2xkZXIgJHtmb2xkZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgXG4gICAgcHVibGljIHN0YXRpYyBzY3JvbGxMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgaGVscGVycy53YWl0Rm9yRWxtKFwiLm1lbnUteGVFMDYgPiBkaXY6bnRoLWNoaWxkKDUpID4gZGl2XCIpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW5oYW5jZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5oYW5jZWQnKTtcbiAgICAgICAgICAgIGNvbnN0IGVuaGFuY2VkTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUteGVFMDYgPiBkaXY6bnRoLWNoaWxkKDUpID4gZGl2Jyk7XG5cbiAgICAgICAgICAgIGlmICghZW5oYW5jZWQgfHwgIWVuaGFuY2VkTmF2KSByZXR1cm47XG5cbiAgICAgICAgICAgIGVuaGFuY2VkTmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlyc3RDaGlsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZW5oYW5jZWQgPiBkaXZcIik7XG4gICAgICAgICAgICAgICAgZmlyc3RDaGlsZD8uc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrOiAnc3RhcnQnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgU2V0dGluZ3MuYWN0aXZlU2VjdGlvbihlbmhhbmNlZE5hdik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgICAgICAgICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNldHRpbmdzLmFjdGl2ZVNlY3Rpb24oZW5oYW5jZWROYXYpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5oYW5jZWROYXYuY2xhc3NMaXN0LnJlbW92ZShDTEFTU0VTLlNFTEVDVEVEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgeyB0aHJlc2hvbGQ6IDAuMSB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVuaGFuY2VkKTtcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gc2V0dXAgc2Nyb2xsIGxpc3RlbmVyOiAke2Vycn1gKSk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgYXBwbHlUaGVtZSBmdW5jdGlvbiB0byB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkQXBwbHlUaGVtZUZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBhcHBseVRoZW1lU2NyaXB0ID0gZ2V0QXBwbHlUaGVtZVRlbXBsYXRlKCk7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ICBcbiAgICAgICAgc2NyaXB0LmlubmVySFRNTCA9IGFwcGx5VGhlbWVTY3JpcHQ7XG4gICAgICAgIFxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIENoZWNrIGZvciB1cGRhdGVzIGZvciBhIHNwZWNpZmljIHBsdWdpbiBvciB0aGVtZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgY2hlY2tGb3JJdGVtVXBkYXRlcyhpdGVtRmlsZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8oJ0NoZWNraW5nIGZvciB1cGRhdGVzIGZvciAnICsgaXRlbUZpbGUpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgaXRlbUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKGAke2l0ZW1GaWxlfS1ib3hgKVswXTtcbiAgICAgICAgaWYgKCFpdGVtQm94KSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGAke2l0ZW1GaWxlfS1ib3ggZWxlbWVudCBub3QgZm91bmQuYCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwbHVnaW5PclRoZW1lOiAndGhlbWUnIHwgJ3BsdWdpbicgPSBpdGVtRmlsZS5lbmRzV2l0aChcIi50aGVtZS5jc3NcIikgPyBcInRoZW1lXCIgOiBcInBsdWdpblwiO1xuICAgICAgICBjb25zdCBpdGVtUGF0aCA9IGpvaW4oXG4gICAgICAgICAgICBwbHVnaW5PclRoZW1lID09PSBcInRoZW1lXCIgPyBwcm9wZXJ0aWVzLnRoZW1lc1BhdGggOiBwcm9wZXJ0aWVzLnBsdWdpbnNQYXRoLCBcbiAgICAgICAgICAgIGl0ZW1GaWxlXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICAvLyBSZWZhY3RvcmVkOiBSZWFkIGZpbGUgZmlyc3RcbiAgICAgICAgbGV0IGZpbGVDb250ZW50ID0gXCJcIjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpbGVDb250ZW50ID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZEZpbGUoaXRlbVBhdGgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIHJlYWQgZmlsZSAke2l0ZW1QYXRofTogJHtlfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5zdGFsbGVkSXRlbU1ldGFEYXRhID0gRXh0cmFjdE1ldGFEYXRhLmV4dHJhY3RNZXRhZGF0YUZyb21UZXh0KGZpbGVDb250ZW50KSBhcyBNZXRhRGF0YSB8IG51bGw7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWluc3RhbGxlZEl0ZW1NZXRhRGF0YSB8fCBPYmplY3Qua2V5cyhpbnN0YWxsZWRJdGVtTWV0YURhdGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXBkYXRlVXJsID0gaW5zdGFsbGVkSXRlbU1ldGFEYXRhLnVwZGF0ZVVybDtcbiAgICAgICAgaWYgKCF1cGRhdGVVcmwgfHwgdXBkYXRlVXJsID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgTm8gdXBkYXRlIFVSTCBwcm92aWRlZCBmb3IgJHtwbHVnaW5PclRoZW1lfSAoJHtpbnN0YWxsZWRJdGVtTWV0YURhdGEubmFtZX0pYCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IGF3YWl0IGZldGNoKHVwZGF0ZVVybCk7XG4gICAgICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEZhaWxlZCB0byBmZXRjaCB1cGRhdGUgZm9yICR7aXRlbUZpbGV9OiBIVFRQICR7cmVxdWVzdC5zdGF0dXN9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3QudGV4dCgpO1xuICAgICAgICAgICAgY29uc3QgZXh0cmFjdGVkTWV0YURhdGEgPSBFeHRyYWN0TWV0YURhdGEuZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQocmVzcG9uc2UpIGFzIE1ldGFEYXRhIHwgbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFleHRyYWN0ZWRNZXRhRGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEZhaWxlZCB0byBleHRyYWN0IG1ldGFkYXRhIGZyb20gcmVzcG9uc2UgZm9yICR7cGx1Z2luT3JUaGVtZX0gKCR7aW5zdGFsbGVkSXRlbU1ldGFEYXRhLm5hbWV9KWApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhlbHBlcnMuaXNOZXdlclZlcnNpb24oZXh0cmFjdGVkTWV0YURhdGEudmVyc2lvbiwgaW5zdGFsbGVkSXRlbU1ldGFEYXRhLnZlcnNpb24pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhcbiAgICAgICAgICAgICAgICAgICAgYFVwZGF0ZSBhdmFpbGFibGUgZm9yICR7cGx1Z2luT3JUaGVtZX0gKCR7aW5zdGFsbGVkSXRlbU1ldGFEYXRhLm5hbWV9KTogYCArXG4gICAgICAgICAgICAgICAgICAgIGB2JHtpbnN0YWxsZWRJdGVtTWV0YURhdGEudmVyc2lvbn0gLT4gdiR7ZXh0cmFjdGVkTWV0YURhdGEudmVyc2lvbn1gXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke2l0ZW1GaWxlfS11cGRhdGVgKTtcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlQnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQud3JpdGVGaWxlKGl0ZW1QYXRoLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBTZXR0aW5ncy5yZW1vdmVJdGVtKGl0ZW1GaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNldHRpbmdzLmFkZEl0ZW0ocGx1Z2luT3JUaGVtZSwgaXRlbUZpbGUsIGV4dHJhY3RlZE1ldGFEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKFxuICAgICAgICAgICAgICAgICAgICBgTm8gdXBkYXRlIGF2YWlsYWJsZSBmb3IgJHtwbHVnaW5PclRoZW1lfSAoJHtpbnN0YWxsZWRJdGVtTWV0YURhdGEubmFtZX0pLiBgICtcbiAgICAgICAgICAgICAgICAgICAgYEN1cnJlbnQgdmVyc2lvbjogdiR7aW5zdGFsbGVkSXRlbU1ldGFEYXRhLnZlcnNpb259YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgRXJyb3IgY2hlY2tpbmcgdXBkYXRlcyBmb3IgJHtpdGVtRmlsZX06ICR7KGVycm9yIGFzIEVycm9yKS5tZXNzYWdlfWApO1xuICAgICAgICB9XG4gICAgfVxufVxuICAgIFxuZXhwb3J0IGRlZmF1bHQgTW9kTWFuYWdlcjtcbiIsICIvKipcbiAqIE1ldGFkYXRhIHN0cnVjdHVyZSBmb3IgcGx1Z2lucyBhbmQgdGhlbWVzXG4gKiBFeHRyYWN0ZWQgZnJvbSBKU0RvYy1zdHlsZSBjb21tZW50cyBpbiBtb2QgZmlsZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRhRGF0YSB7XG4gICAgLyoqIERpc3BsYXkgbmFtZSBvZiB0aGUgbW9kICovXG4gICAgbmFtZTogc3RyaW5nO1xuICAgIC8qKiBCcmllZiBkZXNjcmlwdGlvbiBvZiB3aGF0IHRoZSBtb2QgZG9lcyAqL1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgLyoqIEF1dGhvci9jcmVhdG9yIG9mIHRoZSBtb2QgKi9cbiAgICBhdXRob3I6IHN0cmluZztcbiAgICAvKiogU2VtYW50aWMgdmVyc2lvbiBzdHJpbmcgKGUuZy4sIFwiMS4wLjBcIikgKi9cbiAgICB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgLyoqIFVSTCB0byBjaGVjayBmb3IgdXBkYXRlcyAob3B0aW9uYWwpICovXG4gICAgdXBkYXRlVXJsPzogc3RyaW5nO1xuICAgIC8qKiBTb3VyY2UgY29kZSByZXBvc2l0b3J5IFVSTCAob3B0aW9uYWwpICovXG4gICAgc291cmNlPzogc3RyaW5nO1xuICAgIC8qKiBMaWNlbnNlIHR5cGUgKG9wdGlvbmFsKSAqL1xuICAgIGxpY2Vuc2U/OiBzdHJpbmc7XG4gICAgLyoqIEhvbWVwYWdlL2RvY3VtZW50YXRpb24gVVJMIChvcHRpb25hbCkgKi9cbiAgICBob21lcGFnZT86IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgTWV0YWRhdGFLZXkgPSBrZXlvZiBNZXRhRGF0YTtcblxuZXhwb3J0IGNvbnN0IFJFUVVJUkVEX01FVEFEQVRBX0tFWVMgPSBbXG4gICAgXCJuYW1lXCIsXG4gICAgXCJkZXNjcmlwdGlvblwiLFxuICAgIFwiYXV0aG9yXCIsXG4gICAgXCJ2ZXJzaW9uXCIsXG5dIGFzIGNvbnN0IHNhdGlzZmllcyByZWFkb25seSBNZXRhZGF0YUtleVtdO1xuXG5leHBvcnQgY29uc3QgQUxMX01FVEFEQVRBX0tFWVMgPSBbXG4gICAgXCJuYW1lXCIsXG4gICAgXCJkZXNjcmlwdGlvblwiLFxuICAgIFwiYXV0aG9yXCIsXG4gICAgXCJ2ZXJzaW9uXCIsXG4gICAgXCJ1cGRhdGVVcmxcIixcbiAgICBcInNvdXJjZVwiLFxuICAgIFwibGljZW5zZVwiLFxuICAgIFwiaG9tZXBhZ2VcIixcbl0gYXMgY29uc3Qgc2F0aXNmaWVzIHJlYWRvbmx5IE1ldGFkYXRhS2V5W107XG4iLCAiaW1wb3J0IHtcbiAgICBNZXRhRGF0YSxcbiAgICBNZXRhZGF0YUtleSxcbiAgICBSRVFVSVJFRF9NRVRBREFUQV9LRVlTLFxuICAgIEFMTF9NRVRBREFUQV9LRVlTLFxufSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9NZXRhRGF0YVwiO1xuaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIjtcblxuY2xhc3MgRXh0cmFjdE1ldGFEYXRhIHtcbiAgICAvKipcbiAgICAgKiBQYXJzZSBtZXRhZGF0YSBmcm9tIGEgY29tbWVudCBibG9jayBpbiB0aGUgZm9ybWF0OlxuICAgICAqIC8qKiBAa2V5IHZhbHVlICpcXC9cbiAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIHBhcnNlTWV0YWRhdGFGcm9tQ29udGVudChjb250ZW50OiBzdHJpbmcpOiBNZXRhRGF0YSB8IG51bGwge1xuICAgICAgICBjb25zdCBibG9ja01hdGNoID0gY29udGVudC5tYXRjaCgvXFwvXFwqXFwqKFtcXHNcXFNdKj8pXFwqXFwvLyk7XG4gICAgICAgIGlmICghYmxvY2tNYXRjaCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBQYXJ0aWFsPE1ldGFEYXRhPiA9IHt9O1xuICAgICAgICBjb25zdCB0YWdSZWdleCA9IC9AKFxcdyspXFxzKyhbXlxcblxccl0rKS9nO1xuXG4gICAgICAgIGZvciAoY29uc3QgWywgcmF3S2V5LCByYXdWYWx1ZV0gb2YgYmxvY2tNYXRjaFsxXS5tYXRjaEFsbCh0YWdSZWdleCkpIHtcbiAgICAgICAgICAgIGlmICghQUxMX01FVEFEQVRBX0tFWVMuaW5jbHVkZXMocmF3S2V5IGFzIE1ldGFkYXRhS2V5KSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHJhd0tleSBhcyBNZXRhZGF0YUtleTtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdFtrZXldICE9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHJhd1ZhbHVlLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIFJFUVVJUkVEX01FVEFEQVRBX0tFWVMpIHtcbiAgICAgICAgICAgIGlmICghcmVzdWx0W2tleV0pIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBNZXRhRGF0YTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGV4dHJhY3RNZXRhZGF0YUZyb21UZXh0KHRleHRDb250ZW50OiBzdHJpbmcpOiBNZXRhRGF0YSB8IG51bGwge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMucGFyc2VNZXRhZGF0YUZyb21Db250ZW50KHRleHRDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghbWV0YWRhdGEpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignQ29tbWVudCBibG9jayBub3QgZm91bmQgaW4gdGhlIHByb3ZpZGVkIHRleHQnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG1ldGFkYXRhO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXh0cmFjdE1ldGFEYXRhO1xuIiwgImltcG9ydCBIZWxwZXJzIGZyb20gXCIuLi91dGlscy9IZWxwZXJzXCI7XG5pbXBvcnQgeyBNZXRhRGF0YSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL01ldGFEYXRhXCI7XG5pbXBvcnQgeyBnZXRQbHVnaW5JdGVtVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9wbHVnaW4taXRlbS9wbHVnaW5JdGVtXCI7XG5pbXBvcnQgeyBnZXRUaGVtZUl0ZW1UZW1wbGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL3RoZW1lLWl0ZW0vdGhlbWVJdGVtXCI7XG5pbXBvcnQgeyBnZXRFbmhhbmNlZE5hdiB9IGZyb20gXCIuLi9jb21wb25lbnRzL2VuaGFuY2VkLW5hdi9lbmhhbmNlZE5hdlwiO1xuaW1wb3J0IHsgZ2V0TG9nZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IE1vZE1hbmFnZXIgZnJvbSBcIi4vTW9kTWFuYWdlclwiO1xuaW1wb3J0IHsgU0VMRUNUT1JTLCBDTEFTU0VTLCBTVE9SQUdFX0tFWVMgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5cbmNsYXNzIFNldHRpbmdzIHtcbiAgICBwcml2YXRlIHN0YXRpYyBsb2dnZXIgPSBnZXRMb2dnZXIoXCJTZXR0aW5nc1wiKTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIG5ldyBzZWN0aW9uIHRvIHRoZSBzZXR0aW5ncyBwYW5lbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkU2VjdGlvbihzZWN0aW9uSWQ6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBIZWxwZXJzLndhaXRGb3JFbG0oU0VMRUNUT1JTLlNFQ1RJT05TX0NPTlRBSU5FUikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBBZGRpbmcgc2VjdGlvbjogJHtzZWN0aW9uSWR9IHdpdGggdGl0bGU6ICR7dGl0bGV9YCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5TRUNUSU9OU19DT05UQUlORVIpO1xuICAgICAgICAgICAgaWYgKCFzZXR0aW5nc1BhbmVsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuU0VDVElPTik7XG4gICAgICAgICAgICBjb25zdCBsYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5MQUJFTCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghc2VjdGlvbkVsZW1lbnQgfHwgIWxhYmVsRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBzZWN0aW9uQ2xhc3NOYW1lID0gc2VjdGlvbkVsZW1lbnQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgY29uc3QgdGl0bGVDbGFzc05hbWUgPSBsYWJlbEVsZW1lbnQuY2xhc3NOYW1lO1xuXG4gICAgICAgICAgICBjb25zdCBzZWN0aW9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHNlY3Rpb25Db250YWluZXIuY2xhc3NOYW1lID0gc2VjdGlvbkNsYXNzTmFtZTtcbiAgICAgICAgICAgIHNlY3Rpb25Db250YWluZXIuaWQgPSBzZWN0aW9uSWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBzZWN0aW9uVGl0bGUuY2xhc3NOYW1lID0gdGl0bGVDbGFzc05hbWU7XG4gICAgICAgICAgICBzZWN0aW9uVGl0bGUudGV4dENvbnRlbnQgPSB0aXRsZTtcblxuICAgICAgICAgICAgc2VjdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uVGl0bGUpO1xuICAgICAgICAgICAgc2V0dGluZ3NQYW5lbC5hcHBlbmRDaGlsZChzZWN0aW9uQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gQWRkIHNlY3Rpb24gdG8gbmF2XG4gICAgICAgICAgICBIZWxwZXJzLndhaXRGb3JFbG0oU0VMRUNUT1JTLk5BVl9NRU5VKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5OQVZfTUVOVSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hvcnRjdXRzTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW3RpdGxlPVwiU2hvcnRjdXRzXCJdJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW5hdiB8fCAhc2hvcnRjdXRzTmF2KSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2VjdGlvbj1cIiR7c2VjdGlvbklkfVwiXWApKSByZXR1cm47IC8vIE5hdiBpdGVtIGFscmVhZHkgZXhpc3RzXG5cbiAgICAgICAgICAgICAgICBjb25zdCBlbmhhbmNlZE5hdkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgZW5oYW5jZWROYXZDb250YWluZXIuaW5uZXJIVE1MID0gZ2V0RW5oYW5jZWROYXYoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBuYXYuaW5zZXJ0QmVmb3JlKGVuaGFuY2VkTmF2Q29udGFpbmVyLCBzaG9ydGN1dHNOYXYubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHRoaXMubG9nZ2VyLmVycm9yKGBGYWlsZWQgdG8gYWRkIG5hdjogJHtlcnJ9YCkpO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgc2VjdGlvbjogJHtlcnJ9YCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNhdGVnb3J5IHdpdGhpbiBhIHNlY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFkZENhdGVnb3J5KHRpdGxlOiBzdHJpbmcsIHNlY3Rpb25JZDogc3RyaW5nLCBpY29uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgSGVscGVycy53YWl0Rm9yRWxtKFNFTEVDVE9SUy5TRUNUSU9OU19DT05UQUlORVIpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuaW5mbyhgQWRkaW5nIGNhdGVnb3J5OiAke3RpdGxlfSB0byBzZWN0aW9uOiAke3NlY3Rpb25JZH1gKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuQ0FURUdPUlkpO1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlUaXRsZUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5DQVRFR09SWV9MQUJFTCk7XG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yeUljb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuQ0FURUdPUllfSUNPTik7XG5cbiAgICAgICAgICAgIGlmICghY2F0ZWdvcnlFbGVtZW50IHx8ICFjYXRlZ29yeVRpdGxlRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yeUNsYXNzID0gY2F0ZWdvcnlFbGVtZW50LmNsYXNzTmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGNhdGVnb3J5VGl0bGVDbGFzcyA9IGNhdGVnb3J5VGl0bGVFbGVtZW50LmNsYXNzTmFtZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNhdGVnb3J5SWNvbkNsYXNzID0gJyc7XG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnlJY29uRWxlbWVudCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBjYXRlZ29yeUljb25DbGFzcyA9IGNhdGVnb3J5SWNvbkVsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNhdGVnb3J5SWNvbkVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBjYXRlZ29yeUljb25DbGFzcyA9IGNhdGVnb3J5SWNvbkVsZW1lbnQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpY29uID0gaWNvbi5yZXBsYWNlKGBjbGFzcz1cImljb25cImAsIGBjbGFzcz1cIiR7Y2F0ZWdvcnlJY29uQ2xhc3N9XCJgKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlY3Rpb25JZCk7XG4gICAgICAgICAgICBpZiAoIXNlY3Rpb24pIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgY2F0ZWdvcnlEaXYuY2xhc3NOYW1lID0gY2F0ZWdvcnlDbGFzcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdGl0bGVEaXYuY2xhc3NOYW1lID0gY2F0ZWdvcnlUaXRsZUNsYXNzO1xuICAgICAgICAgICAgdGl0bGVEaXYuaW5uZXJIVE1MID0gdGl0bGU7XG5cbiAgICAgICAgICAgIGNvbnN0IGhlYWRpbmdEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgaGVhZGluZ0Rpdi5jbGFzc0xpc3QuYWRkKFNFTEVDVE9SUy5DQVRFR09SWV9IRUFESU5HLnJlcGxhY2UoJy4nLCAnJykpO1xuICAgICAgICAgICAgaGVhZGluZ0Rpdi5pbm5lckhUTUwgKz0gaWNvbjtcbiAgICAgICAgICAgIGhlYWRpbmdEaXYuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXRlZ29yeURpdi5hcHBlbmRDaGlsZChoZWFkaW5nRGl2KTtcbiAgICAgICAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoY2F0ZWdvcnlEaXYpO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgY2F0ZWdvcnk6ICR7ZXJyfWApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBidXR0b24gdG8gdGhlIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRCdXR0b24odGl0bGU6IHN0cmluZywgaWQ6IHN0cmluZywgcXVlcnk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBIZWxwZXJzLndhaXRGb3JFbG0ocXVlcnkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnkpO1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBvcHRpb25EaXYuY2xhc3NMaXN0LmFkZChDTEFTU0VTLk9QVElPTik7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgY29udGVudERpdi5jbGFzc0xpc3QuYWRkKENMQVNTRVMuQ09OVEVOVCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBidXR0b25EaXYuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAgICAgYnV0dG9uRGl2LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIHRpdGxlKTtcbiAgICAgICAgICAgIGJ1dHRvbkRpdi5jbGFzc0xpc3QuYWRkKENMQVNTRVMuQlVUVE9OLCBDTEFTU0VTLkJVVFRPTl9DT05UQUlORVIsIFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgYnV0dG9uRGl2LmlkID0gaWQ7XG4gICAgICAgICAgICBidXR0b25EaXYudGV4dENvbnRlbnQgPSB0aXRsZTtcblxuICAgICAgICAgICAgY29udGVudERpdi5hcHBlbmRDaGlsZChidXR0b25EaXYpO1xuICAgICAgICAgICAgb3B0aW9uRGl2LmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvcHRpb25EaXYpO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgYnV0dG9uOiAke2Vycn1gKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgdGhlbWUgb3IgcGx1Z2luIGl0ZW0gdG8gdGhlIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGRJdGVtKHR5cGU6IFwidGhlbWVcIiB8IFwicGx1Z2luXCIsIGZpbGVOYW1lOiBzdHJpbmcsIG1ldGFEYXRhOiBNZXRhRGF0YSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBBZGRpbmcgJHt0eXBlfTogJHtmaWxlTmFtZX1gKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0eXBlID09PSBcInRoZW1lXCIpIHtcbiAgICAgICAgICAgIEhlbHBlcnMud2FpdEZvckVsbShTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRoZW1lKGZpbGVOYW1lLCBtZXRhRGF0YSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgdGhlbWU6ICR7ZXJyfWApKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcInBsdWdpblwiKSB7XG4gICAgICAgICAgICBIZWxwZXJzLndhaXRGb3JFbG0oU0VMRUNUT1JTLlBMVUdJTlNfQ0FURUdPUlkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGx1Z2luKGZpbGVOYW1lLCBtZXRhRGF0YSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gdGhpcy5sb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBhZGQgcGx1Z2luOiAke2Vycn1gKSk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGFkZFBsdWdpbihmaWxlTmFtZTogc3RyaW5nLCBtZXRhRGF0YTogTWV0YURhdGEpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZW5hYmxlZFBsdWdpbnM6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5FTkFCTEVEX1BMVUdJTlMpIHx8IFwiW11cIlxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBsdWdpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHBsdWdpbkNvbnRhaW5lci5pbm5lckhUTUwgPSBnZXRQbHVnaW5JdGVtVGVtcGxhdGUoZmlsZU5hbWUsIG1ldGFEYXRhLCBlbmFibGVkUGx1Z2lucy5pbmNsdWRlcyhmaWxlTmFtZSkpO1xuICAgICAgICBwbHVnaW5Db250YWluZXIuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBgJHtmaWxlTmFtZX0tYm94YCk7XG5cbiAgICAgICAgY29uc3QgcGx1Z2luc0NhdGVnb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuUExVR0lOU19DQVRFR09SWSk7XG4gICAgICAgIHBsdWdpbnNDYXRlZ29yeT8uYXBwZW5kQ2hpbGQocGx1Z2luQ29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIE1vZE1hbmFnZXIuY2hlY2tGb3JJdGVtVXBkYXRlcyhmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWRkVGhlbWUoZmlsZU5hbWU6IHN0cmluZywgbWV0YURhdGE6IE1ldGFEYXRhKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZUy5DVVJSRU5UX1RIRU1FKTtcblxuICAgICAgICBjb25zdCB0aGVtZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoZW1lQ29udGFpbmVyLmlubmVySFRNTCA9IGdldFRoZW1lSXRlbVRlbXBsYXRlKGZpbGVOYW1lLCBtZXRhRGF0YSwgY3VycmVudFRoZW1lID09PSBmaWxlTmFtZSk7XG4gICAgICAgIHRoZW1lQ29udGFpbmVyLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgYCR7ZmlsZU5hbWV9LWJveGApO1xuXG4gICAgICAgIGNvbnN0IHRoZW1lc0NhdGVnb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuVEhFTUVTX0NBVEVHT1JZKTtcbiAgICAgICAgdGhlbWVzQ2F0ZWdvcnk/LmFwcGVuZENoaWxkKHRoZW1lQ29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIE1vZE1hbmFnZXIuY2hlY2tGb3JJdGVtVXBkYXRlcyhmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgc2V0dGluZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUl0ZW0oZmlsZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoYCR7ZmlsZU5hbWV9LWJveGApWzBdO1xuICAgICAgICBlbGVtZW50Py5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBuYXZpZ2F0aW9uIGVsZW1lbnQgYXMgYWN0aXZlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhY3RpdmVTZWN0aW9uKGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgLy8gUmVtb3ZlIHNlbGVjdGVkIGNsYXNzIGZyb20gYWxsIG5hdiBpdGVtc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbmF2SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7U0VMRUNUT1JTLk5BVl9NRU5VfSA+IGRpdjpudGgtY2hpbGQoJHtpfSlgKTtcbiAgICAgICAgICAgIG5hdkl0ZW0/LmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NFUy5TRUxFQ1RFRCk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQ0xBU1NFUy5TRUxFQ1RFRCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5ncztcbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vZHNUYWJUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBUZW1wbGF0ZUNhY2hlLmxvYWQoX19kaXJuYW1lLCAnbW9kcy10YWInKTtcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuaW50ZXJmYWNlIE1vZE1ldGFEYXRhIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICBhdXRob3I6IHN0cmluZztcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgcHJldmlldz86IHN0cmluZztcbiAgICBkb3dubG9hZDogc3RyaW5nO1xuICAgIHJlcG86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vZEl0ZW1UZW1wbGF0ZShcbiAgICBtZXRhRGF0YTogTW9kTWV0YURhdGEsXG4gICAgdHlwZTogXCJQbHVnaW5cIiB8IFwiVGhlbWVcIiwgXG4gICAgaW5zdGFsbGVkOiBib29sZWFuXG4pOiBzdHJpbmcge1xuICAgIGxldCB0ZW1wbGF0ZSA9IFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICdtb2RzLWl0ZW0nKTtcbiAgICBcbiAgICAvLyBHZW5lcmF0ZSBsb2dvIGJsb2NrIGJhc2VkIG9uIHR5cGVcbiAgICBsZXQgbG9nb0Jsb2NrID0gXCJcIjtcblxuICAgIGlmKHR5cGUgPT09IFwiVGhlbWVcIikge1xuICAgICAgICBpZighbWV0YURhdGEucHJldmlldykge1xuICAgICAgICAgICAgLy8gSWYgbm8gcHJldmlldyBpcyBwcm92aWRlZCBmb3IgdGhlbWUsIHVzZSBhIHBsYWNlaG9sZGVyXG4gICAgICAgICAgICBsb2dvQmxvY2sgPSBgXG4gICAgICAgIDxzdmcgY2xhc3M9XCJpY29uLUd4VmJZXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk00IDNoMTZhMSAxIDAgMCAxIDEgMXY1YTEgMSAwIDAgMS0xIDFINGExIDEgMCAwIDEtMS0xVjRhMSAxIDAgMCAxIDEtMXptMiA5aDZhMSAxIDAgMCAxIDEgMXYzaDF2NmgtNHYtNmgxdi0ySDVhMSAxIDAgMCAxLTEtMXYtMmgydjF6bTExLjczMiAxLjczMmwxLjc2OC0xLjc2OCAxLjc2OCAxLjc2OGEyLjUgMi41IDAgMSAxLTMuNTM2IDB6XCIgc3R5bGU9XCJmaWxsOiBjdXJyZW50Y29sb3I7XCI+PC9wYXRoPlxuICAgICAgICA8L3N2Zz5gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVXNlIHRoZSBwcmV2aWV3IGltYWdlIGZvciB0aGVtZSBsb2dvXG4gICAgICAgICAgICBsb2dvQmxvY2sgPSBgXG4gICAgICAgICAgICA8YSBocmVmPVwiJHttZXRhRGF0YS5wcmV2aWV3fVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vcmVmZXJyZXJcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibG9nby1XcnNHRlwiIHNyYz1cIiR7bWV0YURhdGEucHJldmlld31cIiBhbHQ9XCJUaGVtZSBQcmV2aWV3XCIgbG9hZGluZz1cImxhenlcIj5cbiAgICAgICAgICAgIDwvYT5gO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbG9nb0Jsb2NrID0gYFxuICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvbi1HeFZiWVwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0zNDUuNjUwMDAwMDAwMDAwMSA0NTYuMzAwMDAwMDAwMDAwMmgtNzAuODdjLTIuMzUgMC4wMS00LjY5LTAuNDMtNi44Ni0xLjI5LTIuMTgtMC44Ny00LjE1LTIuMTQtNS43OS0zLjc1LTMuMzctMy4xOS01LjI3LTcuNTQtNS4yOS0xMi4wN3YtMjYuMzNjMC4wMy00LjA1LTAuODEtOC4wNy0yLjQ5LTExLjc5cy00LjEyLTcuMDctNy4xNy05Ljg5Yy03Ljc4LTcuMjItMTkuMDQtMTEuMjItMzAuOC0xMC45My0yMS4zMyAwLjQ3LTM5LjI3IDE4LjM1LTM5LjI3IDM5LjA3djE5Ljg3YzAuMDEgMi4yNC0wLjQ1IDQuNDgtMS4zNiA2LjU1cy0yLjI0IDMuOTUtMy45MyA1LjUyYy0zLjM1IDMuMjEtNy45IDUuMDItMTIuNjUgNS4wNGgtNzAuMTdjLTE0LjcxIDAuMDEtMjguODMtNS41NS0zOS4yMy0xNS40Ni0xMC40Mi05LjkxLTE2LjI4LTIzLjM2LTE2LjI5LTM3LjR2LTY2LjkyYzAuMDMtNC41MyAxLjkyLTguODcgNS4yOC0xMi4wNyAzLjM2LTMuMjEgNy45MS01LjAxIDEyLjY2LTUuMDRoMjcuNjFjOS4xNyAwIDE4LjA0LTMuNzEgMjUuMDItMTAuNDYgMy44OS0zLjcyIDYuOTgtOC4xNSA5LjA3LTEzLjAyYTM3LjIgMzcuMiAwIDAgMCAzLjA5LTE1LjRjLTAuMy0yMC4xNS0xNy42NC0zNy4xNy0zNy45OC0zNy4xN2gtMjYuNzFjLTIuMzUgMC4wMS00LjY5LTAuNDMtNi44Ny0xLjI5YTE3LjcgMTcuNyAwIDAgMS01Ljc5LTMuNzVjLTMuMzctMy4xOS01LjI2LTcuNTQtNS4yOC0xMi4wN3YtNjYuOTJhNTAuOSA1MC45IDAgMCAxIDQuMTktMjAuMjVjMi43Ni02LjQzIDYuODYtMTIuMjUgMTIuMDYtMTcuMTEgMTAuMzktOS45MSAyNC40OC0xNS40OCAzOS4xNy0xNS41aDU1LjAyYzIuMTIgMC4wMSA0LjE2LTAuNzcgNS42OC0yLjE5IDAuNzMtMC43MSAxLjMyLTEuNTUgMS43MS0yLjQ5IDAuNC0wLjkzIDAuNi0xLjkyIDAuNTgtMi45MnYtNi4xOGE1OSA1OSAwIDAgMSA1LjA4LTI0LjA1YzMuMzgtNy42MiA4LjI5LTE0LjUzIDE0LjQ2LTIwLjM1IDYuMTktNS44IDEzLjU1LTEwLjM2IDIxLjYyLTEzLjRhNjkuOCA2OS44IDAgMCAxIDI1LjMyLTQuNDdjMzUuMzggMC41NyA2NC4xOSAyOC45IDY0LjE5IDYzLjAzdjUuNDJjLTAuMDMgMS41MSAwLjQyIDMgMS4yOSA0LjI1YTcuNzMgNy43MyAwIDAgMCAzLjYxIDIuODFjMC45OCAwLjM3IDIuMDMgMC41NiAzLjA3IDAuNTRoNTUuMDJhNTYuNCA1Ni40IDAgMCAxIDIwLjkzIDMuOTljMTMuNCA1LjMxIDI0LjA0IDE1LjQ2IDI5LjYgMjguMjQgMi43NyA2LjMyIDQuMiAxMy4xMSA0LjE5IDE5Ljk2djUyLjQ3Yy0wLjAzIDEuNTIgMC40MiAzLjAxIDEuMyA0LjI2YTcuNjYgNy42NiAwIDAgMCAzLjYgMi44MWMwLjk4IDAuMzcgMi4wMyAwLjU2IDMuMDcgMC41NGg1LjY4YzM2LjQ4IDAgNjYuMDkgMjcuNTcgNjYuMDkgNjEuNDEgMCAzNC43OS0yOS4zMSA2My4xMi02NS4yOSA2My4xMmgtNi40OGMtMi4xMi0wLjAxLTQuMTUgMC43OC01LjY4IDIuMTlhNy40IDcuNCAwIDAgMC0xLjcxIDIuNDljLTAuNCAwLjkzLTAuNiAxLjkzLTAuNTggMi45M3Y1My4yM2MwLjAxIDYuODUtMS40MiAxMy42NC00LjE5IDE5Ljk2LTUuNTYgMTIuNzgtMTYuMiAyMi45My0yOS42IDI4LjI0YTU2IDU2IDAgMCAxLTIwLjkzIDMuOTlcIiBzdHlsZT1cImZpbGw6IGN1cnJlbnRjb2xvcjtcIj48L3BhdGg+XG4gICAgICAgIDwvc3ZnPmBcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIG1ldGFkYXRhIHBsYWNlaG9sZGVyc1xuICAgIGNvbnN0IG1ldGFLZXlzID0gWyduYW1lJywgJ2Rlc2NyaXB0aW9uJywgJ2F1dGhvcicsICd2ZXJzaW9uJ10gYXMgY29uc3Q7XG4gICAgbWV0YUtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYHt7XFxcXHMqJHtrZXl9XFxcXHMqfX1gLCAnZycpO1xuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UocmVnZXgsIG1ldGFEYXRhW2tleV0gfHwgJycpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIC5yZXBsYWNlKC9cXHtcXHtcXHMqdHlwZVxccypcXH1cXH0vZywgdHlwZSlcbiAgICAgICAgLnJlcGxhY2UoL1xce1xce1xccyphY3Rpb25idG5UaXRsZVxccypcXH1cXH0vZywgaW5zdGFsbGVkID8gXCJVbmluc3RhbGxcIiA6IFwiSW5zdGFsbFwiKVxuICAgICAgICAucmVwbGFjZShcInt7IGFjdGlvbmJ0bkNsYXNzIH19XCIsIGluc3RhbGxlZCA/IFwidW5pbnN0YWxsLWJ1dHRvbi1jb250YWluZXItb1Y0WW9cIiA6IFwiaW5zdGFsbC1idXR0b24tY29udGFpbmVyLXlmY3E1XCIpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgZG93bmxvYWQgfX1cIiwgbWV0YURhdGEuZG93bmxvYWQpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgcmVwbyB9fVwiLCBtZXRhRGF0YS5yZXBvKVxuICAgICAgICAucmVwbGFjZShcIjwhLS0gdGhlbWUgcHJldmlldyBoZXJlIC0tPlwiLCBsb2dvQmxvY2spXG4gICAgICAgIC5yZXBsYWNlKFwiPCEtLSBwbHVnaW4gaWNvbiBoZXJlIC0tPlwiLCBcIlwiKTsgXG59XG4iLCAiaW1wb3J0IFRlbXBsYXRlQ2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvdGVtcGxhdGVDYWNoZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBYm91dENhdGVnb3J5VGVtcGxhdGUoXG4gICAgdmVyc2lvbjogc3RyaW5nLCBcbiAgICBjaGVja0ZvclVwZGF0ZXNPblN0YXJ0dXA6IGJvb2xlYW4sIFxuICAgIGRpc2NvcmRSaWNoUHJlc2VuY2U6IGJvb2xlYW4sIFxuICAgIGVuYWJsZVRyYW5zcGFyZW50VGhlbWVzOiBib29sZWFuXG4pOiBzdHJpbmcge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ2Fib3V0LWNhdGVnb3J5Jyk7XG4gICAgXG4gICAgcmV0dXJuIHRlbXBsYXRlXG4gICAgICAgIC5yZXBsYWNlKFwie3sgdmVyc2lvbiB9fVwiLCB2ZXJzaW9uKVxuICAgICAgICAucmVwbGFjZShcInt7IGNoZWNrRm9yVXBkYXRlc09uU3RhcnR1cCB9fVwiLCBjaGVja0ZvclVwZGF0ZXNPblN0YXJ0dXAgPyBcImNoZWNrZWRcIiA6IFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKFwie3sgZGlzY29yZHJpY2hwcmVzZW5jZSB9fVwiLCBkaXNjb3JkUmljaFByZXNlbmNlID8gXCJjaGVja2VkXCIgOiBcIlwiKVxuICAgICAgICAucmVwbGFjZShcInt7IGVuYWJsZVRyYW5zcGFyZW50VGhlbWVzIH19XCIsIGVuYWJsZVRyYW5zcGFyZW50VGhlbWVzID8gXCJjaGVja2VkXCIgOiBcIlwiKTtcbn1cbiIsICJpbXBvcnQgVGVtcGxhdGVDYWNoZSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZUNhY2hlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRUaGVtZVRlbXBsYXRlKGFwcGxpZWQ6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGVDYWNoZS5sb2FkKF9fZGlybmFtZSwgJ2RlZmF1bHQtdGhlbWUnKTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZVxuICAgICAgICAucmVwbGFjZShcInt7IGRpc2FibGVkIH19XCIsIGFwcGxpZWQgPyBcImRpc2FibGVkXCIgOiBcIlwiKVxuICAgICAgICAucmVwbGFjZShcInt7IGxhYmVsIH19XCIsIGFwcGxpZWQgPyBcIkFwcGxpZWRcIiA6IFwiQXBwbHlcIilcbiAgICAgICAgLnJlcGxhY2UoXCJ7eyBiYWNrZ3JvdW5kQ29sb3IgfX1cIiwgYXBwbGllZCA/IFwidmFyKC0tb3ZlcmxheS1jb2xvcilcIiA6IFwidmFyKC0tc2Vjb25kYXJ5LWFjY2VudC1jb2xvcilcIik7XG59XG4iLCAiaW1wb3J0IFRlbXBsYXRlQ2FjaGUgZnJvbSAnLi4vLi4vdXRpbHMvdGVtcGxhdGVDYWNoZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYWNrQnV0dG9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFRlbXBsYXRlQ2FjaGUubG9hZChfX2Rpcm5hbWUsICdiYWNrLWJ0bicpO1xufVxuIiwgImltcG9ydCB7IFBsYXRmb3JtTWFuYWdlciB9IGZyb20gXCIuLi9wbGF0Zm9ybS9QbGF0Zm9ybU1hbmFnZXJcIjtcbmltcG9ydCB7IENhcGFjaXRvclBsYXRmb3JtIH0gZnJvbSBcIi4uL3BsYXRmb3JtL0NhcGFjaXRvclBsYXRmb3JtXCI7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSBcIi4uL2NvcmUvU2V0dGluZ3NcIjtcbmltcG9ydCBwcm9wZXJ0aWVzIGZyb20gXCIuLi9jb3JlL1Byb3BlcnRpZXNcIjtcbmltcG9ydCBNb2RNYW5hZ2VyIGZyb20gXCIuLi9jb3JlL01vZE1hbmFnZXJcIjtcbmltcG9ydCBIZWxwZXJzIGZyb20gXCIuLi91dGlscy9IZWxwZXJzXCI7XG5pbXBvcnQgeyBnZXRNb2RzVGFiVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tb2RzLXRhYi9tb2RzVGFiXCI7XG5pbXBvcnQgeyBnZXRNb2RJdGVtVGVtcGxhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tb2RzLWl0ZW0vbW9kc0l0ZW1cIjtcbmltcG9ydCB7IGdldEFib3V0Q2F0ZWdvcnlUZW1wbGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL2Fib3V0LWNhdGVnb3J5L2Fib3V0Q2F0ZWdvcnlcIjtcbmltcG9ydCB7IGdldERlZmF1bHRUaGVtZVRlbXBsYXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvZGVmYXVsdC10aGVtZS9kZWZhdWx0VGhlbWVcIjtcbmltcG9ydCB7IGdldEJhY2tCdXR0b24gfSBmcm9tIFwiLi4vY29tcG9uZW50cy9iYWNrLWJ0bi9iYWNrQnRuXCI7XG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuLi91dGlscy9sb2dnZXJcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgXG4gICAgU1RPUkFHRV9LRVlTLCBcbiAgICBTRUxFQ1RPUlMsIFxuICAgIENMQVNTRVMsIFxuICAgIEZJTEVfRVhURU5TSU9OUyxcbn0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IEV4dHJhY3RNZXRhRGF0YSBmcm9tIFwiLi4vdXRpbHMvRXh0cmFjdE1ldGFEYXRhXCI7XG5cbi8vIEluaXRpYWxpemUgcGxhdGZvcm0gZm9yIENhcGFjaXRvclxuUGxhdGZvcm1NYW5hZ2VyLnNldFBsYXRmb3JtKG5ldyBDYXBhY2l0b3JQbGF0Zm9ybSgpKTtcblxuLy8gTW9jayBpcGNSZW5kZXJlciBmb3IgQW5kcm9pZFxuY29uc3QgaXBjUmVuZGVyZXIgPSB7XG4gICAgaW52b2tlOiBhc3luYyAoY2hhbm5lbDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhgW0FuZHJvaWRdIEludm9rZSAke2NoYW5uZWx9YCwgYXJncyk7XG4gICAgICAgIGlmIChjaGFubmVsID09PSAnZ2V0LXRyYW5zcGFyZW5jeS1zdGF0dXMnKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChjaGFubmVsID09PSAnZXh0cmFjdC1lbWJlZGRlZC1zdWJ0aXRsZXMnKSByZXR1cm4gW107XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgc2VuZDogKGNoYW5uZWw6IHN0cmluZywgLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oYFtBbmRyb2lkXSBTZW5kICR7Y2hhbm5lbH1gLCBhcmdzKTtcbiAgICB9LFxuICAgIG9uOiAoY2hhbm5lbDogc3RyaW5nLCBsaXN0ZW5lcjogYW55KSA9PiB7XG4gICAgICAgIC8vIE5vLW9wXG4gICAgfVxufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgICAvLyBJbml0aWFsaXplIHBsYXRmb3JtXG4gICAgaWYgKCFQbGF0Zm9ybU1hbmFnZXIuY3VycmVudCkgUGxhdGZvcm1NYW5hZ2VyLnNldFBsYXRmb3JtKG5ldyBDYXBhY2l0b3JQbGF0Zm9ybSgpKTtcbiAgICBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5pbml0KCk7XG5cbiAgICAvLyBFeHBvc2UgQVBJIGZvciBpbmplY3RlZCBzY3JpcHRzXG4gICAgKHdpbmRvdyBhcyBhbnkpLnN0cmVtaW9FbmhhbmNlZCA9IHtcbiAgICAgICAgYXBwbHlUaGVtZTogYXN5bmMgKHRoZW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIC8vIGFwcGx5VXNlclRoZW1lIHJlYWRzIGZyb20gbG9jYWxTdG9yYWdlIHdoaWNoIGlzIHVwZGF0ZWQgYnkgdGhlIGluamVjdGVkIHNjcmlwdFxuICAgICAgICAgICAgYXdhaXQgYXBwbHlVc2VyVGhlbWUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpbml0aWFsaXplVXNlclNldHRpbmdzKCk7XG4gICAgXG4gICAgLy8gQXBwbHkgZW5hYmxlZCB0aGVtZVxuICAgIGF3YWl0IGFwcGx5VXNlclRoZW1lKCk7XG4gICAgXG4gICAgLy8gTG9hZCBlbmFibGVkIHBsdWdpbnNcbiAgICBhd2FpdCBsb2FkRW5hYmxlZFBsdWdpbnMoKTtcbiAgICBcbiAgICAvLyBIYW5kbGUgbmF2aWdhdGlvbiBjaGFuZ2VzXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJoYXNoY2hhbmdlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgY2hlY2tTZXR0aW5ncygpO1xuICAgIH0pO1xufSk7XG5cbi8vIFNldHRpbmdzIHBhZ2Ugb3BlbmVkXG5hc3luYyBmdW5jdGlvbiBjaGVja1NldHRpbmdzKCkge1xuICAgIGlmICghbG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIiMvc2V0dGluZ3NcIikpIHJldHVybjtcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgYVtocmVmPVwiI3NldHRpbmdzLWVuaGFuY2VkXCJdYCkpIHJldHVybjtcbiAgICBcbiAgICBNb2RNYW5hZ2VyLmFkZEFwcGx5VGhlbWVGdW5jdGlvbigpO1xuICAgIFxuICAgIGNvbnN0IHRoZW1lc1BhdGggPSBwcm9wZXJ0aWVzLnRoZW1lc1BhdGg7XG4gICAgY29uc3QgcGx1Z2luc1BhdGggPSBwcm9wZXJ0aWVzLnBsdWdpbnNQYXRoO1xuXG4gICAgbGV0IGFsbFRoZW1lczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgYWxsUGx1Z2luczogc3RyaW5nW10gPSBbXTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICBhbGxUaGVtZXMgPSBhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5yZWFkZGlyKHRoZW1lc1BhdGgpO1xuICAgICAgICBhbGxQbHVnaW5zID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZGRpcihwbHVnaW5zUGF0aCk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcihcIkZhaWxlZCB0byByZWFkIHRoZW1lcy9wbHVnaW5zIGRpcmVjdG9yaWVzOiBcIiArIGUpO1xuICAgIH1cblxuICAgIGNvbnN0IHRoZW1lc0xpc3QgPSBhbGxUaGVtZXMuZmlsdGVyKGZpbGVOYW1lID0+IGZpbGVOYW1lLmVuZHNXaXRoKEZJTEVfRVhURU5TSU9OUy5USEVNRSkpO1xuICAgIGNvbnN0IHBsdWdpbnNMaXN0ID0gYWxsUGx1Z2lucy5maWx0ZXIoZmlsZU5hbWUgPT4gZmlsZU5hbWUuZW5kc1dpdGgoRklMRV9FWFRFTlNJT05TLlBMVUdJTikpO1xuICAgIFxuICAgIGxvZ2dlci5pbmZvKFwiQWRkaW5nICdFbmhhbmNlZCcgc2VjdGlvbnMuLi5cIik7XG4gICAgU2V0dGluZ3MuYWRkU2VjdGlvbihcImVuaGFuY2VkXCIsIFwiRW5oYW5jZWRcIik7XG4gICAgU2V0dGluZ3MuYWRkQ2F0ZWdvcnkoXCJUaGVtZXNcIiwgXCJlbmhhbmNlZFwiLCBnZXRUaGVtZUljb24oKSk7XG4gICAgU2V0dGluZ3MuYWRkQ2F0ZWdvcnkoXCJQbHVnaW5zXCIsIFwiZW5oYW5jZWRcIiwgZ2V0UGx1Z2luSWNvbigpKTtcbiAgICBTZXR0aW5ncy5hZGRDYXRlZ29yeShcIkFib3V0XCIsIFwiZW5oYW5jZWRcIiwgZ2V0QWJvdXRJY29uKCkpO1xuICAgIFxuICAgIFNldHRpbmdzLmFkZEJ1dHRvbihcIk9wZW4gVGhlbWVzIEZvbGRlclwiLCBcIm9wZW50aGVtZXNmb2xkZXJCdG5cIiwgU0VMRUNUT1JTLlRIRU1FU19DQVRFR09SWSk7XG4gICAgU2V0dGluZ3MuYWRkQnV0dG9uKFwiT3BlbiBQbHVnaW5zIEZvbGRlclwiLCBcIm9wZW5wbHVnaW5zZm9sZGVyQnRuXCIsIFNFTEVDVE9SUy5QTFVHSU5TX0NBVEVHT1JZKTtcbiAgICBcbiAgICB3cml0ZUFib3V0KCk7XG4gICAgXG4gICAgLy8gQnJvd3NlIHBsdWdpbnMvdGhlbWVzIGZyb20gc3RyZW1pby1lbmhhbmNlZC1yZWdpc3RyeVxuICAgIHNldHVwQnJvd3NlTW9kc0J1dHRvbigpO1xuICAgIFxuICAgIC8vIEFkZCB0aGVtZXMgdG8gc2V0dGluZ3NcbiAgICBIZWxwZXJzLndhaXRGb3JFbG0oU0VMRUNUT1JTLlRIRU1FU19DQVRFR09SWSkudGhlbihhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIERlZmF1bHQgdGhlbWVcbiAgICAgICAgY29uc3QgaXNDdXJyZW50VGhlbWVEZWZhdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkNVUlJFTlRfVEhFTUUpID09PSBcIkRlZmF1bHRcIjtcbiAgICAgICAgY29uc3QgZGVmYXVsdFRoZW1lQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGVmYXVsdFRoZW1lQ29udGFpbmVyLmlubmVySFRNTCA9IGdldERlZmF1bHRUaGVtZVRlbXBsYXRlKGlzQ3VycmVudFRoZW1lRGVmYXVsdCk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlRIRU1FU19DQVRFR09SWSk/LmFwcGVuZENoaWxkKGRlZmF1bHRUaGVtZUNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICAvLyBBZGQgaW5zdGFsbGVkIHRoZW1lc1xuICAgICAgICBmb3IgKGNvbnN0IHRoZW1lIG9mIHRoZW1lc0xpc3QpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhlbWVQYXRoID0gam9pbih0aGVtZXNQYXRoLCB0aGVtZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRGaWxlKHRoZW1lUGF0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0YURhdGEgPSBFeHRyYWN0TWV0YURhdGEuZXh0cmFjdE1ldGFkYXRhRnJvbVRleHQoY29udGVudCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG1ldGFEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRhRGF0YS5uYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwiZGVmYXVsdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTZXR0aW5ncy5hZGRJdGVtKFwidGhlbWVcIiwgdGhlbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBtZXRhRGF0YS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhRGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3I6IG1ldGFEYXRhLmF1dGhvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBtZXRhRGF0YS52ZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVVybDogbWV0YURhdGEudXBkYXRlVXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbWV0YURhdGEuc291cmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEZhaWxlZCB0byBsb2FkIHRoZW1lIG1ldGFkYXRhIGZvciAke3RoZW1lfTogJHtlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkuY2F0Y2goZXJyID0+IGxvZ2dlci5lcnJvcihcIkZhaWxlZCB0byBzZXR1cCB0aGVtZXM6IFwiICsgZXJyKSk7XG4gICAgXG4gICAgLy8gQWRkIHBsdWdpbnMgdG8gc2V0dGluZ3NcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBwbHVnaW5zTGlzdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGx1Z2luUGF0aCA9IGpvaW4ocGx1Z2luc1BhdGgsIHBsdWdpbik7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZEZpbGUocGx1Z2luUGF0aCk7XG4gICAgICAgICAgICBjb25zdCBtZXRhRGF0YSA9IEV4dHJhY3RNZXRhRGF0YS5leHRyYWN0TWV0YWRhdGFGcm9tVGV4dChjb250ZW50KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhKSB7XG4gICAgICAgICAgICAgICAgU2V0dGluZ3MuYWRkSXRlbShcInBsdWdpblwiLCBwbHVnaW4sIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbWV0YURhdGEubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGFEYXRhLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgICBhdXRob3I6IG1ldGFEYXRhLmF1dGhvcixcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogbWV0YURhdGEudmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVXJsOiBtZXRhRGF0YS51cGRhdGVVcmwsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbWV0YURhdGEuc291cmNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRmFpbGVkIHRvIGxvYWQgcGx1Z2luIG1ldGFkYXRhIGZvciAke3BsdWdpbn06ICR7ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBNb2RNYW5hZ2VyLnRvZ2dsZVBsdWdpbkxpc3RlbmVyKCk7XG4gICAgTW9kTWFuYWdlci5zY3JvbGxMaXN0ZW5lcigpO1xuICAgIC8vIE1vZE1hbmFnZXIub3BlblRoZW1lc0ZvbGRlcigpOyAvLyBVc2VzIHBsYXRmb3JtIG9wZW5QYXRoIHdoaWNoIGxvZ3Mgbm90IHN1cHBvcnRlZCBvbiBBbmRyb2lkXG4gICAgLy8gTW9kTWFuYWdlci5vcGVuUGx1Z2luc0ZvbGRlcigpO1xuICAgIFxuICAgIC8vIE92ZXJyaWRlIG9wZW4gZm9sZGVyIGJ1dHRvbnMgdG8gZG8gc29tZXRoaW5nIGVsc2Ugb3IganVzdCBsb2c/XG4gICAgLy8gTW9kTWFuYWdlci5vcGVuVGhlbWVzRm9sZGVyIHVzZXMgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQub3BlblBhdGhcbiAgICAvLyBJbiBDYXBhY2l0b3JQbGF0Zm9ybSwgaXQganVzdCBsb2dzLlxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplVXNlclNldHRpbmdzKCk6IHZvaWQge1xuICAgIGNvbnN0IGRlZmF1bHRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgICBbU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOU106IFwiW11cIixcbiAgICAgICAgW1NUT1JBR0VfS0VZUy5DSEVDS19VUERBVEVTX09OX1NUQVJUVVBdOiBcImZhbHNlXCIsXG4gICAgICAgIFtTVE9SQUdFX0tFWVMuRElTQ09SRF9SUENdOiBcImZhbHNlXCIsXG4gICAgfTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlZmF1bHRWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGVmYXVsdHMpKSB7XG4gICAgICAgIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBhcHBseVVzZXJUaGVtZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjdXJyZW50VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSk7XG4gICAgXG4gICAgaWYgKCFjdXJyZW50VGhlbWUgfHwgY3VycmVudFRoZW1lID09PSBcIkRlZmF1bHRcIikge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX0tFWVMuQ1VSUkVOVF9USEVNRSwgXCJEZWZhdWx0XCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHRoZW1lUGF0aCA9IGpvaW4ocHJvcGVydGllcy50aGVtZXNQYXRoLCBjdXJyZW50VGhlbWUpO1xuICAgIFxuICAgIC8vIEluIGNhcGFjaXRvciwgd2UgbmVlZCB0byByZWFkIHRoZSBmaWxlIGNvbnRlbnQgYW5kIGluamVjdCBpdCBhcyBzdHlsZVxuICAgIC8vIGJlY2F1c2UgZmlsZTovLyBVUkxzIG1pZ2h0IG5vdCB3b3JrIG9yIGFyZSByZXN0cmljdGVkLlxuICAgIC8vIEVsZWN0cm9uIGltcGxlbWVudGF0aW9uIHVzZXMgcGF0aFRvRmlsZVVSTCB3aGljaCByZXN1bHRzIGluIGZpbGU6Ly8uXG4gICAgLy8gTGV0J3MgdHJ5IHRvIHJlYWQgY29udGVudCBhbmQgaW5qZWN0IDxzdHlsZT4gaW5zdGVhZCBvZiA8bGluaz4uXG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKCFhd2FpdCBQbGF0Zm9ybU1hbmFnZXIuY3VycmVudC5leGlzdHModGhlbWVQYXRoKSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVlTLkNVUlJFTlRfVEhFTUUsIFwiRGVmYXVsdFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBleGlzdGluZyB0aGVtZSBpZiBwcmVzZW50XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWN0aXZlVGhlbWVcIik/LnJlbW92ZSgpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LnJlYWRGaWxlKHRoZW1lUGF0aCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJhY3RpdmVUaGVtZVwiKTtcbiAgICAgICAgc3R5bGVFbGVtZW50LnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIGFwcGx5IHRoZW1lOiBcIiArIGUpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZEVuYWJsZWRQbHVnaW5zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBsdWdpbnNQYXRoID0gcHJvcGVydGllcy5wbHVnaW5zUGF0aDtcbiAgICB0cnkge1xuICAgICAgICBpZiAoIWF3YWl0IFBsYXRmb3JtTWFuYWdlci5jdXJyZW50LmV4aXN0cyhwbHVnaW5zUGF0aCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBhbGxQbHVnaW5zID0gYXdhaXQgUGxhdGZvcm1NYW5hZ2VyLmN1cnJlbnQucmVhZGRpcihwbHVnaW5zUGF0aCk7XG4gICAgICAgIGNvbnN0IHBsdWdpbnNUb0xvYWQgPSBhbGxQbHVnaW5zLmZpbHRlcihmaWxlTmFtZSA9PiBmaWxlTmFtZS5lbmRzV2l0aChGSUxFX0VYVEVOU0lPTlMuUExVR0lOKSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBlbmFibGVkUGx1Z2luczogc3RyaW5nW10gPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVlTLkVOQUJMRURfUExVR0lOUykgfHwgXCJbXVwiXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBwbHVnaW5zVG9Mb2FkKSB7XG4gICAgICAgICAgICBpZiAoZW5hYmxlZFBsdWdpbnMuaW5jbHVkZXMocGx1Z2luKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IE1vZE1hbmFnZXIubG9hZFBsdWdpbihwbHVnaW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gbG9hZCBwbHVnaW5zOiBcIiArIGUpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gYnJvd3NlTW9kcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzZXR0aW5nc0NvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5TRVRUSU5HU19DT05URU5UKTtcbiAgICBpZiAoIXNldHRpbmdzQ29udGVudCkgcmV0dXJuO1xuICAgIFxuICAgIHNldHRpbmdzQ29udGVudC5pbm5lckhUTUwgPSBnZXRNb2RzVGFiVGVtcGxhdGUoKTtcbiAgICBcbiAgICBjb25zdCBtb2RzID0gYXdhaXQgTW9kTWFuYWdlci5mZXRjaE1vZHMoKTtcbiAgICBjb25zdCBtb2RzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kcy1saXN0XCIpO1xuICAgIGlmICghbW9kc0xpc3QpIHJldHVybjtcbiAgICBcbiAgICBpbnRlcmZhY2UgUmVnaXN0cnlNb2Qge1xuICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgICAgIGF1dGhvcjogc3RyaW5nO1xuICAgICAgICB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgICAgIHByZXZpZXc/OiBzdHJpbmc7XG4gICAgICAgIGRvd25sb2FkOiBzdHJpbmc7XG4gICAgICAgIHJlcG86IHN0cmluZztcbiAgICB9XG4gICAgXG4gICAgLy8gQWRkIHBsdWdpbnNcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiAobW9kcy5wbHVnaW5zIGFzIFJlZ2lzdHJ5TW9kW10pKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbGxlZCA9IGF3YWl0IE1vZE1hbmFnZXIuaXNQbHVnaW5JbnN0YWxsZWQoSGVscGVycy5nZXRGaWxlTmFtZUZyb21VcmwocGx1Z2luLmRvd25sb2FkKSk7XG4gICAgICAgIG1vZHNMaXN0LmlubmVySFRNTCArPSBnZXRNb2RJdGVtVGVtcGxhdGUocGx1Z2luLCBcIlBsdWdpblwiLCBpbnN0YWxsZWQpO1xuICAgIH1cbiAgICBcbiAgICAvLyBBZGQgdGhlbWVzXG4gICAgZm9yIChjb25zdCB0aGVtZSBvZiAobW9kcy50aGVtZXMgYXMgUmVnaXN0cnlNb2RbXSkpIHtcbiAgICAgICAgY29uc3QgaW5zdGFsbGVkID0gYXdhaXQgTW9kTWFuYWdlci5pc1RoZW1lSW5zdGFsbGVkKEhlbHBlcnMuZ2V0RmlsZU5hbWVGcm9tVXJsKHRoZW1lLmRvd25sb2FkKSk7XG4gICAgICAgIG1vZHNMaXN0LmlubmVySFRNTCArPSBnZXRNb2RJdGVtVGVtcGxhdGUodGhlbWUsIFwiVGhlbWVcIiwgaW5zdGFsbGVkKTtcbiAgICB9XG4gICAgXG4gICAgLy8gU2V0IHVwIGFjdGlvbiBidXR0b25zXG4gICAgY29uc3QgYWN0aW9uQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubW9kQWN0aW9uQnRuXCIpO1xuICAgIGFjdGlvbkJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluayA9IGJ0bi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWxpbmtcIik7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gYnRuLmdldEF0dHJpYnV0ZShcImRhdGEtdHlwZVwiKT8udG9Mb3dlckNhc2UoKSBhcyBcInBsdWdpblwiIHwgXCJ0aGVtZVwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWxpbmsgfHwgIXR5cGUpIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGJ0bi5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKSA9PT0gXCJJbnN0YWxsXCIpIHtcbiAgICAgICAgICAgICAgICBNb2RNYW5hZ2VyLmRvd25sb2FkTW9kKGxpbmssIHR5cGUpO1xuICAgICAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKENMQVNTRVMuSU5TVEFMTF9CVVRUT04pO1xuICAgICAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKENMQVNTRVMuVU5JTlNUQUxMX0JVVFRPTik7XG4gICAgICAgICAgICAgICAgYnRuLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIFwiVW5pbnN0YWxsXCIpO1xuICAgICAgICAgICAgICAgIGlmIChidG4uY2hpbGROb2Rlc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICBidG4uY2hpbGROb2Rlc1sxXS50ZXh0Q29udGVudCA9IFwiVW5pbnN0YWxsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBNb2RNYW5hZ2VyLnJlbW92ZU1vZChIZWxwZXJzLmdldEZpbGVOYW1lRnJvbVVybChsaW5rKSwgdHlwZSk7XG4gICAgICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoQ0xBU1NFUy5VTklOU1RBTExfQlVUVE9OKTtcbiAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChDTEFTU0VTLklOU1RBTExfQlVUVE9OKTtcbiAgICAgICAgICAgICAgICBidG4uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgXCJJbnN0YWxsXCIpO1xuICAgICAgICAgICAgICAgIGlmIChidG4uY2hpbGROb2Rlc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICBidG4uY2hpbGROb2Rlc1sxXS50ZXh0Q29udGVudCA9IFwiSW5zdGFsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gU2VhcmNoIGJhciBsb2dpY1xuICAgIHNldHVwU2VhcmNoQmFyKCk7XG4gICAgXG4gICAgLy8gQWRkIGJhY2sgYnV0dG9uXG4gICAgY29uc3QgaG9yaXpvbnRhbE5hdnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFNFTEVDVE9SUy5IT1JJWk9OVEFMX05BVik7XG4gICAgY29uc3QgaG9yaXpvbnRhbE5hdiA9IGhvcml6b250YWxOYXZzWzFdO1xuICAgIGlmIChob3Jpem9udGFsTmF2KSB7XG4gICAgICAgIGhvcml6b250YWxOYXYuaW5uZXJIVE1MID0gZ2V0QmFja0J1dHRvbigpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhY2stYnRuXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjLyc7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyMvc2V0dGluZ3MnO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0dXBTZWFyY2hCYXIoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5TRUFSQ0hfSU5QVVQpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgY29uc3QgYWRkb25zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuQURET05TX0xJU1RfQ09OVEFJTkVSKTtcbiAgICBcbiAgICBpZiAoIXNlYXJjaElucHV0IHx8ICFhZGRvbnNDb250YWluZXIpIHJldHVybjtcbiAgICBcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBzZWFyY2hJbnB1dC52YWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgbW9kSXRlbXMgPSBhZGRvbnNDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChTRUxFQ1RPUlMuQURET05fQ09OVEFJTkVSKTtcbiAgICAgICAgXG4gICAgICAgIG1vZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLk5BTUVfQ09OVEFJTkVSKT8udGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkgfHwgXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gaXRlbS5xdWVyeVNlbGVjdG9yKFNFTEVDVE9SUy5ERVNDUklQVElPTl9JVEVNKT8udGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkgfHwgXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoU0VMRUNUT1JTLlRZUEVTX0NPTlRBSU5FUik/LnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpIHx8IFwiXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gbmFtZS5pbmNsdWRlcyhmaWx0ZXIpIHx8IGRlc2NyaXB0aW9uLmluY2x1ZGVzKGZpbHRlcikgfHwgdHlwZS5pbmNsdWRlcyhmaWx0ZXIpO1xuICAgICAgICAgICAgKGl0ZW0gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBtYXRjaCA/IFwiXCIgOiBcIm5vbmVcIjtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldHVwQnJvd3NlTW9kc0J1dHRvbigpOiB2b2lkIHtcbiAgICBIZWxwZXJzLndhaXRGb3JFbG0oJyNicm93c2VQbHVnaW5zVGhlbWVzQnRuJykudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3NlUGx1Z2luc1RoZW1lc0J0blwiKTtcbiAgICAgICAgYnRuPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnJvd3NlTW9kcyk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5mdW5jdGlvbiB3cml0ZUFib3V0KCk6IHZvaWQge1xuICAgIEhlbHBlcnMud2FpdEZvckVsbShTRUxFQ1RPUlMuQUJPVVRfQ0FURUdPUlkpLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBhYm91dENhdGVnb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihTRUxFQ1RPUlMuQUJPVVRfQ0FURUdPUlkpO1xuICAgICAgICBpZiAoYWJvdXRDYXRlZ29yeSkge1xuICAgICAgICAgICAgLy8gSGFyZGNvZGVkIHZhbHVlcyBmb3IgQW5kcm9pZFxuICAgICAgICAgICAgYWJvdXRDYXRlZ29yeS5pbm5lckhUTUwgKz0gZ2V0QWJvdXRDYXRlZ29yeVRlbXBsYXRlKFxuICAgICAgICAgICAgICAgIFwiQW5kcm9pZC12MS4wLjBcIiwgXG4gICAgICAgICAgICAgICAgZmFsc2UsIFxuICAgICAgICAgICAgICAgIGZhbHNlLCBcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0pLmNhdGNoKGVyciA9PiBsb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gd3JpdGUgYWJvdXQgc2VjdGlvbjogXCIgKyBlcnIpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWJvdXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgY2xhc3M9XCJpY29uXCI+XG4gICAgICAgIDxnPjxwYXRoIGZpbGw9XCJub25lXCIgZD1cIk0wIDBoMjR2MjRIMHpcIj48L3BhdGg+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTIgMjJDNi40NzcgMjIgMiAxNy41MjMgMiAxMlM2LjQ3NyAyIDEyIDJzMTAgNC40NzcgMTAgMTAtNC40NzcgMTAtMTAgMTB6bS0xLTExdjZoMnYtNmgtMnptMC00djJoMlY3aC0yelwiIHN0eWxlPVwiZmlsbDpjdXJyZW50Y29sb3JcIj48L3BhdGg+PC9nPjwvc3ZnPmA7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1lSWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGNsYXNzPVwiaWNvblwiPlxuICAgICAgICA8Zz48cGF0aCBmaWxsPVwibm9uZVwiIGQ9XCJNMCAwaDI0djI0SDB6XCI+PC9wYXRoPlxuICAgICAgICA8cGF0aCBkPVwiTTQgM2gxNmExIDEgMCAwIDEgMSAxdjVhMSAxIDAgMCAxLTEgMUg0YTEgMSAwIDAgMS0xLTFWNGExIDEgMCAwIDEgMS0xem0yIDloNmExIDEgMCAwIDEgMSAxdjNoMXY2aC00di02aDF2LTJINWExIDEgMCAwIDEtMS0xdi0yaDJ2MXptMTEuNzMyIDEuNzMybDEuNzY4LTEuNzY4IDEuNzY4IDEuNzY4YTIuNSAyLjUgMCAxIDEtMy41MzYgMHpcIiBzdHlsZT1cImZpbGw6IGN1cnJlbnRjb2xvcjtcIj48L3BhdGg+PC9nPjwvc3ZnPmA7XG59XG5cbmZ1bmN0aW9uIGdldFBsdWdpbkljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDxzdmcgaWNvbj1cImFkZG9ucy1vdXRsaW5lXCIgY2xhc3M9XCJpY29uXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgc3R5bGU9XCJmaWxsOiBjdXJyZW50Y29sb3I7XCI+XG4gICAgICAgIDxwYXRoIGQ9XCJNNDEzLjcgMjQ2LjFIMzg2Yy0wLjUzLTAuMDEtMS4wMy0wLjIzLTEuNC0wLjYtMC4zNy0wLjM3LTAuNTktMC44Ny0wLjYtMS40di03Ny4yYTM4Ljk0IDM4Ljk0IDAgMCAwLTExLjQtMjcuNSAzOC45NCAzOC45NCAwIDAgMC0yNy41LTExLjRoLTc3LjJjLTAuNTMtMC4wMS0xLjAzLTAuMjMtMS40LTAuNi0wLjM3LTAuMzctMC41OS0wLjg3LTAuNi0xLjR2LTI3LjdjMC0yNy4xLTIxLjUtNDkuOS00OC42LTUwLjMtNi41Ny0wLjEtMTMuMDkgMS4wOS0xOS4yIDMuNWE0OS42MTYgNDkuNjE2IDAgMCAwLTE2LjQgMTAuNyA0OS44MjMgNDkuODIzIDAgMCAwLTExIDE2LjIgNDguODk0IDQ4Ljg5NCAwIDAgMC0zLjkgMTkuMnYyOC41Yy0wLjAxIDAuNTMtMC4yMyAxLjAzLTAuNiAxLjQtMC4zNyAwLjM3LTAuODcgMC41OS0xLjQgMC42aC03Ny4yYy0xMC41IDAtMjAuNTcgNC4xNy0yOCAxMS42YTM5LjU5NCAzOS41OTQgMCAwIDAtMTEuNiAyOHY3MC40YzAuMDEgMC41MyAwLjIzIDEuMDMgMC42IDEuNCAwLjM3IDAuMzcgMC44NyAwLjU5IDEuNCAwLjZoMjYuOWMyOS40IDAgNTMuNyAyNS41IDU0LjEgNTQuOCAwLjQgMjkuOS0yMy41IDU3LjItNTMuMyA1Ny4ySDUwYy0wLjUzIDAuMDEtMS4wMyAwLjIzLTEuNCAwLjYtMC4zNyAwLjM3LTAuNTkgMC44Ny0wLjYgMS40djcwLjRjMCAxMC41IDQuMTcgMjAuNTcgMTEuNiAyOHMxNy41IDExLjYgMjggMTEuNmg3MC40YzAuNTMtMC4wMSAxLjAzLTAuMjMgMS40LTAuNiAwLjM3LTAuMzcgMC41OS0wLjg3IDAuNi0xLjRWNDQxLjJjMC0zMC4zIDI0LjgtNTYuNCA1NS01Ny4xIDMwLjEtMC43IDU3IDIwLjMgNTcgNTAuM3YyNy43YzAuMDEgMC41MyAwLjIzIDEuMDMgMC42IDEuNCAwLjM3IDAuMzcgMC44NyAwLjU5IDEuNCAwLjZoNzEuMWEzOC45NCAzOC45NCAwIDAgMCAyNy41LTExLjQgMzguOTU4IDM4Ljk1OCAwIDAgMCAxMS40LTI3LjV2LTc4YzAuMDEtMC41MyAwLjIzLTEuMDMgMC42LTEuNCAwLjM3LTAuMzcgMC44Ny0wLjU5IDEuNC0wLjZoMjguNWMyNy42IDAgNDkuNS0yMi43IDQ5LjUtNTAuNHMtMjMuMi00OC43LTUwLjMtNDguN1pcIiBzdHlsZT1cInN0cm9rZTpjdXJyZW50Y29sb3I7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDozMjtmaWxsOiBjdXJyZW50Q29sb3I7XCI+PC9wYXRoPjwvc3ZnPmA7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUFXLGVBa0JFLG9CQVFBLGVDekJBLGlCQTJKQSxxQkMzSkEsV0FTQSxnQkNMQSxXQ0lQLFFBT0EsUUFDTywyQkEwREEsa0JBUUEsa0JBY1Asc0JBY0EsZ0JBOEJPLGtCQXdDQSx3QkFpRkEsZUFRRixpQkEwQkEsZUFlRSxxQkFjQTs7O0FKcFViLE9BQUMsU0FBVUEsZ0JBQWU7QUFPdEIsUUFBQUEsZUFBYyxlQUFlLElBQUk7QUFRakMsUUFBQUEsZUFBYyxhQUFhLElBQUk7TUFDbkMsR0FBRyxrQkFBa0IsZ0JBQWdCLENBQUEsRUFBRztBQUNqQyxNQUFNLHFCQUFOLGNBQWlDLE1BQU07UUFDMUMsWUFBWSxTQUFTLE1BQU0sTUFBTTtBQUM3QixnQkFBTSxPQUFPO0FBQ2IsZUFBSyxVQUFVO0FBQ2YsZUFBSyxPQUFPO0FBQ1osZUFBSyxPQUFPO1FBQ3BCO01BQ0E7QUFDTyxNQUFNLGdCQUFnQixDQUFDLFFBQVE7QUFDbEMsWUFBSSxJQUFJO0FBQ1IsWUFBSSxRQUFRLFFBQVEsUUFBUSxTQUFTLFNBQVMsSUFBSSxlQUFlO0FBQzdELGlCQUFPO1FBQ2YsWUFDYyxNQUFNLEtBQUssUUFBUSxRQUFRLFFBQVEsU0FBUyxTQUFTLElBQUksWUFBWSxRQUFRLE9BQU8sU0FBUyxTQUFTLEdBQUcscUJBQXFCLFFBQVEsT0FBTyxTQUFTLFNBQVMsR0FBRyxRQUFRO0FBQ2hMLGlCQUFPO1FBQ2YsT0FDUztBQUNELGlCQUFPO1FBQ2Y7TUFDQTtBQ3BDTyxNQUFNLGtCQUFrQixDQUFDLFFBQVE7QUFDcEMsY0FBTSxvQkFBb0IsSUFBSSwyQkFBMkI7QUFDekQsY0FBTSxNQUFNLElBQUksYUFBYSxDQUFBO0FBQzdCLGNBQU0sVUFBVyxJQUFJLFVBQVUsSUFBSSxXQUFXLENBQUE7QUFDOUMsY0FBTSxjQUFjLE1BQU07QUFDdEIsaUJBQU8sc0JBQXNCLE9BQU8sa0JBQWtCLE9BQU8sY0FBYyxHQUFHO1FBQ3RGO0FBQ0ksY0FBTSxtQkFBbUIsTUFBTSxZQUFXLE1BQU87QUFDakQsY0FBTSxvQkFBb0IsQ0FBQyxlQUFlO0FBQ3RDLGdCQUFNLFNBQVMsa0JBQWtCLElBQUksVUFBVTtBQUMvQyxjQUFJLFdBQVcsUUFBUSxXQUFXLFNBQVMsU0FBUyxPQUFPLFVBQVUsSUFBSSxZQUFXLENBQUUsR0FBRztBQUVyRixtQkFBTztVQUNuQjtBQUNRLGNBQUksZ0JBQWdCLFVBQVUsR0FBRztBQUU3QixtQkFBTztVQUNuQjtBQUNRLGlCQUFPO1FBQ2Y7QUFDSSxjQUFNLGtCQUFrQixDQUFDLGVBQWU7QUFBRSxjQUFJO0FBQUksa0JBQVEsS0FBSyxJQUFJLG1CQUFtQixRQUFRLE9BQU8sU0FBUyxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLFVBQVU7UUFBRTtBQUM3SixjQUFNLGNBQWMsQ0FBQyxRQUFRLElBQUksUUFBUSxNQUFNLEdBQUc7QUFDbEQsY0FBTSxvQkFBb0Isb0JBQUksSUFBRztBQUNqQyxjQUFNQyxrQkFBaUIsQ0FBQyxZQUFZLG9CQUFvQixDQUFBLE1BQU87QUFDM0QsZ0JBQU0sbUJBQW1CLGtCQUFrQixJQUFJLFVBQVU7QUFDekQsY0FBSSxrQkFBa0I7QUFDbEIsb0JBQVEsS0FBSyxxQkFBcUIsVUFBVSxzREFBc0Q7QUFDbEcsbUJBQU8saUJBQWlCO1VBQ3BDO0FBQ1EsZ0JBQU0sV0FBVyxZQUFXO0FBQzVCLGdCQUFNLGVBQWUsZ0JBQWdCLFVBQVU7QUFDL0MsY0FBSTtBQUNKLGdCQUFNLDJCQUEyQixZQUFZO0FBQ3pDLGdCQUFJLENBQUMsb0JBQW9CLFlBQVksbUJBQW1CO0FBQ3BELGlDQUNJLE9BQU8sa0JBQWtCLFFBQVEsTUFBTSxhQUNoQyxtQkFBbUIsTUFBTSxrQkFBa0IsUUFBUSxFQUFDLElBQ3BELG1CQUFtQixrQkFBa0IsUUFBUTtZQUN4RSxXQUNxQixzQkFBc0IsUUFBUSxDQUFDLG9CQUFvQixTQUFTLG1CQUFtQjtBQUNwRixpQ0FDSSxPQUFPLGtCQUFrQixLQUFLLE1BQU0sYUFDN0IsbUJBQW1CLE1BQU0sa0JBQWtCLEtBQUssRUFBQyxJQUNqRCxtQkFBbUIsa0JBQWtCLEtBQUs7WUFDckU7QUFDWSxtQkFBTztVQUNuQjtBQUNRLGdCQUFNLHFCQUFxQixDQUFDLE1BQU0sU0FBUztBQUN2QyxnQkFBSSxJQUFJO0FBQ1IsZ0JBQUksY0FBYztBQUNkLG9CQUFNLGVBQWUsaUJBQWlCLFFBQVEsaUJBQWlCLFNBQVMsU0FBUyxhQUFhLFFBQVEsS0FBSyxDQUFDLE1BQU0sU0FBUyxFQUFFLElBQUk7QUFDakksa0JBQUksY0FBYztBQUNkLG9CQUFJLGFBQWEsVUFBVSxXQUFXO0FBQ2xDLHlCQUFPLENBQUMsWUFBWSxJQUFJLGNBQWMsWUFBWSxLQUFLLFNBQVEsR0FBSSxPQUFPO2dCQUNsRyxPQUN5QjtBQUNELHlCQUFPLENBQUMsU0FBUyxhQUFhLElBQUksZUFBZSxZQUFZLEtBQUssU0FBUSxHQUFJLFNBQVMsUUFBUTtnQkFDdkg7Y0FDQSxXQUN5QixNQUFNO0FBQ1gsd0JBQVEsS0FBSyxLQUFLLElBQUksT0FBTyxRQUFRLE9BQU8sU0FBUyxTQUFTLEdBQUcsS0FBSyxJQUFJO2NBQzlGO1lBQ0EsV0FDcUIsTUFBTTtBQUNYLHNCQUFRLEtBQUssS0FBSyxJQUFJLE9BQU8sUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHLEtBQUssSUFBSTtZQUMxRixPQUNpQjtBQUNELG9CQUFNLElBQUksbUJBQW1CLElBQUksVUFBVSxrQ0FBa0MsUUFBUSxJQUFJLGNBQWMsYUFBYTtZQUNwSTtVQUNBO0FBQ1EsZ0JBQU0sNEJBQTRCLENBQUMsU0FBUztBQUN4QyxnQkFBSTtBQUNKLGtCQUFNLFVBQVUsSUFBSSxTQUFTO0FBQ3pCLG9CQUFNLElBQUkseUJBQXdCLEVBQUcsS0FBSyxDQUFDLFNBQVM7QUFDaEQsc0JBQU0sS0FBSyxtQkFBbUIsTUFBTSxJQUFJO0FBQ3hDLG9CQUFJLElBQUk7QUFDSix3QkFBTUMsS0FBSSxHQUFHLEdBQUcsSUFBSTtBQUNwQiwyQkFBU0EsT0FBTSxRQUFRQSxPQUFNLFNBQVMsU0FBU0EsR0FBRTtBQUNqRCx5QkFBT0E7Z0JBQy9CLE9BQ3lCO0FBQ0Qsd0JBQU0sSUFBSSxtQkFBbUIsSUFBSSxVQUFVLElBQUksSUFBSSw2QkFBNkIsUUFBUSxJQUFJLGNBQWMsYUFBYTtnQkFDL0k7Y0FDQSxDQUFpQjtBQUNELGtCQUFJLFNBQVMsZUFBZTtBQUN4QixrQkFBRSxTQUFTLFlBQVksT0FBTTtjQUNqRDtBQUNnQixxQkFBTztZQUN2QjtBQUVZLG9CQUFRLFdBQVcsTUFBTSxHQUFHLEtBQUssU0FBUSxDQUFFO0FBQzNDLG1CQUFPLGVBQWUsU0FBUyxRQUFRO2NBQ25DLE9BQU87Y0FDUCxVQUFVO2NBQ1YsY0FBYztZQUM5QixDQUFhO0FBQ0QsbUJBQU87VUFDbkI7QUFDUSxnQkFBTSxjQUFjLDBCQUEwQixhQUFhO0FBQzNELGdCQUFNLGlCQUFpQiwwQkFBMEIsZ0JBQWdCO0FBQ2pFLGdCQUFNLG9CQUFvQixDQUFDLFdBQVcsYUFBYTtBQUMvQyxrQkFBTSxPQUFPLFlBQVksRUFBRSxVQUFTLEdBQUksUUFBUTtBQUNoRCxrQkFBTSxTQUFTLFlBQVk7QUFDdkIsb0JBQU0sYUFBYSxNQUFNO0FBQ3pCLDZCQUFlO2dCQUNYO2dCQUNBO2NBQ3BCLEdBQW1CLFFBQVE7WUFDM0I7QUFDWSxrQkFBTSxJQUFJLElBQUksUUFBUSxDQUFDQyxhQUFZLEtBQUssS0FBSyxNQUFNQSxTQUFRLEVBQUUsT0FBTSxDQUFFLENBQUMsQ0FBQztBQUN2RSxjQUFFLFNBQVMsWUFBWTtBQUNuQixzQkFBUSxLQUFLLG9EQUFvRDtBQUNqRSxvQkFBTSxPQUFNO1lBQzVCO0FBQ1ksbUJBQU87VUFDbkI7QUFDUSxnQkFBTSxRQUFRLElBQUksTUFBTSxDQUFBLEdBQUk7WUFDeEIsSUFBSSxHQUFHLE1BQU07QUFDVCxzQkFBUSxNQUFJOztnQkFFUixLQUFLO0FBQ0QseUJBQU87Z0JBQ1gsS0FBSztBQUNELHlCQUFPLE9BQU8sQ0FBQTtnQkFDbEIsS0FBSztBQUNELHlCQUFPLGVBQWUsb0JBQW9CO2dCQUM5QyxLQUFLO0FBQ0QseUJBQU87Z0JBQ1g7QUFDSSx5QkFBTywwQkFBMEIsSUFBSTtjQUM3RDtZQUNBO1VBQ0EsQ0FBUztBQUNELGtCQUFRLFVBQVUsSUFBSTtBQUN0Qiw0QkFBa0IsSUFBSSxZQUFZO1lBQzlCLE1BQU07WUFDTjtZQUNBLFdBQVcsb0JBQUksSUFBSSxDQUFDLEdBQUcsT0FBTyxLQUFLLGlCQUFpQixHQUFHLEdBQUksZUFBZSxDQUFDLFFBQVEsSUFBSSxDQUFBLENBQUcsQ0FBQztVQUN2RyxDQUFTO0FBQ0QsaUJBQU87UUFDZjtBQUVJLFlBQUksQ0FBQyxJQUFJLGdCQUFnQjtBQUNyQixjQUFJLGlCQUFpQixDQUFDLGFBQWE7UUFDM0M7QUFDSSxZQUFJLGNBQWM7QUFDbEIsWUFBSSxjQUFjO0FBQ2xCLFlBQUksbUJBQW1CO0FBQ3ZCLFlBQUksb0JBQW9CO0FBQ3hCLFlBQUksaUJBQWlCRjtBQUNyQixZQUFJLFlBQVk7QUFDaEIsWUFBSSxRQUFRLENBQUMsQ0FBQyxJQUFJO0FBQ2xCLFlBQUksbUJBQW1CLENBQUMsQ0FBQyxJQUFJO0FBQzdCLGVBQU87TUFDWDtBQUNPLE1BQU0sc0JBQXNCLENBQUMsUUFBUyxJQUFJLFlBQVksZ0JBQWdCLEdBQUc7QUMzSnBFLE1BQUMsWUFBMEIsb0NBQW9CLE9BQU8sZUFBZSxjQUMzRSxhQUNBLE9BQU8sU0FBUyxjQUNaLE9BQ0EsT0FBTyxXQUFXLGNBQ2QsU0FDQSxPQUFPLFdBQVcsY0FDZCxTQUNBLENBQUEsQ0FBRTtBQUNSLE1BQUMsaUJBQWlCLFVBQVU7QUNMakMsTUFBTSxZQUFOLE1BQWdCO1FBQ25CLGNBQWM7QUFDVixlQUFLLFlBQVksQ0FBQTtBQUNqQixlQUFLLHlCQUF5QixDQUFBO0FBQzlCLGVBQUssa0JBQWtCLENBQUE7UUFDL0I7UUFDSSxZQUFZLFdBQVcsY0FBYztBQUNqQyxjQUFJLGdCQUFnQjtBQUNwQixnQkFBTSxZQUFZLEtBQUssVUFBVSxTQUFTO0FBQzFDLGNBQUksQ0FBQyxXQUFXO0FBQ1osaUJBQUssVUFBVSxTQUFTLElBQUksQ0FBQTtBQUM1Qiw0QkFBZ0I7VUFDNUI7QUFDUSxlQUFLLFVBQVUsU0FBUyxFQUFFLEtBQUssWUFBWTtBQUczQyxnQkFBTSxpQkFBaUIsS0FBSyxnQkFBZ0IsU0FBUztBQUNyRCxjQUFJLGtCQUFrQixDQUFDLGVBQWUsWUFBWTtBQUM5QyxpQkFBSyxrQkFBa0IsY0FBYztVQUNqRDtBQUNRLGNBQUksZUFBZTtBQUNmLGlCQUFLLDhCQUE4QixTQUFTO1VBQ3hEO0FBQ1EsZ0JBQU0sU0FBUyxZQUFZLEtBQUssZUFBZSxXQUFXLFlBQVk7QUFDdEUsZ0JBQU0sSUFBSSxRQUFRLFFBQVEsRUFBRSxPQUFNLENBQUU7QUFDcEMsaUJBQU87UUFDZjtRQUNJLE1BQU0scUJBQXFCO0FBQ3ZCLGVBQUssWUFBWSxDQUFBO0FBQ2pCLHFCQUFXLFlBQVksS0FBSyxpQkFBaUI7QUFDekMsaUJBQUsscUJBQXFCLEtBQUssZ0JBQWdCLFFBQVEsQ0FBQztVQUNwRTtBQUNRLGVBQUssa0JBQWtCLENBQUE7UUFDL0I7UUFDSSxnQkFBZ0IsV0FBVyxNQUFNLHFCQUFxQjtBQUNsRCxnQkFBTSxZQUFZLEtBQUssVUFBVSxTQUFTO0FBQzFDLGNBQUksQ0FBQyxXQUFXO0FBQ1osZ0JBQUkscUJBQXFCO0FBQ3JCLGtCQUFJLE9BQU8sS0FBSyx1QkFBdUIsU0FBUztBQUNoRCxrQkFBSSxDQUFDLE1BQU07QUFDUCx1QkFBTyxDQUFBO2NBQzNCO0FBQ2dCLG1CQUFLLEtBQUssSUFBSTtBQUNkLG1CQUFLLHVCQUF1QixTQUFTLElBQUk7WUFDekQ7QUFDWTtVQUNaO0FBQ1Esb0JBQVUsUUFBUSxDQUFDLGFBQWEsU0FBUyxJQUFJLENBQUM7UUFDdEQ7UUFDSSxhQUFhLFdBQVc7QUFDcEIsY0FBSTtBQUNKLGlCQUFPLENBQUMsR0FBRyxLQUFLLEtBQUssVUFBVSxTQUFTLE9BQU8sUUFBUSxPQUFPLFNBQVMsU0FBUyxHQUFHO1FBQzNGO1FBQ0ksdUJBQXVCLGlCQUFpQixpQkFBaUI7QUFDckQsZUFBSyxnQkFBZ0IsZUFBZSxJQUFJO1lBQ3BDLFlBQVk7WUFDWjtZQUNBO1lBQ0EsU0FBUyxDQUFDLFVBQVU7QUFDaEIsbUJBQUssZ0JBQWdCLGlCQUFpQixLQUFLO1lBQzNEO1VBQ0E7UUFDQTtRQUNJLGNBQWMsTUFBTSxtQkFBbUI7QUFDbkMsaUJBQU8sSUFBSSxVQUFVLFVBQVUsS0FBSyxjQUFjLGFBQWE7UUFDdkU7UUFDSSxZQUFZLE1BQU0saUJBQWlCO0FBQy9CLGlCQUFPLElBQUksVUFBVSxVQUFVLEtBQUssY0FBYyxXQUFXO1FBQ3JFO1FBQ0ksTUFBTSxlQUFlLFdBQVcsY0FBYztBQUMxQyxnQkFBTSxZQUFZLEtBQUssVUFBVSxTQUFTO0FBQzFDLGNBQUksQ0FBQyxXQUFXO0FBQ1o7VUFDWjtBQUNRLGdCQUFNLFFBQVEsVUFBVSxRQUFRLFlBQVk7QUFDNUMsZUFBSyxVQUFVLFNBQVMsRUFBRSxPQUFPLE9BQU8sQ0FBQztBQUd6QyxjQUFJLENBQUMsS0FBSyxVQUFVLFNBQVMsRUFBRSxRQUFRO0FBQ25DLGlCQUFLLHFCQUFxQixLQUFLLGdCQUFnQixTQUFTLENBQUM7VUFDckU7UUFDQTtRQUNJLGtCQUFrQixRQUFRO0FBQ3RCLGlCQUFPLGlCQUFpQixPQUFPLGlCQUFpQixPQUFPLE9BQU87QUFDOUQsaUJBQU8sYUFBYTtRQUM1QjtRQUNJLHFCQUFxQixRQUFRO0FBQ3pCLGNBQUksQ0FBQyxRQUFRO0FBQ1Q7VUFDWjtBQUNRLGlCQUFPLG9CQUFvQixPQUFPLGlCQUFpQixPQUFPLE9BQU87QUFDakUsaUJBQU8sYUFBYTtRQUM1QjtRQUNJLDhCQUE4QixXQUFXO0FBQ3JDLGdCQUFNLE9BQU8sS0FBSyx1QkFBdUIsU0FBUztBQUNsRCxjQUFJLENBQUMsTUFBTTtBQUNQO1VBQ1o7QUFDUSxpQkFBTyxLQUFLLHVCQUF1QixTQUFTO0FBQzVDLGVBQUssUUFBUSxDQUFDLFFBQVE7QUFDbEIsaUJBQUssZ0JBQWdCLFdBQVcsR0FBRztVQUMvQyxDQUFTO1FBQ1Q7TUFDQTtBQ25HQSxNQUFNLFNBQVMsQ0FBQyxRQUFRLG1CQUFtQixHQUFHLEVBQ3pDLFFBQVEsd0JBQXdCLGtCQUFrQixFQUNsRCxRQUFRLFNBQVMsTUFBTTtBQUs1QixNQUFNLFNBQVMsQ0FBQyxRQUFRLElBQUksUUFBUSxvQkFBb0Isa0JBQWtCO0FBQ25FLE1BQU0sNEJBQU4sY0FBd0MsVUFBVTtRQUNyRCxNQUFNLGFBQWE7QUFDZixnQkFBTSxVQUFVLFNBQVM7QUFDekIsZ0JBQU0sWUFBWSxDQUFBO0FBQ2xCLGtCQUFRLE1BQU0sR0FBRyxFQUFFLFFBQVEsQ0FBQyxXQUFXO0FBQ25DLGdCQUFJLE9BQU8sVUFBVTtBQUNqQjtBQUVKLGdCQUFJLENBQUMsS0FBSyxLQUFLLElBQUksT0FBTyxRQUFRLEtBQUssWUFBWSxFQUFFLE1BQU0sWUFBWTtBQUN2RSxrQkFBTSxPQUFPLEdBQUcsRUFBRSxLQUFJO0FBQ3RCLG9CQUFRLE9BQU8sS0FBSyxFQUFFLEtBQUk7QUFDMUIsc0JBQVUsR0FBRyxJQUFJO1VBQzdCLENBQVM7QUFDRCxpQkFBTztRQUNmO1FBQ0ksTUFBTSxVQUFVLFNBQVM7QUFDckIsY0FBSTtBQUVBLGtCQUFNLGFBQWEsT0FBTyxRQUFRLEdBQUc7QUFDckMsa0JBQU0sZUFBZSxPQUFPLFFBQVEsS0FBSztBQUV6QyxrQkFBTSxVQUFVLGNBQWMsUUFBUSxXQUFXLElBQUksUUFBUSxZQUFZLEVBQUUsQ0FBQztBQUM1RSxrQkFBTSxRQUFRLFFBQVEsUUFBUSxLQUFLLFFBQVEsU0FBUyxFQUFFO0FBQ3RELGtCQUFNLFNBQVMsUUFBUSxPQUFPLFFBQVEsUUFBUSxJQUFJLFNBQVMsSUFBSSxVQUFVLFFBQVEsR0FBRyxLQUFLO0FBQ3pGLHFCQUFTLFNBQVMsR0FBRyxVQUFVLElBQUksZ0JBQWdCLEVBQUUsR0FBRyxPQUFPLFVBQVUsSUFBSSxLQUFLLE1BQU07VUFDcEcsU0FDZSxPQUFPO0FBQ1YsbUJBQU8sUUFBUSxPQUFPLEtBQUs7VUFDdkM7UUFDQTtRQUNJLE1BQU0sYUFBYSxTQUFTO0FBQ3hCLGNBQUk7QUFDQSxxQkFBUyxTQUFTLEdBQUcsUUFBUSxHQUFHO1VBQzVDLFNBQ2UsT0FBTztBQUNWLG1CQUFPLFFBQVEsT0FBTyxLQUFLO1VBQ3ZDO1FBQ0E7UUFDSSxNQUFNLGVBQWU7QUFDakIsY0FBSTtBQUNBLGtCQUFNLFVBQVUsU0FBUyxPQUFPLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDOUMsdUJBQVcsVUFBVSxTQUFTO0FBQzFCLHVCQUFTLFNBQVMsT0FBTyxRQUFRLE9BQU8sRUFBRSxFQUFFLFFBQVEsT0FBTyxjQUFhLG9CQUFJLEtBQUksR0FBRyxZQUFXLENBQUUsU0FBUztZQUN6SDtVQUNBLFNBQ2UsT0FBTztBQUNWLG1CQUFPLFFBQVEsT0FBTyxLQUFLO1VBQ3ZDO1FBQ0E7UUFDSSxNQUFNLGtCQUFrQjtBQUNwQixjQUFJO0FBQ0Esa0JBQU0sS0FBSyxhQUFZO1VBQ25DLFNBQ2UsT0FBTztBQUNWLG1CQUFPLFFBQVEsT0FBTyxLQUFLO1VBQ3ZDO1FBQ0E7TUFDQTtBQUNZLE1BQUMsbUJBQW1CLGVBQWUsb0JBQW9CO1FBQy9ELEtBQUssTUFBTSxJQUFJLDBCQUF5QjtNQUM1QyxDQUFDO0FBTU0sTUFBTSxtQkFBbUIsT0FBTyxTQUFTLElBQUksUUFBUSxDQUFDRSxVQUFTLFdBQVc7QUFDN0UsY0FBTSxTQUFTLElBQUksV0FBVTtBQUM3QixlQUFPLFNBQVMsTUFBTTtBQUNsQixnQkFBTSxlQUFlLE9BQU87QUFFNUIsVUFBQUEsU0FBUSxhQUFhLFFBQVEsR0FBRyxLQUFLLElBQUksYUFBYSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksWUFBWTtRQUMxRjtBQUNJLGVBQU8sVUFBVSxDQUFDLFVBQVUsT0FBTyxLQUFLO0FBQ3hDLGVBQU8sY0FBYyxJQUFJO01BQzdCLENBQUM7QUFLRCxNQUFNLHVCQUF1QixDQUFDLFVBQVUsQ0FBQSxNQUFPO0FBQzNDLGNBQU0sZUFBZSxPQUFPLEtBQUssT0FBTztBQUN4QyxjQUFNLGNBQWMsT0FBTyxLQUFLLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLGtCQUFpQixDQUFFO0FBQ3pFLGNBQU0sYUFBYSxZQUFZLE9BQU8sQ0FBQyxLQUFLLEtBQUssVUFBVTtBQUN2RCxjQUFJLEdBQUcsSUFBSSxRQUFRLGFBQWEsS0FBSyxDQUFDO0FBQ3RDLGlCQUFPO1FBQ2YsR0FBTyxDQUFBLENBQUU7QUFDTCxlQUFPO01BQ1g7QUFNQSxNQUFNLGlCQUFpQixDQUFDLFFBQVEsZUFBZSxTQUFTO0FBQ3BELFlBQUksQ0FBQztBQUNELGlCQUFPO0FBQ1gsY0FBTSxTQUFTLE9BQU8sUUFBUSxNQUFNLEVBQUUsT0FBTyxDQUFDLGFBQWEsVUFBVTtBQUNqRSxnQkFBTSxDQUFDLEtBQUssS0FBSyxJQUFJO0FBQ3JCLGNBQUk7QUFDSixjQUFJO0FBQ0osY0FBSSxNQUFNLFFBQVEsS0FBSyxHQUFHO0FBQ3RCLG1CQUFPO0FBQ1Asa0JBQU0sUUFBUSxDQUFDLFFBQVE7QUFDbkIsNkJBQWUsZUFBZSxtQkFBbUIsR0FBRyxJQUFJO0FBQ3hELHNCQUFRLEdBQUcsR0FBRyxJQUFJLFlBQVk7WUFDOUMsQ0FBYTtBQUVELGlCQUFLLE1BQU0sR0FBRyxFQUFFO1VBQzVCLE9BQ2E7QUFDRCwyQkFBZSxlQUFlLG1CQUFtQixLQUFLLElBQUk7QUFDMUQsbUJBQU8sR0FBRyxHQUFHLElBQUksWUFBWTtVQUN6QztBQUNRLGlCQUFPLEdBQUcsV0FBVyxJQUFJLElBQUk7UUFDckMsR0FBTyxFQUFFO0FBRUwsZUFBTyxPQUFPLE9BQU8sQ0FBQztNQUMxQjtBQU1ZLE1BQUMsbUJBQW1CLENBQUMsU0FBUyxRQUFRLENBQUEsTUFBTztBQUNyRCxjQUFNLFNBQVMsT0FBTyxPQUFPLEVBQUUsUUFBUSxRQUFRLFVBQVUsT0FBTyxTQUFTLFFBQVEsUUFBTyxHQUFJLEtBQUs7QUFFakcsY0FBTSxVQUFVLHFCQUFxQixRQUFRLE9BQU87QUFDcEQsY0FBTSxPQUFPLFFBQVEsY0FBYyxLQUFLO0FBRXhDLFlBQUksT0FBTyxRQUFRLFNBQVMsVUFBVTtBQUNsQyxpQkFBTyxPQUFPLFFBQVE7UUFDOUIsV0FFYSxLQUFLLFNBQVMsbUNBQW1DLEdBQUc7QUFDekQsZ0JBQU0sU0FBUyxJQUFJLGdCQUFlO0FBQ2xDLHFCQUFXLENBQUMsS0FBSyxLQUFLLEtBQUssT0FBTyxRQUFRLFFBQVEsUUFBUSxDQUFBLENBQUUsR0FBRztBQUMzRCxtQkFBTyxJQUFJLEtBQUssS0FBSztVQUNqQztBQUNRLGlCQUFPLE9BQU8sT0FBTyxTQUFRO1FBQ3JDLFdBQ2EsS0FBSyxTQUFTLHFCQUFxQixLQUFLLFFBQVEsZ0JBQWdCLFVBQVU7QUFDL0UsZ0JBQU0sT0FBTyxJQUFJLFNBQVE7QUFDekIsY0FBSSxRQUFRLGdCQUFnQixVQUFVO0FBQ2xDLG9CQUFRLEtBQUssUUFBUSxDQUFDLE9BQU8sUUFBUTtBQUNqQyxtQkFBSyxPQUFPLEtBQUssS0FBSztZQUN0QyxDQUFhO1VBQ2IsT0FDYTtBQUNELHVCQUFXLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxHQUFHO0FBQ3pDLG1CQUFLLE9BQU8sS0FBSyxRQUFRLEtBQUssR0FBRyxDQUFDO1lBQ2xEO1VBQ0E7QUFDUSxpQkFBTyxPQUFPO0FBQ2QsZ0JBQU1DLFdBQVUsSUFBSSxRQUFRLE9BQU8sT0FBTztBQUMxQyxVQUFBQSxTQUFRLE9BQU8sY0FBYztBQUM3QixpQkFBTyxVQUFVQTtRQUN6QixXQUNhLEtBQUssU0FBUyxrQkFBa0IsS0FBSyxPQUFPLFFBQVEsU0FBUyxVQUFVO0FBQzVFLGlCQUFPLE9BQU8sS0FBSyxVQUFVLFFBQVEsSUFBSTtRQUNqRDtBQUNJLGVBQU87TUFDWDtBQUVPLE1BQU0seUJBQU4sY0FBcUMsVUFBVTs7Ozs7UUFLbEQsTUFBTSxRQUFRLFNBQVM7QUFDbkIsZ0JBQU0sY0FBYyxpQkFBaUIsU0FBUyxRQUFRLGFBQWE7QUFDbkUsZ0JBQU0sWUFBWSxlQUFlLFFBQVEsUUFBUSxRQUFRLHFCQUFxQjtBQUM5RSxnQkFBTSxNQUFNLFlBQVksR0FBRyxRQUFRLEdBQUcsSUFBSSxTQUFTLEtBQUssUUFBUTtBQUNoRSxnQkFBTSxXQUFXLE1BQU0sTUFBTSxLQUFLLFdBQVc7QUFDN0MsZ0JBQU0sY0FBYyxTQUFTLFFBQVEsSUFBSSxjQUFjLEtBQUs7QUFFNUQsY0FBSSxFQUFFLGVBQWUsT0FBTSxJQUFLLFNBQVMsS0FBSyxVQUFVLENBQUE7QUFFeEQsY0FBSSxZQUFZLFNBQVMsa0JBQWtCLEdBQUc7QUFDMUMsMkJBQWU7VUFDM0I7QUFDUSxjQUFJO0FBQ0osY0FBSTtBQUNKLGtCQUFRLGNBQVk7WUFDaEIsS0FBSztZQUNMLEtBQUs7QUFDRCxxQkFBTyxNQUFNLFNBQVMsS0FBSTtBQUMxQixxQkFBTyxNQUFNLGlCQUFpQixJQUFJO0FBQ2xDO1lBQ0osS0FBSztBQUNELHFCQUFPLE1BQU0sU0FBUyxLQUFJO0FBQzFCO1lBQ0osS0FBSztZQUNMLEtBQUs7WUFDTDtBQUNJLHFCQUFPLE1BQU0sU0FBUyxLQUFJO1VBQzFDO0FBRVEsZ0JBQU0sVUFBVSxDQUFBO0FBQ2hCLG1CQUFTLFFBQVEsUUFBUSxDQUFDLE9BQU8sUUFBUTtBQUNyQyxvQkFBUSxHQUFHLElBQUk7VUFDM0IsQ0FBUztBQUNELGlCQUFPO1lBQ0g7WUFDQTtZQUNBLFFBQVEsU0FBUztZQUNqQixLQUFLLFNBQVM7VUFDMUI7UUFDQTs7Ozs7UUFLSSxNQUFNLElBQUksU0FBUztBQUNmLGlCQUFPLEtBQUssUUFBUSxPQUFPLE9BQU8sT0FBTyxPQUFPLENBQUEsR0FBSSxPQUFPLEdBQUcsRUFBRSxRQUFRLE1BQUssQ0FBRSxDQUFDO1FBQ3hGOzs7OztRQUtJLE1BQU0sS0FBSyxTQUFTO0FBQ2hCLGlCQUFPLEtBQUssUUFBUSxPQUFPLE9BQU8sT0FBTyxPQUFPLENBQUEsR0FBSSxPQUFPLEdBQUcsRUFBRSxRQUFRLE9BQU0sQ0FBRSxDQUFDO1FBQ3pGOzs7OztRQUtJLE1BQU0sSUFBSSxTQUFTO0FBQ2YsaUJBQU8sS0FBSyxRQUFRLE9BQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQSxHQUFJLE9BQU8sR0FBRyxFQUFFLFFBQVEsTUFBSyxDQUFFLENBQUM7UUFDeEY7Ozs7O1FBS0ksTUFBTSxNQUFNLFNBQVM7QUFDakIsaUJBQU8sS0FBSyxRQUFRLE9BQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQSxHQUFJLE9BQU8sR0FBRyxFQUFFLFFBQVEsUUFBTyxDQUFFLENBQUM7UUFDMUY7Ozs7O1FBS0ksTUFBTSxPQUFPLFNBQVM7QUFDbEIsaUJBQU8sS0FBSyxRQUFRLE9BQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQSxHQUFJLE9BQU8sR0FBRyxFQUFFLFFBQVEsU0FBUSxDQUFFLENBQUM7UUFDM0Y7TUFDQTtBQUNZLE1BQUMsZ0JBQWdCLGVBQWUsaUJBQWlCO1FBQ3pELEtBQUssTUFBTSxJQUFJLHVCQUFzQjtNQUN6QyxDQUFDO0FBT0QsT0FBQyxTQUFVQyxrQkFBaUI7QUFNeEIsUUFBQUEsaUJBQWdCLE1BQU0sSUFBSTtBQU0xQixRQUFBQSxpQkFBZ0IsT0FBTyxJQUFJO0FBUTNCLFFBQUFBLGlCQUFnQixTQUFTLElBQUk7TUFDakMsR0FBRyxvQkFBb0Isa0JBQWtCLENBQUEsRUFBRztBQUs1QyxPQUFDLFNBQVVDLGdCQUFlO0FBTXRCLFFBQUFBLGVBQWMsV0FBVyxJQUFJO0FBTTdCLFFBQUFBLGVBQWMsZUFBZSxJQUFJO01BQ3JDLEdBQUcsa0JBQWtCLGdCQUFnQixDQUFBLEVBQUc7QUFDakMsTUFBTSxzQkFBTixjQUFrQyxVQUFVO1FBQy9DLE1BQU0sV0FBVztBQUNiLGVBQUssWUFBWSx1QkFBdUI7UUFDaEQ7UUFDSSxNQUFNLGVBQWU7QUFDakIsZUFBSyxZQUFZLHVCQUF1QjtRQUNoRDtRQUNJLE1BQU0sT0FBTztBQUNULGVBQUssWUFBWSx1QkFBdUI7UUFDaEQ7UUFDSSxNQUFNLE9BQU87QUFDVCxlQUFLLFlBQVksdUJBQXVCO1FBQ2hEO01BQ0E7QUFDWSxNQUFDLGFBQWEsZUFBZSxjQUFjO1FBQ25ELEtBQUssTUFBTSxJQUFJLG9CQUFtQjtNQUN0QyxDQUFDOzs7OztBQy9URCxNQUFZLFdBZ0dBO0FBaEdaOztBQUFBLE9BQUEsU0FBWUMsWUFBUztBQWFuQixRQUFBQSxXQUFBLFdBQUEsSUFBQTtBQVVBLFFBQUFBLFdBQUEsTUFBQSxJQUFBO0FBVUEsUUFBQUEsV0FBQSxTQUFBLElBQUE7QUFTQSxRQUFBQSxXQUFBLE9BQUEsSUFBQTtBQWFBLFFBQUFBLFdBQUEsVUFBQSxJQUFBO0FBY0EsUUFBQUEsV0FBQSxpQkFBQSxJQUFBO0FBUUEsUUFBQUEsV0FBQSxlQUFBLElBQUE7QUFRQSxRQUFBQSxXQUFBLGdCQUFBLElBQUE7QUFRQSxRQUFBQSxXQUFBLFdBQUEsSUFBQTtNQUNGLEdBOUZZLGNBQUEsWUFBUyxDQUFBLEVBQUE7QUFnR3JCLE9BQUEsU0FBWUMsV0FBUTtBQU1sQixRQUFBQSxVQUFBLE1BQUEsSUFBQTtBQVNBLFFBQUFBLFVBQUEsT0FBQSxJQUFBO0FBU0EsUUFBQUEsVUFBQSxPQUFBLElBQUE7TUFDRixHQXpCWSxhQUFBLFdBQVEsQ0FBQSxFQUFBOzs7OztBQ3hHcEI7Ozs7QUFnQ0EsV0FBUyxRQUFRLE1BQVk7QUFDM0IsVUFBTSxRQUFRLEtBQUssTUFBTSxHQUFHLEVBQUUsT0FBTyxDQUFDLFNBQVMsU0FBUyxHQUFHO0FBQzNELFVBQU0sV0FBcUIsQ0FBQTtBQUUzQixVQUFNLFFBQVEsQ0FBQyxTQUFRO0FBQ3JCLFVBQUksU0FBUyxRQUFRLFNBQVMsU0FBUyxLQUFLLFNBQVMsU0FBUyxTQUFTLENBQUMsTUFBTSxNQUFNO0FBQ2xGLGlCQUFTLElBQUc7TUFDZCxPQUFPO0FBQ0wsaUJBQVMsS0FBSyxJQUFJO01BQ3BCO0lBQ0YsQ0FBQztBQUVELFdBQU8sU0FBUyxLQUFLLEdBQUc7RUFDMUI7QUFDQSxXQUFTLGFBQWEsUUFBZ0IsVUFBZ0I7QUFDcEQsYUFBUyxRQUFRLE1BQU07QUFDdkIsZUFBVyxRQUFRLFFBQVE7QUFDM0IsVUFBTSxTQUFTLE9BQU8sTUFBTSxHQUFHO0FBQy9CLFVBQU0sU0FBUyxTQUFTLE1BQU0sR0FBRztBQUVqQyxXQUFPLFdBQVcsWUFBWSxPQUFPLE1BQU0sQ0FBQyxPQUFPLFVBQVUsVUFBVSxPQUFPLEtBQUssQ0FBQztFQUN0RjtBQXJEQSxNQXVEYTtBQXZEYjs7O0FBOEJBO0FBeUJNLE1BQU8sZ0JBQVAsTUFBTyx1QkFBc0IsVUFBUztRQUE1QyxjQUFBOztBQUlFLGVBQUEsYUFBYTtBQUNiLGVBQUEsVUFBVTtBQUVGLGVBQUEsYUFBdUIsQ0FBQyxPQUFPLE9BQU8sUUFBUTtBQXdqQi9DLGVBQUEsZUFBZSxPQUFPLFlBQTZEOztBQUN4RixrQkFBTSxjQUFjLGlCQUFpQixTQUFTLFFBQVEsYUFBYTtBQUNuRSxrQkFBTSxXQUFXLE1BQU0sTUFBTSxRQUFRLEtBQUssV0FBVztBQUNyRCxnQkFBSTtBQUVKLGdCQUFJLENBQUMsUUFBUTtBQUFVLHFCQUFPLE1BQU0sU0FBUyxLQUFJO3FCQUN4QyxFQUFDLGFBQVEsUUFBUixhQUFRLFNBQUEsU0FBUixTQUFVO0FBQU0scUJBQU8sSUFBSSxLQUFJO2lCQUNwQztBQUNILG9CQUFNLFNBQVMsU0FBUyxLQUFLLFVBQVM7QUFFdEMsa0JBQUksUUFBUTtBQUNaLG9CQUFNLFNBQXFDLENBQUE7QUFFM0Msb0JBQU0sY0FBNkIsU0FBUyxRQUFRLElBQUksY0FBYztBQUN0RSxvQkFBTSxnQkFBd0IsU0FBUyxTQUFTLFFBQVEsSUFBSSxnQkFBZ0IsS0FBSyxLQUFLLEVBQUU7QUFFeEYscUJBQU8sTUFBTTtBQUNYLHNCQUFNLEVBQUUsTUFBTSxNQUFLLElBQUssTUFBTSxPQUFPLEtBQUk7QUFFekMsb0JBQUk7QUFBTTtBQUVWLHVCQUFPLEtBQUssS0FBSztBQUNqQiwwQkFBUyxVQUFLLFFBQUwsVUFBSyxTQUFBLFNBQUwsTUFBTyxXQUFVO0FBRTFCLHNCQUFNLFNBQXlCO2tCQUM3QixLQUFLLFFBQVE7a0JBQ2I7a0JBQ0E7O0FBR0YscUJBQUssZ0JBQWdCLFlBQVksTUFBTTtjQUN6QztBQUVBLG9CQUFNLFlBQVksSUFBSSxXQUFXLEtBQUs7QUFDdEMsa0JBQUksV0FBVztBQUNmLHlCQUFXLFNBQVMsUUFBUTtBQUMxQixvQkFBSSxPQUFPLFVBQVU7QUFBYTtBQUVsQywwQkFBVSxJQUFJLE9BQU8sUUFBUTtBQUM3Qiw0QkFBWSxNQUFNO2NBQ3BCO0FBRUEscUJBQU8sSUFBSSxLQUFLLENBQUMsVUFBVSxNQUFNLEdBQUcsRUFBRSxNQUFNLGVBQWUsT0FBUyxDQUFFO1lBQ3hFO0FBRUEsa0JBQU0sU0FBUyxNQUFNLEtBQUssVUFBVTtjQUNsQyxNQUFNLFFBQVE7Y0FDZCxZQUFXLEtBQUEsUUFBUSxlQUFTLFFBQUEsT0FBQSxTQUFBLEtBQUk7Y0FDaEMsWUFBVyxLQUFBLFFBQVEsZUFBUyxRQUFBLE9BQUEsU0FBQSxLQUFJO2NBQ2hDLE1BQU07YUFDUDtBQUVELG1CQUFPLEVBQUUsTUFBTSxPQUFPLEtBQUssS0FBSTtVQUNqQztRQVNGO1FBNW5CRSxpQkFBaUIsVUFBbUMsV0FBbUM7QUFDckYsZ0JBQU0sS0FBSyxZQUFZLHlCQUF5QjtRQUNsRDtRQU9BLE1BQU0sU0FBTTtBQUNWLGNBQUksS0FBSyxRQUFRLFFBQVc7QUFDMUIsbUJBQU8sS0FBSztVQUNkO0FBQ0EsY0FBSSxFQUFFLGVBQWUsU0FBUztBQUM1QixrQkFBTSxLQUFLLFlBQVksd0NBQXdDO1VBQ2pFO0FBRUEsaUJBQU8sSUFBSSxRQUFxQixDQUFDQyxVQUFTLFdBQVU7QUFDbEQsa0JBQU0sVUFBVSxVQUFVLEtBQUssS0FBSyxTQUFTLEtBQUssVUFBVTtBQUM1RCxvQkFBUSxrQkFBa0IsZUFBYztBQUN4QyxvQkFBUSxZQUFZLE1BQUs7QUFDdkIsbUJBQUssTUFBTSxRQUFRO0FBQ25CLGNBQUFBLFNBQVEsUUFBUSxNQUFNO1lBQ3hCO0FBQ0Esb0JBQVEsVUFBVSxNQUFNLE9BQU8sUUFBUSxLQUFLO0FBQzVDLG9CQUFRLFlBQVksTUFBSztBQUN2QixzQkFBUSxLQUFLLFlBQVk7WUFDM0I7VUFDRixDQUFDO1FBQ0g7UUFFQSxPQUFPLFVBQVUsT0FBNEI7QUFDM0MsZ0JBQU0sY0FBYyxNQUFNO0FBQzFCLGdCQUFNLEtBQUssWUFBWTtBQUN2QixrQkFBUSxNQUFNLFlBQVk7WUFDeEIsS0FBSztZQUNMLEtBQUs7WUFDTCxTQUFTO0FBQ1Asa0JBQUksR0FBRyxpQkFBaUIsU0FBUyxhQUFhLEdBQUc7QUFDL0MsbUJBQUcsa0JBQWtCLGFBQWE7Y0FDcEM7QUFDQSxvQkFBTSxRQUFRLEdBQUcsa0JBQWtCLGVBQWUsRUFBRSxTQUFTLE9BQU0sQ0FBRTtBQUNyRSxvQkFBTSxZQUFZLGFBQWEsUUFBUTtZQUN6QztVQUNGO1FBQ0Y7UUFFQSxNQUFNLFVBQVUsS0FBYSxNQUFXO0FBQ3RDLGdCQUFNLFdBQVcsS0FBSyxXQUFXLFFBQVEsR0FBRyxNQUFNLEtBQUssY0FBYztBQUNyRSxpQkFBTyxLQUFLLE9BQU0sRUFBRyxLQUFLLENBQUMsU0FBcUI7QUFDOUMsbUJBQU8sSUFBSSxRQUF3QixDQUFDQSxVQUFTLFdBQVU7QUFDckQsb0JBQU0sS0FBcUIsS0FBSyxZQUFZLENBQUMsYUFBYSxHQUFHLFFBQVE7QUFDckUsb0JBQU0sUUFBYSxHQUFHLFlBQVksYUFBYTtBQUMvQyxvQkFBTSxNQUFNLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSTtBQUM5QixrQkFBSSxZQUFZLE1BQU1BLFNBQVEsSUFBSSxNQUFNO0FBQ3hDLGtCQUFJLFVBQVUsTUFBTSxPQUFPLElBQUksS0FBSztZQUN0QyxDQUFDO1VBQ0gsQ0FBQztRQUNIO1FBRUEsTUFBTSxlQUFlLFdBQW1CLEtBQWEsTUFBVztBQUM5RCxnQkFBTSxXQUFXLEtBQUssV0FBVyxRQUFRLEdBQUcsTUFBTSxLQUFLLGNBQWM7QUFDckUsaUJBQU8sS0FBSyxPQUFNLEVBQUcsS0FBSyxDQUFDLFNBQXFCO0FBQzlDLG1CQUFPLElBQUksUUFBd0IsQ0FBQ0EsVUFBUyxXQUFVO0FBQ3JELG9CQUFNLEtBQXFCLEtBQUssWUFBWSxDQUFDLGFBQWEsR0FBRyxRQUFRO0FBQ3JFLG9CQUFNLFFBQXdCLEdBQUcsWUFBWSxhQUFhO0FBQzFELG9CQUFNLFFBQWEsTUFBTSxNQUFNLFNBQVM7QUFDeEMsb0JBQU0sTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUk7QUFDOUIsa0JBQUksWUFBWSxNQUFNQSxTQUFRLElBQUksTUFBTTtBQUN4QyxrQkFBSSxVQUFVLE1BQU0sT0FBTyxJQUFJLEtBQUs7WUFDdEMsQ0FBQztVQUNILENBQUM7UUFDSDtRQUVRLFFBQVEsV0FBa0MsU0FBMkI7QUFDM0UsZ0JBQU0saUJBQWlCLFlBQVksU0FBWSxRQUFRLFFBQVEsZ0JBQWdCLEVBQUUsSUFBSTtBQUNyRixjQUFJLFNBQVM7QUFDYixjQUFJLGNBQWM7QUFBVyxzQkFBVSxNQUFNO0FBQzdDLGNBQUksWUFBWTtBQUFJLHNCQUFVLE1BQU07QUFDcEMsaUJBQU87UUFDVDtRQUVBLE1BQU0sUUFBSztBQUNULGdCQUFNLE9BQW9CLE1BQU0sS0FBSyxPQUFNO0FBQzNDLGdCQUFNLEtBQXFCLEtBQUssWUFBWSxDQUFDLGFBQWEsR0FBRyxXQUFXO0FBQ3hFLGdCQUFNLFFBQXdCLEdBQUcsWUFBWSxhQUFhO0FBQzFELGdCQUFNLE1BQUs7UUFDYjs7Ozs7O1FBT0EsTUFBTSxTQUFTLFNBQXdCO0FBQ3JDLGdCQUFNLE9BQWUsS0FBSyxRQUFRLFFBQVEsV0FBVyxRQUFRLElBQUk7QUFHakUsZ0JBQU0sUUFBUyxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ2pELGNBQUksVUFBVTtBQUFXLGtCQUFNLE1BQU0sc0JBQXNCO0FBQzNELGlCQUFPLEVBQUUsTUFBTSxNQUFNLFVBQVUsTUFBTSxVQUFVLEdBQUU7UUFDbkQ7Ozs7OztRQU9BLE1BQU0sVUFBVSxTQUF5QjtBQUN2QyxnQkFBTSxPQUFlLEtBQUssUUFBUSxRQUFRLFdBQVcsUUFBUSxJQUFJO0FBQ2pFLGNBQUksT0FBTyxRQUFRO0FBQ25CLGdCQUFNLFdBQVcsUUFBUTtBQUN6QixnQkFBTSxjQUFjLFFBQVE7QUFFNUIsZ0JBQU0sZ0JBQWlCLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDekQsY0FBSSxpQkFBaUIsY0FBYyxTQUFTO0FBQWEsa0JBQU0sTUFBTSxtQ0FBbUM7QUFFeEcsZ0JBQU0sYUFBYSxLQUFLLE9BQU8sR0FBRyxLQUFLLFlBQVksR0FBRyxDQUFDO0FBRXZELGdCQUFNLGNBQWUsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUM3RCxjQUFJLGdCQUFnQixRQUFXO0FBQzdCLGtCQUFNLGNBQWMsV0FBVyxRQUFRLEtBQUssQ0FBQztBQUM3QyxnQkFBSSxnQkFBZ0IsSUFBSTtBQUN0QixvQkFBTSxnQkFBZ0IsV0FBVyxPQUFPLFdBQVc7QUFDbkQsb0JBQU0sS0FBSyxNQUFNO2dCQUNmLE1BQU07Z0JBQ04sV0FBVyxRQUFRO2dCQUNuQixXQUFXO2VBQ1o7WUFDSDtVQUNGO0FBRUEsY0FBSSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsT0FBTztBQUN4QyxtQkFBTyxLQUFLLFFBQVEsR0FBRyxLQUFLLElBQUksS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFDckQsZ0JBQUksQ0FBQyxLQUFLLGVBQWUsSUFBSTtBQUFHLG9CQUFNLE1BQU0sZ0RBQWdEO1VBQzlGO0FBRUEsZ0JBQU0sTUFBTSxLQUFLLElBQUc7QUFDcEIsZ0JBQU0sVUFBb0I7WUFDeEI7WUFDQSxRQUFRO1lBQ1IsTUFBTTtZQUNOLE1BQU0sZ0JBQWdCLE9BQU8sS0FBSyxPQUFPLEtBQUs7WUFDOUMsT0FBTztZQUNQLE9BQU87WUFDUCxTQUFTOztBQUVYLGdCQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3JDLGlCQUFPO1lBQ0wsS0FBSyxRQUFROztRQUVqQjs7Ozs7O1FBT0EsTUFBTSxXQUFXLFNBQTBCO0FBQ3pDLGdCQUFNLE9BQWUsS0FBSyxRQUFRLFFBQVEsV0FBVyxRQUFRLElBQUk7QUFDakUsY0FBSSxPQUFPLFFBQVE7QUFDbkIsZ0JBQU0sV0FBVyxRQUFRO0FBQ3pCLGdCQUFNLGFBQWEsS0FBSyxPQUFPLEdBQUcsS0FBSyxZQUFZLEdBQUcsQ0FBQztBQUV2RCxnQkFBTSxNQUFNLEtBQUssSUFBRztBQUNwQixjQUFJLFFBQVE7QUFFWixnQkFBTSxnQkFBaUIsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN6RCxjQUFJLGlCQUFpQixjQUFjLFNBQVM7QUFBYSxrQkFBTSxNQUFNLG1DQUFtQztBQUV4RyxnQkFBTSxjQUFlLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDN0QsY0FBSSxnQkFBZ0IsUUFBVztBQUM3QixrQkFBTSxjQUFjLFdBQVcsUUFBUSxLQUFLLENBQUM7QUFDN0MsZ0JBQUksZ0JBQWdCLElBQUk7QUFDdEIsb0JBQU0sZ0JBQWdCLFdBQVcsT0FBTyxXQUFXO0FBQ25ELG9CQUFNLEtBQUssTUFBTTtnQkFDZixNQUFNO2dCQUNOLFdBQVcsUUFBUTtnQkFDbkIsV0FBVztlQUNaO1lBQ0g7VUFDRjtBQUVBLGNBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxlQUFlLElBQUk7QUFBRyxrQkFBTSxNQUFNLGdEQUFnRDtBQUV6RyxjQUFJLGtCQUFrQixRQUFXO0FBQy9CLGdCQUFJLGNBQWMsbUJBQW1CLE1BQU07QUFDekMsb0JBQU0sTUFBTSx3RUFBd0U7WUFDdEY7QUFFQSxnQkFBSSxjQUFjLFlBQVksVUFBYSxDQUFDLFVBQVU7QUFDcEQscUJBQU8sS0FBSyxLQUFLLGNBQWMsT0FBTyxJQUFJLEtBQUssSUFBSSxDQUFDO1lBQ3RELE9BQU87QUFDTCxxQkFBTyxjQUFjLFVBQVU7WUFDakM7QUFDQSxvQkFBUSxjQUFjO1VBQ3hCO0FBQ0EsZ0JBQU0sVUFBb0I7WUFDeEI7WUFDQSxRQUFRO1lBQ1IsTUFBTTtZQUNOLE1BQU0sS0FBSztZQUNYO1lBQ0EsT0FBTztZQUNQLFNBQVM7O0FBRVgsZ0JBQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDdkM7Ozs7OztRQU9BLE1BQU0sV0FBVyxTQUEwQjtBQUN6QyxnQkFBTSxPQUFlLEtBQUssUUFBUSxRQUFRLFdBQVcsUUFBUSxJQUFJO0FBRWpFLGdCQUFNLFFBQVMsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNqRCxjQUFJLFVBQVU7QUFBVyxrQkFBTSxNQUFNLHNCQUFzQjtBQUMzRCxnQkFBTSxVQUFVLE1BQU0sS0FBSyxlQUFlLGFBQWEsY0FBYyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQztBQUM3RixjQUFJLFFBQVEsV0FBVztBQUFHLGtCQUFNLE1BQU0sc0JBQXNCO0FBRTVELGdCQUFNLEtBQUssVUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ3ZDOzs7Ozs7UUFPQSxNQUFNLE1BQU0sU0FBcUI7QUFDL0IsZ0JBQU0sT0FBZSxLQUFLLFFBQVEsUUFBUSxXQUFXLFFBQVEsSUFBSTtBQUNqRSxnQkFBTSxjQUFjLFFBQVE7QUFDNUIsZ0JBQU0sYUFBYSxLQUFLLE9BQU8sR0FBRyxLQUFLLFlBQVksR0FBRyxDQUFDO0FBRXZELGdCQUFNLFNBQVMsS0FBSyxNQUFNLEtBQUssS0FBSyxDQUFBLEdBQUk7QUFDeEMsZ0JBQU0sY0FBZSxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzdELGdCQUFNLGdCQUFpQixNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3pELGNBQUksVUFBVTtBQUFHLGtCQUFNLE1BQU0sOEJBQThCO0FBQzNELGNBQUksa0JBQWtCO0FBQVcsa0JBQU0sTUFBTSx1Q0FBdUM7QUFDcEYsY0FBSSxDQUFDLGVBQWUsVUFBVSxLQUFLLGdCQUFnQjtBQUFXLGtCQUFNLE1BQU0sNkJBQTZCO0FBRXZHLGNBQUksZUFBZSxVQUFVLEtBQUssZ0JBQWdCLFFBQVc7QUFDM0Qsa0JBQU0sZ0JBQWdCLFdBQVcsT0FBTyxXQUFXLFFBQVEsS0FBSyxDQUFDLENBQUM7QUFDbEUsa0JBQU0sS0FBSyxNQUFNO2NBQ2YsTUFBTTtjQUNOLFdBQVcsUUFBUTtjQUNuQixXQUFXO2FBQ1o7VUFDSDtBQUNBLGdCQUFNLE1BQU0sS0FBSyxJQUFHO0FBQ3BCLGdCQUFNLFVBQW9CO1lBQ3hCO1lBQ0EsUUFBUTtZQUNSLE1BQU07WUFDTixNQUFNO1lBQ04sT0FBTztZQUNQLE9BQU87O0FBRVQsZ0JBQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDdkM7Ozs7O1FBTUEsTUFBTSxNQUFNLFNBQXFCO0FBQy9CLGdCQUFNLEVBQUUsTUFBTSxXQUFXLFVBQVMsSUFBSztBQUN2QyxnQkFBTSxXQUFtQixLQUFLLFFBQVEsV0FBVyxJQUFJO0FBRXJELGdCQUFNLFFBQVMsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUVyRCxjQUFJLFVBQVU7QUFBVyxrQkFBTSxNQUFNLHdCQUF3QjtBQUU3RCxjQUFJLE1BQU0sU0FBUztBQUFhLGtCQUFNLE1BQU0sbUNBQW1DO0FBRS9FLGdCQUFNLGdCQUFnQixNQUFNLEtBQUssUUFBUSxFQUFFLE1BQU0sVUFBUyxDQUFFO0FBRTVELGNBQUksY0FBYyxNQUFNLFdBQVcsS0FBSyxDQUFDO0FBQVcsa0JBQU0sTUFBTSxxQkFBcUI7QUFFckYscUJBQVdDLFVBQVMsY0FBYyxPQUFPO0FBQ3ZDLGtCQUFNLFlBQVksR0FBRyxJQUFJLElBQUlBLE9BQU0sSUFBSTtBQUN2QyxrQkFBTSxXQUFXLE1BQU0sS0FBSyxLQUFLLEVBQUUsTUFBTSxXQUFXLFVBQVMsQ0FBRTtBQUMvRCxnQkFBSSxTQUFTLFNBQVMsUUFBUTtBQUM1QixvQkFBTSxLQUFLLFdBQVcsRUFBRSxNQUFNLFdBQVcsVUFBUyxDQUFFO1lBQ3RELE9BQU87QUFDTCxvQkFBTSxLQUFLLE1BQU0sRUFBRSxNQUFNLFdBQVcsV0FBVyxVQUFTLENBQUU7WUFDNUQ7VUFDRjtBQUVBLGdCQUFNLEtBQUssVUFBVSxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQzNDOzs7Ozs7UUFPQSxNQUFNLFFBQVEsU0FBdUI7QUFDbkMsZ0JBQU0sT0FBZSxLQUFLLFFBQVEsUUFBUSxXQUFXLFFBQVEsSUFBSTtBQUVqRSxnQkFBTSxRQUFTLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDakQsY0FBSSxRQUFRLFNBQVMsTUFBTSxVQUFVO0FBQVcsa0JBQU0sTUFBTSx3QkFBd0I7QUFFcEYsZ0JBQU0sVUFBb0IsTUFBTSxLQUFLLGVBQWUsYUFBYSxjQUFjLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ3ZHLGdCQUFNLFFBQVEsTUFBTSxRQUFRLElBQzFCLFFBQVEsSUFBSSxPQUFPLE1BQUs7QUFDdEIsZ0JBQUksV0FBWSxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQy9DLGdCQUFJLGFBQWEsUUFBVztBQUMxQix5QkFBWSxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUM7WUFDbkQ7QUFDQSxtQkFBTztjQUNMLE1BQU0sRUFBRSxVQUFVLEtBQUssU0FBUyxDQUFDO2NBQ2pDLE1BQU0sU0FBUztjQUNmLE1BQU0sU0FBUztjQUNmLE9BQU8sU0FBUztjQUNoQixPQUFPLFNBQVM7Y0FDaEIsS0FBSyxTQUFTOztVQUVsQixDQUFDLENBQUM7QUFFSixpQkFBTyxFQUFFLE1BQVk7UUFDdkI7Ozs7OztRQU9BLE1BQU0sT0FBTyxTQUFzQjtBQUNqQyxnQkFBTSxPQUFlLEtBQUssUUFBUSxRQUFRLFdBQVcsUUFBUSxJQUFJO0FBRWpFLGNBQUksUUFBUyxNQUFNLEtBQUssVUFBVSxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQy9DLGNBQUksVUFBVSxRQUFXO0FBQ3ZCLG9CQUFTLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQztVQUNuRDtBQUNBLGlCQUFPO1lBQ0wsTUFBSyxVQUFLLFFBQUwsVUFBSyxTQUFBLFNBQUwsTUFBTyxTQUFROztRQUV4Qjs7Ozs7O1FBT0EsTUFBTSxLQUFLLFNBQW9CO0FBQzdCLGdCQUFNLE9BQWUsS0FBSyxRQUFRLFFBQVEsV0FBVyxRQUFRLElBQUk7QUFFakUsY0FBSSxRQUFTLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDL0MsY0FBSSxVQUFVLFFBQVc7QUFDdkIsb0JBQVMsTUFBTSxLQUFLLFVBQVUsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDO1VBQ25EO0FBQ0EsY0FBSSxVQUFVO0FBQVcsa0JBQU0sTUFBTSx1QkFBdUI7QUFFNUQsaUJBQU87WUFDTCxNQUFNLE1BQU0sS0FBSyxVQUFVLEtBQUssU0FBUyxDQUFDO1lBQzFDLE1BQU0sTUFBTTtZQUNaLE1BQU0sTUFBTTtZQUNaLE9BQU8sTUFBTTtZQUNiLE9BQU8sTUFBTTtZQUNiLEtBQUssTUFBTTs7UUFFZjs7Ozs7O1FBT0EsTUFBTSxPQUFPLFNBQXNCO0FBQ2pDLGdCQUFNLEtBQUssTUFBTSxTQUFTLElBQUk7QUFDOUI7UUFDRjs7Ozs7O1FBT0EsTUFBTSxLQUFLLFNBQW9CO0FBQzdCLGlCQUFPLEtBQUssTUFBTSxTQUFTLEtBQUs7UUFDbEM7UUFFQSxNQUFNLHFCQUFrQjtBQUN0QixpQkFBTyxFQUFFLGVBQWUsVUFBUztRQUNuQztRQUVBLE1BQU0sbUJBQWdCO0FBQ3BCLGlCQUFPLEVBQUUsZUFBZSxVQUFTO1FBQ25DOzs7Ozs7O1FBUVEsTUFBTSxNQUFNLFNBQXNCLFdBQVcsT0FBSztBQUN4RCxjQUFJLEVBQUUsWUFBVyxJQUFLO0FBQ3RCLGdCQUFNLEVBQUUsSUFBSSxNQUFNLFdBQVcsY0FBYSxJQUFLO0FBRS9DLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtBQUNoQixrQkFBTSxNQUFNLG1DQUFtQztVQUNqRDtBQUdBLGNBQUksQ0FBQyxhQUFhO0FBQ2hCLDBCQUFjO1VBQ2hCO0FBRUEsZ0JBQU0sV0FBVyxLQUFLLFFBQVEsZUFBZSxJQUFJO0FBQ2pELGdCQUFNLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUczQyxjQUFJLGFBQWEsUUFBUTtBQUN2QixtQkFBTztjQUNMLEtBQUs7O1VBRVQ7QUFFQSxjQUFJLGFBQWEsVUFBVSxNQUFNLEdBQUc7QUFDbEMsa0JBQU0sTUFBTSxzQ0FBc0M7VUFDcEQ7QUFHQSxjQUFJO0FBQ0osY0FBSTtBQUNGLG9CQUFRLE1BQU0sS0FBSyxLQUFLO2NBQ3RCLE1BQU07Y0FDTixXQUFXO2FBQ1o7VUFDSCxTQUFTLEdBQUc7QUFFVixrQkFBTSxtQkFBbUIsR0FBRyxNQUFNLEdBQUc7QUFDckMsNkJBQWlCLElBQUc7QUFDcEIsa0JBQU1DLFVBQVMsaUJBQWlCLEtBQUssR0FBRztBQUd4QyxnQkFBSSxpQkFBaUIsU0FBUyxHQUFHO0FBQy9CLG9CQUFNLG9CQUFvQixNQUFNLEtBQUssS0FBSztnQkFDeEMsTUFBTUE7Z0JBQ04sV0FBVztlQUNaO0FBRUQsa0JBQUksa0JBQWtCLFNBQVMsYUFBYTtBQUMxQyxzQkFBTSxJQUFJLE1BQU0sMkNBQTJDO2NBQzdEO1lBQ0Y7VUFDRjtBQUdBLGNBQUksU0FBUyxNQUFNLFNBQVMsYUFBYTtBQUN2QyxrQkFBTSxJQUFJLE1BQU0sMENBQTBDO1VBQzVEO0FBR0EsZ0JBQU0sVUFBVSxNQUFNLEtBQUssS0FBSztZQUM5QixNQUFNO1lBQ04sV0FBVztXQUNaO0FBR0QsZ0JBQU0sYUFBYSxPQUFPLE1BQWNDLFFBQWUsVUFBaUI7QUFDdEUsa0JBQU0sV0FBbUIsS0FBSyxRQUFRLGFBQWEsSUFBSTtBQUN2RCxrQkFBTSxRQUFTLE1BQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDckQsa0JBQU0sUUFBUUE7QUFDZCxrQkFBTSxRQUFRO0FBQ2Qsa0JBQU0sS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFLLENBQUM7VUFDckM7QUFFQSxnQkFBTSxRQUFRLFFBQVEsUUFBUSxRQUFRLFFBQVEsS0FBSyxJQUFHO0FBRXRELGtCQUFRLFFBQVEsTUFBTTs7WUFFcEIsS0FBSyxRQUFRO0FBRVgsb0JBQU0sT0FBTyxNQUFNLEtBQUssU0FBUztnQkFDL0IsTUFBTTtnQkFDTixXQUFXO2VBQ1o7QUFHRCxrQkFBSSxVQUFVO0FBQ1osc0JBQU0sS0FBSyxXQUFXO2tCQUNwQixNQUFNO2tCQUNOLFdBQVc7aUJBQ1o7Y0FDSDtBQUVBLGtCQUFJO0FBQ0osa0JBQUksRUFBRSxLQUFLLGdCQUFnQixTQUFTLENBQUMsS0FBSyxlQUFlLEtBQUssSUFBSSxHQUFHO0FBQ25FLDJCQUFXLFNBQVM7Y0FDdEI7QUFHQSxvQkFBTSxjQUFjLE1BQU0sS0FBSyxVQUFVO2dCQUN2QyxNQUFNO2dCQUNOLFdBQVc7Z0JBQ1gsTUFBTSxLQUFLO2dCQUNYO2VBQ0Q7QUFHRCxrQkFBSSxVQUFVO0FBQ1osc0JBQU0sV0FBVyxJQUFJLE9BQU8sUUFBUSxLQUFLO2NBQzNDO0FBR0EscUJBQU87WUFDVDtZQUNBLEtBQUssYUFBYTtBQUNoQixrQkFBSSxPQUFPO0FBQ1Qsc0JBQU0sTUFBTSxpREFBaUQ7Y0FDL0Q7QUFFQSxrQkFBSTtBQUVGLHNCQUFNLEtBQUssTUFBTTtrQkFDZixNQUFNO2tCQUNOLFdBQVc7a0JBQ1gsV0FBVztpQkFDWjtBQUdELG9CQUFJLFVBQVU7QUFDWix3QkFBTSxXQUFXLElBQUksT0FBTyxRQUFRLEtBQUs7Z0JBQzNDO2NBQ0YsU0FBUyxHQUFHO2NBRVo7QUFHQSxvQkFBTSxZQUNKLE1BQU0sS0FBSyxRQUFRO2dCQUNqQixNQUFNO2dCQUNOLFdBQVc7ZUFDWixHQUNEO0FBRUYseUJBQVcsWUFBWSxVQUFVO0FBRS9CLHNCQUFNLEtBQUssTUFDVDtrQkFDRSxNQUFNLEdBQUcsSUFBSSxJQUFJLFNBQVMsSUFBSTtrQkFDOUIsSUFBSSxHQUFHLEVBQUUsSUFBSSxTQUFTLElBQUk7a0JBQzFCLFdBQVc7a0JBQ1g7bUJBRUYsUUFBUTtjQUVaO0FBR0Esa0JBQUksVUFBVTtBQUNaLHNCQUFNLEtBQUssTUFBTTtrQkFDZixNQUFNO2tCQUNOLFdBQVc7aUJBQ1o7Y0FDSDtZQUNGO1VBQ0Y7QUFDQSxpQkFBTztZQUNMLEtBQUs7O1FBRVQ7UUFnRVEsZUFBZSxLQUFXO0FBQ2hDLGNBQUk7QUFDRixtQkFBTyxLQUFLLEtBQUssR0FBRyxDQUFDLEtBQUs7VUFDNUIsU0FBUyxLQUFLO0FBQ1osbUJBQU87VUFDVDtRQUNGOztBQW5uQk8sb0JBQUEsU0FBUzs7Ozs7QUNoRWxCLE1BQUFDLGVBQUE7V0FBQUEsY0FBQTs7OztNQUlhLFlBeUJQO0FBN0JOLE1BQUFDLFlBQUE7OztBQUlNLE1BQU8sYUFBUCxjQUEwQixVQUFTO1FBR3ZDLGNBQUE7QUFDRSxnQkFBSztBQUNMLGVBQUssY0FBYztRQUNyQjtRQUVBLE1BQU0sS0FBSyxTQUFvQjtBQUM3QixlQUFLLGNBQWMsT0FBTyxLQUFLLFFBQVEsS0FBSyxRQUFRLGNBQWMsUUFBUTtRQUM1RTtRQUVBLE1BQU0sUUFBSztBQUNULGlCQUFPLElBQUksUUFBUSxDQUFDQyxVQUFTLFdBQVU7QUFDckMsZ0JBQUksS0FBSyxlQUFlLE1BQU07QUFDNUIsbUJBQUssWUFBWSxNQUFLO0FBQ3RCLG1CQUFLLGNBQWM7QUFDbkIsY0FBQUEsU0FBTztZQUNULE9BQU87QUFDTCxxQkFBTyw0QkFBNEI7WUFDckM7VUFDRixDQUFDO1FBQ0g7O0FBR0YsTUFBTSxVQUFVLElBQUksV0FBVTs7Ozs7QUM3QjlCO0FBQUE7QUFBQTtBQTBCQSxlQUFTLFdBQVcsTUFBTTtBQUN4QixZQUFJLE9BQU8sU0FBUyxVQUFVO0FBQzVCLGdCQUFNLElBQUksVUFBVSxxQ0FBcUMsS0FBSyxVQUFVLElBQUksQ0FBQztBQUFBLFFBQy9FO0FBQUEsTUFDRjtBQUdBLGVBQVMscUJBQXFCLE1BQU0sZ0JBQWdCO0FBQ2xELFlBQUksTUFBTTtBQUNWLFlBQUksb0JBQW9CO0FBQ3hCLFlBQUksWUFBWTtBQUNoQixZQUFJLE9BQU87QUFDWCxZQUFJO0FBQ0osaUJBQVMsSUFBSSxHQUFHLEtBQUssS0FBSyxRQUFRLEVBQUUsR0FBRztBQUNyQyxjQUFJLElBQUksS0FBSztBQUNYLG1CQUFPLEtBQUssV0FBVyxDQUFDO0FBQUEsbUJBQ2pCLFNBQVM7QUFDaEI7QUFBQTtBQUVBLG1CQUFPO0FBQ1QsY0FBSSxTQUFTLElBQVU7QUFDckIsZ0JBQUksY0FBYyxJQUFJLEtBQUssU0FBUyxHQUFHO0FBQUEsWUFFdkMsV0FBVyxjQUFjLElBQUksS0FBSyxTQUFTLEdBQUc7QUFDNUMsa0JBQUksSUFBSSxTQUFTLEtBQUssc0JBQXNCLEtBQUssSUFBSSxXQUFXLElBQUksU0FBUyxDQUFDLE1BQU0sTUFBWSxJQUFJLFdBQVcsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFVO0FBQzNJLG9CQUFJLElBQUksU0FBUyxHQUFHO0FBQ2xCLHNCQUFJLGlCQUFpQixJQUFJLFlBQVksR0FBRztBQUN4QyxzQkFBSSxtQkFBbUIsSUFBSSxTQUFTLEdBQUc7QUFDckMsd0JBQUksbUJBQW1CLElBQUk7QUFDekIsNEJBQU07QUFDTiwwQ0FBb0I7QUFBQSxvQkFDdEIsT0FBTztBQUNMLDRCQUFNLElBQUksTUFBTSxHQUFHLGNBQWM7QUFDakMsMENBQW9CLElBQUksU0FBUyxJQUFJLElBQUksWUFBWSxHQUFHO0FBQUEsb0JBQzFEO0FBQ0EsZ0NBQVk7QUFDWiwyQkFBTztBQUNQO0FBQUEsa0JBQ0Y7QUFBQSxnQkFDRixXQUFXLElBQUksV0FBVyxLQUFLLElBQUksV0FBVyxHQUFHO0FBQy9DLHdCQUFNO0FBQ04sc0NBQW9CO0FBQ3BCLDhCQUFZO0FBQ1oseUJBQU87QUFDUDtBQUFBLGdCQUNGO0FBQUEsY0FDRjtBQUNBLGtCQUFJLGdCQUFnQjtBQUNsQixvQkFBSSxJQUFJLFNBQVM7QUFDZix5QkFBTztBQUFBO0FBRVAsd0JBQU07QUFDUixvQ0FBb0I7QUFBQSxjQUN0QjtBQUFBLFlBQ0YsT0FBTztBQUNMLGtCQUFJLElBQUksU0FBUztBQUNmLHVCQUFPLE1BQU0sS0FBSyxNQUFNLFlBQVksR0FBRyxDQUFDO0FBQUE7QUFFeEMsc0JBQU0sS0FBSyxNQUFNLFlBQVksR0FBRyxDQUFDO0FBQ25DLGtDQUFvQixJQUFJLFlBQVk7QUFBQSxZQUN0QztBQUNBLHdCQUFZO0FBQ1osbUJBQU87QUFBQSxVQUNULFdBQVcsU0FBUyxNQUFZLFNBQVMsSUFBSTtBQUMzQyxjQUFFO0FBQUEsVUFDSixPQUFPO0FBQ0wsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUNBLGVBQU87QUFBQSxNQUNUO0FBRUEsZUFBUyxRQUFRLEtBQUssWUFBWTtBQUNoQyxZQUFJLE1BQU0sV0FBVyxPQUFPLFdBQVc7QUFDdkMsWUFBSSxPQUFPLFdBQVcsU0FBUyxXQUFXLFFBQVEsT0FBTyxXQUFXLE9BQU87QUFDM0UsWUFBSSxDQUFDLEtBQUs7QUFDUixpQkFBTztBQUFBLFFBQ1Q7QUFDQSxZQUFJLFFBQVEsV0FBVyxNQUFNO0FBQzNCLGlCQUFPLE1BQU07QUFBQSxRQUNmO0FBQ0EsZUFBTyxNQUFNLE1BQU07QUFBQSxNQUNyQjtBQUVBLFVBQUksUUFBUTtBQUFBO0FBQUEsUUFFVixTQUFTLFNBQVNDLFdBQVU7QUFDMUIsY0FBSSxlQUFlO0FBQ25CLGNBQUksbUJBQW1CO0FBQ3ZCLGNBQUk7QUFFSixtQkFBUyxJQUFJLFVBQVUsU0FBUyxHQUFHLEtBQUssTUFBTSxDQUFDLGtCQUFrQixLQUFLO0FBQ3BFLGdCQUFJO0FBQ0osZ0JBQUksS0FBSztBQUNQLHFCQUFPLFVBQVUsQ0FBQztBQUFBLGlCQUNmO0FBQ0gsa0JBQUksUUFBUTtBQUNWLHNCQUFNLFFBQVEsSUFBSTtBQUNwQixxQkFBTztBQUFBLFlBQ1Q7QUFFQSx1QkFBVyxJQUFJO0FBR2YsZ0JBQUksS0FBSyxXQUFXLEdBQUc7QUFDckI7QUFBQSxZQUNGO0FBRUEsMkJBQWUsT0FBTyxNQUFNO0FBQzVCLCtCQUFtQixLQUFLLFdBQVcsQ0FBQyxNQUFNO0FBQUEsVUFDNUM7QUFNQSx5QkFBZSxxQkFBcUIsY0FBYyxDQUFDLGdCQUFnQjtBQUVuRSxjQUFJLGtCQUFrQjtBQUNwQixnQkFBSSxhQUFhLFNBQVM7QUFDeEIscUJBQU8sTUFBTTtBQUFBO0FBRWIscUJBQU87QUFBQSxVQUNYLFdBQVcsYUFBYSxTQUFTLEdBQUc7QUFDbEMsbUJBQU87QUFBQSxVQUNULE9BQU87QUFDTCxtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsUUFFQSxXQUFXLFNBQVMsVUFBVSxNQUFNO0FBQ2xDLHFCQUFXLElBQUk7QUFFZixjQUFJLEtBQUssV0FBVyxFQUFHLFFBQU87QUFFOUIsY0FBSSxhQUFhLEtBQUssV0FBVyxDQUFDLE1BQU07QUFDeEMsY0FBSSxvQkFBb0IsS0FBSyxXQUFXLEtBQUssU0FBUyxDQUFDLE1BQU07QUFHN0QsaUJBQU8scUJBQXFCLE1BQU0sQ0FBQyxVQUFVO0FBRTdDLGNBQUksS0FBSyxXQUFXLEtBQUssQ0FBQyxXQUFZLFFBQU87QUFDN0MsY0FBSSxLQUFLLFNBQVMsS0FBSyxrQkFBbUIsU0FBUTtBQUVsRCxjQUFJLFdBQVksUUFBTyxNQUFNO0FBQzdCLGlCQUFPO0FBQUEsUUFDVDtBQUFBLFFBRUEsWUFBWSxTQUFTLFdBQVcsTUFBTTtBQUNwQyxxQkFBVyxJQUFJO0FBQ2YsaUJBQU8sS0FBSyxTQUFTLEtBQUssS0FBSyxXQUFXLENBQUMsTUFBTTtBQUFBLFFBQ25EO0FBQUEsUUFFQSxNQUFNLFNBQVNDLFFBQU87QUFDcEIsY0FBSSxVQUFVLFdBQVc7QUFDdkIsbUJBQU87QUFDVCxjQUFJO0FBQ0osbUJBQVMsSUFBSSxHQUFHLElBQUksVUFBVSxRQUFRLEVBQUUsR0FBRztBQUN6QyxnQkFBSSxNQUFNLFVBQVUsQ0FBQztBQUNyQix1QkFBVyxHQUFHO0FBQ2QsZ0JBQUksSUFBSSxTQUFTLEdBQUc7QUFDbEIsa0JBQUksV0FBVztBQUNiLHlCQUFTO0FBQUE7QUFFVCwwQkFBVSxNQUFNO0FBQUEsWUFDcEI7QUFBQSxVQUNGO0FBQ0EsY0FBSSxXQUFXO0FBQ2IsbUJBQU87QUFDVCxpQkFBTyxNQUFNLFVBQVUsTUFBTTtBQUFBLFFBQy9CO0FBQUEsUUFFQSxVQUFVLFNBQVMsU0FBUyxNQUFNLElBQUk7QUFDcEMscUJBQVcsSUFBSTtBQUNmLHFCQUFXLEVBQUU7QUFFYixjQUFJLFNBQVMsR0FBSSxRQUFPO0FBRXhCLGlCQUFPLE1BQU0sUUFBUSxJQUFJO0FBQ3pCLGVBQUssTUFBTSxRQUFRLEVBQUU7QUFFckIsY0FBSSxTQUFTLEdBQUksUUFBTztBQUd4QixjQUFJLFlBQVk7QUFDaEIsaUJBQU8sWUFBWSxLQUFLLFFBQVEsRUFBRSxXQUFXO0FBQzNDLGdCQUFJLEtBQUssV0FBVyxTQUFTLE1BQU07QUFDakM7QUFBQSxVQUNKO0FBQ0EsY0FBSSxVQUFVLEtBQUs7QUFDbkIsY0FBSSxVQUFVLFVBQVU7QUFHeEIsY0FBSSxVQUFVO0FBQ2QsaUJBQU8sVUFBVSxHQUFHLFFBQVEsRUFBRSxTQUFTO0FBQ3JDLGdCQUFJLEdBQUcsV0FBVyxPQUFPLE1BQU07QUFDN0I7QUFBQSxVQUNKO0FBQ0EsY0FBSSxRQUFRLEdBQUc7QUFDZixjQUFJLFFBQVEsUUFBUTtBQUdwQixjQUFJLFNBQVMsVUFBVSxRQUFRLFVBQVU7QUFDekMsY0FBSSxnQkFBZ0I7QUFDcEIsY0FBSSxJQUFJO0FBQ1IsaUJBQU8sS0FBSyxRQUFRLEVBQUUsR0FBRztBQUN2QixnQkFBSSxNQUFNLFFBQVE7QUFDaEIsa0JBQUksUUFBUSxRQUFRO0FBQ2xCLG9CQUFJLEdBQUcsV0FBVyxVQUFVLENBQUMsTUFBTSxJQUFVO0FBRzNDLHlCQUFPLEdBQUcsTUFBTSxVQUFVLElBQUksQ0FBQztBQUFBLGdCQUNqQyxXQUFXLE1BQU0sR0FBRztBQUdsQix5QkFBTyxHQUFHLE1BQU0sVUFBVSxDQUFDO0FBQUEsZ0JBQzdCO0FBQUEsY0FDRixXQUFXLFVBQVUsUUFBUTtBQUMzQixvQkFBSSxLQUFLLFdBQVcsWUFBWSxDQUFDLE1BQU0sSUFBVTtBQUcvQyxrQ0FBZ0I7QUFBQSxnQkFDbEIsV0FBVyxNQUFNLEdBQUc7QUFHbEIsa0NBQWdCO0FBQUEsZ0JBQ2xCO0FBQUEsY0FDRjtBQUNBO0FBQUEsWUFDRjtBQUNBLGdCQUFJLFdBQVcsS0FBSyxXQUFXLFlBQVksQ0FBQztBQUM1QyxnQkFBSSxTQUFTLEdBQUcsV0FBVyxVQUFVLENBQUM7QUFDdEMsZ0JBQUksYUFBYTtBQUNmO0FBQUEscUJBQ08sYUFBYTtBQUNwQiw4QkFBZ0I7QUFBQSxVQUNwQjtBQUVBLGNBQUksTUFBTTtBQUdWLGVBQUssSUFBSSxZQUFZLGdCQUFnQixHQUFHLEtBQUssU0FBUyxFQUFFLEdBQUc7QUFDekQsZ0JBQUksTUFBTSxXQUFXLEtBQUssV0FBVyxDQUFDLE1BQU0sSUFBVTtBQUNwRCxrQkFBSSxJQUFJLFdBQVc7QUFDakIsdUJBQU87QUFBQTtBQUVQLHVCQUFPO0FBQUEsWUFDWDtBQUFBLFVBQ0Y7QUFJQSxjQUFJLElBQUksU0FBUztBQUNmLG1CQUFPLE1BQU0sR0FBRyxNQUFNLFVBQVUsYUFBYTtBQUFBLGVBQzFDO0FBQ0gsdUJBQVc7QUFDWCxnQkFBSSxHQUFHLFdBQVcsT0FBTyxNQUFNO0FBQzdCLGdCQUFFO0FBQ0osbUJBQU8sR0FBRyxNQUFNLE9BQU87QUFBQSxVQUN6QjtBQUFBLFFBQ0Y7QUFBQSxRQUVBLFdBQVcsU0FBUyxVQUFVLE1BQU07QUFDbEMsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFFQSxTQUFTLFNBQVMsUUFBUSxNQUFNO0FBQzlCLHFCQUFXLElBQUk7QUFDZixjQUFJLEtBQUssV0FBVyxFQUFHLFFBQU87QUFDOUIsY0FBSSxPQUFPLEtBQUssV0FBVyxDQUFDO0FBQzVCLGNBQUksVUFBVSxTQUFTO0FBQ3ZCLGNBQUksTUFBTTtBQUNWLGNBQUksZUFBZTtBQUNuQixtQkFBUyxJQUFJLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUc7QUFDekMsbUJBQU8sS0FBSyxXQUFXLENBQUM7QUFDeEIsZ0JBQUksU0FBUyxJQUFVO0FBQ25CLGtCQUFJLENBQUMsY0FBYztBQUNqQixzQkFBTTtBQUNOO0FBQUEsY0FDRjtBQUFBLFlBQ0YsT0FBTztBQUVQLDZCQUFlO0FBQUEsWUFDakI7QUFBQSxVQUNGO0FBRUEsY0FBSSxRQUFRLEdBQUksUUFBTyxVQUFVLE1BQU07QUFDdkMsY0FBSSxXQUFXLFFBQVEsRUFBRyxRQUFPO0FBQ2pDLGlCQUFPLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFBQSxRQUMxQjtBQUFBLFFBRUEsVUFBVSxTQUFTQyxVQUFTLE1BQU0sS0FBSztBQUNyQyxjQUFJLFFBQVEsVUFBYSxPQUFPLFFBQVEsU0FBVSxPQUFNLElBQUksVUFBVSxpQ0FBaUM7QUFDdkcscUJBQVcsSUFBSTtBQUVmLGNBQUksUUFBUTtBQUNaLGNBQUksTUFBTTtBQUNWLGNBQUksZUFBZTtBQUNuQixjQUFJO0FBRUosY0FBSSxRQUFRLFVBQWEsSUFBSSxTQUFTLEtBQUssSUFBSSxVQUFVLEtBQUssUUFBUTtBQUNwRSxnQkFBSSxJQUFJLFdBQVcsS0FBSyxVQUFVLFFBQVEsS0FBTSxRQUFPO0FBQ3ZELGdCQUFJLFNBQVMsSUFBSSxTQUFTO0FBQzFCLGdCQUFJLG1CQUFtQjtBQUN2QixpQkFBSyxJQUFJLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUc7QUFDckMsa0JBQUksT0FBTyxLQUFLLFdBQVcsQ0FBQztBQUM1QixrQkFBSSxTQUFTLElBQVU7QUFHbkIsb0JBQUksQ0FBQyxjQUFjO0FBQ2pCLDBCQUFRLElBQUk7QUFDWjtBQUFBLGdCQUNGO0FBQUEsY0FDRixPQUFPO0FBQ1Asb0JBQUkscUJBQXFCLElBQUk7QUFHM0IsaUNBQWU7QUFDZixxQ0FBbUIsSUFBSTtBQUFBLGdCQUN6QjtBQUNBLG9CQUFJLFVBQVUsR0FBRztBQUVmLHNCQUFJLFNBQVMsSUFBSSxXQUFXLE1BQU0sR0FBRztBQUNuQyx3QkFBSSxFQUFFLFdBQVcsSUFBSTtBQUduQiw0QkFBTTtBQUFBLG9CQUNSO0FBQUEsa0JBQ0YsT0FBTztBQUdMLDZCQUFTO0FBQ1QsMEJBQU07QUFBQSxrQkFDUjtBQUFBLGdCQUNGO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFFQSxnQkFBSSxVQUFVLElBQUssT0FBTTtBQUFBLHFCQUEwQixRQUFRLEdBQUksT0FBTSxLQUFLO0FBQzFFLG1CQUFPLEtBQUssTUFBTSxPQUFPLEdBQUc7QUFBQSxVQUM5QixPQUFPO0FBQ0wsaUJBQUssSUFBSSxLQUFLLFNBQVMsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHO0FBQ3JDLGtCQUFJLEtBQUssV0FBVyxDQUFDLE1BQU0sSUFBVTtBQUdqQyxvQkFBSSxDQUFDLGNBQWM7QUFDakIsMEJBQVEsSUFBSTtBQUNaO0FBQUEsZ0JBQ0Y7QUFBQSxjQUNGLFdBQVcsUUFBUSxJQUFJO0FBR3ZCLCtCQUFlO0FBQ2Ysc0JBQU0sSUFBSTtBQUFBLGNBQ1o7QUFBQSxZQUNGO0FBRUEsZ0JBQUksUUFBUSxHQUFJLFFBQU87QUFDdkIsbUJBQU8sS0FBSyxNQUFNLE9BQU8sR0FBRztBQUFBLFVBQzlCO0FBQUEsUUFDRjtBQUFBLFFBRUEsU0FBUyxTQUFTLFFBQVEsTUFBTTtBQUM5QixxQkFBVyxJQUFJO0FBQ2YsY0FBSSxXQUFXO0FBQ2YsY0FBSSxZQUFZO0FBQ2hCLGNBQUksTUFBTTtBQUNWLGNBQUksZUFBZTtBQUduQixjQUFJLGNBQWM7QUFDbEIsbUJBQVMsSUFBSSxLQUFLLFNBQVMsR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHO0FBQ3pDLGdCQUFJLE9BQU8sS0FBSyxXQUFXLENBQUM7QUFDNUIsZ0JBQUksU0FBUyxJQUFVO0FBR25CLGtCQUFJLENBQUMsY0FBYztBQUNqQiw0QkFBWSxJQUFJO0FBQ2hCO0FBQUEsY0FDRjtBQUNBO0FBQUEsWUFDRjtBQUNGLGdCQUFJLFFBQVEsSUFBSTtBQUdkLDZCQUFlO0FBQ2Ysb0JBQU0sSUFBSTtBQUFBLFlBQ1o7QUFDQSxnQkFBSSxTQUFTLElBQVU7QUFFbkIsa0JBQUksYUFBYTtBQUNmLDJCQUFXO0FBQUEsdUJBQ0osZ0JBQWdCO0FBQ3ZCLDhCQUFjO0FBQUEsWUFDcEIsV0FBVyxhQUFhLElBQUk7QUFHMUIsNEJBQWM7QUFBQSxZQUNoQjtBQUFBLFVBQ0Y7QUFFQSxjQUFJLGFBQWEsTUFBTSxRQUFRO0FBQUEsVUFFM0IsZ0JBQWdCO0FBQUEsVUFFaEIsZ0JBQWdCLEtBQUssYUFBYSxNQUFNLEtBQUssYUFBYSxZQUFZLEdBQUc7QUFDM0UsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU8sS0FBSyxNQUFNLFVBQVUsR0FBRztBQUFBLFFBQ2pDO0FBQUEsUUFFQSxRQUFRLFNBQVMsT0FBTyxZQUFZO0FBQ2xDLGNBQUksZUFBZSxRQUFRLE9BQU8sZUFBZSxVQUFVO0FBQ3pELGtCQUFNLElBQUksVUFBVSxxRUFBcUUsT0FBTyxVQUFVO0FBQUEsVUFDNUc7QUFDQSxpQkFBTyxRQUFRLEtBQUssVUFBVTtBQUFBLFFBQ2hDO0FBQUEsUUFFQSxPQUFPLFNBQVMsTUFBTSxNQUFNO0FBQzFCLHFCQUFXLElBQUk7QUFFZixjQUFJLE1BQU0sRUFBRSxNQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSSxLQUFLLElBQUksTUFBTSxHQUFHO0FBQzNELGNBQUksS0FBSyxXQUFXLEVBQUcsUUFBTztBQUM5QixjQUFJLE9BQU8sS0FBSyxXQUFXLENBQUM7QUFDNUIsY0FBSSxhQUFhLFNBQVM7QUFDMUIsY0FBSTtBQUNKLGNBQUksWUFBWTtBQUNkLGdCQUFJLE9BQU87QUFDWCxvQkFBUTtBQUFBLFVBQ1YsT0FBTztBQUNMLG9CQUFRO0FBQUEsVUFDVjtBQUNBLGNBQUksV0FBVztBQUNmLGNBQUksWUFBWTtBQUNoQixjQUFJLE1BQU07QUFDVixjQUFJLGVBQWU7QUFDbkIsY0FBSSxJQUFJLEtBQUssU0FBUztBQUl0QixjQUFJLGNBQWM7QUFHbEIsaUJBQU8sS0FBSyxPQUFPLEVBQUUsR0FBRztBQUN0QixtQkFBTyxLQUFLLFdBQVcsQ0FBQztBQUN4QixnQkFBSSxTQUFTLElBQVU7QUFHbkIsa0JBQUksQ0FBQyxjQUFjO0FBQ2pCLDRCQUFZLElBQUk7QUFDaEI7QUFBQSxjQUNGO0FBQ0E7QUFBQSxZQUNGO0FBQ0YsZ0JBQUksUUFBUSxJQUFJO0FBR2QsNkJBQWU7QUFDZixvQkFBTSxJQUFJO0FBQUEsWUFDWjtBQUNBLGdCQUFJLFNBQVMsSUFBVTtBQUVuQixrQkFBSSxhQUFhLEdBQUksWUFBVztBQUFBLHVCQUFXLGdCQUFnQixFQUFHLGVBQWM7QUFBQSxZQUM5RSxXQUFXLGFBQWEsSUFBSTtBQUc1Qiw0QkFBYztBQUFBLFlBQ2hCO0FBQUEsVUFDRjtBQUVBLGNBQUksYUFBYSxNQUFNLFFBQVE7QUFBQSxVQUUvQixnQkFBZ0I7QUFBQSxVQUVoQixnQkFBZ0IsS0FBSyxhQUFhLE1BQU0sS0FBSyxhQUFhLFlBQVksR0FBRztBQUN2RSxnQkFBSSxRQUFRLElBQUk7QUFDZCxrQkFBSSxjQUFjLEtBQUssV0FBWSxLQUFJLE9BQU8sSUFBSSxPQUFPLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFBQSxrQkFBTyxLQUFJLE9BQU8sSUFBSSxPQUFPLEtBQUssTUFBTSxXQUFXLEdBQUc7QUFBQSxZQUNsSTtBQUFBLFVBQ0YsT0FBTztBQUNMLGdCQUFJLGNBQWMsS0FBSyxZQUFZO0FBQ2pDLGtCQUFJLE9BQU8sS0FBSyxNQUFNLEdBQUcsUUFBUTtBQUNqQyxrQkFBSSxPQUFPLEtBQUssTUFBTSxHQUFHLEdBQUc7QUFBQSxZQUM5QixPQUFPO0FBQ0wsa0JBQUksT0FBTyxLQUFLLE1BQU0sV0FBVyxRQUFRO0FBQ3pDLGtCQUFJLE9BQU8sS0FBSyxNQUFNLFdBQVcsR0FBRztBQUFBLFlBQ3RDO0FBQ0EsZ0JBQUksTUFBTSxLQUFLLE1BQU0sVUFBVSxHQUFHO0FBQUEsVUFDcEM7QUFFQSxjQUFJLFlBQVksRUFBRyxLQUFJLE1BQU0sS0FBSyxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQUEsbUJBQVcsV0FBWSxLQUFJLE1BQU07QUFFekYsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFFQSxLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsUUFDUCxPQUFPO0FBQUEsTUFDVDtBQUVBLFlBQU0sUUFBUTtBQUVkLGFBQU8sVUFBVTtBQUFBO0FBQUE7OztBQzlnQlYsTUFBTSxrQkFBTixNQUFzQjtBQUFBLElBR3pCLE9BQWMsWUFBWSxVQUEyQjtBQUNqRCxXQUFLLFdBQVc7QUFBQSxJQUNwQjtBQUFBLElBRUEsV0FBa0IsVUFBcUI7QUFDbkMsVUFBSSxDQUFDLEtBQUssVUFBVTtBQUNoQixjQUFNLElBQUksTUFBTSxxRUFBcUU7QUFBQSxNQUN6RjtBQUNBLGFBQU8sS0FBSztBQUFBLElBQ2hCO0FBQUEsRUFDSjtBQVpJLGdCQURTLGlCQUNNOzs7QUNIbkI7OztBQ0FBLFdBQVMsRUFBRSxHQUFHO0FBQ1osTUFBRSxlQUFlLFVBQVUsSUFBSTtBQUFBLE1BQzdCLENBQUM7QUFBQSxNQUNEO0FBQUEsUUFDRSxJQUFJLEdBQUcsR0FBRztBQUNSLGlCQUFPLElBQUksTUFBTSxDQUFDLEdBQUc7QUFBQSxZQUNuQixJQUFJLEdBQUcsR0FBRztBQUNSLHFCQUFPLENBQUMsR0FBRyxHQUFHLE1BQU07QUFDbEIsc0JBQU0sSUFBSSxFQUFFLFVBQVUsUUFBUSxDQUFDO0FBQy9CLG9CQUFJLE1BQU0sUUFBUTtBQUNoQixvQkFBRSxJQUFJLE1BQU0sb0JBQW9CLENBQUMsWUFBWSxDQUFDO0FBQzlDO0FBQUEsZ0JBQ0Y7QUFDQSxvQkFBSSxPQUFPLEVBQUUsQ0FBQyxLQUFLLFlBQVk7QUFDN0Isb0JBQUUsSUFBSSxNQUFNLFVBQVUsQ0FBQyxrQ0FBa0MsQ0FBQyxFQUFFLENBQUM7QUFDN0Q7QUFBQSxnQkFDRjtBQUNBLGlCQUFDLFlBQVk7QUFDWCxzQkFBSTtBQUNGLDBCQUFNLElBQUksTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3RCLHNCQUFFLENBQUM7QUFBQSxrQkFDTCxTQUFTLEdBQUc7QUFDVixzQkFBRSxDQUFDO0FBQUEsa0JBQ0w7QUFBQSxnQkFDRixHQUFHO0FBQUEsY0FDTDtBQUFBLFlBQ0Y7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0EsV0FBUyxFQUFFLEdBQUc7QUFDWixNQUFFLGVBQWUsVUFBVSxJQUFJO0FBQUEsTUFDN0IsQ0FBQztBQUFBLE1BQ0Q7QUFBQSxRQUNFLElBQUksR0FBRyxHQUFHO0FBQ1IsaUJBQU8sRUFBRSxRQUFRLFFBQVEsQ0FBQztBQUFBLFFBQzVCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0EsV0FBUyxFQUFFLElBQUksT0FBSTtBQUNqQixXQUFPLFNBQVMsUUFBUSxPQUFPLGlCQUFpQixPQUFPLGtCQUFrQixDQUFDLEdBQUcsT0FBTyxjQUFjLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxJQUFJLE9BQU8sWUFBWSxVQUFVLEVBQUUsTUFBTTtBQUFBLEVBQ3BLOzs7QURqQ0E7QUFOQSxNQUFNLGFBQWEsZUFBaUMsY0FBYztJQUNoRSxLQUFLLE1BQU0sd0RBQWdCLEtBQUssQ0FBQyxNQUFNLElBQUksRUFBRSxjQUFhLENBQUU7R0FDN0Q7QUFFRCxJQUFhOzs7QUVUYjtBQUlBLE1BQU1DLFdBQVUsZUFBOEIsV0FBVztJQUN2RCxLQUFLLE1BQU0sMERBQWdCLEtBQUssQ0FBQyxNQUFNLElBQUksRUFBRSxXQUFVLENBQUU7R0FDMUQ7OztBQ0ZNLE1BQU0sb0JBQU4sTUFBNkM7QUFBQSxJQUE3QztBQUNILGdDQUFrQjtBQUFBO0FBQUEsSUFFbEIsTUFBTSxTQUFTLE1BQStCO0FBQzFDLFlBQU0sU0FBUyxNQUFNLFdBQVcsU0FBUztBQUFBLFFBQ3JDO0FBQUEsUUFDQSxXQUFXLFVBQVU7QUFBQSxRQUNyQixVQUFVLFNBQVM7QUFBQSxNQUN2QixDQUFDO0FBQ0QsYUFBTyxPQUFPO0FBQUEsSUFDbEI7QUFBQSxJQUVBLE1BQU0sVUFBVSxNQUFjLFNBQWdDO0FBQzFELFlBQU0sV0FBVyxVQUFVO0FBQUEsUUFDdkI7QUFBQSxRQUNBLE1BQU07QUFBQSxRQUNOLFdBQVcsVUFBVTtBQUFBLFFBQ3JCLFVBQVUsU0FBUztBQUFBLE1BQ3ZCLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFFQSxNQUFNLFFBQVEsTUFBaUM7QUFDM0MsWUFBTSxTQUFTLE1BQU0sV0FBVyxRQUFRO0FBQUEsUUFDcEM7QUFBQSxRQUNBLFdBQVcsVUFBVTtBQUFBLE1BQ3pCLENBQUM7QUFFRCxhQUFPLE9BQU8sTUFBTSxJQUFJLENBQUFDLE9BQUtBLEdBQUUsSUFBSTtBQUFBLElBQ3ZDO0FBQUEsSUFFQSxNQUFNLE9BQU8sTUFBZ0M7QUFDekMsVUFBSTtBQUNBLGNBQU0sV0FBVyxLQUFLO0FBQUEsVUFDbEI7QUFBQSxVQUNBLFdBQVcsVUFBVTtBQUFBLFFBQ3pCLENBQUM7QUFDRCxlQUFPO0FBQUEsTUFDWCxRQUFRO0FBQ0osZUFBTztBQUFBLE1BQ1g7QUFBQSxJQUNKO0FBQUEsSUFFQSxNQUFNLE9BQU8sTUFBNkI7QUFDdEMsWUFBTSxXQUFXLFdBQVc7QUFBQSxRQUN4QjtBQUFBLFFBQ0EsV0FBVyxVQUFVO0FBQUEsTUFDekIsQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUVBLE1BQU0sTUFBTSxNQUE2QjtBQUNyQyxVQUFJO0FBQ0EsY0FBTSxXQUFXLE1BQU07QUFBQSxVQUNuQjtBQUFBLFVBQ0EsV0FBVyxVQUFVO0FBQUEsVUFDckIsV0FBVztBQUFBLFFBQ2YsQ0FBQztBQUFBLE1BQ0wsU0FBUyxHQUFHO0FBQUEsTUFFWjtBQUFBLElBQ0o7QUFBQSxJQUVBLE1BQU0sS0FBSyxNQUFpQztBQUN4QyxZQUFNLE9BQU8sTUFBTSxXQUFXLEtBQUs7QUFBQSxRQUMvQjtBQUFBLFFBQ0EsV0FBVyxVQUFVO0FBQUEsTUFDekIsQ0FBQztBQUNELGFBQU87QUFBQSxRQUNILFFBQVEsS0FBSyxTQUFTO0FBQUEsUUFDdEIsYUFBYSxLQUFLLFNBQVM7QUFBQSxNQUMvQjtBQUFBLElBQ0o7QUFBQSxJQUVBLE1BQU0sU0FBUyxNQUE2QjtBQUN4QyxjQUFRLElBQUksdUNBQXVDLElBQUk7QUFBQSxJQUMzRDtBQUFBLElBRUEsTUFBTSxhQUFhLEtBQTRCO0FBQzNDLFlBQU1DLFNBQVEsS0FBSyxFQUFFLElBQUksQ0FBQztBQUFBLElBQzlCO0FBQUEsSUFFQSxnQkFBd0I7QUFDcEIsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUVBLGlCQUF5QjtBQUNyQixhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsa0JBQTBCO0FBQ3RCLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxNQUFNLE9BQXNCO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxLQUFLLGNBQWMsQ0FBQyxHQUFHO0FBQzFDLGNBQU0sS0FBSyxNQUFNLEtBQUssY0FBYyxDQUFDO0FBQUEsTUFDekM7QUFDQSxVQUFJLENBQUMsTUFBTSxLQUFLLE9BQU8sS0FBSyxlQUFlLENBQUMsR0FBRztBQUMzQyxjQUFNLEtBQUssTUFBTSxLQUFLLGVBQWUsQ0FBQztBQUFBLE1BQzFDO0FBQUEsSUFDSjtBQUFBLEVBQ0o7OztBQ3hHQSx3QkFBc0M7OztBQ0F0QyxNQUFNLGdCQUFOLE1BQW9CO0FBQUEsSUFDaEIsS0FBSyxZQUFvQixNQUFhO0FBQ2xDLGNBQVEsS0FBSyxVQUFVLE9BQU8sSUFBSSxHQUFHLElBQUk7QUFBQSxJQUM3QztBQUFBLElBQ0EsS0FBSyxZQUFvQixNQUFhO0FBQ2xDLGNBQVEsS0FBSyxVQUFVLE9BQU8sSUFBSSxHQUFHLElBQUk7QUFBQSxJQUM3QztBQUFBLElBQ0EsTUFBTSxZQUFvQixNQUFhO0FBQ25DLGNBQVEsTUFBTSxXQUFXLE9BQU8sSUFBSSxHQUFHLElBQUk7QUFBQSxJQUMvQztBQUFBLEVBQ0o7QUFFQSxNQUFNLFNBQVMsSUFBSSxjQUFjO0FBRTFCLFdBQVMsVUFBVSxPQUFlO0FBQ3JDLFdBQU87QUFBQSxFQUNYO0FBRUEsTUFBTyx5QkFBUTs7O0FDWFIsTUFBTSxZQUFZO0FBQUEsSUFDckIsb0JBQW9CO0FBQUEsSUFDcEIsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsSUFDaEIsZUFBZTtBQUFBLElBQ2Ysa0JBQWtCO0FBQUEsSUFDbEIsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1Ysa0JBQWtCO0FBQUEsSUFDbEIsa0JBQWtCO0FBQUEsSUFDbEIsaUJBQWlCO0FBQUEsSUFDakIsa0JBQWtCO0FBQUEsSUFDbEIsZ0JBQWdCO0FBQUEsSUFDaEIsaUJBQWlCO0FBQUEsSUFDakIsd0JBQXdCO0FBQUEsSUFDeEIsdUJBQXVCO0FBQUEsSUFDdkIsdUJBQXVCO0FBQUEsSUFDdkIsaUJBQWlCO0FBQUEsSUFDakIsZ0JBQWdCO0FBQUEsSUFDaEIsa0JBQWtCO0FBQUEsSUFDbEIsaUJBQWlCO0FBQUEsSUFDakIsY0FBYztBQUFBLElBQ2QsZ0JBQWdCO0FBQUEsSUFDaEIsWUFBWTtBQUFBLElBQ1osaUJBQWlCO0FBQUEsRUFDckI7QUFHTyxNQUFNLFVBQVU7QUFBQSxJQUNuQixRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxRQUFRO0FBQUEsSUFDUixrQkFBa0I7QUFBQSxJQUNsQixVQUFVO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxJQUNoQixrQkFBa0I7QUFBQSxJQUNsQixTQUFTO0FBQUEsRUFDYjtBQUdPLE1BQU0sZUFBZTtBQUFBLElBQ3hCLGlCQUFpQjtBQUFBLElBQ2pCLGVBQWU7QUFBQSxJQUNmLGFBQWE7QUFBQSxJQUNiLDBCQUEwQjtBQUFBLEVBQzlCO0FBZ0JPLE1BQU0sa0JBQWtCO0FBQUEsSUFDM0IsT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBLEVBQ1o7QUFHTyxNQUFNLE9BQU87QUFBQSxJQUNoQixhQUFhO0FBQUEsSUFDYix1QkFBdUI7QUFBQSxJQUN2QixVQUFVO0FBQUEsSUFDVixlQUFlO0FBQUEsSUFDZixjQUFjO0FBQUEsSUFDZCxlQUFlO0FBQUEsSUFDZiw0QkFBNEI7QUFBQSxFQUNoQztBQW1DTyxNQUFNLFdBQVc7QUFBQSxJQUNwQixjQUFjO0FBQUEsSUFDZCxvQkFBb0I7QUFBQSxJQUNwQix3QkFBd0I7QUFBQSxJQUN4QixxQkFBcUI7QUFBQSxJQUNyQiwwQkFBMEI7QUFBQSxJQUMxQix1QkFBdUI7QUFBQSxFQUMzQjs7O0FDN0hBOzs7QUNBQTs7O0FDQUE7OztBQ0FBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUNBQTs7O0FDQUE7OztBQ09BLE1BQU0sWUFBb0M7QUFBQSxJQUN0QyxZQUFZO0FBQUEsSUFDWixhQUFhO0FBQUEsSUFDYixrQkFBa0I7QUFBQSxJQUNsQixpQkFBaUI7QUFBQSxJQUNqQixZQUFZO0FBQUEsSUFDWixhQUFhO0FBQUEsRUFDakI7QUFFQSxNQUFNLGdCQUFOLE1BQW9CO0FBQUEsSUFDaEIsT0FBYyxLQUFLLEtBQWEsTUFBc0I7QUFFbEQsYUFBTyxVQUFVLElBQUksS0FBSztBQUFBLElBQzlCO0FBQUEsRUFDSjtBQUVBLE1BQU8sZ0NBQVE7OztBQ3JCZixpQkFBc0IsaUJBQWlCLElBQVksT0FBZSxTQUFpQixRQUFzRDtBQUNySSxVQUFNLFdBQVcsOEJBQWMsS0FBSyxLQUFXLE9BQU87QUFDdEQsUUFBSTtBQUVKLFlBQU8sUUFBUTtBQUFBLE1BQ1gsS0FBSztBQUNELHNCQUFjO0FBQ2Q7QUFBQSxNQUNKLEtBQUs7QUFDRCxzQkFBYztBQUNkO0FBQUEsTUFDSixLQUFLO0FBQ0Qsc0JBQWM7QUFDZDtBQUFBLElBQ1I7QUFFQSxXQUFPLFNBQ0YsUUFBUSxZQUFZLEVBQUUsRUFDdEIsUUFBUSxlQUFlLEtBQUssRUFDNUIsUUFBUSxpQkFBaUIsT0FBTyxFQUNoQyxRQUFRLGdCQUFnQixXQUFXO0FBQUEsRUFDNUM7OztBVmxCQSxNQUFNLFdBQU4sTUFBTSxTQUFRO0FBQUEsSUFJRixjQUFjO0FBRnRCLDBCQUFRLGNBQW1DO0FBQUEsSUFFcEI7QUFBQSxJQUV2QixPQUFPLGNBQXVCO0FBQzFCLFVBQUksQ0FBQyxTQUFRLFVBQVU7QUFDbkIsaUJBQVEsV0FBVyxJQUFJLFNBQVE7QUFBQSxNQUNuQztBQUNBLGFBQU8sU0FBUTtBQUFBLElBQ25CO0FBQUEsSUFFQSxjQUFjLFlBQWlDO0FBQzNDLFdBQUssYUFBYTtBQUFBLElBQ3RCO0FBQUEsSUFFQSxNQUFNLFVBQ0YsV0FDQSxPQUNBLFNBQ0EsU0FDZTtBQUNmLFlBQU0sVUFBc0M7QUFBQSxRQUN4QyxNQUFNO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUVBLFVBQUk7QUFDQSxjQUFNLFdBQVcsTUFBTSx1QkFBTyxlQUFlLEtBQUssWUFBYSxPQUFPO0FBQ3RFLGVBQU8sU0FBUztBQUFBLE1BQ3BCLFNBQVMsT0FBTztBQUNaLCtCQUFPLE1BQU0sNkJBQThCLE1BQWdCLE9BQU87QUFDbEUsZUFBTztBQUFBLE1BQ1g7QUFBQSxJQUNKO0FBQUEsSUFFQSxXQUFXLFVBQWtCLFVBQWtCLFNBQVMsY0FBZ0M7QUFDcEYsYUFBTyxJQUFJLFFBQVEsQ0FBQ0MsVUFBUyxXQUFXO0FBQ3BDLGNBQU0sa0JBQWtCLFNBQVMsY0FBYyxRQUFRO0FBQ3ZELFlBQUksaUJBQWlCO0FBQ2pCLGlCQUFPQSxTQUFRLGVBQWU7QUFBQSxRQUNsQztBQUVBLGNBQU0sV0FBVyxJQUFJLGlCQUFpQixNQUFNO0FBQ3hDLGdCQUFNLFVBQVUsU0FBUyxjQUFjLFFBQVE7QUFDL0MsY0FBSSxTQUFTO0FBQ1QscUJBQVMsV0FBVztBQUNwQixZQUFBQSxTQUFRLE9BQU87QUFBQSxVQUNuQjtBQUFBLFFBQ0osQ0FBQztBQUVELGlCQUFTLFFBQVEsU0FBUyxNQUFNO0FBQUEsVUFDNUIsV0FBVztBQUFBLFVBQ1gsU0FBUztBQUFBLFFBQ2IsQ0FBQztBQUVELG1CQUFXLE1BQU07QUFDYixtQkFBUyxXQUFXO0FBQ3BCLGlCQUFPLElBQUksTUFBTSw4Q0FBOEMsUUFBUSxFQUFFLENBQUM7QUFBQSxRQUM5RSxHQUFHLE9BQU87QUFBQSxNQUNkLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFFQSxrQkFBa0IsT0FBZSxVQUFrQixTQUFTLGNBQTZCO0FBQ3JGLGFBQU8sSUFBSSxRQUFRLENBQUNBLFVBQVMsV0FBVztBQUNwQyxjQUFNLGdCQUFnQixNQUFtQjtBQUNyQyxnQkFBTSxTQUFTLFNBQVM7QUFBQSxZQUNwQjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQSxZQUFZO0FBQUEsWUFDWjtBQUFBLFVBQ0o7QUFDQSxpQkFBTyxPQUFPO0FBQUEsUUFDbEI7QUFFQSxjQUFNLGtCQUFrQixjQUFjO0FBQ3RDLFlBQUksaUJBQWlCO0FBQ2pCLGlCQUFPQSxTQUFRLGVBQWU7QUFBQSxRQUNsQztBQUVBLGNBQU0sV0FBVyxJQUFJLGlCQUFpQixNQUFNO0FBQ3hDLGdCQUFNLFVBQVUsY0FBYztBQUM5QixjQUFJLFNBQVM7QUFDVCxxQkFBUyxXQUFXO0FBQ3BCLFlBQUFBLFNBQVEsT0FBTztBQUFBLFVBQ25CO0FBQUEsUUFDSixDQUFDO0FBRUQsaUJBQVMsUUFBUSxTQUFTLE1BQU07QUFBQSxVQUM1QixXQUFXO0FBQUEsVUFDWCxTQUFTO0FBQUEsUUFDYixDQUFDO0FBRUQsbUJBQVcsTUFBTTtBQUNiLG1CQUFTLFdBQVc7QUFDcEIsaUJBQU8sSUFBSSxNQUFNLDJDQUEyQyxLQUFLLEVBQUUsQ0FBQztBQUFBLFFBQ3hFLEdBQUcsT0FBTztBQUFBLE1BQ2QsQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUVBLG1CQUFtQixVQUFrQixTQUFTLGNBQStCO0FBQ3pFLGFBQU8sSUFBSSxRQUFRLENBQUNBLFVBQVMsV0FBVztBQUNwQyxjQUFNLGNBQWMsU0FBUyxjQUFjLE1BQU07QUFDakQsWUFBSSxDQUFDLGFBQWE7QUFDZCxpQkFBTyxPQUFPLElBQUksTUFBTSx3QkFBd0IsQ0FBQztBQUFBLFFBQ3JEO0FBRUEsY0FBTSxXQUFXLElBQUksaUJBQWlCLE1BQU07QUFDeEMsbUJBQVMsV0FBVztBQUNwQixVQUFBQSxTQUFRLFNBQVMsS0FBSztBQUFBLFFBQzFCLENBQUM7QUFFRCxpQkFBUyxRQUFRLGFBQWE7QUFBQSxVQUMxQixTQUFTO0FBQUEsVUFDVCxXQUFXO0FBQUEsUUFDZixDQUFDO0FBRUQsbUJBQVcsTUFBTTtBQUNiLG1CQUFTLFdBQVc7QUFDcEIsaUJBQU8sSUFBSSxNQUFNLDhDQUE4QyxDQUFDO0FBQUEsUUFDcEUsR0FBRyxPQUFPO0FBQUEsTUFDZCxDQUFDO0FBQUEsSUFDTDtBQUFBLElBRUEsTUFBYSxZQUFZLFNBQWlCLE9BQWUsU0FBaUIsUUFBcUMsWUFBbUIsS0FBTTtBQUNwSSxZQUFNLFdBQVcsTUFBTSxpQkFBaUIsU0FBUyxPQUFPLFNBQVMsTUFBTTtBQUN2RSxZQUFNLGlCQUFpQixTQUFTLGNBQWMsVUFBVSxlQUFlO0FBQ3ZFLFVBQUcsZ0JBQWdCO0FBQ2YsdUJBQWUsYUFBYTtBQUU1QixtQkFBVyxNQUFNO0FBQ2IsbUJBQVMsZUFBZSxPQUFPLEdBQUcsT0FBTztBQUFBLFFBQzdDLEdBQUcsU0FBUztBQUFBLE1BQ2hCO0FBQUEsSUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9PLE1BQU0sSUFBOEI7QUFDdkMsYUFBTyxJQUFJLFFBQVEsQ0FBQ0EsVUFBUyxXQUFXO0FBQ3BDLFlBQUk7QUFDQSxnQkFBTSxZQUFZO0FBQ2xCLGdCQUFNLFNBQVMsU0FBUyxjQUFjLFFBQVE7QUFFOUMsZ0JBQU0sVUFBVSxDQUFDLFNBQWdCO0FBQzdCLG1CQUFPLE9BQU87QUFDZCxZQUFBQSxTQUFTLEtBQXFCLE1BQU07QUFBQSxVQUN4QztBQUVBLGlCQUFPLGlCQUFpQixXQUFXLFNBQVMsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUUxRCxpQkFBTyxLQUFLO0FBQ1osaUJBQU87QUFBQSxZQUNILFNBQVMsZUFBZTtBQUFBO0FBQUEsdUNBRUwsRUFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBLHdFQUkrQixTQUFTO0FBQUE7QUFBQTtBQUFBLG9FQUdiLFNBQVM7QUFBQTtBQUFBLHFCQUV4RDtBQUFBLFVBQ0w7QUFFQSxtQkFBUyxLQUFLLFlBQVksTUFBTTtBQUFBLFFBQ3BDLFNBQVMsS0FBSztBQUNWLGlCQUFPLEdBQUc7QUFBQSxRQUNkO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDTDtBQUFBLElBRU8sa0JBQWtCLE1BQTJCO0FBQ2hELGFBQU8sU0FBUztBQUFBLFFBQ1o7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0EsWUFBWTtBQUFBLFFBQ1o7QUFBQSxNQUNKLEVBQUU7QUFBQSxJQUNOO0FBQUEsSUFFTyxtQkFBbUIsS0FBcUI7QUFDM0MsWUFBTSxRQUFRLElBQUksTUFBTSxHQUFHO0FBQzNCLGFBQU8sTUFBTSxNQUFNLFNBQVMsQ0FBQyxLQUFLO0FBQUEsSUFDdEM7QUFBQSxJQUVPLFdBQVcsU0FBeUI7QUFDdkMsWUFBTSxRQUFRLEtBQUssTUFBTSxVQUFVLElBQUk7QUFDdkMsWUFBTSxVQUFVLEtBQUssTUFBTyxVQUFVLE9BQVEsRUFBRTtBQUNoRCxZQUFNLG1CQUFtQixLQUFLLE1BQU0sVUFBVSxFQUFFO0FBRWhELGFBQU8sR0FBRyxPQUFPLEtBQUssRUFBRSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksT0FBTyxPQUFPLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLE9BQU8sZ0JBQWdCLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUFBLElBQzdIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1PLGVBQWUsVUFBa0IsVUFBMkI7QUFDL0QsWUFBTSxZQUFZLENBQUMsTUFDZixFQUFFLFFBQVEsTUFBTSxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsSUFBSSxPQUFLLFNBQVMsR0FBRyxFQUFFLEtBQUssQ0FBQztBQUVoRSxZQUFNLFVBQVUsVUFBVSxRQUFRO0FBQ2xDLFlBQU0sVUFBVSxVQUFVLFFBQVE7QUFDbEMsWUFBTSxZQUFZLEtBQUssSUFBSSxRQUFRLFFBQVEsUUFBUSxNQUFNO0FBRXpELGVBQVMsSUFBSSxHQUFHLElBQUksV0FBVyxLQUFLO0FBQ2hDLGNBQU0sS0FBSyxRQUFRLENBQUMsS0FBSztBQUN6QixjQUFNLEtBQUssUUFBUSxDQUFDLEtBQUs7QUFDekIsWUFBSSxLQUFLLEdBQUksUUFBTztBQUNwQixZQUFJLEtBQUssR0FBSSxRQUFPO0FBQUEsTUFDeEI7QUFDQSxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUEvTkksZ0JBREUsVUFDYTtBQURuQixNQUFNLFVBQU47QUFrT0EsTUFBTSxrQkFBa0IsUUFBUSxZQUFZO0FBRTVDLE1BQU8sa0JBQVE7OztBV3RPUixXQUFTLHNCQUNaLFVBQ0EsVUFDQSxTQUNNO0FBQ04sUUFBSSxXQUFXLDhCQUFjLEtBQUssS0FBVyxhQUFhO0FBRzFELFVBQU0sV0FBVyxDQUFDLFFBQVEsZUFBZSxVQUFVLFNBQVM7QUFDNUQsYUFBUyxRQUFRLFNBQU87QUFDcEIsWUFBTSxRQUFRLElBQUksT0FBTyxTQUFTLEdBQUcsVUFBVSxHQUFHO0FBQ2xELGlCQUFXLFNBQVMsUUFBUSxPQUFPLFNBQVMsR0FBRyxLQUFLLEVBQUU7QUFBQSxJQUMxRCxDQUFDO0FBRUQsV0FBTyxTQUNGLFFBQVEsaUJBQWlCLFVBQVUsWUFBWSxFQUFFLEVBQ2pELFFBQVEsMkJBQTJCLFFBQVE7QUFBQSxFQUNwRDs7O0FDakJPLFdBQVMscUJBQ1osVUFDQSxVQUNBLFNBQ007QUFDTixRQUFJLFdBQVcsOEJBQWMsS0FBSyxLQUFXLFlBQVk7QUFHekQsVUFBTSxXQUFXLENBQUMsUUFBUSxlQUFlLFVBQVUsU0FBUztBQUM1RCxhQUFTLFFBQVEsU0FBTztBQUNwQixZQUFNLFFBQVEsSUFBSSxPQUFPLFNBQVMsR0FBRyxVQUFVLEdBQUc7QUFDbEQsaUJBQVcsU0FBUyxRQUFRLE9BQU8sU0FBUyxHQUFHLEtBQUssRUFBRTtBQUFBLElBQzFELENBQUM7QUFFRCxXQUFPLFNBQ0YsUUFBUSxrQkFBa0IsVUFBVSxhQUFhLEVBQUUsRUFDbkQsUUFBUSwyQkFBMkIsUUFBUSxFQUMzQyxRQUFRLGVBQWUsVUFBVSxZQUFZLE9BQU8sRUFDcEQsUUFBUSxxQkFBcUIsVUFBVSxxQ0FBcUMsZ0NBQWdDO0FBQUEsRUFDckg7OztBQ3BCTyxXQUFTLGlCQUF5QjtBQUNyQyxXQUFPLDhCQUFjLEtBQUssS0FBVyxjQUFjO0FBQUEsRUFDdkQ7OztBQ0ZBLE1BQU0sYUFBTixNQUFpQjtBQUFBLElBR2IsV0FBa0IsZUFBdUI7QUFDckMsYUFBTyxnQkFBZ0IsUUFBUSxnQkFBZ0I7QUFBQSxJQUNuRDtBQUFBLElBRUEsV0FBa0IsYUFBcUI7QUFDbkMsYUFBTyxnQkFBZ0IsUUFBUSxjQUFjO0FBQUEsSUFDakQ7QUFBQSxJQUVBLFdBQWtCLGNBQXNCO0FBQ3BDLGFBQU8sZ0JBQWdCLFFBQVEsZUFBZTtBQUFBLElBQ2xEO0FBQUEsRUFHSjtBQWZJLGdCQURFLFlBQ1kscUJBQTRCO0FBYzFDLGdCQWZFLFlBZVkseUJBQXdCO0FBRzFDLE1BQU8scUJBQVE7OztBQ3BCUixXQUFTLHdCQUFnQztBQUM1QyxXQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQTRDWDs7O0FDckNBLG9CQUErQjs7O0FDaUJ4QixNQUFNLHlCQUF5QjtBQUFBLElBQ2xDO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSjtBQUVPLE1BQU0sb0JBQW9CO0FBQUEsSUFDN0I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSjs7O0FDakNBLE1BQU0sa0JBQU4sTUFBc0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS2xCLE9BQWUseUJBQXlCLFNBQWtDO0FBQ3RFLFlBQU0sYUFBYSxRQUFRLE1BQU0sc0JBQXNCO0FBQ3ZELFVBQUksQ0FBQyxXQUFZLFFBQU87QUFFeEIsWUFBTSxTQUE0QixDQUFDO0FBQ25DLFlBQU0sV0FBVztBQUVqQixpQkFBVyxDQUFDLEVBQUUsUUFBUSxRQUFRLEtBQUssV0FBVyxDQUFDLEVBQUUsU0FBUyxRQUFRLEdBQUc7QUFDakUsWUFBSSxDQUFDLGtCQUFrQixTQUFTLE1BQXFCLEVBQUc7QUFFeEQsY0FBTSxNQUFNO0FBRVosWUFBSSxPQUFPLEdBQUcsTUFBTSxPQUFXO0FBRS9CLGVBQU8sR0FBRyxJQUFJLFNBQVMsS0FBSztBQUFBLE1BQ2hDO0FBRUEsaUJBQVcsT0FBTyx3QkFBd0I7QUFDdEMsWUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFHLFFBQU87QUFBQSxNQUM3QjtBQUVBLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxPQUFjLHdCQUF3QixhQUFzQztBQUN4RSxZQUFNLFdBQVcsS0FBSyx5QkFBeUIsV0FBVztBQUUxRCxVQUFJLENBQUMsVUFBVTtBQUNYLCtCQUFPLE1BQU0sOENBQThDO0FBQUEsTUFDL0Q7QUFFQSxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFFQSxNQUFPLDBCQUFROzs7QUZwQ2YsTUFBTSxhQUFOLE1BQWlCO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNYixhQUFvQixXQUFXLFlBQW1DO0FBQzlELFVBQUksU0FBUyxlQUFlLFVBQVUsR0FBRztBQUNyQyxhQUFLLE9BQU8sS0FBSyxVQUFVLFVBQVUsb0JBQW9CO0FBQ3pEO0FBQUEsTUFDSjtBQUVBLFlBQU0saUJBQWEsa0JBQUssbUJBQVcsYUFBYSxVQUFVO0FBRTFELFVBQUksQ0FBQyxNQUFNLGdCQUFnQixRQUFRLE9BQU8sVUFBVSxHQUFHO0FBQ25ELGFBQUssT0FBTyxNQUFNLDBCQUEwQixVQUFVLEVBQUU7QUFDeEQ7QUFBQSxNQUNKO0FBRUEsWUFBTSxTQUFTLE1BQU0sZ0JBQWdCLFFBQVEsU0FBUyxVQUFVO0FBQ2hFLFlBQU0sU0FBUyxTQUFTLGNBQWMsUUFBUTtBQUM5QyxhQUFPLFlBQVk7QUFDbkIsYUFBTyxLQUFLO0FBRVosZUFBUyxLQUFLLFlBQVksTUFBTTtBQUVoQyxZQUFNLGlCQUEyQixLQUFLO0FBQUEsUUFDbEMsYUFBYSxRQUFRLGFBQWEsZUFBZSxLQUFLO0FBQUEsTUFDMUQ7QUFFQSxVQUFJLENBQUMsZUFBZSxTQUFTLFVBQVUsR0FBRztBQUN0Qyx1QkFBZSxLQUFLLFVBQVU7QUFDOUIscUJBQWEsUUFBUSxhQUFhLGlCQUFpQixLQUFLLFVBQVUsY0FBYyxDQUFDO0FBQUEsTUFDckY7QUFFQSxXQUFLLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVTtBQUFBLElBQ25EO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxPQUFjLGFBQWEsWUFBMEI7QUFDakQsWUFBTSxnQkFBZ0IsU0FBUyxlQUFlLFVBQVU7QUFDeEQsVUFBSSxlQUFlO0FBQ2Ysc0JBQWMsT0FBTztBQUFBLE1BQ3pCO0FBRUEsVUFBSSxpQkFBMkIsS0FBSztBQUFBLFFBQ2hDLGFBQWEsUUFBUSxhQUFhLGVBQWUsS0FBSztBQUFBLE1BQzFEO0FBQ0EsdUJBQWlCLGVBQWUsT0FBTyxDQUFDLE1BQWMsTUFBTSxVQUFVO0FBQ3RFLG1CQUFhLFFBQVEsYUFBYSxpQkFBaUIsS0FBSyxVQUFVLGNBQWMsQ0FBQztBQUVqRixXQUFLLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWTtBQUFBLElBQ3JEO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxhQUFvQixZQUFnRTtBQUNoRixZQUFNLFdBQVcsTUFBTSxNQUFNLEtBQUssUUFBUTtBQUMxQyxhQUFPLFNBQVMsS0FBSztBQUFBLElBQ3pCO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxhQUFvQixZQUFZLFNBQWlCLE1BQTJDO0FBQ3hGLFdBQUssT0FBTyxLQUFLLGVBQWUsSUFBSSxVQUFVLE9BQU8sRUFBRTtBQUV2RCxZQUFNLFdBQVcsTUFBTSxNQUFNLE9BQU87QUFDcEMsVUFBSSxDQUFDLFNBQVMsR0FBSSxPQUFNLElBQUksTUFBTSx1QkFBdUIsU0FBUyxNQUFNLElBQUksU0FBUyxVQUFVLEVBQUU7QUFFakcsWUFBTSxVQUFVLFNBQVMsV0FBVyxtQkFBVyxjQUFjLG1CQUFXO0FBQ3hFLFVBQUksQ0FBQyxNQUFNLGdCQUFnQixRQUFRLE9BQU8sT0FBTyxHQUFHO0FBQ2hELGNBQU0sZ0JBQWdCLFFBQVEsTUFBTSxPQUFPO0FBQUEsTUFDL0M7QUFFQSxZQUFNLGVBQVcsc0JBQVMsSUFBSSxJQUFJLE9BQU8sRUFBRSxRQUFRLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7QUFDN0UsWUFBTSxlQUFXLGtCQUFLLFNBQVMsUUFBUTtBQUV2QyxZQUFNLFVBQVUsTUFBTSxTQUFTLEtBQUs7QUFDcEMsWUFBTSxnQkFBZ0IsUUFBUSxVQUFVLFVBQVUsT0FBTztBQUV6RCxXQUFLLE9BQU8sS0FBSyxjQUFjLElBQUksY0FBYyxRQUFRLEVBQUU7QUFDM0QsYUFBTztBQUFBLElBQ1g7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLGFBQW9CLFVBQVUsVUFBa0IsTUFBeUM7QUFDckYsV0FBSyxPQUFPLEtBQUssWUFBWSxJQUFJLFVBQVUsUUFBUSxFQUFFO0FBRXJELGNBQVEsTUFBTTtBQUFBLFFBQ1YsS0FBSztBQUNELGNBQUksTUFBTSxLQUFLLGtCQUFrQixRQUFRLEdBQUc7QUFDeEMsa0JBQU0sZ0JBQWdCLFFBQVEsV0FBTyxrQkFBSyxtQkFBVyxhQUFhLFFBQVEsQ0FBQztBQUMzRSxnQkFBSSxpQkFBMkIsS0FBSztBQUFBLGNBQ2hDLGFBQWEsUUFBUSxhQUFhLGVBQWUsS0FBSztBQUFBLFlBQzFEO0FBQ0EsZ0JBQUksZUFBZSxTQUFTLFFBQVEsR0FBRztBQUNuQywrQkFBaUIsZUFBZSxPQUFPLENBQUMsTUFBYyxNQUFNLFFBQVE7QUFDcEUsMkJBQWEsUUFBUSxhQUFhLGlCQUFpQixLQUFLLFVBQVUsY0FBYyxDQUFDO0FBQUEsWUFDckY7QUFBQSxVQUNKO0FBQ0E7QUFBQSxRQUNKLEtBQUs7QUFDRCxjQUFJLE1BQU0sS0FBSyxpQkFBaUIsUUFBUSxHQUFHO0FBQ3ZDLGdCQUFJLGFBQWEsUUFBUSxhQUFhLGFBQWEsTUFBTSxVQUFVO0FBQy9ELDJCQUFhLFFBQVEsYUFBYSxlQUFlLFNBQVM7QUFBQSxZQUM5RDtBQUNBLHFCQUFTLGVBQWUsYUFBYSxHQUFHLE9BQU87QUFDL0Msa0JBQU0sZ0JBQWdCLFFBQVEsV0FBTyxrQkFBSyxtQkFBVyxZQUFZLFFBQVEsQ0FBQztBQUFBLFVBQzlFO0FBQ0E7QUFBQSxNQUNSO0FBQUEsSUFDSjtBQUFBLElBRUEsYUFBb0IsaUJBQWlCLFVBQW9DO0FBQ3JFLGNBQVEsTUFBTSxLQUFLLG1CQUFtQixHQUFHLFNBQVMsUUFBUTtBQUFBLElBQzlEO0FBQUEsSUFFQSxhQUFvQixrQkFBa0IsVUFBb0M7QUFDdEUsY0FBUSxNQUFNLEtBQUssb0JBQW9CLEdBQUcsU0FBUyxRQUFRO0FBQUEsSUFDL0Q7QUFBQSxJQUVBLGFBQXFCLHFCQUF3QztBQUN6RCxZQUFNLFVBQVUsbUJBQVc7QUFDM0IsVUFBSSxDQUFDLE1BQU0sZ0JBQWdCLFFBQVEsT0FBTyxPQUFPLEVBQUcsUUFBTyxDQUFDO0FBRTVELFlBQU0sUUFBUSxNQUFNLGdCQUFnQixRQUFRLFFBQVEsT0FBTztBQUMzRCxZQUFNLFlBQVksTUFBTSxRQUFRLElBQUksTUFBTSxJQUFJLE9BQU0sU0FBUTtBQUN4RCxjQUFNLE9BQU8sTUFBTSxnQkFBZ0IsUUFBUSxTQUFLLGtCQUFLLFNBQVMsSUFBSSxDQUFDO0FBQ25FLGVBQU8sRUFBRSxNQUFNLFFBQVEsS0FBSyxPQUFPO0FBQUEsTUFDdkMsQ0FBQyxDQUFDO0FBRUYsYUFBTyxVQUFVLE9BQU8sQ0FBQUMsT0FBS0EsR0FBRSxNQUFNLEVBQUUsSUFBSSxDQUFBQSxPQUFLQSxHQUFFLElBQUk7QUFBQSxJQUMxRDtBQUFBLElBRUEsYUFBcUIsc0JBQXlDO0FBQzFELFlBQU0sVUFBVSxtQkFBVztBQUMzQixVQUFJLENBQUMsTUFBTSxnQkFBZ0IsUUFBUSxPQUFPLE9BQU8sRUFBRyxRQUFPLENBQUM7QUFFNUQsWUFBTSxRQUFRLE1BQU0sZ0JBQWdCLFFBQVEsUUFBUSxPQUFPO0FBQzNELFlBQU0sWUFBWSxNQUFNLFFBQVEsSUFBSSxNQUFNLElBQUksT0FBTSxTQUFRO0FBQ3hELGNBQU0sT0FBTyxNQUFNLGdCQUFnQixRQUFRLFNBQUssa0JBQUssU0FBUyxJQUFJLENBQUM7QUFDbkUsZUFBTyxFQUFFLE1BQU0sUUFBUSxLQUFLLE9BQU87QUFBQSxNQUN2QyxDQUFDLENBQUM7QUFFRixhQUFPLFVBQVUsT0FBTyxDQUFBQSxPQUFLQSxHQUFFLE1BQU0sRUFBRSxJQUFJLENBQUFBLE9BQUtBLEdBQUUsSUFBSTtBQUFBLElBQzFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxPQUFjLHVCQUE2QjtBQUN2QyxzQkFBUSxXQUFXLFVBQVUsZ0JBQWdCLEVBQUUsS0FBSyxNQUFNO0FBQ3RELGFBQUssT0FBTyxLQUFLLG1DQUFtQztBQUNwRCxjQUFNLG1CQUFtQixTQUFTLHVCQUF1QixRQUFRO0FBRWpFLGlCQUFTLElBQUksR0FBRyxJQUFJLGlCQUFpQixRQUFRLEtBQUs7QUFDOUMsMkJBQWlCLENBQUMsRUFBRSxpQkFBaUIsU0FBUyxZQUFZO0FBQ3RELDZCQUFpQixDQUFDLEVBQUUsVUFBVSxPQUFPLFFBQVEsT0FBTztBQUNwRCxrQkFBTSxhQUFhLGlCQUFpQixDQUFDLEVBQUUsYUFBYSxNQUFNO0FBRTFELGdCQUFJLENBQUMsV0FBWTtBQUVqQixnQkFBSSxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsU0FBUyxRQUFRLE9BQU8sR0FBRztBQUN6RCxvQkFBTSxLQUFLLFdBQVcsVUFBVTtBQUFBLFlBQ3BDLE9BQU87QUFDSCxtQkFBSyxhQUFhLFVBQVU7QUFDNUIsbUJBQUssa0JBQWtCO0FBQUEsWUFDM0I7QUFBQSxVQUNKLENBQUM7QUFBQSxRQUNMO0FBQUEsTUFDSixDQUFDLEVBQUUsTUFBTSxTQUFPLEtBQUssT0FBTyxNQUFNLHFDQUFxQyxHQUFHLEVBQUUsQ0FBQztBQUFBLElBQ2pGO0FBQUEsSUFFQSxPQUFlLG9CQUEwQjtBQUNyQyxVQUFJLFNBQVMsZUFBZSx1QkFBdUIsRUFBRztBQUV0RCxXQUFLLE9BQU8sS0FBSyx5Q0FBeUM7QUFDMUQsWUFBTSxZQUFZLFNBQVMsY0FBYyxVQUFVLGdCQUFnQjtBQUNuRSxVQUFJLENBQUMsVUFBVztBQUVoQixZQUFNLFlBQVksU0FBUyxjQUFjLEdBQUc7QUFDNUMsZ0JBQVUsS0FBSztBQUNmLGdCQUFVLE1BQU0sUUFBUTtBQUV4QixZQUFNLE9BQU8sU0FBUyxjQUFjLEdBQUc7QUFDdkMsV0FBSyxNQUFNLFFBQVE7QUFDbkIsV0FBSyxNQUFNLFNBQVM7QUFDcEIsV0FBSyxjQUFjO0FBQ25CLFdBQUssaUJBQWlCLFNBQVMsTUFBTTtBQUNqQyxlQUFPLFNBQVMsT0FBTztBQUFBLE1BQzNCLENBQUM7QUFFRCxnQkFBVSxZQUFZLFNBQVMsZUFBZSwrQ0FBK0MsQ0FBQztBQUM5RixnQkFBVSxZQUFZLElBQUk7QUFDMUIsZ0JBQVUsWUFBWSxTQUFTLGVBQWUsYUFBYSxDQUFDO0FBRTVELGdCQUFVLFlBQVksU0FBUztBQUFBLElBQ25DO0FBQUEsSUFFQSxPQUFjLG1CQUF5QjtBQUNuQyxzQkFBUSxXQUFXLHNCQUFzQixFQUFFLEtBQUssTUFBTTtBQUNsRCxjQUFNLFNBQVMsU0FBUyxlQUFlLHFCQUFxQjtBQUM1RCxnQkFBUSxpQkFBaUIsU0FBUyxZQUFZO0FBQzFDLGdCQUFNLEtBQUssV0FBVyxtQkFBVyxVQUFVO0FBQUEsUUFDL0MsQ0FBQztBQUFBLE1BQ0wsQ0FBQyxFQUFFLE1BQU0sU0FBTyxLQUFLLE9BQU8sTUFBTSx5Q0FBeUMsR0FBRyxFQUFFLENBQUM7QUFBQSxJQUNyRjtBQUFBLElBRUEsT0FBYyxvQkFBMEI7QUFDcEMsc0JBQVEsV0FBVyx1QkFBdUIsRUFBRSxLQUFLLE1BQU07QUFDbkQsY0FBTSxTQUFTLFNBQVMsZUFBZSxzQkFBc0I7QUFDN0QsZ0JBQVEsaUJBQWlCLFNBQVMsWUFBWTtBQUMxQyxnQkFBTSxLQUFLLFdBQVcsbUJBQVcsV0FBVztBQUFBLFFBQ2hELENBQUM7QUFBQSxNQUNMLENBQUMsRUFBRSxNQUFNLFNBQU8sS0FBSyxPQUFPLE1BQU0sMENBQTBDLEdBQUcsRUFBRSxDQUFDO0FBQUEsSUFDdEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLGFBQXFCLFdBQVcsWUFBbUM7QUFDL0QsVUFBSTtBQUNBLGNBQU0sZ0JBQWdCLFFBQVEsU0FBUyxVQUFVO0FBQUEsTUFDckQsU0FBUyxPQUFPO0FBQ1osYUFBSyxPQUFPLE1BQU0seUJBQXlCLFVBQVUsS0FBSyxLQUFLLEVBQUU7QUFBQSxNQUNyRTtBQUFBLElBQ0o7QUFBQSxJQUVBLE9BQWMsaUJBQXVCO0FBQ2pDLHNCQUFRLFdBQVcsc0NBQXNDLEVBQUUsS0FBSyxNQUFNO0FBQ2xFLGNBQU0sV0FBVyxTQUFTLGVBQWUsVUFBVTtBQUNuRCxjQUFNLGNBQWMsU0FBUyxjQUFjLHNDQUFzQztBQUVqRixZQUFJLENBQUMsWUFBWSxDQUFDLFlBQWE7QUFFL0Isb0JBQVksaUJBQWlCLFNBQVMsTUFBTTtBQUN4QyxnQkFBTSxhQUFhLFNBQVMsY0FBYyxpQkFBaUI7QUFDM0Qsc0JBQVksZUFBZTtBQUFBLFlBQ3ZCLFVBQVU7QUFBQSxZQUNWLE9BQU87QUFBQSxVQUNYLENBQUM7QUFFRCwyQkFBUyxjQUFjLFdBQVc7QUFBQSxRQUN0QyxDQUFDO0FBRUQsY0FBTSxXQUFXLElBQUkscUJBQXFCLENBQUMsWUFBWTtBQUNuRCxrQkFBUSxRQUFRLFdBQVM7QUFDckIsZ0JBQUksTUFBTSxnQkFBZ0I7QUFDdEIsK0JBQVMsY0FBYyxXQUFXO0FBQUEsWUFDdEMsT0FBTztBQUNILDBCQUFZLFVBQVUsT0FBTyxRQUFRLFFBQVE7QUFBQSxZQUNqRDtBQUFBLFVBQ0osQ0FBQztBQUFBLFFBQ0wsR0FBRyxFQUFFLFdBQVcsSUFBSSxDQUFDO0FBRXJCLGlCQUFTLFFBQVEsUUFBUTtBQUFBLE1BQzdCLENBQUMsRUFBRSxNQUFNLFNBQU8sS0FBSyxPQUFPLE1BQU0sb0NBQW9DLEdBQUcsRUFBRSxDQUFDO0FBQUEsSUFDaEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLE9BQWMsd0JBQThCO0FBQ3hDLFlBQU0sbUJBQW1CLHNCQUFzQjtBQUMvQyxZQUFNLFNBQVMsU0FBUyxjQUFjLFFBQVE7QUFDOUMsYUFBTyxZQUFZO0FBRW5CLGVBQVMsS0FBSyxZQUFZLE1BQU07QUFBQSxJQUNwQztBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsYUFBb0Isb0JBQW9CLFVBQWlDO0FBQ3JFLFdBQUssT0FBTyxLQUFLLDhCQUE4QixRQUFRO0FBRXZELFlBQU0sVUFBVSxTQUFTLGtCQUFrQixHQUFHLFFBQVEsTUFBTSxFQUFFLENBQUM7QUFDL0QsVUFBSSxDQUFDLFNBQVM7QUFDVixhQUFLLE9BQU8sS0FBSyxHQUFHLFFBQVEseUJBQXlCO0FBQ3JEO0FBQUEsTUFDSjtBQUVBLFlBQU0sZ0JBQW9DLFNBQVMsU0FBUyxZQUFZLElBQUksVUFBVTtBQUN0RixZQUFNLGVBQVc7QUFBQSxRQUNiLGtCQUFrQixVQUFVLG1CQUFXLGFBQWEsbUJBQVc7QUFBQSxRQUMvRDtBQUFBLE1BQ0o7QUFHQSxVQUFJLGNBQWM7QUFDbEIsVUFBSTtBQUNBLHNCQUFjLE1BQU0sZ0JBQWdCLFFBQVEsU0FBUyxRQUFRO0FBQUEsTUFDakUsU0FBUyxHQUFHO0FBQ1IsYUFBSyxPQUFPLE1BQU0sdUJBQXVCLFFBQVEsS0FBSyxDQUFDLEVBQUU7QUFDekQ7QUFBQSxNQUNKO0FBRUEsWUFBTSx3QkFBd0Isd0JBQWdCLHdCQUF3QixXQUFXO0FBRWpGLFVBQUksQ0FBQyx5QkFBeUIsT0FBTyxLQUFLLHFCQUFxQixFQUFFLFdBQVcsR0FBRztBQUMzRTtBQUFBLE1BQ0o7QUFFQSxZQUFNLFlBQVksc0JBQXNCO0FBQ3hDLFVBQUksQ0FBQyxhQUFhLGNBQWMsUUFBUTtBQUNwQyxhQUFLLE9BQU8sS0FBSyw4QkFBOEIsYUFBYSxLQUFLLHNCQUFzQixJQUFJLEdBQUc7QUFDOUY7QUFBQSxNQUNKO0FBRUEsVUFBSTtBQUNBLGNBQU0sVUFBVSxNQUFNLE1BQU0sU0FBUztBQUNyQyxZQUFJLFFBQVEsV0FBVyxLQUFLO0FBQ3hCLGVBQUssT0FBTyxLQUFLLDhCQUE4QixRQUFRLFVBQVUsUUFBUSxNQUFNLEVBQUU7QUFDakY7QUFBQSxRQUNKO0FBRUEsY0FBTSxXQUFXLE1BQU0sUUFBUSxLQUFLO0FBQ3BDLGNBQU0sb0JBQW9CLHdCQUFnQix3QkFBd0IsUUFBUTtBQUUxRSxZQUFJLENBQUMsbUJBQW1CO0FBQ3BCLGVBQUssT0FBTyxLQUFLLGdEQUFnRCxhQUFhLEtBQUssc0JBQXNCLElBQUksR0FBRztBQUNoSDtBQUFBLFFBQ0o7QUFFQSxZQUFJLGdCQUFRLGVBQWUsa0JBQWtCLFNBQVMsc0JBQXNCLE9BQU8sR0FBRztBQUNsRixlQUFLLE9BQU87QUFBQSxZQUNSLHdCQUF3QixhQUFhLEtBQUssc0JBQXNCLElBQUksT0FDaEUsc0JBQXNCLE9BQU8sUUFBUSxrQkFBa0IsT0FBTztBQUFBLFVBQ3RFO0FBRUEsZ0JBQU0sZUFBZSxTQUFTLGVBQWUsR0FBRyxRQUFRLFNBQVM7QUFDakUsY0FBSSxjQUFjO0FBQ2QseUJBQWEsTUFBTSxVQUFVO0FBQzdCLHlCQUFhLGlCQUFpQixTQUFTLFlBQVk7QUFDL0Msb0JBQU0sZ0JBQWdCLFFBQVEsVUFBVSxVQUFVLFFBQVE7QUFDMUQsK0JBQVMsV0FBVyxRQUFRO0FBQzVCLCtCQUFTLFFBQVEsZUFBZSxVQUFVLGlCQUFpQjtBQUFBLFlBQy9ELENBQUM7QUFBQSxVQUNMO0FBQUEsUUFDSixPQUFPO0FBQ0gsZUFBSyxPQUFPO0FBQUEsWUFDUiwyQkFBMkIsYUFBYSxLQUFLLHNCQUFzQixJQUFJLHdCQUNsRCxzQkFBc0IsT0FBTztBQUFBLFVBQ3REO0FBQUEsUUFDSjtBQUFBLE1BQ0osU0FBUyxPQUFPO0FBQ1osYUFBSyxPQUFPLE1BQU0sOEJBQThCLFFBQVEsS0FBTSxNQUFnQixPQUFPLEVBQUU7QUFBQSxNQUMzRjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBbFdJLGdCQURFLFlBQ2EsVUFBUyxVQUFVLFlBQVk7QUFvV2xELE1BQU8scUJBQVE7OztBR3hXZixNQUFNLFdBQU4sTUFBZTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTVgsT0FBYyxXQUFXLFdBQW1CLE9BQXFCO0FBQzdELHNCQUFRLFdBQVcsVUFBVSxrQkFBa0IsRUFBRSxLQUFLLE1BQU07QUFDeEQsYUFBSyxPQUFPLEtBQUssbUJBQW1CLFNBQVMsZ0JBQWdCLEtBQUssRUFBRTtBQUVwRSxjQUFNLGdCQUFnQixTQUFTLGNBQWMsVUFBVSxrQkFBa0I7QUFDekUsWUFBSSxDQUFDLGNBQWU7QUFFcEIsY0FBTSxpQkFBaUIsU0FBUyxjQUFjLFVBQVUsT0FBTztBQUMvRCxjQUFNLGVBQWUsU0FBUyxjQUFjLFVBQVUsS0FBSztBQUUzRCxZQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYztBQUV0QyxjQUFNLG1CQUFtQixlQUFlO0FBQ3hDLGNBQU0saUJBQWlCLGFBQWE7QUFFcEMsY0FBTSxtQkFBbUIsU0FBUyxjQUFjLEtBQUs7QUFDckQseUJBQWlCLFlBQVk7QUFDN0IseUJBQWlCLEtBQUs7QUFFdEIsY0FBTSxlQUFlLFNBQVMsY0FBYyxLQUFLO0FBQ2pELHFCQUFhLFlBQVk7QUFDekIscUJBQWEsY0FBYztBQUUzQix5QkFBaUIsWUFBWSxZQUFZO0FBQ3pDLHNCQUFjLFlBQVksZ0JBQWdCO0FBRzFDLHdCQUFRLFdBQVcsVUFBVSxRQUFRLEVBQUUsS0FBSyxNQUFNO0FBQzlDLGdCQUFNLE1BQU0sU0FBUyxjQUFjLFVBQVUsUUFBUTtBQUNyRCxnQkFBTSxlQUFlLFNBQVMsY0FBYyxxQkFBcUI7QUFFakUsY0FBSSxDQUFDLE9BQU8sQ0FBQyxhQUFjO0FBQzNCLGNBQUcsU0FBUyxjQUFjLGtCQUFrQixTQUFTLElBQUksRUFBRztBQUU1RCxnQkFBTSx1QkFBdUIsU0FBUyxjQUFjLEtBQUs7QUFDekQsK0JBQXFCLFlBQVksZUFBZTtBQUVoRCxjQUFJLGFBQWEsc0JBQXNCLGFBQWEsV0FBVztBQUFBLFFBQ25FLENBQUMsRUFBRSxNQUFNLFNBQU8sS0FBSyxPQUFPLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBQUEsTUFDbEUsQ0FBQyxFQUFFLE1BQU0sU0FBTyxLQUFLLE9BQU8sTUFBTSwwQkFBMEIsR0FBRyxFQUFFLENBQUM7QUFBQSxJQUN0RTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsT0FBYyxZQUFZLE9BQWUsV0FBbUIsTUFBb0I7QUFDNUUsc0JBQVEsV0FBVyxVQUFVLGtCQUFrQixFQUFFLEtBQUssTUFBTTtBQUN4RCxhQUFLLE9BQU8sS0FBSyxvQkFBb0IsS0FBSyxnQkFBZ0IsU0FBUyxFQUFFO0FBRXJFLGNBQU0sa0JBQWtCLFNBQVMsY0FBYyxVQUFVLFFBQVE7QUFDakUsY0FBTSx1QkFBdUIsU0FBUyxjQUFjLFVBQVUsY0FBYztBQUM1RSxjQUFNLHNCQUFzQixTQUFTLGNBQWMsVUFBVSxhQUFhO0FBRTFFLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBc0I7QUFFL0MsY0FBTSxnQkFBZ0IsZ0JBQWdCO0FBQ3RDLGNBQU0scUJBQXFCLHFCQUFxQjtBQUVoRCxZQUFJLG9CQUFvQjtBQUN4QixZQUFJLCtCQUErQixZQUFZO0FBQzNDLDhCQUFvQixvQkFBb0IsVUFBVTtBQUFBLFFBQ3RELFdBQVcscUJBQXFCO0FBQzVCLDhCQUFvQixvQkFBb0I7QUFBQSxRQUM1QztBQUVBLGVBQU8sS0FBSyxRQUFRLGdCQUFnQixVQUFVLGlCQUFpQixHQUFHO0FBRWxFLGNBQU0sVUFBVSxTQUFTLGVBQWUsU0FBUztBQUNqRCxZQUFJLENBQUMsUUFBUztBQUVkLGNBQU0sY0FBYyxTQUFTLGNBQWMsS0FBSztBQUNoRCxvQkFBWSxZQUFZO0FBRXhCLGNBQU0sV0FBVyxTQUFTLGNBQWMsS0FBSztBQUM3QyxpQkFBUyxZQUFZO0FBQ3JCLGlCQUFTLFlBQVk7QUFFckIsY0FBTSxhQUFhLFNBQVMsY0FBYyxLQUFLO0FBQy9DLG1CQUFXLFVBQVUsSUFBSSxVQUFVLGlCQUFpQixRQUFRLEtBQUssRUFBRSxDQUFDO0FBQ3BFLG1CQUFXLGFBQWE7QUFDeEIsbUJBQVcsWUFBWSxRQUFRO0FBRS9CLG9CQUFZLFlBQVksVUFBVTtBQUNsQyxnQkFBUSxZQUFZLFdBQVc7QUFBQSxNQUNuQyxDQUFDLEVBQUUsTUFBTSxTQUFPLEtBQUssT0FBTyxNQUFNLDJCQUEyQixHQUFHLEVBQUUsQ0FBQztBQUFBLElBQ3ZFO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxPQUFjLFVBQVUsT0FBZSxJQUFZLE9BQXFCO0FBQ3BFLHNCQUFRLFdBQVcsS0FBSyxFQUFFLEtBQUssTUFBTTtBQUNqQyxjQUFNLFVBQVUsU0FBUyxjQUFjLEtBQUs7QUFDNUMsWUFBSSxDQUFDLFFBQVM7QUFFZCxjQUFNLFlBQVksU0FBUyxjQUFjLEtBQUs7QUFDOUMsa0JBQVUsVUFBVSxJQUFJLFFBQVEsTUFBTTtBQUV0QyxjQUFNLGFBQWEsU0FBUyxjQUFjLEtBQUs7QUFDL0MsbUJBQVcsVUFBVSxJQUFJLFFBQVEsT0FBTztBQUV4QyxjQUFNLFlBQVksU0FBUyxjQUFjLEtBQUs7QUFDOUMsa0JBQVUsYUFBYSxZQUFZLEdBQUc7QUFDdEMsa0JBQVUsYUFBYSxTQUFTLEtBQUs7QUFDckMsa0JBQVUsVUFBVSxJQUFJLFFBQVEsUUFBUSxRQUFRLGtCQUFrQixRQUFRO0FBQzFFLGtCQUFVLEtBQUs7QUFDZixrQkFBVSxjQUFjO0FBRXhCLG1CQUFXLFlBQVksU0FBUztBQUNoQyxrQkFBVSxZQUFZLFVBQVU7QUFDaEMsZ0JBQVEsWUFBWSxTQUFTO0FBQUEsTUFDakMsQ0FBQyxFQUFFLE1BQU0sU0FBTyxLQUFLLE9BQU8sTUFBTSx5QkFBeUIsR0FBRyxFQUFFLENBQUM7QUFBQSxJQUNyRTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsT0FBYyxRQUFRLE1BQTBCLFVBQWtCLFVBQTBCO0FBQ3hGLFdBQUssT0FBTyxLQUFLLFVBQVUsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUU5QyxVQUFJLFNBQVMsU0FBUztBQUNsQix3QkFBUSxXQUFXLFVBQVUsZUFBZSxFQUFFLEtBQUssTUFBTTtBQUNyRCxlQUFLLFNBQVMsVUFBVSxRQUFRO0FBQUEsUUFDcEMsQ0FBQyxFQUFFLE1BQU0sU0FBTyxLQUFLLE9BQU8sTUFBTSx3QkFBd0IsR0FBRyxFQUFFLENBQUM7QUFBQSxNQUNwRSxXQUFXLFNBQVMsVUFBVTtBQUMxQix3QkFBUSxXQUFXLFVBQVUsZ0JBQWdCLEVBQUUsS0FBSyxNQUFNO0FBQ3RELGVBQUssVUFBVSxVQUFVLFFBQVE7QUFBQSxRQUNyQyxDQUFDLEVBQUUsTUFBTSxTQUFPLEtBQUssT0FBTyxNQUFNLHlCQUF5QixHQUFHLEVBQUUsQ0FBQztBQUFBLE1BQ3JFO0FBQUEsSUFDSjtBQUFBLElBRUEsT0FBZSxVQUFVLFVBQWtCLFVBQTBCO0FBQ2pFLFlBQU0saUJBQTJCLEtBQUs7QUFBQSxRQUNsQyxhQUFhLFFBQVEsYUFBYSxlQUFlLEtBQUs7QUFBQSxNQUMxRDtBQUVBLFlBQU0sa0JBQWtCLFNBQVMsY0FBYyxLQUFLO0FBQ3BELHNCQUFnQixZQUFZLHNCQUFzQixVQUFVLFVBQVUsZUFBZSxTQUFTLFFBQVEsQ0FBQztBQUN2RyxzQkFBZ0IsYUFBYSxRQUFRLEdBQUcsUUFBUSxNQUFNO0FBRXRELFlBQU0sa0JBQWtCLFNBQVMsY0FBYyxVQUFVLGdCQUFnQjtBQUN6RSx1QkFBaUIsWUFBWSxlQUFlO0FBRTVDLHlCQUFXLG9CQUFvQixRQUFRO0FBQUEsSUFDM0M7QUFBQSxJQUVBLE9BQWUsU0FBUyxVQUFrQixVQUEwQjtBQUNoRSxZQUFNLGVBQWUsYUFBYSxRQUFRLGFBQWEsYUFBYTtBQUVwRSxZQUFNLGlCQUFpQixTQUFTLGNBQWMsS0FBSztBQUNuRCxxQkFBZSxZQUFZLHFCQUFxQixVQUFVLFVBQVUsaUJBQWlCLFFBQVE7QUFDN0YscUJBQWUsYUFBYSxRQUFRLEdBQUcsUUFBUSxNQUFNO0FBRXJELFlBQU0saUJBQWlCLFNBQVMsY0FBYyxVQUFVLGVBQWU7QUFDdkUsc0JBQWdCLFlBQVksY0FBYztBQUUxQyx5QkFBVyxvQkFBb0IsUUFBUTtBQUFBLElBQzNDO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxPQUFjLFdBQVcsVUFBd0I7QUFDN0MsWUFBTSxVQUFVLFNBQVMsa0JBQWtCLEdBQUcsUUFBUSxNQUFNLEVBQUUsQ0FBQztBQUMvRCxlQUFTLE9BQU87QUFBQSxJQUNwQjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsT0FBYyxjQUFjLFNBQXdCO0FBRWhELGVBQVMsSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLO0FBQ3hCLGNBQU0sVUFBVSxTQUFTLGNBQWMsR0FBRyxVQUFVLFFBQVEsb0JBQW9CLENBQUMsR0FBRztBQUNwRixpQkFBUyxVQUFVLE9BQU8sUUFBUSxRQUFRO0FBQUEsTUFDOUM7QUFFQSxjQUFRLFVBQVUsSUFBSSxRQUFRLFFBQVE7QUFBQSxJQUMxQztBQUFBLEVBQ0o7QUF4TEksZ0JBREUsVUFDYSxVQUFTLFVBQVUsVUFBVTtBQTBMaEQsTUFBTyxtQkFBUTs7O0FDbE1SLFdBQVMscUJBQTZCO0FBQ3pDLFdBQU8sOEJBQWMsS0FBSyxLQUFXLFVBQVU7QUFBQSxFQUNuRDs7O0FDUU8sV0FBUyxtQkFDWixVQUNBLE1BQ0EsV0FDTTtBQUNOLFFBQUksV0FBVyw4QkFBYyxLQUFLLEtBQVcsV0FBVztBQUd4RCxRQUFJLFlBQVk7QUFFaEIsUUFBRyxTQUFTLFNBQVM7QUFDakIsVUFBRyxDQUFDLFNBQVMsU0FBUztBQUVsQixvQkFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSWhCLE9BQU87QUFFSCxvQkFBWTtBQUFBLHVCQUNELFNBQVMsT0FBTztBQUFBLCtDQUNRLFNBQVMsT0FBTztBQUFBO0FBQUEsTUFFdkQ7QUFBQSxJQUNKLE9BQU87QUFDSCxrQkFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSWhCO0FBR0EsVUFBTSxXQUFXLENBQUMsUUFBUSxlQUFlLFVBQVUsU0FBUztBQUM1RCxhQUFTLFFBQVEsU0FBTztBQUNwQixZQUFNLFFBQVEsSUFBSSxPQUFPLFNBQVMsR0FBRyxVQUFVLEdBQUc7QUFDbEQsaUJBQVcsU0FBUyxRQUFRLE9BQU8sU0FBUyxHQUFHLEtBQUssRUFBRTtBQUFBLElBQzFELENBQUM7QUFFRCxXQUFPLFNBQ0YsUUFBUSx1QkFBdUIsSUFBSSxFQUNuQyxRQUFRLGlDQUFpQyxZQUFZLGNBQWMsU0FBUyxFQUM1RSxRQUFRLHdCQUF3QixZQUFZLHFDQUFxQyxnQ0FBZ0MsRUFDakgsUUFBUSxrQkFBa0IsU0FBUyxRQUFRLEVBQzNDLFFBQVEsY0FBYyxTQUFTLElBQUksRUFDbkMsUUFBUSwrQkFBK0IsU0FBUyxFQUNoRCxRQUFRLDZCQUE2QixFQUFFO0FBQUEsRUFDaEQ7OztBQ3hETyxXQUFTLHlCQUNaLFNBQ0EsMEJBQ0EscUJBQ0EseUJBQ007QUFDTixVQUFNLFdBQVcsOEJBQWMsS0FBSyxLQUFXLGdCQUFnQjtBQUUvRCxXQUFPLFNBQ0YsUUFBUSxpQkFBaUIsT0FBTyxFQUNoQyxRQUFRLGtDQUFrQywyQkFBMkIsWUFBWSxFQUFFLEVBQ25GLFFBQVEsNkJBQTZCLHNCQUFzQixZQUFZLEVBQUUsRUFDekUsUUFBUSxpQ0FBaUMsMEJBQTBCLFlBQVksRUFBRTtBQUFBLEVBQzFGOzs7QUNiTyxXQUFTLHdCQUF3QixTQUEwQjtBQUM5RCxVQUFNLFdBQVcsOEJBQWMsS0FBSyxLQUFXLGVBQWU7QUFFOUQsV0FBTyxTQUNGLFFBQVEsa0JBQWtCLFVBQVUsYUFBYSxFQUFFLEVBQ25ELFFBQVEsZUFBZSxVQUFVLFlBQVksT0FBTyxFQUNwRCxRQUFRLHlCQUF5QixVQUFVLHlCQUF5QiwrQkFBK0I7QUFBQSxFQUM1Rzs7O0FDUE8sV0FBUyxnQkFBd0I7QUFDcEMsV0FBTyw4QkFBYyxLQUFLLEtBQVcsVUFBVTtBQUFBLEVBQ25EOzs7QUNRQSxNQUFBQyxlQUFxQjtBQVVyQixrQkFBZ0IsWUFBWSxJQUFJLGtCQUFrQixDQUFDO0FBa0JuRCxTQUFPLGlCQUFpQixRQUFRLFlBQVk7QUFFeEMsUUFBSSxDQUFDLGdCQUFnQixRQUFTLGlCQUFnQixZQUFZLElBQUksa0JBQWtCLENBQUM7QUFDakYsVUFBTSxnQkFBZ0IsUUFBUSxLQUFLO0FBR25DLElBQUMsT0FBZSxrQkFBa0I7QUFBQSxNQUM5QixZQUFZLE9BQU8sVUFBa0I7QUFFakMsY0FBTSxlQUFlO0FBQUEsTUFDekI7QUFBQSxJQUNKO0FBRUEsMkJBQXVCO0FBR3ZCLFVBQU0sZUFBZTtBQUdyQixVQUFNLG1CQUFtQjtBQUd6QixXQUFPLGlCQUFpQixjQUFjLFlBQVk7QUFDOUMsWUFBTSxjQUFjO0FBQUEsSUFDeEIsQ0FBQztBQUFBLEVBQ0wsQ0FBQztBQUdELGlCQUFlLGdCQUFnQjtBQUMzQixRQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsWUFBWSxFQUFHO0FBQzNDLFFBQUksU0FBUyxjQUFjLDhCQUE4QixFQUFHO0FBRTVELHVCQUFXLHNCQUFzQjtBQUVqQyxVQUFNLGFBQWEsbUJBQVc7QUFDOUIsVUFBTSxjQUFjLG1CQUFXO0FBRS9CLFFBQUksWUFBc0IsQ0FBQztBQUMzQixRQUFJLGFBQXVCLENBQUM7QUFFNUIsUUFBSTtBQUNBLGtCQUFZLE1BQU0sZ0JBQWdCLFFBQVEsUUFBUSxVQUFVO0FBQzVELG1CQUFhLE1BQU0sZ0JBQWdCLFFBQVEsUUFBUSxXQUFXO0FBQUEsSUFDbEUsU0FBUSxHQUFHO0FBQ1AsNkJBQU8sTUFBTSxnREFBZ0QsQ0FBQztBQUFBLElBQ2xFO0FBRUEsVUFBTSxhQUFhLFVBQVUsT0FBTyxjQUFZLFNBQVMsU0FBUyxnQkFBZ0IsS0FBSyxDQUFDO0FBQ3hGLFVBQU0sY0FBYyxXQUFXLE9BQU8sY0FBWSxTQUFTLFNBQVMsZ0JBQWdCLE1BQU0sQ0FBQztBQUUzRiwyQkFBTyxLQUFLLCtCQUErQjtBQUMzQyxxQkFBUyxXQUFXLFlBQVksVUFBVTtBQUMxQyxxQkFBUyxZQUFZLFVBQVUsWUFBWSxhQUFhLENBQUM7QUFDekQscUJBQVMsWUFBWSxXQUFXLFlBQVksY0FBYyxDQUFDO0FBQzNELHFCQUFTLFlBQVksU0FBUyxZQUFZLGFBQWEsQ0FBQztBQUV4RCxxQkFBUyxVQUFVLHNCQUFzQix1QkFBdUIsVUFBVSxlQUFlO0FBQ3pGLHFCQUFTLFVBQVUsdUJBQXVCLHdCQUF3QixVQUFVLGdCQUFnQjtBQUU1RixlQUFXO0FBR1gsMEJBQXNCO0FBR3RCLG9CQUFRLFdBQVcsVUFBVSxlQUFlLEVBQUUsS0FBSyxZQUFZO0FBRTNELFlBQU0sd0JBQXdCLGFBQWEsUUFBUSxhQUFhLGFBQWEsTUFBTTtBQUNuRixZQUFNLHdCQUF3QixTQUFTLGNBQWMsS0FBSztBQUMxRCw0QkFBc0IsWUFBWSx3QkFBd0IscUJBQXFCO0FBQy9FLGVBQVMsY0FBYyxVQUFVLGVBQWUsR0FBRyxZQUFZLHFCQUFxQjtBQUdwRixpQkFBVyxTQUFTLFlBQVk7QUFDNUIsWUFBSTtBQUNBLGdCQUFNLGdCQUFZLG1CQUFLLFlBQVksS0FBSztBQUN4QyxnQkFBTSxVQUFVLE1BQU0sZ0JBQWdCLFFBQVEsU0FBUyxTQUFTO0FBQ2hFLGdCQUFNLFdBQVcsd0JBQWdCLHdCQUF3QixPQUFPO0FBRWhFLGNBQUksVUFBVTtBQUNWLGdCQUFJLFNBQVMsS0FBSyxZQUFZLE1BQU0sV0FBVztBQUMzQywrQkFBUyxRQUFRLFNBQVMsT0FBTztBQUFBLGdCQUM3QixNQUFNLFNBQVM7QUFBQSxnQkFDZixhQUFhLFNBQVM7QUFBQSxnQkFDdEIsUUFBUSxTQUFTO0FBQUEsZ0JBQ2pCLFNBQVMsU0FBUztBQUFBLGdCQUNsQixXQUFXLFNBQVM7QUFBQSxnQkFDcEIsUUFBUSxTQUFTO0FBQUEsY0FDckIsQ0FBQztBQUFBLFlBQ0w7QUFBQSxVQUNKO0FBQUEsUUFDSixTQUFTLEdBQUc7QUFDUixpQ0FBTyxNQUFNLHFDQUFxQyxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQUEsUUFDbkU7QUFBQSxNQUNKO0FBQUEsSUFDSixDQUFDLEVBQUUsTUFBTSxTQUFPLHVCQUFPLE1BQU0sNkJBQTZCLEdBQUcsQ0FBQztBQUc5RCxlQUFXLFVBQVUsYUFBYTtBQUM5QixVQUFJO0FBQ0EsY0FBTSxpQkFBYSxtQkFBSyxhQUFhLE1BQU07QUFDM0MsY0FBTSxVQUFVLE1BQU0sZ0JBQWdCLFFBQVEsU0FBUyxVQUFVO0FBQ2pFLGNBQU0sV0FBVyx3QkFBZ0Isd0JBQXdCLE9BQU87QUFFaEUsWUFBSSxVQUFVO0FBQ1YsMkJBQVMsUUFBUSxVQUFVLFFBQVE7QUFBQSxZQUMvQixNQUFNLFNBQVM7QUFBQSxZQUNmLGFBQWEsU0FBUztBQUFBLFlBQ3RCLFFBQVEsU0FBUztBQUFBLFlBQ2pCLFNBQVMsU0FBUztBQUFBLFlBQ2xCLFdBQVcsU0FBUztBQUFBLFlBQ3BCLFFBQVEsU0FBUztBQUFBLFVBQ3JCLENBQUM7QUFBQSxRQUNMO0FBQUEsTUFDSixTQUFTLEdBQUc7QUFDUiwrQkFBTyxNQUFNLHNDQUFzQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQUEsTUFDckU7QUFBQSxJQUNKO0FBRUEsdUJBQVcscUJBQXFCO0FBQ2hDLHVCQUFXLGVBQWU7QUFBQSxFQU85QjtBQUVBLFdBQVMseUJBQStCO0FBQ3BDLFVBQU0sV0FBbUM7QUFBQSxNQUNyQyxDQUFDLGFBQWEsZUFBZSxHQUFHO0FBQUEsTUFDaEMsQ0FBQyxhQUFhLHdCQUF3QixHQUFHO0FBQUEsTUFDekMsQ0FBQyxhQUFhLFdBQVcsR0FBRztBQUFBLElBQ2hDO0FBRUEsZUFBVyxDQUFDLEtBQUssWUFBWSxLQUFLLE9BQU8sUUFBUSxRQUFRLEdBQUc7QUFDeEQsVUFBSSxDQUFDLGFBQWEsUUFBUSxHQUFHLEdBQUc7QUFDNUIscUJBQWEsUUFBUSxLQUFLLFlBQVk7QUFBQSxNQUMxQztBQUFBLElBQ0o7QUFBQSxFQUNKO0FBRUEsaUJBQWUsaUJBQWdDO0FBQzNDLFVBQU0sZUFBZSxhQUFhLFFBQVEsYUFBYSxhQUFhO0FBRXBFLFFBQUksQ0FBQyxnQkFBZ0IsaUJBQWlCLFdBQVc7QUFDN0MsbUJBQWEsUUFBUSxhQUFhLGVBQWUsU0FBUztBQUMxRDtBQUFBLElBQ0o7QUFFQSxVQUFNLGdCQUFZLG1CQUFLLG1CQUFXLFlBQVksWUFBWTtBQU8xRCxRQUFJO0FBQ0EsVUFBSSxDQUFDLE1BQU0sZ0JBQWdCLFFBQVEsT0FBTyxTQUFTLEdBQUc7QUFDbEQscUJBQWEsUUFBUSxhQUFhLGVBQWUsU0FBUztBQUMxRDtBQUFBLE1BQ0o7QUFHQSxlQUFTLGVBQWUsYUFBYSxHQUFHLE9BQU87QUFFL0MsWUFBTSxVQUFVLE1BQU0sZ0JBQWdCLFFBQVEsU0FBUyxTQUFTO0FBRWhFLFlBQU0sZUFBZSxTQUFTLGNBQWMsT0FBTztBQUNuRCxtQkFBYSxhQUFhLE1BQU0sYUFBYTtBQUM3QyxtQkFBYSxjQUFjO0FBQzNCLGVBQVMsS0FBSyxZQUFZLFlBQVk7QUFBQSxJQUMxQyxTQUFTLEdBQUc7QUFDUiw2QkFBTyxNQUFNLDRCQUE0QixDQUFDO0FBQUEsSUFDOUM7QUFBQSxFQUNKO0FBRUEsaUJBQWUscUJBQW9DO0FBQy9DLFVBQU0sY0FBYyxtQkFBVztBQUMvQixRQUFJO0FBQ0EsVUFBSSxDQUFDLE1BQU0sZ0JBQWdCLFFBQVEsT0FBTyxXQUFXLEVBQUc7QUFFeEQsWUFBTSxhQUFhLE1BQU0sZ0JBQWdCLFFBQVEsUUFBUSxXQUFXO0FBQ3BFLFlBQU0sZ0JBQWdCLFdBQVcsT0FBTyxjQUFZLFNBQVMsU0FBUyxnQkFBZ0IsTUFBTSxDQUFDO0FBRTdGLFlBQU0saUJBQTJCLEtBQUs7QUFBQSxRQUNsQyxhQUFhLFFBQVEsYUFBYSxlQUFlLEtBQUs7QUFBQSxNQUMxRDtBQUVBLGlCQUFXLFVBQVUsZUFBZTtBQUNoQyxZQUFJLGVBQWUsU0FBUyxNQUFNLEdBQUc7QUFDakMsZ0JBQU0sbUJBQVcsV0FBVyxNQUFNO0FBQUEsUUFDdEM7QUFBQSxNQUNKO0FBQUEsSUFDSixTQUFTLEdBQUc7QUFDUiw2QkFBTyxNQUFNLDZCQUE2QixDQUFDO0FBQUEsSUFDL0M7QUFBQSxFQUNKO0FBRUEsaUJBQWUsYUFBNEI7QUFDdkMsVUFBTSxrQkFBa0IsU0FBUyxjQUFjLFVBQVUsZ0JBQWdCO0FBQ3pFLFFBQUksQ0FBQyxnQkFBaUI7QUFFdEIsb0JBQWdCLFlBQVksbUJBQW1CO0FBRS9DLFVBQU0sT0FBTyxNQUFNLG1CQUFXLFVBQVU7QUFDeEMsVUFBTSxXQUFXLFNBQVMsZUFBZSxXQUFXO0FBQ3BELFFBQUksQ0FBQyxTQUFVO0FBYWYsZUFBVyxVQUFXLEtBQUssU0FBMkI7QUFDbEQsWUFBTSxZQUFZLE1BQU0sbUJBQVcsa0JBQWtCLGdCQUFRLG1CQUFtQixPQUFPLFFBQVEsQ0FBQztBQUNoRyxlQUFTLGFBQWEsbUJBQW1CLFFBQVEsVUFBVSxTQUFTO0FBQUEsSUFDeEU7QUFHQSxlQUFXLFNBQVUsS0FBSyxRQUEwQjtBQUNoRCxZQUFNLFlBQVksTUFBTSxtQkFBVyxpQkFBaUIsZ0JBQVEsbUJBQW1CLE1BQU0sUUFBUSxDQUFDO0FBQzlGLGVBQVMsYUFBYSxtQkFBbUIsT0FBTyxTQUFTLFNBQVM7QUFBQSxJQUN0RTtBQUdBLFVBQU0sYUFBYSxTQUFTLGlCQUFpQixlQUFlO0FBQzVELGVBQVcsUUFBUSxDQUFDLFFBQVE7QUFDeEIsVUFBSSxpQkFBaUIsU0FBUyxNQUFNO0FBQ2hDLGNBQU0sT0FBTyxJQUFJLGFBQWEsV0FBVztBQUN6QyxjQUFNLE9BQU8sSUFBSSxhQUFhLFdBQVcsR0FBRyxZQUFZO0FBRXhELFlBQUksQ0FBQyxRQUFRLENBQUMsS0FBTTtBQUVwQixZQUFJLElBQUksYUFBYSxPQUFPLE1BQU0sV0FBVztBQUN6Qyw2QkFBVyxZQUFZLE1BQU0sSUFBSTtBQUNqQyxjQUFJLFVBQVUsT0FBTyxRQUFRLGNBQWM7QUFDM0MsY0FBSSxVQUFVLElBQUksUUFBUSxnQkFBZ0I7QUFDMUMsY0FBSSxhQUFhLFNBQVMsV0FBVztBQUNyQyxjQUFJLElBQUksV0FBVyxDQUFDLEdBQUc7QUFDbkIsZ0JBQUksV0FBVyxDQUFDLEVBQUUsY0FBYztBQUFBLFVBQ3BDO0FBQUEsUUFDSixPQUFPO0FBQ0gsNkJBQVcsVUFBVSxnQkFBUSxtQkFBbUIsSUFBSSxHQUFHLElBQUk7QUFDM0QsY0FBSSxVQUFVLE9BQU8sUUFBUSxnQkFBZ0I7QUFDN0MsY0FBSSxVQUFVLElBQUksUUFBUSxjQUFjO0FBQ3hDLGNBQUksYUFBYSxTQUFTLFNBQVM7QUFDbkMsY0FBSSxJQUFJLFdBQVcsQ0FBQyxHQUFHO0FBQ25CLGdCQUFJLFdBQVcsQ0FBQyxFQUFFLGNBQWM7QUFBQSxVQUNwQztBQUFBLFFBQ0o7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMLENBQUM7QUFHRCxtQkFBZTtBQUdmLFVBQU0saUJBQWlCLFNBQVMsaUJBQWlCLFVBQVUsY0FBYztBQUN6RSxVQUFNLGdCQUFnQixlQUFlLENBQUM7QUFDdEMsUUFBSSxlQUFlO0FBQ2Ysb0JBQWMsWUFBWSxjQUFjO0FBQ3hDLGVBQVMsZUFBZSxVQUFVLEdBQUcsaUJBQWlCLFNBQVMsTUFBTTtBQUNqRSxpQkFBUyxPQUFPO0FBQ2hCLG1CQUFXLE1BQU07QUFDYixtQkFBUyxPQUFPO0FBQUEsUUFDcEIsR0FBRyxDQUFDO0FBQUEsTUFDUixDQUFDO0FBQUEsSUFDTDtBQUFBLEVBQ0o7QUFFQSxXQUFTLGlCQUF1QjtBQUM1QixVQUFNLGNBQWMsU0FBUyxjQUFjLFVBQVUsWUFBWTtBQUNqRSxVQUFNLGtCQUFrQixTQUFTLGNBQWMsVUFBVSxxQkFBcUI7QUFFOUUsUUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBaUI7QUFFdEMsZ0JBQVksaUJBQWlCLFNBQVMsTUFBTTtBQUN4QyxZQUFNLFNBQVMsWUFBWSxNQUFNLEtBQUssRUFBRSxZQUFZO0FBQ3BELFlBQU0sV0FBVyxnQkFBZ0IsaUJBQWlCLFVBQVUsZUFBZTtBQUUzRSxlQUFTLFFBQVEsQ0FBQyxTQUFTO0FBQ3ZCLGNBQU0sT0FBTyxLQUFLLGNBQWMsVUFBVSxjQUFjLEdBQUcsYUFBYSxZQUFZLEtBQUs7QUFDekYsY0FBTSxjQUFjLEtBQUssY0FBYyxVQUFVLGdCQUFnQixHQUFHLGFBQWEsWUFBWSxLQUFLO0FBQ2xHLGNBQU0sT0FBTyxLQUFLLGNBQWMsVUFBVSxlQUFlLEdBQUcsYUFBYSxZQUFZLEtBQUs7QUFFMUYsY0FBTSxRQUFRLEtBQUssU0FBUyxNQUFNLEtBQUssWUFBWSxTQUFTLE1BQU0sS0FBSyxLQUFLLFNBQVMsTUFBTTtBQUMzRixRQUFDLEtBQXFCLE1BQU0sVUFBVSxRQUFRLEtBQUs7QUFBQSxNQUN2RCxDQUFDO0FBQUEsSUFDTCxDQUFDO0FBQUEsRUFDTDtBQUVBLFdBQVMsd0JBQThCO0FBQ25DLG9CQUFRLFdBQVcseUJBQXlCLEVBQUUsS0FBSyxNQUFNO0FBQ3JELFlBQU0sTUFBTSxTQUFTLGVBQWUsd0JBQXdCO0FBQzVELFdBQUssaUJBQWlCLFNBQVMsVUFBVTtBQUFBLElBQzdDLENBQUMsRUFBRSxNQUFNLE1BQU07QUFBQSxJQUFDLENBQUM7QUFBQSxFQUNyQjtBQUVBLFdBQVMsYUFBbUI7QUFDeEIsb0JBQVEsV0FBVyxVQUFVLGNBQWMsRUFBRSxLQUFLLFlBQVk7QUFDMUQsWUFBTSxnQkFBZ0IsU0FBUyxjQUFjLFVBQVUsY0FBYztBQUNyRSxVQUFJLGVBQWU7QUFFZixzQkFBYyxhQUFhO0FBQUEsVUFDdkI7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0osQ0FBQyxFQUFFLE1BQU0sU0FBTyx1QkFBTyxNQUFNLG9DQUFvQyxHQUFHLENBQUM7QUFBQSxFQUN6RTtBQUVBLFdBQVMsZUFBdUI7QUFDNUIsV0FBTztBQUFBO0FBQUE7QUFBQSxFQUdYO0FBRUEsV0FBUyxlQUF1QjtBQUM1QixXQUFPO0FBQUE7QUFBQTtBQUFBLEVBR1g7QUFFQSxXQUFTLGdCQUF3QjtBQUM3QixXQUFPO0FBQUE7QUFBQSxFQUVYOyIsCiAgIm5hbWVzIjogWyJFeGNlcHRpb25Db2RlIiwgInJlZ2lzdGVyUGx1Z2luIiwgInAiLCAicmVzb2x2ZSIsICJoZWFkZXJzIiwgIlN5c3RlbUJhcnNTdHlsZSIsICJTeXN0ZW1CYXJUeXBlIiwgIkRpcmVjdG9yeSIsICJFbmNvZGluZyIsICJyZXNvbHZlIiwgImVudHJ5IiwgInRvUGF0aCIsICJjdGltZSIsICJ3ZWJfZXhwb3J0cyIsICJpbml0X3dlYiIsICJyZXNvbHZlIiwgInJlc29sdmUiLCAiam9pbiIsICJiYXNlbmFtZSIsICJCcm93c2VyIiwgImYiLCAiQnJvd3NlciIsICJyZXNvbHZlIiwgImYiLCAiaW1wb3J0X3BhdGgiXQp9Cg==
