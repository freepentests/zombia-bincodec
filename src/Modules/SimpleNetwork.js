import BinCodecEncoder from './Codec/BinCodecEncoder.js';
import BinCodecDecoder from './Codec/BinCodecDecoder.js';
import Opcodes from './Codec/Opcodes.js';

export default class SimpleNetwork extends EventEmitter {
	static instance = null;

	constructor() {
		if (SimpleNetwork.instance) return SimpleNetwork.instance;

		this.ws;
		this.myUid;

		SimpleNetwork.instance = this;
	}

	init(...args) {
		this.ws = new WebSocket(...args);
		this.ws.binaryType = 'arraybuffer';
	}

	onWsMessage(msg) {
		const data = msg.data;
		const opcode = new Uint8Array(data)[0];

		switch (opcode) {
			case Opcodes.JoinGame:
				this.emit('enterWorldResponse', this.decodeEnterWorld(data));
				break;

			case Opcodes.Rpc:
				this.emit('rpc', this.decodeRpc(data));
				break;

			case Opcodes.Heartbeat:
				this.emit('heartbeat', this.decodeHeartbeat(data));
				break;

			case Opcodes.EntityUpdate:
				this.emit('entityUpdate', this.decodeEntityUpdate(data));
				break;
		}
	}

	sendEnterWorld(enterWorldObj) {
		if (this.ws.readyState !== 1) return;

		this.ws.send(this.encodeEnterWorld(enterWorldObj.username, enterWorldObject.partyKey, enterWorldObject.reconnectSecret));
	}

	sendRpc(rpcObj) {
		if (this.ws.readyState !== 1) return;

		this.ws.send(this.encodeRpc({
			response: rpcObj
		}));
	}

	sendInput(inputObj) {
		if (this.ws.readyState !== 1) return;

		this.ws.send(this.encodeInput(inputObj));
	}

	sendHeartbeat() {
		if (this.ws.readyState !== 1) return;

		this.ws.send(this.encodeHeartbeat());
	}
}

// mixins
Object.assign(SimpleNetwork.protoytpe, BinCodecDecoder.prototype);
Object.assign(SimpleNetwork.prototype, BinCodecEncoder.prototype);


