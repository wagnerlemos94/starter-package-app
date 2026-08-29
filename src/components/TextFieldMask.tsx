import { TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { useWebMask, createDefaultMaskGenerator } from "react-hook-mask";

type MaskedTextFieldProps = TextFieldProps & {
  mask?: string;
};

const TextFieldMask = React.forwardRef<HTMLInputElement, MaskedTextFieldProps>(
  ({ mask, onChange, value, ...props }, ref) => {
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
        inputRef={inputRef}
        value={maskedValue}
        onChange={onMaskedChange}
      />
    );
  }
);

export default TextFieldMask;
