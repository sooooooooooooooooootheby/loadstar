const pm2 = require("pm2");

const getPm2Info = () => {
	return new Promise((resolve, reject) => {
		pm2.connect((err) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			// 获取所有进程列表
			pm2.list((err, processList) => {
				if (err) {
					pm2.disconnect();
					reject(err);
					return;
				}

				const pm2Info = [];

				processList.forEach((process) => {
					pm2Info.push({
						id: process.pm_id,
						name: process.name,
						cpu: process.monit.cpu,
						memory: process.monit.memory,
						status: process.pm2_env.status,
						restart: process.pm2_env.restart,
					});
				});

				pm2.disconnect();
				resolve(pm2Info);
			});
		});
	});
};

module.exports = { getPm2Info };
