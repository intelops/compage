import {createAsyncThunk} from "@reduxjs/toolkit";
import {GetProjectError, GetProjectRequest, ProjectDTO} from "../model";
import {getProject} from "../api";
import {toastr} from 'react-redux-toastr';
import {
    removeCurrentConfig,
    removeCurrentProjectDetails,
    removeCurrentState,
    removeModifiedState,
    setCurrentConfig,
    setCurrentProjectDetails,
    setCurrentState
} from "../../../utils/localstorageClient";
import {updateModifiedState} from "../populateModifiedState";

export const getProjectAsync = createAsyncThunk<ProjectDTO, GetProjectRequest, { rejectValue: GetProjectError }>(
    'projects/getProject',
    async (getProjectRequest: GetProjectRequest, thunkApi) => {
        return getProject(getProjectRequest).then(response => {
            if (response.status !== 200) {
                const errorDetails = `Failed to retrieve project.`;
                const errorMessage = `Status: ${response.status}, Message: ${errorDetails}`;
                console.log(errorMessage);
                toastr.error(`getProject [Failure]`, errorMessage);
                removeCurrentConfig();
                removeCurrentState();
                removeModifiedState();
                removeCurrentProjectDetails();
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const successDetails = `Successfully retrieved project.`;
            console.log(successDetails);
            toastr.success(`getProject [Success]`, successDetails);
            const projectDTO: ProjectDTO = response.data;
            // update details to localstorage client
            setCurrentConfig(projectDTO.json);
            setCurrentState(projectDTO.json);
            setCurrentProjectDetails(projectDTO.id, projectDTO.version, projectDTO.repositoryName);
            // set the modified state when the project is fetched. This is required when user logged out after adding
            // properties to nodes and edges. After re-login, the modified state is lost and user can't see props
            // added to nodes and edges.
            updateModifiedState(projectDTO.json);
            return response.data;
        }).catch((e: any) => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`getProject [Failure]`, errorMessage);
            removeCurrentProjectDetails();
            removeCurrentConfig();
            removeCurrentState();
            removeModifiedState();
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);