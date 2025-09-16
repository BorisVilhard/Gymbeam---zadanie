import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import InputField from '@/app/components/Fields/InputField/InputField';
import Button from '@/app/components/Button/Button';

import Dropdown from '@/app/components/Dropdown/Dropdown';
import { TodoProps } from '@/app/types';

interface Props {
	onSubmit: (data: TodoProps) => void;
	initialData?: TodoProps;
}

const TodoForm = ({ onSubmit, initialData }: Props) => {
	const schema = zod.object({
		name: zod.string().min(1, { message: 'Required' }),
		completed: zod.boolean(),
		priority: zod.enum(['high', 'medium', 'low']),
	});

	const methods = useForm<TodoProps>({
		defaultValues: initialData || {
			name: '',
			completed: false,
			priority: 'low',
		},
		resolver: zodResolver(schema),
	});

	const { register, handleSubmit, setValue } = methods;

	const priorityOptions = [
		{ label: 'High', value: 'high' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'Low', value: 'low' },
	];

	const handlePriorityChange = (value: TodoProps) => {
		setValue('priority', value.priority, { shouldValidate: true });
	};

	const handleFormSubmit = handleSubmit((data) => {
		onSubmit(data);
		methods.reset();
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleFormSubmit}>
				<InputField
					{...register('name', { required: true })}
					placeholder='Add new todo'
				/>
				<Dropdown
					name='priority'
					value={methods.getValues('priority')}
					items={priorityOptions}
					onChange={handlePriorityChange}
				/>
				<Button htmlType='submit'>Add Todo</Button>
			</form>
		</FormProvider>
	);
};

export default TodoForm;
