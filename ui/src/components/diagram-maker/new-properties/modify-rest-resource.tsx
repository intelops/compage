import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {
  Alert,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, { ChangeEvent, useState } from "react";
import { Resource } from "../models";
import TextField from "@mui/material/TextField";
import { sanitizeString } from "../../../utils/backend-api";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface ModifyRestResourceProperties {
  isOpen: boolean;
  onModifyRestResourceClose: () => void;
  handleModifyRestResourceClick: (resource: Resource) => void;
  resource: Resource;
  nodeId: string;
}

export const ModifyRestResource = (props: ModifyRestResourceProperties) => {
  // Datatypes available in Golang
  const dataTypes = {
    int: [
      "int8",
      "int16",
      "int32",
      "int64",
      "uint8",
      "uint16",
      "uint32",
      "uint64",
      "int",
      "uint",
      "rune",
      "byte",
      "uintptr",
    ],
    float: ["float32", "float64 "],
    complex: ["complex64", "complex128"],
    bool: ["bool"],
    string: ["string"],
  };

  const [data, setData] = useState({
    name: props.resource?.name || "",
    fields: JSON.stringify(props.resource?.fields) || "",
  });

  //   Dynamic Input fields
  const [inputFields, setInputFields] = useState([
    { id: crypto.randomUUID(), fieldName: "", fieldValue: "" },
  ]);

  // Field Name State
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  // Alert add button
  const [alert, setAlert] = useState(false);

  // first letter of the Resource should always be capital.
  const capitalizeFirstLetter = (input: string) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };

  const handleNameChange = (
    event: ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setData({
      ...data,
      name: sanitizeString(capitalizeFirstLetter(event.target.value)),
    });
  };

  const onClose = (e: any, reason: "backdropClick" | "escapeKeyDown") => {
    // this prevents dialog box from closing.
    if (reason === "backdropClick") {
      return;
    }
    props.onModifyRestResourceClose();
  };

  const handleAddButton = (index: number) => {
    inputFields[index].fieldName = fieldName;
    inputFields[index].fieldValue = fieldValue;
    setFieldName("");
    setFieldValue("");
    setInputFields([
      ...inputFields,
      {
        id: crypto.randomUUID(),
        fieldName: "",
        fieldValue: "",
      },
    ]);
  };

  const handleRemoveButton = (id: string) => {
    console.log(id, "inside handleRemoveButton");
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
  };

  const handleModifyRestResourceClick = () => {
    let fieldsToJson = {};
    if (fieldName === "" || fieldValue === "") {
      for (var i = 0; i < inputFields.length - 1; i++) {
        fieldsToJson[inputFields[i].fieldName] = inputFields[i].fieldValue;
      }
    } else {
      inputFields.forEach((field) => {
        if (field.fieldName !== "" && field.fieldValue !== "") {
          fieldsToJson[field.fieldName] = field.fieldValue;
        } else {
          let temp = {};
          temp[fieldName] = fieldValue;
          fieldsToJson = {
            ...fieldsToJson,
            ...temp,
          };
        }
      });
    }
    data.fields = JSON.stringify(fieldsToJson);
    const resource: Resource = {
      fields: JSON.parse(data.fields),
      name: data.name,
    };
    // console.log(resource);
    props.handleModifyRestResourceClick(resource);
    setData({
      ...data,
      fields: "",
      name: "",
    });
    // console.log(fieldsToJson);
    console.log(data);
  };

  const handleSelectField = (event: SelectChangeEvent) => {
    setFieldValue(event.target.value);
  };

  console.log(data.fields, fieldValue);

  return (
    <React.Fragment>
      <Dialog open={props.isOpen} onClose={onClose}>
        <DialogTitle>
          Modify [REST Server] resource : {props.nodeId}
        </DialogTitle>
        <Divider />
        <DialogContent
          style={{
            height: "500px",
            width: "450px",
          }}
        >
          <Stack direction="column" spacing={2}>
            <TextField
              required
              size="medium"
              margin="dense"
              id="name"
              label="Name"
              type="text"
              value={data.name}
              onChange={handleNameChange}
              variant="outlined"
            />
            <Stack direction="column" spacing={1}>
              {inputFields.map((field, index) => {
                return (
                  <Stack
                    key={field.id}
                    direction="row"
                    alignItems={"center"}
                    spacing={1}
                  >
                    <TextField
                      required
                      size="medium"
                      margin="dense"
                      id="fieldname"
                      label="Attribute"
                      type="text"
                      value={
                        field.fieldName === "" ? fieldName : field.fieldName
                      }
                      onChange={(e) => {
                        setFieldName(e.target.value);
                      }}
                      variant="outlined"
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-filled-label">
                        Data Type
                      </InputLabel>
                      <Select
                        native
                        labelId="demo-simple-select-filled-label"
                        defaultValue=""
                        id="grouped-select"
                        label="Data Type"
                        onChange={handleSelectField}
                      >
                        <option aria-label="None" value="" disabled hidden />
                        {Object.keys(dataTypes).map((dt, k) => {
                          return (
                            <optgroup label={dt} key={k}>
                              {dataTypes[dt].map((type: string, i: number) => (
                                <option value={type} key={k + i}>
                                  {type}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <Button
                      disabled={
                        field.fieldName !== "" &&
                        field.fieldValue !== "" &&
                        inputFields.length > 1
                          ? true
                          : fieldName === "" && fieldValue === ""
                          ? true
                          : false
                      }
                      onClick={() => {
                        if (fieldName && fieldValue) {
                          handleAddButton(index);
                        } else {
                          setAlert(true);
                        }
                      }}
                    >
                      <AddIcon />
                    </Button>
                    <Button
                      disabled={
                        inputFields.length === 1 ||
                        inputFields.length - 1 === index
                      }
                      onClick={(e) => {
                        handleRemoveButton(field.id);
                        console.log(inputFields);
                      }}
                    >
                      <RemoveIcon />
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={props.onModifyRestResourceClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={data.name === ""}
            onClick={handleModifyRestResourceClick}
          >
            Modify Resource
          </Button>
        </DialogActions>
        <Snackbar open={alert} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="warning"
            sx={{ width: "100%" }}
          >
            Please Enter the details to proceed next!
          </Alert>
        </Snackbar>
      </Dialog>
    </React.Fragment>
  );
};
