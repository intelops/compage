import {ListGitPlatforms} from "./list-git-platforms";
import {CreateGitPlatform} from "./create-git-platform";
import {Stack} from "@mui/material";

export const GitPlatforms = () => {

    return <Stack direction="column" gap={3}>
        <ListGitPlatforms/>
        <CreateGitPlatform/>
    </Stack>;
}