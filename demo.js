// Illustrative coordinates only. This public demo contains no diagnostic rules.
const topics = [
 ['动作先后','沿着准备、下蹲、起身和出手依次回看。','先后顺序帮助定位值得慢看的片段；时间数字还需要可靠的原速视频。','先完整看一次，再回到动作衔接处。','示意进度不对应真实帧数或毫秒。',0,1],
 ['球与腿的配合','起身时，球或手怎样跟着身体向上。','可以观察有没有额外回落或调整，不能单凭先后断定腿部力量是否传到手。','回看起身前后，核对球和身体各自的运动方向。','二维动作顺序无法直接测量肌肉发力。',.2,.72],
 ['下蹲与回升','身体下沉至最低附近，再向上回升的过程。','下蹲深浅与动作任务有关，没有适用于所有人的统一膝角。','保留最低点前后的完整画面，观察过渡是否清楚。','精细关节观察需要清晰且合适的侧面机位。',.1,.6],
 ['最低点球位','身体最低附近，球相对胸口和头部在哪里。','这是同一画面内的相对位置，用来理解准备过程。','确认球、双肩和头部都能看清，再比较位置。','遮挡时不补造球位；此图没有实测高度。',.28,.43],
 ['腿臂衔接','起身段里，腿部伸展与投篮臂伸展的衔接。','关节运动的先后可以回看；运动速度峰值不是肌肉发力起点。','把注意力放在起身到伸臂这一段。','真实时间差需要可靠时间轴与明确投篮侧。',.4,.82],
 ['出手手臂','离手附近，投篮臂如何伸展。','投影肘角受拍摄方向影响，不能拿单个数值直接判定好坏。','慢看离手前后，先确认手臂没有被遮住。','示意姿势不是目标角度或球星标准。',.6,.9],
 ['出手与身体上升','球离手与身体上升过程的相对位置。','正式产品使用骨盆在画面中的最高点作观察，不把它称为真实重心。','同时回看离手和身体上升，不只盯住手。','画面最高点不能代替三维重心或可靠离地事件。',.48,1],
 ['上身姿态变化','最低点到离手这段，上身位置怎样变化。','倾斜变化可以被观察，但一个变化量不足以证明动作有错或影响命中。','结合机位和自己的感受，决定是否值得再拍一球核对。','此示意不能诊断前倾、后仰或受伤风险。',.3,.85]
];
const $ = id => document.getElementById(id);
let selected=0, progress=0, playing=false, previous=0, raf=0;
const poses=[[[200,165],[203,202],[195,259],[223,294],[201,334],[235,228],[265,213]],[[198,191],[199,224],[177,273],[232,292],[201,334],[234,249],[264,213]],[[211,151],[210,187],[202,246],[223,285],[211,329],[253,198],[266,153]],[[220,109],[218,144],[215,207],[220,262],[217,304],[255,120],[281,77]],[[220,120],[218,155],[215,218],[220,273],[217,315],[255,130],[281,87]]];
function draw(){
 const topic=topics[selected], t=topic[5]+progress*(topic[6]-topic[5]);
 const pos=t*(poses.length-1), lo=Math.min(poses.length-2,Math.floor(pos)), k=pos-lo;
 const p=poses[lo].map((xy,i)=>xy.map((v,j)=>v+(poses[lo+1][i][j]-v)*k));
 const line=(ids,color,width=9)=>`<polyline points="${ids.map(i=>p[i].join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const b=t<.73?[p[6][0]+8,p[6][1]-13]:[p[6][0]+8+(t-.73)*340,p[6][1]-13-(t-.73)*180];
 $('figure').innerHTML=line([1,2,3,4],'#244fb3')+line([1,5,6],'#bd4c16')+`<circle cx="${p[0][0]}" cy="${p[0][1]}" r="19" fill="#244fb3"/><path d="M${p[4][0]-8} ${p[4][1]}h29" stroke="#173653" stroke-width="9" stroke-linecap="round"/>`+p.slice(1).map(xy=>`<circle cx="${xy[0]}" cy="${xy[1]}" r="5" fill="white" stroke="#173653" stroke-width="2"/>`).join('')+`<circle cx="${b[0]}" cy="${b[1]}" r="13" fill="#d9672d" stroke="#79380f" stroke-width="2"/>`;
 $('progress').value=Math.round(progress*100);$('phase').textContent=`${topic[0]} · ${Math.round(progress*100)}% 示意进度`;
}
function stop(){playing=false;cancelAnimationFrame(raf);$('play').textContent='播放示意';}
function tick(now){if(!playing)return;progress=Math.min(1,progress+(now-previous)/3000);previous=now;draw();if(progress>=1)stop();else raf=requestAnimationFrame(tick);}
function choose(i){stop();selected=i;progress=0;const item=topics[i];['angle-title','look','meaning','cue','limit'].forEach((id,j)=>$(id).textContent=item[j]);document.querySelectorAll('#angles button').forEach((button,j)=>button.setAttribute('aria-pressed',String(i===j)));draw();}
topics.forEach((item,i)=>{const button=document.createElement('button');button.type='button';button.textContent=item[0];button.addEventListener('click',()=>choose(i));$('angles').append(button);});
$('play').addEventListener('click',()=>{if(playing)return stop();if(progress>=1)progress=0;playing=true;previous=performance.now();$('play').textContent='暂停示意';raf=requestAnimationFrame(tick);});
$('restart').addEventListener('click',()=>{stop();progress=0;draw();});
$('progress').addEventListener('input',event=>{stop();progress=Number(event.target.value)/100;draw();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
choose(0);
