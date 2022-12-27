import projectsReducer, {ProjectState} from './slice';

describe('projects reducer', () => {
    const initialState: ProjectState = {
        getProjectData: {},
        listProjectsData: [],
        createProjectData: {},
        status: 'idle',
        error: null
    };

    it('should handle initial state', () => {
        expect(projectsReducer(undefined, {type: 'unknown'})).toEqual({
            getProjectData: {},
            listProjectsData: [],
            createProjectData: {},
            status: 'idle',
            error: null
        });
    });
});
