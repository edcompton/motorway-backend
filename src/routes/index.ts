// Single routing
import express from 'express';
import { getVehicleInfoWithIdAndTimestamp } from '../controllers/vehiclesController';
import { validateParams } from '../middleware/validateParams';

const router = express.Router();

router.get('/vehicles/:id', validateParams, getVehicleInfoWithIdAndTimestamp);

export default router;
