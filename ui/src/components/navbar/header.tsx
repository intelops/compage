import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from "../../logo.png";
import {useAppSelector} from "../../hooks/redux-hooks";
import {Link, useNavigate} from "react-router-dom";

const settings = ['Account', 'Logout'];

const Header = () => {
    const authentication = useAppSelector(state => state.authentication);
    const navigate = useNavigate()
    let name, avatar_url, login;
    if (authentication.user) {
        name = authentication.user.name;
        login = authentication.user.login;
        avatar_url = authentication.user.avatar_url;
    }

    const handleLogout = () => {
        sessionStorage.clear();
        // TODO Call backend service to invalidate the token
        handleCloseUserMenu()
        window.location.reload();
    }

    const handleAccount = () => {
        navigate("/account")
        handleCloseUserMenu()
    }

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const getMenuItem = (setting: string) => {
        if (setting === "Logout") {
            if (authentication.user.login) {
                return <MenuItem key={setting} onClick={handleLogout}>
                    <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
            }
            return ""
        }
        if (setting === "Account") {
            return <MenuItem key={setting} onClick={handleAccount}>
                <Typography textAlign="center">{setting}</Typography>
            </MenuItem>;
        }
    }

    const getMenu = () => {
        if (authentication.user.login) {
            return <Toolbar>
                <Box sx={{flexGrow: 0}}>
                    <Tooltip title="Account Details">
                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                            <Avatar alt={name} src={avatar_url}/>
                        </IconButton>
                    </Tooltip>
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
                        <MenuItem key="username">
                            <Typography textAlign="center">Welcome {login}!!!</Typography>
                        </MenuItem>
                        {settings.map((setting) => getMenuItem(setting))}
                    </Menu>
                </Box>
            </Toolbar>
        }
        return ""
    }

    const getLogo = () => {
        if (authentication.user.login) {
            return <Toolbar component="div" sx={{flexGrow: 1}}>
                <Link to={"/home"}>
                    <Box
                        component="img"
                        sx={{
                            height: 64,
                        }}
                        alt="Compage by IntelOps"
                        src={Logo}
                    />
                </Link>
            </Toolbar>
        }
        return ""
    };

    return <AppBar position="absolute">
        <Toolbar disableGutters>
            {getLogo()}
            {getMenu()}
        </Toolbar>
    </AppBar>;
};

export default Header;
