import projectsReducer, {ProjectState} from './slice';

describe('projects reducer', () => {
    const initialState: ProjectState = {
        data: [],
        status: 'idle',
        error: null
    };

    it('should handle initial state', () => {
        expect(projectsReducer(undefined, {type: 'unknown'})).toEqual({
            data: [],
            status: 'idle',
            error: null
        });
    });
});
