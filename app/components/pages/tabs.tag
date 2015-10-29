require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-tabs/material-tabs.tag');
<tabs>
    <riotmui-desc>
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Default Tabs</div>
                    <div class="material-card-content">
                        <material-tabs tabs="[{title:'ONE'},{title:'TWO'}]"></material-tabs>
                    </div>
                    <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card>
                    <div class="material-card-title">Using Underline</div>
                    <div class="material-card-content">
                        <material-tabs useLine="true" tabs="[{title:'ONE'},{title:'TWO'}]"></material-tabs>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                Material tabs may be used like UI interface for choosing or for sub screens.
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
`<material-tabs tabs="[{title:'ONE'},{title:'TWO'}]"></material-tabs>`;
this.example2 =
`<material-tabs useLine="true" tabs="[{title:'ONE'},{title:'TWO'}}]"></material-tabs>`;
// Options
this.options = [
    {
        title: 'tabs',
        type:'array',
        default: '[]',
        desc: 'Each of tab object should contain title property. {title:"ONE"}'
    },
    {
        title: 'cut',
        type:'number',
        default: '',
        desc: 'Can cut titles of tab\'s buttons. For example: cut="10" - all of tabs will contain no more than 10 symbols rest will be cut.'
    }
];
// Mehods
this.methods = [
    {
        title: 'changeTab',
        type:'method',
        default: 'args: index - number of tags which should be selected',
        desc: 'Can setup new selected tab by its index.'
    },
    {
        title: 'tabChanged',
        type:'listener',
        default: '',
        desc: 'Will be fired when selected tab is changed.'
    },
    {
        title: 'selected',
        type:'property',
        default: '0',
        desc: 'Current selected tab index.'
    }
];
</script>
</tabs>