/**
 * Cookie Dumper
 * Parses the `document.cookie` and decodes values when possible, then dumps
 * it to the console as object.
 * Intended to be used as a bookmarklet.
 * Copyright (c) 2013 Ilya I
 */

(function(options) {
  function CookieList() {}
  function getCookies(options) {
    var cookies = document.cookie.split(/;\s*/);
    var cookiesObj = new CookieList();
    cookies.forEach(function(cookie) {
      var eq = cookie.indexOf("=");
      var key = cookie.substring(0, eq);
      var value = cookie.substring(eq + 1);
      if (options.uri) {
        try {
          value = decodeURIComponent(value);
        } catch (e) {
          try {
            value = unescape(value);
          } catch (e) {
            // ignore
          }
        }
      }
      if (options.base64 && window.atob) {
        try {
          var newValue = atob(value);
          // Prevent usage of decoded value if it contains bad chars
          for (var i = newValue.length - 1; i >= 0; --i) {
            if (newValue.charCodeAt(i) > 127) break;
          }
          if (!i) value = newValue;
        } catch (e) {
          // ignore
        }
      }
      if (options.json && window.JSON) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // ignore
        }
      }
      cookiesObj[key] = value;
    });
    return cookiesObj;
  }
  function dumpObject(obj) {
    if (window.console && window.console.dir) {
      console.dir(obj);
    }
  }
  dumpObject(getCookies(options));
})({uri: true, json: true, base64: true});
