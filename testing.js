function baselineStartup (userOptions) { //1/19/26 by DW
	$ = jQuery;
	console.log ("baselineStartup -- hi scott! :-)");
	
	const options = {
		maxTitleLength: 300,
		flUseMessagesToCommunicate: true, 
		urlWordland: "https://wordland.dev/?",
		replyIcon: `<span class="spReplyIcon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
				<path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z"/>
				</svg>
			</span>
			`
		};
	function mergeOptions (userOptions, options) { //8/14/24 by DW
		if (userOptions !== undefined) {
			for (x in userOptions) {
				if (userOptions [x] !== undefined) {
					options [x] = userOptions [x];
					}
				}
			}
		}
	mergeOptions (userOptions, options);
	
	var wordlandTab = null; //1/23/26 by DW
	function sendToWordland (params) {
		console.log ("sendToWordland: params == " + jsonStringify (params));
		if (wordlandTab === null || wordlandTab.closed) {
			const url = options.urlWordland + buildParamList (params)
			wordlandTab = window.open (url, "wordland");
			}
		if (wordlandTab !== null && !wordlandTab.closed) {
			wordlandTab.focus ();
			wordlandTab.postMessage (params, "*");
			}
		}
	
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
	function buildParamList (paramtable) { //9/22/18 by DW 
		var s = "";
		for (var x in paramtable) {
			if (s.length > 0) {
				s += "&";
				}
			s += x + "=" + encodeURIComponent (paramtable [x]);
			}
		return (s);
		}
	function maxStringLength (s, len, flWholeWordAtEnd=true, flAddElipses=true) {
		if ((s === undefined) || (s === null)) {
			return ("");
			}
		else {
			if (s.length > len) {
				s = s.substr (0, len);
				if (flWholeWordAtEnd) {
					while (s.length > 0) {
						if (s [s.length - 1] == " ") {
							if (flAddElipses) {
								s += "...";
								}
							break;
							}
						s = s.substr (0, s.length - 1); //pop last char
						}
					}
				else { //8/2/20 by DW
					if (flAddElipses) {
						s += "...";
						}
					}
				}
			return (s);
			}
		}
	function getSiteId () {
		var idSite = $("#wordland-siteId").attr ("data-siteId");
		if (idSite.length == 0) { //it was specified
			idSite = undefined;
			}
		return (idSite);
		}
	function getTitletext (theText) {
		theText =theText.trim ();
		if (theText.endsWith ("#")) {
			theText = theText.slice (0, -1);
			}
		theText =theText.trim ();
		theText = maxStringLength (theText, options.maxTitleLength, false, true);
		return (theText);
		}
	function getReplyLink (idPost, titleText, permalink) {
		const spReplyLink = $("<span class=\"spReplyLink\"></span>");
		
		const params = {
			blogreply: true,
			source: "wpcom",
			site: getSiteId (),
			post: idPost,
			title: getTitletext (titleText),
			url: permalink
			};
		const urlWordland = "https://wordland.dev/?" + buildParamList (params);
		
		
		const tooltiptext = "Click here to reply to this post.";
		
		if (options.flUseMessagesToCommunicate) {
			const spReplyIcon = $("<span class=\"spReplyIcon\">" + options.replyIcon + "</span>");
			spReplyIcon.click (function (ev) {
				console.log ("spReplyIcon.click");
				sendToWordland (params);
				});
			spReplyLink.append (spReplyIcon);
			}
		else {
			const theAnchor = $("<a href=\"" + urlWordland + "\" target=\"_blank\" title=\"" + tooltiptext + "\">" + options.replyIcon + "</a>");
			spReplyLink.append (theAnchor);
			}
		
		return (spReplyLink);
		}
	if (getSiteId ().length > 0) { //this code is running on a supported platform
		$("#idStories .divStoryBody p").each (function () { //look for singular item posts
			const p = $(this);
			const lastSpan = p.children ("span").last ();
			if (lastSpan.length) {
				const postid = lastSpan.data ("postid");
				const lastp = lastSpan.closest ("p");
				const titletext = lastp.text ();
				const permalink = lastSpan.find ("a").attr ("href");
				const spReplyLink = getReplyLink (postid, titletext, permalink);
				p.append (spReplyLink);
				}
			});
		$("#idStories .divStoryTitle").each (function () { //look for titled posts
			const theTitle = $(this);
			const titletext = theTitle.text ();
			const spPermaLink = theTitle.find (".spPermaLink");
			const postid = spPermaLink.data ("postid");
			const permalink = spPermaLink.find ("a").attr ("href");
			
			
			const spReplyLink = getReplyLink (postid, titletext, permalink);
			theTitle.append (spReplyLink);
			});
		}
	else {
		console.log ("baselineStartup: can't start up the Reply icons because this server is not configured for the feature.");
		}
	hitCounter ();
	}
document.addEventListener  ("DOMContentLoaded", function () {
	baselineStartup ();
	});
