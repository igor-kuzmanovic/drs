import { Button, Grid, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './RegisterForm.module.css';

export const RegisterForm = () => {
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			firstName: '',
			lastName: '',
			address: '',
			city: '',
			country: '',
			phone: '',
			email: '',
			password: '',
			passwordConfirm: '',
		},
		validate: {
			firstName: (value) => (value.length > 2 ? null : 'Invalid first name'),
			lastName: (value) => (value.length > 2 ? null : 'Invalid last name'),
			address: (value) => (value.length > 2 ? null : 'Invalid address'),
			city: (value) => (value.length > 2 ? null : 'Invalid city'),
			country: (value) => (value.length > 2 ? null : 'Invalid country'),
			phone: (value) => (value.length > 2 ? null : 'Invalid phone'),
			email: (value) => (value.length > 2 ? null : 'Invalid email'),
			password: (value) => (value.length > 2 ? null : 'Invalid password'),
			passwordConfirm: (value, values) => (value.length > 2 && value === values.password ? null : 'Invalid password'),
		},
	});

	return (
		<form className={classes.form} onSubmit={form.onSubmit((values) => console.log(values))}>
			<Grid gutter="sm">
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="First name"
						placeholder="John"
						key={form.key('firstName')}
						autoComplete="given-name"
						{...form.getInputProps('firstName')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Last name"
						placeholder="Doe"
						key={form.key('lastName')}
						autoComplete="family-name"
						{...form.getInputProps('lastName')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Address"
						placeholder="221B Baker Street"
						key={form.key('address')}
						autoComplete="street-address"
						{...form.getInputProps('address')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="City"
						placeholder="London"
						key={form.key('city')}
						autoComplete="address-level-2"
						{...form.getInputProps('city')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Country"
						placeholder="United Kingdom"
						key={form.key('country')}
						autoComplete="country-name"
						{...form.getInputProps('country')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Phone"
						placeholder="+1 (123) 456-7890"
						key={form.key('phone')}
						autoComplete="tel"
						{...form.getInputProps('phone')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="City"
						placeholder="London"
						key={form.key('city')}
						autoComplete="city"
						{...form.getInputProps('city')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Email"
						placeholder="john.doe@email.com"
						key={form.key('email')}
						autoComplete="email"
						type="email"
						{...form.getInputProps('email')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<PasswordInput
						label="Password"
						placeholder="p@ssw0rd"
						key={form.key('password')}
						autoComplete="new-password"
						{...form.getInputProps('password')}
					/>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					<PasswordInput
						label="Password confirm"
						placeholder="p@ssw0rd"
						key={form.key('passwordConfirm')}
						autoComplete="new-password"
						{...form.getInputProps('passwordConfirm')}
					/>
				</Grid.Col>
			</Grid>

			<Group justify="center" mt="xl">
				<Button type="submit" size="md">
					Submit
				</Button>
			</Group>
		</form>
	);
};
