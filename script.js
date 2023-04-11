// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

//Input antigo
let oldInputValue;

// Funções
const saveTodo = (text, done = 0, save = 1) => {
  // Criar Nova tarefa
    const todo = document.createElement("div");
  todo.classList.add("todo");
  
  //Adiciona texto a nova tarefa
  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  //Marca tarefa como concluida
  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  //Edita uma tarefa
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  //Apaga uma tarefa
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  //Adiciona tarefa a lista 
  todoList.appendChild(todo);

  todoInput.value = "";
};

//Oculta espaços
const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

//Atualiza as listas de tarefas
const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

//Retorna a tarefas pesquisadas
const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

//Filtra as tarefas
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

      //Tarefas concluidas
    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

      //Tarefas incompletas
    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

//Eventos de clique
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  //Verifica se a tarefa está vazia 
  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  //Marca tarefa como concluida
  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  //Remove tarefa
  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  //Edita tarefa
  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

//Cancela edição de tarefa
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

//Confirma edição de tarefa
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

//Adiciona input a caixa de pesquisa
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

//Apaga pesquisa
eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

//Troca o filtro
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

//Carrega tarefas da local storage
const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

//Adiciona tarefas do local storage
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

//Remove tarefa da local storage
const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

//Atualiza Status da tarefa na local storage
const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

//Atualiza tarefa editada na local storage
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

//Carrega tarefas
loadTodos();