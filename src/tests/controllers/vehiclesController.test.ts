import { NextFunction, Request, Response } from 'express';
import { getVehicleStateLog } from '../../services/stateLogService';
import { getVehicleInfoWithIdAndTimestamp } from '../../controllers/vehiclesController';
import { getVehicle } from '../../services/vehicleService';
import { VehicleInfo } from '../../interfaces/IVehicleinfo';

jest.mock('../../services/vehicleService');
jest.mock('../../services/stateLogService');
jest.mock('pg');
// jest.mock('redis', () => redis);

describe('getVehicleInfoWithIdAndTimestamp', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let id: string;
  let timestamp: string;
  let formattedTimestamp: string;

  beforeEach(() => {
    id = '1';
    timestamp = '2022-02-20 10:00:00 +0000';
    formattedTimestamp = '2022-02-20T10:00:00.000+00:00';

    req = {
      params: { id },
      query: { timestamp },
    } as unknown as Request;

    res = {
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it('should return vehicle info with valid id and timestamp', async () => {
    (getVehicleStateLog as jest.Mock).mockResolvedValue('state data');
    (getVehicle as jest.Mock).mockResolvedValue({ id, make: 'Toyota', model: 'Camry' });
    await getVehicleInfoWithIdAndTimestamp(req, res, next);

    expect(getVehicleStateLog).toHaveBeenCalledWith(undefined, id, formattedTimestamp);
    expect(getVehicle).toHaveBeenCalledWith(undefined, id);
    expect(res.json).toHaveBeenCalledWith({
      id,
      make: 'Toyota',
      model: 'Camry',
      state: 'state data',
    } as VehicleInfo);
    expect(next).not.toHaveBeenCalled();
  });
});
