require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-navbar/material-navbar.tag');
<navbar>
    <riotmui-desc>
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Default Navbar</div>
                    <div class="material-card-content">
                        <material-navbar>
                            <div class="logo"><a href="#">Logo</a></div>
                        </material-navbar>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Custom styling</div>
                    <div class="material-card-content">
                        <material-navbar style="background: #ccc;">
                            <div class="logo"><a href="#">Logo</a></div>
                        </material-navbar>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                Material Navbar can be used like a header or some another ui element of your web page.
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
`<material-navbar>
        <div class="logo"><a href="#">Logo</a></div>
  </material-navbar>`;
this.example2 =
`<material-navbar style="background: #ccc;" >
      <div class="logo"><a href="#">Logo</a></div>
  </material-navbar>`;
this.children = [
    {
        title: '<div class="logo">Logo</div>',
        type:'tag',
        default: '',
        desc: 'Adds logotype element to material navbar.'
    }
];
// Options
this.options = [{
        title: 'fixed',
        type:'string ["true"|"false"]',
        default: 'false',
        desc: 'If set "true" will make navbar stuck to current position.'
    }
];
</script>
</navbar>