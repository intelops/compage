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
import Button from "@mui/material/Button";
import {ClickAwayListener, Grow, MenuList, Paper, Popper} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const Header = () => {
    const getCurrentContextData = useAppSelector(selectGetCurrentContextData);

    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setOpen(false);
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    };

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleMyAccountClick = () => {
        handleClose(new Event("click"));
        navigate("/account");
    };

    const handleProjectsClick = () => {
        handleClose(new Event("click"));
        navigate("/projects");
    };

    const handleGitPlatformsClick = () => {
        handleClose(new Event("click"));
        navigate("/git-platforms");
    };

    const handleLogoutClick = () => {
        handleClose(new Event("click"));
        sessionStorage.clear();
        navigate("/login");
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
            <Toolbar>
                <Button
                    ref={anchorRef}
                    id="composition-button"
                    aria-controls={open ? 'composition-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}>
                    Dashboard
                </Button>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                >
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                        autoFocusItem={open}
                                        id="composition-menu"
                                        aria-labelledby="composition-button"
                                        onKeyDown={handleListKeyDown}
                                    >
                                        <MenuItem onClick={handleMyAccountClick}>
                                            {getCurrentUser()}
                                        </MenuItem>
                                        <MenuItem onClick={handleProjectsClick}>Projects</MenuItem>
                                        <MenuItem onClick={handleGitPlatformsClick}>Git Platforms</MenuItem>
                                        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Toolbar>
        </Toolbar>
    </AppBar>;
};

export default Header;
