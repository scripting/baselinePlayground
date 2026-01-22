function baselineStartup (userOptions) { //1/19/26 by DW
	console.log ("baselineStartup");
	$ = jQuery;
	
	function mergeOptions (userOptions, options) { //8/14/24 by DW
		if (userOptions !== undefined) {
			for (x in userOptions) {
				if (userOptions [x] !== undefined) {
					options [x] = userOptions [x];
					}
				}
			}
		}
	const options = {
		replyIcon: `<span class="spReplyIcon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
				<path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z"/>
				</svg>
			</span>
			`
		};
	mergeOptions (userOptions, options);
	
	function hitCounter () {
		const thisPageUrl = location.href;
		const counterServer = "//counters.scripting.com/hello"; //2/2/23 by DW
		const counterGroup = "scripting";
		const referrer = document.referrer;
		function readHttpFile (url, callback) {
			$.get (url, function (data) {
				callback (data);
				});
			}
		function encode (s) {
			return (encodeURIComponent (s));
			}
		if (thisPageUrl.endsWith ("#")) {
			thisPageUrl = thisPageUrl.slice (0, -1);
			}
		if (thisPageUrl === undefined) {
			thisPageUrl = "";
			}
		const url = counterServer + "?group=" + encode (counterGroup) + "&referer=" + encode (referrer) + "&url=" + encode (thisPageUrl);
		readHttpFile (url, function (msgFromServer) {
			console.log ("hitCounter: msgFromServer == " + msgFromServer);
			});
		}
	function getSiteId () {
		var idSite = $(".divPageBody").data ("idSite");
		if (idSite === undefined) {
			idSite = "237777565"; //daveverse.org
			}
		return (idSite);
		}
	function getReplyLink (idPost) {
		const spReplyLink = $("<span class=\"spReplyLink\"></span>");
		const urlWordland = "https://wordland.dev/?blogreply=true&source=wpcom&site=" + getSiteId () + "&post=" + idPost;
		const tooltiptext = "Click here to reply to this post.";
		const theAnchor = $("<a href=\"" + urlWordland + "\" target=\"_blank\" title=\"" + tooltiptext + "\">" + options.replyIcon + "</a>");
		spReplyLink.append (theAnchor);
		return (spReplyLink);
		}
	$("#idStories .divStoryBody p").each (function () {
		const p = $(this);
		const lastSpan = p.children ("span").last ();
		if (lastSpan.length) {
			
			const postid = lastSpan.data ("postid");
			
			const spReplyLink = getReplyLink ();
			p.append (spReplyLink);
			}
		});
	$("#idStories .divStoryTitle").each (function () {
		const theTitle = $(this);
		
		
		
		
		const spReplyLink = getReplyLink ();
		theTitle.append (spReplyLink);
		});
	hitCounter ();
	}
document.addEventListener  ("DOMContentLoaded", function () {
	baselineStartup ();
	});
