import React, { useState, useEffect, useRef } from 'react';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as d3 from "d3"
import { Typography } from '@material-ui/core';


import ChartStorm from "./ChartStorm"

function entryParse(v) {
    return {
        "cell": v[0],
        "index": parseInt(v[1]),
        "z": parseInt(v[2]),
        "x": parseInt(v[3]),
        "y": parseInt(v[4])
    }
}

function parse(d) {
    var lines = d.split("\n")
    var cells = [];
    var lastCell = null;
    var j = -1;
    for (var i = 2; i < lines.length; i++) {
        var v = lines[i].split(",")
        if (lastCell != v[0]) {
            cells.push([]);
            j += 1;
            lastCell = v[0]
        }
        cells[j].push(entryParse(v))
    }
    return cells

}
const dataNames = [
    "A549_chr21-28-30Mb",
    "K562_chr21-28-30Mb",
    "IMR90_chr21-28-30Mb",
    "IMR90_chr21-28-30Mb_cell\ cycle",
    "HCT116_chr21-28-30Mb_6h\ auxin",
    "HCT116_chr21-28-30Mb_untreated"
]
function getFullUrl(d) {
    var prefix = "/static/data/storm/"
    var suffix = ".csv"
    return prefix + d + suffix
}
// TODO DATA STATUS and LOCAL STORAGE
// easy management large data set?
// GET FILE SIZE HEAD
// READ PARTIAL 
var defaultRegions = [
    {
        chr: "chr21",
        "start": 28000000,
        "end": 30000000
    }]

var server = window.location.origin

function MyButton(props) {
    const { handleLoad, handleUnload, init } = props
    const [open, setOpen] = useState(false)
    const [progressing, setProgressing] = useState(false)
    const [cellNumber, setCellNumber] = useState(0)
    useEffect(() => {
        if (init) {
            setProgressing(true)
            handleLoad(function (d) {
                setOpen(true)
                setCellNumber(d)
                setProgressing(false)
            })
        }
    }, [])

    return (<div>
        {open ? (
            <IconButton onClick={function (d) {
                setProgressing(true)
                handleUnload(
                    function () {
                        setOpen(false)
                        setCellNumber(0)
                        setProgressing(false)
                    }
                )
            }
            }>
                <DeleteIcon variant="outlined" fontSize="small" />
            </IconButton>) : (
                <IconButton onClick={function () {
                    setProgressing(true)
                    handleLoad(function (d) {
                        setOpen(true)
                        setCellNumber(d)
                        setProgressing(false)
                    })
                }} className="loadBtn">
                    <AddIcon variant="outlined" fontSize="small" />
                </IconButton>)
        }
        {
            progressing ? (<CircularProgress color="secondary" />) : null
        }
        {
            (cellNumber !== 0) ? (<Typography component="span">{cellNumber} cells</Typography>) : null
        }
    </div>)


}

function Agent(props) {
    const { getData, regions, brush } = props
    const [state, setState] = useState([]);
    const [open, setOpen] = useState(false)
    //const [current, setCurrent] = useState({ data: [] })
    const [selected, setSelected] = useState([])
    const [current2, setCurrent2] = useState([])
    const [dataMap, setDataMap] = useState({})
    const myRef = useRef()

    useEffect(() => {
        var fetchs = dataNames.map(function (d) {
            var u = getFullUrl(d)
            var U = server + "/" + u

            return fetch(U, { method: "HEAD" })
        })
        Promise.all(fetchs).then(function (d) {
            var s = d.map((d, i) => ({ name: dataNames[i], size: d.headers.get("content-length"), load: false }))
            setState(s)
        })

    }, [])
    useEffect(() => {
    }, [state])
    function handleLoad(i) {
        return function (callback) {
            var url = server + "/" + getFullUrl(dataNames[i])
            fetch(url, {})
                .then((d) => (d.text()))
                .then((d) => {
                    state[i]["load"] = true
                    var c = parse(d)
                    dataMap[i] = c
                    callback(c.length)
                })
                .catch((e) => { })
        }
    }
    function handleUnload(i) {
        return function (callback) {
            state[i]["load"] = false
            delete dataMap[i]
            callback()
        }
    }
    function randomSelect() {
        var s = []
        var k = Object.keys(dataMap)
        
        for (var i0= 0; i0 < 4; i0++) {
            if (k.length > 0) {
                var i = Math.floor(Math.random() * k.length)
                var l = dataMap[k[i]].length
                var j = Math.floor(Math.random() * l)
                s.push({
                    cell: dataNames[k[i]],
                    idx: j,
                    data: JSON.parse(JSON.stringify(dataMap[k[i]][j]))
                })
            } else {

            }
        }
        setSelected(s)
    }
    return (

        <Card>
            <Typography component="div">
                <Button onClick={randomSelect} variant="outlined"> Random Plot </Button>
                <Grid container>
                {selected.map((d)=>{

                    return (<Grid item xs="6" md="3">
                        <ChartStorm data={d} regions={regions} brush={brush} defaultRegions={defaultRegions} />
                        </Grid>)
                })}
                </Grid>
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Command</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>File Size</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody ref={myRef}>
                    {state.map((row, i) => {
                        return (
                            <TableRow>
                                <TableCell>
                                    {
                                        i === 0 ? <MyButton init={true} handleLoad={handleLoad(i)} handleUnload={handleUnload(i)} />
                                            :
                                            <MyButton handleLoad={handleLoad(i)} handleUnload={handleUnload(i)} />
                                    }
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell>{d3.format(".2s")(row.size)}</TableCell>
                            </TableRow>
                        )
                    }
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}
export default Agent