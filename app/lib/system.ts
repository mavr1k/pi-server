import os from "os";
import { execSync } from "child_process";

function getCPUUsage() {
	const cpuInfo1 = os.cpus();

	const idle1 = cpuInfo1.reduce((acc, c) => acc + c.times.idle, 0);
	const total1 = cpuInfo1.reduce(
		(acc, c) => acc + Object.values(c.times).reduce((a, b) => a + b, 0),
		0,
	);

	// small delay to calculate diff
	const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

	return wait(100).then(() => {
		const cpuInfo2 = os.cpus();

		const idle2 = cpuInfo2.reduce((acc, c) => acc + c.times.idle, 0);
		const total2 = cpuInfo2.reduce(
			(acc, c) => acc + Object.values(c.times).reduce((a, b) => a + b, 0),
			0,
		);

		const idleDiff = idle2 - idle1;
		const totalDiff = total2 - total1;

		return Math.round((1 - idleDiff / totalDiff) * 100);
	});
}

function getDiskUsage() {
	// Linux-only (Raspberry Pi OK)
	const output = execSync("df -h /", { encoding: "utf-8" });

	const [, dataLine] = output.trim().split("\n");
	const parts = (dataLine || "").split(/\s+/);

	return {
		total: parts[1],
		used: parts[2],
		available: parts[3],
		usagePercent: parts[4],
	};
}

async function getStats() {
	const cpuUsage = await getCPUUsage();

	return {
		timestamp: new Date().toISOString(),
		platform: {
			arch: os.arch(),
			platform: os.platform(),
			hostname: os.hostname(),
			cpuModel: os.cpus()[0]?.model,
			cpuCores: os.cpus().length,
		},
		cpu: {
			usagePercent: cpuUsage,
			loadAverage: os.loadavg(), // 1, 5, 15 min
		},
		memory: {
			totalMB: Math.round(os.totalmem() / 1024 / 1024),
			freeMB: Math.round(os.freemem() / 1024 / 1024),
			usedMB: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
			usagePercent: Math.round(
				((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
			),
		},
		uptimeSeconds: os.uptime(),
		uptimeFormatted: new Date(os.uptime() * 1000).toISOString().substr(11, 8),
		disk: getDiskUsage(),
	};
}

export { getStats };
