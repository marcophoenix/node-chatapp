const users = []

const adduser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()


    if (!username || !room) {
        return {
            error: 'usernameand room not avaiable'
        }
    }


    const existinguser = users.find((user) => {
        return user.room == room && user.username == username
    })

    if (existinguser) {
        return {
            error: 'username already in use'
        }
    }


    const user = { id, username, room }
    users.push(user)
    return { user }
}


const removeuser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}
const getuser = (id) => {
    return users.find((user) => user.id === id)
}


const getuserinroom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    adduser,
    getuser,
    getuserinroom,
    removeuser
}