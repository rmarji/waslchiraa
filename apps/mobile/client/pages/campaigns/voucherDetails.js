Template.campaignDetails.helpers({

    /**
     * return data for current voucher
     * @reactive
     */
    item: function () {
        return HiMate.Helpers.customers.campaigns.item.call(this);
    },
    voucherCode: function () {
        return HiMate.Helpers.customers.campaigns.voucherCode.call(this);
    },
    voucher:function(){
        return HiMate.Helpers.customers.campaigns.voucher.call(this);
    }
});

Template.campaignDetails.events({

    /**
     * @param {Object} event
     * @param {Object} template
     */
    'click .js-reserve-voucher': function (event, template) {
        var $modalVoucherConfirmed = $('.modal.voucher-confirmed')
            .modal({
                closable: true,
                onDeny: function () {
                    Session.set("isApproved", "");
                },
                onApprove: function () {
                    Session.set("isApproved", "");
                    Router.go('pages_vouchers');
                }
            });
        var $modalConfirmation = $('.modal.confirmation')
            .modal({
                closable: true,
                onDeny: function () {
                    $modalConfirmation.modal('hide');
                },
                onApprove: function () {

                    var campaign = HiMate.Collections.Campaigns.findOne(Router.current().params._id);
                    if (campaign) {
                        var vouchercode = Meteor.call('vouchers_reserve', campaign._id.toString(), function (err, data) {
                            if (err) {
                                HiMate.Helpers.errorMessage(err.error);
                            } else {
                                Session.set("voucherCode", data);
                                Session.set("isApproved", "1");
                            }
                        });
                    }
                },
                onHidden: function () {
                    if(Session.get("isApproved")){
                        $modalVoucherConfirmed.modal('show');
                    }
                }
            });
        var $modalLogin = $('.modal.login')
            .modal({
                closable: true,
                onDeny: function () {
                    $modalLogin.modal('hide');
                    $('.ui.sidebar').sidebar('toggle');
                    $('.at-signup').trigger('click');
                },
                onApprove: function () {
                    $modalLogin.modal('hide');
                    $('.ui.sidebar').sidebar('toggle');
                    $('.at-signin').trigger('click');
                }
            });
        if (Meteor.user()) {
            $modalConfirmation.modal('show');
        } else {

            $modalLogin.modal('show');
        }
    },

    'click .js-remove-voucher': function (event, template) {
        console.log('js-remove-voucher');
        Meteor.call('vouchers_remove', Router.current().params.voucherId, function (err, data) {
            if (err) {
                HiMate.Helpers.errorMessage(err.error);
            } else {
                Router.go('campaigns');
            }
        });
    },


    /**
     * @param {Object} event
     * @param {Object} template
     */
    'click .js-open-map': function (event, template) {
        event.preventDefault();
        var campaign = HiMate.Collections.Campaigns.findOne(Router.current().params._id);
        if (campaign) {
            var address = campaign.country + ', ' + campaign.city + ', ' + campaign.street + ' ' + campaign.number + ', ' + campaign.zipcode;
            HTTP.call(
                'GET',
                'http://maps.google.com/maps/api/geocode/json?address=' + encodeURIComponent(address),
                {},
                function (error, result) {
                    if (error) {
                        return;
                    }
                    if (result.data &&
                        result.data.results[0] &&
                        result.data.results[0].geometry &&
                        result.data.results[0].geometry.location &&
                        result.data.results[0].geometry.location.lat &&
                        result.data.results[0].geometry.location.lng) {

                        var lat = result.data.results[0].geometry.location.lat;
                        var lng = result.data.results[0].geometry.location.lng;
                        window.open("http://maps.google.com/?q=" + lat + ',' + lng, '_system');
                    }
                }
            );
        }
    }
});


Template.campaignDetailsModalConfirm.events({
    "click .js-approve":function () {
        var campaign = HiMate.Collections.Campaigns.findOne(Router.current().params._id);
        if (campaign) {
            var vouchercode = Meteor.call('vouchers_reserve', campaign._id.toString(), function (err, data) {
                if (err) {
                    HiMate.Helpers.errorMessage(err.error);
                    IonPopup.alert({title: 'Error', subTitle: '', template: 'err.error'});
                } else {
                    // Session.set("voucherCode", data);
                    // Session.set("isApproved", "1");
                    IonModal.close();
                    Router.go('vouchers');
                }
            });
        }
    }
});

Template.campaignDetailsModalLogin.events({
    "click .js-approve":function () {
        var campaign = HiMate.Collections.Campaigns.findOne(Router.current().params._id);
        if (campaign) {
            var vouchercode = Meteor.call('vouchers_reserve', campaign._id.toString(), function (err, data) {
                if (err) {
                    HiMate.Helpers.errorMessage(err.error);
                    IonPopup.alert({title: 'Error', subTitle: '', template: 'err.error'});
                } else {
                    // Session.set("voucherCode", data);
                    // Session.set("isApproved", "1");
                    IonModal.close();
                    Router.go('vouchers');
                }
            });
        }
    }
});