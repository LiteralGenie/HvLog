from os.path import dirname, sep


SRC_DIR= dirname(dirname(__file__)) + sep
PROJ_DIR= dirname(dirname(SRC_DIR)) + sep

DATA_DIR= PROJ_DIR + "data" + sep
CONFIG_DIR= PROJ_DIR + "config" + sep
LOG_DIR= PROJ_DIR + "logs" + sep

LOGGING_CONFIG= CONFIG_DIR + "logging.yaml"
