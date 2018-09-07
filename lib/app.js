let baseUrl = '';
// let baseUrl = 'undefined';
let token = '';
// request error timeout
let timeout = (1000 * 60) * 1.5;
// global headers
let globalHeaders = {}; // 'Accept': 'application/json',

class Ajax {

  // base url 
  static get baseUrl() {
    return baseUrl;
  }
  static set baseUrl(url) {
    if ( typeof url === 'string' ) {
      baseUrl = url;
    } else {
      throw new Error('Ajax Nightmare: "baseUrl" must be a string');
    }
  }
  // bearer token
  static get token() {
    return token;
  }
  static set token(bearer) {
    if ( typeof bearer === 'string' ) {
      token = bearer;
    } else {
      throw new Error('Ajax Nightmare: "token" must be a string');
    }
  }
  // error timeout
  static get timeout() {
    return timeout;
  }
  static set timeout(milliseconds) {
    timeout = milliseconds;
  }
  // global headers
  static set globalHeaders(headers) {
    if ( typeof headers === 'object' ) {
      globalHeaders = headers;
    } else {
      throw new Error('Ajax Nightmare: "globalHeaders" must be a object');
    }
  }
  static get globalHeaders() {
    return globalHeaders;
  }
  // native XMLHttpRequest properties
  get status() {
    return this.xhr.status;
  }
  get statusText() {
    return this.xhr.statusText;
  }
  get responseText() {
    return this.xhr.responseText;
  }
  get readyState() {
    return this.xhr.readyState;
  }
  
  constructor(endpoint = '', options = {}) {
    this.xhr = new XMLHttpRequest();
    this.success = false;
    this.error = false;
    this.hashHeaders = false;
    this.options = Ajax.__setRequestOptions(options);
    this.url = (this.options.useBaseUrl) ? `${baseUrl}${endpoint}` : endpoint;
    this.__progressListeners();
    this.__resultListeners();
    if (this.options.autoSend) {
      this.send();
    }
  }

  static __setBody(body) {
    const formData = new FormData();
    for(let arg of Object.entries(body)){
      formData.append(arg[0], arg[1])
    }
    return formData;
  }

  send() {
    this.xhr.open(this.options.method, this.url, true);
    this.xhr.timeout = timeout;
    this.__setHeaders();
    if (this.options.body) {
      this.xhr.send(this.options.body);
    } else {
      this.xhr.send();
    }
  }

  __setHeaders() {
    for(let arg of Object.entries(this.options.headers)) {
      if (this.options.body) {
        if (arg[0] !== 'Content-Type' || arg[0] !== 'content-type') {
          this.xhr.setRequestHeader(arg[0],arg[1]);
        }
      } else {
        this.xhr.setRequestHeader(arg[0],arg[1]);
      }
    }
    if(this.options.credentials) {
      this.xhr.setRequestHeader('Authorization', token);
    }
  }

  abort() {
    this.xhr.abort();
  }

  __progressListeners() {
    this.xhr.addEventListener('progress', (e) => {
      this.downloadProgress = (e.loaded / e.total) * 100;
      this.options.onDownloadProgress(e, this.downloadProgress)
    });
    this.xhr.upload.addEventListener('progress', (e) => {
      this.uploadProgress = (e.loaded / e.total) * 100;
      this.options.onUploadProgress(e, this.uploadProgress)
    });
    this.xhr.onreadystatechange = this.options.onReadyStateChange;
  }

  __resultListeners() {
    this.result = () => new Promise( (resolve, reject) => {
      this.xhr.onload = () => {
        try {
          const success = JSON.parse(this.xhr.responseText);
          this.success = success;
          this.error = false;
          resolve(success);
        } catch (error) {
          this.success = this.xhr.responseText;
          resolve(this.xhr.responseText);
        }
      };
      this.xhr.onabort = () => {
        this.success = false;
        this.error = {
          fail: true,
          type: 'abort',
          status: this.status,
          message: 'Aborted Request',
        };
        reject(this.error);
      };
      this.xhr.onerror = () => {
        this.success = false;
        this.error = {
          fail: true,
          type: 'error',
          status: this.status,
          message: 'Network Connection Error',
        };
        reject(this.error);
      };
    });
  }

  static __setRequestOptions(options){
    if (options.headers) {
      this.hashHeaders = true;
    }
    const {
      method = 'GET',
      headers = false,
      body = false,
      credentials = false,
      onUploadProgress = () => null,
      onDownloadProgress = () => null,
      onReadyStateChange = () => null,
      useBaseUrl = true,
      autoSend = true,
    } = options;
    const newOptions = {
      method,
      headers: (headers) ? Object.assign({}, globalHeaders, headers) : globalHeaders,
      body: (body) ? Ajax.__setBody(body) : false,
      credentials,
      onUploadProgress,
      onDownloadProgress,
      useBaseUrl,
      onReadyStateChange,
      autoSend,
    };
    return newOptions;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Ajax;
} else {
  window.Ajax = Ajax;
}
