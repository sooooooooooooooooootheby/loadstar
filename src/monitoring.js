const si = require("systeminformation");

const filterSystemInfo = (serverInfo) => {
	return {
		os: {
			platform: serverInfo.os.platform,
			distro: serverInfo.os.distro,
			release: serverInfo.os.release,
			arch: serverInfo.os.arch,
			hostname: serverInfo.os.hostname,
		},
		cpu: {
			currentLoad: serverInfo.cpu.currentLoad,
			currentLoadUser: serverInfo.cpu.currentLoadUser,
			currentLoadSystem: serverInfo.cpu.currentLoadSystem,
			cores: serverInfo.cpu.cpus.length,
			avgLoad: serverInfo.cpu.avgLoad || 0,
			cpus: serverInfo.cpu.cpus.map((item) => ({
				load: item.load,
			})),
		},
		memory: {
			total: serverInfo.memory.total,
			used: serverInfo.memory.used,
			free: serverInfo.memory.free,
			available: serverInfo.memory.available,
			usage: (serverInfo.memory.used / serverInfo.memory.total) * 100,
		},
		disk: serverInfo.disk,
		time: {
			current: serverInfo.time.current,
			uptime: serverInfo.time.uptime,
			timezone: serverInfo.time.timezone,
			timezoneName: serverInfo.time.timezoneName,
		},
	};
};

const getInformation = async () => {
	try {
		// 创建对象分别存储服务器信息和pm2信息
		const serverInfo = {
			os: null,
			cpu: null,
			memory: null,
			disk: null,
		};

		// 获取各项系统信息
		serverInfo.os = await si.osInfo(); // 操作系统信息
		serverInfo.time = si.time(); // 系统运行时间
		// 获取CPU负载情况
		const cpuLoad = await si.currentLoad(); // CPU 负载
		serverInfo.cpu = cpuLoad;
		// 获取内存使用情况
		const memory = await si.mem(); // 内存使用情况
		serverInfo.memory = memory;
		// 获取磁盘使用情况
		const disks = await si.fsSize(); // 磁盘使用情况
		serverInfo.disk = disks;

		return filterSystemInfo(serverInfo);
	} catch (error) {
		console.error(error);
	}
};

module.exports = { getInformation };
