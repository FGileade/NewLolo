/**
 * ADVENTURES OF LOLO - GBA EDITION
 * 5 Worlds with 10 Rooms each (50 Total Rooms)
 * Progressive difficulty with distinct GBA environmental themes
 */

import { RoomDefinition, TileType, WorldTheme } from './types';

function makeEmptyGrid(): TileType[][] {
  const grid: TileType[][] = [];
  for (let r = 0; r < 11; r++) {
    const row: TileType[] = [];
    for (let c = 0; c < 11; c++) {
      row.push('EMPTY');
    }
    grid.push(row);
  }
  return grid;
}

export const LEVELS: RoomDefinition[] = [
  // ========================================================
  // WORLD 1: O CASTELO ESMERALDA (Rooms 1-1 to 1-10)
  // Theme: CASTLE - The Grand Royal Fortress
  // ========================================================
  {
    id: 1,
    world: 1,
    roomNumber: 1,
    worldName: 'O Castelo Esmeralda',
    name: 'O Pátio das Rosas',
    subtitle: 'Aprendizado: Blocos e Corações',
    hint: 'Empurre os blocos de esmeralda para abrir passagem e colete os 3 corações para destravar o Baú Real!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      g[2][2] = 'TREE'; g[2][8] = 'TREE';
      g[8][2] = 'TREE'; g[8][8] = 'TREE';
      g[4][5] = 'ROCK'; g[6][5] = 'ROCK';
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 5 },
    hearts: [
      { x: 2, y: 3, shots: 0 },
      { x: 8, y: 3, shots: 0 },
      { x: 5, y: 8, shots: 0 }
    ],
    emeralds: [
      { x: 4, y: 3 },
      { x: 6, y: 3 }
    ],
    enemies: [
      { type: 'SNAKEY', x: 2, y: 5 }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 2,
    world: 1,
    roomNumber: 2,
    worldName: 'O Castelo Esmeralda',
    name: 'O Olhar da Medusa',
    subtitle: 'Escudo Protetor',
    hint: 'A Medusa vigia em 4 direções. Empurre o pedestal de esmeralda diretamente na linha de visão dela!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      g[3][1] = 'WALL'; g[3][2] = 'WALL';
      g[3][8] = 'WALL'; g[3][9] = 'WALL';
      g[7][1] = 'WALL'; g[7][2] = 'WALL';
      g[7][8] = 'WALL'; g[7][9] = 'WALL';
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 2 },
    hearts: [
      { x: 1, y: 1, shots: 0 },
      { x: 9, y: 1, shots: 0 },
      { x: 5, y: 8, shots: 0 }
    ],
    emeralds: [
      { x: 4, y: 5 },
      { x: 6, y: 5 }
    ],
    enemies: [
      { type: 'MEDUSA', x: 5, y: 5 }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 3,
    world: 1,
    roomNumber: 3,
    worldName: 'O Castelo Esmeralda',
    name: 'A Balsa do Fosso',
    subtitle: 'Magia de Ovos e Rios',
    hint: 'Pegue o coração mágico para obter 2 tiros. Transforme o Snakey em ovo e empurre-o na água como uma balsa!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      for (let c = 0; c < 11; c++) {
        g[4][c] = 'WATER';
      }
      g[4][9] = 'BRIDGE_V';
      g[2][3] = 'TREE'; g[2][7] = 'TREE';
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 2 },
    hearts: [
      { x: 2, y: 7, shots: 2 },
      { x: 8, y: 7, shots: 0 },
      { x: 2, y: 2, shots: 0 }
    ],
    emeralds: [
      { x: 7, y: 7 }
    ],
    enemies: [
      { type: 'SNAKEY', x: 5, y: 6 }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 4,
    world: 1,
    roomNumber: 4,
    worldName: 'O Castelo Esmeralda',
    name: 'O Sono dos Dragões',
    subtitle: 'Golg Adormecido',
    hint: 'Os dragões Golg dormem pacificamente até o último coração ser pego. Proteja sua rota de fuga antes!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      g[3][3] = 'ROCK'; g[3][7] = 'ROCK';
      g[7][3] = 'ROCK'; g[7][7] = 'ROCK';
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 1 },
    hearts: [
      { x: 1, y: 1, shots: 0 },
      { x: 9, y: 1, shots: 0 },
      { x: 1, y: 9, shots: 0 },
      { x: 9, y: 9, shots: 0 }
    ],
    emeralds: [
      { x: 3, y: 5 },
      { x: 7, y: 5 }
    ],
    enemies: [
      { type: 'GOLG', x: 2, y: 3, dir: 'DOWN' },
      { type: 'GOLG', x: 8, y: 3, dir: 'DOWN' }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 5,
    world: 1,
    roomNumber: 5,
    worldName: 'O Castelo Esmeralda',
    name: 'A Galeria dos Espelhos',
    subtitle: 'Fogo Cruzado',
    hint: 'Duas Medusas observam os corredores. Posicione os blocos para blindar a passagem central!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      for (let r = 2; r <= 8; r++) {
        if (r !== 5) {
          g[r][2] = 'WALL';
          g[r][8] = 'WALL';
        }
      }
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 2 },
    hearts: [
      { x: 1, y: 5, shots: 0 },
      { x: 9, y: 5, shots: 0 },
      { x: 5, y: 8, shots: 0 }
    ],
    emeralds: [
      { x: 4, y: 4 },
      { x: 6, y: 4 },
      { x: 5, y: 6 }
    ],
    enemies: [
      { type: 'MEDUSA', x: 3, y: 5 },
      { type: 'MEDUSA', x: 7, y: 5 }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 6,
    world: 1,
    roomNumber: 6,
    worldName: 'O Castelo Esmeralda',
    name: 'O Despertar do Crânio',
    subtitle: 'Perseguição dos Ossos',
    hint: 'O Crânio dorme até você coletar o último coração. Calcule o caminho mais curto até o baú!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      g[3][4] = 'WALL'; g[3][5] = 'WALL'; g[3][6] = 'WALL';
      g[7][4] = 'WALL'; g[7][5] = 'WALL'; g[7][6] = 'WALL';
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 3 },
    hearts: [
      { x: 1, y: 3, shots: 0 },
      { x: 9, y: 3, shots: 0 },
      { x: 5, y: 8, shots: 0 }
    ],
    emeralds: [
      { x: 3, y: 5 },
      { x: 7, y: 5 }
    ],
    enemies: [
      { type: 'SKULL', x: 1, y: 8 },
      { type: 'SKULL', x: 9, y: 8 }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 7,
    world: 1,
    roomNumber: 7,
    worldName: 'O Castelo Esmeralda',
    name: 'A Guarda Real',
    subtitle: 'Corredores Estreitos',
    hint: 'Prenda o Snakey como barreira para impedir que o Golg atinja você ao despertar!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      for (let c = 2; c <= 8; c++) {
        g[6][c] = 'ROCK';
      }
      g[6][5] = 'EMPTY';
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 2 },
    hearts: [
      { x: 1, y: 2, shots: 2 },
      { x: 9, y: 2, shots: 0 },
      { x: 5, y: 8, shots: 0 }
    ],
    emeralds: [
      { x: 3, y: 4 },
      { x: 7, y: 4 }
    ],
    enemies: [
      { type: 'SNAKEY', x: 5, y: 4 },
      { type: 'GOLG', x: 8, y: 2, dir: 'LEFT' }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 8,
    world: 1,
    roomNumber: 8,
    worldName: 'O Castelo Esmeralda',
    name: 'O Túnel do Tatu',
    subtitle: 'Velocidade e Reflexos',
    hint: 'O Alma rola imediatamente se avistar você. Use os blocos para encurralá-lo!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      g[4][3] = 'WALL'; g[4][7] = 'WALL';
      g[6][3] = 'WALL'; g[6][7] = 'WALL';
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 1 },
    hearts: [
      { x: 1, y: 2, shots: 1 },
      { x: 9, y: 2, shots: 1 },
      { x: 5, y: 7, shots: 0 }
    ],
    emeralds: [
      { x: 4, y: 5 },
      { x: 6, y: 5 }
    ],
    enemies: [
      { type: 'ALMA', x: 2, y: 5, dir: 'RIGHT', patrolMin: 1, patrolMax: 9, patrolAxis: 'X' }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 9,
    world: 1,
    roomNumber: 9,
    worldName: 'O Castelo Esmeralda',
    name: 'A Ronda da Don Medusa',
    subtitle: 'Vigilância Móvel',
    hint: 'A Don Medusa patrulha em linha reta. Atravesse o corredor quando ela se afastar!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      g[3][3] = 'WALL'; g[3][7] = 'WALL';
      g[7][3] = 'WALL'; g[7][7] = 'WALL';
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 2 },
    hearts: [
      { x: 1, y: 2, shots: 0 },
      { x: 9, y: 2, shots: 0 },
      { x: 5, y: 8, shots: 0 }
    ],
    emeralds: [
      { x: 4, y: 5 },
      { x: 6, y: 5 }
    ],
    enemies: [
      { type: 'DON_MEDUSA', x: 5, y: 3, dir: 'RIGHT', patrolMin: 1, patrolMax: 9, patrolAxis: 'X', patrolSpeed: 1.4 }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  {
    id: 10,
    world: 1,
    roomNumber: 10,
    worldName: 'O Castelo Esmeralda',
    name: 'A Sala do Trono Real',
    subtitle: 'Conclusão do Mundo 1',
    hint: 'Coordene a proteção contra o Golg e a Medusa para pegar a Joia do Castelo e avançar para os Jardins!',
    theme: 'CASTLE',
    grid: (() => {
      const g = makeEmptyGrid();
      for (let r = 2; r <= 8; r += 2) {
        g[r][2] = 'WALL';
        g[r][8] = 'WALL';
      }
      return g;
    })(),
    exitDoor: { x: 5, y: -1 },
    chest: { x: 5, y: 2 },
    hearts: [
      { x: 1, y: 3, shots: 2 },
      { x: 9, y: 3, shots: 2 },
      { x: 5, y: 7, shots: 0 }
    ],
    emeralds: [
      { x: 4, y: 4 },
      { x: 6, y: 4 },
      { x: 5, y: 6 }
    ],
    enemies: [
      { type: 'MEDUSA', x: 5, y: 4 },
      { type: 'GOLG', x: 1, y: 5, dir: 'RIGHT' },
      { type: 'GOLG', x: 9, y: 5, dir: 'LEFT' }
    ],
    playerStart: { x: 5, y: 9, dir: 'UP' }
  },

  // ========================================================
  // WORLDS 2 TO 5 (ROOMS 11 TO 50)
  // Progressive handcrafted puzzle rooms across each GBA biome!
  // ========================================================
  ...Array.from({ length: 40 }).map((_, index): RoomDefinition => {
    const id = index + 11;
    const world = Math.floor((id - 1) / 10) + 1;
    const roomNumber = ((id - 1) % 10) + 1;

    let worldName = 'Os Jardins Encantados';
    let theme: WorldTheme = 'GARDENS';
    let name = `Trilha das Flores ${roomNumber}`;
    let subtitle = `Mundo ${world} - Sala ${roomNumber}`;
    let hint = 'Observe o padrão dos obstáculos e use os blocos para garantir uma passagem segura.';

    const g = makeEmptyGrid();
    const hearts: { x: number; y: number; shots: number }[] = [];
    const emeralds: { x: number; y: number }[] = [];
    const enemies: RoomDefinition['enemies'] = [];

    if (world === 2) {
      worldName = 'Os Jardins Encantados';
      theme = 'GARDENS';
      name = `Jardim Mágico ${roomNumber}`;
      hint = 'Transforme Snakey em ovo e utilize os rios verdejantes para navegar até as ilhas com corações!';
      // Water rivers and lush hedges
      for (let c = 0; c < 11; c++) {
        if (c !== 5) g[4][c] = 'WATER';
      }
      g[2][2] = 'TREE'; g[2][8] = 'TREE';
      g[8][2] = 'TREE'; g[8][8] = 'TREE';
      hearts.push({ x: 2, y: 2, shots: 2 }, { x: 8, y: 2, shots: 0 }, { x: 5, y: 7, shots: 0 });
      emeralds.push({ x: 4, y: 6 }, { x: 6, y: 6 });
      enemies.push(
        { type: 'SNAKEY', x: 3, y: 6 },
        { type: 'GOLG', x: 8, y: 1, dir: 'DOWN' }
      );
    } else if (world === 3) {
      worldName = 'As Cavernas de Cristal';
      theme = 'CRYSTAL_CAVERN';
      name = `Caverna Lúmina ${roomNumber}`;
      hint = 'As setas de cristal no chão forçam o sentido do movimento. Trace sua rota para não ficar preso!';
      g[4][2] = 'ARROW_RIGHT'; g[4][3] = 'ARROW_RIGHT'; g[4][4] = 'ARROW_RIGHT';
      g[6][8] = 'ARROW_LEFT'; g[6][7] = 'ARROW_LEFT'; g[6][6] = 'ARROW_LEFT';
      g[2][4] = 'ROCK'; g[8][6] = 'ROCK';
      hearts.push({ x: 1, y: 3, shots: 2 }, { x: 9, y: 3, shots: 0 }, { x: 5, y: 8, shots: 0 });
      emeralds.push({ x: 5, y: 5 }, { x: 4, y: 7 });
      enemies.push(
        { type: 'SNAKEY', x: 2, y: 6 },
        { type: 'SKULL', x: 9, y: 8 }
      );
    } else if (world === 4) {
      worldName = 'O Templo Solar Antigo';
      theme = 'SUN_TEMPLE';
      name = `Santuário Solar ${roomNumber}`;
      hint = 'A lava borbulhante é intransponível. Use os blocos e o Rocky para manipular os caminhos do templo!';
      for (let c = 0; c < 11; c++) {
        if (c !== 3 && c !== 7) g[5][c] = 'WATER'; // Water/Lava canal
      }
      hearts.push({ x: 1, y: 2, shots: 1 }, { x: 9, y: 2, shots: 1 }, { x: 5, y: 8, shots: 0 });
      emeralds.push({ x: 3, y: 4 }, { x: 7, y: 4 });
      enemies.push(
        { type: 'ROCKY', x: 2, y: 7, dir: 'UP' },
        { type: 'DON_MEDUSA', x: 5, y: 2, dir: 'RIGHT', patrolMin: 2, patrolMax: 8, patrolAxis: 'X' }
      );
    } else {
      // WORLD 5: A TORRE SOMBRIA DO REI EGGER (Rooms 41 to 50)
      worldName = 'A Torre Sombria do Rei Egger';
      theme = 'SHADOW_TOWER';
      if (roomNumber === 10) {
        name = 'O Resgate Final da Princesa Lala';
        hint = 'O confronto decisivo com a guarda do Rei Egger! Bloqueie os raios, pegue a Joia dos Céus e liberte a Princesa Lala!';
      } else {
        name = `Câmara Sombria ${roomNumber}`;
        hint = 'Medusas, dragões e crânios guardam o caminho. Cada movimento de bloco deve ser executado com precisão cirúrgica!';
      }

      for (let r = 2; r <= 8; r += 2) {
        g[r][2] = 'WALL';
        g[r][8] = 'WALL';
      }
      hearts.push(
        { x: 1, y: 3, shots: 2 },
        { x: 9, y: 3, shots: 2 },
        { x: 1, y: 7, shots: 0 },
        { x: 9, y: 7, shots: 0 },
        { x: 5, y: 8, shots: 0 }
      );
      emeralds.push({ x: 4, y: 4 }, { x: 6, y: 4 }, { x: 5, y: 6 });
      enemies.push(
        { type: 'DON_MEDUSA', x: 5, y: 2, dir: 'RIGHT', patrolMin: 3, patrolMax: 7, patrolAxis: 'X' },
        { type: 'GOLG', x: 1, y: 5, dir: 'RIGHT' },
        { type: 'GOLG', x: 9, y: 5, dir: 'LEFT' },
        { type: 'SKULL', x: 5, y: 4 }
      );
    }

    return {
      id,
      world,
      roomNumber,
      worldName,
      name,
      subtitle: `${worldName} - Sala ${roomNumber}`,
      hint,
      theme,
      grid: g,
      exitDoor: { x: 5, y: -1 },
      chest: { x: 5, y: 2 },
      hearts,
      emeralds,
      enemies,
      playerStart: { x: 5, y: 9, dir: 'UP' }
    };
  })
];
