require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-combo/material-combo.tag');
<combobox>
    <riotmui-desc>
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Default ComboBox</div>
                    <div class="material-card-content">
                        <material-combo defaultText="Select one">
                            <option value="1">One</option>
                            <option value="2">Two</option>
                        </material-combo>
                    </div>
                    <riotmui-code style="margin-top: 26px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Items Like An Attribute</div>
                    <div class="material-card-content">
                        <material-combo items="[{title:'One'},{title:'Two'}]"></material-combo>
                    </div>
                    <riotmui-code style="margin-top: 86px" code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                Material ComboBox is component which can replace standard select component. Also it provides
                searching by items. It save all possible methods and behaviors of its sub components -
                material-input and material-dropdown-list.
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
`<material-combo  defaultText="Select one">
      <option value="1">One</option>
      <option value="2">Two</option>
  </material-combo>`;
this.example2 =
`<material-combo items="[{title:'One'},{title:'Two'}]"></material-combo>`;
// Children
this.children = [
    {
        title: ' <option value="value">Title</option>',
        type:'tag',
        default: '',
        desc: 'Adds item to material-combo. Works like a select tag.'
    }
];
// Options
this.options = [
    {
        title: 'defaultText',
        type:'string',
        default: 'Choose item',
        desc: 'Default text which no one element is chosen.'
    },
    {
        title: 'items',
        type:'string',
        default: '[]',
        desc: 'Sets items to dropdown-list. Look at dropdown-list docs for details.'
    }
];

</script>
</combobox>