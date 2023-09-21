import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {listUsersAsync} from "./async-apis/listUsers";
import {ListUsersRequest, UserDTO} from "./model";
import {selectListUsersData} from "./slice";

export const ListUsers = () => {
    const dispatch = useAppDispatch();
    const listUsersData = useAppSelector(selectListUsersData);

    useEffect(() => {
        const listUsersRequest: ListUsersRequest = {
            email: "mahendra.b@intelops.dev"
        };
        dispatch(listUsersAsync(listUsersRequest));
    }, []);

    const listUserItems = listUsersData && listUsersData.map((userDTO: UserDTO) =>
        <li key={userDTO.email}>
            {userDTO.firstName} | {userDTO.lastName} | {userDTO.role} | {userDTO.email}
        </li>
    );
    return <>
        List of Users :
        {
            listUserItems
        }
    </>;
};
