export interface IAlert {
  data: IAlertData;
  type: string;
  id: string;
}

interface IAlertData {
  address?: IAlertAddress;
  createdAt: string;
  details: string;
  endAt: string;
  geolocation?: IAlertGeolocation;
  incidentCategory: string;
  incidentType: string;
  startAt: string;
  title: string;
}

interface IAlertAddress {
  alpha3Code?: string;
  city?: string;
  country?: string;
  street?: string;
  zip?: string;
}

interface IAlertGeolocation {
  circle: IAlertGeoCircle;
  type: string;
}

interface IAlertGeoCircle {
  point: IAlertGeoCirclePoint;
  radius: number;
}

interface IAlertGeoCirclePoint {
  lat: number;
  lng: number;
}
