import {TemplateRef} from '@angular/core';

export interface Step {
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  content: TemplateRef<any>;
  onClick?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}
