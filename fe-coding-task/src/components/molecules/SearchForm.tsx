import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { SearchOptions, searchOptions } from "./searchOptions";

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
  const [selected, setSelected] = useState<SearchOptions[]>(
    searchOptions.filter((item) =>
      initialValues.quarters.split(",").includes(item.value)
    ) || []
  );
  const [houseType, setHouseType] = useState<string>(initialValues.houseType);
  const [error, setError] = useState<string | null>(null);
  const { handleSubmit } = useForm<FormValues>();

  const onSubmit = () => {
    if (houseType && selected.length > 0) {
      setError(null);

      onFormSubmit({
        houseType,
        quarters: selected.map((item) => item.value).join(","),
      });
    } else {
      setError("Provide some values for searching");
    }
  };

  return (
    <Box mt={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Autocomplete
          multiple
          renderInput={(params) => (
            <TextField
              variant="outlined"
              label="Quartals"
              {...params}
              sx={{ width: "400px" }}
            />
          )}
          options={searchOptions}
          onChange={(_, newValue) => {
            setSelected(newValue);
          }}
          value={selected}
        />

        <Autocomplete
          renderInput={(params) => (
            <TextField
              label="House Type"
              margin="normal"
              variant="outlined"
              {...params}
            />
          )}
          options={["00", "01", "02"]}
          fullWidth
          onChange={(_, newValue) => {
            if (newValue) {
              setHouseType(newValue);
            }
          }}
          value={houseType}
        />

        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>
    </Box>
  );
};
