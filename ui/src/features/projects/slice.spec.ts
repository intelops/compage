import projectsReducer, {ProjectState} from './slice';

describe('projects reducer', () => {
    const initialState: ProjectState = {
        updateProject: {
            data: {},
            status: 'idle',
            error: null
        },
        getProject: {
            data: {},
            status: 'idle',
            error: null
        },
        listProjects: {
            data: [],
            status: 'idle',
            error: null
        },
        createProject: {
            data: {},
            status: 'idle',
            error: null
        },
    };

    it('should handle initial state', () => {
        expect(projectsReducer(undefined, {type: 'unknown'})).toEqual({
            updateProject: {
                data: {},
                status: 'idle',
                error: null
            },
            getProject: {
                data: {},
                status: 'idle',
                error: null
            },
            listProjects: {
                data: [],
                status: 'idle',
                error: null
            },
            createProject: {
                data: {},
                status: 'idle',
                error: null
            },
        });
    });
});
