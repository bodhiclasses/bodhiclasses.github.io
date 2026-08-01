/* Bodhi Classes — हल्का टाइल्ड वॉटरमार्क (पढ़ने/स्क्रॉल पर स्क्रीन पर टिका रहता है)
   पृष्ठभूमि हल्की है या गहरी — उसी के अनुसार रंग और गाढ़ापन अपने-आप चुनता है। */
(function(){
  try{
    var mk = function(){
      if (document.getElementById('bodhi-wm')) return;

      /* --- पृष्ठभूमि हल्की है या गहरी? --- */
      var lum = function(el){
        try{
          var c = getComputedStyle(el).backgroundColor || '';
          var m = c.match(/rgba?\(([^)]+)\)/);
          if(!m) return null;
          var p = m[1].split(',').map(function(x){ return parseFloat(x); });
          if(p.length > 3 && p[3] === 0) return null;            /* पारदर्शी */
          return (0.2126*p[0] + 0.7152*p[1] + 0.0722*p[2]) / 255;
        }catch(e){ return null; }
      };
      var L = lum(document.body);
      if (L === null) L = lum(document.documentElement);
      if (L === null) L = 0.05;                                   /* पता न चले तो गहरा मानो */
      var light = L > 0.5;

      var fill    = light ? '#8F6B26' : '#D9AE5F';                /* हल्के पन्ने पर गहरा सुनहरा */
      var opacity = light ? '0.13'    : '0.15';                   /* पहले से ~4% गाढ़ा */

      var raw = '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220">'
        + '<text x="16" y="140" transform="rotate(-30 180 110)" '
        + 'font-family="Mukta, Segoe UI, Arial, sans-serif" font-size="27" '
        + 'font-weight="700" letter-spacing="2" fill="' + fill + '" fill-opacity="' + opacity + '">'
        + 'Bodhi Classes</text></svg>';
      var uri = 'data:image/svg+xml,' + encodeURIComponent(raw);

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
