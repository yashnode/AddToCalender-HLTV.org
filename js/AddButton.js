/*
  I created this extension for myself as I was constantly missing many high tier matches because of my bad memory.

*/  
/*! saferInnerHTML v1.1.2 | (c) 2018 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/reef */
/*! saferInnerHTML.js(minified) to fix security issues*/
Array.from || (Array.from = (function () { var t = Object.prototype.toString, e = function (e) { return "function" == typeof e || "[object Function]" === t.call(e) }, r = function (t) { var e = Number(t); return isNaN(e) ? 0 : 0 !== e && isFinite(e) ? (e > 0 ? 1 : -1) * Math.floor(Math.abs(e)) : e }, n = Math.pow(2, 53) - 1, o = function (t) { var e = r(t); return Math.min(Math.max(e, 0), n) }; return function (t) { var r = this, n = Object(t); if (null === t) throw new TypeError("Array.from requires an array-like object - not null or undefined"); var a, i = arguments.length > 1 ? arguments[1] : void 0; if (void 0 !== i) { if (!e(i)) throw new TypeError("Array.from: when provided, the second argument must be a function"); arguments.length > 2 && (a = arguments[2]) } for (var u, c = o(n.length), f = e(r) ? Object(new r(c)) : new Array(c), l = 0; l < c;)u = n[l], f[l] = i ? void 0 === a ? i(u, l) : i.call(a, u, l) : u, l += 1; return f.length = c, f } })()); var saferInnerHTML = function (t, e, r) { "use strict"; var n = null, o = function (t, e) { e.forEach((function (e) { "class" === e.att ? t.className = e.value : "data-" === e.att.slice(0, 5) ? t.setAttribute(e.att, e.value || "") : t[e.att] = e.value || "" })) }, a = function (t) { return Array.from(t).map((function (t) { return { att: t.name, value: t.value } })) }, i = function (t) { var e = "text" === t.type ? document.createTextNode(t.content) : document.createElement(t.type); return o(e, t.atts), t.children.length > 0 ? t.children.forEach((function (t) { e.appendChild(i(t)) })) : "text" !== t.type && (e.textContent = t.content), e }, u = function (t) { var e = []; return Array.from(t.childNodes).forEach((function (t) { e.push({ content: t.childNodes && t.childNodes.length > 0 ? null : t.textContent, atts: 3 === t.nodeType ? [] : a(t.attributes), type: 3 === t.nodeType ? "text" : t.tagName.toLowerCase(), children: u(t) }) })), e }; if (!t) throw new Error("safeInnerHTML: Please provide a valid element to inject content into"); if (!(function () { if (!Array.from || !window.DOMParser) return !1; n = n || new DOMParser; try { n.parseFromString("x", "text/html") } catch (t) { return !1 } return !0 })()) throw new Error("safeInnerHTML: Your browser is not supported."); !(function (e) { r || (t.innerHTML = ""), e.forEach((function (e, r) { t.appendChild(i(e)) })) })(u(function (t) { return n = n || new DOMParser, n.parseFromString(t, "text/html").body }(e))) };


//Main js script
'use strict';
document.addEventListener('DOMContentLoaded',onload());
function onload(){
    if (window.location.host === "www.hltv.org") {

      //Extracting all the details
      var title = document.getElementsByTagName("title");
      var description = title;
      var currentURL = window.location.href;
      var unixtime = document.getElementsByClassName("time")[0].getAttribute("data-unix");
      var unixTimestamp = unixtime/1000
      var fixedTime = unixTimestamp * 1000
      var StartTime = startTime()
      var EndTime = endTime()
      var FixedStartTime = fix(StartTime);
      var FixedEndTime  = fix(EndTime);
      
      //Starting Date and Time in ISO format
      function startTime(){
        const dateObject = new Date(fixedTime).toISOString();
        return dateObject;
      }
      //Ending Date and Time in ISO format
      function endTime(){
        var inMinutes = 60 * 1000;
        var s = fixedTime + (120*inMinutes);
        const enddateObject = new Date(s).toISOString();
        return enddateObject;
      }
      //Adding TimeZoneOffset to the time 
      function TimeZoneOffset(time){
      var date = time;
      var targetTime = new Date(date);
      var DefaultTimeZone = -0.00; 
      var tzDifference = DefaultTimeZone * 60 + targetTime.getTimezoneOffset();
      var offsetTime = new Date(targetTime.getTime() - tzDifference * 60 * 1000);
      const TimeOffset = new Date(offsetTime).toISOString();
      return TimeOffset;
      }
      
      //Removing characters from the date
      function fix(UnfixedDate){
        const date = UnfixedDate;
        var time  = date.replace(/[:,.-]/g, '');
        return time;
      }
      //Calculate Start and End Time with TimeZoneOffset
      const StartTimeWithOffset = TimeZoneOffset(StartTime);
      var FixedStartTimeWithOffset = fix(StartTimeWithOffset);
      const EndTimeWithOffset = TimeZoneOffset(EndTime);
      var FixedEndTimeWithOffset = fix(EndTimeWithOffset);
      
      //Google Calendar - will take ISO 8601 directly
      var url = encodeURI([
        'https://www.google.com/calendar/render',
              '?action=TEMPLATE',
              '&text=' + (title[0].innerText || ''),
              '&dates=' + (FixedStartTime || ''),
              '/' + (FixedEndTime || ''),
              '&details=' + (description[0].innerText || ''),
              '&location=' + (currentURL || ''),
              '&sprop=&sprop=name:'
            ].join(''));
      
      //iCalendar - need ISO 8601 with TimeZoneOffset
      var icsFile = null;
      function makeIcsFile() {
        var test =
          "BEGIN:VCALENDAR\n" +
          "CALSCALE:GREGORIAN\n" +
          "METHOD:PUBLISH\n" +
          "PRODID:-//HLTV//EN\n" +
          "VERSION:2.0\n" +
          "BEGIN:VEVENT\n" +
          "UID:HLTV\n" +
          "DTSTART;VALUE=DATE:" +
          FixedStartTimeWithOffset +
          "\n" +
          "DTEND;VALUE=DATE:" +
          FixedEndTimeWithOffset +
          "\n" +
          "SUMMARY:" +
          title[0].innerText +
          "\n" +
          "DESCRIPTION:" +
          description[0].innerText +
          "\n" +
          "LOCATION:" +
          currentURL +
          "\n" +
          "END:VEVENT\n" +
          "END:VCALENDAR";
      
        var data = new File([test], { type: "text/plain" });   
        if (icsFile !== null) {
          window.URL.revokeObjectURL(icsFile);
        }
      
        icsFile = window.URL.createObjectURL(data);
      
        return icsFile;
      }  
      
      //Yahoo Calendar - need ISO 8601 with TimeZoneOffset
      var dur = '0200';
      var url2 = encodeURI([
        'http://calendar.yahoo.com/?v=60&view=d&type=20',
        '&title=' + (title[0].innerText|| ''),
        '&st=' + FixedStartTimeWithOffset,
        '&dur=' + (dur || ''),
        '&desc=' + (description[0].innerText || ''),
        '&in_loc=' + (currentURL || '')
      ].join(''));
      
      //Adding the button
      var htmlString = '<div class="dropdown"><button class="dropbtn">Add To Calendar</button><div class="dropdown-content"><a id="google" target="_blank" href="#">Google Calendar</a><a id="yahoo" target="_blank" href="#">Yahoo Calendar</a><a download="iCalendar.ics" id="ical" target="_blank" href="#">iCalendar(.ics)</a></div></div>',
          div = document.createElement('div'),
          div1 = document.querySelector('.event.text-ellipsis');
          saferInnerHTML(div,htmlString);
          div1.parentNode.insertBefore(div.firstChild, div1.nextSibling);
      var element = document.getElementById('google');
          element.setAttribute("href",url);
      var link = document.getElementById('ical');
          link.setAttribute("href",makeIcsFile());
      var element2 = document.getElementById('yahoo');
          element2.setAttribute("href",url2);
      console.info(`ADD TO CALENDAR button on ${window.location.hostname} has been added.`);
    }
  }
  
  
