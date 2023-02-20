import { redisClient } from '../server';
import { HttpError } from '../middleware/exceptions';
import { StateLog } from '../interfaces/IPgQueries';
import { isStateLog } from '../utils/typeGuards';
import pool from '../db';

export async function getVehicleStateLog(id: string, formattedTimestamp: string) {
  const cacheKey = `stateLogs:${id}:${formattedTimestamp}`;

  const cachedResult = await redisClient.get(cacheKey);
  if (cachedResult) {
    const parsedCacheData = JSON.parse(cachedResult);
    if (isStateLog(parsedCacheData)) {
      return parsedCacheData.state;
    }
  }

  const result = await pool.query<StateLog>(
    `
            SELECT *
            FROM "stateLogs"
            WHERE "vehicleId" = $1
              AND "timestamp" <= $2
            ORDER BY "timestamp" DESC
            LIMIT 1
        `,
    [id, formattedTimestamp],
  );

  const stateObject = result?.rows[0];
  if (!stateObject) {
    throw new HttpError(404, `No state log found for vehicle ID ${id} and timestamp ${formattedTimestamp}`);
  }

  if (!isStateLog(stateObject)) {
    throw new HttpError(500, `Returned state object is of unexpected type`);
  }

  await redisClient.set(cacheKey, JSON.stringify(stateObject));
  return stateObject.state;
}
