const fs = require("fs");
// синхронное чтение
console.log("Синхронное чтение файла")
let fileContent = fs.readFileSync("dist/report.json", "utf8");
var parsedData = JSON.parse(fileContent);
let createInfo = parsedData.entrypoints.app.assets

var css = createInfo.filter(function(name) {
    return name.match(/css/)
});
var js = createInfo.filter(function(name) {
    return name.match(/js/)
});

fs.writeFileSync("dist/createInfo.json", JSON.stringify({ css, js }))