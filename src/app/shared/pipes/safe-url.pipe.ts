import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ 
  name: 'safeUrl' 
})
export class SafeUrlPipe implements PipeTransform {
  
  constructor(
    private sanitiser: DomSanitizer,
  ) {}

  transform(url: string): any {
    return this.sanitiser.bypassSecurityTrustResourceUrl(url);
  }
}
