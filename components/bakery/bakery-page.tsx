"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { MENU, MENU_BY_ID, MENU_CATEGORIES, formatPrice, type MenuCategory } from "@/lib/menu";
import { formatPickup, upcomingPickupDays } from "@/lib/pickup";
import { RollingPin } from "./brand-mark";
import "./bakery.css";

type Cart = Record<string, number>;

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Praters+Bakery+2210+India+Hook+Rd+%23101+Rock+Hill+SC+29732";

const FARMS = [
  { name: "Windy Hill Orchard", what: "Apples", where: "York, SC" },
  { name: "Hendersonville", what: "Apples", where: "Hendersonville, NC" },
  { name: "Nance Farm Creamery", what: "Milk", where: "McConnells, SC" },
  { name: "SMT", what: "Eggs", where: "York, SC" },
  { name: "Bush-n-Vine", what: "Produce", where: "York, SC" },
  { name: "Sweet Southern Farms", what: "Vanilla", where: "Edgemoor, SC" },
  { name: "Black's Peaches", what: "Peaches", where: "York, SC" },
  { name: "Wild Hope Farm", what: "Produce", where: "Chester, SC" },
  { name: "LushAcres Farm", what: "Produce", where: "Clinton, SC" },
];

const REVIEWS = [
  {
    quote: "Wow!!!! I drove over 45 minutes one way to try this bakery. The cinnamon roll is one of the best I have ever had!",
    who: "S. H.",
    meta: "Local Guide · 152 reviews",
  },
  {
    quote: "Everyone was raving about their cinnamon rolls, and now I completely understand why! The smell is absolutely heavenly.",
    who: "AIV",
    meta: "Found us through Rock Hill Eats",
  },
  {
    quote: "Oh My Yummy! A boutique style storefront that is warm and welcoming. The aroma of fresh baked goods sets the tone.",
    who: "Ryan A.",
    meta: "Local Guide · 186 reviews",
  },
];

const FAVORITES: { id: string; title: string; line: string; image: string; category: MenuCategory; addId?: string }[] = [
  { id: "rolls", title: "Cinnamon rolls", line: "$3.75 each · dozen minimum", image: "/assets/food/rolls.jpg", category: "breads", addId: "cinnamon-rolls" },
  { id: "pies", title: "Whole pies", line: "Key lime, pecan, apple and more from $22.50", image: "/assets/food/pies.jpg", category: "pies" },
  { id: "cakes", title: "Cakes & cheesecakes", line: "Coconut, turtle, pound cakes from $35", image: "/assets/food/cakes.jpg", category: "cakes" },
  { id: "cookies", title: "Quarter pound cookies", line: "8 flavors from $3.75", image: "/assets/food/cookies.jpg", category: "cookies" },
];

function cartCount(cart: Cart) {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal(cart: Cart) {
  return Object.entries(cart).reduce((sum, [id, qty]) => sum + (MENU_BY_ID.get(id)?.priceCents ?? 0) * qty, 0);
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

export function BakeryPage() {
  const [cart, setCart] = useState<Cart>({});
  const [category, setCategory] = useState<MenuCategory>("breads");
  const [flash, setFlash] = useState<string | null>(null);

  const addItem = useCallback((id: string) => {
    const item = MENU_BY_ID.get(id);
    if (!item) return;
    setCart((current) => ({ ...current, [id]: current[id] ? current[id] + 1 : item.min }));
    setFlash(item.name);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const item = MENU_BY_ID.get(id);
    if (!item) return;
    setCart((current) => {
      const next = { ...current };
      if (qty < item.min) delete next[id];
      else next[id] = Math.min(qty, 500);
      return next;
    });
  }, []);

  // Journey chapter CTAs are static markup, so they declare what to add with data-add.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-add]");
      if (target?.dataset.add) addItem(target.dataset.add);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [addItem]);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 2200);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const count = cartCount(cart);
  const total = cartTotal(cart);

  return (
    <div className="pb-page">
      <ProofRibbon />
      <Favorites
        onBrowse={(next) => {
          setCategory(next);
          scrollToId("menu");
        }}
        onAdd={addItem}
      />
      <MenuSection cart={cart} category={category} onCategory={setCategory} onAdd={addItem} />
      <HowItWorks />
      <Reviews />
      <Farms />
      <OrderSection cart={cart} onQty={setQty} onClear={() => setCart({})} />
      <Visit />
      <Footer />

      <div className="pb-toast" role="status" aria-live="polite" data-show={flash ? "true" : "false"}>
        {flash ? `Added ${flash}` : ""}
      </div>

      {count > 0 ? (
        <a className="pb-dock" href="#order">
          <span className="pb-dock__count">{count}</span>
          <span className="pb-dock__label">Review order</span>
          <span className="pb-dock__total">{formatPrice(total)}</span>
        </a>
      ) : null}
    </div>
  );
}

function ProofRibbon() {
  return (
    <section className="pb-ribbon" aria-label="Why Rock Hill loves us">
      <div className="pb-ribbon__item">
        <strong>★★★★★ 5.0</strong>
        <span>73 Google reviews</span>
      </div>
      <div className="pb-ribbon__item">
        <strong>Est. 2019</strong>
        <span>Family bakery in Rock Hill</span>
      </div>
      <div className="pb-ribbon__item">
        <strong>9 local farms</strong>
        <span>Milk, eggs, apples, vanilla</span>
      </div>
      <div className="pb-ribbon__item">
        <strong>Tax included</strong>
        <span>The price you see is the price</span>
      </div>
    </section>
  );
}

function Favorites({ onBrowse, onAdd }: { onBrowse: (category: MenuCategory) => void; onAdd: (id: string) => void }) {
  return (
    <section className="pb-favorites" aria-labelledby="favorites-title">
      <div className="pb-favorites__intro">
        <p className="pb-eyebrow">Fall favorites</p>
        <h2 id="favorites-title" className="pb-display">What folks line up for</h2>
        <p className="pb-lede">
          Everything is baked by hand, the Southern way, with ingredients from farms you can drive to.
        </p>
      </div>
      <div className="pb-bento">
        {FAVORITES.map((fav) => (
          <article className={`pb-bento__tile pb-bento__tile--${fav.id}`} key={fav.id}>
            <img src={fav.image} alt={fav.title} loading="lazy" decoding="async" />
            <div className="pb-bento__caption">
              <h3>{fav.title}</h3>
              <p>{fav.line}</p>
              <div className="pb-bento__actions">
                {fav.addId ? (
                  <button type="button" className="pb-bento__add" onClick={() => onAdd(fav.addId!)}>
                    Add a dozen
                  </button>
                ) : null}
                <button type="button" className="pb-bento__browse" onClick={() => onBrowse(fav.category)}>
                  See all
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MenuSection({
  cart,
  category,
  onCategory,
  onAdd,
}: {
  cart: Cart;
  category: MenuCategory;
  onCategory: (category: MenuCategory) => void;
  onAdd: (id: string) => void;
}) {
  const active = MENU_CATEGORIES.find((entry) => entry.id === category) ?? MENU_CATEGORIES[0];
  const items = useMemo(() => MENU.filter((item) => item.category === category), [category]);

  return (
    <section className="pb-menu" id="menu" aria-labelledby="menu-title">
      <header className="pb-menu__head">
        <div>
          <p className="pb-eyebrow">Fall pre-order menu</p>
          <h2 id="menu-title" className="pb-display">Pick your treats</h2>
        </div>
        <p className="pb-menu__rule">Order 3 days ahead · Pickup Tuesday to Friday · All tax included</p>
      </header>

      <div className="pb-tabs" role="group" aria-label="Menu categories">
        {MENU_CATEGORIES.map((entry) => (
          <button
            type="button"
            key={entry.id}
            className="pb-tab"
            aria-pressed={entry.id === category}
            onClick={() => onCategory(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <p className="pb-menu__blurb">{active.blurb}</p>

      <ul className="pb-menu__list">
        {items.map((item) => {
          const inCart = cart[item.id] ?? 0;
          return (
            <li className="pb-menu__item" key={item.id}>
              <div className="pb-menu__text">
                <h3>
                  {item.name}
                  {item.seasonal ? <span className="pb-seasonal">Seasonal</span> : null}
                </h3>
                <p>
                  {item.note ? `${item.note} ` : ""}
                  {item.min > 1 ? `Minimum ${item.min}.` : ""}
                </p>
              </div>
              <span className="pb-menu__leader" aria-hidden="true" />
              <span className="pb-menu__price">
                {formatPrice(item.priceCents)}
                <small> / {item.unit}</small>
              </span>
              <button
                type="button"
                className="pb-add"
                data-in-cart={inCart > 0 ? "true" : "false"}
                onClick={() => onAdd(item.id)}
                aria-label={inCart > 0 ? `Add one more ${item.name}, ${inCart} in order` : `Add ${item.name} to order`}
              >
                {inCart > 0 ? <span className="pb-add__count">{inCart}</span> : <span className="pb-add__plus">+</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Pick your treats", body: "Add anything from the fall menu. Minimums are applied for you." },
    { n: "02", title: "Choose a pickup day", body: "Tuesday to Friday, at least 3 days out, so we can source fresh local ingredients." },
    { n: "03", title: "Pick it up in Rock Hill", body: "We confirm your order, bake it fresh and have it boxed and waiting at India Hook Rd." },
  ];
  return (
    <section className="pb-how" id="how" aria-labelledby="how-title">
      <h2 id="how-title" className="pb-display pb-how__title">
        Pre-ordering takes about a minute
      </h2>
      <ol className="pb-how__steps">
        {steps.map((step) => (
          <li key={step.n}>
            <span className="pb-how__n">{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Reviews() {
  return (
    <section className="pb-reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="pb-reviews__score">
        <span className="pb-reviews__big">5.0</span>
        <span className="pb-reviews__stars" aria-hidden="true">★★★★★</span>
        <h2 id="reviews-title">73 Google reviews, and not one below five stars</h2>
        <p>People mention the cinnamon rolls 27 times. The key lime pie and the cookies are close behind.</p>
      </div>
      <div className="pb-reviews__cards">
        {REVIEWS.map((review) => (
          <figure className="pb-review" key={review.who}>
            <blockquote>“{review.quote}”</blockquote>
            <figcaption>
              <strong>{review.who}</strong>
              <span>{review.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Farms() {
  return (
    <section className="pb-farms" aria-labelledby="farms-title">
      <div className="pb-farms__head">
        <p className="pb-eyebrow">Simple & Southern</p>
        <h2 id="farms-title" className="pb-display">Our neighbors are in every bite</h2>
      </div>
      <ul className="pb-farms__list">
        {FARMS.map((farm) => (
          <li key={farm.name}>
            <span className="pb-farms__what">{farm.what}</span>
            <strong>{farm.name}</strong>
            <span>{farm.where}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type OrderState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "error"; message: string }
  | { kind: "done"; code: string; totalCents: number; pickupDate: string };

function readError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  try {
    const parsed = JSON.parse(raw) as { message?: string }[];
    if (Array.isArray(parsed) && parsed[0]?.message) return parsed[0].message;
  } catch {
    // Not a validation payload.
  }
  return raw || "Something went wrong. Please try again.";
}

function OrderSection({ cart, onQty, onClear }: { cart: Cart; onQty: (id: string, qty: number) => void; onClear: () => void }) {
  const [days, setDays] = useState<string[]>([]);
  const [pickupDate, setPickupDate] = useState("");
  const [state, setState] = useState<OrderState>({ kind: "idle" });

  useEffect(() => {
    setDays(upcomingPickupDays(8));
  }, []);

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ item: MENU_BY_ID.get(id), qty }))
    .filter((line): line is { item: NonNullable<typeof line.item>; qty: number } => Boolean(line.item));
  const total = cartTotal(cart);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length) {
      setState({ kind: "error", message: "Add at least one item from the menu first." });
      return;
    }
    if (!pickupDate) {
      setState({ kind: "error", message: "Choose a pickup day." });
      return;
    }
    const form = new FormData(event.currentTarget);
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? ""),
          notes: String(form.get("notes") ?? ""),
          company: String(form.get("company") ?? ""),
          pickupDate,
          items: lines.map((line) => ({ id: line.item.id, qty: line.qty })),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? "Something went wrong. Please try again.");
      setState({ kind: "done", ...result });
      onClear();
    } catch (error) {
      setState({ kind: "error", message: readError(error) });
    }
  }

  if (state.kind === "done") {
    return (
      <section className="pb-order" id="order" aria-labelledby="order-title">
        <div className="pb-ticket pb-ticket--done">
          <RollingPin className="pb-ticket__pin" />
          <p className="pb-eyebrow">Order received</p>
          <h2 id="order-title" className="pb-display">Thank you! We've got it.</h2>
          <p className="pb-ticket__code">
            Your order number <strong>{state.code}</strong>
          </p>
          <p>
            Pickup {formatPickup(state.pickupDate)} · {formatPrice(state.totalCents)} tax included. We'll reach out to
            confirm. Questions? Email <a href="mailto:Pratersbakery@gmail.com">Pratersbakery@gmail.com</a>.
          </p>
          <button type="button" className="pb-link-button" onClick={() => setState({ kind: "idle" })}>
            Place another order
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-order" id="order" aria-labelledby="order-title">
      <div className="pb-order__intro">
        <p className="pb-eyebrow">Your pre-order</p>
        <h2 id="order-title" className="pb-display">Reserve it before it sells out</h2>
        <p className="pb-lede">We bake to order, so reserving is the only way to guarantee your dozen.</p>
      </div>

      <div className="pb-order__grid">
        <div className="pb-cart" aria-live="polite">
          <h3>Your box</h3>
          {lines.length === 0 ? (
            <div className="pb-cart__empty">
              <p>Your box is empty.</p>
              <a href="#menu" className="pb-underline">Browse the fall menu</a>
              <button type="button" className="pb-underline" data-add="cinnamon-rolls">
                Or start with a dozen cinnamon rolls
              </button>
            </div>
          ) : (
            <ul className="pb-cart__lines">
              {lines.map(({ item, qty }) => (
                <li key={item.id}>
                  <div className="pb-cart__name">
                    <strong>{item.name}</strong>
                    <span>
                      {formatPrice(item.priceCents)} / {item.unit}
                      {item.min > 1 ? ` · min ${item.min}` : ""}
                    </span>
                  </div>
                  <div className="pb-stepper">
                    <button type="button" onClick={() => onQty(item.id, qty - 1)} aria-label={`Remove one ${item.name}`}>
                      −
                    </button>
                    <input
                      aria-label={`${item.name} quantity`}
                      inputMode="numeric"
                      value={qty}
                      onChange={(event) => {
                        const next = Number.parseInt(event.target.value, 10);
                        if (Number.isFinite(next)) onQty(item.id, Math.max(next, item.min));
                      }}
                    />
                    <button type="button" onClick={() => onQty(item.id, qty + 1)} aria-label={`Add one ${item.name}`}>
                      +
                    </button>
                  </div>
                  <span className="pb-cart__line">{formatPrice(item.priceCents * qty)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="pb-cart__total">
            <span>Total, tax included</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>

        <form className="pb-form" onSubmit={onSubmit} noValidate>
          <fieldset className="pb-days">
            <legend>Pickup day</legend>
            <div className="pb-days__grid">
              {days.map((day) => (
                <label key={day} className="pb-day" data-checked={pickupDate === day ? "true" : "false"}>
                  <input
                    type="radio"
                    name="pickup"
                    value={day}
                    checked={pickupDate === day}
                    onChange={() => setPickupDate(day)}
                  />
                  <span className="pb-day__dow">{formatPickup(day, "short").split(",")[0]}</span>
                  <span className="pb-day__date">{formatPickup(day, "short").split(", ")[1]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="pb-fields">
            <label className="pb-field">
              <span>Name</span>
              <input name="name" autoComplete="name" required maxLength={80} />
            </label>
            <label className="pb-field">
              <span>Phone</span>
              <input name="phone" type="tel" autoComplete="tel" required maxLength={30} />
            </label>
            <label className="pb-field pb-field--wide">
              <span>Email (optional, for your confirmation)</span>
              <input name="email" type="email" autoComplete="email" maxLength={120} />
            </label>
            <label className="pb-field pb-field--wide">
              <span>Notes (cookie flavor for specialty dozens, drizzle choice, allergies)</span>
              <textarea name="notes" rows={3} maxLength={600} />
            </label>
            <label className="pb-honeypot" aria-hidden="true">
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {state.kind === "error" ? (
            <p className="pb-form__error" role="alert">
              {state.message}
            </p>
          ) : null}

          <button type="submit" className="pb-submit" disabled={state.kind === "sending"}>
            <span>{state.kind === "sending" ? "Sending your order..." : "Send my pre-order"}</span>
            <span className="pb-submit__total">{formatPrice(total)}</span>
          </button>
          <p className="pb-form__fine">
            No payment online. Prefer Facebook Messenger or email? Write to{" "}
            <a href="mailto:Pratersbakery@gmail.com">Pratersbakery@gmail.com</a>.
          </p>
        </form>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="pb-visit" id="visit" aria-labelledby="visit-title">
      <div className="pb-visit__card">
        <p className="pb-eyebrow">Come say hi</p>
        <h2 id="visit-title" className="pb-display">2210 India Hook Rd, Suite 101</h2>
        <p className="pb-visit__city">Rock Hill, SC 29732</p>
        <dl className="pb-visit__facts">
          <div>
            <dt>Pre-order pickup</dt>
            <dd>Tuesday to Friday</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:Pratersbakery@gmail.com">Pratersbakery@gmail.com</a>
            </dd>
          </div>
          <div>
            <dt>Also on</dt>
            <dd>
              <a href="https://www.facebook.com/search/top?q=praters%20bakery" target="_blank" rel="noreferrer">
                Facebook Messenger
              </a>
            </dd>
          </div>
        </dl>
        <a className="pb-directions" href={MAPS_URL} target="_blank" rel="noreferrer">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
            />
          </svg>
          Get directions
        </a>
      </div>
      <img className="pb-visit__photo" src="/assets/food/pies.jpg" alt="Fresh pies on a farmhouse table" loading="lazy" />
    </section>
  );
}

function Footer() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? "Something went wrong.");
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(readError(error));
    }
  }

  return (
    <footer className="pb-footer">
      <div className="pb-footer__signup">
        <h2 className="pb-display">Be first to hear about holiday menus</h2>
        {status === "done" ? (
          <p className="pb-footer__thanks">You're on the list. See you soon!</p>
        ) : (
          <form className="pb-stamp-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="signup-email">
              Email
            </label>
            <input id="signup-email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
            <button type="submit" className="pb-stamp" disabled={status === "sending"}>
              Keep me posted
            </button>
          </form>
        )}
        {status === "error" ? <p className="pb-form__error" role="alert">{message}</p> : null}
      </div>
      <div className="pb-footer__base">
        <span>© {new Date().getFullYear()} Praters Bakery · Simple & Southern · Est. 2019</span>
        <a href="/admin">Owner login</a>
      </div>
    </footer>
  );
}
