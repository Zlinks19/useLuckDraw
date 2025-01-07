// LuckDraw.js
export default class LuckDraw {
  constructor(DataArr, cycleNumber, minSpeed) {
    this.DataArr = DataArr.map((item) => ({ ...item }));
    this.maxSpeed = 4; // 最大速度
    this.cycleNumber = cycleNumber || 2; // 旋转圈数
    this.defaultSpeed = minSpeed || 15; // 默认速度
  }

  run(targetId, running, runend) {
    const index = this.DataArr.findIndex((item) => item.id === targetId);
    if (index === -1) {
      console.error(`${targetId}不存在`);
      return;
    }

    const totalSteps = this.cycleNumber * this.DataArr.length + index; // 总步数
    // 减速区间
    let reduceSpeed = totalSteps - (this.defaultSpeed - this.maxSpeed);
    let counter = 0; // 计数器
    let current = 0; // 当前数字值
    let currentIndex = 0; // 当前索引
    let currentObj = this.DataArr[0];
    this.running = running;
    this.runend = runend;
    const _this = this; // 保存对当前实例的引用
    this.running(currentIndex);

    let myReq; // 声明 myReq

    const step = () => {
      // 加速环节
      if (counter < _this.defaultSpeed - _this.maxSpeed) {
        if (current < Math.pow(_this.defaultSpeed - counter, 2)) {
          current = current + _this.defaultSpeed / 2;
        } else {
          current = 0;
          counter++;
          currentIndex = (currentIndex + 1) % _this.DataArr.length;
          _this.running(currentIndex);
        }
      }
      // 匀速环节至少两圈
      else if (counter < totalSteps - this.DataArr.length) {
        if (current < _this.maxSpeed) {
          current++;
        } else {
          current = 0;
          counter++;
          currentIndex = (currentIndex + 1) % _this.DataArr.length;
          _this.running(currentIndex);
        }
      }
      // 减速环节在最后一圈
      else if (counter >= reduceSpeed && counter < totalSteps) {
        if (Math.sqrt(current) <= _this.defaultSpeed - (totalSteps - counter)) {
          current = current + 8;
        } else {
          // 计数清零
          current = 0;
          // 往前移动一个；
          counter++;
          currentIndex = (currentIndex + 1) % _this.DataArr.length;
          _this.running(currentIndex);
        }
      }

      // 停止
      if (counter >= totalSteps) {
        _this.runend(currentObj);
        cancelAnimationFrame(_this.myReq);
        return;
      }

      myReq = requestAnimationFrame(step); // 更新 myReq
    };

    myReq = requestAnimationFrame(step); // 启动第一步并初始化 myReq
  }
}
