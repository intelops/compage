import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {listGitPlatformsAsync} from "./async-apis/list-git-platforms";
import {ListGitPlatformsRequest} from "./model";
import {selectListGitPlatformsData} from "./slice";

export const ListGitPlatforms = () => {
    const listGitPlatformsData = useAppSelector(selectListGitPlatformsData);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const listGitPlatformsRequest: ListGitPlatformsRequest = {
            email: "mahendra.b@intelops.dev"
        };
        dispatch(listGitPlatformsAsync(listGitPlatformsRequest));
    }, []);
    const listGitPlatformItems = listGitPlatformsData && listGitPlatformsData.gitPlatforms.map((d) =>
        <li key={d.name}>
            {d.name} | {d.url} | {d.token}
        </li>
    );
    return <>
        List of GitPlatforms :
        {
            listGitPlatformItems
        }
    </>;
};
