
/*
	------------------------------------------------------------------------------------------------
	v0.8.1
	√[fixed] amount convert error
	ex: "1,212" need replace "," to empty
	
	By: 0xCooL
	------------------------------------------------------------------------------------------------
	v0.9.0
	
	√[add] new property - grades(star level)
	√[add] new property - cp(cost–performance ratio), formula： (power_price-over_pay) + 1
	√[add] new property - bid_time
	√[add] new property - url
	
	By: 0xCooL
	------------------------------------------------------------------------------------------------
	v1.0.0
	
	√[add] new property - unlock (unlock day)
	√[add] sorting function (type: asc|desc, by: grades, value, price, power, over_pay, power_price, cp, bit_time, unlock)
	√[add] default filter, sorting
	
	
	√[fix] if just setting sort.by or sort.type will not work
	√[fix] if unlock day 0, will NaN value
	√[update] filter will any properties setting
	√[add] auto scroll
	√[add] auto alert and scan search 
		  refer: 
		  https://blog.csdn.net/ainu2919/article/details/102037343
		  https://stackoverflow.com/questions/14944699/accessing-the-document-object-of-a-frame-with-javascript
		  https://developer.mozilla.org/en-US/docs/Web/API/Window/frames
	
	
	[bug] found the unlock day was not match will currently unlock day
	
	By: 0xCooL
	------------------------------------------------------------------------------------------------
	v1.0.9
	
	√[update] can enable or disable auto scan mode
	√[fix] found match condition NFTs, if auto scan mode "on", still will continue auto scan
	√[edit] seach.auto true|false → "on"|"off"
	√[fix] bid_time convert more than 1day the base ratio not same (24hours x 60min or 60s)
	√[update] options setting "bid_time", suppport string (ex: "01:23:59:59")
	√[fix] bid_time sorting not work, need convert other data type (int)
	√[update] change alert to browser Web API Notification
			refer:
			https://developer.mozilla.org/en-US/docs/Web/API/Notification
	
	√[update] automatic scanning able choice work between "Market" or "Auction" or both
	√[update] "options.search: scroll, swap, reload" able use string to setting (ex: "01:00", meaning 60s)
	√[update] split reload to between ("Market" or "Auction") and "full page" (scanner)
			(add new property "swap" int)
	√[add] options new property "count" for output console, reloaded how many time
	
	By: 0xCooL
	------------------------------------------------------------------------------------------------
	v1.1.2
	
	[update] notify albe to set countdown reminder
	[add] control frontend UI display will filter & sorting list
	[update] re-build structure OOP function and code
	
	
	[fix] "setTimeout" cause out of memory problem (need research)
	[update] will multiple condition sorting method (need test)
	
	By: 0xCooL
	------------------------------------------------------------------------------------------------
	v1.2.0 (Immediate; Remove Simulate)
	
	[transplant] to chrome extension (is work?)
	
	
	[update] fetch from api, not need simulate (maybe need spam )
	
	By: 0xCooL
	------------------------------------------------------------------------------------------------
*/

function POSI_NFT(id, grade, unlock="Unknow", value, price, power, bid_time="", url=""){
	this.id = id;
	//	will call function and setting
	this.grade = -1;
	this.grade_name = grade;
	this.unlock = unlock;
	this.value = value;
	this.price = price;
	this.power = power;
	this.over_pay = price/value;
	this.power_price = power/price;
	this.cp = (this.power_price-this.over_pay)+1;
	this.bid_time = -1;
	this.url = url;
	
	this.getGradeLevel = (grade)=>{
		switch(grade){
			case "farmer":
				return 1;
			case "janitor":
				return 2;
			case "accountant":
				return 3;
			case "engineer":
				return 4;
			case "pilot":
				return 5;
			case "boss":
				return 6;
		}
	}
	
	this.getStar = (grade)=>{
		switch(grade){
			case "farmer":
				return "⭐";
			case "janitor":
				return "⭐⭐";
			case "accountant":
				return "⭐⭐⭐";
			case "engineer":
				return "⭐⭐⭐⭐";
			case "pilot":
				return "⭐⭐⭐⭐⭐";
			case "boss":
				return "⭐⭐⭐⭐⭐⭐";
		}
	}
	
	//	string → int
	this.convertBidTime = (str)=>{
		//	convert to total second (int)
		let total = 0;
		let arr = str.split(":");
		let base = 1;
		
		for(let i=arr.length-1; i>=0; i--){
			total += (arr[i]*base);
			base *= (arr.length>=4 && i==1)? 24: 60;
		}
		
		return total;
	}
	
	//	int → string
	this.bidTimeString = (time)=>{
		//	convert second to readable time (string)
		let arr = [];
		
		while(time>0){
			let remain = arr.length>=2? time%24: time%60;
			
			arr.unshift(remain<10? "0"+remain: ""+remain);
			time = ~~(arr.length>=3? time/24: time/60);
		}
		
		return arr.join(":");
	}
	
	//	type = "console"|"notify"
	this.showInformation = (type="notify")=>{
		let line = "------------------------------\n";
		let message = "";
		let over_pay_str = (this.over_pay*100).toFixed(2)+" %";
		let power_price_str = (this.power_price*100).toFixed(2)+" %";
		let cp_str = (this.cp*100).toFixed(2)+" %";
		
		if(type=="console"){
			message += line;
			message += `ID: ${this.id}\n`;
			message += `Grade: ${this.getStar(this.grade_name)}(${this.grade_name})\n`;
			message += `Unlock: ${this.unlock} ${this.unlock>1? "Days": "Day"}\n\n`;
			
			message += `Value: ${this.value}\n`;
			message += `Price: ${this.price}\n`;
			message += `Power: ${this.power}\n\n`;
			
			message += `Over Pay: ${over_pay_str}\n`;
			message += `Power Price: ${power_price_str}\n`;
			message += `CP Ratio: ${cp_str}\n\n`;
			
			message += `${this.bid_time==0? "Purchase: Now": "Bit Time: "+this.bidTimeString(this.bid_time)}\n`;
			message += `URL: ${this.url}\n`;
			message += line;
		}
		//	desktop default just show in 5 lines
		else if(type="notify"){
			message += `Grade: ${this.getStar(this.grade_name)}(${this.grade_name})\n`;
			message += `Value: ${this.value}, Price: ${this.price}, Power: ${this.power}\n`;
			message += `CP_Ratio: ${cp_str}, Over Pay: ${over_pay_str}, Power Price: ${power_price_str}\n`;
		}
		
		return message;
	}
	
	//	need define function first
	this.grade = this.getGradeLevel(grade);
	this.bid_time = bid_time==""? 0: this.convertBidTime(bid_time);
	return this;
}

/*
	[not need filter list]
		id 
		grade_name (grade instead)
		unlock not need first(data not match)
		url 
	
	√[filter list]
		grade >=
		value <= | >=
		price <= | >=
		power >=
		over_pay <=
		power_price >=
		cp >=
		bid_time <=
*/
let filterList = (list, options)=>{
	let getCondition = (property)=>{
		let condition = "max";
		let type = property.substr(property.lastIndexOf("_")+1);
		
		//	custom setting with last word = "min" or "max"
		if(type=="min" || type=="max")
			condition = type;
		//	default ">=" or "<=" (custom setting don't exist "min" or "max")
		else{
			if(["grade", "power", "power_price", "cp"].includes(property))
				condition = "min";
			else if(["value", "price", "over_pay", "bid_time"].includes(property))
				condition = "max";
			else
				console.error("Not define filter!");
		}
		
		return condition;
	}
	
	
	for(let property in options)
		if(property!="sort" && property!="search"){
			let condition = getCondition(property);
			let value = options[property];
			//	replace "_min" & "_max"
			property = property.replace("_min", "").replace("_max", "");
			
			//	adjust value
			if(property.includes("over_pay") || property.includes("power_price") || property.includes("cp"))
				value /= 100;
			
			if(condition=="min")
				list = list.filter(item => item[property] >= value);
			else if(condition=="max")
				list = list.filter(item => item[property] <= value);
			else
				console.error("Not define filter!");
		}
	return list;
}

let sortingList = (list, options)=>{
	let type = options.sort.type;
	let by = options.sort.by;
	
	list.sort((a,b) => type=="desc"? b[by]-a[by]: a[by]-b[by]);
	return list;
}

//	selector - 
let getGrade = (src)=>{
	return src.substr(src.lastIndexOf("/")+1).split(".")[0];
}

let getSearchMode = (type)=>{
	return type%2==0? "auction": "market";
}

let getSearchType = (mode)=>{
	switch(mode){
		case "auction":
			return 0;
		case "market":
			return 1;
		case "auction|market":
			return 2;
		case "market|auction":
			return 2;
		//	initial
		default:
			return -1;
	}
}

//	default options filter and sorting
let getOptions = ()=>{
	return {
		//	count of the total reload time
		count: 0,
		
		//	auto search setting
		search: {
			mode: "auction|market",
			//	type: 0="auction", 1="market", 2=both
			type: 2,
			auto: "on",
			
			//	delay (minisecond) 5s, 5s, 60s
			scroll: 5000,
			swap: 5000,
			reload: 60000
		},
		
		//	property value setting
		grade_min: 1,
		grade_max: 6,
		
		value_min: 10,
		value_max: Infinity,
		
		price_min: 10,
		price_max: Infinity,
		
		power_min: -1,
		power_max: Infinity,
		
		over_pay_min: -1,
		over_pay_max: 120,
		
		power_price_min: 120,
		power_price_max: Infinity,
		
		cp_min: 120,
		cp_max: Infinity,
		
		bid_time_min: -1,
		//	1 day convert to second (24 * 60 * 60)
		bid_time_max: 86400,
		
		//	sorting & type setting
		sort: {
			by: "cp", 
			type: "desc"
		}
	}
};

//	config options setting
let config = (settings)=>{
	//	get default options setting
	let options = getOptions();
	//	setting custom options
	for(let property in settings){
		//	custom sort setting handle
		if(property=="sort"){
			if(typeof(settings.sort)=="object"){
				if(settings.sort.by!=null)
					options[property].by = settings.sort.by;
				if(settings.sort.type!=null)
					options[property].type = settings.sort.type;
			}
			
			continue;
		}
		else if(property=="search"){
			if(typeof(settings.search)=="object"){
				//	** able to simplify will for in (?)
				if(settings.search.mode!=null){
					options[property].mode = settings.search.mode;
					options.search.type = getSearchType(settings.search.mode);
				}
				//	custom search.type will priority (reset again)
				if(settings.search.type!=null)
					options[property].type = settings.search.type;
				if(settings.search.auto!=null)
					options[property].auto = settings.search.auto;
				if(settings.search.scroll!=null){
					if(typeof(settings.search.scroll)=="string")
						options[property].scroll = 1000 * new POSI_NFT().convertBidTime(settings.search.scroll);
					else
						options[property].scroll = settings.search.scroll;
				}
				if(settings.search.swap!=null){
					if(typeof(settings.search.swap)=="string")
						options[property].swap = 1000 * new POSI_NFT().convertBidTime(settings.search.swap);
					else
						options[property].swap = settings.search.swap;
				}
				if(settings.search.reload!=null){
					if(typeof(settings.search.reload)=="string")
						options[property].reload = 1000 * new POSI_NFT().convertBidTime(settings.search.reload);
					else
						options[property].reload = settings.search.reload;
				}
			}
			
			continue;
		}
		else if(property=="grade" || property=="power" || property=="power_price" || property=="cp")
			delete options[property+"_min"];
		else if(property=="value" || property=="price" || property=="over_pay" || property=="bid_time")
			delete options[property+"_max"];
		
		//	bid_time setting handle
		if(property.includes("bid_time") && typeof(settings[property])=="string")
			settings[property] = new POSI_NFT().convertBidTime(settings[property]);
		
		options[property] = settings[property];
	}
	
	return options;
}

//	parameter → POSI_NFT[]
let notify = (list)=>{
	//	notify in console
	for(let item of list)
		console.log(item.showInformation("console"));
	
	if(!("Notification" in window))
		alert(`found ${sorting_list.length} nft match with the setting condition`);
	//	request notification and send
	else if(Notification.permission !== "denied"){
		Notification.requestPermission()
			.then((permission)=>{
				if(permission === "granted"){
					for(let item of list){
						let message = item.showInformation("notify");
						let notification = new Notification(message);
						
						notification.onclick = (event)=>{
							// prevent the browser from focusing the Notification's tab
							event.preventDefault();
							window.open(item.url, "_blank");
						}
					}
				}
			});
	}
	else if(Notification.permission !== "granted"){
		for(let item of list){
			let message = item.showInformation("notify");
			let notification = new Notification(message);
			
			notification.onclick = (event)=>{
				// prevent the browser from focusing the Notification's tab
				event.preventDefault();
				window.open(item.url, "_blank");
			}
		}
	}
}

let buildList = (options)=>{
	let frame_doc = getFrameDocument()
	let links = frame_doc.querySelectorAll("#auction-list a, #market-list a");
	let nfts = frame_doc.querySelectorAll("#auction-list a>div, #market-list a>div");
	let type = getSearchMode(options.search.type);
	let list = [];
	
	for(let i=0; i<nfts.length; i++){
		let information = type=="auction"? nfts[i].querySelectorAll("div:nth-child(2)")[1]: nfts[i].querySelector("div:nth-child(2)");
		let id = information.querySelector("div:nth-child(1) p").innerText;
		let grade = getGrade(nfts[i].querySelector("div:nth-child(1)>img").src);
		let unlock = parseInt(information.querySelector("div:nth-child(1) p:nth-child(2) span").innerText) || 0;
		let value = parseFloat(information.querySelector(`div:nth-child(${type=="auction"? "5":"4"}) > p:nth-child(2)`).innerText.replace(/,/g, ""));
		let price = parseFloat(information.querySelector(`div:nth-child(3) > div > div`).innerText.replace(/,/g, ""));
		let power = parseFloat(information.querySelector(`div:nth-child(${type=="auction"? "6":"5"}) > p:nth-child(2)`).innerText.replace(/,/g, ""));
		let bid_time = type=="auction"? nfts[i].querySelector("div:nth-child(1) > div > div").innerText.replace(/ /g, ""): "";
		let url = links[i].href;
		
		let posi_nft = new POSI_NFT(id, grade, unlock, value, price, power, bid_time, url);
	//	posi_nft.showInformation();
		list.push(posi_nft);
	}
	
	console.log("Items List: ");
	console.log(list);
	
	let filter_list = filterList(list, options);
	let sorting_list = sortingList(filter_list, options);
	
	console.log(`Total match results: ${sorting_list.length} NFT`);
	//	notify, if found match with the setting condition
	if(sorting_list.length)
		notify(sorting_list);
	
	//	auto reload, if "on"
	if(options.search.auto=="on"){
		let delay = options.search.reload;
		
		//	if options.search.mode = both, swap from "auction" or "market"
		if(options.search.type>=2){
			options.search.type += 1;
			
			//	from "auction|market" swap to "market|auction"
			if(options.search.type%2==1){
				delay = options.search.swap;
				options.count += 1;
			}
		}
		
		reload(options, delay, options.search.type);
	}
}

let reload = (settings={}, delay=5000, count=1)=>{
	let options = config(settings);
	let url = location.href.substr(0, location.href.lastIndexOf('/')+1)+getSearchMode(options.search.type);
	let frame = `<frameset cols="*">
				  <frame src="${url}" />
				 </frameset>
				`;
	
	with(document){
		write(frame);
		void(close());
	}
	
	setTimeout(()=>{
		scan(options);
	}, delay);
	
	console.log(`${options.count+1}) Reload Datetime: `);
	console.log(new Date());
	console.log("Options Setting: ");
	console.log(options);
}

let getFrameDocument = ()=>{
	let frame = document.getElementsByTagName("frame")[0];
	let frame_document = frame.contentDocument || frame.contentWindow.document;
	
	return frame_document;
}

let scan = (settings={}, nfts_length=-1)=>{
	let frame_doc = getFrameDocument();
	let len = frame_doc.querySelectorAll("#auction-list a>div, #market-list a>div").length;
	let options = config(settings);
	//	current browser height
	let cur_h = frame_doc.body.clientHeight;
	
	console.log(`Scaning: `);
	console.log(`nfts_length: ${nfts_length}, len: ${len}`);
	
	//	loaded all nft, back to the top
	if(nfts_length==len && len!=0){
		window.frames[0].scroll(0, 0);
		return buildList(options);
	}
	
	window.frames[0].scroll(0, cur_h);
	setTimeout(()=>{
		scan(options, len);
	}, options.search.scroll);
}

reload({
	search: {
		mode: "auction|market",
		auto: "on",
		reload: "01:00"
	},
	
	power_price: 130,
	cp: 135,
	bid_time: "23:59:59",
	
	sort: {
		by: "cp",
		type: "desc"
	}
});
