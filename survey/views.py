from django.shortcuts import render
import json
from .models import Experiment, Datapoint


def index(request):
	all_experiments = Experiment.objects.all()

	args = {
		'experiments': all_experiments
	}

	return render(request, 'survey/index.html', args)


def create_exp(request):
	# TODO: Force unique 'title' values (otherwise the logic in edit_exp.html is fucked)
	# TODO: Force unique item IDs... 
	# TODO: Don't allow ' in config_json... for now
	return render(request, '')


def edit_exp(request):
	# get exp name
	exp_name = request.GET.get('exp_name', '')
	if not exp_name:
		return index(request)

	# load exp from db
	all_experiments = Experiment.objects.all()
	thisexp_index = list(all_experiments.values_list('name')).index((exp_name,))
	thisexp = all_experiments[thisexp_index]
	config_dict = json.loads(thisexp.config_json)

	# render
	args = {
		'exp_name': exp_name,
		'config': config_dict,
	}
	return render(request, 'survey/edit_exp.html', args)


def vpid(request):

	# get exp name
	exp_name = request.GET.get('exp_name', '')
	if not exp_name:
		print('... :(')
		return index(request)

	args = {
		'exp_name': exp_name,
	}
	return render(request, 'survey/vpid.html', args)


def run_exp(request):
	# get exp name & page
	exp_name = request.GET.get('exp_name', request.POST.get('exp_name', ''))
	vpid = request.GET.get('vpid', request.POST.get('vpid', '{no vpid}'))
	currentpage = request.GET.get('page', request.POST.get('page', ''))
	
	# no GET / POST problems?
	if not exp_name:
		return index(request)
	try:
		currentpage = int(currentpage)
	except ValueError:
		return index(request)

	# load exp from db
	all_experiments = Experiment.objects.all()
	thisexp_index = list(all_experiments.values_list('name')).index((exp_name,))
	thisexp = all_experiments[thisexp_index]
	config_dict = json.loads(thisexp.config_json)

	# save data to db
	if currentpage > 0:
		# get all items from the page before
		lastitems = config_dict[currentpage - 1]['items']

		# select items which collect data (e.g. not infotext)
		question_items = [l for l in lastitems if l['type'] in [
			'question_text',
			'question_slider'
		]]
		
		# save
		for l in question_items:
			Datapoint.objects.create(
				exp_name=exp_name,
				vpid=vpid,
				item_id=l['id'],
				data=request.POST.get(l['id'], '{missing data}')
			).save()

	# render
	if 0 <= currentpage < len(config_dict): # standard
		args = {
			'exp_name': exp_name,
			'vpid': vpid,
			'page': currentpage,
			'config': config_dict[currentpage]
		}
		return render(request, 'survey/run_exp.html', args)
	else:  # end of experiment
		return index(request)
