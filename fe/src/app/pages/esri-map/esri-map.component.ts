/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { setDefaultOptions, loadModules } from 'esri-loader';
import esri = __esri; // Esri TypeScript Types

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  // register Dojo AMD dependencies
  _Map;
  _MapView;
  _FeatureLayer;
  _Graphic;
  _GraphicsLayer;
  _Route;
  _RouteParameters;
  _FeatureSet;
  _Point;
  _locator;

  // Instances
  map: esri.Map;
  view: esri.MapView;
  pointGraphic: esri.Graphic;
  graphicsLayer: esri.GraphicsLayer;

  // Attributes
  zoom = 10;
  center: Array<number> = [-118.73682450024377, 34.07817583063242];
  basemap = "streets-vector";
  loaded = false;
  pointCoords: number[] = [-118.73682450024377, 34.07817583063242];
  dir: number = 0;
  count: number = 0;
  timeoutHandler = null;
  ok = 0;
  shipmentComapanyLogoURLs = {"UPS": {"url": "https://i.postimg.cc/RFPcCDcs/ups.png", "width": "20px", "height": "25px"},
          "FedEx": {"url": "https://i.postimg.cc/JzHmVZpV/FedEx.png", "width": "25px", "height": "20px"}};

  constructor() { }

  async initializeMap() {
    try {
      // configure esri-loader to use version x from the ArcGIS CDN
      // setDefaultOptions({ version: '3.3.0', css: true });
      setDefaultOptions({ css: true });

      // Load the modules for the ArcGIS API for JavaScript
      const [esriConfig, Map, MapView, FeatureLayer, Graphic, Point, GraphicsLayer, route, RouteParameters, FeatureSet, locator] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/layers/GraphicsLayer",
        "esri/rest/route",
        "esri/rest/support/RouteParameters",
        "esri/rest/support/FeatureSet",
        "esri/rest/locator"
      ]);

      esriConfig.apiKey = "AAPK5f5b4718c49f47fc9e6d29aefd6ddabbK0vPM7fMgOZ1FdB--pHcc6gCguIpzDHy8UWoE5habp2Ov2BFNoZ41yzfOj0JuQ5a";

      this._Map = Map;
      this._MapView = MapView;
      this._FeatureLayer = FeatureLayer;
      this._Graphic = Graphic;
      this._GraphicsLayer = GraphicsLayer;
      this._Route = route;
      this._RouteParameters = RouteParameters;
      this._FeatureSet = FeatureSet;
      this._Point = Point;
      this._locator = locator;

      // Configure the Map
      const mapProperties = {
        basemap: this.basemap
      };

      this.map = new Map(mapProperties);

      this.addFeatureLayers();
      this.addPoint(this.pointCoords[1], this.pointCoords[0]);
      this.addShipmentCenters();

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this.center,
        zoom: this.zoom,
        map: this.map
      };

      this.view = new MapView(mapViewProperties);

      // Fires `pointer-move` event when user clicks on "Shift"
      // key and moves the pointer on the view.
      this.view.on('pointer-move', ["Shift"], (event) => {
        let point = this.view.toMap({ x: event.x, y: event.y });
        console.log("map moved: ", point.longitude, point.latitude);
      });

      await this.view.when(); // wait for map to load
      console.log("ArcGIS map loaded");
      this.addRouter();
      this.addPlaceSearch();
      console.log(this.view.center);
      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }


  addFeatureLayers() {
    // Shipipment Centers
    this.addShipmentCenters();
  }

  addShipmentCenters() {

    fetch('http://localhost:8080/center')
    .then(response => {
      return response.json(); 
    })
    .then(shipmentCenters => {
      for (let center of shipmentCenters) {
        const point = {
          type: "point",
          longitude: center.longitude,
          latitude: center.latitude
        };
        const markerExtent = {
          xmin: -76.492706,
          xmax: -76.488920,
          ymin: 38.978750,
          ymax: 38.980800
        }
        const symbolMarker = { 
          type: "picture-marker",
          url: this.shipmentComapanyLogoURLs[center.name].url,
          width: this.shipmentComapanyLogoURLs[center.name].width,
          height: this.shipmentComapanyLogoURLs[center.name].height
        };
        const graphicPoint = new this._Graphic({
          geometry: point,
          symbol: symbolMarker
        });
        const layerPoint = new this._GraphicsLayer({
          graphics: [graphicPoint]
        });
        layerPoint.add(graphicPoint);
        this.map.add(layerPoint);
      }
    })
  }

  addPoint(lat: number, lng: number) {
    this.graphicsLayer = new this._GraphicsLayer();
    this.map.add(this.graphicsLayer);
    const point = { //Create a point
      type: "point",
      longitude: lng,
      latitude: lat
    };
    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],  // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1
      }
    };
    this.pointGraphic = new this._Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });
    this.graphicsLayer.add(this.pointGraphic);
  }

  removePoint() {
    if (this.pointGraphic != null) {
      this.graphicsLayer.remove(this.pointGraphic);
    }
  }

  addPlaceSearch() {
    this.view.when(()=>{
      findPlaces(this.view.center);
    });

    var findPlaces = (pt: any) => {
      const geocodingServiceUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

      const params = {
        categories: ["gas station"],
        location: pt,  // Paris (2.34602,48.85880)
        outFields: ["PlaceName", "Place_addr"]
      }

      this._locator.addressToLocations(geocodingServiceUrl, params).then((results)=> {
        showResults(results);
      });
    }

    var showResults = (results: any) => {
      this.view.popup.close();
      // this.view.graphics.removeAll();
        results.forEach((result)=>{
          this.view.graphics.add(
            new this._Graphic({
              attributes: result.attributes,
              geometry: result.location,
              symbol: {
               type: "picture-marker",
               url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB5CAYAAAAd+o5JAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADKGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwMTQgNzkuMTU2Nzk3LCAyMDE0LzA4LzIwLTA5OjUzOjAyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREREQjFENDY4NzMxMUU0OTg1Q0Q1Mjg0NjgwMjQzNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREREQjFENTY4NzMxMUU0OTg1Q0Q1Mjg0NjgwMjQzNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJERERCMUQyNjg3MzExRTQ5ODVDRDUyODQ2ODAyNDM1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJERERCMUQzNjg3MzExRTQ5ODVDRDUyODQ2ODAyNDM1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+mZPfoAAABW1JREFUeF7t3eGNE0kUxPENgRAuBEIgBEIgBEIgA0IghP3MJ0IgBEJYiQR889zDcrb/bffoqqR+va+kn05X8q6my4Jh8a55Op1OZXFYlrVgWdaCZVkLlmUtWJa1YFnWgmVZC5ZlLViWtWBZ1oJlWQuWZS1YlrVgWdaCZVkLlmUtWJa1YOn29P33+83PzSm5H5t3T4LQTipYum3D/PrPUNn92J+n/xXaSQVLNxgqN0FoJxUs3XCozAShnVSwdMOhMhOEdlLB0g2HykwQ2kkFSzccKjNBaCcVLN1wqMwEoZ1UsHTDoTIThHZSwdINh8pMENpJBUs3HCozQWgnFSzdcKjc4q83//i2+bJ5vz9/Q6GdVLB02wagoSS/Iqyha74vnvShJ5t2UsHS7WqIv2YPXfOYT/tn6IZ2UsHSDUZoZg9d87gP+2fB0E4qWLrBAM3soWse97LpvixJO6lg6XZ1+L9mD13zMZ/3z3QT2kkFSzc4fDN76JqP+bl/ppvQTipYusHhm9lD13xUJ7STCpZuePgwe+iaj+qEdlLB0g0PH2YPXfNRndBOKli64eHD7KFrPqoT2kkFSzc8fJg9dM1HdUI7qWDphocPs4eu+ahOaCcVLN3w8GH20DUf1QntpIKlGx4+zB665qM6oZ1UsHTDw4fZQ9d8VCe0kwqWbnj4MHvomo/qhHZSwdINDx9mD13zcfgiBe2kgqUbHLyZPXTNgdK+O4Qejy850k4qWLrBwZvZQ9ccKPUk4+HrSTbB0g0O3sweuuZA6T/JX/ZHXIR2UsHSDQ7ezB665kDpP8nf9kdchHZSwdINDp4bJX5bpsd2vnGAdlLB0g0OnhulvWUGPx6+jKKdVLB0g0Pn1gs9tvm4P+I1tJMKlm5w6Nx66b/5zdf9Ea+hnVSwdIND59ZLPJn0eLgv004qWLrBoXPrJX5bpsc3F/dl2kkFSzc4cG69xBNJj28u7su0kwqWbnDg3O5l8L5MO6lg6QYHzu1eBu/LtJMKlm5w4NzuZfC+TDupYOkGh83tXgbvy7STCpZucNjcHmXgvkw7qWDpBofN7VH6L1a83pdpJxUs3eCwuT1K/8WKcL4v004qWLrBQXMbCX1cc74v004qWLrBQXMbSXuTGPr4832ZdlLB0g0OmttIHtyXaScVLN3goLmN5MF9mXZSwdINDpnbaNqbw9Dn+Eg7qWDpBofMbTTffz/ffGzzlXZSwdINDpnbaOLdf+jjt/sy7aSCpRscMrfR3Pm+r+uNlLB0o0OmdiT08ZvrjZSwdKNDJvfP/hQ+Dn/8NgtvpYClGx0yubvvm3kR/vhtFt5KAUs3OmRyN999iYl3y+WPf6GdVLB0g0NmF1//3v8tu72u3PvnC59pJxUs3eCQK4jXjPEHzM99/zXl8Il2UsHSDQ65ivgVHX9H3d6tvn3JFP/f+5uucH6LZNpJBUu3q0O+ded3taedVLB0g4O+Vc/nX/FbaCcVLN3gsG/RxT2cdlLB0u3qsG9R/LNC9WMyycSTRv21+BLq5sdWI7STCpZuVwfPLxJfJ7c/Sce3+fz503T8N/4/foqi/jWZ1AShnVSwdMOhMhOEdlLB0g2HykwQ2kkFSzccKjNBaCcVLN1wqMwEoZ1UsHTDoTIThHZSwdINh8pMENpJBUs3HCozQWgnFSzdcKjMBKGdVLB0w6EyE4R2UsHSDYfKTBDaSQVLNxwqM0FoJxUs3XCozAShnVSwdMOhMhOEdlLB0g2HykwQ2kkFSzccKjNBaCcVLN1wqMwEoZ1UsCxrwbKsBcuyFizLWrAsa8GyrAXLshYsy1qwLGvBsqwFy7IWLMtasCxrwbKsBcuyFizLWrAsKzk9/Qs72Vozr7w/zwAAAABJRU5ErkJggg==",
               width: "18px",
               height: "18px"
              //  color: "black",
              //  size: "10px",
              //  outline: {
              //    color: "#ffffff",
              //    width: "2px"
              //  }
              },
              popupTemplate: {
                title: "{PlaceName}",
                content: "{Place_addr}" + "<br><br>" + result.location.x.toFixed(5) + "," + result.location.y.toFixed(5)
              }
           }));
        });
        if (results.length) {
          const g = this.view.graphics.getItemAt(0);
          this.view.popup.open({
            features: [g],
            location: g.geometry
          });
        }
    }
  }

  addRouter() {
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    this.view.on("click", (event) => {
      console.log("point clicked: ", event.mapPoint.latitude, event.mapPoint.longitude);
      if (this.ok === 0) {
        addGraphic("origin", event.mapPoint);
        this.ok += 1;
      } else if (this.ok === 1) {
        addGraphic("destination", event.mapPoint);
        getRoute(); // Call the route service
        this.ok += 1;
      } else {
        // this.view.graphics.removeAll();
        addGraphic("origin", event.mapPoint);
        this.ok = 0;
      }
    });

    var addGraphic = (type: any, point: any) => {
      const graphic = new this._Graphic({
        symbol: {
          type: "simple-marker",
          color: (type === "origin") ? "white" : "black",
          size: "8px"
        } as any,
        geometry: point
      });
      this.view.graphics.add(graphic);
    }

    var getRoute = () => {
      const routeParams = new this._RouteParameters({
        stops: new this._FeatureSet({
          features: this.view.graphics.toArray()
        }),
        returnDirections: true
      });

      this._Route.solve(routeUrl, routeParams).then((data: any) => {
        for (let result of data.routeResults) {
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255],
            width: 3
          };
          this.view.graphics.add(result.route);
        }

        // Display directions
        if (data.routeResults.length > 0) {
          const directions: any = document.createElement("ol");
          directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
          directions.style.marginTop = "0";
          directions.style.padding = "15px 15px 15px 30px";
          const features = data.routeResults[0].directions.features;

          let sum = 0;
          // Show each direction
          features.forEach((result: any, i: any) => {
            sum += parseFloat(result.attributes.length);
            const direction = document.createElement("li");
            direction.innerHTML = result.attributes.text + " (" + result.attributes.length + " miles)";
            directions.appendChild(direction);
          });

          sum = sum * 1.609344;
          console.log('dist (km) = ', sum);

          this.view.ui.empty("top-right");
          this.view.ui.add(directions, "top-right");

        }

      }).catch((error: any) => {
        console.log(error);
      });
    }
  }

  runTimer() {
    this.timeoutHandler = setTimeout(() => {
      // code to execute continuously until the view is closed
      // ...
      this.animatePointDemo();
      this.runTimer();
    }, 200);
  }

  animatePointDemo() {
    this.removePoint();
    switch (this.dir) {
      case 0:
        this.pointCoords[1] += 0.01;
        break;
      case 1:
        this.pointCoords[0] += 0.02;
        break;
      case 2:
        this.pointCoords[1] -= 0.01;
        break;
      case 3:
        this.pointCoords[0] -= 0.02;
        break;
    }

    this.count += 1;
    if (this.count >= 10) {
      this.count = 0;
      this.dir += 1;
      if (this.dir > 3) {
        this.dir = 0;
      }
    }

    this.addPoint(this.pointCoords[1], this.pointCoords[0]);
  }

  stopTimer() {
    if (this.timeoutHandler != null) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }

  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(() => {
      // The map has been initialized
      console.log("mapView ready: ", this.view.ready);
      this.loaded = this.view.ready;
      this.mapLoadedEvent.emit(true);
      this.runTimer();
    });
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
    this.stopTimer();
  }
}
