import React from "react";
import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import "react-datepicker/dist/react-datepicker.css";


export interface DatePickerFieldProps {
  label?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  onChange: (date: Date | null) => void;
  value: Date | null;
  [key: string]: any; // permite props adicionais se necessário
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  error,
  helperText,
  value,
  onChange,
  ...props
}) => {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      customInput={
        <TextField
          label={label}
          error={error}
          helperText={helperText}
          fullWidth
        />
      }
      dateFormat="dd/MM/yyyy"
      placeholderText="DD/MM/AAAA"
      {...props}
    />
  );
};

export default DatePickerField;
