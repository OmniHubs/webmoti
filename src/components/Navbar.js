import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import icon from '../images/webMoti.png'
import InputBase from '@material-ui/core/InputBase';
import Link from '@material-ui/core/Link';


const useStyles = makeStyles(theme => ({
    root:{
        flexGrow: 1,
    },
    imgStyling:{
        marginRight: theme.spacing(2),
    },
    title:{
        display:'block',
    },
    MyID:{
        position:'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor:(theme.palette.common.white, 0.25),
    },
    MyIDLabel:{
        width: theme.spacing(7),
        height:'100%',
        position:'absolute',
        pointerEvents: 'none',
        display:'flex',
        alignContent: 'center',
        justifyContent: 'center',
    },
}));

// MyId
// ClassroomID


function Navbar() {
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <a target="_blank" href="http://webmoti.org/">
                        <img
                            src={icon} alt="webMotiIcon" height="25" width="25"
                            className={classes.imgStyling}
                        /></a>
                    <Typography variant="h6" color="inherit" className={classes.title}>
                     WebMoti
                    </Typography>
                    <div className={classes.MyID}>
                        <div className={classes.MyIDLabel}>
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                        />
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Navbar;