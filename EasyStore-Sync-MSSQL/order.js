/*
    refer API: https://documenter.getpostman.com/view/8990390/TzRYc4mn#641836f2-a03f-42d3-92b5-4156504386ac
    (3.0 → Order → [GET] Retrieve a list of orders)

    [attention] some situation - refund, financial_status(paid, unpaid, etc) need special handling (qty, amount, etc)

        Future Update
    [optimize] able to set URL request parameter "processed_at_min" (ex: 2019-11-28 08:21:21) to filter
*/
const axios = require('axios');
const fs = require('fs');

function Handle(){
    this.buildUrl = (shop_domain, page=1, limit=50) => 
        `https://${shop_domain}/api/3.0/orders.json?page=${page}&limit=${limit}`;

    this.buildConfig = (url, access_token) => {
        return {
            method: 'get',
            url: url,
            headers: { 
                'EasyStore-Access-Token': access_token
            }
        }
    }
    

    this.shop_domain = fs.readFileSync('setting/shop_domain.txt');;
    this.access_token = fs.readFileSync('setting/access_token.txt');
    //  default maximum orders item: 50
    this.limit = 50;
    this.url = this.buildUrl(this.shop_domain, 1, this.limit);
    this.config = this.buildConfig(this.url, this.access_token);
    this.order_list = [];


    this.getData = async(is_filter=false, current_page=1, page_length=-1) => {
        //  just get these properties (too many properties, filter out some)
        let properties = [
            //  basic information & currency exchange
            'order_number', 'email', 'customer_id', 'customer', 'currency_code', 'exchange_rate', 'subtotal_price', 
            //  amount
            'total_shipping_fee', 'total_discount', 'total_tax', 'total_transaction_fee', 'total_amount', 'total_amount_include_transaction', 
            'total_shipping', 'total_line_item_price', 'total_price', 
            //  status
            'financial_status', 'fulfillment_status',
            //  items - array data type
            'line_items', 'refunds', 'tax_line', 'shipping_fees', 'fulfillments', 'transactions', 'discount_applications', 'discount_codes', 
            //  boolean
            'taxes_included', 'is_cancelled', 'is_archived', 
            //  address
            'billing_address', 'shipping_address', 'pickup_address',
            //  datetime
            'created_at', 'updated_at', 'processed_at', 'cancelled_at',
            //  remark | note
            'remark', 'note'
        ];
        
        //  rebuild this.url & this.config for request
        this.url = this.buildUrl(this.shop_domain, current_page, this.limit);
        this.config = this.buildConfig(this.url, this.access_token);

        let result = await axios(this.config);
        let data = result.data;
        let orders = data.orders;
        
        //  show current page data (include all properties)
        // console.log(data);

        //  get page length (end recursion function)
        if(page_length==-1)
            page_length = data.page_count;

        /*
            [filter property] if is_filter = true

            get data[property] in properties variable
            i = orders[index], j = orders[i][properties[index]]
        */
        if(is_filter){
            for(let i=0; i<orders.length; i++){
                let obj = {};

                for(let j=0; j<properties.length; j++)
                    obj[properties[j]] = orders[i][properties[j]];
                
                this.order_list.push(obj);
            }
        }
        /*
            put all properties to order_list
        */
        else{
            for(let i=0; i<orders.length; i++)
                this.order_list.push(orders[i]);
        }

        //  loaded all order list, return result
        if(current_page == page_length)
            return this.order_list;
        //  move to next page
        else
            this.getData(is_filter, current_page + 1, page_length);
    }

    //  delay, 60000 ms = 60 second
    this.delay = (ms=60000) => {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

    //  get currently datetime
    this.now = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = (date.getMonth()+1)<10? '0'+(date.getMonth()+1): (date.getMonth()+1);
        let days = date.getDate()<10? '0'+date.getDate(): date.getDate();
        let hours = date.getHours()<10? '0'+date.getHours(): date.getHours();
        let minute = date.getMinutes()<10? '0'+date.getMinutes(): date.getMinutes();
        let second = date.getSeconds()<10? '0'+date.getSeconds(): date.getSeconds();
        
        return `${year}-${month}-${days} ${hours}:${minute}:${second}`;
    }

    //  looper function, 
    this.loop = async() => {
        let data_list = await this.getData();
        let datetime = this.now();

        /*
            [For refer only] write order_list to json file
        */
        //  replace all ":" to "" (file unable rename with ":" char)
        let filepath = `order/${datetime.replace(/:/g, "")}.json`;
        fs.writeFileSync(filepath, JSON.stringify(data_list, null, 2));
        console.log(`[${datetime}] Finish ouput order list to '${filepath}' `);

        /*
            [Standard] write order_list to database
        */
        //   coding...Orz

        //  clear this.order_list data
        this.order_list = [];
        //  default delay 60s (60 * 1000ms), able reduce to set smaller value, but need more "CPU process" and "Network request"
        await this.delay(60 * 1000);
        this.loop();
    }

    return this;
}

let handle = new Handle();
handle.loop();
