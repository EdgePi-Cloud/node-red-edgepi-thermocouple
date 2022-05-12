import sys

# arv[0] is this file's name, argv[1] should be numeric command
if len(sys.argv) > 1:
    command = sys.argv[1].lower()
    
    # keep receiving commands from parent process
    while True:
        try:
            data = input()
            if 'exit' in data:
                sys.exit(0)
            print(f'writing input to child back: {data}')
        except(EOFError, SystemExit):
            sys.exit(0)
else:
    print("Number of commands must equal 2")