/**
 * these are the files now I am gonna list the bunch of requirements and the features of the form

1. each of the configuration of the template and the framework is dependent on the language selected.
2. REST Server has both the templates i.e compage and the openAPI but the grpcServer has only compage template.
3. What Frameworks we are gonna show in the Select component will be dependent  on the template and the language selected. use the respective functions to get the data to display.
4. If the template is compage we are gonna have the resources and they are **Independent** of the type of DB.
5. If the template is openAPI we are NOT gonna have the resources but instead of that we will have a file upload input.
6. Initially the resources are gonna be empty and we will have a button to add the resource and on click of that button we show the input fields to add the resource.
7. Each resource will have an input to add a name and will have an input to add attribute name and the type on adding the current attribute we shall enable them to add the another attribute and this is a recursive process.
 */
import { Button, Checkbox, Select, TextInput } from "@/components";
import SizedBox from "@/components/SizedBox/SizedBox";
import {
  MicroServiceServerType,
  MicroServiceSupportedLanguages,
  TMicroServiceNodeFormData,
} from "./Microservice.node.types";
import { useForm } from "react-hook-form";
import { INITIAL_FORM_VALUES, LANGUAGE_DATA } from "./data";
import { useEffect } from "react";
import {
  getFrameworkDataObject,
  getTemplateData,
} from "./MicroService.node.utils";

interface MicroServiceNodeFormProps {
  nodeId: string;
}
function generateIdForGivenNodeId(input: string, nodeId: string) {
  return `${input}-${nodeId}`;
}
export default function MicroServiceNodeForm(
  { nodeId }: MicroServiceNodeFormProps,
) {
  const {
    register,
    handleSubmit,
    formState,
    watch,
    unregister,
    getValues,
    getFieldState,
  } = useForm<TMicroServiceNodeFormData>({
    defaultValues: INITIAL_FORM_VALUES,
    mode: "all",
  });
  const watchLanguage = watch("language");
  const watchRestServerCheck = watch("restServer");
  const watchRestServerTemplate = watch("restServer.template");
  const { errors } = formState;

  const onSubmit = (_data: any) => {
    console.log(_data);
  };
  useEffect(() => {
    if (watchRestServerCheck) {
      register("restServer.port", {
        required: "This a required field",
      });
    } else {
      unregister("restServer.port");
    }
  }, [watchRestServerCheck, register, unregister]);
  const getFrameworkData = (serverType: MicroServiceServerType) => {
    getFrameworkDataObject;
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          register={register("name", {
            required: "This a required field",
          })}
          id="name"
          label="Name of the Component"
          errorMessage={errors["name"]?.message}
        />
        <Select
          register={register("language")}
          data={LANGUAGE_DATA}
          placeholderText="select a language"
        />
        <SizedBox
          vertical={20}
        />
        <Checkbox
          disabled={!watchLanguage}
          id={generateIdForGivenNodeId("isRestServer", nodeId)}
          label="REST server"
          register={register("restServer")}
        />
        {watchRestServerCheck && (
          <>
            <Select
              register={register("restServer.template")}
              data={getTemplateData(
                watchLanguage,
                MicroServiceServerType.RestServer,
              )}
              placeholderText="select a template"
            />
            <SizedBox vertical={20} />

            <TextInput
              type="number"
              id={generateIdForGivenNodeId("port", nodeId)}
              register={register("restServer.port", {})}
              label="Port"
              errorMessage={errors["restServer"]?.port?.message}
            />
          </>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            style={{
              alignSelf: "center",
            }}
            label="Submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
