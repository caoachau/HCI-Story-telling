import { eraHighlights } from "./eraHighlights";

const sources = import.meta.glob("../../assets/museo/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function artwork(name: string): string {
  return sources[`../../assets/museo/${name}.jpg`];
}

export const sites = [
  {
    name: "Chauvet Cave",
    country: "France",
    region: "Ardèche, France",
    age: "~36,000",
    period: "36,000 BCE",
    photo: "site-chauvet",
    featured: "map-chauvet",
    x: 45,
    y: 24,
    preview:
      "Painted animals and ancient symbols reveal a world of early human creativity.",
    description:
      "One of the world’s oldest known cave art sites, featuring extraordinary paintings of animals dating back over 36,000 years. Chauvet offers a rare glimpse into the symbolic world of early humans.",
  },
  {
    name: "Lascaux",
    country: "France",
    region: "Dordogne, France",
    age: "~17,000",
    period: "17,000 BCE",
    photo: "site-lascaux",
    featured: "site-lascaux",
    x: 35,
    y: 19,
    preview:
      "Explore painted horses, deer and bulls in the chambers of Lascaux.",
    description:
      "Discover a world of painted horses, deer and bulls. The chambers of Lascaux preserve a remarkable expression of Paleolithic creativity.",
  },
  {
    name: "Altamira",
    country: "Spain",
    region: "Cantabria, Spain",
    age: "~14,000",
    period: "14,000 BCE",
    photo: "site-altamira",
    featured: "site-altamira",
    x: 20,
    y: 42,
    preview:
      "Red and black bison follow the natural contours of the cave walls.",
    description:
      "Red and black bison emerge from the contours of the rock. Explore the connection between natural forms and the imagination of early artists.",
  },
  {
    name: "Olduvai Gorge",
    country: "Tanzania",
    region: "Arusha, Tanzania",
    age: "1.9 million",
    period: "1.9M BCE",
    photo: "site-olduvai",
    featured: "site-olduvai",
    x: 49,
    y: 57,
    preview: "Stone tools and fossils trace early human life in East Africa.",
    description:
      "Follow the traces of early human life in East Africa, where stone tools and fossil discoveries help tell the story of our ancestors.",
  },
  {
    name: "Blombos Cave",
    country: "South Africa",
    region: "Western Cape, South Africa",
    age: "~100,000",
    period: "100,000 BCE",
    photo: "site-blombos",
    featured: "site-blombos",
    x: 45,
    y: 78,
    preview:
      "Engraved ochre and ornaments offer clues to the beginnings of symbolic thought.",
    description:
      "Engraved ochre and personal ornaments offer a window into the early development of symbolic thought and human creativity.",
  },
];

export const eras = [
  {
    name: "Paleolithic",
    highlights: eraHighlights.paleolithic,
    range: "2.6 million - 300,000 BCE",
    subtitle: "Early Hominins",
    kicker: "The first steps",
    photo: "era-paleolithic",
    scene: "ancestors",
    preview:
      "Early hominins developed stone tools and adapted to changing African landscapes.",
    description:
      "The Paleolithic era marks the beginning of the human story. During this time, early hominins evolved in Africa, developed stone tools, and adapted to dramatic climate changes.",
  },
  {
    name: "Homo Erectus",
    highlights: eraHighlights.erectus,
    range: "1.9 million - 100,000 BCE",
    subtitle: "Migration & Fire",
    kicker: "Beyond the familiar",
    photo: "era-erectus",
    scene: "exhibition-origins",
    preview:
      "Follow early human journeys through tools, cooperation and the use of fire.",
    description:
      "Follow early humans as they moved into new landscapes. Stone tools, cooperation and the use of fire changed the ways our ancestors lived.",
  },
  {
    name: "Neanderthals",
    highlights: eraHighlights.neanderthals,
    range: "400,000 - 40,000 BCE",
    subtitle: "Adaptation & Culture",
    kicker: "Life in a changing climate",
    photo: "era-neanderthal",
    scene: "ice-world",
    preview:
      "Explore tools, shelters and community in the changing landscapes of Ice Age Europe.",
    description:
      "Explore the lives of Neanderthals through their tools, shelters and traces of community, set against the changing environments of Ice Age Europe.",
  },
  {
    name: "Homo Sapiens",
    highlights: eraHighlights.sapiens,
    range: "300,000 - 12,000 BCE",
    subtitle: "Innovation & Art",
    kicker: "The world of imagination",
    photo: "era-sapiens",
    scene: "early-symbols",
    preview:
      "Art, symbols and new ways of making connected human creativity with community.",
    description:
      "Art, symbols and new forms of making reveal the expanding imagination of Homo sapiens. Discover the connections between creativity and community.",
  },
  {
    name: "Neolithic",
    highlights: eraHighlights.neolithic,
    range: "12,000 - 3,000 BCE",
    subtitle: "Farming & Settlements",
    kicker: "A new way of living",
    photo: "era-neolithic",
    scene: "exhibition-environment",
    preview:
      "Farming, pottery and settled communities created new relationships with the land.",
    description:
      "Farming, pottery and permanent settlements reshaped everyday life. Explore the transition toward new relationships with the land and with one another.",
  },
];

export const exhibitions = [
  {
    title: "The First Humans",
    description: "Meet our earliest ancestors and their remarkable journey.",
    category: "Origins",
    photo: "exhibition-origins",
    detail:
      "Trace the first steps of the human story through early tools, shared lives and journeys into unfamiliar landscapes.",
  },
  {
    title: "Tools & Innovation",
    description: "How simple ideas changed the world.",
    category: "Tools",
    photo: "exhibition-tools",
    detail:
      "Look closely at the shapes, materials and decisions behind early stone tools. Discover how making transformed human life.",
  },
  {
    title: "Life & Environment",
    description: "The landscapes that shaped human evolution.",
    category: "Environment",
    photo: "exhibition-environment",
    detail:
      "Explore the rivers, grasslands and changing climates that shaped the lives and movements of our ancestors.",
  },
  {
    title: "Beliefs & Culture",
    description: "Art, ritual and the rise of human imagination.",
    category: "Culture",
    photo: "exhibition-culture",
    detail:
      "Discover animal paintings, handprints and early symbols that open a window into the imagination of prehistoric communities.",
  },
  {
    title: "Ice Age Worlds",
    description: "Survival in Earth’s toughest environments.",
    category: "Environment",
    photo: "exhibition-ice",
    detail:
      "Travel through a landscape of glaciers and mammoths, and explore the ingenuity of people living in a changing world.",
  },
  {
    title: "Legacy Today",
    description: "How our ancient past still shapes our future.",
    category: "Culture",
    photo: "exhibition-legacy",
    detail:
      "Reflect on the shared human story and the ways creativity, cooperation and adaptation connect the past with the present.",
  },
];

export const scenes = [
  {
    name: "The painted wall",
    photo: "tour-art",
    background: "tour-wall",
    description: "Animal figures emerge from the warm stone of Chauvet Cave.",
  },
  {
    name: "The main chamber",
    photo: "tour-chamber",
    background: "main-chamber",
    description: "Explore the extraordinary painted walls of the main chamber.",
  },
  {
    name: "The world of mammoths",
    photo: "tour-mammoth",
    background: "exhibition-ice",
    description: "Discover the animals that shared the world of early humans.",
  },
  {
    name: "A gathering by fire",
    photo: "tour-fire",
    background: "tour-fire",
    description: "Step into a chamber illuminated by the warmth of fire.",
  },
  {
    name: "Ice Age landscapes",
    photo: "tour-landscape",
    background: "ice-world",
    description: "A changing climate shaped new landscapes and journeys.",
  },
  {
    name: "The first journeys",
    photo: "exhibition-origins",
    background: "exhibition-origins",
    description: "Follow the first humans into the world beyond the cave.",
  },
];
