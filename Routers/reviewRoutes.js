import express from "express";
import {createReview, getReviews} from '../Controllers/reviewController.js'

const reviewRouter = express.Router()

reviewRouter.post('/createreview',createReview);
reviewRouter.get('/getreviw',getReviews);

export default reviewRouter;