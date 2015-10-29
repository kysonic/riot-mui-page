require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-button/material-button.tag');
require('../material-elements/material-dropdown/material-dropdown.tag');
<dropdown>
    <riotmui-desc name="desc">
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card name="cardOne">
                    <div class="material-card-title">Default Dropdown</div>
                    <div class="material-card-content">
                        <div class="button-container">
                            <material-button name="buttonOne" onclick="{{parent.parent.openDropDownOne}}">
                                <div class="text">Toggle Dropdown</div>
                            </material-button>
                            <material-dropdown name="dropDownOne">
                                <p>DropDown content</p>
                            </material-dropdown>
                        </div>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card name="cardTwo">
                    <div class="material-card-title">Changed animation</div>
                    <div class="material-card-content">
                        <div class="button-container">
                            <material-button name="buttonTwo" onclick="{{parent.parent.openDropDownTwo}}">
                                <div class="text">Toggle Dropdown</div>
                            </material-button>
                            <material-dropdown animation="bottom" name="dropDownOne">
                                <p>DropDown content</p>
                            </material-dropdown>
                        </div>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                This component provides functionality of dropown. It has two common methods - open() and close().
            </p>
            <div class="description-title">Children</div>
            <riotmui-option data="{{this.parent.children}}"></riotmui-option>
            <div class="description-title">Options</div>
            <riotmui-option data="{{this.parent.options}}"></riotmui-option>
            <div class="description-title">Methods,Listeners and Properties</div>
            <riotmui-option data="{{this.parent.methods}}"></riotmui-option>
        </div>
    </riotmui-desc>
<script type="es6">
// Examples
this.example1 =
`<material-dropdown>
      <p>DropDown content</p>
  </material-dropdown>`;
this.example2 =
`<material-dropdown animation="bottom">
      <p>DropDown content</p>
  </material-dropdown>`;
this.children = [
    {
        title: '<p>Any content...</p>',
        type:'tag',
        default: '',
        desc: 'It is possible to be any html content inside material-dropdown.'
    }
];
// Options
this.options = [{
        title: 'animation',
        type:'string ["top"|"bottom"]',
        default: 'top',
        desc: 'Sets animation direction.'
    }
];
// Styling
this.methods = [
    {
        title: 'open',
        type:'method',
        default: '',
        desc: 'Will open dropdown. For example: this.dropdown.open();'
    },
    {
        title: 'close',
        type:'method',
        default: '',
        desc: 'Will close dropdown. For example: this.dropdown.close();'
    }
];
this.openDropDownOne = ()=>{
    let dropdown = this.tags.desc.tags.cardOne.tags.dropDownOne;
    !dropdown.opened?dropdown.open():dropdown.close();
}
this.openDropDownTwo= ()=>{
    let dropdown = this.tags.desc.tags.cardTwo.tags.dropDownOne;
    !dropdown.opened?dropdown.open():dropdown.close();
}
</script>
</dropdown>