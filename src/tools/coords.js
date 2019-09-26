import {
    totalLength,
    overlap
} from "./funcs"
import * as d3 from "d3"
/* coord API

 */
function _overlap(a, b) {
    var start = Math.max(a[0], b[0])
    var end = Math.min(a[1], b[1])
    if (start < end) {
        return [start, end]
    } else {
        return false
    }
}
export default function() {
    var regions
    var width = 500
    var gap = 10
    var inited = false
    var scales, offsets, widths
    /* x.chr x.start x.end */
    /* TODO add overflow fix */
    var chart = function(e) {
        if (!inited) {
            init();
        }
        var rdata = []
        regions.forEach(function(r, i) {
            var domain = scales[i].domain();
            if (Object.prototype.toString.call(e) === '[object Array]') {
                e.forEach(function(d, j) {
                    if (overlap(r, d)) {
                        var start = d.start
                        var end = d.end
                        var full = true;
                        var o_e = false;
                        var o_s = false;
                        if (d.start < domain[0]) {
                            start = domain[0]
                            full = false
                            o_s = true
                        }
                        if (d.end > domain[1]) {
                            end = domain[1]
                            full = false
                            o_e = true
                        }
                        var x = scales[i](start) + offsets[i]
                        var full = true;
                        var l = scales[i](end) + offsets[i] - x

                        rdata.push({
                            "x": x,
                            "l": l,
                            "f": full,
                            "o_e": o_e,
                            "o_s": o_s,
                        })
                    }
                })
            } else {
                if (overlap(r, e)) {
                    var start = e.start
                    var end = e.end
                    var full = true;
                    var o_e = false;
                    var o_s = false;
                    var l_oe = 0.0;
                    var l_os = 0.0;
                    if (e.start < domain[0]) {
                        start = domain[0]
                        full = false
                        o_s = true
                    }
                    if (e.end > domain[1]) {
                        end = domain[1]
                        full = false
                        o_e = true
                    }
                    var x = scales[i](start) + offsets[i]
                    var l = scales[i](end) + offsets[i] - x
                    if (o_e) {
                        l_oe = scales[i](e.end) - scales[i](end)
                    }
                    if (o_s) {
                        l_os = scales[i](start) - scales[i](e.start)
                    }
                    rdata.push({
                        "x": x,
                        "l": l,
                        "f": full,
                        "o_e": o_e,
                        "o_s": o_s,
                        "l_oe": l_oe,
                        "l_os": l_os,
                        "fl": l_os + l + l_oe
                    })
                }
            }
        })

        return rdata
    }
    var init = function() {
        inited = true
        scales = []
        offsets = []
        widths = []
        var offset = 0
        var totalLen = totalLength(regions)
        var effectWidth = width - (regions.length - 1) * gap
        regions.forEach(function(d) {
            var w = (+(d.end) - (+d.start)) * effectWidth / totalLen
            var scale = d3.scaleLinear().domain([+(d.start), +(d.end)]).range([0, w])
            scales.push(scale)
            offsets.push(offset)
            offset += w + gap
            widths.push(w)
        })
    }
    chart.width = function(_) {
        return arguments.length ? (width = _, inited = false, chart) : width;
    }
    chart.regions = function(_) {
        return arguments.length ? (regions = _, inited = false, chart) : regions;
    }
    chart.gap = function(_) {
        return arguments.length ? (gap = _, inited = false, chart) : gap;
    }
    chart.range = function(i) {
        if (!inited) {
            init();
        }
        if (scales[i]) {
            var x = scales[i].range();
            return [x[0] + offsets[i], x[1] + offsets[i]]
        } else {
            return [null, null]
        }
    }
    chart.init = function() {
        init()
        return chart
    }
    /* invert ： given [x0,x1] , get regions list　*/
    chart.invert = function(_) {
        var r = []
        scales.forEach(function(d, i) {
            var range = chart.range(i);
            var o = _overlap(range, _)
            if (o != false) {
                r.push({
                    "chr": regions[i].chr,
                    "start": Math.round(d.invert(o[0] - offsets[i])),
                    "end": Math.round(d.invert(o[1] - offsets[i]))
                })
            }
        })
        return r
    }
    chart.invertHost = function(_) {
        var r = []
        scales.forEach(function(d, i) {
            var range = chart.range(i);
            var o = _overlap(range, _)
            if (o) {
                r.push(i)
            }
        })
        return r
    }
    return chart
}
