import ServerToClientRpcMap from './ServerToClientRpcMap.js';
import ByteBuffer from 'bytebuffer';

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
	decodeEnterWorld(packet) {
		const view = ByteBuffer.fromBinary(packet, true);
		view.offset = 1; // skip over opcode

		const allowed = Boolean(view.readUint8());
		if (!allowed) return { allowed: false, reason: view.readVString() };

		const reconnectSecret = view.readVString();
		const name = view.readVString();
		const uid = view.readUint32();
		const startingTick = view.readUint32();
		const x = view.readUint16();
		const y = view.readUint16();
		const dayLengthMs = view.readUint32();
		const nightLengthMs = view.readUint32();
		const minimumBuildDistanceFromWall = view.readUint8();
		const maxFactoryBuildDistance = view.readUint8();
		const maxPlayerBuildDistance = view.readUint8();

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
		const view = ByteBuffer.fromBinary(packet, true);
		view.offset = 1; // skip over opcode

		const rpcId = view.readUint8();

		const rpcName = rpcIdToName[rpcId];
		if (!rpcName) return {};

		const rpcParams = ServerToClientRpcMap[rpcName];
		const rpc = {
			name: rpcName,
			response: {}
		};

		if (rpcParams.isArray) {
			return rpc; // will implement array logic later
		} else {
			Object.keys(rpcParams).forEach(paramName => {
				const dataType = rpcParams[paramName];
				let data;

				switch (dataType) {
					case 'Boolean':
						data = Boolean(view.readUint8());
						break;

					case 'String':
						data = view.readVString();
						break;

					case 'Uint8':
						data = view.readUint8();
						break;

					case 'Uint16':
						data = view.readUint16();
						break;

					case 'Uint32':
						data = view.readUint32();
						break;

					case 'Uint64':
						data = view.readUint64();
						break;

					case 'OptionalUint32':
						data = view.readUint8() ? view.readUint32() : null;
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

