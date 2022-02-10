const signinEmail = document.getElementById('signin_email')
const signinPassword = document.getElementById('signin_password')
const signForm = document.getElementById('signin_form')
const viewPass = document.getElementById('show_pass')
let signinData = {}

window.onload = () => {
	let userData = JSON.parse(localStorage.getItem('user'))
	if (userData) location.href = location.origin
}
function toggleView(e) {
	e.preventDefault()
	if (viewPass.checked) {
		signinPassword.type = 'text'
	} else {
		signinPassword.type = 'password'
	}
}

function checkData() {
	let allData = JSON.parse(localStorage.getItem('db'))
	let userData = 0
	if (allData) {
		userData = allData.filter(({ number, email, password }) => {
			return (
				(number == signinData['email'] || email === signinData['email']) &&
				password === signinData['password']
			)
		})
	}
	return userData
}
function doLogin(e) {
	e.preventDefault()
	let validData = checkData()
	if (validData.length === 1) {
		delete validData[0].password
		localStorage.setItem('user', JSON.stringify(...validData))
		location.href = location.origin
	} else {
		alert('invalid email/phone or password')
		signinPassword.value = ''
	}
}
function getValue(e) {
	e.preventDefault()
	if (e.target.name === 'email') {
		signinData[e.target.name] = e.target.value.trim().toLowerCase()
	} else signinData[e.target.name] = e.target.value.trim()
}
signinEmail.addEventListener('change', getValue, null)
signinPassword.addEventListener('change', getValue, null)
viewPass.addEventListener('change', toggleView, null)
signForm.addEventListener('submit', doLogin, null)
