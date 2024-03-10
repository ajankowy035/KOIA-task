import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";

interface FormValues {
  quarters: string;
  houseType: string;
}

type SearchFormParams = {
  onFormSubmit: (data: { quarters: string; houseType: string }) => void;
  initialValues: { quarters: string; houseType: string };
};

export const SearchForm: React.FC<SearchFormParams> = ({
  onFormSubmit,
  initialValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    onFormSubmit(data);
  };

  const validateQuarters = (value: string) => {
    const quartersArray = value.split(",");
    const isValid = quartersArray.every((quarter) => {
      const [year] = quarter.trim().split("K");
      const isValidFormat = /^\d{4}[Kk][1-4]$/.test(quarter.trim());
      const isValidYear = parseInt(year) >= 2009;
      return isValidFormat && isValidYear;
    });
    return isValid || "Invalid quarters format";
  };

  return (
    <Box mt={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("quarters", {
            required: true,
            validate: validateQuarters,
          })}
          label="Quarters range"
          fullWidth
          margin="normal"
          variant="outlined"
          error={!!errors.quarters}
          helperText={errors.quarters ? errors.quarters.message : ""}
          defaultValue={initialValues.quarters}
        />
        <TextField
          {...register("houseType", { required: true })}
          label="House type"
          fullWidth
          margin="normal"
          variant="outlined"
          error={!!errors.houseType}
          helperText={errors.houseType ? "This field is required" : ""}
          defaultValue={initialValues.houseType}
        />

        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>
    </Box>
  );
};
