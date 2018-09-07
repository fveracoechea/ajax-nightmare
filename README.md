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
### this documentation is not ready...
