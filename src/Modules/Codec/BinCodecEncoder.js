import Opcodes from './Opcodes.js';
import RpcMap from './RpcMap.js';
import InputParamsMap from './InputParamsMap.js';

export default class Encoder {
	encodeEnterWorld(username, partyKey = '', reconnectSecret = '') {
		const packet = new Uint8Array([
			Opcodes.JoinGame,

			username.length,
			...new TextEncoder().encode(username),

			partyKey.length,
			...new TextEncoder().encode(partyKey),

			reconnectSecret.length,
			...new TextEncoder().encode(reconnectSecret)
		]);

		return packet.buffer;
	}

	encodeRpc(rpcObj) {
		const buffer = new ArrayBuffer(1024); // 1024 is probably excessive but whatever
		const view = new DataView(buffer);
		let offset = 0;

		const rpcId = Object.keys(RpcMap).indexOf(rpcObj.response.name);
		view.setUint8(0, Opcodes.Rpc);
		view.setUint8(1, rpcId);
		offset += 2;

		const rpcParams = RpcMap[rpcObj.response.name];
		Object.keys(rpcParams).forEach(param => {
			const dataType = rpcParams[param];
			const argValue = rpcObj.response[param];

			switch(dataType) {
				case 'Uint32':
					view.setUint32(offset, argValue, true);
					offset += 4;
					break;

				case 'Uint16':
					view.setUint16(offset, argValue, true);
					offset += 2;
					break;

				case 'Boolean':
					view.setUint8(offset, Number(argValue));
					offset++;
					break;

				case 'String':
					const bytes = new TextEncoder().encode(argValue);
					view.setUint8(offset, argValue.length);
					offset++;
					bytes.forEach(byte => {
						view.setUint8(offset, byte);
						offset++;
					});
					break;

				case 'ArrayUint32':
					argValue.forEach(num => {
						view.setUint32(offset, num, true);
						offset += 4;
					});
					break;
			}
		});

		return buffer.slice(0, offset);
	}

	encodeInput(inputObj) {
		const buffer = new ArrayBuffer(128);
		const view = new DataView(buffer);
		let offset = 0;

		view.setUint8(0, Opcodes.Input);
		view.setUint8(1, Object.keys(inputObj).length);
		offset += 2

		Object.keys(inputObj).forEach(key => {
			const dataType = InputParamsMap[key];
			view.setUint8(offset, Object.keys(InputParamsMap).indexOf(key));
			offset++;

			switch (dataType) {
				case 'Uint16':
					view.setUint16(offset, inputObj[key], true);
					offset += 2;
					break;

				case 'Int16':
					view.setInt16(offset, inputObj[key], true);
					offset += 2;
					break;

				case 'Boolean':
					view.setUint8(offset, Number(inputObj[key]));
					offset++;
					break;
			}
		});

		return buffer.slice(0, offset);
	}

	encodeHeartbeat() { // i like using the word heartbeat instead of ping because it sounds cooler
		const buffer = new ArrayBuffer(1);
		const view = new DataView(buffer);
		view.setUint8(0, Opcodes.Heartbeat);

		return buffer;
	}
}

