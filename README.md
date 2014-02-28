# Sysinct
Broadcasting your log files with web sockets

## What?
Sysinct takes syslog dumps - sent as a syslog drain - and spits them out via websockets (socket.io specifically). There's not much else to say - it's just easy.

## How?
**1. Point your syslog drain at a sysinct server**  
Sysinct reads drains from a specific URL pattern:

`http://sysinctserver.com/drains/room`

`room` should be something unique that probably won't ever be used by someone else. Random crazy strings are even better, but remember the room name; you'll need that when you connect from the client.

Right now I'm hosting a sysinct server that you can use. If it gets overused I will shut it down, or require you to pay me. Probably don't rely on my server in production.
The server is `http://sysinct.herokuapp.com`

If you're hosting your app on Heroku, you can easily setup a syslog drain using:

```
heroku drains:add http://sysinct.herokuapp.com/drains/yourappname
```
**2. Load in socket.io on the client**  
You can probably load in socket.io from your local server or a CDN if that's what you want, but I suggest just loading it from Sysinct. Otherwise we might have some version conflict issues.
Put this in your HTML:

```html
<script src="http://sysinct.herokuapp.com/socket.io/socket.io.js"></script>
```

**3. Subscribe to your logs**  
Now you need to tell socket.io to listen for logs on your app. This is where you need the room name from step 1.
Create some javascript that looks something like this:

```js
var socket = io.connect("http://sysinct.herokuapp.com");
socket.emit('subscribe', 'yourapp');
```

**4. Read the logs**  
Anytime a new log comes in, socket.io will receive a `log` event. The message on that event is the raw log line that the server received.
So your javascript would look like:

```js
socket.on('log', function(data) {
    console.log('log', data);
});
```

## Why?
Logs generally contain secure and private data, so you're probably thinking *"why would I ever want to broadcast my log files over the internet???"* You're right - you probably don't want to.

However, some projects don't have any sensitive data in their log files. Open source projects are a good example of this - in fact, Sysinct was built for [pullup.io](http://pullup.io).  For an open source project, broadcasting log files might be very useful for community debugging purposes.

## Who?
[Joe Wegner](https://twitter.com/Joe_Wegner) from [WegnerDesign](http://www.wegnerdesign.com)
