//code.iamkate.com
var CapsLock=function(){var e=/Mac/.test(navigator.platform),b=!1,d=[];window.addEventListener("keypress",function(a){var c=a.charCode;a=a.shiftKey;var f=b;97<=c&&122>=c?b=a:!(65<=c&&90>=c)||a&&e||(b=!a);b!==f&&d.forEach(function(a){return a(b)})});return{isOn:function(){return b},addListener:function(a){d.push(a)}}}();
