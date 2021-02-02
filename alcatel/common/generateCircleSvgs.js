const fs = require("fs");

const COUNT = 60;

const generateCircleSvgs = ({ radiusPct, fill }) => {
  let output = [];
  for (let i = 0; i < COUNT; i++) {
    // second-59 is the top
    const stepSize = (i * Math.PI) / (COUNT / 2) - Math.PI / 2;
    const x = Math.round(radiusPct * Math.cos(stepSize) * 1000);
    const y = Math.round(radiusPct * Math.sin(stepSize) * 1000);
    output.push(
      `
      <circle id="second-${i}" cx="${x}%" cy="${y}%" r="10" fill="${fill}" opacity="0.2" />
      `.trim()
    );
  }
  return output.join("\n    ");
};

const circles = generateCircleSvgs({ radiusPct: 0.45, fill: "white" });
const data = `<!-- Generated by generateCircleSvgs -->
<g id="dial" transform="translate(50%, 50%) scale(0.1)">
    ${circles}
</g>
`;

fs.writeFileSync("../resources/dial.gui", data);
