require('./riotmui-code.scss');
require('../../../stylesheets/rainbow-github.scss');
require('../../../javascript/vendor/rainbow.js');
require('../../../javascript/vendor/rainbow-html.js');
<riotmui-code>
    <pre>
        <code data-language="html">
            {{opts.code}}
        </code>
    </pre>
    <script type="es6">
        Rainbow.color();
    </script>
</riotmui-code>