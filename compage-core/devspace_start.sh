#!/bin/bash
set +e  # Continue on errors

COLOR_BLUE="\033[0;94m"
COLOR_GREEN="\033[0;92m"
COLOR_RESET="\033[0m"
DEBUG_CMD="dlv debug ./main.go --listen=0.0.0.0:2345 --api-version=2 --output /tmp/__debug_bin --headless"

# Print useful output for user
echo -e "${COLOR_BLUE}
     %########%      
     %###########%       ____                 _____                      
         %#########%    |  _ \   ___ __   __ / ___/  ____    ____   ____ ___ 
         %#########%    | | | | / _ \\\\\ \ / / \___ \ |  _ \  / _  | / __// _ \\
     %#############%    | |_| |(  __/ \ V /  ____) )| |_) )( (_| |( (__(  __/
     %#############%    |____/  \___|  \_/   \____/ |  __/  \__,_| \___\\\\\___|
 %###############%                                  |_|
 %###########%${COLOR_RESET}


Welcome to your development container!

This is how you can work with it:
- Files will be synchronized between your local machine and this container
- Some ports will be forwarded, so you can access this container via localhost
- Run \`${COLOR_GREEN}go run main.go${COLOR_RESET}\` to start the application

If you wish to run compage-core in the debug mode with delve, run:
  \`${COLOR_GREEN}${DEBUG_CMD}${COLOR_RESET}\`
  Wait until the \`${COLOR_BLUE}API server listening at: [::]:2345${COLOR_RESET}\` message appears
  Start the \"Debug compage-core (localhost:2346)\" configuration in VSCode to connect your debugger session.
  ${COLOR_BLUE}Note:${COLOR_RESET} compage-core won't start until you connect with the debugger.
  ${COLOR_BLUE}Note:${COLOR_RESET} compage-core will be stopped once you detach your debugger session.
"

# Set terminal prompt
export PS1="\[${COLOR_BLUE}\]devspace\[${COLOR_RESET}\] ./\W \[${COLOR_BLUE}\]\\$\[${COLOR_RESET}\] "
if [ -z "$BASH" ]; then export PS1="$ "; fi

# Include project's bin/ folder in PATH
export PATH="./bin:$PATH"

# Open shell
bash --norc
