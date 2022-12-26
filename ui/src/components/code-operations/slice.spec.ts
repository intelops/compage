import codeOperationsReducer, {CodeOperationsState,} from './slice';

describe('codeOperations reducer', () => {
    const initialState: CodeOperationsState = {
        data: [],
        status: 'idle',
        error: null
    };

    it('should handle initial state', () => {
        expect(codeOperationsReducer(undefined, {type: 'unknown'})).toEqual({
            data: [],
            status: 'idle',
            error: null
        });
    });
});
