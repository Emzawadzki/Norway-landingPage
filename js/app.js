$(function() {
  // Calendar function
  var actualDate = new Date();
  var actualYear = actualDate.getFullYear();
  var chosenYear = actualYear;
  var actualMonth = actualDate.getMonth() + 1;
  var chosenMonth = actualMonth;
  var actualDay = actualDate.getDate();
  var chosenDay = actualDay;
  function generateCalendar(d) {
    var days = howManyDays(d);
    var shift = getDayFirstDate(d);
    clear();
    daysLoop:
      for(var i=0; i<days;i++) {
        var posi_row = Math.floor((i+shift)/7);
        var posi_col = Math.floor((i+shift)%7);
        var $dayCell = $('#calendar_display .r'+posi_row).children('.col'+posi_col).children('div');
        $dayCell.text(i+1);
        $dayCell.off();
        // check if forbidden
        for(var j=0; j<dataBase["forbiddenDays"].length; j++) {
          var forbiddenDay = dataBase["forbiddenDays"][j];
          if( d.getFullYear() === forbiddenDay["year"] && d.getMonth() + 1 === forbiddenDay["month"] && i+1 === forbiddenDay["day"] ) {
            $dayCell.addClass('forbidden--date');
            continue daysLoop;
          }
        }
        // 'check' chosen day on calendar
        if( d.getMonth() + 1 === chosenMonth && chosenDay === i + 1 && d.getFullYear() === chosenYear ) {
          $dayCell.addClass('chosen--date');
          continue;
        } /* 'gray' passed days on calendar */ 
          else if (
            d.getFullYear() < actualYear ||
            (d.getFullYear() === actualYear && d.getMonth() + 1 < actualMonth) ||
            (d.getFullYear() === actualYear && d.getMonth() + 1 === actualMonth && i+1 < actualDay)
          ) {
          $dayCell.addClass('passed--date');
          continue;
        } else {
          $dayCell.on('click', function() {
            chosenDay = parseInt($(this).text(), 10);
            chosenMonth = d.getMonth() + 1;
            chosenYear = d.getFullYear();
            generateCalendar(d);
          })
        }
      }
  }
  function clear(){
    $('.table-content-input').each(function(){
      $(this).html('').removeClass('chosen--date passed--date forbidden--date');
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

  // Booking custom selector function
  function setSelectedValue() {
    var selectedText = $(this).find(':selected').text();
    $(this).siblings('.booking__input-val').text(selectedText);
  }
  
  // Load cities from DB and set them as options
  var $citySelectEl = $('#js-booking-city-select');
  var $hotelSelectEl = $('#js-booking-hotel-select');
  var $emailInputEl = $('#js-booking-email');

  (function initSelectOptFromDb() {
    var cityList = dataBase["cities"];
    for(var i = 0; i < cityList.length; i++) {
      $citySelectEl.append(`<option value='${cityList[i]["name"]}'>${cityList[i]["name"]}</option>`);
    };
    $citySelectEl.val(`${cityList[0]["name"]}`);
    setSelectedValue.call($citySelectEl);
    setCityHotels(cityList[0]["name"]);
    setSelectedValue.call($hotelSelectEl);
  })();

  // function setting city hotels as options
  function setCityHotels(city) {
    var hotelsList = dataBase["cities"].find(function(el) {
      return el["name"] === city
    })["hotels"];
    $hotelSelectEl.empty();
    for(var i = 0; i < hotelsList.length; i++) {
      $hotelSelectEl.append(`<option value='${hotelsList[i]}'>${hotelsList[i]}</option>`);
    }
    $hotelSelectEl.val(hotelsList[0]);
    setSelectedValue.call($hotelSelectEl);
  }

  $citySelectEl.on('change', function(e) {
    setSelectedValue.call($(this));
    setCityHotels(e.target.value);
  });
  $hotelSelectEl.on('change', setSelectedValue);

  // Email validation
  function ValidateEmail(){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($emailInputEl.val())){
      return (true)
    }
    return (false)
  }


  // Booking form validation
  var $bookingForm = $('#js-booking-form');
  $bookingForm.on('submit', function(e) {
    e.preventDefault();
    if(!ValidateEmail()) {
      alert('Niepoprawny e-mail!')
      return false;
    }
    ;
    var loggedOutput = {
      "date": {
        "day": chosenDay,
        "month": chosenMonth,
        "year": chosenYear
      },
      "hotel": {
        "city": $citySelectEl.val(),
        "name": $hotelSelectEl.val()
      },
      "contact": {
        "email": $emailInputEl.val()
      } 
    };
    console.log(loggedOutput);
  })

});

//json-type object, simulating data base
const dataBase = {
  "forbiddenDays": [
    {
      "year": 2018,
      "month": 7,
      "day": 14
    },
    {
      "year": 2018,
      "month": 8,
      "day": 20
    },
    {
      "year": 2018,
      "month": 8,
      "day": 22
    },
    {
      "year": 2018,
      "month": 7,
      "day": 21
    },
    {
      "year": 2018,
      "month": 7,
      "day": 25
    }
  ],
  "cities": [
    {
      "name": "Warsaw",
      "hotels": ["VicHotel", "NiceHotel", "CrazyHotel"]
    },
    {
      "name": "Cracow",
      "hotels": ["KindHotel", "RudeHotel", "FunnyHotel"]
    }
  ]
}