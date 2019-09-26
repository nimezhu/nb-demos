import React, {useRef,useEffect,useState} from 'react';
import * as $ from "jquery"
import * as $3Dmol from "3dmol"
import Paper from '@material-ui/core/Paper';
import regionsNiceFormat from "../tools/regionsNiceText"
import Grid from '@material-ui/core/Grid';

import About from "../cards/AboutCard"
import MessageBox from "../chart/MessageBox"
import NavCard from '../chart/NavCard';

import gsheetAgent from "../tools/gsheetAgent"
import Ideogram from 'ideogram';
import parsePrettyRegions from "../tools/parsePrettyRegions"
import { Typography,Button, Card,CardContent} from '@material-ui/core';

var config = {
  backgroundColor: "#FFF",
};


function App(props) {
  const myRef = useRef(null)
   const {
        classes,
        version,
        regions,
        brush,
        c
    } = props
  const [probes,setProbes] = useState([])
  const [ihover,setIhover] = useState(null)
  const processUpdate = function() {
      console.log("get new regions",regions)
  }
  const processBrush = function() {
      console.log("brush regions",brush)
  }
  const init = function() {

   
  }
 useEffect(() => {
      var renderChromos = function(probes) {
        var ideogram = new Ideogram({
          organism: 'human',
          annotations: probes,
          assembly: "GRCh38",
          container: ".chromos",
          rotatable: false
         });
      }
      var agent = gsheetAgent().sheetid("1yIxltKJZpZ_D5a1eVNDH2IVPP9AyQE2G4ATRWS7Bz1U").title("fish_hg38")
      agent().then(function(d){
        var p = d.map(function(d){
          var r = parsePrettyRegions(d.Regions)
          var a = r[0]
          a.stop = a.end 
          a.chr = a.chr.replace("chr","")
          a.name = "probe"+d.Title
          a.score = parseFloat(d.SON_TSA_Log2)
          return a
        })
       var _probes = d.map(function(d){
          var r = parsePrettyRegions(d.Regions)
          var a = r[0]
          a.name = d.Title
          a.genome = "hg38"
          a.score = parseFloat(d.SON_TSA_Log2)
          return a
        })
        setProbes(_probes)
        
        
        renderChromos(p)
      }).catch((e) => {
        console.log(e)
      })
      init()

  }, [])
  useEffect(() => {
      processUpdate()
  }, [props.regions])
  useEffect(() => {
      processBrush()
  }, [props.brush])

  var updateHandle = function(i) {
    return function(){
      c.call("update",this,[probes[i]])
    }
  }
  var hoverHandle = function(i) {
    return function(){
      console.log(probes[i].name)
      setIhover(i)
    }
  }
  var hoverOutHandle = function(i) {
    return function(){
      if (ihover == i) {
        setIhover(null)
      }
    }
  }
  return (
    <div className="Page">
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
            <Grid item xs={12} md={4}>
            <Card style={{height:250}}>
            <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Navigate to Probes Coordinates
        </Typography>
              {probes.map((d,i)=>
        (<Button size="small" variant="outlined" onClick={updateHandle(i)} onMouseOver={hoverHandle(i)} onMouseOut={hoverOutHandle(i)}>{d.name}</Button>
        )
      )}
              <Typography>
                 { 
                   ihover!=null ? (
                     <Typography component="div">
                     <Typography>Probe {probes[ihover].name}
                     </Typography>
                     <Typography variant="body2" component="p" >
                        {probes[ihover].chr}:{probes[ihover].start}-{probes[ihover].end}
                     </Typography>
                     </Typography>
                   ):null
                }
              </Typography>
              </CardContent>
            </Card>
            </Grid>
            
            <Grid item md={4} xs={12}>
                <MessageBox regions={regions} brush={brush}/>
            </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
            <Typography component="div" className="chromos"></Typography>
      </Grid>
    </Grid>
    </div>
  );
}

export default App;
