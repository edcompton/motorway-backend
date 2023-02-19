import { StateLog, Vehicle } from '../interfaces/IPgQueries';

export function isVehicle(obj: unknown): obj is Vehicle {
  const v = obj as Vehicle;
  return v && typeof v.id === 'number' && typeof v.make === 'string' && typeof v.model === 'string';
}

export function isStateLog(obj: unknown): obj is StateLog {
  const s = obj as StateLog;
  return s && typeof s.vehicleId === 'number';
}
