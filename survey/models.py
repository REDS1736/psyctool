from django.db import models
import datetime
import json


class Datapoint(models.Model):
	"""
	One single bit of data (e.g. one answer to one item)

	@param exp_name: Name of the experiment
	@param vpid: Versuchspersonen-ID
	@param id: ID of the item that the datapoint comes from
	@param data: value to save
	@param timestamp: when was the data recorded?
	"""
	exp_name = models.TextField()
	vpid = models.TextField()
	item_id = models.TextField()
	data = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)


class Experiment(models.Model):
	"""
	One experiment

	@param name: Name of the experiment
	@param config_json: This json-string describes the design of the experiment
	"""
	name = models.TextField()
	config_json = models.TextField()
