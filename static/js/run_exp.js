// vars
var exp_name;
var current_page;
var config_json;

// components
var item_container;

window.onload = init;
function init() {
	// init vars (get from edit_exp.html)
	exp_name = transporter_exp_name;
	current_page = transporter_page;
	config_json = JSON.parse(transporter_config);  // only the json for this one page
	initialjson = config_json;

	// set index of next page
	document.getElementById('input_nextpage').value = Number(current_page) + 1;

	// init components
	item_container = document.getElementById('item_container');

	buildfromjson(config_json);
};

function buildfromjson(cj) {
	
	// load templates
	t_question_text = document.getElementById('t_question_text').content.querySelector('div');
	t_question_slider = document.getElementById('t_question_slider').content.querySelector('div');

	// build items one by one
	var items = config_json['items'];
	for (i = 0; i < items.length; i++) {
		var newnode;
		var thisitem = items[i];
		console.log(thisitem['type']);
		switch (thisitem['type']) {
			case 'infotext':  // infotext -----------------------------------------------
				newnode = document.createElement("div");
				newnode.className = 'item';

				var text = document.createElement('span');
				text.className = 'infotext';
				text.textContent = thisitem['text'];

				newnode.appendChild(text);
				break;
			case 'question_text': // question_text --------------------------------------
				newnode = document.createElement('div');
				newnode.className = 'item';

				var table = document.createElement('table');

				var tr = document.createElement('tr'); 

				var td_q = document.createElement('td');
				td_q.textContent = thisitem['question'];

				var td_a = document.createElement('td');
				var q_input = document.createElement('textarea');

				q_input.required = thisitem['required'];
				q_input.className = 'question_text';
				q_input.id = thisitem['id'];
				q_input.name = thisitem['id'];

				td_a.appendChild(q_input);
				tr.appendChild(td_q);
				tr.appendChild(td_a);
				table.appendChild(tr);
				newnode.appendChild(table);
				break;
			case 'question_slider': // question_slider ----------------------------------
				newnode = document.createElement('div');
				newnode.className = 'item';

				var table = document.createElement('table');

				var tr = document.createElement('tr'); 

				var td_q = document.createElement('td');
				td_q.textContent = thisitem['question'];

				var td_a = document.createElement('td');
				var q_input = document.createElement('input');
				q_input.type = 'range';
				q_input.setAttribute('min', thisitem['min']);
				q_input.setAttribute('max', thisitem['max']);
				q_input.setAttribute('default', thisitem['default']);

				q_input.required = thisitem['required'];
				q_input.className = 'question_slider';
				q_input.id = thisitem['id'];
				q_input.name = thisitem['id'];

				td_a.appendChild(q_input);
				tr.appendChild(td_q);
				tr.appendChild(td_a);
				table.appendChild(tr);
				newnode.appendChild(table);
				break;
			default:
				newnode = document.createTextNode('unknown item type: ' + items[i]['type']);
				break;
		}

		item_container.appendChild(newnode);
	}
}