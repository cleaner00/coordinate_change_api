const xlsx = require('xlsx');
const fetch = require('node-fetch');

const workbook = xlsx.readFile(__dirname + '/서울특별시 가로쓰레기통 설치정보(2019.9).xlsx');

let xlsxToJson = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
//중복 제거
xlsxToJson = xlsxToJson.filter((item, i) => {
    return (
        xlsxToJson.findIndex((item2, j) => {
            return item["__EMPTY_2"] === item2["__EMPTY_2"];
        }) === i
    );
});


async function addCoordinate() {

    let Json_addCoordinate = []; // 양식 [ {자치구명:00, {도로명:00, {설치위치:00, 위도:00, 경도:00}}}, ]

    for (let i = 1; i <= Object.keys(xlsxToJson).length - 1; i++) {

        //xlsxToJson[i]["__EMPTY"]

        let query = xlsxToJson[i]["__EMPTY"] + " " + xlsxToJson[i]["__EMPTY_1"] + " " + xlsxToJson[i]["__EMPTY_2"];
        if (!xlsxToJson[i]["__EMPTY_1"]) {
            query = xlsxToJson[i]["__EMPTY"] + " " + xlsxToJson[i]["__EMPTY_2"];
        }
        //console.log(`${i}: ` + query);
        


        let url = `https://dapi.kakao.com/v2/local/search/address.json?query=` + encodeURIComponent(query);
        await fetch(url, {
            headers: {
                'Authorization': 'KakaoAK 009723cdaa567cb7959564ab48403f45'
            }
        })
            .then((res) => {return res.json();})
            .then((json) => {
                console.log(i);
                //console.log(json["documents"]);
                //console.log(JSON.stringify(json["documents"]));
                let need_string = `{"자치구명": "${xlsxToJson[i]['__EMPTY']}", "도로명": "${xlsxToJson[i]['__EMPTY_1']}", "설치위치": "${xlsxToJson[i]['__EMPTY_2']}", "위도": "${json['documents'][0]['y']}", "경도": "${json['documents'][0]['x']}"}`
                if (json["meta"]["total_count"] === 1) {
                    //Json_addCoordinate[i] = json["documents"][0];
                    Json_addCoordinate.push(JSON.parse(need_string));
                }
                else {
                    Json_addCoordinate.push(JSON.parse(need_string));
                }
            }).catch((err) => { console.error(); });
        //break;
    }
    console.log(Json_addCoordinate);
    return Json_addCoordinate;
}

addCoordinate().then((Json_addCoordinate) => {
    let fs = require('fs');
    fs.writeFile('가로쓰레기통_좌표.json', JSON.stringify(Json_addCoordinate), (err) => {
        console.log(err);
    });
});


