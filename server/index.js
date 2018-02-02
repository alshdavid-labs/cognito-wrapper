global.config = require('./config.json')
let users = require('./services/user.service')


users.create({ 
    username: 'user02', 
    password: config.accounts[0].password, 
    email: 'kutrugorti@ziyap.com' 
})
    .then(user => console.log(user))
    .catch(err => console.log(err))


users.verify({
    username: 'user02',
    code: '057156'
})
    .then(user => console.log(user))
    .catch(err => console.log(err))


users.login({
    username: config.accounts[0].username,
    password: config.accounts[0].password
})
    .then(token => console.log(token))
    .catch(err => console.log(err))

/*







*/
