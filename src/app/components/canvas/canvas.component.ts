import {
  Component,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import * as conf from './conf';
import { State, step, click, mouseMove, endOfGame } from './state';
import { render } from './renderer';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() height!: number;
  @Input() width!: number;
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private state!: State;

  ngOnInit(): void {
    this.initState();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.ctx = ctx;
    this.initCanvas();
    canvas.addEventListener('click', this.onClick);
    canvas.addEventListener('pointermove', this.onMove);
  }

  ngOnDestroy(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.removeEventListener('click', this.onClick);
    canvas.removeEventListener('pointermove', this.onMove);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  private initState(): void {
    const randomInt = (max: number) => Math.floor(Math.random() * max);
    const randomSign = () => Math.sign(Math.random() - 0.5);

    this.state = {
      pos: new Array(2).fill(1).map(() => ({
        life: conf.BALLLIFE,
        coord: {
          x: randomInt(this.width - 120) + 60,
          y: randomInt(this.height - 120) + 60,
          dx: 4 * randomSign(),
          dy: 4 * randomSign(),
        },
      })),
      size: { height: this.height, width: this.width },
      endOfGame: true,
    };
  }

  private iterate = (ctx: CanvasRenderingContext2D) => {
    this.state = step(this.state);
    this.state.endOfGame = !endOfGame(this.state);
    render(ctx)(this.state);

    if (!this.state.endOfGame) {
      this.animationFrameId = requestAnimationFrame(() => this.iterate(ctx));
    }
  };

  private initCanvas(): void {
    requestAnimationFrame(() => this.iterate(this.ctx));
  }

  private onClick = (e: MouseEvent): void => {
    this.state = click(this.state)(e);
  };

  private onMove = (e: PointerEvent): void => {
    this.state = mouseMove(this.state)(e);
  };
}
