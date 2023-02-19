// Single routing
import express from 'express';
import { getVehicleInfoWithIdAndTimestamp } from '../controllers/vehiclesController';

const router = express.Router();

router.get('/vehicles/:id', getVehicleInfoWithIdAndTimestamp);

export default router;
