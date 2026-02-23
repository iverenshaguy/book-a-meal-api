import moment from 'src/utils/moment';

const currentDay = moment().format('YYYY-MM-DD');
const inAppTimezone = (value) =>
  moment(value, 'YYYY-MM-DDTHH:mm:ss.SSS').format();

export default {
  up: (queryInterface) =>
    queryInterface.bulkInsert('Orders', [
      {
        orderId: 'fb097bde-5959-45ff-8e21-51184fa60c25',
        createdAt: inAppTimezone('2018-04-06T00:47:03.687'),
        updatedAt: inAppTimezone('2018-04-06T00:47:03.687'),
        userId: 'a09a5570-a3b2-4e21-94c3-5cf483dbd1ac',
        deliveryAddress: '4, Church Street, Yaba',
        deliveryPhoneNo: '+2348134567890',
        status: 'delivered',
      },
      {
        orderId: 'ce228787-f939-40a0-bfd3-6607ca8d2e53',
        createdAt: inAppTimezone('2018-05-01T00:47:03.687'),
        updatedAt: inAppTimezone('2018-05-01T00:47:03.687'),
        userId: 'e42c7ce0-958e-4368-adcb-e5d97dbbe5b7',
        deliveryAddress: '4, Church Street, Yaba',
        deliveryPhoneNo: '+2348134567890',
        status: 'delivered',
      },
      {
        orderId: '58228787-f939-40a0-bfd3-6607ca8d2e53',
        createdAt: inAppTimezone(`${currentDay}T00:47:03.687`),
        updatedAt: inAppTimezone(`${currentDay}T00:47:03.687`),
        userId: 'e42c7ce0-958e-4368-adcb-e5d97dbbe5b7',
        deliveryAddress: '4, Church Street, Yaba',
        deliveryPhoneNo: '+2348134567890',
        status: 'delivered',
      },
      {
        orderId: 'be228787-f939-40a0-bfd3-3607ca8d2e53',
        createdAt: inAppTimezone(`${currentDay}T00:47:03.687`),
        updatedAt: inAppTimezone(`${currentDay}T00:47:03.687`),
        userId: 'e42c7ce0-958e-4368-adcb-e5d97dbbe5b7',
        deliveryAddress: '4, Church Street, Yaba',
        deliveryPhoneNo: '+2348134567890',
        status: 'pending',
      },
      {
        orderId: '97bde787-f939-40a0-bfd3-3607ca8d2e53',
        createdAt: inAppTimezone(`${currentDay}T11:47:03.687`),
        updatedAt: inAppTimezone(`${currentDay}T11:47:03.687`),
        userId: 'a09a5570-a3b2-4e21-94c3-5cf483dbd1ac',
        deliveryAddress: '4, Church Street, Yaba',
        deliveryPhoneNo: '+2348134567890',
        status: 'pending',
      },
      {
        orderId: 'f939e787-f939-40a0-bfd3-3607ca8d2e53',
        createdAt: inAppTimezone(`${currentDay}T14:47:03.687`),
        updatedAt: inAppTimezone(`${currentDay}T14:47:03.687`),
        userId: 'a09a5570-a3b2-4e21-94c3-5cf483dbd1ac',
        deliveryAddress: '4, Church Street, Yaba',
        deliveryPhoneNo: '+2348134567890',
        status: 'pending',
      },
    ]),

  down: (queryInterface) => queryInterface.bulkDelete('Orders', null, {}),
};
