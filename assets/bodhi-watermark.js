/* Bodhi Classes — हल्का, बड़ा वॉटरमार्क (स्क्रीन पर टिका रहता है)
   नियम: बहुत हल्का रंग, बड़ा आकार, पूरे पन्ने पर सिर्फ़ 1 बार — पढ़ने में बाधा न हो।
   पृष्ठभूमि हल्की है या गहरी — उसी के अनुसार रंग अपने-आप चुनता है। */
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

      var fill    = light ? '#8F6B26' : '#D9AE5F';
      var opacity = light ? 0.042    : 0.045;                     /* बहुत हल्का */

      var d = document.createElement('div');
      d.id = 'bodhi-wm';
      d.setAttribute('aria-hidden','true');
      d.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;'
        + 'z-index:2147483000;pointer-events:none;overflow:hidden;'
        + 'user-select:none;-webkit-user-select:none;';

      /* पूरे पन्ने पर सिर्फ़ एक बड़ा निशान */
      var spots = [
        { top: '46%', left: '4%' }
      ];

      for (var i = 0; i < spots.length; i++){
        var s = document.createElement('span');
        s.textContent = 'Bodhi Classes';
        s.style.cssText = 'position:absolute;white-space:nowrap;'
          + 'top:' + spots[i].top + ';left:' + spots[i].left + ';'
          + 'transform:rotate(-24deg);transform-origin:left center;'
          + 'font-family:Mukta,"Noto Sans Devanagari","Segoe UI",Arial,sans-serif;'
          + 'font-weight:700;letter-spacing:4px;'
          + 'font-size:clamp(52px,10vw,160px);line-height:1;'
          + 'color:' + fill + ';opacity:' + opacity + ';';
        d.appendChild(s);
      }

      document.body.appendChild(d);
    };
    if (document.body) mk(); else document.addEventListener('DOMContentLoaded', mk);
  }catch(e){}
})();
