const logout = document.querySelector('.logout')
const greet = document.querySelector('.greet')
const gif1 = document.getElementById('gif1')
const gif2 = document.getElementById('gif2')
const hiddenInput = document.getElementById('hiddenInput')
const weatherCity = document.getElementById('weather_city')
const weatherTemp = document.getElementById('weather_temp')
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
	getGif()
	getLocation()
	displayTodo()
	startTime()
	if (!userData) location.href = location.origin + '/pages/signin.html'
	greet.innerHTML = `Hello, <span class="user_name"> ${userData.name}</span>`
}
function makeLogout(e) {
	e.preventDefault()
	localStorage.removeItem('user')
	location.href = location.origin + '/pages/signin.html'
}

logout.addEventListener('click', makeLogout)
todoForm.addEventListener('submit', addTodo)
let todoList = []
function addTodo(e) {
	e.preventDefault()
	todoList.push({
		todo: todoInput.value,
		completed: false,
	})
	todoInput.value = ''
	let newData = JSON.parse(localStorage.getItem('todoDb'))
	let getUsersTodo = newData.filter(({ email }) => {
		return email === userData.email
	})
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

	console.log(main)
	let printTodoIncomplete = ''
	main.forEach(({ todo, completed }, index) => {
		printTodoIncomplete += `<div class="todo">
		<input type="checkbox" onclick="toggleTodo(${index})" id="todo_check" ${
			completed ? 'checked' : ''
		} />
		<p class="todo_text">${todo}</p>
		<div>
			<button class="edit_btn" onclick="editTodo(${index})">🖊</button>
			<button class="delete_btn" onclick="deleteTodo(${index})">
			🗑
			</button>
		</div>
	</div>`
	})
	list_container.innerHTML = printTodoIncomplete

	let printTodoComplete = ''
	todoArray_complete.forEach(({ todo, completed }, index) => {
		printTodoComplete += `<div class="todo">
		<input type="checkbox" id="todo_check" ${completed ? 'checked' : ''} />
		<p class="todo_text">${todo}</p>
		<button class="edit_btn" onclick="editTodo(${index})">Edit</button>
		<button class="delete_btn" onclick="deleteTodo(${index})">
			Delete
		</button>
	</div>`
	})
	list_container_completed.innerHTML = printTodoComplete
}
function editTodo() {}

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
	fetch(
		`https://api.giphy.com/v1/gifs/random?api_key=GaeHCSqi9G9feA2syRu8IMiYlYgt62e1&tag=&rating=g`
	)
		.then((res) => {
			return res.json()
		})
		.then(function (myJson) {
			gif2.src = myJson.data.images.original.url
		})
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
					console.log()
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
