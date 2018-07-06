$(function() {
  console.log('works');
  

  // Calendar function
  function generateCalendar(d) {
    var days = howManyDays(d);
    var shift = getDayFirstDate(d);
    clear();
    for(var i=0; i<days;i++) {
      var posi_row = Math.floor((i+shift)/7);
      var posi_col = Math.floor((i+shift)%7);
      $('#calendar_display .r'+posi_row).children('.col'+posi_col).html(i+1);
    }
  }
  function clear(){
    $('#calendar_display tbody td').each(function(){
      $(this).html('');
    })
  }
  function getDayFirstDate(d) {
    var tempd = new Date();
    tempd.setFullYear(d.getFullYear());
    tempd.setMonth(d.getMonth());
    tempd.setDate(1);
    tempd.setHours(0);
    tempd.setMinutes(0);
    tempd.setSeconds(0);
    // var timeSince1970 = tempd.getTime();
    // var daysSince1970 = Math.floor(timeSince1970/(1000*60*60*24));
    // return (daysSince1970+4)%7;
    return tempd.getDay();
  }
  function howManyDays(d) {
    var m = d.getMonth()+1 ;
    if(m==1||m==3||m==5||m==7||m==8||m==10||m==12) return 31;
    if(m==2) {
      if(isLeapYear(d.getFullYear())) {
        return 29
      } else {
        return 28
      }
    }
    return 30;
  }
  function isLeapYear(year) {
    if(year%400==0) {
      return true;
    } else if(year%100==0) {
      return false;
    } else if(year%4==0) {
      return true;
    } else {
      return false;
    }
  }
  function updateDate(d, sign) {
    var m = d.getMonth();
    if(sign) {
      if(m+1>11) {
        d.setFullYear(d.getFullYear()+1);
        d.setMonth(0);
      } else {
        d.setMonth(m+1);
      }
    } else {
      if(m-1<0) {
        d.setFullYear(d.getFullYear()-1);
        d.setMonth(11);
      } else {
        d.setMonth(m-1);
      }
    }
  }
  $(function(){
    var d = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    $('#data_chooser').html(monthNames[d.getMonth()+1]);
    generateCalendar(d);
    $('#prevMonth').click(function() {
      updateDate(d, 0);
      $('#data_chooser').html(monthNames[d.getMonth()]);
      generateCalendar(d);
      return false;
    });
    $('#nextMonth').click(function() {
      updateDate(d, 1);
      $('#data_chooser').html(monthNames[d.getMonth()]);
      generateCalendar(d);
      return false;
    });
  });
})

