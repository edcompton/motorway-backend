import { pgClient, redisClient } from '../server';
import { HttpError } from '../middleware/exceptions';
import { Vehicle } from '../interfaces/IPgQueries';
import { isVehicle } from '../utils/typeGuards';

export async function getVehicle(id: string) {
  const cacheKey = `vehicle:${id}`;
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    const parsedCacheData = JSON.parse(cachedData);
    if (isVehicle(parsedCacheData)) {
      return parsedCacheData;
    }
  }

  const vehicleResult = await pgClient.query<Vehicle>(
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
