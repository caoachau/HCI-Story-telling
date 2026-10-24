import hero from "../assets/museo/khmer-facade-2023.jpg";

let museum:
  | Promise<typeof import("../features/museo-detail/MuseumDetailPage")>
  | undefined;
let story:
  Promise<typeof import("../components/StorytellingPanel")> | undefined;
let critical: Promise<void> | undefined;
let museumModule:
  typeof import("../features/museo-detail/MuseumDetailPage") | undefined;
let storyModule: typeof import("../components/StorytellingPanel") | undefined;
let heroImage: HTMLImageElement | undefined;

// React's first lazy mount still suspends on an already resolved Promise.
// Reading the warmed module synchronously avoids a second fallback/commit.
export const peekMuseumDetail = () => museumModule;
export const peekStorytellingPanel = () => storyModule;

export function loadMuseumDetail() {
  return (museum ??= import("../features/museo-detail/MuseumDetailPage").then(
    (module) => (museumModule = module),
    (error) => {
      museum = undefined;
      throw error;
    },
  ));
}
export function loadStorytellingPanel() {
  return (story ??= import("../components/StorytellingPanel").then(
    (module) => (storyModule = module),
    (error) => {
      story = undefined;
      throw error;
    },
  ));
}
function decodeHero() {
  // Keep the decoded photograph alive until the real hero adopts it.
  const image = (heroImage ??= new Image());
  image.fetchPriority = "low";
  image.src = hero;
  return image.decode().catch(() => {});
}
/** Warm only the opening photograph, route, CSS and two local fonts. */
export function preloadMuseumDetail() {
  return (critical ??= Promise.all([
    loadMuseumDetail().then(() =>
      Promise.all([
        document.fonts.load('900 24px "Museo Display"'),
        document.fonts.load('400 14px "Museo Mono"'),
      ]),
    ),
    loadStorytellingPanel(),
    decodeHero(),
  ])
    .then(() => {})
    .catch((error) => {
      critical = undefined;
      throw error;
    }));
}
