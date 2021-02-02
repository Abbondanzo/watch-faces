const COUNT = 60;

const generateCircleSvgs = ({ radiusPct, fill }) => {
  let output = [];
  for (let i = 0; i < COUNT; i++) {
    // second-59 is the top
    const stepSize = ((i + 1) * Math.PI) / (COUNT / 2);
    const x = Math.round(radiusPct * Math.sin(stepSize) * 1000);
    const y = Math.round(radiusPct * Math.cos(stepSize) * 1000);
    output.push(
      `
      <circle id="second-${i}" cx="${x}%" cy="${y}%" r="10" fill="${fill}"/>
      `.trim()
    );
  }
  return output.join("\n");
};

console.log(generateCircleSvgs({ radiusPct: 0.45, fill: "white" }));
