require('../riotmui-elements/riotmui-desc/riotmui-desc.tag');
require('../riotmui-elements/riotmui-code/riotmui-code.tag');
require('../riotmui-elements/riotmui-option/riotmui-option.tag');
require('../material-elements/material-card/material-card.tag');

require('../material-elements/material-popup/material-popup.tag');
require('../material-elements/material-button/material-button.tag');
<popup>
    <riotmui-desc name="desc">
        <div class="riotmui-desc-examples row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card name="cardOne">
                    <div class="material-card-title">Default Popup</div>
                    <div class="material-card-content">
                        <material-button onclick="{{this.parent.parent.openPopupOne}}">
                            <div class="text">Open</div>
                        </material-button>
                        <material-popup name="popupOne">
                            <p>Accerso alius sententia ut mihi, phasmatis of interregnum ego dico, solvo meus mens mei,
                                ego dico phasmatis audite meus placitum meus mens quod iacio (Nombre de la persona)</p>
                        </material-popup>
                    </div>
                    <riotmui-code style="margin-top: 66px" code="{{this.parent.parent.example1}}"></riotmui-code>
                </material-card>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex">
                <material-card name="cardTwo">
                    <div class="material-card-title">Popup With Title</div>
                    <div class="material-card-content">
                        <material-button onclick="{{this.parent.parent.openPopupTwo}}">
                            <div class="text">Open</div>
                        </material-button>
                        <material-popup name="popupTwo">
                            <div class="material-popup-title">Title</div>
                            <p>Accerso alius sententia ut mihi, phasmatis of interregnum ego dico, solvo meus mens mei,
                                ego dico phasmatis audite meus placitum meus mens quod iacio (Nombre de la persona)</p>
                        </material-popup>
                    </div>
                    <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code>
                </material-card>
            </div>
        </div>
        <div class="riotmui-desc-description">
            <p>
                If you need popup just add this component to your project.
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
`<material-popup>
    <p>Content</p>
  </material-popup>`;
this.example2 =
`<material-popup>
    <div class="material-popup-title">Title</div>
    <p>Content</p>
  </material-popup>`;
this.children = [
    {
        title: '<div>...</div>',
        type:'tag',
        default: '',
        desc: 'Any content can be placed into material popup.'
    },
    {
        title: '<div class="material-popup-title">Title</div>',
        type:'tag',
        default: '',
        desc: 'Adds title to material popup.'
    }
];

// Methods
this.methods = [
    {
        title: 'open',
        type:'method',
        default: '',
        desc: 'Opens popup.'
    },
    {
        title: 'close',
        type:'method',
        default: '',
        desc: 'Closes popup.'
    }
];
this.openPopupOne = ()=>{
    let popup = this.tags.desc.tags.cardOne.tags.popupOne;
    !popup.opened?popup.open():popup.close();
}
this.openPopupTwo = ()=>{
    let popup = this.tags.desc.tags.cardTwo.tags.popupTwo;
    !popup.opened?popup.open():popup.close();
}
</script>
</popup>