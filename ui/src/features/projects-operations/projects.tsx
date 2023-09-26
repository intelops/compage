import * as React from 'react';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectListProjectsData} from "./slice";
import {DeleteProjectRequest, ListProjectsRequest, ProjectDTO} from "./model";
import {getCurrentUser} from "../../utils/sessionstorageClient";
import {listProjectsAsync} from "./async-apis/listProjects";
import {Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Button from "@mui/material/Button";
import {deleteProjectAsync} from "./async-apis/deleteProject";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {DeleteProject} from "./delete-project";

export const Projects = () => {
    const dispatch = useAppDispatch();
    const listProjectsData = useAppSelector(selectListProjectsData);
    const [payload, setPayload] = useState({
        isDeleteProjectDialogOpen: false,
        currentProject: {} as ProjectDTO
    });
    useEffect(() => {
        // dispatch listProjects
        const listProjectsRequest: ListProjectsRequest = {
            email: getCurrentUser()
        };
        dispatch(listProjectsAsync(listProjectsRequest));
    }, [dispatch]);

    const handleDeleteProject = () => {
        const deleteProjectRequest: DeleteProjectRequest = {
            email: getCurrentUser(),
            id: payload.currentProject.id
        };
        dispatch(deleteProjectAsync(deleteProjectRequest));
        setPayload({
            ...payload,
            currentProject: {} as ProjectDTO,
            isDeleteProjectDialogOpen: !payload.isDeleteProjectDialogOpen
        });
    };

    const onDeleteProjectClose = () => {
        setPayload({
            ...payload,
            currentProject: {} as ProjectDTO,
            isDeleteProjectDialogOpen: !payload.isDeleteProjectDialogOpen
        });
    };

    const handleDeleteClick = (projectDTO: ProjectDTO) => {
        setPayload({
            ...payload,
            currentProject: projectDTO,
            isDeleteProjectDialogOpen: !payload.isDeleteProjectDialogOpen
        });
    };

    const getActionButtons = (projectDTO: ProjectDTO): React.ReactNode => {
        return <Stack direction="row" spacing="3">
            <Button variant="contained"
                    color="error"
                    onClick={() => {
                        handleDeleteClick(projectDTO);
                    }}>
                <DeleteOutlineIcon/>
            </Button>
        </Stack>;
    };

    return <Container>
        {payload.isDeleteProjectDialogOpen && (
            <DeleteProject isOpen={payload.isDeleteProjectDialogOpen}
                           project={payload.currentProject}
                           onDeleteProjectClose={onDeleteProjectClose}
                           handleDeleteProject={handleDeleteProject}/>
        )}
        <Typography variant="h4">Projects</Typography>
        <hr/>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Repository URL</TableCell>
                        <TableCell align="right">Is Repository Public?</TableCell>
                        <TableCell align="right">Version</TableCell>
                        <TableCell align="right">Actions</TableCell>
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
                            <TableCell align="right">{getActionButtons(projectDTO)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>;
};

