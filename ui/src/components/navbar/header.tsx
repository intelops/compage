import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logo from "../../compage-logo.svg";
import {useAppSelector} from "../../redux/hooks";
import {Link, useNavigate} from "react-router-dom";
import {getCurrentProjectDetails} from "../../utils/localstorageClient";
import {selectGetCurrentContextData} from "../../features/k8s-operations/slice";
import {getCurrentUser} from "../../utils/sessionstorageClient";

const Header = () => {
    const getCurrentContextData = useAppSelector(selectGetCurrentContextData);

    const navigate = useNavigate();

    const handleAccount = () => {
        navigate("/account");
    };

    const getCurrentProjectSelected = () => {
        const currentProjectDetails = getCurrentProjectDetails();
        if (currentProjectDetails) {
            const userNameAndProjectAndVersion = currentProjectDetails.split("###");
            return <Toolbar>
                <Box sx={{flexGrow: 0}}>
                    <Typography variant={"h6"}>
                        You have selected <u>{userNameAndProjectAndVersion[1]}</u> [<span style={{
                        color: "yellow"
                    }}>{getCurrentContextData?.contextName}</span>]
                    </Typography>
                </Box>
            </Toolbar>;
        }
    };

    const getLogo = () => {
        return <Toolbar component="div" sx={{flexGrow: 1}}>
            <Link to={"/home"}>
                <Box
                    component="img"
                    sx={{
                        height: 64,
                        width: "320px"
                    }}
                    alt="Compage by IntelOps"
                    src={Logo}
                />
            </Link>
        </Toolbar>;
    };

    return <AppBar position="absolute" style={{backgroundColor: "#174985"}}>
        <Toolbar disableGutters>
            {getLogo()}
            {getCurrentProjectSelected()}
            <Toolbar component="nav" variant="dense" sx={{flexGrow: 0}}>
                <Box sx={{flexGrow: 0}}>
                    <Typography variant={"h6"}>
                        <span onClick={handleAccount}>Account({getCurrentUser()})</span>
                    </Typography>
                </Box>
            </Toolbar>
        </Toolbar>
    </AppBar>;
};

export default Header;
