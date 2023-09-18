import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {listGitPlatformsAsync} from "./async-apis/list-git-platforms";
import {ListGitPlatformsRequest} from "./model";
import {selectListGitPlatformsData} from "./slice";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export const ListGitPlatforms = () => {
    const listGitPlatformsData = useAppSelector(selectListGitPlatformsData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const listGitPlatformsRequest: ListGitPlatformsRequest = {
            email: "mahendra.b@intelops.dev"
        };
        dispatch(listGitPlatformsAsync(listGitPlatformsRequest));
    }, []);

    return <>
        <TableContainer component={Paper}>
            <TableHead>List of GitPlatforms</TableHead>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Username</TableCell>
                        <TableCell align="right">OwnerEmail</TableCell>
                        <TableCell align="right">Url</TableCell>
                        <TableCell align="right">Personal Access Token</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listGitPlatformsData.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.userName}</TableCell>
                            <TableCell align="right">{row.ownerEmail}</TableCell>
                            <TableCell align="right">{row.url}</TableCell>
                            <TableCell align="right">{row.personalAccessToken}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>;
};
