import Opcodes from './Opcodes.js';
import RpcMap from './RpcMap.js';
import InputParamsMap from './InputParamsMap.js';

import ByteBuffer from 'bytebuffer';

export default class Encoder {
	encodeEnterWorld(username, partyKey = '', reconnectSecret = '') {
		const packet = new ByteBuffer(0, true);

		packet.writeUint8(Number(Opcodes.JoinGame));
		packet.writeVString(username);
		packet.writeVString(partyKey);
		packet.writeVString(reconnectSecret);

		return packet.buffer;
	}

	encodeRpc(rpcObj) {
		const buffer = new ByteBuffer(0, true);

		const rpcId = Object.keys(RpcMap).indexOf(rpcObj.response.name);
		buffer.writeUint8(Number(Opcodes.Rpc));
		buffer.writeUint8(rpcId);

		const rpcParams = RpcMap[rpcObj.response.name];
		Object.keys(rpcParams).forEach(param => {
			const dataType = rpcParams[param];
			const argValue = rpcObj.response[param];

			switch(dataType) {
				case 'Uint32':
					buffer.writeUint32(argValue);
					break;

				case 'Uint16':
					buffer.writeUint16(argValue);
					break;

				case 'Boolean':
					buffer.writeUint8(Number(argValue));
					break;

				case 'String':
					buffer.writeVString(argValue);
					break;

				case 'ArrayUint32':
					argValue.forEach(num => {
						buffer.writeUint32(num);
					});
					break;
			}
		});

		return buffer.buffer;
	}

	encodeInput(inputObj) {
		const buffer = new ByteBuffer(0, true);

		buffer.writeUint8(Number(Opcodes.Input));
		buffer.writeUint8(Object.keys(inputObj).length);

		Object.keys(inputObj).forEach(key => {
			const dataType = InputParamsMap[key];
			buffer.writeUint8(Object.keys(InputParamsMap).indexOf(key));

			switch (dataType) {
				case 'Uint16':
					buffer.writeUint16(inputObj[key]);
					break;

				case 'Int16':
					buffer.writeInt16(inputObj[key]);
					break;

				case 'Boolean':
					buffer.writeUint8(Number(inputObj[key]));
					break;
			}
		});

		return buffer.buffer;
	}

	encodeHeartbeat() { // i like using the word heartbeat instead of ping because it sounds cooler
		const buffer = new ByteBuffer(0, true);
		buffer.writeUint8(Opcodes.Heartbeat);

		return buffer.buffer;
	}
}

