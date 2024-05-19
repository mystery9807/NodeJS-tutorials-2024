const http = require('http');
const fs = require('fs');

const app=http.createServer((req, res) => {

if(req.method=='GET'){

    const hotels=JSON.parse(fs.readFileSync('./hotels.json','utf8'));

    const url=req.url.split('/')[1];
    const hotelId=Number(req.url.split('/')[2]);

    if(req.url==="/hotels"){
       res.writeHead(200, { "Content-Type": "application/json" });
       res.end(JSON.stringify(hotels));
       return
    }

    if(url==="hotels" && hotelId){

       const foundHotel=hotels.find((e=>e.id === hotelId));
       const findHotel=hotels.filter((e=>e.id === hotelId));

       if(!foundHotel){
          res.writeHead(404, {"Content-Type": "application/json"});
          res.end(JSON.stringify({message:"Not found hotel"}));
          return;
       }

       if(foundHotel){
           res.writeHead(200, { "Content-Type": "application/json" });
           res.end(JSON.stringify(findHotel));
           return;
       }

    }

    res.writeHead(404, {"Content-Type": "application/json"});
    res.end(JSON.stringify({message:"Not found"}));

}


if(req.method=='POST'){

    const url=req.url.split('/')[1];

    if(url==="hotels"){

        req.on('data', (chunk) => {

            const hotels=JSON.parse(fs.readFileSync('./hotels.json','utf8'));

            const {name}=JSON.parse(chunk);

            hotels.push({id:hotels.at(-1).id+1 || 1, name})
            fs.writeFileSync('./hotels.json',JSON.stringify(hotels, null, 4));
            res.writeHead(201,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({message:"Hotel successfully added"}));

        })
    }

}


if(req.method=='PUT'){

    const hotels=JSON.parse(fs.readFileSync('./hotels.json','utf8'));
    const url=req.url.split("/")[1];
    const hotelId=req.url.split("/")[2];

    if(url==="hotels" && hotelId){

        req.on('data', (chunk) => {

            const {name}=JSON.parse(chunk);
            const hotels=JSON.parse(fs.readFileSync('./hotels.json','utf8'));
            const foundHotel=hotels.find(e=>e.id==hotelId);
            foundHotel.name=name ? name : foundHotel.title;
            fs.writeFileSync('./hotels.json',JSON.stringify(hotels, null, 4));
            res.writeHead(201,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({message:"Hotel updated"}));
        })
    }


}

if(req.method=='DELETE'){

const url=req.url.split("/")[1];
const hotelId=req.url.split("/")[2];

if(!hotelId){
    res.writeHead(404, {"Content-Type": "application/json"});
    res.end(JSON.stringify({message:"Not found hotel"}));
}

    if(hotelId){
        req.on('data', (chunk) => {
            const hotels=JSON.parse(fs.readFileSync('./hotels.json','utf8'));
            hotels.splice(hotels.findIndex(e=>e.id == hotelId),1);
            fs.writeFileSync('./hotels.json',JSON.stringify(hotels, null, 4));
            res.writeHead(200,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({message:"Hotel successfully deleted"}));
        })
    }
}
})

const PORT=8080;
app.listen(PORT , ()=> console.log("Server running on port 8080"));


// FS-MODULE CRUD


