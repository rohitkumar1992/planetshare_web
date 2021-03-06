import React from 'react';
import {SELLER_IMAGE_TAB_CONTENT,USERID,TAG,HEADER,VENDORID,SELLERIMAGECHANGESTATUS} from '../../../../url';
import {BrowserRouter, Router,Link,Route,Switch,HashRouter,Redirect} from "react-router-dom";
import axios from 'axios';
import Not_Found from '../../../../Component/not_found/not_found';
import $ from 'jquery';
import Tabs from '../tabs/tabs';
import Pagination from "react-js-pagination";
import LoadingGif from '../../../../Component/Loader/loading_gif'
import { ToastContainer, toast,cssTransition} from 'react-toastify';
import More from '../more_dots/more_dots';
const Zoom = cssTransition({
enter: 'zoomIn',
exit: 'zoomOut',
duration: 750,
});
const SELLER_HEADER = {
headers: {
 'Content-Type': 'application/json;charset=UTF-8',
 'Authorization':"Bearer " + localStorage.getItem('planetshare_web_token'),
}
};
class Asset extends React.Component{
  state={loading_msg:'Please Wait',isLoading:false,not_found:false,tab_index:4,tab_count:[],tab_data:[],tab_head:'INQUEUE',itemsCountPerPage:5,current_page:1,total_pages:1,pageRangeDisplayed:3,content_type:'image',
imgSelect:true,vidSelect:false
}
  componentDidMount()
  {
    this.getBidStatus();
  //this.getData(this.state.current_page,this.state.tab_index);
  }
  getBidStatus=()=>{
    this.setState({bid_status:true,isLoading:true})
  }
  getData=(page,tab_index)=>{
    axios.post(`${SELLER_IMAGE_TAB_CONTENT}?page=${page}`,{
      'user_id':localStorage.getItem('user_id'),
      'seller_id':localStorage.getItem('seller_id'),
      'tag':TAG,
      'limit':this.state.itemsCountPerPage,
      'tab_index':tab_index,
      'content_type':this.state.content_type
    },SELLER_HEADER).then((res)=>{
      if(res.data.success==1)
      {
        var response=res.data;
        this.setState({current_page:response.tab_data.current_page,tab_count:response.tabs,tab_data:response.tab_data.data,total_pages:response.tab_data.total})
          setTimeout(()=>this.setState({isLoading:true}),1000)
      }
      else {

      }
    }).catch((error)=>{

    });
  }
  handlePageChange=(pageNumber)=>{
    this.setState({current_page: pageNumber},function()
  {
    this.getData(pageNumber,this.state.tab_index)
  });
  }
  changeTab=(tab_index,tab_head)=>{
    this.setState({current_page:1,tab_index:tab_index,tab_head:tab_head},function()
  {
     this.getData(1,tab_index)
  })
  }
  changeStatus=(status,cat_id)=>{
    axios.post(SELLERIMAGECHANGESTATUS,{
      'seller_id':localStorage.getItem('seller_id'),
      'user_id':localStorage.getItem('user_id'),
      'tag':TAG,
      'status':status,
      'cat_id':cat_id,
      'content_type':this.state.content_type
    },SELLER_HEADER).then((res,key)=>{
      if(res.data.success==1)
      {
        this.getData(this.state.current_page,this.state.tab_index);
      }
      else {
        toast('Something Went Wrong',{ transition: Zoom,});
      }
    }).catch((error)=>{

    })
  }
  sellerAssetRole=(e)=>{
    var role=e.target.value;
    if(role=="I")
    {
          this.setState({imgSelect:true,vidSelect:false,content_type:'image',current_page:1,tab_index:4,isLoading:false,tab_head:'INQUEUE'},function()
        {
          this.getData(1,4)
        })
      return false;
    }
    if(role=="V")
    {
  this.setState({imgSelect:false,vidSelect:true,content_type:'video',current_page:1,tab_index:4,isLoading:false,tab_head:'INQUEUE'},function()
    {
      this.getData(1,4)
    });
    return false;
    }
  }
  sellerAssetAction=(e)=>{
    var role=e.target.value;
    if(role=="I")
    {
      this.props.history.push('/dashboard/seller/add_asset/image');
      return false;
    }
    if(role=="V")
    {
      this.props.history.push('/dashboard/seller/add_asset/video')
      return false;
    }
    else {
      this.props.history.push('/dashboard/seller')
    }
  }
  render()
  {
    const {bid_status,isLoading,not_found,tab_data,tab_head,content_type,tab_index,loading_msg}=this.state;

    if(!not_found)
    {
      if(isLoading)
      {
      return(<div><section class="dashb_cont">
        <div class="container">
            <div class="db_cont_head">
                <h2>Assets</h2>
                <h3>
                    Accepting Customer Orders
                    <label class="switch">
                        <input type="checkbox"/>
                        <span class="slider round"></span>
                    </label>
                </h3>
            </div>
            <Tabs tabData={this.state.tab_count} tab_index={this.state.tab_index} sellerAssetAction={this.sellerAssetAction} {...this.props} changeTab={this.changeTab.bind(this)}/>
            <div class="db_tab_cont top_div">
                <div class="tab-content">
                    <div class="tab-pane active" id="gigactive">
                        <div class="table-responsive">
                            <table class="table table-hover gigactive top_div">
                                <thead>
                                    <tr>
                                        <th colspan="5"><span class="title">{tab_head} Assets</span></th>
                                        {(tab_index==4  && tab_data.length>0)&& <th colspan="5"><span class="title">Select {this.state.content_type} to upload content</span></th>}
                                        <th colspan="6">
                                            <select onChange={this.sellerAssetRole}>
                                                <option selected={this.state.imgSelect} value="I">Images</option>
                                                <option value="V" selected={this.state.vidSelect}>Videos</option>
                                            </select>
                                        </th>
                                    </tr>
                                </thead>
                           <tbody>
                                    <tr>
                                        <th>
                                            <label class="checkbox_fake">
                                                <input type="checkbox" />
                                                <span><i class="fa fa-check-square" aria-hidden="true"></i></span>
                                            </label>
                                        </th>
                                        <th colspan="3">Asset</th>
                                        <th><span data-toggle="tooltip" title="Total number of impressions this Gig received on Planetshare in the last 30 days">Impressions</span></th>
                                        <th><span data-toggle="tooltip" title="Total number of downloads this Gig received in the last 30 days">Downloads</span></th>
                                        <th><span data-toggle="tooltip" title="Total number of page views this Gig received in the last 30 days">Views</span></th>
                                        <th><span data-toggle="tooltip" title="Total number of orders from this Gig in the last 30 days">Orders</span></th>
                                        <th><span data-toggle="tooltip" title="Cancellation rate: Number of cancelled orders divided by the number of orders from this Gig in the last 30 days">Cancellations</span></th>
                                        <th colspan="2"></th>
                                    </tr>
                                    {(isLoading && tab_data.length>0) && tab_data.map((res,key)=>{
                                        return( <tr class="accordion" key={key} class="top_div">
                                            <td>
                                                <label class="checkbox_fake">
                                                    <input type="checkbox" />
                                                    <span><i class="fa fa-check-square" aria-hidden="true"></i></span>
                                                </label>
                                            </td>
                                            <td>
                                                {tab_index!=4 && <div class="img">
                                                     <img src={res.large_thumb!=null?res.large_thumb:"/images/user_hover.svg"} alt="" />
                                                </div>}
                                                {tab_index==4 && <div class="img">
                                                     <Link to={content_type=="image"?`/dashboard/seller/add_asset/imagedesc/${res.id}`:`/dashboard/seller/add_asset/videodesc/${res.id}`}><img src={res.large_thumb!=null?res.large_thumb:"/images/user_hover.svg"} alt="" /></Link>
                                                </div>}
                                            </td>
                                            <td>
                                                <div class="link">
                                                       <a href="javascript:">{res.title}</a>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td>0 <i class="fa fa-long-arrow-up blue"></i></td>
                                            <td>{res.total_buy}</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0%</td>
                                            <td></td>
                                            <td>
                                              {(tab_data.length>0 && tab_index!=4) && <More tab_index={this.state.tab_index} changeStatus={this.changeStatus} service_id={res.id}/>}
                                            </td>
                                            </tr>)
                                    })}
                                    {!isLoading && <tr><td colspan="11" class="text-center" ><LoadingGif message={loading_msg}/></td></tr>}
                                  {/*  <tr class="accordion" >
                                        <td>
                                            <label class="checkbox_fake">
                                                <input type="checkbox" />
                                                <span><i class="fa fa-check-square" aria-hidden="true"></i></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div class="img">
                                                <img src="images/seller_icon.jpg" alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            <div class="link">
                                                <a href="javascript:;">do best in dubbing services in india as well as abrod</a>
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>0 <i class="fa fa-long-arrow-up blue"></i></td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0%</td>
                                        <td></td>
                                        <td>
                                            <div class="dropdown">
                                              <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-angle-down" aria-hidden="true"></i></button>
                                              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                  <a class="dropdown-item" href="javascript:;">Preview</a>
                                                  <a class="dropdown-item" href="javascript:;">Edit</a>
                                                  <a class="dropdown-item" href="javascript;;">Share</a>
                                                  <a class="dropdown-item" href="javascript;;">Pause</a>
                                                  <a class="dropdown-item" href="javascript;;">Delete</a>
                                                  <a class="dropdown-item" href="javascript;;">Add Video</a>
                                                  <a class="dropdown-item" href="javascript;;"><input type="checkbox" /> Live Portfolio</a>
                                              </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr class="accordion">
                                        <td>
                                            <label class="checkbox_fake">
                                                <input type="checkbox" />
                                                <span><i class="fa fa-check-square" aria-hidden="true"></i></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div class="img">
                                                <img src="images/seller_icon.jpg" alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            <div class="link">
                                                <a href="javascript:;">do best in dubbing services in india as well as abrod</a>
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>0 <i class="fa fa-long-arrow-up blue"></i></td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0%</td>
                                        <td></td>
                                        <td>
                                            <div class="dropdown">
                                              <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-angle-down" aria-hidden="true"></i></button>
                                              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                  <a class="dropdown-item" href="javascript:;">Preview</a>
                                                  <a class="dropdown-item" href="javascript:;">Edit</a>
                                                  <a class="dropdown-item" href="javascript;;">Share</a>
                                                  <a class="dropdown-item" href="javascript;;">Pause</a>
                                                  <a class="dropdown-item" href="javascript;;">Delete</a>
                                                  <a class="dropdown-item" href="javascript;;">Add Video</a>
                                                  <a class="dropdown-item" href="javascript;;"><input type="checkbox" /> Live Portfolio</a>
                                              </div>
                                            </div>
                                        </td>
                                    </tr>*/}
                                </tbody>
                            </table>
                            <Pagination
                                activePage={this.state.current_page}
                                itemsCountPerPage={this.state.itemsCountPerPage}
                                totalItemsCount={this.state.total_pages}
                                pageRangeDisplayed={this.state.pageRangeDisplayed}
                                onChange={this.handlePageChange}
                                itemClass='page-item'
                                linkClass="page-link bold"
                                    />
                        </div>
                    </div>

                    <div class="clearfix"></div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
      </section>
  </div>
  )
    }
    else {
      return(<LoadingGif message={loading_msg}/>)
    }
  }
    else {
      return(<Not_Found/>)
    }
  }
}
export default Asset;
