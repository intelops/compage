import authReducer, {GitPlatformState} from './slice';

describe('git-platform reducer', () => {
    const initialState: GitPlatformState = {
        createGitPlatform: {
            data: {
                email: '',
                gitPlatforms: []
            },
            status: 'idle',
            error: null
        },
        listGitPlatforms: {
            data: {
                gitPlatforms: []
            },
            status: 'idle',
            error: null
        }
    };

    it('should handle initial state', () => {
        expect(authReducer(undefined, {type: 'unknown'})).toEqual({
            data: [],
            status: 'idle',
            error: null
        });
    });
});
