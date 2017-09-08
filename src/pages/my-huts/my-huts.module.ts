import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyHutsPage } from './my-huts';

@NgModule({
  declarations: [
    MyHutsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyHutsPage),
  ],
})
export class MyHutsPageModule {}
