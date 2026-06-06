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
	#readVString(packet, offset) {
		const strLen = new DataView(packet).getUint8(offset);
		const stringBuffer = packet.slice(offset + 1, offset + strLen + 1);
		const string = new TextDecoder().decode(new Uint8Array(stringBuffer));

		const newOffset = offset + strLen + 1;

		return [string, newOffset];
	}

	decodeEnterWorld(packet) {
		const view = new DataView(packet);

		const allowed = Boolean(view.getUint8(1));
		if (!allowed) return { allowed: false, reason: this.#readVString(packet, 2)[0] };

		// i really need to start using bytebuffer

		let offset = 2; 
		let name, reconnectSecret;

		[reconnectSecret, offset] = this.#readVString(packet, offset);
		[name, offset] = this.#readVString(packet, offset);
		console.log(offset);

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
		const rpcParams = ServerToClientRpcMap[rpcName];
		const rpc = {
			name: rpcName,
			response: {}
		};


	}

	decodeEntityUpdate(packet) {
	}

	decodeHeartbeat(packet) {
		return {};
	}
}

