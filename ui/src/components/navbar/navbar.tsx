import * as React from 'react';
import {useContext, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Logo from "../../logo.png";
import {backendEndpoints} from "../../store/auth_reducer";
import {useAppSelector} from "../../hooks/redux-hooks";

const pages = ['Products', 'Blog'];
const settings = ['Account', 'Logout'];

const Navbar = () => {
    const authDetails = useAppSelector(state => state.authDetails);

    const [data, setData] = useState({errorMessage: "", isLoading: false});
    let avatar_url, name, public_repos, followers, following;
    if (authDetails.user) {
        name = authDetails.user.name
        following = authDetails.user.following
        followers = authDetails.user.followers
        public_repos = authDetails.user.public_repos
        avatar_url = authDetails.user.avatar_url
    }

    const handleLogout = () => {
        const proxy_url_logout = backendEndpoints.proxy_url_logout + "?userName=" + authDetails.user.login;
        // Use code parameter and other parameters to make POST request to proxy_server
        fetch(proxy_url_logout, {
            method: "GET",
        })
            .then((response: Response) => {
                if (!response.ok) {
                    setData({
                        isLoading: false,
                        errorMessage: "[Non-200 Response] Sorry! Logout failed"
                    });
                    if (response.status === 401) {
                        // dispatch({
                        //     type: "LOGOUT"
                        // });
                    }
                } else return response.json();
            })
            .then(data => {
                if (data) {
                    if (JSON.stringify(data).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                        setData({
                            isLoading: false,
                            errorMessage: "[Bad Credentials] Sorry! Logout failed"
                        });
                    } else {
                        // dispatch({
                        //     type: "LOGOUT"
                        // });
                    }
                }
            })
            .catch(error => {
                setData({
                    isLoading: false,
                    errorMessage: "[error] Sorry! Logout failed : " + error
                });
            });
    }

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    function getMenuItem(setting: string) {
        if (setting === "Logout") {
            if (authDetails.user.login) {
                let element
                data.isLoading ? (
                    element = <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : (
                    element = <MenuItem key={setting} onClick={handleLogout}>
                        <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>);
                return element
            }
            return
        }
        return <MenuItem key={setting} onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{setting}</Typography>
        </MenuItem>;
    }

    return <>
        <span>{data.errorMessage}</span>
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Toolbar>
                        <Box
                            component="img"
                            sx={{
                                height: 64,
                            }}
                            alt="Your logo."
                            src={Logo}
                        />
                    </Toolbar>
                    {/*<AdbIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>*/}
                    {/*<Typography*/}
                    {/*    variant="h6"*/}
                    {/*    noWrap*/}
                    {/*    component="a"*/}
                    {/*    href="/"*/}
                    {/*    sx={{*/}
                    {/*        mr: 2,*/}
                    {/*        display: {xs: 'none', md: 'flex'},*/}
                    {/*        fontFamily: 'monospace',*/}
                    {/*        fontWeight: 700,*/}
                    {/*        letterSpacing: '.3rem',*/}
                    {/*        color: 'inherit',*/}
                    {/*        textDecoration: 'none',*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    COMPAGE*/}
                    {/*</Typography>*/}

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        COMPAGE
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Account Details">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt={name} src="/static/images/avatar/2.jpg"/>
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
                            {settings.map((setting) => getMenuItem(setting))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    </>;
};
export default Navbar;
