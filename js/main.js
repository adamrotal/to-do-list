var data =  (localStorage.getItem('toDoList')) ? JSON.parse(localStorage.getItem('toDoList')): {
  todo : [],
  completed : []
}

var SVGremove = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var SVGcomplete = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

renderToDoList();

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
  var desc = item.getElementsByTagName("p")[0];
  var start = item.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
  var end = item.getElementsByTagName("span")[3].getElementsByTagName("span")[0];
  var prior = item.getElementsByTagName("span")[5].getElementsByTagName("span")[0];
  console.log(prior.innerText);
  
  if (title.contentEditable == "true") {
      title.contentEditable = "false";
      desc.contentEditable = "false";
      start.contentEditable = "false";
      end.contentEditable = "false";
      prior.contentEditable = "false";

      if (id === 'todo') {
        // go to complete
        data.todo[getIndexOfK(data.todo, oldTitle)][0] = title.innerText;
        data.todo[getIndexOfK(data.todo, oldDesc)][1] = desc.innerText;
        data.todo[getIndexOfK(data.todo, oldStart)][2] = start.innerText;
        data.todo[getIndexOfK(data.todo, oldEnd)][3] = end.innerText;
        data.todo[getIndexOfK(data.todo, oldPriority)][4] = prior.innerText;

      } else {
        // go to todo
        data.completed[getIndexOfK(data.completed, oldTitle)][0] = title.innerText;
        data.completed[getIndexOfK(data.completed, oldDesc)][1] = desc.innerText;
        data.completed[getIndexOfK(data.completed, oldStart)][2] = start.innerText;
        data.completed[getIndexOfK(data.completed, oldEnd)][3] = end.innerText;
        data.completed[getIndexOfK(data.completed, oldPriority)][4] = prior.innerText;


      }
  } else {
      title.contentEditable = "true";
      desc.contentEditable = "true";
      start.contentEditable = "true";
      end.contentEditable = "true";
      prior.contentEditable = "true";

      oldTitle = title.innerText;
      oldDesc = desc.innerText;
      oldStart = start.innerText;
      oldEnd = end.innerText;
      oldPriority = prior.innerText;
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
  start2.innerHTML = s;


  //end date
  var end = document.createElement('span');
  end.innerHTML = "End : ";
  var end2 = document.createElement('span');
  end2.innerHTML = e;

  //priority
  var priority = document.createElement('span');
  priority.innerHTML = "Priority : ";
  var priority2 = document.createElement('span');
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
  item.appendChild(desc);
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
