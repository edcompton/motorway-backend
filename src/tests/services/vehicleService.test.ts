import { pool } from '../../db';
import { getVehicle } from '../../services/vehicleService';
import { Vehicle } from '../../interfaces/IPgQueries';
import redis, { RedisClientType } from 'redis';
import { HttpError } from '../../middleware/exceptions';

describe('getVehicle', () => {
  const redisClient = redis.createClient();
  const id = '1';
  const mockVehicle: Vehicle = {
    id: 1,
    make: 'Toyota',
    model: 'Corolla',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return vehicle from cache when available', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValueOnce(JSON.stringify(mockVehicle));
    jest.spyOn(pool, 'query');

    const result = await getVehicle(redisClient as RedisClientType, id);

    expect(result).toEqual(mockVehicle);
    expect(redisClient.get).toHaveBeenCalledWith(`vehicle:${id}`);
    expect(redisClient.get).toHaveBeenCalledTimes(1);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('should return vehicle from database when not available in cache', async () => {
    redisClient.del(`vehicle:${id}`);
    jest.spyOn(redisClient, 'set');
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockVehicle] });

    const result = await getVehicle(redisClient as RedisClientType, id);

    expect(result).toEqual(mockVehicle);
    expect(redisClient.get).toHaveBeenCalledWith(`vehicle:${id}`);
    expect(redisClient.set).toHaveBeenCalledWith(`vehicle:${id}`, JSON.stringify(mockVehicle));
    expect(pool.query as jest.Mock).toHaveBeenCalledWith(expect.stringContaining('"vehicles"'), expect.arrayContaining([id]));
  });

  it('should throw an error when no vehicle is found', async () => {
    redisClient.del(`vehicle:${id}`);
    jest.spyOn(redisClient, 'set');
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    await expect(getVehicle(redisClient as RedisClientType, id)).rejects.toThrow(new HttpError(404, `No vehicle found for vehicle ID ${id}`));
  });
});
