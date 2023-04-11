import k8sOperationsReducer, {K8sOperationsState} from './slice';

describe('k8sOperations reducer', () => {
    const initialState: K8sOperationsState = {
        getCurrentContext: {
            data: {},
            status: 'idle',
            error: null
        }
    };

    it('should handle initial state', () => {
        expect(k8sOperationsReducer(undefined, {type: 'unknown'})).toEqual({
            getCurrentContext: {
                data: {},
                status: 'idle',
                error: null
            }
        });
    });
});
