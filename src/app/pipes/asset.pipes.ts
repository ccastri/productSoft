import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'asset' })
export class AssetPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): any {
    const assetUrl = `assets/${value}`;
    return this.sanitizer.bypassSecurityTrustUrl(assetUrl);
  }
}
