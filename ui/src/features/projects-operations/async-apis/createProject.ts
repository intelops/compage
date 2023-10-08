import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreateProjectError, CreateProjectRequest, ProjectDTO} from "../model";
import {createProject} from "../api";
import {toastr} from 'react-redux-toastr';
import {setCurrentConfig, setCurrentProjectDetails, setCurrentState} from "../../../utils/localstorageClient";
import {refreshProjectsList} from "./refresh";

export const createProjectAsync = createAsyncThunk<ProjectDTO, CreateProjectRequest, { rejectValue: CreateProjectError }>(
    'projects/createProject',
    async (createProjectRequest: CreateProjectRequest, thunkApi) => {
        return createProject(createProjectRequest).then(response => {
            if (response.status !== 201) {
                const details = `Failed to create project.`;
                const errorMessage = `Status: ${response.status}, Message: ${details}`;
                console.log(errorMessage);
                toastr.error(`createProject [Failure]`, errorMessage);
                // Return the error message:
                return thunkApi.rejectWithValue({
                    message: errorMessage
                });
            }
            const projectDTO: ProjectDTO = response.data;
            // update details to localstorage client
            setCurrentProjectDetails(projectDTO.id, projectDTO.version, projectDTO.repositoryName);
            setCurrentConfig(projectDTO.json);
            setCurrentState(projectDTO.json);
            const successMessage = `Successfully created project: ${createProjectRequest.displayName}[${projectDTO.id}]`;
            console.log(successMessage);
            toastr.success(`createProject [Success]`, successMessage);
            // refresh the list of Projects
            thunkApi.dispatch(refreshProjectsList());
            return response.data;
        }).catch((e:any) => {
            const statusCode = e.response.status;
            const message = e.response.data.message;
            const errorMessage = `Status: ${statusCode}, Message: ${message}`;
            console.log(errorMessage);
            toastr.error(`createProject [Failure]`, errorMessage);
            return thunkApi.rejectWithValue({
                message: errorMessage
            });
        });
    }
);
