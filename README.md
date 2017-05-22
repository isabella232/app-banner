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
    s.src = '/main.js?&p=' + placement + '&apple=' + appleId + '&google=' + googleId;
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
```

Alternatively you can use the App Banner via npm package

```
npm install --save app-banner
```

```javascript
const appBanner = require('app-banner');

appBanner.create({
  appleId: 'id1234567890',
  googleId: 'com.youcompany.yourapp',
  placement: 'bottom-left',
})
```
