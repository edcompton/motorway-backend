import { pgClient } from '../server';
import { HttpError } from '../middleware/exceptions';
import { StateLog } from '../interfaces/IPgQueries';
import { isStateLog } from '../utils/typeGuards';

export async function getVehicleStateLog(id: string, formattedTimestamp: string) {
  const result = await pgClient.query<StateLog>(
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

  return stateObject.state;
}
