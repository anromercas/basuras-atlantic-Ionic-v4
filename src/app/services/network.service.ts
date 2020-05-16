import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { environment } from 'src/environments/environment';
import { OfflineManagerService } from './offline-manager.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private hasConnection = new BehaviorSubject(false);

  constructor(private network: Network, private http: HttpClient, private offlineManager: OfflineManagerService) {
    this.network.onConnect().subscribe(() => {
      console.log('network was connected :-)');
      this.hasConnection.next(true);
      this.offlineManager.checkForEvents().subscribe();
    //  this.offlineManager.checkForImgs().subscribe();
      return;
    });
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.hasConnection.next(false);
      return;
    });
    this.testNetworkConnection();
  }

  public getNetworkType(): string {
    return this.network.type;
  }

  public getNetworkStatus(): Observable<boolean> {
    return this.hasConnection.asObservable();
  }

  private getNetworkTestRequest(): Observable<any> {
    return this.http.get(URL);
  }

  public async testNetworkConnection() {
    try {
      this.getNetworkTestRequest().subscribe(
        success => {
          // console.log('Request to Google Test  success', success);
          this.hasConnection.next(true);
          return;
        },
        error => {
          // console.log('Request to Google Test fails', error);
          this.hasConnection.next(false);
          return;
        }
      );
    } catch (err) {
      console.log('err testNetworkConnection', err);
      this.hasConnection.next(false);
      return;
    }
  }
}
