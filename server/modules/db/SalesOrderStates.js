const dbModel = require('../sales/db/DbModels').SalesOrder,
    logger = require('@finelets/hyper-rest/app/Logger');

module.exports = {
    create: function (orderId, state) {
        return dbModel.findById(orderId)
            .then(function (order) {
                if (!order) {
                    logger.error("The order[id='" + orderId + "'] does not exist!");
                    return Promise.reject(new Error('The order does not exist!'));
                }
                order.status = state;
                return order.save();
            })
            .then(function (order) {
                logger.debug('The order[' + orderId + '] state is ' + order.status);
                return order.status;
            })
    },
    get: function (orderId) {
        return dbModel.findById(orderId)
            .then(function (order) {
                return order ? order.status : null;
            })
    },
    update: function (orderId, fromState, toState) {
        return dbModel.findById(orderId)
            .then(function (order) {
                if (!order) {
                    logger.error("The order[id='" + orderId + "'] does not exist!");
                    return Promise.reject(new Error('The order does not exist!'));
                }
                if(order.status !== fromState) return order.status;
                order.status = toState;
                return order.save()
                    .then(function (order) {
                        return order.status;
                    })
            })
    },
    listOnState: function (state, fields) {
        var results = [];
        var flds = fields ? fields : [];
        return dbModel.find({status: state})
            .select(flds)
            .exec()
            .then(function (data) {
                data.forEach(function (item) {
                    results.push(item.toJSON());
                });
                return results;
            })
    }
};