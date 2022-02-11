let p_name
let p_email
let p_number
// const p_password = document.querySelector('.p_password').value
const editProfileForm = document.querySelector('.edit_profile_form')
let user
let toggleChangeProfile = false
window.onload = () => {
	user = JSON.parse(localStorage.getItem('user'))
	if (!user) location.href = location.origin + '/pages/signin.html'
}
function checkData() {
	p_name = document.querySelector('.p_name').value
	p_email = document.querySelector('.p_email').value
	p_number = Number(document.querySelector('.p_number').value)

	console.log(p_name, p_email, p_number)
	let validateEmail = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}')
	if (!p_name || p_name.length <= 2) error = 'insert Valid Name'
	else if (!validateEmail.test(p_email)) error = 'insert Valid Email'
	else if (p_number.toString().length != 10) {
		error = 'insert Valid number'
	} else error = ''
	// console.log(p_number.toString().length != 10)
	// console.log(typeof p_number.toString().length)
	// console.log(typeof 10)
	// console.log(error)
	let allData = JSON.parse(localStorage.getItem('db'))
	let alreadyExists
	if (allData) {
		alreadyExists = allData.filter(({ number, email }) => {
			return number == p_number || email === p_email
		})
	}

	if (
		alreadyExists.length > 0 &&
		p_number !== user.number &&
		p_email !== user.email
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
	if (!error && !exists) {
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
		localStorage.setItem('user', JSON.stringify(...newSetVal))
		localStorage.setItem('todoDb', JSON.stringify(getTodoVal))
		location.reload()
	}
}

editProfileForm.addEventListener('submit', storeValue, null)
