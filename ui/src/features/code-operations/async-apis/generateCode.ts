import {createAsyncThunk} from "@reduxjs/toolkit";
import {GenerateCodeError, GenerateCodeRequest, GenerateCodeResponse} from "../model";
import {generateCode} from "../api";
import {toastr} from 'react-redux-toastr';
import {GetProjectRequest, GetProjectResponse} from "../../projects-operations/model";
import {getProject} from "../../projects-operations/api";
import {setCurrentConfig, setCurrentProjectDetails, setCurrentState} from "../../../utils/localstorageClient";
import {updateModifiedState} from "../../projects-operations/populateModifiedState";

export const generateCodeAsync = createAsyncThunk<GenerateCodeResponse, GenerateCodeRequest, {
    rejectValue: GenerateCodeError
}>(
    'code/generateCode',
    async (generateCodeRequest: GenerateCodeRequest, thunkApi) => {
        const retrieveProjectToUpdateState = (request: GenerateCodeRequest) => {
            const getProjectRequest: GetProjectRequest = {
                id: request.projectId,
                email: generateCodeRequest.email
            };
            getProject(getProjectRequest).then(getProjectResp => {
                if (getProjectResp.status !== 200) {
                    const detailedMessage = `Failed to retrieve project.`;
                    const errorMessage = `Status: ${getProjectResp.status}, Message: ${detailedMessage}`;
                    console.log(errorMessage);
                    toastr.error(`getProject [Failure]`, errorMessage);
                    return thunkApi.rejectWithValue({
                        message: errorMessage
                    });
                }
                const message = `Successfully retrieved project.`;
                console.log(message);
                toastr.success(`getProject [Success]`, message);
                const getProjectResponse: GetProjectResponse = getProjectResp.data;
                // update details to localstorage client
                setCurrentConfig(getProjectResponse.json);
                setCurrentState(getProjectResponse.json);
                setCurrentProjectDetails(getProjectResponse.id, getProjectResponse.version, getProjectResponse.repositoryName);
                // set the modified state when the project is fetched. This is required when user logged out after adding
                // properties to nodes and edges. After re-login, the modified state is lost and user can't see props
                // added to nodes and edges.
                updateModifiedState(getProjectResponse.json);
            }).catch((e: any) => {
                const statusCode = e.response.status;
                const message = e.response.data.message;
                const errorMessage = `Status: ${statusCode}, Message: ${message}`;
                console.log(errorMessage);
                toastr.error(`getProject [Failure]`, errorMessage);
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            });
        };
        return generateCode(generateCodeRequest).then(response => {
            // Check if status is not okay:
            if (response.status !== 200) {
                const failureMessage = `Failed to generate code for '${generateCodeRequest.projectId}'. Received: ${response.status}`;
                console.log(failureMessage);
                toastr.error(`generateCode [Failure]`, failureMessage);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: failureMessage
                });
            }
            const message = `Successfully generated code for '${generateCodeRequest.projectId}'`;
            console.log(message);
            toastr.success(`generateCode [Success]`, `${message}`);
            // the below function retrieves project and updates the store.
            retrieveProjectToUpdateState(generateCodeRequest);
            return response.data;
        }).catch((e: any) => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`generateCode [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);
