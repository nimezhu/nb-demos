import getBand from "../tools/getBand"
import * as d3 from "d3"
var colorBand = {
    "gneg": "#DDD",
    "gpos33": "#999",
    "gpos66": "#555",
    "gpos75": "#333",
    "gpos50": "#777",
    "gpos25": "#BBB",
    "gpos100": "#000",
    "gvar": "#000"
}
var colors = function(d) {
    return colorBand[d] || "#000"
}
export default function() {
    var width
    var height = 60
    var gap = 10
    var svg
    var canvas
    var chrs;
    var genome = null
    var bands = null
    var dispatch
    var regionsToChrs = function(d) {
        var chrSet = {};
        var retv = [];
        d.forEach(function(d) {
            if (!d.chr) return
            if (!chrSet[d.chr]) {
                retv.push({
                    "chr": d.chr,
                    "start": 0,
                    "end": chrs(d.chr)
                })
                chrSet[d.chr] = true;
            }
        })
        return retv
    }
    var chart = function(el) {
        var data = el.datum() //regions;
        var chromos = regionsToChrs(data)
        var r;
        el.selectAll("canvas").remove()
        canvas = el.append("canvas").attr("width", width).attr("height", height)
        el.selectAll("svg").remove()
        svg = el.append("svg").attr("width", width).attr("height", height)
       var ctx = canvas.node().getContext("2d")
        ctx.fillStyle = "#F7F7F7"
        ctx.fillRect(0, 0, width, height - 17)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, height - 17, width, 17)

       var plotChromsLabel = function() {
            ctx.fillStyle = "#000"
            chromos.forEach(function(d, i) {
                var x = coord(d)
                x.forEach(function(d0) {
                    ctx.fillText(d.chr, d0.x, 8)
                })
            })
        }
        var plotBands = function(results) {
            results.forEach(function(result, i) {
                var c = true
                result.forEach(function(d0) {
                    var b = coord(d0)
                    if (d0.value == "acen") {
                        if (c) {
                            c = false
                            ctx.fillStyle = "#900C3F"
                            ctx.moveTo(b[0].x, 12)
                            ctx.lineTo(b[0].x + b[0].l, 17);
                            ctx.lineTo(b[0].x, 22);
                            ctx.closePath();
                            ctx.fill();
                        } else {
                            c = true
                            ctx.fillStyle = "#900C3F"
                            ctx.moveTo(b[0].x, 17)
                            ctx.lineTo(b[0].x + b[0].l, 12);
                            ctx.lineTo(b[0].x + b[0].l, 22);
                            ctx.closePath();
                            ctx.fill()
                        }
                    } else {
                        ctx.fillStyle = colors(d0.value)
                        ctx.fillRect(b[0].x, 12, b[0].l, 10)
                    }
                    svg.append("rect")
                        .attr("x", b[0].x)
                        .attr("y", 12)
                        .attr("width", b[0].l)
                        .attr("height", 10)
                        .attr("fill", "#000")
                        .attr("opacity", 0.0)
                        .on("contextmenu", function(e) {
                            d3.event.preventDefault();
                            dispatch.call("update", this, [d0])
                        })
                        .append("svg:title")
                        .text(d0.id)

                })
            })

        }
       var plot = function(results) {
            plotBands(results)
            plotChromsLabel();
        }
        var _plot = function() {
            plotChroms()
            plotChromsLabel()
        }
        var q = []

        if (bands !== null) {
            chromos.forEach(function(d, i) {
                q.push(bands[d.chr]["band"])
            })
            plot(q)
        } else {
            getBand(genome, function(d) {
                if (d == null || "404 page not found" in d) {
                    _plot()
                } else {
                    bands = d
                    chromos.forEach(function(d, i) {
                        q.push(bands[d.chr]["band"])
                    })
                    plot(q)

                }
            })
        }
    }

    chart.width = function(_) {
        return arguments.length ? (width = _, chart) : width;
    }
    chart.height = function(_) {
        return arguments.length ? (height = _, chart) : height;
    }
    chart.chrs = function(_) {
        return arguments.length ? (chrs = _, chart) : chrs;
    }
    chart.genome = function(_) {
        if (!arguments.length) {
            return genome
        } else {
            if (genome == _) {
                return chart
            } else {
             genome = _;
             bands = null
             return chart
            }
        }
    }
    chart.dispatch = function(_) {
        return arguments.length ? (dispatch = _, chart) : dispatch;
    }
   return chart

}
