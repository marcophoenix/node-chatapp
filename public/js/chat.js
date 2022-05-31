const socket = io()
const $messegeform = document.querySelector('#forme')
const $messegeforminput = $messegeform.querySelector('input')
const $messegeformbutton = $messegeform.querySelector('button')
const $location = document.querySelector('#send-location')
$messeges = document.querySelector('#messeges')

const messegetemplate = document.querySelector('#messege-template').innerHTML
const locationmessegetemplate = document.querySelector('#location-messege-template').innerHTML
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    const $newmessege = $messeges.lastElementChild

    const newMesegeStyle = getComputedStyle($newmessege)
    const newmessegemargin = parseInt(newMesegeStyle.marginBottom)
    const newMessegeHeight = $newmessege.offsetHeight + newmessegemargin

    const visibleheight = $messeges.offsetHeight

    const constainerheight = $messeges.scrollHeight

    const scrollset = $messeges.scrollTop + visibleheight

    if (constainerheight - newMessegeHeight <= scrollset) {
        $messeges.scrollTop = $messeges.scrollHeight
    }

}
socket.on('messege', (messege) => {
    console.log(messege)
    const html = Mustache.render(messegetemplate, {
        username: messege.username,
        messege: messege.text,
        createdat: moment(messege.createdat).format('h:m a')
    })
    $messeges.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

socket.on('locationmessege', (messege) => {
    console.log(messege)
    const html = Mustache.render(locationmessegetemplate, {
        username: messege.username,
        url: messege.url,
        createdat: moment(messege.createdat).format('h:m a')
    })
    $messeges.insertAdjacentHTML('beforeend', html)
})

socket.on('roomdata', ({ room, users }) => {
    const html = Mustache.render(sidebartemplate, {
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html
})

$messegeform.addEventListener('submit', (e) => {
    e.preventDefault()
    $messegeformbutton.setAttribute('disabled', 'disabled')
    const messege = e.target.elements.messege.value

    socket.emit('sendmessege', messege, (error) => {

        $messegeformbutton.removeAttribute('disabled')
        $messegeforminput.value = ''
        $messegeforminput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('messege delivered')
    })
})

$location.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supproted by your browser')
    }
    // console.log(navigator.geolocation.getCurrentPosition)
    $location.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        socket.emit('sendlocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {

            $location.removeAttribute('disabled')
            console.log('loaction shared')

        })
    })
})
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})