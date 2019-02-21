from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from os.path import dirname, realpath

filepath = realpath(__file__)

dir_of_file = dirname(filepath)
parent_dir_of_file = dirname(dir_of_file)
parents_parent_dir_of_file = dirname(dirname(parent_dir_of_file))


def index(request):
    return HttpResponse(parents_parent_dir_of_file)