var riot = require('riot');
// Provide some settings
riot.settings.brackets = '{{ }}';
// Get application tag and mount it! Yeah baby!
require('./app.tag');
riot.mount('app');
// Router
require('./router.js');
// SASS
require('./stylesheets/normalize.scss');
require('./stylesheets/flex-grid.scss');
require('./stylesheets/default-hljs.scss');
