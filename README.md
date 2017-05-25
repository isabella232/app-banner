# Ombori App Banner

## The lightweight mobile application banner for your website

![Preview](http://next.ombori.com/static/images/preview-desktop.png "App Banner Example")

![Mobile](http://next.ombori.com/static/images/mobile.png "Mobile Banner Example")

Easy to use, free, open-source configurable application banner for your website.

## How does it work?

When a customer visits your site, Desktop users are sent an SMS with a link to download your app.
Mobile users are automatically directed to the appropriate app store.

After a user has seen the app install banner, it won’t reappear. This ensures that the UX of your site is not degraded in any way.

## Usage
### External script

Just include this snippet in your website main page.

```javascript
<script>
  (function () {
    var appleId = 'id1234567890';
    var googleId = 'com.yourcompany.yourapp';
    var placement = 'bottom-left';
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.id = 'TheAppBanner';
    s.src = 'https://bruce.presencekit.com/main.js?&p=' + placement + '&apple=' + appleId + '&google=' + googleId;
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
```

### Npm package

Alternatively you can use the App Banner via npm package

```
npm install --save app-banner
```

```javascript
var appBanner = require('app-banner');
// - or -
import appBanner from 'app-banner';

appBanner.init({
  apple: 'id1234567890',
  google: 'com.youcompany.yourapp',
  placement: 'bottom-left',
})
```

### React component

Also you can use the App Banner as a React component
```
npm install --save app-banne
```

```javascript
import AppBanner from 'app-banner/src';

...
<div>
  <AppBanner google="com.presencekit.eyerim" apple="id1184932325" position="bottom-left" />
</div>
```
