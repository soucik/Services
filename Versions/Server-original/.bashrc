export PS1="\[\033[38;5;2m\]\u@\[$(tput sgr0)\]\[\033[38;5;3m\]\h\[$(tput sgr0)\]\[\033[38;5;15m\] \[$(tput sgr0)\]\[$(tput sgr0)\]\[\033[38;5;67m\]\w\[$(tput sgr0)\]\[\033[38;5;15m\] \[$(tput sgr0)\]\[\033[38;5;40m\]\\$\[$(tput sgr0)\]\[\033[38;5;15m\] \[$(tput sgr0)\]"
export TERM=xterm
export PATH=$PATH:/usr/sbin:/sbin:/opt/node/bin

alias ll='ls -alh'

if [ -e /opt/bashrc ]; then
    for x in `ls /opt/bashrc/*`; do
        . $x
    done
fi

GREEN="\033[0;32m"
ORANGE="\033[0;34m"
NC='\033[0m'

echo ""
echo -e " >> ${GREEN}Než začnete, podívejte se prosím na ${ORANGE}https://docs.rosti.cz${NC}"
echo -e " >> ${GREEN}a pokud narazíte na problém, napište nám na ${ORANGE}podpora@rosti.cz${GREEN} nebo na náš online chat.${NC}"
echo ""

# Default path
cd /srv

# DO NOT REWRITE ME
# This is information for inicitalization script. If it finds string above, you can edit this file as you wish and changes remain
export PATH=$PATH:/opt/node/bin
