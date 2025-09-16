import React from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import FieldWrapper from '../FieldWrapper/FieldWrapper';

interface Props<T extends FieldValues> {
	name: Path<T>;
	label?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	type?: string;
	defaultValue?: string;
	error?: string;
	ref?: React.Ref<HTMLInputElement>;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = <T extends FieldValues>({
	name,
	label,
	placeholder,
	disabled,
	type = 'text',
	defaultValue,
	error,
	ref,
	onKeyDown,
	onChange,
}: Props<T>) => {
	const {
		register,
		formState: { errors },
	} = useFormContext<T>();

	const isDateField = type === 'date' || type === 'datetime-local';
	const fieldError = error || (errors[name]?.message as string | undefined);

	return (
		<FieldWrapper label={label} error={fieldError}>
			<input
				{...register(name)}
				data-qa='input'
				type={type}
				onKeyDown={onKeyDown}
				onChange={(e) => {
					const { onChange: rhfOnChange } = register(name);
					rhfOnChange(e);
					onChange?.(e);
				}}
				onFocus={(e) => {
					if (isDateField && 'showPicker' in e.target) {
						(e.target as HTMLInputElement).showPicker();
					}
				}}
				className={classNames('w-full border-none field', {
					'cursor-not-allowed bg-neutral-medium text-neutral-dark': disabled,
					'[&::-webkit-calendar-picker-indicator]:hidden': isDateField,
				})}
				placeholder={placeholder}
				disabled={disabled}
				defaultValue={defaultValue}
				ref={ref}
			/>
		</FieldWrapper>
	);
};

export default InputField;
