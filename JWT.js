const jwtSecret = 'QPMXLWRSKVTNAXJPWNHDLTBLYBBVOVSYNRJWYRJCZAFONJDONJWEEXACHYOE';
const jwt = require("jsonwebtoken");
const { decode } = require("jsonwebtoken");
let logger = require("./Logger");
const SERVICE  = "JWT_TOKEN";
const getToken = async function(data){
    logger.debug({SERVICE:SERVICE,token:data},"Get token")
    var token = await jwt.sign(data, jwtSecret);
    return token;
}
const jwtVerify =async function(token){
    try{
        var decoded = await jwt.verify(token, jwtSecret);
        logger.debug({decoded:decoded},"Token verify");
        return {userid : decoded.userid, username : decoded.username};
    }catch(err) {
        logger.debug({error:err,token:token},"Error during jwt verify");
        return null;      
    }
}
module.exports = {
    getToken,
    jwtVerify
}
