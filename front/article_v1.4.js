function dinComment(cid,url){var item=$('#din-'+cid);if(getck(cid)){item.removeAttr("href");item.qtip({content:'顶过了，每30分钟更新一次投票结果，请稍候',show:{ready:true}})
return false;}else{$.cookie(cid,true);}
var id='#likes-'+cid;var likes=$(id).text();likes=parseInt(likes)+1;$(id).text(likes);$(id).addClass('likes');$.ajax({type:"GET",url:url}).success(function(){}).error(function(){});item.qtip({content:'顶文章成功，每30分钟更新一次投票结果，请稍候',show:{ready:true}});return false;}
function createForm(cid){var item=$('#function-'+cid);var cid=$('#function-'+cid+'>div>.cid').html();var nid=$('#function-'+cid+'>div>.nid').html();var thread=$('#function-'+cid+'>div>.thread').html();var id='#comment-'+cid;$(".commentFormBlock").remove();var formBlock=$('#commentFormBlock').clone();formBlock.find("form").addClass('tempForm');formBlock.find('input[name="nid"]').val(nid);formBlock.find('input[name="pid"]').val(cid);formBlock.find('input[name="thread"]').val(thread);$(id).html("<div class='commentFormBlock'>"+formBlock.html()+"</div>");iniForm($(".tempForm"));return false;}
function createPager(id){var jplist=$(id).jplist({sort:{time:"span.create_time",like:"span.like",amount:"span.amount"},sort_name:"time",sort_order:"desc",items_box:".comment-items",item_path:".comment-item",items_on_page:10});}


$(function(){$('html').addClass('nonselectable');var nav_max_width=275;var nav_min_width=30;var navbar_url=$('.ajax_actions .navbar').attr('href');if(!navbar_url){navbar_url=App.settings.basePath+'news/navbar';}
var commentLoaded=0;var comm=App.article.comm;if(!comm)comm=2;var flagrev=commentLoaded
$(window).scroll(function(){if(commentLoaded==0){if(comm==0)return;var rect=document.getElementById('expression').getBoundingClientRect();if(rect.top<window.innerHeight){if(document.getElementById('comments')!=null){var comments_url=$('.ajax_actions .comments').attr('href');if(!comments_url){comments_url=App.article.url_comment;}
var timestamp=new Date().getMinutes();$('#comments').load(comments_url+'?'+timestamp);commentLoaded=1;}}}});$(".captcha_wrap").hide();if(comm!=0){createPager("#commentArea");}
if(comm==2){iniForm($("#comment-form"));}
if($.cookie('expression_'+App.article.nid)){$('.tickets').show();}

var fbLoaded=0;$(window).scroll(function(){if(fbLoaded==0){var rect=document.getElementById('fb-like-box').getBoundingClientRect();var window_height=$(window).height();if(rect.top<window_height){load_FB_API();fbLoaded=1;}}});var floatCommentEvents=function(){var comments_top=$("#comments").offset().top+200;$(window).scroll(function(){var scrollb=$(window).scrollTop(),dist=parseInt(comments_top)
-parseInt(scrollb);if(dist<=0){$("#commentFormBlock").addClass("fixedCommentFormBlock");}
if(dist>0){$("#commentFormBlock").removeClass("fixedCommentFormBlock");}});$(window).trigger('scroll');}
$("#gotop").click(function(){jQuery("html,body").animate({scrollTop:0},400);});$(window).scroll(function(){if($(this).scrollTop()>500){$('#tbox').fadeIn("fast");}else{$('#tbox').stop().fadeOut("fast");}});})
App.reportingForm=function(cid,code){var response=$.ajax({type:"GET",cache:false,dataType:"html",contentType:"text/html; charset=utf-8",data:{cid:cid},url:'/news/'+code+'/comment/reporting?report=int',async:false}).success(function(respond){var dialog=$(respond).dialog({width:500,modal:true,buttons:{'举报':function(){var reporting=$('textarea',this).val();var captcha=$('#captcha',this).val();$('textarea',this).css('border','');$('textarea',this).attr('title','');$('#captcha',this).css('border','');$('#captcha',this).attr('title','');if(!$.trim(reporting)){$('textarea',this).css('border','1px dashed #F00');$('textarea',this).attr('title','请输入举报原因');$('textarea',this).focus();return;}expression
if(App.captcha_enable&&!$.trim(captcha)){$('#captcha',this).css('border','1px dashed #F00');$('#captcha',this).attr('title','请输入验证码');$('#captcha',this).focus();return;}
$('.reporting-message',dialog).hide();$.post('/news/'+code+'/comment/reporting?report=save',{cid:cid,reporting:reporting,captcha:captcha}).success(function(respond){if(!respond.success){$('.reporting-message',dialog).html('<ul><li class="feedbackPanelERROR">'
+respond.messages
+'</li></ul>').show();App.updateCaptcha(dialog);return;}else{$('.success').html('<ul><li class="feedbackPanelINFO">'
+respond.messages
+'</li></ul>').show();$(dialog).dialog("close");$('.success').fadeOut(4000);}})},'取消':function(){$(this).dialog("close");}}});dialog.parent('.ui-dialog').css('zIndex',99999999);$('.comment-body',dialog).html($('#comment-wrap-'+cid+' .comment').html());}).error(function(respond){$('<div id="dialog" title="提示">加载数据失败，请重新尝试</div>').dialog({modal:true,buttons:{'确定':function(){$(this).dialog("close");}}});;});}