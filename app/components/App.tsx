import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { StatsDisplay } from "./StatsDisplay";

export function App() {
	return (
		<div className="container mx-auto p-8 relative z-10">
			<div className="space-y-6">
				<Card className="mb-8">
					<CardHeader className="gap-4 text-center">
						<CardTitle className="text-3xl font-bold">
							Home Server Monitor
						</CardTitle>
						<CardDescription>
							Real-time system statistics and performance metrics
						</CardDescription>
					</CardHeader>
				</Card>
				<StatsDisplay />
			</div>
		</div>
	);
}

export default App;
