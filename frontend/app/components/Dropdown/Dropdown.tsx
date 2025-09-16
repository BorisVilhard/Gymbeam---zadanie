'use client';
import classNames from 'classnames';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import Button from '../Button/Button';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { TodoProps } from '@/app/types';

interface Props {
	name: string;
	value?: string;
	items: { label: string; value: string }[];
	onChange: (value: TodoProps) => void;
}

const Dropdown = (props: Props) => {
	const { setValue } = useFormContext();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<string>(
		props.value || ''
	);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionSelect = (
		option: { label: string; value: string },
		event: React.MouseEvent<HTMLLIElement, MouseEvent>
	) => {
		event.stopPropagation();
		setSelectedOption(option.value);
		setIsOpen(false);

		const todo: TodoProps = {
			id: crypto.randomUUID(),
			name: '',
			completed: false,
			createdAt: new Date(),
			priority: option.value as 'high' | 'medium' | 'low',
		};

		props.onChange(todo);
		setValue(props.name, option.value, { shouldValidate: true });
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const activeOption = useMemo(() => {
		return props.items.find((e) => e.value === selectedOption);
	}, [props.items, selectedOption]);

	return (
		<div ref={dropdownRef} data-qa='dropdown' className={'relative'}>
			<Button
				className={classNames(
					'flex h-[48px] w-full cursor-pointer items-center justify-between border-[1px] px-[15px] py-[11px]',
					{
						'rounded-b-[1px] rounded-t-[10px]': isOpen,
						rounded: !isOpen,
					}
				)}
				onClick={handleClick}
			>
				<div className='flex items-center gap-[5px]'>
					{activeOption?.label}
					{!activeOption && props.items[0].label}
				</div>
				{isOpen ? (
					<AiOutlineUp color='white' />
				) : (
					<AiOutlineDown color='white' />
				)}
			</Button>

			{isOpen && (
				<ul className='absolute z-50 max-h-60 w-full overflow-auto bg-white rounded-b-md border-x-[1px] border-b-[1px]'>
					{props.items.map((option) => (
						<li
							key={option.value}
							className='z-50 mx-1 my-[5px] flex cursor-pointer items-center gap-[5px] rounded-[5px] px-3 py-2 hover:font-bold'
							onClick={(e) => handleOptionSelect(option, e)}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Dropdown;
