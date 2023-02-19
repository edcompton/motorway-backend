export interface StateLog {
  id: number;
  vehicleId: number;
  state: string;
  timestamp: string;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
}
