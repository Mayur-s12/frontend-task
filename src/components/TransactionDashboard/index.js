
import { Component } from "react";
import axios from "axios"
import { TailSpin } from 'react-loader-spinner'
import {BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer,CartesianGrid} from "recharts"


import TableBody from "./TableBody/index"

import "./index.css"

const monthsList=[
    {
        id:"01",
        month:"January"
    },
    {
        id:"02",
        month:"February"
    },
    {
        id:"03",
        month:"March",
    },
    {
        id:"04",
        month:"April"
    },
    {
        id:"05",
        month:"May"
    },
    {
        id:"06",
        month:"June"
    },
    {
        id:"07",
        month:"July"
    },
    {
        id:"08",
        month:"August"
    },
    {
        id:"09",
        month:"September"
    },
    {
        id:"10",
        month:"October"
    },
    {
        id:"11",
        month:"November"
    },
    {
        id:"12",
        month:"December"
    }
]


class TransactionDashboard extends Component{
    state={activeMonthId:"03", allTransactions:[], activeSearch:"", pageNo:1, apiStatus:false, noData:false, statsData:"", barData:""}

    componentDidMount(){
        this.getTransApi()
        this.onClickNext()
        this.getStatsApi()
        this.getBarApi()
       
    }

    onChangeInput=(event)=>{
        this.setState({activeMonthId:event.target.value},this.apiRender)
    }

    apiRender=()=>{
        this.getTransApi()
        this.getStatsApi()
        this.getBarApi()
    }

    onChangeSearch=(event)=>{
        this.setState({activeSearch:event.target.value, pageNo:1},this.getTransApi)
    }

    onClickPrev=()=>{
        const {pageNo}=this.state 
        if(pageNo>1){
            this.setState(prevState=>({pageNo:prevState.pageNo - 1}),this.getTransApi)
        }
        
    }

    onClickNext=()=>{
        const {allTransactions}=this.state
        if(allTransactions.length>0){
            this.setState(prevState=>({pageNo:prevState.pageNo + 1}),this.getTransApi)
        }
        
    }

    getTransApi = async () => {
        this.setState({apiStatus:false})

        const {activeMonthId, activeSearch, pageNo}=this.state

        console.log(activeSearch)
        try {
            const response = await axios.get(`https://back-su03.onrender.com/transactions/?search_q=${activeSearch}&page=${pageNo}&month=${activeMonthId}`);
            const myData=response.data
            this.setState({allTransactions:myData, apiStatus:true})

            if(myData.length<1){
                this.setState({noData:true})
            }else{
                this.setState({noData:false})
            }

          } catch (error) {
            console.error('Error fetching data:', error);
          }
      };

    getStatsApi=async()=>{
        const {activeMonthId}=this.state
        console.log(activeMonthId)
        try {
            const response = await axios.get(`https://back-su03.onrender.com/statistics/?month=${activeMonthId}`); 
            const stats=response.data 
            console.log(stats)
            const updatedData=({
                totalSale: stats.totalSales.total_sale,
                sold:stats.totalSales.total_sold,
                unsold:stats.unsold.total_unsold
            })

            this.setState({statsData:updatedData})
          } catch (error) {
            console.log(error);
          }
    }

    getBarApi=async()=>{
        const {activeMonthId}=this.state
        console.log(activeMonthId)
        const response= await axios.get(`https://back-su03.onrender.com/barchart/?month=${activeMonthId}`)
        const bar=response.data
        const updatedBar=bar.map(each=>({
            range:each.price_range,
            count:each.count
        }))

        this.setState({barData:updatedBar})
    }

    loadingView=()=>
        <TailSpin color="#ffd978" height={50} />
    
    switchMonth=()=>{
        const {activeMonthId}=this.state
        switch(activeMonthId){
            case "01":
                return "January"
            case "02":
             return "February" 
            case "03":
                return "March"
            case "04":     
                return "April"
            case "05":
                return "May"
            case "06":
             return "June" 
            case "07":
                return "July"
            case "08":     
                return "August"
            case "09":
                return "September"
            case "10":
             return "October" 
            case "11":
                return "November"
            case "12":     
                return "December"
            default:
                return null;
        }
    }

    render(){
        const {allTransactions,pageNo, apiStatus, noData, statsData, barData}=this.state 
        const {totalSale,sold,unsold} =statsData
        console.log(totalSale)
        return(
            <div className="bg-container-main">
                <div className="heading-div">
                <div className="oval-head">
                    <h1 className="main-heading">Transaction Dashboard</h1>
                </div>
                </div>
                <div className="search-select">
                    <div>
                        <input type="search" placeholder="search transaction" className="search" onChange={this.onChangeSearch}/>
                    </div>
                    <div className="select-div">
                        <select defaultValue="03" onChange={this.onChangeInput} className="select">
                            {monthsList.map(each=><option  key={each.id} value={each.id}>{each.month}</option>)}
                        </select>
                    </div>
                </div>
                {apiStatus? 
                <table className="table-div">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Sold</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
               {allTransactions.map(each=><TableBody noData={noData} allTransactions={allTransactions} key={each.id} items={each}/>)}
            </tbody> 
            </table> : <div>{this.loadingView()}</div> }

            <p>{noData?"No More Data" : ""}</p>
                <div className="disp-div-pageNo">
                    <p className="page-no">Page {pageNo}</p>
                    <div className="disp-button">
                    <button onClick={this.onClickPrev} className="btn-class">{"<"} Previous</button>
                    <p>-</p>
                    <button onClick={this.onClickNext} className="btn-class">Next {">"}</button>
                    </div>
                </div>

                <div className="stats-class">
                    <h3>Statistics - {this.switchMonth()}</h3>
                
                    <div className="stats-div">
                        <p>Total Sale - {totalSale}</p>
                        <p>Total Sold Item - {sold}</p>
                        <p>Total Unsold  - {unsold}</p>
                    </div>
                </div>
                <div className="chart-container">
                <h3>Transactions Bar Chart - {this.switchMonth()}</h3>
                </div>
            <ResponsiveContainer width="80%" height={400} marginBottom={150}>
                <BarChart
                width={50}
                height={300}
                data={barData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                
                <XAxis dataKey="range" />
                <YAxis dataKey="count"/>
                <CartesianGrid strokeDasharray="3" />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" barSize={70}/>
                </BarChart>
            </ResponsiveContainer>
            
            </div>
        )
    }
}

export default TransactionDashboard