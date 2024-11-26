import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './image-uploader.component.html'
})
export class ImageUploaderComponent {
  @Input() svgSize: string = 'size-32';
  @Input() textSize: string = 'text-lg';

  @Output() imageSelected = new EventEmitter<File>();

  previewUrl: string | ArrayBuffer | null = '';
  showPreview = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl = reader.result;
        this.showPreview = true;
        this.imageSelected.emit(file);
      };

      reader.readAsDataURL(file);
    }
  }
}
