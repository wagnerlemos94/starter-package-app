import { TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { useWebMask, createDefaultMaskGenerator } from "react-hook-mask";

type MaskedTextFieldProps = TextFieldProps & {
  mask?: string;
};

const TextFieldMask = React.forwardRef<HTMLInputElement, MaskedTextFieldProps>(
  ({ mask, onChange, value, fullWidth = true, sx, ...props }, ref) => {
    const maskGenerator = mask ? createDefaultMaskGenerator(mask) : undefined;

    const { value: maskedValue, onChange: onMaskedChange, ref: inputRef } = useWebMask({
      maskGenerator,
      value: value as string,
      onChange: (val: string) => {
        if (onChange) {
          const event = {
            target: {
              value: val,
              name: props.name,
            },
          } as any;
          onChange(event);
        }
      },
      ref,
    });

    return (
      <TextField
        {...props}
        fullWidth={fullWidth}
        inputRef={inputRef}
        value={maskedValue}
        onChange={onMaskedChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#FFFFFF',
          },
          ...sx,
        }}
      />
    );
  }
);

TextFieldMask.displayName = 'TextFieldMask';

export default TextFieldMask;
