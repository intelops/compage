import * as React from 'react';
import {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectListProjectsData} from "./slice";
import {ListProjectsRequest, ProjectDTO} from "./model";
import {getCurrentUser} from "../../utils/sessionstorageClient";
import {listProjectsAsync} from "./async-apis/listProjects";
import {Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Box from "@mui/material/Box";

export const Projects = () => {
    const listProjectsData = useAppSelector(selectListProjectsData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // dispatch listProjects
        const listProjectsRequest: ListProjectsRequest = {
            email: getCurrentUser()
        };
        dispatch(listProjectsAsync(listProjectsRequest));
    }, [dispatch]);

    return <>
        <Stack direction="column" spacing={2}>
            <Box sx={{flexGrow: 0}}>
                <TableContainer component={Paper}>
                    <Typography>List of Projects({getCurrentUser()})</Typography>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Repository URL</TableCell>
                                <TableCell align="right">Is Repository Public?</TableCell>
                                <TableCell align="right">Version</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listProjectsData.map((projectDTO: ProjectDTO) => (
                                <TableRow
                                    key={projectDTO.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        {projectDTO.id}
                                    </TableCell>
                                    <TableCell align="right">{projectDTO.displayName}</TableCell>
                                    <TableCell align="right">{projectDTO.repositoryUrl}</TableCell>
                                    <TableCell align="right">{projectDTO.isRepositoryPublic ? "Yes" : "No"}</TableCell>
                                    <TableCell align="right">{projectDTO.version}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Stack>
    </>;
};
