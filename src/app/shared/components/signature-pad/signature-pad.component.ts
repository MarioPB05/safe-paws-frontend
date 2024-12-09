import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';

/**
 * COMPONENTE REALIZADO POR https://codepen.io/julio_ok/pen/ozpqGO
 */
@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [],
  templateUrl: './signature-pad.component.html',
})
export class SignaturePadComponent {
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  private pressedMouse: boolean = false;
  private x: number = 0;
  private y: number = 0;
  private colorLine: string = '#C74E07';

  ngOnInit(): void {
    const canvas = this.canvasElement.nativeElement;
    this.context = canvas.getContext('2d')!;
  }

  startDrawing(event: MouseEvent): void {
    this.pressedMouse = true;
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  drawLine(event: MouseEvent): void {
    if (this.pressedMouse) {
      const canvas = this.canvasElement.nativeElement;
      canvas.style.cursor = 'crosshair';

      const xM = event.offsetX;
      const yM = event.offsetY;
      this.drawingLine(this.colorLine, this.x, this.y, xM, yM);
      this.x = xM;
      this.y = yM;
    }
  }

  stopDrawing(): void {
    this.pressedMouse = false;
    const canvas = this.canvasElement.nativeElement;
    canvas.style.cursor = 'default';
  }

  @HostListener('window:keydown', ['$event'])
  clearCanvas(event: KeyboardEvent): void {
    if (event.key === 'c' || event.key === 'C') {
      const canvas = this.canvasElement.nativeElement;
      this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private drawingLine(color: string, xStart: number, yStart: number, xEnd: number, yEnd: number): void {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.moveTo(xStart, yStart);
    this.context.lineTo(xEnd, yEnd);
    this.context.stroke();
    this.context.closePath();
  }

  getImage(): string {
    const canvas = this.canvasElement.nativeElement;
    return canvas.toDataURL('image/png');
  }

  isCanvasBlank(): boolean {
    const canvas = this.canvasElement.nativeElement;
    const context = this.context;

    const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
      if (pixelData[i] !== 0 || pixelData[i + 1] !== 0 || pixelData[i + 2] !== 0 || pixelData[i + 3] !== 0) {
        return false; // Encontró un píxel no transparente
      }
    }

    return true; // Todos los píxeles son transparentes, está en blanco
  }

}
