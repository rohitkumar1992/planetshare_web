import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import {USERID,TAG,HEADER,VENDORID,SELLERVIDEOUPLOAD} from '../../../../url';
import {Link,withRouter} from "react-router-dom";
import { History } from "react-router"
import Progress from './progressbar';
import LoadingGif from '../../../../Component/Loader/loading_gif'
import { ToastContainer, toast,cssTransition} from 'react-toastify';
const Zoom = cssTransition({
enter: 'zoomIn',
exit: 'zoomOut',
duration: 750,
});
const SELLER_HEADER = {
headers: {
 'Content-Type': 'multipart/form-data',
 'Authorization':"Bearer " + localStorage.getItem('planetshare_web_token'),
}
};
const uploadPercentage='0%';
class AddVideo extends Component {
  state={
    percentage:'',
    video_id:'',
    showTable:false,
    tableContent:[],
    nextComponent:false,
    email:'',
  tag:'',loading:false,loading_msg:'Please Wait',btn_disable:true

  }
  componentWillMount()
  {
    // this.props.history.push('',{ detail: 'user'});
    // this.props.history.push({
    //       pathname : '/dashboard/seller/asset',
    //       state :{
    //       tag :'video',
    //       }
    //       }
    //     );
    var email=localStorage.getItem('username');
    this.setState({email:email});
  }
  componentDidMount()
  {
    setTimeout(()=>this.setState({loading:true},function()
  {
      this.getUpload();
  }),1000)
  }
  getUpload=()=>{
      var $ = window.$; // use the global jQuery instance
      var tag=this.props.tag;
      this.setState({tag:tag});
      var $fileUpload = $('#resumable-browse');
      $('#start-upload-btn').hide();
        $('#pause-upload-btn').hide();
        $('#cancel-upload-btn').hide();
      var $fileUploadDrop = $('#resumable-drop');
      var $uploadList = $("#file-upload-list");
      if ($fileUpload.length > 0 && $fileUploadDrop.length > 0) {
          var resumable = new Resumable({

          // Use chunk size that is smaller than your maximum limit due a resumable issue
          // https://github.com/23/resumable.js/issues/51
          chunkSize: 5 * 1024 * 1024, // 1MB
          // fileType: ['mp4','3gp','avi','flv'],
          fileType: ['3gp','mp4','flv'],
          simultaneousUploads:1,
          testChunks: false,
          throttleProgressCallbacks: 1,
          maxFiles:1,
          // Get the url from data-url tag
          target: $fileUpload.data('url'),
          // Append token to the request - required for web routes
          maxFilesErrorCallback(files, errorCount){ console.log(errorCount);},
          maxFileSizeErrorCallback(file, errorCount){console.log(errorCount)}
      });

  // Resumable.js isn't supported, fall back on a different method
  $('#resumable-browse').click(function()
  {
    $('#dubbing_cont').addClass('collapsed');
    $('#dubbing_upload_button').removeClass('show');
  })
      if (!resumable.support) {
          $('#resumable-error').show();
      } else {
          // Show a place for dropping/selecting files
          $fileUploadDrop.show();
          resumable.assignDrop($fileUpload[0]);
          resumable.assignBrowse($fileUploadDrop[0]);

          // Handle file add event

          resumable.on('fileAdded', function (file) {
              // Show progress pabr

              $fileUpload.hide();
              $uploadList.show();
              $('#progress_bar_status').show()

              $('#file_upload_button').hide()
              // $('#start-upload-btn').show();
                $('#pause-upload-btn').show();
                $('#cancel-upload-btn').show();
              // Show pause, hide resume
              $('.resumable-progress .progress-resume-link').hide();
              $('.resumable-progress .progress-pause-link').show();
              // Add the file to the list
              $uploadList.append('<li class="resumable-file-' + file.uniqueIdentifier + '">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
              $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-name').html(file.fileName);
              // Actually start the upload
                              // console.log(file);
              resumable.upload();
          });

          resumable.on('fileSuccess', function (file, message) {
            var result=JSON.parse(message);
            $('#video_id').val(result.video_id);

            $('#start-upload-btn').hide();
            $('#pause-upload-btn').hide();
            $('#cancel-upload-btn').hide();
            $('#progress_bar_status').hide();
            $('#file_upload_button').show();
            $('#progress_bar_status').hide()
            $('#save_button').show();
              $fileUpload.show();


              // Reflect that the file upload has completed
              $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(completed)');
          });
          resumable.on('fileError', function (file, message) {
              // Reflect that the file upload has resulted in error
              $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(file could not be uploaded: ' + message + ')');
          });
          resumable.on('fileProgress', function (file) {
              // Handle progress for both the file and the overall upload

              // this.setState({percentage:'10'});
          });
      }


  }
}

  render() {
    const {loading_msg,loading,img_loading_msg,img_loading}=this.state;
    return (
      <section class="inner_cont upload_cont">
              <article class="gig_info">
                  <div class="container">
                      <div class="vend_cont">
                          <form class="form_control" onSubmit={this.uploadImage}>
                              <h2>Upload Your Content</h2>
                              <div class="build_gal">
                                  <div class="upload_area">
                                    <button type="button" class="btn btn-warning" aria-label="Pause upload" id="cancel-upload-btn" style={{display: "none"}} onClick={()=>{this.props.history.push('/dashboard/seller');setTimeout(()=>this.props.history.replace('/dashboard/seller/add_asset/video'),1000);}}>
                                        <span class="glyphicon glyphicon-pause " aria-hidden="true"></span> Cancel upload
                                    </button>
                                    <input type="hidden" id="video_id"/>
                                      <ul class="browse_list mult">
                                          <li>
                                              <div class="upl_box">
                                                  <label for="gallery-photo-add">

                                                    <div id="resumable-drop">
                                                    <div id="file_upload_button" class="mt-16">
                                                    <span class="fileinput-button">
                                                        <i class="glyphicon glyphicon-plus"></i>
<button type="button" class="btndefault fileinput-button" id="resumable-browse" data-url={`${SELLERVIDEOUPLOAD}`}>Select Files</button>
                                                    </span>
                                                    </div>
                                                    </div>
                                                  </label>
                                                   <span class="note">(.mp4,.3gp files that are at least 10Mb)</span>
                                                    <Progress percent={this.state.percentage}/>
                                                   <div class="col-lg-offset-2 col-lg-12" id="progress_bar_status" style={{display:'none'}}>
                                                   <p>

                                                   <div id="show_percentage" ></div>
                                                   </p>

                                                   </div>

                                              </div>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                              <div class="buttons">
                                  <button type="button" class="btndefault" id="upload_img_btn" onClick={()=>this.redirectHandler()}>Next</button>
                              </div>
                          </form>
                          <div class="clearfix"></div>
                      </div>
                  </div>
                  <div class="clearfix"></div>
              </article>
              <div class="clearfix"></div>
          </section>


        )
      }
    }
export default AddVideo; 
