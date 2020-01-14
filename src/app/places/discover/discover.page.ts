import {AuthService} from './../../auth/auth.service';
import {PlacesService} from './../places.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Place} from '../places.model';
import {ThrowStmt} from '@angular/compiler';
import {SegmentChangeEventDetail} from '@ionic/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;
  listedLoadedPlaces: Place[];

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
    console.log('this.loadedPlaces:, ', this.loadedPlaces);
  }

  // ionViewDidEnter() {
  //   this.loadedPlaces = this.placesService.places;
  //   console.log('this.loadedPlaces:, ', this.loadedPlaces);
  // }

  onFilterChange(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(this.relevantPlaces);

    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else if (event.detail.value === 'bookable') {
      console.log(this.authService.userId);
      this.relevantPlaces = this.loadedPlaces.filter(
        place => place.userId !== this.authService.userId
      );
      console.log('bookable ', this.relevantPlaces);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
