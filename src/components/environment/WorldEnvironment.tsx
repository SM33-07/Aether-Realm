"use client";

import EnvironmentModel, {
  EnvironmentModelProps,
} from "./EnvironmentModel";
import IslandCliffSkirt from "./IslandCliffSkirt";
import ZoneAtmosphereMotes from "./ZoneAtmosphereMotes";
import CobblestoneRoadNetwork from "./CobblestoneRoadNetwork";

type Placement = EnvironmentModelProps & { id: string };

const BASE = "/models/environment/";
const POLYTOPE = "/models/environment/polytope/";
const SLAVIC = "/models/environment/slavic/";
const TAVERN = "/models/environment/tavern/";

export const WORLD_PLACEMENTS: Placement[] = [
  /* =========================================================================
     1. COMPLETE COBBLESTONE ROAD NETWORK (Generated seamlessly via CobblestoneRoadNetwork)
     ========================================================================= */

  /* =========================================================================
     2. CENTRAL SPAWN PLAZA (Way-markers & Transition Clusters)
     ========================================================================= */
  {
    id: "hub-marker-nw",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [-1.2, 0, -0.4],
    rotationY: 0.4,
    scale: 0.5,
  },
  {
    id: "hub-shrub-nw",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-1.4, 0, -0.7],
    rotationY: 0.8,
    scale: 0.22,
    isVegetation: true,
  },
  {
    id: "hub-marker-sw",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [-0.5, 0, 1.2],
    rotationY: -0.6,
    scale: 0.45,
  },
  {
    id: "hub-poppy-ne",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [1.1, 0, -0.5],
    rotationY: 0.3,
    scale: 0.24,
    isVegetation: true,
  },
  {
    id: "hub-marker-se",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [1.2, 0, 0.8],
    rotationY: 0.9,
    scale: 0.45,
  },

  /* =========================================================================
     3. THE FORGE [6, 0, 4] — The Artisan Workshop Clearing (Amber)
     ========================================================================= */
  // Framing trees
  {
    id: "forge-pine-east",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [8.6, 0, 0.6],
    rotationY: 0.75,
    scale: 0.2,
    isVegetation: true,
  },
  {
    id: "forge-pine-ne",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [8.8, 0, -3.8],
    rotationY: -0.55,
    scale: 0.18,
    isVegetation: true,
  },
  {
    id: "forge-pine-nw",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [2.2, 0, 8.8],
    rotationY: 1.1,
    scale: 0.19,
    isVegetation: true,
  },
  {
    id: "forge-apple-east",
    path: `${POLYTOPE}PT_Fruit_Tree_01_apples.glb`,
    position: [8.8, 0, 5.0],
    rotationY: 0.6,
    scale: 0.22,
    isVegetation: true,
  },
  {
    id: "forge-fruit-north",
    path: `${BASE}PT_Fruit_Tree_01_green.glb`,
    position: [4.6, 0, 8.8],
    rotationY: -0.4,
    scale: 0.2,
    isVegetation: true,
  },
  // Standing stones & formations
  {
    id: "forge-menhir-west",
    path: `${BASE}PT_Menhir_Rock_02.glb`,
    position: [3.6, 0, 7.5],
    rotationY: -0.3,
    scale: 0.54,
  },
  {
    id: "forge-menhir-east",
    path: `${BASE}PT_Menhir_Rock_02.glb`,
    position: [8.8, 0, 6.9],
    rotationY: 0.45,
    scale: 0.52,
  },
  {
    id: "forge-rock-nw",
    path: `${BASE}PT_Generic_Rock_01.glb`,
    position: [3.0, 0, 8.8],
    rotationY: 0.35,
    scale: 2.0,
  },
  {
    id: "forge-rock-ne",
    path: `${BASE}PT_Generic_Rock_01.glb`,
    position: [8.7, 0, 8.5],
    rotationY: 1.4,
    scale: 1.8,
  },
  {
    id: "forge-ore-east",
    path: `${BASE}PT_Ore_Rock_01.glb`,
    position: [7.4, 0, 2.2],
    rotationY: -0.25,
    scale: 0.9,
  },
  {
    id: "forge-river-w",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [1.0, 0, 7.8],
    rotationY: 0.6,
    scale: 0.9,
  },
  {
    id: "forge-river-e",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [6.8, 0, 8.7],
    rotationY: -0.5,
    scale: 0.85,
  },
  // Workshop props with calibrated vertical grounding
  {
    id: "forge-crate-w",
    path: `${SLAVIC}EA03_Prop_Container_Crate_01a.glb`,
    position: [5.0, 0.35, 2.6],
    rotationY: 0.2,
    scale: 0.55,
  },
  {
    id: "forge-barrel-standing",
    path: `${TAVERN}Standing_Barrel.glb`,
    position: [7.4, 0.54, 2.8],
    rotationY: 0,
    scale: 0.24,
  },
  {
    id: "forge-barrel-slavic",
    path: `${SLAVIC}EA03_Prop_Container_Barrel_01d.glb`,
    position: [7.8, 0.44, 3.4],
    rotationY: -0.3,
    scale: 0.55,
  },
  {
    id: "forge-chest",
    path: `${TAVERN}Wooden_Chest.glb`,
    position: [4.8, 0.35, 5.6],
    rotationY: 0.65,
    scale: 0.28,
  },
  {
    id: "forge-bench",
    path: `${SLAVIC}EA03_Prop_Town_Bench_01a.glb`,
    position: [7.6, 0.23, 5.2],
    rotationY: -0.85,
    scale: 0.55,
  },
  {
    id: "forge-stool",
    path: `${TAVERN}Standard_Stool.glb`,
    position: [6.8, 0.22, 4.8],
    rotationY: 0.3,
    scale: 0.4,
  },
  {
    id: "forge-fence",
    path: `${POLYTOPE}PT_Modular_Fence_Wood_01.glb`,
    position: [8.6, 0, 2.8],
    rotationY: 1.57,
    scale: 0.55,
  },
  // Ground vegetation
  {
    id: "forge-shrub-w",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [4.6, 0, 6.0],
    rotationY: 0.5,
    scale: 0.34,
    isVegetation: true,
  },
  {
    id: "forge-shrub-approach",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [6.2, 0, 1.8],
    rotationY: -0.4,
    scale: 0.28,
    isVegetation: true,
  },
  {
    id: "forge-grass-e",
    path: `${BASE}PT_Grass_02.glb`,
    position: [7.4, 0, 6.2],
    rotationY: 0.2,
    scale: 0.4,
    isVegetation: true,
  },
  {
    id: "forge-poppy",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [5.2, 0, 6.8],
    rotationY: 0.7,
    scale: 0.28,
    isVegetation: true,
  },

  /* =========================================================================
     4. THE ARCHIVES [-5, 0, 8] — The Ancient Stone Sanctuary (Cyan)
     ========================================================================= */
  // Standing stone henge framing the cyan crystal
  {
    id: "archives-menhir-sw",
    path: `${BASE}PT_Menhir_Rock_02.glb`,
    position: [-6.8, 0, 6.8],
    rotationY: 0.4,
    scale: 0.56,
  },
  {
    id: "archives-menhir-se",
    path: `${BASE}PT_Menhir_Rock_02.glb`,
    position: [-3.2, 0, 7.0],
    rotationY: -0.5,
    scale: 0.58,
  },
  {
    id: "archives-menhir-nw",
    path: `${BASE}PT_Menhir_Rock_02.glb`,
    position: [-6.4, 0, 9.4],
    rotationY: 0.8,
    scale: 0.52,
  },
  {
    id: "archives-menhir-ne",
    path: `${BASE}PT_Menhir_Rock_02.glb`,
    position: [-3.4, 0, 9.5],
    rotationY: -0.7,
    scale: 0.54,
  },
  // Ancient stone archway
  {
    id: "archives-stone-arch",
    path: `${SLAVIC}EA03_Fence_WallGate_01a.glb`,
    position: [-5.0, 0, 9.8],
    rotationY: 0,
    scale: 0.45,
  },
  // Boulders & river rocks
  {
    id: "archives-rock-west",
    path: `${BASE}PT_Generic_Rock_01.glb`,
    position: [-7.8, 0, 8.2],
    rotationY: 0.5,
    scale: 2.1,
  },
  {
    id: "archives-rock-east",
    path: `${BASE}PT_Generic_Rock_01.glb`,
    position: [-2.4, 0, 8.6],
    rotationY: -1.2,
    scale: 1.7,
  },
  {
    id: "archives-ore-split",
    path: `${POLYTOPE}PT_Ore_Rock_01_split.glb`,
    position: [-3.0, 0, 6.2],
    rotationY: -0.4,
    scale: 0.7,
  },
  {
    id: "archives-river-sw",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [-6.0, 0, 6.0],
    rotationY: 0.8,
    scale: 0.9,
  },
  {
    id: "archives-river-nw",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [-7.4, 0, 9.2],
    rotationY: -0.4,
    scale: 0.85,
  },
  // Trees & botanical accents
  {
    id: "archives-pine-outer",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [-8.6, 0, 7.4],
    rotationY: 0.2,
    scale: 0.21,
    isVegetation: true,
  },
  {
    id: "archives-bush-w",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-7.4, 0, 6.2],
    rotationY: 0.3,
    scale: 0.32,
    isVegetation: true,
  },
  {
    id: "archives-shrub-e",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-2.6, 0, 7.2],
    rotationY: -0.6,
    scale: 0.35,
    isVegetation: true,
  },
  {
    id: "archives-bench",
    path: `${SLAVIC}EA03_Prop_Town_Bench_01a.glb`,
    position: [-3.6, 0.23, 8.6],
    rotationY: -1.1,
    scale: 0.5,
  },
  {
    id: "archives-barrel",
    path: `${TAVERN}Standing_Barrel.glb`,
    position: [-6.2, 0.54, 9.5],
    rotationY: 0.2,
    scale: 0.22,
  },
  {
    id: "archives-mushroom-1",
    path: `${BASE}PT_Caesars_Mushroom_01.glb`,
    position: [-5.8, 0, 7.2],
    rotationY: 0.4,
    scale: 0.9,
  },
  {
    id: "archives-mushroom-2",
    path: `${BASE}PT_Caesars_Mushroom_01.glb`,
    position: [-4.0, 0, 8.8],
    rotationY: -0.8,
    scale: 0.85,
  },
  {
    id: "archives-grass-c",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-3.8, 0, 7.5],
    rotationY: 1.1,
    scale: 0.38,
    isVegetation: true,
  },

  /* =========================================================================
     5. THE ORACLE [-8, 0, -6] — The Secluded Pine Sanctum (Violet)
     ========================================================================= */
  // Mature & ancient pine grove
  {
    id: "oracle-pine-w",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [-9.4, 0, -4.0],
    rotationY: -0.3,
    scale: 0.22,
    isVegetation: true,
  },
  {
    id: "oracle-pine-sw",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [-9.2, 0, -8.2],
    rotationY: 0.8,
    scale: 0.23,
    isVegetation: true,
  },
  {
    id: "oracle-pine-south",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [-6.4, 0, -8.8],
    rotationY: 1.4,
    scale: 0.19,
    isVegetation: true,
  },
  {
    id: "oracle-pine-dead",
    path: `${POLYTOPE}PT_Pine_Tree_03_dead.glb`,
    position: [-9.5, 0, -6.2],
    rotationY: 0.5,
    scale: 0.2,
    isVegetation: true,
  },
  {
    id: "oracle-pine-cut",
    path: `${POLYTOPE}PT_Pine_Tree_03_dead_cut.glb`,
    position: [-5.8, 0, -4.6],
    rotationY: -0.4,
    scale: 0.2,
    isVegetation: true,
  },
  {
    id: "oracle-pine-logs",
    path: `${POLYTOPE}PT_Pine_Tree_03_logs.glb`,
    position: [-8.6, 0, -4.4],
    rotationY: 0.8,
    scale: 0.45,
  },
  {
    id: "oracle-pine-stump",
    path: `${POLYTOPE}PT_Pine_Tree_03_stump.glb`,
    position: [-7.2, 0, -8.0],
    rotationY: -0.3,
    scale: 0.65,
  },
  // Secluded outpost silhouette
  {
    id: "oracle-shrine-shed",
    path: `${SLAVIC}EA03_Village_OutBuilding_Convenience_01a.glb`,
    position: [-9.0, 0, -7.5],
    rotationY: 0.35,
    scale: 0.48,
  },
  // Standing monoliths & boulders
  {
    id: "oracle-menhir-east",
    path: `${BASE}PT_Menhir_Rock_02.glb`,
    position: [-6.8, 0, -7.2],
    rotationY: -0.4,
    scale: 0.58,
  },
  {
    id: "oracle-menhir-west",
    path: `${BASE}PT_Menhir_Rock_02.glb`,
    position: [-8.8, 0, -7.8],
    rotationY: 0.6,
    scale: 0.52,
  },
  {
    id: "oracle-rock-sw",
    path: `${BASE}PT_Generic_Rock_01.glb`,
    position: [-8.2, 0, -8.6],
    rotationY: 0.9,
    scale: 1.9,
  },
  {
    id: "oracle-ore-split",
    path: `${POLYTOPE}PT_Ore_Rock_01_split.glb`,
    position: [-8.6, 0, -7.0],
    rotationY: 0.5,
    scale: 0.65,
  },
  {
    id: "oracle-river-east",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [-6.5, 0, -4.8],
    rotationY: -0.7,
    scale: 0.85,
  },
  // Botanical & fungal details
  {
    id: "oracle-mushroom-1",
    path: `${BASE}PT_Caesars_Mushroom_01.glb`,
    position: [-7.4, 0, -5.2],
    rotationY: 0.2,
    scale: 1.1,
  },
  {
    id: "oracle-mushroom-2",
    path: `${BASE}PT_Caesars_Mushroom_01.glb`,
    position: [-8.6, 0, -5.4],
    rotationY: 0.9,
    scale: 0.95,
  },
  {
    id: "oracle-dead-shrub",
    path: `${POLYTOPE}PT_Generic_Shrub_01_dead.glb`,
    position: [-7.8, 0, -6.8],
    rotationY: -0.2,
    scale: 0.32,
    isVegetation: true,
  },
  {
    id: "oracle-slavic-grass",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-6.8, 0, -5.8],
    rotationY: 0.5,
    scale: 0.44,
    isVegetation: true,
  },

  /* =========================================================================
     6. THE GATEWAY [9, 0, -8] — The Dimensional Threshold & Bridge (Pink)
     ========================================================================= */
  // Ceremonial bridge platform (cobblestone road arrives right at bridge entrance)
  {
    id: "gateway-bridge",
    path: `${POLYTOPE}PT_Wooden_Bridge_02.glb`,
    position: [7.8, 0, -6.4],
    rotationY: -0.75,
    scale: 0.52,
  },
  {
    id: "gateway-fence-east",
    path: `${POLYTOPE}PT_Modular_Fence_Wood_01.glb`,
    position: [9.4, 0, -6.2],
    rotationY: 0.8,
    scale: 0.5,
  },
  {
    id: "gateway-fence-west",
    path: `${POLYTOPE}PT_Modular_Fence_Wood_02.glb`,
    position: [6.6, 0, -7.2],
    rotationY: -0.6,
    scale: 0.5,
  },
  {
    id: "gateway-fence-approach",
    path: `${POLYTOPE}PT_Modular_Fence_Wood_03.glb`,
    position: [5.8, 0, -6.6],
    rotationY: -0.7,
    scale: 0.48,
  },
  // Blossom trees in bloom
  {
    id: "gateway-plum-tree",
    path: `${POLYTOPE}PT_Fruit_Tree_01_plums.glb`,
    position: [9.5, 0, -9.2],
    rotationY: 0.4,
    scale: 0.22,
    isVegetation: true,
  },
  {
    id: "gateway-pear-tree",
    path: `${POLYTOPE}PT_Fruit_Tree_01_pears.glb`,
    position: [7.2, 0, -9.0],
    rotationY: -0.5,
    scale: 0.21,
    isVegetation: true,
  },
  {
    id: "gateway-fruit-north",
    path: `${BASE}PT_Fruit_Tree_01_green.glb`,
    position: [9.4, 0, -4.5],
    rotationY: 1.1,
    scale: 0.2,
    isVegetation: true,
  },
  // Beacons & grounded tavern props
  {
    id: "gateway-torch",
    path: `${TAVERN}Iron_Torch_Bracket.glb`,
    position: [7.0, 0.3, -7.6],
    rotationY: 0.4,
    scale: 0.5,
  },
  {
    id: "gateway-candle",
    path: `${TAVERN}Single_Candle_1.glb`,
    position: [7.0, 0.58, -7.6],
    rotationY: 0,
    scale: 0.5,
  },
  {
    id: "gateway-barrel",
    path: `${SLAVIC}EA03_Prop_Container_Barrel_01d.glb`,
    position: [6.8, 0.44, -8.0],
    rotationY: 0.1,
    scale: 0.55,
  },
  {
    id: "gateway-crate",
    path: `${SLAVIC}EA03_Prop_Container_Crate_01a.glb`,
    position: [7.4, 0.35, -8.4],
    rotationY: 0.3,
    scale: 0.5,
  },
  // Flowering grounds & rocks
  {
    id: "gateway-poppy-1",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [8.2, 0, -7.8],
    rotationY: 0.3,
    scale: 0.32,
    isVegetation: true,
  },
  {
    id: "gateway-poppy-2",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [9.6, 0, -7.2],
    rotationY: -0.5,
    scale: 0.28,
    isVegetation: true,
  },
  {
    id: "gateway-grass-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [8.6, 0, -8.6],
    rotationY: 0.8,
    scale: 0.42,
    isVegetation: true,
  },
  {
    id: "gateway-rock-1",
    path: `${BASE}PT_Generic_Rock_01.glb`,
    position: [8.8, 0, -9.6],
    rotationY: 0.3,
    scale: 1.8,
  },
  {
    id: "gateway-river-rocks",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [6.6, 0, -8.6],
    rotationY: -0.8,
    scale: 0.85,
  },

  /* =========================================================================
     7. TRANSITIONAL WILDERNESS & PERIMETER BOUNDARY SILHOUETTES
     ========================================================================= */
  // ── South Meadow (Between Forge and Archives) ──
  {
    id: "south-ore-split",
    path: `${POLYTOPE}PT_Ore_Rock_01_split.glb`,
    position: [2.4, 0, 6.5],
    rotationY: 0.6,
    scale: 0.75,
  },
  {
    id: "south-mushroom",
    path: `${BASE}PT_Caesars_Mushroom_01.glb`,
    position: [2.1, 0, 6.8],
    rotationY: 0.2,
    scale: 0.85,
  },
  {
    id: "south-poppy",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [1.5, 0, 6.2],
    rotationY: 0.5,
    scale: 0.26,
    isVegetation: true,
  },
  {
    id: "south-grass",
    path: `${BASE}PT_Grass_02.glb`,
    position: [2.8, 0, 7.2],
    rotationY: -0.4,
    scale: 0.36,
    isVegetation: true,
  },
  {
    id: "bound-stump-south",
    path: `${POLYTOPE}PT_Fruit_Tree_01_stump.glb`,
    position: [0.0, 0, 9.4],
    rotationY: 0.2,
    scale: 0.7,
  },
  {
    id: "bound-rock-south",
    path: `${BASE}PT_Generic_Rock_01.glb`,
    position: [0.8, 0, 9.2],
    rotationY: 1.1,
    scale: 1.8,
  },

  // ── West Forest Ridge (Between Archives and Oracle) ──
  {
    id: "west-slavic-tree",
    path: `${SLAVIC}EA03_Nature_Tree_02b.glb`,
    position: [-8.6, 0, 2.2],
    rotationY: 0.45,
    scale: 0.4,
    isVegetation: true,
  },
  {
    id: "west-logs",
    path: `${POLYTOPE}PT_Fruit_Tree_01_logs.glb`,
    position: [-7.8, 0, 1.8],
    rotationY: 0.7,
    scale: 0.48,
  },
  {
    id: "west-fence",
    path: `${POLYTOPE}PT_Modular_Fence_Wood_02.glb`,
    position: [-6.8, 0, 0.5],
    rotationY: 1.2,
    scale: 0.5,
  },
  {
    id: "bound-pine-west",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [-9.6, 0, 0.0],
    rotationY: 0.5,
    scale: 0.2,
    isVegetation: true,
  },
  {
    id: "bound-pine-midwest",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [-4.6, 0, 0.6],
    rotationY: -0.35,
    scale: 0.2,
    isVegetation: true,
  },
  {
    id: "bound-shrub-sw",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-2.1, 0, 5.7],
    rotationY: 0.5,
    scale: 0.34,
    isVegetation: true,
  },

  // ── North Woods (Between Oracle and Gateway) ──
  {
    id: "north-village-shed",
    path: `${SLAVIC}EA03_Village_OutBuilding_Shed_01a.glb`,
    position: [3.2, 0, -9.0],
    rotationY: -0.3,
    scale: 0.45,
  },
  {
    id: "north-pine-cut",
    path: `${POLYTOPE}PT_Pine_Tree_03_green_cut.glb`,
    position: [-3.6, 0, -8.6],
    rotationY: 0.6,
    scale: 0.2,
    isVegetation: true,
  },
  {
    id: "north-river-rocks",
    path: `${BASE}PT_River_Rock_Pile_02.glb`,
    position: [-2.5, 0, -7.8],
    rotationY: -0.5,
    scale: 0.8,
  },
  {
    id: "north-shrub",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [4.5, 0, -8.5],
    rotationY: 0.3,
    scale: 0.32,
    isVegetation: true,
  },
  {
    id: "bound-pine-north",
    path: `${BASE}PT_Pine_Tree_03_green.glb`,
    position: [0.0, 0, -9.6],
    rotationY: 0.8,
    scale: 0.21,
    isVegetation: true,
  },
  {
    id: "bound-fruit-midnorth",
    path: `${BASE}PT_Fruit_Tree_01_green.glb`,
    position: [-1.5, 0, -7.3],
    rotationY: 0.8,
    scale: 0.22,
    isVegetation: true,
  },

  // ── East Ridge Wayside (Between Gateway and Forge) ──
  {
    id: "east-bench-wayside",
    path: `${TAVERN}Long_Wooden_Bench.glb`,
    position: [7.6, 0.22, -1.6],
    rotationY: 1.1,
    scale: 0.48,
  },
  {
    id: "east-barrel-wayside",
    path: `${TAVERN}Standing_Barrel.glb`,
    position: [8.2, 0.54, -1.2],
    rotationY: 0.3,
    scale: 0.24,
  },
  {
    id: "east-shrub",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [7.8, 0, -0.6],
    rotationY: 0.5,
    scale: 0.3,
    isVegetation: true,
  },
  {
    id: "east-poppy",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [8.4, 0, -2.2],
    rotationY: -0.4,
    scale: 0.26,
    isVegetation: true,
  },

  /* =========================================================================
     8. MEADOW VEGETATION & UNDERGROWTH: WILD GRASS & BUSHES IN OPEN GRASS
     ========================================================================= */

  // ── Sector A: North Meadow Clearing (Between Oracle & Gateway Roads) ──
  {
    id: "meadow-n-grass-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-0.8, 0, -2.2],
    rotationY: 0.3,
    scale: 0.42,
    isVegetation: true,
  },
  {
    id: "meadow-n-grass-clump-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [1.2, 0, -2.8],
    rotationY: -0.6,
    scale: 0.46,
    isVegetation: true,
  },
  {
    id: "meadow-n-bush-1",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-2.2, 0, -3.5],
    rotationY: 0.8,
    scale: 0.28,
    isVegetation: true,
  },
  {
    id: "meadow-n-poppy-1",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [-1.4, 0, -3.8],
    rotationY: -0.2,
    scale: 0.25,
    isVegetation: true,
  },
  {
    id: "meadow-n-grass-2",
    path: `${BASE}PT_Grass_02.glb`,
    position: [0.4, 0, -4.5],
    rotationY: 1.1,
    scale: 0.40,
    isVegetation: true,
  },
  {
    id: "meadow-n-bush-2",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [2.4, 0, -3.8],
    rotationY: -0.7,
    scale: 0.30,
    isVegetation: true,
  },
  {
    id: "meadow-n-grass-3",
    path: `${BASE}PT_Grass_02.glb`,
    position: [3.2, 0, -2.5],
    rotationY: 0.4,
    scale: 0.45,
    isVegetation: true,
  },
  {
    id: "meadow-n-poppy-2",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [2.8, 0, -4.6],
    rotationY: 0.5,
    scale: 0.24,
    isVegetation: true,
  },
  {
    id: "meadow-n-grass-clump-2",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-3.8, 0, -2.4],
    rotationY: 1.3,
    scale: 0.44,
    isVegetation: true,
  },
  {
    id: "meadow-n-bush-3",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-0.2, 0, -6.0],
    rotationY: -0.4,
    scale: 0.30,
    isVegetation: true,
  },
  {
    id: "meadow-n-grass-4",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-1.6, 0, -5.6],
    rotationY: 0.9,
    scale: 0.42,
    isVegetation: true,
  },
  {
    id: "meadow-n-grass-clump-3",
    path: `${BASE}PT_Grass_02.glb`,
    position: [1.8, 0, -6.2],
    rotationY: -1.0,
    scale: 0.45,
    isVegetation: true,
  },
  {
    id: "meadow-n-shroom",
    path: `${BASE}PT_Caesars_Mushroom_01.glb`,
    position: [0.8, 0, -5.8],
    rotationY: 0.2,
    scale: 0.35,
  },

  // ── Sector B: South Meadow Clearing (Between Archives & Forge Roads) ──
  {
    id: "meadow-s-grass-clump-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-0.6, 0, 2.5],
    rotationY: 0.4,
    scale: 0.46,
    isVegetation: true,
  },
  {
    id: "meadow-s-grass-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [0.8, 0, 2.2],
    rotationY: -0.5,
    scale: 0.44,
    isVegetation: true,
  },
  {
    id: "meadow-s-bush-1",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [1.6, 0, 3.2],
    rotationY: 0.7,
    scale: 0.28,
    isVegetation: true,
  },
  {
    id: "meadow-s-bush-2",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-1.4, 0, 3.8],
    rotationY: -0.8,
    scale: 0.26,
    isVegetation: true,
  },
  {
    id: "meadow-s-grass-2",
    path: `${BASE}PT_Grass_02.glb`,
    position: [0.2, 0, 4.2],
    rotationY: 0.9,
    scale: 0.42,
    isVegetation: true,
  },
  {
    id: "meadow-s-poppy-1",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [0.9, 0, 4.6],
    rotationY: -0.3,
    scale: 0.25,
    isVegetation: true,
  },
  {
    id: "meadow-s-grass-clump-2",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-0.8, 0, 5.4],
    rotationY: 1.2,
    scale: 0.48,
    isVegetation: true,
  },
  {
    id: "meadow-s-bush-3",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [1.8, 0, 5.8],
    rotationY: -0.4,
    scale: 0.30,
    isVegetation: true,
  },
  {
    id: "meadow-s-grass-3",
    path: `${BASE}PT_Grass_02.glb`,
    position: [0.6, 0, 6.6],
    rotationY: 0.6,
    scale: 0.45,
    isVegetation: true,
  },
  {
    id: "meadow-s-bush-4",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-1.8, 0, 6.0],
    rotationY: 0.3,
    scale: 0.28,
    isVegetation: true,
  },
  {
    id: "meadow-s-grass-4",
    path: `${BASE}PT_Grass_02.glb`,
    position: [2.8, 0, 5.5],
    rotationY: -0.7,
    scale: 0.40,
    isVegetation: true,
  },
  {
    id: "meadow-s-grass-clump-3",
    path: `${BASE}PT_Grass_02.glb`,
    position: [1.2, 0, 7.5],
    rotationY: 0.8,
    scale: 0.46,
    isVegetation: true,
  },

  // ── Sector C: West Meadow Clearing (Between Oracle & Archives Roads) ──
  {
    id: "meadow-w-grass-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-2.8, 0, 0.4],
    rotationY: 0.5,
    scale: 0.44,
    isVegetation: true,
  },
  {
    id: "meadow-w-bush-1",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-3.6, 0, 1.2],
    rotationY: -0.5,
    scale: 0.28,
    isVegetation: true,
  },
  {
    id: "meadow-w-grass-clump-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-4.5, 0, 0.2],
    rotationY: 0.9,
    scale: 0.45,
    isVegetation: true,
  },
  {
    id: "meadow-w-shrub-1",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-2.2, 0, -0.6],
    rotationY: -0.3,
    scale: 0.27,
    isVegetation: true,
  },
  {
    id: "meadow-w-poppy-1",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [-5.2, 0, 1.8],
    rotationY: 0.4,
    scale: 0.26,
    isVegetation: true,
  },
  {
    id: "meadow-w-grass-2",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-6.0, 0, 0.8],
    rotationY: -0.8,
    scale: 0.45,
    isVegetation: true,
  },
  {
    id: "meadow-w-bush-2",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-4.2, 0, 3.0],
    rotationY: 0.6,
    scale: 0.30,
    isVegetation: true,
  },
  {
    id: "meadow-w-grass-clump-2",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-5.5, 0, 3.6],
    rotationY: -1.1,
    scale: 0.46,
    isVegetation: true,
  },
  {
    id: "meadow-w-grass-3",
    path: `${BASE}PT_Grass_02.glb`,
    position: [-3.4, 0, 4.2],
    rotationY: 0.7,
    scale: 0.42,
    isVegetation: true,
  },
  {
    id: "meadow-w-shrub-2",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [-6.5, 0, 2.0],
    rotationY: 0.3,
    scale: 0.28,
    isVegetation: true,
  },

  // ── Sector D: East Meadow Clearing (Between Forge & Gateway Roads) ──
  {
    id: "meadow-e-grass-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [3.0, 0, -0.6],
    rotationY: -0.4,
    scale: 0.42,
    isVegetation: true,
  },
  {
    id: "meadow-e-grass-clump-1",
    path: `${BASE}PT_Grass_02.glb`,
    position: [4.2, 0, 0.4],
    rotationY: 0.6,
    scale: 0.45,
    isVegetation: true,
  },
  {
    id: "meadow-e-bush-1",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [5.2, 0, -0.8],
    rotationY: -0.7,
    scale: 0.28,
    isVegetation: true,
  },
  {
    id: "meadow-e-poppy-1",
    path: `${BASE}PT_Poppy_02.glb`,
    position: [3.8, 0, 1.2],
    rotationY: 0.5,
    scale: 0.26,
    isVegetation: true,
  },
  {
    id: "meadow-e-grass-2",
    path: `${BASE}PT_Grass_02.glb`,
    position: [6.0, 0, 0.6],
    rotationY: -0.5,
    scale: 0.44,
    isVegetation: true,
  },
  {
    id: "meadow-e-shrub-1",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [2.5, 0, 1.0],
    rotationY: 0.8,
    scale: 0.26,
    isVegetation: true,
  },
  {
    id: "meadow-e-grass-clump-2",
    path: `${BASE}PT_Grass_02.glb`,
    position: [5.0, 0, 1.8],
    rotationY: -0.9,
    scale: 0.46,
    isVegetation: true,
  },
  {
    id: "meadow-e-grass-3",
    path: `${BASE}PT_Grass_02.glb`,
    position: [6.8, 0, 1.5],
    rotationY: 0.4,
    scale: 0.40,
    isVegetation: true,
  },
  {
    id: "meadow-e-bush-2",
    path: `${BASE}PT_Generic_Shrub_01_green.glb`,
    position: [6.2, 0, -1.8],
    rotationY: -0.4,
    scale: 0.30,
    isVegetation: true,
  },
];

export default function WorldEnvironment() {
  return (
    <group name="world-environment">
      {/* ── 1. Faceted Island Cliff Skirt, Hanging Rocks & Distant Crags ── */}
      <IslandCliffSkirt />

      {/* ── 2. Complete Connected 3D Cobblestone Road Network & Central Plaza ── */}
      <CobblestoneRoadNetwork />

      {/* ── 3. All Authoritative Environmental Models Across 4 Zones & Roads ── */}
      {WORLD_PLACEMENTS.map(({ id, ...placement }) => (
        <EnvironmentModel key={id} {...placement} />
      ))}

      {/* ── 3. Regional Atmospheric Motes (Amber, Cyan, Violet, Rose) ── */}
      <ZoneAtmosphereMotes />

      {/* ── 4. Localized Zone Accent Lights (Restrained & Balanced) ── */}
      {/* Forge Amber Light */}
      <pointLight
        position={[6, 1.3, 4]}
        color="#f59e0b"
        intensity={0.35}
        distance={3.8}
        decay={2}
      />

      {/* Archives Cyan Light */}
      <pointLight
        position={[-5, 1.3, 8]}
        color="#06b6d4"
        intensity={0.32}
        distance={3.6}
        decay={2}
      />

      {/* Oracle Violet Light */}
      <pointLight
        position={[-8, 1.3, -6]}
        color="#a855f7"
        intensity={0.32}
        distance={3.6}
        decay={2}
      />

      {/* Gateway Rose Light */}
      <pointLight
        position={[9, 1.3, -8]}
        color="#ec4899"
        intensity={0.32}
        distance={3.6}
        decay={2}
      />
    </group>
  );
}
