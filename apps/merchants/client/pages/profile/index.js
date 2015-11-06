// ----- template hooks --------------------------------------------------------
/**
 *
 */
Template.pages_profile.onCreated(function() {
    Session.set('pageTitle', 'profile');
});

// ----- form hooks ------------------------------------------------------------
/**
 *
 */
AutoForm.addHooks(["pages_profile"], {

    /**
     * @param {Object} operation
     * @param {Object} result
     * @param {Object} template
     */
    onSuccess: function(operation, result, template) {
        Waslchiraa.Helpers.infoMessage('ok');
        Router.go("pages_campaigns");
    },

    /**
     *
     * @param {Object} formType
     * @param {Object} error
     */
    onError: function(formType, error) {
        if (error.reason) {
            Waslchiraa.Helpers.errorMessage(error.reason);
        }
        else if (error.error) {
            Waslchiraa.Helpers.errorMessage(error.error);
        }
    }
});
