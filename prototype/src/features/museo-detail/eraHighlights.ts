export interface EraHighlight {
  id: string;
  title: string;
  photo: string;
  text: string;
  detail: string;
  source: { title: string; url: string };
}

const sources = {
  tools: {
    title: "Smithsonian · Early Stone Age tools",
    url: "https://humanorigins.si.edu/evidence/behavior/stone-tools/early-stone-age-tools",
  },
  erectus: {
    title: "Smithsonian · Homo erectus",
    url: "https://humanorigins.si.edu/evidence/human-fossils/species/homo-erectus",
  },
  neanderthals: {
    title: "Smithsonian · Homo neanderthalensis",
    url: "https://humanorigins.si.edu/evidence/human-fossils/species/homo-neanderthalensis",
  },
  sapiens: {
    title: "Smithsonian · Homo sapiens",
    url: "https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens",
  },
  neolithic: {
    title: "British Museum · Prehistoric Britain",
    url: "https://www.britishmuseum.org/sites/default/files/2019-09/visit-resource_prehistoric-britain-KS2.pdf",
  },
};

export const eraHighlights = {
  paleolithic: [
    {
      id: "paleolithic-stone-tools",
      title: "First stone tools",
      photo: "stone-tool",
      text: "Hammerstones, cores and sharp flakes formed the earliest stone toolkits.",
      detail:
        "Early toolmakers struck stone cores to remove sharp flakes. Hammerstones and scars on cores help archaeologists reconstruct how these cutting edges were made.",
      source: sources.tools,
    },
    {
      id: "paleolithic-flake-making",
      title: "Making a cutting edge",
      photo: "exhibition-tools",
      text: "Controlled blows turned a piece of stone into a useful cutting edge.",
      detail:
        "Cores and discarded flakes preserve stages of toolmaking. Comparing their shapes reveals how early humans worked stone; manufacturing debris matters alongside finished tools.",
      source: sources.tools,
    },
    {
      id: "paleolithic-handaxes",
      title: "The handaxe tradition",
      photo: "exhibition-tools",
      text: "Large cutting tools introduced a new approach to shaping stone.",
      detail:
        "Acheulean toolmakers shaped large flakes into handaxes and other cutting implements. These forms developed alongside simpler core-and-flake tools, extending the range of stone technology.",
      source: sources.tools,
    },
    {
      id: "paleolithic-archaeological-traces",
      title: "Reading a tool site",
      photo: "detail-olduvai-landscape",
      text: "Tools and manufacturing debris preserve traces of early human activity.",
      detail:
        "Cores, hammerstones, flakes and debris together reveal early technology. Assemblages from sites such as Olduvai connect toolmaking with the wider early human story.",
      source: sources.tools,
    },
  ],
  erectus: [
    {
      id: "erectus-handaxes",
      title: "Acheulean handaxes",
      photo: "exhibition-tools",
      text: "Handaxes and cleavers expanded the range of large cutting tools.",
      detail:
        "Homo erectus is associated with Acheulean technology. Handaxes and cleavers extended earlier toolkits through more elaborate sequences of stone shaping.",
      source: sources.erectus,
    },
    {
      id: "erectus-fire",
      title: "Fire and hearths",
      photo: "tour-fire",
      text: "Hearths offer evidence of fire during this period.",
      detail:
        "Hearths occur within the time span of Homo erectus. Fire offered warmth and food preparation; its extent of use remains under investigation.",
      source: sources.erectus,
    },
    {
      id: "erectus-dispersal",
      title: "Beyond Africa",
      photo: "exhibition-origins",
      text: "Fossils trace populations across Africa and into Asia.",
      detail:
        "Fossils in Africa, Java and China reveal the wide distribution of Homo erectus. They trace an early human expansion into different environments.",
      source: sources.erectus,
    },
    {
      id: "erectus-body",
      title: "A body for walking",
      photo: "ancestors",
      text: "Longer legs accompanied a life on the ground.",
      detail:
        "Relatively long legs and shorter arms supported terrestrial movement. Skeletons such as Turkana Boy reveal body proportions closer to those of living humans.",
      source: sources.erectus,
    },
    {
      id: "erectus-diet",
      title: "Food and energy",
      photo: "early-people",
      text: "Larger bodies and brains increased daily energy needs.",
      detail:
        "Large bodies and brains required substantial energy. Animal foods formed part of the diet; tools and teeth provide clues to meeting these needs.",
      source: sources.erectus,
    },
  ],
  neanderthals: [
    {
      id: "neanderthal-climate",
      title: "Life in cold climates",
      photo: "ice-world",
      text: "Stocky bodies were among the adaptations associated with colder environments.",
      detail:
        "Neanderthals inhabited environments including cold regions. Their short, robust bodies helped conserve heat, alongside the practical benefits of tools, fire and shelter.",
      source: sources.neanderthals,
    },
    {
      id: "neanderthal-tools",
      title: "Prepared-core tools",
      photo: "stone-tool",
      text: "Preparing a stone core helped produce flakes with planned shapes.",
      detail:
        "Toolmakers shaped cores before striking useful flakes from them. This preparation offered control over flake forms and added flexibility to Neanderthal stone toolkits.",
      source: sources.neanderthals,
    },
    {
      id: "neanderthal-food",
      title: "Hunting and gathering",
      photo: "exhibition-ice",
      text: "Animal remains and plant traces reveal a varied search for food.",
      detail:
        "Neanderthals hunted large animals and ate plant foods. Animal remains, tools and dental traces reveal food choices linked with available local resources.",
      source: sources.neanderthals,
    },
    {
      id: "neanderthal-shelter",
      title: "Hearths and shelter",
      photo: "tour-fire",
      text: "Fire, shelters and clothing helped people live in demanding conditions.",
      detail:
        "Neanderthals controlled fire and used shelters. Scrapers and awls helped work animal hides, providing practical technologies for life in demanding environments.",
      source: sources.neanderthals,
    },
    {
      id: "neanderthal-symbols",
      title: "Ornaments and meaning",
      photo: "early-symbols",
      text: "Occasional symbolic and ornamental objects add another dimension to their story.",
      detail:
        "Some Neanderthal sites preserve symbolic or ornamental objects. These broaden the story beyond hunting and toolmaking; archaeological context helps interpret their possible meanings.",
      source: sources.neanderthals,
    },
  ],
  sapiens: [
    {
      id: "sapiens-symbols",
      title: "Symbols and pigments",
      photo: "early-symbols",
      text: "Marks and pigments preserve a growing symbolic world.",
      detail:
        "Marks, objects and shared practices reveal symbolic behaviour. Archaeologists examine these traces alongside the material evidence of daily life.",
      source: sources.sapiens,
    },
    {
      id: "sapiens-art",
      title: "Cave art",
      photo: "bison-art",
      text: "Paintings and decorated surfaces reveal human creativity.",
      detail:
        "Images and decorated objects preserve prehistoric creativity. Their original meanings remain only partly accessible through the surviving archaeological record.",
      source: sources.sapiens,
    },
    {
      id: "sapiens-ornaments",
      title: "Personal adornment",
      photo: "hand-art",
      text: "Ornaments connected making with identity and expression.",
      detail:
        "Objects worn or displayed form part of the symbolic record of Homo sapiens. Surviving materials preserve only some prehistoric expression.",
      source: sources.sapiens,
    },
    {
      id: "sapiens-tools",
      title: "Specialized tools",
      photo: "exhibition-tools",
      text: "Specialized tools supported a wider variety of tasks.",
      detail:
        "Specialized tools supported fishing, hunting and sewing. Composite forms combined components, reflecting a growing variety of practical problems and solutions.",
      source: sources.sapiens,
    },
    {
      id: "sapiens-networks",
      title: "Networks and exchange",
      photo: "early-people",
      text: "Social connections moved resources across wider areas.",
      detail:
        "Wide social networks connected prehistoric communities. Resources moving between areas offer clues to relationships extending beyond a single camp.",
      source: sources.sapiens,
    },
    {
      id: "sapiens-journeys",
      title: "A wider human world",
      photo: "cave-entrance",
      text: "Human journeys reached an expanding range of landscapes.",
      detail:
        "Homo sapiens spread into varied environments. Food, shelter and technology supported different ways of living as people reached new landscapes.",
      source: sources.sapiens,
    },
  ],
  neolithic: [
    {
      id: "neolithic-farming",
      title: "Farming and crops",
      photo: "exhibition-environment",
      text: "Cultivating crops changed how communities obtained food and used the land.",
      detail:
        "Farming linked food production with repeated work in particular places. In Britain, wheat and barley accompanied its arrival from continental Europe.",
      source: sources.neolithic,
    },
    {
      id: "neolithic-herding",
      title: "Animals and herding",
      photo: "exhibition-legacy",
      text: "Keeping animals became part of the landscape of early farming communities.",
      detail:
        "Farming included keeping animals alongside growing crops. In Britain, introduced sheep, goats and domesticated cattle changed how communities occupied and managed land.",
      source: sources.neolithic,
    },
    {
      id: "neolithic-settlements",
      title: "Permanent settlements",
      photo: "evolution-landscape",
      text: "More settled communities created new relationships with homes and places.",
      detail:
        "Farming encouraged more settled life in many regions. Houses at Skara Brae preserve evidence of Neolithic communities beyond their portable objects.",
      source: sources.neolithic,
    },
    {
      id: "neolithic-pottery",
      title: "Pottery traditions",
      photo: "era-neolithic",
      text: "Clay vessels and changing pottery forms became part of Neolithic material culture.",
      detail:
        "Pottery fragments, decoration and manufacturing details reveal varied traditions. In Britain, forms such as Grooved Ware help distinguish parts of the Neolithic period.",
      source: sources.neolithic,
    },
    {
      id: "neolithic-polished-stone",
      title: "Polished stone axes",
      photo: "stone-tool",
      text: "Polished axes show a different approach to producing stone implements.",
      detail:
        "Neolithic Britain saw large-scale polished axe production. Comparing their surfaces with earlier flaked tools reveals another approach in the long history of working stone.",
      source: sources.neolithic,
    },
  ],
} satisfies Record<string, EraHighlight[]>;
