import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';

interface ISelectProprs {
    autocomplete?: boolean;
    name: string;
    options: Array<{
        label: string;
        value: string;
    }>;
    helperText?: string;
    error?: boolean;
    value?: string | string[];
    multiple?: boolean;
    onChange?: (value?: string | string[]) => void;
}

export default function SelectComponet({
    autocomplete,
    options,
    name,
    helperText,
    error,
    value,
    onChange,
    multiple
}: ISelectProprs
) {

    if (autocomplete) {
        // prepare value for Autocomplete: labels (string or string[])
        const labels = (multiple)
            ? (Array.isArray(value) ? value.map(v => options.find(o => o.value === v)?.label ?? '') : [])
            : (typeof value === 'string' ? options.find(o => o.value === value)?.label ?? '' : '');

        return (
            <Autocomplete
                disablePortal
                multiple={!!multiple}
                value={labels as any}
                onChange={(_e, newLabel) => {
                    if (multiple) {
                        const vals = (newLabel as string[]).map(l => options.find(o => o.label === l)?.value ?? '');
                        onChange?.(vals.filter(v => v));
                    } else {
                        const found = options.find(o => o.label === (newLabel as string));
                        onChange?.(found?.value ?? '');
                    }
                }}
                options={options.map(item => item.label)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label={name} helperText={helperText} error={!!error} />}
            />
        );
    }

    return (
        <BasicSelect options={options} name={name} helperText={helperText} error={error} value={value} onChange={onChange} multiple={multiple} />
    );

}

export function BasicSelect({ options, name, helperText, error, value, onChange, multiple }: {
    options: Array<{
        label: string;
        value: string;
    }>;
    name: string;
    helperText?: string;
    error?: boolean;
    value?: string | string[];
    onChange?: (value?: string) => void;
    multiple?: boolean;
}) {
    const [selected, setSelected] = React.useState(value ?? '');

    React.useEffect(() => {
        console.log('BasicSelect useEffect value ->', value);
        setSelected(value ?? '');
    }, [value]);

    return (
        <FormControl fullWidth error={!!error}>
            <InputLabel id="demo-simple-select-label">{name}</InputLabel>
            <Select
                multiple={!!multiple}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selected}
                label={name}
                onChange={(e) => {
                    const val = (e.target as HTMLInputElement).value as unknown;
                    // value can be string or string[] when multiple
                    setSelected(val as any);
                    onChange?.(val as any);
                }}
                error={!!error}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    );
}

export function ComboBox({ options }: {
    options: Array<{
        label: string;
        value: string;
    }>;
}) {
    return (
        <Autocomplete
            multiple
            disablePortal
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie" />}
        />
    );
}

