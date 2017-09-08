import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ImagePicker } from '@ionic-native/image-picker'; 
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { IonicImageViewerModule} from 'ionic-img-viewer';
import { ImageGalleryPage } from '../pages/image-gallery/image-gallery';
import { BookingPage } from '../pages/booking/booking';
import { AgmCoreModule } from '@agm/core';
import { Toast} from '@ionic-native/toast'


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { MenuPage } from '../pages/menu/menu';
import { HutsPage } from '../pages/huts/huts';
import { AddhutPage } from '../pages/addhut/addhut';
import { GooglemapPage } from '../pages/googlemap/googlemap';
import { ProfilePage } from '../pages/profile/profile';
import { MyHutsPage } from '../pages/my-huts/my-huts'


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { HutProvider } from '../providers/hut/hut';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignupPage,
    MenuPage,
    HutsPage,
    AddhutPage,
    ImageGalleryPage,
    BookingPage,
    GooglemapPage,
    ProfilePage,
    MyHutsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp),
    IonicImageViewerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC-1dUdU_nJ8N4Zh3ijPzLF7MANu6sIkKQ'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignupPage,
    MenuPage,
    HutsPage,
    AddhutPage,
    ImageGalleryPage,
    BookingPage,
    GooglemapPage,
    ProfilePage,
    MyHutsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    HutProvider,
    ImagePicker,
    Camera,
    Toast
  ]
})
export class AppModule {}
