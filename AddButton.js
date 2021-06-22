/*
  I created this extension for myself as I was constantly missing many high tier matches because of my bad memory.
  Also, If you are here to review my code. I am really sorry if you have trouble understanding. Trust me, I get confused too.
  I just started coding and I am learning by docs and hit & trial methods. So bear with me. Thanks <3
*/  

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
      console.log(FixedStartTimeWithOffset,FixedEndTimeWithOffset);
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
          div.innerHTML = htmlString;
          div1.parentNode.insertBefore(div.firstChild, div1.nextSibling);
      var element = document.getElementById('google');
          element.setAttribute("href",url);
      var link = document.getElementById('ical');
          link.setAttribute("href",makeIcsFile());
      var element2 = document.getElementById('yahoo');
          element2.setAttribute("href",url2);
      console.info(`ADD TO CALENDAR button on ${window.location.hostname} has been added.`);
    }
    else if (window.location.host === "www.espn.com"){
        //coming soon
    }
  }
  
  