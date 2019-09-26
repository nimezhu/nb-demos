/* Regions format:
 * chr1:100,100-122,200;chr2:10,000-12,000
 */

var parseRegion = function (s) {
  var a = s.split(":")
  if (a.length == 1) {
    return {
      "chr": a[0],
      "start": 0,
      "end": undefined
    }

  }
  var x = a[1].split("-")
  return {
    "chr": a[0].replace(/ /g,""),
    "start": +(x[0].replace(/,/g, "")),
    "end": +(x[1].replace(/,/g, ""))
  }
}
export default function (s) {
  var a = s.split(';')
  var r = []
  a.forEach(function (d) {
    r.push(parseRegion(d))
  })
  return r
}
