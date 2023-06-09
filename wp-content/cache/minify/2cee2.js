/*!
 * custom plugin v1.0 - softdiscover
 * original author: Jasny Bootstrap v3.1.3 (http://jasny.github.io/bootstrap)
 * Copyright 2012-2014 Arnold Daniels
 * Licensed under Apache-2.0 (https://github.com/jasny/bootstrap/blob/master/LICENSE)
 */
if(typeof window.$uifm==='undefined'){throw new Error('Jasny Bootstrap\'s JavaScript requires jQuery')}
+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
if($.support.transition!==undefined)return
$.fn.emulateTransitionEnd=function(duration){var called=false,$el=this
$(this).one($.support.transition.end,function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()})}(window.$uifm);+function($){"use strict";var OffCanvas=function(element,options){this.$element=$(element)
this.options=$.extend({},OffCanvas.DEFAULTS,options)
this.state=null
this.placement=null
if(this.options.recalc){this.calcClone()
$(window).on('resize',$.proxy(this.recalc,this))}
if(this.options.autohide)
$(document).on('click',$.proxy(this.autohide,this))
if(this.options.toggle)this.toggle()
if(this.options.disablescrolling){this.options.disableScrolling=this.options.disablescrolling
delete this.options.disablescrolling}}
OffCanvas.DEFAULTS={toggle:true,placement:'auto',autohide:true,recalc:true,disableScrolling:true}
OffCanvas.prototype.offset=function(){switch(this.placement){case'left':case'right':return this.$element.outerWidth()
case'top':case'bottom':return this.$element.outerHeight()}}
OffCanvas.prototype.calcPlacement=function(){if(this.options.placement!=='auto'){this.placement=this.options.placement
return}
if(!this.$element.hasClass('in')){this.$element.css('visiblity','hidden !important').addClass('in')}
var horizontal=$(window).width()/this.$element.width()
var vertical=$(window).height()/this.$element.height()
var element=this.$element
function ab(a,b){if(element.css(b)==='auto')return a
if(element.css(a)==='auto')return b
var size_a=parseInt(element.css(a),10)
var size_b=parseInt(element.css(b),10)
return size_a>size_b?b:a}
this.placement=horizontal>=vertical?ab('left','right'):ab('top','bottom')
if(this.$element.css('visibility')==='hidden !important'){this.$element.removeClass('in').css('visiblity','')}}
OffCanvas.prototype.opposite=function(placement){switch(placement){case'top':return'bottom'
case'left':return'right'
case'bottom':return'top'
case'right':return'left'}}
OffCanvas.prototype.getCanvasElements=function(){var canvas=this.options.canvas?$(this.options.canvas):this.$element
var fixed_elements=canvas.find('*').filter(function(){return $(this).css('position')==='fixed'}).not(this.options.exclude)
return canvas.add(fixed_elements)}
OffCanvas.prototype.slide=function(elements,offset,callback){if(!$.support.transition){var anim={}
anim[this.placement]="+="+offset
return elements.animate(anim,350,callback)}
var placement=this.placement
var opposite=this.opposite(placement)
elements.each(function(){if($(this).css(placement)!=='auto')
$(this).css(placement,(parseInt($(this).css(placement),10)||0)+offset)
if($(this).css(opposite)!=='auto')
$(this).css(opposite,(parseInt($(this).css(opposite),10)||0)-offset)})
this.$element.one($.support.transition.end,callback).emulateTransitionEnd(350)}
OffCanvas.prototype.disableScrolling=function(){var bodyWidth=$('body').width()
var prop='padding-'+this.opposite(this.placement)
if($('body').data('offcanvas-style')===undefined){$('body').data('offcanvas-style',$('body').attr('style')||'')}
$('body').css('overflow','hidden')
if($('body').width()>bodyWidth){var padding=parseInt($('body').css(prop),10)+$('body').width()-bodyWidth
setTimeout(function(){$('body').css(prop,padding)},1)}}
OffCanvas.prototype.show=function(){if(this.state)return
var startEvent=$.Event('show.bs.offcanvas')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
this.state='slide-in'
this.calcPlacement();var elements=this.getCanvasElements()
var placement=this.placement
var opposite=this.opposite(placement)
var offset=this.offset()
if(elements.index(this.$element)!==-1){$(this.$element).data('offcanvas-style',$(this.$element).attr('style')||'')
this.$element.css(placement,-1*offset)
this.$element.css(placement);}
elements.addClass('canvas-sliding').each(function(){if($(this).data('offcanvas-style')===undefined)$(this).data('offcanvas-style',$(this).attr('style')||'')
if($(this).css('position')==='static')$(this).css('position','relative')
if(($(this).css(placement)==='auto'||$(this).css(placement)==='0px')&&($(this).css(opposite)==='auto'||$(this).css(opposite)==='0px')){$(this).css(placement,0)}})
if(this.options.disableScrolling)this.disableScrolling()
var complete=function(){if(this.state!='slide-in')return
this.state='slid'
elements.removeClass('canvas-sliding').addClass('canvas-slid')
this.$element.trigger('shown.bs.offcanvas')}
setTimeout($.proxy(function(){this.$element.addClass('in')
this.slide(elements,offset,$.proxy(complete,this))},this),1)}
OffCanvas.prototype.hide=function(fast){if(this.state!=='slid')return
var startEvent=$.Event('hide.bs.offcanvas')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
this.state='slide-out'
var elements=$('.canvas-slid')
var placement=this.placement
var offset=-1*this.offset()
var complete=function(){if(this.state!='slide-out')return
this.state=null
this.placement=null
this.$element.removeClass('in')
elements.removeClass('canvas-sliding')
elements.add(this.$element).add('body').each(function(){$(this).attr('style',$(this).data('offcanvas-style')).removeData('offcanvas-style')})
this.$element.trigger('hidden.bs.offcanvas')}
elements.removeClass('canvas-slid').addClass('canvas-sliding')
setTimeout($.proxy(function(){this.slide(elements,offset,$.proxy(complete,this))},this),1)}
OffCanvas.prototype.toggle=function(){if(this.state==='slide-in'||this.state==='slide-out')return
this[this.state==='slid'?'hide':'show']()}
OffCanvas.prototype.calcClone=function(){this.$calcClone=this.$element.clone().html('').addClass('offcanvas-clone').removeClass('in').appendTo($('body'))}
OffCanvas.prototype.recalc=function(){if(this.$calcClone.css('display')==='none'||(this.state!=='slid'&&this.state!=='slide-in'))return
this.state=null
this.placement=null
var elements=this.getCanvasElements()
this.$element.removeClass('in')
elements.removeClass('canvas-slid')
elements.add(this.$element).add('body').each(function(){$(this).attr('style',$(this).data('offcanvas-style')).removeData('offcanvas-style')})}
OffCanvas.prototype.autohide=function(e){if($(e.target).closest(this.$element).length===0)this.hide()}
var old=$.fn.offcanvas
$.fn.offcanvas=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.offcanvas')
var options=$.extend({},OffCanvas.DEFAULTS,$this.data(),typeof option==='object'&&option)
if(!data)$this.data('bs.offcanvas',(data=new OffCanvas(this,options)))
if(typeof option==='string')data[option]()})}
$.fn.offcanvas.Constructor=OffCanvas
$.fn.offcanvas.noConflict=function(){$.fn.offcanvas=old
return this}
$(document).on('click.bs.offcanvas.data-api','[data-toggle=offcanvas]',function(e){var $this=$(this),href
var target=$this.attr('data-target')||e.preventDefault()||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
var $canvas=$(target)
var data=$canvas.data('bs.offcanvas')
var option=data?'toggle':$this.data()
e.stopPropagation()
if(data)data.toggle()
else $canvas.offcanvas(option)})}(window.$uifm);+function($){"use strict";var Rowlink=function(element,options){this.$element=$(element)
this.options=$.extend({},Rowlink.DEFAULTS,options)
this.$element.on('click.bs.rowlink','td:not(.rowlink-skip)',$.proxy(this.click,this))}
Rowlink.DEFAULTS={target:"a"}
Rowlink.prototype.click=function(e){var target=$(e.currentTarget).closest('tr').find(this.options.target)[0]
if($(e.target)[0]===target)return
e.preventDefault();if(target.click){target.click()}else if(document.createEvent){var evt=document.createEvent("MouseEvents");evt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);target.dispatchEvent(evt);}}
var old=$.fn.rowlink
$.fn.rowlink=function(options){return this.each(function(){var $this=$(this)
var data=$this.data('bs.rowlink')
if(!data)$this.data('bs.rowlink',(data=new Rowlink(this,options)))})}
$.fn.rowlink.Constructor=Rowlink
$.fn.rowlink.noConflict=function(){$.fn.rowlink=old
return this}
$(document).on('click.bs.rowlink.data-api','[data-link="row"]',function(e){if($(e.target).closest('.rowlink-skip').length!==0)return
var $this=$(this)
if($this.data('bs.rowlink'))return
$this.rowlink($this.data())
$(e.target).trigger('click.bs.rowlink')})}(window.$uifm);+function($){"use strict";var isIphone=(window.orientation!==undefined)
var isAndroid=navigator.userAgent.toLowerCase().indexOf("android")>-1
var isIE=window.navigator.appName=='Microsoft Internet Explorer'
var Inputmask=function(element,options){if(isAndroid)return
this.$element=$(element)
this.options=$.extend({},Inputmask.DEFAULTS,options)
this.mask=String(this.options.mask)
this.init()
this.listen()
this.checkVal()}
Inputmask.DEFAULTS={mask:"",placeholder:"_",definitions:{'9':"[0-9]",'a':"[A-Za-z]",'w':"[A-Za-z0-9]",'*':"."}}
Inputmask.prototype.init=function(){var defs=this.options.definitions
var len=this.mask.length
this.tests=[]
this.partialPosition=this.mask.length
this.firstNonMaskPos=null
$.each(this.mask.split(""),$.proxy(function(i,c){if(c=='?'){len--
this.partialPosition=i}else if(defs[c]){this.tests.push(new RegExp(defs[c]))
if(this.firstNonMaskPos===null)
this.firstNonMaskPos=this.tests.length-1}else{this.tests.push(null)}},this))
this.buffer=$.map(this.mask.split(""),$.proxy(function(c,i){if(c!='?')return defs[c]?this.options.placeholder:c},this))
this.focusText=this.$element.val()
this.$element.data("rawMaskFn",$.proxy(function(){return $.map(this.buffer,function(c,i){return this.tests[i]&&c!=this.options.placeholder?c:null}).join('')},this))}
Inputmask.prototype.listen=function(){if(this.$element.attr("readonly"))return
var pasteEventName=(isIE?'paste':'input')+".mask"
this.$element.on("unmask.bs.inputmask",$.proxy(this.unmask,this)).on("focus.bs.inputmask",$.proxy(this.focusEvent,this)).on("blur.bs.inputmask",$.proxy(this.blurEvent,this)).on("keydown.bs.inputmask",$.proxy(this.keydownEvent,this)).on("keypress.bs.inputmask",$.proxy(this.keypressEvent,this)).on(pasteEventName,$.proxy(this.pasteEvent,this))}
Inputmask.prototype.caret=function(begin,end){if(this.$element.length===0)return
if(typeof begin=='number'){end=(typeof end=='number')?end:begin
return this.$element.each(function(){if(this.setSelectionRange){this.setSelectionRange(begin,end)}else if(this.createTextRange){var range=this.createTextRange()
range.collapse(true)
range.moveEnd('character',end)
range.moveStart('character',begin)
range.select()}})}else{if(this.$element[0].setSelectionRange){begin=this.$element[0].selectionStart
end=this.$element[0].selectionEnd}else if(document.selection&&document.selection.createRange){var range=document.selection.createRange()
begin=0-range.duplicate().moveStart('character',-100000)
end=begin+range.text.length}
return{begin:begin,end:end}}}
Inputmask.prototype.seekNext=function(pos){var len=this.mask.length
while(++pos<=len&&!this.tests[pos]);return pos}
Inputmask.prototype.seekPrev=function(pos){while(--pos>=0&&!this.tests[pos]);return pos}
Inputmask.prototype.shiftL=function(begin,end){var len=this.mask.length
if(begin<0)return
for(var i=begin,j=this.seekNext(end);i<len;i++){if(this.tests[i]){if(j<len&&this.tests[i].test(this.buffer[j])){this.buffer[i]=this.buffer[j]
this.buffer[j]=this.options.placeholder}else
break
j=this.seekNext(j)}}
this.writeBuffer()
this.caret(Math.max(this.firstNonMaskPos,begin))}
Inputmask.prototype.shiftR=function(pos){var len=this.mask.length
for(var i=pos,c=this.options.placeholder;i<len;i++){if(this.tests[i]){var j=this.seekNext(i)
var t=this.buffer[i]
this.buffer[i]=c
if(j<len&&this.tests[j].test(t))
c=t
else
break}}},Inputmask.prototype.unmask=function(){this.$element.unbind(".mask").removeData("inputmask")}
Inputmask.prototype.focusEvent=function(){this.focusText=this.$element.val()
var len=this.mask.length
var pos=this.checkVal()
this.writeBuffer()
var that=this
var moveCaret=function(){if(pos==len)
that.caret(0,pos)
else
that.caret(pos)}
moveCaret()
setTimeout(moveCaret,50)}
Inputmask.prototype.blurEvent=function(){this.checkVal()
if(this.$element.val()!==this.focusText)
this.$element.trigger('change')}
Inputmask.prototype.keydownEvent=function(e){var k=e.which
if(k==8||k==46||(isIphone&&k==127)){var pos=this.caret(),begin=pos.begin,end=pos.end
if(end-begin===0){begin=k!=46?this.seekPrev(begin):(end=this.seekNext(begin-1))
end=k==46?this.seekNext(end):end}
this.clearBuffer(begin,end)
this.shiftL(begin,end-1)
return false}else if(k==27){this.$element.val(this.focusText)
this.caret(0,this.checkVal())
return false}}
Inputmask.prototype.keypressEvent=function(e){var len=this.mask.length
var k=e.which,pos=this.caret()
if(e.ctrlKey||e.altKey||e.metaKey||k<32){return true}else if(k){if(pos.end-pos.begin!==0){this.clearBuffer(pos.begin,pos.end)
this.shiftL(pos.begin,pos.end-1)}
var p=this.seekNext(pos.begin-1)
if(p<len){var c=String.fromCharCode(k)
if(this.tests[p].test(c)){this.shiftR(p)
this.buffer[p]=c
this.writeBuffer()
var next=this.seekNext(p)
this.caret(next)}}
return false}}
Inputmask.prototype.pasteEvent=function(){var that=this
setTimeout(function(){that.caret(that.checkVal(true))},0)}
Inputmask.prototype.clearBuffer=function(start,end){var len=this.mask.length
for(var i=start;i<end&&i<len;i++){if(this.tests[i])
this.buffer[i]=this.options.placeholder}}
Inputmask.prototype.writeBuffer=function(){return this.$element.val(this.buffer.join('')).val()}
Inputmask.prototype.checkVal=function(allow){var len=this.mask.length
var test=this.$element.val()
var lastMatch=-1
for(var i=0,pos=0;i<len;i++){if(this.tests[i]){this.buffer[i]=this.options.placeholder
while(pos++<test.length){var c=test.charAt(pos-1)
if(this.tests[i].test(c)){this.buffer[i]=c
lastMatch=i
break}}
if(pos>test.length)
break}else if(this.buffer[i]==test.charAt(pos)&&i!=this.partialPosition){pos++
lastMatch=i}}
if(!allow&&lastMatch+1<this.partialPosition){this.$element.val("")
this.clearBuffer(0,len)}else if(allow||lastMatch+1>=this.partialPosition){this.writeBuffer()
if(!allow)this.$element.val(this.$element.val().substring(0,lastMatch+1))}
return(this.partialPosition?i:this.firstNonMaskPos)}
var old=$.fn.inputmask
$.fn.inputmask=function(options){return this.each(function(){var $this=$(this)
var data=$this.data('bs.inputmask')
if(!data)$this.data('bs.inputmask',(data=new Inputmask(this,options)))})}
$.fn.inputmask.Constructor=Inputmask
$.fn.inputmask.noConflict=function(){$.fn.inputmask=old
return this}
$(document).on('focus.bs.inputmask.data-api','[data-mask]',function(e){var $this=$(this)
if($this.data('bs.inputmask'))return
$this.inputmask($this.data())})}(window.$uifm);+function($){"use strict";var isIE=window.navigator.appName=='Microsoft Internet Explorer'
var Fileinput=function(element,options){this.$element=$(element)
this.$input=this.$element.find(':file')
if(this.$input.length===0)return
this.name=this.$input.attr('name')||options.name
this.$hidden=this.$element.find('input[type=hidden][name="'+this.name+'"]')
if(this.$hidden.length===0){this.$hidden=$('<input type="hidden">').insertBefore(this.$input)}
this.$preview=this.$element.find('.fileinput-preview')
var height=this.$preview.css('height')
if(this.$preview.css('display')!=='inline'&&height!=='0px'&&height!=='none'){this.$preview.css('line-height',height)}
this.original={exists:this.$element.hasClass('fileinput-exists'),preview:this.$preview.html(),hiddenVal:this.$hidden.val()}
this.listen()}
Fileinput.prototype.listen=function(){this.$input.on('change.bs.fileinput',$.proxy(this.change,this))
$(this.$input[0].form).on('reset.bs.fileinput',$.proxy(this.reset,this))
this.$element.find('[data-trigger="fileinput"]').on('click.bs.fileinput',$.proxy(this.trigger,this))
this.$element.find('[data-dismiss="fileinput"]').on('click.bs.fileinput',$.proxy(this.clear,this))},Fileinput.prototype.change=function(e){var files=e.target.files===undefined?(e.target&&e.target.value?[{name:e.target.value.replace(/^.+\\/,'')}]:[]):e.target.files
e.stopPropagation()
if(files.length===0){this.clear()
return}
this.$hidden.val('')
this.$hidden.attr('name','')
this.$input.attr('name',this.name)
var file=files[0]
if(this.$preview.length>0&&(typeof file.type!=="undefined"?file.type.match(/^image\/(gif|png|jpeg)$/):file.name.match(/\.(gif|png|jpe?g)$/i))&&typeof FileReader!=="undefined"){var reader=new FileReader()
var preview=this.$preview
var element=this.$element
reader.onload=function(re){var $img=$('<img>')
$img[0].src=re.target.result
files[0].result=re.target.result
element.find('.fileinput-filename').text(file.name)
if(preview.css('max-height')!='none')$img.css('max-height',parseInt(preview.css('max-height'),10)-parseInt(preview.css('padding-top'),10)-parseInt(preview.css('padding-bottom'),10)-parseInt(preview.css('border-top'),10)-parseInt(preview.css('border-bottom'),10))
preview.html($img)
element.addClass('fileinput-exists').removeClass('fileinput-new')
element.trigger('change.bs.fileinput',files)}
reader.readAsDataURL(file)}else{this.$element.find('.fileinput-filename').text(file.name)
this.$preview.text(file.name)
this.$element.addClass('fileinput-exists').removeClass('fileinput-new')
this.$element.trigger('change.bs.fileinput')}},Fileinput.prototype.clear=function(e){if(e)e.preventDefault()
this.$hidden.val('')
this.$hidden.attr('name',this.name)
this.$input.attr('name','')
if(isIE){var inputClone=this.$input.clone(true);this.$input.after(inputClone);this.$input.remove();this.$input=inputClone;}else{this.$input.val('')}
this.$preview.html('')
this.$element.find('.fileinput-filename').text('')
this.$element.addClass('fileinput-new').removeClass('fileinput-exists')
if(e!==undefined){this.$input.trigger('change')
this.$element.trigger('clear.bs.fileinput')}},Fileinput.prototype.reset=function(){this.clear()
this.$hidden.val(this.original.hiddenVal)
this.$preview.html(this.original.preview)
this.$element.find('.fileinput-filename').text('')
if(this.original.exists)this.$element.addClass('fileinput-exists').removeClass('fileinput-new')
else this.$element.addClass('fileinput-new').removeClass('fileinput-exists')
this.$element.trigger('reset.bs.fileinput')},Fileinput.prototype.trigger=function(e){this.$input.trigger('click')
e.preventDefault()}
var old=$.fn.fileinput
$.fn.fileinput=function(options){return this.each(function(){var $this=$(this),data=$this.data('bs.fileinput')
if(!data)$this.data('bs.fileinput',(data=new Fileinput(this,options)))
if(typeof options=='string')data[options]()})}
$.fn.fileinput.Constructor=Fileinput
$.fn.fileinput.noConflict=function(){$.fn.fileinput=old
return this}
$(document).on('click.fileinput.data-api','[data-provides="fileinput"]',function(e){var $this=$(this)
if($this.data('bs.fileinput'))return
$this.fileinput($this.data())
var $target=$(e.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]');if($target.length>0){e.preventDefault()
$target.trigger('click.bs.fileinput')}})}(window.$uifm);