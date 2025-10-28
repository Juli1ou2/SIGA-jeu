import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { LoaderComponent } from "./components/loader/loader.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [LoaderComponent, CanvasComponent, CommonModule]
})
export class AppComponent implements AfterViewInit {
  size!: { height: number; width: number };

  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const container = this.containerRef.nativeElement;
      this.size = {
        height: container.clientHeight,
        width: container.clientWidth
      };
    }, 100);
  }
}
