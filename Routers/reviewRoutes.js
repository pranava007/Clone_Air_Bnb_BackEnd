import express from "express";
import {createReview, getReview} from '../Controllers/reviewController.js'

const reviewRouter = express.Router()

reviewRouter.post('/createreview',createReview);
reviewRouter.get('/getreviw',getReview);

export default reviewRouter;