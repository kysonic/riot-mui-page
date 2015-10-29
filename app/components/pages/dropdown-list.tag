require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-button/material-button.tag');
require('../material-elements/material-dropdown-list/material-dropdown-list.tag');
<dropdown-list>
    <riotmui-desc name="desc">
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card name="cardOne">
                    <div class="material-card-title">Default Dropdown List</div>
                    <div class="material-card-content">
                        <div class="button-container">
                            <material-button name="buttonOne" onclick="{{parent.parent.openDropDownOne}}">
                                <div class="text">Toggle Dropdown</div>
                            </material-button>
                            <material-dropdown-list items="[{title:'One'},{title:'Two'}]" name="dropDownOne"></material-dropdown-list>
                        </div>
                    </div>
                    <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card name="cardTwo">
                    <div class="material-card-title">Link items</div>
                    <div class="material-card-content">
                        <div class="button-container">
                            <material-button name="buttonTwo" onclick="{{parent.parent.openDropDownTwo}}">
                                <div class="text">Toggle Dropdown</div>
                            </material-button>
                            <material-dropdown-list items="[{title:'One',link:'#one'},{title:'Two',link:'#two'}]" animation="bottom" name="dropDownOne"></material-dropdown-list>
                        </div>
                    </div>
                    <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                Component may provide possibility of creating drop down with some items.
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
`<material-dropdown-list items="[{title:'One'},{title:'Two'}]"></material-dropdown-list>`;
this.example2 =
`<material-dropdown-list items="[{title:'One',link:'#one'},{title:'Two',link:'#two'}]"></material-dropdown-list>`;
// Options
this.options = [{
        title: 'items',
        type:'string',
        default: '[]',
        desc: 'Sets items to list. Item must contain at list one of following properties: title - title of item, link - any link. If will be set link property the item' +
        'will be made using <a></a>'
    }
];
// Styling
this.methods = [
    {
        title: 'open',
        type:'method',
        default: '',
        desc: 'Will open dropdown.'
    },
    {
        title: 'close',
        type:'method',
        default: '',
        desc: 'Will close dropdown.'
    },
    {
        title: 'selected',
        type:'number',
        default: '-',
        desc: 'Current selected item key.'
    },
    {
        title: 'selectChanged',
        type:'listener',
        default: '',
        desc: 'Will be invoked when selected item will be changed.'
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
</dropdown-list>