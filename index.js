const express = require('express');
var fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/file',(req,res)=>{
    res.sendFile(__dirname + '/json/main.json');
});

app.post('/file',(req,res)=>{
    // read the content to edit
    var inputStream = req.query;
    var edited = false;

    fs.readFile(__dirname + '/json/main.json', function(err, data) {
         // Check for errors 
        if (err) throw err; 
    
        // read the existing json file
        var existingList = JSON.parse(data); 
        var newList = [];

        // edit the json & save in newList
        for(var i=0;i<existingList.length;i++)
        {
            var entry = existingList[i];
            if(inputStream.id === entry.id)
            {
                entry.name = inputStream.name;
                edited = true;
            }
            newList.push(entry);
        }

        // if input Id is not in existing list then add it as new entry
        if(!edited)
        {
            newList.push(inputStream);
        }

        // rewrite it in file
        fs.writeFile(__dirname + '/json/main.json',  JSON.stringify(newList) , function (err) {
             // Check for errors 
            if (err) throw err;
            res.sendFile(__dirname + '/json/main.json');  
        });

    });
})

app.delete('/file',(req,res)=>{
    // read the content to delete
    var inputStream = req.query;

    fs.readFile(__dirname + '/json/main.json', function(err, data) {
        // Check for errors 
       if (err) throw err; 
   
       // read the existing json file
       var existingList = JSON.parse(data); 
       var newList = [];

       // edit the json & save in newList
       for(var i=0;i<existingList.length;i++)
       {
           var entry = existingList[i];
           if(inputStream.id !== entry.id)
           {
               newList.push(entry);
           }
       }

       if(newList.length <=0)
       {
           return res.status(401).json({error : "Given id not found"})
       }

       // rewrite it in file
       fs.writeFile(__dirname + '/json/main.json',  JSON.stringify(newList) , function (err) {
            // Check for errors 
           if (err) throw err;
           res.sendFile(__dirname + '/json/main.json');  
       });

   });
})

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))

