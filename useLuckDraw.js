// LuckDraw.js
export default class LuckDraw {
  constructor(DataArr, cycleNumber, minSpeed) {
    this.DataArr = DataArr.map((item) => ({ ...item }));
    this.maxSpeed = 4; // 最大速度
    this.cycleNumber = cycleNumber || 2; // 旋转圈数
    this.defaultSpeed = minSpeed || 15; // 默认速度
    this.lastStopIndex = 0; // 上一次停止的索引
  }

  run(targetIndex, running, runend) {
    if (targetIndex < 0 || targetIndex >= this.DataArr.length) {
      console.error(`目标下标 ${targetIndex} 无效`);
      return;
    }

    // 如果不是第一次运行，从上次停止的位置开始
    let startIdx = this.lastStopIndex;

    // 计算总步数，包括完整圈数和额外步数
    const totalSteps = this.cycleNumber * this.DataArr.length + targetIndex - this.lastStopIndex;
    console.log(startIdx);
    
    // 减速区间
    let reduceSpeed = totalSteps - (this.defaultSpeed - this.maxSpeed);
    let counter = 0; // 计数器
    let current = 0; // 当前数字值
    let currentIndex = startIdx; // 当前索引，从上次停止的位置开始
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
          current = current + 7;
        } else {
          // 计数清零
          current = 0;
          // 往前移动一个；
          counter++;
          currentIndex = (currentIndex + 1) % _this.DataArr.length;
          _this.running(currentIndex);

          // 检查是否达到总步数
          if (counter >= totalSteps) {
            _this.lastStopIndex = currentIndex; // 更新上一次停止的索引
            _this.runend(currentIndex);
            cancelAnimationFrame(myReq);
            return;
          }
        }
      }
      myReq = requestAnimationFrame(step); // 更新 myReq
    };

    myReq = requestAnimationFrame(step); // 启动第一步并初始化 myReq
  }
}


// 使用示例

/**
 *  
 *  new LuckDraw(this.prizeList, 3, 15);
 *  
 *  注意不是中奖ID，奖品数组的下标
 *  run(中奖下标，runing, runend)
 */
