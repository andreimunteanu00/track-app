import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy, OnChanges, SimpleChanges
} from "@angular/core";
import { setDefaultOptions, loadModules } from 'esri-loader';
// @ts-ignore
import esri = __esri; // Esri TypeScript Types
import { ShipmentCenter } from '../../models/shipment-center.model';
import {IShip} from "../../models/ship.model";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() shipment: IShip;

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
  _Polyline;
  _Polygon;
  _geodesicUtils;
  _locator;

  // Instances
  map: esri.Map;
  view: esri.MapView;
  pointGraphic: esri.Graphic;
  graphicsLayer: esri.GraphicsLayer;

  // Attributes
  zoom = 11;
  center: Array<number> = [26.103030, 44.435408];
  basemap = "streets-vector";
  loaded = false;
  pointCoords: number[] = [26.103030, 44.435408];
  dir: number = 0;
  count: number = 0;
  timeoutHandler = null;
  shipmentComapanyLogoURLs = {
    "UPS": {"url": "https://i.postimg.cc/RFPcCDcs/ups.png", "width": "20px", "height": "25px"},
    "FedEx": {"url": "https://i.postimg.cc/JzHmVZpV/FedEx.png", "width": "25px", "height": "20px"},
    "easyBox": {"url": "https://i.postimg.cc/GpvFh1T0/sameday-easybox.png", "width": "25px", "height": "20px"},
    "FANCourier": {"url": "https://i.postimg.cc/fbH9bTWr/Logo-Fan-Courier-svg.png", "width": "25px", "height": "20px"},
    "Cargus": {"url": "https://i.postimg.cc/dtmD1t4j/logo-cargus.png", "width": "25px", "height": "20px"}
  };
  shipmentCenterLayers: any[];
  aerialCurrentLocation: {};
  aerialLayer: any;
  flisghtsGraphics: any[];
  testPloyline: any[];

  lastPoint: any;

  constructor(protected http: HttpClient) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changeShipmentInfo(changes.shipment.currentValue);
  }

  async initializeMap() {
    try {
      // configure esri-loader to use version x from the ArcGIS CDN
      // setDefaultOptions({ version: '3.3.0', css: true });
      setDefaultOptions({ css: true });

      // Load the modules for the ArcGIS API for JavaScript
      const [esriConfig, Map, MapView, FeatureLayer, Graphic, Point, Polyline, Polygon, geodesicUtils, GraphicsLayer, route, RouteParameters, FeatureSet] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/geometry/support/geodesicUtils",
        "esri/layers/GraphicsLayer",
        "esri/rest/route",
        "esri/rest/support/RouteParameters",
        "esri/rest/support/FeatureSet"
      ]);

      // esriConfig.apiKey = "MY_API_KEY";

      this._Map = Map;
      this._MapView = MapView;
      this._FeatureLayer = FeatureLayer;
      this._Graphic = Graphic;
      this._GraphicsLayer = GraphicsLayer;
      this._Route = route;
      this._RouteParameters = RouteParameters;
      this._FeatureSet = FeatureSet;
      this._Point = Point;
      this._Polyline = Polyline;
      this._Polygon = Polygon;
      this._geodesicUtils = geodesicUtils;

      this.aerialCurrentLocation = {};

      // Configure the Map
      const mapProperties = {
        basemap: this.basemap
      };

      this.map = new Map(mapProperties);

      this.addFeatureLayers();

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
      // this.addRouter();
      console.log(this.view.center);
      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  changeShipmentInfo(shipment) {
    if (this.lastPoint) {
      this.map.remove(this.lastPoint);
    }

    const graphicPoint = new this._Graphic({
      geometry: {
        type: "point",
        latitude: shipment.currentLat,
        longitude: shipment.currentLong,
      },
    });

    const layerPoint = new this._GraphicsLayer({
      graphics: [graphicPoint],
    });

    this.lastPoint = layerPoint;

    this.map.add(layerPoint);
  }

  addFeatureLayers() {
    this.shipmentCenterLayers = [];
    var selectedCenters = ["UPS", "FedEx", "easyBox", "FANCourier", "Cargus"];

    this.addShipmentCenters(selectedCenters);

    this.addAerialShipments();
  }

  addAerialShipments() {
    this.map.remove(this.aerialLayer);
    this.flisghtsGraphics = [];
    this.aerialLayer = new this._GraphicsLayer({
      graphics: this.flisghtsGraphics
    });

    // var polylineGraphic = this.createGeodesicLineAndUpdateCurrentPos([-0.11259218103538629, 51.45930264413967], [-74.09000007051907, 4.692707636587198]);
    // this.testPloyline = polylineGraphic;
    // this.flisghtsGraphics.push(polylineGraphic[0]);

    // this.aerialCurrentLocation["1234"] = [0, null];
    // if (this.aerialCurrentLocation["1234"][1] != null) {
    //   const idx = this.flisghtsGraphics.indexOf(this.aerialCurrentLocation["1234"][1]);
    //   this.flisghtsGraphics.splice(idx, 1);
    // }
    // var currentPoint = this.updateLocation("1234", polylineGraphic[1]);
    // this.flisghtsGraphics.push(currentPoint);
    // this.aerialLayer.graphics = this.flisghtsGraphics;
    // this.aerialLayer.add(polylineGraphic[0]);
    // this.aerialLayer.add(currentPoint);

    this.http.get<Array<IShip>>('http://localhost:8080/api/shipment/my', {observe:"response"})
      .subscribe(response => {
        console.log(response.body);

        for (let shipment of response.body) {
          if ("AERIAL" == shipment.shippingMethod) {
            var polylineGraphic = this.createGeodesicLineAndUpdateCurrentPos([shipment.startLat, shipment.startLong], [shipment.endLat, shipment.endLong]);
            this.testPloyline = polylineGraphic;

            if (shipment.currentPathIndex >= polylineGraphic[1].paths[0].length) {
              shipment.currentPathIndex = polylineGraphic[1].paths[0].length - 1;
            }
            var currentPoint = this.updateLocation(polylineGraphic[1].paths[0][shipment.currentPathIndex][0], polylineGraphic[1].paths[0][shipment.currentPathIndex][1]);
            this.flisghtsGraphics.push(polylineGraphic[0]);
            this.flisghtsGraphics.push(currentPoint);
            this.aerialLayer.graphics = this.flisghtsGraphics;
            this.aerialLayer.add(polylineGraphic[0]);
            this.aerialLayer.add(currentPoint);
          }
        }
      });

    this.map.add(this.aerialLayer);
  }

  updateLocation(long: number, lat: number) {
    const point = {
      type: "point",
      longitude: long,
      latitude: lat
    };
    const markerExtent = {
      xmin: -76.492706,
      xmax: -76.488920,
      ymin: 38.978750,
      ymax: 38.980800
    }
    const symbolMarker = {
      type: "simple-marker"
    };
    const graphicPoint = new this._Graphic({
      geometry: point,
      symbol: symbolMarker
    });

    return graphicPoint;
  }

  // updateLocation(shipmentId: string, densifiedPolyline: any) {
  //   const point = {
  //     type: "point",
  //     longitude: densifiedPolyline.paths[0][this.aerialCurrentLocation[shipmentId][0]][0],
  //     latitude: densifiedPolyline.paths[0][this.aerialCurrentLocation[shipmentId][0]][1]
  //   };
  //   const markerExtent = {
  //     xmin: -76.492706,
  //     xmax: -76.488920,
  //     ymin: 38.978750,
  //     ymax: 38.980800
  //   }
  //   const symbolMarker = {
  //     type: "simple-marker"
  //   };
  //   const graphicPoint = new this._Graphic({
  //     geometry: point,
  //     symbol: symbolMarker
  //   });
  //   if (this.aerialCurrentLocation[shipmentId][0] < densifiedPolyline.paths[0].length - 1) {
  //     this.aerialCurrentLocation[shipmentId][0]++;
  //   }
  //   this.aerialCurrentLocation[shipmentId][1] = graphicPoint;

  //   return graphicPoint;
  // }

  createGeodesicLineAndUpdateCurrentPos(pointA: number[], pointB: number[]) {
    var polyline = new this._Polyline({
      paths: [
        pointA,
        pointB
      ]
    });
    const simpleLineSymbol = {
      type: "simple-line",
      color: [226, 119, 40], // Orange
      width: 2
    };
    const densifiedPolyline = this._geodesicUtils.geodesicDensify(polyline, 50000);
    console.log(densifiedPolyline);
    const graphicPolyLine = new this._Graphic({
      geometry: densifiedPolyline,
      symbol: simpleLineSymbol
    })

    return [graphicPolyLine, densifiedPolyline];
  }

  addShipmentCenters(centers: any[]) {
    var graphicPoints = [];
    const layerPoint = new this._GraphicsLayer({
          graphics: graphicPoints
        });

    this.http.get<Array<ShipmentCenter>>('http://localhost:8080/api/center', {observe:"response"})
      .subscribe(response => {
        console.log(response.body);

        for (let center of response.body) {
          if (!centers.includes(center.name)) {
            continue;
          }
          console.log(center.name);
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
          graphicPoints.push(graphicPoint);
          layerPoint.graphics = graphicPoints;
          layerPoint.add(graphicPoint);
        }
      })


    this.shipmentCenterLayers.push(layerPoint);
    this.map.add(layerPoint);
  }

  change() {
    var modelCbs = document.querySelectorAll(".models input[type='checkbox']");
    var processorCbs = document.querySelectorAll(".processors input[type='checkbox']");
    var filters = {
      models: this.getClassOfCheckedCheckboxes(modelCbs),
      processors: this.getClassOfCheckedCheckboxes(processorCbs)
    };

    this.filterResults(filters);
  }

  getClassOfCheckedCheckboxes(checkboxes) {
    var classes = [];

    if (checkboxes && checkboxes.length > 0) {
      for (var i = 0; i < checkboxes.length; i++) {
        var cb = checkboxes[i];

        if (cb.checked) {
          classes.push(cb.getAttribute("rel"));
        }
      }
    }

    return classes;
  }

  filterResults(filters) {
    var selectedCenters = [];

    for (var j = 0; j < filters.models.length; j++) {
      selectedCenters.push(filters.models[j]);
    }

    // Shipipment Centers
    for (let shipmentLayer of this.shipmentCenterLayers) {
      this.map.remove(shipmentLayer);
    }
    this.shipmentCenterLayers = [];
    this.addShipmentCenters(selectedCenters);
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

  addRouter() {
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    this.view.on("click", (event) => {
      console.log("point clicked: ", event.mapPoint.latitude, event.mapPoint.longitude);
      if (this.view.graphics.length === 0) {
        addGraphic("origin", event.mapPoint);
      } else if (this.view.graphics.length === 1) {
        addGraphic("destination", event.mapPoint);
        getRoute(); // Call the route service
      } else {
        this.view.graphics.removeAll();
        addGraphic("origin", event.mapPoint);
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
      this.runTimer();
    }, 200);
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
