'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
	addList,
	deleteList,
	fetchLists,
	updateList,
	addTodo,
	deleteTodo,
	fetchTodos,
	toggleTodoCompletion,
	updateTodo,
} from '../api/todo-api';
import {
	ListProps,
	TodoProps,
	TodoDataProps,
	FilterState,
	ListDataProps,
} from '@/app/types';
import { useTodoContext } from '../context/context';
import ListForm from './components/ListForm/ListForm';
import ListItem from './components/ListItem/ListItem';
import TodoForm from '../todoItem/components/TodoForm/TodoForm';
import FilterTodoBar from './components/FilterListBar/FilterTodoBar';
import TodoItem from '../todoItem/components/TodoItem/TodoItem';

const TodoList = () => {
	const queryClient = useQueryClient();
	const { selectedListId, setSelectedListId } = useTodoContext();
	const [filter, setFilter] = useState<FilterState>({});

	const {
		data: lists = [],
		isLoading: listsLoading,
		error: listsError,
	} = useQuery({
		queryKey: ['lists'],
		queryFn: fetchLists,
	});

	const {
		data: todos = [],
		isLoading: todosLoading,
		error: todosError,
	} = useQuery({
		queryKey: ['todos', selectedListId],
		queryFn: () => {
			if (!selectedListId) {
				return Promise.resolve([]);
			}
			return fetchTodos(selectedListId);
		},
		enabled: !!selectedListId,
	});

	const filteredTodos = useMemo(() => {
		return todos.filter((todo) => {
			if (filter.completed !== undefined && todo.completed !== filter.completed)
				return false;
			if (filter.priority && todo.priority !== filter.priority) return false;
			return true;
		});
	}, [todos, filter]);

	const addListMutation = useMutation({
		mutationFn: addList,
		onMutate: async (newList) => {
			await queryClient.cancelQueries({ queryKey: ['lists'] });
			const previousLists =
				queryClient.getQueryData<ListProps[]>(['lists']) || [];
			queryClient.setQueryData(
				['lists'],
				[...previousLists, { ...newList, id: 'temp' }]
			);
			return { previousLists };
		},
		onError: (err: Error, _, context) => {
			queryClient.setQueryData(['lists'], context?.previousLists);
			toast.error(`Failed to add list: ${err.message}`);
		},
		onSuccess: (newList) => {
			queryClient.invalidateQueries({ queryKey: ['lists'] });
			setSelectedListId(newList.id);
			toast.success('List added');
		},
	});

	const updateListMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ListDataProps }) =>
			updateList(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lists'] }),
		onError: (err: Error) =>
			toast.error(`Failed to update list: ${err.message}`),
	});

	const deleteListMutation = useMutation({
		mutationFn: deleteList,
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ['lists'] });
			const previousLists =
				queryClient.getQueryData<ListProps[]>(['lists']) || [];
			queryClient.setQueryData(
				['lists'],
				previousLists.filter((list) => list.id !== id)
			);
			if (id === selectedListId) setSelectedListId(null);
			return { previousLists };
		},
		onError: (err: Error, _, context) => {
			queryClient.setQueryData(['lists'], context?.previousLists);
			toast.error(`Failed to delete list: ${err.message}`);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lists'] }),
	});

	const addTodoMutation = useMutation({
		mutationFn: (data: TodoProps) => addTodo(selectedListId!, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos', selectedListId] });
			toast.success('Todo added');
		},
		onError: (err: Error) => toast.error(`Failed to add todo: ${err.message}`),
	});

	const updateTodoMutation = useMutation({
		mutationFn: ({ todoId, data }: { todoId: string; data: TodoDataProps }) =>
			updateTodo(selectedListId!, todoId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['todos', selectedListId] }),
		onError: (err: Error) =>
			toast.error(`Failed to update todo: ${err.message}`),
	});

	const deleteTodoMutation = useMutation({
		mutationFn: (todoId: string) => deleteTodo(selectedListId!, todoId),
		onMutate: async (todoId) => {
			await queryClient.cancelQueries({ queryKey: ['todos', selectedListId] });
			const previousTodos =
				queryClient.getQueryData<TodoProps[]>(['todos', selectedListId]) || [];
			queryClient.setQueryData(
				['todos', selectedListId],
				previousTodos.filter((t) => t.id !== todoId)
			);
			return { previousTodos };
		},
		onError: (err: Error, _, context) => {
			queryClient.setQueryData(
				['todos', selectedListId],
				context?.previousTodos
			);
			toast.error(`Failed to delete todo: ${err.message}`);
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['todos', selectedListId] }),
	});

	const toggleTodoMutation = useMutation({
		mutationFn: ({
			todoId,
			completed,
		}: {
			todoId: string;
			completed: boolean;
		}) => toggleTodoCompletion(selectedListId!, todoId, completed),
		onMutate: async ({ todoId, completed }) => {
			await queryClient.cancelQueries({ queryKey: ['todos', selectedListId] });
			const previousTodos =
				queryClient.getQueryData<TodoProps[]>(['todos', selectedListId]) || [];
			const updatedTodos = previousTodos.map((t) =>
				t.id === todoId ? { ...t, completed } : t
			);
			queryClient.setQueryData(['todos', selectedListId], updatedTodos);
			return { previousTodos };
		},
		onError: (err: Error, _, context) => {
			queryClient.setQueryData(
				['todos', selectedListId],
				context?.previousTodos
			);
			toast.error(`Failed to toggle todo: ${err.message}`);
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['todos', selectedListId] }),
	});

	useEffect(() => {
		if (lists.length > 0 && !selectedListId) {
			setSelectedListId(lists[0].id);
		}
	}, [lists, selectedListId, setSelectedListId]);

	const NoDataLabel = React.memo(() => (
		<div className='text-4xl text-neutral font-bold'>No data</div>
	));
	NoDataLabel.displayName = 'NoDataLabel';

	if (listsLoading) return <div>Loading lists...</div>;
	if (listsError) return <div>Error loading lists: {listsError.message}</div>;

	return (
		<div className='flex w-full min-h-[70vh] flex-col lg:flex-row rounded-md border-slate-300 border-2 gap-[30px] border-solid p-[30px]'>
			<ToastContainer />
			<div className='w-full lg:min-w-[30vw]'>
				<h3>Lists</h3>
				<ListForm onSubmit={(data) => addListMutation.mutate(data)} />
				{lists.length > 0 ? (
					lists.map((list) => (
						<ListItem
							key={list.id}
							list={list}
							isSelected={list.id === selectedListId}
							onSelect={() => setSelectedListId(list.id)}
							onDelete={() => deleteListMutation.mutate(list.id)}
							onEdit={(newName) =>
								updateListMutation.mutate({
									id: list.id,
									data: { name: newName },
								})
							}
						/>
					))
				) : (
					<div className='flex justify-center'>
						<NoDataLabel />
					</div>
				)}
			</div>
			{selectedListId && (
				<div className='w-full lg:min-w-[50vw]'>
					<h3>Todos in {lists.find((l) => l.id === selectedListId)?.name}</h3>
					<TodoForm onSubmit={(data) => addTodoMutation.mutate(data)} />
					<FilterTodoBar onFilterChange={setFilter} />
					{todosLoading ? (
						<div>Loading todos...</div>
					) : todosError ? (
						<div>Error loading todos: {todosError.message}</div>
					) : filteredTodos.length > 0 ? (
						filteredTodos.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								onEdit={(newName) =>
									updateTodoMutation.mutate({
										todoId: todo.id,
										data: { name: newName, completed: todo.completed },
									})
								}
								onToggle={() =>
									toggleTodoMutation.mutate({
										todoId: todo.id,
										completed: !todo.completed,
									})
								}
								onDelete={() => deleteTodoMutation.mutate(todo.id)}
							/>
						))
					) : (
						<div className='flex justify-center'>
							<NoDataLabel />
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TodoList;
