require('./stylesheets/basic.scss');
require('./components/material-elements/material-navbar/material-navbar.tag');
require('./components/material-elements/material-pane/material-pane.tag');
require('./components/material-elements/material-button/material-button.tag');
require('./components/riotmui-elements/riotmui-list/riotmui-list.tag');
require('./components/svg/github.tag');
require('riot-router');
<basic-layout>
    <material-navbar>
        <div class="row">
            <div class="col col-lg-3 col-md-6 col-sm-11 col-xs-11">
                <div class="logo">
                    <i class="material-icons menu" onclick="{{parent.toggleMenu}}">menu</i>
                    <a href="#" title="Material UI">{{parent.logoText}}</a>
                    <a href="https://muut.com/riotjs/" riot>
                        <div class="for-riot"></div>
                    </a>
                </div>
            </div>
            <div class="col col-lg-9 col-md-6 col-sm-1 col-xs-1 gitcol">
                <a class="github" href="https://github.com/kysonic/riot-mui">
                    <github></github>
                </a>
            </div>
        </div>
    </material-navbar>
    <div class="row content">
        <div name="menu" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col left">
            <riotmui-list name="riotmuiList" links="{{this.links}}"></riotmui-list>
        </div>
        <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 col right">
            <route></route>
        </div>
    </div>
    <div class="overlay" onclick="{{close}}" name="overlay" if="{{opened}}"></div>
    <script type="es6">
        this.opened = false;
        this.logoText = 'material UI';
        this.links = [
            {link: '#buttons', title: 'Button'},
            {link: '#checkbox', title: 'CheckBox'},
            {link: '#combobox', title: 'ComboBox'},
            {link: '#dropdown', title: 'DropDown'},
            {link: '#dropdown-list', title: 'DropDownList'},
            {link: '#m-input', title: 'Input'},
            {link: '#navbar', title: 'Navbar'},
            {link: '#pane', title: 'Pane'},
            {link: '#popup', title: 'Popup'},
            {link: '#snackbar', title: 'Snackbar'},
            {link: '#tabs', title: 'Tabs'},
            {link: '#m-textarea', title: 'Textarea'}
        ];
        this.route = window.location.hash.replace('#', '') || 'Home';
        this.tags.riotmuiList.update({selected: window.location.hash});
        riot.route((collection, id, action)=> {
            this.update({route: collection || 'Home'});
            this.tags.riotmuiList.update({selected: '#' + collection});
        });
        //
        this.tags.riotmuiList.on('onClick', ()=> {
            this.close();
        });
        this.mq = window.matchMedia('only screen and (min-width : 320px) and (max-width : 480px)');
        this.mq.addListener(()=> {
            this.checkOutMatches();
        });
        this.checkOutMatches = ()=> {
            if (this.mq.matches) {
                this.update({logoText: 'mUI'})
            } else {
                this.update({logoText: 'material UI'})
            }
        }
        this.checkOutMatches();
        /**
         * Go Back
         */
        this.back = ()=> {
            window.location.hash = "/#";
        }
        this.toggleMenu = ()=> {
            !this.opened ? this.open() : this.close();
        }
        this.open = ()=> {
            this.update({opened: true});
            this.menu.style.left = '0px';
        }
        this.close = ()=> {
            this.update({opened: false})
            this.menu.style.left = '-100%';
        }
    </script>
</basic-layout>