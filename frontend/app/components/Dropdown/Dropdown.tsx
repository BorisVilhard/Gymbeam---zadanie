'use client';
import classNames from 'classnames';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import Button from '../Button/Button';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

type Option<T extends string> = { label: string; value: T };

interface Props<T extends string> {
	name: string;
	value?: T;
	items: readonly Option<T>[];
	onChange: (selected: Option<T>) => void;
}

const Dropdown = <T extends string>(props: Props<T>) => {
	const { setValue } = useFormContext();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<T | ''>(
		props.value || ''
	);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setSelectedOption(props.value || '');
	}, [props.value]);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionSelect = (
		option: Option<T>,
		event: React.MouseEvent<HTMLLIElement, MouseEvent>
	) => {
		event.stopPropagation();
		setSelectedOption(option.value);
		setIsOpen(false);
		props.onChange(option);
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
					{!activeOption && props.items[0]?.label}
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
