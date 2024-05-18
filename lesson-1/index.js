const http = require("http");
const posts = require("./posts");
const url = require("node:url");

const app = http.createServer(async (req, res) => {

  if (req.method === "GET") {

      const url=req.url.split("/")[1];
      const postId=req.url.split("/")[2];

      if(url==="posts" && postId){

          const foundPost=posts?.find(post => post.id == postId);
          const postItem=posts?.filter((postItem)=>postItem.id == postId);

          if(!foundPost){
                    res.writeHead(404, {"Content-Type": "application/json"});
             return res.end(JSON.stringify({message:"Post not found"}));
          }

          if(foundPost){
                     res.writeHead(200, {"Content-Type": "application/json"});
              return res.end(JSON.stringify(postItem));
          }

      }

      if(url==="posts"){
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({posts}));
          return
      }

      res.writeHead(404, {"Content-Type": "application/json"});
      return res.end(JSON.stringify({error: "Not found"}));
  }

  if(req.method==="POST"){

      if(req.url==="/posts"){
         req.on("data",(chunk)=> {
             const {title , body}=JSON.parse(chunk);
             posts.push({
                 title : title,
                 body : body,
                 userId : Date.now(),
                 id: posts.at(-1).id+1 || 1
             });
             res.writeHead(201, {"Content-Type": "application/json"});
             res.end(JSON.stringify({message:"Post added"}));
         })
      }



  }


  if(req.method==="PUT"){
      const url=req.url.split("/")[1];
      const postId=req.url.split("/")[2];

      if(url==="posts" && postId){
          const foundPost=posts?.find(post => post.id == postId);
          req.on("data",(chunk)=> {
              const {title , body}=JSON.parse(chunk);
                  foundPost.title = title ? title : foundPost.title,
                  foundPost.body = body ? body : foundPost.body
          })
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify({message:"Post updated"}));
      }
  }

    if(req.method==="DELETE"){
        const url=req.url.split("/")[1];
        const postId=req.url.split("/")[2];
        if(url==="posts" && postId){
            posts.splice(posts.findIndex(e=>e.id == postId),1);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({message:"Post deleted"}));
         }
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({message:"Not found command"}));
        return
    }
})





const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server started on ports ${PORT}`)
});

