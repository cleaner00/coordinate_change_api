
const { json } = require('express');
let fs = require('fs');
let readJson = fs.readFileSync(__dirname + '/가로쓰레기통.json', 'utf8', (err) => {
    console.error();
});

//console.log(readJson);
//console.log(JSON.parse(readJson));
readJson = JSON.parse(readJson);

readJson = Object.values(readJson).filter((item, i) => {
    return item !== "???";
    
    // if (item[i+1] === "???") {
    //     delete item;
    // }
})


console.log(readJson.length);



let readJson11 = fs.readFileSync(__dirname + '/가로쓰레기통_좌표.json', 'utf8', (err) => {
    console.error();
});
readJson11 = JSON.parse(readJson11);
console.log(JSON.parse(readJson11[1]));
