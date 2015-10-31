require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../material-elements/material-button/material-button.tag');
require('../material-elements/material-navbar/material-navbar.tag');
<home>
    <div class="center p1">
        <h1>Welcome!</h1>
        <p>
            <a href="http://riotjs.com">Riot JS</a> is tiniest (by size) library allowing to create user interfaces. <br> Riot is robust, fast and has enjoyable syntax. <br>
            Unfortunately Riot doesn't have library of material UI components. <br> This project aims to fix this problem.
        </p>
        <p>
            Any person who loves Riot and material UI willing to be a part of this project - <a href="https://github.com/kysonic/riot-mui">welcome</a>! <br> We have great chance to create set of components
            which will provide basic features of <a href="https://www.google.com/design/spec/material-design/introduction.html">Material UI</a> for Riot.
        </p>
    </div>
    <div class="line">
        <material-button link="#buttons" class="checkout">
            <div class="text">Check this out!</div>
        </material-button>
    </div>
    <div class="center">
        <h1>How to get riot-mui?</h1>
        <p>Github:</p>
        <riotmui-code code="git clone https://github.com/kysonic/riot-mui"></riotmui-code>
        <p>Npm:</p>
        <riotmui-code code="npm install riot-mui"></riotmui-code>
        <p>Bower:</p>
        <riotmui-code code="bower install riot-mui"></riotmui-code>
    </div>
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
