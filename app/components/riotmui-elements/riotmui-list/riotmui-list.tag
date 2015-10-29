require('./riotmui-list.scss');
<riotmui-list role="toolbar">
    <ul>
        <li each="{{item,key in items}}" class="{{selected:parent.selected==item.link}}">
            <a if="{{item.link}}" onclick="{{onClick}}" href="{{item.link}}" onclick="{{parent.select}}" title="{{item.title}}">{{item.title}}</a>
        </li>
    </ul>
    <script type="es6">
        this.items = opts.links || [];
        this.onClick = (e)=>{
            this.trigger('onClick');
            window.location.href = e.target.getAttribute('href');
        }
    </script>
</riotmui-list>