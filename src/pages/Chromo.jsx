import React, {useRef,useEffect,useState} from 'react';
import Paper from '@material-ui/core/Paper';
import regionsNiceFormat from "../tools/regionsNiceText"
import Grid from '@material-ui/core/Grid';

import About from "../cards/AboutCard"
import MessageBox from "../chart/MessageBox"
import NavCard from '../chart/NavCard';

import gsheetAgent from "../tools/gsheetAgent"
import Ideogram from 'ideogram';
import { Typography } from '@material-ui/core';


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

  const [viewer,setViewer] = useState(null)
  const processUpdate = function() {
      console.log("get new regions",regions)
  }
  const processBrush = function() {
      console.log("brush regions",brush)
  }
  const init = function() {
    var ideogram = new Ideogram({
        organism: 'human',
        annotations: [{
          name: 'OligoSTORM',
          chr: '19',
          start: 7335097,
          stop: 15449819
        }, {
           name: "STORM",
           chr:"21",
           start:28000000,
           stop:30000000
        }],
        assembly: "GRCh38",
        container: ".small-ideogram"
       });
    setViewer(ideogram)
   
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
            <Grid item>
                <About title={"hg38 Data Map"}/>
            </Grid>
            <Grid item>
                <MessageBox regions={regions} brush={brush}/>
            </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
            <Typography component="div" className="small-ideogram"></Typography>
      </Grid>
    </Grid>
    </div>
  );
}

export default App;
