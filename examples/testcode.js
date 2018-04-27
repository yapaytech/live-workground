(()=>{
  var insertParamToUrl=function(a,b,c){c||(c=window.location.href);var e,d=new RegExp("([?&])"+a+"=.*?(&|#|$)(.*)","gi");if(d.test(c))return"undefined"!=typeof b&&null!==b?c.replace(d,"$1"+a+"="+b+"$2$3"):(e=c.split("#"),c=e[0].replace(d,"$1$3").replace(/(&|\?)$/,""),"undefined"!=typeof e[1]&&null!==e[1]&&(c+="#"+e[1]),c);if("undefined"!=typeof b&&null!==b){var f=-1===c.indexOf("?")?"?":"&";e=c.split("#"),c=e[0]+f+a+"="+b,"undefined"!=typeof e[1]&&null!==e[1]&&(c+="#"+e[1])}return c};
  history.replaceState(history.state, document.title, insertParamToUrl('join',''));
  $('#__load,#dahiWrap,#maytapChat').remove();window.maytapChat = window.dahiNotify = undefined;
  localStorage.setItem('maytapChatUser','{}');localStorage.setItem('chatLastState','{}');
  window.dahiCoreUrl = "http://localhost:8080/core.js";
    window.maytapChat || (function (a, b, c) {
      var e, f = a.getElementsByTagName(b)[0];
      a.getElementById(c) || (e = a.createElement(b), e.id = c, e.src =
        'http://localhost:8080/client.js', e.onload = function () {
          new maytapChat().widget({
            pid:"9b3c8f60179190f1949dfdc98cef6d36",
            server: 'azure',
            //join:1,
            //emoji:1,
            chatstyle:'int',
            widgetType:'toggle',
            dll:['http://localhost:8080/dll/deneme.js']
          })
        }, f.parentNode.insertBefore(e, f))
    })(document, 'script', 'maytapChat');
})();