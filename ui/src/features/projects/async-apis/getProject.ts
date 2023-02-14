import {createAsyncThunk} from "@reduxjs/toolkit";
import {GetProjectError, GetProjectRequest, GetProjectResponse} from "../model";
import {getProject} from "../api";
import {toastr} from 'react-redux-toastr';
import {setCurrentConfig, setCurrentProjectDetails, setCurrentState} from "../../../utils/localstorage-client";
import {updateModifiedState} from "../populateModifiedState";

export const getProjectAsync = createAsyncThunk<GetProjectResponse, GetProjectRequest, { rejectValue: GetProjectError }>(
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
            const getProjectResponse: GetProjectResponse = response.data;
            // update details to localstorage client
            setCurrentConfig(getProjectResponse.json);
            setCurrentState(getProjectResponse.json);
            setCurrentProjectDetails(getProjectResponse.id, getProjectResponse.version, getProjectResponse.repository.name);
            // set the modified state when the project is fetched. This is required when user logged out after adding
            // properties to nodes and edges. After re-login, the modified state is lost and user can't see props
            // added to nodes and edges.
            updateModifiedState(getProjectResponse.json);
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