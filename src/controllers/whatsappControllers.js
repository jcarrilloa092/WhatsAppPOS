const VerifyToken = (req, res) => {
    res.send("hola verifyToken");
}

const ReceivedMessage = (req, res) => {
    res.send("hola received");
}

module.exports = {
    VerifyToken, 
    ReceivedMessage
 }