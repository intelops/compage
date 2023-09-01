import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logo from "../../compage-logo.svg";
import {useAppSelector} from "../../redux/hooks";
import {Link, useNavigate} from "react-router-dom";
import {getCurrentProjectDetails} from "../../utils/localstorage-client";
import {selectGetCurrentContextData} from "../../features/k8s-operations/slice";

const settings = ['Account'];

const Header = () => {
    const getCurrentContextData = useAppSelector(selectGetCurrentContextData);

    const navigate = useNavigate();

    const handleAccount = () => {
        navigate("/account");
        handleCloseUserMenu();
    };

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const getMenuItem = (setting: string) => {
        if (setting === "Account") {
            return <MenuItem key={setting} onClick={handleAccount}>
                <Typography textAlign="center">{setting}</Typography>
            </MenuItem>;
        }
    };

    const getMenu = () => {
        return <Toolbar>
            <Box sx={{flexGrow: 0}}>
                <Menu
                    sx={{mt: '45px'}}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => getMenuItem(setting))}
                </Menu>
            </Box>
        </Toolbar>;
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
            {getMenu()}
        </Toolbar>
    </AppBar>;
};

export default Header;
