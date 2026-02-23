import { check } from 'express-validator/check';
import checkMealsId from 'src/helpers/checkMealsId';
import isCaterersMeal from 'src/helpers/isCaterersMeal';
import notEmpty from 'src/helpers/notEmpty';
import validateDate from 'src/helpers/validateDate';
import moment from 'src/utils/moment';

const yesterday = moment().subtract(1, 'days').format().toString();

export default {
  createMenu: [
    check('date')
      .trim()
      .optional({ checkFalsy: true })
      .custom((value) => notEmpty(value, 'Date field cannot be left blank'))
      .custom((value) => validateDate(value))
      .isAfter(yesterday)
      .withMessage('Date must be either today or in the future'),
    check('meals')
      .exists()
      .withMessage('Meals must be specified')
      .custom((value) => notEmpty(value, 'Meals field cannot be left blank'))
      .custom((value) => Array.isArray(value))
      .withMessage('Meals must be an array of Meal Ids')
      .custom((value) => checkMealsId(value))
      .custom(async (value, { req }) => {
        await isCaterersMeal(value, req.userId).then((err) => err);
      }),
  ],
  updateMenu: [
    check('menuId').isUUID(4).withMessage('Invalid ID'),
    check('date')
      .custom((value) => !value)
      .withMessage('Menu dates cannot be changed'),
    check('meals')
      .optional()
      .custom((value) =>
        notEmpty(value, 'If provided, meals field cannot be left blank'),
      )
      .custom((value) => Array.isArray(value))
      .withMessage('Meals must be an array of Meal Ids')
      .custom((value) => checkMealsId(value))
      .custom(async (value, { req }) => {
        await isCaterersMeal(value, req.userId).then((err) => err);
      }),
  ],
  getMenu: [
    check('date')
      .trim()
      .optional()
      .custom((value) => notEmpty(value, 'Date cannot be blank'))
      .custom((value) => validateDate(value)),
    check('limit')
      .trim()
      .optional()
      .custom((value) => notEmpty(value, 'Limit cannot be blank'))
      .isInt({ gt: 0 })
      .withMessage('Limit must be an integer greater than 0'),
    check('page')
      .trim()
      .optional()
      .custom((value) => notEmpty(value, 'Page cannot be blank'))
      .isInt({ gt: 0 })
      .withMessage('Page must be an integer greater than 0'),
  ],
};
