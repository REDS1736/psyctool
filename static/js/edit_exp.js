// INIT -----------------------------------------

// components
var miniview = document.getElementById('pages_miniview');
var miniviews = document.getElementsByClassName('onepage_miniview');
var editonepage = document.getElementsByClassName('editonepage');
var items = document.getElementsByClassName('editonepage_item');
var additems = document.getElementsByClassName('editonepage_additem');

// vars
var initialjson = '';
var current_pageindex = 0;
var current_page = '';
var config_json = '';


window.onload = init;
function init() {
	config_json = JSON.parse(transporter_config);
	initialjson = config_json;

	// init components
	miniview = document.getElementById('pages_miniview');

	buildfromjson(config_json);
};

// JSON parsing ---------------------------------
function buildfromjson(cj) {

	// miniview -----------------------
	miniview.innerHTML = '';
	t_onepage_miniview = document.getElementById('t_onepage_miniview').content.querySelector('div');
	for (i = 0; i < cj.length; i++) {
		// Create a new node, based on the template
		n = document.importNode(t_onepage_miniview, true);
		// customize
		n.textContent = cj[i]['title'];
		n.id = 'mini_' + cj[i]['title']
		// append the new node
		miniview.appendChild(n);
	}

	// editonepage --------------------
	while (editonepage.length > 0) { editonepage[0].remove(); }

	t_editonepage = document.getElementById('t_editonepage').content.querySelector('div');
	for (i = 0; i < cj.length; i ++) {
		var n_editonepage = document.importNode(t_editonepage, true);
		n_editonepage.id = 'eop_' + cj[i]['title'];

		var theseitems = cj[i]['items'];
		var t_editonepage_item = document.getElementById('t_editonepage_item').content.querySelector('div');
		for (ii = 0; ii < theseitems.length; ii++) {
			var n_editonepage_item = document.importNode(t_editonepage_item, true);
			n_editonepage_item.id = 'i_' + cj[i]['items'][ii]['id'];
			
			var txt = document.createTextNode(cj[i]['items'][ii]['id']);
			n_editonepage_item.insertBefore(txt, n_editonepage_item.firstChild)

			n_editonepage.appendChild(n_editonepage_item);
		}

		document.getElementById('editonepage_container').appendChild(n_editonepage);
	}

	// display ------------------------

	// get current page
	current_page = config_json[current_pageindex]['title']
	
	// make current page visible
	for(i = 0; i < editonepage.length; i++) {
		editonepage[i].style.display = 'none';
	}
	editonepage[current_pageindex].style.display = 'block';

	// update components --------------
	miniview = document.getElementById('pages_miniview');
	miniviews = document.getElementsByClassName('onepage_miniview');
	editonepage = document.getElementsByClassName('editonepage');
	items = document.getElementsByClassName('editonepage_item');
	additems = document.getElementsByClassName('editonepage_additem');
}

// NAVIGATION -----------------------------------
function gotopage() {
	current_page = event.target.id.substring('mini_'.length)
	page_ids = [];
	editonepage = document.getElementsByClassName('editonepage');
	for(i = 0; i < editonepage.length; i++) {
		page_ids.push(editonepage[i].id.substring('eop_'.length));
	}
	current_pageindex = page_ids.indexOf(current_page);

	buildfromjson(config_json);
}

// CREATION & EDIT ------------------------------
function additem(itemtype) {
	var parentid = '';
	var superparent = event.target.parentElement.parentElement.parentElement;
	if (superparent.getAttribute('class') == 'editonepage_item') {
		parentid = superparent.id.substring('i_'.length);
	}

	// re-direct to ope_additemview()
	open_additemview(parentid, itemtype);
	return;
	
	// collect already existing items
	var thispage = config_json[current_pageindex];
	var existingitems = [];
	for(i = 0; i < thispage['items'].length; i++) {
		existingitems.push(thispage['items'][i]['id']);
	}

	// create new item
	var new_item = {
		"type": "infotext",
		"text": "sample text",
		"id": itemtype + '+' + new Date().getTime()
	}

	// put new item in the right place
	if (parentid) {  // it's not the first button
		var insertionindex = existingitems.indexOf(parentid);
		
		// slice array of items into two parts: before new item vs. after new item
		var slice_before = thispage['items'].slice(0, insertionindex + 1);
		var slice_after = thispage['items'].slice(insertionindex + 1);

		// update config_json
		config_json[current_pageindex]['items'] = slice_before.concat(new_item).concat(slice_after);
	}
	else
	{  // it's the first button (no parent)
	config_json[current_pageindex]['items'] = [new_item].concat(thispage['items']);
	}

	buildfromjson(config_json);
}

function deleteitem() {
	var parentid = event.target.parentElement.id.substring('i_'.length);
	
	// collect already existing items
	var thispage = config_json[current_pageindex];
	var existingitems = [];
	for(i = 0; i < thispage['items'].length; i++) {
		existingitems.push(thispage['items'][i]['id']);
	}

	var deletionindex = existingitems.indexOf(parentid);
	var futureitems = [];
	for (i = 0; i < existingitems.length; i++) {
		if (i != deletionindex)
			futureitems.push(thispage['items'][i]);
	}

	// apply to json & build
	config_json[current_pageindex]['items'] = futureitems;
	buildfromjson(config_json);
}

// DRAG & DROP ----------------------------------
function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("origin_item", ev.target.id.substring('i_'.length));
}

function drop(ev) {
	ev.preventDefault();

	// right place for dropping?
	if (ev.target.classList != 'editonepage_item')
		return;
	
	// calculate item indices
	var thispage = config_json[current_pageindex];
	var existingitems = [];
	for(i = 0; i < thispage['items'].length; i++) {
		existingitems.push(thispage['items'][i]['id']);
	}
	var index_originitem = existingitems.indexOf(ev.dataTransfer.getData("origin_item"));
	var index_receiveritem = existingitems.indexOf(ev.target.id.substring('i_'.length));

	// dont swap with yourself
	if (index_originitem == index_receiveritem)
	return;

	// swap items in config_json
	var futureitems = config_json[current_pageindex]['items'];
	
	var temp = futureitems[index_originitem];
	futureitems[index_originitem] = futureitems[index_receiveritem];
	futureitems[index_receiveritem] = temp;

	// apply to json & build
	config_json[current_pageindex]['items'] = futureitems;
	buildfromjson(config_json);
}

// EDIT ITEM ------------------------------------
function open_additemview(parentid, itemtype) {
	var edititem_container = document.getElementById('edititem_container');

	// remove other itemviews ---------
	while (edititem_container.firstChild) { edititem_container.lastChild.remove(); }

	// create new itemview ------------
	var itemview = document.createElement('div');
	itemview.className = 'itemview';

	switch (itemtype) {
		case 'infotext':
			
			break;
		case 'question_text':
			break;
		case 'question_slider':
			break;
		default:
			console.log('unknown itemtype: ' + itemtype);
			break;
	}

	edititem_container.appendChild(itemview);
}

// BASICS SIDEBAR -------------------------------
function save_config() {
	console.log('saved config_json to db');
}

// BEAUTY ---------------------------------------
// sure you want to leave?
window.onbeforeunload = function() {
	return true;
};