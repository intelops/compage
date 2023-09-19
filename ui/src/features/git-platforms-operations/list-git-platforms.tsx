import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {listGitPlatformsAsync} from "./async-apis/listGitPlatforms";
import {DeleteGitPlatformRequest, GitPlatformDTO, ListGitPlatformsRequest} from "./model";
import {selectListGitPlatformsData} from "./slice";
import {Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {deleteGitPlatformAsync} from "./async-apis/deleteGitPlatform";
import {getCurrentUser} from "../../utils/sessionstorageClient";

export const ListGitPlatforms = () => {
    const listGitPlatformsData = useAppSelector(selectListGitPlatformsData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const listGitPlatformsRequest: ListGitPlatformsRequest = {
            email: "mahendra.b@intelops.dev"
        };
        dispatch(listGitPlatformsAsync(listGitPlatformsRequest));
    }, [dispatch]);

    const handleEditClick = () => {
        console.log("Edit clicked");
    };

    const handleDeleteClick = (gitPlatformName: string) => {
        const deleteGitPlatformRequest: DeleteGitPlatformRequest = {
            email: getCurrentUser(),
            name: gitPlatformName
        }
        dispatch(deleteGitPlatformAsync(deleteGitPlatformRequest));
    };

    const getActionButtons = (gitPlatform: GitPlatformDTO): React.ReactNode => {
        return <Stack direction="row" gap="3">
            <Button variant="contained"
                    onClick={handleEditClick}>
                Edit
            </Button>
            <Button variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteClick(gitPlatform.name)
                    }}>
                Delete
            </Button>
        </Stack>;
    };

    return <>
        <TableContainer component={Paper}>
            <Typography>List of GitPlatforms</Typography>
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
                    {listGitPlatformsData.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.userName}</TableCell>
                            <TableCell align="right">{row.ownerEmail}</TableCell>
                            <TableCell align="right">{row.url}</TableCell>
                            <TableCell align="right">{row.personalAccessToken}</TableCell>
                            <TableCell align="right">{getActionButtons(row)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>;
};
