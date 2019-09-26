import React, { useEffect, useState, useRef } from "react"
import * as d3 from "d3"
import coords from "../tools/coords"
import * as $ from "jquery"
import * as $3Dmol from "3dmol"
import Card from '@material-ui/core/Card';
import { CardHeader, CardContent, Typography, CardActions } from "@material-ui/core";

function euclid(a, b) {
    var dx = a.x - b.x
    var dy = a.y - b.y
    var dz = a.z - b.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
function coord2dis(a, disfunc) {
    var l = a.length;
    var m = Array(l).fill(null).map(() => Array(l).fill(0.0));
    for (var i = 0; i < l; i++) {
        for (var j = i; j < l; j++) {
            var d = disfunc(a[i], a[j])
            m[i][j] = {
                x: a[i].index,
                y: a[j].index,
                v: d
            }
            m[j][i] = {
                x: a[j].index,
                y: a[i].index,
                v: d
            }
        }
    }
    return m
}
var hcolor = d3.scaleLinear().range([
    "#FF0000", "#FFFFFF", "#3f4498"
]).domain([0, 500, 900])


function pairs(v) {
    var r = []
    for (var i = 0; i < v.length; i++) {
        for (var j = 0; j < v.length; j++) {
            r.push({
                x: v[i].x,
                y: v[j].x,
                width: v[i].l,
                height: v[j].l
            })
        }
    }
    return r
}

var process = function (v) {
    var atoms = []
    var n = v.length
    var j = 0
    v.forEach(function (d, i) {
        var k = JSON.parse(JSON.stringify(d))
        if (k.z) {
            k.bonds = []
            k.bondOrder = []
            if (i < n - 1) {
                k.bonds.push(v[i + 1].index) //TODO next index
                k.bondOrder.push(1)
            }
            atoms.push(k)
            j++
        }

    })
    return atoms
}

function StormChart(props) {
    const { data, regions, brush, defaultRegions } = props
    const [viewer, setViewer] = useState(null)
    const [atoms, setAtoms] = useState([])
    const [index, setIndex] = useState(null)
    var coord = coords().regions(defaultRegions).width(130)
    const myRef = useRef()
    /* Call Update */
    function initHeatMap() {
        var el = d3.select(myRef.current)
        var n = el.append("div").classed("c",
            true).style("height", "300px").style("width", "300px")
            .style("position", "relative")
        var hmap = el.append("div").classed(
            "hmap", true)
            .style("height", "150px")
            .style("text-align", "center")
            .style("background-color", "aliceblue")
            .style("padding", "5px")
            .style("position", "relative")
        var c = hmap.append("canvas")
            .attr("width", 130)
            .attr("height", 130)
            .style("position", "absolute")
            .style("top", "10px")
            .style("left", "85px")
        hmap.append("svg").classed("resp", true)
            .attr("width", 130)
            .attr("height", 130)
            .style("position", "absolute")
            .style("top", "10px")
            .style("left", "85px")
        var footer = el.append("div").classed("footer", true)

    }
    function init3D() {
        var el = d3.select(myRef.current).select(".c:nth-child(1)")
        let element = $(el.node());
        let config = {};
        setViewer($3Dmol.createViewer(
            element, config) || { "error": "not create viewer" })
    }
    /* On Mount */
    useEffect(() => {
        initHeatMap()
        init3D()
    }, [])
    /* On Atoms */
    function drawHeatMap(a) {
        var el = d3.select(myRef.current)
        var c = el.select(".hmap").select("canvas")

        var dis = coord2dis(a, euclid)
        var ctx = c.node().getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 130, 130)

        dis.forEach(function (r, i) {
            r.forEach(function (d, j) {
                var y = r[0].x
                var x = d.y
                ctx.fillStyle = hcolor(d.v)
                ctx.fillRect(x * 2, y * 2, 2, 2)
            })

        })

    }
    function draw3D(a) {
        viewer.clear()
        viewer.setBackgroundColor(0xffffffff);
        var m = viewer.addModel();

        m.addAtoms(a);
        m.setStyle(
            {},
            {
                sphere:
                {
                    color: "grey",
                    radius: 50.0,
                    opacity: 0.65,
                },
                stick:
                {
                    singleBonds: true,
                    radius: 25,
                    linewidth: 8,
                    opacity: 0.45,
                    color: "grey"
                },


            });
        viewer.zoomTo();
        viewer.render();
    }
    useEffect(()=>{
        if (viewer){
            draw3D(atoms)
        }
    },[viewer])
    useEffect(() => {
        var a = process(data.data)
        setAtoms(a)
        drawHeatMap(a)
        if (viewer) {
            draw3D(a)
        } else {
        }
        if (a && a.length > 0) {
            setIndex(a[0].cell)
        }
        if (brush && brush.length > 0) {
            highlight3D()
        }
    }, [props.data])

    useEffect(() => {
        d3.select(myRef.current).selectAll("rect").remove()
    }, [props.regions])

    /* Call Brush */
    function highlightHeatMap() {
        var v = coord(brush)
        var p = pairs(v)
        d3.select(myRef.current).selectAll(".resp")
            .each(function (d, i) {
                var el = d3.select(this)
                var r = el.selectAll("rect")
                    .data(p)
                r.exit().remove()
                r.enter()
                    .append("rect")
                    .merge(r)
                    .attr("opacity", 0.3)
                    .attr("x", function (d) {
                        return d.x
                    })
                    .attr("y", function (d) {
                        return d.y
                    })
                    .attr("width", function (d) {
                        return d.width
                    })
                    .attr("height", function (d) {
                        return d.height
                    })
            })
    }


    function highlight3D() {
        //TODO Hard Code Here
        if (brush[0].chr != "chr21") {
            return
        }
        var hset = {}
        var start = 28000000
        var end = 30000000
        var step = 30000
        brush.forEach(function (r0) {
            if (r0.start < end && r0.end >
                start) {
                var s = Math.max(r0.start,
                    start)
                var e = Math.min(r0.end, end)
                var s0 = Math.floor((s -
                    start) / step) + 1
                var e0 = Math.floor((e -
                    start) / step) + 1
                for (var j = s0; j < e0; j++) {
                    hset[j] = true
                }
            }
        })
        var highlight = function (atom) {
            if (hset[atom.index]) {
                return "red"
            }
            else {
                return "grey"
            }
        };
        viewer.addStyle(
            {},
            {
                stick:
                {
                    colorfunc: highlight
                },
                sphere:
                {
                    colorfunc: highlight
                }
            })
        viewer.render()

    }
    useEffect(() => {
        if (brush.length > 0) {
            highlightHeatMap()
            highlight3D()
        }
    }, [props.brush])

    return (
        <Card style={{ width: 300, height: 500 }}>
            <CardContent>
             <div ref={myRef}>

             </div>
             <Typography>{data.cell} {data.idx}</Typography>
             <Typography>No.{index} Cell</Typography>
            </CardContent>
        </Card>)
}
export default StormChart