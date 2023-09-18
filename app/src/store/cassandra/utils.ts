import {ProjectEntity} from "../../models/project";

const lengthOfChars = 5;

const containsSpecialChars = (character: string) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?~]/;
    return specialChars.test(character);
};

const getSanitizedName = (name: string) => {
    const sanitizedName = name.substring(0, lengthOfChars);
    // check if last char is non-alphanumeric
    const lastCharacter = sanitizedName.charAt(sanitizedName.length - 1);
    if (containsSpecialChars(lastCharacter)) {
        // remove last character in sanitizedUserName.
        const slicedSanitizedName = name.slice(0, sanitizedName.length - 1);
        // append x to make it 5 characters string.
        return slicedSanitizedName + 'x';
    }
    return sanitizedName;
};

// generateProjectId generates unique id for project.
export const generateProjectId = (projectEntity: ProjectEntity) => {
    const userName = projectEntity.git_platform_user_name;
    const projectName = projectEntity.display_name;
    // truncate userName if its length is greater than 5
    let sanitizedUserName = userName;
    if (userName.length > lengthOfChars) {
        sanitizedUserName = getSanitizedName(userName);
    }

    // truncate projectResourceSpec.name if its length is greater than 5
    let sanitizedProjectName;
    if (projectName.length > lengthOfChars) {
        sanitizedProjectName = getSanitizedName(projectName);
    } else {
        let appended = '';
        const count = lengthOfChars - projectName.length;
        for (let i = 0; i < count; i++) {
            appended += 'x';
        }
        sanitizedProjectName = getSanitizedName(projectName) + appended;
    }

    return sanitizedUserName.toLowerCase() + '-' + sanitizedProjectName.toLowerCase() + '-' + (Math.floor(Math.random() * 90000) + 10000);
};
