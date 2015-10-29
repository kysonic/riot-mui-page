require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-snackbar/material-snackbar.tag');
require('../material-elements/material-button/material-button.tag');
<snackbar>
    <riotmui-desc name="desc">
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card name="cardOne">
                    <div class="material-card-title">Default Toast</div>
                    <div class="material-card-content">
                        <material-button onclick="{{parent.parent.launchToastOne}}">
                            <div class="text">Launch</div>
                        </material-button>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card name="cardOne">
                    <div class="material-card-title">Error Toast</div>
                    <div class="material-card-content">
                        <material-button onclick="{{parent.parent.launchToastTwo}}">
                            <div class="text">Launch</div>
                        </material-button>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                Material snackbar is great way to notify user of your web site about whatever you want.
                By default it has two states - message and error.
            </p>
            <div class="description-title" if="{{this.parent.children}}">Children</div>
            <riotmui-option data="{{this.parent.children}}"></riotmui-option>
            <div class="description-title" if="{{this.parent.options}}">Options</div>
            <riotmui-option data="{{this.parent.options}}"></riotmui-option>
            <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div>
            <riotmui-option data="{{this.parent.methods}}"></riotmui-option>
        </div>
    </riotmui-desc>
    <material-snackbar name="snackbar"></material-snackbar>
<script type="es6">
// Examples
this.example1 =
`<material-snackbar></material-snackbar>`;
// Options
this.options = [{
        title: 'duration',
        type:'number',
        default: '4000',
        desc: 'Changes default duration of toast. Duration it is time during which toast will be displayed on the screen.'
    }
];
// Methods
this.methods = [
    {
        title: 'addToast',
        type:'method',
        default: 'args: {message:"...",isError:false}',
        desc: 'Message will display into toast. isError - style of toast. If isError sets like "true" toast will be red.'
    },
    {
        title: 'removeToast',
        type:'method',
        default: 'args: toastID - number of toast in snackbar',
        desc: 'Removes toast from snackbar by ID.'
    }
];
this.launchToastOne = ()=>{
    let snackbar = this.tags.snackbar;
    snackbar.addToast({message:'Toast was fired. To close it just click on it!'})
}
this.launchToastTwo = ()=>{
    let snackbar = this.tags.snackbar;
    snackbar.addToast({message:'Error! This toast will be displayed during 10 sec.',isError:true},10000)
}
</script>
</snackbar>