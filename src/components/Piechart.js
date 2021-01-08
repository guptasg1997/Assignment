import axios from 'axios'
import React, { Component } from 'react'
//import Highcharts from 'highcharts';
import Highcharts from "highcharts";
import Chart from "highcharts-react-official";
import { Table } from 'react-bootstrap'
import { Redirect  } from 'react-router-dom'
import { connect } from 'react-redux'


class Piechart extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             loading : true,
             progress : '',
        }
    }
    

    getValues(){
        axios
        .post("http://localhost:8000/piechart" , {
            id : this.props.location.aboutProps.id //get value from props
        },{
            headers: {
              'Authorization': `Bearer ${this.props.token}` 
            }
          })
        .then(response=>{
            console.log(response.data)
            this.setState ({
                loading : false,
                progress : response.data,
                options : {
                    //animation : {enabled : false},
                    tooltip: { enabled: false },
                    credits: { enabled: false },
                    chart: {
                        //allowPointSelect: false,
                        type: "pie",
                        //pinchType : 'none' ,
                        //zoomType : 'none',
                    },
                    // mapNavigation:{
                    //     enabled:false,
                    // },
                    legend: {
                        align: 'right',
                        verticalAlign: 'bottom',
                        layout: 'vertical',
                    },
                    title: {
                        text: 'Progress Status',
                    },
                    plotOptions: {
                        pie: {
                          dataLabels: {
                              enabled : false
                          },
                          showInLegend : true
                        }
                      },
                    series: [
                     {
                        states: {
                            hover : {enabled : false},
                            inactive : {opacity : 1},
                        },
                         animation:{duration : 0},
                         data:[
                            {
                                name: 'pending',
                                y: response.data.pending,
                                // color: '#3498db'
                              },
                              {
                                name: 'in_progress',
                                y: response.data.in_progress,
                                color: '#008000'
                              },
                              {
                                name: 'overdue',
                                y: response.data.overdue,
                                color: '#FF0000'
                              },
                              {
                                name: 'completed_on_time',
                                y: response.data.completed_on_time,
                             //    color: '#f1c40f'
                              },
                              {
                                name: 'completed_late',
                                y: response.data.completed_late,
                             //    color: '#f1c40f'
                              }
                         ]
                     }
                   ]
                 }
           })
            
        })
        .catch(error=> {

        })
    }

    // highChartsRender() {
    //     Highcharts.chart({
    //         chart: {
    //           type: 'pie',
    //           renderTo: 'progress'
    //         },
    //         title: {
    //           verticalAtdgn: 'middle',
    //           floating: true,
    //           text: 'Progress Statds',
    //           style: {
    //             fontSize: '10px',
    //           }
    //         },
    //         plotOptions: {
    //           pie: {
    //             dataLabels: {
    //                 format: '{point.name}: {point.percentage:.1f} %'
    //             },
    //             innerSize: '70%'
    //           }
    //         },
    //         series: this.state.series
    //     });
    // }

    componentDidMount(){
        this.getValues()
    }

    render() {
        if(!this.props.location.aboutProps){
            return(
                <Redirect to = "/admin/users"/>
            )
        }
        if(this.state.loading){
            return (<p>loading...</p>)
        }
        console.log(this.state.options)
        return (
            <div className = "text-left">
                <Chart highcharts={Highcharts} options={this.state.options} />

                <Table>
                    <thead>
                        <tr>
                            <th>pending</th>
                            <th>in progress</th>
                            <th>overdue</th>
                            <th>completed on time</th>
                            <th>completed late</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.state.progress.pending}</td>
                            <td>{this.state.progress.in_progress}</td>
                            <td>{this.state.progress.overdue}</td>
                            <td>{this.state.progress.completed_on_time}</td>
                            <td>{this.state.progress.completed_late}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        token :state.tokenReducer.token,
    }
}

export default connect(mapStateToProps)(Piechart)