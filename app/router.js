var riot = require('riot');
require('riot-router');
// Page tags
require('./components/pages/home.tag');
require('./components/pages/404.tag');
require('./components/pages/buttons.tag');
require('./components/pages/checkbox.tag');
require('./components/pages/combobox.tag');
require('./components/pages/input.tag');
require('./components/pages/dropdown.tag');
require('./components/pages/dropdown-list.tag');
require('./components/pages/navbar.tag');
require('./components/pages/pane.tag');
require('./components/pages/popup.tag');
require('./components/pages/snackbar.tag');
require('./components/pages/tabs.tag');
require('./components/pages/textarea.tag');

var Route = riot.router.Route,
    DefaultRoute = riot.router.DefaultRoute,
    NotFoundRoute = riot.router.NotFoundRoute,
    RedirectRoute = riot.router.RedirectRoute;

riot.router.routes([
    new DefaultRoute({tag: 'home'}),
    new Route({tag: 'buttons'}),
    new Route({tag: 'checkbox'}),
    new Route({tag: 'combobox'}),
    new Route({tag: 'm-input'}),
    new Route({tag: 'dropdown'}),
    new Route({tag: 'dropdown-list'}),
    new Route({tag: 'navbar'}),
    new Route({tag: 'pane'}),
    new Route({tag: 'popup'}),
    new Route({tag: 'snackbar'}),
    new Route({tag: 'tabs'}),
    new Route({tag: 'm-textarea'}),
    new NotFoundRoute({tag:'not-found'})
]);
riot.router.start();