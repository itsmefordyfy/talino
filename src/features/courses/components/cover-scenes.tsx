import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Polyline, Rect } from 'react-native-svg';

import { CoverInk as C } from '@/constants/theme';

import type { CoverScene } from '../lib/covers';

/** The drawing box every scene is drawn in; the cover scales it to its height. */
export const SCENE_BOX = { width: 200, height: 120 } as const;

type Xy = { x: number; y: number };

function Sparkle({ x, y, s, c }: Xy & { s: number; c: string }) {
  return <Path d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`} fill={c} />;
}

function Bar({ x, y, w, c, h = 5, opacity }: Xy & { w: number; c: string; h?: number; opacity?: number }) {
  return <Rect x={x} y={y} width={w} height={h} rx={h / 2} fill={c} opacity={opacity} />;
}

/** A window with the three traffic-light dots: light paper or a dark code screen. */
function Window({ x, y, w, h, dark = false }: Xy & { w: number; h: number; dark?: boolean }) {
  const bar = dark ? C.screenBar : C.paperLineSoft;
  return (
    <G>
      <Rect x={x} y={y} width={w} height={h} rx={8} fill={dark ? C.screen : C.paper} />
      <Rect x={x} y={y} width={w} height={14} rx={8} fill={bar} />
      <Rect x={x} y={y + 7} width={w} height={7} fill={bar} />
      <Circle cx={x + 10} cy={y + 7} r={2.6} fill={C.coral} />
      <Circle cx={x + 18} cy={y + 7} r={2.6} fill={C.amber} />
      <Circle cx={x + 26} cy={y + 7} r={2.6} fill={C.mint} />
    </G>
  );
}

function Check({ x, y, c = C.paper, w = 3 }: Xy & { c?: string; w?: number }) {
  return <Path d={`M${x - 6} ${y} L${x - 1.5} ${y + 4.5} L${x + 6} ${y - 4.5}`} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
}

const round = { strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;

const SCENES: Record<CoverScene, () => ReactNode> = {
  // A marked trail up the hills to a flag: the first steps into tech.
  path: () => (
    <>
      <Path d="M0 120 L40 82 L70 100 L112 62 L150 94 L200 70 L200 120 Z" fill={C.glow} />
      <Path d="M10 112 C 48 112, 34 74, 80 72 S 118 40, 158 34" stroke={C.line} strokeWidth={4} strokeDasharray="2 8" {...round} />
      <Circle cx={26} cy={108} r={7} fill={C.paper} />
      <Circle cx={26} cy={108} r={3} fill={C.mint} />
      <Circle cx={80} cy={72} r={7} fill={C.paper} />
      <Circle cx={80} cy={72} r={3} fill={C.violet} />
      <Circle cx={124} cy={47} r={7} fill={C.paper} />
      <Circle cx={124} cy={47} r={3} fill={C.indigo} />
      <Ellipse cx={160} cy={35} rx={8} ry={2.5} fill={C.glassStrong} />
      <Line x1={160} y1={35} x2={160} y2={6} stroke={C.paper} strokeWidth={3} strokeLinecap="round" />
      <Path d="M161 7 L183 14 L161 21 Z" fill={C.amber} />
      <Sparkle x={42} y={30} s={6} c={C.amber} />
      <Sparkle x={104} y={20} s={4} c={C.paper} />
      <Sparkle x={186} y={48} s={5} c={C.mint} />
    </>
  ),
  // An editor with coloured code and a </> badge.
  code: () => (
    <>
      <Window x={8} y={10} w={150} h={96} />
      <Bar x={18} y={32} w={22} c={C.violet} />
      <Bar x={44} y={32} w={40} c={C.paperLine} />
      <Bar x={28} y={44} w={18} c={C.indigo} />
      <Bar x={50} y={44} w={30} c={C.mint} />
      <Bar x={84} y={44} w={20} c={C.paperLine} />
      <Bar x={38} y={56} w={44} c={C.amber} />
      <Bar x={86} y={56} w={26} c={C.paperLine} />
      <Bar x={38} y={68} w={30} c={C.paperLine} />
      <Bar x={72} y={68} w={22} c={C.coral} />
      <Bar x={28} y={80} w={12} c={C.indigo} />
      <Bar x={44} y={80} w={50} c={C.paperLine} />
      <Bar x={18} y={92} w={10} c={C.violet} />
      <Rect x={32} y={89.5} width={2.5} height={10} rx={1} fill={C.violet} />
      <Circle cx={156} cy={18} r={16} fill={C.mint} />
      <Path d="M150 12 L145 18 L150 24 M162 12 L167 18 L162 24 M158 11 L154 25" stroke={C.paper} strokeWidth={2.6} {...round} />
      <Sparkle x={178} y={54} s={5} c={C.paper} />
    </>
  ),
  // A dark terminal with a prompt and a blinking block.
  terminal: () => (
    <>
      <Window x={8} y={12} w={148} h={92} dark />
      <Path d="M18 30 L23 34 L18 38" stroke={C.mint} strokeWidth={2.4} {...round} />
      <Bar x={28} y={31.5} w={46} c={C.screenLine} />
      <Bar x={18} y={46} w={30} c={C.lilac} />
      <Bar x={52} y={46} w={54} c={C.screenLine} />
      <Bar x={18} y={58} w={66} c={C.screenLine} />
      <Bar x={18} y={70} w={22} c={C.amber} />
      <Bar x={44} y={70} w={36} c={C.screenLine} />
      <Path d="M18 82 L23 86 L18 90" stroke={C.mint} strokeWidth={2.4} {...round} />
      <Rect x={28} y={81} width={8} height={10} rx={1.5} fill={C.mint} />
      <Rect x={140} y={4} width={30} height={30} rx={9} fill={C.amber} />
      <Path d="M148 13 L153 18 L148 23" stroke={C.screen} strokeWidth={2.6} {...round} />
      <Rect x={155} y={21.5} width={9} height={2.8} rx={1.4} fill={C.screen} />
      <Sparkle x={178} y={56} s={5} c={C.paper} />
    </>
  ),
  // An invoice with a paid stamp and a stack of coins: work of your own.
  invoice: () => (
    <>
      <G rotation={-6} origin="70, 62">
        <Rect x={28} y={10} width={88} height={104} rx={8} fill={C.paper} />
        <Bar x={38} y={22} w={30} h={6} c={C.violet} />
        <Bar x={38} y={36} w={56} c={C.paperLine} />
        <Bar x={38} y={46} w={46} c={C.paperLine} />
        <Rect x={38} y={59} width={68} height={1.5} fill={C.paperLineSoft} />
        <Bar x={38} y={68} w={40} c={C.paperLine} />
        <Bar x={88} y={68} w={18} c={C.indigo} />
        <Bar x={38} y={80} w={34} c={C.paperLine} />
        <Bar x={88} y={80} w={18} c={C.indigo} />
        <Rect x={38} y={93} width={68} height={12} rx={4} fill={C.paperLineSoft} />
        <Bar x={42} y={96.5} w={22} c={C.violet} />
        <Bar x={84} y={96.5} w={18} c={C.mintDeep} />
      </G>
      <Circle cx={114} cy={92} r={14} fill={C.mint} />
      <Check x={114} y={92} />
      {[0, 1, 2].map((index) => (
        <Ellipse key={index} cx={152} cy={106 - index * 8} rx={17} ry={6} fill={C.amber} stroke={C.paper} strokeWidth={1.5} />
      ))}
      <Ellipse cx={152} cy={90} rx={10} ry={3.2} stroke={C.paper} strokeWidth={1.2} fill="none" />
      <Sparkle x={150} y={44} s={6} c={C.paper} />
      <Sparkle x={180} y={66} s={4} c={C.amber} />
    </>
  ),
  // A phone with an app wireframe and the building blocks beside it.
  blueprint: () => (
    <>
      <Rect x={14} y={6} width={64} height={110} rx={12} fill={C.screen} />
      <Rect x={19} y={14} width={54} height={95} rx={6} fill={C.paper} />
      <Rect x={38} y={9} width={16} height={3} rx={1.5} fill={C.screenBar} />
      <Rect x={24} y={20} width={44} height={10} rx={3} fill={C.violet} />
      <Rect x={24} y={35} width={44} height={28} rx={4} fill={C.paperLineSoft} />
      <Path d="M28 60 L40 46 L50 56 L56 50 L64 60 Z" fill={C.lilac} />
      <Circle cx={60} cy={41} r={3} fill={C.amber} />
      <Bar x={24} y={68} w={36} c={C.paperLine} />
      <Bar x={24} y={76} w={28} c={C.paperLine} />
      <Rect x={24} y={88} width={44} height={12} rx={6} fill={C.mint} />
      <Rect x={114} y={38} width={32} height={32} rx={6} fill={C.mint} />
      <Path d="M130 46 L130 62 M122 54 L138 54" stroke={C.paper} strokeWidth={3} {...round} />
      <Rect x={96} y={74} width={32} height={32} rx={6} fill={C.amber} />
      <Circle cx={112} cy={90} r={6.5} stroke={C.paper} strokeWidth={3} fill="none" />
      <Rect x={132} y={74} width={32} height={32} rx={6} fill={C.lilac} />
      <Path d="M140 98 L148 82 L156 98 Z" stroke={C.paper} strokeWidth={2.6} {...round} />
      <Sparkle x={100} y={24} s={6} c={C.paper} />
      <Sparkle x={168} y={50} s={4} c={C.amber} />
    </>
  ),
  // A diff with added and removed lines and an approving review comment.
  review: () => (
    <>
      <Window x={8} y={10} w={140} h={96} />
      <Rect x={8} y={27} width={140} height={11} fill={C.mint} opacity={0.28} />
      <Path d="M14 32.5 L20 32.5 M17 29.5 L17 35.5" stroke={C.mintDeep} strokeWidth={1.8} {...round} />
      <Bar x={26} y={30} w={60} c={C.mintDeep} opacity={0.6} />
      <Rect x={8} y={40} width={140} height={11} fill={C.coral} opacity={0.24} />
      <Path d="M14 45.5 L20 45.5" stroke={C.coral} strokeWidth={1.8} {...round} />
      <Bar x={26} y={43} w={48} c={C.coral} opacity={0.7} />
      <Bar x={26} y={57} w={70} c={C.paperLine} />
      <Rect x={8} y={66} width={140} height={11} fill={C.mint} opacity={0.28} />
      <Path d="M14 71.5 L20 71.5 M17 68.5 L17 74.5" stroke={C.mintDeep} strokeWidth={1.8} {...round} />
      <Bar x={26} y={69} w={40} c={C.mintDeep} opacity={0.6} />
      <Bar x={26} y={83} w={58} c={C.paperLine} />
      <Bar x={26} y={95} w={30} c={C.paperLine} />
      <Rect x={110} y={50} width={64} height={36} rx={10} fill={C.violet} />
      <Path d="M122 86 L118 97 L134 86 Z" fill={C.violet} />
      <Bar x={118} y={60} w={42} h={4.5} c={C.paper} opacity={0.9} />
      <Bar x={118} y={70} w={28} h={4.5} c={C.paper} opacity={0.9} />
      <Circle cx={170} cy={50} r={10} fill={C.mint} />
      <Check x={170} y={50} w={2.6} />
    </>
  ),
  // A chalkboard with a chart, a tick and a pointer.
  board: () => (
    <>
      <Line x1={42} y1={98} x2={32} y2={118} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
      <Line x1={126} y1={98} x2={136} y2={118} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
      <Rect x={8} y={8} width={152} height={92} rx={8} fill={C.glassStrong} />
      <Rect x={14} y={14} width={140} height={80} rx={5} fill={C.screen} />
      <Line x1={22} y1={84} x2={90} y2={84} stroke={C.screenLine} strokeWidth={2} />
      <Rect x={26} y={60} width={14} height={24} rx={2} fill={C.mint} />
      <Rect x={46} y={48} width={14} height={36} rx={2} fill={C.lilac} />
      <Rect x={66} y={34} width={14} height={50} rx={2} fill={C.amber} />
      <Bar x={100} y={26} w={44} c={C.screenLine} />
      <Bar x={100} y={38} w={34} c={C.screenLine} />
      <Bar x={100} y={50} w={40} c={C.screenLine} />
      <Check x={108} y={68} c={C.mint} />
      <Bar x={120} y={66} w={22} c={C.screenLine} />
      <Line x1={176} y1={26} x2={134} y2={74} stroke={C.amber} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={134} cy={74} r={2.6} fill={C.paper} />
      <Sparkle x={182} y={56} s={5} c={C.paper} />
    </>
  ),
  // A conversation: a question, a reply, and the next answer being typed.
  chat: () => (
    <>
      <Rect x={8} y={8} width={104} height={34} rx={14} fill={C.paper} />
      <Path d="M18 40 L14 52 L32 41 Z" fill={C.paper} />
      <Bar x={20} y={18} w={72} c={C.paperLine} />
      <Bar x={20} y={28} w={50} c={C.paperLine} />
      <Rect x={56} y={52} width={108} height={32} rx={14} fill={C.mint} />
      <Path d="M146 82 L158 94 L136 83 Z" fill={C.mint} />
      <Bar x={68} y={62} w={72} c={C.paper} />
      <Bar x={68} y={72} w={46} c={C.paper} />
      <Rect x={8} y={90} width={54} height={24} rx={12} fill={C.paper} />
      <Circle cx={22} cy={102} r={3.4} fill={C.violet} />
      <Circle cx={35} cy={102} r={3.4} fill={C.lilac} />
      <Circle cx={48} cy={102} r={3.4} fill={C.paperLine} />
      <Circle cx={148} cy={24} r={15} fill={C.glassStrong} />
      <Sparkle x={148} y={24} s={9} c={C.paper} />
      <Sparkle x={182} y={62} s={4} c={C.amber} />
    </>
  ),
  // A small neural network with one path lit up.
  neural: () => {
    const first = [26, 60, 94];
    const second = [16, 46, 76, 106];
    const third = [42, 78];
    return (
      <>
        {first.flatMap((a) => second.map((b) => <Line key={`a${a}-${b}`} x1={26} y1={a} x2={86} y2={b} stroke={C.line} strokeWidth={1.3} opacity={0.6} />))}
        {second.flatMap((a) => third.map((b) => <Line key={`b${a}-${b}`} x1={86} y1={a} x2={146} y2={b} stroke={C.line} strokeWidth={1.3} opacity={0.6} />))}
        <Polyline points="26,60 86,46 146,42" stroke={C.amber} strokeWidth={2.8} {...round} />
        {first.map((y) => (
          <G key={`n1${y}`}>
            <Circle cx={26} cy={y} r={9} fill={C.paper} />
            <Circle cx={26} cy={y} r={3.5} fill={C.violet} />
          </G>
        ))}
        {second.map((y) => (
          <Circle key={`n2${y}`} cx={86} cy={y} r={9} fill={y === 46 || y === 76 ? C.mint : C.paper} />
        ))}
        <Circle cx={146} cy={42} r={10} fill={C.amber} />
        <Circle cx={146} cy={78} r={10} fill={C.paper} />
        <Sparkle x={176} y={16} s={6} c={C.paper} />
        <Sparkle x={178} y={104} s={4} c={C.mint} />
      </>
    );
  },
  // A test checklist and a magnifier catching a bug.
  bug: () => (
    <>
      <Rect x={8} y={8} width={96} height={104} rx={10} fill={C.paper} />
      {[28, 52].map((y) => (
        <G key={y}>
          <Rect x={18} y={y - 7} width={14} height={14} rx={4} fill={C.mint} />
          <Check x={25} y={y} w={2.2} />
          <Bar x={40} y={y - 2.5} w={52} c={C.paperLine} />
        </G>
      ))}
      <Rect x={18} y={69} width={14} height={14} rx={4} fill={C.coral} />
      <Path d="M21.5 72.5 L28.5 79.5 M28.5 72.5 L21.5 79.5" stroke={C.paper} strokeWidth={2.2} {...round} />
      <Bar x={40} y={73.5} w={44} c={C.paperLine} />
      <Rect x={19} y={94} width={12} height={12} rx={3.5} stroke={C.paperLine} strokeWidth={2} fill="none" />
      <Bar x={40} y={97.5} w={36} c={C.paperLine} />
      <Line x1={152} y1={78} x2={172} y2={100} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
      <Circle cx={132} cy={58} r={28} fill={C.glassStrong} stroke={C.paper} strokeWidth={6} />
      <Path d="M123 52 L115 47 M123 60 L114 60 M123 68 L115 73 M141 52 L149 47 M141 60 L150 60 M141 68 L149 73 M129 40 L125 33 M135 40 L139 33" stroke={C.coral} strokeWidth={2.2} {...round} />
      <Ellipse cx={132} cy={60} rx={9} ry={12} fill={C.coral} />
      <Circle cx={132} cy={44} r={5.5} fill={C.coral} />
      <Line x1={132} y1={50} x2={132} y2={71} stroke={C.paper} strokeWidth={1.5} />
    </>
  ),
  // A bar chart with its trend line and a small pie: patterns in data.
  chart: () => (
    <>
      <Rect x={8} y={10} width={128} height={100} rx={10} fill={C.paper} />
      <Line x1={22} y1={94} x2={124} y2={94} stroke={C.paperLine} strokeWidth={2} strokeLinecap="round" />
      <Line x1={22} y1={22} x2={22} y2={94} stroke={C.paperLine} strokeWidth={2} strokeLinecap="round" />
      <Rect x={30} y={70} width={14} height={24} rx={3} fill={C.lilac} />
      <Rect x={52} y={56} width={14} height={38} rx={3} fill={C.sky} />
      <Rect x={74} y={64} width={14} height={30} rx={3} fill={C.lilac} />
      <Rect x={96} y={38} width={14} height={56} rx={3} fill={C.violet} />
      <Polyline points="37,60 59,46 81,52 103,28" stroke={C.mintDeep} strokeWidth={2.6} {...round} />
      {[
        [37, 60],
        [59, 46],
        [81, 52],
        [103, 28],
      ].map(([x, y]) => (
        <Circle key={x} cx={x} cy={y} r={3.5} fill={C.paper} stroke={C.mintDeep} strokeWidth={2} />
      ))}
      <Circle cx={162} cy={34} r={20} fill={C.paper} />
      <Path d="M162 34 L162 14 A20 20 0 0 1 181 40 Z" fill={C.amber} />
      <Path d="M162 34 L181 40 A20 20 0 0 1 150 50 Z" fill={C.mint} />
      <Sparkle x={164} y={84} s={6} c={C.paper} />
    </>
  ),
  // A trigger, an action and a result joined by arrows: an automation.
  flow: () => (
    <>
      <Rect x={8} y={12} width={48} height={36} rx={10} fill={C.amber} />
      <Path d="M35 18 L24 32 L31 32 L28 42 L40 27 L33 27 L36 18 Z" fill={C.paper} />
      <Path d="M56 30 C 72 30, 62 58, 76 58" stroke={C.paper} strokeWidth={2.6} {...round} />
      <Path d="M70 53 L76 58 L70 63" stroke={C.paper} strokeWidth={2.6} {...round} />
      <Circle cx={100} cy={58} r={21} stroke={C.paper} strokeWidth={6} strokeDasharray="5 6" fill="none" />
      <Circle cx={100} cy={58} r={17} fill={C.paper} />
      <Circle cx={100} cy={58} r={7} fill={C.violet} />
      <Circle cx={100} cy={58} r={2.8} fill={C.paper} />
      <Path d="M124 58 C 134 58, 128 92, 136 92" stroke={C.paper} strokeWidth={2.6} {...round} />
      <Path d="M130 87 L136 92 L130 97" stroke={C.paper} strokeWidth={2.6} {...round} />
      <Rect x={138} y={77} width={36} height={30} rx={10} fill={C.mint} />
      <Check x={156} y={92} />
      <Rect x={14} y={80} width={36} height={26} rx={5} fill={C.paper} />
      <Path d="M14 83 L32 95 L50 83" stroke={C.lilac} strokeWidth={2} {...round} />
      <Line x1={32} y1={78} x2={32} y2={52} stroke={C.line} strokeWidth={2.4} strokeDasharray="2 5" strokeLinecap="round" />
      <Sparkle x={140} y={24} s={6} c={C.paper} />
      <Sparkle x={182} y={56} s={4} c={C.amber} />
    </>
  ),
  // A rocket lifting off past a price tag: launching what you made.
  launch: () => (
    <>
      <Path d="M28 114 Q 38 98 50 86" stroke={C.line} strokeWidth={3} strokeDasharray="2 7" {...round} />
      <G x={78} y={60} rotation={40}>
        <Path d="M-7 22 Q0 46 7 22 Z" fill={C.amber} />
        <Path d="M-3.5 22 Q0 36 3.5 22 Z" fill={C.coral} />
        <Path d="M-9 6 L-21 24 L-9 20 Z" fill={C.coral} />
        <Path d="M9 6 L21 24 L9 20 Z" fill={C.coral} />
        <Path d="M0 -38 C 14 -24 13 8 9 22 L -9 22 C -13 8 -14 -24 0 -38 Z" fill={C.paper} />
        <Path d="M-7.5 -24 Q0 -29 7.5 -24" stroke={C.violet} strokeWidth={2.5} {...round} />
        <Circle cx={0} cy={-6} r={7} fill={C.sky} stroke={C.violet} strokeWidth={2.5} />
      </G>
      <G rotation={-14} origin="140, 70">
        <Path d="M124 52 H148 L162 70 L148 88 H124 Q118 88 118 82 V58 Q118 52 124 52 Z" fill={C.mint} />
        <Circle cx={150} cy={70} r={3.5} fill={C.paper} />
        <Path d="M139 62 C 134 59 127 61 128.5 66 C 130 71 140 69 138.5 75 C 137 80 129 79 126.5 76.5" stroke={C.paper} strokeWidth={2.4} {...round} />
        <Line x1={133} y1={57} x2={133} y2={83} stroke={C.paper} strokeWidth={2} strokeLinecap="round" />
      </G>
      <Sparkle x={30} y={26} s={6} c={C.paper} />
      <Sparkle x={124} y={20} s={5} c={C.amber} />
      <Sparkle x={178} y={104} s={4} c={C.paper} />
      <Sparkle x={48} y={64} s={3.5} c={C.mint} />
    </>
  ),
  // A stack of pages with a highlighted passage and a summary card.
  docs: () => (
    <>
      <Rect x={30} y={8} width={84} height={100} rx={8} fill={C.glassStrong} rotation={8} origin="72, 58" />
      <Rect x={22} y={10} width={84} height={100} rx={8} fill={C.paperLineSoft} rotation={4} origin="64, 60" />
      <Rect x={12} y={12} width={84} height={100} rx={8} fill={C.paper} />
      <Bar x={22} y={24} w={40} h={6} c={C.violet} />
      <Bar x={22} y={38} w={64} c={C.paperLine} />
      <Bar x={22} y={48} w={58} c={C.paperLine} />
      <Rect x={19} y={56} width={66} height={10} rx={3} fill={C.amber} opacity={0.5} />
      <Bar x={22} y={58.5} w={58} c={C.paperLine} />
      <Bar x={22} y={72} w={60} c={C.paperLine} />
      <Bar x={22} y={82} w={44} c={C.paperLine} />
      <Bar x={22} y={92} w={54} c={C.paperLine} />
      <Rect x={104} y={44} width={68} height={46} rx={10} fill={C.violet} />
      <Sparkle x={117} y={56} s={5.5} c={C.amber} />
      <Bar x={128} y={53.5} w={36} h={4.5} c={C.paper} opacity={0.9} />
      <Bar x={113} y={66} w={50} h={4.5} c={C.paper} opacity={0.9} />
      <Bar x={113} y={76} w={34} h={4.5} c={C.paper} opacity={0.9} />
      <Sparkle x={160} y={24} s={5} c={C.paper} />
    </>
  ),
  // An editor with a file tree, tabs and several cursors at once.
  editor: () => (
    <>
      <Window x={8} y={10} w={156} h={98} />
      <Path d="M8 24 H46 V108 H16 Q8 108 8 100 Z" fill={C.paperLineSoft} />
      <Bar x={14} y={32} w={24} h={4.5} c={C.paperLine} />
      <Bar x={14} y={42} w={20} h={4.5} c={C.paperLine} />
      <Rect x={12} y={49.5} width={32} height={10} rx={3} fill={C.lilac} opacity={0.55} />
      <Bar x={14} y={52.25} w={24} h={4.5} c={C.violet} />
      <Bar x={14} y={64} w={22} h={4.5} c={C.paperLine} />
      <Bar x={14} y={74} w={18} h={4.5} c={C.paperLine} />
      <Rect x={52} y={27} width={38} height={10} rx={3} fill={C.lilac} opacity={0.4} />
      <Rect x={94} y={27} width={34} height={10} rx={3} fill={C.paperLineSoft} />
      <Bar x={56} y={47} w={30} c={C.indigo} />
      <Bar x={90} y={47} w={40} c={C.paperLine} />
      <Rect x={134} y={45} width={2.5} height={9} rx={1} fill={C.mintDeep} />
      <Bar x={56} y={61} w={22} c={C.violet} />
      <Bar x={82} y={61} w={38} c={C.paperLine} />
      <Rect x={124} y={59} width={2.5} height={9} rx={1} fill={C.mintDeep} />
      <Bar x={64} y={75} w={40} c={C.paperLine} />
      <Bar x={108} y={75} w={20} c={C.amber} />
      <Rect x={132} y={73} width={2.5} height={9} rx={1} fill={C.mintDeep} />
      <Bar x={64} y={89} w={32} c={C.paperLine} />
      <Bar x={56} y={99} w={16} c={C.violet} />
      <Circle cx={162} cy={18} r={14} fill={C.mint} />
      <Sparkle x={162} y={18} s={7} c={C.paper} />
    </>
  ),
  // A cloud sending tasks out, two done and one still running.
  cloud: () => (
    <>
      <G>
        <Circle cx={64} cy={34} r={20} fill={C.paper} />
        <Circle cx={90} cy={26} r={24} fill={C.paper} />
        <Circle cx={114} cy={36} r={18} fill={C.paper} />
        <Rect x={50} y={32} width={78} height={22} rx={11} fill={C.paper} />
      </G>
      <Sparkle x={90} y={36} s={9} c={C.violet} />
      <Path d="M64 58 L42 77 M90 58 L90 77 M116 58 L138 77" stroke={C.line} strokeWidth={2.6} strokeDasharray="3 5" {...round} />
      {[18, 68].map((x) => (
        <G key={x}>
          <Rect x={x} y={80} width={44} height={30} rx={8} fill={C.paper} />
          <Circle cx={x + 12} cy={95} r={7} fill={C.mint} />
          <Check x={x + 12} y={95} w={2.2} />
          <Bar x={x + 23} y={92.5} w={15} c={C.paperLine} />
        </G>
      ))}
      <Rect x={118} y={80} width={44} height={30} rx={8} fill={C.paper} />
      <Circle cx={130} cy={95} r={6} stroke={C.amber} strokeWidth={2.6} strokeDasharray="20 18" fill="none" />
      <Bar x={141} y={92.5} w={15} c={C.paperLine} />
      <Sparkle x={152} y={16} s={5} c={C.amber} />
      <Sparkle x={22} y={26} s={4} c={C.paper} />
    </>
  ),
  // Stacked database drums beside a query window with rows coming back.
  database: () => (
    <>
      <Window x={80} y={14} w={104} h={90} />
      <Bar x={90} y={34} w={44} c={C.violet} />
      {[46, 58, 70, 82].map((y, i) => (
        <G key={y}>
          <Rect x={90} y={y} width={84} height={8} rx={3} fill={i % 2 === 0 ? C.paperLineSoft : C.paper} />
          <Bar x={94} y={y + 1.5} w={16} h={5} c={C.paperLine} />
          <Bar x={118} y={y + 1.5} w={i === 1 ? 30 : 22} h={5} c={i === 1 ? C.mint : C.paperLine} />
        </G>
      ))}
      <Path d="M18 36 V96 Q18 108 46 108 Q74 108 74 96 V36 Z" fill={C.mint} />
      <Ellipse cx={46} cy={36} rx={28} ry={9} fill={C.paper} opacity={0.55} />
      <Path d="M18 56 Q46 68 74 56 M18 76 Q46 88 74 76" stroke={C.paper} strokeWidth={1.8} opacity={0.7} fill="none" />
      <Ellipse cx={46} cy={36} rx={28} ry={9} stroke={C.paper} strokeWidth={2} fill="none" />
      <Sparkle x={158} y={10} s={5} c={C.amber} />
    </>
  ),
  // A phone with a list screen and a tab bar, a second screen peeking behind.
  phone: () => (
    <>
      <Rect x={96} y={14} width={58} height={102} rx={10} fill={C.glassStrong} />
      <Rect x={52} y={6} width={62} height={108} rx={11} fill={C.screen} />
      <Rect x={56} y={12} width={54} height={96} rx={8} fill={C.paper} />
      <Rect x={74} y={14} width={18} height={4} rx={2} fill={C.screen} />
      <Rect x={60} y={24} width={46} height={22} rx={6} fill={C.violet} />
      <Bar x={64} y={30} w={22} c={C.paper} />
      <Bar x={64} y={38} w={14} h={4} c={C.lilac} />
      {[52, 66].map((y) => (
        <G key={y}>
          <Circle cx={68} cy={y + 5} r={5} fill={C.mint} />
          <Bar x={78} y={y + 1} w={24} c={C.paperLine} />
          <Bar x={78} y={y + 8} w={16} h={4} c={C.paperLineSoft} />
        </G>
      ))}
      <Rect x={56} y={90} width={54} height={18} rx={8} fill={C.paperLineSoft} />
      {[66, 83, 100].map((x, i) => (
        <Circle key={x} cx={x - 2} cy={99} r={3.2} fill={i === 0 ? C.violet : C.paperLine} />
      ))}
      <Sparkle x={150} y={22} s={7} c={C.amber} />
      <Sparkle x={32} y={34} s={5} c={C.paper} />
      <Sparkle x={36} y={92} s={4} c={C.mint} />
    </>
  ),
  // A browser window with a hero, a card grid and a pointer.
  web: () => (
    <>
      <Window x={14} y={10} w={156} h={100} />
      <Rect x={24} y={30} width={136} height={28} rx={6} fill={C.violet} />
      <Bar x={32} y={38} w={50} c={C.paper} />
      <Bar x={32} y={48} w={34} h={4} c={C.lilac} />
      <Rect x={118} y={38} width={34} height={12} rx={6} fill={C.mint} />
      {[24, 70, 116].map((x) => (
        <G key={x}>
          <Rect x={x} y={66} width={44} height={34} rx={6} fill={C.paperLineSoft} />
          <Rect x={x + 5} y={71} width={34} height={12} rx={4} fill={C.paperLine} />
          <Bar x={x + 5} y={88} w={24} h={4} c={C.paperLine} />
        </G>
      ))}
      <Path d="M150 70 L150 94 L156 89 L161 100 L165 98 L160 87 L168 87 Z" fill={C.paper} stroke={C.screen} strokeWidth={1.6} strokeLinejoin="round" />
      <Sparkle x={182} y={26} s={6} c={C.amber} />
    </>
  ),
  // A shield with a check, a lock and quiet sparks.
  shield: () => (
    <>
      <Path d="M100 8 L148 24 V60 Q148 94 100 114 Q52 94 52 60 V24 Z" fill={C.paper} />
      <Path d="M100 18 L138 31 V59 Q138 85 100 103 Q62 85 62 59 V31 Z" fill={C.violet} />
      <Path d="M100 18 L138 31 V59 Q138 85 100 103 Z" fill={C.indigo} opacity={0.55} />
      <Rect x={86} y={52} width={28} height={22} rx={5} fill={C.paper} />
      <Path d="M92 52 V46 Q92 36 100 36 Q108 36 108 46 V52" stroke={C.paper} strokeWidth={4} {...round} />
      <Circle cx={100} cy={62} r={3.2} fill={C.violet} />
      <Rect x={98.6} y={62} width={2.8} height={7} rx={1.4} fill={C.violet} />
      <Circle cx={34} cy={30} r={11} fill={C.mint} />
      <Check x={34} y={30} w={2.4} />
      <Circle cx={168} cy={84} r={11} fill={C.amber} />
      <Path d="M168 78 V86 M168 90 V91" stroke={C.paper} strokeWidth={3} strokeLinecap="round" />
      <Sparkle x={170} y={22} s={6} c={C.paper} />
      <Sparkle x={28} y={90} s={5} c={C.paper} />
    </>
  ),
  // Shipping containers on a wave: software packaged to run anywhere.
  container: () => (
    <>
      <Path d="M0 100 Q25 90 50 100 T100 100 T150 100 T200 100 V120 H0 Z" fill={C.glass} />
      {[
        { x: 20, y: 62, c: C.paper },
        { x: 72, y: 62, c: C.paper },
        { x: 124, y: 62, c: C.paper },
        { x: 46, y: 28, c: C.mint },
        { x: 98, y: 28, c: C.amber },
      ].map(({ x, y, c }) => (
        <G key={`${x}-${y}`}>
          <Rect x={x} y={y} width={50} height={30} rx={4} fill={c} />
          {[10, 20, 30, 40].map((dx) => (
            <Rect key={dx} x={x + dx - 3} y={y + 5} width={2.4} height={20} rx={1.2} fill={C.screen} opacity={0.14} />
          ))}
        </G>
      ))}
      <Path d="M14 96 H168 L158 110 H26 Z" fill={C.indigo} />
      <Rect x={150} y={14} width={4} height={14} rx={2} fill={C.paper} />
      <Sparkle x={176} y={30} s={6} c={C.paper} />
      <Sparkle x={14} y={36} s={5} c={C.amber} />
    </>
  ),
  // A commit graph: a branch leaves the main line and merges back.
  git: () => (
    <>
      <Path d="M20 84 H180" stroke={C.line} strokeWidth={3} {...round} />
      <Path d="M62 84 Q72 40 100 40 H122 Q142 40 148 84" stroke={C.mint} strokeWidth={3} {...round} />
      <Path d="M44 84 Q54 112 82 112 H104 Q128 112 134 84" stroke={C.amber} strokeWidth={3} opacity={0.9} {...round} />
      {[20, 44, 62, 134, 148, 180].map((x) => (
        <G key={x}>
          <Circle cx={x} cy={84} r={8} fill={C.paper} />
          <Circle cx={x} cy={84} r={3.4} fill={C.violet} />
        </G>
      ))}
      {[100, 122].map((x) => (
        <G key={x}>
          <Circle cx={x} cy={40} r={7} fill={C.paper} />
          <Circle cx={x} cy={40} r={3} fill={C.mintDeep} />
        </G>
      ))}
      <Circle cx={82} cy={112} r={6} fill={C.paper} />
      <Circle cx={82} cy={112} r={2.6} fill={C.amber} />
      <Rect x={20} y={12} width={44} height={14} rx={7} fill={C.paper} />
      <Bar x={27} y={17.5} w={22} h={4.5} c={C.paperLine} />
      <Rect x={118} y={12} width={50} height={14} rx={7} fill={C.mint} />
      <Bar x={125} y={17.5} w={26} h={4.5} c={C.paper} />
      <Sparkle x={184} y={44} s={5} c={C.paper} />
    </>
  ),
  // A checklist clipboard with ticks and one bug caught.
  checklist: () => (
    <>
      <Rect x={44} y={10} width={96} height={104} rx={10} fill={C.paper} />
      <Rect x={74} y={4} width={36} height={14} rx={7} fill={C.indigo} />
      <Circle cx={92} cy={11} r={3} fill={C.paper} />
      {[34, 56, 78].map((y, i) => (
        <G key={y}>
          <Circle cx={62} cy={y + 6} r={8} fill={i === 2 ? C.amber : C.mint} />
          {i === 2 ? <Path d="M58.5 81.5 L65.5 88.5 M65.5 81.5 L58.5 88.5" stroke={C.paper} strokeWidth={2.4} strokeLinecap="round" /> : <Check x={62} y={y + 6} w={2.4} />}
          <Bar x={78} y={y + 1.5} w={i === 1 ? 44 : 38} c={C.paperLine} />
          <Bar x={78} y={y + 10} w={26} h={4} c={C.paperLineSoft} />
        </G>
      ))}
      <Ellipse cx={162} cy={78} rx={13} ry={10} fill={C.coral} />
      <Circle cx={162} cy={66} r={6} fill={C.coral} />
      <Path d="M152 72 L144 66 M152 80 L144 86 M172 72 L180 66 M172 80 L180 86 M149 76 H141 M175 76 H183" stroke={C.coral} strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx={160} cy={65} r={1.6} fill={C.paper} />
      <Circle cx={165} cy={65} r={1.6} fill={C.paper} />
      <Sparkle x={166} y={24} s={6} c={C.amber} />
    </>
  ),
  // Services wired to a database: designing the whole system.
  architecture: () => (
    <>
      <Path d="M86 28 V38 H41 V48 M86 38 H131 V48 M41 70 V96 H66 M131 70 V96 H106" stroke={C.line} strokeWidth={2.4} {...round} />
      <Rect x={58} y={6} width={56} height={22} rx={7} fill={C.paper} />
      <Bar x={66} y={14.5} w={26} c={C.violet} />
      <Circle cx={104} cy={17} r={3.5} fill={C.mint} />
      <Rect x={14} y={48} width={54} height={22} rx={7} fill={C.paper} />
      <Bar x={22} y={56.5} w={30} c={C.indigo} />
      <Rect x={104} y={48} width={54} height={22} rx={7} fill={C.paper} />
      <Bar x={112} y={56.5} w={30} c={C.lilac} />
      <Rect x={66} y={84} width={40} height={24} fill={C.mint} />
      <Ellipse cx={86} cy={108} rx={20} ry={6} fill={C.mint} />
      <Ellipse cx={86} cy={84} rx={20} ry={6} fill={C.mint} />
      <Ellipse cx={86} cy={84} rx={20} ry={6} fill={C.paper} opacity={0.5} />
      <Path d="M66 96 Q86 104 106 96" stroke={C.paper} strokeWidth={1.5} opacity={0.7} fill="none" />
      <Sparkle x={168} y={18} s={6} c={C.amber} />
      <Sparkle x={178} y={92} s={4} c={C.paper} />
    </>
  ),
};

export type CoverSceneArtProps = { scene: CoverScene; width: number; height: number };

/** One course scene, drawn in white glass and brand accents for the cover's gradient. Decorative: the card says what the course is. */
export function CoverSceneArt({ scene, width, height }: CoverSceneArtProps) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${SCENE_BOX.width} ${SCENE_BOX.height}`}>
      {SCENES[scene]()}
    </Svg>
  );
}
