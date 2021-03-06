const proxyquire = require('proxyquire'),
    mongoose = require('mongoose'),
    dbSave = require('@finelets/hyper-rest/db/mongoDb/SaveObjectToDb');

describe('Application', function () {
    var func, stubs, err, reason, createReasonStub;
    beforeEach(function () {
        stubs = {};
        err = new Error('any error message');
        reason = {reason: 'any reason representing any error'};
        createReasonStub = sinon.stub();
        stubs['@finelets/hyper-rest/app'] = {createErrorReason: createReasonStub};
    });

    describe('System services', function () {
        describe('基于RabbitMQ的消息中心实现', function () {
            var messageCenter;
            beforeEach(function () {
                var logger = require('@finelets/hyper-rest/app/Logger');
                var mq = require('../server/system/MQ/RabbitMQImple');
                var config = {
                    name: 'AnSteel',
                    connectingStr: process.env.MQ,
                    consumers: {
                        foo: function (msg) {
                            logger.info("look, the message was dealed with: " + JSON.stringify(msg));
                        }
                    }
                };
                return mq.initMQ(config)
                    .then(function () {
                        messageCenter = mq.MQ(config);
                    });
            });

            it('发布草拟订单消息', function () {
                messageCenter.publish('foo', {msgData: 'any message data with the type of foo'});
                // 向消息中心发布消息后，由于无法确定消息将在何时得到处理，所以我们只有采用查看日志的方式
                // 确认消息确实获得了处理！！！
            });
        });

        describe('消息中心', function () {
            var messageCenter, mqMock;
            var orderData;
            beforeEach(function () {
                orderData = {orderData: 'draft order raw data'};
                mqMock = {
                    publish: sinon.spy()
                };
                messageCenter = require('../server/system/MQ/MessageCenter')(mqMock);
            });

            it('发布草拟订单消息', function () {
                messageCenter.draftSalesOrder(orderData);
                expect(mqMock.publish.calledWith('draftSalesOrder', orderData).calledOnce);
            })
        })
    });
});