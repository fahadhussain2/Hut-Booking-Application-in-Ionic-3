import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HutsPage } from './huts';

@NgModule({
  declarations: [
    HutsPage,
  ],
  imports: [
    IonicPageModule.forChild(HutsPage),
  ],
})
export class HutsPageModule {}
