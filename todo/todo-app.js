(function () {
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";

    button.setAttribute("disabled", "");
    input.addEventListener("input", function () {
      if (!input.value) button.setAttribute("disabled", "");
      else button.removeAttribute("disabled");
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);
    return { form, input, button };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    function scanTodoApp() {
      let arrayCases = [];
      for (let element of list.querySelectorAll(".list-group-item")) {
        let name = element.querySelector("span").textContent;
        let done = element.classList.contains("list-group-item-success");
        arrayCases.push({ name, done });
      }
      return arrayCases;
    }
    return { list, scanTodoApp };
  }

  function createTodoItem(name, done = false, saveScanedItems) {
    let item = document.createElement("li");
    let itemText = document.createElement("span");
   
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");
        
        item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    itemText.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "В работе";

    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    item.append(itemText);

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");
      doneButton.textContent =
        doneButton.textContent === "В работе" ? "Готово" : "В работе";

      saveScanedItems();
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        item.remove();
        saveScanedItems();
      }
    });

    if (done) {
      item.classList.toggle("list-group-item-success");
      doneButton.textContent = "Готово";
    }

    return { item };
  }

  function createTodoApp(container, title = "Список дел", arrayCases = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let { list: todoList, scanTodoApp } = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    function saveScanedItems() {
      saveArrayCases(title, scanTodoApp());
    }

    for (let { name, done } of arrayCases) {
      let newItem = createTodoItem(name, done, saveScanedItems);
      todoList.append(newItem.item);
    }

    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(
        todoItemForm.input.value,
        false,
        saveScanedItems
      );

      todoList.append(todoItem.item);
      //обнуление зн-я в поле
      todoItemForm.input.value = "";
      todoItemForm.button.setAttribute("disabled", "");

      saveScanedItems();
    });
  }

  window.createTodoApp = createTodoApp;
})();

function saveArrayCases(title, ArrayCases) {
  localStorage.setItem(title, JSON.stringify(ArrayCases));
}

function readArrayCases(title) {
  let ArrayCases = JSON.parse(localStorage.getItem(title));
  if (ArrayCases === null) return [];
  return ArrayCases;
}
