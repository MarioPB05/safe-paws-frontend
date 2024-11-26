import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './image-uploader.component.html'
})
export class ImageUploaderComponent implements OnInit {
  @Input() svgSize: string = 'size-32';
  @Input() textSize: string = 'text-lg';
  @Input() defaultImage: string | null = null;

  @Output() imageSelected = new EventEmitter<File>();

  previewUrl: string | ArrayBuffer | null = '';
  showPreview = false;

  ngOnInit(): void {
    if (this.defaultImage) {
      console.log('defaultImage', this.defaultImage);
      this.previewUrl = this.defaultImage;
      this.showPreview = true;
    }
  }

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
