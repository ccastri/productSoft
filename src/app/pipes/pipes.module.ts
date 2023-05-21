import { NgModule } from '@angular/core';
import { AssetPipe } from './asset.pipe';
import { CurrencyFormatPipe } from './cuurency.pipe';

@NgModule({
  declarations: [AssetPipe, CurrencyFormatPipe],
  exports: [AssetPipe, CurrencyFormatPipe],
})
export class PipesModule {}
