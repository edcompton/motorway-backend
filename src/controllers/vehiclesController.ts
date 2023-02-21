import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { getVehicleStateLog } from '../services/stateLogService';
import { getVehicle } from '../services/vehicleService';
import { VehicleInfo } from '../interfaces/IVehicleinfo';
import { redisClient } from '../db';

export async function getVehicleInfoWithIdAndTimestamp(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const timestamp = req.query.timestamp as string;

  try {
    const formattedTimestamp = moment(timestamp, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    const state = await getVehicleStateLog(redisClient, id, formattedTimestamp);
    const vehicle = await getVehicle(redisClient, id);

    res.json({
      id: vehicle.id.toString(),
      make: vehicle.make,
      model: vehicle.model,
      state,
    } as VehicleInfo);
  } catch (err) {
    next(err);
  }
}
