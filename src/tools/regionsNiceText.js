import regionNiceText from "./regionNiceText"

export default function(regions) {
    var r = []
    regions.forEach(function(d) {
        r.push(regionNiceText(d))
    })
    return r.join("; ")
}
