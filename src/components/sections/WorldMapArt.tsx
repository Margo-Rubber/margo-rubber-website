/**
 * World map plate for /export.
 *
 * The artwork is the designed SVG from the Figma export, inlined rather than
 * loaded as an <img> so the destination pins can carry real anchor links into
 * their market sections. Coordinates are read off the artwork itself
 * (viewBox 1000x500); the hub at 650,200 is Nashik.
 *
 * Split into three exports so the same artwork can be drawn statically in the
 * hero and animated lane-by-lane in the scroll sequence. Nothing here knows
 * which; the caller composes.
 */
export const MAP_VIEWBOX = "0 0 1000 500";

/** Graticule, landmasses and the Nashik hub. Never animated. */
export function MapBase() {
  return (
    <g clipPath="url(#margo-map-clip)">
      <path
        d="M988 0H12C5.37258 0 0 5.37258 0 12V488C0 494.627 5.37258 500 12 500H988C994.627 500 1000 494.627 1000 488V12C1000 5.37258 994.627 0 988 0Z"
        fill="#070D10"
      />
      <path
        d="M0 100H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M0 150H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M0 200H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M0 250H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M0 300H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M0 350H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M0 400H1000"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M100 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M200 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M300 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M400 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M500 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M600 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M700 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M800 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M900 0V500"
        stroke="#2BBCC4"
        strokeOpacity="0.04"
        strokeWidth="0.8"
      />
      <path
        d="M100 60L160 55L220 70L270 90L280 140L260 190L230 230L200 260L170 280L140 270L110 240L90 200L80 160L85 110L100 60Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M190 270L220 265L240 280L245 310L235 360L215 400L195 420L175 400L165 360L168 320L175 290L190 270Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M440 80L510 75L530 90L520 120L490 135L460 130L440 115L435 95L440 80Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M460 165L530 155L560 170L575 210L580 260L565 320L545 370L510 395L480 390L455 360L440 300L435 240L445 195L460 165Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M540 190L600 185L620 200L615 240L590 255L560 250L540 230L535 205L540 190Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M530 50L700 45L760 70L750 110L680 120L600 115L540 100L530 50Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M620 165L660 160L675 185L670 220L645 245L620 235L610 205L620 165Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M760 220L800 215L820 235L815 270L790 280L765 265L755 240L760 220Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M800 310L880 305L910 330L905 380L870 400L820 395L790 370L785 335L800 310Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M840 140L870 135L880 155L860 165L840 158V140Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M560 290L590 285L600 310L585 340L560 335L548 315L560 290Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        d="M455 108L470 104L472 118L460 122L452 115L455 108Z"
        fill="#1A2428"
        stroke="#2BBCC4"
        strokeOpacity="0.15"
        strokeWidth="0.8"
      />
      <path
        opacity="0.9"
        d="M650 205C652.761 205 655 202.761 655 200C655 197.239 652.761 195 650 195C647.239 195 645 197.239 645 200C645 202.761 647.239 205 650 205Z"
        fill="#2BBCC4"
      />
      <path
        opacity="0.4"
        d="M650 210C655.523 210 660 205.523 660 200C660 194.477 655.523 190 650 190C644.477 190 640 194.477 640 200C640 205.523 644.477 210 650 210Z"
        stroke="#2BBCC4"
      />
      <path
        d="M664.21 197H662.671L660.097 193.103V197H658.558V190.682H660.097L662.671 194.597V190.682H664.21V197ZM665.02 194.48C665.02 193.964 665.116 193.511 665.308 193.121C665.506 192.731 665.773 192.431 666.109 192.221C666.445 192.011 666.82 191.906 667.234 191.906C667.588 191.906 667.897 191.978 668.161 192.122C668.431 192.266 668.638 192.455 668.782 192.689V191.978H670.321V197H668.782V196.289C668.632 196.523 668.422 196.712 668.152 196.856C667.888 197 667.579 197.072 667.225 197.072C666.817 197.072 666.445 196.967 666.109 196.757C665.773 196.541 665.506 196.238 665.308 195.848C665.116 195.452 665.02 194.996 665.02 194.48ZM668.782 194.489C668.782 194.105 668.674 193.802 668.458 193.58C668.248 193.358 667.99 193.247 667.684 193.247C667.378 193.247 667.117 193.358 666.901 193.58C666.691 193.796 666.586 194.096 666.586 194.48C666.586 194.864 666.691 195.17 666.901 195.398C667.117 195.62 667.378 195.731 667.684 195.731C667.99 195.731 668.248 195.62 668.458 195.398C668.674 195.176 668.782 194.873 668.782 194.489ZM673.477 197.072C673.039 197.072 672.649 196.997 672.307 196.847C671.965 196.697 671.695 196.493 671.497 196.235C671.299 195.971 671.188 195.677 671.164 195.353H672.685C672.703 195.527 672.784 195.668 672.928 195.776C673.072 195.884 673.249 195.938 673.459 195.938C673.651 195.938 673.798 195.902 673.9 195.83C674.008 195.752 674.062 195.653 674.062 195.533C674.062 195.389 673.987 195.284 673.837 195.218C673.687 195.146 673.444 195.068 673.108 194.984C672.748 194.9 672.448 194.813 672.208 194.723C671.968 194.627 671.761 194.48 671.587 194.282C671.413 194.078 671.326 193.805 671.326 193.463C671.326 193.175 671.404 192.914 671.56 192.68C671.722 192.44 671.956 192.251 672.262 192.113C672.574 191.975 672.943 191.906 673.369 191.906C673.999 191.906 674.494 192.062 674.854 192.374C675.22 192.686 675.43 193.1 675.484 193.616H674.062C674.038 193.442 673.96 193.304 673.828 193.202C673.702 193.1 673.534 193.049 673.324 193.049C673.144 193.049 673.006 193.085 672.91 193.157C672.814 193.223 672.766 193.316 672.766 193.436C672.766 193.58 672.841 193.688 672.991 193.76C673.147 193.832 673.387 193.904 673.711 193.976C674.083 194.072 674.386 194.168 674.62 194.264C674.854 194.354 675.058 194.504 675.232 194.714C675.412 194.918 675.505 195.194 675.511 195.542C675.511 195.836 675.427 196.1 675.259 196.334C675.097 196.562 674.86 196.742 674.548 196.874C674.242 197.006 673.885 197.072 673.477 197.072ZM679.54 191.924C680.116 191.924 680.578 192.116 680.926 192.5C681.274 192.878 681.448 193.4 681.448 194.066V197H679.918V194.273C679.918 193.937 679.831 193.676 679.657 193.49C679.483 193.304 679.249 193.211 678.955 193.211C678.661 193.211 678.427 193.304 678.253 193.49C678.079 193.676 677.992 193.937 677.992 194.273V197H676.453V190.34H677.992V192.653C678.148 192.431 678.361 192.254 678.631 192.122C678.901 191.99 679.204 191.924 679.54 191.924ZM683.291 191.456C683.021 191.456 682.799 191.378 682.625 191.222C682.457 191.06 682.373 190.862 682.373 190.628C682.373 190.388 682.457 190.19 682.625 190.034C682.799 189.872 683.021 189.791 683.291 189.791C683.555 189.791 683.771 189.872 683.939 190.034C684.113 190.19 684.2 190.388 684.2 190.628C684.2 190.862 684.113 191.06 683.939 191.222C683.771 191.378 683.555 191.456 683.291 191.456ZM684.056 191.978V197H682.517V191.978H684.056ZM688.24 197L686.71 194.894V197H685.171V190.34H686.71V194.021L688.231 191.978H690.13L688.042 194.498L690.148 197H688.24Z"
        fill="#2BBCC4"
      />
    </g>
  );
}

/**
 * Trade-lane arcs, keyed by the coordinates of the pin each one lands on.
 * Keying on the endpoint rather than an index means a market reordered in
 * content keeps its own arc instead of silently inheriting its neighbour's.
 */
const LANES: Record<string, string> = {
  "840,360": "M650 200C713.333 160 776.667 213.333 840 360",
  "580,230": "M650 200C626.667 160 603.333 170 580 230",
  "220,180": "M650 200C506.667 146.667 363.333 140 220 180",
  "460,145": "M650 200C586.667 123.333 523.333 105 460 145",
  "780,310": "M650 200C693.333 160 736.667 196.667 780 310",
  "170,210": "M650 200C490 160 330 163.333 170 210",
  "795,330": "M650 200C698.333 160 746.667 203.333 795 330",
  "570,320": "M650 200C623.333 160 596.667 200 570 320",
};

/**
 * The arc for a pin. Hand-drawn arcs above win; any other pin (a market's
 * second pin — Saudi Arabia, Tanzania — or a new market) gets one built by
 * the same rule all eight above follow (checked against each): a cubic from
 * Nashik (650,200) with control points a third and two-thirds of the way
 * across, both bowed upward and kept above the pin.
 */
export function laneFor(x: number, y: number): string | undefined {
  const drawn = LANES[`${x},${y}`];
  if (drawn) return drawn;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  const r = (n: number) => Math.round(n * 1000) / 1000;
  const c1x = r(650 + (x - 650) / 3);
  const c2x = r(650 + ((x - 650) * 2) / 3);
  // A pin north of Nashik needs both control points lifted above it.
  const c1y = r(Math.min(160, y - 40 + (200 - y) / 3));
  const c2y = r(Math.min(160 + (y - 200) / 3, y - 40));
  return `M650 200C${c1x} ${c1y} ${c2x} ${c2y} ${x} ${y}`;
}

/**
 * Destination pin. The source artwork had these as baked absolute paths; they
 * are plain circles of the same geometry (r12 ring, r4 dot) so they can be
 * placed from the market's own pin coordinates.
 */
export function MapPin({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <>
      <circle cx={x} cy={y} r="12" stroke="#2BBCC4" opacity="0.2" />
      <circle cx={x} cy={y} r="4" fill="#2BBCC4" fillOpacity="0.7" />
      {label && <PinLabel x={x} y={y} label={label} />}
    </>
  );
}

/**
 * A pin's name, set beside it in the site's mono caps (sheet 06 §03: the
 * nine destinations and the origin, each labelled). Pins in the eastern
 * third of the plate take their label on the left so it stays inside the
 * frame; the origin's sits above its marker, clear of the lanes leaving it.
 */
export function PinLabel({ x, y, label, strong = false }: { x: number; y: number; label: string; strong?: boolean }) {
  const left = x > 720;
  return (
    <text
      x={strong ? x : left ? x - 16 : x + 16}
      y={strong ? y - 20 : y + 4}
      textAnchor={strong ? "middle" : left ? "end" : "start"}
      fill={strong ? "#2BBCC4" : "#9FB3B8"}
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      fontSize={strong ? 11 : 10}
      letterSpacing="0.12em"
      style={{ textTransform: "uppercase" }}
    >
      {label}
    </text>
  );
}

/** Clip path + defs. Rendered once per <svg>. */
export function MapDefs() {
  return (
    <defs>
      <clipPath id="margo-map-clip">
        <rect width="1000" height="500" fill="white" />
      </clipPath>
    </defs>
  );
}

/** The whole plate, drawn statically. Used by the hero. */
export function WorldMapArt({
  markets = [],
}: {
  markets?: readonly { pin: { x: number; y: number } }[];
}) {
  return (
    <>
      <MapBase />
      <g clipPath="url(#margo-map-clip)">
        {markets.map((m) => {
          const d = laneFor(m.pin.x, m.pin.y);
          return (
            <g key={`${m.pin.x},${m.pin.y}`}>
              {d && (
                <path
                  d={d}
                  stroke="#2BBCC4"
                  strokeOpacity="0.12"
                  strokeWidth="0.8"
                  strokeDasharray="5 4"
                />
              )}
              <MapPin x={m.pin.x} y={m.pin.y} />
            </g>
          );
        })}
      </g>
      <MapDefs />
    </>
  );
}
