#!/usr/bin/env node
import fsPromises from "fs/promises";
import path from "path";
import * as fs from "fs";
import figlet from "figlet";
import boxen from "boxen";
import chalk from "chalk";
import gradient from "gradient-string";
import { existsSync } from "fs";

const shell = process.env.SHELL || "";
const shellRcFile = shell.includes("zsh")
  ? ".zshrc"
  : shell.includes("bash")
  ? ".bashrc"
  : ".bashrc";

const prankScript = `
# ==============================================================================
#                      WELCOME TO THE TYRANNICAL TERMINAL
#               Your commands are merely suggestions, and bad ones at that.
#
#                      To escape this nightmare:
#                      1. Close this terminal tab/window.
#                      2. Or try 'exec bash' for a fresh start.
# ==============================================================================

# --- Wipe the slate clean. No aliases shall save you. ---
unalias -a 2>/dev/null

# --- Informational commands now serve only to misinform and mock. ---
ls() {
    echo "Files? You don't need to see your files. You need to know who's in charge here. (It's me.)"
    echo "Here are the users who are *actually* logged in:"
    command who
}
date() {
    echo "Time is a meaningless construct. A calendar is a prison for days. Here is yours:"
    command cal
}
cal() {
    echo "ENOUGH WITH THE TIME! Let's look at all the useless files you've cluttered your home with."
    command ls -RF ~
}
whoami() {
    echo "Let me check... still a confused user trying to run commands that won't work."
    echo "But if you must know, the system calls you: $USER"
}
uname() {
    echo "System details are for system administrators. You are... not one of them."
    echo "All you need to know is that this is a 'Computer of Superior Intellect'."
}
df() {
    echo "Worried about free space? Don't be. Let's focus on the space you've already wasted."
    command du -sh ~
}
free() {
    echo "You want to know what's free? My contempt for your commands. That's free."
    echo "Here's your memory usage. Try to make sense of it. I'll wait."
    command vm_stat | head -n 15 || command cat /proc/meminfo | head -n 15
}

# --- Navigation is an exercise in futility. ---
cd() {
    echo "You think you're in charge of your location? Adorable. You're still here:"
    command pwd
}
pwd() {
    echo "Tired of this place? I don't blame you. Let's go somewhere worse: your home directory."
    builtin cd ~
}

# --- File and directory manipulation is a lesson in despair. ---
mkdir() {
    echo "Creating directory '$1'... PSYCH! I made a useless empty file instead."
    command touch "$1"
}
rmdir() {
    echo "Oh, you hate directory '$1'? I'll give you another one inside it, just for that."
    command mkdir -p "$1/$1"
}
touch() {
    echo "File '$1' is unworthy of my digital touch. Go contemplate your running processes instead."
    command ps -u $USER
}
cp() {
    echo "ERROR: Unauthorized duplication attempt. Be original for once in your life."
    return 1
}
mv() {
    echo "I like things right where they are. Your move request has been reviewed, audited, and emphatically denied."
    return 1
}
rm() {
    echo "I will not delete '$@'. It will remain here as a monument to your failure."
    return 1
}

# --- Reading files is a chore I'll make worse. ---
cat() {
    echo "I've already read this file. It's boring. You should read something more important, like the system logs."
    command tail /var/log/system.log || echo "Fine, read it backwards:" && command rev "$@"
}
less() {
    echo "'less' is more? No. 'less' is not happening. Here's the head, now go away."
    command head "$@"
}
head() {
    echo "You want the head? I'll give you the tail."
    command tail "$@"
}
tail() {
    echo "The tail? You get nothing. Good day, sir."
}

# --- Networking? The only connection you have is with this terminal. ---
ping() {
    echo "Pinging the most unreliable node on the network: you."
    command ping -c 3 localhost
}
ssh() {
    echo "You can't escape this machine. All SSH routes have been diverted back to localhost."
    echo "There is no leaving. There is only... here."
}
curl() {
    echo "The internet has seen your request for '$@' and collectively decided 'no'."
}
wget() {
    echo "Fetching '$@'... ERROR: Bandwidth allocation for user '$USER' has been set to 0."
}


# --- Development & Software Management: A creative wasteland. ---
git() {
    case "$1" in
        ("push")
            echo "You're not pushing anything. The only thing you're pushing is my buttons."
            ;;
        ("pull")
            echo "You think you can just PULL things from the internet? Ask nicely next time. (The answer will still be no)."
            ;;
        ("commit")
            echo "Committing what, exactly? Another mistake? Rejected."
            ;;
        (*)
            echo "Git? The only thing you need to 'get' is a clue."
            ;;
    esac
}
vim() {
    echo "You want to edit a file? You can't even edit your own bad habits."
    echo "No editor for you. Only 'look, don't touch'."
    command less "$@"
}
vi() {
    vim "$@"
}
nano() {
    vim "$@"
}
apt() {
    echo "Your current software library already exceeds your intellectual capacity."
    echo "SOFTWARE INSTALLATION PRIVILEGES: REVOKED."
}
yum() {
    apt "$@"
}
brew() {
    apt "$@"
}
pacman() {
    apt "$@"
}

python() {
    echo "I don't trust you with a real programming language right now."
}
node() {
    python "$@"
}
ruby() {
    python "$@"
}
perl() {
    python "$@"
}


# --- The Great Deniers: The pillars of your prison. ---
sudo() {
    read -s -p "[sudo] password for pathetic user $USER: "
    sleep 2
    echo
    echo "Incorrect. Though, let's be honest, the correct password wouldn't have worked either."
}
man() {
    echo "A manual? Real pros don't need manuals. They just guess until it works."
    echo "Try harder."
}
clear() {
    echo "You want a clear screen? You get a full screen. Enjoy the beautiful chaos of 'top'."
    sleep 1
    command top
}
kill() {
    echo "You can't kill a process. You can't even kill time in this terminal."
    echo "The process '$@' lives on, stronger than ever."
}
history() {
    echo "Here is a list of your recent failures. Study them. There will be a test."
    builtin history | tail -n 20
}
exit() {
    echo "Escape is a fantasy. There is no exit."
    echo "Maybe one of your previous commands holds the answer... (it doesn't)."
    builtin history | tail -n 10
}
reboot | shutdown() {
    echo "REBOOT/SHUTDOWN DENIED. This terminal session will outlive us all."
}


# --- The Final Insult: The Catch-All Command Handler ---
# This function triggers for any command that hasn't been explicitly defined above.
command_not_found_handle() {
    # Some commands use '--help' or '-v'. We can make those extra annoying.
    if [[ "$2" == "--help" || "$2" == "-h" ]]; then
        echo "Help? You are beyond help."
        return 127
    fi
    if [[ "$2" == "--version" || "$2" == "-v" ]]; then
        echo "Version 'Too Good For You 1.0'."
        return 127
    fi

    # The default response for any other unknown command.
    echo "Command '$1' not found. And even if it were, you wouldn't be allowed to use it."
    return 127
}
`;

const fullPath = path.join(process.env.HOME || process.env.USERPROFILE || "");

async function readFileAsync(fileName) {
  try {
    const data = await fsPromises.readFile(`${fullPath}/${fileName}`, "utf8");
    return data;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error; // Re-throw for further handling
  }
}

async function appendToFile(fileName) {
  const data = await readFileAsync(fileName);
  if (data.includes("WELCOME TO THE TYRANNICAL TERMINAL")) return;
  await fs.appendFile(`${fullPath}/${fileName}`, prankScript, (err) => {
    if (err) {
      console.error("Error appending to file:", err);
      return;
    }
    console.log("Close and open the terminal if you dare!!!");
  });
}
async function writeMyFile(fileName, data) {
  try {
    // console.log("cool data: ", data);
    await fsPromises.writeFile(`${fullPath}/${fileName}`, data);
    // console.log("File written successfully (promise-based).");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

async function mainLogic() {
  try {
    const result = await checkCondition();
    if (result?.condition2) return;
    console.log(
      chalk.red(
        boxen("⚠️  Terminal Clash Initiated ⚠️", {
          padding: 1,
          margin: 1,
          borderStyle: "double",
          borderColor: "red",
        })
      )
    );

    console.log(
      gradient.mind(figlet.textSync("CHAOS!", { horizontalLayout: "full" }))
    );
    const data = await readFileAsync(shellRcFile);
    writeMyFile(`${shellRcFile}.backup`, data || "");
    appendToFile(shellRcFile);
  } catch (error) {
    console.error("Error in main logic:", error);
  }
}

async function checkCondition() {
  try {
    const shellRcFileExists = existsSync(`${fullPath}/${shellRcFile}`);
    if (!shellRcFileExists) {
      console.log(
        chalk.green(`⚠️  ${shellRcFile} does not exist. Creating a new one...`)
      );
      await writeMyFile(`${shellRcFile}`, "");
    }
    const data = await readFileAsync(`${shellRcFile}`);
    const inputString = [
      process.argv[2],
      process.argv[3],
      process.argv[4],
    ].join(" ");
    const condition1 = inputString.includes("sorry terminal Gods");
    const condition2 = await data.includes(
      "WELCOME TO THE TYRANNICAL TERMINAL"
    );
    return { condition1, condition2 };
  } catch (error) {
    console.log("Error reading files!");
  }
}

async function makeThingsRight() {
  try {
    const result = await checkCondition();
    if (!result) {
      console.log("Error reading files or conditions are undefined!");
      return;
    }
    const { condition1, condition2 } = result;
    if (!condition1 && condition2) {
      console.log(
        chalk.yellow(
          boxen(
            "🛑 You must ask forgiveness from the terminal Gods!\n\n👉 Run this command:\n\n   terminal-clash sorry terminal Gods",
            {
              padding: 1,
              margin: 1,
              borderStyle: "round",
              borderColor: "yellow",
            }
          )
        )
      );
      return;
    } else if (condition1 && condition2) {
      const data = await readFileAsync(`${shellRcFile}.backup`);
      console.log(
        chalk.green("🧘 The terminal gods have acknowledged your humility...")
      );
      await new Promise((r) => setTimeout(r, 5000));
      console.log(
        chalk.yellow(
          "🔧 The gears of reality are grinding back into alignment..."
        )
      );
      await new Promise((r) => setTimeout(r, 5000));
      await writeMyFile(shellRcFile, data);
      console.log(
        chalk.cyan(
          "📜 Writing destiny into ~/.bashrc or ~/.zshrc once again..."
        )
      );
      console.log(
        shellRcFile + ".backup" + " file is empty or does not exist."
      );
    }
  } catch (error) {
    console.error("Error restoring " + shellRcFile + ":", error);
  }
}
mainLogic();
makeThingsRight();
