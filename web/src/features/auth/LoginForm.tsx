import classes from './LoginForm.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Button, Grid, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { mapErrorToString } from '../../app/helpers';
import { useLoginMutation } from './authApiSlice';

export const LoginForm = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [login, { isLoading }] = useLoginMutation();
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			password: '',
		},
		validate: {
			email: (value) => (value.length > 0 ? null : 'Invalid email'),
			password: (value) => (value.length > 0 ? null : 'Invalid password'),
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		try {
			await login(values).unwrap();
			navigate('/');
		} catch (error) {
			setError(mapErrorToString(error));
		}
	};

	return (
		<form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
			<Grid gutter="lg">
				<Grid.Col span={12}>
					<TextInput
						label="Email"
						placeholder="john.doe@email.com"
						key={form.key('email')}
						autoComplete="email"
						type="email"
						{...form.getInputProps('email')}
					/>
				</Grid.Col>

				<Grid.Col span={12}>
					<PasswordInput
						label="Password"
						placeholder="p@ssw0rd"
						key={form.key('password')}
						autoComplete="current-password"
						{...form.getInputProps('password')}
					/>
				</Grid.Col>
			</Grid>

			<Group justify="center" mt="xl">
				<Button type="submit" size="md" loading={isLoading}>
					Submit
				</Button>
			</Group>

			{error && (
				<Alert color="red" mt="xl">
					{error}
				</Alert>
			)}
		</form>
	);
};
