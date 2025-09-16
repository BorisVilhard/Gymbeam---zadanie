import axios from 'axios';
import {
	ListProps,
	TodoProps,
	ListDataProps,
	TodoDataProps,
} from '@/app/types';

const apiURL = 'https://6692cc7d346eeafcf46e38be.mockapi.io/api/v1/';

export const fetchLists = async (): Promise<ListProps[]> => {
	const response = await axios.get<ListProps[]>(`${apiURL}lists`);
	return response.data;
};

export const addList = async (listData: ListDataProps): Promise<ListProps> => {
	const response = await axios.post<ListProps>(`${apiURL}lists`, listData);
	return response.data;
};

export const updateList = async (
	id: string,
	listData: ListDataProps
): Promise<ListProps> => {
	const response = await axios.put<ListProps>(`${apiURL}lists/${id}`, listData);
	return response.data;
};

export const deleteList = async (id: string): Promise<void> => {
	await axios.delete(`${apiURL}lists/${id}`);
};

export const fetchTodos = async (listId: string): Promise<TodoProps[]> => {
	try {
		const response = await axios.get<TodoProps[]>(
			`${apiURL}lists/${listId}/todos`
		);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			return []; // Return empty array for 404 to show "No data available"
		}
		throw error; // Rethrow other errors
	}
};

export const addTodo = async (
	listId: string,
	todoData: TodoDataProps
): Promise<TodoProps> => {
	const response = await axios.post<TodoProps>(
		`${apiURL}lists/${listId}/todos`,
		todoData
	);
	return response.data;
};

export const updateTodo = async (
	listId: string,
	todoId: string,
	todoData: TodoDataProps
): Promise<TodoProps> => {
	const response = await axios.put<TodoProps>(
		`${apiURL}lists/${listId}/todos/${todoId}`,
		todoData
	);
	return response.data;
};

export const deleteTodo = async (
	listId: string,
	todoId: string
): Promise<void> => {
	await axios.delete(`${apiURL}lists/${listId}/todos/${todoId}`);
};

export const toggleTodoCompletion = async (
	listId: string,
	todoId: string,
	completed: boolean
): Promise<TodoProps> => {
	const todoData = { completed };
	const response = await axios.put<TodoProps>(
		`${apiURL}lists/${listId}/todos/${todoId}`,
		todoData
	);
	return response.data;
};
