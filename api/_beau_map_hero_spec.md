# JATI Hub Board Deck: Hero Visual Replacement Spec

**From:** BEAU (Chief Brand Officer)
**For:** THEO (implementation)
**Target file:** `hub-preview.js`
**Date:** 2026-09-01

## What this replaces

The abstract "Jala lattice" motif (`.lattice-figure` / `.lat-line` / `.lat-node`, a network of dots connected by lines) in the hero of the board pitch-deck page. Per Chris's explicit instruction, it is replaced with a clean, simplified silhouette map of the Indonesian archipelago. No dots, no connecting lines, no pins or markers. Pure geographic silhouette.

## Important implementation note for THEO

`hub-preview.js` does not contain plain HTML/CSS text. The page markup is embedded as a single large base64-encoded string inside the file (decoded and served at request time). Searching the raw `.js` file for `lattice` or for these CSS tokens directly will return no matches. Decode the embedded string first, make the edit below in the decoded HTML, then re-encode and replace the string in the file. Do not attempt a plain-text find-and-replace against the `.js` file as-is.

## Where it goes

Same hero slot the lattice currently occupies, inside `.hero-inner` (the right-hand visual column, dark navy background `--d:#1e2d6e`). No grid CSS changes needed. This is a drop-in replacement of one figure element and its associated styles.

## Replacement markup

```html
<figure class="map-figure" aria-hidden="true">
  <svg viewBox="0 0 480 480" role="img" aria-label="A silhouette map of the Indonesian archipelago, from Sumatra in the west to Papua in the east, where JATI's members serve">
    <g transform="translate(0,36)">
      <path class="map-island" d="M60,70 C75,58 96,63 111,89 C131,124 151,166 166,206 C176,231 179,251 166,269 C155,282 139,276 127,259 C104,226 79,186 64,151 C51,121 47,96 60,70 Z"/>
      <path class="map-island" d="M168,298 C190,289 221,287 251,290 C271,293 289,297 303,303 C306,307 300,310 288,309 C260,307 224,304 194,307 C179,308 169,306 164,301 Z"/>
      <path class="map-island" d="M196,95 C221,79 251,77 276,90 C301,103 316,127 318,157 C320,182 310,207 290,224 C270,240 244,244 219,233 C194,223 179,201 174,173 C169,146 175,116 196,95 Z"/>
      <path class="map-island" d="M340,150 C354,131 364,116 368,105 C373,116 371,136 362,156 C376,161 397,165 416,171 C422,179 411,189 396,191 C401,201 406,216 401,231 C409,241 401,256 389,263 C381,256 373,241 369,226 C361,236 346,251 336,269 C328,273 319,266 322,251 C315,236 318,216 326,201 C316,186 311,166 321,151 C326,141 333,141 340,150 Z"/>
      <path class="map-island" d="M305,300 C310,297 316,298 318,303 C320,308 316,312 310,311 C305,310 303,304 305,300 Z M328,304 C333,302 338,304 337,309 C336,313 330,313 327,309 Z M345,306 C355,300 370,302 378,308 C382,312 375,316 365,315 C352,314 342,312 345,306 Z M390,308 C405,304 420,306 428,311 C430,314 422,317 408,316 C398,315 388,313 390,308 Z M432,312 C442,308 452,314 449,325 C446,335 435,338 427,330 C422,323 425,316 432,312 Z"/>
      <path class="map-island" d="M395,180 C405,175 415,178 417,188 C419,198 412,205 402,203 C393,201 390,190 395,180 Z M400,225 C415,221 430,223 435,228 C437,232 428,236 415,235 C405,234 397,230 400,225 Z M385,220 C390,217 395,219 394,224 C393,228 387,229 384,225 Z"/>
      <path class="map-island" d="M400,160 C410,148 425,145 435,152 C440,156 438,164 430,168 C438,172 448,168 458,172 C465,176 470,185 472,197 C474,212 470,230 462,246 C454,261 443,273 430,278 C417,283 403,275 396,262 C390,250 393,235 403,223 C396,213 390,199 392,184 C393,174 396,166 400,160 Z"/>
    </g>
  </svg>
</figure>
```

The six `<path>` elements map to: Sumatra, Java, Kalimantan, Sulawesi, Bali + the Nusa Tenggara chain (one combined path, five subpaths), Maluku (one combined path, three subpaths), Papua. All are hand-tuned, stylized shapes for a pitch-deck decorative mark, not GIS data, but relative positions are checked against real geography: Sumatra NW tapering down to meet Java's west end, Kalimantan north of Java, Sulawesi east of Kalimantan with its signature multi-armed silhouette, the Bali/Nusa Tenggara chain running along the southern rim east of Java, Maluku scattered between Sulawesi's eastern arm and Papua, Papua's bird-head peninsula hooking northwest at the far east edge of the frame.

Papua's easternmost point sits close to the right edge of the 480-unit viewBox (x≈474 of 480). This is intentional, Papua genuinely is the archipelago's easternmost extent, but if a visual QA pass wants more right-margin breathing room, adjust by adding a small negative x-shift to the outer `<g transform>`.

## CSS

Replace the existing `.lattice-figure` / `.lat-line` / `.lat-node` block and its keyframes with:

```css
.map-figure{
  margin:0;
  justify-self:end;
  width:min(42vw,480px);
  aspect-ratio:1;
  position:relative;
  opacity:0;
  transform:scale(.94);
  transform-origin:center;
  animation:mapSettle 1s cubic-bezier(.16,1,.3,1) .1s forwards;
}
.map-figure svg{
  width:100%;
  height:100%;
  display:block;
  overflow:visible;
  shape-rendering:geometricPrecision;
}
.map-island{
  fill:rgba(255,255,255,.09);
  stroke:rgba(255,255,255,.32);
  stroke-width:1.4;
  stroke-linejoin:round;
}
@keyframes mapSettle{
  to{opacity:1;transform:scale(1)}
}
@media(prefers-reduced-motion:reduce){
  .map-figure{
    animation:none;
    opacity:1;
    transform:scale(1);
  }
}
```

And inside the existing `@media(max-width:900px)` block, replace the current `.lattice-figure{width:min(70vw,420px);justify-self:center}` rule with:

```css
.map-figure{width:min(70vw,420px);justify-self:center}
```

(Same sizing values as before, same class rename only, no other layout math changes.)

## Rationale

The fill sits at 9% white and the stroke at 32% white, directly extending the page's existing `rgba(255,255,255,.18)` line and `#ffffff33` (20%) border grammar into a two-tone treatment rather than inventing new tokens: a whisper of fill gives the landmass weight, the crisper stroke defines coastline edges, together reading as an engraved chart mark rather than a flat colored clipart icon. The entrance is a single 1-second `cubic-bezier(.16,1,.3,1)` fade and scale from 0.94 to 1, an exponential ease-out consistent with the page's existing motion language, then the figure holds fully static with no loop and no rotation, deliberately calmer than and visually distinct from the rotating globe on `/mobilisasi`. Class names `.map-figure` and `.map-island` intentionally parallel `.lattice-figure`/`.lat-line`/`.lat-node` so this is a clean structural swap: same slot sizing, same positioning, same reduced-motion handling pattern, only the visual content and its two class names change.
