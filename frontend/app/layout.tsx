'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TodoProvider } from './features/todo/context/context';
import './globals.css';
import React from 'react';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 5 * 60 * 1000,
		},
	},
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				<QueryClientProvider client={queryClient}>
					<TodoProvider>
						{children}
						<ReactQueryDevtools initialIsOpen={false} />
					</TodoProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
