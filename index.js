/**
 * Hook dependencies
 */
var
    path = require('path');

module.exports = function (sails) {

    return {

        // Hook defaults
        defaults: {

            __configKey__: {

                paths: {

                    update: path.resolve(__dirname, 'lib/query/dql/update'),
                    create: path.resolve(__dirname, 'lib/query/dql/create'),
                    destroy: path.resolve(__dirname, 'lib/query/dql/destroy'),
                }
            }
        },

        // Hook initialization
        initialize: function (cb) {

            var
                self = this,
                config = sails.config[self.configKey];

            // If the orm hook is ready
            sails.on('hook:orm:loaded', function () {

                // Loop through all models
                for (var model in sails.models) {

                    // Replace each default update and validate method with a patched update method because we can not access the criteria in `beforeUpdate` (see: https://github.com/balderdashy/waterline/pull/1328)
                    sails.models[model].update = require(config.paths.update);
                    sails.models[model].create = require(config.paths.create);
                    sails.models[model].destroy = require(config.paths.destroy);
                }

                // Initialized
                return cb();
            });
        }
    };
}
