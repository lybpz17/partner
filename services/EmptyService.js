class EmptyService{
	constructor(){
    }
    empty(ctx){
    	ctx.body='404,没有这个页面';
    }
}
exports.service = EmptyService;