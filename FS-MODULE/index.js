const http = require('http');
const fs = require('fs');

const app=http.createServer((req, res) => {

if(req.method=='GET'){
    const hotels=JSON.parse(fs.readFileSync('./hotels.json','utf8'));
    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(JSON.stringify({hotels}));
    return;
}


res.end("ok")


})

const PORT=8080;
app.listen(PORT , ()=> console.log("Server running on port 8080"));


