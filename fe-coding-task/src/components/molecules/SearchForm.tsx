import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";

interface FormValues {
  quarters: string;
  houseType: string;
}

export const SearchForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    // Handle form submission
    console.log({ provided: data });
  };

  return (
    <Box mt={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("quarters")}
          label="Quarters range"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          {...register("houseType")}
          label="House type"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>
    </Box>
  );
};
