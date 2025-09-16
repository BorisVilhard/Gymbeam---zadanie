import React, { useState } from 'react';
import EditableInputForm from '../../../components/editableInput/EditableInput';
import { ListProps } from '@/app/types';
import Button from '@/app/components/Button/Button';

interface Props {
	list: ListProps;
	isSelected: boolean;
	onSelect: (id: string) => void;
	onDelete: (id: string) => void;
	onEdit: (id: string, name: string) => void;
}

const ListItem = ({ list, isSelected, onSelect, onDelete, onEdit }: Props) => {
	const [isCompleted, setIsCompleted] = useState(false);

	const handleComplete = () => {
		setIsCompleted(true);
	};

	return (
		<div className='flex items-center justify-between gap-3 border-b-2 border-solid p-2 border-b-slate-300 last:border-b-0'>
			<EditableInputForm
				data={list}
				isSelectedList={isSelected}
				handleListChange={() => onSelect(list.id)}
				onSubmit={(name) => onEdit(list.id, name)}
			/>
			<div className='flex gap-2'>
				<Button type='delete' onClick={() => onDelete(list.id)}>
					Delete
				</Button>
				<Button
					type={isCompleted ? 'completed' : 'ongoing'}
					onClick={handleComplete}
					disabled={isCompleted}
				>
					{isCompleted ? 'Completed' : 'Ongoing'}
				</Button>
			</div>
		</div>
	);
};

export default ListItem;
