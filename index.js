const http = require("http");
const server = http.createServer();
const fs = require("fs");
server.on("request", (req, res)=>{
    if(req.url === '/'){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html')
        res.write('<html>')
        res.write('<head><title>My Home Page</title></head>')
        res.write('<body><h1>Hello World</h1></body>')
        res.write('</html>')
        res.end(); 
    }

    if(req.url === "/read-message"){
        
        fs.readFile("./message.txt", "utf-8", (err, data)=>{
            if(err){
                console.error(err);
                return;
            }
            res.write("<h1>"+data+"<h1>");
            res.end();
        })
    }

    if(req.url === "/write-message"&& req.method === "GET"){  
        res.write(`
            <html>
                <head>
                    <title>Send a message</title>
                </head>
                <body>
                    <form action="/write-message" method="POST">
                        <input type="text" name="message" placeholder="Enter your message">
                        <button type="submit">Submit</button>
                    </form>
                </body>
            </html>
        `)
        res.end();
    }


    if(req.url === "/write-message" && req.method === "POST"){
        const body = [];
        req.on("data", (chunk)=>{
            body.push(chunk)
        })

        req.on("end", ()=>{
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];

            fs.writeFileSync("message.txt", message, (err=>{
                if(err)throw err;
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();
            }))
        })
    }

  

})

server.on("listening", ()=>{
    console.log("yeahhhh");
})

server.listen(8000);