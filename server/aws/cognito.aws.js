const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const Promise = require('bluebird')

const AuthenticationDetails = AmazonCognitoIdentity.AuthenticationDetails
const CognitoUserPool       = AmazonCognitoIdentity.CognitoUserPool
const CognitoUser           = AmazonCognitoIdentity.CognitoUser
const CognitoUserAttribute  = AmazonCognitoIdentity.CognitoUserAttribute


const userPool = new CognitoUserPool({
    UserPoolId: config.UserPoolId,
    ClientId: config.ClientId 
})

function login({ username, password }){
    return new Promise((res, rej) => {
        console.log("\nLogging in:", username, password, "\n")

        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool
        })
        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password
        })

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => 
                res(result.getAccessToken().getJwtToken()),

            onFailure: (err) => 
                rej({ message: "General", data: err, cognitoUser }),

            mfaRequired: (codeDeliveryDetails) => 
                rej({ message: "Require Verification Code", data: codeDeliveryDetails, cognitoUser }),

            newPasswordRequired: (userAttributes, requiredAttributes) =>
                rej({ message: "Password Challenge", data: { userAttributes, requiredAttributes }, cognitoUser }), 
        })
    })
}

function register({ username, password, email }){
    return new Promise((res, rej) => {
        var attributeList = [];
        
        var attributeEmail = new CognitoUserAttribute({
            Name : 'email',
            Value : email
        });

        attributeList.push(attributeEmail)

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                rej(err);
                return;
            }
            res(result.user)
        });
    })
}


function verify({ username, password, code }){
    return new Promise((res, rej) => {
        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool
        })

        cognitoUser.confirmRegistration(code, true, function(err, result) {
            if (err) {
                rej({ message: "Password Challenge", data: err });
                return;
            }
            res(result)
        });
    })
}


module.exports = {
    login,
    register,
    verify
}

// ;
// cognitoUser.sendMFACode(verificationCode, this)
// delete userAttributes.email_verified;
// delete userAttributes.phone_number_verified;

/*

    cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());

*/