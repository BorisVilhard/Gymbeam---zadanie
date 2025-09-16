'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TodoContextType {
	selectedListId: string | null;
	setSelectedListId: (id: string | null) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [selectedListId, setSelectedListId] = useState<string | null>(null);
	return (
		<TodoContext.Provider value={{ selectedListId, setSelectedListId }}>
			{children}
		</TodoContext.Provider>
	);
};

export const useTodoContext = () => {
	const context = useContext(TodoContext);
	if (!context)
		throw new Error('useTodoContext must be used within TodoProvider');
	return context;
};
