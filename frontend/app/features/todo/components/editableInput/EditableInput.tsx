import React, { useState, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import InputField from '@/app/components/Fields/InputField/InputField';
import Button from '@/app/components/Button/Button';
import { MdOutlineEdit } from 'react-icons/md';

interface EditableInputProps {
	onSubmit: (data: string) => void;
	handleListChange?: (id: string) => void;
	isSelectedList?: boolean;
	data: { id: string; name: string };
}

const EditableInputForm = ({
	onSubmit,
	handleListChange,
	isSelectedList,
	data,
}: EditableInputProps) => {
	const [isEditing, setEditing] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const schema = zod.object({
		name: zod.string().min(1, { message: 'Required' }),
	});

	const methods = useForm<{ name: string }>({
		defaultValues: {
			name: data.name,
		},
		resolver: zodResolver(schema),
	});

	const {
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = methods;

	useEffect(() => {
		setValue('name', data.name);
	}, [data.name, setValue]);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
		}
	}, [isEditing]);

	const handleFormSubmit = handleSubmit((formData) => {
		onSubmit(formData.name);
		setEditing(false);
		reset({ name: formData.name });
	});

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			setEditing(false);
			reset({ name: data.name });
		}
	};

	return (
		<>
			{isEditing ? (
				<div className='relative flex' onKeyDown={handleKeyDown}>
					<FormProvider {...methods}>
						<form
							onSubmit={handleFormSubmit}
							className='flex gap-[10px] items-center'
						>
							<InputField
								name='name'
								placeholder='Add new list'
								defaultValue={data.name}
								ref={inputRef}
								error={errors.name?.message}
							/>
							<Button htmlType='submit'>Submit</Button>
							<Button onClick={() => setEditing(false)}>Back</Button>
						</form>
					</FormProvider>
				</div>
			) : (
				<div
					onClick={
						handleListChange ? () => handleListChange(data.id) : undefined
					}
					role={handleListChange ? 'button' : undefined}
					tabIndex={handleListChange ? 0 : undefined}
					onKeyDown={(e) => {
						if (handleListChange && (e.key === 'Enter' || e.key === ' ')) {
							handleListChange(data.id);
						}
					}}
					style={{
						fontWeight: isSelectedList ? 'bold' : 'normal',
					}}
					className='flex h-[20px] w-full cursor-pointer justify-between items-center'
				>
					{data.name}
					<span
						onClick={(e) => {
							e.stopPropagation();
							setEditing(true);
						}}
						role='button'
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								setEditing(true);
							}
						}}
						className='bg-default cursor-pointer p-[3%] rounded-full'
						aria-label='Edit name'
					>
						<MdOutlineEdit color='white' />
					</span>
				</div>
			)}
		</>
	);
};

export default EditableInputForm;
