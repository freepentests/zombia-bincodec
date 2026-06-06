import Opcodes from './Opcodes.js';

class Encoder {
	encodeJoinGame(username, partyKey = '', reconnectSecret = '') {
		const packet = new Uint8Array([
			Opcodes.JoinGame,

			username.length,
			new TextEncoder().encode(username),

			partyKey.length,
			new TextEncoder().encode(partyKey),

			reconnectSecret.length,
			new TextEncoder().encode(reconnectSecret)
		]);

		return packet.buffer;
	}

	encodeInput(inputObj) {
		const params = {
			x: "Int16",
			y: "Int16",
			mouseMoved: "Uint16",
			mouseDown: "Boolean",
			space: "Boolean",
			up: "Boolean",
			down: "Boolean",
			left: "Boolean",
			right: "Boolean",
		};

		const buffer = new ArrayBuffer(128);
		let offset = 0;

		buffer.setUint8(0, Opcodes.Input);
		buffer.setUint8(1, Object.keys(inputObj).length);
		offset += 2

		Object.keys(inputObj).forEach(key => {
			const dataType = params[key];
			buffer.setUint8(offset, Object.keys(params).indexOf(key));
			offset++;

			switch (dataType) {
				case 'Uint16':
					buffer.setUint16(offset, inputObj[key]);
					offset += 2;
					break;

				case 'Int16':
					buffer.setInt16(offset, inputObj[key]);
					offset += 2;
					break;

				case 'Boolean':
					buffer.setUint8(offset, Number(inputObj[key]));
					offset++;
					break;
			}
		});
	}

	encodeHeartbeat() { // i like using the word heartbeat instead of ping because it sounds cooler
		const buffer = new ArrayBuffer(1);
		buffer.setUint8(0, Opcodes.Heartbeat);

		return buffer;
	}
}

class Decoder {
}

export default class BinCodec {
	constructor() {
		this.encoder = new Encoder();
		this.decoder = new Decoder();
	}
}

