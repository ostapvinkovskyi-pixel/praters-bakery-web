/**
 * Scene data for the scroll-scrub journey. Single-shot film: one continuous
 * 8s take split into three contiguous clips, so every seam is two consecutive
 * frames of the same render. Keep this array a module constant.
 */
"use client";
import { createElement } from "react";

import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "./scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#CFC7FA",
  background: "#1E130D",
  ink: "#FFF9F2",
  muted: "#E6D5C4",
};

const journeyActions = createElement(
  "div",
  { className: "pb-journey-actions" },
  createElement("a", { className: "pb-slab-cta", href: "#order" }, createElement("span", null, "Start a pre-order"), createElement("span", { "aria-hidden": "true", className: "pb-slab-cta__arrow" }, "→")),
  createElement("a", { className: "pb-underline pb-underline--light", href: "#menu" }, "See the fall menu"),
);

const dozenAction = createElement(
  "a",
  { className: "pb-slab-cta", href: "#order", "data-add": "cinnamon-rolls" },
  createElement("span", null, "Reserve a dozen · $45"),
  createElement("span", { "aria-hidden": "true", className: "pb-slab-cta__arrow" }, "→"),
);

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    actions: journeyActions,
    body: "Cinnamon rolls, pies, pound cakes and quarter pound cookies, made by hand in Rock Hill with milk, eggs and apples from farms down the road.",
    clip: "/assets/world/scene-01.mp4",
    id: "welcome",
    kicker: "Rock Hill, SC · Est. 2019",
    label: "Welcome",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobilePoster: "/assets/world/scene-01-mobile-poster.jpg",
    poster: "/assets/world/scene-01-poster.jpg",
    scroll: 1.3,
    tags: ["★ 5.0 from 73 Google reviews", "Local ingredients"],
    title: "Simple & Southern, baked from scratch.",
  },
  {
    align: "right",
    body: "Order at least 3 days ahead and pick up Tuesday to Friday. We bake your order fresh, so it is boxed and waiting when you walk in.",
    clip: "/assets/world/scene-02.mp4",
    id: "fresh",
    kicker: "Fall pre-order menu",
    label: "Fresh",
    mobileClip: "/assets/world/scene-02-mobile.mp4",
    mobilePoster: "/assets/world/scene-02-mobile-poster.jpg",
    poster: "/assets/world/scene-02-poster.jpg",
    scroll: 1.3,
    tags: ["Pickup Tue to Fri", "Tax included"],
    title: "Warm, iced and waiting for you.",
  },
  {
    actions: dozenAction,
    body: "Guests drive 45 minutes for this cinnamon roll. Reserve a dozen for the weekend before the fall batch is spoken for.",
    clip: "/assets/world/scene-03.mp4",
    id: "the-roll",
    kicker: "The one they drive for",
    label: "The roll",
    mobileClip: "/assets/world/scene-03-mobile.mp4",
    mobilePoster: "/assets/world/scene-03-mobile-poster.jpg",
    poster: "/assets/world/scene-03-poster.jpg",
    scroll: 1.4,
    tags: ["Cream cheese icing", "Baked to order"],
    title: "One bite and you'll get the hype.",
  },
];
