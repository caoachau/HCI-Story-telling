export interface SiteGalleryImage {
  photo: string;
  title: string;
  caption: string;
}

export interface SiteDetail {
  subtitle: string;
  facts: { label: string; value: string }[];
  paragraphs: string[];
  highlights: { title: string; text: string }[];
  context: string;
  gallery: SiteGalleryImage[];
  sources: { title: string; url: string }[];
}

export const siteDetails: Record<string, SiteDetail> = {
  "Chauvet Cave": {
    subtitle: "A world of animals, movement and imagination",
    facts: [
      { label: "Region", value: "Ardèche, France" },
      { label: "Discovery", value: "1994" },
      { label: "Collection", value: "Palaeolithic cave art" },
    ],
    paragraphs: [
      "Deep within the limestone landscape of southern France, Chauvet preserves a remarkable encounter with the imagination of early artists. Animal figures, handprints and marks transform the cave walls into a visual world that still rewards close observation.",
      "Discovered in December 1994, the cave has been protected from the start. Its paintings are part of a wider archaeological environment: the walls, floor and traces left within the chambers all contribute to understanding the site.",
      "Move between the images to study the relationship between a figure and the rock beneath it. Notice the changing scale of the animals, the overlap of outlines and the way the surface gives the drawings a sense of depth.",
    ],
    highlights: [
      {
        title: "The painted animals",
        text: "Compare the silhouettes and grouped figures. Small changes in line and position can suggest a very different posture or movement.",
      },
      {
        title: "The cave as a whole",
        text: "A painted wall belongs to a chamber, a route and a larger landscape. The surrounding space is an essential part of the experience.",
      },
      {
        title: "A fragile record",
        text: "Protecting the original cave preserves both its art and the archaeological evidence around it. Digital views and reference images offer another way to explore.",
      },
    ],
    context:
      "This gallery brings together Chauvet artwork and cave views from the museum's illustrated collection. Explore the visual details here, then continue to the page's virtual tour for another view of the collection.",
    gallery: [
      {
        photo: "tour-wall",
        title: "The painted wall",
        caption:
          "Animal figures on warm stone in the museum?s illustrated Chauvet collection.",
      },
      {
        photo: "main-chamber",
        title: "Inside the chamber",
        caption:
          "A wider chamber view from the museum?s illustrated collection.",
      },
      {
        photo: "cave-entrance",
        title: "The surrounding landscape",
        caption:
          "The valley landscape as presented in the museum?s landscape illustrations.",
      },
      {
        photo: "hand-art",
        title: "A trace of a hand",
        caption:
          "A handprint detail from the museum?s prehistoric art collection.",
      },
    ],
    sources: [
      {
        title: "French Ministry of Culture · Chauvet",
        url: "https://archeologie.culture.gouv.fr/chauvet/en/original-preservation",
      },
    ],
  },
  Lascaux: {
    subtitle: "Step into a gallery of painted animals",
    facts: [
      { label: "Region", value: "Dordogne, France" },
      { label: "Discovery", value: "1940" },
      { label: "Collection", value: "Painting & engraving" },
    ],
    paragraphs: [
      "Lascaux is a landmark of prehistoric art in the Dordogne. Its painted and engraved animals invite a closer look at how early artists worked with colour, scale and the uneven surfaces of a cave.",
      "Four young explorers entered the cave in September 1940. Their discovery revealed decorated galleries that transformed the study of prehistoric art and brought the site to the attention of researchers and visitors around the world.",
      "Painting occupies a particularly important place at Lascaux. In this gallery, compare broad animal silhouettes with smaller details, and follow the outlines across the rock. Photographs of replicas are identified in their captions so that the views can be understood in context.",
    ],
    highlights: [
      {
        title: "A remarkable bestiary",
        text: "Look for differences between the painted animals: the curve of a back, the length of a neck and the arrangement of the antlers.",
      },
      {
        title: "Colour and contour",
        text: "Follow the relationship between a coloured surface and its outline. The images invite comparison between painting, drawing and engraving.",
      },
      {
        title: "Preserving the original",
        text: "Lascaux's replicas allow the artwork to be experienced while the original cave remains protected. A replica photograph is a view of that interpretation.",
      },
    ],
    context:
      "Lascaux II, III and IV offer different ways to encounter the cave's art. The photographs below include documented replica views alongside the museum's collection illustration; each image has its own caption and credit.",
    gallery: [
      {
        photo: "detail-lascaux-hall",
        title: "Painted horse · replica",
        caption: "A painted horse in a Lascaux replica, photographed by HTO.",
      },
      {
        photo: "detail-lascaux-deer",
        title: "The antlered figure · replica",
        caption:
          "A detail of the figure identified as Megaloceros in the photographed Lascaux replica.",
      },
      {
        photo: "detail-lascaux-painting",
        title: "Animal painting detail",
        caption:
          "A published image of Lascaux painting, shared as a public domain image on Wikimedia Commons.",
      },
      {
        photo: "site-lascaux",
        title: "Collection illustration",
        caption:
          "An illustration of Lascaux from the museum?s visual collection.",
      },
    ],
    sources: [
      {
        title: "French Ministry of Culture · The discovery",
        url: "https://archeologie.culture.gouv.fr/lascaux/en/discovery",
      },
      {
        title: "French Ministry of Culture · Lascaux",
        url: "https://archeologie.culture.gouv.fr/lascaux/en",
      },
    ],
  },
  Altamira: {
    subtitle: "Colour and natural form on a painted ceiling",
    facts: [
      { label: "Region", value: "Cantabria, Spain" },
      { label: "Signature", value: "Polychrome bison" },
      { label: "Collection", value: "Palaeolithic cave art" },
    ],
    paragraphs: [
      "Altamira is closely associated with the bison on its decorated ceiling. Colour and outline interact with the natural shape of the rock, creating figures that are much more than drawings on a flat surface.",
      "The cave contains a range of Palaeolithic subjects and techniques developed across a long artistic history. Bison remain its most distinctive animals, but the collection is best explored by comparing individual figures and their surroundings.",
      "The photographs in this gallery include bison details and museum reproductions. Notice how the posture of each animal changes the way its body occupies the available stone, and how a close view differs from a wider view of the ceiling.",
    ],
    highlights: [
      {
        title: "Polychrome figures",
        text: "Compare areas of colour with the darker outlines that define the animal's body and its individual features.",
      },
      {
        title: "The shape of the stone",
        text: "Look at the surface around each animal. Natural relief is part of the visual effect of the decorated ceiling.",
      },
      {
        title: "Museum reproductions",
        text: "Reproductions make it possible to study these visual relationships in another setting. Their captions identify them clearly.",
      },
    ],
    context:
      "Altamira's museum and research centre connect the study of prehistoric art with the protection of the cave. The gallery presents documented imagery and reproduction views for closer observation.",
    gallery: [
      {
        photo: "detail-altamira-bison",
        title: "A painted bison",
        caption:
          "A published bison image associated with Altamira's celebrated painted ceiling.",
      },
      {
        photo: "detail-altamira-museum",
        title: "Bison detail · museum reproduction",
        caption: "A photographed museum reproduction of an Altamira bison.",
      },
      {
        photo: "detail-altamira-ceiling",
        title: "Painted surface · museum reproduction",
        caption:
          "Another view of the bison paintings as reproduced in a museum setting.",
      },
      {
        photo: "site-altamira",
        title: "Collection illustration",
        caption:
          "An illustration of Altamira from the museum?s visual collection.",
      },
    ],
    sources: [
      {
        title: "Ministry of Culture of Spain · Altamira Cave",
        url: "https://www.arterupestrecantabrico.es/en/cuevas/cueva-de-altamira.html",
      },
    ],
  },
  "Olduvai Gorge": {
    subtitle: "Read the human story through landscape and stone",
    facts: [
      { label: "Region", value: "Northern Tanzania" },
      { label: "Evidence", value: "Fossils & stone tools" },
      { label: "Collection", value: "Early human origins" },
    ],
    paragraphs: [
      "Olduvai Gorge is a key place for exploring early human life in East Africa. Its landscape and archaeological discoveries connect the study of fossils with the development of stone tools.",
      "A chopper from Olduvai in the Smithsonian's Human Origins collection illustrates one form of early stone working. Removing flakes changes both a stone's shape and the edges available for use.",
      "Begin with the wider landscape, then compare the museum viewpoint and the satellite image. Together, they offer different scales for understanding the gorge and the setting of the discoveries associated with it.",
    ],
    highlights: [
      {
        title: "The wider landscape",
        text: "Use the overview photographs to follow the exposed terrain and the relationship between the gorge and its surroundings.",
      },
      {
        title: "Early stone working",
        text: "Simple stone tools are evidence of choices about material, shape and an edge's potential use.",
      },
      {
        title: "Different scales of observation",
        text: "A museum viewpoint and a satellite image tell different visual stories. Moving between them helps connect a site with its larger setting.",
      },
    ],
    context:
      "Olduvai is explored here through landscape photographs, a museum viewpoint and a satellite image. Continue to the human evolution section to place the subject within the museum's wider timeline.",
    gallery: [
      {
        photo: "detail-olduvai-landscape",
        title: "The gorge landscape",
        caption: "A landscape photograph of Olduvai Gorge by gailhampshire.",
      },
      {
        photo: "detail-olduvai-museum",
        title: "The museum viewpoint",
        caption:
          "The viewing platform at the Olduvai Gorge Museum, photographed by Kufundisha.",
      },
      {
        photo: "detail-olduvai-satellite",
        title: "A view from above",
        caption:
          "A satellite image of the Olduvai area, shared as a public domain image.",
      },
      {
        photo: "site-olduvai",
        title: "Collection landscape",
        caption:
          "An illustrated Olduvai landscape from the museum?s visual collection.",
      },
    ],
    sources: [
      {
        title: "Smithsonian Human Origins · Olduvai chopper",
        url: "https://humanorigins.si.edu/evidence/behavior/stone-tools/early-stone-age-tools/olduvai-chopper",
      },
    ],
  },
  "Blombos Cave": {
    subtitle: "Small objects, marks and the beginnings of expression",
    facts: [
      { label: "Region", value: "Western Cape, South Africa" },
      { label: "Evidence", value: "Ochre, beads & tools" },
      { label: "Collection", value: "Early symbolic behaviour" },
    ],
    paragraphs: [
      "Blombos Cave brings attention to objects that can be small in scale yet rich in archaeological meaning. Ochre, shell beads and stone tools contribute to the study of early human creativity and behaviour.",
      "Research at the cave includes an ochre-processing toolkit from deposits about 100,000 years old. Other discoveries include engraved ochre and shell ornaments, offering different kinds of evidence for how materials were prepared and used.",
      "Move from the coastal setting to the deposits inside the cave, then compare the wider entrance view. This change of scale links an individual object with the place and archaeological context in which it was found.",
    ],
    highlights: [
      {
        title: "Engraved ochre",
        text: "Study the organisation of the marks and their relationship to the object's surface. A close image makes small visual details easier to compare.",
      },
      {
        title: "Shell ornaments",
        text: "Small shell beads are among the finds discussed by researchers studying early behaviour at Blombos.",
      },
      {
        title: "Archaeological deposits",
        text: "The layers within a cave give an object context. Excavation photographs help connect a find with the surrounding evidence.",
      },
    ],
    context:
      "The gallery includes the coastal location, archaeological deposits and the cave entrance. Research published by Wits University provides a starting point for exploring the significance of these discoveries.",
    gallery: [
      {
        photo: "detail-blombos-coast",
        title: "The coastal setting",
        caption:
          "The location of Blombos Cave in its South African coastal landscape.",
      },
      {
        photo: "detail-blombos-layers",
        title: "Inside the deposits",
        caption:
          "Archaeological deposit layers at Blombos Cave, photographed by Kari Janne Stenersen.",
      },
      {
        photo: "detail-blombos-entrance",
        title: "The cave entrance",
        caption:
          "The entrance and surrounding terrain at Blombos Cave, photographed by Vincent Mourre / Inrap.",
      },
      {
        photo: "site-blombos",
        title: "Collection illustration",
        caption:
          "An illustration of Blombos from the museum?s visual collection.",
      },
    ],
    sources: [
      {
        title: "Wits University · Origins of early sapiens behaviour",
        url: "https://www.wits.ac.za/news/latest-news/general-news/2021/2021-11/origins-of-early-sapiens-behaviour-opens-at-origins-centre.html",
      },
    ],
  },
};
