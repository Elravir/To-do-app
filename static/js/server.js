var currentDate;
async function getThisData() {
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
        getWeek();
      })
    }
  ).catch(function (err) {
    console.log('Fetch Error :-S ', err);
  })
}

function deleteTasks(){
  let tasks_del = document.getElementsByClassName("calendar_table-task2");
  console.log("delete tasks: ", tasks_del);
  for(let i=tasks_del.length; i>0; i--){
    console.log("ts ", tasks_del[i-1]);
    let ts = tasks_del[i-1];
    ts.parentNode.removeChild(tasks_del[i-1]);
    console.log("tassssk ", tasks_del);
  }

}

function changePage(){

    window.location.href = "index.html";
}

function getWeekBefore(){
  deleteTasks();
  currentDate = moment(currentDate).add(-7,"d");
  console.log("function weekAfter ",currentDate);

  let weekStart = currentDate.clone().startOf('isoWeek');
    let weekEnd = currentDate.clone().endOf('isoWeek');
  let cells = document.getElementsByTagName('th');
  let days=[]
  for(var i=0; i<=6; i++){
      
    days.push((moment(weekStart).add(i, 'days').locale('ru').format("")).split('T')[0]);
    cells[i+1].innerText = moment(weekStart).add(i, 'days').locale('ru').format("LL");
    // console.log(cells[i+1].innerText);
  }
  console.log(days);
  arr_task=[];
  arr_index = [];
  taskData.forEach((obj) => {
    for(let i of days){
      
      if(i == obj.date){
        arr_task.push(obj);
        arr_index.push(days.indexOf(i)+1);
      }
    }
  });
  console.log("task on the week ", arr_task);
  console.log("arr_index ", arr_index);
  arr_class = document.getElementsByClassName("new_class");

  console.log("arr_class ", arr_class);
  
  arr_div = []

  for(let i of arr_class){

    for(let obj=0; obj<arr_task.length; obj++){
      // console.log("arR_task ", arr_task[obj]);
      if(arr_task[obj].idMeet == i.innerHTML){
        console.log(i.innerHTML);
        let rowIndex = i.parentNode.rowIndex;
        // console.log(rowIndex);
        // console.log(arr_index[obj]);
        let elemId = (rowIndex).toString() + (arr_index[obj]).toString();
        let cell=document.getElementById(elemId);
        console.log(cell);
        let div = document.createElement('div');
        div.classList.add("calendar_table-task2");
        let div_p = document.createElement('p');
        div_p.innerText= arr_task[obj].time + "-" + arr_task[obj].timeEnd +" " + arr_task[obj].title;
        div.append(div_p);
        cell.append(div);

        arr_div.push(div);
      }
    }   
  }

  let tasks_visible = document.getElementsByClassName("calendar_table-task2");
  console.log("tasks_visible ", tasks_visible);
  if(arr_rooms.length != 0){
      
    for(let j of tasks_visible){
      
      j.style.display = "none";
      for(let i of arr_rooms){
        
        if(j.parentNode.parentNode.rowIndex == i){
          console.log("j.parentNode.rowIndex ", j.parentNode.parentNode.rowIndex);
          j.style.display = "block";

        }
      }
    }
  }

  let time_span = document.getElementById("time_text");
  time_span.innerText = moment(weekStart).add(-7, 'days').locale("ru").format('ll') + "/" + moment(weekEnd).add(+1, 'days').locale("ru").format('ll');
}

var arr_task =[]
var arr_index = []
var arr_div = []

function getWeekAfter(){
  deleteTasks();
  currentDate = moment(currentDate).add(7,"d");
  // console.log("function weekAfter ",currentDate);

  let weekStart = currentDate.clone().startOf('isoWeek');
    let weekEnd = currentDate.clone().endOf('isoWeek');
  let cells = document.getElementsByTagName('th');
  let days=[]
  for(var i=0; i<=6; i++){
      
    days.push((moment(weekStart).add(i, 'days').locale('ru').format("")).split('T')[0]);
    cells[i+1].innerText = moment(weekStart).add(i, 'days').locale('ru').format("LL");
    console.log(cells[i+1].innerText);
  }
  console.log(days);

  
  arr_task=[];
  arr_index = [];
  taskData.forEach((obj) => {
    for(let i of days){
      
      if(i == obj.date){
        arr_task.push(obj);
        arr_index.push(days.indexOf(i)+1);
      }
    }
  });
  console.log("task on the week ", arr_task);
  console.log("arr_index ", arr_index);
  arr_class = document.getElementsByClassName("new_class");

  console.log("arr_class ", arr_class);
  
  arr_div = [];

  for(let i of arr_class){

    for(let obj=0; obj<arr_task.length; obj++){
      // console.log("arR_task ", arr_task[obj]);
      if(arr_task[obj].idMeet == i.innerHTML){
        console.log(i.innerHTML);
        let rowIndex = i.parentNode.rowIndex;
        console.log(rowIndex);
        console.log(arr_index[obj]);
        let elemId = (rowIndex).toString() + (arr_index[obj]).toString();
        let cell=document.getElementById(elemId);
        console.log(cell);
        let div = document.createElement('div');
        div.classList.add("calendar_table-task2");
        let div_p = document.createElement('p');
        div_p.innerText= arr_task[obj].time + "-" + arr_task[obj].timeEnd +" " + arr_task[obj].title;
        div.append(div_p);
        cell.append(div);

        arr_div.push(div);
      }
    } 
  }  

  if(arr_rooms.length != 0){
    for(let j of tasks_visible){
      j.style.display = "none";
      for(let i of arr_rooms){
        if(j.parentNode.parentNode.rowIndex == i){
          console.log("j.parentNode.rowIndex ", j.parentNode.parentNode.rowIndex);
          j.style.display = "block";
        }
      }
    }
  }
    
  let time_span = document.getElementById("time_text");
  time_span.innerText = moment(weekStart).add(-7, 'days').locale("ru").format('ll') + "/" + moment(weekEnd).add(+1, 'days').locale("ru").format('ll');
}

async function getWeek(){
  
  console.log("function getWeek");

    currentDate = moment();
    // currentDate.locale('ru');
    console.log("currentDate ", currentDate);
    let weekStart = currentDate.clone().startOf('isoWeek');
    let weekEnd = currentDate.clone().endOf('isoWeek');

    var days = [];

    // let row=document.getElementsByClassName("calendar_table_first-row");
    let cells = document.getElementsByTagName('th');


    for(var i=0; i<=6; i++){
      
      days.push((moment(weekStart).add(i, 'days').locale('ru').format("")).split('T')[0]);
      cells[i+1].innerText = moment(weekStart).add(i, 'days').locale('ru').format("LL");
    }
    console.log(days);
    
    arr_task=[];
    arr_index = [];
    taskData.forEach((obj) => {
      for(let i of days){
        
        if(i == obj.date){
          arr_task.push(obj);
          arr_index.push(days.indexOf(i)+1);
        }
      }
    });
    console.log("task on the week ", arr_task);
    console.log("arr_index ", arr_index);
    arr_class = document.getElementsByClassName("new_class");

    arr_div = []

    console.log("arr_class ", arr_class);
    
    // ApplyFilter();

    for(let i of arr_class){
      for(let obj=0; obj<arr_task.length; obj++){
        // console.log("arR_task ", arr_task[obj]);
        if(arr_task[obj].idMeet == i.innerHTML){
          console.log(i.innerHTML);
          let rowIndex = i.parentNode.rowIndex;
          // console.log(rowIndex);
          // console.log(arr_index[obj]);
          let elemId = (rowIndex).toString() + (arr_index[obj]).toString();
          let cell=document.getElementById(elemId);
          // console.log(cell);
          let div = document.createElement('div');
          div.classList.add("calendar_table-task2");
          // div.classList.add(string(i.innerHTML))
          let div_p = document.createElement('p');
          div_p.innerText= arr_task[obj].time + "-" + arr_task[obj].timeEnd +" " + arr_task[obj].title;
          div.append(div_p);
          cell.append(div);

          arr_div.push(div);
        }
      }
    }

    let time_span = document.getElementById("time_text");
    time_span.innerText = moment(weekStart).add(-7, 'days').locale("ru").format('ll') + "/" + moment(weekEnd).add(+1, 'days').locale("ru").format('ll');
}

function addButtonBook(){
  let buttons = document.getElementsByClassName("button_book");
  for (let but of buttons){
    but.setAttribute("onclick", "changePage()");
    
  }
}

var arr_rooms = []

function ApplyFilter(){
  let item1 = document.getElementById("Переговорная комната Бухгалтерия");
  let item2 = document.getElementById("Дом Ученых - Большой зал");
  let item3 = document.getElementById("Дом Ученых - Переговорная (Шах комната)");
  let item4 = document.getElementById("Малый зал для совещаний Дирекция(новая)");
  let item5 = document.getElementById("Дом Международных Совещаний - Главный зал");
  let item6 = document.getElementById("Дом Международных Совещаний - Зеленый зал");
  let item7 = document.getElementById("Административное здание номер 6 - Переговорная комната");
  
  arr_rooms = []

  if(item1.checked == true){
    arr_rooms.push("1");
  }
  if(item2.checked == true){
    arr_rooms.push("2");
  }
  if(item3.checked == true){
    arr_rooms.push("3");
  }
  if(item4.checked == true){
    arr_rooms.push("4");
  }
  if(item5.checked == true){
    arr_rooms.push("5");
  }
  if(item6.checked == true){
    arr_rooms.push("6");
  }
  if(item7.checked == true){
    arr_rooms.push("7");
  }

  let tasks_visible = document.getElementsByClassName("calendar_table-task2");

  console.log(tasks_visible);
  
    for(let i of tasks_visible){
      i.style.display = "none";
      for(let j of arr_rooms){
        
        if(i.parentNode.parentNode.rowIndex == j){
          console.log("j.parentNode.rowIndex ", i.parentNode.parentNode.rowIndex);
          i.style.display = "block";

        }
      }
    }
}

function ResetFilter(){

  document.getElementById("Переговорная комната Бухгалтерия").checked = false;
  document.getElementById("Дом Ученых - Большой зал").checked = false;
  document.getElementById("Дом Ученых - Переговорная (Шах комната)").checked = false;
  document.getElementById("Малый зал для совещаний Дирекция(новая)").checked = false;
  document.getElementById("Дом Международных Совещаний - Главный зал").checked = false;
  document.getElementById("Дом Международных Совещаний - Зеленый зал").checked = false;
  document.getElementById("Административное здание номер 6 - Переговорная комната").checked = false;
  arr_rooms = []
  
  let tasks_visible = document.getElementsByClassName("calendar_table-task2");
  
  for(let i of tasks_visible){
    i.style.display = "block";
  }

}

getThisData();
addButtonBook();