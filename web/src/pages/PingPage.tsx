import { useState } from 'react';
import { usePingMutation } from '../app/api';

export function PingPage() {
	const [ping, { data, error, isLoading }] = usePingMutation(); // Use the mutation hook
	const [pong, setPong] = useState(null); // State to store the response from the server

	const handlePing = async () => {
		try {
			const response = await ping('ping');
			setPong(response.data);
		} catch (err) {
			console.error('Ping failed:', err);
		}
	};

	return (
		<>
			<button onClick={handlePing} disabled={isLoading}>
				{isLoading ? 'Pinging...' : 'Ping Server'}
			</button>
			{data && <h1>Response: {data}</h1>}
			{error && 'message' in error && <h1>Error: {error.message}</h1>}
		</>
	);
}
