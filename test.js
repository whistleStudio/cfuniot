let str = `<beijing dn="day">
<city cityX="232" cityY="190.8" cityname="延庆" centername="延庆" fontColor="FFFFFF" pyName="yanqing" state1="1" state2="1" stateDetailed="多云" tem1="17" tem2="5" temNow="11" windState="小于" windDir="北风" windPower="1级" humidity="61%" time="09:00" url="101010800"/>
<city cityX="394" cityY="157" cityname="密云" centername="密云" fontColor="FFFFFF" pyName="miyun" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="6" temNow="14" windState="小于" windDir="北风" windPower="1级" humidity="63%" time="09:00" url="101011300"/>
<city cityX="332" cityY="142" cityname="怀柔" centername="怀柔" fontColor="FFFFFF" pyName="huairou" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="8" temNow="14" windState="小于" windDir="东南风" windPower="1级" humidity="62%" time="09:00" url="101010500"/>
<city cityX="261" cityY="248" cityname="昌平" centername="昌平" fontColor="FFFFFF" pyName="changping" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="7" temNow="15" windState="小于" windDir="东南风" windPower="2级" humidity="57%" time="09:00" url="101010700"/>
<city cityX="439" cityY="232" cityname="平谷" centername="平谷" fontColor="FFFFFF" pyName="pinggu" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="6" temNow="14" windState="小于" windDir="南风" windPower="1级" humidity="64%" time="09:00" url="101011500"/>
<city cityX="360" cityY="265" cityname="顺义" centername="顺义" fontColor="FFFFFF" pyName="shunyi" state1="1" state2="1" stateDetailed="多云" tem1="18" tem2="8" temNow="14" windState="小于" windDir="东北风" windPower="2级" humidity="64%" time="09:00" url="101010400"/>
<city cityX="167" cityY="317.65" cityname="门头沟" centername="门头沟" fontColor="FFFFFF" pyName="mentougou" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="7" temNow="14" windState="小于" windDir="东风" windPower="1级" humidity="65%" time="09:00" url="101011400"/>
<city cityX="264.5" cityY="300.3" cityname="海淀" centername="海淀" fontColor="FFFFFF" pyName="haidian" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="8" temNow="13" windState="小于" windDir="北风" windPower="1级" humidity="71%" time="09:00" url="101010200"/>
<city cityX="344.3" cityY="317.65" cityname="朝阳" centername="朝阳" fontColor="FFFFFF" pyName="chaoyang" state1="1" state2="1" stateDetailed="多云" tem1="18" tem2="8" temNow="14" windState="小于" windDir="东北风" windPower="2级" humidity="65%" time="09:00" url="101010300"/>
<city cityX="255" cityY="341.5" cityname="石景山" centername="石景山" fontColor="FFFFFF" pyName="shijingshan" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="7" temNow="14" windState="小于" windDir="东风" windPower="2级" humidity="68%" time="09:00" url="101011000"/>
<city cityX="310.05" cityY="339.3" cityname="市中心" centername="市中心" fontColor="FFFF00" pyName="shizhongxin" state1="1" state2="1" stateDetailed="多云" tem1="18" tem2="8" temNow="13" windState="小于" windDir="东北风" windPower="1级" humidity="65%" time="09:00" url="101010100"/>
<city cityX="282.95" cityY="361" cityname="丰台" centername="丰台" fontColor="FFFFFF" pyName="fengtai" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="8" temNow="14" windState="小于" windDir="东北风" windPower="1级" humidity="65%" time="09:00" url="101010900"/>
<city cityX="198" cityY="386" cityname="房山" centername="房山" fontColor="FFFFFF" pyName="fangshan" state1="1" state2="1" stateDetailed="多云" tem1="19" tem2="6" temNow="14" windState="小于" windDir="东北风" windPower="1级" humidity="67%" time="09:00" url="101011200"/>
<city cityX="319" cityY="400" cityname="大兴" centername="大兴" fontColor="FFFFFF" pyName="daxing" state1="1" state2="1" stateDetailed="多云" tem1="18" tem2="7" temNow="14" windState="小于" windDir="北风" windPower="2级" humidity="63%" time="09:00" url="101011100"/>
<city cityX="374" cityY="355" cityname="通州" centername="通州" fontColor="FFFFFF" pyName="tongzhou" state1="1" state2="1" stateDetailed="多云" tem1="17" tem2="7" temNow="13" windState="小于" windDir="东风" windPower="1级" humidity="70%" time="09:00" url="101010600"/>
</beijing>`

let city = "通州"
let regStr = `cityname="${city}"([\\s\\S]+?)temNow`
let reg = RegExp(regStr)
// let reg = /cityname="朝阳"([\s\S]+?)temNow/

// console.log(str.match(reg)[1])
let a = [1,]
console.log(a.length)