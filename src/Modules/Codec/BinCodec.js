import Opcodes from './Opcodes.js';

class Encoder {
	encodeJoinGame(username) {
		const packet = new Uint8Array([Opcodes.JoinGame, username.length, new TextEncoder().encode(username), 0, 0]);

		return packet.buffer;
	}

	encodeHeartbeat() { // i like using the word heartbeat instead of ping because it sounds cooler
		const buffer = new ArrayBuffer(1);
		buffer.setUint8(0, Opcodes.Heartbeat);

		return buffer;
	}
}

export default class BinCodec {

}

