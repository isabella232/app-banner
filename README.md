# Ombori App Banner

## The lightweight mobile application banner for your website

![Preview](http://next.ombori.com/static/images/preview-desktop.svg "App Banner Example")

![Mobile](http://next.ombori.com/static/images/mobile.svg "Mobile Banner Example")

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
    s.src = 'https://bruce.presencekit.com/p/main.js?&p=' + placement + '&apple=' + appleId + '&google=' + googleId;
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
npm install --save app-banner
```

```javascript
import AppBanner from 'app-banner/src';

...
<div>
  <AppBanner google="com.youcompany.yourapp" apple="id1234567890" position="bottom-left" />
</div>
```

## Parameters

  * `apple` or `a` - App Store ID of your application
  * `google` or `g` - Google Play ID of your application
  * `placement` or `p` - Banner position on screen. Possible values are `'top-left'`, `'top-right'`, `'bottom-left'` or `'bottom-right'`. Default value is `'bottom-right'`. Only applies to desktop version of banner.
  * `minimize` or `m` - Banner behaviour when user dismisses the banner. When minimized, the banner will display smaller version of itself instead of completly dissapear. Possible values are `'yes'`, `'no'` and `'mobile'`. When `'mobile'` is specified, the banner will be minimized if shown on mobile device and completely dissapear on desktop. Default value is `'yes'`.
  * `noTrack` or `n` - Do not track usage statistics. `false` by default.
  * `text[CC]` or `t[CC]` - Alternate text to display on the desktop banner. `CC` is two-letter language code like `text[en]` or `text[ru]`.

Note: shorthand parameters like `a`, `g` or `p` are only supported in script URL when App Banner is used via external script.