require('./riotmui-desc.scss');
require('../../mixins/content.es6');
require('../../material-elements/material-card/material-card.tag');
require('../../material-elements/material-pane/material-pane.tag');
require('../../material-elements/material-button/material-button.tag');
<riotmui-desc role="toolbar">
    <div class="content">
        <div class="title">Examples</div>
        <content select=".riotmui-desc-examples"></content>
        <div class="title">Description</div>
        <content select=".riotmui-desc-description"></content>
        <yield></yield>
    </div>
    <script type="es6">
        this.mixin('content');
    </script>
</riotmui-desc>