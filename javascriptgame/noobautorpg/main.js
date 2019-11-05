//宣言が必要な初期変数置き場
//stat順、0:maxHP,1:nowHP,2:STR,3:AGI,4:DEX,5:VIT,6:INT,7:LUK,8:exp,9:lv,10:BonusPoint,11:skillpoint
let mystat = [150, 150, 10, 10, 10, 10, 10, 10, 0, 1, 0, 0];
let mobstat = [30, 30, 10, 10, 10, 10, 10, 10, 10, 1];
//testmesod
//メソッドに処理を記述して使いまわしたい処理、プロパティ名を使いまわす
let mysts = {
	//hp計算
	maxhp: function () {
		mystat[0] = mystat[9] * 100 + mystat[5] * 5;
		return mystat[0];
	},
	//攻撃力算出
	atk: function () {
		let myatk = (mystat[2] + (mystat[2] / 5) * ((mystat[3] / 360) + 1)).toFixed(2);
		return myatk
	},
	//防御率算出
	reg: function () {
		let myreg = (1 - (mystat[2] / (1000 + mystat[2]))) * (1 - (mystat[5] / (500 + mystat[5]))) * (1 - (mystat[6] / 5) / (500 + (mystat[6] / 5)));
		return myreg;
	},
	//攻撃間隔算出
	intrv: function () {
		let myintrv = 100 + 900 * (1 - (mystat[3] / (1000 + mystat[3])));
		return myintrv;
	}
}
//mob側
let mobsts = {
	//新しいモンスターの作成処理
	create: function (moblevel, deading) {
		//モンスターレベルの増加
		if (deading === true) {
			moblevel = moblevel;
		} else {
			moblevel += rnd(2);
		}
		mobstat[9] = moblevel;
		//モンスターレベルによる倍率調整を容易にするため別変数を宣言
		let levelmag = mobstat[9];
		//ベースに倍率を乗算
		for (i = 0; i < mobstat.length - 1; i++) {
			mobstat[i] = basemobstat[i] * levelmag;
		}
		//maxhpの計算
		mobstat[0] = mobstat[9] * 30 + mobstat[5] * 10;
		//現在hpをmaxhpと同じに
		mobstat[1] = mobstat[0];
		startmyattack();
		startmobattack();
		screenup();
		return levelmag;
	},
	//Mob攻撃力計算
	atk: function () {
		let mobatk = (mobstat[2] + (mobstat[2] / 5) * ((mobstat[3] / 360) + 1)).toFixed(2);
		return mobatk
	},
	//Mob防御率計算
	reg: function () {
		let mobreg = (1 - (mobstat[2] / (1000 + mobstat[2]))) * (1 - (mobstat[5] / (500 + mobstat[5]))) * (1 - (mobstat[6] / 5) / (500 + (mobstat[6] / 5)));
		return mobreg;
	},
	//Mob攻撃間隔計算
	intrv: function () {
		let mobintrv = 100 + 900 * (1 - (mobstat[3] / (1000 + mobstat[3])));
		return mobintrv;
	}
}
//mobベースステータス
let basemobstat = [30, 30, 10, 10, 10, 10, 10, 10, 10, 1];
let f = 0;
let i = 0;
//DOMのために取得
document.getElementById(battletab)
document.getElementById(skilltab);
//変数名の確保
let myattacktime;
let mobattacktime;
//ランダム関数3種類 (ran.getran(num)=rnd(num))
let ran = {
	getran: function (ran_num) {
		rand = Math.floor(Math.random() * (ran_num + 1));
		return rand;
	},
	getran255: function () {
		rand = Math.floor(Math.random() * 256);
		return rand;
	}
}
function rnd(ran_num) {
	rand = Math.floor(Math.random() * ran_num + 1);
	return rand;
}
//exptableを呼び出すと次のレベルアップの必要経験値を吐き出す
let exptable = function () {
	return (mystat[9] * mystat[9]) + 10;
}
//再計算が必要なステータスの更新処理
function statupdate() {
	levelup();
	mysts.maxhp();
	mysts.atk();
	mobsts.atk();
	mysts.intrv();
	mobsts.intrv();
	screenup();
}
//レベルアップ処理
function levelup() {
	for (; mystat[8] >= exptable();) {
		mystat[8] -= exptable();
		mystat[9]++;
		for (i = 2; i <= 7; i++) {
			mystat[i] += 10;
		}
		mystat[10] += 60;
		mystat[11]++;
		exptable();
	}
}
//bp振り分け処理呼び出すとステータスを振り分ける
function addstat(usepoint, upstat) {
	if (mystat[10] >= usepoint) {
		if (usepoint >= 100) {
			for (i = 0; i < (usepoint / 100); i++) {
				mystat[upstat] += 100;
				mystat[10] -= 100;
			}
		} else {
			for (i = 0; i < usepoint; i++) {
				mystat[upstat]++;
				mystat[10]--;
			}
		}
		screenup();
	}
}

//戦闘処理
//自分の攻撃フェーズ
function myattak() {
	//敵のHPが0以下のときにディレイをかけて戦闘終了を呼び出す
	if (mobstat[1] <= 0) {
		endbattle("mob0");
		setTimeout(endbattle, 100, "mob0");
	}
	//自分のHPが0以下のときにディレイをかけて戦闘終了を呼び出す
	else if (mystat[1] <= 0) {
		endbattle("me0");
		setTimeout(endbattle, 100, "me0");
	}
	//互いのHPが0以下ではない場合戦闘ダメージを与えて終了
	else {
		mobstat[1] = Math.floor(mobstat[1] - (mysts.atk() * mobsts.reg()).toFixed(2));
		screenup();
	}
}
//敵の攻撃フェーズ
function mobattak() {
	//自分のHPが0以下の場合戦闘終了を呼び出す
	if (mystat[1] <= 0) {
		screenup();
		setTimeout(endbattle, 100, "me0");
	}
	//敵のHPが0以下の場合戦闘終了を呼び出す
	else if (mobstat[1] <= 0) {
		screenup()
		setTimeout(endbattle, 100, "mob0");
	}
	//戦闘ダメージを与えて終了
	else {
		mystat[1] = Math.floor(mystat[1] - (mobsts.atk() * mysts.reg()).toFixed(2));
		screenup();
	}
}
//どちらかが死んだ場合の処理どちらもモンスターを新規に作成する
function endbattle(deadman) {
	stopmyattack();
	stopmobattack();
	//敵が死んだ場合の処理
	if (deadman === "mob0") {
		mystat[8] += mobstat[8];
		getexp.textContent = "You get EXP :" + mobstat[8];
		statupdate();
		mystat[1] = mystat[0];
		mobsts.create(mobstat[9], false);
		screenup();
	}
	//自分が死んだ場合の処理
	if (deadman === "me0") {
		mystat[1] = mystat[0];
		mobsts.create(mystat[9], true);
		screenup();
	}
}
//描画更新
function screenup() {
	nhp.textContent = mystat[1] + "/" + mystat[0];
	mylv.textContent = "Lv：" + mystat[9];
	mystr.textContent = "STR：" + mystat[2];
	myagi.textContent = "AGI：" + mystat[3];
	mydex.textContent = "DEX：" + mystat[4];
	myvit.textContent = "VIT：" + mystat[5];
	myint.textContent = "INT：" + mystat[6];
	myluk.textContent = "LUK：" + mystat[7];
	mybp.textContent = "BP ：" + mystat[10];
	mysp.textContent = "SP ：" + mystat[11];
	mhp.textContent = mobstat[1] + "/" + mobstat[0];
	moblv.textContent = "Lv：" + mobstat[9];
	mobstr.textContent = "STR：" + mobstat[2];
	mobagi.textContent = "AGI：" + mobstat[3];
	mobdex.textContent = "DEX：" + mobstat[4];
	mobvit.textContent = "VIT：" + mobstat[5];
	mobint.textContent = "INT：" + mobstat[6];
	mobluk.textContent = "LUK：" + mobstat[7];
	mydamage.textContent = Math.ceil(mobsts.atk() * mysts.reg());
	mobdamage.textContent = Math.ceil(mysts.atk() * mobsts.reg());
	nowexp.textContent = "exp:" + mystat[8] + "/" + exptable();
}

//開いたときにステータスアップデート、アタックタイマーを起動する
window.onload = statupdate(), startmyattack(), startmobattack(),startstatupdate();
//timer関係
function startstatupdate(){setInterval(statupdate, 1000);};
function startmyattack() {myattacktime = setInterval(myattak, mysts.intrv());};
function stopmyattack() {clearInterval(myattacktime);};
function startmobattack() {mobattacktime = setInterval(mobattak, mobsts.intrv());};
function stopmobattack() {clearInterval(mobattacktime);};

//アイテム作成処理fの宣言以外はここにあるので単品でも動く
let itemstat=[];
let itemid=[];
let paradata = ['str','agi','dex','vit','int','luk'];
let itemstatview = " ";
//item作成
function itemcreate(itemlv){
	//アイテムの総数が40以下なら作成する
	if (f<40){
		//各ステータス補正の計算
		for(i=0;i<7;i++){
			itemstat[i] = Math.floor(ran.getran(4)*itemlv*25/10);
		};
		//各ステータス格納場所を作成＆初期値を設定
		itemid[f]={itemlv:0,str:0,agi:0,dex:0,vit:0,int:0,luk:0,point:0,
			//各ステータスの配列化
			view: function(fox){
				switch(fox){
					case 0:return itemid[f].str;
					case 1:return itemid[f].agi;
					case 2:return itemid[f].dex;
					case 3:return itemid[f].vit;
					case 4:return itemid[f].int;
					case 5:return itemid[f].luk;
				}
			}
		};
		//装備場所決定
		itemstat[6] = ran.getran(9);
		let whatpoint = function() { 
			switch(itemstat[6]){
				case 0:return "head";
				case 1:return "neck";
				case 2:return "back";
				case 3:return "body";
				case 4:return "hand";
				case 5:return "ring";
				case 6:return "arm";
				case 7:return "waist";
				case 8:return "leg";
				case 9:return "foot";
			};
		};
		//各ステータス補正値を入力
		itemid[f].itemlv = itemlv;
		itemid[f].str = itemstat[0];
		itemid[f].agi = itemstat[1];
		itemid[f].dex = itemstat[2];
		itemid[f].vit = itemstat[3];
		itemid[f].int = itemstat[4];
		itemid[f].luk = itemstat[5];
		itemid[f].point = whatpoint();
		
		//htmlに出力する処理
		//各ステータスを出力
		for(i=0;i<6;i++){
			itemstatview =itemstatview+" "+paradata[i]+":"+itemid[f].view(i);
		}
		//出力されたステータスをitemlistにDOMで出力
		itemlist.innerHTML = itemlist.innerHTML+'<div class="item" id="item'+f+'">'+itemid[f].point+' stat'+itemstatview+'</div>';
		//出力済みデータを初期化
		itemstatview = " ";

		console.log (itemid[f]);
		f++;
		}
	else{
		console.log("inventory full")
	};
};

function itemequip(equipid){
	
}