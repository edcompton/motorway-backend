import { pool } from '../../db';
import { getVehicleStateLog } from '../../services/stateLogService';
import { StateLog } from '../../interfaces/IPgQueries';
import redis, { RedisClientType } from 'redis';
import { HttpError } from '../../middleware/exceptions';

describe('getVehicleStateLog', () => {
  const redisClient = redis.createClient();
  const id = '1';
  const timestamp = '2023-02-20T20:15:00.000Z';
  const mockStateLog: StateLog = {
    id: 1,
    vehicleId: 1,
    timestamp: '2023-02-20T20:15:00.000Z',
    state: 'sold',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return state from cache when available', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValueOnce(JSON.stringify(mockStateLog));
    jest.spyOn(pool, 'query');

    const result = await getVehicleStateLog(redisClient as RedisClientType, id, timestamp);

    expect(result).toEqual(mockStateLog.state);
    expect(redisClient.get).toHaveBeenCalledWith(`stateLogs:${mockStateLog.vehicleId}:${mockStateLog.timestamp}`);
    expect(redisClient.get).toHaveBeenCalledTimes(1);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('should return state from database when not available in cache', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisClient, 'set');
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockStateLog] });

    const result = await getVehicleStateLog(redisClient as RedisClientType, id, timestamp);

    expect(result).toEqual(mockStateLog.state);
    expect(redisClient.get as jest.Mock).toHaveBeenCalledWith(`stateLogs:${mockStateLog.vehicleId}:${mockStateLog.timestamp}`);
    expect(redisClient.set).toHaveBeenCalledWith(`stateLogs:${mockStateLog.vehicleId}:${mockStateLog.timestamp}`, JSON.stringify(mockStateLog));
    expect(pool.query as jest.Mock).toHaveBeenCalledWith(expect.stringContaining('"stateLogs"'), expect.arrayContaining([id, timestamp]));
  });

  it('should throw an error when no state logs are found', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValueOnce(null);
    jest.spyOn(redisClient, 'set');
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    await expect(getVehicleStateLog(redisClient as RedisClientType, id, timestamp)).rejects.toThrow(
      new HttpError(404, `No state log found for vehicle ID ${mockStateLog.vehicleId} and timestamp ${mockStateLog.timestamp}`),
    );

    expect(redisClient.get as jest.Mock).toHaveBeenCalledWith(`stateLogs:${mockStateLog.vehicleId}:${mockStateLog.timestamp}`);
    expect(redisClient.set).not.toHaveBeenCalled();
    expect(pool.query as jest.Mock).toHaveBeenCalledWith(expect.stringContaining('"stateLogs"'), expect.arrayContaining([id, timestamp]));
  });

  it('should throw an error when returned state object is not of the expected type', async () => {
    const invalidStateObject = { ...mockStateLog, vehicleId: 'invalid' };
    (redisClient.get as jest.Mock).mockResolvedValueOnce(null);
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [invalidStateObject] });

    await expect(getVehicleStateLog(redisClient as RedisClientType, id, timestamp)).rejects.toThrow(
      new HttpError(500, 'Returned state object is of unexpected type'),
    );
  });
});
