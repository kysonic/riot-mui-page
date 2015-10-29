require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-checkbox/material-checkbox.tag');
<checkbox>
    <riotmui-desc>
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Default Checkbox</div>
                    <div class="material-card-content">
                       <material-checkbox name="checker">Label</material-checkbox>
                    </div>
                    <riotmui-code style="margin-top: 62px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Disabled Checkbox</div>
                    <div class="material-card-content">
                        <material-checkbox disabled="true">Disabled</material-checkbox>
                    </div>
                    <riotmui-code style="margin-top: 62px" code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                This is component can replace usual checkbox.
                To add label you can write some text into it.
            </p>
            <div class="description-title">Children</div>
            <riotmui-option data="{{this.parent.children}}"></riotmui-option>
            <div class="description-title">Options</div>
            <riotmui-option data="{{this.parent.options}}"></riotmui-option>
            <!--<div class="description-title">Quick Styling</div>
            <riotmui-option data="{{this.parent.styling}}"></riotmui-option>-->
        </div>
    </riotmui-desc>
<script type="es6">
// Examples
this.example1 =
`<material-checkbox name="checker">
      Label
  </material-checkbox>`;

this.example2 =
`<material-checkbox disabled="true">
      Disabled
  </material-checkbox>`;

this.children = [
    {
        title: 'Label',
        type:'textContent',
        default: '',
        desc: 'Adds label to checkbox.'
    }
];
// Options
this.options = [{
        title: 'disabled',
        type:'string ["true"|"false"]',
        default: 'false',
        desc: 'If set "true" will disable checkbox.'
    }
];
// Styling
this.styling = [
    {
        title: '$material-chekbox-border-color',
        type:'color',
        default: '#25313b',
        desc: 'Sets default border color of checkbox.'
    },
    {
        title: '$material-chekbox-disabled-border-color',
        type:'color',
        default: '#ccc',
        desc: 'Sets disabled border color of checkbox.'
    },
    {
        title: '$material-chekbox-checkmark-color',
        type:'color',
        default: '#fff',
        desc: 'Sets default color of check mark.'
    },
    {
        title: '$material-chekbox-checkmark-background-color',
        type:'color',
        default: '#25313b',
        desc: 'Sets default background color of checked checkbox.'
    },
    {
        title: '$material-chekbox-label-color',
        type:'color',
        default: '#25313b',
        desc: 'Sets default text color of label.'
    },
    {
        title: '$material-chekbox-disabled-label-color',
        type:'color',
        default: '#ccc',
        desc: 'Sets default text color of disabled label.'
    }
];
</script>
</checkbox>