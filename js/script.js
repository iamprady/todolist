console.log(
  '%c The website uses local storage to store your todos. Clearing Cookies or site data will remove your todos!!',
  'padding:15px; background-color:yellow; color:red;'
)
const themeChanger = document.getElementById('theme')
const container = document.querySelector('.container')
const form = document.getElementById('todo-form')
const input = document.getElementById('todo')
const todoList = document.querySelector('.todo-ul')
const status = document.querySelector('.items-left')
const clear = document.querySelector('.clear')
const todoClassifiers = document.querySelectorAll('.todo-classify p')
const all = document.getElementById('all')
const active = document.getElementById('active')
const completed = document.getElementById('completed')
let checkBtns = document.querySelectorAll('button.check')
let checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>`
let crossSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>`
let theme = 'dark'
let todos = []
let itemsLeft = 0

window.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector(':root')
    .style.setProperty('--vh', window.innerHeight / 100 + 'px')
  todoInfoSectionElement = document.querySelector('.todo-info')
  let storedTheme = localStorage.getItem('theme')
  let storedTodos = localStorage.getItem('todos')
  if (storedTheme) {
    theme = storedTheme === 'light' ? 'light' : 'dark'
    setTheme()
  } else {
    localStorage.setItem('theme', 'dark')
  }
  if (storedTodos && RegExp(/^\[.*?\]/).test(storedTodos)) {
    todos = [...JSON.parse(storedTodos)]
    seed()
  } else {
    todos = [
      { id: uuid(), text: 'example todo #1', checked: true },
      { id: uuid(), text: 'example todo #2', checked: false },
    ]
    seed()
    localStorage.setItem('todos', JSON.stringify(todos))
  }
  status.textContent = `${itemsLeft}${
    itemsLeft === 1 ? ' item' : ' items'
  } left`
})
themeChanger.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark'
  setTheme()
})
form.addEventListener('submit', (e) => {
  e.preventDefault()
  itemsLeft++
  let li = document.createElement('li')
  li.classList.add('todo-li')
  let btn1 = document.createElement('button')
  btn1.classList.add('check')
  btn1.setAttribute('aria-label', 'mark completed')
  btn1.innerHTML = checkSvg
  li.appendChild(btn1)
  let todo = document.createElement('p')
  todo.textContent = input.value
  li.appendChild(todo)
  let btn2 = document.createElement('button')
  btn2.classList.add('delete')
  btn2.setAttribute('aria-label', 'delete todo')
  btn2.innerHTML = crossSvg
  li.appendChild(btn2)
  let tmpuuid = uuid()
  li.setAttribute('id', tmpuuid)
  li.setAttribute('draggable', true)
  let todoObj = { id: tmpuuid, text: input.value, checked: false }
  todos.unshift(todoObj)
  localStorage.setItem('todos', JSON.stringify(todos))
  addListeners(li)
  todoList.insertBefore(li, todoList.children[0])
  input.value = ''
  status.textContent = `${itemsLeft}${
    itemsLeft === 1 ? ' item' : ' items'
  } left`
})
todoList.addEventListener('dragover', (e) => {
  e.preventDefault()
  const afterElement = getDragAfterElement(e.clientY)
  const dragging = document.querySelector('.dragging')
  if (afterElement === null) {
    todoList.appendChild(dragging)
  } else {
    todoList.insertBefore(dragging, afterElement)
  }
})
all.addEventListener('click', () => {
  todoClassifiers.forEach((classifier) => classifier.classList.remove('active'))
  all.classList.add('active')
  const allTodos = [...container.querySelectorAll('.todo-li')]
  allTodos.forEach((el) => el.classList.remove('hide'))
})
active.addEventListener('click', () => {
  todoClassifiers.forEach((classifier) => classifier.classList.remove('active'))
  active.classList.add('active')
  const checkedElements = [...container.querySelectorAll('.todo-li.checked')]
  const notCheckedElements = [
    ...container.querySelectorAll('.todo-li:not(.checked)'),
  ]
  checkedElements.forEach((el) => el.classList.add('hide'))
  notCheckedElements.forEach((el) => el.classList.remove('hide'))
})
completed.addEventListener('click', () => {
  todoClassifiers.forEach((classifier) => classifier.classList.remove('active'))
  completed.classList.add('active')
  const checkedElements = [...container.querySelectorAll('.todo-li.checked')]
  const notCheckedElements = [
    ...container.querySelectorAll('.todo-li:not(.checked)'),
  ]
  checkedElements.forEach((el) => el.classList.remove('hide'))
  notCheckedElements.forEach((el) => el.classList.add('hide'))
})
clear.addEventListener('click', () => {
  const checkedElements = todoList.querySelectorAll('.todo-li.checked')
  checkedElements.forEach((el) => todoList.removeChild(el))
  todos = todos.filter((todo) => todo.checked !== true)
  localStorage.setItem('todos', JSON.stringify(todos))
})
function setTheme() {
  localStorage.setItem('theme', theme)
  document.documentElement.className = theme
}
function uuid() {
  let chars = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    '#',
    '%',
    '&',
  ]
  let id = ''
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}
function changeStateOfTodo(e) {
  if (e.target.classList[0] === 'check') {
    let parentLi = e.target.parentElement
    let todoId = parentLi.getAttribute('id')
    if ([...parentLi.classList].includes('checked')) {
      itemsLeft++
      status.textContent = `${itemsLeft}${
        itemsLeft === 1 ? ' item' : ' items'
      } left`
    } else {
      itemsLeft--
      status.textContent = `${itemsLeft}${
        itemsLeft === 1 ? ' item' : ' items'
      } left`
    }
    parentLi.classList.toggle('checked')
    todos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.checked = !todo.checked
        return todo
      }
      return todo
    })
    localStorage.setItem('todos', JSON.stringify(todos))
  } else if (e.target.classList[0] === 'delete') {
    let parentLi = e.target.parentElement
    if (![...parentLi.classList].includes('checked')) {
      itemsLeft--
      status.textContent = `${itemsLeft}${
        itemsLeft === 1 ? ' item' : ' items'
      } left`
    }
    let todoId = parentLi.getAttribute('id')
    todoList.removeChild(parentLi)
    todos = todos.filter((todo) => todo.id !== todoId)
    localStorage.setItem('todos', JSON.stringify(todos))
  } else return
}
function addListeners(element) {
  element.addEventListener('click', changeStateOfTodo)
  element.addEventListener('dragstart', () => {
    element.classList.add('dragging')
  })
  element.addEventListener(
    'touchstart',
    () => {
      let dragEvent = new DragEvent('dragstart')
      element.dispatchEvent(dragEvent)
    },
    { passive: true }
  )
  element.addEventListener(
    'touchmove',
    (e) => {
      const touchInfo = e.targetTouches[0]
      let dragEvent = new DragEvent('dragover', { clientY: touchInfo.clientY })
      todoList.dispatchEvent(dragEvent)
    },
    { passive: true }
  )
  element.addEventListener('touchend', () => {
    let dragEvent = new DragEvent('dragend')
    element.dispatchEvent(dragEvent)
  })
  element.addEventListener('dragend', () => {
    const id = element.getAttribute('id')
    let todoData = todos.find((todo) => todo.id === id)
    todos = todos.filter((todo) => todo.id !== id)
    let newIndex
    ;[...element.parentElement.children].find((item, index) => {
      if (item.id === id) {
        newIndex = index
        return true
      }
      return false
    })
    todos.splice(newIndex, 0, todoData)
    localStorage.setItem('todos', JSON.stringify(todos))
    element.classList.remove('dragging')
  })
}
function getDragAfterElement(y) {
  const draggableElements = [
    ...container.querySelectorAll('.todo-li:not(.dragging)'),
  ]
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}
function seed() {
  todos.forEach((todo) => {
    let li = document.createElement('li')
    li.classList.add('todo-li')
    let btn1 = document.createElement('button')
    btn1.classList.add('check')
    btn1.setAttribute('aria-label', 'mark completed')
    btn1.innerHTML = checkSvg
    li.appendChild(btn1)
    let todoText = document.createElement('p')
    todoText.textContent = todo.text
    li.appendChild(todoText)
    let btn2 = document.createElement('button')
    btn2.classList.add('delete')
    btn2.setAttribute('aria-label', 'delete todo')
    btn2.innerHTML = crossSvg
    li.appendChild(btn2)
    li.setAttribute('id', todo.id)
    li.setAttribute('draggable', true)
    if (todo.checked) {
      li.classList.add('checked')
    } else {
      itemsLeft++
    }
    addListeners(li)
    todoList.appendChild(li)
  })
}
