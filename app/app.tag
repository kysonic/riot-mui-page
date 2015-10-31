require('./components/layouts/basic-layout.tag');
require('./components/layouts/home-layout.tag');
<app>
    <basic-layout if="{{isHome}}" />
    <home-layout if="{{!isHome}}" />
    <script type="es6">
        this.isHome = !!window.location.hash.replace('#', '');
        riot.route((collection, id, action)=> {
            this.update({isHome:!!collection})
        });
    </script>
</app>