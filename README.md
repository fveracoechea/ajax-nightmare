# ajax-nightmare
A simple API that implements XMLHttpRequest based on promises

## Get Start
    npm install --save ajax-nightmare
### Basic usage
```js
// with webpack
import Ajax from 'ajax-nightmare';
// or
<script src="./node_modules/ajax-nightmare/lib/app.js"></script>
// ...
// instance of this ajax request
const request = new Ajax('http://www.omdbapi.com/?i=tt3896198&apikey=a95b5205');
request.result()
  .then(json => console.log(json))
  .catch(error => console.log(error));
```
## Global config
this api provides several global configurations that when established are automatically applied to each instance when performing an http request

### Base Url
after specifying the base url you will only have to provide the specific endpoint
```js
Ajax.baseUrl = 'https://www.example.com/api';
const requests = {};
// url = https://www.example.com/api/users
request.users = new Ajax('/users');
request.users.result()
  .then(json => console.log(json))
  .catch(error => console.log(error));
// url = https://www.example.com/api/profiles
request.profiles = new Ajax('/profiles');
request.profiles.result()
  .then(json => console.log(json))
  .catch(error => console.log(error));
```
### Token - Authorization header
In case you are using authentication you can use this configuration to set the 'Authorization' header with a certain token
```js
Ajax.token = '1s2fd8h503jfn2gn4jgj405dcnb94';
```
### Global Headers
If your requests need to make use of a specific header you can specify it here. This will not affect the headers that you set in a specific way is a certain instance. (We'll see later) ...

```js
Ajax.globalHeaders = {
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};
```
## Single options
```js
const request = new Ajax('/sports', {
  method: 'POST', // default GET
  headers: { // default {}, it is possible to overwrite a header if you have already set it in the global headers
    'Accept': 'application/json',
  },
  body: { // default {} 
    name: 'soccer',
    desciption: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  credentials: true, // default false, Here you specify if authentication using the token is used
  useBaseUrl: false, // default true, it is specified if the base url is used or not
  onUploadProgress: (event, progress) => console.log(event, progress),
  onReadyStateChange: () => console.log(request.readyState),
});
```

## Aborting a request
it is possible to abort a request by executing the abort method of an instance
```js
request.profiles = new Ajax('/profiles');
request.profiles.result()
  .then(json => console.log(json))
  .catch(error => console.log(error));

setTimeout(() => {
  request.abort();
}, 2000);
```
## Error handling
```js
request.profiles = new Ajax('/games');
request.profiles.result()
  .then(json => console.log(json))
  .catch(error => console.log(error));
// console output
  {
    fail: true,
    type: 'error',
    status: 0,
    message: 'Network Connection Error',
  }

// if abort () is used
// console output
  {
    fail: true,
    type: 'abort',
    status: 0,
    message: 'Aborted Request',
  }
```
## Instance properties
```js
// success and error
// provides the result of a request, at the beginning it is false, but when the information arrives its value is changed
request.profiles = new Ajax('/games');
await request.result();
console.log(request.success);
console.log(request.error);
//and default properties of XMLHttpRequest
request.status
request.statusText
request.responseText
request.readyState
```
