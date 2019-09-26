function getBand(genome, callback) {
    var chrBands = {}
    var URL = "https://vis.nucleome.org" //TODO
    fetch(URL + "/static/data/cytoband/" + genome + ".cytoBand.txt", {
        "credentials": "include"
    }).then(function(res) {
        res.text().then(function(d) {
            var l = d.split("\n")
            l.forEach(function(d) {
                var a = d.split("\t")
                var c = a[0]
                var s = parseInt(a[1])
                var e = parseInt(a[2])
                var band = a[3]
                if (!(c in chrBands)) {
                    chrBands[c] = {
                        "band": []
                    };
                }
                chrBands[c]["band"].push({
                    "chr":c,
                    "start": s,
                    "end": e,
                    "id": band,
                    "value":a[4]
                })
            })
            callback(chrBands)
        })
    }).catch(function(e) {
        callback(null)
    })
}
export default getBand
