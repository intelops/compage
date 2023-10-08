import {GitPlatformEntity} from '../models/gitPlatform';

export interface GitPlatformDao {
    createGitPlatform(gitPlatformEntity: GitPlatformEntity): Promise<GitPlatformEntity>;

    listGitPlatforms(ownerEmail: string): Promise<GitPlatformEntity[]>;

    getGitPlatform(ownerEmail: string, name: string): Promise<GitPlatformEntity>;

    updateGitPlatform(ownerEmail: string, name: string, gitPlatformEntity: GitPlatformEntity): Promise<boolean>;

    deleteGitPlatform(ownerEmail: string, name: string): Promise<boolean>;
}