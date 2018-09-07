let baseUrl = '';
// let baseUrl = 'undefined';
let token = '';
// request error timeout
let timeout = (1000 * 60) * 1.5;
// global headers
let globalHeaders = {}; // 'Accept': 'application/json',

class Ajax extends XMLHttpRequest {

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
  
  constructor(endpoint = '', options = {}) {
    super();
    this.success = false;
    this.error = false;
    this.__hashHeaders = false;
    this.__options = Ajax.__setRequestOptions(options);
    this.__url = (this.__options.useBaseUrl) ? `${Ajax.baseUrl}${endpoint}` : endpoint;
    this.__progressListeners();
    this.__resultListeners();
    this.open(this.__options.method, this.__url, true);
    this.timeout = timeout;
    this.__setHeaders();
    if (this.__options.body) {
      this.send(this.__options.body);
    } else {
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

  __setHeaders() {
    for(let arg of Object.entries(this.__options.headers)) {
      if (this.__options.body) {
        if (arg[0] !== 'Content-Type' || arg[0] !== 'content-type') {
          this.setRequestHeader(arg[0],arg[1]);
        }
      } else {
        this.setRequestHeader(arg[0],arg[1]);
      }
    }
    if(this.__options.credentials) {
      this.setRequestHeader('Authorization', token);
    }
  }

  __progressListeners() {
    this.addEventListener('progress', (e) => {
      this.downloadProgress = (e.loaded / e.total) * 100;
      this.__options.onDownloadProgress(e, this.downloadProgress)
    });
    this.upload.addEventListener('progress', (e) => {
      this.uploadProgress = (e.loaded / e.total) * 100;
      this.__options.onUploadProgress(e, this.uploadProgress)
    });
  }

  __resultListeners() {
    this.result = () => new Promise( (resolve, reject) => {
      this.onload = () => {
        try {
          const success = JSON.parse(this.responseText);
          this.success = success;
          this.error = false;
          resolve(success);
        } catch (error) {
          this.success = this.responseText;
          resolve(this.responseText);
        }
      };
      this.onabort = () => {
        this.success = false;
        this.error = {
          fail: true,
          type: 'abort',
          status: this.status,
          message: 'Aborted Request',
        };
        reject(this.error);
      };
      this.onerror = () => {
        this.success = false;
        this.error = {
          fail: true,
          type: 'error',
          status: this.status,
          message: 'Network Connection Error!',
        };
        reject(this.error);
      };
    });
  }

  static __setRequestOptions(options){
    if (options.headers) {
      this.__hashHeaders = true;
    }
    const {
      method = 'GET',
      headers = false,
      body = false,
      credentials = false,
      onUploadProgress = () => null,
      onDownloadProgress = () => null,
      useBaseUrl = true,
    } = options;
    const newOptions = {
      method,
      headers: (headers) ? { ...globalHeaders, ...headers } : globalHeaders,
      body: (body) ? Ajax.__setBody(body) : false,
      credentials,
      onUploadProgress,
      onDownloadProgress,
      useBaseUrl,
    };
    return newOptions;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Ajax;
} else {
  window.Ajax = Ajax;
}
