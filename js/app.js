$(function() {
  // Calendar function
  var actualDate = new Date();
  var actualYear = actualDate.getFullYear();
  var actualMonth = actualDate.getMonth() + 1;
  var actualDay = actualDate.getDate();
  function generateCalendar(d) {
    var days = howManyDays(d);
    var shift = getDayFirstDate(d);
    clear();
    for(var i=0; i<days;i++) {
      var posi_row = Math.floor((i+shift)/7);
      var posi_col = Math.floor((i+shift)%7);
      var $dayCell = $('#calendar_display .r'+posi_row).children('.col'+posi_col).children('div');
      $dayCell.text(i+1);
      // 'check' actual day on calendar
      if( d.getMonth() + 1 === actualMonth && actualDay === i + 1 && d.getFullYear() === actualYear ) {
        $dayCell.addClass('actual--date');
      } /* 'gray' passed days on calendar */ 
        else if  (
          d.getFullYear() < actualYear ||
          (d.getFullYear() === actualYear && d.getMonth() + 1 < actualMonth) ||
          (d.getFullYear() === actualYear && d.getMonth() + 1 === actualMonth && i+1 < actualDay)
        ) {
        $dayCell.addClass('passed--date');
      }
    }
  }
  function clear(){
    $('.table-content-input').each(function(){
      $(this).html('').removeClass('actual--date passed--date');
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
    var monthNames = [null, "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    $('#data_chooser').html(monthNames[d.getMonth()+1]);
    generateCalendar(d);
    $('#prevMonth').click(function() {
      updateDate(d, 0);
      $('#data_chooser').html(monthNames[d.getMonth()+1]);
      generateCalendar(d);
      return false;
    });
    $('#nextMonth').click(function() {
      updateDate(d, 1);
      $('#data_chooser').html(monthNames[d.getMonth()+1]);
      generateCalendar(d);
      return false;
    });
  });

  // Booking select scr
  var setSelectedValue = function() {
    var selectedText = $(this).find(':selected').text();
    $(this).siblings('.booking__input-val').text(selectedText);
  }

  $('.booking__select').each(setSelectedValue);
  $('.booking__select').on('change', setSelectedValue);
})

