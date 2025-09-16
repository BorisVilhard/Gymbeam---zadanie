import React, { useEffect, useState } from 'react';
import { TodoProps } from '@/app/types';

interface Props {
	onFilterChange: React.Dispatch<
		React.SetStateAction<{
			completed?: boolean;
			priority?: TodoProps['priority'];
			createdAt?: string;
		}>
	>;
}

const FilterTodoBar = ({ onFilterChange }: Props) => {
	const [dateFilter, setDateFilter] = useState<string>('');
	const [priorityFilter, setPriorityFilter] = useState<
		TodoProps['priority'] | ''
	>('');

	useEffect(() => {
		onFilterChange({
			priority: priorityFilter || undefined,
			createdAt: dateFilter || undefined,
		});
	}, [dateFilter, priorityFilter, onFilterChange]);

	const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDateFilter(event.target.value);
	};

	const handlePriorityChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setPriorityFilter(event.target.value as TodoProps['priority'] | '');
	};

	return (
		<div className='flex items-center'>
			<label className='font-bold mr-[10px] text-[18px]'>Filter:</label>
			<input type='date' value={dateFilter} onChange={handleDateChange} />
			<select value={priorityFilter} onChange={handlePriorityChange}>
				<option value=''>All Priorities</option>
				<option value='high'>High</option>
				<option value='medium'>Medium</option>
				<option value='low'>Low</option>
			</select>
		</div>
	);
};

export default FilterTodoBar;
