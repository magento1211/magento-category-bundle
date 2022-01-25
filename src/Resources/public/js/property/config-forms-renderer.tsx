import ConfigForm from './config-form';

define(['pim/controller/front', 'pim/form-builder', 'react', 'react-dom'], (BaseController, FormBuilder, React, ReactDOM) => {
    return BaseController.extend({
        initialize: (options: object) => {
            this.options = options;
        },

        /**
         * @inheritDoc
         */
        renderForm: function () {
            return FormBuilder.build(this.options.config.form_builder_name).then(() => {
                const htmlElement = this.$el.get(0);
                ReactDOM.render(<ConfigForm />, htmlElement);
            });
        },
    });
});
