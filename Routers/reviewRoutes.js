import express from "express";
import {createReview} from '../Controllers/reviewController.js'

const reviewRouter = express.Router()

reviewRouter.post('/createreview',createReview);

export default reviewRouter;