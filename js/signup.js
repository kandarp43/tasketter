const Name = document.getElementById('signup_name')
const Email = document.getElementById('signup_email')
const Phone = document.getElementById('signup_number')
const Gender = document.getElementById('signup_gender')
const Dob = document.getElementById('signup_dob')
const Password = document.getElementById('signin_password')
const Form = document.getElementById('signup_form')
const signupViewPass = document.getElementById('show_pass')
let error,
	data = {
		gender: 'male',
	}

window.onload = () => {
	let userData = JSON.parse(localStorage.getItem('user'))
	if (userData) location.href = location.origin
}

function toggleView(e) {
	e.preventDefault()
	if (signupViewPass.checked) {
		Password.type = 'text'
	} else {
		Password.type = 'password'
	}
}

function checkData() {
	let validateEmail = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}')
	if (!data['name'] || data['name'].length <= 2) {
		error = 'insert Valid Name'
		return
	} else if (!validateEmail.test(data['email'])) {
		error = 'insert Valid Email'
		return
	} else if (!(data['number'].toString().length === 10)) {
		error = 'insert Valid number'
		return
	} else if (!data['gender']) {
		error = 'insert gender'
		return
	} else if (!data['dob']) {
		error = 'insert Valid date of birth'
		return
	} else if (!data['password'] || data['password'].length < 8) {
		error = 'inserts Valid password'
		return
	} else error = ''
	let allData = JSON.parse(localStorage.getItem('db'))
	let alreadyExists
	if (allData) {
		alreadyExists = allData.some(({ number, email }) => {
			return number === data['number'] || email === data['email']
		})
	}
	if (alreadyExists) {
		error = 'user already Exists with this email or phone'
	} else {
		error = ''
		return false
	}
	return
}
function getValue(e) {
	e.preventDefault()
	if (e.target.name == 'email')
		data[e.target.name] = e.target.value.trim().toLowerCase()
	else if (e.target.name == 'number')
		data[e.target.name] = Number(e.target.value.trim())
	else data[e.target.name] = e.target.value.trim()
}
function resetValue() {
	Name.value = ''
	Email.value = ''
	Phone.value = ''
	Dob.value = ''
	Gender.value = ''
	Password.value = ''
}
function storeValue(e) {
	e.preventDefault()
	let exists = checkData()
	if (error) alert(error)
	if (!error && !exists) {
		let todoData = { email: data.email, todo: [] }
		let getVal = JSON.parse(localStorage.getItem('db')) || []
		let getTodoVal = JSON.parse(localStorage.getItem('todoDb')) || []
		if (getVal) getVal.push(data)
		if (getTodoVal) getTodoVal.push(todoData)
		localStorage.setItem('db', JSON.stringify(getVal))
		localStorage.setItem('todoDb', JSON.stringify(getTodoVal))
		delete data.password
		localStorage.setItem('user', JSON.stringify(data))
		resetValue()
		location.href = location.origin
	}
}

Name.addEventListener('change', getValue, null)
Email.addEventListener('change', getValue, null)
Phone.addEventListener('change', getValue, null)
Gender.addEventListener('change', getValue, null)
Dob.addEventListener('change', getValue, null)
Password.addEventListener('change', getValue, null)
signupViewPass.addEventListener('change', toggleView, null)
Form.addEventListener('submit', storeValue, null)
