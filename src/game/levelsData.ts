import { LevelDefinition, AvatarInfo } from './types.ts';

export const EXPLORER_AVATARS: AvatarInfo[] = [
  {
    id: 'pathfinder',
    name: 'Leo "Pathfinder" Vance',
    title: 'Trail Scout',
    description: 'Master of jungle navigation and ancient animal tracks.',
    icon: '🧭',
    color: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'cartographer',
    name: 'Elena Rostova',
    title: 'Master Cartographer',
    description: 'Expert in piecing together torn maps and archaic charts.',
    icon: '🗺️',
    color: 'from-amber-600 to-yellow-800',
  },
  {
    id: 'cryptographer',
    name: 'Dr. Arthur Sterling',
    title: 'Codebreaker',
    description: 'Specializes in deciphering lost glyphs, ciphers, and dials.',
    icon: '📜',
    color: 'from-indigo-600 to-blue-800',
  },
  {
    id: 'archaeologist',
    name: 'Maya Lin',
    title: 'Relic Hunter',
    description: 'Trained to spot hidden mechanisms and ancient burial treasures.',
    icon: '🏺',
    color: 'from-orange-600 to-amber-800',
  },
  {
    id: 'sea_captain',
    name: 'Captain Thorne',
    title: 'Privateer Veteran',
    description: 'Knows every pirate legend, sea grotto, and sunken chest.',
    icon: '⚓',
    color: 'from-cyan-600 to-blue-900',
  },
  {
    id: 'mystic',
    name: 'Zara the Seer',
    title: 'Island Mystic',
    description: 'Possesses an uncanny intuition for ancient elemental energies.',
    icon: '🔮',
    color: 'from-purple-600 to-violet-900',
  },
];

export const GAME_LEVELS: LevelDefinition[] = [
  {
    id: 1,
    slug: 'jungle_entrance',
    title: 'Jungle Entrance',
    subtitle: 'The Overgrown Gate of Eldoria',
    locationName: 'Verdant Shoreline',
    themeColor: '#059669',
    ambientDescription: 'Chirping tropical birds and rustling vines conceal ancient stone monuments.',
    loreStory:
      'You step off your skiff onto the forgotten sands of Isla Perdida. Ancient jungle foliage chokes the path ahead, but mossy totems whisper clues of a colossal lost treasure deeper inland. Two guardian puzzles bar your passage.',
    puzzles: [
      {
        id: 'l1_riddle',
        title: "The Stone Guardian's Riddle",
        type: 'riddle',
        instructions: 'Read the ancient carving carefully and type your answer.',
        loreText: 'A monolithic face carved into banyan roots speaks in a deep, stony resonance.',
        points: 100,
        bonusNoHint: 50,
        riddle:
          'I have rivers without water, forests without trees, and cities without people. What am I?',
        acceptedAnswers: ['map', 'a map', 'treasure map', 'a treasure map', 'world map', 'chart'],
        hints: [
          {
            id: 'l1_h1',
            text: 'Explorers like you rely on this object constantly to chart their course.',
            penalty: 20,
          },
          {
            id: 'l1_h2',
            text: 'It is drawn on paper or parchment, showing topography and borders.',
            penalty: 20,
          },
        ],
      },
      {
        id: 'l1_hidden',
        title: 'Hidden Jungle Relics',
        type: 'hidden_object',
        instructions: 'Scour the jungle clearing and click all 3 concealed relics.',
        loreText:
          'Before the temple path opens, you must uncover three sacred tokens left behind by the first expedition.',
        points: 150,
        bonusNoHint: 50,
        sceneTheme: 'jungle',
        itemsToFind: [
          {
            id: 'obj_scarab',
            name: 'Golden Scarab',
            hint: 'Glinting among the large jungle fern leaves on the left.',
            xPercent: 18,
            yPercent: 62,
            radiusPercent: 9,
            svgIcon: '🪲',
          },
          {
            id: 'obj_compass',
            name: 'Brass Compass',
            hint: 'Tucked inside the hollow knot of the ancient banyan trunk.',
            xPercent: 78,
            yPercent: 38,
            radiusPercent: 8,
            svgIcon: '🧭',
          },
          {
            id: 'obj_rune_stone',
            name: 'Glowing Sun Rune',
            hint: 'Poking out from the roots at the base of the stone pedestal.',
            xPercent: 48,
            yPercent: 78,
            radiusPercent: 9,
            svgIcon: '☀️',
          },
        ],
        hints: [
          {
            id: 'l1_h3',
            text: 'Check the dense banyan tree on the right and the giant fern leaves on the left.',
            penalty: 20,
          },
        ],
      },
    ],
    chestReward: {
      coins: 100,
      completionPoints: 250,
      items: [
        {
          id: 'bronze_skull_key',
          name: 'Bronze Skull Key',
          category: 'key',
          description: 'A heavy, verdigris-coated bronze key shaped like a grinning skull.',
          lore: 'Carved by early explorers to unlock the coastal pirate grottos.',
          icon: '🗝️',
          obtainedAtLevel: 1,
        },
        {
          id: 'map_piece_1',
          name: 'Map Fragment I (Northwest)',
          category: 'map_piece',
          description: 'A crisp corner of yellowed parchment showing coastal shallows.',
          lore: 'Points toward an ancient temple hidden beneath volcanic cliffs.',
          icon: '📜',
          obtainedAtLevel: 1,
        },
      ],
    },
  },
  {
    id: 2,
    slug: 'ancient_temple',
    title: 'The Ancient Temple',
    subtitle: 'Sanctuary of the Four Elements',
    locationName: 'Temple of the Sun Gods',
    themeColor: '#d97706',
    ambientDescription: 'Flickering wall sconces illuminate geometric frescoes and carved stone altars.',
    loreStory:
      'Passing through the dense canopy, you enter the grand hall of the Sun Temple. The air is thick with the scent of sandalwood and age-old incense. A massive locked portal stands flanked by four elemental altars.',
    puzzles: [
      {
        id: 'l2_logic',
        title: 'Elemental Altar Alignment',
        type: 'logic',
        instructions: 'Assign each elemental relic to its rightful altar based on the ancient inscription.',
        loreText:
          'Four pedestals surround a central sun seal: North, East, South, and West. The glyphs dictate the harmony of nature.',
        points: 150,
        bonusNoHint: 50,
        scenario: 'Arrange the four elemental crests into the four cardinal altars.',
        clues: [
          'Fire awakens where the sun rises in the East.',
          'Water rests opposite to Fire, cooling the western horizon.',
          'Earth lies grounded in the deep South where the bedrock roots plunge.',
          'Air sweeps across the high frozen peaks of the North.',
        ],
        slots: [
          { id: 'north', label: 'North Altar (High Peaks)', correctItem: 'air' },
          { id: 'east', label: 'East Altar (Dawn Gate)', correctItem: 'fire' },
          { id: 'south', label: 'South Altar (Bedrock Roots)', correctItem: 'earth' },
          { id: 'west', label: 'West Altar (Twilight Pool)', correctItem: 'water' },
        ],
        availableItems: [
          { id: 'fire', name: 'Flame Crest', symbol: '🔥' },
          { id: 'water', name: 'Tide Crest', symbol: '💧' },
          { id: 'earth', name: 'Stone Crest', symbol: '🌱' },
          { id: 'air', name: 'Gale Crest', symbol: '💨' },
        ],
        hints: [
          {
            id: 'l2_h1',
            text: 'East = Fire (Sunrise). West = Water. South = Earth. North = Air.',
            penalty: 20,
          },
        ],
      },
      {
        id: 'l2_riddle',
        title: 'The Whispering Vault Inscription',
        type: 'riddle',
        instructions: 'Type the single word answer to the temple inscription.',
        loreText: 'A carved stone tablet above the heavy vault entrance reveals a poetic riddle.',
        points: 100,
        bonusNoHint: 50,
        riddle:
          'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
        acceptedAnswers: ['echo', 'an echo', 'the echo'],
        hints: [
          {
            id: 'l2_h2',
            text: 'It repeats what you shout across a canyon or empty stone hall.',
            penalty: 20,
          },
        ],
      },
    ],
    chestReward: {
      coins: 150,
      completionPoints: 250,
      items: [
        {
          id: 'emerald_eye_gem',
          name: 'Emerald Eye of Quetzal',
          category: 'gem',
          description: 'A flawless emerald radiating an otherworldly green luminescence.',
          lore: 'Placed in the sockets of statues to reveal secret doors.',
          icon: '💎',
          obtainedAtLevel: 2,
        },
        {
          id: 'map_piece_2',
          name: 'Map Fragment II (Northeast)',
          category: 'map_piece',
          description: 'Shows winding mountain passes and a marked pirate grotto.',
          lore: 'Reveals where the buccaneers sheltered their plunder from imperial navies.',
          icon: '📜',
          obtainedAtLevel: 2,
        },
      ],
    },
  },
  {
    id: 3,
    slug: 'pirate_cave',
    title: 'The Pirate Cave',
    subtitle: 'Dead Man’s Grotto',
    locationName: 'Smuggler’s Cove',
    themeColor: '#0284c7',
    ambientDescription: 'Lapping black waves and the groan of rotting galleon timbers echo off stalactites.',
    loreStory:
      'You crawl through a sea tunnel into Dead Man’s Grotto. Skeletal remains of a 17th-century galleon lie shattered on coral reefs. Pirate flags hang in tatters, guarding an iron-banded chest and lethal spring traps.',
    trap: {
      id: 'cave_tripwire',
      name: 'Old Flintlock Tripwire Trap',
      description:
        'A taut hemp cord crosses the cavern floor connected to three counterweight stone levers!',
      challenge: {
        question:
          'A rusted pirate sign reads: "The true buccaneer trusts the sea, fears the gallows, and honors the skull." Which lever safely disables the spring loaded crossbows?',
        options: [
          {
            text: 'Pull the Rusted Anchor Lever (The Sea)',
            isSafe: true,
            feedback: 'Click! The tension releases safely into a damp sandbag. You dodged the trap!',
          },
          {
            text: 'Pull the Skull Crossbones Lever',
            isSafe: false,
            feedback: 'CLANG! A bolt whistles past your ear! You had to duck into the mud.',
          },
          {
            text: 'Cut the hemp tripwire with your machete',
            isSafe: false,
            feedback: 'SNAP! Counterweights crash down, nearly dropping rocks on your path!',
          },
        ],
      },
    },
    puzzles: [
      {
        id: 'l3_hidden',
        title: 'Smuggler’s Lost Relics',
        type: 'hidden_object',
        instructions: 'Locate 3 pirate artifacts hidden across the dark shipwreck cavern.',
        loreText:
          'Pirate quartermasters hid their most precious navigating tools behind rum casks and rigging.',
        points: 150,
        bonusNoHint: 50,
        sceneTheme: 'cave',
        itemsToFind: [
          {
            id: 'obj_spyglass',
            name: 'Brass Spyglass',
            hint: 'Resting on top of the ruined captain’s sea chest.',
            xPercent: 24,
            yPercent: 44,
            radiusPercent: 9,
            svgIcon: '🔭',
          },
          {
            id: 'obj_doubloons',
            name: 'Bag of Spanish Doubloons',
            hint: 'Half buried beneath the sand by the wooden rowboat hull.',
            xPercent: 72,
            yPercent: 72,
            radiusPercent: 10,
            svgIcon: '💰',
          },
          {
            id: 'obj_cutlass',
            name: 'Silver Buccaneer Cutlass',
            hint: 'Pinned into the wooden hull planking near the mast.',
            xPercent: 54,
            yPercent: 32,
            radiusPercent: 9,
            svgIcon: '🗡️',
          },
        ],
        hints: [
          {
            id: 'l3_h1',
            text: 'Look at the rowboat on the right, the mast in the center, and the chest on the left.',
            penalty: 20,
          },
        ],
      },
      {
        id: 'l3_code',
        title: 'Captain Thorne’s Dial Lock',
        type: 'treasure_code',
        instructions: 'Align the 3-digit combination tumbler on the iron chest.',
        loreText:
          'A note pinned to the chest with a rusted dagger reads: "3 masts to catch the gale, 7 sea serpents slain, 4 anchors dropped in safe bay."',
        points: 150,
        bonusNoHint: 50,
        codeLength: 3,
        correctCode: '374',
        digitsRange: [0, 9],
        riddleClues: [
          'First digit: The number of masts on the flagship (3)',
          'Second digit: The number of serpents slain (7)',
          'Third digit: The number of anchors in safe bay (4)',
        ],
        hints: [
          {
            id: 'l3_h2',
            text: 'Read the three numbers explicitly mentioned in the captain’s log.',
            penalty: 20,
          },
          {
            id: 'l3_h3',
            text: 'The code is 3 - 7 - 4.',
            penalty: 20,
          },
        ],
      },
    ],
    chestReward: {
      coins: 200,
      completionPoints: 250,
      items: [
        {
          id: 'ruby_dragon_key',
          name: 'Ruby Dragon Key',
          category: 'key',
          description: 'A crimson key set with a faceted blood-ruby that pulses with heat.',
          lore: 'Forged in the fiery heart of the island’s dormant volcanic vents.',
          icon: '🗝️',
          obtainedAtLevel: 3,
        },
        {
          id: 'map_piece_3',
          name: 'Map Fragment III (Southwest)',
          category: 'map_piece',
          description: 'Depicts a windswept plateau of dunes and ancient sun obelisks.',
          lore: 'Warns of shifting sands hiding the subterranean vaults.',
          icon: '📜',
          obtainedAtLevel: 3,
        },
      ],
    },
  },
  {
    id: 4,
    slug: 'forgotten_desert',
    title: 'The Forgotten Desert',
    subtitle: 'The Sunken Obelisk of Osiris',
    locationName: 'The Ash Dunes',
    themeColor: '#eab308',
    ambientDescription: 'Whistling desert winds carry fine golden sand over half-buried marble pillars.',
    loreStory:
      'Emerging from the caverns onto the island’s high plateau, blazing sunlight hits endless ochre dunes. A monumental solar obelisk juts out of the sand. Its astronomical rings and mathematical equations guard the penultimate secret.',
    puzzles: [
      {
        id: 'l4_sequence',
        title: 'Astronomical Star Sequence',
        type: 'sequence',
        instructions: 'Determine the missing number in the celestial alignment sequence.',
        loreText: 'A rotating bronze armillary sphere displays star positions with increasing distances.',
        points: 150,
        bonusNoHint: 50,
        sequence: [3, 7, 15, 31, '?'],
        missingIndex: 4,
        correctAnswer: '63',
        options: ['48', '57', '63', '65'],
        explanation: 'Each step doubles the previous number and adds 1: (3×2)+1=7, (7×2)+1=15, (15×2)+1=31, (31×2)+1=63.',
        hints: [
          {
            id: 'l4_h1',
            text: 'Look at the difference between consecutive numbers: +4, +8, +16...',
            penalty: 20,
          },
          {
            id: 'l4_h2',
            text: 'The next difference is +32. 31 + 32 = 63.',
            penalty: 20,
          },
        ],
      },
      {
        id: 'l4_number',
        title: 'Sundial Equation Matrix',
        type: 'number',
        instructions: 'Calculate the required number to align the solar crystal ring.',
        loreText:
          'The Sun Priest carved: "The Sacred Solar Harmony requires three crystal dials to sum to exactly 42. Dial 1 is fixed at 14, and Dial 2 is fixed at 18. What value must you rotate Dial 3 to?"',
        points: 150,
        bonusNoHint: 50,
        question: 'What is the value of Dial 3 such that 14 + 18 + Dial 3 = 42?',
        equationDescription: '14 + 18 + [ ? ] = 42',
        targetNumber: 10,
        options: [8, 10, 12, 14],
        hints: [
          {
            id: 'l4_h3',
            text: 'First add 14 + 18 to get 32. Then subtract 32 from 42.',
            penalty: 20,
          },
        ],
      },
    ],
    chestReward: {
      coins: 250,
      completionPoints: 250,
      items: [
        {
          id: 'solar_medallion',
          name: 'Solar Sun Medallion',
          category: 'artifact',
          description: 'A heavy medallion of pure electrum that fits into the central vault dais.',
          lore: 'The final keystone required to open the legendary treasure vault.',
          icon: '🏅',
          obtainedAtLevel: 4,
        },
        {
          id: 'map_piece_4',
          name: 'Map Fragment IV (Southeast)',
          category: 'map_piece',
          description: 'The final piece! When combined, all 4 fragments reveal the Heart of Eldoria.',
          lore: 'Marks the exact entrance to the Lost Island sanctuary.',
          icon: '📜',
          obtainedAtLevel: 4,
        },
      ],
    },
  },
  {
    id: 5,
    slug: 'lost_island',
    title: 'The Lost Island',
    subtitle: 'The Heart of Eldoria & The Legendary Treasure',
    locationName: 'The Vault of Montezuma',
    themeColor: '#8b5cf6',
    ambientDescription: 'Prismatic crystal formations radiate soft golden light onto an elevated dais.',
    loreStory:
      'You have arrived at the ultimate sanctuary! In the center of a subterranean geode chamber rests the legendary Treasure Chest of Montezuma. All your gathered keys, gems, and map clues coalesce into this final challenge.',
    puzzles: [
      {
        id: 'l5_riddle',
        title: 'The Anagram of the Four Kings',
        type: 'riddle',
        instructions: 'Unscramble the golden letters etched around the perimeter of the chest.',
        loreText:
          'The completed map reveals an ancient proverb: "Riches fade, but the greatest explorer possesses..." Letters: W - I - S - D - O - M.',
        points: 200,
        bonusNoHint: 50,
        riddle:
          'Unscramble the letters [ W - I - S - D - O - M ] to name the virtue greater than gold.',
        acceptedAnswers: ['wisdom', 'the wisdom'],
        hints: [
          {
            id: 'l5_h1',
            text: 'Starts with W and ends with M. Associated with sages and knowledge.',
            penalty: 20,
          },
        ],
      },
      {
        id: 'l5_code',
        title: 'The Master Keystone Vault Lock',
        type: 'treasure_code',
        instructions: 'Turn the triple master vault dials using the numeric sum of your three keys.',
        loreText:
          'The three keyholes bear Roman numerals: Bronze Skull (1), Emerald Eye (2), Ruby Dragon (3). The vault sequence is 1-2-3.',
        points: 250,
        bonusNoHint: 50,
        codeLength: 3,
        correctCode: '123',
        digitsRange: [0, 9],
        riddleClues: [
          'First socket: Bronze Skull Key level order (1)',
          'Second socket: Emerald Eye level order (2)',
          'Third socket: Ruby Dragon level order (3)',
        ],
        hints: [
          {
            id: 'l5_h2',
            text: 'Enter the sequential level numbers where you acquired each key: 1, then 2, then 3.',
            penalty: 20,
          },
        ],
      },
    ],
    chestReward: {
      coins: 1000,
      completionPoints: 500,
      items: [
        {
          id: 'legendary_lost_treasure',
          name: 'The Lost Treasure of Eldoria',
          category: 'artifact',
          description:
            'A legendary chest overflowing with golden idols, glittering jewels, and eternal glory!',
          lore: 'Sought for a thousand years by kings and pirates. Now claimed by you.',
          icon: '👑',
          obtainedAtLevel: 5,
        },
      ],
    },
  },
];
