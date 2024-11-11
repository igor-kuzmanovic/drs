import { ColorSchemeToggle } from '../components/ColorSchemeToggle';
import { Welcome } from '../components/Welcome';

export function HomePage() {
	return (
		<>
			<Welcome />
			<ColorSchemeToggle />
		</>
	);
}
