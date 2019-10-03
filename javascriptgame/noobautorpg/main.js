//宣言が必要な変数置き場
//stat順、0:maxHP,1:nowHP,2:STR,3:AGI,4:DEX,5:VIT,6:INT,7:LUK,8:exp,9:lv,10:BonusPoint
let mystat =[100,100,10,10,10,10,10,10,0,1,0];
let mobstat =[30,30,10,10,10,10,10,10,10,1];
let basemobstat =[30,30,10,10,10,10,10,10,10,1];
let myintrv =1000;
let mobintrv = 1000;
let myatk;
let mobatk;
let myreg;
let mobreg;
let i = 0;
document.getElementById(hp);
document.getElementById(stat);
document.getElementById(mobhp);
document.getElementById(mobstat);
let myattacktime;
let mobattacktime;
console.log(stat);
//ランダム関数色々
function getrandm255() {
	rand = Math.floor(Math.random() * 256);
	return rand;
}
function getrandm() {
	rand = Math.floor(Math.random() * 2);
	return rand;
}
function getrandam(ran_num) {
	rand = Math.floor(Math.random() * ran_num);
	return rand;
}
//exptableを呼び出すと次のレベルアップの必要経験値を吐き出す
let exptable = function(){return mystat[9]*mystat[9]+10;}
//計算が必要なステータスの更新
function statupdate(){
	levelup();
	mystat[0] = mystat[9]*100+mystat[5]*5;
	myatk = (mystat[2]+((mystat[2]*mystat[2])/10)*((mystat[3]/360)+1)).toFixed(2);
	mobatk = (mobstat[2]+((mobstat[2]*mobstat[2])/10)*((mobstat[3]/360)+1)).toFixed(2);
	myintrv = 700;
	mobintrv = 700;
	myreg = (1-mystat[2]/(1000+mystat[2]))*(1-(mystat[5]/(500+mystat[5])))*(1-(mystat[6]/5)/(500+(mystat[6]/5)));
	mobreg = (1-mobstat[2]/(1000+mobstat[2]))*(1-(mobstat[5]/(500+mobstat[5])))*(1-(mobstat[6]/5)/(500+(mobstat[6]/5)));
	console.log(exptable(),mystat[8]);
	screenup();
}
//レベルアップ処理
function levelup(){
	for (;mystat[8] >= exptable();){
		mystat[9]++;
		mystat[10] += 60;
	}
}
//bp振り分け
function addstat(usepoint,upstat){
	if (mystat[10]>usepoint){
		if (usepoint>=100){
			for (i=0;i<(usepoint/100);i++){
				mystat[upstat] +=100;
				mystat[10] -= 100;
			}
		}else{	
			for (i=0;i<usepoint;i++){
				mystat[upstat] ++;
				mystat[10]--;
				console.log(mystat[upstat]);
			}
		}
	screenup();
	}
}

//戦闘処理
//自分の攻撃
function myattak(){
	if(mobstat[1] <= 0) {
		endbattle("mob0");
	}else if (mystat[1] <= 0){
		endbattle("me0")
	}else{
		mobstat[1] = (mobstat[1] - (myatk * mobreg).toFixed(2)).toFixed(2);
		screenup();
	}
}
//敵の攻撃
function mobattak(){
	if(mystat[1] <= 0) {
		console.log("sinndaa");
		screenup();
		setTimeout(endbattle,100,"me0");
	}else if (mobstat[1] <= 0){
		screenup()
	setTimeout(endbattle,100,"mob0");
	}
	else{
		mystat[1] = (mystat[1] - (mobatk*myreg).toFixed(2)).toFixed(2);
		screenup();
	}
}
//どちらかが死んだ場合の処理
function endbattle(deadman){
	screenup();
	if (deadman === "mob0"){
		mystat[8] += mobstat[8];
		mystat[1] = mystat[0];
		createmob(mobstat[9]);
		screenup();
	}
	if (deadman === "me0"){
		mystat[1] = mystat[0];
		screenup();
	}
}
//新しいモンスターの作成
function createmob(moblevel){
	//モンスターレベルの増加
	moblevel = moblevel + getrandm();
	mobstat[9] = moblevel;
	//モンスターレベルによる倍率
	let levelmag = mobstat[9] ;
	console.log();
	//ベースに倍率を乗算
	for (i=0;i<mobstat.length-1;i++){
		mobstat[i] = basemobstat[i]*levelmag;
		console.log(mobstat[i]);
	}
	mobstat[0] = mobstat[9]*100+mobstat[5]*5;
	mobstat[1] = mobstat[0];
	stopmyattack();
	stopmobattack();
	startmyattack();
	startmobattack();
	screenup();
}
//描画更新
function screenup(){
	nhp.textContent = mystat[1]+"/"+mystat[0];
	mylv.textContent ="Lv："+mystat[9];
	mystr.textContent ="STR："+mystat[2];
	myagi.textContent ="AGI："+mystat[3];
	mydex.textContent ="DEX："+mystat[4];
	myvit.textContent ="VIT："+mystat[5];
	myint.textContent ="INT："+mystat[6];
	myluk.textContent ="LUK："+mystat[7];
	mybp.textContent = "BP ："+mystat[10];
	mhp.textContent = mobstat[1]+"/"+mobstat[0];
	moblv.textContent ="Lv："+mobstat[9];
	mobstr.textContent ="STR："+mobstat[2];
	mobagi.textContent ="AGI："+mobstat[3];
	mobdex.textContent ="DEX："+mobstat[4];
	mobvit.textContent ="VIT："+mobstat[5];
	mobint.textContent ="INT："+mobstat[6];
	mobluk.textContent ="LUK："+mobstat[7];
	mydamage.textContent =mobatk;
	mobdamage.textContent = myatk;
}
window.onload = statupdate(),startmyattack(),startmobattack();
setInterval(statupdate,1000);
function startmyattack(){
	myattacktime = setInterval(myattak,myintrv);
}
function stopmyattack(){
	clearInterval(myattacktime);
}
function startmobattack(){
	mobattacktime = setInterval(mobattak,mobintrv);
}
function stopmobattack(){
	clearInterval(mobattacktime);
}