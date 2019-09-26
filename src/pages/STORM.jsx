import React, {useRef,useEffect} from 'react';
import * as $ from "jquery"
import * as $3Dmol from "3dmol"
import Paper from '@material-ui/core/Paper';
import regionsNiceFormat from "../tools/regionsNiceText"
import Grid from '@material-ui/core/Grid';

import About from "../cards/AboutCard"
import MessageBox from "../chart/MessageBox"
import NavCard from '../chart/NavCard';
import DataAgent from "../storm3d/DataAgent"

var config = {
  backgroundColor: "#FFF",
};
var defaultRegion = [
    {
        genome:"hg38",
        chr: "chr21",
        "start": 28000000,
        "end": 30000000
    }]

const dataURL = "https://github.com/BogdanBintu/ChromatinImaging/tree/master/Data"
function App(props) {
  const myRef = useRef(null)
   const {
        classes,
        version,
        regions,
        brush,
        c
    } = props
  var viewer
  var el
  const processUpdate = function() {
      console.log("get new regions",regions)
  }
  const processBrush = function() {
      console.log("brush regions",brush)
  }
  const init = function() {
   
  }
  useEffect(() => {
      init()

  }, [])
  useEffect(() => {
      processUpdate()
  }, [props.regions])
  useEffect(() => {
      processBrush()
  }, [props.brush])


  return (
    <div className="Page">
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
            <Grid item xs={6} md={4}>
                <NavCard regions={defaultRegion} c={c}/>
            </Grid>
            <Grid item xs={6} md={4}>
                <MessageBox regions={regions} brush={brush}/>
            </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
          <DataAgent regions={regions} brush={brush}/>

      </Grid>
    </Grid>
    </div>
  );
}

export default App;
