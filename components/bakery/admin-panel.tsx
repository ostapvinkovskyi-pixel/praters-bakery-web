"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { formatPrice } from "@/lib/menu";
import { formatPickup, todayIso } from "@/lib/pickup";
import type { OrderStatus, StoredOrder } from "@/lib/store.server";
import { BrandLockup } from "./brand-mark";
import "./bakery.css";

const ORDER_STATUSES: OrderStatus[] = ["new", "confirmed", "ready", "picked-up", "cancelled"];
const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  ready: "Ready",
  "picked-up": "Picked up",
  cancelled: "Cancelled",
};

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = await res.json().catch(() => ({ ok: false }));
    setBusy(false);
    if (result.ok) router.refresh();
    else setError("That password didn't work.");
  }

  return (
    <main className="pb-admin pb-admin--login">
      <form className="pb-admin__login" onSubmit={onSubmit}>
        <BrandLockup />
        <h1>Owner dashboard</h1>
        <label className="pb-field">
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error ? <p className="pb-form__error" role="alert">{error}</p> : null}
        <button type="submit" className="pb-submit" disabled={busy}>
          <span>{busy ? "Checking..." : "Sign in"}</span>
        </button>
      </form>
    </main>
  );
}

export function AdminDashboard({
  orders,
  subscribers,
}: {
  orders: StoredOrder[];
  subscribers: { email: string; createdAt: string }[];
}) {
  const router = useRouter();
  const [view, setView] = useState<"upcoming" | "all">("upcoming");
  const [saving, setSaving] = useState<string | null>(null);

  const today = todayIso();
  const visible = useMemo(
    () =>
      view === "upcoming"
        ? orders.filter((order) => order.pickupDate >= today && order.status !== "cancelled" && order.status !== "picked-up")
        : orders,
    [orders, today, view],
  );

  const byDay = useMemo(() => {
    const groups = new Map<string, StoredOrder[]>();
    for (const order of visible) groups.set(order.pickupDate, [...(groups.get(order.pickupDate) ?? []), order]);
    return Array.from(groups);
  }, [visible]);

  const newCount = orders.filter((order) => order.status === "new").length;
  const upcomingRevenue = orders
    .filter((order) => order.pickupDate >= today && order.status !== "cancelled")
    .reduce((sum, order) => sum + order.totalCents, 0);

  async function changeStatus(code: string, status: OrderStatus) {
    setSaving(code);
    try {
      await fetch("/api/admin/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, status }),
      });
      router.refresh();
    } finally {
      setSaving(null);
    }
  }

  return (
    <main className="pb-admin">
      <header className="pb-admin__bar">
        <BrandLockup />
        <div className="pb-admin__bar-actions">
          <button type="button" className="pb-link-button" onClick={() => router.refresh()}>
            Refresh
          </button>
          <button
            type="button"
            className="pb-link-button"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.refresh();
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <p className="pb-admin__demo-note">
        Demo note: orders here are held in memory for this preview and may reset between visits. Ask me to wire up a
        real database when you are ready to take live orders on this domain.
      </p>

      <section className="pb-admin__stats">
        <div>
          <strong>{newCount}</strong>
          <span>New orders to confirm</span>
        </div>
        <div>
          <strong>{formatPrice(upcomingRevenue)}</strong>
          <span>Upcoming pickups</span>
        </div>
        <div>
          <strong>{subscribers.length}</strong>
          <span>Email list signups</span>
        </div>
      </section>

      <div className="pb-tabs" role="group" aria-label="Order view">
        <button type="button" className="pb-tab" aria-pressed={view === "upcoming"} onClick={() => setView("upcoming")}>
          Upcoming
        </button>
        <button type="button" className="pb-tab" aria-pressed={view === "all"} onClick={() => setView("all")}>
          All orders
        </button>
      </div>

      {byDay.length === 0 ? <p className="pb-admin__empty">No orders here yet.</p> : null}

      {byDay.map(([day, dayOrders]) => (
        <section className="pb-admin__day" key={day}>
          <h2>
            {formatPickup(day)} <span>{dayOrders.length} orders</span>
          </h2>
          <div className="pb-admin__orders">
            {dayOrders.map((order) => (
              <article className="pb-admin__order" key={order.code} data-status={order.status}>
                <header>
                  <strong>{order.code}</strong>
                  <select
                    aria-label={`Status for ${order.code}`}
                    value={order.status}
                    disabled={saving === order.code}
                    onChange={(event) => changeStatus(order.code, event.target.value as OrderStatus)}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                </header>
                <p className="pb-admin__who">
                  {order.name} · <a href={`tel:${order.phone}`}>{order.phone}</a>
                  {order.email ? (
                    <>
                      {" "}
                      · <a href={`mailto:${order.email}`}>{order.email}</a>
                    </>
                  ) : null}
                </p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.name}>
                      <span>
                        {item.qty} × {item.name}
                      </span>
                      <span>{formatPrice(item.lineCents)}</span>
                    </li>
                  ))}
                </ul>
                {order.notes ? <p className="pb-admin__notes">{order.notes}</p> : null}
                <footer>
                  <span>Placed {order.createdAt}</span>
                  <strong>{formatPrice(order.totalCents)}</strong>
                </footer>
              </article>
            ))}
          </div>
        </section>
      ))}

      {subscribers.length ? (
        <details className="pb-admin__subs">
          <summary>Email list ({subscribers.length})</summary>
          <p>{subscribers.map((sub) => sub.email).join(", ")}</p>
        </details>
      ) : null}
    </main>
  );
}
