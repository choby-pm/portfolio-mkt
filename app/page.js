import Dashboard from "@/components/Dashboard";
import data from "@/data/portfolio.json";

export default function Home() {
  return <Dashboard data={data} />;
}
