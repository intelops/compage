import authReducer, {UserState} from './slice';
import {UserDTO} from "./model";

describe('user reducer', () => {
    const initialState: UserState = {
        createUser: {
            data: {} as UserDTO,
            status: 'idle',
            error: null
        },
        listUsers: {
            data:[],
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
