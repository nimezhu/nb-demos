//nucleome browser api key for google sheet
//remove this key before publish
//add private gsheet ??
var nbApiKey = "AIzaSyBhECk4C1LpxI1mDJjSTwot-hRP2v3bwEA" 
function objectFactory(v) {
    var k = v[0]
    var l = k.length
    var a = new Array(l - 1)
    a.columns = v[0]
    v.forEach(function (d, i) {
      if (i == 0) {
        return
      }
      var b = {}
      d.forEach(function (d, j) {
        b[k[j]] = d
      })
      a[i - 1] = b
    })
    return a
}
/*gsheetAgent
 * Usage: 
 * Example:
 *      var agent = gsheetAgent().title("Sheet2").sheetid(sheetid)
 *      agent().then(renderData).catch(console.log) 
 *
 */
function gsheetAgent() {
    var sheetid 
    var title = "Sheet1"
    var range = "A1:ZZ"
    var apiKey = nbApiKey
    var agent = function(){
      return new Promise(function(resolve,reject){
        var r = title+ "!" + range
        fetch("https://sheets.googleapis.com/v4/spreadsheets/" + sheetid + "/values/" + r + "?key=" + apiKey, {}).then(function(d){
          return d.json()
        })
        .then(function (d) {
          var a = objectFactory(d.values)
          resolve(a)
        })
        .catch(function(e){
          reject(e)
        })

    })
    }
    agent.sheetid = function (_) { return arguments.length ? (sheetid = _, agent) : sheetid;}
    agent.title = function (_) { return arguments.length ? (title = _, agent) : title;}
    agent.range = function (_) { return arguments.length ? (range = _, agent) : range;}
    agent.apiKey = function (_) { return arguments.length ? (apiKey = _, agent) : apiKey;}
    return agent
}

export default gsheetAgent
