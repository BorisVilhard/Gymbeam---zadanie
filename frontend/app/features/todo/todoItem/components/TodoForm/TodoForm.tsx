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

	type FormValues = zod.infer<typeof schema>;

	const methods = useForm<FormValues>({
		defaultValues: initialData
			? {
					name: initialData.name,
					completed: initialData.completed,
					priority: initialData.priority,
			  }
			: {
					name: '',
					completed: false,
					priority: 'low',
			  },
		resolver: zodResolver(schema),
	});

	const { register, handleSubmit, setValue } = methods;

	type PriorityOption = {
		label: string;
		value: TodoProps['priority'];
	};

	const priorityOptions: readonly PriorityOption[] = [
		{ label: 'High', value: 'high' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'Low', value: 'low' },
	];

	const handlePriorityChange = (selected: PriorityOption) => {
		setValue('priority', selected.value, { shouldValidate: true });
	};

	const handleFormSubmit = handleSubmit((data) => {
		onSubmit({
			id: initialData?.id || crypto.randomUUID(),
			name: data.name,
			completed: data.completed,
			createdAt: initialData?.createdAt || new Date(),
			priority: data.priority,
		});
		methods.reset();
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleFormSubmit}>
				<InputField
					{...register('name', { required: true })}
					placeholder='Add new todo'
				/>
				<div>
					<input type='checkbox' {...register('completed')} />
					<span>Completed</span>
				</div>
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
