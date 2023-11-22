# 🌲✉️ Alpine.js Requests

✉️ Inline HTTP requests made simple for Alpine.js 🌲

## What is Alpine.js Requests?

Alpine.js Requests aims to make HTTP requests easy within Alpine.
The main use case for this package is for simple requests actions that do not require advance responses.
For example, you could use this package to easily send a POST request when a user presses the like button.

## Install

### NPM

Install the package with the following command:

```
npm i alpinejs-requests
```

Import and register the package:

```
import Alpine from 'alpinejs'
import requests from 'alpinejs-requests'

Alpine.plugin(requests)

Alpine.start()
```

### Script Tag

```
<html>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs-requests@1.x.x/dist/plugin.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</html>
```

## Documentation

### x-post

`x-post` allows you to easily create a POST request on the click event of a DOM element.

In its simplest form, you can pass a string that will be used as the URL to send the POST request to.
```
<button type="button" x-post="/api/videos/4/like">Like</button>
```

If required, additional data can be passed through the `x-post` directive.
```
<button
    type="button"
    x-post="{route: '/api/videos/4/like', body: {stars: 3}, headers: {}}"
>Like</button>
```

If you want to use the response from the POST request, you can access this through the `@post` event.
This event is called once the request has resolved. You can access the response object with `$event.detail.response`.
You can also access a "state" variable with `$event.detail.state`. This will be true/false depending on the success of the request.
```
<button
    type="button"
    x-post="{route: '/api/videos/4/like', body: {stars: 3}}"
    @post="liked = true;"
    x-text="liked ? 'Liked' : 'Like'"
></button>
```

A magic method of `$post` is also provided. This is useful for making quick requests inside other events.
```
<div x-init="$request('/api/videos/4/view');"></div>
<button
    type="button"
    @click="$request({route: '/api/videos/4/like', body: {stars: 3}})"
>Like</button>
```

### x-get

`x-get` works essentially identically to `x-post`. Rather obviously, the only difference is that it makes a GET request instead of a POST request.
The functionality is identical in what can be passed to an `x-get`, and how the system resolves it. Something to note is that the event for a GET request
lands in the @get event.
```
<button
    type="button"
    x-get="/api/videos/4/refresh"
    @get="views = $event.detail.response.body"
>
    <span x-text="views"></span> Views
</button>
```

There is also a `$get` magic method.
```
<div
    x-init="$get('/api/videos/4/info');"
    @get="views = $event.detail.response.json().views"
></div>
<p>
    <span x-text="views"></span> Views
</p>
```

### x-request

`x-request` is the Alpine.js Request library in its freest form. It functions the same as `x-post` and `x-get`, but allows for the additional
definition of a method. This means you can define which method to use, including things like DELETE, PATH ect.
```
<button
    type="button"
    x-request="{route: '/api/videos/4', method: 'DELETE'}"
>Delete</button>
```

You can also use the magic method `$request`.
