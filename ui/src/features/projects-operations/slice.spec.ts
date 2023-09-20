import projectsReducer, {ProjectState} from './slice';
import {ProjectDTO} from "./model";

describe('projects reducer', () => {
    const initialState: ProjectState = {
        createProject: {
            data: {} as ProjectDTO,
            status: 'idle',
            error: null
        },
        listProjects: {
            data: [],
            status: 'idle',
            error: null
        },
        getProject: {
            data: {} as ProjectDTO,
            status: 'idle',
            error: null
        },
        existsProject: {
            data: {} as ProjectDTO,
            status: 'idle',
            error: null
        },
        updateProject: {
            data: {},
            status: 'idle',
            error: null
        },
        deleteProject: {
            data: {},
            status: 'idle',
            error: null
        },
    };

    it('should handle initial state', () => {
        expect(projectsReducer(undefined, {type: 'unknown'})).toEqual({
            createProject: {
                data: {},
                status: 'idle',
                error: null
            },
            listProjects: {
                data: [],
                status: 'idle',
                error: null
            },
            getProject: {
                data: {},
                status: 'idle',
                error: null
            },
            existsProject: {
                data: {},
                status: 'idle',
                error: null
            },
            updateProject: {
                data: {},
                status: 'idle',
                error: null
            },
            deleteProject: {
                data: {},
                status: 'idle',
                error: null
            },
        });
    });
});
