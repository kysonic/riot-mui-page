require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-pane/material-pane.tag');
require('../material-elements/material-button/material-button.tag');
<pane>
    <riotmui-desc>
        <div class="riotmui-desc-examples row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Default</div>
                    <div class="material-card-content">
                        <material-pane>
                            <div class="material-pane-left-bar">
                                <material-button rounded="true">
                                    <i class="material-icons">arrow_back</i>
                                </material-button>
                            </div>
                            <div class="material-pane-title">TITLE</div>
                            <div class="material-pane-right-bar">
                                <material-button rounded="true">
                                    <i class="material-icons">more_vert</i>
                                </material-button>
                            </div>
                            <div class="material-pane-content">
                                CONTENT
                            </div>
                        </material-pane>
                    </div>
                    <riotmui-code style="margin-top: 0" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                Material pane it is more complicated element than material navbar. It includes special section to configure child elements properly.
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
`<material-pane>
    <div class="material-pane-left-bar">
        <material-button rounded="true">
            <i class="material-icons">arrow_back</i>
        </material-button>
    </div>
    <div class="material-pane-title">TITLE</div>
    <div class="material-pane-right-bar">
        <material-button rounded="true">
            <i class="material-icons">more_vert</i>
        </material-button>
    </div>
    <div class="material-pane-content">
        CONTENT
    </div>
  </material-pane>`;
this.children = [
    {
        title: '<div class="material-pane-left-bar">...</div>',
        type:'tag',
        default: '',
        desc: 'Adds elements to the left part of material pane.'
    },
    {
        title: '<div class="material-pane-right-bar">...</div>',
        type:'tag',
        default: '',
        desc: 'Adds elements to the right part of material pane.'
    },
    {
        title: '<div class="material-pane-title">Title</div>',
        type:'tag',
        default: '',
        desc: 'Sets title of material pane.'
    },
    {
        title: '<div class="material-pane-content">...</div>',
        type:'tag',
        default: '',
        desc: 'Can adds any elements into content section of material pane.'
    }
];
// Options
this.options = [{
        title: 'material-navbar-color',
        type:'color',
        default: '#ccc',
        desc: 'Changes default color of sub navbar component.'
    },
    {
        title: 'material-navbar-height',
        type:'px',
        default: '60',
        desc: 'Changes default height of sub navbar component.'
    }
];
</script>
</pane>