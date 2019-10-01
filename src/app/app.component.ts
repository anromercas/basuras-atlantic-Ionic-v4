import { Component, OnDestroy, AfterViewInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements  OnDestroy, AfterViewInit {

  backButtonSubscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      console.log('exit button');
      if( this.router.url === '/home' || this.router.url === '/login' ) {
        navigator['app'].exitApp();
      } else {
        this.navCtrl.pop();
      }
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
}
