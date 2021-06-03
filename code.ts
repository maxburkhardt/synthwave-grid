// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {visible: true, width: 200, height: 400});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-grid') {
    const LINE_COLOR_A: RGBA = {r: 0.73, g: 0.023, b: 0.56, a: 1};
    const {a, ...LINE_COLOR} = LINE_COLOR_A
    const DROP_SHADOW: Effect[] = [{type: 'DROP_SHADOW', color: LINE_COLOR_A, offset: {x: 0, y: 0}, radius: 3, visible: true, blendMode: 'NORMAL'}]
    const nodes: SceneNode[] = [];
    const xStep = msg.width / msg.lineCount;
    let xCounter = 0;
    const angleStep = (msg.angleSweep * 2) / msg.lineCount;
    let angleCounter = msg.angleSweep;
    // Vertical lines
    for (let i = 0; i < msg.lineCount; i++) {
      const line = figma.createLine();
      line.x = xCounter;
      line.resize(msg.height, 0);
      line.rotation = -90 - angleCounter;
      angleCounter -= angleStep;
      xCounter += xStep;
      line.strokes = [{type: 'SOLID', color: LINE_COLOR}];
      line.strokeWeight = 1;
      line.effects = DROP_SHADOW
      figma.currentPage.appendChild(line);
      nodes.push(line);
    }
    // Horizontal lines
    let yCounter = 0;
    let yStep = msg.height / msg.lineCount;
    const yStepSupplemental = 1 + msg.horzGrowth;
    console.log(JSON.stringify(msg));
    for (let i = 0; i < msg.lineCount; i++) {
      const line = figma.createLine();
      line.y = yCounter;
      yCounter += yStep;
      yStep = yStep * yStepSupplemental;
      line.resize(msg.width, 0)
      line.strokes = [{type: 'SOLID', color: LINE_COLOR}];
      line.strokeWeight = 1;
      line.effects = DROP_SHADOW
      figma.currentPage.appendChild(line);
      nodes.push(line);
      if (yCounter > msg.height) {
        break;
      }
    }
    const group = figma.group(nodes, figma.currentPage);
    group.name = "Synthwave Grid";
    figma.currentPage.selection = [group];
    figma.viewport.scrollAndZoomIntoView([group]);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
