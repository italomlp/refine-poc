import React from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  GridTypeMap,
  InputLabel,
  NativeSelect,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useForm } from '@pankod/refine-react-hook-form';

export enum InputTypes {
  TEXT,
  SELECT,
}

type BaseInputFormType = {
  type: InputTypes;
  name: string;
  label: string;
  containerProps?: GridTypeMap;
};

type TextInputFormType = BaseInputFormType & {
  type: InputTypes.TEXT;
  inputProps?: TextFieldProps;
};

type SelectInputFormType = BaseInputFormType & {
  type: InputTypes.SELECT;
  defaultValue: string;
  options: {
    key: string;
    value: string;
    label: string;
  }[];
};

function isTextInputFormType(
  input: BaseInputFormType
): input is TextInputFormType {
  return input.type === InputTypes.TEXT;
}

function isSelectInputFormType(
  input: BaseInputFormType
): input is SelectInputFormType {
  return input.type === InputTypes.SELECT;
}

type Props = {
  inputs: (TextInputFormType | SelectInputFormType)[][];
};

export default function FormBasicPage({ inputs }: Props) {
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Card
      component="form"
      onSubmit={handleSubmit(onFinish)}
      sx={{ minWidth: 275 }}
    >
      <CardContent>
        <Grid container spacing={3}>
          {inputs.map((inputsRow, index) => (
            <Grid
              item
              container
              flexDirection={{ xs: 'column', md: 'row' }}
              spacing={2}
              key={`inputs-row-${index}`}
            >
              {inputsRow.map(input => {
                if (isTextInputFormType(input)) {
                  return (
                    <Grid
                      item
                      key={input.name}
                      xs
                      {...(input.containerProps || {})}
                    >
                      <TextField
                        {...register(input.name, { required: true })}
                        fullWidth
                        variant="standard"
                        type="text"
                        label={input.label}
                        id={input.name}
                        error={!!errors[input.name]}
                        helperText={
                          errors[input.name] && 'This field is required'
                        }
                      />
                    </Grid>
                  );
                }
                if (isSelectInputFormType(input)) {
                  const selectId = `${input.name}-select`;
                  return (
                    <Grid
                      item
                      key={input.name}
                      xs
                      {...(input.containerProps || {})}
                    >
                      <FormControl fullWidth>
                        <InputLabel
                          variant="standard"
                          htmlFor={selectId}
                          shrink
                        >
                          {input.label}
                        </InputLabel>
                        <NativeSelect
                          defaultValue={input.defaultValue}
                          inputProps={{
                            ...register(input.name),
                            id: selectId,
                          }}
                        >
                          {input.options.map(option => (
                            <option key={option.key} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                      {errors[input.name] && (
                        <p className="mt-1 text-sm text-red-600">
                          <span className="font-medium">Oops!</span> This field
                          is required
                        </p>
                      )}
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <CardActions>
        <Button type="submit">
          {formLoading ? <CircularProgress /> : 'Save'}
        </Button>
      </CardActions>
    </Card>
  );
}
