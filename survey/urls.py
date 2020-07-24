from django.urls import path
from survey import views

urlpatterns = [
	path('', views.index, name='index'),
	path('edit_exp', views.edit_exp, name='edit_exp'),
	path('vpid', views.vpid, name='vpid'),
	path('run_exp', views.run_exp, name='run_exp')
]
