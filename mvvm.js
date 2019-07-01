function Mvvm($options){
    this._option=$options;
    this.data=this._option.data;
    //监控data,即初始化observer
    observer(this.data)
}
