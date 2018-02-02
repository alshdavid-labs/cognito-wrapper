const cognito = require('../aws/cognito.aws')



function login({ username, password }){
    return cognito.login({ username, password })
}

function create({ username, password, email }){
    return cognito.register({ username, password, email })
}

function update(){

}

function remove(){

}

function verify({ username, password, code }){
    return cognito.verify({ username, password, code })
}

module.exports = {
    login,
    create,
    verify
}