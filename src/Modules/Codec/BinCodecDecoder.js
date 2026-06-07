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

	readRpcParams(response, rpcParams, view) {
		Object.keys(rpcParams).forEach(paramName => {
			if (paramName === 'isArray')  return;

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

			response[paramName] = data;
		});
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
			const elements = [];
			const numElements = view.readUint16();

			for (let i = 0; i < numElements; i++) {
				let response = {};

				this.readRpcParams(response, rpcParams, view);

				elements.push(response);
			}

			return (rpc.response = elements, rpc);
		} else {
			this.readRpcParams(rpc.response, rpcParams, view);
		}

		return rpc;
	}

	decodeEntityUpdate(packet) {
		// ALL OF THIS IS BROKEN AND UNDERDEVELOPED

		// the properties accessed in this method belong to the Network class, so running decodeEntityUpdate with this class alone will not work; you will need to use inheritance or mixins so that this method will be able to access the properties defined by Network
		const view = ByteBuffer.fromBinary(packet, true);
		view.offset = 1; // skip over opcode

		let currentTick = ++this.currentTickNumber;
		let reSync = Boolean(view.readUint8())
		if (reSync) {
			currentTick = view.readUint32();
			this.currentTickNumber = currentTick
			this.outOfSync = false;
		} else if (!reSync && this.outOfSync) {
			return { unsynced: true };
		}

		const entities = {};
		this.knownEntities.forEach(entityId => {
			entities[entityId] = true;
		});

		const numEntitiesOutOfView = view.readVarint32();
		for (let i = 0; i < numEntitiesOutOfView; i++) {
			const entityId = view.readUint32();
			delete entities[entityId];
		}

		const numNewEntities = view.readVarint32();
		for (let i = 0; i < numNewEntities; i++) {
			const entityId = view.readUint32();
			const modelPropIndex = view.readUint8();
			const modelProp = Object.values(this.modelProps)[modelPropIndex];	

			entities[entityId] = {
				uid: entityId,
				model: modelProp.name,
				entityClass: modelProp.entityClass
			};

			const props = entityId === this.myUid ? modelProp.privateProps : (modelProp.props || modelProp.publicProps);

			props.forEach(propName => {
				const dataType = this.propDataTypes[propName]; // game.network.propTypes
				this.decodeEntityProperties(entities, entityId, view, propName, dataType);
			});

			console.log(entities);
		}

		this.knownEntities = Object.keys(entities);
		return {
			tick: currentTick,
			entities,
		};
	}

	decodeEntityProperties(entities, entityId, view, propName, dataType) { // view is bytebuffer
		if (propName === 'shortPosition') {
			return void (entity[entityId].shortPosition = {
				x: view.readUint8() - 128,
				y: view.readUint8() - 128
			})
		}

		const zombieColours = [
			'Grey',
			'Green',
			'Blue',
			'Red'
		];

		const projectileKinds = [
			'Arrow',
			'Cannon',
			'Dynamite',
			'Mage',
			'Rocket'
		];

		switch(dataType) {
			case 'Boolean':
				entities[entityId][propName] = Boolean(view.readUint8());
				break;

			case 'String':
				entities[entityId][propName] = view.readVString();
				break;

			case 'ProjectileKind':
				entities[entityId][propName] = projectileKinds[view.readUint8()];
				break;

			case 'ZombieColour': // imagine using the british spelling, i'm british myself and i don't even use the british spelling
				entities[entityId][propName] = zombieColours[view.readUint8()];
				break;

			case 'Vector2':
				entities[entityId][propName] = {
					x: view.readUint16(),
					y: view.readUint16()
				};
				break;

			case 'Uint64':
				entities[entityId][propName] = view.readUint64();
				break;

			case 'Uint32':
				entities[entityId][propName] = view.readUint32();
				break;

			case 'Uint16':
				entities[entityId][propName] = view.readUint16();
				break;

			case 'Uint8':
				entities[entityId][propName] = view.readUint8();
				break;
		}
	}

	decodeHeartbeat(packet) {
		return {};
	}
}

