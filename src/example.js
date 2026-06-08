import SimpleNetwork from './Modules/SimpleNetwork.js';

const scanSingleServer = (serverId) => {
	return new Promise((resolve, reject) => {
		const network = new SimpleNetwork();
		network.init(`wss://server-${serverId}.zombia.io/`);

		network.ws.onopen = () => {
			network.sendEnterWorld({
				username: 'Adam Lanza'
			});

			network.on('rpc', (e) => {
				if (e.name === 'UpdateLeaderboard') {
					const result = e.response.map(entry => {
						if (entry.uid !== network.myUid) return `${entry.name}: Wave ${entry.wave} `;
					}).filter(entry => entry).join('\n');

					if (result) console.log(result);

					network.cleanup();
					resolve();
				}
			});
		};
	});
};

(async () => {
	const servers = ['v03002', 'v04001', 'v05002', 'v05001', 'v04002', 'v03001'];
	console.log('Server scan results:\n');

	await Promise.all(servers.map(server => scanSingleServer(server)));
})();

