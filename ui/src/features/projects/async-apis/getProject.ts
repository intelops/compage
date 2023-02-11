import {createAsyncThunk} from "@reduxjs/toolkit";
import {GetProjectError, GetProjectRequest, UploadYamlResponse} from "../model";
import {getProject} from "../api";
import {toastr} from 'react-redux-toastr';
import {setCurrentConfig, setCurrentProject, setCurrentState} from "../../../utils/localstorage-client";
import {updateModifiedState} from "../populateModifiedState";

export const getProjectAsync = createAsyncThunk<UploadYamlResponse, GetProjectRequest, { rejectValue: GetProjectError }>(
    'projects/getProject',
    async (getProjectRequest: GetProjectRequest, thunkApi) => {
        return getProject(getProjectRequest).then(response => {
            if (response.status !== 200) {
                const msg = `Failed to retrieve project.`;
                const errorMessage = `Status: ${response.status}, Message: ${msg}`;
                console.log(errorMessage);
                toastr.error(`getProject [Failure]`, errorMessage);
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const message = `Successfully retrieved project.`;
            console.log(message);
            toastr.success(`getProject [Success]`, message);
            const getProjectResponse: UploadYamlResponse = response.data;
            // update details to localstorage client
            setCurrentConfig(getProjectResponse.json);
            setCurrentState(getProjectResponse.json);
            setCurrentProject(getProjectResponse.id, getProjectResponse.version);
            // set the modified state when the project is fetched. This is required when user logged out after adding
            // properties to nodes and edges. After re-login, the modified state is lost and user can't see props
            // added to nodes and edges.
            updateModifiedState(getProjectResponse);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`getProject [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);