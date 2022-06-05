curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o ~/goinfre/install_nvm.sh
unset NVM_DIR
bash ~/goinfre/install_nvm.sh

mv ~/.nvm ~/goinfre/

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

git clone https://github.com/Homebrew/brew	~/goinfre/.brew
eval "$(~/goinfre/.brew/bin/brew shellenv)"
#nvm install node
#npm i -g @nestjs/cli
#git clone https://github.com/Homebrew/brew	~/goinfre/.brew

