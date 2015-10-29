require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-textarea/material-textarea.tag');
<m-textarea>
    <riotmui-desc>
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Default Textarea</div>
                    <div class="material-card-content">
                        <material-textarea label="Textarea"></material-textarea>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Max rows count is 2</div>
                    <div class="material-card-content">
                        <material-textarea  max-rows="2"  label="Max rows count is 2"></material-textarea>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                Material textarea is a wrapper for standard textarea according base concepts of material ui.
            </p>
            <div class="description-title">Options</div>
            <riotmui-option data="{{this.parent.options}}"></riotmui-option>
            <div class="description-title">Methods,Listeners and Properties</div>
            <riotmui-option data="{{this.parent.methods}}"></riotmui-option>
        </div>
    </riotmui-desc>
<script type="es6">
// Examples
this.example1 =
`<material-textarea label="Textarea" ></material-textarea>`;
this.example2 =
`<material-textarea max-rows="2" label="Max rows count is 2"></material-textarea>`;
// Options
this.options = [
    {
        title: 'label',
        type:'string',
        default: '',
        desc: 'Adds floating label to material-input.'
    },
    {
        title: 'max-rows',
        type:'number',
        default: '-',
        desc: 'Sets maximum possible count of rows.If it wasn\'t set - we have no limit on rows.'
    },
    {
        title: 'valid',
        type:'Regexp | Function',
        default: '',
        desc: 'It can be both function and regular expression. Regular expression must be a string. For example valid="/^\\d+$/". Also pay attention ' +
        'on escaping special symbols of regular expression. In this case d should be written like \\d. Also valid option can be a function. You should link' +
        ' it with any function inside your component. For example: valid="{{checkout}}". this.checkout - must return true or false. Also if your component was validated it' +
        ' will contain error property regarding finished validation - true or false. (this.error)'
    },
    {
        title: 'disabled',
        type:'string ["true"|"false"]',
        default: 'false',
        desc: 'If set "true" will disable material input.'
    }
];
// Mehods
this.methods = [
    {
        title: 'valueChanged',
        type:'listener',
        default: '',
        desc: 'Will be invoked when will happen changing of input value. For example: this.on("valueChanged",function(){});'
    },
    {
        title: 'focusChanged',
        type:'listener',
        default: '',
        desc: 'Will be invoked after input focus changing. For example: this.on("focusChanged",function(){});'
    },
    {
        title: 'error',
        type:'property',
        default: '',
        desc: 'Contains current state of validation. If current value is correct will contain true in another case - false. For instance: this.error'
    }
];
</script>
</m-textarea>