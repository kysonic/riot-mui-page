require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

// require('../material-elements/material-checkbox/material-checkbox.tag');
<default>
    <riotmui-desc>
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Default</div>
                    <div class="material-card-content">

                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">

            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                Description ...
            </p>
            <div class="description-title" if="{{this.parent.children}}">Children</div>
            <riotmui-option data="{{this.parent.children}}"></riotmui-option>
            <div class="description-title" if="{{this.parent.options}}">Options</div>
            <riotmui-option data="{{this.parent.options}}"></riotmui-option>
            <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div>
            <riotmui-option data="{{this.parent.methods}}"></riotmui-option>
        </div>
    </riotmui-desc>
<script type="es6">
// Examples
this.example1 =
`<material-button class="ui">
      <div class="text">BUTTON</div>
  </material-button>`;
this.children = [
    {
        title: '<div class="text">TEXT</div>',
        type:'tag',
        default: '',
        desc: 'Adds text to the button.'
    }
];
// Options
this.options = [{
        title: 'rounded',
        type:'string ["true"|"false"]',
        default: 'false',
        desc: 'If set "true" will make button rounded.'
    }
];
// Mehods
this.methods = [
    {
        title: 'valueChanged',
        type:'listener',
        default: '',
        desc: 'Will be invoked when will happen changing of input value. For example: this.on("valueChanged",function(){});'
    }
];
</script>
</default>