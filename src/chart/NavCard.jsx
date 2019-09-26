import React, {useRef,useEffect} from 'react';
import regionsNiceFormat from "../tools/regionsNiceText"
import { CardContent,Button,Card,Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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

function NavCard(props) {
   const {
       regions,
       c
    } = props
    const classes = useStyles()
  const handleNavigate = function(){
      c.call("update",this,regions)
  }
  return (<Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          This Figure's Genome Coordinates     
        </Typography>
        <Button variant="outlined" size="small" onClick={handleNavigate}>Navigate to</Button>
        <Typography variant="body2" component="p">
            {regionsNiceFormat(regions)}
        </Typography>
      </CardContent>
  </Card>
  );
}

export default NavCard;
