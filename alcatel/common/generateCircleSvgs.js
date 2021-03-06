const fs = require("fs");

const COUNT = 60;
const SCALE = 10;
const RADIUS_PCT = 0.48;
const FILL = "white";

const generateCircleSvgs = () => {
  let output = [];
  for (let i = 0; i < COUNT; i++) {
    // second-59 is the top
    const stepSize = ((i + 1) * Math.PI) / (COUNT / 2) - Math.PI / 2;
    const x = Math.round(RADIUS_PCT * Math.cos(stepSize) * 100 * SCALE);
    const y = Math.round(RADIUS_PCT * Math.sin(stepSize) * 100 * SCALE);
    output.push(
      `
      <circle id="second-${i}" cx="${x}%" cy="${y}%" r="${SCALE}" fill="${FILL}" opacity="0.2" />
      `.trim()
    );
  }
  return output.join("\n    ");
};

const circles = generateCircleSvgs();
const data = `<!-- Generated by generateCircleSvgs -->
<g id="dial" transform="translate(50%, 50%) scale(${1 / SCALE})">
    ${circles}
</g>
`;

fs.writeFileSync("../resources/dial.gui", data);
