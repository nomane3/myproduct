'use strict';

//初期変数置き場
let daller = 0;
let alldaller = 0;
let rand = 0;
let intv = 50;
let savetiming = 60000;
let maxbuy = true;
//購入配列[所持個数,購入費用,初期費用,収入/s,アプグレ倍率,ボタン名]
let buy1_Ar = [0,10,10,1,1,"buy1"];
let buy2_Ar = [0,100,100,10,1,"buy2"];
let buy3_Ar = [0,1000,1000,100,1,"buy3"];
//0~255のランダム関数
function getrandm() {
	rand = Math.floor(Math.random() * 256);
	return rand;
}

//呼び出すと数字が増え、1/16で16増える不思議なボタン
function clickme() {
	if (getrandm() < 16) {
		daller = daller + 16;
		alldaller = alldaller + 16;
	} else {
		daller = daller + 1;
		alldaller = alldaller + 1;
	}
	//描画の更新も呼び出し即応性を上げる
	screenup();
}

//表示の更新用
function screenup() {
	//お金の更新
	document.getElementById(yen);
	yen.textContent = daller + "＄"+"("+alldaller+")";
/*リファクタリング成果：購入ボタンを押したときに押したボタンのみ更新することで負担軽減
	document.getElementById(buy1);
	buy1.innerHTML = "buy" + buy1_Ar[1] + "＄" + "　" + "Num" + buy1_Ar[0];
	document.getElementById(buy2);
	buy2.innerHTML = "buy" + buy2_Ar[1] + "＄" + "　" + "Num" + buy2_Ar[0];
	/*お金が10円以上ある場合購入ボタンが出る(処理速度の観点から仕様からアウト)
		if (daller > 10){
		document.getElementById(buy1);
		buy1.style.opacity = 1 
	}
	*/
}
//購入ボタンの更新処理
function screenupb(buysc){
	let elm = document.getElementById(buysc[5])
	elm.textContent = "buy" + buysc[1] + "＄" + "　" + "Num" + buysc[0];
}
//値段の再設定
function setprice(price) {
	price[1] = price[2] * price[0] * price[0] + price[2];
	return price;
}
//購入用処理
function buyprocess(buymod) {
	setprice(buymod);
	if (maxbuy === true) {
		while (daller >= buymod[1]) {
			daller = daller - buymod[1];
			buymod[0] = buymod[0] + 1;
			buymod = setprice(buymod);
		}
	} else {
		if (daller >= buymod) {
			daller = daller - buymod[1];
			buymod[0] = buymod[0] + 1;
			buymod = setprice(buymod);
		}
	}
	return (buymod);
}

function buy1_buy() {
	buy1_Ar = buyprocess(buy1_Ar);
	screenup();
	screenupb(buy1_Ar)
	/*過去のゴミ、一応残す
		if (maxbuy == true){
		while(daller > buy1_price){
			setprice();
			daller = daller - buy1_price;
			buy1_num = buy1_num+1;
			setprice();
			screenup();
		}
	}
		if (daller >= buy1_price){
			daller = daller - buy1_price;
			buy1_num = buy1_num+1;
			setprice();
		}
	*/
}
function buy2_buy(){
	buy2_Ar = buyprocess(buy2_Ar);
	screenup();
	screenupb(buy2_Ar)
}
function buy3_buy(){
	buy3_Ar = buyprocess(buy3_Ar);
	screenup();
	screenupb(buy3_Ar)
}
//引数に応じてお金を増やす処理
function moredaller(dal){
	if (getrandm() < 16){
		daller = daller + dal[0]*dal[3]*10;
		alldaller = alldaller + dal[0]*dal[3]*10;
	} else{
		daller = daller + dal[0]*dal[3];
		alldaller = alldaller + dal[0]*dal[3];
	}
}

//1秒ごとに呼び出される処理用関数
function timeprocess() {
	//それぞれの購入したものの数に応じて増加する
	moredaller(buy1_Ar);
	moredaller(buy2_Ar);
	moredaller(buy3_Ar);
}
//クッキーに残しておきたい数字を保存する
/*
function savepoint() {
	let allcookie = document.cookie;
	allcookie = 'buy1_num=' + encodeURIComponent(buy1_Ar[0]);
	allcookie = 'buy2_num=' + encodeURIComponent(buy2_Ar[0]);
	allcookie = 'daller=' + encodeURIComponent(daller);
	console.log(allcookie);
}
*/
/*
//読み込み時にクッキーのデータを展開する
window.onload = function loadpoint(){
	let cookieitem = allcookie.split(";");
	for (i = 0; i < cookieitem.length; i++) {
		let elem = cookieitem[i].split("=");
		if (i/2 === 0){
		elem[i] = elem[i+1];
		}
	}
}
*/
//表示の更新
setInterval(screenup, intv);
//毎秒呼ぶ
setInterval(timeprocess, 50);
//オートセーブ
setInterval(savepoint, savetiming);