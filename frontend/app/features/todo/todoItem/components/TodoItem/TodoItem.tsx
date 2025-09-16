import React, { memo } from 'react';

import Button from '@/app/components/Button/Button';
import { TodoProps } from '@/app/types';
import EditableInputForm from '../../../components/editableInput/EditableInput';

interface Props {
	todo: TodoProps;
	onEdit: (name: string) => void;
	onToggle: () => void;
	onDelete: () => void;
}

const TodoItem = memo(({ todo, onEdit, onToggle, onDelete }: Props) => (
	<div className='flex items-center justify-between gap-3 border-b-2 border-solid p-2 border-b-slate-300 last:border-b-0'>
		<div className='flex lg:w-[300px] items-center'>
			<EditableInputForm data={todo} onSubmit={onEdit} />
		</div>
		<div className='flex items-center gap-[50px]'>
			<div className='flex-col md:flex-row lg:flex-row gap-2'>
				<div>{new Date(todo.createdAt).toDateString()}</div>
				<div>{todo.priority}</div>
			</div>
			<div className='flex flex-col md:flex-row lg:flex-row gap-3'>
				<Button type='delete' onClick={onDelete}>
					Delete
				</Button>
				<Button
					type={todo.completed ? 'completed' : 'ongoing'}
					onClick={onToggle}
				>
					{todo.completed ? 'Completed' : 'Ongoing'}
				</Button>
			</div>
		</div>
	</div>
));

TodoItem.displayName = 'TodoItem';

export default TodoItem;
