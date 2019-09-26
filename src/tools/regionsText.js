import regionText from "./regionText"

export default function(regions) {
    var r = []
    regions.forEach(function(d) {
        r.push(regionText(d))
    })
    return r.join(",")
}
