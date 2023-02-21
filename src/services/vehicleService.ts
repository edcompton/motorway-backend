import { HttpError } from '../middleware/exceptions';
import { Vehicle } from '../interfaces/IPgQueries';
import { isVehicle } from '../utils/typeGuards';
import { pool } from '../db';
import { RedisClientType } from 'redis';

export async function getVehicle(redisClient: RedisClientType, id: string) {
  const cacheKey = `vehicle:${id}`;
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    const parsedCacheData = JSON.parse(cachedData);
    if (isVehicle(parsedCacheData)) {
      return parsedCacheData;
    }
  }

  const vehicleResult = await pool.query<Vehicle>(
    `
            SELECT *
            FROM "vehicles"
            WHERE "id" = $1
        `,
    [id],
  );

  const vehicle = vehicleResult?.rows[0];
  if (!vehicle) {
    throw new HttpError(404, `No vehicle found for vehicle ID ${id}`);
  }

  if (!isVehicle(vehicle)) {
    throw new HttpError(500, `Returned vehicle of unexpected type`);
  }

  await redisClient.set(cacheKey, JSON.stringify(vehicle));
  return vehicle;
}
