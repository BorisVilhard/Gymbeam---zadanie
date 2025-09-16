import { ReactNode } from 'react';
import classNames from 'classnames';

type ButtonType = 'default' | 'delete' | 'edit' | 'completed' | 'ongoing';

interface Props {
	type?: ButtonType;
	children: ReactNode;
	disabled?: boolean;
	className?: string;
	htmlType?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
}

const Button = ({
	type = 'default',
	children,
	disabled,
	className,
	htmlType = 'button',
	onClick,
}: Props) => {
	return (
		<button
			onClick={onClick}
			type={htmlType}
			className={classNames(
				'flex h-[4vh] p-2 rounded-md min-h-[45px] text-white cursor-pointer items-center justify-center transition ease-in-out',
				{
					'bg-default': (type === 'edit' || 'default') && !disabled,
					'bg-error': type === 'delete' && !disabled,
					'bg-success': type === 'completed' && !disabled,
					'bg-onGoing': type === 'ongoing' && !disabled,
					'cursor-not-allowed border-neutral bg-neutral': disabled,
				},
				className
			)}
			data-disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
