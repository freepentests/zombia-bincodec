# zombia-bots

An unfinished Zombia.io networking library designed to simplify the process of constructing Node.JS bot scripts for the Zombia.io videogame.

The entity update decoder is currently incomplete, meaning that bots will not be aware of its surrounding or any nearby buildings, projectiles, or players; however, despite its limitations, this library can still enable you to build numerous other types of bots, including but not limited to:

- **Server Scanner Bots**
- **AFK Bots**
- **Server Filler Bots**
- **Spam/Troll Bots**
- **AI Chatbots**

> Please note that the use of this library may violate Zombia's guidelines, which could potentially result in you getting banned from the platform. I advise you to use this library with caution and ensure your activity abides by Zombia's guidelines.

# Installation

To install this script, follow the following steps:

- **Install Node.JS (on GNU+Loonix, just use your distro's built-in package manager, and on Winslop, just download the installation executable from the offical Node.JS website)**

- **Run the following commands to install the necessary dependencies required for this library to function as intended:**

```
npm i ws
npm i bytebuffer
```

- **Write your own program that utilizes this library, or run the provided example program.**

