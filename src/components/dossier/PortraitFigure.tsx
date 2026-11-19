"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

/** Framed "FIG. 1" portrait with engraved-monogram paper fallback. */
export default function PortraitFigure() {
  const [ok, setOk] = useState(true);

  return (
    <figure className={`d-figure${ok ? "" : " no-img"}`}>
      <span className="d-corner tl" aria-hidden="true" />
      <span className="d-corner br" aria-hidden="true" />
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.portrait}
          alt={`Portrait of ${profile.name}`}
          onError={() => setOk(false)}
        />
      ) : null}
      <div className="d-figure-fallback" aria-hidden="true">
        AS
      </div>
      <figcaption className="d-mono">FIG. 1 — THE ENGINEER</figcaption>
    </figure>
  );
}
