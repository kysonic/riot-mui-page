require('./riotmui-option.scss');
<riotmui-option>
    <div class="option row" each="{{option,key in opts.data}}">
        <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div>
        <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6">
            <p>
                <span class="type">{{option.type}}</span>
                <span class="default">{{option.default}}</span>
            </p>
            <p>
                {{option.desc}}
            </p>
        </div>
    </div>
</riotmui-option>