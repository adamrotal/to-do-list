var data =  (localStorage.getItem('toDoList')) ? JSON.parse(localStorage.getItem('toDoList')): {
  todo : [],
  completed : []
}

renderToDoList();

var descDefined, startDefined, endDefined, priorDefined;

document.getElementById('add').addEventListener('click', function() {
  var title = document.getElementById('title').value;
  var desc = document.getElementById('desc').value;
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var prior = document.getElementById('priority').value;

  if (title) {
      addItemTodo(title, desc, start, end, prior, false);
      document.getElementById('title').value = '';
      document.getElementById('desc').value = '';
      document.getElementById('start').value = '';
      document.getElementById('end').value = '';
      document.getElementById('priority').selectedIndex = -1;

      var item = [title, desc, start, end, prior]
      data.todo.push(item);

      dataObjectUpdated();

  } else {
    alert('The title can not be empty');
  }

});

document.getElementById('title').addEventListener('keydown', function(e) {
  var title = this.value;
  var desc = document.getElementById('desc').value;
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var prior = document.getElementById('priority').value;

  if (e.code === 'Enter' && title) {
    addItemTodo(title, desc, start, end, prior, false);
    document.getElementById('title').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('start').value = '';
    document.getElementById('end').value = '';
    document.getElementById('priority').selectedIndex = -1;

    var item = [title, desc, start, end, prior]
    data.todo.push(item);

    dataObjectUpdated();
  }
});


function renderToDoList() {
  //localStorage.clear();
  if (!data.todo.length && !data.completed.length) {
    return;
  }
  if (data.todo.length) {
    for (var i = 0; i < data.todo.length; i++) {
      var value = data.todo[i];
      addItemTodo(value[0], value[1], value[2], value[3], value[4], false);
    }
  }

  if (data.completed.length) {
    for (var j = 0; j < data.completed.length; j++) {
      var value = data.completed[j];
      addItemTodo(value[0], value[1], value[2], value[3], value[4], true);
    }
  }


}


function dataObjectUpdated() {
  // console.log(JSON.stringify(data));
  console.log(data);
  localStorage.setItem('toDoList', JSON.stringify(data));
}

function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var title = item.getElementsByTagName("h3")[0].innerText;
  var checkBox = item.getElementsByTagName("input")[0].checked;
  var idxOfTitleTodo = getIndexOfK(data.todo, title);

  var idxOfTitleComplete = getIndexOfK(data.completed, title);

  if (!checkBox) {
    // go to complete
    data.todo.splice(idxOfTitleTodo, 1);

  } else {
    // go to todo
    data.completed.splice(idxOfTitleComplete, 1);

  }

  dataObjectUpdated();

  parent.removeChild(item);
}

function getIndexOfK(arr, k) {
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].indexOf(k);
    if (index > -1) {
      return i;
    }
  }
  return false;
}

function completeItem() {
  var item = this.parentNode;
  var parent = item.parentNode;
  var id = parent.id;

  var title = item.getElementsByTagName("h3")[0].innerText;
  var checkBox = item.getElementsByTagName("input")[0].checked;

  var idxOfTitleTodo = getIndexOfK(data.todo, title);
  var idxOfTitleComplete = getIndexOfK(data.completed, title);

  var target;
  if (checkBox && id === 'todo') {
    // go to complete
    target = document.getElementById('completed');
    data.completed.push(data.todo[idxOfTitleTodo]);
    data.todo.splice(idxOfTitleTodo, 1);

  } else {
    // go to todo
    target = document.getElementById('todo');
    data.todo.push(data.completed[idxOfTitleComplete]);
    data.completed.splice(idxOfTitleComplete, 1);

  }

  dataObjectUpdated();

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}

var oldTitle, oldDesc, oldStart, oldEnd, oldPriority;

function editItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var title = item.getElementsByTagName("h3")[0];
  var desc = item.querySelector("p");
  var start = item.querySelector("span.start-item");
  var end = item.querySelector("span.end-item");
  var prior = item.querySelector("span.priority-item");

  // console.log(prior.innerText);

  if (title.contentEditable == "true") {
      title.contentEditable = "false";
      if (desc) desc.contentEditable = "false";
      if (start) start.contentEditable = "false";
      if (end) end.contentEditable = "false";
      if (prior) prior.contentEditable = "false";

      if (id === 'todo') {
        // go to complete
        data.todo[getIndexOfK(data.todo, oldTitle)][0] = title.innerText;
        if (desc) data.todo[getIndexOfK(data.todo, oldDesc)][1] = desc.innerText;
        if (start) data.todo[getIndexOfK(data.todo, oldStart)][2] = start.innerText;
        if (end) data.todo[getIndexOfK(data.todo, oldEnd)][3] = end.innerText;
        if (prior) data.todo[getIndexOfK(data.todo, oldPriority)][4] = prior.innerText;

      } else {
        // go to todo
        data.completed[getIndexOfK(data.completed, oldTitle)][0] = title.innerText;
        if (desc) data.completed[getIndexOfK(data.completed, oldDesc)][1] = desc.innerText;
        if (start) data.completed[getIndexOfK(data.completed, oldStart)][2] = start.innerText;
        if (desc) data.completed[getIndexOfK(data.completed, oldEnd)][3] = end.innerText;
        if (prior) data.completed[getIndexOfK(data.completed, oldPriority)][4] = prior.innerText;


      }
  } else {

      title.contentEditable = "true";
      oldTitle = title.innerText;
      if (desc){
        desc.contentEditable = "true";
        oldDesc = desc.innerText;
      }
      if (start) {
        start.contentEditable = "true";
        oldStart = start.innerText;
      }
      if (end) {
        end.contentEditable = "true";
        oldEnd = end.innerText;
      }
      if (prior) {
        prior.contentEditable = "true";
        oldPriority = prior.innerText;
      }

  }

  item.classList.toggle("editMode");
  dataObjectUpdated();
  // console.log(data);
}

function addItemTodo(t, d, s, e, p, isCompleted) {
  var list = (isCompleted) ? document.getElementById('completed'):document.getElementById('todo');

   var item = document.createElement('li');
  //  item.innerText = text;

  var checkBox = document.createElement('input');
  checkBox.type = "checkbox";
  checkBox.classList.add('complete');

  if (isCompleted) {
    checkBox.checked = true;
  }

  //complete
  checkBox.addEventListener('change', completeItem);

   var title = document.createElement('h3');
   title.innerHTML = t;
  //  console.log(title);

   var buttons = document.createElement('div');
   buttons.classList.add('buttons');

   var edit = document.createElement('button');
   edit.classList.add('edit');

   var editSpan = document.createElement('span');
   editSpan.innerHTML = "Edit";

   //edit item
   edit.addEventListener('click', editItem);

   var remove = document.createElement('button');
   remove .classList.add('remove');
   remove.innerHTML = "Remove";

   //remove
   remove.addEventListener('click', removeItem);

   //desc
   var desc = document.createElement('p');
   desc.innerHTML = d;
  //  console.log(desc);

  //start date
  var start = document.createElement('span');
  start.innerHTML = "Start : ";
  var start2 = document.createElement('span');
  start2.classList.add('start-item');
  start2.innerHTML = s;


  //end date
  var end = document.createElement('span');
  end.innerHTML = "End : ";
  var end2 = document.createElement('span');
  end2.classList.add('end-item');
  end2.innerHTML = e;

  //priority
  var priority = document.createElement('span');
  priority.innerHTML = "Priority : ";
  var priority2 = document.createElement('span');
  priority2.classList.add('priority-item');
  priority2.innerHTML = p;


  var br = document.createElement('br');
  var br1 = document.createElement('br');

  edit.appendChild(editSpan);

  buttons.appendChild(edit);
  buttons.appendChild(remove);

  start.appendChild(start2);
  end.appendChild(end2);
  priority.appendChild(priority2);

  item.appendChild(checkBox);
  item.appendChild(title);
  item.appendChild(buttons);

  if (d) {
    item.appendChild(desc);
  }

  if (s) {
   item.appendChild(start);
   item.appendChild(br);
  }

  if (e) {
   item.appendChild(end);
   item.appendChild(br1);
  }

  if (p) {
   item.appendChild(priority);
  }

   list.insertBefore(item, list.childNodes[0]);
}
