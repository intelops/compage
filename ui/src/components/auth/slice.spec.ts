import authReducer, {AuthState} from './slice';

describe('auth reducer', () => {
    const initialState: AuthState = {
        data: [],
        status: 'idle',
        error: null
    };

    it('should handle initial state', () => {
        expect(authReducer(undefined, {type: 'unknown'})).toEqual({
            data: [],
            status: 'idle',
            error: null
        });
    });
});
