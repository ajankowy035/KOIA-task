import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { getChartData } from "../../api";

interface FormValues {
  quarters: string;
  houseType: string;
}

type SearchFormParams = {
  onFormSubmit: (data: any) => void;
};

export const SearchForm: React.FC<SearchFormParams> = ({ onFormSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const chartData = await getChartData({
      houseType: data.houseType,
      quarters: data.quarters
        .toUpperCase()
        .replace(/\s+/g, "")
        .trim()
        .split(","),
    });
    onFormSubmit(chartData);
  };

  const validateQuarters = (value: string) => {
    const quartersArray = value.toUpperCase().trim().split(",");
    const isValid = quartersArray.every((quarter) =>
      /^\d{4}[Kk][1-4]$/.test(quarter.trim())
    );
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
        />
        <TextField
          {...register("houseType", { required: true })}
          label="House type"
          fullWidth
          margin="normal"
          variant="outlined"
          error={!!errors.houseType}
          helperText={errors.houseType ? "This field is required" : ""}
        />

        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>
    </Box>
  );
};
