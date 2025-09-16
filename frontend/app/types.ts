export interface ListProps {
	id: string;
	name: string;
}

export interface TodoProps {
	id: string;
	name: string;
	completed: boolean;
	createdAt: Date;
	priority: 'high' | 'medium' | 'low';
}

export interface ListDataProps {
	name: string;
}

export interface TodoDataProps {
	name: string;
	completed: boolean;
	priority?: TodoProps['priority'];
}

export interface FilterState {
	completed?: boolean;
	priority?: TodoProps['priority'];
}
