require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../material-elements/material-button/material-button.tag');
require('../material-elements/material-navbar/material-navbar.tag');
<home>
    <h1>Welcome!</h1>
    <p>
        <a href="http://riotjs.com">Riot JS</a> is tiniest (by size) library allowing to create user interfaces. Riot is robust, fast and has enjoyable syntax.
        Unfortunately Riot doesn't have library of material UI components. This project aims to fix this problem.
    </p>
    <p>
        Any person who loves Riot and material UI willing to be a part of this project - <a href="https://github.com/kysonic/riot-mui">welcome</a>! We have great chance to create set of components
        which will provide basic features of <a href="https://www.google.com/design/spec/material-design/introduction.html">Material UI</a> for Riot.
    </p>
    <material-button link="#buttons" class="checkout">
        <div class="text">Check this out!</div>
    </material-button>
    <h1>How to get riot-mui?</h1>
    <p>Github:</p>
    <riotmui-code code="git clone https://github.com/kysonic/riot-mui"></riotmui-code>
    <p>Npm:</p>
    <riotmui-code code="npm install riot-mui"></riotmui-code>
    <p>Bower:</p>
    <riotmui-code code="bower install riot-mui"></riotmui-code>
    <!--<h1>Getting started</h1>
    <p>
        Currently there is exist two approach of working with riot-mui:
        <ul>
            <li>
                1. Using build of riot-mui.
            </li>
            <li>
                2. Using source files with webpack or browserify.
            </li>
        </ul>
        <p>
            If you don't wanna work with source code you can just include riot-mui.js and riot-mui.css on your project. For this you should clone repo from github next copy
            appropriate files to your project.
            <riotmui-code code="{{exp2}}"></riotmui-code>
        </p>
        <p>
            Opposite if you like to use some bundler like webpack or browserify + gulp (grunt) you can use source files in your project. For example if you use
            webpack for getting riot-mui components you can use bower but in this case don't forget add bower folder in
            <a href="https://webpack.github.io/docs/configuration.html#resolve-modulesdirectories">modulesDirectories</a> of webpack:
            <riotmui-code code="{{exp3}}"></riotmui-code>
        </p>
        <p>
            Learn more about approaches of using riot-mui <a href="https://github.com/kysonic/riot-mui/tree/master/examples">HERE</a>.
        </p>
    </p>
    <h1>A few words about styling</h1>
    <p>
        It's currently used classical approach of components styling.
        <ul>
             <li>All components styles located in <a href="http://sass-lang.com/">Sass</a> file which has same name like a component file.</li>
             <li>All components styles encapsulated using tag name like a name space of component. For example:<riotmui-code code="{{exp1}}"></riotmui-code></li>
             <li>
                 All components styles has special section - "Variables for quick styling" which will help you to style main features of components really quickly.
                 Also you have possibility to override it whatever you want.
             </li>
        </ul>
    </p>-->
    <script type="es6">
        this.exp1 = `material-checkbox { background-color: transparent; }`
        this.exp2 = `<link href="build/styles/riot-mui.min.css" rel="stylesheet">
        ....
 <script src="build/js/riot-mui-mixins-min.js"><\/script>
 <script src="build/js/riot-mui.js"><\/script>`;
        this.exp3 =
`modulesDirectories: [__dirname + '/node_modules',__dirname + '/bower_components/riot-mui/src']`;
    </script>
</home>
