import {AuthService} from './../auth/auth.service';
import {Place} from './places.model';
import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {take, map, tap, delay, switchMap} from 'rxjs/operators';
import {LoadingController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private loadingCtr: LoadingController;

  // new Place(
  //   'p1',
  //   'Manhattan Mansion',
  //   'In the heart of New York City.',
  //   'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
  //   149.99,
  //   new Date('2020-10-05'),
  //   new Date('2021-10-05'),
  //   'abc'
  // ),
  // new Place(
  //   'p2',
  //   // tslint:disable-next-line: quotemark
  //   "L'Amour Toujours",
  //   'A romantic place in Paris!',
  //   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
  //   189.99,
  //   new Date('2020-08-05'),
  //   new Date('2021-10-05'),
  //   'abc'
  // ),
  // new Place(
  //   'p3',
  //   'The Foggy Palace',
  //   'Not your average city trip!',
  //   'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
  //   99.99,
  //   new Date('2022-10-01'),
  //   new Date('2024-10-09'),
  //   'abc'
  // )

  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-f6d30.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(resData => {
          console.log(resData);
          return new Place(
            (id = id),
            resData.title,
            resData.description,
            resData.imageUrl,
            resData.price,
            new Date(resData.availableFrom),
            new Date(resData.availableTo),
            resData.userId
          );
        })
      );

    // public id: string,
    // public title: string,
    // public description: string,
    // public imageUrl: string,
    // public price: number,
    // public availableFrom: Date,
    // public availableTo: Date,
    // public userId: string
  }

  fetchPlaces() {
    return this.http
      .get<{[key: string]: PlaceData}>(
        'https://ionic-angular-f6d30.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              // console.log('resData: ');
              // console.log(resData[key]);

              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          console.log('places in service: ', places);
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
      .post<{name: string}>(
        'https://ionic-angular-f6d30.firebaseio.com/offered-places.json',
        {
          ...newPlace,
          id: null,
        }
      )
      .pipe(
        switchMap(resdata => {
          generatedId = resdata.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  editPlace(title: string, description: string, id: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const placeIndex = places.findIndex(pl => pl.id === id);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[placeIndex];
        updatedPlaces[placeIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://ionic-angular-f6d30.firebaseio.com/offered-places/${id}.json`,
          {
            ...updatedPlaces[placeIndex],
            id: null,
          }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
