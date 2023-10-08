import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {listGitPlatformsAsync} from "./async-apis/listGitPlatforms";
import {DeleteGitPlatformRequest, GitPlatformDTO, ListGitPlatformsRequest} from "./model";
import {selectListGitPlatformsData} from "./slice";
import {Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Button from "@mui/material/Button";
import {deleteGitPlatformAsync} from "./async-apis/deleteGitPlatform";
import {getCurrentUser} from "../../utils/sessionstorageClient";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {DeleteGitPlatform} from "./delete-git-platform";

export const GitPlatforms = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const listGitPlatformsData = useAppSelector(selectListGitPlatformsData);
    const [payload, setPayload] = useState({
        isDeleteGitPlatformDialogOpen: false,
        currentGitPlatform: {} as GitPlatformDTO
    });

    useEffect(() => {
        const listGitPlatformsRequest: ListGitPlatformsRequest = {
            email: getCurrentUser()
        };
        dispatch(listGitPlatformsAsync(listGitPlatformsRequest));
    }, [dispatch]);

    const handleNewClick = () => {
        navigate('/git-platforms/new');
    };

    const handleDeleteClick = (gitPlatformDTO: GitPlatformDTO) => {
        setPayload({
            ...payload,
            currentGitPlatform: gitPlatformDTO,
            isDeleteGitPlatformDialogOpen: !payload.isDeleteGitPlatformDialogOpen
        });
    };

    const handleDeleteGitPlatform = () => {
        const deleteGitPlatformRequest: DeleteGitPlatformRequest = {
            email: getCurrentUser(),
            name: payload.currentGitPlatform.name
        };
        dispatch(deleteGitPlatformAsync(deleteGitPlatformRequest));
        setPayload({
            ...payload,
            currentGitPlatform: {} as GitPlatformDTO,
            isDeleteGitPlatformDialogOpen: !payload.isDeleteGitPlatformDialogOpen
        });
    };

    const onDeleteGitPlatformClose = () => {
        setPayload({
            ...payload,
            currentGitPlatform: {} as GitPlatformDTO,
            isDeleteGitPlatformDialogOpen: !payload.isDeleteGitPlatformDialogOpen
        });
    };

    const getActionButtons = (gitPlatform: GitPlatformDTO): React.ReactNode => {
        return <Stack direction="row" spacing="3">
            <Button variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteClick(gitPlatform);
                    }}>
                <DeleteOutlineIcon/>
            </Button>
        </Stack>;
    };

    return <Container>
        {payload.isDeleteGitPlatformDialogOpen && (
            <DeleteGitPlatform isOpen={payload.isDeleteGitPlatformDialogOpen}
                               gitPlatform={payload.currentGitPlatform}
                               onDeleteGitPlatformClose={onDeleteGitPlatformClose}
                               handleDeleteGitPlatform={handleDeleteGitPlatform}/>
        )}
        <Typography variant="h4">Git Platforms</Typography>
        <hr/>
        <Button variant="outlined"
                onClick={handleNewClick}>
            Add new GitPlatform
        </Button>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Username</TableCell>
                        <TableCell align="right">OwnerEmail</TableCell>
                        <TableCell align="right">Url</TableCell>
                        <TableCell align="right">Personal Access Token</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listGitPlatformsData.map((gitPlatformDTO: GitPlatformDTO) => (
                        <TableRow
                            key={gitPlatformDTO.name}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {gitPlatformDTO.name}
                            </TableCell>
                            <TableCell align="right">{gitPlatformDTO.userName}</TableCell>
                            <TableCell align="right">{gitPlatformDTO.ownerEmail}</TableCell>
                            <TableCell align="right">{gitPlatformDTO.url}</TableCell>
                            <TableCell align="right">{gitPlatformDTO.personalAccessToken}</TableCell>
                            <TableCell align="right">{getActionButtons(gitPlatformDTO)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>;
};
