import { SimulationDashboard } from "@/components/simulation/SimulationDashboard";
import { SimulationProvider } from "@/context/SimulationContext";

export default function HomePage() {
  return (
    <SimulationProvider>
      <SimulationDashboard />
    </SimulationProvider>
  );
}
