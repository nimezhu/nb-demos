import React, {useRef,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import regionsNiceFormat from "../tools/regionsNiceText"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from "@material-ui/core/Typography"
const useStyles = makeStyles({
  card: {
    minWidth: 275,
    height: 250,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
function MessageBox(props) {
  const myRef = useRef(null)
   const {
        regions,
        brush,
    } = props
  const classes = useStyles()

  const processUpdate = function() {
      console.log("get new regions",regions)
  }
  const processBrush = function() {
      console.log("brush regions",brush)
  }
  useEffect(() => {
      processUpdate()
  }, [props.regions])
  useEffect(() => {
      processBrush()
  }, [props.brush])
  return (
    <Card className={classes.card} >
        <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Nucleome Bridge Messages
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Regions
        </Typography>
        <Typography variant="body2" component="p">
           {regionsNiceFormat(regions)}
        </Typography>
         <Typography className={classes.pos} color="textSecondary">
          Highlight
        </Typography>
        <Typography variant="body2" component="p">
        {regionsNiceFormat(brush)}
        </Typography>
         </CardContent>
    </Card>
  );
}

export default MessageBox;
