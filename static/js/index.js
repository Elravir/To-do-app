const DEFAULT_OPTION = "Выберите переговорку";


let taskData = [],
  nameEvnt,
  idMeet,
  idMeetSelect = document.getElementById("idMeet"),
  dateInput,
  timeInput,
  dateInputEnd,
  timeInputEnd,
  allDayCheck,
  meetSelect = document.getElementById("meetFilter"),
  desc,
  sortlistBtn = document.getElementById('sortlistBtn'),
  calendar;

var tbl = document.getElementById("dataTbl");

sortlistBtn.addEventListener("change", multipleFilter, false);

function backWeb(){
  window.location.href = "index1.html";
}

//взять данные с формы
function addRow() {
  nameEvnt = document.getElementById("nameTask").value;
  idMeet = document.getElementById("idMeet").value;
  dateInput = document.getElementById("dateInput").value;
  timeInput = document.getElementById("timeInput").value;
  dateInputEnd = document.getElementById("dateInputEnd").value;
  timeInputEnd = document.getElementById("timeInputEnd").value;
  allDayCheck = document.getElementById("allDayCheck");
  desc = document.getElementById("descTask").value;

  let new_task;

  if (allDayCheck.checked) {

    new_task = {
      id: _uuid(),
      title: nameEvnt,
      idMeet: idMeet,
      allDay: true,
      date: dateInput,
      time: timeInput,
      end: "",
      timeEnd: "",
      desc: desc,
      done: false
    }
  } else {
    new_task = {
      id: _uuid(),
      title: nameEvnt,
      idMeet: idMeet,
      allDay: false,
      date: dateInput,
      end: dateInputEnd,
      time: timeInput,
      timeEnd: timeInputEnd,
      desc: desc,
      done: false
    }
  }

  nameEvnt = "";
  idMeet = "";
  dateInput = "";
  timeInput = "";
  dateInputEnd = "";
  timeInputEnd = "";
  renderRow(new_task);

  addTask(new_task);

  //добавление новых митов в фильтр
  updateSelectOption();

}

//очистка таблицы
function clearTable() {
  let rows = tbl.rows;
  for (let i = rows.length - 1; i > 0; i--) {
    rows[i].remove();
  }

  calendar.getEvents().forEach(eventObj => eventObj.remove());
}

//фильтрация по idMeet и выполненным задачам
function multipleFilter() {
  clearTable();

  let selection = meetSelect.value;

  if (selection == DEFAULT_OPTION) {

    updateSelectOption();

    if (sortlistBtn.checked) {
      let filteredArray = taskData.filter(obj => obj.done == false  || obj.done == 'False');
      renderAllRows(filteredArray);

      let filteredDoneArray = taskData.filter(obj => obj.done == true || obj.done == 'True');
      renderAllRows(filteredDoneArray);

    } else {
      renderAllRows(taskData);
    }

    console.log("you are in filtered function");

  } else {
    let filteredArray = taskData.filter(obj => obj.idMeet == selection);

    if (sortlistBtn.checked) {
      let filteredIncompleteArray = filteredArray.filter(obj => obj.done == false || obj.done == 'False');
      renderAllRows(filteredIncompleteArray);

      let filteredDoneArray = filteredArray.filter(obj => obj.done == true || obj.done == 'True');
      renderAllRows(filteredDoneArray);

    } else {
      renderAllRows(filteredArray);
    }

  }
}


//вывод строк данных из базы
function renderAllRows(arr) {
  arr.forEach(task => {
    renderRow(task);
  })
}


//отрисовка строк
function renderRow({ id, title:
  nameEvnt, idMeet, date, end, time, timeEnd, allDay, done, desc } = task) {

    let calendarEnd = "";
    let calendarStart;
    let calendarallDay;

  let trElem = document.createElement("tr");
  tbl.appendChild(trElem);
  meetSelect = document.getElementById("meetFilter");

  //checkbox cell
  let checkboxElem = document.createElement("input");
  checkboxElem.type = "checkbox";
  checkboxElem.addEventListener("click", checkboxClickCallback, false);
  checkboxElem.dataset.id = id;
  let tdElem1 = document.createElement("td");
  tdElem1.appendChild(checkboxElem);
  trElem.appendChild(tdElem1);

  if (done == "true" || done == "True" || done == true) {
    checkboxElem.checked = true;
    trElem.classList.add("strike");
  } else {
    trElem.classList.remove("strike");
  }

  //nameTask cell
  let tdElem2 = document.createElement("td");
  tdElem2.innerText = nameEvnt;
  trElem.appendChild(tdElem2);

  //idMeet cell
  let tdElem3 = document.createElement("td");
  tdElem3.innerText = idMeet;
  tdElem3.className = "idMeetName";
  trElem.appendChild(tdElem3);

  //date cell
  let dateElem = document.createElement("td");
  let dateObj;
  let formattedDate;
  if (time == "None" || time == "" || time == 'undefined') {
    dateObj = new Date(date);
    formattedDate = dateObj.toLocaleString("ru-RU", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    calendarStart = date;
  }
  else {
    dateObj = new Date(`${date}T${time}`);
    formattedDate = dateObj.toLocaleString("ru-RU", {
      hour: "numeric",
      minute: "numeric",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    calendarStart = date+"T"+time;
  }

  console.log(formattedDate);

  dateElem.innerText = formattedDate;
  trElem.appendChild(dateElem);

  //date end cell
  let timeElem = document.createElement("td");
  console.log("end " + end + " timeEnd " + timeEnd);
  if (allDay == "true" || allDay == true || allDay == "True") {

    formattedDate = "весь день";
    calendarallDay = true;

  }
  else {
    calendarallDay = false;

    if (end == "None" || end == "" || end == "undefined")
      {
        formattedDate = "-";
        calendarEnd = "";
      }
    else if (timeEnd == "None" || timeEnd == "" || timeEnd == 'undefined') {
      calendarEnd = end;
      dateObj = new Date(end);
      formattedDate = dateObj.toLocaleString("ru-RU", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    }
    else{
      calendarEnd = end + "T" + timeEnd;
      dateObj = new Date(`${end}T${timeEnd}`);
      formattedDate = dateObj.toLocaleString("ru-RU", {
        hour: "numeric",
        minute: "numeric",
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    }
  }
  timeElem.innerText = formattedDate;

  trElem.appendChild(timeElem);

  console.log("start data " + calendarStart);
  console.log("end data " + calendarEnd);

  //description cell
  let tdElem5 = document.createElement("td");
  tdElem5.innerText = desc;
  trElem.appendChild(tdElem5);

  //delete cell
  let spanElem = document.createElement("span");
  spanElem.innerText = "delete";
  spanElem.className = "material-icons";
  spanElem.addEventListener("click", deleteItem, false);

  let tdElem6 = document.createElement("td");
  tdElem6.appendChild(spanElem);
  trElem.appendChild(tdElem6);

  spanElem.dataset.id = id;

  // calendar.addEvent({
  //   title: nameEvnt,
  //   start: date
  // });

  // //добавление события в календарь
  if(calendarEnd == ""){
    
    addEvent({
      id: id,
      title: nameEvnt,
      start: calendarStart,
      allDay: calendarallDay
    });
  }
  else{
    addEvent({
      id: id,
      title: nameEvnt,
      start: calendarStart,
      allDay: calendarallDay,
      end: calendarEnd
    });
  }

  //фильтр
  meetSelect.addEventListener("change", multipleFilter, false);

  //добавление новых митов в фильтр
  // updateSelectOption();

  //удаление строки 
  function deleteItem() {
    trElem.remove();
    // updateSelectOption();

    //удаление в датасете
    for (let i = 0; i < taskData.length; i++) {
      if (taskData[i].id == this.dataset.id) {
        taskData.splice(i, 1);
      }
    }
    console.log(calendar.getEventById(this.dataset.id));
    calendar.getEventById(this.dataset.id).remove();
  }

  //выполнение задачи
  function checkboxClickCallback() {
    trElem.classList.toggle("strike");
    for (let i = 0; i < taskData.length; i++) {
      if (taskData[i].id == this.dataset.id) {
        taskData[i]["done"] = this.checked;
      }
    }
  }
}

//обновление фильтра митов
function updateSelectOption() {

  let meet_data = [DEFAULT_OPTION];
  meetSelect.innerHTML = "";

  taskData.forEach((obj) => {
    meet_data.push(obj.idMeet);
  });

  let meetSet = new Set(meet_data);

  console.log("список переговорок: " + meet_data);

  for (let option of meetSet) {

    let newOptionElem = document.createElement("option");
    newOptionElem.value = option;
    newOptionElem.innerText = option;
    meetSelect.appendChild(newOptionElem);

  }
}

//сортировка задач по дате
function sortEntry() {
  taskData.sort((a, b) => {
    let aDate = Date.parse(a.date);
    let bDate = Date.parse(b.date);
    return aDate - bDate;
  });

  clearTable();

  calendar.getEvents().forEach((event) => {
    event.remove();
  })

  renderAllRows(taskData);
}


//добавление данных по таскам в массив
function addTask(element) {
  taskData.push(element);
}

//создание уникального id
function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

//--- calendar

//инициализация календаря
function initCalendar() {
  var calendarEl = document.getElementById('calendar');
  console.log(calendarEl);
  var today = new Date();
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: today,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: []
  });
  calendar.render();
}
initCalendar();

//добавление события в календарь
function addEvent(event) {
  console.log(event);
  calendar.addEvent(event);

}

// --- fetch

//взятие данных из бд
function getData() {
  clearTable();
  client_addr = "http://127.0.0.1:5000/getData"
  fetch(client_addr).then(
    function (response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.text().then(function (data) {
        console.log('Get= ' + data);
        taskData = JSON.parse(data);
        console.log(taskData);
        updateSelectOption();
        renderAllRows(taskData);
      })
    }
  ).catch(function (err) {
    console.log('Fetch Error :-S ', err);
  })
}

//сохранение данных в бд
function saveData() {
  strData = JSON.stringify(taskData);
  console.log("saving data = " + strData);
  client_addr = "http://127.0.0.1:5000/saveData?json=" + strData.toString();

  fetch(client_addr
    //   , {
    //   method: "POST",
    //   cache:"no-cache",
    //   headers: new Headers({"Content-Type": "application/json"}),
    //   body: JSON.stringify(taskData)
    // }
  )
    .then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      console.log("save connected");
      console.log("saved data = " + strData);
    })
    .catch((error) => {
      console.error('Error : ' + error);

    })

}

//взятие переговорок из базы
function getMeetSelect() {
  let meet_data = []
  client_addr = "http://127.0.0.1:5000/getMeet"
  fetch(client_addr).then((response) => {

    if (response.status !== 200) {
      console.log("Looks like there was a problem. Status Code: " +
        response.status);
      return;
    }
    response.text().then(function(data){
      console.log("GET Meet selects: " + data);
      meet_data = JSON.parse(data);
      console.log("GET parse json: " + meet_data);
      fillMeetSelect(meet_data);
    })
  }).catch(function(err){
    console.log("Fetch error code: " + err);
  })
}

//заполнение переговорок в селект из бд
function fillMeetSelect(meet_data){
  console.log("you are in fillMeetSelect function");
  option_select = []
  for (let elem of meet_data){
    new_option = document.createElement('option');
    new_option.value = elem['id_meet'];
    new_option.innerHTML = elem['id_meet'];
    option_select.push(new_option);
    console.log("elem in GET function: " + elem);
  }
  console.log('option data select: ' + option_select);
  idMeetSelect.replaceChildren(...option_select);
}

getMeetSelect();

getData();

updateSelectOption();



