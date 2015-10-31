require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-button/material-button.tag');
<buttons>
    <riotmui-desc>
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Default Button</div>
                    <div class="material-card-content">
                        <material-button class="ui">
                            <div class="text">BUTTON</div>
                        </material-button>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
                <material-card>
                    <div class="material-card-title">Rounded Button</div>
                    <div class="material-card-content">
                        <material-button class="ui" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137">
                            <i class="material-icons">add</i>
                        </material-button>
                    </div>
                    <riotmui-code style="margin-top: 29px"  code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Custom Button</div>
                    <div class="material-card-content">
                        <material-button class="ui" waves-color="#a355aa" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px">
                            <i class="material-icons" style="font-size: 18px">favorite</i>
                            <div class="text">CREATE</div>
                        </material-button>
                    </div>
                    <riotmui-code code="{{this.parent.parent.example3}}"></riotmui-code>
                </material-card>
                <material-card>
                    <div class="material-card-title">Disabled button</div>
                    <div class="material-card-content">
                        <material-button class="ui" disabled="true">
                            <div class="text">Disabled</div>
                        </material-button>
                    </div>
                    <riotmui-code style="margin-top: 46px"  code="{{this.parent.parent.example4}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                This component generate MUI button. It has two sets of options - button options and
                waves options (material-waves it is sub component providing material ripple). All of waves options
                have "waves" prefix, for example: waves-color.
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
`<material-button class="ui">
      <div class="text">BUTTON</div>
  </material-button>`;
this.example2 =
`<material-button class="ui" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137">
      <i class="material-icons">add</i>
  </material-button>`;
this.example3 =
`<material-button class="ui" waves-color="#000" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px">
      <div class="text">ICON</div>
      <i class="material-icons">create</i>
  </material-button>`;
this.example4 =
`<material-button class="ui" disabled="true">
      <div class="text">Disabled</div>
  </material-button>`;
this.children = [
    {
        title: '<div class="text">TEXT</div>',
        type:'tag',
        default: '',
        desc: 'Adds text to the button.'
    },
    {
        title: '<div class="icon"><svg>...</svg></div>',
        type:'tag',
        default: '',
        desc: 'Adds icon to the button.'
    },
    {
        title: ' <i class="material-icons"> create </i>',
        type:'tag',
        default: '',
        desc: 'If you use google material icon set you can add it into material-button.'
    }
];
// Options
this.options = [{
        title: 'rounded',
        type:'String ["true"|"false"]',
        default: 'false',
        desc: 'If set "true" will make button rounded.'
    },
    {
        title: 'shady',
        type:'String ["true"|"false"]',
        default: 'false',
        desc: 'If set "true" will add to the button box-shadow property.'
    },
    {
        title: 'disabled',
        type:'String ["true"|"false"]',
        default: 'false',
        desc: 'If set "true" user won\'t be able to click on it. Also it will change button color.'
    },
    {
        title: 'link',
        type:'String',
        default: '',
        desc: 'If will be set link attribute then material button will behave it like a "a" tag.'
    },
    {
        title: 'waves-center',
        type:'String ["true"|"false"]',
        default: 'false',
        desc: 'If set "true" waves will start animation from center of button.'
    },
    {
        title: 'waves-opacity',
        type:'Number [0<x<1]',
        default: '0.4',
        desc: 'Using this option it\'s possible to setup wave opacity.'
    },
    {
        title: 'waves-duration',
        type:'Number [ms]',
        default: '400',
        desc: 'Speed of waves animation.'
    },
    {
        title: 'waves-color',
        type:'color [RGB]',
        default: '#fff',
        desc: 'Allows to setup waves\'s color.'
    }
];
// Styling
this.styling = [
    {
        title: '$material-button-height',
        type:'px',
        default: '40',
        desc: 'Sets default height of button.'
    },
    {
        title: '$material-button-background',
        type:'color',
        default: '#61bdcc',
        desc: 'Sets default button background.'
    },
    {
        title: '$material-button-disabled-background',
        type:'color',
        default: '#ccc',
        desc: 'Sets disabled button background.'
    },
    {
        title: '$material-button-color',
        type:'color',
        default: '#fff',
        desc: 'Sets default button text color.'
    },
    {
        title: '$material-button-padding',
        type:'rem',
        default: '0 2rem',
        desc: 'Sets default button left&right offset.'
    },
    {
        title: '$material-button-font-size',
        type:'px',
        default: '18',
        desc: 'Sets default button text font size.'
    },
    {
        title: '$material-button-icon-size',
        type:'px',
        default: '20',
        desc: 'Sets default button icon font size. (For google material icon set)'
    }
];
</script>
</buttons>