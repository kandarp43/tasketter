let p_name
let p_email
let p_number
const p_logout = document.querySelector('.logout')
const viewPassword = document.getElementById('show_pass')
const editProfileForm = document.querySelector('.edit_profile_form')
const editPasswordForm = document.querySelector('#profile_form')
const editProfile = document.querySelector('#editProfile')
const editPassword = document.querySelector('#editPassword')
let user
let toggleChangeProfile = false
let togglePassword = false
window.onload = () => {
	user = JSON.parse(localStorage.getItem('user'))
	if (!user) location.href = location.origin + '/pages/signin.html'
	document.querySelector('.profile').href = location.origin
	toggleChangeProfile = false
	togglePassword = false
	document.querySelector('.edit_profile_container').style.display = 'none'
	document.querySelector('.edit_password_container').style.display = 'none'
	document.querySelector(
		'.name'
	).innerHTML = `<div class="profile_show"><div class='txt_display'>${user.name}</div></div>`
	document.querySelector(
		'.email'
	).innerHTML = `<div class="profile_show"><div class='txt_display'>${user.email}</div></div>`
	document.querySelector(
		'.number'
	).innerHTML = `<div class="profile_show"><div class='txt_display'>${user.number}</div></div>`
	document.querySelector(
		'.dob'
	).innerHTML = `<div class="profile_show"><div class='txt_display'>${user.dob}</div></div>`
}

function makeLogout(e) {
	e.preventDefault()
	localStorage.removeItem('user')
	location.href = location.origin + '/pages/signin.html'
}

p_logout.addEventListener('click', makeLogout)
function checkData() {
	p_name = document.querySelector('.p_name').value
	p_email = document.querySelector('.p_email').value
	p_number = Number(document.querySelector('.p_number').value)

	let validateEmail = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}')
	if (!p_name || p_name.length <= 2) {
		error = 'insert Valid Name'
		return
	} else if (!validateEmail.test(p_email)) {
		error = 'insert Valid Email'
		return
	} else if (!(p_number.toString().length == 10)) {
		error = 'insert Valid number'
		return
	} else error = ''

	let allData = JSON.parse(localStorage.getItem('db'))
	let alreadyExistsNumber
	let alreadyExistsEmail
	if (allData) {
		alreadyExistsNumber = allData.filter(({ number }) => {
			return number == p_number
		})
		alreadyExistsEmail = allData.filter(({ email }) => {
			return email === p_email
		})
	}

	if (
		(alreadyExistsNumber.length > 0 && p_number !== user.number) ||
		(alreadyExistsEmail.length > 0 && p_email !== user.email)
	) {
		error = 'user already Exists with this email or phone'
	} else {
		error = ''
		return false
	}
	return
}

function storeValue(e) {
	e.preventDefault()
	let exists = checkData()
	if (error) alert(error)
	if (error.length == 0 && !exists) {
		let confirmation = confirm('Are you sure you want to change?')
		if (!confirmation) return
		let getVal = JSON.parse(localStorage.getItem('db'))
		let getTodoVal = JSON.parse(localStorage.getItem('todoDb'))
		let newSetVal = getVal.filter(({ number, email }) => {
			return number == user.number && email === user.email
		})
		let newSetValTodo = getTodoVal.filter(({ email }) => {
			return email === user.email
		})
		if (newSetValTodo[0].email) newSetValTodo[0].email = p_email
		if (newSetVal[0].name) newSetVal[0].name = p_name
		if (newSetVal[0].email) newSetVal[0].email = p_email
		if (newSetVal[0].number) newSetVal[0].number = p_number

		localStorage.setItem('db', JSON.stringify(getVal))
		localStorage.setItem('todoDb', JSON.stringify(getTodoVal))
		delete newSetVal[0].password
		localStorage.setItem('user', JSON.stringify(...newSetVal))
		location.reload()
	}
}
function storePasswordValue(e) {
	e.preventDefault()
	const p_password = document.querySelector('.p_password').value
	if (p_password.length < 8) {
		alert('password length must be of 8 characters')
		return
	}

	let confirmation = confirm('Are you sure you want to change?')
	if (!confirmation) return
	let getVal = JSON.parse(localStorage.getItem('db'))
	let newSetVal = getVal.filter(({ number, email }) => {
		return number == user.number && email === user.email
	})
	if (newSetVal[0].password) newSetVal[0].password = p_password
	localStorage.setItem('db', JSON.stringify(getVal))
	location.reload()
}
function toggleView(e) {
	e.preventDefault()
	if (viewPassword.checked) {
		document.querySelector('.p_password').type = 'text'
	} else {
		document.querySelector('.p_password').type = 'password'
	}
}
viewPassword.addEventListener('change', toggleView, null)
editProfileForm.addEventListener('submit', storeValue, null)
editPasswordForm.addEventListener('submit', storePasswordValue, null)
editProfile.addEventListener('click', toggleEditView, null)
editPassword.addEventListener('click', togglePasswordSectionView, null)
function toggleEditView(e) {
	e.preventDefault()
	document.querySelector('.p_name').value = user.name
	document.querySelector('.p_email').value = user.email
	document.querySelector('.p_number').value = user.number
	if (togglePassword) {
		togglePasswordSectionView(e)
	}
	if (toggleChangeProfile) {
		document.querySelector('.edit_profile_container').style.display = 'block'
	}
	toggleChangeProfile = !toggleChangeProfile
	if (toggleChangeProfile) {
		document.querySelector('.edit_profile_container').style.display = 'block'
	} else {
		document.querySelector('.edit_profile_container').style.display = 'none'
	}
}

function togglePasswordSectionView(e) {
	e.preventDefault()
	if (toggleChangeProfile) {
		toggleEditView(e)
	}
	if (togglePassword) {
		document.querySelector('.edit_password_container').style.display = 'block'
	}
	togglePassword = !togglePassword
	if (togglePassword) {
		document.querySelector('.edit_password_container').style.display = 'block'
	} else {
		document.querySelector('.edit_password_container').style.display = 'none'
	}
}
