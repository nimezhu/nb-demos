import * as d3 from "d3"
var niceFormat = d3.format(",")
export default function(d) {
    return d.chr + ":" + niceFormat(d.start+1) + "-" + niceFormat(d.end)
}
