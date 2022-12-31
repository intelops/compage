import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreateProjectError, CreateProjectRequest, CreateProjectResponse} from "../model";
import {createProject} from "../api";
import {toastr} from 'react-redux-toastr'
import {CurrentProjectContext} from "../../../components/diagram-maker/models";
import {getCurrentProjectContext, setCurrentProjectContext} from "../../../utils/localstorage-client";

export const createProjectAsync = createAsyncThunk<CreateProjectResponse, CreateProjectRequest, { rejectValue: CreateProjectError }>(
    'projects/createProject',
    async (createProjectRequest: CreateProjectRequest, thunkApi) => {
        return createProject(createProjectRequest).then(response => {
            if (response.status !== 200) {
                const msg = `Failed to create project.`;
                const errorMessage = `Status: ${response.status}, Message: ${msg}`;
                console.log(errorMessage);
                toastr.error(`createProject [Failure]`, errorMessage);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const createProjectResponse: CreateProjectResponse = response.data;
            // update details to localstorage client
            const currentProjectContext: CurrentProjectContext = getCurrentProjectContext();
            // TODO pass json as string throughout - trying
            if (currentProjectContext) {
                currentProjectContext.projectId = createProjectResponse.projectId;
                currentProjectContext.state = createProjectRequest.json;
                setCurrentProjectContext(currentProjectContext)
            } else {
                const newCurrentProjectContext = {
                    projectId: createProjectResponse.projectId,
                    state: createProjectRequest.json
                };
                setCurrentProjectContext(newCurrentProjectContext)
            }
            const message = `Successfully created project: ${createProjectRequest.displayName}[${createProjectResponse.projectId}]`;
            console.log(message);
            toastr.success(`createProject [Success]`, message);
            return response.data;
        }).catch(e => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`createProject [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        })
    }
);
