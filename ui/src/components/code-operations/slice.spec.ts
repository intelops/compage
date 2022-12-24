import generateCodeReducer, {GenerateCodeState,} from './slice';

describe('counter reducer', () => {
    const initialState: GenerateCodeState = {
        data: {
            projectId: "",
            error: "",
            message: "",
            userName: ""
        },
        status: 'idle',
        error: null
    };

    it('should handle initial state', () => {
        expect(generateCodeReducer(undefined, {type: 'unknown'})).toEqual({
            data: {
                "name": "",
                "fileChunk": undefined
            },
            status: 'idle',
            error: null
        });
    });
});
