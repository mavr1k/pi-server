import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Activity, HardDrive, Cpu, Clock } from "lucide-react";

type Stats = {
  timestamp: string;
  platform: {
    arch: string;
    platform: string;
    hostname: string;
    cpuModel: string;
    cpuCores: number;
  };
  cpu: {
    usagePercent: number;
    loadAverage: [number, number, number];
  };
  memory: {
    totalMB: number;
    freeMB: number;
    usedMB: number;
    usagePercent: number;
  };
  uptimeSeconds: number;
  uptimeFormatted: string;
  disk: {
    total: string;
    used: string;
    available: string;
    usagePercent: string;
  };
};

function StatBar({ label, value, max = 100, unit = "%" }: { label: string; value: number; max?: number; unit?: string }) {
  const percentage = (value / max) * 100;
  const getColor = () => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold">
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function StatsDisplay() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchStats();

    // Then fetch every second
    const interval = setInterval(fetchStats, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading stats...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">Error: {error || "No data"}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Information
          </CardTitle>
          <CardDescription>Last updated: {new Date(stats.timestamp).toLocaleTimeString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Hostname: </span>
              <span className="font-mono font-semibold">{stats.platform.hostname}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Platform: </span>
              <span className="font-mono font-semibold">{stats.platform.platform}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Architecture: </span>
              <span className="font-mono font-semibold">{stats.platform.arch}</span>
            </div>
            <div>
              <span className="text-muted-foreground">CPU Cores: </span>
              <span className="font-mono font-semibold">{stats.platform.cpuCores}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">CPU Model: </span>
            <span className="font-mono font-semibold text-xs">{stats.platform.cpuModel}</span>
          </div>
        </CardContent>
      </Card>

      {/* CPU Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            CPU Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatBar label="Usage" value={stats.cpu.usagePercent} max={100} />
          <div className="grid grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t">
            <div>
              <span className="text-muted-foreground">1m avg: </span>
              <span className="font-mono font-semibold">{stats.cpu.loadAverage[0].toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">5m avg: </span>
              <span className="font-mono font-semibold">{stats.cpu.loadAverage[1].toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">15m avg: </span>
              <span className="font-mono font-semibold">{stats.cpu.loadAverage[2].toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Memory Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatBar label="Memory" value={stats.memory.usagePercent} max={100} />
          <div className="grid grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t">
            <div>
              <span className="text-muted-foreground">Used: </span>
              <span className="font-mono font-semibold">{stats.memory.usedMB} MB</span>
            </div>
            <div>
              <span className="text-muted-foreground">Free: </span>
              <span className="font-mono font-semibold">{stats.memory.freeMB} MB</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total: </span>
              <span className="font-mono font-semibold">{stats.memory.totalMB} MB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disk Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Disk Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatBar
            label="Disk"
            value={parseInt(stats.disk.usagePercent)}
            max={100}
          />
          <div className="grid grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t">
            <div>
              <span className="text-muted-foreground">Used: </span>
              <span className="font-mono font-semibold">{stats.disk.used}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Available: </span>
              <span className="font-mono font-semibold">{stats.disk.available}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total: </span>
              <span className="font-mono font-semibold">{stats.disk.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uptime */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="w-5 h-5" />
            System Uptime
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="font-mono font-semibold text-lg">{stats.uptimeFormatted}</div>
          <div className="text-muted-foreground text-xs mt-2">{stats.uptimeSeconds.toFixed(0)} seconds</div>
        </CardContent>
      </Card>
    </div>
  );
}
