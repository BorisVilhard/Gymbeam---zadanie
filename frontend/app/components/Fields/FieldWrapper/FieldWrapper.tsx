import classNames from 'classnames';
import { ReactNode } from 'react';

type Props = {
	children: ReactNode;
	label?: string;
	error: ReactNode;
	className?: string;
};

const FieldWrapper = ({ label, error, children, className }: Props) => {
	return (
		<div className={className}>
			<div className='mb-1 flex items-center'>
				<div className='font-semibold'>{label}</div>
			</div>
			<div
				className={classNames(
					`rounded border-[1.5px] border-solid border-neutral`,
					{
						'border-[2px] border-error': error,
					}
				)}
			>
				{children}
			</div>
			<div className='mt-1 text-error'>{error}</div>
		</div>
	);
};

export default FieldWrapper;
