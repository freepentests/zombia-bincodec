import Opcodes from './Opcodes.js';
import InputParamsMap from './InputParamsMap.js';
import RpcMap from './RpcMap.js';
import BinCodecEncoder from './BinCodecEncoder.js';
import BinCodecDecoder from './BinCodecDecoder.js';

export default class BinCodec {
	constructor() {
		this.encoder = new BinCodecEncoder();
		this.decoder = new BinCodecDecoder();
	}
}

