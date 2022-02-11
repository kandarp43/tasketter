const logout = document.querySelector('.logout')
const greet = document.querySelector('.greet')
const gif1 = document.getElementById('gif1')
const weatherCity = document.getElementById('weather_city')
const weatherTemp = document.getElementById('weather_temp')
const addTodoBtn = document.getElementById('add_todo_btn')
const saveTodoBtn = document.getElementById('save_todo_btn')

let EditBufferValue
const list_container = document.querySelector(
	'.todo_list_container_incompleted'
)
const list_container_completed = document.querySelector(
	'.todo_list_container_completed'
)
const todoInput = document.getElementById('todo_input')
const todoForm = document.getElementById('todo_form')
let userData
window.onload = () => {
	userData = JSON.parse(localStorage.getItem('user'))
	if (!userData) location.href = location.origin + '/pages/signin.html'
	getLocation()
	displayTodo()
	getGif()
	startTime()
	greet.innerHTML = `Hello, <span class="user_name"> ${userData.name}</span>`
}
function makeLogout(e) {
	e.preventDefault()
	localStorage.removeItem('user')
	location.href = location.origin + '/pages/signin.html'
}

logout.addEventListener('click', makeLogout)
todoForm.addEventListener('submit', addTodo)

function addTodo(e) {
	e.preventDefault()
	if (todoInput.value.trim().length == 0) return
	if (todoInput.value.trim().length > 30) {
		alert('please enter less then 30 characters')
		return
	}
	let newData = JSON.parse(localStorage.getItem('todoDb'))
	let getUsersTodo = newData.filter(({ email }) => {
		return email === userData.email
	})
	let todoList = [...getUsersTodo[0].todo]
	todoList.push({
		todo: todoInput.value.trim(),
		completed: false,
	})
	todoInput.value = ''

	getUsersTodo[0].todo = [...todoList]
	let pushNewData = newData.filter(({ email }) => {
		return !(email === userData.email)
	})
	pushNewData.push(getUsersTodo[0])
	localStorage.setItem('todoDb', JSON.stringify(pushNewData))
	displayTodo()
}

function displayTodo() {
	let newData = JSON.parse(localStorage.getItem('todoDb'))
	let getUsersTodo = newData.filter(({ email }) => {
		return email === userData.email
	})
	let main = getUsersTodo[0].todo
	let todoArray_complete = getUsersTodo[0].todo.filter(({ completed }) => {
		return completed === true
	})

	let printTodoIncomplete = ''
	main.forEach(({ todo, completed }, index) => {
		printTodoIncomplete += `<div class="todo ${completed ? 'active' : ''}">
		<input type="checkbox" onclick="toggleTodo(${index})" id="todo_check" ${
			completed ? 'checked' : ''
		} />
		<p class="todo_text" onclick="toggleTodo(${index})" >${todo}</p>
		<div class="todo_btn_container" >
			<button class="edit_btn" onclick="editTodo(${index})">
				<img src="https://cdn4.iconfinder.com/data/icons/eon-ecommerce-i-1/32/review_notes_pencil_pen-128.png" height="35px" width="30px" alt="" />
			</button>
			<button class="delete_btn" onclick="deleteTodo(${index})">
				<img src="https://cdn1.iconfinder.com/data/icons/essential-39/64/Bin-256.png" height="35px" width="30px" alt="" />
			</button>
		</div>
	</div>`
	})
	list_container.innerHTML = printTodoIncomplete

	//
}
function editTodo(index) {
	for (let i = 0; i < document.querySelectorAll('.todo_text').length; i++) {
		document.querySelectorAll('.todo_text')[i].onclick = function () {}
	}

	if (!EditBufferValue && EditBufferValue !== 0) {
		document.querySelectorAll('.delete_btn')[index].style.display =
			'inline-block'
		document.querySelectorAll('#todo_check')[index].style.display =
			'inline-block'
	} else {
		document.querySelectorAll('.delete_btn')[EditBufferValue].style.display =
			'inline-block'
		document.querySelectorAll('#todo_check')[EditBufferValue].style.display =
			'inline-block'
	}
	EditBufferValue = index
	if (
		document.querySelector('.delete_btn') &&
		document.querySelector('#todo_check')
	) {
		document.querySelectorAll('.delete_btn')[index].style.display = 'none'
		document.querySelectorAll('#todo_check')[index].style.display = 'none'
	}
	todoForm.removeEventListener('submit', addTodo)
	let newData = JSON.parse(localStorage.getItem('todoDb'))
	let getUsersTodo = newData.filter(({ email }) => {
		return email === userData.email
	})
	let main = getUsersTodo[0].todo
	todoInput.value = main[index].todo
	addTodoBtn.style.display = 'none'
	saveTodoBtn.style.display = 'block'
	todoForm.addEventListener('submit', saveEditedTodo)
	todoInput.focus()
}
function saveEditedTodo(e) {
	e.preventDefault()
	if (todoInput.value.trim().length == 0) return
	if (todoInput.value.trim().length > 30) {
		alert('please enter less then 30 characters')
		return
	}
	let confirmation = confirm('Are you sure you want to change?')
	if (!confirmation) return
	todoForm.removeEventListener('submit', saveEditedTodo)
	let newData = JSON.parse(localStorage.getItem('todoDb'))
	let getUsersTodo = newData.filter(({ email }) => {
		return email === userData.email
	})
	let main = getUsersTodo[0].todo
	main[EditBufferValue].todo = todoInput.value.trim()
	getUsersTodo[0].todo = [...main]
	let pushNewData = newData.filter(({ email }) => {
		return !(email === userData.email)
	})
	pushNewData.push(getUsersTodo[0])
	localStorage.setItem('todoDb', JSON.stringify(pushNewData))
	displayTodo()
	addTodoBtn.style.display = 'block'
	saveTodoBtn.style.display = 'none'
	todoForm.addEventListener('submit', addTodo)
	todoInput.value = ''
	EditBufferValue = ''
}

function deleteTodo(index) {
	let confirmation = confirm('Are you sure you want to delete?')
	if (!confirmation) return
	let newData = JSON.parse(localStorage.getItem('todoDb'))
	let getUsersTodo = newData.filter(({ email }) => {
		return email === userData.email
	})
	let main = getUsersTodo[0].todo
	main.splice(index, 1)
	getUsersTodo[0].todo = [...main]
	let pushNewData = newData.filter(({ email }) => {
		return !(email === userData.email)
	})
	pushNewData.push(getUsersTodo[0])
	localStorage.setItem('todoDb', JSON.stringify(pushNewData))
	displayTodo()
}
function toggleTodo(index) {
	let Todo = document.querySelector('.todo')
	let newData = JSON.parse(localStorage.getItem('todoDb'))
	let getUsersTodo = newData.filter(({ email }) => {
		return email === userData.email
	})
	let main = getUsersTodo[0].todo
	main[index] = { todo: main[index].todo, completed: !main[index].completed }
	let pushNewData = newData.filter(({ email }) => {
		return !(email === userData.email)
	})
	pushNewData.push(getUsersTodo[0])
	localStorage.setItem('todoDb', JSON.stringify(pushNewData))
	if (Todo.classList.contains('active') && !main[index].completed) {
		Todo.classList.remove('active')
	} else {
		Todo.classList.add('active')
	}
	displayTodo()
}

function getGif() {
	fetch(
		`https://api.giphy.com/v1/gifs/random?api_key=GaeHCSqi9G9feA2syRu8IMiYlYgt62e1&tag=&rating=g`
	)
		.then((res) => {
			return res.json()
		})
		.then(function (myJson) {
			gif1.src = myJson.data.images.original.url
		})
		.catch((err) => {
			console.log(err)
		})
	setTimeout(getGif, 120000)
}
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=b082c8ad19ae8b359a475753581800ba`
			)
				.then((res) => {
					return res.json()
				})
				.then(function (myJson) {
					weatherCity.innerText = myJson.name
					weatherTemp.innerText = (myJson.main.temp - 273.15).toFixed(2) + '°C'
				})
		})
	}
}

function startTime() {
	const today = new Date()
	let h = today.getHours()
	let m = today.getMinutes()
	let s = today.getSeconds()
	m = checkTime(m)
	s = checkTime(s)
	document.getElementById('time').innerHTML = h + ':' + m + ':' + s
	setTimeout(startTime, 1000)
}

function checkTime(i) {
	if (i < 10) {
		i = '0' + i
	}
	return i
}
