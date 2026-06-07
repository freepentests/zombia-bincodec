import ServerToClientRpcMap from './ServerToClientRpcMap.js';

const rpcIdToName = [
	"PartyKey",
	"PartyBuilding",
	"PartyRequest",
	"PartyRequestCancelled",
	"PartyRequestMet",
	"PartyMembersUpdated",
	"UpdateParty",
	"UpdateLeaderboard",
	"Respawned",
	"SetTool",
	"Dead",
	"ToolInfo",
	"BuildingInfo",
	"SpellInfo",
	"CastSpellResponse",
	"ClearActiveSpell",
	"EntityData",
	"Failure",
	"ReceiveChatMessage",
	"DamageDealt",
	"LightningZap",
	"SetTickRate",
	"EntityKilled",
	"AdminCommandResponse",
]

export default class BinCodecDecoder {
	#readVarint32(packet, offset) {
		// LEB128 standard
		let number = 0;
		let placesToShift = 0;
		let position = offset;
		const byteArray = new Uint8Array(packet);

		while (position < byteArray.length) {
			const byte = byteArray[position++];

			number |= (byte & 127) << placesToShift;
			placesToShift += 7;

			if (byte & 128) break; // if MSB is 128 then no continuation
		}

		return [number, position];
	}

	#readVString(packet, offset) {
		let strLen;
		[strLen, offset] = this.#readVarint32(packet, offset);
		const stringBuffer = packet.slice(offset, offset + strLen);
		const string = new TextDecoder().decode(new Uint8Array(stringBuffer));

		const newOffset = offset + strLen;

		return [string, newOffset];
	}

	decodeEnterWorld(packet) {
		const view = new DataView(packet);

		const allowed = Boolean(view.getUint8(1));
		if (!allowed) return { allowed: false, reason: this.#readVString(packet, 2)[0] };

		// i really need to start using bytebuffer

		let offset = 1;
		let name, reconnectSecret;

		[reconnectSecret, offset] = this.#readVString(packet, offset);
		[name, offset] = this.#readVString(packet, offset);

		console.log(name);

		const uid = view.getUint32(offset, true);
		offset += 4;

		const startingTick = view.getUint32(offset, true);
		offset += 4;

		const x = view.getUint16(offset, true);
		offset += 2;

		const y = view.getUint16(offset, true);
		offset += 2;

		const dayLengthMs = view.getUint32(offset, true);
		offset += 4;

		const nightLengthMs = view.getUint32(offset, true);
		offset += 4;

		const minimumBuildDistanceFromWall = view.getUint8(offset);
		offset++;

		const maxFactoryBuildDistance = view.getUint8(offset);
		offset++;

		const maxPlayerBuildDistance = view.getUint8(offset);

		return {
			allowed: true,
			reconnectSecret,
			name,
			uid,
			startingTick,
			x,
			y,
			dayLengthMs,
			nightLengthMs,
			minimumBuildDistanceFromWall,
			maxFactoryBuildDistance,
			maxPlayerBuildDistance
		}
	}

	decodeRpc(packet) {
		const view = new DataView(packet);
		const rpcId = view.getUint8(1);

		const rpcName = rpcIdToName[rpcId];
		if (!rpcName) return rpcId;
		const rpcParams = ServerToClientRpcMap[rpcName];
		const rpc = {
			name: rpcName,
			response: {}
		};

		let offset = 2;

		if (rpcParams.isArray) {
			return rpc; // will implement array logic later
		} else {
			Object.keys(rpcParams).forEach(paramName => {
				const dataType = rpcParams[paramName];
				let data;

				switch (dataType) {
					case 'Boolean':
						data = Boolean(view.getUint8(offset));
						offset++;
						break;

					case 'String':
						[data, offset] = this.#readVString(packet, offset); 
						break;

					case 'Uint8':
						data = view.getUint8(offset);
						offset++;
						break;

					case 'Uint16':
						data = view.getUint16(offset, true);
						offset += 2;
						break;

					case 'Uint32':
						data = view.getUint32(offset, true);
						offset += 4;
						break;

					case 'Uint64':
						data = view.getBigUint64(offset, true);
						offset += 8;
						break;

					case 'OptionalUint32':
						/*
						here's a portion from zombia's official code as a reference for how this works:

						r = t.readUint8() ? t.readUint32() : null;
						*/
						data = Boolean(view.getUint8(offset++)) ? (offset += 4, view.getUint32(offset - 4, true)) : null;
						break;
				}

				rpc.response[paramName] = data;
			});
		}

		return rpc;
	}

	decodeEntityUpdate(packet) {
	}

	decodeHeartbeat(packet) {
		return {};
	}
}

