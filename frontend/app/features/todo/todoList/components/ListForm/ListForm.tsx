import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import InputField from '@/app/components/Fields/InputField/InputField';
import Button from '@/app/components/Button/Button';
import { ListDataProps } from '@/app/types';

interface Props {
	onSubmit: (data: ListDataProps) => void;
	initialData?: ListDataProps;
}

const ListForm = ({ onSubmit, initialData }: Props) => {
	const schema = zod.object({
		name: zod.string().min(1, { message: 'Required' }),
	});

	const methods = useForm<ListDataProps>({
		defaultValues: initialData || { name: '' },
		resolver: zodResolver(schema),
	});

	const { register, handleSubmit, reset } = methods;

	const handleFormSubmit = handleSubmit((data) => {
		onSubmit(data);
		reset();
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleFormSubmit} className='flex gap-2'>
				<InputField
					{...register('name', { required: true })}
					placeholder='Add new list'
				/>
				<Button htmlType='submit'>Submit</Button>
			</form>
		</FormProvider>
	);
};

export default ListForm;
