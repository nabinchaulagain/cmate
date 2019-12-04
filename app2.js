const request = require('request-promise');
const cheerio = require("cheerio");
const fs = require('fs');
(async()=>{
  const html = await request("http://www.fomecd.edu.np/campuses.php");
  const $ = cheerio.load(html);
  const cities=[];
  const rows = $("tr:nth-of-type(n+2)");
  rows.each((i,row)=>{
    cities.push($(row).find("td:nth-child(1)").text());
  })
})();