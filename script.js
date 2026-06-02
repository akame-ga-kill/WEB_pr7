const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

const DB_URL =
  'https://todo-74be8-default-rtdb.europe-west1.firebasedatabase.app/todos'

let todos = []

async function addTodo(todo) {
  const response = await fetch(`${DB_URL}.json`, {
    method: 'POST',
    body: JSON.stringify({
      text: todo.text,
      completed: todo.completed
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()

  return data.name
}

async function getTodos() {
  const response = await fetch(`${DB_URL}.json`)
  const data = await response.json()

  if (!data) {
    todos = []
    return
  }

  todos = Object.keys(data).map(key => ({
    id: key,
    ...data[key]
  }))
}

async function deleteTodoFromDB(id) {
  await fetch(`${DB_URL}/${id}.json`, {
    method: 'DELETE'
  })
}

async function updateTodo(todo) {
  await fetch(`${DB_URL}/${todo.id}.json`, {
    method: 'PATCH',
    body: JSON.stringify({
      completed: todo.completed
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

async function newTodo() {
  const text = prompt('Введіть нову справу')

  if (!text) return

  const todo = {
    text,
    completed: false
  }

  const id = await addTodo(todo)

  todos.push({
    ...todo,
    id
  })

  render()
  updateCounter()
}

function renderTodo(todo) {
  return `
    <li class="list-group-item">
      <input
        type="checkbox"
        class="form-check-input me-2"
        ${todo.completed ? 'checked' : ''}
        onchange="checkTodo('${todo.id}')"
      />

      <label>
        <span class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">
          ${todo.text}
        </span>
      </label>

      <button
        class="btn btn-danger btn-sm float-end"
        onclick="deleteTodo('${todo.id}')">
        delete
      </button>
    </li>
  `
}

function render() {
  list.innerHTML = todos.map(renderTodo).join('')
}

function updateCounter() {
  itemCountSpan.textContent = todos.length

  uncheckedCountSpan.textContent =
    todos.filter(todo => !todo.completed).length
}

async function deleteTodo(id) {
  await deleteTodoFromDB(id)

  todos = todos.filter(todo => todo.id !== id)

  render()
  updateCounter()
}

async function checkTodo(id) {
  const todo = todos.find(item => item.id === id)

  if (!todo) return

  todo.completed = !todo.completed

  await updateTodo(todo)

  render()
  updateCounter()
}

async function init() {
  await getTodos()

  render()
  updateCounter()
}

init()
