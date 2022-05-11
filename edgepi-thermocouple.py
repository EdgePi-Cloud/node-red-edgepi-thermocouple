import sys
import os
import subprocess

# arv[0] is this file's name, argv[1] should be numeric command
if len(sys.argv) > 1:
    command = sys.argv[1].lower()
    
    # keep receiving commands from parent process
    while True:
        try:
            data = int(input())
            print("WRITING DATA BACK")
        except(EOFError, SystemExit):
            sys.exit(0)
else:
    print("Number of commands must equal 2")