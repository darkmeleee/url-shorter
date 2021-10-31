const express = require("express");
const fs = require("fs");
const app = express();
const jsonParser = express.json();

var randtoken = require('rand-token');


const urlencodedParser = express.urlencoded({extended: false});

const path = "links.json";

app.post("/shorten", urlencodedParser, function (req, res){
    
    if(!req.body.urlToShorten) return res.status(400);

    const postlink = req.body.urlToShorten;
    const token = randtoken.generate(8).toLocaleLowerCase();
    if (!postlink.includes("https://")) {
        postlink1 = "https://" + postlink;
        let link = {"token": token, "link": postlink1, "views": 0};
        let data = fs.readFileSync(path, "utf8");
         let links = JSON.parse(data);
        links.push(link);
        data = JSON.stringify(links);
        fs.writeFileSync("links.json", data);
        res.status(201).send({"status": "Created", "shortenedUrl": `${req.get('host')}/${token}`});
    }
    else {
        let link = {"token": token, "link": postlink, "views": 0};
        let data = fs.readFileSync(path, "utf8");
        let links = JSON.parse(data);
        links.push(link);
        data = JSON.stringify(links);
        fs.writeFileSync("links.json", data);
        res.status(201).send({"status": "Created", "shortenedUrl": `${req.get('host')}/${token}`});
    }
    
})

app.get("/:url", function(req,res){

    const token = req.params.url;
    const jsonfile = fs.readFileSync(path, "utf8");
    const links = JSON.parse(jsonfile);
    let redrict = null;

    for(var i=0; i<links.length; i++){
        if(links[i].token == token){
            redrict = links[i];
            break;
        }
    }

    if(redrict){
        redrict.views = redrict.views + 1;
        data = JSON.stringify(links);
        fs.writeFileSync(path, data);
        res.redirect(redrict.link);
    }

    else{
        
    }


    
});

app.get("/:url/views", function(req,res){
    const token = req.params.url;
    const jsonfile = fs.readFileSync(path, "utf8");
    const links = JSON.parse(jsonfile);
    let redrict = null;

    for(var i=0; i<links.length; i++){
        if(links[i].token == token){
            redrict = links[i];
            break;
        }
    }

    if(redrict){   
        res.status(200).send({"viewCount": redrict.views});
    }

    else{
        res.status(404).send("не найдено");
    }

})


app.listen(3000);
