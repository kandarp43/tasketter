const logout = document.querySelector('.logout')
const greet = document.querySelector('.greet')
let userData
window.onload = () => {
	userData = JSON.parse(localStorage.getItem('user'))
	if (!userData) location.href = location.origin + '/pages/signin.html'
	greet.innerHTML = `hello, <span class="user_name"> ${userData.name}</span>`
}
function makeLogout(e) {
	e.preventDefault()
	localStorage.removeItem('user')
	location.href = location.origin + '/pages/signin.html'
}
logout.addEventListener('click', makeLogout)
