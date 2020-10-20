const jwtSecret = 'QPMXLWRSKVTNAXJPWNHDLTBLYBBVOVSYNRJWYRJCZAFONJDONJWEEXACHYOE';
const jwt = require("jsonwebtoken");
const { decode } = require("jsonwebtoken");

const getToken = async function(data){
    var token = await jwt.sign(data, jwtSecret);
    return token;
}
const jwtVerify =async function(token){
    try{
        var decoded = await jwt.verify(token, jwtSecret);
        return {userid : decoded.userid, username : decoded.username};
    }catch(err) {
        // console.log(err);
        return null;      
    }
}
module.exports = {
    getToken,
    jwtVerify
}
