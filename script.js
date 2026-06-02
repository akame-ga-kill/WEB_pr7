const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = [
  { id: 1, text: 'Вивчити HTML', completed: true },
  { id: 2, text: 'Вивчити CSS', completed: true },
  { id: 3, text: 'Вивчити JavaScript', completed: false }
]

const savedTodos = localStorage.getItem('todos')

if (savedTodos) {
  todos = JSON.parse(savedTodos)
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos))
}

function newTodo() {
  const text = prompt('Введіть нову справу')

  if (!text) return

  todos.push({
    id: Date.now(),
    text,
    completed: false
  })

  saveTodos()
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
        onchange="checkTodo(${todo.id})"
      />

      <label>
        <span class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">
          ${todo.text}
        </span>
      </label>

      <button
        class="btn btn-danger btn-sm float-end"
        onclick="deleteTodo(${todo.id})">
        delete
      </button>
    </li>
  `
}

function render() {
  const html = todos.map(renderTodo).join('')
  list.innerHTML = html
}

function updateCounter() {
  itemCountSpan.textContent = todos.length

  const unchecked = todos.filter(
    todo => !todo.completed
  ).length

  uncheckedCountSpan.textContent = unchecked
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id)

  saveTodos()
  render()
  updateCounter()
}

function checkTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed
      }
    }

    return todo
  })

  saveTodos()
  render()
  updateCounter()
}

render()
updateCounter()