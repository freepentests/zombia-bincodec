const RpcMap = {
	OutOfSync: {},
	RandomisePartyKey: {},
	CancelPartyRequest: {},
	TogglePartyVisibility: {},
	Respawn: {},
	TogglePrimaryAggro: {},
	LeaveParty: {},
	UpgradeBuilding: { uids: "ArrayUint32" }, 
	SellBuilding: { uids: "ArrayUint32" },
	UpdateHarvesterTarget: { harvesterUid: "Uint32", targetUid: "Uint32" },
	BuyHarvesterDrone: { harvesterUid: "Uint32" },
	SendChatMessage: { message: "String", channel: "String" },
	SetPartyName: { partyName: "String" },
	JoinParty: { partyId: "Uint32" },
	KickMember: { uid: "Uint32" },
	TogglePartyPermission: { permission: "String", uid: "Uint32" },
	PartyRequest: { name: "String", uid: "Uint32" },
	PartyRequestResponse: { accepted: "Boolean", uid: "Uint32" },
	PlaceBuilding: { x: "Uint16", y: "Uint16", type: "String", yaw: "Uint16" },
	BuyTool: { toolName: "String" },
	EquipTool: { toolName: "String" },
	CastSpell: { spellName: "String", x: "Uint32", y: "Uint32" },
	Admin: { password: "String" },
	AdminCommand: { type: "String", uid: "Uint32", reason: "String", x: "Uint32", y: "Uint32" },
};

export default RpcMap;

