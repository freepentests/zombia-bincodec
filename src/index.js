import WebSocket from 'ws';
import BinCodec from './Modules/Codec/BinCodec.js';
import fs from 'fs';
import { SocksProxyAgent } from 'socks-proxy-agent';

process.on('uncaughtException', (e) => {console.log(e)});

const proxies = fs.readFileSync('./proxies.txt', 'utf-8').split('\n');

const fillServer = (servId) => {
	let index = 0;

	for (let i = 0; i < 1; i++) {
		const ws = new WebSocket('wss://server-' + servId + '.zombia.io/', {
			agent: new SocksProxyAgent('socks5://' + proxies[index])
		});

		ws.onopen = (e) => {
			ws.send(new BinCodec().encoder.encodeEnterWorld('nighater', '67tpWpcw7ik'));

			ws.send(new BinCodec().encoder.encodeInput({
				up: true,
				left: true
			}));

			setInterval(() => {
				ws.send(new BinCodec().encoder.encodeRpc({
					response: {
						name: 'SendChatMessage',
						channel: 'All',
						message: 'BLACK LIVES FUCKING MATTER!'
					}
				}));

			}, 2000);
		};

		ws.onmessage = (e) => {
			const msg = e.data;
			const opcode = new Uint8Array(msg)[0];

			/*
			if (opcode === 4) {
				console.log(new BinCodec().decoder.decodeEnterWorld(msg.buffer));
			}

			if (opcode === 9) {
				console.log(new BinCodec().decoder.decodeRpc(msg.buffer));
			}
			*/
		};

		ws.onclose = (e) => {
			console.log('close');
		};

		index++;
	}
}

fillServer('v03001');

/*
const servers = ['v03002', 'v04001', 'v05002', 'v05001', 'v04002', 'v03001'];

servers.forEach(server => {
	fillServer(server);
});
*/

