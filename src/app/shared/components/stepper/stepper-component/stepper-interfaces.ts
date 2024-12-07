import {TemplateRef} from '@angular/core';

export interface Step {
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  content: TemplateRef<any>;
  onClick?: () => boolean | void;
  onNext?: () => boolean | void;
  onPrevious?: () => boolean | void;
}
