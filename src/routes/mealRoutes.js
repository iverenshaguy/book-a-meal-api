import express from 'express';
import MealController from 'src/controllers/MealController';
import asyncWrapper from 'src/helpers/asyncWrapper';
import mealValidation from 'src/validations/mealValidation';
import Authorization from 'src/middlewares/Authorization';
import ValidationHandler from 'src/middlewares/ValidationHandler';
import TrimValues from 'src/middlewares/TrimValues';

const mealRoutes = express.Router();
const authorization = new Authorization('caterer');
const validation = [ValidationHandler.validate, TrimValues.trim, ValidationHandler.isEmptyReq];

mealRoutes.use(Authorization.authorize, authorization.authorizeRole);

mealRoutes.get('/', mealValidation.getMeals, ValidationHandler.validate, asyncWrapper(MealController.getMeals));
mealRoutes.post('/', mealValidation.createMeal, validation, asyncWrapper(MealController.createMeal));
mealRoutes.put('/:mealId', mealValidation.updateMeal, validation, asyncWrapper(MealController.updateMeal));
mealRoutes.delete('/:mealId', mealValidation.deleteMeal, ValidationHandler.validate, asyncWrapper(MealController.deleteMeal));

export default mealRoutes;
