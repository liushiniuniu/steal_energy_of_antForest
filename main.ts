
const collectStrings: string[] = [
    "线下支付","行走","共享单车","地铁购票",
    "网络购票","网购火车票","生活缴费","ETC缴费",
    "电子发票","绿色办公","咸鱼交易","预约挂号"
];
const collectTime ='7:01:00';//自己运动能量生成时间
// const collectTime ='11:17:10';//自己运动能量生成时间
const screenWidth = 1080;
const screenHeight = 2340;

class Main {
    /**
     * 此次收集的能量
     */
    static amount: number = 0;
    static start () {
        auto("fast");
        sleep(1000);
        Time.countDown(collectTime, () => this.mainEntrence());
    }
    //程序主入口
    static mainEntrence(){
        App.unlock();
        //前置操作
        // App.prepareThings();
        //注册音量下按下退出脚本监听
        // Util.registEvent();
        //从主页进入蚂蚁森林主页
        App.enterMyMainPage();
        //收集自己的能量
        Collect.collectionMyEnergy();
        //进入排行榜
        Collect.enterRank();
        //在排行榜检测是否有好有的能量可以收集
        Collect.enterOthers();
        //结束后返回主页面
        Util.whenComplete();
    }

}

class Collect {

    /**
     * 在排行榜页面,循环查找可收集好友
     * @returns {boolean}
     */
    static enterOthers(){
        Util.log("开始检查排行榜");
        var i=1;
        var ePoint= Position.getHasEnergyfriend(1);
        //确保当前操作是在排行榜界面
        while(ePoint==null && textEndsWith("好友排行榜").exists()){
            //滑动排行榜 root方式的的点击调用.如无root权限,7.0及其以上可采用无障碍模式的相关函数
            swipe(520,1800,520,300,1000);
            sleep(3000);
            ePoint= Position.getHasEnergyfriend(1);
            i++;
            //检测是否排行榜结束了
            if(Util.isRankEnd()){
                return false;
            }
            //如果连续32次都未检测到可收集好友,无论如何停止查找(由于程序控制了在排行榜界面,且判断了结束标记,基本已经不存在这种情况了)
            else if(i>32){
                Util.log("程序可能出错,连续"+i+"次未检测到可收集好友");
                exit();
            }
        }
        if(ePoint!=null){
            
            //点击位置相对找图后的修正
            Util.log(ePoint.x  + ','+ ePoint.y);
            click(ePoint.x,ePoint.y+20);
            Util.waitPage(1);
            App.clickByDesc("可收取",80);
            //进去收集完后,递归调用enterOthers
            back();
            sleep(2000);
            var j=0;
            //等待返回好有排行榜
            if(!textEndsWith("好友排行榜").exists() && j<=5){
                sleep(2000);
                j++;
            }
            if(j>=5){
                Util.defaultException();
            }
            Collect.enterOthers();
        }else{
            Util.defaultException();
        }
    }

    /**
     * 遍历能量类型,收集自己的能量
     */
    static collectionMyEnergy(){
       
        sleep(2000);

        const beginX = 100;
        const beginY =  400;
        const endX = 850;
        const enddY = 700;
        const deltaX = 100;
        
        let curPosX = beginX;
        let curPosY = beginY;
        while(true) {
            click(curPosX, curPosY); 
            curPosX += deltaX;
            if (curPosX >= endX) {
                curPosX = beginX;
                curPosY += 50;
            }    
            
            if (curPosY >= enddY) {
                Util.log('点完了')
                break;
            }
            
        }
        
        Util.log("自己能量收集完成");
    }

    /**
     * 进入排行榜
     */
    static enterRank(){
        Util.log("进入排行榜");
        swipe(520,1860,520,100);
        sleep(2500);
        App.clickByDesc("查看更多好友",0,true,"程序未找到排行榜入口,脚本退出");
        var i=0;
        //等待排行榜主页出现
        sleep(2000);
        while (!textEndsWith("好友排行榜").exists() && i<=5){
            sleep(2000);
            i++;
        }
        if(i>=5){
            Util.defaultException();
        }
    }


}

class Position {
    /**
     * 从排行榜获取可收集好友的点击位置  
     * @returns {*}
     */
    static  getHasEnergyfriend(type) {
        var img = App.getCaptureImg();
        var p=null;
        if(type==1){
            //img 是图片
            //"#30bf6c" 第一个颜色
            //[0, 33, "#30bf6c"] 第二颜色和它的相对坐标
            //[34,45, "#ffffff"] 第三个颜色和他的相对坐标
            //region: [1030, 100, 1, 1700] 第一个颜色的检测区域1030，100为起始坐标，1，1700为区域宽度！！！
            p = images.findMultiColors(img, "#30bf6c",[[60, 0, "#30bf6c"], [46,45, "#ffffff"]], {
                region: [1018, 100, 1, 1700]
            });
        }
        if(p!=null){
            return p;
        }else {
            return null;
        }
    }



    /**
     * 根据text值 点击 * @param energyType * @param noFindExit
     */
    static clickByText(energyType,noFindExit,exceptionMsg){
        Util.log('shuru:,' + energyType + ',' + noFindExit + ',' + exceptionMsg);

        if(textEndsWith(energyType).exists()){
            Util.log('找到了')
            textEndsWith(energyType).find().forEach(function(pos){
                var posb=pos.bounds();
                // click(posb.centerX(),posb.centerY()-60);
                click(posb.centerX(),posb.centerY()-100);

                sleep(1500);

                Collect.collectionMyEnergy();


            });
        }else{
            Util.log('not found')

            if(noFindExit!=null && noFindExit){
                if(exceptionMsg !=null){
                    Util.log(exceptionMsg);
                    exit();
                }else{
                    Util.defaultException();
                }
            }
        }
    }
}

class App {
    //解锁
    static unlock() {
        if(!device.isScreenOn()){
            //点亮屏幕
            device.wakeUp();
            sleep(1000);
            //滑动屏幕到输入密码界面
            swipe(500, 1900, 500, 1000, 1000);
            sleep(1000);
            
        //输入四次 1 （密码为1111）其他密码请自行修改 数字键1的像素坐标为（200,1000）
            // click(200,1000);
            // sleep(500);
        
            // click(200,1000);
            // sleep(500);
            
            // click(200,1000);
            // sleep(500);
            
            // click(200,1000);
            // sleep(500);
        
        }

        Util.log('屏幕打开了')
    }

    /**
     * 获取权限和设置参数
     */
    static prepareThings(){
        setScreenMetrics(1080, 1920);
        //请求截图
        if(!requestScreenCapture()){
            Util.log("请求截图失败");
            exit();
        }
        
    }


    /**
     * 从支付宝主页进入蚂蚁森林我的主页
     */
    static enterMyMainPage(){
        launchApp("支付宝");
        Util.log("等待支付宝启动");
        var i=0;
        sleep(1000);
        //五次尝试蚂蚁森林入口
        while (!textEndsWith("蚂蚁森林").exists() && i<=5){
            sleep(2000);
            Util.log('进入森林')
            i++;
        }
        // Position.clickByText("蚂蚁森林",true,"请把蚂蚁森林入口添加到主页我的应用");
        Position.clickByText("蚂蚁森林",true,"请把蚂蚁森林入口添加到主页我的应用");
        //等待进入自己的主页
        Util.waitPage(0);
    }

    /**
    * 获取截图
    */
    static getCaptureImg(){
        var img0 = captureScreen();
        if(!img0) {
            Util.log("截图失败,退出脚本");
            exit();
        }else{
            return img0;
        }
    }
    
    /**
     * 根据描述值 点击
     * @param energyType
     * @param noFindExit
     */
    static clickByDesc(energyType: string,paddingY: number, noFindExit?: boolean, exceptionMsg?: string)  {
        if(descEndsWith(energyType).exists()){
            descEndsWith(energyType).find().forEach(function(pos){
                var posb=pos.bounds();
                Util.log('点击了：' +  energyType);
                click(posb.centerX(),posb.centerY()-paddingY);
                sleep(2000);
            });
        }else{
            if(noFindExit!=null && noFindExit){
                if(exceptionMsg !=null){
                    Util.log(exceptionMsg);
                    exit();
                }else{
                    Util.defaultException();
                }
            }
        }
    }

}

class Time {
    static countDown(sepcefiedTime: string, callBack: () => void) {
        const sepecifiedTimes = sepcefiedTime.split(':');
        const times = {
            hours: parseInt(sepecifiedTimes[0]),
            minutes: parseInt(sepecifiedTimes[1]),
            seconds: parseInt(sepecifiedTimes[2]),
        }
        var restTime = null;
        const nowTime = new Date();
        const nowSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()
        const targetSeconds: number =  times.hours * 3600 + times.minutes * 60 + times.seconds;
        
        //  判断是否已超过今日目标小时，若超过，时间间隔设置为距离明天目标小时的距离
        restTime = targetSeconds > nowSeconds ? targetSeconds - nowSeconds: targetSeconds + 24 * 3600 - nowSeconds 
        console.log('还剩'+ restTime +'毫秒开始收集能量');
        sleep(restTime * 1000);
        callBack();
        // setTimeout(callBack, restTime * 1000);
    }
}

class Util {

        /**
     * 等待加载收集能量页面,采用未找到指定组件阻塞的方式,等待页面加载完成
     */
    static waitPage(type){
        // 等待进入自己的能量主页
        if(type==0){
            desc("消息").findOne();
        }
        // 等待进入他人的能量主页
        else if(type==1){
            desc("浇水").findOne();
        }
        //再次容错处理
        sleep(5000);
    }

    static whenComplete() {
        Util.log("结束");
        back();
        sleep(1500);
        back();
        exit();
    }
    /**
     * 日志输出
     */
    static log(msg: string) {
        toast(msg);
        console.log(msg)
    }

    /**
     * 默认程序出错提示操作
     */
    static defaultException() {
        Util.log("程序当前所处状态不合预期,脚本退出");
        exit();
    }

    /**
     * 判断是否好有排行榜已经结束
     * @returns {boolean}
     */
    static isRankEnd() {
        if(descEndsWith("没有更多了").exists()){
            var b=descEndsWith("没有更多了").findOne();
            var bs=b.bounds();
            if(bs.centerY()<1920){
                return true;
            }
        }
        return false;
    }

        /**
     * 根据能量类型数组生成我的能量类型正则查找字符串
     * @returns {string}
     */
    static generateCollectionType() {
        var regex="/";
        collectStrings.forEach(function (t,num) {
            if(num==0){
                regex+="(\\s*"+t+"$)";
            }else{
                regex+="|(\\s*"+t+"$)";
            }
        });
        regex+="/";
        return regex;
    }
    /**
     * 设置按键监听 当脚本执行时候按音量减 退出脚本
    */
    static registEvent() {
        //启用按键监听
        events.observeKey();
        //监听音量上键按下
        events.onKeyDown("volume_down", function(event){
            Util.log("脚本手动退出");
            exit();
        });
    }



}




Main.start();




 

 












