import authReducer, {GitPlatformState} from './slice';
import {GitPlatformDTO} from "./model";

describe('git-platform reducer', () => {
    const initialState: GitPlatformState = {
        createGitPlatform: {
            data: {} as GitPlatformDTO,
            status: 'idle',
            error: null
        },
        listGitPlatforms: {
            data: [] as GitPlatformDTO[],
            status: 'idle',
            error: null
        },
        updateGitPlatform: {
            data: {},
            status: 'idle',
            error: null
        },
        deleteGitPlatform: {
            data: {},
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
