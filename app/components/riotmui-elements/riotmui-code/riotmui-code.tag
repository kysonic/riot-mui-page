require('./riotmui-code.scss');
var hljs = require('highlight.js');
<riotmui-code>
    <pre>
        <code>
            {{opts.code}}
        </code>
    </pre>
    <script type="es6">
        this.on('mount', ()=> {
            hljs.highlightBlock(this.root);
        });
    </script>
</riotmui-code>