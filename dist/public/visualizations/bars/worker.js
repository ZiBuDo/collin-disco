/** @type {HTMLCanvasElement} */
let canvas = null;

const drawVisualizer = ({ bufferLength, dataArray }) => {
  bar.render({ bufferLength, dataArray });
};

onmessage = function (e) {
  const { bufferLength, dataArray, canvas: canvasMessage } = e.data;
  if (canvasMessage) {
    canvas = canvasMessage;
  } else {
    drawVisualizer({ bufferLength, dataArray });
  }
};

const bar = {
  render: ({ bufferLength, dataArray }) => {
    const barWidth = canvas.width / 2 / bufferLength;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let barHeight;
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]; // the height of the bar is the dataArray value. Larger sounds will have a higher value and produce a taller bar
      const red = (i * barHeight) / 10;
      const green = i * 4;
      const blue = barHeight / 2 - 12;
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      ctx.fillRect(
        (canvas.width / 2) - (i * barWidth), // this will start the bars at the center of the canvas and move from right to left
        canvas.height / 2 - barHeight,
        barWidth,
        barHeight
      ); 
      ctx.fillRect(
        (canvas.width / 2) - (i * barWidth), // this will start the bars at the center of the canvas and move from right to left
        canvas.height / 2 - barHeight,
        barWidth,
        -1 * barHeight
      );
      ctx.fillRect((i * barWidth) + (bufferLength * barWidth), canvas.height / 2 - barHeight, barWidth, barHeight); 
      ctx.fillRect((i * barWidth) + (bufferLength * barWidth), canvas.height / 2 - barHeight, barWidth, -1 * barHeight);
    }
    return ctx;
  },
  clear: (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};