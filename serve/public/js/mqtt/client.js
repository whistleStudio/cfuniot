const mqtt = require("mqtt");
const brokerPort = 1883;
// 服务器clientId可以复杂点
var client = mqtt.connect(`mqtt://localhost:${brokerPort}`, {
  clientId: "cfweb1013",
  username: "cfunworld",
  password: "cfunworld666",
});
// var client  = mqtt.connect(`mqtt://localhost:${brokerPort}`, {clientId: 'whistle/1', username:'whistle', password:'fnjd4Pc8Fx'})

const Device = require("../db/model/Device");
const User = require("../db/model/User");
const MessageLog = require("../db/model/MessageLog");

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}
function formatDate(d) {
  // 返回 'YYYY-MM-DD HH:mm:ss'
  try {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch (e) {
    return new Date().toISOString();
  }
}

/* ---------- 每日清空 MessageLog（整个集合） ---------- 
   采用：计算到下一个本地午夜的延时 setTimeout，执行清理后再用 setInterval 每 24 小时执行一次。
*/
function scheduleDailyClear() {
  try {
    const MS_PER_DAY = 24 * 3600 * 1000;
    const now = new Date();
    // 计算明天本地 00:00:00 的时间点
    const nextMid = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      5,
      0
    ); // +5s 偏移，避免整点 race
    const delay = nextMid.getTime() - now.getTime();
    console.log(
      `MessageLog daily clear scheduled in ${Math.round(
        delay / 1000
      )}s, then every 24h`
    );

    setTimeout(async function runAndSchedule() {
      try {
        const res = await MessageLog.deleteMany({});
        console.log(
          new Date(),
          "MessageLog collection cleared by daily task. deletedCount:",
          res.deletedCount || res.n || 0
        );
      } catch (e) {
        console.error(new Date(), "MessageLog daily clear error", e);
      }
      // 之后每 24 小时执行一次
      setInterval(async () => {
        try {
          const res = await MessageLog.deleteMany({});
          console.log(
            new Date(),
            "MessageLog collection cleared by scheduled interval. deletedCount:",
            res.deletedCount || res.n || 0
          );
        } catch (e) {
          console.error(new Date(), "MessageLog scheduled clear error", e);
        }
      }, MS_PER_DAY);
    }, delay);
  } catch (e) {
    console.error("scheduleDailyClear error", e);
  }
}

client.on("connect", function () {
  console.log("aedes connect");
  // username/did/Cnum
  client.subscribe("+/+/Cnum1", (err, message) => {
    if (!err) console.log("Cnum1 top subscribe success");
    else console.log("Cnum1 top subscribe fail");
  });
  // username/did/Cnum2
  client.subscribe("+/+/Cnum2", (err, message) => {
    if (!err) console.log("Cnum2 top subscribe success");
    else console.log("Cnum2 top subscribe fail");
  });
  // username/did/Cmsg
  client.subscribe("+/+/Cmsg", (err, message) => {
    if (!err) console.log("Cmsg top subscribe success");
    else console.log("Cmsg top subscribe fail");
  });
  // username/did/自定义主题
  client.subscribe("+/+/#", (err, message) => {
    if (!err) console.log("subscribe all private topics success");
    else console.log("subscribe all private topics fail", err);
  });
});

client.on("message", function (topic, message) {
  let topInfo = topic.split("/");
  console.log("topInfo:", topInfo);
  // reg1,3 数值数据主题
  let reg1 = /.+\/.+\/Cnum1/;
  let reg3 = /.+\/.+\/Cnum2/;
  // reg2 字符串数据主题
  let reg2 = /.+\/.+\/Cmsg/;
  let name = topInfo[0],
    did = topInfo[1],
    cn = 1;
  if (reg1.test(topic) || reg3.test(topic)) {
    if (reg1.test(topic)) {
      console.log("get Cnum1 top:", topic);
      cn = 1;
    } else {
      console.log("get Cnum2 top:", topic);
      cn = 2;
    }
    (async () => {
      let numArr = [].slice.call(
        new Uint8Array(message.buffer, message.byteOffset, message.length)
      );
      let b = new Uint8Array(numArr).buffer;
      console.log(b);
      numArr = [].slice.call(new Float32Array(Buffer.from(b).buffer));
      console.log(numArr);
      // 数据库操作
      if (numArr.length === 4) {
        let doc = await User.findOne({ name });
        if (doc) {
          if (cn === 1)
            await Device.updateOne(
              { user: doc.mail, did: did },
              { Cnum1: numArr }
            );
          else
            await Device.updateOne(
              { user: doc.mail, did: did },
              { Cnum2: numArr }
            );
        } else console.log(`user:${name} not reg`);
      }
    })().catch((e) => console.log("client.js: Cnum db error", e));
  }
  if (reg2.test(topic)) {
    console.log("get Cmsg top:", topic);
    (async () => {
      let msg = message.toString();
      console.log(msg);
      let doc = await User.findOne({ name });
      if (doc) {
        await Device.updateOne({ user: doc.mail, did: did }, { Cmsg: msg });
      } else console.log(`user:${name} not reg`);
    })().catch((e) => console.log("client.js: Cmsg db error", e));
  }

  // 通用：若该设备在 DB 定义了 subTopics，并且当前 topic 在 subTopics 中，则把消息记录到 MessageLog（messages: [[time, payload], ...]）
  (async () => {
    try {
      let u = await User.findOne({ name });
      if (!u) return;
      let dev = await Device.findOne({ user: u.mail, did });
      if (!dev) return;
      let topicShort = topInfo[2];
      if (!topicShort) return; // 考虑后期增加额外规则判断主题合法性
      // 添加记录
      const payload = message.toString();
      if (payload.trim().length === 0) return; // 空消息不记录
      const now = new Date();
      const timeStr = formatDate(now); // 'YYYY-MM-DD HH:mm:ss'
      // 查找已存在的日志文档
      let doc = await MessageLog.findOne({
        user: u.mail,
        did: did.toString(),
        topic: topicShort,
      });
      const MAX_LEN = 300;
      if (!doc) {
        // 不存在则创建一个新的文档，messages 初始为 [[time, payload]]
        await MessageLog.create({
          user: u.mail,
          did: did.toString(),
          topic: topicShort,
          messages: [[timeStr, payload]],
          updatedAt: now,
        });
      } else {
        // 已存在：比较最后一条消息的日期（YYYY-MM-DD）
        const msgs = Array.isArray(doc.messages) ? doc.messages.slice() : [];
        msgs.push([timeStr, payload]);
        if (msgs.length > MAX_LEN) msgs.splice(0, msgs.length - MAX_LEN);
        await MessageLog.updateOne(
          { _id: doc._id },
          { messages: msgs, updatedAt: now }
        );
      }
    } catch (e) {
      console.log("client.js: message log save error", e);
    }
  })();
});

module.exports = client;
