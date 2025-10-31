import { Text } from "pixi.js";

export class Score {
  text: Text;

  constructor(_points: number, _color: string) {
    this.text = new Text({
      text: "score: " + _points,
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: _color,
        align: "center",
      },
    });
    this.text.position.set(25, 25);
  }

  setText(_points: number) {
    this.text.text = "score: " + _points;
  }
}
