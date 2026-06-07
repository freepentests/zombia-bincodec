import BinCodecEncoder from './Codec/BinCodecEncoder.js';
import BinCodecDecoder from './Codec/BinCodecDecoder.js';
import Opcodes from './Codec/Opcodes.js';
import WebSocket from 'ws';
import { EventEmitter } from 'events';

export default class SimpleNetwork extends EventEmitter {
	constructor() {
		super();

		this.ws;
		this.myUid = 1;
		this.currentTickNumber;
		this.outOfSync = false;
		this.knownEntities = [];
		this.modelProps = {
			Projectile: {
				name: 'Projectile',
				index: 0,
				props: [
					'projectileKind',
					'position',
					'tier',
					'yaw'
				],
				entityClass: 'Projectile'
			},
			ArrowTower: {
				name: 'ArrowTower',
				index: 1,
				props: [
					'aimingYaw',
					'firingTick',
					'health',
					'maxHealth',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			CannonTower: {
				name: 'CannonTower',
				index: 2,
				props: [
					'aimingYaw',
					'firingTick',
					'health',
					'maxHealth',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			LightningTower: {
				name: 'LightningTower',
				index: 3,
				props: [
					'firingTick',
					'health',
					'maxHealth',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			MageTower: {
				name: 'MageTower',
				index: 4,
				props: [
					'aimingYaw',
					'firingTick',
					'health',
					'maxHealth',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			RocketTower: {
				name: 'RocketTower',
				index: 5,
				props: [
					'aimingYaw',
					'firingTick',
					'health',
					'maxHealth',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			SawTower: {
				name: 'SawTower',
				index: 6,
				props: [
					'firingTick',
					'health',
					'maxHealth',
					'position',
					'tier',
					'yaw'
				],
				entityClass: 'Building'
			},
			Wall: {
				name: 'Wall',
				index: 7,
				props: [
					'health',
					'maxHealth',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			LargeWall: {
				name: 'LargeWall',
				index: 8,
				props: [
					'health',
					'maxHealth',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			Door: {
				name: 'Door',
				index: 9,
				props: [
					'health',
					'maxHealth',
					'partyId',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			SpikeTrap: {
				name: 'SpikeTrap',
				index: 10,
				props: [
					'partyId',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			Drill: {
				name: 'Drill',
				index: 11,
				props: [
					'health',
					'maxHealth',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			Harvester: {
				name: 'Harvester',
				index: 12,
				props: [
					'droneCount',
					'health',
					'maxHealth',
					'position',
					'targetResourceUid',
					'tier',
					'yaw'
				],
				entityClass: 'Building'
			},
			HarvesterDrone: {
				name: 'HarvesterDrone',
				index: 13,
				props: [
					'currentHarvestStage',
					'health',
					'maxHealth',
					'position',
					'tier',
					'yaw'
				],
				entityClass: 'Npc'
			},
			ResourcePickup: {
				name: 'ResourcePickup',
				index: 14,
				props: [
					'position',
					'resourceAmount',
					'resourcePickupType'
				],
				entityClass: 'ResourcePickup'
			},
			Factory: {
				name: 'Factory',
				index: 15,
				props: [
					'aggroEnabled',
					'health',
					'maxHealth',
					'partyId',
					'position',
					'tier'
				],
				entityClass: 'Building'
			},
			Player: {
				name: 'Player',
				index: 16,
				privateProps: [
					'aimingYaw',
					'dead',
					'firingTick',
					'invulnerable',
					'gold',
					'health',
					'lastDamagedTick',
					'maxHealth',
					'name',
					'partyId',
					'position',
					'stone',
					'tokens',
					'wave',
					'weaponName',
					'weaponTier',
					'wood',
					'zombieShieldHealth',
					'zombieShieldMaxHealth'
				],
				publicProps: [
					'aimingYaw',
					'dead',
					'firingTick',
					'invulnerable',
					'health',
					'lastDamagedTick',
					'maxHealth',
					'name',
					'position',
					'weaponName',
					'weaponTier',
					'zombieShieldHealth',
					'zombieShieldMaxHealth'
				],
				entityClass: 'Player'
			},
			Resource: {
				name: 'Resource',
				index: 17,
				props: [
					'hits',
					'position',
					'radius',
					'resourceType',
					'resourceVariant',
					'yaw'
				],
				entityClass: 'Resource'
			},
			Zombie: {
				name: 'Zombie',
				index: 18,
				props: [
					'colour',
					'health',
					'maxHealth',
					'position',
					'tier',
					'yaw'
				],
				entityClass: 'Zombie'
			},
			SpellIndicator: {
				name: 'SpellIndicator',
				index: 19,
				props: [
					'position',
					'radius',
					'spellType'
				],
				entityClass: 'Spell'
			},
			Visualiser: {
				name: 'Visualiser',
				index: 20,
				props: [
					'position',
					'yaw'
				],
				entityClass: 'Visualiser'
			}
		};
		this.propDataTypes = {
			aimingYaw: 'Uint16',
			aggroEnabled: 'Boolean',
			currentHarvestStage: 'Uint8',
			dead: 'Boolean',
			droneCount: 'Uint8',
			entityClass: 'String',
			experience: 'Uint16',
			firingTick: 'Uint32',
			hatName: 'String',
			health: 'Uint32',
			hits: 'ArrayUint32',
			lastPetDamage: 'Uint16',
			lastPetDamageTarget: 'Uint16',
			lastPetDamageTick: 'Uint32',
			lastDamagedTick: 'Uint32',
			maxHealth: 'Uint32',
			gold: 'Uint32',
			model: 'String',
			name: 'String',
			partyId: 'Uint32',
			petUid: 'Uint64',
			position: 'Vector2',
			shortPosition: 'Uint16',
			spellType: 'String',
			radius: 'Uint16',
			resourceAmount: 'Uint32',
			resourcePickupType: 'Uint8',
			resourceType: 'String',
			resourceVariant: 'String',
			stone: 'Uint32',
			targetResourceUid: 'Uint32',
			tier: 'Uint8',
			tokens: 'Uint32',
			wave: 'Uint32',
			weaponName: 'String',
			weaponTier: 'Uint8',
			wood: 'Uint32',
			yaw: 'Uint16',
			zombieShieldHealth: 'Uint32',
			zombieShieldMaxHealth: 'Uint32',
			colour: 'ZombieColour',
			scale: 'Uint8',
			invulnerable: 'Boolean',
			projectileKind: 'ProjectileKind'
		}
	}

	init(...args) {
		if (this.ws) return this;

		this.ws = new WebSocket(...args);
		this.ws.binaryType = 'arraybuffer';

		this.ws.addEventListener('message', this.onWsMessage.bind(this));

		return this;
	}

	onWsMessage(msg) {
		const data = msg.data;
		const opcode = new Uint8Array(data)[0];

		switch (opcode) {
			case +Opcodes.JoinGame:
				{
					const decodedData = this.decodeEnterWorld(data)
					this.currentTickNumber = decodedData.startingTick;
					this.myUid = decodedData.uid;
					this.emit('enterWorldResponse', decodedData);
					break;
				}

			case +Opcodes.Rpc:
				this.emit('rpc', this.decodeRpc(data));
				break;

			case +Opcodes.Heartbeat:
				this.emit('heartbeat', this.decodeHeartbeat(data));
				break;
			
			/*
			case +Opcodes.EntityUpdate:
				this.emit('entityUpdate', this.decodeEntityUpdate(data));
				break;
			*/
		}
	}

	sendEnterWorld(enterWorldObj) {
		if (this.ws.readyState !== 1) return;

		this.ws.send(this.encodeEnterWorld(enterWorldObj.username, enterWorldObj.partyKey, enterWorldObj.reconnectSecret));
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

const mixin = (target, source) => {
	Object.getOwnPropertyNames(source.prototype).forEach(name => {
		if (name != 'constructor') {
			target.prototype[name] = source.prototype[name];
		}
	});
}


mixin(SimpleNetwork, BinCodecEncoder);
mixin(SimpleNetwork, BinCodecDecoder);

