// Contract Types and Constants for LiskFund DApp (Reskin dari LiskGarden)

// Tahapan Proyek (menggantikan GrowthStage)
export enum GrowthStage {
  SEED = 0, // Nama enum tetap sama: SEED, tapi artinya 'FUNDING'
  SPROUT = 1, // Nama enum tetap sama: SPROUT, tapi artinya 'SUCCESSFUL'
  GROWING = 2, // Nama enum tetap sama: GROWING, tapi artinya 'EXPIRED' (logika bisa beda)
  BLOOMING = 3, // Nama enum tetap sama: BLOOMING, tapi artinya 'CLAIMED'
}

// Plant interface (biarkan nama interface, tapi artikan sebagai Proyek)
export interface Plant {
  id: bigint;
  owner: string; // address (Pemilik Proyek)
  stage: GrowthStage; // Gunakan enum di atas
  plantedDate: bigint; // timestamp (Tanggal Mulai Proyek)
  lastWatered: bigint; // timestamp (Tanggal Pendanaan Terakhir)
  waterLevel: number; // uint8 0-100 (Persentase Terdanai ATAU Sisa Waktu)
  exists: boolean;
  isDead: boolean; // True jika proyek Gagal/Kadaluarsa
}

// Nama tampilan stage (sesuaikan dengan logika UI Anda)
export const STAGE_NAMES = {
  [GrowthStage.SEED]: "Funding",
  [GrowthStage.SPROUT]: "Successful",
  [GrowthStage.GROWING]: "Expired", // Sesuaikan ini jika logika Anda beda
  [GrowthStage.BLOOMING]: "Claimed",
} as const;

// Contract constants
export const PLANT_PRICE = "0.001"; // ETH (Biaya Pembuatan Proyek)
export const HARVEST_REWARD = "0.003"; // ETH (Target Pendanaan)
export const STAGE_DURATION = 60; // 1 menit (Durasi Kampanye per stage)
export const WATER_DEPLETION_TIME = 30; // (Interval kalkulasi waktu/kegagalan)
export const WATER_DEPLETION_RATE = 20; // (Jumlah 'kerusakan' per interval)

// Contract address (tetap sama)
export const LISK_GARDEN_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

// Simplified Contract ABI (Biarkan ABI tetap sama, karena backend Anda yang urus)
export const LISK_GARDEN_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "plantId",
        type: "uint256",
      },
    ],
    name: "PlantDied",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "plantId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "PlantHarvested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "plantId",
        type: "uint256",
      },
    ],
    name: "PlantSeeded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "plantId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "newWaterLevel",
        type: "uint8",
      },
    ],
    name: "PlantWatered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "plantId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum LiskGarden.GrowthStage",
        name: "newStage",
        type: "uint8",
      },
    ],
    name: "StageAdvanced",
    type: "event",
  },
  {
    inputs: [],
    name: "HARVEST_REWARD",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PLANT_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "STAGE_DURATION",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WATER_DEPLETION_RATE",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WATER_DEPLETION_TIME",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "plantId", type: "uint256" }],
    name: "calculateWaterLevel",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "plantId", type: "uint256" }],
    name: "getPlant",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "owner", type: "address" },
          {
            internalType: "enum LiskGarden.GrowthStage",
            name: "stage",
            type: "uint8",
          },
          { internalType: "uint256", name: "plantedDate", type: "uint256" },
          { internalType: "uint256", name: "lastWatered", type: "uint256" },
          { internalType: "uint8", name: "waterLevel", type: "uint8" },
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "bool", name: "isDead", type: "bool" },
        ],
        internalType: "struct LiskGarden.Plant",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserPlants",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "plantId", type: "uint256" }],
    name: "harvestPlant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "plantCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "plantSeed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "plants",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "owner", type: "address" },
      {
        internalType: "enum LiskGarden.GrowthStage",
        name: "stage",
        type: "uint8",
      },
      { internalType: "uint256", name: "plantedDate", type: "uint256" },
      { internalType: "uint256", name: "lastWatered", type: "uint256" },
      { internalType: "uint8", name: "waterLevel", type: "uint8" },
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "bool", name: "isDead", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "plantId", type: "uint256" }],
    name: "updatePlantStage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userPlants",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "plantId", type: "uint256" }],
    name: "waterPlant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
] as const;
