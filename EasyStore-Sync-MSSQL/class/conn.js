const mssql = require("mssql");

function Conn(config={}){
    this.query = (sql) => {
        return new Promise((resolve, reject)=>{
            mssql.connect(config)
                .then(()=>{
                    let req = new mssql.Request().query(sql)
                                .then(recordset=>resolve(recordset))
                                .catch(err=>reject(err));
                })
                .catch(err=>reject(err));
        })
    }
}

module.exports = Conn;