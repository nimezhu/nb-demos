import React, { useRef, useEffect, useState} from 'react';
import * as $ from "jquery"
import * as $3Dmol from "3dmol"
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import About from "../cards/AboutCard"
import MessageBox from "../chart/MessageBox"
import NavCard from '../chart/NavCard';

var config = {
    backgroundColor: "#FFF",
};
var _color = ["#FF0000",
    "#AD5004",
    "#FF9100",
    "#FFFF00",
    "#009100",
    "#ACFCFC",
    "#0031FF",
    "#9F11C1",
    "#FF99B4"
]



var defaultRegion = [{
    genome: "hg38",
    chr: "chr19",
    start: 7335096,
    end: 15449819
}]

var blocks = [
    [7335095, 8615114],
    [8615114, 9809324],
    [9809324, 11609185],
    [11609185, 12649186],
    [12649186, 13209186],
    [13209186, 13729186],
    [13729186, 14569188],
    [14569188, 15089189],
    [15089189, 15449189]

]
/*
var articleURL="https://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1007872"
var figureURL="https://journals.plos.org/plosgenetics/article/figure/image?size=large&id=10.1371/journal.pgen.1007872.g002"
var dataURL=""
*/

function App(props) {
    const myRef = useRef(null)
    const {
        classes,
        version,
        regions,
        brush,
        c
    } = props
    
    const [viewer,setViewer] = useState(null)
    const [el,setEl] = useState({}) 


    const [models,setModels] = useState([])
    //TODO Highlight
    const processUpdate = function () {
         transCoords(regions)
         if (models && viewer) {
                models.forEach(function (m, i) {
                m.setStyle(
                    {
                        sphere:
                        {
                            colorfunc: respond(i),
                            radius: 3.0,
                            opacity: 0.65,
                        },
    
                    })
            })
            viewer.render();
           } else {
               console.log("no viewers?",viewer)
           }
       
    }
    const processBrush = function () {
        if (brush.length==0) return
        transCoords(brush)
         if (models && viewer) {
                models.forEach(function (m, i) {
                m.setStyle(
                    {
                        sphere:
                        {
                            colorfunc: respond(i),
                            radius: 3.0,
                            opacity: 0.65,
                        },
    
                    })
            })
            viewer.render();
           } else {
               console.log("no viewers?",viewer)
           }
    }
    var m = []
    var resp = []
    var isResp = false;
    var zeros = function () {
        resp.forEach(function (a, i) {
            a.forEach(function (d, j) {
                resp[i][j] =
                    0
            })
        })
    }
 //chromsome 19 blocks , hg38 version
            var blocks = [
    [7335095,8615114],
    [8615114,9809324],
    [9809324,11609185],
    [11609185,12649186],
    [12649186,13209186],
    [13209186,13729186],
    [13729186,14569188],
    [14569188,15089189],
    [15089189,15449189]

]
    blocks.forEach(function (se) {
            var l = se[1] - se[0]
            l = Math.floor(l / 10000)
            resp.push(Array.apply(null,
                Array(l)).map(Number.prototype
                    .valueOf, 0))
        })
    var color = function (d, i) {
        if (isResp) {
            var j = Math.floor(i / 2)
            if (resp[j][d.index] > 0) {
                return _color[j]
            }
            else {
                return "grey"
            }

        }
        else {
            return _color[Math.floor(i / 2)]
        }
    }


    var transCoords = function (d) {
        zeros()
        isResp = false;
        d.forEach(function (r) {

            if (r.chr != "chr19") {
                return
            }
            else {
                blocks.forEach(
                    function (se,i) {
                        var start = se[0]
                        var end = se[1]

                        var
                            maxStart =
                                Math.max(
                                    start,
                                    r
                                        .start
                                )
                        var minEnd =
                            Math.min(
                                end,
                                r
                                    .end
                            )
                        if (
                            minEnd >
                            maxStart
                        ) {
                            for (
                                var
                                j = maxStart; j <
                                minEnd; j +=
                                10000
                            ) { 
                                resp[i]
                                [
                                    Math
                                        .floor(
                                            (
                                                j -
                                                start
                                            ) /
                                            10000
                                        )
                                ] =
                                    1;
                            }
                            isResp =
                                true
                        }

                    })

            }

        })
    }
    var respond = function (i0) {
        return function (d, i) {
            return color(d,i0)
        }
    }

    const init = function () {
        var e = $(myRef.current)
        var v = $3Dmol.createViewer(e,config)
        
       setEl(e)
       setViewer(v)

           
        for (var i = 1; i <= 9; i++) {
            m.push("CS" + i + "A")
            m.push("CS" + i + "B")
        }
        var queue = m.map(function (d) {
            return fetch(
                "data/IMGR_Models/" + d +
                ".xyz").then(function (d) {
                    return d.text()
                })
        })

        var render = function () {
            Promise.all(queue).then(function (d) {
                var values = d
                var ms = []
                values.forEach(function (data,
                    i) {
                    var m = v.addModel(
                        data,
                        "xyz"
                    );
                    ms.push(m)
                    m.setStyle(
                        {
                            sphere:
                            {
                                colorfunc: respond(
                                    i
                                ),
                                radius: 3.0,
                                opacity: 0.65,
                            },


                        })

                })
                setModels(ms)
                v.zoomTo();
                v.render();
                v.zoom(1.2,
                    1000);
            });
        }
        render()




    }
    const handleHighlight = function (i) {
        return function () {
            c.call("brush", this, [{
                "genome": "hg38",
                "chr": "chr19",
                "start": blocks[i][0],
                "end": blocks[i][1],
                "color": _color[i]
            }])
        }
    }


    useEffect(() => {
        init()
    }, [])
    useEffect(() => {
        processUpdate()
    }, [props.regions])
    var TO
    useEffect(() => {
        clearTimeout(TO)
        TO = setTimeout(function()
        {
        processBrush()
        }, 500)
    }, [props.brush])


    return (
        <div className="Page">
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>

                        <Grid item xs={6} md={4}>
                            <NavCard regions={defaultRegion} c={c} />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <MessageBox regions={regions} brush={brush} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>
                        <Grid item>
                            <Paper>
                                <div>
                                    {blocks.map((d, i) => (
                                        <Tooltip title={
                                            "highlight C" + (i + 1)
                                        }>
                                            <Button size="small" variant="outlined" style={{ color: _color[i] }} onClick={handleHighlight(i)}>CS{i + 1}</Button>
                                        </Tooltip>
                                    ))}
                                </div>
                                <div ref={myRef} style={{ minHeight: 500, position: "relative" }}></div>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


        </div>
    );
}

export default App;
