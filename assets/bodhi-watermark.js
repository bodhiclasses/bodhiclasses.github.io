/* Bodhi Classes — हल्का टाइल्ड वॉटरमार्क (पढ़ने/स्क्रॉल पर स्क्रीन पर टिका रहता है) */
(function(){
  try{
    var raw = '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220">'
      + '<text x="16" y="140" transform="rotate(-30 180 110)" '
      + 'font-family="Mukta, Segoe UI, Arial, sans-serif" font-size="27" '
      + 'font-weight="700" letter-spacing="2" fill="#D9AE5F" fill-opacity="0.11">'
      + 'Bodhi Classes</text></svg>';
    var uri = 'data:image/svg+xml,' + encodeURIComponent(raw);
    var mk = function(){
      if (document.getElementById('bodhi-wm')) return;
      var d = document.createElement('div');
      d.id = 'bodhi-wm';
      d.setAttribute('aria-hidden','true');
      d.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;'
        + 'z-index:2147483000;pointer-events:none;'
        + 'background-image:url("'+uri+'");background-repeat:repeat;background-position:0 0;';
      document.body.appendChild(d);
    };
    if (document.body) mk(); else document.addEventListener('DOMContentLoaded', mk);
  }catch(e){}
})();
