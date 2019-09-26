import React, {useState,useEffect} from 'react';
import { CardContent,Button,Card } from '@material-ui/core';
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

function AboutCard(props) {
    const classes = useStyles()
    const {title} = props
    useEffect(() => {
  }, [])
  return (<Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          About 
        </Typography>
        <Typography>
          {title}
        </Typography>
        <Typography variant="body2" component="p">
        </Typography>
      </CardContent>
  </Card>
  );
}

export default AboutCard;
