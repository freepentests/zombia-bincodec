import SimpleNetwork from './Modules/SimpleNetwork.js';

const scanSingleServer = (serverId) => {
	const network = new SimpleNetwork();
	network.init(`wss://server-${serverId}.zombia.io/`);

	network.ws.onopen = () => {
		network.sendEnterWorld({
			username: 'Adam Lanza'
		});

		network.on('rpc', (e) => {
			if (e.name === 'UpdateLeaderboard') {
				console.log(e.response.map(entry => {
					if (entry.uid !== network.myUid) return `${entry.name}: Wave ${entry.wave} `;
				}).filter(entry => entry).join('\n'));

				network.ws.close();
			}
		});
	};
};

scanSingleServer('v05001');

