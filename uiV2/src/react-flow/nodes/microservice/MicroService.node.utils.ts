import {
  MicroServiceDatabaseId,
  MicroServiceFramework,
  MicroServiceFrameworkId,
  MicroServiceLanguageId,
  MicroServiceServerType,
  MicroServiceTemplate,
  MicroServiceTemplateId,
} from "./Microservice.node.types";
import {
  formData,
  FRAMEWORK_DATA,
  NO_SQL_DATABASE_DATA,
  SQL_DATABASE_DATA,
  TEMPLATE_DATA,
} from "./data";

export const getSQLDatabaseObjectGivenId = (id: MicroServiceDatabaseId) => {
  return SQL_DATABASE_DATA.find((db) => db.id === id);
};

export const getNoSQLDatabaseObjectGivenId = (id: MicroServiceDatabaseId) => {
  return NO_SQL_DATABASE_DATA
    .find(
      (db) => db.id === id,
    );
};

export const getFrameworkDataObject = (
  id: MicroServiceFrameworkId[],
) => {
  return FRAMEWORK_DATA.filter((db) => id.includes(db.id));
};
export const getTemplateDataObject = (
  ids: MicroServiceTemplateId[],
) => {
  return TEMPLATE_DATA.filter((template) => ids.includes(template.id));
};

export const getTemplateData = (
  languageId: MicroServiceLanguageId,
  server: MicroServiceServerType,
) => {
  const language = formData.language[languageId];
  const serverData = language[server];
  const templateIds = serverData.templates.map((template) => template.id);
  return getTemplateDataObject(templateIds);
};

export const getFrameworkData = (
  serverId: MicroServiceServerType,
  languageId: MicroServiceLanguageId,
  templateId: MicroServiceTemplateId,
) => {
  const language = formData.language[languageId];
  const serverData = language[serverId];
  if (serverData.templates.length === 0) return [];
  const template = serverData.templates.find(
    (template) => template.id === templateId,
  );
  if (!template) return [];
  const frameworkIds = template.supportedFrameworks;

  return getFrameworkDataObject(frameworkIds);
};
