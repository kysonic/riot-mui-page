require('./home-layout.scss');
require('../material-elements/material-navbar/material-navbar.tag');
require('../material-elements/material-pane/material-pane.tag');
require('../material-elements/material-button/material-button.tag');
require('../riotmui-elements/riotmui-list/riotmui-list.tag');
require('../svg/github.tag');
require('../svg/logo.tag');
require('riot-router');
<home-layout>
    <material-navbar>
        <div class="row icon-row">
            <div class="col col-lg-12 col-md-12 col-sm-12 col-xs-12 gitcol">
                <a class="github" href="https://github.com/kysonic/riot-mui">
                    <github></github>
                </a>
            </div>
        </div>
        <div class="row">
            <div class="col col-lg-12 col-md-12 col-sm-12 col-xs-12 logocol">
                <a href="#buttons" class="logo">
                    <logo></logo>
                </a>
            </div>
        </div>
    </material-navbar>
    <div class="row content">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col right">
            <div class="wrapper">
                <route></route>
            </div>
        </div>
    </div>
    <script type="es6">

    </script>
</home-layout>