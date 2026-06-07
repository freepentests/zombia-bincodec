import SimpleNetwork from './Modules/SimpleNetwork.js';

const network = new SimpleNetwork();
network.init('wss://server-v04001.zombia.io/');
network.ws.onopen = () => {
	network.sendEnterWorld({
		username: 'blmlol'
	});
};


